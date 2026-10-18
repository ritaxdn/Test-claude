-- Release V1 — périmètre superviseur verrouillé à la base.
-- Admin : voit tout. Superviseur : lui-même + les membres rattachés (directement ou non) dans l'organigramme
-- + les fiches non attribuées. Commercial : inchangé (ses fiches, celles qu'il a créées, et ce qui dépend de ses clients).
-- Les ensembles visibles sont calculés une fois par requête (sous-requêtes non corrélées), pas ligne par ligne.
-- Les tables principales testent leurs propres colonnes (une ligne qu'on vient d'insérer reste visible au RETURNING).
create or replace function private.est_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.equipe e where e.user_id = (select auth.uid()) and e.actif and e.role = 'admin');
$$;
create or replace function private.perim() returns setof uuid language sql stable security definer set search_path = '' as $$
  with recursive t(id) as (
    select private.membre_courant()
    union
    select e.id from public.equipe e join t on e.responsable_id = t.id
  ) select id from t where id is not null;
$$;
create or replace function private.comptes_vus() returns setof uuid language sql stable security definer set search_path = '' as $$
  with me as (select private.membre_courant() m, private.est_admin() adm, private.est_superviseur() sup),
       p as (select private.perim() id)
  select c.id from public.comptes c, me
  where me.adm or c.commercial_id = me.m or c.createur_id = me.m
     or (me.sup and (c.commercial_id is null or c.commercial_id in (select id from p)));
$$;
create or replace function private.opps_vues() returns setof uuid language sql stable security definer set search_path = '' as $$
  with me as (select private.membre_courant() m, private.est_admin() adm, private.est_superviseur() sup),
       p as (select private.perim() id), cv as (select private.comptes_vus() id)
  select o.id from public.opportunites o, me
  where me.adm or o.commercial_id = me.m or o.createur_id = me.m
     or (me.sup and (o.commercial_id is null or o.commercial_id in (select id from p)))
     or o.compte_id in (select id from cv);
$$;
create or replace function private.devis_vus() returns setof uuid language sql stable security definer set search_path = '' as $$
  with me as (select private.membre_courant() m, private.est_admin() adm, private.est_superviseur() sup),
       p as (select private.perim() id), cv as (select private.comptes_vus() id)
  select d.id from public.devis d, me
  where me.adm or d.commercial_id = me.m
     or (me.sup and (d.commercial_id is null or d.commercial_id in (select id from p)))
     or d.compte_id in (select id from cv);
$$;
grant execute on function private.est_admin(), private.perim(), private.comptes_vus(), private.opps_vues(), private.devis_vus() to authenticated;

-- Fonctions historiques gardées (utilisées ailleurs), alignées sur le même périmètre
create or replace function private.voit_compte(p_compte uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select p_compte is not null and p_compte in (select private.comptes_vus());
$$;
create or replace function private.voit_opp(p_opp uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select p_opp is not null and p_opp in (select private.opps_vues());
$$;
create or replace function private.voit_devis(p_devis uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select p_devis is not null and p_devis in (select private.devis_vus());
$$;

alter policy "comptes membres" on public.comptes using ((select private.est_membre_equipe()) and ((select private.est_admin()) or commercial_id = (select private.membre_courant()) or createur_id = (select private.membre_courant()) or ((select private.est_superviseur()) and (commercial_id is null or commercial_id in (select private.perim())))));
alter policy "opps membres" on public.opportunites using ((select private.est_membre_equipe()) and ((select private.est_admin()) or commercial_id = (select private.membre_courant()) or createur_id = (select private.membre_courant()) or ((select private.est_superviseur()) and (commercial_id is null or commercial_id in (select private.perim()))) or compte_id in (select private.comptes_vus())));
alter policy "devis membres" on public.devis using ((select private.est_membre_equipe()) and ((select private.est_admin()) or commercial_id = (select private.membre_courant()) or ((select private.est_superviseur()) and (commercial_id is null or commercial_id in (select private.perim()))) or compte_id in (select private.comptes_vus())));
alter policy "activites membres" on public.activites using ((select private.est_membre_equipe()) and ((select private.est_admin())
  or commercial_id = (select private.membre_courant()) or createur_id = (select private.membre_courant())
  or ((select private.est_superviseur()) and (commercial_id is null or commercial_id in (select private.perim())))
  or compte_id in (select private.comptes_vus())));
alter policy "contacts membres" on public.contacts using ((select private.est_membre_equipe()) and compte_id in (select private.comptes_vus()));
alter policy "devis lignes membres" on public.devis_lignes using ((select private.est_membre_equipe()) and devis_id in (select private.devis_vus()));
alter policy "paiements lecture" on public.paiements using ((select private.est_admin()) or commercial_id = (select private.membre_courant()) or createur_id = (select private.membre_courant())
  or ((select private.est_superviseur()) and (commercial_id is null or commercial_id in (select private.perim()))) or compte_id in (select private.comptes_vus()));
alter policy "paiements modif" on public.paiements using ((select private.est_admin()) or commercial_id = (select private.membre_courant()) or createur_id = (select private.membre_courant())
  or ((select private.est_superviseur()) and (commercial_id is null or commercial_id in (select private.perim()))) or compte_id in (select private.comptes_vus()));
alter policy "commentaires lecture" on public.commentaires using ((select private.est_membre_equipe()) and ((select private.est_admin()) or auteur_id = (select private.membre_courant())
  or compte_id in (select private.comptes_vus()) or opportunite_id in (select private.opps_vues())));
alter policy "historique lecture" on public.historique using ((select private.est_membre_equipe()) and ((select private.est_admin()) or auteur_id = (select private.membre_courant())
  or compte_id in (select private.comptes_vus()) or opportunite_id in (select private.opps_vues())));
alter policy "leads lecture" on public.leads using ((select private.est_membre_equipe()) and ((select private.est_admin()) or commercial_id = (select private.membre_courant())
  or ((select private.est_superviseur()) and (commercial_id is null or commercial_id in (select private.perim())))));
alter policy "demandes lecture" on public.demandes using ((select private.est_membre_equipe()) and ((select private.est_admin()) or destinataire_id = (select private.membre_courant()) or auteur_id = (select private.membre_courant())
  or ((select private.est_superviseur()) and destinataire_id in (select private.perim()))));
alter policy "demandes suivi" on public.demandes using ((select private.est_admin()) or auteur_id = (select private.membre_courant()) or destinataire_id = (select private.membre_courant())
  or ((select private.est_superviseur()) and destinataire_id in (select private.perim())))
  with check ((select private.est_admin()) or auteur_id = (select private.membre_courant()) or destinataire_id = (select private.membre_courant())
  or ((select private.est_superviseur()) and destinataire_id in (select private.perim())));
alter policy "aides lecture" on public.demandes_aide using ((select private.est_membre_equipe()) and ((select private.est_admin()) or auteur_id = (select private.membre_courant()) or destinataire_id = (select private.membre_courant())
  or ((select private.est_superviseur()) and auteur_id in (select private.perim()))));
alter policy "aides suivi" on public.demandes_aide using ((select private.est_admin()) or auteur_id = (select private.membre_courant()) or destinataire_id = (select private.membre_courant())
  or ((select private.est_superviseur()) and auteur_id in (select private.perim())))
  with check ((select private.est_admin()) or auteur_id = (select private.membre_courant()) or destinataire_id = (select private.membre_courant())
  or ((select private.est_superviseur()) and auteur_id in (select private.perim())));
