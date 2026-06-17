'use client'

import Link from 'next/link'
import type { ApiLeadSummary } from '@/types/api'
import type { PaginationMeta } from '@/lib/data/leads'

interface AdminLeadsPageProps {
  leads: ApiLeadSummary[]
  meta: PaginationMeta
  page: number
  noAccess?: boolean
  error?: string
}

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  pending: { bg: 'rgba(192,138,42,0.12)', fg: '#7a5010' },
  contacted: { bg: 'rgba(29,111,214,0.10)', fg: '#0c3a7a' },
  qualified: { bg: 'rgba(47,141,92,0.12)', fg: '#1f5a3d' },
  closed: { bg: 'rgba(90,96,114,0.10)', fg: '#3a4058' },
}

function statusStyle(status: string) {
  return STATUS_COLORS[status.toLowerCase()] ?? { bg: '#f3f1ea', fg: '#5a6072' }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function AdminLeadsPage({ leads, meta, page, noAccess, error }: AdminLeadsPageProps) {
  if (noAccess) {
    return (
      <div style={{ padding: '60px 32px', textAlign: 'center', color: '#5a6072', fontSize: 14 }}>
        You don&apos;t have permission to view leads.
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '60px 32px', textAlign: 'center', color: '#5a6072', fontSize: 14 }}>
        {error}
      </div>
    )
  }

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Summary row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <p style={{ fontSize: 13, color: '#5a6072' }}>
          {meta.total} lead{meta.total !== 1 ? 's' : ''} total
        </p>
      </div>

      {leads.length === 0 ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#5a6072', fontSize: 14 }}>
          No leads yet.
        </div>
      ) : (
        <div
          style={{
            background: '#fff',
            border: '1px solid #e3e0d2',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f9f8f5', borderBottom: '1px solid #e3e0d2' }}>
                {['Company', 'Contact', 'Services', 'Status', 'Submitted', ''].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#5a6072',
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const { bg, fg } = statusStyle(lead.status)
                return (
                  <tr
                    key={lead.id}
                    style={{ borderBottom: '1px solid #e3e0d2' }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = '#fafaf8')
                    }
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '')}
                  >
                    <td style={{ padding: '13px 16px', fontWeight: 600 }}>{lead.companyName}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ fontWeight: 500 }}>{lead.repName}</div>
                      <div style={{ fontSize: 11, color: '#5a6072' }}>{lead.email}</div>
                    </td>
                    <td style={{ padding: '13px 16px', maxWidth: 240 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {lead.servicesNeeded.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            style={{
                              fontSize: 11,
                              padding: '2px 8px',
                              borderRadius: 999,
                              background: '#f3f1ea',
                              color: '#5a6072',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {s}
                          </span>
                        ))}
                        {lead.servicesNeeded.length > 3 && (
                          <span style={{ fontSize: 11, color: '#5a6072' }}>
                            +{lead.servicesNeeded.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          background: bg,
                          color: fg,
                        }}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', color: '#5a6072', whiteSpace: 'nowrap' }}>
                      {formatDate(lead.createdAt)}
                    </td>
                    <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: '#1d6fd6',
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/leads?page=${p}`}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: p === page ? 600 : 400,
                background: p === page ? '#0b1220' : '#fff',
                color: p === page ? '#fff' : '#2a2f3c',
                border: '1px solid #e3e0d2',
                textDecoration: 'none',
              }}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
