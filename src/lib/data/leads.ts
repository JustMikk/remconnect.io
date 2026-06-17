import 'server-only'
import { redirect } from 'next/navigation'
import { ApiError, apiFetch } from '@/lib/api/client'
import { getSession } from '@/lib/api/session'
import type { ApiLeadSummary, ApiLeadDetail, ApiLeadPermission } from '@/types/api'

export type LeadUrgency = 'urgent' | 'new'

/** Lead shape used by portal video-queue components. */
export interface PortalQueueLead {
  id: string
  name: string
  first: string
  company: string
  email: string
  services: string[]
  notes?: string
  aiCallScript?: string
  status: string
  submitted: string
  urgency: LeadUrgency
  tone: number
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AgentQueueResult {
  leads: PortalQueueLead[]
  meta: PaginationMeta
  noAccess?: boolean
  error?: string
}

export interface AdminLeadListResult {
  leads: ApiLeadSummary[]
  meta: PaginationMeta
  noAccess?: boolean
  error?: string
}

const EMPTY_META: PaginationMeta = { total: 0, page: 1, limit: 20, totalPages: 1 }

async function requireToken(): Promise<string> {
  const session = await getSession()
  if (!session) redirect('/login')
  return session.accessToken
}

function toneFromId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h % 6
}

function urgencyFromDate(createdAt: string): LeadUrgency {
  const hoursSince = (Date.now() - new Date(createdAt).getTime()) / 3_600_000
  return hoursSince < 4 ? 'urgent' : 'new'
}

function formatSubmitted(createdAt: string): string {
  const diffMs = Date.now() - new Date(createdAt).getTime()
  const m = Math.floor(diffMs / 60_000)
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hr ago`
  const d = Math.floor(h / 24)
  return d === 1 ? 'Yesterday' : `${d} days ago`
}

function toPortalQueueLead(s: ApiLeadSummary, detail?: ApiLeadDetail): PortalQueueLead {
  return {
    id: s.id,
    name: s.repName,
    first: s.repName.split(' ')[0] ?? s.repName,
    company: s.companyName,
    email: s.email,
    services: s.servicesNeeded,
    notes: detail?.additionalNotes ?? undefined,
    aiCallScript: detail?.aiCallScript ?? undefined,
    status: s.status,
    submitted: formatSubmitted(s.createdAt),
    urgency: urgencyFromDate(s.createdAt),
    tone: toneFromId(s.id),
  }
}

// ─── Agent queue (portal /video-queue) ───────────────────────────────────────

export async function getAgentLeadsQueue(page = 1): Promise<AgentQueueResult> {
  const token = await requireToken()
  try {
    const data = await apiFetch<{ leads: ApiLeadSummary[]; meta: PaginationMeta }>('/leads/queue', {
      token,
      searchParams: { page, limit: 20 },
    })
    return {
      leads: data.leads.map((l) => toPortalQueueLead(l)),
      meta: data.meta,
    }
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 403) return { leads: [], meta: EMPTY_META, noAccess: true }
      if (err.isUnreachable)
        return { leads: [], meta: EMPTY_META, error: 'Server waking up — refresh in a moment.' }
    }
    return { leads: [], meta: EMPTY_META }
  }
}

export async function getAgentLeadDetail(id: string): Promise<PortalQueueLead | undefined> {
  const token = await requireToken()
  try {
    const detail = await apiFetch<ApiLeadDetail>(`/leads/${id}`, { token })
    return toPortalQueueLead(detail, detail)
  } catch {
    return undefined
  }
}

// ─── Admin leads ─────────────────────────────────────────────────────────────

export async function getAdminLeads(page = 1): Promise<AdminLeadListResult> {
  const token = await requireToken()
  try {
    const data = await apiFetch<{ leads: ApiLeadSummary[]; meta: PaginationMeta }>(
      '/leads/admin/all',
      { token, searchParams: { page, limit: 20 } },
    )
    return { leads: data.leads, meta: data.meta }
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401 || err.status === 403)
        return { leads: [], meta: EMPTY_META, noAccess: true }
      if (err.isUnreachable)
        return { leads: [], meta: EMPTY_META, error: 'Server waking up — refresh in a moment.' }
    }
    return { leads: [], meta: EMPTY_META, error: 'Failed to load leads.' }
  }
}

export async function getAdminLead(id: string): Promise<ApiLeadDetail | undefined> {
  const token = await requireToken()
  try {
    return await apiFetch<ApiLeadDetail>(`/leads/${id}`, { token })
  } catch {
    return undefined
  }
}

export async function getLeadPermissions(): Promise<ApiLeadPermission[]> {
  const token = await requireToken()
  try {
    return await apiFetch<ApiLeadPermission[]>('/leads/admin/permissions', { token })
  } catch {
    return []
  }
}
