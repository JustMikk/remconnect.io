'use client'
import { useInView } from './useLandingHooks'

const AGENTS = [
  {
    img: '/agents/ermias-lemma.png',
    name: 'Ermias Lemma',
    role: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'Python', 'AI APIs'],
    exp: '4 yrs exp.',
  },
  {
    img: '/agents/nahom-dereje.jpg',
    name: 'Nahom Dereje',
    role: 'Customer Success Specialist',
    skills: ['CRM', 'Zendesk', 'Retention', 'Onboarding'],
    exp: '3 yrs exp.',
  },
  {
    img: '/agents/tensae-wubeshet.jpg',
    name: 'Tensae Wubeshet',
    role: 'AI Operations Analyst',
    skills: ['Prompt Eng.', 'Data Analysis', 'QA', 'Python'],
    exp: '2 yrs exp.',
  },
]

export default function AgentShowcase() {
  const { ref, visible } = useInView()
  return (
    <section
      ref={ref}
      className="l-section-pad"
      style={{
        background: 'var(--rc-ink-2)',
        padding: '112px 48px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          marginBottom: '72px',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px',
        }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: '10px', letterSpacing: '0.15em',
              color: 'var(--rc-blue)', textTransform: 'uppercase',
              margin: '0 0 14px',
            }}>
              Our talent
            </p>
            <h2 style={{
              fontFamily: 'var(--font-family-display)',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 3.6vw, 3.2rem)',
              color: 'var(--rc-paper)', letterSpacing: '-0.025em',
              lineHeight: 1.08, margin: 0,
            }}>
              Meet the professionals<br />
              <em style={{
                fontFamily: 'var(--font-family-serif)',
                fontStyle: 'italic', fontWeight: 400,
                color: 'var(--rc-blue-soft)',
              }}>behind the results</em>
            </h2>
          </div>
          <a
            href="/jobs"
            style={{
              color: 'var(--rc-muted-d)', fontSize: '14px',
              textDecoration: 'none', fontWeight: 500,
              paddingBottom: '2px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--rc-paper)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--rc-muted-d)' }}
          >
            Browse all jobs →
          </a>
        </div>

        <div
          className="l-agent-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}
        >
          {AGENTS.map((agent, i) => (
            <div
              key={i}
              style={{
                borderRadius: '14px', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'var(--rc-ink)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(44px) scale(0.96)',
                transition: `opacity 0.72s ease ${i * 120}ms, transform 0.72s ease ${i * 120}ms`,
              }}
            >
              {/* Photo */}
              <div style={{ position: 'relative', height: '270px', overflow: 'hidden' }}>
                <img
                  src={agent.img}
                  alt={agent.name}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.55s cubic-bezier(0.16,1,0.3,1)',
                  }}
                  onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)' }}
                  onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)' }}
                />
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(11,18,32,0.5) 0%, transparent 50%)',
                }} />
                {/* Placed badge */}
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  background: 'rgba(47,141,92,0.88)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px', borderRadius: '999px',
                  fontSize: '10px', fontWeight: 600, color: '#fff',
                  letterSpacing: '0.06em',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <span
                    className="rc-pulse"
                    style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: '#fff', display: 'inline-block',
                    }}
                  />
                  Placed
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '20px 20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-family-display)',
                      fontWeight: 700, fontSize: '1rem',
                      color: 'var(--rc-paper)', margin: '0 0 3px',
                      letterSpacing: '-0.01em',
                    }}>
                      {agent.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--rc-blue-soft)' }}>
                      {agent.role}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '11px', color: 'var(--rc-muted-d)',
                    fontFamily: 'var(--font-family-mono)',
                  }}>
                    {agent.exp}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {agent.skills.map(s => (
                    <span key={s} style={{
                      fontSize: '10px', padding: '3px 8px', borderRadius: '4px',
                      background: 'rgba(29,111,214,0.12)',
                      color: 'var(--rc-blue-soft)', fontWeight: 500,
                      letterSpacing: '0.02em',
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
