'use client'
import { FEATURED_JOBS } from '@/lib/landing-data'
import { useInView } from './useLandingHooks'

const TYPE_COLOR: Record<string, { bg: string; text: string }> = {
  'Full Time': { bg: 'rgba(29,111,214,0.12)', text: 'var(--rc-blue)' },
  'Part Time': { bg: 'rgba(63,107,78,0.12)', text: 'var(--rc-green)' },
  'Contract':  { bg: 'rgba(192,138,42,0.12)', text: 'var(--rc-warn)' },
}

export default function FeaturedJobs() {
  const { ref, visible } = useInView()
  return (
    <section
      ref={ref}
      className="l-section-pad"
      style={{
        background: 'var(--rc-paper)',
        padding: '112px 48px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          marginBottom: '64px',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px',
        }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: '10px', letterSpacing: '0.15em',
              color: 'var(--rc-blue)', textTransform: 'uppercase',
              margin: '0 0 14px',
            }}>
              Open roles
            </p>
            <h2 style={{
              fontFamily: 'var(--font-family-display)',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 3.6vw, 3.2rem)',
              color: 'var(--rc-ink)', letterSpacing: '-0.025em',
              lineHeight: 1.08, margin: 0,
            }}>
              Featured<br />
              <em style={{
                fontFamily: 'var(--font-family-serif)',
                fontStyle: 'italic', fontWeight: 400,
              }}>opportunities</em>
            </h2>
          </div>
          <a
            href="/jobs"
            style={{
              color: 'var(--rc-muted)', fontSize: '14px',
              textDecoration: 'none', fontWeight: 500,
              paddingBottom: '2px',
              borderBottom: '1px solid var(--rc-line)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--rc-ink)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--rc-muted)' }}
          >
            Browse all jobs →
          </a>
        </div>

        {/* Bento: 1 large left (spans 2 rows) + 2 stacked right */}
        <div
          className="l-jobs-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gridTemplateRows: 'auto auto',
            gap: '16px',
          }}
        >
          {/* Feature card */}
          <div
            className="l-jobs-feature"
            style={{
              gridRow: '1 / 3',
              background: 'var(--rc-ink)',
              borderRadius: '16px', padding: '44px',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '380px',
              border: '1px solid rgba(255,255,255,0.04)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(36px)',
              transition: 'opacity 0.72s ease, transform 0.72s ease',
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  padding: '4px 11px', borderRadius: '5px',
                  fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em',
                  background: 'rgba(29,111,214,0.15)', color: 'var(--rc-blue-soft)',
                }}>
                  {FEATURED_JOBS[0].employmentType}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--rc-muted-d)' }}>
                  {FEATURED_JOBS[0].location}
                </span>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-family-display)',
                fontWeight: 700, fontSize: '1.55rem',
                color: 'var(--rc-paper)', letterSpacing: '-0.02em',
                lineHeight: 1.22, margin: '0 0 16px',
              }}>
                {FEATURED_JOBS[0].title}
              </h3>
              <p style={{
                fontSize: '14px', lineHeight: 1.68,
                color: 'var(--rc-muted-d)', margin: 0,
                maxWidth: '380px',
              }}>
                {FEATURED_JOBS[0].blurb}
              </p>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '36px', flexWrap: 'wrap', gap: '12px',
            }}>
              <span style={{
                fontFamily: 'var(--font-family-display)',
                fontWeight: 700, fontSize: '1.1rem', color: 'var(--rc-paper)',
              }}>
                {FEATURED_JOBS[0].salaryRange} ETB
              </span>
              <a
                href="/apply"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'var(--rc-blue)', color: '#fff',
                  padding: '11px 22px', borderRadius: '7px',
                  fontWeight: 600, fontSize: '13px', textDecoration: 'none',
                  transition: 'opacity 0.15s, transform 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Apply now →
              </a>
            </div>
          </div>

          {/* Two stacked cards */}
          {FEATURED_JOBS.slice(1).map((job, i) => {
            const tc = TYPE_COLOR[job.employmentType] ?? TYPE_COLOR['Full Time']
            return (
              <div
                key={job.id}
                style={{
                  background: 'var(--rc-paper-2)',
                  border: '1px solid var(--rc-line)',
                  borderRadius: '14px', padding: '28px 32px',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'space-between', gap: '16px',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(36px)',
                  transition: `opacity 0.65s ease ${(i + 1) * 110}ms, transform 0.65s ease ${(i + 1) * 110}ms, background 0.2s`,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--rc-paper-3)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--rc-paper-2)' }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '3px 9px', borderRadius: '4px',
                      fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em',
                      background: tc.bg, color: tc.text,
                    }}>
                      {job.employmentType}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--rc-muted)' }}>
                      {job.location}
                    </span>
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-family-display)',
                    fontWeight: 700, fontSize: '1.05rem',
                    color: 'var(--rc-ink)', letterSpacing: '-0.01em',
                    lineHeight: 1.3, margin: '0 0 8px',
                  }}>
                    {job.title}
                  </h3>
                  <p style={{
                    fontSize: '13px', color: 'var(--rc-muted)',
                    lineHeight: 1.58, margin: 0,
                  }}>
                    {job.blurb}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: '12px', color: 'var(--rc-ink)', fontWeight: 600,
                  }}>
                    {job.salaryRange} ETB
                  </span>
                  <a
                    href="/apply"
                    style={{
                      fontSize: '13px', fontWeight: 600,
                      color: 'var(--rc-blue)', textDecoration: 'none',
                      paddingBottom: '1px',
                      borderBottom: '1px solid rgba(29,111,214,0.3)',
                    }}
                  >
                    Apply →
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
