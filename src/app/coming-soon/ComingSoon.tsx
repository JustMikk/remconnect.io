'use client'

export default function ComingSoon() {
  return (
    <main className="cs-root">
      <style>{CS_STYLES}</style>

      {/* Ambient floating background shapes */}
      <div className="cs-bg" aria-hidden="true">
        <span className="cs-blob cs-blob-1" />
        <span className="cs-blob cs-blob-2" />
        <span className="cs-blob cs-blob-3" />
        <span className="cs-grid" />
      </div>

      <section className="cs-content">
        <div className="cs-badge cs-in cs-d1">
          <span className="cs-dot" />
          Launching soon
        </div>

        {/* Real brand logo */}
        <div className="cs-logo cs-in cs-d2">
          <span className="cs-logo-glow" />
          <img src="/assets/remconnect-logo.png" alt="RemConnect" />
        </div>

        <h1 className="cs-headline cs-in cs-d3">
          We&apos;re building
          <br />
          <span className="cs-headline-accent">something great.</span>
        </h1>

        <p className="cs-sub cs-in cs-d4">
          The platform that trains, certifies and places remote support agents on
          global teams — paid in USD, working from their own setup. A new way to
          build a career from home is almost here.
        </p>
      </section>

      <footer className="cs-footer cs-in cs-d5">
        © 2025 RemConnect. All rights reserved.
      </footer>
    </main>
  )
}

const CS_STYLES = `
.cs-root {
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px 28px;
  background:
    radial-gradient(120% 120% at 50% -10%, #16223c 0%, #0b1220 55%, #070b15 100%);
  color: #faf9f6;
  font-family: "Satoshi", ui-sans-serif, system-ui, sans-serif;
  text-align: center;
}

/* ── Background ── */
.cs-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.cs-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.55;
  will-change: transform;
}
.cs-blob-1 {
  width: 460px; height: 460px;
  top: -120px; left: -100px;
  background: radial-gradient(circle, #1d6fd6 0%, rgba(29,111,214,0) 70%);
  animation: cs-float 13s ease-in-out infinite;
}
.cs-blob-2 {
  width: 540px; height: 540px;
  bottom: -180px; right: -140px;
  background: radial-gradient(circle, #0b4fa8 0%, rgba(11,79,168,0) 70%);
  animation: cs-float 17s ease-in-out infinite reverse;
}
.cs-blob-3 {
  width: 320px; height: 320px;
  top: 40%; left: 55%;
  background: radial-gradient(circle, #7cb3f5 0%, rgba(124,179,245,0) 70%);
  opacity: 0.3;
  animation: cs-float 11s ease-in-out infinite;
}
.cs-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(124,179,245,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(124,179,245,0.05) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(circle at 50% 40%, #000 0%, transparent 72%);
  -webkit-mask-image: radial-gradient(circle at 50% 40%, #000 0%, transparent 72%);
}

@keyframes cs-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(28px, -34px) scale(1.06); }
}

/* ── Content ── */
.cs-content {
  position: relative;
  z-index: 1;
  max-width: 720px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cs-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid rgba(124,179,245,0.22);
  background: rgba(124,179,245,0.06);
  color: #b8cdf0;
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  margin-bottom: 36px;
}
.cs-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #4ad07f;
  box-shadow: 0 0 0 0 rgba(74,208,127,0.55);
  animation: cs-ping 1.8s ease-out infinite;
}
@keyframes cs-ping {
  0%   { box-shadow: 0 0 0 0 rgba(74,208,127,0.5); }
  70%  { box-shadow: 0 0 0 9px rgba(74,208,127,0); }
  100% { box-shadow: 0 0 0 0 rgba(74,208,127,0); }
}

/* ── Logo ── */
.cs-logo {
  position: relative;
  display: inline-flex;
  margin-bottom: 34px;
}
.cs-logo img {
  position: relative;
  z-index: 1;
  width: clamp(180px, 34vw, 240px);
  height: auto;
  display: block;
}
.cs-logo-glow {
  position: absolute;
  inset: -18% -8%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(29,111,214,0.55), transparent 68%);
  z-index: 0;
  animation: cs-pulse-glow 2.8s ease-in-out infinite;
}
@keyframes cs-pulse-glow {
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50%      { opacity: 0.85; transform: scale(1.08); }
}

.cs-headline {
  font-family: "Clash Display", ui-sans-serif, system-ui, sans-serif;
  font-weight: 600;
  font-size: clamp(38px, 8vw, 68px);
  line-height: 1.04;
  letter-spacing: -0.015em;
  margin: 0 0 22px;
}
.cs-headline-accent {
  background: linear-gradient(100deg, #7cb3f5 0%, #1d6fd6 50%, #b8cdf0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.cs-sub {
  max-width: 540px;
  font-size: clamp(15px, 2.4vw, 17px);
  line-height: 1.6;
  color: #9fb0cc;
  margin: 0;
}

/* ── Footer ── */
.cs-footer {
  position: relative;
  z-index: 1;
  margin-top: 56px;
  font-size: 12.5px;
  color: #5d6a85;
  letter-spacing: 0.02em;
}

/* ── Entrance animation ── */
.cs-in { opacity: 0; animation: cs-rise 0.7s cubic-bezier(0.16,1,0.3,1) both; }
@keyframes cs-rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.cs-d1 { animation-delay: 60ms; }
.cs-d2 { animation-delay: 150ms; }
.cs-d3 { animation-delay: 260ms; }
.cs-d4 { animation-delay: 380ms; }
.cs-d5 { animation-delay: 520ms; }

/* ── Responsive ── */
@media (prefers-reduced-motion: reduce) {
  .cs-blob, .cs-logo-glow, .cs-dot { animation: none !important; }
  .cs-in { animation: none !important; opacity: 1 !important; transform: none !important; }
}
`
