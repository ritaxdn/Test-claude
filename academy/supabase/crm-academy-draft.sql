-- CRM Cellulift ↔ Academy — BROUILLON, NON APPLIQUÉ.
-- À relire avec l'équipe CRM avant toute migration. Voir docs/05-integration-crm.md et docs/06-cycle-de-vie-client.md.
-- Même modèle que recevoir_lead : security definer, search_path vide, clé vérifiée par son
-- empreinte SHA-256 dans sources_leads (source « Academy », créée dans Réglages › Leads entrants).

-- ───────────── 1. Machines installées chez les clients ─────────────
create table public.equipements_clients (
  id              uuid primary key default gen_random_uuid(),
  compte_id       uuid not null references public.comptes(id),
  contact_id      uuid references public.contacts(id),        -- praticien principal (les autres : equipement_praticiens)
  produit_id      uuid not null references public.produits(id),
  opportunite_id  uuid references public.opportunites(id),    -- affaire d'origine
  numero_serie    text check (char_length(numero_serie) <= 80),
  installe_le     date,
  onboarde_le     date,                                       -- formation initiale sur site faite
  onboarde_par    uuid references public.equipe(id),          -- formateur / application specialist
  autonome_le     date,                                       -- point à 90 jours fait, praticien autonome
  statut          text not null default 'actif' check (statut in ('actif', 'repris', 'annule')),
  createur_id     uuid,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index equipements_clients_maj on public.equipements_clients (updated_at);
create unique index equipements_clients_serie on public.equipements_clients (produit_id, numero_serie) where numero_serie is not null;
alter table public.equipements_clients enable row level security;
-- Politiques RLS : reprendre celles de public.opportunites (périmètre commercial / superviseur / admin).

create trigger trg_equipements_updated before update on public.equipements_clients
for each row execute function public.set_updated_at();
create trigger trg_createur_equipements before insert on public.equipements_clients
for each row execute function private.figer_createur();     -- vérifier qu'il remplit bien createur_id ici
create trigger trg_hist_equipements after insert or update or delete on public.equipements_clients
for each row execute function private.journaliser();        -- historique, comme comptes et opportunites

-- ───────────── 2. Lecture par l'Academy (pull) ─────────────
-- Renvoie uniquement ce dont l'Academy a besoin : pas de montants, pas de notes commerciales.
create or replace function public.academy_equipements_depuis(p_cle text, p_depuis timestamptz)
returns table (
  equipement_id uuid, statut text, produit_id uuid, produit text, medical_only boolean,
  numero_serie text, installe_le date, compte_id uuid, compte text, ville text, categorie text,
  contact_id uuid, contact_nom text, contact_email text, maj timestamptz
)
language plpgsql security definer set search_path to '' as $$
declare v_src public.sources_leads;
begin
  select * into v_src from public.sources_leads s
   where s.cle_hash = encode(sha256(convert_to(coalesce(p_cle, ''), 'UTF8')), 'hex') and s.actif and s.nom = 'Academy';
  if v_src.id is null then raise exception 'cle_invalide' using errcode = '28000'; end if;
  return query
    select e.id, e.statut, p.id, p.nom, p.medical_only, e.numero_serie, e.installe_le,
           k.id, k.nom, k.ville, k.categorie,
           c.id, btrim(coalesce(c.prenom, '') || ' ' || coalesce(c.nom, '')), lower(btrim(c.email)),
           e.updated_at
      from public.equipements_clients e
      join public.produits p on p.id = e.produit_id
      join public.comptes k on k.id = e.compte_id
      left join public.contacts c on c.id = e.contact_id
     where e.updated_at > coalesce(p_depuis, '-infinity')
     order by e.updated_at
     limit 500;
end $$;
revoke all on function public.academy_equipements_depuis(text, timestamptz) from public;
grant execute on function public.academy_equipements_depuis(text, timestamptz) to anon, authenticated;

-- ───────────── 3. Praticiens par machine ─────────────
create table public.equipement_praticiens (
  equipement_id uuid not null references public.equipements_clients(id) on delete cascade,
  contact_id    uuid not null references public.contacts(id),
  principal     boolean not null default false,
  ajoute_le     timestamptz not null default now(),
  primary key (equipement_id, contact_id)
);
alter table public.equipement_praticiens enable row level security;

-- ───────────── 4. État de formation en ligne (écrit uniquement par l'Academy) ─────────────
create table public.formations_praticiens (
  contact_id        uuid not null references public.contacts(id),
  equipement_id     uuid references public.equipements_clients(id),  -- null pour un cours hors machine
  programme         text not null check (char_length(programme) <= 200),
  academy_cours_id  text not null,
  statut            text not null check (statut in ('non_commence', 'en_cours', 'termine', 'certifie')),
  progression       int not null default 0 check (progression between 0 and 100),
  derniere_activite timestamptz,
  echecs_quiz       int not null default 0,
  certificat        text,                                           -- n° de vérification public
  maj_le            timestamptz not null default now(),
  primary key (contact_id, academy_cours_id)
);
alter table public.formations_praticiens enable row level security;
-- Lecture : mêmes règles que la fiche client. Aucune écriture depuis l'application CRM.

create or replace function public.academy_progression(p_cle text, p_lignes jsonb)
returns int language plpgsql security definer set search_path to '' as $$
declare v_src public.sources_leads; v_n int := 0; L jsonb;
begin
  select * into v_src from public.sources_leads s
   where s.cle_hash = encode(sha256(convert_to(coalesce(p_cle, ''), 'UTF8')), 'hex') and s.actif and s.nom = 'Academy';
  if v_src.id is null then raise exception 'cle_invalide' using errcode = '28000'; end if;
  for L in select * from jsonb_array_elements(coalesce(p_lignes, '[]'::jsonb)) loop
    insert into public.formations_praticiens as f (contact_id, equipement_id, programme, academy_cours_id, statut, progression, derniere_activite, echecs_quiz, certificat, maj_le)
    values ((L->>'contact_id')::uuid, nullif(L->>'equipement_id', '')::uuid, left(L->>'programme', 200), L->>'cours_id',
            L->>'statut', coalesce((L->>'progression')::int, 0), (L->>'derniere_activite')::timestamptz,
            coalesce((L->>'echecs_quiz')::int, 0), nullif(L->>'certificat', ''), now())
    on conflict (contact_id, academy_cours_id) do update set
      statut = excluded.statut, progression = excluded.progression, derniere_activite = excluded.derniere_activite,
      echecs_quiz = excluded.echecs_quiz, certificat = excluded.certificat, equipement_id = coalesce(excluded.equipement_id, f.equipement_id), maj_le = now();
    v_n := v_n + 1;
  end loop;
  perform private.generer_suivis();
  return v_n;
end $$;
revoke all on function public.academy_progression(text, jsonb) from public;
grant execute on function public.academy_progression(text, jsonb) to anon, authenticated;

-- ───────────── 5. Seuils de suivi (Réglages › Suivi client) ─────────────
insert into public.reglages (cle, valeur) values ('suivi_client',
  '{"onboarding_jours": 7, "formation_non_commencee_jours": 14, "formation_arret_jours": 21, "echecs_quiz": 2, "point_jours": 90}'::jsonb)
on conflict (cle) do nothing;

-- ───────────── 6. Vue cycle de vie : une ligne par machine × praticien ─────────────
create or replace view public.v_parc_cycle_vie with (security_invoker = true) as
with r as (select valeur v from public.reglages where cle = 'suivi_client'),
prat as (
  select e.id equipement_id, coalesce(ep.contact_id, e.contact_id) contact_id
    from public.equipements_clients e
    left join public.equipement_praticiens ep on ep.equipement_id = e.id
   where e.statut = 'actif'
),
base as (
  select e.id equipement_id, e.compte_id, k.nom compte, k.commercial_id, e.produit_id, p.nom produit, e.numero_serie,
         e.installe_le, e.onboarde_le, e.autonome_le, pr.contact_id,
         btrim(coalesce(c.prenom, '') || ' ' || coalesce(c.nom, '')) praticien, nullif(btrim(c.email), '') email,
         f.statut f_statut, f.progression, f.derniere_activite, f.echecs_quiz, f.certificat, f.maj_le f_maj
    from prat pr
    join public.equipements_clients e on e.id = pr.equipement_id
    join public.comptes k on k.id = e.compte_id
    join public.produits p on p.id = e.produit_id
    left join public.contacts c on c.id = pr.contact_id
    left join lateral (select * from public.formations_praticiens f
                        where f.contact_id = pr.contact_id and (f.equipement_id = e.id or f.equipement_id is null)
                        order by (f.equipement_id = e.id) desc nulls last, f.maj_le desc limit 1) f on true
)
select b.*,
  case when b.autonome_le is not null then 'autonome'
       when b.f_statut = 'certifie' then 'certifie'
       when b.f_statut in ('en_cours', 'termine') then 'formation'
       when b.onboarde_le is not null then 'onboarde'
       when b.installe_le is not null then 'installe'
       else 'vendu' end as etape,
  case
    when b.contact_id is null or b.email is null then 'praticien_inconnu'
    when b.installe_le is not null and b.onboarde_le is null
         and b.installe_le < current_date - ((select (v->>'onboarding_jours')::int from r)) then 'onboarding_a_planifier'
    when b.onboarde_le is not null and coalesce(b.f_statut, 'non_commence') = 'non_commence'
         and b.onboarde_le < current_date - ((select (v->>'formation_non_commencee_jours')::int from r)) then 'formation_non_commencee'
    when b.f_statut = 'en_cours'
         and coalesce(b.derniere_activite, b.f_maj) < now() - make_interval(days => (select (v->>'formation_arret_jours')::int from r)) then 'formation_a_l_arret'
    when b.echecs_quiz >= (select (v->>'echecs_quiz')::int from r) and b.f_statut <> 'certifie' then 'evaluation_echouee'
    when b.f_statut = 'certifie' and b.autonome_le is null
         and b.f_maj < now() - make_interval(days => (select (v->>'point_jours')::int from r)) then 'point_90_jours'
  end as suivi
from base b;

-- ───────────── 7. Tâches de suivi (créées et fermées automatiquement) ─────────────
alter table public.activites add column suivi_regle text;   -- ex. 'formation_non_commencee:<equipement>:<contact>'
create unique index activites_suivi_ouvert on public.activites (suivi_regle) where suivi_regle is not null and statut = 'a_faire';

create or replace function private.generer_suivis() returns void language plpgsql security definer set search_path to '' as $$
begin
  -- Créer : une tâche par (règle, machine, praticien), sans doublon tant qu'elle est ouverte.
  insert into public.activites (compte_id, commercial_id, type, statut, date_activite, resume, suivi_regle, prioritaire)
  select v.compte_id, v.commercial_id, 'tache', 'a_faire', now(),
         case v.suivi
           when 'praticien_inconnu'       then 'Suivi client · compléter le praticien de ' || v.produit
           when 'onboarding_a_planifier'  then 'Suivi client · planifier l''onboarding ' || v.produit
           when 'formation_non_commencee' then 'Suivi client · ' || coalesce(nullif(v.praticien, ''), 'praticien') || ' n''a pas commencé la formation ' || v.produit
           when 'formation_a_l_arret'     then 'Suivi client · formation ' || v.produit || ' à l''arrêt (' || v.progression || ' %)'
           when 'evaluation_echouee'      then 'Suivi client · accompagnement pratique ' || v.produit
           when 'point_90_jours'          then 'Suivi client · point à 90 jours ' || v.produit
         end,
         v.suivi || ':' || v.equipement_id || ':' || coalesce(v.contact_id::text, '-'),
         v.suivi in ('onboarding_a_planifier', 'formation_a_l_arret')
    from public.v_parc_cycle_vie v
   where v.suivi is not null
     -- pas de nouvelle tâche si la même a été traitée il y a moins de 14 jours
     and not exists (select 1 from public.activites d
                      where d.suivi_regle = v.suivi || ':' || v.equipement_id || ':' || coalesce(v.contact_id::text, '-')
                        and d.statut in ('fait', 'non_effectuee')
                        and coalesce(d.fait_le, d.statue_le, d.created_at) > now() - interval '14 days')
  on conflict (suivi_regle) where suivi_regle is not null and statut = 'a_faire' do nothing;
  -- Fermer : la condition a disparu (ex. le praticien a commencé la formation).
  update public.activites a set statut = 'annulee', motif_statut = 'Condition de suivi levée automatiquement', statue_le = now()
   where a.suivi_regle is not null and a.statut = 'a_faire'
     and not exists (select 1 from public.v_parc_cycle_vie v
                      where v.suivi || ':' || v.equipement_id || ':' || coalesce(v.contact_id::text, '-') = a.suivi_regle);
end $$;
-- Chaque nuit à 6 h (heure du Maroc ≈ UTC+1) :
-- select cron.schedule('suivi-client', '0 5 * * *', $$select private.generer_suivis()$$);

-- ───────────── 8. Leads Academy ─────────────
-- Aucun changement : l'Academy appelle public.recevoir_lead(cle, lead) comme le site,
-- avec source = 'Academy' et parcours = 'formation' (inscription) ou 'masterclass' (achat de cours).

-- ───────────── 9. Rattrapage des affaires gagnées existantes ─────────────
-- Liste de travail pour l'ADV : affaires gagnées sans machine enregistrée.
-- select o.id, k.nom as compte, o.titre, o.created_at::date
--   from public.opportunites o join public.comptes k on k.id = o.compte_id
--  where o.issue = 'gagnee'
--    and not exists (select 1 from public.equipements_clients e where e.opportunite_id = o.id)
--  order by o.created_at desc;
