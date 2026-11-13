# MESH

A startup matchmaking app that connects **founders, builders and investors** around real projects.

```
sign up → confirm email → onboard → discover → Interested / Pass
       → owner accepts or declines → match → text messaging
```

**Stack:** Next.js 16 (App Router, Server Actions) · TypeScript · Tailwind CSS v4 · shadcn/ui-style
components · Supabase Auth + Postgres (RLS) · deployable on Vercel.

The schema and design decisions are in [`docs/PLAN.md`](docs/PLAN.md).

---

## Features

| Area | What's included |
|---|---|
| Auth | Email + password sign-up with email confirmation, sign-in, sign-out, protected routes |
| Onboarding | 3-step wizard: name, headline, location → roles (founder/builder/investor), skills, sector interests → availability, commitment level, bio |
| Projects | Create / edit / delete with title, tagline, problem, solution, sector, stage, roles needed, traction, location, public/private visibility |
| Discover | Project cards, filters by sector, stage, role and location (URL-driven, shareable), pagination |
| Interest | **Interested** (with optional note) or **Pass** (with undo). Owners **Accept** or **Decline**. Senders can withdraw pending requests. |
| Matches & chat | Matches list with last-message preview; 1:1 text chat per match with realtime delivery (polling fallback) |
| UX | Mobile-first layout with bottom tab bar, violet accent, loading skeletons, empty states, error boundaries, toasts |

Out of scope by design: payments, investment transactions, AI recommendations, complex
notifications, legal agreements.

## Security model

- **RLS on every table**, and the `anon` role has no table access. All app queries run with the
  user's session through the anon/publishable key, so Postgres enforces authorization.
- **The service-role key is never used by the app.** There is no reference to it in the code;
  don't add it to Vercel.
- Every mutation is a Server Action that verifies the user with `supabase.auth.getUser()`,
  validates input with Zod, and re-checks ownership or participation before writing.
- Rules the database itself enforces:
  - no duplicate requests (`UNIQUE (project_id, sender_id)`);
  - no self-matching (trigger and policy);
  - requests only to public, non-demo projects;
  - only the project owner may decide a request, only the `status` column can change, and decisions are final;
  - messages only inside **accepted** matches, by participants, as themselves;
  - `owner_id` and `is_demo` can't be changed or forged (column-level grants).
- The demo seed contains **only fictional projects** (`is_demo = true`, no owner, labeled
  "Fictional demo" in the UI, no requests allowed). No users, founders or investors are seeded.

## Project structure

```
src/
  app/
    page.tsx                 landing
    login/ signup/ check-email/ auth/confirm/   auth flow
    onboarding/              profile wizard
    (app)/                   authenticated shell (nav, onboarding gate)
      discover/ projects/ requests/ matches/ profile/
  components/                ui/ (shadcn-style primitives), feature components
  lib/
    actions/                 Server Actions (auth, profile, projects, requests+messages)
    supabase/                server / browser / proxy clients
    auth.ts data.ts validation.ts constants.ts types.ts
  proxy.ts                   session refresh + route gating
supabase/
  migrations/                schema, RLS, triggers, functions
  seed.sql                   fictional demo projects
  tests/                     SQL test-suite for RLS & integrity rules
e2e/journey.mjs              Playwright end-to-end journey
```

---

## Setup

### 1. Install

```bash
cd mesh
npm install
```

### 2a. Use a hosted Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Apply the migration. Either paste `supabase/migrations/20261113000000_mesh_core.sql` into the
   **SQL Editor** and run it, or use the CLI:
   ```bash
   npx supabase login
   ```
   ```bash
   npx supabase link --project-ref <your-project-ref>
   ```
   ```bash
   npx supabase db push
   ```
3. Optional: load the fictional demo projects by running `supabase/seed.sql` in the SQL Editor.
4. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000` (your production URL later)
   - Redirect URLs: `http://localhost:3000/auth/confirm` and `https://<your-domain>/auth/confirm`
5. **Authentication → Providers → Email**: keep "Confirm email" on (recommended).
6. Copy `.env.example` to `.env.local` and fill in values from **Project Settings → API**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon or publishable key>
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### 2b. Or run Supabase locally (Docker)

```bash
npx supabase start
```

This applies the migration and seed and prints a local URL and publishable key; put them in
`.env.local`. Confirmation emails are caught by Mailpit at http://127.0.0.1:54324.
`npx supabase db reset` re-applies everything from scratch.

### 3. Run

```bash
npm run dev
```

Open http://localhost:3000. To test the whole journey, use two browsers (or a private window)
with two accounts: one posts a project, the other taps **Interested**, the first accepts, and
both can chat.

## Testing

| Command | What it checks |
|---|---|
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint (Next.js + React hooks rules) |
| `npm run build` | Production build |
| `npm run test:db` | 49 SQL assertions against a throwaway local Postgres with a stubbed `auth` schema: anon lockout, onboarding constraints, project ownership, feed filters, passes, duplicate and self requests, the status machine, the messaging gate, private-project visibility and withdrawals. Needs `createdb`/`psql` with rights to create roles, e.g. `sudo -u postgres npm run test:db`. |
| `node e2e/journey.mjs` | Full browser journey with three users on the local Supabase stack, including email confirmation via Mailpit and realtime chat. See the header of the file. |

## Deploy to Vercel

1. Import the repository in Vercel and set **Root Directory** to `mesh`.
2. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `NEXT_PUBLIC_SITE_URL` (e.g. `https://mesh.example.com`). **Don't add the service-role key.**
3. In Supabase, add `https://<your-domain>/auth/confirm` to the Redirect URLs and set the Site URL
   to your domain.
4. Deploy.

## Customising value lists

Roles, sectors, stages, needed roles, availability and commitment are `CHECK` constraints in the
migration and are mirrored in `src/lib/constants.ts`. To add a value, write a new migration that
replaces the constraint, then update the constant.
