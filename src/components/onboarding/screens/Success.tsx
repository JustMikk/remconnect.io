'use client'

import Link from 'next/link'
import { ArrowRight, CheckIcon } from '../icons'

const NEXT_STEPS = [
  {
    t: 'A recruiter reviews your profile',
    s: 'We read every application and reply within 3 business days.',
  },
  {
    t: 'Take your short assessment',
    s: 'A quick English and voice check — no upfront interview.',
  },
  {
    t: 'Train, certify, and get placed',
    s: 'Complete the curriculum and opportunities land in your portal.',
  },
]

export default function Success() {
  return (
    <div className="ob-success">
      <div className="ob-success-ic">
        <CheckIcon size={44} strokeWidth={2.2} />
      </div>
      <h2>
        Application <em>submitted</em>.
      </h2>
      <p>Your profile is in. Welcome to Cohort 14 — here&apos;s what happens next.</p>
      <div className="ob-next">
        {NEXT_STEPS.map((row, i) => (
          <div className="ob-next-row" key={i}>
            <span className="n">{i + 1}</span>
            <div>
              <div className="t">{row.t}</div>
              <div className="s">{row.s}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="ob-success-cta">
        <Link className="ob-btn ob-btn-primary" href="/home">
          Go to my portal
          <span className="pip">
            <ArrowRight />
          </span>
        </Link>
        <Link className="ob-btn ob-btn-ghost" href="/">
          Back to home
        </Link>
      </div>
    </div>
  )
}
