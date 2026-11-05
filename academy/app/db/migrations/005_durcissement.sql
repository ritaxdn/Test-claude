-- LIFT — durcissement après la revue de sécurité du lot 2 (docs/09). Additive et rejouable.
-- Retour arrière : 005_durcissement_down.sql.
begin;

-- ── 1. Demandes : adresse e-mail confirmée avant toute décision ; consentement commercial distinct ──
alter table enrollment_requests add column if not exists email_confirmed_at timestamptz;
alter table enrollment_requests add column if not exists confirm_token_hash text;
alter table enrollment_requests add column if not exists confirm_expires_at timestamptz;
alter table enrollment_requests add column if not exists marketing_consent_at timestamptz;   -- case non cochée par défaut
create unique index if not exists enrollment_requests_confirm_token on enrollment_requests (confirm_token_hash) where confirm_token_hash is not null;

create or replace function lift_requests_guard() returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    if new.status <> 'new' then raise exception 'Une demande est créée « nouvelle ».'; end if;
    if new.email_confirmed_at is not null then raise exception 'L''adresse e-mail se confirme après l''envoi de la demande.'; end if;
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
    if new.status = 'approved' and new.email_confirmed_at is null then
      raise exception 'Adresse e-mail non confirmée : la demande ne peut pas être acceptée.';
    end if;
    if new.status in ('approved', 'rejected') and not lift_can_verify(new.reviewed_by) then
      raise exception 'Accepter ou refuser une demande : vérificateur habilité uniquement.';
    end if;
    if new.status = 'cancelled' and not lift_is_admin(new.reviewed_by) then
      raise exception 'Annulation par un administrateur actif uniquement.';
    end if;
  end if;
  if old.email_confirmed_at is not null and new.email_confirmed_at is distinct from old.email_confirmed_at then
    raise exception 'La confirmation de l''adresse e-mail ne se modifie pas.';
  end if;
  if (new.program_id, new.full_name, new.email, new.country, new.profession, new.professional_id, new.terms_version, new.consent_at, new.created_at, new.marketing_consent_at)
     is distinct from (old.program_id, old.full_name, old.email, old.country, old.profession, old.professional_id, old.terms_version, old.consent_at, old.created_at, old.marketing_consent_at) then
    raise exception 'Les informations d''une demande ne se modifient pas.';
  end if;
  return new;
end $$;

-- ── 2. Paiement : un même virement ne valide jamais deux commandes ──
do $$
begin
  if exists (select regexp_replace(upper(reference), '[^A-Z0-9]', '', 'g') from orders where status in ('paid', 'refunded') and reference is not null group by 1 having count(*) > 1) then
    raise exception 'Migration arrêtée : une même référence de virement valide plusieurs commandes. Vérifier ces commandes avant de migrer.';
  end if;
end $$;
-- Normalisée : « VIR 123 », « vir-123 » et « VIR123 » sont le même virement.
create unique index if not exists orders_bank_reference_once on orders (regexp_replace(upper(reference), '[^A-Z0-9]', '', 'g')) where status in ('paid', 'refunded') and reference is not null;
alter table orders add column if not exists amount_received numeric(12,2);
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'orders_amount_received_ok') then
    -- « Payée » : le montant reçu, saisi par la personne qui vérifie le virement, doit être le montant dû.
    alter table orders add constraint orders_amount_received_ok check (status not in ('paid', 'refunded') or amount_received is null or amount_received = amount) not valid;
  end if;
end $$;
create or replace function lift_orders_paid_amount() returns trigger language plpgsql as $$
begin
  if new.status = 'paid' and old.status = 'pending' then
    if new.amount_received is null then raise exception 'Indiquez le montant reçu sur le compte pour valider le paiement.'; end if;
    if new.amount_received <> new.amount then raise exception 'Montant reçu (%) différent du montant dû (%) : paiement non validé.', new.amount_received, new.amount; end if;
  end if;
  if old.status <> 'pending' and new.amount_received is distinct from old.amount_received then raise exception 'Le montant reçu ne se modifie pas.'; end if;
  return new;
end $$;
drop trigger if exists orders_paid_amount on orders;
create trigger orders_paid_amount before update on orders for each row execute function lift_orders_paid_amount();

-- ── 3. Justificatifs : jamais conservés sans échéance ──
-- Dépôt : suppression au plus tard 90 jours après, même si la demande n'est jamais traitée.
alter table qualification_documents alter column purge_after set default now() + interval '90 days';
update qualification_documents set purge_after = uploaded_at + interval '90 days' where purge_after is null and purged_at is null;

-- ── 4. Journal : minimisation des données personnelles ──
-- Les demandes sont journalisées sans e-mail, téléphone, message, n° d'Ordre ni empreinte d'IP
-- (ces données restent dans la demande elle-même, soumise à la politique de conservation).
create or replace function lift_audit() returns trigger language plpgsql as $$
declare
  actor uuid := nullif(current_setting('app.actor_id', true), '')::uuid;
  before jsonb; after jsonb;
  keys text[] := case tg_table_name
    when 'users' then array['profession', 'professional_id', 'country', 'qualification_status', 'qualification_checked_by', 'qualification_checked_at', 'qualification_note', 'can_verify_qualifications']
    when 'enrollment_requests' then array['program_id', 'status', 'reviewed_by', 'reviewed_at', 'reject_reason', 'user_id', 'order_id', 'email_confirmed_at', 'marketing_consent_at', 'created_at']
    when 'qualification_documents' then array['request_id', 'mime_type', 'size_bytes', 'uploaded_at', 'purge_after', 'purged_at', 'purged_by', 'purge_reason']
    else null end;
begin
  before := case when tg_op = 'INSERT' then null else to_jsonb(old) end;
  after  := to_jsonb(new);
  if keys is not null then
    before := case when before is null then null else (select jsonb_object_agg(k, before -> k) from unnest(keys) k) end;
    after  := (select jsonb_object_agg(k, after -> k) from unnest(keys) k);
    if before is not distinct from after then return null; end if;
  end if;
  insert into audit_log (actor_id, action, target, details)
  values (actor, tg_table_name || '.' || lower(tg_op), new.id::text, jsonb_build_object('before', before, 'after', after));
  return null;
end $$;
-- Les copies déjà journalisées (avant cette migration) sont réduites aux mêmes champs.
update audit_log a set details = jsonb_build_object(
    'before', case when a.details->'before' = 'null'::jsonb or a.details->'before' is null then null
                   else (select jsonb_object_agg(k, a.details->'before'->k) from unnest(array['program_id','status','reviewed_by','reviewed_at','reject_reason','user_id','order_id','created_at']) k) end,
    'after', (select jsonb_object_agg(k, a.details->'after'->k) from unnest(array['program_id','status','reviewed_by','reviewed_at','reject_reason','user_id','order_id','created_at']) k))
 where a.action like 'enrollment_requests.%' and a.details->'after' ? 'email';

commit;
