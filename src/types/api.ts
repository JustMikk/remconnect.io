/**
 * Wire types for the RemConnect backend API.
 *
 * These mirror the LIVE response shapes (probed 2026-06-12), which differ from
 * the published OpenAPI doc in places: token fields come back flat
 * (`{ user, accessToken, refreshToken }`, no `expiresIn`), `GET /agents`
 * returns a plain array (pagination params are currently ignored), and the
 * validation `errors` field is a `{ field: [messages] }` map, not an array.
 */

export type UserRole = 'AGENT' | 'RECRUITER' | 'OPS' | 'CLIENT' | 'ADMIN'

/** Roles allowed into the /admin area. */
export const STAFF_ROLES: readonly UserRole[] = ['RECRUITER', 'OPS', 'ADMIN']

/** Standard response envelope. `data` is absent on errors. */
export interface ApiEnvelope<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export interface AuthPayload extends TokenPair {
  user: ApiUser
}

export interface ApiLanguage {
  language: string
  proficiency: string
}

export interface ApiCertification {
  id?: string
  name: string
  issuingOrg?: string | null
  dateEarned?: string | null
  expiryDate?: string | null
  certificateUrl?: string | null
  isInternalCert?: boolean
}

export interface ApiRemoteSetup {
  connectivity?: string[]
  hardware?: string[]
  powerBackup?: string[]
  internetSpeed?: string | null
}

export interface ApiAgentSkillsProfile {
  skills?: string[]
  totalExperienceYears?: number | null
  englishLevel?: string | null
  nativeLanguage?: string | null
}

/** Nested agent application data on a user record. */
export interface ApiAgentProfile {
  id: string
  nickname?: string | null
  city?: string | null
  bio?: string | null
  linkedinUrl?: string | null
  homeAddress?: string | null
  cvUrl?: string | null
  introVideoUrl?: string | null
  employmentType?: string | null
  expectedSalaryEtb?: string | null
  hearAboutUs?: string | null
  desiredRoleIds?: string[]
  primaryRoleId?: string | null
  supplementaryRoleIds?: string[]
  workingHours?: string | null
  appliedAt?: string | null
  profile?: ApiAgentSkillsProfile | null
  languages?: ApiLanguage[]
  externalCertifications?: ApiCertification[]
  remoteSetup?: ApiRemoteSetup | null
}

export interface ApiUser {
  id: string
  email: string
  /** Present on /auth/me and login responses; absent on /agents list items. */
  role?: UserRole
  fullName: string | null
  firstName?: string | null
  middleName?: string | null
  lastName?: string | null
  dateOfBirth?: string | null
  gender?: string | null
  phone?: string | null
  avatarUrl?: string | null
  isActive: boolean
  createdAt: string
  agent?: ApiAgentProfile | null
}

export interface ApiRole {
  id: string
  title: string
  description: string | null
  assessment?: string | null
}

export interface ApiRoleCategory {
  id: string
  name: string
  slug: string
  roles: ApiRole[]
}

export interface ApiLeadSummary {
  id: string
  companyName: string
  repName: string
  email: string
  servicesNeeded: string[]
  status: string
  createdAt: string
}

export interface ApiLeadDetail extends ApiLeadSummary {
  foundedYear?: number | null
  companySize?: number | null
  website?: string | null
  additionalNotes?: string | null
  muxPlaybackUrl?: string | null
  aiCallScript?: string | null
}

export interface ApiLeadPermission {
  userId: string
  grantedAt: string
}
