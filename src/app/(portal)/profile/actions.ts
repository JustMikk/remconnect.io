'use server'

import { revalidatePath } from 'next/cache'
import { apiFetch } from '@/lib/api/client'
import { getSession } from '@/lib/api/session'
import type { ApiAgentProfile } from '@/types/api'

export interface ProfileUpdateInput {
  nickname?: string
  bio?: string
  linkedinUrl?: string
}

export interface ProfileUpdateResult {
  ok: boolean
  error?: string
}

export async function updateProfileAction(input: ProfileUpdateInput): Promise<ProfileUpdateResult> {
  const session = await getSession()
  if (!session) return { ok: false, error: 'Not authenticated' }

  // Strip undefined fields so we don't send empty strings to the backend
  const body = Object.fromEntries(
    Object.entries(input).filter(([, v]) => v !== undefined && v !== ''),
  )

  try {
    await apiFetch<ApiAgentProfile>('/agents/me', {
      method: 'PATCH',
      token: session.accessToken,
      body,
    })
    revalidatePath('/profile')
    return { ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Update failed — please try again.'
    return { ok: false, error: message }
  }
}
