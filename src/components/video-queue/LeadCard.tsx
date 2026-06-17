'use client'

import { motion } from 'motion/react'
import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { UrgencyBadge } from './UrgencyBadge'
import type { PortalQueueLead } from '@/lib/data/leads'

function Dot() {
  return <span className="mx-1.5 text-rc-muted-d/70">·</span>
}

interface LeadCardProps {
  lead: PortalQueueLead
  index: number
  onOpen: () => void
}

export function LeadCard({ lead, index, onOpen }: LeadCardProps) {
  const urgent = lead.urgency === 'urgent'
  const servicesSummary =
    lead.services.length > 0 ? lead.services.slice(0, 2).join(', ') : 'Various services'

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.06 + index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.995 }}
      className={`group flex w-full items-center gap-3.5 rounded-md border border-rc-line bg-white px-4 py-3.5 text-left shadow-sm transition-colors hover:bg-rc-paper-2 ${
        urgent ? 'border-l-[3px] border-l-rc-bad' : ''
      }`}
    >
      <Avatar name={lead.name} tone={lead.tone} size={38} />

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 text-sm font-semibold text-rc-ink">
          {lead.name} <span className="font-normal text-rc-muted-d">· {lead.company}</span>
        </div>
        <div className="truncate text-[12.5px] text-rc-muted">
          {servicesSummary}
          <Dot />
          {lead.submitted}
        </div>
      </div>

      <UrgencyBadge urgency={lead.urgency} />

      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-rc-line bg-white text-rc-muted transition-transform duration-200 group-hover:translate-x-0.5">
        <Icon name="arrow-right" size={14} />
      </span>
    </motion.button>
  )
}
