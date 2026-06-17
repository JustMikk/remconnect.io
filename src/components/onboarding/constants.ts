// Shared data + types for the agent onboarding flow.
// Mirrors the prototype's role taxonomy, proficiency and experience options.

export type Screen = 'create' | 'verify' | 'login' | 'wizard' | 'success'

export interface RolePick {
  r: string
  exp: string
}

export interface Lang {
  l: string
  p: string
}

export interface Cert {
  id: number
  name: string
  org: string
  earned: string
  expiry: string
  url: string
}

export const STEP_NAMES = [
  'Personal',
  'Contact',
  'Languages & Role',
  'Photo & video',
  'Setup',
  'Availability',
  'Resume',
] as const

export const TOTAL_STEPS = STEP_NAMES.length

/** Form-field state shared by the onboarding context and the submit builder. */
export interface FormFields {
  // create account
  crEmail: string
  crPass: string
  crPass2: string
  crRole: string
  // login
  lgEmail: string
  lgPass: string
  // personal
  pFirst: string
  pMiddle: string
  pLast: string
  pNickname: string
  pDob: string
  pGender: string
  pCity: string
  pAddr: string
  // contact
  cEmail: string
  cPhone: string
  // setup
  netSpeed: string
  // availability
  aSalary: string
  aHear: string
  aLinkedin: string
}

/** Files captured during the wizard. Never persisted (File isn't serializable). */
export interface OnboardingFiles {
  avatar: File | null
  introVideo: File | null
  resume: File | null
}

// ---- backend enum mappings (UI label → API value) ----

export const GENDER_MAP: Record<string, string> = {
  Male: 'MALE',
  Female: 'FEMALE',
  'Non-binary': 'OTHER',
  'Prefer not to say': 'PREFER_NOT_TO_SAY',
}

export const PROFICIENCY_MAP: Record<string, string> = {
  Native: 'NATIVE',
  Fluent: 'FLUENT',
  Conversational: 'CONVERSATIONAL',
  Basic: 'BASIC',
}

export const EMP_TYPE_MAP: Record<string, string> = {
  'Full-time': 'FULL_TIME',
  'Part-time': 'PART_TIME',
  'Project-based': 'PROJECT_BASED',
  'Open to any': 'OPEN_TO_ANY',
}

/** Checklist group heading → remoteSetup JSON key. */
export const REMOTE_SETUP_GROUP_KEYS: Record<string, 'connectivity' | 'hardware' | 'powerBackup'> =
  {
    Connectivity: 'connectivity',
    Hardware: 'hardware',
    'Power backup': 'powerBackup',
  }

/** Checklist label → backend slug (matches values observed in live agent data). */
export const REMOTE_SETUP_SLUGS: Record<string, string> = {
  'Wired internet (LAN)': 'wired_internet_lan',
  'Backup WiFi / mobile data': 'backup_wifi_mobile',
  'Desktop or laptop': 'desktop_laptop',
  '2nd monitor': 'second_monitor',
  Headset: 'headset',
  Webcam: 'webcam',
  'Powerbank (laptop-capable)': 'powerbank_laptop_capable',
}

// ---- media upload limits ----

export const AVATAR_MAX_MB = 5
export const AVATAR_ACCEPT = 'image/jpeg,image/png,image/webp'
export const VIDEO_MAX_MB = 100
export const VIDEO_ACCEPT = 'video/mp4,video/quicktime,video/webm'

export const PROFICIENCIES = ['Native', 'Fluent', 'Conversational', 'Basic']

export const EXP_OPTIONS = ['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', '10+ years']

export const ROLE_GROUPS: { g: string; r: string[] }[] = [
  {
    g: 'Back Office & Admin',
    r: [
      'Virtual Assistant',
      'Executive Assistant',
      'Data Entry Specialist',
      'Bookkeeper',
      'Payroll Specialist',
    ],
  },
  {
    g: 'Customer Service',
    r: [
      'Customer Support Agent',
      'Technical Support Agent',
      'Live Chat Agent',
      'Email Support Specialist',
    ],
  },
  {
    g: 'Sales & Marketing',
    r: [
      'SDR / Lead Generation',
      'Sales Closer',
      'Social Media Manager',
      'Content Writer',
      'SEO Specialist',
    ],
  },
  {
    g: 'Finance & Accounting',
    r: [
      'Accounts Payable Specialist',
      'Accounts Receivable Specialist',
      'Financial Analyst',
      'Tax Specialist',
    ],
  },
  {
    g: 'IT & Development',
    r: ['Web Developer', 'IT Help Desk', 'QA Tester', 'Data Analyst'],
  },
]

// Role <select> shown on the Create-account screen, grouped by discipline.
export const SIGNUP_ROLE_GROUPS = ROLE_GROUPS

export const REMOTE_SETUP_GROUPS: { gh: string; items: string[] }[] = [
  { gh: 'Connectivity', items: ['Wired internet (LAN)', 'Backup WiFi / mobile data'] },
  { gh: 'Hardware', items: ['Desktop or laptop', '2nd monitor', 'Headset', 'Webcam'] },
  { gh: 'Power backup', items: ['Powerbank (laptop-capable)'] },
]

export const INTERNET_SPEEDS = [
  'Below 10 Mbps',
  '10–25 Mbps',
  '25–50 Mbps',
  '50–100 Mbps',
  '100 Mbps+',
]

export const HEAR_OPTIONS = [
  'Facebook',
  'LinkedIn',
  'Telegram',
  'Referral from a friend',
  'Online job fair',
  'Other',
]

export const EMP_TYPES = [
  { val: 'Full-time', sub: '~40 hrs / week' },
  { val: 'Part-time', sub: 'Fewer, flexible hours' },
  { val: 'Project-based', sub: 'Fixed-scope work' },
  { val: 'Open to any', sub: 'Whatever fits best' },
] as const

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const URL_RE = /^https?:\/\/.+\..+/
