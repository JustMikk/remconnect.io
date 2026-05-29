import type { Permission, Role, AdminUser, AuditEntry, SampleAgent, AgentProfileExtras } from '@/types/admin'

export const PERMISSIONS: Permission[] = [
  // Agents (6)
  { id: 'agents.view',        domain: 'Agents',         label: 'View agent directory',           desc: 'See all agents, filter & search.',                            tier: 'low'      },
  { id: 'agents.edit',        domain: 'Agents',         label: 'Edit agent profiles',            desc: 'Change name, contact, profile fields.',                       tier: 'med'      },
  { id: 'agents.deploy',      domain: 'Agents',         label: 'Deploy to client',               desc: 'Move an agent into an active client engagement.',             tier: 'high'     },
  { id: 'agents.deactivate',  domain: 'Agents',         label: 'Deactivate agent',               desc: 'Offboard an agent account permanently.',                      tier: 'high'     },
  { id: 'agents.impersonate', domain: 'Agents',         label: 'Impersonate agent',              desc: 'Log in as an agent to reproduce issues. Heavily audited.',    tier: 'critical' },
  { id: 'agents.pii',         domain: 'Agents',         label: 'View agent PII & documents',     desc: 'Government IDs, tax forms, bank details.',                    tier: 'critical' },
  // Candidates (3)
  { id: 'candidates.view',    domain: 'Candidates',     label: 'View candidate pipeline',        desc: 'Inbound applicants, referrals, sourcing lists.',              tier: 'low'      },
  { id: 'candidates.advance', domain: 'Candidates',     label: 'Advance or reject candidates',   desc: 'Move through stages, issue rejections.',                      tier: 'med'      },
  { id: 'candidates.offer',   domain: 'Candidates',     label: 'Extend offers',                  desc: 'Generate and send offer letters with compensation.',          tier: 'high'     },
  // Training (5)
  { id: 'training.view',      domain: 'Training',       label: 'View course catalog',            desc: 'Browse all training content.',                                tier: 'low'      },
  { id: 'training.assign',    domain: 'Training',       label: 'Assign courses to roles',        desc: 'Attach specific training to a job title or cohort.',          tier: 'med'      },
  { id: 'training.author',    domain: 'Training',       label: 'Create & edit courses',          desc: 'Upload new training modules, edit existing ones.',            tier: 'med'      },
  { id: 'training.archive',   domain: 'Training',       label: 'Archive or retire courses',      desc: 'Pull content out of circulation.',                            tier: 'med'      },
  { id: 'certs.issue',        domain: 'Certifications', label: 'Issue & revoke certifications',  desc: 'Mint or pull RemConnect-verified credentials.',               tier: 'high'     },
  // Performance (4)
  { id: 'perf.view',          domain: 'Performance',    label: 'View performance scorecards',    desc: 'See agent KPIs, quality scores, trend lines.',                tier: 'low'      },
  { id: 'qa.review',          domain: 'Performance',    label: 'Review calls & chats',           desc: 'Listen to recordings, leave QA feedback.',                   tier: 'med'      },
  { id: 'perf.coach',         domain: 'Performance',    label: 'Assign coaching plans',          desc: 'Create PIPs, coaching sprints, improvement tracks.',          tier: 'med'      },
  { id: 'perf.terminate',     domain: 'Performance',    label: 'Initiate termination',           desc: 'Trigger the formal exit flow for an agent.',                 tier: 'critical' },
  // Assessments (2)
  { id: 'assess.author',      domain: 'Assessments',    label: 'Author AI interviews',           desc: 'Create new assessment templates and scoring rubrics.',        tier: 'med'      },
  { id: 'assess.grade',       domain: 'Assessments',    label: 'Grade & publish results',        desc: 'Approve AI-graded results, release to candidate.',            tier: 'high'     },
  // Opportunities (2)
  { id: 'opps.create',        domain: 'Opportunities',  label: 'Create opportunities',           desc: 'Open a new requisition from a client brief.',                tier: 'med'      },
  { id: 'opps.approve',       domain: 'Opportunities',  label: 'Approve deployments',            desc: 'Sign off on a final client match before contract.',           tier: 'high'     },
  // Clients (4)
  { id: 'clients.manage',     domain: 'Clients',        label: 'Manage client accounts',         desc: 'Add, edit, offboard clients.',                                tier: 'high'     },
  { id: 'clients.contract',   domain: 'Clients',        label: 'Edit contracts & rates',         desc: 'Change billing, SOWs, margins.',                              tier: 'critical' },
  { id: 'clients.portal',     domain: 'Clients',        label: 'Manage client portal users',     desc: 'Invite / remove the client-side users who see their agents.', tier: 'high'     },
  { id: 'clients.offboard',   domain: 'Clients',        label: 'Offboard client',                desc: 'Close an account, release deployed agents.',                 tier: 'critical' },
  // Finance (4)
  { id: 'payroll.view',       domain: 'Finance',        label: 'View payroll & earnings',        desc: 'See agent earnings, client invoices.',                        tier: 'med'      },
  { id: 'payroll.approve',    domain: 'Finance',        label: 'Approve payouts',                desc: 'Release weekly/biweekly agent payments.',                     tier: 'critical' },
  { id: 'payroll.tax',        domain: 'Finance',        label: 'Manage tax & compliance docs',   desc: 'W-8, W-9, 1099, country-specific forms.',                    tier: 'critical' },
  { id: 'invoices.send',      domain: 'Finance',        label: 'Issue & send client invoices',   desc: 'Generate invoices, trigger collection.',                      tier: 'high'     },
  // Remote setup (2)
  { id: 'equipment.manage',   domain: 'Remote setup',   label: 'Manage equipment stipends',      desc: 'Approve laptops, headsets, internet reimbursements.',         tier: 'med'      },
  { id: 'equipment.revoke',   domain: 'Remote setup',   label: 'Revoke device access',           desc: 'Remote-wipe or block a managed device.',                     tier: 'high'     },
  // Community (2)
  { id: 'community.moderate', domain: 'Community',      label: 'Moderate community content',     desc: 'Hide posts, ban users, manage forum rules.',                  tier: 'med'      },
  { id: 'notifications.send', domain: 'Community',      label: 'Send platform announcements',    desc: 'Push notifications and emails to agent cohorts.',             tier: 'med'      },
  // System (4)
  { id: 'sys.integrations',   domain: 'System',         label: 'Manage integrations',            desc: 'Slack, Salesforce, Zoom, telephony.',                         tier: 'high'     },
  { id: 'sys.api',            domain: 'System',         label: 'Manage API keys',                desc: 'Rotate tokens, add service accounts.',                        tier: 'critical' },
  { id: 'sys.billing',        domain: 'System',         label: 'Edit platform billing',          desc: 'RemConnect-level subscription, seats.',                       tier: 'critical' },
  { id: 'sys.feature-flags',  domain: 'System',         label: 'Toggle feature flags',           desc: 'Enable betas, A/B tests, kill-switches.',                    tier: 'high'     },
  // Data (2)
  { id: 'data.export',        domain: 'Data',           label: 'Bulk-export data',               desc: 'Download agent, client or financial datasets.',               tier: 'critical' },
  { id: 'data.gdpr',          domain: 'Data',           label: 'Handle GDPR / data requests',   desc: 'Action right-to-erasure, data-portability requests.',         tier: 'critical' },
  // Admin accounts (2)
  { id: 'admins.invite',      domain: 'Admin accounts', label: 'Invite new admins',              desc: 'Add people to the admin portal.',                             tier: 'high'     },
  { id: 'admins.roles',       domain: 'Admin accounts', label: 'Edit admin roles',               desc: 'Change what each title can do. Destructive.',                tier: 'critical' },
  // Audit (2)
  { id: 'audit.view',         domain: 'Audit',          label: 'View audit log',                 desc: 'See who did what, when, where.',                              tier: 'low'      },
  { id: 'audit.export',       domain: 'Audit',          label: 'Export audit log to SIEM',       desc: 'Stream events to Splunk, Datadog, etc.',                     tier: 'high'     },
]

