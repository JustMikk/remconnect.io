import { me } from '@/lib/api/auth'
import { getSession } from '@/lib/api/session'
import type { ApiUser } from '@/types/api'
import type {
  AgentProfile,
  ProfileCert,
  ProfileLanguage,
  ProfileRemoteSetup,
} from '@/types/profile'
import { AGENT_PROFILE_FIXTURE } from '@/lib/fixtures/profile'

/**
 * Maps a live ApiUser from GET /auth/me to the AgentProfile shape consumed by
 * the portal profile page. Fields the backend doesn't expose yet (experience,
 * education, skill radar, scores) fall back to empty collections so the page
 * renders without fake data.
 */
function apiUserToAgentProfile(user: ApiUser): AgentProfile {
  const agent = user.agent
  const nameParts = [user.firstName, user.lastName].filter(Boolean)
  const name =
    user.fullName ?? (nameParts.length > 0 ? nameParts.join(' ') : user.email.split('@')[0])

  const skills: string[] = agent?.profile?.skills ?? []

  const languages: ProfileLanguage[] = (agent?.languages ?? []).map((l) => ({
    name: l.language,
    level: l.proficiency,
  }))

  const certsOther: ProfileCert[] = (agent?.externalCertifications ?? []).map((c) => ({
    title: c.name,
    issuer: c.issuingOrg ?? undefined,
    date: c.dateEarned
      ? new Date(c.dateEarned).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : '',
  }))

  const tags = [
    languages.find((l) => ['NATIVE', 'Native', 'native'].includes(l.level))?.name,
    languages.find((l) => ['FLUENT', 'Fluent', 'fluent'].includes(l.level))?.name,
    skills[0],
    skills[1],
  ]
    .filter(Boolean)
    .slice(0, 4) as string[]

  const remoteSetup: ProfileRemoteSetup | undefined = agent?.remoteSetup
    ? {
        connectivity: agent.remoteSetup.connectivity ?? [],
        hardware: agent.remoteSetup.hardware ?? [],
        powerBackup: agent.remoteSetup.powerBackup ?? [],
        internetSpeed: agent.remoteSetup.internetSpeed ?? undefined,
      }
    : undefined

  return {
    agentId: user.id.slice(0, 8).toUpperCase(),
    name,
    title: agent?.bio?.split('.')[0]?.trim() ?? `Remote Agent · ${agent?.city ?? 'Ethiopia'}`,
    location: agent?.city ?? 'Ethiopia',
    tags: tags.length > 0 ? tags : ['Remote Agent'],
    skillComposite: agent?.profile?.totalExperienceYears
      ? Math.min(99, 50 + agent.profile.totalExperienceYears * 4)
      : 0,
    skillTrend: '',
    experience: [],
    education: [],
    skills,
    certsRemconnect: [],
    certsOther,
    skillAxes: [],
    languages,
    // Live API fields
    nickname: agent?.nickname ?? undefined,
    bio: agent?.bio ?? undefined,
    avatarUrl: user.avatarUrl ?? undefined,
    introVideoUrl: agent?.introVideoUrl ?? undefined,
    cvUrl: agent?.cvUrl ?? undefined,
    phone: user.phone ?? undefined,
    linkedinUrl: agent?.linkedinUrl ?? undefined,
    employmentType: agent?.employmentType ?? undefined,
    remoteSetup,
  }
}

/**
 * Returns the logged-in agent's profile from the live API. Falls back to the
 * fixture when no session is present or the API is unreachable.
 */
export async function getMyProfile(): Promise<AgentProfile> {
  const session = await getSession()
  if (!session) return AGENT_PROFILE_FIXTURE
  try {
    const user = await me(session.accessToken)
    return apiUserToAgentProfile(user)
  } catch (err) {
    console.error('[profile] GET /auth/me failed, falling back to fixture:', err)
    return AGENT_PROFILE_FIXTURE
  }
}

/** @deprecated Use getMyProfile() instead. */
export async function getAgentProfile(): Promise<AgentProfile> {
  return getMyProfile()
}
