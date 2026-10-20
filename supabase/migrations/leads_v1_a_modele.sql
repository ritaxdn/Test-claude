-- Leads du guide V1 — modèle (additif, compatible avec la prod actuelle)
-- Lead : statut, qualification, veille propre, conversion. Affaire : origine permanente (lead, canal, contenu, campagne).

alter table public.leads
  add column if not exists statut text not null default 'a_qualifier',
  add column if not exists contenu text,
  add column if not exists campagne text,
  add column if not exists profil text,
  add column if not exists projet text,
  add column if not exists besoin text,
  add column if not exists horizon text,
  add column if not exists note_qualif text,
  add column if not exists motif_non_qualifie text,
  add column if not exists qualifie_le timestamptz,
  add column if not exists qualifie_par uuid references public.equipe(id) on delete set null,
  add column if not exists attribue_le timestamptz,
  add column if not exists attribue_par uuid references public.equipe(id) on delete set null,
  add column if not exists reactiver_le date,
  add column if not exists contexte_reactivation text,
  add column if not exists action_reprise text,
  add column if not exists veille_le timestamptz,
  add column if not exists reactive_le timestamptz,
  add column if not exists converti_le timestamptz;
alter table public.leads add constraint leads_statut_check check (statut in ('a_qualifier','projet_identifie','en_veille','non_qualifie','converti'));
alter table public.leads add constraint leads_profil_check check (profil is null or profil in ('medecin','centre','investisseur','autre'));
alter table public.leads add constraint leads_projet_check check (projet is null or projet in ('creer','ajouter','remplacer','renseigne'));
alter table public.leads add constraint leads_horizon_check check (horizon is null or horizon in ('0_3','3_6','6_12','12_plus','indefini'));
alter table public.leads add constraint leads_textes_check check (char_length(coalesce(besoin,'')) <= 300 and char_length(coalesce(note_qualif,'')) <= 1000
  and char_length(coalesce(contexte_reactivation,'')) <= 1000 and char_length(coalesce(action_reprise,'')) <= 300 and char_length(coalesce(motif_non_qualifie,'')) <= 200);
create index if not exists leads_statut_idx on public.leads(statut, commercial_id);

alter table public.opportunites
  add column if not exists lead_id uuid references public.leads(id) on delete set null,
  add column if not exists origine_canal text,
  add column if not exists origine_contenu text,
  add column if not exists origine_campagne text,
  add column if not exists origine_le timestamptz;

-- L'origine d'une affaire est posée une seule fois (par la qualification du lead) et ne peut plus être modifiée depuis l'application.
create or replace function private.figer_origine() returns trigger language plpgsql set search_path = '' as $$
begin
  if current_user in ('authenticated', 'anon') then
    if tg_op = 'INSERT' then
      new.lead_id := null; new.origine_canal := null; new.origine_contenu := null; new.origine_campagne := null; new.origine_le := null;
    else
      new.lead_id := old.lead_id; new.origine_canal := old.origine_canal; new.origine_contenu := old.origine_contenu;
      new.origine_campagne := old.origine_campagne; new.origine_le := old.origine_le;
    end if;
  end if;
  return new;
end $$;
create trigger trg_opps_origine before insert or update on public.opportunites for each row execute function private.figer_origine();

-- Reprise des leads existants
update public.leads l set
  statut = case when l.opportunite_id is not null then 'converti' else 'a_qualifier' end,
  converti_le = case when l.opportunite_id is not null then l.recu_le end,
  contenu = case l.parcours when 'guide' then 'Guide — Choisir sa technologie médico-esthétique' when 'demo' then 'Demande de démo'
                             else coalesce(nullif(l.donnees->>'parcours_libelle', ''), initcap(l.parcours)) end,
  campagne = nullif(l.donnees->>'utm_campaign', '');
update public.opportunites o set lead_id = l.id, origine_canal = l.source, origine_contenu = l.contenu, origine_campagne = l.campagne, origine_le = l.recu_le
  from public.leads l where l.opportunite_id = o.id and o.lead_id is null;

-- Qualifier un lead (commercial responsable, superviseur de son périmètre, admin)
create or replace function public.qualifier_lead(p_lead uuid, p jsonb) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  l public.leads; moi uuid := private.membre_courant(); r text := coalesce(p->>'resultat', ''); v_com uuid; v_cpt uuid; v_opp uuid;
  v_prod uuid; v_titre text; v_mt numeric; v_j date; v_nom text; v_veille boolean;
