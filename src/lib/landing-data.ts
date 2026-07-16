export type Job = {
  id: string
  title: string
  employmentType: 'Full Time' | 'Part Time' | 'Contract'
  location: string
  salaryRange: string
  blurb: string
}

export type ValueProp = {
  id: string
  icon: string
  title: string
  body: string
}

export type Step = {
  id: string
  n: number
  title: string
  body: string
}

export type Testimonial = {
  id: string
  name: string
  role: string
  quote: string
  tone: number
}

export type Faq = { q: string; a: string }
export type HeroImage = { src: string; alt: string }

export const HERO_BADGE = '30+ jobs matched'

export const HERO_HEADLINE = 'Premiere Talent meets Premiere Opportunities'

export const HERO_SUBHEAD =
  'In an increasingly connected world, your skills are your greatest asset. RemConnect serves as the ultimate catalyst for your professional evolution, bridging the gap between high-tier Ethiopian talent and the global organizations that need them most.'

// Short version for hero display — ≤ 20 words per taste-skill §Hero Constraints
export const HERO_SUBHEAD_DISPLAY =
  "The platform connecting Ethiopia's top professionals to remote work with companies around the world."

export const MISSION_QUOTE =
  'Our mission is to help solve the underemployment & unemployment crisis facing Ethiopia by providing outsourced opportunities to a qualified workforce. In the future, we want to redefine "livable wages" in Ethiopia.'

export const HERO_IMAGES: HeroImage[] = [
  {
    src: 'https://picsum.photos/seed/remote-pro-1/400/500',
    alt: 'RemConnect professional at work',
  },
  { src: 'https://picsum.photos/seed/team-collab-2/400/500', alt: 'Remote team collaboration' },
  { src: 'https://picsum.photos/seed/desk-setup-3/400/500', alt: 'Home office setup' },
  { src: 'https://picsum.photos/seed/meeting-4/400/500', alt: 'Global team meeting' },
]

export const VALUE_PROPS: ValueProp[] = [
  {
    id: 'vetted',
    icon: 'shield',
    title: 'Vetted talent',
    body: 'Every candidate is reviewed for skill, experience, and English fluency before introductions are made.',
  },
  {
    id: 'wages',
    icon: 'wallet',
    title: 'Fair, livable wages',
    body: 'We benchmark every role to redefine what livable income looks like for Ethiopian professionals.',
  },
  {
    id: 'remote',
    icon: 'globe',
    title: 'Remote-first, global reach',
    body: 'Work with teams in the US, Europe, and beyond — from anywhere in Ethiopia, on schedules that fit.',
  },
  {
    id: 'support',
    icon: 'headset',
    title: 'End-to-end placement',
    body: 'From intake to onboarding to ongoing support, our team stays with you across the full hiring journey.',
  },
]

export const STEPS: Step[] = [
  {
    id: 'submit',
    n: 1,
    title: 'Submit your profile',
    body: 'Complete your candidate profile and account with all the requirements filled in.',
  },
  {
    id: 'match',
    n: 2,
    title: 'Match & interview',
    body: 'Wait for an email from a RemConnect representative with next steps. Timing varies by role.',
  },
  {
    id: 'hired',
    n: 3,
    title: 'Get hired',
    body: 'If selected, choose from the available positions offered and start training within weeks.',
  },
]