export const DOMAINS = [
  'Agents', 'Candidates', 'Training', 'Certifications', 'Performance',
  'Assessments', 'Opportunities', 'Clients', 'Finance', 'Remote setup',
  'Community', 'System', 'Data', 'Admin accounts', 'Audit',
]

export const ROLES: Role[] = [
  {
    id: 'super', title: 'Super Admin', short: 'Unrestricted access. Reserved for founders & CTO.',
    color: '#0b4fa8', perms: PERMISSIONS.map(p => p.id),
  },
  {
    id: 'hr', title: 'HR Manager', short: 'Owns agent lifecycle, training & certifications.',
    color: '#3f6b4e',
    perms: ['agents.view','agents.edit','agents.deactivate','agents.pii','candidates.view','candidates.advance','candidates.offer','training.view','training.assign','training.author','certs.issue','perf.view','perf.coach','assess.grade','equipment.manage','community.moderate','notifications.send','data.gdpr','audit.view'],
  },
  {
    id: 'recruiter', title: 'Recruiter', short: 'Screens candidates, runs AI interviews.',
    color: '#4a6b8a',
    perms: ['agents.view','agents.edit','candidates.view','candidates.advance','training.view','assess.author','assess.grade','opps.create'],
  },
  {
    id: 'sales', title: 'Sales Team Lead', short: 'Owns client pipeline & deployment approvals.',
    color: '#b54838',
    perms: ['agents.view','perf.view','opps.create','opps.approve','clients.manage','clients.contract','clients.portal','invoices.send','payroll.view','notifications.send','audit.view'],
  },
  {
    id: 'ops', title: 'Operations Manager', short: 'Runs day-to-day deployments and QA.',
    color: '#1d6fd6',
    perms: ['agents.view','agents.edit','agents.deploy','training.view','training.assign','perf.view','qa.review','perf.coach','perf.terminate','opps.create','opps.approve','clients.manage','clients.portal','equipment.manage','equipment.revoke','payroll.view','notifications.send','audit.view'],
  },
  {
    id: 'eng', title: 'Lead Developer', short: 'Platform engineering, integrations, API.',
    color: '#1a2338',
    perms: ['agents.view','agents.impersonate','sys.integrations','sys.api','sys.feature-flags','equipment.revoke','audit.view','audit.export'],
  },
  {
    id: 'ld', title: 'Training / L&D Lead', short: 'Designs curricula & measures skill uplift.',
    color: '#c08a2a',
    perms: ['agents.view','training.view','training.assign','training.author','training.archive','certs.issue','perf.view','assess.author','assess.grade','notifications.send'],
  },
  {
    id: 'qa', title: 'QA / Quality Lead', short: 'Reviews calls & chats; flags coaching needs.',
    color: '#0c3a7a',
    perms: ['agents.view','perf.view','qa.review','perf.coach','community.moderate'],
  },
  {
    id: 'finance', title: 'Finance / Payroll', short: 'Pays agents, bills clients, owns contracts.',
    color: '#2f8d5c',
    perms: ['agents.view','agents.pii','clients.manage','clients.contract','clients.offboard','payroll.view','payroll.approve','payroll.tax','invoices.send','sys.billing','data.export','audit.view','audit.export'],
  },
  {
    id: 'client', title: 'Client Success Manager', short: 'Day-to-day liaison with deployed-client accounts.',
    color: '#4a6b8a',
    perms: ['agents.view','perf.view','qa.review','opps.create','clients.manage','clients.portal','payroll.view','notifications.send'],
  },
]

