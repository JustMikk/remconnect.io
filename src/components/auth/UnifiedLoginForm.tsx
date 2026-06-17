'use client'

import { useActionState, useEffect, useState } from 'react'
import type { LoginState } from '@/app/login/actions'
import { loginAction } from '@/app/login/actions'

const INITIAL: LoginState = { error: null }

export function UnifiedLoginForm() {
  const [state, action, pending] = useActionState(loginAction, INITIAL)
  const [slowPending, setSlowPending] = useState(false)

  useEffect(() => {
    if (!pending) return
    const t = setTimeout(() => setSlowPending(true), 8000)
    return () => {
      clearTimeout(t)
      setSlowPending(false)
    }
  }, [pending])

  return (
    <form action={action}>
      <div style={{ marginBottom: 14 }}>
        <label
          htmlFor="email"
          style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: '#374151',
            marginBottom: 6,
          }}
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          autoComplete="email"
          disabled={pending}
          placeholder="you@remconnect.io"
          style={{
            display: 'block',
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            fontSize: 14,
            background: pending ? '#f9f9f7' : '#fff',
            outline: 'none',
            boxSizing: 'border-box',
            color: '#0b1220',
          }}
        />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label
          htmlFor="password"
          style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: '#374151',
            marginBottom: 6,
          }}
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          disabled={pending}
          placeholder="••••••••"
          style={{
            display: 'block',
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            fontSize: 14,
            background: pending ? '#f9f9f7' : '#fff',
            outline: 'none',
            boxSizing: 'border-box',
            color: '#0b1220',
          }}
        />
      </div>

      {state.error && (
        <div
          style={{
            marginBottom: 14,
            padding: '10px 14px',
            borderRadius: 6,
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          width: '100%',
          padding: '11px 0',
          background: '#0b1220',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 500,
          cursor: pending ? 'not-allowed' : 'pointer',
          opacity: pending ? 0.7 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>

      {slowPending && (
        <p
          style={{
            marginTop: 10,
            fontSize: 12,
            color: '#5a6072',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          The server is waking up — this may take up to 60 s.
        </p>
      )}
    </form>
  )
}
