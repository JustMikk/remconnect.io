'use server'

import { revalidatePath } from 'next/cache'
import { apiFetch } from '@/lib/api/client'
import { getSession } from '@/lib/api/session'

async function getToken(): Promise<string> {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')
  return session.accessToken
}

export async function grantLeadAccessAction(userId: string): Promise<{ error?: string }> {
  try {
    const token = await getToken()
    await apiFetch(`/leads/admin/permissions/${userId}`, { method: 'POST', token })
    revalidatePath('/admin/leads')
    return {}
  } catch {
    return { error: 'Failed to grant access.' }
  }
}

export async function revokeLeadAccessAction(userId: string): Promise<{ error?: string }> {
  try {
    const token = await getToken()
    await apiFetch(`/leads/admin/permissions/${userId}`, { method: 'DELETE', token })
    revalidatePath('/admin/leads')
    return {}
  } catch {
    return { error: 'Failed to revoke access.' }
  }
}
