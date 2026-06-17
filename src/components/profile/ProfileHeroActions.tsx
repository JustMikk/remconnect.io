'use client'

import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { AgentProfile } from '@/types/profile'
import { ProfileEditModal } from './ProfileEditModal'

interface ProfileHeroActionsProps {
  profile: AgentProfile
}

export function ProfileHeroActions({ profile }: ProfileHeroActionsProps) {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <div className="flex shrink-0 gap-2">
        <button className="inline-flex cursor-pointer items-center gap-2 rounded-sm bg-rc-blue px-3.5 py-[9px] text-[13px] font-medium text-white">
          <Icon name="eye" size={13} color="#fff" /> View as client
        </button>
        <button
          onClick={() => setEditOpen(true)}
          className="cursor-pointer rounded-sm border border-rc-ink-4 bg-transparent px-3.5 py-[9px] text-[13px] font-medium text-rc-paper"
        >
          Edit profile
        </button>
      </div>

      {editOpen && <ProfileEditModal profile={profile} onClose={() => setEditOpen(false)} />}
    </>
  )
}
