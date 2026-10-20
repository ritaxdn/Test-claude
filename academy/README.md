# CELLULIFT ACADEMY

Learning platform for medical and aesthetic professionals: **one platform, one account, two access models** (partner access unlocked by CELLULIFT equipment + Open Academy free/paid courses). Planned domain: `academy.cellulift.ma`.

This folder is separate from the cellulift.ma website and is not built or deployed with it.

| Phase | Deliverable |
|---|---|
| 1 · Product architecture | [`docs/01-product-architecture.md`](docs/01-product-architecture.md) — recommendation (Moodle vs white-label vs custom), stack, information architecture, roles, access logic, journeys, MVP scope |
| 2 · UX/UI | [`docs/02-ux-ui.md`](docs/02-ux-ui.md) — design system ("Nacre & verre" applied to a product), sitemap, layouts |
| 3 · Interactive prototype | [`prototype/`](prototype/) — clickable, responsive, sample data |
| 4 · Production roadmap | [`docs/04-production-roadmap.md`](docs/04-production-roadmap.md) — backend, video security (honest), payments in Morocco, hosting, testing, phases |
| CRM integration | [`docs/05-integration-crm.md`](docs/05-integration-crm.md) (FR) — connection to the Cellulift CRM (Supabase): data flows, current data gaps, prerequisites |
| Database drafts | [`supabase/schema.sql`](supabase/schema.sql) — Academy schema with entitlement engine · [`supabase/crm-academy-draft.sql`](supabase/crm-academy-draft.sql) — CRM-side additions. Neither is applied anywhere. |

## Run the prototype

The prototype interface is in French.

No build step. Serve the folder and open it:

```bash
cd academy/prototype
python3 -m http.server 8080   # then open http://localhost:8080
```

Opening `index.html` directly from disk also works in most browsers.

### What to try

- **Sign in** with one of the demo personas (or create an account — 3-step registration → simulated email verification).
- **Partner doctor** (Dr Salma Benali, owns HANOVER 5G + DERMABRASIF 6G): dashboard → resume lesson → player (simulated video with moving watermark, notes, resources, progress) → final quiz → certificate → public verification page.
- **Open Academy** (Youssef Amrani, physiotherapist, unverified): see *Free*, *Paid*, *Partner exclusive*, *Locked* and *Enrollment pending* states; buy a course (card = instant, bank transfer = pending).
- **Administrator**: verification queue, user sheet with manual grant/revoke, **equipment × course matrix**, course builder with simulated upload pipeline, content-protection policy, analytics, audit log.
- **CRM sync:** Admin → *Ventes & CRM* → *Synchroniser maintenant*: three sample installations arrive from the CRM — one matched by email to an existing account, one invited, one waiting to be attached (no email in the CRM).
- **Open Academy → customer:** Admin → Ventes & CRM → *Rattacher* (Youssef is pre-selected) → switch persona back to Open Academy: the device programme appears and his history is unchanged.
- Use the dark bar at the top to switch persona or **Reset demo** (state is kept in the browser's localStorage).

### What is simulated

Everything with a backend: authentication and sessions, email, payment (CMI/transfer), video delivery, DRM, watermark burn-in, uploads/encoding, PDF generation, sharing detection. The video player loads no media; its "DRM" badge and CSS watermark only illustrate the UX. **None of this is content protection** — see roadmap §3 for the real implementation and what each layer can and cannot guarantee.

Sample data: device names, photos and public session dates come from cellulift.ma; course structures, learners, figures and most trainers are illustrative. Dr Mohamed Dadoun is listed as a trainer as on cellulift.ma's Academy page; the course content attributed to him here is placeholder.
