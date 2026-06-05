import Link from 'next/link'
import { LANDING_FEATURE_AGENT, LANDING_TRUST_AVATARS } from '@/lib/landing-data'

const AVATAR_IMG: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit', display: 'block' }

export default function Hero() {
  const f = LANDING_FEATURE_AGENT
  return (
    <header className="lp-hero">
      <div className="lp-hero-bg">
        <img src="/assets/team-hero.png" alt="RemConnect agents working remotely in Addis Ababa" />
      </div>
      <div className="lp-hero-grain" />
      <div className="lp-hero-reveal">
        <span className="ln" />
        <span>RemConnect · Remote support careers</span>
      </div>

      <div className="lp-hero-chip">
        <span className="av"><img src={f.photo} alt={f.name} style={AVATAR_IMG} /></span>
        <span>
          <span className="nm">{f.short}</span>
          <span className="rl" style={{ display: 'block' }}>
            Sales Development · placed
          </span>
        </span>
        <span className="qa">
          <b className="tnum">{f.qa}</b>
          <small>QA score</small>
        </span>
      </div>

      <div className="lp-hero-inner">
        <div className="lp-hero-content">
          <span className="lp-hero-eyebrow">
            <span className="d" />
            Now recruiting · cohort 14 starts in 2 weeks
          </span>
          <h1 className="lp-hero-h1">
            Build a career in global support, from <em>home</em>.
          </h1>
          <p className="lp-hero-sub">
            We train you, certify you, and place you on a team at a US or international company. You&apos;re paid in USD
            or ETB, working from your own remote setup — no cold applications, no agency shuffle.
          </p>
          <div className="lp-hero-cta">
            <Link className="lp-btn lp-btn-blue" href="/apply">
              Apply for free
              <span className="pip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
            <a className="lp-textlink on-dark" data-scroll="video">
              Watch how it works
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </a>
          </div>
          <div className="lp-hero-trust">
            <div className="lp-hero-avs">
              {LANDING_TRUST_AVATARS.map((a) => (
                <span className="a" key={a.name} style={{ overflow: 'hidden' }}>
                  <img src={a.photo} alt={a.name} style={AVATAR_IMG} />
                </span>
              ))}
              <span className="a" style={{ background: 'var(--rc-amber)' }}>+</span>
            </div>
            <div>
              <div className="v tnum">480+</div>
              <div className="l">Agents placed</div>
            </div>
            <div>
              <div className="v">USD / ETB</div>
              <div className="l">Paid your way</div>
            </div>
            <div>
              <div className="v tnum">6 wks</div>
              <div className="l">To placement</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
