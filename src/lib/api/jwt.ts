import type { UserRole } from '@/types/api'

/**
 * Unverified JWT payload decoding. Used only to gate UI (session presence,
 * role-based redirects, cookie max-age) — every backend request carries the
 * bearer token and the backend performs real signature verification + authz.
 */

export interface AccessTokenPayload {
  /** User id. */
  sub: string
  email?: string
  role: UserRole
  /** Issued-at / expiry, unix seconds. */
  iat?: number
  exp: number
}

const ROLES: readonly string[] = ['AGENT', 'RECRUITER', 'OPS', 'CLIENT', 'ADMIN']

function decodeBase64Url(segment: string): string | null {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  try {
    if (typeof atob === 'function') {
      const binary = atob(padded)
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
      return new TextDecoder().decode(bytes)
    }
    return Buffer.from(padded, 'base64').toString('utf8')
  } catch {
    return null
  }
}

export function decodeAccessToken(token: string): AccessTokenPayload | null {
  const segments = token.split('.')
  if (segments.length !== 3) return null

  const json = decodeBase64Url(segments[1])
  if (!json) return null

  let payload: unknown
  try {
    payload = JSON.parse(json)
  } catch {
    return null
  }

  if (typeof payload !== 'object' || payload === null) return null
  const record = payload as Record<string, unknown>

  if (
    typeof record.sub !== 'string' ||
    typeof record.exp !== 'number' ||
    typeof record.role !== 'string' ||
    !ROLES.includes(record.role)
  ) {
    return null
  }

  return {
    sub: record.sub,
    email: typeof record.email === 'string' ? record.email : undefined,
    role: record.role as UserRole,
    iat: typeof record.iat === 'number' ? record.iat : undefined,
    exp: record.exp,
  }
}

/** True when the token is expired (with a small clock-skew buffer). */
export function isExpired(payload: AccessTokenPayload, skewSeconds = 30): boolean {
  return payload.exp - skewSeconds <= Math.floor(Date.now() / 1000)
}
