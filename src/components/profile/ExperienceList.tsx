import { Icon } from '@/components/ui/Icon'
import { SectionCard } from '@/components/ui/SectionCard'
import type { ProfileExperience } from '@/types/profile'

interface ExperienceListProps {
  experience: ProfileExperience[]
}

export function ExperienceList({ experience }: ExperienceListProps) {
  if (experience.length === 0) return null

  return (
    <SectionCard title="Experience">
      <div className="flex flex-col">
        {experience.map((e, i) => (
          <div
            key={e.title}
            className={i < experience.length - 1 ? 'mb-4 border-b border-rc-line pb-4' : ''}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-rc-line bg-rc-paper-2">
                <Icon name="briefcase" size={15} color="var(--rc-muted-d)" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-rc-ink">{e.title}</p>
                <p className="mt-0.5 text-[12px] text-rc-muted">
                  {e.company} · {e.period}
                </p>
                <ul className="mt-2 list-disc pl-4">
                  {e.bullets.map((b) => (
                    <li key={b} className="text-[13px] leading-relaxed text-rc-muted">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
