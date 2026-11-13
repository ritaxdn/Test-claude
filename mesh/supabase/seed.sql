-- =============================================================================
-- MESH demo seed — FICTIONAL DEMO PROJECTS ONLY.
--
-- These rows are invented examples so the Discover feed is not empty on a
-- fresh install. They are flagged `is_demo = true`, have no owner (no user,
-- founder or investor is fabricated), are labeled "Fictional demo" in the UI,
-- and cannot receive interest requests.
--
-- Safe to re-run: existing demo rows are replaced.
-- Remove them any time with:  delete from public.projects where is_demo;
-- =============================================================================

delete from public.projects where is_demo;

insert into public.projects
  (is_demo, title, tagline, problem, solution, industry, stage, roles_needed, traction, location, visibility)
values
  (true, 'Demo · Loopback Labs',
   'Fictional demo: reusable packaging returns for neighbourhood cafés.',
   'Independent cafés throw away thousands of single-use cups a month and cannot afford enterprise reuse programs.',
   'A shared deposit network with QR-tagged cups and drop-off points that any café can join in an afternoon.',
   'climate', 'prototype', array['technical_cofounder', 'operations'],
   'Fictional demo listing — no real traction.', 'Lisbon, Portugal', 'public'),

  (true, 'Demo · Ledgerleaf',
   'Fictional demo: bookkeeping autopilot for freelancers.',
   'Freelancers lose hours every month reconciling invoices, receipts and bank lines by hand.',
   'Bank-feed matching rules plus a receipt inbox that categorises expenses and prepares quarterly summaries.',
   'fintech', 'mvp', array['engineer', 'growth'],
   'Fictional demo listing — no real traction.', 'Remote', 'public'),

  (true, 'Demo · Tidepool Tutors',
   'Fictional demo: peer tutoring marketplace for coastal schools.',
   'Rural and coastal students have limited access to affordable, subject-specific tutoring.',
   'A vetted peer-tutor marketplace with short video sessions and school-sponsored credits.',
   'edtech', 'idea', array['business_cofounder', 'designer', 'product'],
   'Fictional demo listing — no real traction.', 'Halifax, Canada', 'public'),

  (true, 'Demo · Patchwork CI',
   'Fictional demo: flaky test detective for monorepos.',
   'Large monorepos waste compute and developer time on flaky tests that nobody owns.',
   'A CI plugin that fingerprints flaky tests, quarantines them automatically and routes them to code owners.',
   'devtools', 'early_revenue', array['engineer', 'sales', 'advisor'],
   'Fictional demo listing — no real traction.', 'Berlin, Germany', 'public'),

  (true, 'Demo · Pulsewise',
   'Fictional demo: remote check-ins for post-surgery recovery.',
   'Clinics struggle to follow up with patients in the weeks after outpatient surgery.',
   'A lightweight daily check-in flow that flags concerning answers to the care team.',
   'healthtech', 'prototype', array['technical_cofounder', 'investor'],
   'Fictional demo listing — no real traction.', 'Austin, USA', 'public'),

  (true, 'Demo · Gridnest',
   'Fictional demo: shared battery storage for apartment buildings.',
   'Apartment residents cannot easily benefit from home batteries or time-of-use savings.',
   'A building-level battery leased by residents, with an app that splits savings fairly.',
   'hardware', 'idea', array['technical_cofounder', 'business_cofounder', 'investor'],
   'Fictional demo listing — no real traction.', 'Nairobi, Kenya', 'public');
