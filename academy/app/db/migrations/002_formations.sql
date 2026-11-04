-- LIFT — lot 1 : espace « Formations » (accès acheté ou offert) à côté de « Mes technologies ».
-- Migration ADDITIVE et rejouable (aucune donnée existante modifiée, sauf la valeur par défaut
-- kind = 'technology' sur les parcours existants). Retour arrière : 002_formations_down.sql.
-- Voir docs/07-formations-et-acces.md.

begin;

-- ── 0. Contrôle préalable : un parcours technologie publié doit avoir une machine ──
do $$
declare n int;
begin
  select count(*) into n from programs where published and device_model_id is null;
  if n > 0 then
    raise exception 'Migration arrêtée : % parcours publié(s) sans machine. Les rattacher à une machine ou les dépublier avant de migrer.', n;
  end if;
end $$;

-- ── 1. Parcours : type et professions autorisées ──
alter table programs add column if not exists kind text not null default 'technology';
alter table programs add column if not exists eligible_professions text[] not null default '{}';
alter table programs add column if not exists access_months int;   -- durée d'accès d'un achat (null = non définie)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'programs_kind_ok') then
    alter table programs add constraint programs_kind_ok check (kind in ('technology', 'training'));
  end if;
  -- Technologie : une machine dès qu'il est publié. Formation : jamais de machine, au moins une profession.
  if not exists (select 1 from pg_constraint where conname = 'programs_kind_rules') then
    alter table programs add constraint programs_kind_rules check (
      (kind = 'technology' and (device_model_id is not null or not published))
      or (kind = 'training' and device_model_id is null and (cardinality(eligible_professions) > 0 or not published))
    );
  end if;
  if not exists (select 1 from pg_constraint where conname = 'programs_access_months_ok') then
    alter table programs add constraint programs_access_months_ok check (access_months is null or access_months between 1 and 120);
  end if;
end $$;

-- ── 2. Comptes : profession et vérification de la qualification ──
alter table users add column if not exists profession text;
alter table users add column if not exists professional_id text;
alter table users add column if not exists country text;
alter table users add column if not exists qualification_status text not null default 'none';
alter table users add column if not exists qualification_checked_by uuid references users;
alter table users add column if not exists qualification_checked_at timestamptz;
alter table users add column if not exists qualification_note text;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'users_qualification_ok') then
    alter table users add constraint users_qualification_ok check (
      qualification_status in ('none', 'pending', 'verified', 'rejected')
      and (profession is null or profession ~ '^[a-z_]{2,40}$')
      and (country is null or country ~ '^[A-Z]{2}$')
      and (professional_id is null or char_length(professional_id) <= 100)
      and (qualification_note is null or char_length(qualification_note) <= 1000)
      -- « vérifiée » ou « refusée » : toujours une profession, un vérificateur et une date.
      and (qualification_status not in ('verified', 'rejected')
           or (profession is not null and qualification_checked_by is not null and qualification_checked_at is not null))
    );
  end if;
end $$;

-- ── 3. Commandes (paiement manuel) ──
create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references users on delete restrict,
  program_id       uuid not null references programs on delete restrict,
  currency         text not null check (currency in ('MAD', 'EUR', 'USD')),
  amount           numeric(12,2) not null check (amount >= 0),
  method           text not null check (method in ('virement', 'cheque', 'especes', 'carte', 'autre')),
  reference        text check (char_length(reference) <= 200),
  status           text not null default 'pending' check (status in ('pending', 'paid', 'cancelled', 'refunded')),
  note             text check (char_length(note) <= 1000),
  created_by       uuid not null references users,
  created_at       timestamptz not null default now(),
  paid_checked_by  uuid references users,
  paid_checked_at  timestamptz,
  closed_by        uuid references users,            -- annulation ou remboursement
  closed_at        timestamptz,
  close_reason     text check (char_length(close_reason) <= 500),
  -- Payée ou remboursée : paiement vérifié par quelqu'un, avec une référence.
  check (status not in ('paid', 'refunded') or (paid_checked_by is not null and paid_checked_at is not null and char_length(coalesce(reference, '')) >= 3)),
  check (status not in ('cancelled', 'refunded') or (closed_by is not null and closed_at is not null and char_length(coalesce(close_reason, '')) >= 3))
);
create index if not exists orders_user on orders (user_id);

