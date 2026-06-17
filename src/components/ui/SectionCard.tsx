import React from 'react'
import { cn } from '@/lib/cn'

/**
 * Portal section card — white card with a consistent heading style and
 * a hairline separator. Use this anywhere the portal shows a titled
 * content block so the typographic hierarchy stays uniform.
 *
 * Typography contract (use these classes inside children):
 *   Primary label:   text-[13px] text-rc-ink
 *   Secondary value: text-[13px] text-rc-muted
 *   Meta / caption:  text-[11px] text-rc-muted-d
 *   Uppercase label: text-[10px] font-semibold uppercase tracking-[0.08em] text-rc-muted
 */
interface SectionCardProps {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function SectionCard({ title, action, children, className }: SectionCardProps) {
  return (
    <section
      className={cn(
        'rounded-[var(--radius-md)] border border-rc-line bg-white shadow-[var(--shadow-sm)]',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rc-line px-4 py-3">
        <span className="text-[13px] font-semibold tracking-[-0.01em] text-rc-ink">{title}</span>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
      {/* Body */}
      <div className="p-4">{children}</div>
    </section>
  )
}

/** A labeled row inside a SectionCard — key/value pair with consistent spacing. */
interface InfoRowProps {
  label: string
  children: React.ReactNode
  className?: string
}

export function InfoRow({ label, children, className }: InfoRowProps) {
  return (
    <div className={cn('flex items-start justify-between gap-3 py-1.5', className)}>
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-rc-muted-d">
        {label}
      </span>
      <span className="text-right text-[13px] text-rc-ink">{children}</span>
    </div>
  )
}

/** A divider between groups inside a SectionCard. */
export function SectionDivider({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-rc-line', className)} />
}
