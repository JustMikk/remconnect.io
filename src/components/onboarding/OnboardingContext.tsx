'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  EMAIL_RE,
  URL_RE,
  ROLE_GROUPS,
  TOTAL_STEPS,
  type Cert,
  type FormFields,
  type Lang,
  type OnboardingFiles,
  type RolePick,
  type Screen,
} from './constants'
import { buildRegisterFormData } from '@/lib/registration/buildRegisterFormData'
import { establishSessionAction } from '@/app/apply/actions'
import type { ApiRoleCategory, TokenPair } from '@/types/api'

const STORE_KEY = 'rc_onboarding_v1'

const EMPTY_FIELDS: FormFields = {
  crEmail: '',
  crPass: '',
  crPass2: '',
  crRole: '',
  lgEmail: '',
  lgPass: '',
  pFirst: '',
  pMiddle: '',
  pLast: '',
  pNickname: '',
  pDob: '',
  pGender: '',
  pCity: '',
  pAddr: '',
  cEmail: '',
  cPhone: '',
  netSpeed: '',
  aSalary: '',
  aHear: '',
  aLinkedin: '',
}

const EMPTY_FILES: OnboardingFiles = { avatar: null, introVideo: null, resume: null }

interface PersistShape {
  screen: Screen
  step: number
  fields: FormFields
  roles: RolePick[]
  langs: Lang[]
  certs: Cert[]
  checks: string[]
  emp: string
  parsed: boolean
  resumeName: string
  resumeSize: string
}

export interface SubmitError {
  code: 'EMAIL_TAKEN' | 'VALIDATION' | 'UNREACHABLE' | 'UNKNOWN'
  message: string
}

/** Shape of `data` in the live register/login responses (tokens come back flat). */
interface RegisterResponseData {
  accessToken?: string
  refreshToken?: string
  tokens?: TokenPair
}

interface OnboardingValue {
  // navigation
  screen: Screen
  step: number
  goScreen: (s: Screen) => void
  goStep: (n: number) => void
  next: () => void
  back: () => void
  // fields
  fields: FormFields
  setField: (key: keyof FormFields, value: string) => void
  // errors
  errors: Set<string>
  hasError: (key: string) => boolean
  clearError: (key: string) => void
  // languages
  langs: Lang[]
  addLang: () => void
  updateLang: (i: number, patch: Partial<Lang>) => void
  removeLang: (i: number) => void
  // roles
  roles: RolePick[]
  toggleRole: (r: string) => void
  setRoleExp: (r: string, exp: string) => void
  /** Role catalog (backend-driven, hardcoded fallback when unreachable). */
  roleGroups: { g: string; r: string[] }[]
  // certifications
  certs: Cert[]
  addCert: () => void
  updateCert: (id: number, patch: Partial<Cert>) => void
  removeCert: (id: number) => void
  // remote-setup checklist
  checks: Set<string>
  toggleCheck: (label: string) => void
  // employment type
  emp: string
  setEmp: (val: string) => void
  // files (avatar / intro video / resume — never persisted)
  files: OnboardingFiles
  setFile: (kind: keyof OnboardingFiles, file: File | null) => void
  // resume
  parsed: boolean
  parsing: boolean
  resumeName: string
  resumeSize: string
  startResume: (file: File) => void
  resetResume: () => void
  // validation
  validateCreate: () => boolean
  validateLogin: () => boolean
  validateStep: (n: number) => boolean
  // submission
  submitting: boolean
  submitError: SubmitError | null
  // verify/resend
  signupEmail: string
}

const Ctx = createContext<OnboardingValue | null>(null)

export function useOnboarding() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useOnboarding must be used within OnboardingProvider')
  return v
}

function focusField(key: string) {
  if (typeof document === 'undefined') return
  const el = document.getElementById(`ob-${key}`) as HTMLElement | null
  if (el) {
    try {
      el.focus({ preventScroll: false })
    } catch {
      /* noop */
    }
    el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }
}

