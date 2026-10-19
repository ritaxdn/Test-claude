-- Sécurité : (1) un superviseur ne peut plus se promouvoir admin ni toucher aux colonnes sensibles de l'équipe ;
-- (2) un compte n'est confirmé/rattaché que si l'accès du membre a été ouvert par l'admin (anti-usurpation d'email).
create or replace function private.garde_equipe() returns trigger language plpgsql set search_path = '' as $$
declare moi uuid := private.membre_courant();
begin
  if current_user not in ('authenticated', 'anon') or (select private.est_admin()) then
    return coalesce(new, old);
  end if;
  if tg_op = 'INSERT' then
    if new.role is distinct from 'commercial' or new.user_id is not null then
      raise exception 'Seul l''admin peut créer un superviseur ou un admin' using errcode = '42501';
    end if;
    new.acces_ouvert := false;
    return new;
  elsif tg_op = 'UPDATE' then
    if old.role = 'admin'
       or old.id is distinct from moi and not (old.id in (select private.perim()))
       or new.role is distinct from old.role or new.user_id is distinct from old.user_id
       or new.email is distinct from old.email or new.responsable_id is distinct from old.responsable_id
       or new.actif is distinct from old.actif or new.acces_ouvert is distinct from old.acces_ouvert then
      raise exception 'Modification réservée à l''admin (rôle, accès, email, rattachement, activation)' using errcode = '42501';
    end if;
    return new;
  else
    raise exception 'Suppression d''un membre réservée à l''admin' using errcode = '42501';
  end if;
end $$;
alter table public.equipe add column if not exists acces_ouvert boolean not null default false;
create trigger trg_garde_equipe before insert or update or delete on public.equipe for each row execute function private.garde_equipe();

create or replace function private.auto_confirmer_equipe() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.equipe e where lower(e.email) = lower(new.email) and e.actif and e.acces_ouvert and e.user_id is null) then
    new.email_confirmed_at := coalesce(new.email_confirmed_at, now());
  end if;
  return new;
end; $$;
create or replace function private.lier_membre_equipe() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.email_confirmed_at is not null then
    update public.equipe set user_id = new.id where lower(email) = lower(new.email) and user_id is null and acces_ouvert;
  end if;
  return new;
end; $$;
-- Accès ouverts pour le pilote : Sofia et Abdelhamid
update public.equipe set acces_ouvert = true where id in ('d048326b-cbe6-4146-8aab-a45f7529968c', 'dd66985f-7707-4505-bdb1-eaa244c6b8c0');
