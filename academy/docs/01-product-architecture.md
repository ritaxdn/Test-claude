# CELLULIFT ACADEMY — Phase 1 · Product Architecture

> academy.cellulift.ma — one platform, one account, two access models.
> Status: design document. Nothing described here is deployed or wired to a real service yet.

---

## 0. Architectural recommendation (read this first)

**Build a custom application (Next.js + PostgreSQL) and buy the two hard parts: video delivery/DRM and payments.**

Do not build the video pipeline yourself, and do not fork Moodle.

| Criterion | 1 · Custom-branded Moodle | 2 · White-label LMS (Thinkific, LearnWorlds, Teachable, Kajabi…) | 3 · Custom app (recommended) |
|---|---|---|---|
| **Entitlements** (course ↔ purchased device, per-user grants, CRM sync) | Possible via cohorts/enrolment plugins, but device-based logic means custom PHP plugins | Usually limited to "bundles" and coupons. Equipment-based access is a workaround (manual enrolment or Zapier) | Native: the entitlement model *is* the product |
| **Video security** | Plugins for DRM exist but are aging; watermarking is weak | Varies. LearnWorlds and a few others offer DRM add-ons; others serve plain HLS | Integrate a DRM provider directly (see §7 of roadmap) with server-issued, per-session tokens |
| **UX flexibility / premium feel** | Low. Theming Moodle to the "Nacre & verre" level is expensive and fights upgrades | Medium. Templated pages, brand colours, limited layout | Full control; reuses the cellulift.ma design system and code (same stack) |
| **Time to MVP** | 6–10 weeks (install fast, customise slow) | 2–4 weeks | 12–16 weeks with a small team |
| **Running cost** | Hosting + plugin licences + PHP maintenance | 150–500 USD/month + transaction fees, per-seat pricing at scale | Hosting (~50–150 USD/month) + video provider (usage-based) + dev time |
| **Payments in Morocco** | Plugins for Stripe/PayPal; CMI needs custom work | Mostly Stripe/PayPal; Stripe does not onboard Moroccan entities directly | Integrate CMI (Moroccan card network) and/or international gateway directly |
| **Data ownership / CRM link** | Good (self-hosted) | Weak; export via API at best | Full; same database as future CRM bridge |
| **Long-term maintenance** | Moodle upgrades + plugin compatibility | Vendor lock-in, pricing changes | Your team owns it; requires a developer on retainer |
| **Scalability** | Fine for thousands of users | Vendor-managed | Serverless front + managed Postgres + video CDN: scales without redesign |

**Why custom wins here.** CELLULIFT's differentiator is the link between *equipment purchased* and *training unlocked*, plus a premium experience consistent with cellulift.ma. Both are weak spots of off-the-shelf LMSs. The repository already runs Next.js 16 / TypeScript / Tailwind v4 with the brand system in `src/app/globals.css`, and Supabase is already present for the main site, so the team, tooling and design tokens carry over.

**When to choose option 2 instead.** If the launch date is under 2 months and the budget for development is below roughly 15–20 k USD, start on a white-label LMS with a DRM add-on, enrol partner doctors manually, and migrate later. The data model below is designed so this migration is possible (users, courses, enrolments, progress, certificates are all exportable concepts).

### Recommended stack

| Layer | Choice | Notes |
|---|---|---|
| Web app | **Next.js (App Router) + TypeScript + Tailwind v4** | Same as cellulift.ma; server components for entitlement checks |
| Database | **PostgreSQL** (Supabase or Neon, EU region) | Row-Level Security as a second guard behind server checks |
| Auth | **Supabase Auth** or **Auth.js** with Postgres adapter | Email + password, email verification, password reset, optional TOTP 2FA for admins (mandatory) |
| ORM / migrations | Drizzle or Prisma | Typed queries, versioned migrations |
| Video | **Mux** (signed playback + DRM add-on) or **VdoCipher** (DRM + dynamic watermark built in) or **Bitmovin / AWS MediaConvert + PallyCon/EZDRM** for full control | Comparison in roadmap §3 |
| File resources | Private object storage (Supabase Storage / S3) with short-lived signed URLs; PDFs rendered with watermark | Never public buckets |
| Payments | **CMI** (Centre Monétique Interbancaire, via a Moroccan acquiring bank) for MAD cards; **PayPal** or **Payzone / YouCan Pay** as alternatives; bank transfer with manual validation for clinics | Stripe is not directly available to Moroccan-registered companies |
| Email | Resend (already used by the dr-dadoun site) or Postmark | Transactional: verification, receipts, certificate issued |
| Certificates | Server-rendered PDF (React-PDF or Playwright) + public verification page | |
| Analytics | Postgres event table + Metabase/Looker Studio; product analytics via PostHog (EU) | No third-party trackers inside the player |
| Hosting | Vercel (app) + managed Postgres + video provider CDN | Data residency: confirm CNDP (Loi 09-08) requirements for health-professional data |
| Monitoring | Sentry + uptime checks + audit log table | |

---

## 1. Information architecture

