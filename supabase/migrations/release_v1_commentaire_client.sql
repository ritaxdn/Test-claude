-- Un commentaire écrit dans une affaire est rattaché au client de l'affaire (visible depuis la fiche client).
create or replace function private.commentaire_client() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.compte_id is null and new.opportunite_id is not null then
    select o.compte_id into new.compte_id from public.opportunites o where o.id = new.opportunite_id;
  end if;
  return new;
end $$;
create trigger trg_commentaire_client before insert on public.commentaires for each row execute function private.commentaire_client();
