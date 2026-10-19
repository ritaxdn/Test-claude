-- Sécurité : outils superviseur limités à leur équipe, réglages globaux et imports réservés à l'admin.

-- Imports de l'ancien CRM (mig_*) : admin uniquement
create or replace function private.mig_debut() returns uuid language plpgsql security definer set search_path = '' as $$
begin
  if not (select private.est_admin()) then raise exception 'Réservé à l''admin' using errcode = '42501'; end if;
  perform set_config('cellulift.silence', '1', true);
  return private.membre_courant();
end; $$;

-- Mise en sommeil globale : admin uniquement
do $M$ declare d text; n text; begin
  select pg_get_functiondef('public.endormir_affaires(integer, boolean)'::regprocedure) into d;
  n := regexp_replace(d,
    'if\s+not\s+\(select\s+private\.est_superviseur\(\)\)\s+then\s+raise\s+exception\s+''Réservé aux superviseurs''',
    'if not (select private.est_admin()) then raise exception ''Réservé à l''''admin''');
  if n = d then raise exception 'endormir_affaires : garde introuvable'; end if;
  execute n;
end $M$;

-- Transfert de portefeuille : un superviseur ne transfère qu'entre membres de son équipe ; un départ (désactivation) est réservé à l'admin
do $M$ declare d text; n text; begin
  select pg_get_functiondef('public.transferer_portefeuille(uuid, uuid, text[], boolean)'::regprocedure) into d;
  n := regexp_replace(d,
    'if\s+not\s+\(select\s+private\.est_superviseur\(\)\)\s+then\s+raise\s+exception\s+''Réservé aux superviseurs''\s+using\s+errcode\s*=\s*''42501'';\s*end\s+if;',
    'if not (select private.est_superviseur()) then raise exception ''Réservé aux superviseurs'' using errcode = ''42501''; end if;
  if not (select private.est_admin()) and (p_depart or p_de not in (select private.perim()) or (p_vers is not null and p_vers not in (select private.perim()))) then
    raise exception ''Transfert limité à ton équipe (un départ est réservé à l''''admin)'' using errcode = ''42501'';
  end if;');
  if n = d then raise exception 'transferer_portefeuille : garde introuvable'; end if;
  execute n;
end $M$;

-- Doublons de la base : un superviseur ne voit que les paires de son périmètre
do $M$ declare d text; n text; begin
  select pg_get_functiondef('public.doublons_base()'::regprocedure) into d;
  n := regexp_replace(d, 'where\s+\(select\s+private\.est_superviseur\(\)\)',
    'where (select private.est_superviseur()) and ((select private.est_admin()) or (p.a in (select private.comptes_vus()) and p.b in (select private.comptes_vus())))');
  if n = d then raise exception 'doublons_base : filtre introuvable'; end if;
  execute n;
end $M$;

-- Demande de mise à jour : uniquement à un membre de son équipe (admin : tout le monde)
alter policy "demandes ajout" on public.demandes with check ((select private.est_superviseur()) and auteur_id = (select private.membre_courant())
  and ((select private.est_admin()) or destinataire_id in (select private.perim())));

-- Réglages de l'entreprise, règles d'attribution et sources de leads (clés) : admin uniquement en écriture
alter policy "reglages modif" on public.reglages using ((select private.est_admin())) with check ((select private.est_admin()));
alter policy "reglages ajout" on public.reglages with check ((select private.est_admin()));
alter policy "regles superviseur" on public.regles_attribution using ((select private.est_admin())) with check ((select private.est_admin()));
alter policy "sources leads superviseur" on public.sources_leads using ((select private.est_admin())) with check ((select private.est_admin()));

-- Commentaires : déplacer / supprimer ceux des autres seulement dans son périmètre
alter policy "commentaires deplacement" on public.commentaires
  using ((select private.est_admin()) or ((select private.est_superviseur()) and (compte_id in (select private.comptes_vus()) or opportunite_id in (select private.opps_vues()))))
  with check ((select private.est_admin()) or ((select private.est_superviseur()) and (compte_id in (select private.comptes_vus()) or opportunite_id in (select private.opps_vues()))));
alter policy "commentaires suppression" on public.commentaires
  using (auteur_id = (select private.membre_courant()) or (select private.est_admin())
    or ((select private.est_superviseur()) and (compte_id in (select private.comptes_vus()) or opportunite_id in (select private.opps_vues()))));
