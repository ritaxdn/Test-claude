-- Retour arrière de 004 (après sauvegarde) : supprime demandes et justificatifs (trace dans audit_log).
-- Penser à supprimer aussi les fichiers du compartiment des justificatifs.
begin;
drop table if exists qualification_documents;
drop table if exists enrollment_requests;
drop function if exists lift_requests_guard();
drop function if exists lift_no_delete();
drop trigger if exists orders_reference on orders;
drop function if exists lift_orders_reference();
drop index if exists orders_payment_reference;
alter table orders drop column if exists payment_reference;
drop sequence if exists order_reference_seq;
drop trigger if exists programs_access_audit on programs;
create trigger programs_access_audit after update of kind, eligible_professions, access_months, published, device_model_id on programs
  for each row execute function lift_audit();
alter table programs drop constraint if exists programs_commercial_ok;
alter table programs drop column if exists listed, drop column if exists tagline, drop column if exists objectives,
  drop column if exists audience, drop column if exists prerequisites,
  drop column if exists price_mad, drop column if exists price_eur, drop column if exists price_usd;
commit;
