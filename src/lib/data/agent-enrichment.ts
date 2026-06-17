import type { ApiCertification, ApiUser } from '@/types/api'
import type { AgentProfileExtras, DirectoryAgent, SampleAgent } from '@/types/admin'
import type { NetworkAgent } from '@/types/network'
import { AGENT_EXTRAS, SAMPLE_AGENTS } from '@/lib/admin-data'
import { NET_AGENTS } from '@/lib/network-data'

/**
 * TEMPORARY fixture-enrichment seam (hybrid integration).
 *
 * The live API owns agent identity (name, email, status, contact, media,
 * languages, skills, certifications, intake answers). Operational data the
 * backend does not expose yet — client assignment, scores, pay/bill rates,
 * work history, notes, performance, network metrics — is filled from the demo
 * fixtures, picked DETERMINISTICALLY by hashing the agent's uuid so the same
 * agent always shows the same enrichment.
 *
 * Everything fake funnels through this file: when the backend catches up,
 * delete it and map the API response directly in src/lib/data/agents.ts.
 */

/** FNV-1a 32-bit hash — stable fixture pick per uuid. */
function fnv1a(input: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

function pickFixtureAgent(id: string): SampleAgent {
  return SAMPLE_AGENTS[fnv1a(id) % SAMPLE_AGENTS.length]
}

function pickFixtureExtras(id: string): AgentProfileExtras {
  const fixture = pickFixtureAgent(id)
  return AGENT_EXTRAS[fixture.id] ?? AGENT_EXTRAS['__default']
}

export function pickNetworkAgent(id: string): NetworkAgent | undefined {
  if (NET_AGENTS.length === 0) return undefined
  return NET_AGENTS[fnv1a(id) % NET_AGENTS.length]
}

const EMPLOYMENT_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  PROJECT_BASED: 'Project-based',
  OPEN_TO_ANY: 'Open to any',
}

export function displayName(user: ApiUser): string {
  if (user.fullName) return user.fullName
  const parts = [user.firstName, user.lastName].filter(Boolean)
  if (parts.length > 0) return parts.join(' ')
  return user.email.split('@')[0]
}

function resolveRoleTitle(user: ApiUser, roleTitles: Map<string, string>): string | undefined {
  const roleId = user.agent?.primaryRoleId ?? user.agent?.desiredRoleIds?.[0]
  return roleId ? roleTitles.get(roleId) : undefined
}

function realLanguages(user: ApiUser): string[] | undefined {
  const langs = user.agent?.languages?.map((l) => l.language)
  return langs && langs.length > 0 ? langs : undefined
}

function realSkills(user: ApiUser): string[] | undefined {
  const skills = user.agent?.profile?.skills
  return skills && skills.length > 0 ? skills : undefined
}

function formatCertification(cert: ApiCertification): { t: string; d: string } {
  const year = cert.dateEarned ? new Date(cert.dateEarned).getFullYear() : undefined
  return { t: cert.name, d: [cert.issuingOrg, year].filter(Boolean).join(' · ') }
}

export function toDirectoryAgent(user: ApiUser, roleTitles: Map<string, string>): DirectoryAgent {
  const fixture = pickFixtureAgent(user.id)
  const certs = user.agent?.externalCertifications?.length

  return {
    id: user.id,
    name: displayName(user),
    email: user.email,
    status: user.isActive ? 'ACTIVE' : 'INACTIVE',
    joined: user.createdAt,
    photo: user.avatarUrl ?? undefined,
    role: resolveRoleTitle(user, roleTitles) ?? fixture.role,
    client: fixture.client,
    score: fixture.score,
    certs: certs !== undefined && certs > 0 ? certs : fixture.certs,
    langs: realLanguages(user) ?? fixture.langs,
    skills: realSkills(user) ?? fixture.skills,
    rate: fixture.rate,
  }
}

export interface AdminAgentRecord {
  agent: SampleAgent
  extras: AgentProfileExtras
}

/**
 * Builds the legacy `SampleAgent` + `AgentProfileExtras` pair the profile tabs
 * consume: real API values overlaid on a deterministic fixture pick, so the
 * rich sections (contract, history, notes, performance) stay populated while
 * identity/contact/media are genuine.
 */
export function toProfileRecord(user: ApiUser, roleTitles: Map<string, string>): AdminAgentRecord {
  const fixture = pickFixtureAgent(user.id)
  const fixtureExtras = pickFixtureExtras(user.id)
  const profile = user.agent
  const certs = profile?.externalCertifications

  const agent: SampleAgent = {
    ...fixture,
    id: user.id,
    name: displayName(user),
    role: resolveRoleTitle(user, roleTitles) ?? fixture.role,
    certs: certs && certs.length > 0 ? certs.length : fixture.certs,
    years: profile?.profile?.totalExperienceYears ?? fixture.years,
    langs: realLanguages(user) ?? fixture.langs,
    skills: realSkills(user) ?? fixture.skills,
    photo: user.avatarUrl ?? fixture.photo,
  }

  const extras: AgentProfileExtras = {
    ...fixtureExtras,
    headline: profile?.bio ?? fixtureExtras.headline,
    photo: user.avatarUrl ?? fixtureExtras.photo,
    video: profile?.introVideoUrl ?? fixtureExtras.video,
    location: profile?.city ?? fixtureExtras.location,
    email: user.email,
    phone: user.phone ?? fixtureExtras.phone,
    tools: realSkills(user) ?? fixtureExtras.tools,
    certifications:
      certs && certs.length > 0 ? certs.map(formatCertification) : fixtureExtras.certifications,
    intake: {
      ...fixtureExtras.intake,
      availability: profile?.employmentType
        ? (EMPLOYMENT_LABELS[profile.employmentType] ?? profile.employmentType)
        : fixtureExtras.intake?.availability,
      internet: profile?.remoteSetup?.internetSpeed ?? fixtureExtras.intake?.internet,
      desiredSalary: profile?.expectedSalaryEtb
        ? `${profile.expectedSalaryEtb} ETB`
        : fixtureExtras.intake?.desiredSalary,
      cvUrl: profile?.cvUrl ?? fixtureExtras.intake?.cvUrl,
    },
  }

  return { agent, extras }
}