```
academy.cellulift.ma
│
├── Public (no account)
│   ├── Landing — what the Academy is, two access models, trainers, upcoming sessions
│   ├── Catalogue (public preview) — titles, outlines, trainers, access badges; no video
│   ├── Course detail (public preview)
│   ├── Certificate verification  /verify/{certificateId}
│   ├── Login · Register · Forgot password · Verify email
│   └── Legal — terms, privacy (CNDP), certificate disclaimer
│
├── Learner (authenticated)
│   ├── Dashboard — welcome, continue learning, progress, upcoming training, notifications
│   ├── My learning — in progress · completed · saved
│   ├── Catalogue — full, with personal access state per course
│   ├── Course detail — outline, objectives, trainer, CTA by access state
│   ├── Course player — modules/lessons, video, notes, resources, quiz
│   ├── Assessments — quiz attempts, results
│   ├── Certificates — list, download PDF, share verification link
│   ├── My equipment — devices linked to the account (partner access source)
│   ├── Live & in-person sessions — calendar, registrations
│   ├── Notifications
│   └── Account — profile, professional verification, security (devices & sessions), purchases & invoices
│
└── Admin (staff, role-scoped)
    ├── Overview — KPIs
    ├── People — users, professional verification queue, clinic accounts
    ├── Customers & equipment — devices sold, serials, linked accounts
    ├── Entitlements — equipment → course mapping, manual grants, revocations
    ├── Courses — builder (modules, lessons, video upload, resources, quizzes)
    ├── Trainers
    ├── Commerce — prices, coupons, orders, refunds
    ├── Certificates — templates, issued, revoke
    ├── Content protection — DRM policy, watermark, session limits, sharing alerts
    ├── Analytics — learning, commercial, partner
    └── Audit log
```

---

## 2. Users, roles and permissions

Two independent dimensions. **Roles** say what someone can *do* on the platform. **Entitlements** say which *content* they can open. A learner's access to a course is never derived from a role alone.

### 2.1 Roles

| Role | Who | Key permissions |
|---|---|---|
| `learner` | Any registered professional | Browse catalogue, enrol in free courses, buy paid courses, consume entitled content, take quizzes, earn certificates |
| `learner` + `verified_professional` flag | Learner whose professional status has been checked | Unlocks courses whose eligibility requires verification (e.g. injectables, energy-based devices) |
| `clinic_manager` *(phase 2)* | Owner or manager of a clinic account | See staff seats attached to the clinic's equipment, invite practitioners, view their progress |
| `trainer` | Doctors/experts producing content | Edit their own courses (draft), see their learners' progress, answer Q&A |
| `support` | CELLULIFT customer service | View users, resend emails, view progress, **grant** entitlements (logged), no deletion |
| `content_manager` | Academy team | Create/edit/publish courses, upload video, manage quizzes and certificates |
| `sales_ops` | Sales administration | Register equipment sales, link devices to accounts, view commercial dashboards |
| `admin` | Platform owner | Everything incl. protection settings, roles, refunds, revocations |

Admin roles require 2FA. Every write performed by a staff role is written to `audit_log`.

### 2.2 Professional profile (on the user, not a separate account)

