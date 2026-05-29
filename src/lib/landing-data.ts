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
  'The platform connecting Ethiopia\'s top professionals to remote work with companies around the world.'

export const MISSION_QUOTE =
  'Our mission is to help solve the underemployment & unemployment crisis facing Ethiopia by providing outsourced opportunities to a qualified workforce. In the future, we want to redefine "livable wages" in Ethiopia.'

export const HERO_IMAGES: HeroImage[] = [
  { src: 'https://picsum.photos/seed/remote-pro-1/400/500', alt: 'RemConnect professional at work' },
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
    body: 'Wait for an email from a RemConnect representative with next steps — timing varies by role.',
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
      'Own customer relationships end-to-end for a fast-growing global SaaS partner — onboarding, retention, expansion.',
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
    q: "What is the difference between RemConnect and other hiring agencies?",
    a: "RemConnect is strictly dedicated to providing opportunities to candidates based in Ethiopia. We have a global outreach and pool of clients from around the world looking to hire top professionals in Ethiopia.",
  },
  {
    q: "Are certifications and degrees required for every position? Do we need prior experience to get hired?",
    a: "No — certifications and/or degrees can help boost your profile but won't definitively determine hiring status. Experience can also aid the process but lack of experience won't deter it. Above all, complete your profile to the best of your ability so we can make the best decision for your fit.",
  },
  {
    q: "Do candidates pay to apply for jobs?",
    a: "No. Do not respond to any inquiry asking for payment of any kind. RemConnect will never ask you to pay fees for any reason.",
  },
  {
    q: "Is there a specific age limit to apply for jobs?",
    a: "Candidates applying to the platform must be at least 18 years old.",
  },
  {
    q: "Do candidates apply directly to jobs or submit documents and wait?",
    a: "A combination of both. Once you submit all required information, you'll be given next steps by an administrator. If multiple opportunities match your skillset, we'll register you for all applicable jobs.",
  },
  {
    q: "Is a LinkedIn account necessary for applying?",
    a: "Yes — a LinkedIn account is absolutely necessary. It shows us, among many things, your level of professionalism, expertise, experience, and education.",
  },
  {
    q: "Do we sign a contract? If so, how long is the term?",
    a: "Yes. A contract is composed before training along with waivers and disclosures regarding company procedure. Contracts will be renewed based on demand. Internal full-time and part-time offers won't have a termination date; all other contracts have termination dates with an option of extension.",
  },
  {
    q: "How do we get paid?",
    a: "Payments are made to your preferred bank of choice. Currency varies by opportunity. You will get a detailed stub that shows your term length, payment amount, bonus/commission amount (if applicable), and any other relevant items.",
  },
  {
    q: "How long is the hiring process? When should I expect a response?",
    a: "Turnaround time depends on the position and job availability. Urgent hires can expect to begin training within a month of interviewing. All other opportunities vary in turnaround time.",
  },
  {
    q: "How is training administered? Where will the training be?",
    a: "Training is held completely virtually. It typically lasts 2-6 weeks depending on the position and is usually determined by our client. You'll get more instructions once you are interviewed and onboarded.",
  },
  {
    q: "Where do we upload documents?",
    a: "All documents should be uploaded in your portal. If it doesn't work, please email docs to our HR manager at bezamariam@remconnect.io.",
  },
]

export const VIDEO_YOUTUBE_ID = '_qiaxTnIarg'

export const APPLY_HREF = '/apply'

