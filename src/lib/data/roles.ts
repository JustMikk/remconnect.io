import { apiFetch } from '@/lib/api/client'
import type { ApiRoleCategory } from '@/types/api'

/**
 * Role catalog from the backend (public endpoint). Memoized at module level —
 * the catalog changes rarely and `'use cache'` is not enabled in this repo.
 */

let catalogPromise: Promise<ApiRoleCategory[]> | null = null

export async function getRoleCategories(): Promise<ApiRoleCategory[]> {
  catalogPromise ??= apiFetch<ApiRoleCategory[]>('/roles/categories/with-roles', {
    timeoutMs: 10_000,
  }).catch((error: unknown) => {
    catalogPromise = null // don't memoize failures
    throw error
  })
  return catalogPromise
}

/** roleId → role title lookup; empty map when the backend is unreachable. */
export async function getRoleTitleMap(): Promise<Map<string, string>> {
  try {
    const categories = await getRoleCategories()
    return new Map(categories.flatMap((c) => c.roles.map((r) => [r.id, r.title] as const)))
  } catch {
    return new Map()
  }
}
