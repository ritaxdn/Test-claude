-- LIFT — lot 2 : parcours commercial minimum (catalogue public, demandes d'inscription,
-- justificatifs, référence de paiement). Additive et rejouable. Retour arrière : 004_parcours_commercial_down.sql.
-- Voir docs/08-lot2-parcours-commercial.md.
begin;

-- ── 1. Fiche commerciale d'une formation ──
alter table programs add column if not exists listed boolean not null default false;   -- visible au catalogue public
alter table programs add column if not exists tagline text;
alter table programs add column if not exists objectives text[] not null default '{}';
alter table programs add column if not exists audience text;
alter table programs add column if not exists prerequisites text;
alter table programs add column if not exists price_mad numeric(12,2);
alter table programs add column if not exists price_eur numeric(12,2);
alter table programs add column if not exists price_usd numeric(12,2);
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'programs_commercial_ok') then
    alter table programs add constraint programs_commercial_ok check (
      (not listed or (kind = 'training' and published))
      and (price_mad is null or price_mad >= 0) and (price_eur is null or price_eur >= 0) and (price_usd is null or price_usd >= 0)
      and (tagline is null or char_length(tagline) <= 200)
      and (audience is null or char_length(audience) <= 1000)
      and (prerequisites is null or char_length(prerequisites) <= 1000)
      and cardinality(objectives) <= 12
    );
  end if;
end $$;

-- ── 2. Référence de paiement unique, à rappeler sur le virement ──
create sequence if not exists order_reference_seq;
alter table orders add column if not exists payment_reference text;
create unique index if not exists orders_payment_reference on orders (payment_reference) where payment_reference is not null;
create or replace function lift_orders_reference() returns trigger language plpgsql as $$
begin
  if tg_op = 'UPDATE' then
    if new.payment_reference is distinct from old.payment_reference then raise exception 'La référence de paiement ne se modifie pas.'; end if;
    return new;
  end if;
  if new.payment_reference is null then
    new.payment_reference := 'LIFT-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('order_reference_seq')::text, 6, '0');
  end if;
  return new;
end $$;
drop trigger if exists orders_reference on orders;
create trigger orders_reference before insert or update on orders for each row execute function lift_orders_reference();

-- ── 3. Demandes d'inscription (formulaire public) ──
create table if not exists enrollment_requests (
  id               uuid primary key default gen_random_uuid(),
  program_id       uuid not null references programs on delete restrict,
  full_name        text not null check (char_length(full_name) between 2 and 200),
  email            citext not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 200),
  phone            text check (char_length(phone) <= 40),
  country          text not null check (country ~ '^[A-Z]{2}$'),
  profession       text not null check (profession ~ '^[a-z_]{2,40}$'),
  professional_id  text check (char_length(professional_id) <= 100),
  message          text check (char_length(message) <= 1000),
  terms_version    text not null,
  consent_at       timestamptz not null default now(),
  status           text not null default 'new' check (status in ('new', 'approved', 'rejected', 'cancelled')),
  reviewed_by      uuid references users,
  reviewed_at      timestamptz,
  reject_reason    text check (char_length(reject_reason) <= 500),
  user_id          uuid references users on delete restrict,
  order_id         uuid references orders on delete restrict,
  ip_hash          text,
  created_at       timestamptz not null default now(),
  check (status = 'new' or (reviewed_by is not null and reviewed_at is not null)),
  check (status <> 'rejected' or char_length(coalesce(reject_reason, '')) >= 3),
  check (status <> 'approved' or (user_id is not null and order_id is not null))
);
create index if not exists enrollment_requests_status on enrollment_requests (status, created_at desc);
create index if not exists enrollment_requests_email on enrollment_requests (email);
create index if not exists enrollment_requests_ip on enrollment_requests (ip_hash, created_at);

-- Accepter ou refuser une demande = décider de la qualification : vérificateur habilité uniquement.
create or replace function lift_requests_guard() returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    if new.status <> 'new' then raise exception 'Une demande est créée « nouvelle ».'; end if;
    if not exists (select 1 from programs where id = new.program_id and kind = 'training' and listed and published) then
      raise exception 'Cette formation n''est pas ouverte aux inscriptions.';
    end if;
    if not exists (select 1 from programs where id = new.program_id and new.profession = any (eligible_professions)) then
      raise exception 'Profession non autorisée pour cette formation.';
    end if;
    return new;
  end if;
  if new.status is distinct from old.status then
    if old.status <> 'new' then raise exception 'Une demande traitée ne change plus de statut.'; end if;
    if new.status in ('approved', 'rejected') and not lift_can_verify(new.reviewed_by) then
      raise exception 'Accepter ou refuser une demande : vérificateur habilité uniquement.';
    end if;
    if new.status = 'cancelled' and not lift_is_admin(new.reviewed_by) then
      raise exception 'Annulation par un administrateur actif uniquement.';
    end if;
  end if;
  if (new.program_id, new.full_name, new.email, new.country, new.profession, new.professional_id, new.terms_version, new.consent_at, new.created_at)
     is distinct from (old.program_id, old.full_name, old.email, old.country, old.profession, old.professional_id, old.terms_version, old.consent_at, old.created_at) then
    raise exception 'Les informations d''une demande ne se modifient pas.';
  end if;
  return new;
end $$;
drop trigger if exists requests_guard on enrollment_requests;
create trigger requests_guard before insert or update on enrollment_requests for each row execute function lift_requests_guard();
create or replace function lift_no_delete() returns trigger language plpgsql as $$
begin raise exception 'Suppression interdite : % se conserve (traçabilité).', tg_table_name; end $$;
drop trigger if exists requests_no_delete on enrollment_requests;
create trigger requests_no_delete before delete on enrollment_requests for each row execute function lift_no_delete();

-- ── 4. Justificatifs professionnels (fichier privé, supprimé 30 jours après la décision) ──
create table if not exists qualification_documents (
  id           uuid primary key default gen_random_uuid(),
  request_id   uuid not null references enrollment_requests on delete restrict,
  storage_key  text not null,
  mime_type    text not null check (mime_type in ('application/pdf', 'image/jpeg', 'image/png')),
  size_bytes   int not null check (size_bytes between 1 and 5242880),
  sha256       text not null,
  uploaded_at  timestamptz not null default now(),
  purge_after  timestamptz,                         -- fixé à la décision : décision + 30 jours
  purged_at    timestamptz,
  purged_by    uuid references users,
  purge_reason text
);
create index if not exists qualification_documents_purge on qualification_documents (purge_after) where purged_at is null;
drop trigger if exists qualification_documents_no_delete on qualification_documents;
create trigger qualification_documents_no_delete before delete on qualification_documents for each row execute function lift_no_delete();

-- ── 5. Journal ──
drop trigger if exists requests_audit on enrollment_requests;
create trigger requests_audit after insert or update on enrollment_requests for each row execute function lift_audit();
drop trigger if exists qualification_documents_audit on qualification_documents;
create trigger qualification_documents_audit after insert or update on qualification_documents for each row execute function lift_audit();
drop trigger if exists programs_access_audit on programs;
create trigger programs_access_audit after update of kind, eligible_professions, access_months, published, device_model_id, listed, price_mad, price_eur, price_usd on programs
  for each row execute function lift_audit();

-- ── 6. API Supabase fermée ──
alter table enrollment_requests enable row level security;
alter table qualification_documents enable row level security;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on enrollment_requests, qualification_documents from anon, authenticated;
    revoke all on sequence order_reference_seq from anon, authenticated;
  end if;
end $$;

commit;
