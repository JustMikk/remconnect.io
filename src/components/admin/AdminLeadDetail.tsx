'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import type { ApiLeadDetail } from '@/types/api'
import { grantLeadAccessAction, revokeLeadAccessAction } from '@/app/admin/(authed)/leads/actions'

interface AdminLeadDetailProps {
  lead: ApiLeadDetail
  permittedUserIds: string[]
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null
  return (
    <div style={{ display: 'flex', gap: 16, padding: '8px 0', borderBottom: '1px solid #f3f1ea' }}>
      <span style={{ fontSize: 12, color: '#5a6072', minWidth: 140, fontWeight: 500 }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: '#0b1220' }}>{value}</span>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function AdminLeadDetail({ lead, permittedUserIds }: AdminLeadDetailProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleGrant(userId: string) {
    startTransition(async () => {
      const result = await grantLeadAccessAction(userId)
      if (result.error) setError(result.error)
    })
  }

  function handleRevoke(userId: string) {
    startTransition(async () => {
      const result = await revokeLeadAccessAction(userId)
      if (result.error) setError(result.error)
    })
  }

  return (
    <div style={{ padding: '28px 32px 60px', maxWidth: 900, margin: '0 auto' }}>
      <Link
        href="/admin/leads"
        style={{
          fontSize: 13,
          color: '#5a6072',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          marginBottom: 20,
        }}
      >
        ← Back to leads
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: 'var(--rc-serif)',
            fontSize: 28,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: '#0b1220',
            marginBottom: 4,
          }}
        >
          {lead.companyName}
        </h1>
        <div style={{ fontSize: 14, color: '#5a6072' }}>
          {lead.repName} ·{' '}
          <a href={`mailto:${lead.email}`} style={{ color: '#1d6fd6' }}>
            {lead.email}
          </a>
          {lead.website && (
            <>
              {' '}
              ·{' '}
              <a
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1d6fd6' }}
              >
                {lead.website}
              </a>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Lead info */}
        <div
          style={{ background: '#fff', border: '1px solid #e3e0d2', borderRadius: 10, padding: 20 }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#5a6072',
              marginBottom: 12,
            }}
          >
            Company details
          </h2>
          <InfoRow label="Founded" value={lead.foundedYear} />
          <InfoRow
            label="Company size"
            value={lead.companySize ? `${lead.companySize} employees` : undefined}
          />
          <InfoRow label="Submitted" value={formatDate(lead.createdAt)} />
          <InfoRow label="Status" value={lead.status} />
        </div>

        {/* Services */}
        <div
          style={{ background: '#fff', border: '1px solid #e3e0d2', borderRadius: 10, padding: 20 }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#5a6072',
              marginBottom: 12,
            }}
          >
            Services needed
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {lead.servicesNeeded.map((s) => (
              <span
                key={s}
                style={{
                  padding: '5px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  background: '#f3f1ea',
                  color: '#2a2f3c',
                  fontWeight: 500,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      {lead.additionalNotes && (
        <div
          style={{
            marginTop: 24,
            background: '#fff',
            border: '1px solid #e3e0d2',
            borderRadius: 10,
            padding: 20,
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#5a6072',
              marginBottom: 10,
            }}
          >
            Additional notes
          </h2>
          <p style={{ fontSize: 14, color: '#2a2f3c', lineHeight: 1.6 }}>{lead.additionalNotes}</p>
        </div>
      )}

      {/* AI call script */}
      {lead.aiCallScript && (
        <div
          style={{
            marginTop: 24,
            background: '#fff',
            border: '1px solid #e3e0d2',
            borderRadius: 10,
            padding: 20,
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#5a6072',
              marginBottom: 10,
            }}
          >
            AI call script
          </h2>
          <pre
            style={{
              fontSize: 13,
              color: '#2a2f3c',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              margin: 0,
            }}
          >
            {lead.aiCallScript}
          </pre>
        </div>
      )}

      {/* Video */}
      {lead.muxPlaybackUrl && (
        <div
          style={{
            marginTop: 24,
            background: '#fff',
            border: '1px solid #e3e0d2',
            borderRadius: 10,
            padding: 20,
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#5a6072',
              marginBottom: 10,
            }}
          >
            Recorded intro video
          </h2>
          <video
            src={lead.muxPlaybackUrl}
            controls
            style={{ width: '100%', maxWidth: 560, borderRadius: 8, background: '#0b1220' }}
          />
        </div>
      )}

      {/* Video access permissions */}
      <div
        style={{
          marginTop: 24,
          background: '#fff',
          border: '1px solid #e3e0d2',
          borderRadius: 10,
          padding: 20,
        }}
      >
        <h2
          style={{
            fontSize: 13,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#5a6072',
            marginBottom: 4,
          }}
        >
          Video queue access
        </h2>
        <p style={{ fontSize: 12, color: '#5a6072', marginBottom: 14 }}>
          Grant an agent access to the lead video queue so they can record a personalised intro.
        </p>

        {error && (
          <div
            style={{
              marginBottom: 12,
              padding: '8px 12px',
              borderRadius: 6,
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#b91c1c',
              fontSize: 12,
            }}
          >
            {error}
          </div>
        )}

        {permittedUserIds.length === 0 ? (
          <p style={{ fontSize: 13, color: '#5a6072' }}>No agents have queue access yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {permittedUserIds.map((userId) => (
              <div
                key={userId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #f3f1ea',
                }}
              >
                <span style={{ fontSize: 13, fontFamily: 'monospace', color: '#5a6072' }}>
                  {userId}
                </span>
                <button
                  disabled={isPending}
                  onClick={() => handleRevoke(userId)}
                  style={{
                    fontSize: 11,
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '1px solid #fca5a5',
                    background: '#fef2f2',
                    color: '#b91c1c',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
