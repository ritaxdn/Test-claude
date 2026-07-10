# Cellulift — site vitrine & outil commercial

Site Next.js (App Router) pour Cellulift, distributeur et ambassadeur officiel
de LGL Expert en Afrique francophone. Conçu comme un outil de génération de
leads B2B : catalogue de 45 machines (15 familles), formulaires de
qualification, tracking marketing complet et architecture prête pour un CRM.

## Stack technique

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** avec un thème sur-mesure (couleurs, typographie, tokens)
- **Framer Motion** pour les animations de scroll (avec support `prefers-reduced-motion`)
- **React Hook Form + Zod** pour la validation des formulaires
- **next/font** (Bodoni Moda + Jost, auto-hébergées, sans requête externe)

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # build de production
npm run start   # sert le build de production
npm run lint    # ESLint
```

## Variables d'environnement

Copiez `.env.example` vers `.env.local` et complétez les valeurs utiles :

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL absolue du site (metadata, sitemap, JSON-LD) |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 (ignoré si `NEXT_PUBLIC_GTM_ID` est défini) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager (recommandé pour piloter GA4 + autres) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel |
| `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` | LinkedIn Insight Tag |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity |
| `CRM_WEBHOOK_URL` | URL webhook CRM (HubSpot/Pipedrive/Zoho/Zapier/Make) recevant chaque lead en JSON |

Chaque script analytics ne se charge que si sa variable est renseignée — rien
n'est appelé par défaut, donc aucune requête externe superflue tant que les
IDs ne sont pas fournis.

## Architecture des leads

Tous les formulaires (`/devis`, `/contact`, `/ressources`) passent par le
composant `src/components/forms/QuoteForm.tsx` puis postent sur
`src/app/api/lead/route.ts`, qui :

1. valide les données (`src/lib/validation/lead.ts`, schéma Zod partagé) ;
2. transmet le lead à `CRM_WEBHOOK_URL` si elle est configurée (sinon logge
   simplement côté serveur) ;
3. déclenche les événements analytics côté client (`src/lib/analytics.ts`).

Pour brancher un vrai CRM : créez un webhook côté HubSpot/Pipedrive/Zoho (ou
un scénario Zapier/Make), collez son URL dans `CRM_WEBHOOK_URL`, c'est tout —
aucune modification de code nécessaire.

## Tracking

`src/lib/analytics.ts` expose `trackEvent(name, params)`, qui pousse
simultanément vers `dataLayer` (GTM/GA4), `fbq` (Meta) et `clarity`. Événements
déjà câblés : `form_submit`, `quote_request`, `demo_request`,
`brochure_download`, `whatsapp_click`, `phone_click`, `email_click`,
`cta_click`. Ajoutez `scroll_depth` et `video_play` en appelant `trackEvent`
depuis les composants concernés dès que ces éléments existeront réellement.

## SEO

- Metadata dynamique par page (`generateMetadata`), Open Graph, Twitter Card
- `sitemap.xml` et `robots.txt` générés (`src/app/sitemap.ts`, `robots.ts`)
- JSON-LD : `Organization`/`MedicalBusiness` (accueil), `Product` (fiches
  produit), `BreadcrumbList` (catalogue, catégories, fiches produit)
- Toutes les pages catalogue/produit sont pré-rendues statiquement
  (`generateStaticParams`) pour des Core Web Vitals optimaux

## ⚠️ Contenu à remplacer avant mise en ligne

Ce site est **fonctionnel de bout en bout**, mais une partie du contenu est
volontairement un placeholder réaliste, à remplacer par les vraies données
Cellulift / LGL Expert :

- **`src/lib/data/contact.ts`** — téléphone, WhatsApp, email, adresse (actuellement des placeholders)
- **`src/lib/data/products.ts`** — noms de machines, descriptions et
  caractéristiques techniques sont une structure de catalogue crédible, pas
  les vrais noms/specs LGL Expert. Chaque entrée est commentée en conséquence.
- **`src/components/sections/Testimonials.tsx`** — témoignages illustratifs,
  à remplacer par de vrais retours clients (avec leur accord)
- **`src/app/mentions-legales/page.tsx`** — informations juridiques réelles
  (forme sociale, immatriculation, hébergeur) à compléter
- Logo : le site utilise actuellement un wordmark texte ("CELLULIFT"). Ajoutez
  le vrai logo dans `public/` et remplacez le texte dans `src/components/Navbar.tsx`
  et `src/components/Footer.tsx`.
- Photos produits : les fiches utilisent des icônes, pas de photographie. À
  enrichir avec les vraies visuels LGL Expert (via `next/image` pour garder
  l'optimisation automatique).

## Déploiement

Le site est prêt pour un déploiement sur [Vercel](https://vercel.com) (zéro
configuration) ou tout hébergeur supportant Next.js (Node 20+). Pensez à
renseigner les variables d'environnement de production avant le premier
déploiement.
