import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getSession, isStaffRole } from '@/lib/api/session'
import { UnifiedLoginForm } from '@/components/auth/UnifiedLoginForm'

export const metadata = { title: 'Log in · RemConnect' }

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const [session, { error }] = await Promise.all([getSession(), searchParams])
  if (session) redirect(isStaffRole(session.role) ? '/admin/agents' : '/home')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f4f4ee' }}>
      {/* Left brand panel — hidden below lg */}
      <div
        style={{
          flex: 1,
          background: '#0b1220',
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 56px',
        }}
        className="lg:flex"
      >
        <Link href="/">
          <Image
            src="/assets/remconnect-logo.png"
            alt="RemConnect"
            width={140}
            height={40}
            style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
          />
        </Link>
        <div>
          <p
            style={{
              color: '#b8bdc9',
              fontSize: 17,
              lineHeight: 1.65,
              maxWidth: 380,
              fontFamily: 'var(--rc-sans)',
            }}
          >
            Ethiopia&apos;s premium remote talent platform — trained, assessed, and deployed.
          </p>
          <p style={{ marginTop: 12, fontSize: 12, color: '#5a6072', letterSpacing: '0.04em' }}>
            Agents log in to the portal. Admins and staff access the console.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Link href="/" className="lg:hidden" style={{ display: 'block', marginBottom: 32 }}>
            <Image
              src="/assets/remconnect-logo.png"
              alt="RemConnect"
              width={130}
              height={38}
              style={{ objectFit: 'contain' }}
            />
          </Link>

          <h1
            style={{
              fontFamily: 'var(--rc-serif)',
              fontSize: 30,
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#0b1220',
              marginBottom: 6,
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: '#5a6072', marginBottom: 28 }}>
            Sign in to your RemConnect account
          </p>

          {error === 'forbidden' && (
            <div
              style={{
                marginBottom: 16,
                padding: '10px 14px',
                borderRadius: 6,
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
                fontSize: 13,
              }}
            >
              Your account does not have access to that area.
            </div>
          )}

          <UnifiedLoginForm />

          <p style={{ marginTop: 24, fontSize: 13, color: '#5a6072', textAlign: 'center' }}>
            New here?{' '}
            <Link href="/apply" style={{ color: '#1d6fd6', fontWeight: 500 }}>
              Apply as an agent
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
