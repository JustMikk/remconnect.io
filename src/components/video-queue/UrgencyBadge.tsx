import type { LeadUrgency } from '@/lib/data/leads'

export function UrgencyBadge({ urgency }: { urgency: LeadUrgency }) {
  if (urgency === 'urgent') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-rc-bad/25 bg-rc-bad/10 px-2.5 py-[3px] text-[11px] font-medium text-rc-bad">
        <span className="rc-pulse h-1.5 w-1.5 rounded-full bg-rc-bad" />
        Urgent
      </span>
    )
  }
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-rc-line bg-rc-paper-2 px-2.5 py-[3px] text-[11px] font-medium text-rc-muted">
      New
    </span>
  )
}
