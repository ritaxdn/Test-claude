-- LIFT — séparation des tâches (« quatre yeux ») sur ce qui ouvre un accès payant sans paiement en ligne.
-- 1. Valider un paiement : une autre personne que celle qui a créé la commande (= qui a accepté la demande).
-- 2. Offrir un accès : une autre personne que celle qui a vérifié la qualification du professionnel.
-- Réglage : actif par défaut ; modifiable seulement par le compte propriétaire de la base (jamais par l'app),
-- chaque changement étant journalisé. Additive et rejouable. Retour arrière : 006_separation_taches_down.sql.
begin;

create table if not exists lift_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);
insert into lift_settings (key, value) values ('separation_of_duties', 'on') on conflict (key) do nothing;
alter table lift_settings enable row level security;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then revoke all on lift_settings from anon, authenticated; end if;
  if exists (select 1 from pg_roles where rolname = 'academy_app') then
    revoke all on lift_settings from academy_app;
    grant select on lift_settings to academy_app;            -- lecture seule pour l'application
    drop policy if exists academy_app_read on lift_settings;
    create policy academy_app_read on lift_settings for select to academy_app using (true);
  end if;
end $$;

create or replace function lift_four_eyes() returns boolean language sql stable as $$
  select coalesce((select value = 'on' from lift_settings where key = 'separation_of_duties'), true);
$$;

-- Journal du réglage (qui l'a changé, quand)
create or replace function lift_settings_audit() returns trigger language plpgsql as $$
begin
  insert into audit_log (actor_id, action, target, details)
  values (null, 'lift_settings.' || lower(tg_op), new.key, jsonb_build_object('before', case when tg_op = 'UPDATE' then old.value end, 'after', new.value, 'db_user', current_user));
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists lift_settings_audit on lift_settings;
create trigger lift_settings_audit before insert or update on lift_settings for each row execute function lift_settings_audit();

-- 1. Paiement
create or replace function lift_orders_four_eyes() returns trigger language plpgsql as $$
begin
  if new.status = 'paid' and old.status = 'pending' and lift_four_eyes() and new.paid_checked_by = new.created_by then
    raise exception 'Séparation des tâches : le paiement doit être validé par une autre personne que celle qui a accepté la demande.';
  end if;
  return new;
end $$;
drop trigger if exists orders_four_eyes on orders;
create trigger orders_four_eyes before update on orders for each row execute function lift_orders_four_eyes();

-- 2. Accès offert
create or replace function lift_grants_four_eyes() returns trigger language plpgsql as $$
begin
  if new.source = 'offered' and lift_four_eyes()
     and exists (select 1 from users where id = new.user_id and qualification_checked_by = new.granted_by) then
    raise exception 'Séparation des tâches : un accès offert est accordé par une autre personne que celle qui a vérifié la qualification.';
  end if;
  return new;
end $$;
drop trigger if exists grants_four_eyes on access_grants;
create trigger grants_four_eyes before insert on access_grants for each row execute function lift_grants_four_eyes();

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke execute on function lift_four_eyes() from anon, authenticated, public;
  end if;
  if exists (select 1 from pg_roles where rolname = 'academy_app') then
    grant execute on function lift_four_eyes() to academy_app;
  end if;
end $$;

commit;
