-- Reprise de portefeuille : workflow demande → validation superviseur → transfert avec historique.
-- Appliqué en production le 2026-11-24 (projet igfgqfwkhyonptbtrywl).

-- 1) Autoriser le type 'reprise' dans les demandes
alter table public.demandes drop constraint demandes_type_check;
alter table public.demandes add constraint demandes_type_check
  check (type = any (array['mise_a_jour','validation','autre','reprise']));

-- 2) Un commercial demande la reprise d'un client (file + validation superviseur)
create or replace function public.demander_reprise(p_compte uuid, p_message text default null)
returns uuid
language plpgsql security definer set search_path to ''
as $$
declare
  moi uuid := private.membre_courant();
  v record; v_super uuid; v_nom_moi text; d_id uuid; v_msg text;
begin
  if moi is null then raise exception 'Accès refusé' using errcode = '42501'; end if;
  v_msg := nullif(btrim(coalesce(p_message,'')), '');
  select c.id, c.nom, c.ville, c.commercial_id as owner, e.nom as owner_nom
    into v
    from public.comptes c left join public.equipe e on e.id = c.commercial_id
    where c.id = p_compte;
  if v.id is null then raise exception 'Client introuvable'; end if;
  if v.owner = moi then raise exception 'Ce client est déjà à toi'; end if;
  if exists (select 1 from public.demandes
             where type = 'reprise' and compte_id = p_compte and auteur_id = moi and statut = 'en_attente') then
    raise exception 'Tu as déjà demandé la reprise de ce client';
  end if;
  -- destinataire : mon responsable s'il est actif et superviseur/admin, sinon un admin actif
  select e2.id into v_super
    from public.equipe e1 join public.equipe e2 on e2.id = e1.responsable_id
    where e1.id = moi and e2.actif and e2.role in ('superviseur','admin');
  if v_super is null then
    select id into v_super from public.equipe
      where actif and role = 'admin' order by ordre nulls last, created_at limit 1;
  end if;
  if v_super is null then raise exception 'Aucun superviseur disponible pour valider'; end if;
  select split_part(nom, ' ', 1) into v_nom_moi from public.equipe where id = moi;

  perform set_config('cellulift.silence', '1', true);
  insert into public.demandes(auteur_id, destinataire_id, compte_id, type, message, statut)
  values (moi, v_super, p_compte, 'reprise', v_msg, 'en_attente')
  returning id into d_id;
  perform set_config('cellulift.silence', '0', true);

  insert into public.notifications(destinataire_id, auteur_id, type, texte, compte_id)
  values (v_super, moi, 'demande',
    coalesce(v_nom_moi, 'Un commercial') || ' demande à reprendre le client ' || v.nom
    || coalesce(' (' || v.ville || ')', '') || ', suivi par ' || coalesce(v.owner_nom, 'personne')
    || coalesce(' — ' || v_msg, '') || '. À valider dans « Demandes de reprise ».', p_compte);
  return d_id;
end; $$;

-- 3) Le superviseur accepte ou refuse la reprise (transfert + historique)
create or replace function public.decider_reprise(p_demande uuid, p_accepter boolean, p_reponse text default null)
returns jsonb
language plpgsql security definer set search_path to ''
as $$
declare
  moi uuid := private.membre_courant();
  d record; v_owner uuid; v_nom text; v_super_nom text; v_rep text;
  n_o int := 0; n_a int := 0; n_dv int := 0; n_p int := 0;