-- ── 4. Accès aux formations ──
create table if not exists access_grants (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references users on delete restrict,
  program_id     uuid not null references programs on delete restrict,
  source         text not null check (source in ('purchase', 'offered')),
  order_id       uuid references orders on delete restrict,
  reason         text check (char_length(reason) <= 500),
  granted_by     uuid not null references users,
  granted_at     timestamptz not null default now(),
  expires_at     timestamptz,
  revoked_at     timestamptz,
  revoked_by     uuid references users,
  revoke_reason  text check (char_length(revoke_reason) <= 500),
  check ((source = 'purchase') = (order_id is not null)),
  check (source <> 'offered' or char_length(coalesce(reason, '')) >= 3),
  check (revoked_at is null or (revoked_by is not null and char_length(coalesce(revoke_reason, '')) >= 3)),
  check (expires_at is null or expires_at > granted_at)
);
create unique index if not exists access_grants_one_active on access_grants (user_id, program_id) where revoked_at is null;
create unique index if not exists access_grants_one_per_order on access_grants (order_id) where order_id is not null;
create index if not exists access_grants_user on access_grants (user_id) where revoked_at is null;

-- ── 5. Garde-fous en base (valables quel que soit le code qui écrit) ──
create or replace function lift_is_admin(uid uuid) returns boolean language sql stable as $$
  select exists (select 1 from users where id = uid and role = 'admin' and status = 'active');
$$;

