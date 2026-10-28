-- CELLULIFT ACADEMY — draft PostgreSQL schema (MVP)
-- Draft for review: not applied to any database. Kept apart from /supabase (main site).

create extension if not exists pgcrypto;
create extension if not exists citext;

-- ───────────── People ─────────────
create table users (
  id               uuid primary key default gen_random_uuid(),
  email            citext unique not null,
  full_name        text not null,
  status           text not null default 'active' check (status in ('active','suspended','deleted')),
  email_verified_at timestamptz,
  crm_contact_id   uuid,                      -- public.contacts.id dans le CRM, une fois rapproché
  created_at       timestamptz not null default now()
);

create table roles (key text primary key, label text not null);
insert into roles values
  ('learner','Learner'),('trainer','Trainer'),('support','Support'),
  ('content_manager','Content manager'),('sales_ops','Sales operations'),('admin','Administrator');

create table user_roles (
  user_id   uuid references users on delete cascade,
  role_key  text references roles,
  granted_by uuid references users,
  granted_at timestamptz not null default now(),
  primary key (user_id, role_key)
);

create table professional_profiles (
  user_id             uuid primary key references users on delete cascade,
  profession          text not null,           -- doctor, nurse, aesthetician, physiotherapist, other
  specialty           text,
  organization        text,
  country             char(2) not null,
  city                text,
  registration_number text,
  registration_body   text,                    -- e.g. CNOM
  verification_status text not null default 'unverified'
                      check (verification_status in ('unverified','pending','verified','rejected')),
  verification_doc_path text,                  -- private bucket key
  verified_by         uuid references users,
  verified_at         timestamptz,
  rejection_reason    text
);

-- ───────────── Equipment ─────────────
create table device_models (
  id        uuid primary key default gen_random_uuid(),
  name      text unique not null,              -- e.g. HANOVER 5G
  family    text not null,                     -- lasers, hifu, rejuvenation…
  crm_produit_id uuid unique,                -- public.produits.id dans le CRM Cellulift
  active    boolean not null default true
);

create table device_ownerships (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users on delete cascade,
  device_model_id uuid not null references device_models,
  serial_number text,
  clinic_name   text,
  purchased_at  date,
  crm_ref       uuid unique,                   -- public.equipements_clients.id dans le CRM
  linked_by     uuid references users,
  revoked_at    timestamptz,
  created_at    timestamptz not null default now()
);

-- ───────────── Content ─────────────
create table trainers (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid references users,
  name      text not null,
  title     text,
  bio       text,
  photo_path text
);

create table courses (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  summary       text,
  objectives    text[] not null default '{}',
  family        text,
  level         text check (level in ('foundation','intermediate','advanced','expert')),
  format        text check (format in ('device_program','masterclass','module','webinar')),
  duration_min  int,
  trainer_id    uuid references trainers,
  cover_path    text,
  status        text not null default 'draft' check (status in ('draft','review','published','archived')),
  certificate_type text not null default 'completion' check (certificate_type in ('none','completion','accredited')),
  passing_score int not null default 80 check (passing_score between 0 and 100),
  -- eligibility (AND-combined with access rules)
  eligible_professions text[],                 -- null = all
  requires_verification boolean not null default false,
  eligible_countries char(2)[],
  created_at    timestamptz not null default now(),
  published_at  timestamptz
);

create table course_access_rules (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid not null references courses on delete cascade,
  kind       text not null check (kind in ('free','paid','equipment','manual_only')),
  price_mad  numeric(10,2),
  access_days int,                             -- null = lifetime
  check ((kind = 'paid') = (price_mad is not null))
);

create table equipment_course_rules (
  device_model_id uuid references device_models on delete cascade,
  course_id       uuid references courses on delete cascade,
  access_days     int,
  primary key (device_model_id, course_id)
);

create table modules (
  id        uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses on delete cascade,
  position  int not null,
  title     text not null
);

create table lessons (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references modules on delete cascade,
  position    int not null,
  title       text not null,
  kind        text not null check (kind in ('video','text','quiz','resource')),
  body_md     text,
  video_asset_id text,                         -- provider id, never a public URL
  duration_sec int,
  is_preview  boolean not null default false
);

create table resources (
  id        uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons on delete cascade,
  title     text not null,
  storage_path text not null,                  -- private bucket
  watermark boolean not null default true
);

-- ───────────── Access ─────────────
create table orders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users,
  status      text not null default 'pending' check (status in ('pending','paid','failed','cancelled','refunded')),
  method      text not null check (method in ('cmi','psp','paypal','bank_transfer','invoice')),
  total_mad   numeric(10,2) not null,
  provider_ref text unique,
  invoice_number text unique,
  created_at  timestamptz not null default now(),
  paid_at     timestamptz
);

create table order_items (
  order_id  uuid references orders on delete cascade,
  course_id uuid references courses,
  price_mad numeric(10,2) not null,
  primary key (order_id, course_id)
);

create table entitlements (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users on delete cascade,
  course_id  uuid not null references courses on delete cascade,
  source     text not null check (source in ('equipment','purchase','free_enrollment','manual_grant','crm_sync')),
  device_ownership_id uuid references device_ownerships,
  order_id   uuid references orders,
  granted_by uuid references users,
  reason     text,
  starts_at  timestamptz not null default now(),
  ends_at    timestamptz,
  revoked_at timestamptz,
  revoked_by uuid references users,
  created_at timestamptz not null default now()
);
create index entitlements_active on entitlements (user_id, course_id) where revoked_at is null;