export const ADMINS: AdminUser[] = [
  { id: 'u-1',  name: 'Meron Tadesse',    email: 'meron@remconnect.io',    role: 'super',     joined: '2023-04-02', last: '12 min ago',  mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-2',  name: 'Daniel Alemayehu', email: 'daniel@remconnect.io',   role: 'super',     joined: '2023-04-02', last: '2 h ago',     mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-3',  name: 'Hanna Wolde',      email: 'hanna.w@remconnect.io',  role: 'hr',        joined: '2023-08-14', last: '28 min ago',  mfa: true,  status: 'active',    overrides: { 'admins.invite': true } },
  { id: 'u-4',  name: 'Bethel Kebede',    email: 'bethel@remconnect.io',   role: 'hr',        joined: '2024-01-09', last: 'Yesterday',   mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-5',  name: 'Yonatan Girma',    email: 'yoni@remconnect.io',     role: 'hr',        joined: '2024-05-22', last: '4 d ago',     mfa: false, status: 'active',    overrides: {} },
  { id: 'u-6',  name: 'Selam Bekele',     email: 'selam.b@remconnect.io',  role: 'recruiter', joined: '2024-02-18', last: '1 h ago',     mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-7',  name: 'Abel Tesfaye',     email: 'abel@remconnect.io',     role: 'recruiter', joined: '2024-06-01', last: '45 min ago',  mfa: true,  status: 'active',    overrides: { 'opps.approve': true } },
  { id: 'u-8',  name: 'Rahel Mulatu',     email: 'rahel@remconnect.io',    role: 'recruiter', joined: '2024-09-11', last: '3 h ago',     mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-9',  name: 'Dawit Mengistu',   email: 'dawit@remconnect.io',    role: 'recruiter', joined: '2025-01-07', last: '—',           mfa: false, status: 'pending',   overrides: {} },
  { id: 'u-10', name: 'Helen Assefa',     email: 'helen@remconnect.io',    role: 'sales',     joined: '2023-11-02', last: '5 min ago',   mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-11', name: 'Tewodros Bekele',  email: 'teddy@remconnect.io',    role: 'sales',     joined: '2024-03-28', last: '20 min ago',  mfa: true,  status: 'active',    overrides: { 'clients.contract': false } },
  { id: 'u-12', name: 'Liya Girmay',      email: 'liya.g@remconnect.io',   role: 'ops',       joined: '2023-07-19', last: 'just now',    mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-13', name: 'Samuel Hailu',     email: 'sam@remconnect.io',      role: 'ops',       joined: '2024-04-11', last: '1 h ago',     mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-14', name: 'Nahom Yilma',      email: 'nahom@remconnect.io',    role: 'ops',       joined: '2024-10-03', last: '6 h ago',     mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-15', name: 'Mikias Solomon',   email: 'mikias@remconnect.io',   role: 'eng',       joined: '2023-05-10', last: '15 min ago',  mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-16', name: 'Kalkidan Fikru',   email: 'kal@remconnect.io',      role: 'eng',       joined: '2024-02-06', last: '40 min ago',  mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-17', name: 'Surafel Aman',     email: 'sura@remconnect.io',     role: 'ld',        joined: '2024-01-22', last: '2 h ago',     mfa: true,  status: 'active',    overrides: { 'agents.edit': true } },
  { id: 'u-18', name: 'Tigist Haile',     email: 'tigist@remconnect.io',   role: 'ld',        joined: '2024-08-15', last: '1 d ago',     mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-19', name: 'Betelhem Amare',   email: 'beti@remconnect.io',     role: 'qa',        joined: '2024-03-04', last: '30 min ago',  mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-20', name: 'Eyob Tsegaye',     email: 'eyob@remconnect.io',     role: 'qa',        joined: '2024-07-29', last: '2 h ago',     mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-21', name: 'Mahlet Zeleke',    email: 'mahlet@remconnect.io',   role: 'qa',        joined: '2025-02-12', last: '—',           mfa: false, status: 'suspended', overrides: {} },
  { id: 'u-22', name: 'Robel Desta',      email: 'robel@remconnect.io',    role: 'finance',   joined: '2023-09-01', last: '10 min ago',  mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-23', name: 'Senait Teklu',     email: 'senait@remconnect.io',   role: 'finance',   joined: '2024-05-19', last: '3 h ago',     mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-24', name: 'Yohannes Abebe',   email: 'yohannes@remconnect.io', role: 'client',    joined: '2023-12-08', last: '50 min ago',  mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-25', name: 'Fitsum Gebre',     email: 'fitsum@remconnect.io',   role: 'client',    joined: '2024-04-25', last: '1 h ago',     mfa: true,  status: 'active',    overrides: {} },
  { id: 'u-26', name: 'Ruth Lemma',       email: 'ruth@remconnect.io',     role: 'client',    joined: '2024-11-30', last: '4 h ago',     mfa: true,  status: 'active',    overrides: { 'perf.coach': true } },
  { id: 'u-27', name: 'Kidist Tamrat',    email: 'kidist@remconnect.io',   role: 'client',    joined: '2025-02-02', last: 'Yesterday',   mfa: false, status: 'active',    overrides: {} },
]

export const AUDIT: AuditEntry[] = [
  { id: 'a-1',  at: '2 min ago',  who: 'Meron Tadesse',   role: 'Super Admin',         action: 'Approved deployment',    target: 'Semhal A. → Northwind Support',              tier: 'high'     },
  { id: 'a-2',  at: '14 min ago', who: 'Liya Girmay',     role: 'Operations Manager',  action: 'Assigned coaching plan', target: 'Agent AD-2814',                              tier: 'med'      },
  { id: 'a-3',  at: '28 min ago', who: 'Hanna Wolde',     role: 'HR Manager',          action: 'Issued certification',   target: 'AWS Cloud Support · Dagim T.',               tier: 'high'     },
  { id: 'a-4',  at: '35 min ago', who: 'Abel Tesfaye',    role: 'Recruiter',           action: 'Graded AI interview',    target: 'Candidate C-9812',                           tier: 'med'      },
  { id: 'a-5',  at: '1 h ago',    who: 'Mikias Solomon',  role: 'Lead Developer',      action: 'Rotated API key',        target: 'Salesforce connector',                       tier: 'critical' },
  { id: 'a-6',  at: '1 h ago',    who: 'Tewodros Bekele', role: 'Sales Team Lead',     action: 'Created opportunity',    target: 'Acme Rivers — 12 seat CS expansion',         tier: 'med'      },
  { id: 'a-7',  at: '2 h ago',    who: 'Robel Desta',     role: 'Finance / Payroll',   action: 'Approved payout batch',  target: 'Cycle 47 · 418 agents · $284,902',           tier: 'critical' },
  { id: 'a-8',  at: '3 h ago',    who: 'Surafel Aman',    role: 'Training / L&D Lead', action: 'Published course',       target: 'Objection Handling v3',                      tier: 'low'      },
  { id: 'a-9',  at: '4 h ago',    who: 'Betelhem Amare',  role: 'QA / Quality Lead',   action: 'Reviewed call',          target: 'Call #882-1194 · flagged for coaching',      tier: 'low'      },
  { id: 'a-10', at: '5 h ago',    who: 'Meron Tadesse',   role: 'Super Admin',         action: 'Edited role permissions',target: 'Recruiter · added opps.approve override',    tier: 'critical' },
  { id: 'a-11', at: 'Yesterday',  who: 'Yohannes Abebe',  role: 'Client Success Mgr.', action: 'Updated client record',  target: 'Northwind Support — renewal Q3',             tier: 'med'      },
  { id: 'a-12', at: 'Yesterday',  who: 'Daniel Alemayehu',role: 'Super Admin',         action: 'Invited admin',          target: 'kidist@remconnect.io → Client Success',      tier: 'high'     },
  { id: 'a-13', at: '2 d ago',    who: 'Hanna Wolde',     role: 'HR Manager',          action: 'Assigned course to role',target: 'Bilingual Support Fundamentals → all recruits', tier: 'med'   },
  { id: 'a-14', at: '2 d ago',    who: 'Helen Assefa',    role: 'Sales Team Lead',     action: 'Edited client contract', target: 'Riverstone Health — rate +$3/hr',            tier: 'critical' },
]

export const SAMPLE_AGENTS: SampleAgent[] = [
  // Real agents from resume files
  { id: 'AD-3001', name: 'Bezawit Berhanu',  role: 'Sales Dev Rep',      status: 'bench',    client: '—', score: 82, certs: 2, years: 2, langs: ['EN','AM'],      skills: ['Outbound','CRM tools','Sales prospecting','Customer service'], rate: 5.0, photo: '/agents/bezawit-berhanu.png' },
  { id: 'AD-3002', name: 'Nahom Dereje',     role: 'Biz Dev Rep',        status: 'bench',    client: '—', score: 86, certs: 3, years: 3, langs: ['EN','AM'],      skills: ['B2B Sales','Objection Handling','Partnership building','Research'], rate: 5.2, photo: '/agents/nahom-dereje.jpg' },
  { id: 'AD-3003', name: 'Ermias Lemma',     role: 'SDR / A2P Specialist',status: 'bench',   client: '—', score: 83, certs: 2, years: 3, langs: ['EN','AM','FR'], skills: ['B2B Cold Calling','HubSpot','Apollo','A2P SMS','Lead Qualification'], rate: 5.4, photo: '/agents/ermias-lemma.png' },
  { id: 'AD-3004', name: 'Tensae Wubeshet',  role: 'Sales Dev Rep',      status: 'bench',    client: '—', score: 78, certs: 1, years: 1, langs: ['EN','AM'],      skills: ['Outbound','Communication','Sales'], rate: 4.8, photo: '/agents/tensae-wubeshet.jpg' },
  // Mock agents
  { id: 'AD-2847', name: 'Liya Demeke',      role: 'Bilingual CS',    status: 'deployed', client: 'Northwind',   score: 94, certs: 4, years: 4, langs: ['EN','AM','OM'], skills: ['Voice support','De-escalation','Zendesk','PCI'], rate: 7.2 },
  { id: 'AD-2814', name: 'Semhal Abebe',     role: 'Sales Dev Rep',   status: 'deployed', client: 'Acme Rivers', score: 88, certs: 3, years: 3, langs: ['EN','AM'],      skills: ['Outbound','HubSpot','Discovery calls'], rate: 6.8 },
  { id: 'AD-2801', name: 'Dagim Teshome',    role: 'Cloud Support',   status: 'bench',    client: '—',           score: 91, certs: 5, years: 5, langs: ['EN','AM'],      skills: ['AWS','Linux','Tier-2 triage','Runbooks'], rate: 9.4 },
  { id: 'AD-2789', name: 'Yeabsira Tolcha',  role: 'AI Annotation',   status: 'deployed', client: 'Riverstone',  score: 86, certs: 2, years: 2, langs: ['EN','AM'],      skills: ['Labelling','QA review','LLM eval'], rate: 5.6 },
  { id: 'AD-2776', name: 'Kirubel Ashenafi', role: 'Bilingual CS',    status: 'assess',   client: '—',           score: 79, certs: 1, years: 2, langs: ['EN','AM','TI'], skills: ['Voice support','Email','Intercom'], rate: 5.2 },
  { id: 'AD-2762', name: 'Hermela Asrat',    role: 'SDR',             status: 'recruit',  client: '—',           score: 74, certs: 1, years: 1, langs: ['EN','AM'],      skills: ['Outbound','LinkedIn'], rate: 4.8 },
  { id: 'AD-2741', name: 'Biniam Mengesha',  role: 'Cloud Support',   status: 'deployed', client: 'Northwind',   score: 92, certs: 4, years: 4, langs: ['EN','AM'],      skills: ['Azure','PowerShell','Tier-2 triage'], rate: 8.6 },
  { id: 'AD-2735', name: 'Tsion Getachew',   role: 'AI Annotation',   status: 'deployed', client: 'Meridian AI', score: 95, certs: 6, years: 3, langs: ['EN','AM','OM'], skills: ['Labelling','RLHF','Red-teaming','QA'], rate: 6.4 },
  { id: 'AD-2718', name: 'Yared Hailu',      role: 'Tier-2 Support',  status: 'bench',    client: '—',           score: 84, certs: 3, years: 3, langs: ['EN','AM'],      skills: ['Salesforce','SQL','Escalations'], rate: 7.6 },
  { id: 'AD-2702', name: 'Lidya Alemayehu',  role: 'Success Manager', status: 'deployed', client: 'Acme Rivers', score: 90, certs: 4, years: 5, langs: ['EN','AM','FR'], skills: ['Account growth','QBRs','Churn rescue'], rate: 9.8 },
  { id: 'AD-2691', name: 'Nathnael Abate',   role: 'Tech Recruiter',  status: 'assess',   client: '—',           score: 72, certs: 1, years: 2, langs: ['EN','AM'],      skills: ['Sourcing','Screening','Greenhouse'], rate: 5.4 },
  { id: 'AD-2678', name: 'Mahder Tekle',     role: 'Bilingual CS',    status: 'recruit',  client: '—',           score: 71, certs: 1, years: 1, langs: ['EN','AM'],      skills: ['Voice support','Email'], rate: 4.6 },
]

export const AGENT_EXTRAS: Record<string, AgentProfileExtras> = {
  'AD-3001': {
    photo: '/agents/bezawit-berhanu.png',
    headline: 'Sales Development Representative · outbound & CRM',
    pitch: 'Energetic SDR with a background in outbound prospecting and customer-facing sales. Has worked across multiple verticals including tech and professional services, with a consistent track record of lead generation and pipeline contribution.',
    location: 'Addis Ababa, ET', timezone: 'EAT (UTC+3)', hours: 'Overlaps US-East 6h, US-West 3h',
    email: 'bezawit.berhanu@remconnect.io', phone: '+251 912 645 612',
    employer: 'RemConnect Talent PLC', contractType: 'Full-time · 40 hrs/wk',
    payRate: '$4.80 / hr', billRate: '$12.00 / hr', margin: '60.0%',
    started: 'May 2026', deployedSince: '—',
    csat: 4.3, aht: '7:24', qa: 84,
    tools: ['CRM platforms', 'Google Workspace', 'Slack'],
    education: 'High School Diploma — Radical Academy',
    certifications: [],
    history: [
      { co: 'Mmcy Tech', role: 'Sales Development Representative', when: '2023 – present', current: true },
      { co: 'Salaria Sales Solutions', role: 'Outreach Associate', when: '2022 – 2023' },
      { co: 'Empire Business', role: 'Inside Sales Associate', when: '2021 – 2022' },
    ],
    notes: [],
  },
  'AD-3002': {
    photo: '/agents/nahom-dereje.jpg',
    video: '/agents/nahom-dereje.mp4',
    headline: 'Business Development Representative · B2B & partnerships',
    pitch: 'Results-driven BDR with experience in SaaS business development and executive support. Comfortable operating independently, building client relationships from cold outreach through close, and supporting senior leadership on strategic initiatives.',
    location: 'Addis Ababa, ET', timezone: 'EAT (UTC+3)', hours: 'Overlaps US-East 6h',
    email: 'nahom6207@gmail.com', phone: '+251 938 591 317',
    employer: 'RemConnect Talent PLC', contractType: 'Full-time · 40 hrs/wk',
    payRate: '$5.00 / hr', billRate: '$12.50 / hr', margin: '60.0%',
    started: 'May 2026', deployedSince: '—',
    csat: 4.5, aht: '6:48', qa: 87,
    tools: ['CRM tools', 'Google Workspace', 'Slack'],
    education: 'BSc Accounting & Finance — Unity University (2018 – 2020)',
    certifications: [],
    history: [
      { co: 'Exclusive Calls', role: 'Assistant to CEO', when: 'Mar 2024 – Sep 2025' },
      { co: 'Exclusive Calls', role: 'Business Development Representative', when: 'Aug 2023 – Mar 2024' },
      { co: 'Dreamport', role: 'Business Development', when: 'Feb 2022 – Jul 2023' },
    ],
    notes: [],
  },
  'AD-3003': {
    photo: '/agents/ermias-lemma.png',
    video: '/agents/ermias-lemma.mp4',
    headline: 'SDR · A2P SMS Specialist · B2B Outbound (US Market)',
    pitch: 'Technical SDR with a rare combination of high-volume outbound sales and A2P SMS operations expertise. Comfortable with US business-hours shifts, experienced with HubSpot and Apollo, and fluent in the compliance and routing side of SMS messaging platforms.',
    location: 'Addis Ababa, ET', timezone: 'EAT (UTC+3)', hours: 'US hours (5:00 PM – 5:00 AM EAT)',
    email: 'ermias.lemma@remconnect.io', phone: '+251 9·· ··· ···',
    employer: 'RemConnect Talent PLC', contractType: 'Full-time · 40 hrs/wk',
    payRate: '$5.20 / hr', billRate: '$13.00 / hr', margin: '60.0%',
    started: 'May 2026', deployedSince: '—',
    csat: 4.4, aht: '5:36', qa: 86,
    tools: ['HubSpot', 'Apollo', 'A2P SMS platforms', 'Google Workspace', 'Slack'],
    education: 'BSc Computer Science — Hilcoe School of Computer Science (2022 – present)',
    certifications: [],
    history: [
      { co: 'Salaria / Golf Global Sales Operations', role: 'SDR / Phone Sales Agent (US Market)', when: '2022 – present', current: true },
      { co: 'Freelance / Messaging Platforms', role: 'A2P SMS Operations & Client Support Specialist', when: '2021 – present', current: true },
    ],
    notes: [],
  },
  'AD-3004': {
    photo: '/agents/tensae-wubeshet.jpg',
    video: '/agents/tensae-wubeshet.mp4',
    headline: 'Sales Development Representative',
    pitch: 'Motivated SDR ready to contribute to a high-performing remote team. Strong communication skills and a customer-first mindset.',
    location: 'Addis Ababa, ET', timezone: 'EAT (UTC+3)', hours: 'Overlaps US-East 6h',
    email: 'tensae.wubeshet@remconnect.io', phone: '+251 9·· ··· ···',
    employer: 'RemConnect Talent PLC', contractType: 'Full-time · 40 hrs/wk',
    payRate: '$4.60 / hr', billRate: '$11.50 / hr', margin: '60.0%',
    started: 'May 2026', deployedSince: '—',
    csat: 4.1, aht: '8:05', qa: 80,
    tools: ['Google Workspace', 'Slack'],
    education: '—',
    certifications: [],
    history: [
      { co: 'RemConnect', role: 'Sales Development Representative', when: '2025 – present', current: true },
    ],
    notes: [],
  },
  'AD-2847': {
    headline: 'Bilingual customer support · 4 years voice + email',
    pitch: "Calm, thorough, and methodical under load. Has carried Northwind's after-hours queue for 14 months running with a 4.7 CSAT.",
    location: 'Addis Ababa, ET', timezone: 'EAT (UTC+3)', hours: 'Overlaps US-East 6h, US-West 3h',
    email: 'liya.demeke@remconnect.io', phone: '+251 911 ··· 482',
    employer: 'RemConnect Talent PLC', contractType: 'Full-time · 40 hrs/wk',
    payRate: '$5.80 / hr', billRate: '$14.50 / hr', margin: '60.0%',
    started: 'Aug 12, 2024', deployedSince: 'Feb 03, 2025',
    csat: 4.7, aht: '6:42', qa: 92,
    tools: ['Zendesk','Aircall','Notion','Slack','Google Workspace'],
    education: 'BA Linguistics — Addis Ababa University, 2021',
    certifications: [
      { t: 'Voice Support · Foundation', d: 'Mar 12, 2026' },
      { t: 'Written Comms · Mastery',    d: 'Feb 28, 2026' },
      { t: 'PCI for voice agents',       d: 'Mar 4, 2026'  },
      { t: 'De-escalation · Advanced',  d: 'Apr 15, 2026' },
    ],
    history: [
      { co: 'Northwind Retail',  role: 'Bilingual CS Lead',    when: 'Feb 2025 – present', current: true },
      { co: 'Acme Rivers',       role: 'Voice Support',        when: 'Sep 2024 – Jan 2025' },
      { co: 'Pre-RemConnect',    role: 'Hotel guest relations', when: '2022 – 2024' },
    ],
    notes: [
      { who: 'Bezawit (Success)', when: '2d ago', body: "Northwind asked to extend her contract through Q3. They specifically called out de-escalation on a refund storm." },
      { who: 'QA bot',            when: '1w ago', body: 'Sample of 12 calls scored 92 avg; flagged 1 hold-time outlier on a partner-API ticket.' },
    ],
  },
  'AD-2814': {
    headline: 'Outbound SDR · 3 years SaaS pipeline',
    pitch: 'Books meetings without being a robot. Lives in HubSpot sequences and a phone — comfortable with technical ICPs.',
    location: 'Bahir Dar, ET', timezone: 'EAT (UTC+3)', hours: 'Overlaps US-East 5h',
    email: 'semhal.abebe@remconnect.io', phone: '+251 911 ··· 117',
    employer: 'RemConnect Talent PLC', contractType: 'Full-time · 40 hrs/wk',
    payRate: '$5.40 / hr', billRate: '$13.80 / hr', margin: '60.9%',
    started: 'Mar 04, 2024', deployedSince: 'May 20, 2024',
    csat: 4.4, aht: '5:20', qa: 88,
    tools: ['HubSpot','Apollo','Gong','Slack'],
    education: 'BA Marketing — Bahir Dar University, 2022',
    certifications: [
      { t: 'Outbound · Foundation', d: 'Jun 2024' },
      { t: 'Discovery calls',       d: 'Aug 2024' },
      { t: 'HubSpot Sales Hub',     d: 'Oct 2024' },
    ],
    history: [
      { co: 'Acme Rivers',   role: 'Sales Dev Rep', when: 'May 2024 – present', current: true },
      { co: 'Pre-RemConnect',role: 'Inside sales',  when: '2022 – 2024' },
    ],
    notes: [
      { who: 'Daniel (Sales lead)', when: '5d ago', body: 'Pacing 8 SQLs / week against a 6 target. Wants a stretch on enterprise ICPs Q2.' },
    ],
  },
  __default: {
    headline: 'Customer experience professional',
    pitch: 'Reliable, well-trained, and ready to deploy. Detailed performance and reference data available on request.',
    location: 'Addis Ababa, ET', timezone: 'EAT (UTC+3)', hours: 'Overlaps US-East 6h',
    email: '—', phone: '—',
    employer: 'RemConnect Talent PLC', contractType: 'Full-time · 40 hrs/wk',
    payRate: '$5.20 / hr', billRate: '$13.00 / hr', margin: '60.0%',
    started: 'Jan 2025', deployedSince: '—',
    csat: 4.5, aht: '7:10', qa: 86,
    tools: ['Zendesk','Slack'],
    education: 'BA — Addis Ababa University',
    certifications: [{ t: 'Voice Support · Foundation', d: '2025' }],
    history: [{ co: 'RemConnect bench', role: 'Active', when: '2025 – present', current: true }],
    notes: [],
  },
}

// Helpers
export function roleById(id: string): Role | undefined {
  return ROLES.find(r => r.id === id)
}

export function permById(id: string): Permission | undefined {
  return PERMISSIONS.find(p => p.id === id)
}

export function effectivePerms(admin: AdminUser): Set<string> {
  const role = roleById(admin.role)
  const set = new Set<string>(role ? role.perms : [])
  Object.entries(admin.overrides || {}).forEach(([pid, val]) => {
    if (val === true) set.add(pid)
    else if (val === false) set.delete(pid)
  })
  return set
}

export function tierColor(tier: string) {
  return ({
    low:      { bg: 'rgba(90,96,114,0.1)',   fg: '#5a6072', border: 'rgba(90,96,114,0.22)' },
    med:      { bg: 'rgba(29,111,214,0.1)',  fg: '#0c3a7a', border: 'rgba(29,111,214,0.22)' },
    high:     { bg: 'rgba(192,138,42,0.14)', fg: '#c08a2a', border: 'rgba(192,138,42,0.3)' },
    critical: { bg: 'rgba(181,72,56,0.12)',  fg: '#b54838', border: 'rgba(181,72,56,0.28)' },
  } as Record<string, { bg: string; fg: string; border: string }>)[tier] || { bg: 'transparent', fg: '#5a6072', border: '#e3e0d2' }
}
