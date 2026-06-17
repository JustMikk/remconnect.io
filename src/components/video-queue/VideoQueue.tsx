'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Filter } from './data'
import type { PortalQueueLead } from '@/lib/data/leads'
import { QueueList } from './QueueList'
import { LeadBrief } from './LeadBrief'

interface VideoQueueProps {
  leads: PortalQueueLead[]
  error?: string
}

export function VideoQueue({ leads, error }: VideoQueueProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')

  const selected = leads.find((l) => l.id === selectedId) ?? null

  if (error) {
    return (
      <div className="mx-auto max-w-[1000px] px-8 pb-14 pt-7 font-sans text-rc-ink">
        <p className="mt-12 text-center text-[13px] text-rc-muted">{error}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1000px] px-8 pb-14 pt-7 font-sans text-rc-ink">
      <AnimatePresence mode="wait" initial={false}>
        {selected ? (
          <motion.div
            key="brief"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            <LeadBrief lead={selected} onBack={() => setSelectedId(null)} />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            <QueueList leads={leads} filter={filter} setFilter={setFilter} onOpen={setSelectedId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