export const FEATURED_JOBS: Job[] = [
  {
    id: 'fullstack-ai',
    title: 'Full Stack Developer (Backend & AI Integrations)',
    employmentType: 'Full Time',
    location: 'Remote',
    salaryRange: '40,000 – 60,000 ETB',
    blurb:
      'Design and build robust backend systems and WordPress-based solutions enhanced with modern AI workflows.',
  },
  {
    id: 'customer-success',
    title: 'Customer Success Specialist',
    employmentType: 'Full Time',
    location: 'Remote',
    salaryRange: '30,000 – 45,000 ETB',
    blurb:
      'Own customer relationships end-to-end for a fast-growing global SaaS partner across onboarding, retention, and expansion.',
  },
  {
    id: 'ai-ops',
    title: 'AI Operations Analyst',
    employmentType: 'Contract',
    location: 'Remote',
    salaryRange: '35,000 – 50,000 ETB',
    blurb:
      'Evaluate model outputs, tune prompts, and partner with engineering on quality benchmarks for AI products.',
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'yohannes',
    name: 'Yohannes Haile',
    role: 'Software Developer, placed remotely',
    tone: 0,
    quote:
      'I was struggling to find a job in my field, but thanks to RemConnect I found the perfect opportunity. The platform is user-friendly and helped me navigate the job search process with ease.',
  },
  {
    id: 'marcus',
    name: 'Marcus Webb',
    role: 'HR Director, global SaaS company',
    tone: 2,
    quote:
      'I have been using RemConnect to find talented professionals for my business and have been impressed with the quality of candidates. It is a valuable resource for connecting with top talent around the world.',
  },
  {
    id: 'selam',
    name: 'Selam Girma',
    role: 'Customer Success Specialist, placed remotely',
    tone: 3,
    quote:
      'RemConnect helped me find the perfect opportunity abroad. The platform offered a wide range of listings and made it easy to apply. I would highly recommend it to anyone looking for remote work.',
  },
]
export const FAQS: Faq[] = [
  {
    q: 'What is the difference between RemConnect and other hiring agencies?',
    a: 'RemConnect is strictly dedicated to providing opportunities to candidates based in Ethiopia. We have a global outreach and pool of clients from around the world looking to hire top professionals in Ethiopia.',
  },
  {
    q: 'Are certifications and degrees required for every position? Do we need prior experience to get hired?',
    a: "No. Certifications and/or degrees can help boost your profile but won't definitively determine hiring status. Experience can also aid the process but lack of experience won't deter it. Above all, complete your profile to the best of your ability so we can make the best decision for your fit.",
  },
  {
    q: 'Do candidates pay to apply for jobs?',
    a: 'No. Do not respond to any inquiry asking for payment of any kind. RemConnect will never ask you to pay fees for any reason.',
  },
  {
    q: 'Is there a specific age limit to apply for jobs?',
    a: 'Candidates applying to the platform must be at least 18 years old.',
  },
  {
    q: 'Do candidates apply directly to jobs or submit documents and wait?',
    a: "A combination of both. Once you submit all required information, you'll be given next steps by an administrator. If multiple opportunities match your skillset, we'll register you for all applicable jobs.",
  },
  {
    q: 'Is a LinkedIn account necessary for applying?',
    a: 'Yes. A LinkedIn account is absolutely necessary. It shows us, among many things, your level of professionalism, expertise, experience, and education.',
  },
  {
    q: 'Do we sign a contract? If so, how long is the term?',
    a: "Yes. A contract is composed before training along with waivers and disclosures regarding company procedure. Contracts will be renewed based on demand. Internal full-time and part-time offers won't have a termination date; all other contracts have termination dates with an option of extension.",
  },
  {
    q: 'How do we get paid?',
    a: 'Payments are made to your preferred bank of choice. Currency varies by opportunity. You will get a detailed stub that shows your term length, payment amount, bonus/commission amount (if applicable), and any other relevant items.',
  },
  {
    q: 'How long is the hiring process? When should I expect a response?',
    a: 'Turnaround time depends on the position and job availability. Urgent hires can expect to begin training within a month of interviewing. All other opportunities vary in turnaround time.',
  },
  {
    q: 'How is training administered? Where will the training be?',
    a: "Training is held completely virtually. It typically lasts 2-6 weeks depending on the position and is usually determined by our client. You'll get more instructions once you are interviewed and onboarded.",
  },
  {
    q: 'Where do we upload documents?',
    a: "All documents should be uploaded in your portal. If it doesn't work, please email docs to our HR manager at bezamariam@remconnect.io.",
  },
]

export const VIDEO_YOUTUBE_ID = '_qiaxTnIarg'

export const APPLY_HREF = '/apply'

// RemConnect runs a separate site for employers; this is the only outbound nod.
export const EMPLOYERS_HREF = 'https://remconnect.io/employers' // TODO: confirm client-site URL

/* ─── Candidate-facing data (homepage rebuild) ───────────────────── */

// ── Trust / stats bar ──
export type Stat = { value: number; prefix?: string; suffix?: string; label: string }

// TODO: confirm — representative figures, replace with real metrics before launch.
export const STATS: Stat[] = [
  { value: 100, suffix: '+', label: 'Professionals placed' },
  { value: 15, suffix: '+', label: 'Companies hiring' },
  { value: 6, prefix: '2–', suffix: ' wks', label: 'Avg. time to placement' },
  { value: 0, suffix: '', label: 'Fees, ever' },
]

// ── Role categories + salary bands ("is this for me?") ──
export type RoleCategory = {
  id: string
  name: string
  icon: string
  salaryBand: string
  examples: string[]
}

