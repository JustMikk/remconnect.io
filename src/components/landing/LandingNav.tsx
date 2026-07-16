import Link from 'next/link'

export default function LandingNav() {
  return (
    <>
      {/* ============ NAV ============ */}
      <div className="lp-nav-wrap">
        <nav className="lp-nav" id="lpNav">
          <a className="lp-logo" href="#" aria-label="RemConnect home">
            <img
              src="/assets/remconnect-logo.png"
              alt="RemConnect"
              style={{ height: 42, width: 'auto', display: 'block' }}
            />
          </a>

          <div className="lp-nav-links">
            <div className="lp-navitem">
              <button>
                Roles
                <svg
                  className="caret"
                  width="11"
                  height="11"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 11 3 6h10z" />
                </svg>
              </button>
              <div className="lp-mega">
                <div>
                  <div className="lp-mega-h">Support disciplines</div>
                  <div className="lp-mega-links">
                    <a className="lp-mega-link" data-scroll="salaries">
                      <span>
                        <span className="t">Customer Support</span>
                        <span className="s">Chat, email &amp; phone for consumer brands</span>
                      </span>
                      <span className="pay">Entry-friendly</span>
                    </a>
                    <a className="lp-mega-link" data-scroll="salaries">
                      <span>
                        <span className="t">Technical Support</span>
                        <span className="s">Troubleshoot SaaS &amp; telecom products</span>
                      </span>
                      <span className="pay">Intermediate</span>
                    </a>
                    <a className="lp-mega-link" data-scroll="salaries">
                      <span>
                        <span className="t">Virtual Assistant</span>
                        <span className="s">Inbox, scheduling &amp; research</span>
                      </span>
                      <span className="pay">Entry-friendly</span>
                    </a>
                    <a className="lp-mega-link" data-scroll="salaries">
                      <span>
                        <span className="t">QA &amp; Team Lead</span>
                        <span className="s">Coach agents and run cohorts</span>
                      </span>
                      <span className="pay">Leadership</span>
                    </a>
                  </div>
                </div>
                <div className="lp-mega-cards">
                  <a className="lp-mega-card group" data-scroll="stories">
                    <img
                      className="lp-img"
                      src="/assets/team-hero.png"
                      alt="RemConnect cohort in training"
                    />
                    <div className="ov" />
                    <div className="lb">
                      <div className="k">Cohort 14</div>
                      <div className="v">In training</div>
                    </div>
                  </a>
                  <a className="lp-mega-card group" data-scroll="why">
                    <img
                      className="lp-img"
                      src="/agents/tensae-wubeshet.jpg"
                      alt="RemConnect agent Tensae Wubeshet"
                    />
                    <div className="ov" />
                    <div className="lb">
                      <div className="k">Your profile</div>
                      <div className="v">Travels with you</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className="lp-navitem">
              <a data-scroll="how">Method</a>
            </div>
            <div className="lp-navitem">
              <a data-scroll="stories">Stories</a>
            </div>
            <div className="lp-navitem">
              <a data-scroll="faq">FAQ</a>
            </div>
          </div>

          <div className="lp-nav-right">
            <Link className="lp-nav-employer" href="/login">
              Log in
            </Link>
            <Link className="lp-nav-apply" href="/apply">
              Apply
              <span className="pip">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
            <button className="lp-burger" id="lpBurger" aria-label="Menu">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* ============ MOBILE MENU ============ */}
      <div className="lp-mobile" id="lpMobile">
        <div className="lp-mobile-top">
          <span className="lp-logo">
            <img
              src="/assets/remconnect-logo.png"
              alt="RemConnect"
              style={{
                height: 42,
                width: 'auto',
                display: 'block',
                filter: 'brightness(0) invert(1)',
              }}
            />
          </span>
          <button className="lp-mobile-close" id="lpMobileClose" aria-label="Close">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav>
          <a data-scroll="salaries">Roles</a>
          <a data-scroll="how">Method</a>
          <a data-scroll="stories">Stories</a>
          <a data-scroll="faq">FAQ</a>
          <Link href="/apply">Apply</Link>
          <Link href="/login">Log in</Link>
        </nav>
        <div className="lp-mobile-foot">
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--rc-mono)',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '8px',
            }}
          >
            Get in touch
          </span>
          <a href="#contact" style={{ color: '#fff', fontSize: '18px' }}>
            apply@remconnect.io
          </a>
        </div>
      </div>
    </>
  )
}
