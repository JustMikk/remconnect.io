export interface ProfileExperience {
  title: string
  company: string
  period: string
  bullets: string[]
}

export interface ProfileEducation {
  school: string
  degree: string
  gpa: string
  year: string
}

export interface ProfileCert {
  title: string
  /** RemConnect-issued certs carry an internal id; external certs carry an issuer. */
  id?: string
  issuer?: string
  date: string
}

export interface SkillAxis {
  k: string
  v: number
}

export interface ProfileLanguage {
  name: string
  level: string
}

export interface ProfileRemoteSetup {
  connectivity: string[]
  hardware: string[]
  powerBackup: string[]
  internetSpeed?: string
}

export interface AgentProfile {
  agentId: string
  name: string
  title: string
  location: string
  tags: string[]
  skillComposite: number
  skillTrend: string
  experience: ProfileExperience[]
  education: ProfileEducation[]
  skills: string[]
  certsRemconnect: ProfileCert[]
  certsOther: ProfileCert[]
  skillAxes: SkillAxis[]
  languages: ProfileLanguage[]
  // Fields populated from live API
  nickname?: string
  bio?: string
  avatarUrl?: string
  introVideoUrl?: string
  cvUrl?: string
  phone?: string
  linkedinUrl?: string
  employmentType?: string
  remoteSetup?: ProfileRemoteSetup
}
