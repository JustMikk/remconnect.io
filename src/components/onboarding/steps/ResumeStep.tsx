'use client'

import { useRef, useState } from 'react'
import { useOnboarding } from '../OnboardingContext'
import { TrashIcon, UploadIcon } from '../icons'

export default function ResumeStep() {
  const { startResume, resetResume, resumeName, resumeSize, files } = useOnboarding()
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)

  const accept = (f: File | undefined | null) => {
    if (f) startResume(f)
  }

  const hasFile = !!files.resume
  const ext = resumeName ? (resumeName.split('.').pop() ?? 'PDF').toUpperCase().slice(0, 4) : 'PDF'

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
          Optional — but highly recommended. Our AI reads your work history, education and skills
          and auto-populates your profile once your account is created. You can always upload it
          later from your profile page.
        </p>
      </div>

      <div className="ob-step-inner">
        <div className="ob-field">
          <label className="ob-label">
            Resume file <span className="ob-opt">Optional</span>
          </label>

          {!hasFile && (
            <div
              id="ob-resume"
              className={`ob-drop${drag ? ' drag' : ''}`}
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
              <p>PDF or DOCX · max 5 MB</p>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.doc"
            hidden
            onChange={(e) => accept(e.target.files?.[0])}
          />

          {hasFile && (
            <div className="ob-file">
              <div className="ic">{ext}</div>
              <div className="meta">
                <div className="nm">{resumeName}</div>
                <div className="sz">{resumeSize}</div>
              </div>
              <button type="button" className="act" aria-label="Remove" onClick={resetResume}>
                <TrashIcon />
              </button>
            </div>
          )}
        </div>

        <div className="ob-callout">
          <p>
            <strong>What happens next:</strong> after you submit, the backend parses your resume and
            populates your work history, skills and certifications automatically. You can review and
            edit everything from your profile page.
          </p>
        </div>
      </div>
    </div>
  )
}
