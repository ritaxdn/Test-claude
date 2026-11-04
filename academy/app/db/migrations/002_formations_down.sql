-- Retour arrière du lot 1 (002_formations.sql). À n'utiliser qu'après une sauvegarde :
-- supprime les commandes et les accès aux formations (leur trace reste dans audit_log).
-- La règle machines n'en dépend pas : les parcours « technologie » restent ouverts comme avant.
begin;
drop trigger if exists programs_access_audit on programs;
drop trigger if exists users_qualification_audit on users;
drop trigger if exists users_qualification_guard on users;
drop table if exists access_grants;
drop table if exists orders;
drop function if exists lift_audit();
drop function if exists lift_grants_guard();
drop function if exists lift_orders_guard();
drop function if exists lift_orders_after();
drop function if exists lift_orders_no_delete();
drop function if exists lift_users_qualification_guard();
drop function if exists lift_is_admin(uuid);
alter table users drop constraint if exists users_qualification_ok;
alter table users drop column if exists qualification_note, drop column if exists qualification_checked_at,
  drop column if exists qualification_checked_by, drop column if exists qualification_status,
  drop column if exists country, drop column if exists professional_id, drop column if exists profession;
alter table programs drop constraint if exists programs_kind_rules, drop constraint if exists programs_kind_ok, drop constraint if exists programs_access_months_ok;
alter table programs drop column if exists access_months, drop column if exists eligible_professions, drop column if exists kind;
commit;
