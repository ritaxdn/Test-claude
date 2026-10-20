-- Leads du guide V1 — résultat « Doublon » à la qualification
-- Le lead est clôturé (statut non_qualifie, motif « Doublon ») et rattaché à la fiche client existante trouvée par téléphone ou email.
do $D$ declare d text; begin
  d := pg_get_functiondef('public.qualifier_lead(uuid,jsonb)'::regprocedure);
  d := replace(d, $x$'veille_lead', 'non_qualifie') then raise$x$, $x$'veille_lead', 'non_qualifie', 'doublon') then raise$x$);
  d := replace(d, $x$  if r = 'non_qualifie' then$x$, $x$  if r = 'doublon' then
    v_cpt := l.compte_id;
    if v_cpt is null and private.cle_tel(l.telephone) is not null then
      select c.id into v_cpt from public.comptes c where private.cle_tel(c.telephone) = private.cle_tel(l.telephone) or private.cle_tel(c.telephone_2) = private.cle_tel(l.telephone) order by c.created_at limit 1;
    end if;
    if v_cpt is null and nullif(l.email, '') is not null then
      select c.id into v_cpt from public.comptes c where lower(c.email) = lower(l.email) order by c.created_at limit 1;
    end if;
    update public.leads set statut = 'non_qualifie', compte_id = v_cpt,
      motif_non_qualifie = left('Doublon' || coalesce(' — ' || nullif(btrim(p->>'motif'), ''), ''), 200) where id = p_lead;
    return jsonb_build_object('ok', true, 'statut', 'non_qualifie', 'doublon', true, 'compte', v_cpt);
  end if;
  if r = 'non_qualifie' then$x$);
  if d not like '%''doublon''%' then raise exception 'patch non appliqué'; end if;
  execute d;
end $D$;