begin
  if moi is null or not (select private.est_superviseur()) then
    raise exception 'Réservé aux superviseurs' using errcode = '42501';
  end if;
  select * into d from public.demandes where id = p_demande and type = 'reprise';
  if d.id is null then raise exception 'Demande introuvable'; end if;
  if d.statut <> 'en_attente' then raise exception 'Demande déjà traitée'; end if;
  if not ((select private.est_admin()) or d.destinataire_id = moi or d.destinataire_id in (select private.perim())) then
    raise exception 'Pas autorisé à traiter cette demande' using errcode = '42501';
  end if;
  select split_part(nom, ' ', 1) into v_super_nom from public.equipe where id = moi;
  v_rep := nullif(btrim(coalesce(p_reponse,'')), '');

  if p_accepter then
    if exists (select 1 from public.equipe where id = d.auteur_id and (parti_le is not null or not actif)) then
      raise exception 'Le demandeur n''est plus actif';
    end if;
    select commercial_id, nom into v_owner, v_nom from public.comptes where id = d.compte_id;

    perform set_config('cellulift.silence', '1', true);
    if v_owner is distinct from d.auteur_id then
      update public.comptes set commercial_id = d.auteur_id where id = d.compte_id;
      update public.opportunites set commercial_id = d.auteur_id
        where compte_id = d.compte_id and commercial_id is not distinct from v_owner and issue = 'en_cours';
      get diagnostics n_o = row_count;
      update public.activites set commercial_id = d.auteur_id
        where compte_id = d.compte_id and commercial_id is not distinct from v_owner and statut = 'a_faire';
      get diagnostics n_a = row_count;
      update public.devis set commercial_id = d.auteur_id
        where compte_id = d.compte_id and commercial_id is not distinct from v_owner and statut in ('brouillon','envoye');
      get diagnostics n_dv = row_count;
      update public.paiements set commercial_id = d.auteur_id
        where compte_id = d.compte_id and commercial_id is not distinct from v_owner and statut is distinct from 'encaisse';
      get diagnostics n_p = row_count;
      insert into public.historique(auteur_id, table_name, action, ligne_id, compte_id, resume, details)
      values (moi, 'comptes', 'modification', d.compte_id, d.compte_id,
        'Compte « ' || coalesce(v_nom,'') || ' » - repris par '
          || coalesce((select nom from public.equipe where id = d.auteur_id), '?')
          || ' (de ' || coalesce((select nom from public.equipe where id = v_owner), 'personne')
          || ', validé par ' || coalesce((select nom from public.equipe where id = moi), '?') || ')',
        jsonb_build_object('de', v_owner, 'vers', d.auteur_id, 'par', moi, 'via', 'reprise',
          'opportunites', n_o, 'taches', n_a, 'devis', n_dv, 'paiements', n_p));
    end if;
    update public.demandes set statut = 'resolue',
      reponse = left(coalesce(v_rep, 'Reprise acceptée'), 1000), resolue_le = now() where id = p_demande;
    perform set_config('cellulift.silence', '0', true);

    insert into public.notifications(destinataire_id, auteur_id, type, texte, compte_id)
    values (d.auteur_id, moi, 'transfert',
      coalesce(v_super_nom, 'Le superviseur') || ' a accepté ta reprise du client ' || coalesce(v_nom,'') || '.', d.compte_id);
    return jsonb_build_object('ok', true, 'accepte', true,
      'opportunites', n_o, 'taches', n_a, 'devis', n_dv, 'paiements', n_p);
  else
    perform set_config('cellulift.silence', '1', true);
    update public.demandes set statut = 'resolue',
      reponse = left(coalesce(v_rep, 'Refusée'), 1000), resolue_le = now() where id = p_demande;
    perform set_config('cellulift.silence', '0', true);
    select nom into v_nom from public.comptes where id = d.compte_id;
    insert into public.notifications(destinataire_id, auteur_id, type, texte, compte_id)
    values (d.auteur_id, moi, 'demande',
      coalesce(v_super_nom, 'Le superviseur') || ' a refusé ta reprise du client ' || coalesce(v_nom,'')
      || coalesce(' — ' || v_rep, '') || '.', d.compte_id);
    return jsonb_build_object('ok', true, 'accepte', false);
  end if;
end; $$;

grant execute on function public.demander_reprise(uuid, text) to authenticated;
grant execute on function public.decider_reprise(uuid, boolean, text) to authenticated;

-- 4) Tracer aussi le transfert en masse dans l'historique
create or replace function public.transferer_portefeuille(p_de uuid, p_vers uuid, p_comptes uuid[] default null::uuid[], p_depart boolean default false)
returns jsonb
language plpgsql security definer set search_path to ''
as $$
declare
  moi uuid := private.membre_courant();
  n_c int := 0; n_o int := 0; n_a int := 0; n_d int := 0; n_p int := 0;
  nom_de text; nom_moi text; ids uuid[];
  filtre boolean := (p_comptes is not null);
