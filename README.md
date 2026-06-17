# RemConnect — frontend

Next.js 16 app for RemConnect: agent onboarding, agent portal, and the admin console.
Engineering standards live in [AGENTS.md](AGENTS.md); the migration backlog in [REFACTOR.md](REFACTOR.md).

## Getting started

```bash
npm install
cp .env.example .env.local   # backend API configuration
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend integration

The deployed backend lives at `https://rem-connectio.onrender.com/api/v1`
(Swagger UI at [/api-docs](https://rem-connectio.onrender.com/api-docs/)).

- `API_BASE_URL` — server-side base URL; used by the data-access layer (`src/lib/data/*`),
  server actions, and `src/proxy.ts`.
- `NEXT_PUBLIC_API_BASE_URL` — same URL, used by the registration wizard to upload the
  multipart application (avatar + intro video) straight from the browser (backend CORS is open),
  which avoids serverless request-body limits.

**Cold starts:** the backend is on Render's free tier and can take ~50 seconds to wake after
idle. The API client uses generous timeouts and user-facing "server waking up" messaging; the
first request after a quiet period may still feel slow.

### What's wired to the live API (phase 1)

- **Agent registration** (`/apply`): create account → email OTP (`/auth/otp/*`) → 7-step wizard
  (incl. photo + intro-video upload) → `POST /auth/register` → httpOnly session cookies.
  Role catalog comes from `GET /roles/categories/with-roles` (hardcoded fallback if unreachable).
- **Admin auth** (`/admin/login`): `POST /auth/login`, staff roles only (`RECRUITER`/`OPS`/`ADMIN`).
  `/admin/*` is guarded in `src/proxy.ts` (redirect + silent refresh-token rotation) and by
  `requireStaff()` in the admin layout.
- **Admin agents** (`/admin/agents`): directory + detail backed by `GET /agents` /
  `GET /agents/{id}`. Fields the backend doesn't expose yet are filled from demo fixtures via
  the temporary seam in `src/lib/data/agent-enrichment.ts` (see REFACTOR.md).

### Testing the admin console

Staff accounts are created via `POST /auth/register/staff` (currently unauthenticated on the
backend). A dev test admin exists: `claude.testadmin@remconnect.io` / `RcTestAdmin2026!`.

## Quality gates

Run before committing (enforced by the Husky pre-commit hook):

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```
