-- LIFT — droit distinct pour vérifier les qualifications professionnelles (préparation lot 2).
-- Additive et rejouable. Retour arrière : 003_verificateurs_down.sql.
begin;

alter table users add column if not exists can_verify_qualifications boolean not null default false;

-- Vérificateur habilité = administrateur actif ET droit « vérification des qualifications ».
create or replace function lift_can_verify(uid uuid) returns boolean language sql stable as $$
  select exists (select 1 from users where id = uid and role = 'admin' and status = 'active' and can_verify_qualifications);
$$;

create or replace function lift_users_qualification_guard() returns trigger language plpgsql as $$
declare actor uuid := nullif(current_setting('app.actor_id', true), '')::uuid;
begin
  -- « vérifiée » ou « refusée » : seulement par un vérificateur habilité, jamais sur son propre compte.
  if new.qualification_status in ('verified', 'rejected')
     and (tg_op = 'INSERT' or (new.qualification_status, new.qualification_checked_by, new.profession)
                              is distinct from (old.qualification_status, old.qualification_checked_by, old.profession)) then
    if not lift_can_verify(new.qualification_checked_by) then
      raise exception 'La qualification doit être vérifiée par un administrateur actif habilité à vérifier les qualifications.';
    end if;
    if new.qualification_checked_by = new.id then raise exception 'On ne vérifie pas sa propre qualification.'; end if;
  end if;
  -- Changer de profession remet la vérification à zéro.
  if tg_op = 'UPDATE' and new.profession is distinct from old.profession and new.qualification_status = old.qualification_status
     and old.qualification_status = 'verified' then
    new.qualification_status := 'pending'; new.qualification_checked_by := null; new.qualification_checked_at := null;
  end if;
  -- Le droit de vérifier s'accorde par un autre administrateur actif (pas à soi-même), depuis l'application.
  -- Le compte propriétaire de la base (migrations, premier vérificateur) n'est pas soumis à cette règle.
  if tg_op = 'UPDATE' and new.can_verify_qualifications is distinct from old.can_verify_qualifications and current_user = 'academy_app' then
    if actor is null or not lift_is_admin(actor) then raise exception 'Le droit de vérification s''accorde par un administrateur actif.'; end if;
    if actor = new.id then raise exception 'On ne s''accorde pas soi-même le droit de vérification.'; end if;
  end if;
  if tg_op = 'INSERT' and new.can_verify_qualifications and current_user = 'academy_app' then
    raise exception 'Un compte est créé sans droit de vérification ; il s''accorde ensuite.';
  end if;
  return new;
end $$;
drop trigger if exists users_qualification_guard on users;
create trigger users_qualification_guard before insert or update of qualification_status, qualification_checked_by, profession, can_verify_qualifications on users
  for each row execute function lift_users_qualification_guard();

-- Journal : le droit de vérification est tracé avec les champs de qualification.
create or replace function lift_audit() returns trigger language plpgsql as $$
declare
  actor uuid := nullif(current_setting('app.actor_id', true), '')::uuid;
  before jsonb; after jsonb;
  keys text[] := case tg_table_name
    when 'users' then array['profession', 'professional_id', 'country', 'qualification_status', 'qualification_checked_by', 'qualification_checked_at', 'qualification_note', 'can_verify_qualifications']
    else null end;
begin
  before := case when tg_op = 'INSERT' then null else to_jsonb(old) end;
  after  := to_jsonb(new);
  if keys is not null then
    before := (select jsonb_object_agg(k, before -> k) from unnest(keys) k);
    after  := (select jsonb_object_agg(k, after -> k) from unnest(keys) k);
    if before is not distinct from after then return null; end if;
  end if;
  insert into audit_log (actor_id, action, target, details)
  values (actor, tg_table_name || '.' || lower(tg_op), new.id::text, jsonb_build_object('before', before, 'after', after));
  return null;
end $$;
drop trigger if exists users_qualification_audit on users;
create trigger users_qualification_audit after insert or update of profession, professional_id, country, qualification_status, qualification_checked_by, qualification_checked_at, qualification_note, can_verify_qualifications on users
  for each row execute function lift_audit();

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke execute on function lift_can_verify(uuid) from anon, authenticated, public;
  end if;
  if exists (select 1 from pg_roles where rolname = 'academy_app') then
    grant execute on function lift_can_verify(uuid) to academy_app;
  end if;
end $$;

commit;
