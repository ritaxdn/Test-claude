-- CELLULIFT ACADEMY — schéma du MVP (PostgreSQL ≥ 14).
-- Sous-ensemble de academy/supabase/schema.sql : médecins invités, machines, parcours, leçons,
-- documents, progression. Pas de paiement, de quiz ni de certificat dans le MVP.

create extension if not exists citext;

create table if not exists users (
  id              uuid primary key default gen_random_uuid(),
  email           citext unique not null,
  full_name       text not null check (char_length(full_name) between 1 and 200),
  role            text not null default 'doctor' check (role in ('doctor', 'admin')),
  status          text not null default 'invited' check (status in ('invited', 'active', 'disabled')),
  password_hash   text,
  specialty       text,
  clinic          text,
  city            text,
  crm_contact_id  uuid,                                  -- contacts.id dans le CRM, plus tard
  created_at      timestamptz not null default now(),
  activated_at    timestamptz,
  last_login_at   timestamptz
);

-- Jetons à usage unique : invitation (création du mot de passe) et réinitialisation.
create table if not exists auth_tokens (
  token_hash  text primary key,                          -- SHA-256 du jeton ; le jeton lui-même n'est jamais stocké
  user_id     uuid not null references users on delete cascade,
  kind        text not null check (kind in ('invite', 'reset')),
  expires_at  timestamptz not null,
  used_at     timestamptz,
  created_by  uuid references users,
  created_at  timestamptz not null default now()
);

create table if not exists sessions (
  token_hash  text primary key,
  user_id     uuid not null references users on delete cascade,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  last_seen   timestamptz not null default now(),
  user_agent  text,
  ip          text
);
create index if not exists sessions_user on sessions (user_id);

create table if not exists login_attempts (
  key        text not null,                              -- e-mail en minuscules
  at         timestamptz not null default now()
);
create index if not exists login_attempts_key on login_attempts (key, at);

create table if not exists device_models (
  id              uuid primary key default gen_random_uuid(),
  name            text unique not null,                  -- ex. HANOVER 5G
  family          text,
  crm_produit_id  uuid unique                            -- produits.id dans le CRM, plus tard
);

create table if not exists device_ownerships (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references users on delete cascade,
  device_model_id uuid not null references device_models,
  serial_number   text,
  clinic          text,
  installed_on    date,
  crm_ref         uuid unique,                           -- equipements_clients.id dans le CRM, plus tard
  created_by      uuid references users,
  created_at      timestamptz not null default now(),
  revoked_at      timestamptz
);
create index if not exists device_ownerships_user on device_ownerships (user_id) where revoked_at is null;

create table if not exists programs (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null check (slug ~ '^[a-z0-9-]{2,80}$'),
  title           text not null,
  summary         text,
  device_model_id uuid references device_models,         -- le parcours de cette machine
  published       boolean not null default false,
  created_at      timestamptz not null default now()
);

create table if not exists modules (
  id          uuid primary key default gen_random_uuid(),
  program_id  uuid not null references programs on delete cascade,
  position    int not null,
  title       text not null,
  unique (program_id, position) deferrable initially deferred
);

-- Présentateurs des vidéos (Dr Dadoun et l'équipe CELLULIFT Academy).
create table if not exists presenters (
  id      uuid primary key default gen_random_uuid(),
  name    text unique not null check (char_length(name) between 2 and 120),
  title   text check (char_length(title) <= 160),          -- ex. « Médecin esthétique & lasériste · Casablanca »
  active  boolean not null default true,
  created_at timestamptz not null default now()
);
insert into presenters (name, title) values
  ('Dr Mohamed Dadoun', 'Médecin esthétique & lasériste · Casablanca'),
  ('Meryem Belkhalfi', null),
  ('Imane Souali', null)
on conflict (name) do nothing;

create table if not exists lessons (
  id            uuid primary key default gen_random_uuid(),
  module_id     uuid not null references modules on delete cascade,
  position      int not null,
  title         text not null,
  body          text,                                    -- texte sous la vidéo (paragraphes séparés par une ligne vide)
  video_ref     text,                                    -- local : nom de fichier ; mux : playback ID
  duration_sec  int check (duration_sec > 0),
  unique (module_id, position) deferrable initially deferred
);

create table if not exists documents (
  id           uuid primary key default gen_random_uuid(),
  program_id   uuid not null references programs on delete cascade,
  lesson_id    uuid references lessons on delete set null,
  title        text not null,
  storage_key  text not null,                            -- clé dans le stockage privé
  mime_type    text not null default 'application/pdf',
  size_bytes   bigint,
  created_at   timestamptz not null default now()
);

-- Accès à un parcours : ouvert par une machine (source equipment) ou à la main (source manual).
create table if not exists entitlements (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references users on delete cascade,
  program_id          uuid not null references programs on delete cascade,
  source              text not null check (source in ('equipment', 'manual')),
  device_ownership_id uuid references device_ownerships on delete cascade,
  granted_by          uuid references users,
  created_at          timestamptz not null default now(),
  revoked_at          timestamptz
);
create index if not exists entitlements_user on entitlements (user_id) where revoked_at is null;
create unique index if not exists entitlements_unique_equipment on entitlements (user_id, program_id, device_ownership_id) where revoked_at is null;

create table if not exists lesson_progress (
  user_id         uuid not null references users on delete cascade,
  lesson_id       uuid not null references lessons on delete cascade,
  position_sec    numeric(10,2) not null default 0,      -- où reprendre
  max_position_sec numeric(10,2) not null default 0,     -- plus loin réellement regardé
  last_beat_at    timestamptz,                           -- dernier battement reçu (anti-saut)
  completed_at    timestamptz,
  updated_at      timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists audit_log (
  id        bigserial primary key,
  actor_id  uuid references users,
  action    text not null,
  target    text,
  details   jsonb,
  at        timestamptz not null default now()
);

alter table lessons add column if not exists presenter_id uuid references presenters on delete set null;

-- Leçons d'un parcours dans l'ordre de lecture.
create or replace view program_lessons as
select p.id as program_id, m.id as module_id, m.position as module_position, m.title as module_title,
       l.id as lesson_id, l.position as lesson_position, l.title, l.duration_sec, l.video_ref,
       row_number() over (partition by p.id order by m.position, l.position) as seq,
       pr.name as presenter_name, pr.title as presenter_title
  from programs p
  join modules m on m.program_id = p.id
  join lessons l on l.module_id = m.id
  left join presenters pr on pr.id = l.presenter_id;
