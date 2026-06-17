import { Avatar } from '@/components/ui/Avatar'
import { ScoreRing } from '@/components/ui/ScoreRing'
import type { AgentProfile } from '@/types/profile'
import { ProfileHeroActions } from './ProfileHeroActions'

interface ProfileHeroProps {
  profile: AgentProfile
}

/** Static profile header — Server Component; interactive buttons extracted into ProfileHeroActions. */
export function ProfileHero({ profile }: ProfileHeroProps) {
  return (
    <div
      className="relative mb-6 overflow-hidden rounded-lg px-8 py-7 text-rc-paper"
      style={{
        background:
          'linear-gradient(135deg, var(--rc-ink) 0%, var(--rc-ink-2) 60%, var(--rc-blue-ink) 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute -top-16 -right-10 h-72 w-72 rounded-full"
        style={{ background: 'radial-gradient(circle, rgb(124 179 245 / 0.2), transparent 70%)' }}
      />
      <div className="flex items-end gap-5">
        <Avatar name={profile.name} size={80} tone={0} src={profile.avatarUrl} />
        <div className="flex-1">
          <div className="text-[11px] font-semibold text-rc-blue-soft">
            Agent ID: {profile.agentId}
          </div>
          <h1 className="mt-1.5 mb-0.5 font-serif text-[34px] font-normal tracking-[-0.02em] text-rc-paper">
            {profile.name}
          </h1>
          {profile.nickname && (
            <div className="mb-1 text-[13px] italic text-rc-paper/60">
              &ldquo;{profile.nickname}&rdquo;
            </div>
          )}
          <div className="text-sm text-rc-paper/75">{profile.title}</div>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-rc-blue-soft/25 bg-rc-blue-soft/15 px-2 py-0.75 text-[11px] font-medium text-rc-blue-soft"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <ScoreRing
            value={profile.skillComposite}
            size={70}
            thickness={6}
            color="var(--rc-blue-soft)"
            track="rgb(255 255 255 / 0.1)"
            label
          />
          <div>
            <div className="text-[10px] font-semibold text-rc-muted-d">Skill composite</div>
            <div className="mt-0.5 text-[11px] text-rc-good">{profile.skillTrend}</div>
          </div>
        </div>
        <ProfileHeroActions profile={profile} />
      </div>
    </div>
  )
}
