'use client'

import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Chip } from '@/components/ui/Chip'
import { ScoreRing } from '@/components/ui/ScoreRing'
import dynamic from 'next/dynamic'
import '@/app/network.css'

const AgentSpeedPanel = dynamic(
  () => import('@/components/network/agent-self/AgentSpeedPanel').then(m => m.AgentSpeedPanel),
  { ssr: false }
)

const ITEMS = [
  { id: 'monitor',   label: '2nd monitor',           desc: '1080p or better, for multi-tasking across tools',            icon: 'spreadsheet' },
  { id: 'pc',        label: 'PC / Laptop',           desc: 'Meets RemConnect specs · i5 / 8GB / 256GB min',             icon: 'code' },
  { id: 'router',    label: 'Router / Ethernet',     desc: 'Hard-wired ethernet preferred · ≥10 Mbps down',             icon: 'globe' },
  { id: 'powerbank', label: 'Heavy-duty power bank', desc: 'Backup during outages · min 30000 mAh / UPS',               icon: 'bolt' },
  { id: 'desk',      label: 'Proper desk',           desc: 'Dedicated workspace · no bed / couch',                      icon: 'briefcase' },
  { id: 'headset',   label: 'Headset',               desc: 'Noise-cancelling · USB or approved model',                  icon: 'headset' },
  { id: 'charger',   label: 'Charging station',      desc: 'Reliable charging for phone + power bank',                  icon: 'lightning' },
  { id: 'fire',      label: 'Mini fire extinguisher',desc: 'Safety requirement for home-office setup',                  icon: 'shield' },
]

const DEMO_STATE: Record<string, { uploaded: boolean; verdict?: 'satisfactory' | 'needs-fix' | 'pending'; reviewer?: string; when?: string; note?: string }> = {
  monitor:   { uploaded: true,  verdict: 'satisfactory', reviewer: 'Ops · Mekdes', when: 'Apr 14' },
  pc:        { uploaded: true,  verdict: 'satisfactory', reviewer: 'Ops · Mekdes', when: 'Apr 14' },
  router:    { uploaded: true,  verdict: 'satisfactory', reviewer: 'Ops · Samuel', when: 'Apr 15' },
  powerbank: { uploaded: true,  verdict: 'needs-fix',    reviewer: 'Ops · Samuel', when: 'Apr 15', note: 'Capacity unclear in photo. Please retake showing label (mAh / Wh rating).' },
  desk:      { uploaded: true,  verdict: 'pending' },
  headset:   { uploaded: true,  verdict: 'satisfactory', reviewer: 'Ops · Mekdes', when: 'Apr 14' },
  charger:   { uploaded: false },
  fire:      { uploaded: false },
}

const VERDICT = {
  satisfactory: { label: 'Satisfactory',   chip: 'good' as const, icon: 'check' },
  'needs-fix':  { label: 'Needs retake',   chip: 'bad'  as const, icon: 'info' },
  pending:      { label: 'Pending review', chip: 'neutral' as const, icon: 'clock' },
}

