export type AdminStatus = 'active' | 'pending' | 'suspended'
export type RiskTier = 'low' | 'med' | 'high' | 'critical'

export interface Permission {
  id: string
  domain: string
  label: string
  desc: string
  tier: RiskTier
}

export interface Role {
  id: string
  title: string
  short: string
  color: string
  perms: string[]
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  joined: string
  last: string
  mfa: boolean
  status: AdminStatus
  overrides: Record<string, boolean>
  overrideMeta?: Record<string, { reason: string; expiry: string | null; by: string; at: string }>
}

export interface AuditEntry {
  id: string
  at: string
  who: string
  role: string
  action: string
  target: string
  tier: RiskTier
}

export interface SampleAgent {
  id: string
  name: string
  role: string
  status: 'deployed' | 'bench' | 'assess' | 'recruit'
  client: string
  score: number
  certs: number
  years: number
  langs: string[]
  skills: string[]
  rate: number
  photo?: string
}

/**
 * Row shape for the admin agent directory, backed by the live API.
 * Identity fields (id, name, email, status, joined, photo) are real; the
 * remaining fields fall back to deterministic fixture enrichment until the
 * backend exposes them (see src/lib/data/agent-enrichment.ts).
 */
export type DirectoryStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING'

export interface DirectoryAgent {
  id: string
  name: string
  email: string
  status: DirectoryStatus
  /** ISO date the account was created. */
  joined: string
  photo?: string
  role: string
  client: string
  score: number
  certs: number
  langs: string[]
  skills: string[]
  rate: number
}

export interface DirectoryMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AgentIntake {
  experience?: string
  availability?: string
  employed?: string
  lateHours?: string
  device?: string
  phoneModel?: string
  internet?: string
  desiredSalary?: string
  freelance?: string
  cvUrl?: string
}

export interface AgentProfileExtras {
  headline: string
  photo?: string
  video?: string
  /** voca.ro recording id, e.g. "1g9Su6PRq1wg" — rendered as a Vocaroo embed */
  vocaroo?: string
  /** Non-Vocaroo intro recording link (Loom, Drive, etc.) — rendered as a link */
  introUrl?: string
  /** Real candidate-intake answers from the SDR application form */
  intake?: AgentIntake
  pitch: string
  location: string
  timezone: string
  hours: string
  email: string
  phone: string
  employer: string
  contractType: string
  payRate: string
  billRate: string
  margin: string
  started: string
  deployedSince: string
  csat: number | null
  aht: string | null
  qa: number
  tools: string[]
  education: string
  certifications: { t: string; d: string }[]
  history: { co: string; role: string; when: string; current?: boolean }[]
  notes: { who: string; when: string; body: string }[]
}