- `profession` (doctor, nurse, aesthetician, physiotherapist, other)
- `specialty` (dermatology, aesthetic medicine, plastic surgery, gynaecology, general practice…)
- `organization` (clinic / centre name), `country`, `city`
- `registration_number` + `registration_body` (e.g. CNOM — Conseil National de l'Ordre des Médecins) when the target courses require it
- `verification_status`: `unverified → pending → verified | rejected`, with reviewer and date

---

## 3. Course access logic

### 3.1 Course access policy (set by admin per course)

Each course has **one or more access rules** (OR-combined):

| Rule type | Meaning |
|---|---|
| `free` | Any logged-in learner meeting the eligibility filter |
| `paid` | Purchasable at a price (MAD), optionally with a validity period |
| `equipment` | Granted when the learner's account is linked to one of the listed device models |
| `manual_only` | Only via a staff grant (pilot groups, VIP, partner exclusive) |
| `bundle` *(phase 2)* | Included in a programme/subscription |

Plus an **eligibility filter** (AND-combined with any rule): allowed professions, verification required yes/no, countries.

### 3.2 Entitlement records

Access is materialised as rows in `entitlements(user_id, course_id, source, source_ref, starts_at, ends_at, revoked_at)`:

- `source = equipment` → `source_ref` = the `device_ownership` row (model + serial)
- `source = purchase` → `source_ref` = the order
- `source = free_enrollment`
- `source = manual_grant` → `source_ref` = staff user + reason
- `source = crm_sync` *(later)* → `source_ref` = CRM record ID

A user can hold several entitlements for the same course (e.g. bought it, then received the device). Access is valid if **any** non-revoked, non-expired entitlement exists **and** the eligibility filter passes. Revoking one source (refund) does not remove access from another (equipment).

### 3.3 Decision function (server side, on every protected request)

```
canAccess(user, course):
  if user.status != active                         → DENY (account suspended)
  if !eligibility(course).matches(user)            → LOCKED (reason: verification/profession)
  ent = active entitlements(user, course)
  if ent not empty                                 → ALLOW (label from best source)
  if pending order or pending verification         → PENDING
  if course has rule free                          → ENROLLABLE (free)
  if course has rule paid                          → PURCHASABLE (price)
  if course has rule equipment                     → LOCKED (partner exclusive — "included with <device>")
  else                                             → HIDDEN or LOCKED
```

### 3.4 Access states shown to the learner

| UI state | Condition | CTA |
|---|---|---|
| **Free** | `free` rule, not yet enrolled | Enrol |
| **Purchased** | active entitlement from purchase | Continue |
| **Included with CELLULIFT equipment** | active entitlement from equipment | Continue |
| **Partner Exclusive** | equipment-only course, user does not own the device | "Ask about this technology" (soft contact, no hard sell) |
| **Locked** | eligibility not met (e.g. verification required) | Complete verification |
| **Enrollment Pending** | order awaiting payment / bank transfer, or verification under review | Status + expected delay |

### 3.5 Why this survives the Open Academy → customer transition

There is one `users` table. Becoming a customer only **adds** `device_ownership` rows, which generate new `equipment` entitlements. Purchases, progress, quiz attempts and certificates reference `user_id` and are untouched.

If the customer was registered in the CRM under a different email, staff use **Link device to existing account** (search by name, registration number, email) instead of creating a new user. A merge tool for duplicate accounts is planned for phase 2.

---

## 4. Main user journeys

### J1 · Partner doctor after a device purchase
1. Sales ops registers the sale: clinic, device model, serial, practitioner email(s).
2. If the email exists → device linked; else → invitation email "Your training for HANOVER 5G is ready".
3. Doctor registers (fields pre-filled), verifies email.
4. Dashboard shows "Included with your HANOVER 5G" programme at the top; continue learning.
5. Completes modules + quiz (≥ passing score) → internal training certificate issued.
6. Later: invited to the in-person practical workshop (session calendar).

### J2 · Open Academy professional
1. Discovers the Academy from cellulift.ma or social media → public catalogue.
2. Registers (profession, specialty, country); verifies email.
3. Enrols in a free introductory course; completes it.
4. Recommended paid masterclass → checkout (CMI card or bank transfer → *Enrollment Pending*).
5. Partner-exclusive courses appear with a calm "Included with <device>" label and a "Learn about this technology" link — no pop-ups.

### J3 · Open Academy user becomes a customer
1. Buys a device from CELLULIFT sales.
2. Sales ops links the device to the **existing** account.
3. New entitlements appear; certificates, history and purchased courses unchanged.
4. Analytics records a conversion event (`open_to_partner`).

### J4 · Professional verification
1. Course requires verification → learner submits registration number + document upload.
2. Admin queue: verify → status `verified`, learner notified; or reject with reason.

### J5 · Staff manually grants access
Admin → user profile → *Grant access* → choose course, reason, optional end date → entitlement created, audit log entry, learner notified.

### J6 · Access revocation / account sharing
Sharing alert (e.g. 3 countries in 24 h) → admin reviews sessions → sign out all devices, force password reset, or suspend; DRM licences stop renewing at the next licence request.

---

## 5. MVP scope

| # | Feature | MVP (v1) | Later |
|---|---|---|---|
| 1 | Auth & professional registration | Email/password, verification, reset, profile, manual professional verification | SSO, OTP by SMS, automated registry checks |
| 2 | Learner dashboard | Continue learning, progress, certificates, upcoming sessions, notifications | Learning paths, streaks (only if useful) |
| 3 | Catalogue | Search, filters (technology, specialty, level, access), access badges | Personalised ranking |
| 4 | Course detail | Outline, objectives, trainer, duration, CTA by state | Reviews, previews |
| 5 | Video learning | DRM/signed playback, watermark, resume position, notes, resources | Transcripts, chapters, offline (no) |
| 6 | Progress | Lesson completion (≥ 90 % watched or marked), course % | xAPI export |
| 7 | Permissions | Roles + entitlement engine + manual grants + equipment mapping | CRM sync, clinic seats |
| 8 | Admin | Users, verification, courses, upload, entitlements, equipment, basic analytics, audit | Advanced reports, bulk import |
| 9 | Paid enrolment | Fixed price per course, CMI or bank transfer, invoice PDF | Coupons, bundles, subscriptions |
| 10 | Assessments & certificates | MCQ, passing score, attempts limit, PDF certificate with verification ID | Question banks, randomisation, CME/CPD accreditation workflow |

### Certificate wording (important)

All MVP certificates are **"Certificate of Training Completion — CELLULIFT Academy"**. They state the course, hours, date, trainer and a verification ID, and carry the line:
*"This certificate attests to the completion of a manufacturer/distributor training programme. It is not a medical qualification, diploma or accredited continuing medical education credit."*
An `accredited` certificate type exists in the data model but is disabled until a recognised body (e.g. a medical faculty or professional society) actually accredits a programme.
