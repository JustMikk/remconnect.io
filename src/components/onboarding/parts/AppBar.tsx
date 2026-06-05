'use client'

import Link from 'next/link'

export default function AppBar() {
  return (
    <header className="ob-appbar">
      <Link className="ob-brand" href="/">
        <span className="ob-brand-mark">R</span>
        <b>RemConnect</b>
        <span className="dot">.</span>
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