begin
  if moi is null then raise exception 'Accès refusé' using errcode = '42501'; end if;
  select * into l from public.leads where id = p_lead for update;
  if l.id is null then raise exception 'Lead introuvable' using errcode = 'P0002'; end if;
  if not coalesce((select private.est_admin()) or l.commercial_id = moi
          or ((select private.est_superviseur()) and (l.commercial_id is null or l.commercial_id in (select private.perim()))), false) then
    raise exception 'Accès refusé' using errcode = '42501';
  end if;
  if l.statut in ('converti', 'non_qualifie') then raise exception 'Ce lead est déjà traité' using errcode = '22023'; end if;
  if r not in ('projet', 'projet_plus_tard', 'veille_affaire', 'veille_lead', 'non_qualifie') then raise exception 'Résultat invalide' using errcode = '22023'; end if;
  v_com := coalesce(l.commercial_id, moi);
  update public.leads set
    profil = coalesce(nullif(p->>'profil', ''), profil), projet = coalesce(nullif(p->>'projet', ''), projet),
    besoin = coalesce(nullif(left(btrim(p->>'besoin'), 300), ''), besoin), horizon = coalesce(nullif(p->>'horizon', ''), horizon),
    note_qualif = coalesce(nullif(left(btrim(p->>'note'), 1000), ''), note_qualif),
    qualifie_le = coalesce(qualifie_le, now()), qualifie_par = coalesce(qualifie_par, moi), commercial_id = v_com
  where id = p_lead;

  if r = 'non_qualifie' then
    update public.leads set statut = 'non_qualifie', motif_non_qualifie = nullif(left(btrim(p->>'motif'), 200), '') where id = p_lead;
    return jsonb_build_object('ok', true, 'statut', 'non_qualifie');
  end if;
  if r in ('veille_lead', 'veille_affaire') then
    v_j := nullif(p->>'reactiver_le', '')::date;
    if v_j is null or v_j <= (now() at time zone 'Africa/Casablanca')::date then raise exception 'Choisis une date de réactivation à venir' using errcode = '22023'; end if;
  end if;
  if r = 'veille_lead' then
    update public.leads set statut = 'en_veille', reactiver_le = v_j, contexte_reactivation = nullif(left(btrim(p->>'contexte'), 1000), ''),
      action_reprise = nullif(left(btrim(p->>'action'), 300), ''), veille_le = now(), reactive_le = null where id = p_lead;
    return jsonb_build_object('ok', true, 'statut', 'en_veille');
  end if;
  if r = 'projet_plus_tard' then
    update public.leads set statut = 'projet_identifie' where id = p_lead;
    return jsonb_build_object('ok', true, 'statut', 'projet_identifie');
  end if;

  -- Projet réel (maintenant ou en veille) : fiche client si besoin, puis affaire avec l'origine du lead
  v_cpt := l.compte_id;
  if v_cpt is null then
    v_nom := left(coalesce(nullif(btrim(l.donnees->>'organisation'), ''), nullif(btrim(l.nom), ''), l.email, l.telephone, 'Lead'), 200);
    insert into public.comptes(nom, segment, ville, telephone, email, specialite, statut, source, commercial_id, createur_id, import_ref, categorie, metier, metier_auto, metier_a_verifier)
    values (v_nom,
      (case l.metier when 'med_esthetique' then 'A_clinique' when 'chirurgie' then 'A_clinique' when 'beaute' then 'C_salon' when 'minceur' then 'C_salon' when 'pharmacie' then 'C_salon' else 'B_cabinet' end)::public.segment,
      l.ville, l.telephone, l.email, nullif(left(l.donnees->>'specialite', 120), ''), 'prospect', l.source, v_com, moi, 'lead:' || l.id,
      l.categorie, coalesce(l.metier, 'autre'), true, coalesce(l.metier, 'autre') = 'autre' or l.categorie is null)
    returning id into v_cpt;
    if nullif(btrim(l.nom), '') is not null and btrim(l.nom) <> v_nom then
      insert into public.contacts(compte_id, nom, telephone, email, decideur) values (v_cpt, btrim(l.nom), l.telephone, l.email, true);
    end if;
  end if;
  v_prod := (select id from public.produits where id = nullif(p->>'produit_id', '')::uuid);
  v_mt := nullif(regexp_replace(coalesce(p->>'montant', ''), '[^0-9.]', '', 'g'), '')::numeric;
  v_titre := left(coalesce(nullif(btrim(p->>'titre'), ''),
                  (select nom from public.comptes where id = v_cpt) || coalesce(' — ' || nullif(btrim(coalesce((select nom from public.produits where id = v_prod), p->>'besoin')), ''), '')), 140);
  v_veille := r = 'veille_affaire';
  insert into public.opportunites(compte_id, commercial_id, createur_id, produit_id, titre, etape, issue, probabilite, montant_mad, besoin,
    lead_id, origine_canal, origine_contenu, origine_campagne, origine_le,
    veille_raison, veille_jusqu, veille_contexte, veille_reprise, veille_le, veille_par)
  values (v_cpt, v_com, moi, v_prod, v_titre, 'Qualification', case when v_veille then 'dormante' else 'en_cours' end::public.issue_affaire, 20, v_mt,
    nullif(left(btrim(concat_ws(' · ', p->>'besoin', p->>'note')), 1000), ''),
    l.id, l.source, l.contenu, l.campagne, l.recu_le,
    case when v_veille then 'projet_futur' end, case when v_veille then v_j end,
    case when v_veille then nullif(left(btrim(p->>'contexte'), 2000), '') end, case when v_veille then nullif(left(btrim(p->>'action'), 300), '') end,
    case when v_veille then now() end, case when v_veille then moi end)
  returning id into v_opp;
  update public.leads set statut = 'converti', converti_le = now(), compte_id = v_cpt, opportunite_id = v_opp where id = p_lead;
  return jsonb_build_object('ok', true, 'statut', 'converti', 'compte', v_cpt, 'opportunite', v_opp, 'veille', v_veille);
