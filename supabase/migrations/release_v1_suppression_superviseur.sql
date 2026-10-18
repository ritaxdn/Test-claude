-- Release commerciale V1 — à appliquer au merge (additif, aucune donnée modifiée)
-- Un commercial ne peut plus supprimer comptes / affaires / devis via l'API.
-- L'interface ne propose déjà la suppression qu'aux superviseurs/admin (Supprimer la fiche, doublons).
create policy "comptes suppression superviseur" on public.comptes as restrictive for delete to authenticated using ((select private.est_superviseur()));
create policy "opps suppression superviseur" on public.opportunites as restrictive for delete to authenticated using ((select private.est_superviseur()));
create policy "devis suppression superviseur" on public.devis as restrictive for delete to authenticated using ((select private.est_superviseur()));
