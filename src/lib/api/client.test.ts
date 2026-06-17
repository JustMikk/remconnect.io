import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiFetch, COLD_START_MESSAGE } from './client'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('apiFetch', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubEnv('API_BASE_URL', 'https://api.example.com/api/v1')
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockReset()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('unwraps the data field of a success envelope', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, message: 'ok', data: { id: '1' } }))

    await expect(apiFetch<{ id: string }>('/agents')).resolves.toEqual({ id: '1' })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/api/v1/agents',
      expect.objectContaining({ method: 'GET', cache: 'no-store' }),
    )
  })

  it('sends bearer token, JSON body and search params', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: null }))

    await apiFetch('/agents', {
      method: 'POST',
      token: 'tok',
      body: { a: 1 },
      searchParams: { page: 2, q: 'liya', skip: undefined },
    })

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.example.com/api/v1/agents?page=2&q=liya')
    expect(init.body).toBe('{"a":1}')
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer tok',
      'Content-Type': 'application/json',
    })
  })

  it('throws ApiError with status, message and field errors on error envelopes', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { success: false, message: 'Validation failed', errors: { email: ['Invalid email'] } },
        422,
      ),
    )

    const error: unknown = await apiFetch('/auth/login', { method: 'POST', body: {} }).catch(
      (e: unknown) => e,
    )
    expect(error).toBeInstanceOf(ApiError)
    const apiError = error as ApiError
    expect(apiError.status).toBe(422)
    expect(apiError.message).toBe('Validation failed')
    expect(apiError.fieldErrors).toEqual({ email: ['Invalid email'] })
  })

  it('throws ApiError when the envelope reports failure despite HTTP 200', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: false, message: 'Nope' }))

    await expect(apiFetch('/auth/me')).rejects.toMatchObject({ status: 200, message: 'Nope' })
  })

  it('maps timeouts to an unreachable ApiError with cold-start copy', async () => {
    const abortError = new Error('aborted')
    abortError.name = 'AbortError'
    fetchMock.mockRejectedValue(abortError)

    const error: unknown = await apiFetch('/agents').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    const apiError = error as ApiError
    expect(apiError.status).toBe(0)
    expect(apiError.isUnreachable).toBe(true)
    expect(apiError.message).toBe(COLD_START_MESSAGE)
  })

  it('maps network failures to an unreachable ApiError', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'))

    await expect(apiFetch('/agents')).rejects.toMatchObject({ status: 0 })
  })

  it('throws when API_BASE_URL is missing', async () => {
    vi.stubEnv('API_BASE_URL', '')

    await expect(apiFetch('/agents')).rejects.toThrow(/API_BASE_URL/)
  })
})