end $$;

-- Attribuer un lead (superviseur dans son périmètre, admin)
create or replace function public.attribuer_lead(p_lead uuid, p_com uuid) returns jsonb language plpgsql security definer set search_path = '' as $$
declare l public.leads; moi uuid := private.membre_courant(); e public.equipe; qui text;
begin
  if not (select private.est_superviseur()) then raise exception 'Réservé aux superviseurs' using errcode = '42501'; end if;
  select * into l from public.leads where id = p_lead for update;
  if l.id is null then raise exception 'Lead introuvable' using errcode = 'P0002'; end if;
  select * into e from public.equipe where id = p_com;
  if e.id is null or not e.actif or e.parti_le is not null then raise exception 'Choisis un membre actif' using errcode = '22023'; end if;
  if not (select private.est_admin()) and coalesce((l.commercial_id is not null and l.commercial_id not in (select private.perim())) or p_com not in (select private.perim()), true) then
    raise exception 'Attribution limitée à ton équipe' using errcode = '42501';
  end if;
  update public.leads set commercial_id = p_com, attribue_le = now(), attribue_par = moi where id = p_lead;
  if p_com is distinct from moi then
    select split_part(nom, ' ', 1) into qui from public.equipe where id = moi;
    insert into public.notifications(destinataire_id, auteur_id, type, texte, compte_id)
    values (p_com, moi, 'lead', coalesce(qui, 'Ton superviseur') || ' t''a attribué un nouveau lead à qualifier : ' || coalesce(l.nom, l.email, 'lead')
      || coalesce(' · ' || l.contenu, ''), l.compte_id);
  end if;
  return jsonb_build_object('ok', true);
end $$;
revoke all on function public.qualifier_lead(uuid, jsonb), public.attribuer_lead(uuid, uuid) from public, anon;
grant execute on function public.qualifier_lead(uuid, jsonb), public.attribuer_lead(uuid, uuid) to authenticated;

-- Réactivation des leads en veille (chaque matin)
create or replace function private.reactiver_leads() returns integer language plpgsql security definer set search_path = '' as $$
declare r record; n int := 0;
begin
  for r in select * from public.leads where statut = 'en_veille' and reactiver_le <= (now() at time zone 'Africa/Casablanca')::date for update skip locked loop
    update public.leads set statut = 'a_qualifier', reactive_le = now() where id = r.id;
    if r.commercial_id is not null then
      insert into public.notifications(destinataire_id, type, texte, compte_id)
      values (r.commercial_id, 'lead', 'Lead à réactiver : ' || coalesce(r.nom, r.email, 'lead') || coalesce(' — ' || nullif(r.contexte_reactivation, ''), '')
        || coalesce(' · ' || r.contenu || ' reçu le ' || to_char(r.recu_le at time zone 'Africa/Casablanca', 'DD/MM/YYYY'), ''), r.compte_id);
    end if;
    n := n + 1;
  end loop;
  return n;
end $$;
select cron.schedule('cellulift-reactiver-leads', '5 6 * * *', 'select private.reactiver_leads()');
