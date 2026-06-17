import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ACCESS_COOKIE } from '@/lib/api/constants'

/** Proxies a multipart resume file to the backend for parsing, injecting the
 *  session token from httpOnly cookies (the browser can't read it directly). */
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
  const timer = setTimeout(() => controller.abort(), 65_000)

  try {
    const res = await fetch(`${base}/agents/me/resume`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: upstream,
      signal: controller.signal,
    })

    clearTimeout(timer)
    const json = (await res.json()) as unknown
    return NextResponse.json(json, { status: res.status })
  } catch (err) {
    clearTimeout(timer)
    const aborted = err instanceof Error && err.name === 'AbortError'
    const msg = aborted
      ? 'The server took too long to respond — it may be waking up. Try again in a minute.'
      : 'Could not reach the server. Please try again.'
    return NextResponse.json({ ok: false, error: msg }, { status: 503 })
  }
}
