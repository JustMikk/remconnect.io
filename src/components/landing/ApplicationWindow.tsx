import Link from 'next/link'

export default function ApplicationWindow() {
  return (
    <section className="lp-section" id="jobs" data-screen-label="Application window">
      <div className="lp-appwin reveal">
        <div className="lp-appwin-grid" />
        <div className="lp-appwin-l">
          <span className="kick">
            <span className="d" />
            Applications open
          </span>
          <h2>
            We recruit in <em>cohorts.</em>
          </h2>
          <p>
            RemConnect doesn&apos;t run an endless job board. We open applications for a set window, train a cohort
            together, and close intake once we reach our quota — so everyone gets real coaching and a real placement.
            Cohort 14 is accepting applications now.
          </p>
          <div className="lp-appwin-cta">
            <Link className="lp-btn lp-btn-on-blue" href="/apply">
              Apply before it closes
              <span className="pip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
            <a className="lp-textlink on-dark" data-scroll="how">
              How a cohort works
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
        <div className="lp-cohort">
          <div className="lp-cohort-top">
            <div className="nm">Cohort 14</div>
            <div className="st">
              <span className="d" />
              Accepting now
            </div>
          </div>
          <div className="lp-cohort-bar">
            <span data-fill="78" />
          </div>
          <div className="lp-cohort-meta">
            <span>
              <b className="tnum">78%</b> of seats filled
            </span>
            <span>
              <b className="tnum">~40</b> seats left
            </span>
          </div>
          <div className="lp-cohort-note">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <span>
              Applications close automatically once the cohort is full. The next intake opens after this one is placed.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
