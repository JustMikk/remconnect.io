'use server'

import { revalidatePath } from 'next/cache'
import { apiFetch } from '@/lib/api/client'
import { getSession } from '@/lib/api/session'
import type { ApiRole, ApiRoleCategory } from '@/types/api'

async function getToken(): Promise<string> {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')
  return session.accessToken
}

export async function createRoleAction(
  categoryId: string,
  data: { title: string; description?: string },
): Promise<{ role?: ApiRole; error?: string }> {
  try {
    const token = await getToken()
    const role = await apiFetch<ApiRole>(`/roles/categories/${categoryId}/roles`, {
      method: 'POST',
      token,
      body: data,
    })
    revalidatePath('/admin/roles')
    return { role }
  } catch {
    return { error: 'Failed to create role.' }
  }
}

export async function updateRoleAction(
  roleId: string,
  data: { title?: string; description?: string },
): Promise<{ error?: string }> {
  try {
    const token = await getToken()
    await apiFetch(`/roles/${roleId}`, { method: 'PATCH', token, body: data })
    revalidatePath('/admin/roles')
    return {}
  } catch {
    return { error: 'Failed to update role.' }
  }
}

export async function deleteRoleAction(roleId: string): Promise<{ error?: string }> {
  try {
    const token = await getToken()
    await apiFetch(`/roles/${roleId}`, { method: 'DELETE', token })
    revalidatePath('/admin/roles')
    return {}
  } catch {
    return { error: 'Failed to delete role.' }
  }
}

export async function createCategoryAction(data: {
  name: string
  slug?: string
}): Promise<{ category?: ApiRoleCategory; error?: string }> {
  try {
    const token = await getToken()
    const category = await apiFetch<ApiRoleCategory>('/roles/categories', {
      method: 'POST',
      token,
      body: data,
    })
    revalidatePath('/admin/roles')
    return { category }
  } catch {
    return { error: 'Failed to create category.' }
  }
}
