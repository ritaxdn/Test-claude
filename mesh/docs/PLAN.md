# MESH — schema & implementation plan

MESH connects founders, builders and investors around projects. The core loop is:

```
sign up → onboard profile → discover projects → Interested / Pass
       → owner accepts or rejects → match → text messaging
```

## 1. Database schema (Supabase Postgres)

All tables live in `public`, have RLS **enabled**, and are reachable only by the
`authenticated` role. `anon` has no table access at all. Value lists (roles,
industries, stages…) are `text` + `CHECK` constraints instead of Postgres enums
so they can evolve with a simple migration. The same lists live in
`src/lib/constants.ts` for the UI.

| Table | Purpose | Key columns |
|---|---|---|
| `profiles` | 1:1 with `auth.users`, created by trigger on sign-up | `id → auth.users`, `full_name`, `headline`, `bio`, `roles text[]` (founder/builder/investor), `interests text[]` (industries), `skills text[]`, `location`, `availability`, `commitment`, `onboarded` |
| `projects` | A startup project / idea | `owner_id → profiles` (null only for demo rows), `is_demo`, `title`, `tagline`, `problem`, `solution`, `industry`, `stage`, `roles_needed text[]`, `traction`, `location`, `visibility` (public/private) |
| `passes` | "Pass" — hides a project from that user's feed | PK `(user_id, project_id)` |
| `match_requests` | "Interested" — one request per (project, sender) | `project_id`, `sender_id`, `project_owner_id` (filled by trigger), `note`, `status` pending/accepted/rejected, `responded_at`; `UNIQUE (project_id, sender_id)` |
| `messages` | Text messages inside an accepted match | `match_id → match_requests`, `sender_id`, `body` |

A **match** is a `match_requests` row with `status = 'accepted'`: the sender
said "Interested" (first acceptance) and the owner accepted (second
acceptance). No separate table is needed, which removes a whole class of
consistency bugs.

### Integrity rules enforced in the database

- **No self-matching** — `BEFORE INSERT` trigger on `match_requests` rejects a
  request whose sender owns the project; `passes` insert policy also rejects
  your own projects.
- **No duplicates** — `UNIQUE (project_id, sender_id)`.
- **Requests only to real, public projects** — insert policy requires a
  visible, public, non-demo project.
- **Status machine** — only the project owner can update, only the `status`
  column is granted, and a trigger allows only `pending → accepted|rejected`
  (decisions are final) and stamps `responded_at`.
- **Messaging only after mutual acceptance** — `messages` insert/select
  policies call `is_match_participant(match_id)`, which requires
  `status = 'accepted'` and that the caller is the sender or project owner.
- **Ownership** — projects are insert/update/delete-able only by `owner_id =
  auth.uid()`. `owner_id`/`is_demo` are not in the column grants, so they can't
  be changed after insert, and users can't create demo rows.
- **Private projects** are visible to their owner and to accepted matches only.
- **Demo projects** have `is_demo = true` and no owner (`CHECK ((owner_id is
  not null) <> is_demo)`), can only be inserted by the seed (service role /
  SQL editor), are labeled "Fictional demo" in the UI, and can't receive
  requests.

Helper functions used by policies (`is_match_participant`,
`has_accepted_match`, `is_project_owner`) are `SECURITY DEFINER` with a pinned
`search_path` to avoid RLS recursion between `projects` and
`match_requests`. `discover_projects(...)` is `SECURITY INVOKER`, so RLS
still applies to the feed.

## 2. Server-side authorization

- Supabase is only accessed with the **anon/publishable key + the user's
  session cookie**; RLS is the source of truth. The service-role key is never
  used by the app.
- Every mutation is a **Server Action** that: re-reads the user with
  `supabase.auth.getUser()` (verified against Supabase Auth), validates input
  with Zod, does explicit ownership/participant checks for clear error
  messages, then writes through RLS.
- `src/proxy.ts` refreshes the session cookie and redirects anonymous users
  away from app routes; app layouts re-check server-side (defense in depth).

## 3. Implementation stages

1. Scaffold — Next.js App Router, Tailwind v4, shadcn/ui-style primitives, Supabase SSR clients, proxy.
2. Database — migration, RLS, seed, and a pure-SQL test suite run against a local Postgres with a stubbed `auth` schema.
3. Auth + onboarding — email/password sign-up with email confirmation, multi-step onboarding.
4. Projects — create, edit, delete, detail page, "My projects".
5. Discover — feed with sector/stage/role/location filters, Interested (with optional note) and Pass.
6. Requests & matches — inbox with accept/reject, outgoing status, matches list.
7. Messaging — thread per match, realtime refresh.
8. Polish — empty/loading/error states, mobile nav, README & setup docs.

Out of scope by design: payments, investment transactions, AI
recommendations, complex notifications, legal agreements.
