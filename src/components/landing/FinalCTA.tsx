import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="lp-final" id="contact" data-screen-label="Final CTA">
      <div className="lp-final-inner">
        <h2 className="lp-final-title reveal">
          Your next career
          <br />
          starts here.
        </h2>
        <div className="lp-final-rule reveal d1" />
        <div className="lp-stack" id="lpStack">
          <div className="lp-stack-layer l3" data-layer="3" />
          <div className="lp-stack-layer l2" data-layer="2" />
          <div className="lp-stack-layer l1" data-layer="1" />
          <div className="lp-stack-card">
            <div>
              <span className="eyebrow">Apply in about 10 minutes</span>
              <h3>
                Free to apply, free to train, <em>paid to grow.</em>
              </h3>
              <div className="lp-stack-cta">
                <Link className="lp-btn lp-btn-blue" href="/apply">
                  Apply for free
                  <span className="pip">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    >
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
                <Link className="lp-textlink on-dark" href="/apply?screen=login">
                  Already an agent? Sign in
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="lp-stack-note">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                A recruiter replies within 3 business days · No fees, ever
              </div>
            </div>
            <div className="lp-stack-media group">
              <img
                className="lp-img"
                src="/agents/kalkidan.png"
                alt="RemConnect agent Kalkidan Yilkal"
                style={{ objectPosition: 'center 20%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
