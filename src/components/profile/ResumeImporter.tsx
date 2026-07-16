'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { Chip } from '@/components/ui/Chip'
import { SectionCard } from '@/components/ui/SectionCard'

// ── Parsed resume shape ──────────────────────────────────────────────────────

interface WorkEntry {
  title?: string
  role?: string
  position?: string
  company?: string
  employer?: string
  organization?: string
  period?: string
  duration?: string
  dates?: string
  description?: string
  summary?: string
}

interface EducationEntry {
  school?: string
  institution?: string
  university?: string
  degree?: string
  qualification?: string
  gpa?: string
  grade?: string
  year?: string | number
  graduationYear?: string | number
}

interface CertEntry {
  name?: string
  title?: string
  certification?: string
  issuer?: string
  issuingOrg?: string
  organization?: string
  date?: string
  year?: string
}

export interface ParsedResume {
  workHistory: WorkEntry[]
  education: EducationEntry[]
  skills: string[]
  certifications: CertEntry[]
  /** Raw top-level fields from the response, for display */
  rawFields: { field: string; value: string }[]
}

/** Extracts an array from data using multiple possible key names. */
function pickArray(data: Record<string, unknown>, ...keys: string[]): unknown[] {
  for (const k of keys) {
    const v = data[k]
    if (Array.isArray(v) && v.length > 0) return v as unknown[]
  }
  return []
}

/** Extracts a string array (skills list) from data. */
function pickStringArray(data: Record<string, unknown>, ...keys: string[]): string[] {
  for (const k of keys) {
    const v = data[k]
    if (Array.isArray(v) && typeof v[0] === 'string') return v as string[]
    if (typeof v === 'string' && v.trim()) return v.split(/,\s*/)
  }
  return []
}

/**
 * Robustly maps whatever the resume-parse endpoint returns to a normalized
 * ParsedResume shape. The backend may return the parsed data inside `data`,
 * `parsedData`, `resume`, or directly at root. Field names vary by version.
 */
export function parseResumeResponse(raw: unknown): ParsedResume {
  if (!raw || typeof raw !== 'object') return emptyParsed()

  // Unwrap common envelope shapes
  let d = raw as Record<string, unknown>
  if (typeof d.data === 'object' && d.data !== null) d = d.data as Record<string, unknown>
  else if (typeof d.parsedData === 'object' && d.parsedData !== null)
    d = d.parsedData as Record<string, unknown>
  else if (typeof d.resume === 'object' && d.resume !== null)
    d = d.resume as Record<string, unknown>

  const workHistory = pickArray(
    d,
    'workHistory',
    'work_history',
    'experience',
    'employment',
    'jobs',
    'positions',
    'workExperience',
    'work_experience',
  ) as WorkEntry[]

  const education = pickArray(
    d,
    'education',
    'educational_background',
    'schools',
    'educationalBackground',
    'degrees',
  ) as EducationEntry[]

  const skills = pickStringArray(
    d,
    'skills',
    'skill_list',
    'extractedSkills',
    'technical_skills',
    'technicalSkills',
    'softSkills',
    'allSkills',
    'skillsExtracted',
  )

  const certifications = pickArray(
    d,
    'certifications',
    'certs',
    'certificates',
    'credentials',
    'qualifications',
    'externalCertifications',
  ) as CertEntry[]

  // Build a display list of top-level scalar fields for the card
  const rawFields: { field: string; value: string }[] = []
  const shown = new Set([
    'workHistory',
    'work_history',
    'experience',
    'employment',
    'education',
    'educational_background',
    'skills',
    'skill_list',
    'certifications',
    'certs',
    'parsedData',
    'data',
    'resume',
    'success',
    'message',
  ])
  for (const [k, v] of Object.entries(d)) {
    if (shown.has(k)) continue
    if (typeof v === 'string' && v.trim()) rawFields.push({ field: k, value: v })
    else if (typeof v === 'number') rawFields.push({ field: k, value: String(v) })
  }

  return { workHistory, education, skills, certifications, rawFields }
}

function emptyParsed(): ParsedResume {
  return { workHistory: [], education: [], skills: [], certifications: [], rawFields: [] }
}

// ── Helper: label from entry ─────────────────────────────────────────────────

