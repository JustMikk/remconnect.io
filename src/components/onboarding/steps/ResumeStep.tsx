'use client'

import { useRef, useState } from 'react'
import { useOnboarding } from '../OnboardingContext'
import { BriefcaseIcon, CapIcon, CheckIcon, ShieldIcon, TrashIcon, UploadIcon } from '../icons'

function ExtractedPreview() {
  return (
    <div className="ob-extracted">
      <div className="ob-extract-banner">
        <span className="ic">
          <CheckIcon size={13} strokeWidth={3} />
        </span>
        We pulled the details below — review and edit anything before you continue.
      </div>

      <div className="ob-xcard">
        <div className="ob-xcard-h">
          <span className="ic"><BriefcaseIcon /></span>
          <span className="t">Work experience</span>
          <span className="tag">2 found</span>
        </div>
        <div className="ob-xitem">
          <span className="dt">2022 — Now</span>
          <div>
            <div className="role">Front Desk &amp; Guest Relations</div>
            <div className="org">Skylight Hotel · Addis Ababa</div>
            <div className="desc">
              Handled guest check-in, phone enquiries and complaint resolution for a 200-room property.
            </div>
          </div>
        </div>
        <div className="ob-xitem">
          <span className="dt">2020 — 2022</span>
          <div>
            <div className="role">Retail Sales Associate</div>
            <div className="org">Edna Mall Electronics</div>
            <div className="desc">
              Customer-facing sales, returns and after-sales support; consistently top of monthly CSAT.
            </div>
          </div>
        </div>
      </div>

      <div className="ob-xcard">
        <div className="ob-xcard-h">
          <span className="ic"><CapIcon /></span>
          <span className="t">Education</span>
          <span className="tag">1 found</span>
        </div>
        <div className="ob-xitem">
          <span className="dt">2020</span>
          <div>
            <div className="role">BA, Management</div>
            <div className="org">Addis Ababa University</div>
          </div>
        </div>
      </div>

      <div className="ob-xcard">
        <div className="ob-xcard-h">
          <span className="ic"><ShieldIcon /></span>
          <span className="t">Skills mentioned</span>
          <span className="tag">Auto-tagged</span>
        </div>
        <div className="ob-xskills">
          {['Customer service', 'Conflict resolution', 'Microsoft Office', 'CRM basics', 'Cash handling', 'Amharic · English'].map(
            (s) => (
              <span className="ob-xskill" key={s}>
                {s}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResumeStep() {
  const { parsed, parsing, resumeName, resumeSize, startResume, resetResume, hasError } = useOnboarding()
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)

  const accept = (f: File | undefined | null) => {
    if (f) startResume(f.name, `${(f.size / 1048576).toFixed(1)} MB`)
    else startResume('Resume.pdf', '0.4 MB')
  }

  const showCard = parsing || parsed
  const ext = (resumeName.split('.').pop() || 'pdf').toUpperCase().slice(0, 4)

  return (
    <div className="ob-steppane">
      <div className="ob-step-head">
        <span className="ob-eyebrow">
          <span className="ln" />
          Resume
        </span>
        <h2>
          Upload once. We <em>fill the rest</em>.
        </h2>
        <p>
          Our parser reads your work history, education and skills automatically — no manual typing. Just confirm what
          we found.
        </p>
      </div>
      <div className="ob-step-inner">
        <div className="ob-field">
          <label className="ob-label">
            Resume file <span className="ob-req">Required</span>
          </label>

          {!showCard && (
            <div
              id="ob-resume"
              className={`ob-drop${drag || hasError('resume') ? ' drag' : ''}`}
              onClick={() => inputRef.current?.click()}
              onDragEnter={(e) => {
                e.preventDefault()
                setDrag(true)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                setDrag(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                setDrag(false)
              }}
              onDrop={(e) => {
                e.preventDefault()
                setDrag(false)
                accept(e.dataTransfer?.files?.[0])
              }}
            >
              <div className="di">
                <UploadIcon />
              </div>
              <h4>
                Drag your resume here, or <span className="br">browse</span>
              </h4>
              <p>PDF or DOCX · max 5MB</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.doc"
            hidden
            onChange={(e) => accept(e.target.files?.[0])}
          />
        </div>

        {showCard && (
          <div>
            <div className="ob-file">
              <div className="ic">{ext}</div>
              <div className="meta">
                <div className="nm">{resumeName || 'Resume.pdf'}</div>
                <div className="sz">{resumeSize || '0.4 MB'}</div>
              </div>
              <button type="button" className="act" aria-label="Remove" onClick={resetResume}>
                <TrashIcon />
              </button>
            </div>

            {parsing && (
              <div className="ob-parsing">
                <span className="spin" />
                <div>
                  <div className="t">Reading your resume…</div>
                  <div className="s">Extracting work history, education &amp; skills</div>
                </div>
              </div>
            )}

            {parsed && <ExtractedPreview />}
          </div>
        )}
      </div>
    </div>
  )
}