-- ───────────── Learning ─────────────
create table lesson_progress (
  user_id     uuid references users on delete cascade,
  lesson_id   uuid references lessons on delete cascade,
  position_sec int not null default 0,
  watched_ratio numeric(4,3) not null default 0,
  completed_at timestamptz,
  updated_at  timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table notes (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references users on delete cascade,
  lesson_id uuid not null references lessons on delete cascade,
  at_sec    int,
  body      text not null,
  created_at timestamptz not null default now()
);

create table quizzes (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid not null references courses on delete cascade,
  title      text not null,
  max_attempts int default 3
);
create table questions (
  id       uuid primary key default gen_random_uuid(),
  quiz_id  uuid not null references quizzes on delete cascade,
  position int not null,
  prompt   text not null,
  explanation text
);
create table options (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions on delete cascade,
  label       text not null,
  is_correct  boolean not null default false
);
create table quiz_attempts (
  id        uuid primary key default gen_random_uuid(),
  quiz_id   uuid not null references quizzes,
  user_id   uuid not null references users on delete cascade,
  answers   jsonb not null,
  score     int not null,
  passed    boolean not null,
  submitted_at timestamptz not null default now()
);

create table certificates (
  id          uuid primary key default gen_random_uuid(),
  verification_code text unique not null,      -- e.g. CA-2026-7F3K-91QD
  user_id     uuid not null references users,
  course_id   uuid not null references courses,
  type        text not null check (type in ('completion','accredited')),
  hours       numeric(5,1),
  issued_at   timestamptz not null default now(),
  revoked_at  timestamptz,
  pdf_path    text
);

-- ───────────── Protection & audit ─────────────
create table user_devices (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users on delete cascade,
  fingerprint text not null,                   -- hashed
  label       text,                            -- "Safari · macOS"
  first_seen  timestamptz not null default now(),
  last_seen   timestamptz not null default now(),
  last_ip     inet,
  last_country char(2),
  revoked_at  timestamptz,
  unique (user_id, fingerprint)
);

create table playback_events (
  id         bigserial primary key,
  user_id    uuid not null references users,
  lesson_id  uuid not null references lessons,
  device_id  uuid references user_devices,
  kind       text not null check (kind in ('token_issued','token_denied','licence','heartbeat','ended')),
  ip         inet,
  country    char(2),
  at         timestamptz not null default now()
);
create index playback_events_user_at on playback_events (user_id, at desc);

create table protection_alerts (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references users,
  kind      text not null,                     -- impossible_travel, too_many_devices, parallel_streams
  details   jsonb,
  status    text not null default 'open' check (status in ('open','dismissed','actioned')),
  created_at timestamptz not null default now()
);

create table audit_log (
  id        bigserial primary key,
  actor_id  uuid references users,
  action    text not null,                     -- entitlement.grant, user.verify, course.publish…
  entity    text not null,
  entity_id text,
  before    jsonb,
  after     jsonb,
  ip        inet,
  at        timestamptz not null default now()
);

create table analytics_events (
  id      bigserial primary key,
  user_id uuid references users,
  name    text not null,                       -- signup, verify, enroll, purchase, lesson_complete, open_to_partner…
  props   jsonb,
  at      timestamptz not null default now()
);

create table notifications (
  id       uuid primary key default gen_random_uuid(),
  user_id  uuid not null references users on delete cascade,
  kind     text not null,
  title    text not null,
  body     text,
  link     text,
  read_at  timestamptz,
  created_at timestamptz not null default now()
);

-- ───────────── CRM sync (see docs/05-integration-crm.md) ─────────────
create table crm_sync_runs (
  id          bigserial primary key,
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  since       timestamptz,                     -- watermark passed to academy_equipements_depuis
  received    int not null default 0,
  linked      int not null default 0,          -- matched to an existing Academy user
  invited     int not null default 0,          -- invitation sent to a new email
  to_review   int not null default 0,          -- no email / ambiguous match → admin queue
  revoked     int not null default 0,
  error       text
);

create table crm_pending_links (               -- installations waiting for an admin to attach a person
  crm_equipement_id uuid primary key,
  payload    jsonb not null,
  reason     text not null check (reason in ('no_email','ambiguous_match','unknown_product')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references users
);

-- ───────────── Access decision helper ─────────────
-- Mirrors canAccess() in the app (the app check is primary; this backs RLS).
create or replace function has_course_access(p_user uuid, p_course uuid)
returns boolean language sql stable as $$
  select exists (
    select 1
    from entitlements e
    join users u on u.id = e.user_id and u.status = 'active'
    join courses c on c.id = e.course_id
    left join professional_profiles p on p.user_id = u.id
    where e.user_id = p_user and e.course_id = p_course
      and e.revoked_at is null
      and e.starts_at <= now() and (e.ends_at is null or e.ends_at > now())
      and (not c.requires_verification or p.verification_status = 'verified')
      and (c.eligible_professions is null or p.profession = any (c.eligible_professions))
  );
$$;

-- Creates equipment entitlements when a device is linked to a user.
create or replace function grant_equipment_entitlements() returns trigger language plpgsql as $$
begin
  insert into entitlements (user_id, course_id, source, device_ownership_id, granted_by, ends_at)
  select new.user_id, r.course_id, 'equipment', new.id, new.linked_by,
         case when r.access_days is null then null else now() + make_interval(days => r.access_days) end
  from equipment_course_rules r
  where r.device_model_id = new.device_model_id;
  return new;
end $$;

create trigger device_ownership_grants
after insert on device_ownerships
for each row execute function grant_equipment_entitlements();