function workLabel(w: WorkEntry) {
  return w.title ?? w.role ?? w.position ?? 'Position'
}
function workCompany(w: WorkEntry) {
  return w.company ?? w.employer ?? w.organization ?? ''
}
function workPeriod(w: WorkEntry) {
  return w.period ?? w.duration ?? w.dates ?? ''
}
function eduSchool(e: EducationEntry) {
  return e.school ?? e.institution ?? e.university ?? 'School'
}
function eduDegree(e: EducationEntry) {
  return e.degree ?? e.qualification ?? ''
}
function certName(c: CertEntry) {
  return c.name ?? c.title ?? c.certification ?? 'Certificate'
}
function certIssuer(c: CertEntry) {
  return c.issuer ?? c.issuingOrg ?? c.organization ?? ''
}

// ── Summary counts for the success banner ────────────────────────────────────

function countFields(parsed: ParsedResume) {
  let n = 0
  if (parsed.workHistory.length) n++
  if (parsed.education.length) n++
  if (parsed.skills.length) n++
  if (parsed.certifications.length) n++
  n += Math.min(parsed.rawFields.length, 4)
  return n
}

// ── Component ────────────────────────────────────────────────────────────────

type ParseState = 'idle' | 'parsing' | 'done' | 'error'

export function ResumeImporter() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [state, setState] = useState<ParseState>('idle')
  const [progress, setProgress] = useState(0)
  const [parsed, setParsed] = useState<ParsedResume | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [fileName, setFileName] = useState('')
  const [applying, setApplying] = useState(false)

  const reset = () => {
    setState('idle')
    setParsed(null)
    setErrorMsg('')
    setFileName('')
    setProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleFile = async (file: File | undefined | null) => {
    if (!file) return
    setFileName(file.name)
    setState('parsing')
    setProgress(0)
    setErrorMsg('')

    // Animate progress bar while the upload is in flight
    const tick = setInterval(() => {
      setProgress((p) => (p < 85 ? p + 3 : p))
    }, 400)

    try {
      const body = new FormData()
      body.append('resume', file)
      const res = await fetch('/api/resume/upload', { method: 'POST', body })
      const json = (await res.json()) as unknown
      clearInterval(tick)

      if (!res.ok) {
        const msg =
          (json && typeof json === 'object' && 'error' in json
            ? (json as { error: string }).error
            : null) ?? `Parse failed (HTTP ${res.status})`
        setErrorMsg(msg)
        setState('error')
        return
      }

      const result = parseResumeResponse(json)
      setProgress(100)
      setParsed(result)
      setState('done')
    } catch {
      clearInterval(tick)
      setErrorMsg('Could not reach the server. Check your connection and try again.')
      setState('error')
    }
  }

  const handleApprove = async () => {
    setApplying(true)
    // Data was already persisted by the backend on upload; just refresh the page
    // so the profile sections re-render with the newly populated fields.
    router.refresh()
  }

  return (
    <SectionCard title="Resume import" action={<Chip className="text-[10px]">AI-powered</Chip>}>
      {/* Idle — drop zone */}
      {state === 'idle' && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setDrag(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            setDrag(false)
            void handleFile(e.dataTransfer?.files?.[0])
          }}
          className={`flex w-full cursor-pointer items-center gap-3.5 rounded-md border-[1.5px] border-dashed p-4 text-left transition-colors ${
            drag
              ? 'border-rc-blue bg-rc-blue/5'
              : 'border-rc-line bg-rc-paper-2 hover:border-rc-blue hover:bg-rc-blue/5'
          }`}
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md"
            style={{ background: 'linear-gradient(135deg, var(--rc-blue), var(--rc-blue-soft))' }}
          >
            <Icon name="upload" size={20} color="#fff" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-rc-ink">
              Upload your resume (PDF or DOCX)
            </p>
            <p className="mt-0.5 text-[12px] text-rc-muted">
              AI will auto-fill work history, education, skills, and certifications.
            </p>
          </div>
          <span className="shrink-0 rounded-md bg-rc-ink px-3 py-2 text-[12px] font-medium text-rc-paper">
            Choose file
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        hidden
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      {/* Parsing — progress */}
      {state === 'parsing' && (
        <div className="rounded-md border border-rc-line bg-rc-paper-2 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-rc-blue/10">
              <Icon name="bolt" size={15} color="var(--rc-blue)" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-rc-ink">Parsing {fileName || 'resume'}…</p>
              <p className="mt-0.5 text-[11px] text-rc-muted">
                Extracting work history · education · skills · certifications
              </p>
            </div>
            <span className="font-mono text-[12px] text-rc-blue">{progress}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-rc-line">
            <div
              className="h-full transition-[width] duration-300"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--rc-blue), var(--rc-blue-soft))',
              }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {state === 'error' && (
        <div className="rounded-md border border-rc-bad/20 bg-rc-bad/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Icon name="alertCircle" size={15} color="var(--rc-bad)" />
            <span className="text-[13px] font-semibold text-rc-bad">Parse failed</span>
          </div>
          <p className="mb-3 text-[13px] text-rc-muted">{errorMsg}</p>
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer rounded-md border border-rc-line bg-white px-3 py-2 text-[12px] font-medium text-rc-ink transition-colors hover:bg-rc-paper-2"
          >
            Try again
          </button>
        </div>
      )}

      {/* Done — extracted fields */}
      {state === 'done' && parsed && (
        <div className="rounded-md border border-rc-line bg-rc-paper-2 p-4">
          {/* Success header */}
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rc-good">
              <Icon name="check" size={13} color="#fff" />
            </div>
            <span className="text-[13px] font-semibold text-rc-ink">Resume parsed</span>
            <Chip variant="good" className="ml-auto text-[10px]">
              {countFields(parsed)} sections extracted
            </Chip>
          </div>

          {/* Work history */}
          {parsed.workHistory.length > 0 && (
            <div className="mb-3 border-t border-rc-line pt-3">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-rc-muted-d">
                Work history · {parsed.workHistory.length} found
              </p>
              {parsed.workHistory.slice(0, 3).map((w, i) => (
                <div key={i} className="mb-1.5 last:mb-0">
                  <span className="text-[13px] font-medium text-rc-ink">{workLabel(w)}</span>
                  {workCompany(w) && (
                    <span className="ml-1.5 text-[12px] text-rc-muted">· {workCompany(w)}</span>
                  )}
                  {workPeriod(w) && (
                    <span className="ml-1.5 text-[11px] text-rc-muted-d">{workPeriod(w)}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {parsed.education.length > 0 && (
            <div className="mb-3 border-t border-rc-line pt-3">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-rc-muted-d">
                Education · {parsed.education.length} found
              </p>
              {parsed.education.slice(0, 2).map((e, i) => (
                <div key={i} className="mb-1 last:mb-0">
                  <span className="text-[13px] font-medium text-rc-ink">{eduSchool(e)}</span>
                  {eduDegree(e) && (
                    <span className="ml-1.5 text-[12px] text-rc-muted">· {eduDegree(e)}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {parsed.skills.length > 0 && (
            <div className="mb-3 border-t border-rc-line pt-3">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-rc-muted-d">
                Skills · {parsed.skills.length} extracted
              </p>
              <div className="flex flex-wrap gap-1">
                {parsed.skills.slice(0, 12).map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-rc-line bg-white px-2 py-0.5 text-[11px] text-rc-ink"
                  >
                    {s}
                  </span>
                ))}
                {parsed.skills.length > 12 && (
                  <span className="text-[11px] text-rc-muted">
                    +{parsed.skills.length - 12} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Certifications */}
          {parsed.certifications.length > 0 && (
            <div className="mb-3 border-t border-rc-line pt-3">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-rc-muted-d">
                Certifications · {parsed.certifications.length} found
              </p>
              {parsed.certifications.slice(0, 3).map((c, i) => (
                <div key={i} className="mb-1 last:mb-0">
                  <span className="text-[13px] font-medium text-rc-ink">{certName(c)}</span>
                  {certIssuer(c) && (
                    <span className="ml-1.5 text-[12px] text-rc-muted">· {certIssuer(c)}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Any extra scalar fields */}
          {parsed.rawFields.length > 0 && (
            <div className="border-t border-rc-line pt-3">
              {parsed.rawFields.slice(0, 4).map(({ field, value }) => (
                <div key={field} className="flex items-baseline gap-2 py-0.5">
                  <span className="w-28 shrink-0 text-[11px] font-semibold uppercase tracking-[0.06em] text-rc-muted-d">
                    {field}
                  </span>
                  <span className="text-[13px] text-rc-ink">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex gap-2 border-t border-rc-line pt-3">
            <button
              type="button"
              onClick={reset}
              className="cursor-pointer rounded-md border border-rc-line bg-white px-3 py-2 text-[12px] font-medium text-rc-ink transition-colors hover:bg-rc-paper-2"
            >
              Replace file
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={applying}
              className="flex-1 cursor-pointer rounded-md bg-rc-ink px-3 py-2 text-[12px] font-medium text-rc-paper transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {applying ? 'Refreshing profile…' : 'Apply to profile'}
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  )
}
