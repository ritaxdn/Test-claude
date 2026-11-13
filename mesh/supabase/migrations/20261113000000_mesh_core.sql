-- =============================================================================
-- MESH core schema: profiles, projects, passes, match requests, messages.
-- Every table has RLS enabled. Only the `authenticated` role gets access.
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Generic helpers
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  full_name     text not null default '' check (char_length(full_name) <= 80),
  headline      text check (char_length(headline) <= 120),
  bio           text check (char_length(bio) <= 1000),
  roles         text[] not null default '{}'
                check (roles <@ array['founder', 'builder', 'investor']::text[]),
  interests     text[] not null default '{}'
                check (
                  interests <@ array[
                    'ai_ml', 'climate', 'consumer', 'devtools', 'edtech', 'fintech',
                    'healthtech', 'hardware', 'marketplaces', 'saas', 'social_impact', 'other'
                  ]::text[]
                ),
  skills        text[] not null default '{}' check (cardinality(skills) <= 20),
  location      text check (char_length(location) <= 80),
  availability  text check (availability in ('full_time', 'part_time', 'evenings_weekends', 'advisory')),
  commitment    text check (commitment in ('exploring', 'side_project', 'all_in')),
  onboarded     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  -- A profile can only be marked onboarded once the essentials are filled in.
  constraint profiles_onboarded_complete check (
    not onboarded or (
      char_length(btrim(full_name)) > 0
      and cardinality(roles) > 0
      and availability is not null
      and commitment is not null
    )
  )
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create an empty profile for every new auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- projects
-- -----------------------------------------------------------------------------
create table public.projects (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid references public.profiles (id) on delete cascade,
  is_demo       boolean not null default false,
  title         text not null check (char_length(btrim(title)) between 3 and 80),
  tagline       text check (char_length(tagline) <= 140),
  problem       text not null check (char_length(btrim(problem)) between 10 and 2000),
  solution      text not null check (char_length(btrim(solution)) between 10 and 2000),
  industry      text not null check (
                  industry in (
                    'ai_ml', 'climate', 'consumer', 'devtools', 'edtech', 'fintech',
                    'healthtech', 'hardware', 'marketplaces', 'saas', 'social_impact', 'other'
                  )
                ),
  stage         text not null check (stage in ('idea', 'prototype', 'mvp', 'early_revenue', 'scaling')),
  roles_needed  text[] not null default '{}' check (
                  cardinality(roles_needed) between 1 and 10
                  and roles_needed <@ array[
                    'technical_cofounder', 'business_cofounder', 'engineer', 'designer', 'product',
                    'growth', 'sales', 'operations', 'advisor', 'investor'
                  ]::text[]
                ),
  traction      text check (char_length(traction) <= 1000),
  location      text check (char_length(location) <= 80),
  visibility    text not null default 'public' check (visibility in ('public', 'private')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  -- Real projects always have an owner; demo projects never do.
  constraint projects_owner_xor_demo check ((owner_id is not null) <> is_demo)
);

create index projects_owner_idx on public.projects (owner_id);
create index projects_feed_idx on public.projects (visibility, created_at desc);
create index projects_roles_needed_idx on public.projects using gin (roles_needed);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- passes ("not for me" — hides a project from one user's feed)
-- -----------------------------------------------------------------------------
create table public.passes (
  user_id     uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  project_id  uuid not null references public.projects (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, project_id)
);

create index passes_project_idx on public.passes (project_id);

-- -----------------------------------------------------------------------------
-- match_requests ("Interested"). Accepted request == match.
-- -----------------------------------------------------------------------------
create table public.match_requests (
  id                uuid primary key default gen_random_uuid(),
  project_id        uuid not null references public.projects (id) on delete cascade,
  sender_id         uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  project_owner_id  uuid not null references public.profiles (id) on delete cascade,
  note              text check (char_length(note) <= 500),
  status            text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at        timestamptz not null default now(),
  responded_at      timestamptz,
  constraint match_requests_unique unique (project_id, sender_id),
  constraint match_requests_no_self check (sender_id <> project_owner_id)
);

create index match_requests_sender_idx on public.match_requests (sender_id, status);
create index match_requests_owner_idx on public.match_requests (project_owner_id, status);

-- Fill project_owner_id from the project and enforce invariants on insert.
create or replace function public.match_requests_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner uuid;
  v_demo boolean;
begin
  select p.owner_id, p.is_demo into v_owner, v_demo
  from public.projects p
  where p.id = new.project_id;

  if not found then
    raise exception 'Project not found' using errcode = 'P0002';
  end if;
  if v_demo or v_owner is null then
    raise exception 'Demo projects cannot receive requests' using errcode = '23514';
  end if;
  if v_owner = new.sender_id then
    raise exception 'You cannot request to join your own project' using errcode = '23514';
  end if;

  new.project_owner_id := v_owner;
  new.status := 'pending';
  new.responded_at := null;
  new.created_at := now();
  return new;
end;
$$;

create trigger match_requests_before_insert
  before insert on public.match_requests
  for each row execute function public.match_requests_before_insert();

-- Only pending -> accepted|rejected is allowed, and decisions are final.
create or replace function public.match_requests_before_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.project_id <> old.project_id
     or new.sender_id <> old.sender_id
     or new.project_owner_id <> old.project_owner_id
     or new.note is distinct from old.note
     or new.created_at <> old.created_at then
    raise exception 'Only the status of a request can change' using errcode = '42501';
  end if;

  if new.status is distinct from old.status then
    if old.status <> 'pending' or new.status not in ('accepted', 'rejected') then
      raise exception 'Request has already been decided' using errcode = '23514';
    end if;
    new.responded_at := now();
  end if;
  return new;
end;
$$;

create trigger match_requests_before_update
  before update on public.match_requests
  for each row execute function public.match_requests_before_update();

-- -----------------------------------------------------------------------------
-- messages
-- -----------------------------------------------------------------------------
create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  match_id    uuid not null references public.match_requests (id) on delete cascade,
  sender_id   uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  body        text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at  timestamptz not null default now()
);

create index messages_match_idx on public.messages (match_id, created_at);

-- -----------------------------------------------------------------------------
-- Policy helper functions (SECURITY DEFINER to avoid RLS recursion)
-- -----------------------------------------------------------------------------
create or replace function public.is_project_owner(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.projects p
    where p.id = p_project_id and p.owner_id = auth.uid()
  );
$$;

create or replace function public.has_accepted_match(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.match_requests r
    where r.project_id = p_project_id
      and r.sender_id = auth.uid()
      and r.status = 'accepted'
  );
$$;

create or replace function public.is_match_participant(p_match_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.match_requests r
    where r.id = p_match_id
      and r.status = 'accepted'
      and auth.uid() in (r.sender_id, r.project_owner_id)
  );
$$;

-- Is `p_other` someone the caller has a pending/accepted request with?
-- Lets owners see the profile of people who reached out, even mid-onboarding.
create or replace function public.shares_request_with(p_other uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.match_requests r
    where (r.sender_id = auth.uid() and r.project_owner_id = p_other)
       or (r.project_owner_id = auth.uid() and r.sender_id = p_other)
  );
$$;

-- -----------------------------------------------------------------------------
-- Discover feed (SECURITY INVOKER: RLS still applies)
-- -----------------------------------------------------------------------------
create or replace function public.discover_projects(
  p_industry text default null,
  p_stage    text default null,
  p_role     text default null,
  p_location text default null,
  p_limit    integer default 24,
  p_offset   integer default 0
)
returns setof public.projects
language sql
stable
security invoker
set search_path = ''
as $$
  select p.*
  from public.projects p
  where p.visibility = 'public'
    and p.owner_id is distinct from auth.uid()
    and not exists (
      select 1 from public.passes x
      where x.project_id = p.id and x.user_id = auth.uid()
    )
    and not exists (
      select 1 from public.match_requests r
      where r.project_id = p.id and r.sender_id = auth.uid()
    )
    and (p_industry is null or p.industry = p_industry)
    and (p_stage is null or p.stage = p_stage)
    and (p_role is null or p_role = any (p.roles_needed))
    and (
      p_location is null
      or p.location ilike '%' || replace(replace(replace(p_location, '\', '\\'), '%', '\%'), '_', '\_') || '%'
    )
  order by p.is_demo asc, p.created_at desc, p.id
  limit least(greatest(coalesce(p_limit, 24), 1), 50)
  offset greatest(coalesce(p_offset, 0), 0);
$$;

-- -----------------------------------------------------------------------------
-- Row-level security
-- -----------------------------------------------------------------------------
alter table public.profiles       enable row level security;
alter table public.projects       enable row level security;
alter table public.passes         enable row level security;
alter table public.match_requests enable row level security;
alter table public.messages       enable row level security;

-- profiles --------------------------------------------------------------------
create policy "profiles: read onboarded, own, or counterpart"
  on public.profiles for select to authenticated
  using (onboarded or id = auth.uid() or public.shares_request_with(id));

create policy "profiles: insert own"
  on public.profiles for insert to authenticated
  with check (id = auth.uid());

create policy "profiles: update own"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- projects --------------------------------------------------------------------
create policy "projects: read public, own, or matched"
  on public.projects for select to authenticated
  using (
    visibility = 'public'
    or owner_id = auth.uid()
    or public.has_accepted_match(id)
  );

create policy "projects: insert as owner"
  on public.projects for insert to authenticated
  with check (owner_id = auth.uid() and is_demo = false);

create policy "projects: update own"
  on public.projects for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "projects: delete own"
  on public.projects for delete to authenticated
  using (owner_id = auth.uid());

-- passes ----------------------------------------------------------------------
create policy "passes: read own"
  on public.passes for select to authenticated
  using (user_id = auth.uid());

create policy "passes: insert own, not on own projects"
  on public.passes for insert to authenticated
  with check (user_id = auth.uid() and not public.is_project_owner(project_id));

create policy "passes: delete own"
  on public.passes for delete to authenticated
  using (user_id = auth.uid());

-- match_requests --------------------------------------------------------------
create policy "requests: read as sender or owner"
  on public.match_requests for select to authenticated
  using (sender_id = auth.uid() or project_owner_id = auth.uid());

create policy "requests: send to visible public projects"
  on public.match_requests for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.visibility = 'public'
        and p.is_demo = false
        and p.owner_id <> auth.uid()
    )
  );

create policy "requests: owner decides"
  on public.match_requests for update to authenticated
  using (project_owner_id = auth.uid())
  with check (project_owner_id = auth.uid());

create policy "requests: sender withdraws pending"
  on public.match_requests for delete to authenticated
  using (sender_id = auth.uid() and status = 'pending');

-- messages --------------------------------------------------------------------
create policy "messages: read in own matches"
  on public.messages for select to authenticated
  using (public.is_match_participant(match_id));

create policy "messages: send in own matches"
  on public.messages for insert to authenticated
  with check (sender_id = auth.uid() and public.is_match_participant(match_id));

-- -----------------------------------------------------------------------------
-- Privileges: nothing for anon, column-scoped writes for authenticated.
-- -----------------------------------------------------------------------------
revoke all on public.profiles, public.projects, public.passes, public.match_requests, public.messages
  from anon, authenticated;

grant select on public.profiles to authenticated;
grant insert (id) on public.profiles to authenticated;
grant update (full_name, headline, bio, roles, interests, skills, location, availability, commitment, onboarded)
  on public.profiles to authenticated;

grant select, delete on public.projects to authenticated;
grant insert (owner_id, title, tagline, problem, solution, industry, stage, roles_needed, traction, location, visibility)
  on public.projects to authenticated;
grant update (title, tagline, problem, solution, industry, stage, roles_needed, traction, location, visibility)
  on public.projects to authenticated;

grant select, insert (project_id), delete on public.passes to authenticated;

grant select, delete on public.match_requests to authenticated;
grant insert (project_id, note) on public.match_requests to authenticated;
grant update (status) on public.match_requests to authenticated;

grant select on public.messages to authenticated;
grant insert (match_id, body) on public.messages to authenticated;

revoke all on function public.discover_projects(text, text, text, text, integer, integer) from public, anon;
grant execute on function public.discover_projects(text, text, text, text, integer, integer) to authenticated;

revoke all on function public.is_project_owner(uuid)       from public, anon;
revoke all on function public.has_accepted_match(uuid)     from public, anon;
revoke all on function public.is_match_participant(uuid)   from public, anon;
revoke all on function public.shares_request_with(uuid)    from public, anon;
grant execute on function public.is_project_owner(uuid)     to authenticated;
grant execute on function public.has_accepted_match(uuid)   to authenticated;
grant execute on function public.is_match_participant(uuid) to authenticated;
grant execute on function public.shares_request_with(uuid)  to authenticated;

revoke all on function public.handle_new_user()               from public, anon, authenticated;
revoke all on function public.match_requests_before_insert()  from public, anon, authenticated;

-- -----------------------------------------------------------------------------
-- Realtime for chat (no-op where the publication does not exist)
-- -----------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.messages;
  end if;
end;
$$;
