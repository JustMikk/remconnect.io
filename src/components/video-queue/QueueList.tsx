'use client'

import { AnimatePresence, motion } from 'motion/react'
import type { Filter } from './data'
import type { PortalQueueLead } from '@/lib/data/leads'
import { StatCard } from './StatCard'
import { LeadCard } from './LeadCard'

const FILTERS: Filter[] = ['all', 'urgent', 'new']

interface QueueListProps {
  leads: PortalQueueLead[]
  filter: Filter
  setFilter: (f: Filter) => void
  onOpen: (id: string) => void
}

export function QueueList({ leads, filter, setFilter, onOpen }: QueueListProps) {
  const visible = leads.filter((l) => filter === 'all' || l.urgency === filter)

  return (
    <div>
      {/* Header */}
      <header className="mb-1.5 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[34px] font-normal leading-tight tracking-[-0.02em] text-rc-ink">
            Video queue
          </h1>
          <p className="mt-1 max-w-xl text-sm text-rc-muted">
            Qualified inbound leads waiting on a personalised video. Record, then send a one-time
            watch link.
          </p>
        </div>
        <span className="shrink-0 whitespace-nowrap pb-0.5 text-[13px] text-rc-muted">
          {leads.length} qualified leads
        </span>
      </header>

      {/* Stats */}
      <div className="my-6 grid grid-cols-3 gap-3">
        <StatCard
          value={String(leads.filter((l) => l.urgency === 'urgent').length)}
          label="Urgent"
          index={0}
        />
        <StatCard
          value={String(leads.filter((l) => l.urgency === 'new').length)}
          label="New"
          index={1}
        />
        <StatCard value={String(leads.length)} label="Total in queue" index={2} />
      </div>

      {/* List label + filter pills */}
      <div className="flex items-center justify-between px-0.5 pb-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-rc-muted">
          Up next
        </span>
        <div className="flex gap-1">
          {FILTERS.map((f) => {
            const active = filter === f
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className="relative rounded-full px-3 py-1 text-[12.5px] capitalize transition-colors"
              >
                {active && (
                  <motion.span
                    layoutId="vq-filter-pill"
                    className="absolute inset-0 rounded-full bg-rc-ink"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  className={`relative z-10 ${active ? 'font-medium text-rc-paper' : 'text-rc-muted'}`}
                >
                  {f}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Lead cards */}
      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((lead, i) => (
            <LeadCard key={lead.id} lead={lead} index={i} onOpen={() => onOpen(lead.id)} />
          ))}
        </AnimatePresence>

        {visible.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-10 text-center text-[13px] text-rc-muted-d"
          >
            No {filter} leads right now.
          </motion.div>
        )}
      </div>
    </div>
  )
}
