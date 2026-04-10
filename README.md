# AesthCRM — Medical Aesthetic Machines CRM

A simple, clean CRM built with **Next.js 15** and **Supabase** for companies that sell medical aesthetic machines.

---

## Features

- **Contacts** — name, phone, email, company
- **Deals** — linked to contacts, with value and pipeline stage
- **Pipeline board** — 7 stages: Lead → Contacted → Interested → Demo → Negotiation → Won → Lost
- **Drag and drop** — move deals between stages
- **Notes** — attach notes to contacts or individual deals
- **Dashboard** — overview stats (total contacts, deals, revenue won)

---

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | Next.js 15 (App Router) |
| Styling  | Tailwind CSS v4         |
| Database | Supabase (PostgreSQL)   |
| Language | TypeScript              |

---

## Local Setup (Step by Step)

### Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in (free tier is fine).
2. Click **New Project**, give it a name (e.g. `aesthcrm`), set a database password, pick a region.
3. Wait ~1 minute for the project to spin up.

### Step 2 — Run the database schema

1. In your Supabase project, go to **SQL Editor** (left sidebar).
2. Click **New query**.
3. Copy the entire contents of [`crm/supabase/schema.sql`](./crm/supabase/schema.sql) and paste it in.
4. Click **Run**. This creates the `contacts`, `deals`, and `notes` tables and loads sample data.

### Step 3 — Get your Supabase API keys

1. In Supabase, go to **Project Settings → API**.
2. Copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public** key (the long string under "Project API keys")

### Step 4 — Configure environment variables

Inside the `crm/` folder, create a file called `.env.local`:

```bash
# crm/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> Use `.env.local.example` as reference — it already shows the format.

### Step 5 — Install dependencies and run

```bash
cd crm
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
crm/
├── app/
│   ├── layout.tsx          # Root layout with Navbar
│   ├── page.tsx            # Dashboard (stats overview)
│   ├── contacts/
│   │   ├── page.tsx        # Contacts list + add contact
│   │   └── [id]/
│   │       └── page.tsx    # Contact detail, deals, notes
│   └── deals/
│       └── page.tsx        # Pipeline Kanban board
├── components/
│   ├── Navbar.tsx          # Top navigation
│   ├── Modal.tsx           # Reusable modal dialog
│   └── NoteList.tsx        # Notes list + add note
├── lib/
│   └── supabase.ts         # Supabase client
├── types/
│   └── index.ts            # TypeScript types & pipeline stages
└── supabase/
    └── schema.sql          # Database schema + seed data
```

---

## How to Use

### Adding a Contact
1. Go to **Contacts** in the nav.
2. Click **+ New Contact**, fill in the form.

### Creating a Deal
- From a contact's detail page → **+ Add Deal**.
- Or from the **Pipeline** page → **+ New Deal** (pick a contact from the dropdown).

### Moving Deals
- **Drag** a deal card to a different column.
- Or click a deal card to open the side panel and change the **Pipeline Stage** dropdown.

### Adding Notes
- Open a contact or click a deal card.
- Type in the notes box and click **Add**.

---

## Customisation Tips

- **Add more fields** to contacts/deals: update `supabase/schema.sql` and `types/index.ts`.
- **Disable RLS** for local dev: comment out the `enable row level security` lines in `schema.sql` (already open-policy for now).
- **Deploy**: push to Vercel, add your `NEXT_PUBLIC_SUPABASE_*` environment variables in the Vercel dashboard.
