'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { getAgentPhoto, isExternalPhoto } from '@/lib/agent-photo'
import { useAdmin } from '@/context/AdminContext'
import { cn } from '@/lib/cn'
import type { DirectoryAgent, DirectoryMeta, DirectoryStatus } from '@/types/admin'

type View = 'table' | 'cards'

interface DirectoryQuery {
  q?: string
  status?: DirectoryStatus
}

interface AgentDirectoryProps {
  agents: DirectoryAgent[]
  meta: DirectoryMeta
  query: DirectoryQuery
  noAccess?: boolean
  error?: string
}

const STATUS_LABELS: Record<DirectoryStatus, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  PENDING: 'Pending review',
}

const STATUS_BADGE_CLASSES: Record<DirectoryStatus, string> = {
  ACTIVE: 'bg-rc-good/12 text-rc-good',
  INACTIVE: 'bg-rc-muted/10 text-rc-muted',
  PENDING: 'bg-rc-warn/12 text-rc-warn',
}

const FILTERS: (DirectoryStatus | 'all')[] = ['all', 'ACTIVE', 'INACTIVE']

function StatusBadge({ status }: { status: DirectoryStatus }) {
  return (
    <span
      className={cn(
        'inline-block rounded px-2 py-0.5 text-[11px] font-semibold',
        STATUS_BADGE_CLASSES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

function AgentAvatar({ agent, size }: { agent: DirectoryAgent; size: number }) {
  const src = agent.photo || getAgentPhoto(agent.id, size * 2)
  const className = 'h-full w-full object-cover'

  return (
    <div
      className="shrink-0 overflow-hidden rounded-full border border-rc-line"
      style={{ width: size, height: size }}
    >
      {isExternalPhoto(src) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={agent.name} width={size} height={size} className={className} />
      ) : (
        <Image src={src} alt={agent.name} width={size} height={size} className={className} />
      )}
    </div>
  )
}

function stealthName(name: string): string {
  const [first, ...rest] = name.split(' ')
  if (rest.length === 0) return first
  return `${first} ${rest.map((w) => `${w[0]}.`).join(' ')}`
}

function buildHref(pathname: string, query: DirectoryQuery, page?: number): string {
  const params = new URLSearchParams()
  if (query.q) params.set('q', query.q)
  if (query.status) params.set('status', query.status)
  if (page && page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `${pathname}?${qs}` : pathname
}

export function AgentDirectory({ agents, meta, query, noAccess, error }: AgentDirectoryProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { stealth, toggleStealth } = useAdmin()
  const [view, setView] = useState<View>('table')
  const [search, setSearch] = useState(query.q ?? '')
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Push the (debounced) search term into the URL — the server refilters.
  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current)
    const term = search.trim()
    if (term === (query.q ?? '')) return
    debounce.current = setTimeout(() => {
      router.replace(buildHref(pathname, { q: term || undefined, status: query.status }))
    }, 350)
    return () => {
      if (debounce.current) clearTimeout(debounce.current)
    }
  }, [search, query.q, query.status, pathname, router])

  const name = (a: DirectoryAgent) => (stealth ? stealthName(a.name) : a.name)

  return (
    <div className="mx-auto max-w-[1280px] px-8 pt-7 pb-12">
      {/* Filter bar */}
      <div className="mb-[18px] flex flex-wrap items-center gap-2.5">
        <div className="flex min-w-[260px] items-center gap-2 rounded-lg border border-rc-line bg-white px-3 py-2">
          <Icon name="search" size={14} color="var(--rc-muted-d)" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, role, ID…"
            className="flex-1 border-none bg-transparent text-[13px] outline-none"
          />
        </div>

        <div className="flex gap-1 rounded-full bg-rc-paper-2 p-[3px] text-xs">
          {FILTERS.map((f) => {
            const status = f === 'all' ? undefined : f
            const active = (query.status ?? 'all') === f
            return (
              <Link
                key={f}
                href={buildHref(pathname, { q: query.q, status })}
                className={cn(
                  'rounded-full px-3 py-[5px] font-medium transition-colors',
                  active ? 'bg-white text-rc-ink shadow-sm' : 'text-rc-muted hover:text-rc-ink',
                )}
              >
                {f === 'all' ? 'All' : STATUS_LABELS[f]}
                {active && <> · {meta.total}</>}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Stealth toggle */}
          <button
            onClick={toggleStealth}
            className={cn(
              'inline-flex items-center gap-[7px] rounded-md border px-3 py-[7px] text-xs font-medium',
              stealth
                ? 'border-rc-warn/40 bg-rc-warn/8 text-rc-warn'
                : 'border-rc-line text-rc-muted',
            )}
          >
            <Icon name={stealth ? 'eye-off' : 'eye'} size={13} color="currentColor" />
            {stealth ? 'Stealth ON' : 'Stealth OFF'}
          </button>

          {/* View toggle */}
          <div className="flex gap-0.5 rounded-[7px] bg-rc-paper-2 p-[3px]">
            {(['table', 'cards'] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'rounded-[5px] px-2.5 py-[5px] text-xs',
                  view === v ? 'bg-white text-rc-ink shadow-sm' : 'text-rc-muted',
                )}
              >
                <Icon name={v === 'table' ? 'list' : 'grid'} size={12} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {stealth && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-rc-warn/30 bg-rc-warn/7 px-3.5 py-2.5 text-xs font-medium text-rc-warn">
          <Icon name="eye-off" size={13} color="currentColor" />
          Stealth mode — client-safe view active. PII and internal data hidden.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-rc-bad/30 bg-rc-bad/8 px-3.5 py-2.5 text-[13px] text-rc-bad">
          {error}
        </div>
      )}

      {noAccess && (
        <div className="rounded-lg border border-rc-line bg-white p-10 text-center text-[13px] text-rc-muted">
          Your staff role does not have permission to view the agent directory.
        </div>
      )}

      {!noAccess && !error && agents.length === 0 && (
        <div className="rounded-lg border border-rc-line bg-white p-10 text-center text-[13px] text-rc-muted">
          No agents match this view yet.
        </div>
      )}

      {/* Table view */}
      {view === 'table' && agents.length > 0 && (
        <div className="overflow-hidden rounded-[10px] border border-rc-line bg-white">
          <div className="grid grid-cols-[minmax(200px,1.4fr)_1fr_0.8fr_0.8fr_80px_110px_100px] bg-rc-paper-2 px-3.5 py-2.5 text-[10px] font-semibold tracking-[0.1em] text-rc-muted uppercase">
            <div>Agent</div>
            <div>Role</div>
            <div>Client</div>
            <div>Score</div>
            <div>Certs</div>
            <div>Status</div>
            <div></div>
          </div>

          {agents.map((a, i) => (
            <div
              key={a.id}
              onClick={() => router.push(`/admin/agents/${a.id}`)}
              className={cn(
                'grid cursor-pointer grid-cols-[minmax(200px,1.4fr)_1fr_0.8fr_0.8fr_80px_110px_100px] items-center border-t border-rc-line px-3.5 py-3 transition-colors hover:bg-rc-paper-2',
                i % 2 === 1 && 'bg-rc-paper-2/30',
              )}
            >
              <div className="flex items-center gap-2.5">
                <AgentAvatar agent={a} size={30} />
                <div className="min-w-0">
                  <div className="text-[13px] font-medium">{name(a)}</div>
                  <div className="truncate font-mono text-[11px] text-rc-muted">
                    {stealth ? a.id.slice(0, 8) : a.email}
                  </div>
                </div>
              </div>
              <div className="text-xs text-rc-muted">{a.role}</div>
              <div className="text-xs">{stealth && a.client !== '—' ? '••••' : a.client}</div>
              <div>
                {a.score > 0 ? (
                  <span
                    className={cn(
                      'font-mono text-[13px] font-bold',
                      a.score >= 90
                        ? 'text-rc-good'
                        : a.score >= 80
                          ? 'text-rc-warn'
                          : 'text-rc-muted',
                    )}
                  >
                    {a.score}
                  </span>
                ) : (
                  <span className="text-[11px] text-rc-muted-d">—</span>
                )}
              </div>
              <div className="font-mono text-xs font-semibold">{a.certs}</div>
              <div>
                <StatusBadge status={a.status} />
              </div>
              <div className="text-right">
                <Link
                  href={`/admin/agents/${a.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-md border border-rc-line px-2.5 py-1 text-xs hover:bg-rc-paper-2"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cards view */}
      {view === 'cards' && agents.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3.5">
          {agents.map((a) => (
            <div
              key={a.id}
              onClick={() => router.push(`/admin/agents/${a.id}`)}
              className="cursor-pointer rounded-[10px] border border-rc-line bg-white p-[18px] transition-colors hover:border-rc-blue"
            >
              <div className="mb-3 flex items-center gap-3">
                <AgentAvatar agent={a} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-semibold">{name(a)}</div>
                  <div className="text-xs text-rc-muted">{a.role}</div>
                  <div className="truncate font-mono text-[11px] text-rc-muted-d">
                    {stealth ? a.id.slice(0, 8) : a.email}
                  </div>
                </div>
                {a.score > 0 && <ScoreRing value={a.score} size={40} />}
              </div>

              <div className="mb-2.5 flex flex-wrap gap-1">
                {a.langs.map((l) => (
                  <span
                    key={l}
                    className="rounded-[3px] bg-rc-paper-2 px-1.5 py-0.5 font-mono text-[11px] text-rc-muted"
                  >
                    {l}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <StatusBadge status={a.status} />
                <div className="text-[11.5px] text-rc-muted">
                  {stealth && a.client !== '—'
                    ? '••••'
                    : a.client !== '—'
                      ? a.client
                      : 'Unassigned'}
                  {!stealth && <span className="text-rc-muted-d"> · ${a.rate}/hr</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!noAccess && meta.totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3 text-[13px]">
          {meta.page > 1 ? (
            <Link
              href={buildHref(pathname, query, meta.page - 1)}
              className="rounded-md border border-rc-line bg-white px-3 py-1.5 hover:bg-rc-paper-2"
            >
              ← Previous
            </Link>
          ) : (
            <span className="rounded-md border border-rc-line px-3 py-1.5 text-rc-muted-d">
              ← Previous
            </span>
          )}
          <span className="text-rc-muted">
            Page {meta.page} of {meta.totalPages} · {meta.total} agents
          </span>
          {meta.page < meta.totalPages ? (
            <Link
              href={buildHref(pathname, query, meta.page + 1)}
              className="rounded-md border border-rc-line bg-white px-3 py-1.5 hover:bg-rc-paper-2"
            >
              Next →
            </Link>
          ) : (
            <span className="rounded-md border border-rc-line px-3 py-1.5 text-rc-muted-d">
              Next →
            </span>
          )}
        </div>
      )}
    </div>
  )
}
