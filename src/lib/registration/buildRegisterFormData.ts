import {
  EMP_TYPE_MAP,
  GENDER_MAP,
  PROFICIENCY_MAP,
  REMOTE_SETUP_GROUP_KEYS,
  REMOTE_SETUP_GROUPS,
  REMOTE_SETUP_SLUGS,
  type Cert,
  type FormFields,
  type Lang,
  type OnboardingFiles,
  type RolePick,
} from '@/components/onboarding/constants'

/**
 * Maps onboarding wizard state to the multipart body of
 * `POST /auth/register`. Pure — unit tested in buildRegisterFormData.test.ts.
 *
 * Array/object fields are JSON-stringified per the backend contract; UI labels
 * are translated to API enums via the maps in onboarding/constants.ts.
 */

export interface RegistrationInput {
  fields: FormFields
  roles: RolePick[]
  langs: Lang[]
  certs: Cert[]
  checks: string[]
  emp: string
  files: OnboardingFiles
  /** Role title → backend role UUID (empty when the catalog was unreachable). */
  roleIds: ReadonlyMap<string, string>
}

/** Normalizes Ethiopian phone input (9 local digits, 0-prefixed, or 251…) to E.164. */
export function normalizePhone(raw: string): string | undefined {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return undefined
  if (digits.startsWith('251')) return `+${digits}`
  if (digits.length === 10 && digits.startsWith('0')) return `+251${digits.slice(1)}`
  if (digits.length === 9) return `+251${digits}`
  return `+${digits}`
}

function setIfPresent(form: FormData, key: string, value: string | undefined | null) {
  if (value) form.set(key, value)
}

export function buildRegisterFormData(input: RegistrationInput): FormData {
  const { fields, roles, langs, certs, checks, emp, files, roleIds } = input
  const form = new FormData()

  // account + identity (required by the backend)
  form.set('email', fields.crEmail.trim())
  form.set('password', fields.crPass)
  form.set('firstName', fields.pFirst.trim())
  form.set('lastName', fields.pLast.trim())

  setIfPresent(form, 'middleName', fields.pMiddle.trim())
  setIfPresent(form, 'nickname', fields.pNickname.trim())
  setIfPresent(form, 'dateOfBirth', fields.pDob)
  setIfPresent(form, 'gender', GENDER_MAP[fields.pGender])
  setIfPresent(form, 'phone', normalizePhone(fields.cPhone))
  setIfPresent(form, 'city', fields.pCity.trim())
  setIfPresent(form, 'homeAddress', fields.pAddr.trim())
  setIfPresent(form, 'linkedinUrl', fields.aLinkedin.trim())
  setIfPresent(form, 'hearAboutUs', fields.aHear)
  setIfPresent(form, 'employmentType', EMP_TYPE_MAP[emp])

  const salary = fields.aSalary.replace(/\D/g, '')
  setIfPresent(form, 'expectedSalaryEtb', salary)

  // desired roles — union of the signup role and wizard picks, resolved to UUIDs.
  // Omitted entirely when the catalog was unavailable (the field is optional).
  const roleTitles = [fields.crRole, ...roles.map((r) => r.r)].filter(Boolean)
  const desiredRoleIds = [...new Set(roleTitles.map((t) => roleIds.get(t)).filter(Boolean))]
  if (desiredRoleIds.length > 0) form.set('desiredRoleIds', JSON.stringify(desiredRoleIds))

  const languages = langs
    .filter((l) => l.l.trim())
    .map((l) => ({ language: l.l.trim(), proficiency: PROFICIENCY_MAP[l.p] ?? l.p.toUpperCase() }))
  if (languages.length > 0) form.set('languages', JSON.stringify(languages))

  const certifications = certs
    .filter((c) => c.name.trim())
    .map((c) => ({
      name: c.name.trim(),
      ...(c.org.trim() && { issuingOrg: c.org.trim() }),
      ...(c.earned && { dateEarned: c.earned }),
      ...(c.expiry && { expiryDate: c.expiry }),
      ...(c.url.trim() && { certificateUrl: c.url.trim() }),
    }))
  if (certifications.length > 0) form.set('certifications', JSON.stringify(certifications))

  // remote setup — bucket checked labels into their group's JSON key
  const remoteSetup: Record<string, string[] | string> = {}
  for (const group of REMOTE_SETUP_GROUPS) {
    const key = REMOTE_SETUP_GROUP_KEYS[group.gh]
    const items = group.items
      .filter((label) => checks.includes(label))
      .map((label) => REMOTE_SETUP_SLUGS[label] ?? label)
    if (key && items.length > 0) remoteSetup[key] = items
  }
  if (fields.netSpeed) remoteSetup.internetSpeed = fields.netSpeed
  if (Object.keys(remoteSetup).length > 0) form.set('remoteSetup', JSON.stringify(remoteSetup))

  // files — avatar and introVideo are required by the backend; the wizard
  // validates their presence before submit. The resume is intentionally NOT
  // sent here: `/auth/register` ignores it ("you can upload a resume later"),
  // so it is uploaded separately to `/resume/upload` after the session is
  // established (see OnboardingContext.submit), which stores AND parses it.
  if (files.avatar) form.set('avatar', files.avatar)
  if (files.introVideo) form.set('introVideo', files.introVideo)

  return form
}
