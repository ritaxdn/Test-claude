-- Les clients des membres désactivés (commerciaux partis) restent visibles des superviseurs, comme des fiches non attribuées,
-- pour pouvoir les retrouver et les transférer. Aucune donnée modifiée.
create or replace function private.perim() returns setof uuid language sql stable security definer set search_path = '' as $$
  with recursive t(id) as (
    select private.membre_courant()
    union
    select e.id from public.equipe e join t on e.responsable_id = t.id
  )
  select id from t where id is not null
  union
  select e.id from public.equipe e where not e.actif and (select private.est_superviseur());
$$;
