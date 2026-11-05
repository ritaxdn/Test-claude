-- Retour arrière de 006.
begin;
drop trigger if exists grants_four_eyes on access_grants;
drop function if exists lift_grants_four_eyes();
drop trigger if exists orders_four_eyes on orders;
drop function if exists lift_orders_four_eyes();
drop function if exists lift_four_eyes();
drop table if exists lift_settings;
drop function if exists lift_settings_audit();
commit;
