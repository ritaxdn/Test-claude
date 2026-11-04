-- Retour arrière de 003 : revient à la règle du lot 1 (tout administrateur actif vérifie).
begin;
create or replace function lift_users_qualification_guard() returns trigger language plpgsql as $$
begin
  if new.qualification_status in ('verified', 'rejected')
     and (tg_op = 'INSERT' or (new.qualification_status, new.qualification_checked_by, new.profession)
                              is distinct from (old.qualification_status, old.qualification_checked_by, old.profession))
     and not lift_is_admin(new.qualification_checked_by) then
    raise exception 'La qualification doit être vérifiée par un administrateur actif.';
  end if;
  if tg_op = 'UPDATE' and new.profession is distinct from old.profession and new.qualification_status = old.qualification_status
     and old.qualification_status = 'verified' then
    new.qualification_status := 'pending'; new.qualification_checked_by := null; new.qualification_checked_at := null;
  end if;
  return new;
end $$;
drop trigger if exists users_qualification_guard on users;
create trigger users_qualification_guard before insert or update of qualification_status, qualification_checked_by, profession on users
  for each row execute function lift_users_qualification_guard();
drop trigger if exists users_qualification_audit on users;
create trigger users_qualification_audit after insert or update of profession, professional_id, country, qualification_status, qualification_checked_by, qualification_checked_at, qualification_note on users
  for each row execute function lift_audit();
drop function if exists lift_can_verify(uuid);
alter table users drop column if exists can_verify_qualifications;
commit;
