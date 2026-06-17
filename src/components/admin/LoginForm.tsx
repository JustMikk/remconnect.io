'use client'

import { useActionState } from 'react'
import { loginAction, type LoginState } from '@/app/admin/login/actions'
import { cn } from '@/lib/cn'

const INITIAL_STATE: LoginState = { error: null }

interface LoginFormProps {
  /** Message derived from ?error= query (e.g. expired session), shown until a submit. */
  notice?: string
}

export function LoginForm({ notice }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL_STATE)
  const message = state.error ?? notice

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {message && (
        <p
          role="alert"
          className="rounded-md border border-rc-bad/30 bg-rc-bad/10 px-3 py-2 text-[13px] text-rc-bad"
        >
          {message}
        </p>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold tracking-[0.08em] text-rc-muted uppercase">
          Email
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={pending}
          placeholder="you@remconnect.io"
          className="rounded-md border border-rc-line bg-rc-paper px-3 py-2.5 text-sm text-rc-ink outline-none focus:border-rc-blue disabled:opacity-60"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold tracking-[0.08em] text-rc-muted uppercase">
          Password
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={pending}
          placeholder="••••••••"
          className="rounded-md border border-rc-line bg-rc-paper px-3 py-2.5 text-sm text-rc-ink outline-none focus:border-rc-blue disabled:opacity-60"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className={cn(
          'mt-1 rounded-md bg-rc-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors',
          pending ? 'cursor-wait opacity-70' : 'hover:bg-rc-blue-deep',
        )}
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center text-xs text-rc-muted">
        First sign-in after idle can take up to a minute while the server wakes up.
      </p>
    </form>
  )
}