// Bands anchored to existing job ranges where available; others marked.
export const ROLE_CATEGORIES: RoleCategory[] = [
  {
    id: 'support',
    name: 'Customer Support',
    icon: 'headset',
    salaryBand: '30,000 – 45,000 ETB',
    examples: ['Customer Success', 'Technical Support', 'Live Chat & Email'],
  },
  {
    id: 'engineering',
    name: 'Software & Engineering',
    icon: 'code',
    salaryBand: '40,000 – 60,000 ETB',
    examples: ['Full Stack Developer', 'Frontend Engineer', 'QA Engineer'],
  },
  {
    id: 'ai-data',
    name: 'AI & Data Operations',
    icon: 'spark',
    salaryBand: '35,000 – 50,000 ETB', // TODO: confirm
    examples: ['AI Operations Analyst', 'Data Annotation', 'Prompt Evaluation'],
  },
  {
    id: 'admin',
    name: 'Admin & Virtual Assistance',
    icon: 'clipboard',
    salaryBand: '25,000 – 38,000 ETB', // TODO: confirm
    examples: ['Executive Assistant', 'Operations Coordinator', 'Scheduling'],
  },
  {
    id: 'sales',
    name: 'Sales & Outreach',
    icon: 'megaphone',
    salaryBand: '28,000 – 48,000 ETB', // TODO: confirm (+ commission)
    examples: ['SDR / Lead Gen', 'Account Management', 'Appointment Setting'],
  },
  {
    id: 'finance',
    name: 'Finance & Bookkeeping',
    icon: 'wallet',
    salaryBand: '32,000 – 50,000 ETB', // TODO: confirm
    examples: ['Bookkeeper', 'Accounts Payable', 'Financial Analyst'],
  },
]

// ── What you get (candidate benefits) ──
export type Benefit = { id: string; icon: string; title: string; body: string }

export const BENEFITS: Benefit[] = [
  {
    id: 'training',
    icon: 'spark',
    title: 'Training, fully provided',
    body: 'Roles include 2–6 weeks of virtual training run by the client, so you start prepared, not thrown in.',
  },
  {
    id: 'pay',
    icon: 'wallet',
    title: 'Paid to your own bank',
    body: 'Payments go to your preferred bank with a detailed stub: term length, amount, and any bonus or commission.',
  },
  {
    id: 'currency',
    icon: 'globe',
    title: 'Clarity on currency',
    body: 'Currency varies by opportunity and is spelled out before you sign. No surprises, no hidden math.',
  },
  {
    id: 'support',
    icon: 'headset',
    title: 'Support that stays',
    body: 'From intake to onboarding and beyond, a RemConnect representative stays with you through the whole journey.',
  },
  {
    id: 'contract',
    icon: 'shield',
    title: 'A real, written contract',
    body: 'Every placement comes with a formal contract and clear terms composed before training begins.',
  },
]

// ── Requirements checklist (self-qualification) ──
export type Requirement = { label: string; detail: string }

export const REQUIREMENTS: Requirement[] = [
  {
    label: 'You are 18 or older',
    detail: 'All candidates on the platform must be at least 18 years old.',
  },
  {
    label: 'A LinkedIn account',
    detail: 'Required. It shows us your professionalism, experience, and education at a glance.',
  },
  {
    label: 'Working English',
    detail: 'Comfortable communicating with global teams in written and spoken English.',
  },
  {
    label: 'Your documents ready',
    detail: 'CV and supporting documents uploaded in your portal so we can match you faster.',
  },
  {
    label: 'A complete profile',
    detail: 'No degree required, but the fuller your profile, the better we can place you.',
  },
]

// ── Legitimacy: what we will / will never do ──
export const LEGIT_WILL: string[] = [
  'Match you to roles completely free of charge',
  'Pay you directly to your chosen bank account',
  'Put every offer in a written contract before training',
  'Provide virtual training run by the hiring company',
  'Give you next steps through your portal and our team',
]

export const LEGIT_WONT: string[] = [
  'Ask you to pay a fee for any reason, ever',
  'Recruit you through random DMs or unofficial accounts',
  'Promise a guaranteed job without a real process',
  'Request payment for training, equipment, or placement',
  'Ask for sensitive details outside your secure portal',
]

