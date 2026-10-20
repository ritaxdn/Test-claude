# CELLULIFT ACADEMY — Phase 4 · Production Roadmap

> Phase 3 (the interactive prototype) lives in `academy/prototype/`. Everything in it runs in the browser with sample data: no login, payment, DRM or email is real. This document describes how to build the real thing.

---

## 1. Backend architecture

```
                ┌───────────────────────────── academy.cellulift.ma ─────────────────────────────┐
 Browser ──TLS──▶ Next.js app (Vercel / Node)                                                     │
 (learner,      │  • Server Components render pages after session + entitlement check           │
  admin)        │  • Route handlers /api/*  (REST-ish, zod-validated)                            │
                │  • Middleware: session, CSRF, rate limiting, admin 2FA gate                    │
                └──────┬───────────────┬───────────────────┬───────────────────┬────────────────┘
                       │               │                   │                   │
                PostgreSQL       Object storage      Video platform        Payments
                (RLS on)         (private bucket)    (DRM + CDN)           (CMI / PayPal / transfer)
                • users, roles   • PDFs, images      • upload, encode      • hosted payment page
                • courses …      • signed URLs ≤5min • signed playback     • server-to-server callback
                • entitlements                         tokens ≤ 2–6 h      • idempotent order update
                • progress, audit                    • licence server
                       │                                   │
                Jobs/queues (cron or Inngest/QStash)  Webhooks (video ready, payment confirmed)
                • certificate PDF generation         • verified by HMAC signature
                • emails (Resend/Postmark)
                • sharing-detection scan, CRM sync (later)
```

**Rules that make it secure, regardless of vendor**
- The browser never decides access. Every page, API route and token issuance calls the same `canAccess(user, course)` function (see architecture §3.3). Postgres RLS policies repeat the rule as defence in depth.
- Video and file URLs are never stored in the client bundle. They are minted per request, per user, short-lived.
- All staff writes go through a service that writes `audit_log` in the same transaction.

### Module boundaries (one codebase, clear folders)
`auth` · `profiles & verification` · `catalog` · `entitlements` · `learning (progress, notes)` · `assessments` · `certificates` · `commerce` · `media (video, files)` · `protection (sessions, devices, alerts)` · `analytics (events)` · `admin` · `integrations (crm, email, payments)`.
Each module owns its tables and exposes functions; this is what lets you add CRM sync, clinic seats, subscriptions or a mobile app later without rebuilding.

---

## 2. Database model

Full DDL draft: [`../supabase/schema.sql`](../supabase/schema.sql). Core entities:

```
users ─┬─ user_roles ── roles
       ├─ professional_profiles (profession, specialty, registration, verification_status)
       ├─ device_ownerships ── device_models ──< equipment_course_rules >── courses
       ├─ entitlements (source: equipment | purchase | free | manual | crm) ── courses
       ├─ orders ── order_items ── courses
       ├─ lesson_progress ── lessons ── modules ── courses ── trainers
       ├─ notes, quiz_attempts ── quizzes ── questions ── options
       ├─ certificates (type: completion | accredited, verification_code)
       ├─ sessions_devices (active sessions, device fingerprint, last IP/country)
       ├─ playback_events (token issued, licence requested, heartbeat)
       └─ notifications
courses ─ course_access_rules (free | paid | equipment | manual_only) + eligibility (professions, verified_only, countries)
audit_log (actor, action, entity, before, after, ip, at)
analytics_events (user, name, props, at)
```

---

## 3. Video security implementation

### 3.1 What we can and cannot guarantee