create or replace function lift_orders_guard() returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    if new.status <> 'pending' then raise exception 'Une commande est créée « en attente », puis validée.'; end if;
    if not lift_is_admin(new.created_by) then raise exception 'Seul un administrateur actif crée une commande.'; end if;
    if not exists (select 1 from programs where id = new.program_id and kind = 'training') then
      raise exception 'Une commande ne porte que sur une formation.';
    end if;
    return new;
  end if;
  -- Données de la commande figées après création (sauf la note tant qu'elle est en attente).
  if (new.user_id, new.program_id, new.currency, new.amount, new.method, new.created_by, new.created_at)
     is distinct from (old.user_id, old.program_id, old.currency, old.amount, old.method, old.created_by, old.created_at) then
    raise exception 'Une commande ne se modifie pas : l''annuler et en créer une autre.';
  end if;
  if new.status is distinct from old.status then
    if not ((old.status = 'pending' and new.status in ('paid', 'cancelled')) or (old.status = 'paid' and new.status = 'refunded')) then
      raise exception 'Changement de statut interdit : % → %.', old.status, new.status;
    end if;
    if new.status = 'paid' and not lift_is_admin(new.paid_checked_by) then raise exception 'Le paiement doit être vérifié par un administrateur actif.'; end if;
    if new.status in ('cancelled', 'refunded') and not lift_is_admin(new.closed_by) then raise exception 'Annulation ou remboursement par un administrateur actif uniquement.'; end if;
  end if;
  if old.status <> 'pending' and (new.paid_checked_by, new.paid_checked_at, new.reference) is distinct from (old.paid_checked_by, old.paid_checked_at, old.reference) then
    raise exception 'La vérification du paiement ne se modifie pas.';
  end if;
  return new;
end $$;
drop trigger if exists orders_guard on orders;
create trigger orders_guard before insert or update on orders for each row execute function lift_orders_guard();

-- Remboursement intégral confirmé → l'accès acheté lié est révoqué (tracé). Exception éventuelle :
-- un administrateur offre ensuite un accès, avec motif, lui aussi tracé.
create or replace function lift_orders_after() returns trigger language plpgsql as $$
begin
  if new.status = 'refunded' and old.status = 'paid' then
    update access_grants set revoked_at = now(), revoked_by = new.closed_by, revoke_reason = 'Remboursement intégral confirmé : ' || new.close_reason
     where order_id = new.id and revoked_at is null;
  end if;
  return null;
end $$;
drop trigger if exists orders_after on orders;
create trigger orders_after after update on orders for each row execute function lift_orders_after();

create or replace function lift_grants_guard() returns trigger language plpgsql as $$
declare o orders;
begin
  if tg_op = 'DELETE' then raise exception 'Un accès ne se supprime pas : il se révoque.'; end if;
  if tg_op = 'INSERT' then
    if new.revoked_at is not null then raise exception 'Un accès est créé actif.'; end if;
    if not lift_is_admin(new.granted_by) then raise exception 'Seul un administrateur actif accorde un accès.'; end if;
    if not exists (select 1 from programs where id = new.program_id and kind = 'training') then
      raise exception 'Un accès acheté ou offert ne porte que sur une formation (jamais sur un parcours technologie).';
    end if;
    if new.source = 'purchase' then
      select * into o from orders where id = new.order_id;
      if o.status is distinct from 'paid' then raise exception 'Accès refusé : la commande n''est pas payée (statut %).', coalesce(o.status, 'inconnu'); end if;
      if o.user_id <> new.user_id or o.program_id <> new.program_id then raise exception 'La commande ne correspond pas à ce compte ou à cette formation.'; end if;
    end if;
    return new;
  end if;
  -- Seule modification permise : la révocation (définitive). Un nouvel accès = une nouvelle ligne.
  if old.revoked_at is not null then raise exception 'Un accès révoqué ne se rouvre pas : en accorder un nouveau.'; end if;
  if (new.user_id, new.program_id, new.source, new.order_id, new.reason, new.granted_by, new.granted_at, new.expires_at)
     is distinct from (old.user_id, old.program_id, old.source, old.order_id, old.reason, old.granted_by, old.granted_at, old.expires_at) then
    raise exception 'Un accès ne se modifie pas : le révoquer et en accorder un nouveau.';
  end if;
  if new.revoked_at is not null and not lift_is_admin(new.revoked_by) then raise exception 'Révocation par un administrateur actif uniquement.'; end if;
  return new;
end $$;
drop trigger if exists grants_guard on access_grants;
create trigger grants_guard before insert or update or delete on access_grants for each row execute function lift_grants_guard();

create or replace function lift_orders_no_delete() returns trigger language plpgsql as $$
begin raise exception 'Une commande ne se supprime pas : elle s''annule.'; end $$;
drop trigger if exists orders_no_delete on orders;
create trigger orders_no_delete before delete on orders for each row execute function lift_orders_no_delete();

-- Qualification : « vérifiée » ou « refusée » seulement par un administrateur actif.
create or replace function lift_users_qualification_guard() returns trigger language plpgsql as $$
begin
  if new.qualification_status in ('verified', 'rejected')
     and (tg_op = 'INSERT' or (new.qualification_status, new.qualification_checked_by, new.profession)
                              is distinct from (old.qualification_status, old.qualification_checked_by, old.profession))
     and not lift_is_admin(new.qualification_checked_by) then
    raise exception 'La qualification doit être vérifiée par un administrateur actif.';
  end if;
  -- Changer de profession remet la vérification à zéro.
  if tg_op = 'UPDATE' and new.profession is distinct from old.profession and new.qualification_status = old.qualification_status
     and old.qualification_status = 'verified' then
    new.qualification_status := 'pending'; new.qualification_checked_by := null; new.qualification_checked_at := null;
  end if;
  return new;
end $$;
drop trigger if exists users_qualification_guard on users;
create trigger users_qualification_guard before insert or update of qualification_status, qualification_checked_by, profession on users
  for each row execute function lift_users_qualification_guard();

-- ── 6. Traçabilité : chaque changement écrit dans audit_log, avec l'auteur transmis par l'app ──
-- L'application ouvre une transaction et appelle : select set_config('app.actor_id', '<uuid admin>', true)
create or replace function lift_audit() returns trigger language plpgsql as $$
declare
  actor uuid := nullif(current_setting('app.actor_id', true), '')::uuid;
  before jsonb; after jsonb;
  keys text[] := case tg_table_name
    when 'users' then array['profession', 'professional_id', 'country', 'qualification_status', 'qualification_checked_by', 'qualification_checked_at', 'qualification_note']
    else null end;
begin
  before := case when tg_op = 'INSERT' then null else to_jsonb(old) end;
  after  := to_jsonb(new);
  if keys is not null then   -- comptes : uniquement les champs de qualification (jamais le mot de passe)
    before := (select jsonb_object_agg(k, before -> k) from unnest(keys) k);
    after  := (select jsonb_object_agg(k, after -> k) from unnest(keys) k);
    if before is not distinct from after then return null; end if;
  end if;
  insert into audit_log (actor_id, action, target, details)
  values (actor, tg_table_name || '.' || lower(tg_op), new.id::text, jsonb_build_object('before', before, 'after', after));
  return null;
end $$;
drop trigger if exists orders_audit on orders;
create trigger orders_audit after insert or update on orders for each row execute function lift_audit();
drop trigger if exists grants_audit on access_grants;
create trigger grants_audit after insert or update on access_grants for each row execute function lift_audit();
drop trigger if exists users_qualification_audit on users;
create trigger users_qualification_audit after insert or update of profession, professional_id, country, qualification_status, qualification_checked_by, qualification_checked_at, qualification_note on users
  for each row execute function lift_audit();
-- Les changements de type ou de professions d'un parcours sont aussi tracés.
drop trigger if exists programs_access_audit on programs;
create trigger programs_access_audit after update of kind, eligible_professions, access_months, published, device_model_id on programs
  for each row execute function lift_audit();

-- ── 7. API Supabase fermée sur les nouvelles tables (RLS sans politique pour anon / authenticated) ──
alter table orders enable row level security;
alter table access_grants enable row level security;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on orders, access_grants from anon, authenticated;
    revoke execute on function lift_is_admin(uuid) from anon, authenticated, public;
  end if;
end $$;

commit;
