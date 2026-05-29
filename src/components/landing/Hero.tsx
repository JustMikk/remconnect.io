'use client'
import { useEffect, useState } from 'react'
import { HERO_SUBHEAD_DISPLAY, APPLY_HREF } from '@/lib/landing-data'

const AGENTS = [
  {
    img: '/agents/ermias-lemma.png',
    name: 'Ermias Lemma',
    role: 'Full Stack Developer',
    rotate: -4,
    top: 0,
    left: 0,
  },
  {
    img: '/agents/nahom-dereje.jpg',
    name: 'Nahom Dereje',
    role: 'Customer Success',
    rotate: 2,
    top: 72,
    left: 96,
  },
  {
    img: '/agents/tensae-wubeshet.jpg',
    name: 'Tensae Wubeshet',
    role: 'AI Operations',
    rotate: -1,
    top: 148,
    left: 192,
  },
]

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30)
    return () => clearTimeout(t)
  }, [])

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: 'var(--rc-ink)',
      overflow: 'hidden',
    }}>
      {/* Ambient radial blobs */}
      <div style={{
        position: 'absolute', top: '-5%', left: '30%',
        width: '900px', height: '700px', pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, rgba(29,111,214,0.11) 0%, transparent 62%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '-10%',
        width: '500px', height: '500px', pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, rgba(29,111,214,0.06) 0%, transparent 70%)',
      }} />

      {/* Subtle grid lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.45,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '76px 76px',
      }} />

      <div
        className="l-hero-pad"
        style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: '1280px',
          margin: '0 auto', padding: '132px 48px 100px',
        }}
      >
        <div
          className="l-hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 440px',
            gap: '72px',
            alignItems: 'center',
          }}
        >
          {/* Left: copy */}
          <div>
            <p
              className={mounted ? 'l-in' : ''}
              style={{
                opacity: mounted ? undefined : 0,
                fontFamily: 'var(--font-family-mono)',
                fontSize: '10px', letterSpacing: '0.15em',
                color: 'var(--rc-blue)', textTransform: 'uppercase',
                margin: '0 0 30px',
              }}
            >
              Est. 2023 · Addis Ababa, Ethiopia · Global reach
            </p>

            <h1
              className={mounted ? 'l-in l-d1' : ''}
              style={{
                opacity: mounted ? undefined : 0,
                fontFamily: 'var(--font-family-display)',
                fontSize: 'clamp(2.8rem, 4.6vw, 5rem)',
                fontWeight: 800, lineHeight: 1.04,
                letterSpacing: '-0.025em',
                color: 'var(--rc-paper)',
                maxWidth: '640px',
                margin: '0 0 28px',
              }}
            >
              Premiere Talent<br />
              meets{' '}
              <em style={{
                fontFamily: 'var(--font-family-serif)',
                fontStyle: 'italic', fontWeight: 400,
                color: 'var(--rc-blue-soft)',
              }}>
                Premiere<br />Opportunities
              </em>
            </h1>

            <p
              className={mounted ? 'l-in l-d2' : ''}
              style={{
                opacity: mounted ? undefined : 0,
                fontSize: '1.1rem', lineHeight: 1.72,
                color: 'var(--rc-muted-d)',
                maxWidth: '460px', margin: '0 0 44px',
              }}
            >
              {HERO_SUBHEAD_DISPLAY}
            </p>

            <div
              className={mounted ? 'l-in l-d3' : ''}
              style={{
                opacity: mounted ? undefined : 0,
                display: 'flex', flexWrap: 'wrap', gap: '12px',
                marginBottom: '60px',
              }}
            >
              <a
                href={APPLY_HREF}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  background: 'var(--rc-blue)', color: '#fff',
                  padding: '14px 28px', borderRadius: '8px',
                  fontWeight: 600, fontSize: '15px', textDecoration: 'none',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 10px 28px rgba(29,111,214,0.38)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Apply for free
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 7h9M7 2.5l4.5 4.5L7 11.5" />
                </svg>
              </a>

              <a
                href="/for-clients"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  background: 'transparent', color: 'var(--rc-paper)',
                  padding: '14px 28px', borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.14)',
                  fontWeight: 600, fontSize: '15px', textDecoration: 'none',
                  transition: 'background 0.18s, border-color 0.18s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
                }}
              >
                Hire talent
              </a>
            </div>

            {/* Inline stats */}
            <div
              className={mounted ? 'l-in l-d4' : ''}
              style={{
                opacity: mounted ? undefined : 0,
                display: 'flex', gap: '36px', flexWrap: 'wrap',
              }}
            >
              {[
                { n: '30+', label: 'jobs matched' },
                { n: 'Free', label: 'for candidates' },
                { n: '3+', label: 'years active' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: 'var(--font-family-display)',
                    fontWeight: 800, fontSize: '1.6rem',
                    color: 'var(--rc-paper)', lineHeight: 1,
                    letterSpacing: '-0.02em',
                  }}>
                    {s.n}
                  </div>
                  <div style={{
                    fontSize: '11px', color: 'var(--rc-muted-d)',
                    marginTop: '5px', letterSpacing: '0.04em',
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: video stack */}
          <div
            className={`l-hero-videos ${mounted ? 'l-in-scale l-d3' : ''}`}
            style={{
              opacity: mounted ? undefined : 0,
              position: 'relative', height: '520px',
            }}
          >
            {AGENTS.map((agent, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '248px', height: '330px',
                  top: `${agent.top}px`, left: `${agent.left}px`,
                  borderRadius: '15px', overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transform: `rotate(${agent.rotate}deg)`,
                  zIndex: AGENTS.length - i,
                  boxShadow: '0 28px 70px rgba(0,0,0,0.58)',
                  transition: 'transform 0.38s cubic-bezier(0.16,1,0.3,1), z-index 0s, box-shadow 0.38s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.transform = 'rotate(0deg) scale(1.04) translateY(-6px)'
                  el.style.zIndex = '20'
                  el.style.boxShadow = '0 40px 90px rgba(0,0,0,0.72)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.transform = `rotate(${agent.rotate}deg)`
                  el.style.zIndex = String(AGENTS.length - i)
                  el.style.boxShadow = '0 28px 70px rgba(0,0,0,0.58)'
                }}
              >
                <img
                  src={agent.img}
                  alt={agent.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute', inset: '0',
                  background: 'linear-gradient(to top, rgba(11,18,32,0.85) 0%, rgba(11,18,32,0.15) 40%, transparent 60%)',
                }} />
                <div style={{ position: 'absolute', bottom: '14px', left: '14px' }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '13px', color: '#fff', lineHeight: 1.3 }}>
                    {agent.name}
                  </p>
                  <p style={{ margin: '3px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>
                    {agent.role}
                  </p>
                </div>
              </div>
            ))}

            {/* Decorative floating rings */}
            <div
              className="l-float"
              style={{
                position: 'absolute', bottom: '-24px', right: '-24px',
                width: '130px', height: '130px', borderRadius: '50%',
                border: '1px solid rgba(29,111,214,0.22)',
                pointerEvents: 'none',
              }}
            />
            <div style={{
              position: 'absolute', bottom: '14px', right: '14px',
              width: '64px', height: '64px', borderRadius: '50%',
              border: '1px solid rgba(29,111,214,0.38)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="l-scroll-cue"
        style={{
          position: 'absolute', bottom: '32px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          color: 'rgba(255,255,255,0.22)',
          fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase',
        }}
      >
        <span>scroll</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 2v10M3 8l4 4 4-4" />
        </svg>
      </div>
    </section>
  )
}