| Protection | Type | What it actually does |
|---|---|---|
| Authenticated, entitlement-checked playback | **Enforceable** | No valid session + entitlement → no playback token. |
| Signed, expiring playback tokens (JWT, 2–6 h, bound to user + video + session) | **Enforceable** | A copied player URL stops working; tokens can't be reused for other videos. |
| Encrypted HLS/DASH segments, no MP4 exposed | **Enforceable** | There is no file to "Save as". Download managers get encrypted segments. |
| Multi-DRM (Widevine, FairPlay, PlayReady) | **Enforceable for key protection** | Keys only released to a CDM after a server licence check; licences can be refused instantly on revocation. Stops ripping tools that work on plain HLS. |
| Screen-capture blackout | **Platform-dependent** | Usually effective: iOS/iPadOS Safari (FairPlay), macOS Safari (FairPlay), Android apps/Chrome with Widevine L1, Edge/Windows with hardware PlayReady (SL3000). Usually **not** effective: Chrome/Firefox on desktop (Widevine L3, software-only), Linux, many capture cards. Do not promise it. |
| Dynamic visible watermark (name, email or user ID, timestamp, moving position) | **Deterrent + traceability** | Does not prevent recording; makes any leak traceable to an account. Must be rendered server-side into the stream or by the provider's player overlay; a pure CSS overlay can be removed with dev tools. |
| Forensic (invisible) watermarking (e.g. A/B session-based) | **Traceability** | Survives re-encoding and cropping better than visible marks. Enterprise pricing; consider for flagship courses in phase 3. |
| Concurrent stream / session limits (e.g. 2 devices, 1 simultaneous stream) | **Enforceable** | Server counts active playback heartbeats; new stream ends the oldest or is refused. |
| Account-sharing detection | **Detective** | Flags: > N distinct devices / 30 days, impossible travel (2 countries in < 6 h), parallel streams. Admin review, not automatic bans. |
| Access revocation | **Enforceable** | Revoke entitlement → no new tokens/licences; set short licence duration so active playback stops within minutes. |
| Playback logging | **Enforceable** | Every token, licence request and heartbeat is logged (user, video, IP, device, country). |
| Disabled right-click, hidden controls, dev-tools detection | **Cosmetic** | Trivially bypassed. We do not rely on them and do not present them as security. |
| Filming the screen with a phone | **Not preventable** | Only the visible watermark addresses this. |

### 3.2 Provider options (verify current pricing and plan features before contracting)

| Provider | DRM | Dynamic watermark | Notes |
|---|---|---|---|
| **VdoCipher** | Widevine + FairPlay | Yes, built-in (user name/email/IP, moving) | EdTech-focused, quickest path to "DRM + watermark", hosted player. Good MVP choice. |
| **Mux Video** | Widevine, FairPlay, PlayReady (DRM add-on) | Not built-in as forensic; overlay via player | Excellent API/DX, signed playback IDs, data analytics. |
| **Bunny Stream** | MediaCage (basic obfuscation; enterprise DRM with Widevine/FairPlay) | Overlay | Low cost; check enterprise DRM requirements. |
| **AWS (MediaConvert + CloudFront) + PallyCon / EZDRM / Axinom** | All three | PallyCon offers forensic watermarking | Maximum control, highest engineering effort. Phase 3 option. |

**Recommendation:** MVP on **VdoCipher** (DRM + per-user watermark out of the box) or **Mux + DRM** if the team prefers its API; abstract the provider behind `media.getPlaybackToken(userId, lessonId)` so it can be swapped.

### 3.3 Playback flow

1. Player requests `POST /api/playback/{lessonId}`.
2. Server: session valid → device registered → `canAccess` → concurrent-stream check → log `token_issued`.
3. Server calls provider API for a short-lived OTP/JWT embedding watermark text (`Dr A. Benali · ID 4821 · 2026-10-20 14:32`).
4. Player loads encrypted manifest; CDM requests licence; provider licence server checks token.
5. Player sends heartbeat every 30 s → progress saved, concurrency enforced, anomalies scored.

