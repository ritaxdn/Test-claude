# Cellulift — Website

Premium bilingual (FR/EN) marketing website for Cellulift, a medico-aesthetic
technology distributor and partner for medical professionals across Africa.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, `src/app/[lang]`)
- TypeScript, Tailwind CSS v4
- [Framer Motion](https://motion.dev) for scroll reveals and micro-interactions

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Structure

- `src/app/[lang]/` — routes for both locales (`/fr`, `/en`), proxied from `/`
  via `src/proxy.ts`
- `src/content/` — all page copy and data (technologies, academy programs,
  stats, testimonials), keyed by locale — edit here to update text without
  touching layout code
- `src/components/` — design system primitives (`ui/`), layout (`layout/`),
  and page sections (`sections/`)
- `src/lib/i18n/` — locale config and shared UI dictionary

## Content still to finalize

- `src/content/company.ts` — placeholder phone/email/social links
- `src/content/technologies.ts` — placeholder product names/specs; swap in
  real Cellulift device names, certifications and photography
- `src/app/api/contact/route.ts` — logs submissions; wire up to a real
  email/CRM provider before launch
