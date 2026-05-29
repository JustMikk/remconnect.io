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

export interface AgentProfileExtras {
  headline: string
  photo?: string
  video?: string
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
