'use client'

export default function AgentsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-8 py-20 text-center">
      <h2 className="mb-2 text-lg font-semibold text-rc-ink">Could not load agents</h2>
      <p className="mb-5 text-[13px] text-rc-muted">
        {error.message || 'The backend did not respond. It may be waking up from idle.'}
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-rc-blue px-4 py-2 text-sm font-semibold text-white hover:bg-rc-blue-deep"
      >
        Try again
      </button>
    </div>
  )
}