export function OnboardingProvider({
  initialScreen,
  roleCategories,
  children,
}: {
  initialScreen?: Screen
  roleCategories?: ApiRoleCategory[]
  children: ReactNode
}) {
  const [screen, setScreen] = useState<Screen>(initialScreen ?? 'create')
  const [step, setStep] = useState(1)
  const [fields, setFields] = useState<FormFields>(EMPTY_FIELDS)
  const [roles, setRoles] = useState<RolePick[]>([])
  const [langs, setLangs] = useState<Lang[]>([
    { l: 'Amharic', p: 'Native' },
    { l: 'English', p: 'Fluent' },
  ])
  const [certs, setCerts] = useState<Cert[]>([])
  const [checks, setChecks] = useState<Set<string>>(new Set())
  const [emp, setEmpState] = useState('')
  const [files, setFiles] = useState<OnboardingFiles>(EMPTY_FILES)
  const [parsed, setParsed] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [resumeName, setResumeName] = useState('')
  const [resumeSize, setResumeSize] = useState('')
  const [errors, setErrors] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<SubmitError | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const certSeq = useRef(0)
  const parseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ---- backend role catalog (fallback to the hardcoded groups) ----
  const roleGroups = useMemo(() => {
    if (roleCategories && roleCategories.length > 0) {
      const groups = roleCategories
        .filter((c) => c.roles.length > 0)
        .map((c) => ({ g: c.name, r: c.roles.map((r) => r.title) }))
      if (groups.length > 0) return groups
    }
    return ROLE_GROUPS
  }, [roleCategories])

  const roleIds = useMemo(() => {
    const map = new Map<string, string>()
    roleCategories?.forEach((c) => c.roles.forEach((r) => map.set(r.title, r.id)))
    return map
  }, [roleCategories])

  // ---- hydrate from localStorage on mount ----
  /* eslint-disable react-hooks/set-state-in-effect --
     Restoring persisted form state requires a mount effect: localStorage is
     unavailable during SSR, so these setState calls cannot move to render. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY)
      if (raw) {
        const s = JSON.parse(raw) as Partial<PersistShape>
        if (s.fields) setFields({ ...EMPTY_FIELDS, ...s.fields })
        if (Array.isArray(s.roles)) setRoles(s.roles)
        if (Array.isArray(s.langs)) setLangs(s.langs)
        if (Array.isArray(s.certs)) {
          setCerts(s.certs)
          certSeq.current = s.certs.reduce((m, c) => Math.max(m, c.id), 0)
        }
        if (Array.isArray(s.checks)) setChecks(new Set(s.checks))
        if (typeof s.emp === 'string') setEmpState(s.emp)
        if (typeof s.parsed === 'boolean') setParsed(s.parsed)
        if (typeof s.resumeName === 'string') setResumeName(s.resumeName)
        if (typeof s.resumeSize === 'string') setResumeSize(s.resumeSize)
        if (typeof s.step === 'number') setStep(Math.min(s.step, TOTAL_STEPS))
        // Only restore a deep screen if the caller didn't force one and the
        // saved screen is the resumable wizard (never trap the user on success).
        if (!initialScreen && s.screen === 'wizard') setScreen('wizard')
      }
    } catch {
      /* ignore corrupt store */
    }
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  // ---- persist (debounced) whenever meaningful state changes ----
  useEffect(() => {
    if (!hydrated) return
    // A submitted application must not linger (or be restored) — drop the store.
    if (screen === 'success') {
      try {
        localStorage.removeItem(STORE_KEY)
      } catch {
        /* ignore */
      }
      return
    }
    const payload: PersistShape = {
      screen,
      step,
      fields,
      roles,
      langs,
      certs,
      checks: Array.from(checks),
      emp,
      parsed,
      resumeName,
      resumeSize,
    }
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(payload))
      } catch {
        /* quota / private mode — ignore */
      }
    }, 250)
    return () => clearTimeout(t)
  }, [
    hydrated,
    screen,
    step,
    fields,
    roles,
    langs,
    certs,
    checks,
    emp,
    parsed,
    resumeName,
    resumeSize,
  ])

  // ---- navigation ----
  const goScreen = useCallback((s: Screen) => {
    setScreen(s)
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }, [])

  const goStep = useCallback((n: number) => {
    setStep(n)
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }, [])

  // ---- field + error helpers ----
  const clearError = useCallback((key: string) => {
    setErrors((prev) => {
      if (!prev.has(key)) return prev
      const nx = new Set(prev)
      nx.delete(key)
      return nx
    })
  }, [])

  const setField = useCallback(
    (key: keyof FormFields, value: string) => {
      setFields((prev) => ({ ...prev, [key]: value }))
      clearError(key)
    },
    [clearError],
  )

  const hasError = useCallback((key: string) => errors.has(key), [errors])

  // ---- languages ----
  const addLang = useCallback(() => setLangs((p) => [...p, { l: '', p: 'Conversational' }]), [])
  const updateLang = useCallback(
    (i: number, patch: Partial<Lang>) =>
      setLangs((p) => p.map((row, idx) => (idx === i ? { ...row, ...patch } : row))),
    [],
  )
  const removeLang = useCallback(
    (i: number) => setLangs((p) => p.filter((_, idx) => idx !== i)),
    [],
  )

  // ---- roles ----
  const toggleRole = useCallback(
    (r: string) => {
      setRoles((p) => {
        const i = p.findIndex((x) => x.r === r)
        if (i > -1) return p.filter((x) => x.r !== r)
        return [...p, { r, exp: '' }]
      })
      clearError('roles')
    },
    [clearError],
  )
  const setRoleExp = useCallback(
    (r: string, exp: string) => {
      setRoles((p) => p.map((x) => (x.r === r ? { ...x, exp } : x)))
      clearError(`roleExp:${r}`)
    },
    [clearError],
  )

  // ---- certifications ----
  const addCert = useCallback(() => {
    certSeq.current += 1
    const id = certSeq.current
    setCerts((p) => [...p, { id, name: '', org: '', earned: '', expiry: '', url: '' }])
  }, [])
  const updateCert = useCallback(
    (id: number, patch: Partial<Cert>) =>
      setCerts((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c))),
    [],
  )
  const removeCert = useCallback((id: number) => setCerts((p) => p.filter((c) => c.id !== id)), [])

  // ---- checklist ----
  const toggleCheck = useCallback((label: string) => {
    setChecks((prev) => {
      const nx = new Set(prev)
      if (nx.has(label)) nx.delete(label)
      else nx.add(label)
      return nx
    })
  }, [])

  // ---- employment ----
  const setEmp = useCallback(
    (val: string) => {
      setEmpState(val)
      clearError('emp')
    },
    [clearError],
  )

  // ---- files ----
  const setFile = useCallback(
    (kind: keyof OnboardingFiles, file: File | null) => {
      setFiles((prev) => ({ ...prev, [kind]: file }))
      clearError(kind)
    },
    [clearError],
  )

  // ---- resume ----
  const resetResume = useCallback(() => {
    if (parseTimer.current) clearTimeout(parseTimer.current)
    setParsed(false)
    setParsing(false)
    setResumeName('')
    setResumeSize('')
    setFiles((prev) => ({ ...prev, resume: null }))
    clearError('resume')
  }, [clearError])

  const startResume = useCallback(
    (file: File) => {
      if (parseTimer.current) clearTimeout(parseTimer.current)
      setFiles((prev) => ({ ...prev, resume: file }))
      setResumeName(file.name)
      setResumeSize(`${(file.size / 1048576).toFixed(1)} MB`)
      setParsed(false)
      setParsing(false)
      clearError('resume')
    },
    [clearError],
  )

  useEffect(
    () => () => {
      if (parseTimer.current) clearTimeout(parseTimer.current)
    },
    [],
  )

  // ---- validation ----
  const applyErrors = useCallback((keys: string[], first?: string) => {
    setErrors(new Set(keys))
    if (first) setTimeout(() => focusField(first), 30)
  }, [])

  const validateCreate = useCallback(() => {
    const bad: string[] = []
    if (!EMAIL_RE.test(fields.crEmail.trim())) bad.push('crEmail')
    if (!(fields.crPass.length >= 8 && /\d/.test(fields.crPass))) bad.push('crPass')
    if (!fields.crPass2 || fields.crPass2 !== fields.crPass) bad.push('crPass2')
    if (!fields.crRole) bad.push('crRole')
    applyErrors(bad, bad[0])
    return bad.length === 0
  }, [fields, applyErrors])

  const validateLogin = useCallback(() => {
    const bad: string[] = []
    if (!EMAIL_RE.test(fields.lgEmail.trim())) bad.push('lgEmail')
    if (!fields.lgPass) bad.push('lgPass')
    applyErrors(bad, bad[0])
    return bad.length === 0
  }, [fields, applyErrors])

  const validateStep = useCallback(
    (n: number) => {
      const bad: string[] = []
      if (n === 1) {
        ;(['pFirst', 'pLast', 'pDob', 'pGender', 'pCity', 'pAddr'] as (keyof FormFields)[]).forEach(
          (k) => {
            if (!fields[k].trim()) bad.push(k)
          },
        )
      } else if (n === 2) {
        if (!EMAIL_RE.test(fields.cEmail.trim())) bad.push('cEmail')
        if (!/^\d{9}$/.test(fields.cPhone.replace(/\s/g, ''))) bad.push('cPhone')
      } else if (n === 3) {
        if (roles.length === 0) bad.push('roles')
      } else if (n === 4) {
        if (!files.avatar) bad.push('avatar')
        if (!files.introVideo) bad.push('introVideo')
      } else if (n === 5) {
        if (!fields.netSpeed) bad.push('netSpeed')
      } else if (n === 6) {
        if (!emp) bad.push('emp')
        if (!fields.aHear) bad.push('aHear')
        if (fields.aLinkedin.trim() && !URL_RE.test(fields.aLinkedin.trim())) bad.push('aLinkedin')
      }
      applyErrors(bad, bad[0])
      return bad.length === 0
    },
    [fields, roles, files, emp, applyErrors],
  )

  // ---- submission ----
  // The multipart payload (avatar + intro video) goes straight from the
  // browser to the backend — CORS is open there, and routing it through a
  // Next.js endpoint would hit serverless body-size limits. The returned
  // tokens are then stored as httpOnly cookies via a server action.
  const submit = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '')
      if (!base) {
        setSubmitError({ code: 'UNKNOWN', message: 'NEXT_PUBLIC_API_BASE_URL is not configured.' })
        return
      }

      const body = buildRegisterFormData({
        fields,
        roles,
        langs,
        certs,
        checks: Array.from(checks),
        emp,
        files,
        roleIds,
      })

      let res: Response
      try {
        res = await fetch(`${base}/auth/register`, { method: 'POST', body })
      } catch {
        setSubmitError({
          code: 'UNREACHABLE',
          message:
            'Could not reach the server — it may be waking up from idle. Please try again in a minute; your answers are saved.',
        })
        return
      }

      let envelope: {
        success?: boolean
        message?: string
        errors?: Record<string, string[]>
        data?: RegisterResponseData
      } = {}
      try {
        envelope = (await res.json()) as typeof envelope
      } catch {
        /* non-JSON response — handled below */
      }

      if (!res.ok || !envelope.success) {
        if (res.status === 409) {
          setSubmitError({
            code: 'EMAIL_TAKEN',
            message: envelope.message ?? 'This email already has an account.',
          })
        } else if (res.status === 422) {
          const detail = envelope.errors
            ? Object.entries(envelope.errors)
                .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
                .join(' · ')
            : ''
          setSubmitError({
            code: 'VALIDATION',
            message: detail || envelope.message || 'Some answers were rejected — please review.',
          })
        } else {
          setSubmitError({
            code: 'UNKNOWN',
            message:
              envelope.message ?? `Submission failed (HTTP ${res.status}). Please try again.`,
          })
        }
        return
      }

      // Live API returns tokens flat ({accessToken, refreshToken}); tolerate
      // the documented nested {tokens} shape too.
      const data = envelope.data
      const tokens =
        data?.tokens ??
        (data?.accessToken && data?.refreshToken
          ? { accessToken: data.accessToken, refreshToken: data.refreshToken }
          : null)
      if (tokens) {
        try {
          await establishSessionAction(tokens)
        } catch {
          /* session is best-effort — the application itself succeeded */
        }
      }

      try {
        localStorage.removeItem(STORE_KEY)
      } catch {
        /* ignore */
      }
      goScreen('success')
      setStep(1)
    } finally {
      setSubmitting(false)
    }
  }, [submitting, fields, roles, langs, certs, checks, emp, files, roleIds, goScreen])

  const next = useCallback(() => {
    if (!validateStep(step)) return
    if (step === TOTAL_STEPS) {
      void submit()
      return
    }
    goStep(step + 1)
  }, [step, validateStep, submit, goStep])

  const back = useCallback(() => {
    if (step > 1) goStep(step - 1)
  }, [step, goStep])

  const signupEmail = fields.crEmail.trim()

  const value = useMemo<OnboardingValue>(
    () => ({
      screen,
      step,
      goScreen,
      goStep,
      next,
      back,
      fields,
      setField,
      errors,
      hasError,
      clearError,
      langs,
      addLang,
      updateLang,
      removeLang,
      roles,
      toggleRole,
      setRoleExp,
      roleGroups,
      certs,
      addCert,
      updateCert,
      removeCert,
      checks,
      toggleCheck,
      emp,
      setEmp,
      files,
      setFile,
      parsed,
      parsing,
      resumeName,
      resumeSize,
      startResume,
      resetResume,
      validateCreate,
      validateLogin,
      validateStep,
      submitting,
      submitError,
      signupEmail,
    }),
    [
      screen,
      step,
      goScreen,
      goStep,
      next,
      back,
      fields,
      setField,
      errors,
      hasError,
      clearError,
      langs,
      addLang,
      updateLang,
      removeLang,
      roles,
      toggleRole,
      setRoleExp,
      roleGroups,
      certs,
      addCert,
      updateCert,
      removeCert,
      checks,
      toggleCheck,
      emp,
      setEmp,
      files,
      setFile,
      parsed,
      parsing,
      resumeName,
      resumeSize,
      startResume,
      resetResume,
      validateCreate,
      validateLogin,
      validateStep,
      submitting,
      submitError,
      signupEmail,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
