import type { ApiEnvelope } from '@/types/api'

/**
 * Typed fetch wrapper for the RemConnect backend.
 *
 * Deliberately free of Next.js imports so it can run anywhere on the server
 * (Server Components, server actions, route handlers, proxy.ts) and be unit
 * tested. Auth cookies are handled by callers via `@/lib/api/cookies`.
 */

export const COLD_START_MESSAGE =
  'The server took too long to respond — it may be waking up. Please try again in a minute.'

/** Render free tier can cold-start in up to ~50s. */
const DEFAULT_TIMEOUT_MS = 65_000

export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: Record<string, string[]>

  constructor(status: number, message: string, fieldErrors: Record<string, string[]> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }

  /** True when the request never reached the backend (timeout / network). */
  get isUnreachable(): boolean {
    return this.status === 0
  }
}

export interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  /** Bearer access token; sets the Authorization header when provided. */
  token?: string
  /** JSON-serializable request body. */
  body?: unknown
  searchParams?: Record<string, string | number | undefined>
  timeoutMs?: number
}

export function apiBaseUrl(): string {
  const base = process.env.API_BASE_URL
  if (!base) {
    throw new Error('API_BASE_URL is not set — copy .env.example to .env.local')
  }
  return base.replace(/\/$/, '')
}

function buildUrl(path: string, searchParams?: ApiFetchOptions['searchParams']): string {
  const url = new URL(apiBaseUrl() + path)
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

/**
 * Calls the backend and unwraps the `{ success, message, data, errors }`
 * envelope. Throws `ApiError` on non-2xx responses, `success: false` bodies,
 * timeouts (status 0) and network failures (status 0).
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = 'GET', token, body, searchParams, timeoutMs = DEFAULT_TIMEOUT_MS } = options

  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const url = buildUrl(path, searchParams)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: 'no-store',
      signal: controller.signal,
    })
  } catch (error) {
    const aborted = error instanceof Error && error.name === 'AbortError'
    throw new ApiError(
      0,
      aborted ? COLD_START_MESSAGE : 'Could not reach the server. Please try again.',
    )
  } finally {
    clearTimeout(timer)
  }

  let envelope: ApiEnvelope<T>
  try {
    envelope = (await response.json()) as ApiEnvelope<T>
  } catch {
    throw new ApiError(
      response.status,
      `Unexpected response from the server (HTTP ${response.status}).`,
    )
  }

  if (!response.ok || !envelope.success) {
    throw new ApiError(
      response.status,
      envelope.message ?? `Request failed (HTTP ${response.status}).`,
      envelope.errors ?? {},
    )
  }

  return envelope.data as T
}
