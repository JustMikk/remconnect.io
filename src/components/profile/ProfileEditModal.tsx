'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { AgentProfile } from '@/types/profile'
import { updateProfileAction } from '@/app/(portal)/profile/actions'

interface ProfileEditModalProps {
  profile: AgentProfile
  onClose: () => void
}

export function ProfileEditModal({ profile, onClose }: ProfileEditModalProps) {
  const [nickname, setNickname] = useState(profile.nickname ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)

    const result = await updateProfileAction({
      nickname: nickname.trim() || undefined,
      bio: bio.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
    })

    setSaving(false)
    if (result.ok) {
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        onClose()
      }, 1200)
    } else {
      setError(result.error ?? 'Update failed')
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-rc-ink/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div className="w-full max-w-md rounded-[var(--radius-md)] border border-rc-line bg-white shadow-[var(--shadow-lg)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rc-line px-5 py-4">
          <span className="text-[14px] font-semibold text-rc-ink">Edit profile</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-rc-muted transition-colors hover:bg-rc-paper-2 hover:text-rc-ink"
          >
            <Icon name="x" size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5">
          <div className="flex flex-col gap-4">
            {/* Nickname */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-rc-muted-d">
                Nickname <span className="normal-case font-normal text-rc-muted">(optional)</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder='e.g. "The Closer" or a friendly alias'
                maxLength={50}
                className="w-full rounded-md border border-rc-line bg-white px-3 py-2 text-[13px] text-rc-ink placeholder:text-rc-muted-d focus:border-rc-blue focus:outline-none"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-rc-muted-d">
                Bio <span className="normal-case font-normal text-rc-muted">(optional)</span>
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A short sentence or two about your strengths and background."
                rows={3}
                maxLength={400}
                className="w-full resize-none rounded-md border border-rc-line bg-white px-3 py-2 text-[13px] text-rc-ink placeholder:text-rc-muted-d focus:border-rc-blue focus:outline-none"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-rc-muted-d">
                LinkedIn URL{' '}
                <span className="normal-case font-normal text-rc-muted">(optional)</span>
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/your-profile"
                className="w-full rounded-md border border-rc-line bg-white px-3 py-2 text-[13px] text-rc-ink placeholder:text-rc-muted-d focus:border-rc-blue focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-md border border-rc-bad/20 bg-rc-bad/5 px-3 py-2 text-[12px] text-rc-bad">
              {error}
            </p>
          )}

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-md border border-rc-line bg-white px-4 py-2 text-[13px] font-medium text-rc-ink transition-colors hover:bg-rc-paper-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md bg-rc-ink px-4 py-2 text-[13px] font-medium text-rc-paper transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {saved ? (
                <>
                  <Icon name="check" size={13} color="var(--rc-good)" /> Saved
                </>
              ) : saving ? (
                'Saving…'
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
