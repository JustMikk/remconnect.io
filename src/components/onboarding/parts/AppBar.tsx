'use client'

import Link from 'next/link'

export default function AppBar() {
  return (
    <header className="ob-appbar">
      <Link className="ob-brand" href="/">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/remconnect-logo.png" alt="RemConnect" className="ob-logo" />
      </Link>
      <div className="ob-appbar-right">
        <span className="ob-cohort-pill">
          <span className="d" />
          Cohort 14 · Accepting
        </span>
        <Link className="ob-help" href="/#faq">
          Need help?
        </Link>
      </div>
    </header>
  )
}
