-- Leads du guide V1 — réception (à appliquer au passage en production)
-- Parcours « à qualifier » (réglage leads_a_qualifier, défaut : guide) : pas de fiche client, pas d'affaire, pas de tâche ; le lead arrive « À qualifier ».
-- Attribution manuelle (réglage leads_attribution_manuelle, défaut : guide) : le moteur automatique est conservé mais n'est pas appelé pour ces parcours.
-- Autres parcours : comportement inchangé, et l'affaire créée garde désormais l'origine du lead.
CREATE OR REPLACE FUNCTION public.recevoir_lead(p_cle text, p_lead jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_src public.sources_leads; L jsonb := coalesce(p_lead, '{}'::jsonb);
  v_tel text := left(btrim(coalesce(L->>'telephone', '')), 40);
  v_mail text := lower(left(btrim(coalesce(L->>'email', '')), 200));
  v_pers text := left(btrim(coalesce(L->>'nom', '')), 200);
  v_nom text := left(btrim(coalesce(nullif(L->>'organisation', ''), L->>'nom', '')), 200);
  v_ville text := coalesce(private.ville_canonique(L->>'ville'), '');
  v_parc text := lower(left(coalesce(nullif(L->>'parcours', ''), 'autre'), 30));
  v_met text := private.metier_pour_specialite(L->>'specialite');
  v_cat text := private.categorie_metier(v_met);
  v_lib text; v_cpt uuid; v_com uuid; v_opp uuid; v_prod uuid; v_client boolean := false; v_lid uuid; v_txt text; v_k text; v_vente boolean;
  v_qualif boolean; v_manuel boolean; v_contenu text; v_campagne text;
begin
  select * into v_src from public.sources_leads s where s.cle_hash = encode(sha256(convert_to(coalesce(p_cle, ''), 'UTF8')), 'hex') and s.actif;
  if v_src.id is null then raise exception 'cle_invalide' using errcode = '28000'; end if;
  if (select count(*) from public.leads l where l.source_id = v_src.id and l.recu_le > now() - interval '10 minutes') >= 60 then
    raise exception 'trop_de_leads' using errcode = '54000';
  end if;
  if v_pers = '' and v_nom = '' and v_tel = '' and v_mail = '' then raise exception 'lead_vide' using errcode = '22023'; end if;
  if v_nom = '' then v_nom := coalesce(nullif(v_pers, ''), nullif(v_mail, ''), v_tel); end if;
  v_lib := coalesce(nullif(left(L->>'source', 80), ''), v_src.nom);
  v_vente := v_parc not in ('support', 'partenariat', 'masterclass');
  v_qualif := v_parc = any(coalesce((select array(select jsonb_array_elements_text(r.valeur)) from public.reglages r where r.cle = 'leads_a_qualifier' and jsonb_typeof(r.valeur) = 'array'), array['guide']));
  v_manuel := v_parc = any(coalesce((select array(select jsonb_array_elements_text(r.valeur)) from public.reglages r where r.cle = 'leads_attribution_manuelle' and jsonb_typeof(r.valeur) = 'array'), array['guide']));
  v_contenu := left(case v_parc when 'guide' then 'Guide — Choisir sa technologie médico-esthétique' when 'demo' then 'Demande de démo'
                   else coalesce(nullif(L->>'parcours_libelle', ''), initcap(v_parc)) end, 200);
  v_campagne := nullif(left(btrim(coalesce(L->>'utm_campaign', '')), 200), '');
  v_k := private.cle_tel(v_tel);
  perform set_config('cellulift.silence', '1', true);
  if v_k is not null then
    select c.id into v_cpt from public.comptes c where private.cle_tel(c.telephone) = v_k or private.cle_tel(c.telephone_2) = v_k order by c.created_at limit 1;
  end if;
  if v_cpt is null and v_mail <> '' then select c.id into v_cpt from public.comptes c where lower(c.email) = v_mail order by c.created_at limit 1; end if;
  if v_cpt is not null then
    select c.commercial_id, c.statut = 'client', coalesce(v_cat, c.categorie) into v_com, v_client, v_cat from public.comptes c where c.id = v_cpt;
    update public.comptes c set email = coalesce(c.email, nullif(v_mail, '')), ville = coalesce(c.ville, nullif(v_ville, '')) where c.id = v_cpt;
    if v_com is not null and not exists (select 1 from public.equipe e where e.id = v_com and e.actif and e.parti_le is null) then v_com := null; end if;
  end if;
  if v_manuel then
    v_com := null; -- attribution manuelle par le superviseur
  elsif v_com is null then
    v_com := private.commercial_pour_lead(v_ville, v_cat);
  end if;
  v_txt := concat_ws(E'\n',
    'Demande reçue via ' || v_lib || coalesce(' (' || nullif(L->>'parcours_libelle', '') || ')', ''),
    nullif(L->>'message', ''),
    'Machine : ' || nullif(L->>'machine', ''),
    'Personne : ' || nullif(v_pers, ''),
    'Activité : ' || nullif(L->>'specialite', ''),
    'Page : ' || nullif(L->>'page', ''),
    'Campagne : ' || nullif(concat_ws(' / ', nullif(L->>'utm_source', ''), nullif(L->>'utm_medium', ''), nullif(L->>'utm_campaign', ''), nullif(L->>'utm_content', '')), ''));
  if not v_qualif then
    if v_cpt is null then
      insert into public.comptes(nom, segment, ville, telephone, email, specialite, statut, source, commercial_id, createur_id, import_ref, categorie, metier, metier_auto, metier_a_verifier)
      values (v_nom,
              (case v_met when 'med_esthetique' then 'A_clinique' when 'chirurgie' then 'A_clinique' when 'beaute' then 'C_salon' when 'minceur' then 'C_salon' when 'pharmacie' then 'C_salon' else 'B_cabinet' end)::public.segment,
              nullif(v_ville, ''), nullif(v_tel, ''), nullif(v_mail, ''), nullif(left(L->>'specialite', 120), ''), 'prospect', v_lib, v_com, v_com,
              'lead:' || gen_random_uuid(), v_cat, coalesce(v_met, 'autre'), true, coalesce(v_met, 'autre') = 'autre' or v_cat is null)
      returning id into v_cpt;
      if v_pers <> '' and v_pers <> v_nom then
        insert into public.contacts(compte_id, nom, telephone, email, decideur) values (v_cpt, v_pers, nullif(v_tel, ''), nullif(v_mail, ''), true);
      end if;
    elsif v_com is not null then
      update public.comptes c set commercial_id = v_com where c.id = v_cpt and c.commercial_id is null;
    end if;
    if v_vente then
      if nullif(L->>'machine', '') is not null then
        select p.id into v_prod from public.produits p where private.norm(p.nom) = private.norm(L->>'machine') limit 1;
      end if;
      select o.id into v_opp from public.opportunites o where o.compte_id = v_cpt and o.issue in ('en_cours', 'dormante') order by o.updated_at desc limit 1;
      if v_opp is null then
        insert into public.opportunites(compte_id, commercial_id, createur_id, produit_id, titre, etape, issue, probabilite, description)
        values (v_cpt, v_com, v_com, v_prod, left(concat_ws(' — ', v_nom, coalesce(nullif(L->>'machine', ''), 'Demande ' || v_lib)), 140), 'Qualification', 'en_cours', 20, v_txt)
        returning id into v_opp;
      else
        update public.opportunites o set issue = 'en_cours', raison_perte = null, produit_id = coalesce(o.produit_id, v_prod),
          description = concat_ws(E'\n\n', o.description, to_char(now() at time zone 'Africa/Casablanca', 'DD/MM/YYYY') || ' · ' || v_txt)
        where o.id = v_opp;
      end if;
    end if;
    insert into public.activites(compte_id, opportunite_id, commercial_id, createur_id, type, label, statut, prioritaire, date_activite, resume)
    values (v_cpt, v_opp, v_com, v_com, 'tache',
            case v_parc when 'support' then 'Demande SAV' when 'masterclass' then 'Inscription Academy' when 'partenariat' then 'Partenariat' else 'Rappeler le lead' end,
            'a_faire', true, now(), v_txt);
  end if;
  perform set_config('cellulift.silence', '0', true);
  insert into public.leads(source_id, source, canal, parcours, nom, telephone, email, ville, compte_id, opportunite_id, commercial_id, deja_client, donnees, categorie, metier,
                           statut, contenu, campagne, converti_le)
  values (v_src.id, v_lib, v_src.canal, v_parc, coalesce(nullif(v_pers, ''), v_nom), nullif(v_tel, ''), nullif(v_mail, ''), nullif(v_ville, ''), v_cpt, v_opp, v_com, v_client, L, v_cat, v_met,
          case when v_opp is not null then 'converti' else 'a_qualifier' end, v_contenu, v_campagne, case when v_opp is not null then now() end)
  returning id into v_lid;
  if v_opp is not null then
    update public.opportunites o set lead_id = v_lid, origine_canal = v_lib, origine_contenu = v_contenu, origine_campagne = v_campagne, origine_le = now()
    where o.id = v_opp and o.lead_id is null;
  end if;
  update public.sources_leads s set dernier_lead = now() where s.id = v_src.id;
  insert into public.notifications(destinataire_id, type, texte, compte_id, opportunite_id)
  select e.id, 'lead',
         case when v_qualif then (case when v_com is null then 'Nouveau lead à attribuer : ' else 'Nouveau lead à qualifier : ' end)
                                 || coalesce(nullif(v_pers, ''), v_nom) || coalesce(' (' || nullif(v_ville, '') || ')', '') || ' · ' || v_contenu || ' · ' || v_lib
                                 || case when v_client then ' · déjà client' when v_cpt is not null then ' · fiche existante' else '' end
              else 'Nouveau lead ' || v_lib || ' : ' || coalesce(nullif(v_pers, ''), v_nom) || coalesce(' (' || nullif(v_ville, '') || ')', '')
                   || coalesce(' — ' || nullif(L->>'machine', ''), '') || case when v_client then ' · déjà client' else '' end
                   || case when v_com is null then ' · à attribuer' else '' end end,
         v_cpt, v_opp
  from public.equipe e
  where e.parti_le is null and e.actif and (e.id = v_com or (v_com is null and e.role in ('superviseur', 'admin')) or (not v_qualif and e.role in ('superviseur', 'admin')));
  return jsonb_build_object('ok', true, 'lead', v_lid, 'compte', v_cpt, 'opportunite', v_opp, 'commercial', v_com, 'deja_client', v_client, 'a_qualifier', v_qualif);
end $function$;
