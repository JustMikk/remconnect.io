import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ACCESS_COOKIE } from '@/lib/api/constants'

export const runtime = 'nodejs'
// Resume parsing (AI extraction) plus a possible backend cold start can take a
// while, so allow generous headroom. (On Vercel this is capped by the plan.)
export const maxDuration = 120

/** Proxies a multipart resume file to the backend's `/resume/upload` endpoint,
 *  which stores and parses it. Injects the session token from httpOnly cookies
 *  (the browser can't read it directly) and forwards the upstream response
 *  verbatim so the client sees the real status + message. */
export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid form data' }, { status: 400 })
  }

  const file = form.get('resume')
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: 'No resume file provided' }, { status: 400 })
  }

  const base = process.env.API_BASE_URL?.replace(/\/$/, '')
  if (!base) {
    return NextResponse.json({ ok: false, error: 'API not configured' }, { status: 500 })
  }

  const upstream = new FormData()
  upstream.append('resume', file)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 110_000)

  let res: Response
  try {
    res = await fetch(`${base}/resume/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: upstream,
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timer)
    const aborted = err instanceof Error && err.name === 'AbortError'
    return NextResponse.json(
      {
        ok: false,
        error: aborted
          ? 'The resume service took too long to respond — it may be waking up. Try again in a minute.'
          : 'Could not reach the resume service. Please try again.',
      },
      { status: aborted ? 504 : 502 },
    )
  }
  clearTimeout(timer)

  // Forward the upstream status + body verbatim. A backend error (e.g. 500 from
  // a parse failure) must surface as-is, not be masked as a generic 503.
  const text = await res.text()
  try {
    return NextResponse.json(JSON.parse(text) as unknown, { status: res.status })
  } catch {
    return NextResponse.json(
      { ok: false, error: text.slice(0, 500) || `Resume service error (HTTP ${res.status})` },
      { status: res.status },
    )
  }
}
