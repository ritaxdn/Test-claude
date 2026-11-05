-- Retour arrière de 005 (le journal déjà minimisé n'est pas restauré : c'est voulu).
begin;
drop trigger if exists orders_paid_amount on orders;
drop function if exists lift_orders_paid_amount();
alter table orders drop constraint if exists orders_amount_received_ok;
alter table orders drop column if exists amount_received;
drop index if exists orders_bank_reference_once;
alter table qualification_documents alter column purge_after drop default;
drop index if exists enrollment_requests_confirm_token;
create or replace function lift_requests_guard() returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    if new.status <> 'new' then raise exception 'Une demande est créée « nouvelle ».'; end if;
    if not exists (select 1 from programs where id = new.program_id and kind = 'training' and listed and published) then raise exception 'Cette formation n''est pas ouverte aux inscriptions.'; end if;
    if not exists (select 1 from programs where id = new.program_id and new.profession = any (eligible_professions)) then raise exception 'Profession non autorisée pour cette formation.'; end if;
    return new;
  end if;
  if new.status is distinct from old.status then
    if old.status <> 'new' then raise exception 'Une demande traitée ne change plus de statut.'; end if;
    if new.status in ('approved', 'rejected') and not lift_can_verify(new.reviewed_by) then raise exception 'Accepter ou refuser une demande : vérificateur habilité uniquement.'; end if;
    if new.status = 'cancelled' and not lift_is_admin(new.reviewed_by) then raise exception 'Annulation par un administrateur actif uniquement.'; end if;
  end if;
  return new;
end $$;
alter table enrollment_requests drop column if exists marketing_consent_at, drop column if exists confirm_expires_at,
  drop column if exists confirm_token_hash, drop column if exists email_confirmed_at;
commit;