### 3.4 Protected resources (PDF protocols, parameter sheets)
Private bucket → `GET /api/resources/{id}` checks entitlement → stamps the PDF with name + ID + date on each page server-side → 5-minute signed URL. Optionally view-only in a PDF.js viewer for partner-exclusive protocols (still downloadable by determined users; the stamp is the deterrent).

---

## 4. Payment integration (Morocco)

| Option | Fit |
|---|---|
| **CMI** via a Moroccan acquiring bank | Standard for MAD card payments by Moroccan cards; hosted payment page + server callback (hash-signed). Requires a merchant contract with a bank. Primary MVP option. |
| **Payzone / YouCan Pay / similar PSPs** | Faster onboarding than direct CMI, MAD and international cards; compare fees. |
| **PayPal** | For international professionals; currency conversion fees. |
| **Bank transfer / clinic invoice** | Common for B2B; order stays *Enrollment Pending* until finance confirms in admin. |

Implementation: `orders` table with status machine (`pending → paid → refunded / failed / cancelled`), idempotent webhook handler, entitlement created only on `paid`, invoice PDF numbered per Moroccan invoicing rules (ICE, IF, TVA), refunds revoke the purchase entitlement only.

---

## 5. Hosting & deployment

- **App:** Vercel (same as cellulift.ma) — preview deployments per branch, `academy.cellulift.ma` as a separate project.
- **Database:** Supabase (EU region) with PITR backups, or Neon. Separate prod/staging projects.
- **Secrets:** Vercel env vars; video/payment secrets server-only; rotate quarterly.
- **Compliance:** declare processing of professional data to the **CNDP** (Loi 09-08); DPA with each processor; privacy notice; data retention policy (inactive accounts, playback logs 12 months).
- **Observability:** Sentry, uptime monitor, provider dashboards, weekly sharing-alert digest.

---

## 6. Security testing

- Threat model workshop (STRIDE) before build; OWASP ASVS level 2 as the checklist.
- Automated: dependency scanning, SAST (CodeQL), secret scanning, RLS policy tests, authorization unit tests for `canAccess` (matrix: role × source × eligibility × expiry × revocation).
- E2E (Playwright): every access state, every admin grant/revoke, token expiry, concurrent-stream limit.
- Manual: IDOR on course/lesson/certificate IDs, token replay, webhook forgery, privilege escalation via profile update, CSV/formula injection in exports.
- Video: attempt download with yt-dlp/HLS tools on staging; confirm encrypted segments and licence refusal after revocation; check watermark on each browser.
- External penetration test before public launch; re-test yearly and after major changes.

---

## 7. Implementation phases & estimates

Assumes 1 senior full-stack, 1 front-end/UI, part-time designer and PM, CELLULIFT content team in parallel. Ranges, not quotes.

| Phase | Weeks | Scope |
|---|---|---|
| **0 · Foundations** | 2 | Repo, CI, environments, auth, roles, base schema, design system port, provider accounts (video, payment, email), CNDP filing started |
| **1 · Learner core** | 4 | Registration + verification, catalogue, course detail, player with DRM + watermark, progress, notes, resources |
| **2 · Access & admin** | 3 | Entitlement engine, equipment mapping, manual grants, course builder, uploads, users/verification queue, audit log |
| **3 · Commerce & certificates** | 3 | Orders, CMI/PSP, bank transfer flow, invoices, quizzes, certificate PDFs + public verification |
| **4 · Hardening & launch** | 2–3 | Session limits, sharing detection, analytics dashboards, pen test, content migration, pilot with 10–20 partner doctors |
| **MVP total** | **14–15 weeks** | |
| **5 · Growth** | ongoing | CRM sync (automatic provisioning), clinic seats, bundles/subscriptions, live session registration, FR/EN/AR i18n, mobile app (native players improve capture protection), accreditation workflow |

### Content readiness (often the real critical path)
Per device programme: script, filming with trainer, editing, protocol PDFs, quiz (10–15 questions), medical review. Plan 3–5 weeks per programme; start filming during phase 0.
