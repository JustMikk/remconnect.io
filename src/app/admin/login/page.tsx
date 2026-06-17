import Image from 'next/image'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { LoginForm } from '@/components/admin/LoginForm'
import { getSession, isStaffRole } from '@/lib/api/session'

export const metadata: Metadata = {
  title: 'Admin sign in — RemConnect',
}

const NOTICES: Record<string, string> = {
  expired: 'Your session has expired. Please sign in again.',
  forbidden: 'This account does not have access to the admin console.',
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const session = await getSession()
  if (session && isStaffRole(session.role)) redirect('/admin/agents')

  const { error } = await searchParams
  const notice = error ? NOTICES[error] : undefined

  return (
    <div className="flex min-h-screen items-center justify-center bg-rc-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-3">
          <Image
            src="/assets/remconnect-mark.png"
            alt="RemConnect"
            width={40}
            height={40}
            className="size-10 rounded-[9px] object-cover"
            priority
          />
          <div>
            <div className="text-sm font-semibold text-[#e5e7eb]">RemConnect</div>
            <div className="text-[10px] font-semibold tracking-[0.14em] text-rc-blue-soft uppercase">
              Admin Console
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-rc-line bg-rc-paper p-6 shadow-md">
          <h1 className="mb-1 text-lg font-semibold text-rc-ink">Sign in</h1>
          <p className="mb-5 text-[13px] text-rc-muted">
            Staff access only — agents sign in from the portal.
          </p>
          <LoginForm notice={notice} />
        </div>
      </div>
    </div>
  )
}