// ── Success stories (real placed professionals) ──
// TODO: confirm consent + replace with each person's real quote and outcome.
export type SuccessStory = {
  id: string
  img: string
  name: string
  role: string
  placedAt: string
  quote: string
  outcome: string
}

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'ermias',
    img: '/agents/ermias-lemma.png',
    name: 'Ermias Lemma',
    role: 'Full Stack Developer',
    placedAt: 'Global SaaS company',
    outcome: 'Placed remotely',
    quote:
      'I was struggling to find work in my field. Through RemConnect I found the perfect opportunity. The process was clear and they stayed with me the whole way.',
  },
  {
    id: 'nahom',
    img: '/agents/nahom-dereje.jpg',
    name: 'Nahom Dereje',
    role: 'Customer Success Specialist',
    placedAt: 'US tech startup',
    outcome: 'Placed remotely',
    quote:
      'RemConnect helped me land a role with a company abroad. Applying was simple, and the training meant I started genuinely ready.',
  },
  {
    id: 'tensae',
    img: '/agents/tensae-wubeshet.jpg',
    name: 'Tensae Wubeshet',
    role: 'AI Operations Analyst',
    placedAt: 'AI product team',
    outcome: 'Placed remotely',
    quote:
      'From application to onboarding everything was handled. I now work on AI quality benchmarks for a team I never could have reached on my own.',
  },
  {
    id: 'bezawit',
    img: '/agents/bezawit-berhanu.png',
    name: 'Bezawit Berhanu',
    role: 'Operations Coordinator',
    placedAt: 'International agency',
    outcome: 'Placed remotely',
    quote:
      'The platform made the search easy and the wage is genuinely livable. I would recommend RemConnect to anyone looking for remote work.',
  },
]

// ── Landing testimonials/cards — real RemConnect agents (deployed), with photos ──
export type LandingStory = {
  id: string
  photo: string
  name: string
  role: string
  quote: string
  bg: string
  stats: { v: string; sl: string }[]
}

export const LANDING_STORIES: LandingStory[] = [
  {
    id: 'nahom',
    photo: '/agents/nahom-dereje.jpg',
    name: 'Nahom Dereje',
    role: 'Sales Development · Northwind Support',
    bg: 'linear-gradient(160deg,#1d6fd6,#0c3a7a)',
    quote:
      'I came in with sales experience but no remote background. RemConnect trained me, certified me, and placed me with a US team in six weeks.',
    stats: [
      { v: '6 wks', sl: 'To first shift' },
      { v: '89', sl: 'QA score' },
    ],
  },
  {
    id: 'kalkidan',
    photo: '/agents/kalkidan.png',
    name: 'Kalkidan Yilkal',
    role: 'Sales Development · Lumen Telecom',
    bg: 'linear-gradient(160deg,#3a4a66,#1a2338)',
    quote:
      'Applying took ten minutes and the training meant I started genuinely ready. I’m paid in USD, on time, every single month.',
    stats: [
      { v: 'USD', sl: 'Paid monthly' },
      { v: '88', sl: 'QA score' },
    ],
  },
  {
    id: 'ermias',
    photo: '/agents/ermias-lemma.png',
    name: 'Ermias Lemma',
    role: 'Customer Support · Riverstone Health',
    bg: 'linear-gradient(160deg,#0b4fa8,#0c3a7a)',
    quote:
      'The coaching is the real deal. My QA scores climbed fast and I’m now one of the top performers on my team.',
    stats: [
      { v: '90', sl: 'QA score' },
      { v: '4.7', sl: 'CSAT' },
    ],
  },
  {
    id: 'tensae',
    photo: '/agents/tensae-wubeshet.jpg',
    name: 'Tensae Wubeshet',
    role: 'Customer Support · Apex Insurance',
    bg: 'linear-gradient(160deg,#24507e,#0d1f3c)',
    quote:
      'From application to onboarding, everything was handled. I work with an international team I never could have reached on my own.',
    stats: [
      { v: '87', sl: 'QA score' },
      { v: 'Top 10%', sl: 'Team rank' },
    ],
  },
]

// Single featured agent used in the hero chip, the profile showcase, and the trust quote.
export const LANDING_FEATURE_AGENT = {
  photo: '/agents/nahom-dereje.jpg',
  name: 'Nahom Dereje',
  short: 'Nahom D.',
  idTag: 'RC-AGENT · #3005 · Cohort 13',
  statusLine: 'Deployed · Northwind Support',
  role: 'Sales Development · Addis Ababa',
  qa: 89,
  chips: [{ label: 'Outbound' }, { label: 'CRM' }, { label: 'Client-ready', good: true }],
  skills: [
    { l: 'English', v: 86 },
    { l: 'Rapport', v: 92 },
    { l: 'QA score', v: 89 },
    { l: 'CRM & tools', v: 84 },
  ],
  quote:
    'RemConnect didn’t just get me a job — they built the skills that keep clients asking for me by name.',
  quoteRole: 'Sales Development · Northwind Support',
}

// Real agent portraits for the hero trust strip (first three) + an overflow "+".
export const LANDING_TRUST_AVATARS = [
  { photo: '/agents/nahom-dereje.jpg', name: 'Nahom Dereje' },
  { photo: '/agents/kalkidan.png', name: 'Kalkidan Yilkal' },
  { photo: '/agents/ermias-lemma.png', name: 'Ermias Lemma' },
]
