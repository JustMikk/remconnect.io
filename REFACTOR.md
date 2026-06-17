# Refactor backlog

Tracks the incremental migration toward the standards in [AGENTS.md](AGENTS.md#engineering-standards).
The foundations (tooling, design-token source of truth, data-access seam) and two reference
exemplars are done — the rest proceeds file-by-file, ideally one domain folder per PR.

## Done (foundations + exemplars)

- **Tooling**: Prettier + `.editorconfig`, Husky + lint-staged pre-commit, Vitest + Testing Library, `cn()` helper.
- **Design tokens**: single source of truth in `src/app/globals.css` `@theme`; `tailwind.config.ts` reduced to a non-loaded stub.
- **UI primitives** (`src/components/ui/`): `Button`, `Card`, `Avatar`, `Chip` migrated to Tailwind class maps.
- **Server-first + data layer exemplar**: `app/(portal)/profile` → async Server Component reading `lib/data/profile.ts`, interactivity isolated to `ResumeImporter`/`ProfileTabs` leaves.
- **Decomposition exemplar**: `AgentAdminProfile` (857 lines) → thin container + `components/admin/agent-detail/*` (7 tabs + header + shared parts), data via `lib/data/agents.ts`, fully Tailwind.
- **Backend integration (phase 1)**: typed API client (`lib/api/*`), JWT cookie auth (admin login + `proxy.ts` guard/refresh), agent registration wired to `POST /auth/register`, admin agents directory/detail backed by `GET /agents`. See "Fixture-enrichment seam" below.

## Fixture-enrichment seam (temporary, delete when backend catches up)

The admin agent views are **hybrid**: identity/contact/media/languages/skills/certifications come
from the live API; operational data the backend doesn't expose yet (client assignment, scores,
pay/bill rates, work history, notes, performance, network metrics) is filled from demo fixtures,
picked deterministically by hashing the agent uuid. Everything fake funnels through
`src/lib/data/agent-enrichment.ts` — when the backend exposes these fields, delete that file and
map the API response directly in `src/lib/data/agents.ts`.

## Backlog (incremental)

### 1. Inline-style → Tailwind sweep (~70 components)
Replace `style={{}}` + hardcoded hex with Tailwind utilities + `rc-*` tokens. Use the profile and
agent-detail modules as the reference. Go domain-by-domain:
- [ ] `components/landing/*`
- [ ] `components/onboarding/*` (also see #3)
- [ ] `components/network/*` (note: `network.css` scoped vars may stay; convert component-level inline styles)
- [ ] `components/home/*`, `components/admin/*` (remaining)
- [ ] remaining `components/ui/*` (`ScoreRing`, `Sparkline`, `SkillRadar`, `Waveform`, `ProgressBar`, `Icon`)
- [ ] portal/admin pages still using inline styles
- When a stray color has no token, add it to `@theme` (as done for `rc-ink-soft`, `rc-line-2`, `rc-paper-4`, `rc-good-deep`, `rc-bad-deep`, `rc-ink-5`) — never hardcode hex.

### 2. `'use client'` audit (96 → target <20% of files)
Remove `'use client'` from every file with no interactivity (event handlers/hooks/browser APIs).
Convert presentational pages to Server Components; push interactivity into leaf components, as in `profile`.
- [ ] Portal & admin layouts and presentational pages
- [ ] Read-only dashboards/views

### 3. Decompose remaining large files (>200 lines / multi-section)
- [ ] `OnboardingContext.tsx` (450 lines, 30+ methods) → split into `useOnboardingNav` / `useOnboardingForm` / `useOnboardingValidation`
- [ ] `InviteAdmin.tsx` (343 lines, 4-step form)
- [ ] Audit other files over ~200 lines

### 4. Route all data through `lib/data/*`
Move remaining direct imports of `lib/*-data.ts` behind async accessors; relocate the raw datasets
into `lib/fixtures/*`. Largest: `sdr-applicants.ts` (2,761 lines), `admin-data.ts` (1,897 lines).
- [ ] `admin-data.ts` → `lib/data/*` + `lib/fixtures/`
- [ ] `network-data.ts`, `landing-data.ts`, `remote-setup-data.ts`, `sdr-applicants.ts`

### 5. Icon system
- [ ] Replace `Icon.tsx` 82-line switch with a typed icon map (or adopt `lucide-react`).

### 6. Coverage
- [ ] Add tests alongside refactored utilities/components (Vitest + Testing Library).