export default function RemoteSetupPage() {
  const [state] = useState(DEMO_STATE)
  const approved = ITEMS.filter(it => state[it.id]?.verdict === 'satisfactory').length
  const uploaded = ITEMS.filter(it => state[it.id]?.uploaded).length
  const pct = Math.round(approved / ITEMS.length * 100)

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 1280, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ background: approved === ITEMS.length ? 'linear-gradient(135deg, #ecf5ee, #fff)' : 'linear-gradient(135deg, #f4f7fc, #fff)', border: '1px solid #e3e0d2', borderRadius: 10, padding: 24, marginBottom: 20, display: 'flex', gap: 24, alignItems: 'center' }}>
        <ScoreRing value={pct} size={80} thickness={7} color="var(--rc-blue)" />
        <div style={{ flex: 1 }}>
          <Chip style={{ marginBottom: 8 }}><Icon name="shield" size={10} /> Required · blocks deployment</Chip>
          <h1 style={{ fontFamily: 'var(--font-family-serif)', fontSize: 30, fontWeight: 400, letterSpacing: '-0.02em', margin: '6px 0 4px' }}>
            Remote setup verification
          </h1>
          <div style={{ fontSize: 13, color: '#5a6072', maxWidth: 620, lineHeight: 1.5 }}>
            Upload a clear photo of each station item. Ops reviews within 24h and marks <b>Satisfactory</b> or requests a retake.
            All 8 must be approved before you can accept client invitations.
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 14, fontSize: 12 }}>
            <div><b>{approved}</b> <span style={{ color: '#5a6072' }}>approved</span></div>
            <div><b>{uploaded - approved}</b> <span style={{ color: '#5a6072' }}>in review / retake</span></div>
            <div><b>{ITEMS.length - uploaded}</b> <span style={{ color: '#5a6072' }}>not started</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 6, background: '#0b1220', color: '#faf9f6', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <Icon name="upload" size={13} color="#fff" /> Upload all photos
          </button>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 6, border: '1px solid #e3e0d2', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <Icon name="help" size={13} /> Setup guide (PDF)
          </button>
        </div>
      </div>

      {/* Requirements table */}
      <div style={{ background: '#fff', border: '1px solid #e3e0d2', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1.6fr 1fr 160px 140px', padding: '10px 16px', background: '#f3f1ea', borderBottom: '1px solid #e3e0d2', fontSize: 10, color: '#5a6072', fontWeight: 600 }}>
          <div>#</div><div>Remote setup item</div><div>Image upload</div><div>Satisfactory</div><div />
        </div>
        {ITEMS.map((it, i) => {
          const s = state[it.id] || {}
          const v = s.verdict ? VERDICT[s.verdict] : null
          return (
            <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '40px 1.6fr 1fr 160px 140px', padding: '12px 16px', alignItems: 'center', borderBottom: i < ITEMS.length - 1 ? '1px solid #e3e0d2' : 'none', fontSize: 13 }}>
              <div style={{ color: '#5a6072', fontFamily: 'monospace' }}>{i + 1}</div>
              <div>
                <div style={{ fontWeight: 500 }}>{it.label}</div>
                <div style={{ fontSize: 11, color: '#5a6072', marginTop: 2 }}>{it.desc}</div>
              </div>
              <div style={{ fontSize: 12, color: s.uploaded ? '#0b1220' : '#5a6072' }}>
                {s.uploaded
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={11} color="#2f8d5c" /> Uploaded {s.when}</span>
                  : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="upload" size={11} color="#8b93a7" /> Not uploaded</span>}
              </div>
              <div>
                {v ? <Chip variant={v.chip} style={{ fontSize: 10 }}><Icon name={v.icon} size={10} /> {v.label}</Chip>
                   : <span style={{ fontSize: 11, color: '#5a6072' }}>—</span>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <button style={{ padding: '5px 10px', fontSize: 11, borderRadius: 6, border: (!s.uploaded || s.verdict === 'needs-fix') ? 'none' : '1px solid #e3e0d2', background: (!s.uploaded || s.verdict === 'needs-fix') ? '#0b1220' : 'transparent', color: (!s.uploaded || s.verdict === 'needs-fix') ? '#fff' : '#0b1220', cursor: 'pointer', fontWeight: 500 }}>
                  {!s.uploaded ? 'Upload' : s.verdict === 'needs-fix' ? 'Retake' : s.verdict === 'pending' ? 'Replace' : 'View'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Speed test panel */}
      <div className="net-scope" style={{ marginBottom: 28 }}>
        <AgentSpeedPanel/>
      </div>

      {/* Gallery */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-family-serif)', fontSize: 22, letterSpacing: '-0.02em' }}>Gallery</div>
          <div style={{ fontSize: 12, color: '#5a6072' }}>Visible to Ops during review and to clients in your assigned profile.</div>
        </div>
        <div style={{ fontSize: 11, color: '#5a6072', fontWeight: 600 }}>Good lighting, label visible where possible, wide angle for the desk shot.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {ITEMS.map(it => {
          const s = state[it.id] || {}
          const v = s.verdict ? VERDICT[s.verdict] : null
          return (
            <div key={it.id} style={{ background: '#fff', border: '1px solid #e3e0d2', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: 140 }}>
                {s.uploaded
                  ? <div className="rc-placeholder" style={{ height: '100%', borderRadius: 0 }}><span style={{ padding: 8 }}>{it.label} · photo</span></div>
                  : <div style={{ height: '100%', background: '#f3f1ea', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#5a6072' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fff', border: '1px dashed #e3e0d2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="upload" size={18} color="#8b93a7" />
                      </div>
                      <div style={{ fontSize: 11 }}>No photo uploaded</div>
                    </div>
                }
                {v && (
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <Chip variant={v.chip} style={{ fontSize: 10 }}><Icon name={v.icon} size={10} /> {v.label}</Chip>
                  </div>
                )}
              </div>
              <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Icon name={it.icon} size={14} color="#5a6072" />
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{it.label}</div>
                </div>
                <div style={{ fontSize: 11.5, color: '#5a6072', lineHeight: 1.5, marginBottom: 10 }}>{it.desc}</div>
                {s.verdict === 'needs-fix' && s.note && (
                  <div style={{ fontSize: 11.5, padding: 8, background: 'rgba(181,72,56,0.06)', border: '1px solid rgba(181,72,56,0.2)', borderRadius: 6, color: '#8a362a', marginBottom: 10, lineHeight: 1.45 }}>
                    <b>Reviewer note:</b> {s.note}
                  </div>
                )}
                {s.uploaded && s.reviewer && (
                  <div style={{ fontSize: 10, color: '#5a6072', fontWeight: 600, marginBottom: 10 }}>Reviewed by {s.reviewer} · {s.when}</div>
                )}
                <div style={{ marginTop: 'auto' }}>
                  <button style={{ width: '100%', padding: '6px 10px', fontSize: 12, borderRadius: 6, border: (!s.uploaded || s.verdict === 'needs-fix') ? 'none' : '1px solid #e3e0d2', background: (!s.uploaded || s.verdict === 'needs-fix') ? '#0b1220' : 'transparent', color: (!s.uploaded || s.verdict === 'needs-fix') ? '#fff' : '#0b1220', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                    <Icon name="upload" size={12} color={(!s.uploaded || s.verdict === 'needs-fix') ? '#fff' : '#0b1220'} />
                    {!s.uploaded ? 'Upload photo' : s.verdict !== 'satisfactory' ? 'Retake' : 'View photo'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
