-- ============================================================
-- Medical Aesthetic CRM - Supabase Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- CONTACTS
create table if not exists contacts (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  email       text,
  company     text,
  created_at  timestamptz default now()
);

-- DEALS
create table if not exists deals (
  id          uuid primary key default gen_random_uuid(),
  contact_id  uuid references contacts(id) on delete cascade,
  title       text not null,
  value       numeric(12, 2) default 0,
  status      text not null default 'Lead'
                check (status in ('Lead','Contacted','Interested','Demo','Negotiation','Won','Lost')),
  created_at  timestamptz default now()
);

-- NOTES  (belong to a contact OR a deal, or both)
create table if not exists notes (
  id          uuid primary key default gen_random_uuid(),
  contact_id  uuid references contacts(id) on delete cascade,
  deal_id     uuid references deals(id) on delete cascade,
  content     text not null,
  created_at  timestamptz default now()
);

-- ============================================================
-- Row Level Security (disable for local dev, enable for prod)
-- ============================================================
alter table contacts enable row level security;
alter table deals     enable row level security;
alter table notes     enable row level security;

-- Open policies (allow all for now — tighten in production)
create policy "allow all contacts" on contacts for all using (true) with check (true);
create policy "allow all deals"    on deals    for all using (true) with check (true);
create policy "allow all notes"    on notes    for all using (true) with check (true);

-- ============================================================
-- Sample seed data (optional — delete if not needed)
-- ============================================================
insert into contacts (name, phone, email, company) values
  ('Sofia Martinez',  '+1-555-0101', 'sofia@luxeclinic.com',    'Luxe Aesthetic Clinic'),
  ('James Park',      '+1-555-0102', 'james@glowspa.com',       'Glow Med Spa'),
  ('Aria Chen',       '+1-555-0103', 'aria@radiantbeauty.com',  'Radiant Beauty Center');

insert into deals (contact_id, title, value, status)
select id, 'HIFU Machine Interest', 24000, 'Lead'
from contacts where name = 'Sofia Martinez';

insert into deals (contact_id, title, value, status)
select id, 'Laser Hair Removal System', 38000, 'Demo'
from contacts where name = 'James Park';

insert into deals (contact_id, title, value, status)
select id, 'Cryolipolysis Unit', 18500, 'Negotiation'
from contacts where name = 'Aria Chen';