begin
  if not (select private.est_superviseur()) then raise exception 'Réservé aux superviseurs' using errcode = '42501'; end if;
  if not (select private.est_admin()) and (p_depart or p_de not in (select private.perim()) or (p_vers is not null and p_vers not in (select private.perim()))) then
    raise exception 'Transfert limité à ton équipe (un départ est réservé à l''admin)' using errcode = '42501';
  end if;
  if p_de is null or p_de = p_vers then raise exception 'Choisis deux personnes différentes'; end if;
  if p_vers is not null and exists (select 1 from public.equipe where id = p_vers and parti_le is not null) then
    raise exception 'La personne qui reçoit les clients a quitté l''équipe';
  end if;
  select nom into nom_de from public.equipe where id = p_de;
  select split_part(nom, ' ', 1) into nom_moi from public.equipe where id = moi;
  perform set_config('cellulift.silence', '1', true);

  select coalesce(array_agg(id), '{}') into ids from public.comptes
   where commercial_id = p_de and (p_comptes is null or id = any(p_comptes));
  update public.comptes set commercial_id = p_vers where id = any(ids);
  get diagnostics n_c = row_count;

  update public.opportunites set commercial_id = p_vers
   where commercial_id = p_de and issue = 'en_cours' and (not filtre or compte_id = any(ids));
  get diagnostics n_o = row_count;
  update public.activites set commercial_id = p_vers
   where commercial_id = p_de and statut = 'a_faire' and (not filtre or compte_id = any(ids));
  get diagnostics n_a = row_count;
  update public.devis set commercial_id = p_vers
   where commercial_id = p_de and statut in ('brouillon', 'envoye') and (not filtre or compte_id = any(ids));
  get diagnostics n_d = row_count;
  update public.paiements set commercial_id = p_vers
   where commercial_id = p_de and statut is distinct from 'encaisse' and (not filtre or compte_id = any(ids));
  get diagnostics n_p = row_count;

  if p_depart then
    update public.equipe set actif = false, parti_le = coalesce(parti_le, current_date) where id = p_de;
  end if;
  perform set_config('cellulift.silence', '0', true);

  if (n_c + n_o + n_a + n_d + n_p) > 0 then
    insert into public.historique(auteur_id, table_name, action, resume, details)
    values (moi, 'comptes', 'modification',
      'Portefeuille transféré de ' || coalesce(nom_de, '?') || ' à '
        || coalesce((select nom from public.equipe where id = p_vers), 'non assigné')
        || ' : ' || n_c || ' client(s)'
        || case when n_o > 0 then ', ' || n_o || ' opp.' else '' end
        || case when n_a > 0 then ', ' || n_a || ' tâche(s)' else '' end
        || case when n_d > 0 then ', ' || n_d || ' devis' else '' end
        || case when n_p > 0 then ', ' || n_p || ' paiement(s)' else '' end
        || case when p_depart then ' — départ' else '' end,
      jsonb_build_object('de', p_de, 'vers', p_vers, 'comptes', n_c, 'opportunites', n_o,
        'taches', n_a, 'devis', n_d, 'paiements', n_p, 'depart', p_depart));
  end if;

  if p_vers is not null and p_vers is distinct from moi and (n_c + n_o + n_a + n_d + n_p) > 0 then
    insert into public.notifications(destinataire_id, auteur_id, type, texte)
    values (p_vers, moi, 'transfert', coalesce(nom_moi, 'Le superviseur') || ' t''a transféré ' || n_c || ' client(s) de ' || coalesce(nom_de, '?')
      || case when n_o > 0 then ', ' || n_o || ' opportunité(s) en cours' else '' end
      || case when n_a > 0 then ', ' || n_a || ' tâche(s) à faire' else '' end
      || case when n_d > 0 then ', ' || n_d || ' devis' else '' end
      || case when n_p > 0 then ', ' || n_p || ' paiement(s) à suivre' else '' end);
  end if;
  return jsonb_build_object('comptes', n_c, 'opportunites', n_o, 'taches', n_a, 'devis', n_d, 'paiements', n_p);
end; $$;
