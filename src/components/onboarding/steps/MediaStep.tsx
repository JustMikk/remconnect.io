'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useOnboarding } from '../OnboardingContext'
import {
  AVATAR_ACCEPT,
  AVATAR_MAX_MB,
  VIDEO_ACCEPT,
  VIDEO_MAX_MB,
  type OnboardingFiles,
} from '../constants'
import { TrashIcon, UploadIcon } from '../icons'

function formatSize(bytes: number): string {
  return `${(bytes / 1048576).toFixed(1)} MB`
}

interface UploadZoneProps {
  kind: keyof OnboardingFiles
  accept: string
  maxMb: number
  prompt: string
  hint: string
}

function UploadZone({ kind, accept, maxMb, prompt, hint }: UploadZoneProps) {
  const { files, setFile, hasError } = useOnboarding()
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [sizeError, setSizeError] = useState<string | null>(null)

  const file = files[kind]
  const acceptedTypes = accept.split(',')

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => {
    if (!previewUrl) return
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  const pick = (f: File | undefined | null) => {
    if (!f) return
    if (!acceptedTypes.includes(f.type)) {
      setSizeError(`That file type isn't supported here.`)
      return
    }
    if (f.size > maxMb * 1048576) {
      setSizeError(`File is too large — keep it under ${maxMb}MB.`)
      return
    }
    setSizeError(null)
    setFile(kind, f)
  }

  const isVideo = kind === 'introVideo'

  return (
    <div className="ob-field">
      {!file && (
        <div
          id={`ob-${kind}`}
          className={`ob-drop${drag || hasError(kind) ? ' drag' : ''}`}
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
            pick(e.dataTransfer?.files?.[0])
          }}
        >
          <div className="di">
            <UploadIcon />
          </div>
          <h4>
            {prompt} <span className="br">browse</span>
          </h4>
          <p>{hint}</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          pick(e.target.files?.[0])
          e.target.value = ''
        }}
      />

      {file && previewUrl && (
        <div className="ob-file" style={{ alignItems: 'center' }}>
          {isVideo ? (
            <video
              src={previewUrl}
              controls
              preload="metadata"
              style={{ width: 168, borderRadius: 8, background: 'var(--rc-ink)' }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Profile photo preview"
              style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
          <div className="meta">
            <div className="nm">{file.name}</div>
            <div className="sz">{formatSize(file.size)}</div>
          </div>
          <button
            type="button"
            className="act"
            aria-label="Remove"
            onClick={() => setFile(kind, null)}
          >
            <TrashIcon />
          </button>
        </div>
      )}

      {sizeError && (
        <p className="ob-error" style={{ display: 'flex' }}>
          {sizeError}
        </p>
      )}
    </div>
  )
}

export default function MediaStep() {
  return (
    <div className="ob-steppane">
      <div className="ob-step-head">
        <span className="ob-eyebrow">
          <span className="ln" />
          Photo &amp; video
        </span>
        <h2>
          Put a <em>face</em> to the name.
        </h2>
        <p>
          Clients meet you here first. Add a clear headshot and a short intro video — 30 to 60
          seconds about who you are and the work you do best.
        </p>
      </div>
      <div className="ob-step-inner">
        <div className="ob-field">
          <label className="ob-label">
            Profile photo <span className="ob-req">Required</span>
          </label>
          <UploadZone
            kind="avatar"
            accept={AVATAR_ACCEPT}
            maxMb={AVATAR_MAX_MB}
            prompt="Drag your photo here, or"
            hint={`JPG, PNG or WebP · max ${AVATAR_MAX_MB}MB · plain background works best`}
          />
        </div>

        <div className="ob-field">
          <label className="ob-label">
            Intro video <span className="ob-req">Required</span>
          </label>
          <UploadZone
            kind="introVideo"
            accept={VIDEO_ACCEPT}
            maxMb={VIDEO_MAX_MB}
            prompt="Drag your video here, or"
            hint={`MP4, MOV or WebM · max ${VIDEO_MAX_MB}MB · 30–60 seconds is perfect`}
          />
        </div>

        <div className="ob-callout">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <p>
            <b>Tip:</b> record in good light, look at the camera, and mention the roles you&apos;re
            applying for. You can re-record any time before you submit.
          </p>
        </div>
      </div>
    </div>
  )
}
