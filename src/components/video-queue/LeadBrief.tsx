'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import type { PortalQueueLead } from '@/lib/data/leads'

interface Attachment {
  name: string
  size: string
  length: string
}

export function LeadBrief({ lead, onBack }: { lead: PortalQueueLead; onBack: () => void }) {
  const [attached, setAttached] = useState<Attachment | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [sent, setSent] = useState(false)

  const attach = () =>
    setAttached({
      name: `${lead.first.toLowerCase()}-${lead.company.split(' ')[0].toLowerCase()}-intro.mp4`,
      size: '14.2MB',
      length: '3:42',
    })

  const send = () => {
    if (!attached || sent) return
    setSent(true)
    setTimeout(onBack, 1100)
  }

  const snapshot: [string, string][] = [
    ['Company', lead.company],
    ['Contact', lead.email],
    ['Services', lead.services.slice(0, 2).join(', ') || '—'],
    ['Submitted', lead.submitted],
  ]

  return (
    <div>
      {/* Header */}
      <header className="mb-5 flex items-center gap-3.5">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.94 }}
          title="Back to queue"
          className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-sm border border-rc-line bg-white text-rc-ink transition-colors hover:bg-rc-paper-2"
        >
          <Icon name="chevron-left" size={16} />
        </motion.button>

        <Avatar name={lead.name} tone={lead.tone} size={44} />

        <div className="min-w-0">
          <h2 className="font-serif text-2xl font-normal leading-tight tracking-[-0.01em] text-rc-ink">
            {lead.name}
          </h2>
          <div className="mt-0.5 text-[12.5px] text-rc-muted">{lead.company}</div>
        </div>

        <div className="flex-1" />

        <span className="inline-flex items-center gap-1.5 rounded-full border border-rc-good/25 bg-rc-good/12 px-2.5 py-1 text-[11.5px] font-medium text-rc-good">
          <Icon name="check" size={12} />
          Qualified
        </span>
      </header>

      {/* Submission snapshot */}
      <div className="flex overflow-hidden rounded-md border border-rc-line bg-white">
        {snapshot.map(([k, v], i) => (
          <div key={k} className={`flex-1 px-3.5 py-3 ${i > 0 ? 'border-l border-rc-line' : ''}`}>
            <div className="text-[10px] uppercase tracking-[0.06em] text-rc-muted-d">{k}</div>
            <div className="mt-1 truncate text-[13px] font-medium text-rc-ink">{v}</div>
          </div>
        ))}
      </div>

      <Divider className="mt-6" />

      {/* AI-generated script */}
      {lead.aiCallScript && (
        <Section title="AI-generated script" hint="personalised to this lead">
          <pre className="whitespace-pre-wrap rounded-md border border-rc-line bg-white px-4 py-4 font-sans text-[13px] leading-relaxed text-rc-ink">
            {lead.aiCallScript}
          </pre>
          <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-rc-muted">
            <Icon name="info" size={13} />
            Use this as a guide when recording your personalised video.
          </p>
        </Section>
      )}

      {lead.notes && (
        <Section title="Additional notes">
          <p className="rounded-md border border-rc-line bg-white px-4 py-3 text-[13px] leading-relaxed text-rc-ink">
            {lead.notes}
          </p>
        </Section>
      )}

      <Divider />

      {/* Record & send */}
      <Section title="Record & send">
        <div className="mb-2.5 grid grid-cols-2 gap-2.5">
          <ActionButton onClick={attach} icon={<span className="h-3 w-3 rounded-full bg-rc-bad" />}>
            Record now
          </ActionButton>
          <ActionButton onClick={attach} icon={<Icon name="upload" size={15} />}>
            Upload file
          </ActionButton>
        </div>

        {/* Drop zone */}
        <motion.div
          role="button"
          tabIndex={0}
          onClick={attach}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && attach()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            attach()
          }}
          animate={{ scale: attached ? [1, 1.012, 1] : 1 }}
          transition={{ duration: 0.3 }}
          className={`mb-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md px-4 py-7 text-center outline-none transition-colors ${
            attached
              ? 'border-[1.5px] border-rc-blue bg-rc-blue/[0.06]'
              : dragOver
                ? 'border-[1.5px] border-rc-blue bg-rc-paper-2'
                : 'border-[1.5px] border-dashed border-rc-line bg-white hover:bg-rc-paper-2/60'
          }`}
        >
          <Icon name="video" size={22} color={attached ? '#1d6fd6' : '#8b93a7'} />
          <AnimatePresence mode="wait" initial={false}>
            {attached ? (
              <motion.div
                key="filled"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[12.5px] text-rc-blue-deep"
              >
                <strong className="font-semibold">{attached.name}</strong> · {attached.size} ·{' '}
                {attached.length} · ready to send
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[12.5px] text-rc-muted"
              >
                <strong className="font-semibold text-rc-ink">Drop a video file here</strong> or
                click to browse · .mp4, .mov, up to 200MB
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Send CTA — locked until a video is attached */}
        <motion.button
          type="button"
          onClick={send}
          disabled={!attached || sent}
          whileTap={attached && !sent ? { scale: 0.985 } : undefined}
          className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-3.5 text-[13.5px] font-medium text-rc-paper transition-[background-color,opacity] duration-300 ${
            sent ? 'bg-rc-good' : 'bg-rc-ink'
          } ${attached || sent ? 'opacity-100' : 'cursor-not-allowed opacity-40'}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.span
                key="sent"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                Sent — back to queue <Icon name="check" size={15} />
              </motion.span>
            ) : (
              <motion.span
                key="send"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group flex items-center gap-2"
              >
                Send video to {lead.first}
                <Icon name="arrow-right" size={14} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-rc-muted-d">
          <Icon name="lock" size={12} />
          {lead.first} gets a one-time watch link on remconnect.io — it expires after the first
          view.
        </p>
      </Section>
    </div>
  )
}

/* ----------------------------- local bits ----------------------------- */

function Divider({ className = '' }: { className?: string }) {
  return <hr className={`border-0 border-t border-rc-line ${className}`} />
}

function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section className="my-6">
      <h3 className="mb-3.5 flex items-baseline gap-2 text-[13px] font-semibold text-rc-ink">
        {title}
        {hint && <span className="text-[11px] font-normal text-rc-muted-d">{hint}</span>}
      </h3>
      {children}
    </section>
  )
}

function ActionButton({
  onClick,
  icon,
  children,
}: {
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="inline-flex items-center justify-center gap-2 rounded-md border border-rc-line bg-white px-4 py-3 text-[13px] font-medium text-rc-ink transition-colors hover:bg-rc-paper-2"
    >
      {icon}
      {children}
    </motion.button>
  )
}
