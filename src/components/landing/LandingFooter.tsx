export default function LandingFooter() {
  return (
    <footer className="lp-foot" data-screen-label="Footer">
      <div className="lp-foot-inner">
        <div className="lp-foot-top">
          <div>
            <img
              src="/assets/remconnect-logo.png"
              alt="RemConnect"
              style={{ height: 52, width: 'auto', display: 'block', marginBottom: 24, filter: 'brightness(0) invert(1)' }}
            />
            <h3>Ready to build your remote career?</h3>
            <p>
              RemConnect trains, certifies and places customer-support agents on teams at US and international
              companies. Data-driven, coaching-led, agent-first.
            </p>
            <div className="lp-foot-form">
              <input type="email" placeholder="Enter your email" />
              <button>Notify me</button>
            </div>
          </div>
          <div className="lp-foot-cols">
            <div>
              <h4>For agents</h4>
              <a>Apply for free</a>
              <a href="/home">Agent sign in</a>
              <a data-scroll="how">Training tracks</a>
              <a data-scroll="stories">Agent stories</a>
            </div>
            <div>
              <h4>Resources</h4>
              <a data-scroll="requirements">Remote setup</a>
              <a data-scroll="salaries">Roles &amp; growth</a>
              <a data-scroll="faq">FAQ</a>
              <a data-scroll="video">How to register</a>
            </div>
            <div>
              <h4>Company</h4>
              <a>About us</a>
              <a href="#employers">For employers</a>
              <a>Careers</a>
              <a>Contact</a>
            </div>
          </div>
        </div>
        <div className="lp-foot-bottom">
          <span>© 2026 RemConnect, Inc.</span>
          <div className="links">
            <a>Privacy</a>
            <a>Terms</a>
            <a>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
