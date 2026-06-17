import { Icon } from '@/components/ui/Icon'
import { Chip } from '@/components/ui/Chip'
import { SkillRadar } from '@/components/ui/SkillRadar'
import { SectionCard, SectionDivider } from '@/components/ui/SectionCard'
import type { AgentProfile } from '@/types/profile'

interface ProfileSidebarProps {
  profile: AgentProfile
}

const REMOTE_LABEL: Record<string, string> = {
  wired_internet_lan: 'Wired LAN',
  backup_wifi_mobile: 'Backup WiFi / Mobile',
  desktop_laptop: 'Desktop / Laptop',
  second_monitor: 'Second monitor',
  headset: 'Headset',
  webcam: 'Webcam',
  powerbank_laptop_capable: 'Powerbank (laptop-capable)',
}

function slugToLabel(slug: string): string {
  return REMOTE_LABEL[slug] ?? slug.replace(/_/g, ' ')
}

/** Proficiency level → chip variant */
function proficiencyVariant(level: string): 'good' | 'default' | 'neutral' | 'warn' {
  const l = level.toUpperCase()
  if (l === 'NATIVE') return 'good'
  if (l === 'FLUENT' || l === 'ADVANCED') return 'default'
  if (l === 'INTERMEDIATE') return 'warn'
  return 'neutral'
}

export function ProfileSidebar({ profile }: ProfileSidebarProps) {
  const hasRemote =
    profile.remoteSetup &&
    (profile.remoteSetup.connectivity.length > 0 ||
      profile.remoteSetup.hardware.length > 0 ||
      profile.remoteSetup.powerBackup.length > 0 ||
      profile.remoteSetup.internetSpeed)

  return (
    <div className="flex flex-col gap-4">
      {/* About / bio */}
      {profile.bio && (
        <SectionCard title="About">
          <p className="text-[13px] leading-relaxed text-rc-ink">{profile.bio}</p>
        </SectionCard>
      )}

      {/* Contact & employment */}
      {(profile.phone || profile.linkedinUrl || profile.employmentType) && (
        <SectionCard title="Contact">
          <div className="flex flex-col gap-2.5">
            {profile.phone && (
              <div className="flex items-center gap-2.5">
                <Icon name="phone" size={13} color="var(--rc-muted-d)" />
                <span className="text-[13px] text-rc-ink">{profile.phone}</span>
              </div>
            )}
            {profile.linkedinUrl && (
              <div className="flex items-center gap-2.5">
                <Icon name="link" size={13} color="var(--rc-muted-d)" />
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-[13px] text-rc-blue hover:underline"
                >
                  LinkedIn profile
                </a>
              </div>
            )}
            {profile.employmentType && (
              <div className="flex items-center gap-2.5">
                <Icon name="briefcase" size={13} color="var(--rc-muted-d)" />
                <span className="text-[13px] text-rc-ink capitalize">
                  {profile.employmentType.replace(/_/g, ' ').toLowerCase()}
                </span>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Skill radar */}
      {profile.skillAxes.length > 0 && (
        <SectionCard title="Skill radar">
          <SkillRadar size={200} color="var(--rc-blue)" axes={profile.skillAxes} />
        </SectionCard>
      )}

      {/* Languages */}
      {profile.languages.length > 0 && (
        <SectionCard title="Languages">
          <div className="flex flex-col">
            {profile.languages.map((lang, i) => (
              <div
                key={lang.name}
                className={`flex items-center justify-between py-2 ${
                  i < profile.languages.length - 1 ? 'border-b border-rc-line' : ''
                }`}
              >
                <span className="text-[13px] text-rc-ink">{lang.name}</span>
                <Chip variant={proficiencyVariant(lang.level)} className="text-[10px]">
                  {lang.level}
                </Chip>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Certifications */}
      {(profile.certsRemconnect.length > 0 || profile.certsOther.length > 0) && (
        <SectionCard title="Certifications">
          {profile.certsRemconnect.length > 0 && (
            <div className="mb-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-rc-muted-d">
                RemConnect
              </p>
              <div className="flex flex-col gap-1.5">
                {profile.certsRemconnect.map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <Icon name="award" size={13} color="var(--rc-blue)" />
                    <span className="flex-1 text-[13px] text-rc-ink">{c.title}</span>
                    <Chip variant="good" className="text-[10px]">
                      Verified
                    </Chip>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.certsRemconnect.length > 0 && profile.certsOther.length > 0 && (
            <SectionDivider className="mb-3" />
          )}

          {profile.certsOther.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-rc-muted-d">
                External
              </p>
              <div className="flex flex-col gap-1.5">
                {profile.certsOther.map((c) => (
                  <div key={c.title} className="flex items-center gap-2">
                    <Icon name="award" size={13} color="var(--rc-muted-d)" />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-rc-ink">{c.title}</span>
                      {c.issuer && <span className="text-[11px] text-rc-muted-d">{c.issuer}</span>}
                    </div>
                    {c.date && (
                      <span className="shrink-0 text-[11px] text-rc-muted-d">{c.date}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* Remote setup */}
      {hasRemote && (
        <SectionCard title="Remote setup">
          {profile.remoteSetup!.internetSpeed && (
            <div className="mb-3 flex items-center gap-2">
              <Icon name="wifi" size={13} color="var(--rc-muted-d)" />
              <span className="text-[13px] text-rc-ink">{profile.remoteSetup!.internetSpeed}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-1.5">
            {[
              ...profile.remoteSetup!.connectivity,
              ...profile.remoteSetup!.hardware,
              ...profile.remoteSetup!.powerBackup,
            ].map((slug) => (
              <span
                key={slug}
                className="rounded-full border border-rc-line bg-rc-paper-2 px-2.5 py-1 text-[11.5px] text-rc-ink"
              >
                {slugToLabel(slug)}
              </span>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  )
}
