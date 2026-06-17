import { redirect } from 'next/navigation'
import { ApiError, apiFetch } from '@/lib/api/client'
import { getSession } from '@/lib/api/session'
import type { ApiUser } from '@/types/api'
import type { DirectoryAgent, DirectoryMeta, DirectoryStatus } from '@/types/admin'
import type { NetworkAgent } from '@/types/network'
import {
  pickNetworkAgent,
  toDirectoryAgent,
  toProfileRecord,
  type AdminAgentRecord,
} from './agent-enrichment'
import { getRoleTitleMap } from './roles'

/**
 * Data-access layer for admin agents, backed by the live RemConnect API.
 * Operational fields the backend doesn't expose yet are fixture-enriched via
 * the seam in ./agent-enrichment.ts.
 */

const PAGE_SIZE = 20

export interface AgentListQuery {
  page?: number
  q?: string
  status?: DirectoryStatus
}

export interface AgentListResult {
  agents: DirectoryAgent[]
  meta: DirectoryMeta
  /** Set when the signed-in staff role may not list agents (HTTP 403). */
  noAccess?: boolean
  /** User-facing message when the backend was unreachable (e.g. cold start). */
  error?: string
}

async function requireToken(): Promise<string> {
  const session = await getSession()
  if (!session) redirect('/admin/login?error=expired')
  return session.accessToken
}

function emptyResult(extra: Partial<AgentListResult> = {}): AgentListResult {
  return {
    agents: [],
    meta: { total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 },
    ...extra,
  }
}

export async function getAgents(query: AgentListQuery = {}): Promise<AgentListResult> {
  const token = await requireToken()

  let users: ApiUser[]
  try {
    // The live endpoint currently ignores page/search/status and returns the
    // full list. We forward the params anyway (server-side filtering applies
    // automatically once the backend implements them) and filter/paginate
    // locally in the meantime.
    users = await apiFetch<ApiUser[]>('/agents', {
      token,
      searchParams: { page: query.page, search: query.q, status: query.status },
    })
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) redirect('/admin/login?error=expired')
      if (error.status === 403) return emptyResult({ noAccess: true })
      return emptyResult({ error: error.message })
    }
    throw error
  }

  const roleTitles = await getRoleTitleMap()
  let agents = users.map((user) => toDirectoryAgent(user, roleTitles))

  if (query.status) {
    agents = agents.filter((agent) => agent.status === query.status)
  }
  if (query.q) {
    const q = query.q.toLowerCase()
    agents = agents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(q) ||
        agent.email.toLowerCase().includes(q) ||
        agent.role.toLowerCase().includes(q) ||
        agent.id.toLowerCase().includes(q),
    )
  }

  const total = agents.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(Math.max(1, query.page ?? 1), totalPages)

  return {
    agents: agents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    meta: { total, page, limit: PAGE_SIZE, totalPages },
  }
}

/** Full profile record for the agent detail page; undefined when not found. */
export async function getAdminAgent(userId: string): Promise<AdminAgentRecord | undefined> {
  const token = await requireToken()

  let user: ApiUser
  try {
    user = await apiFetch<ApiUser>(`/agents/${encodeURIComponent(userId)}`, { token })
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) return undefined
      if (error.status === 401) redirect('/admin/login?error=expired')
    }
    throw error
  }

  const roleTitles = await getRoleTitleMap()
  return toProfileRecord(user, roleTitles)
}

export async function getNetworkAgent(id: string): Promise<NetworkAgent | undefined> {
  return pickNetworkAgent(id)
}
