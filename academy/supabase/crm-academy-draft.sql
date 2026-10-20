-- CRM Cellulift ↔ Academy — BROUILLON, NON APPLIQUÉ.
-- À relire avec l'équipe CRM avant toute migration. Voir docs/05-integration-crm.md.
-- Même modèle que recevoir_lead : security definer, search_path vide, clé vérifiée par son
-- empreinte SHA-256 dans sources_leads (source « Academy », créée dans Réglages › Leads entrants).

-- ───────────── 1. Machines installées chez les clients ─────────────
create table public.equipements_clients (
  id              uuid primary key default gen_random_uuid(),
  compte_id       uuid not null references public.comptes(id),
  contact_id      uuid references public.contacts(id),        -- praticien à former
  produit_id      uuid not null references public.produits(id),
  opportunite_id  uuid references public.opportunites(id),    -- affaire d'origine
  numero_serie    text check (char_length(numero_serie) <= 80),
  installe_le     date,
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

-- ───────────── 3. Événements de formation renvoyés par l'Academy ─────────────
create table public.academy_evenements (
  id          uuid primary key default gen_random_uuid(),
  compte_id   uuid references public.comptes(id),
  contact_id  uuid references public.contacts(id),
  equipement_id uuid references public.equipements_clients(id),
  type        text not null check (type in ('compte_cree', 'formation_commencee', 'formation_terminee', 'certificat', 'achat_cours')),
  libelle     text not null check (char_length(libelle) <= 300),  -- ex. « HANOVER 5G — programme terminé (92 %) »
  recu_le     timestamptz not null default now()
);
alter table public.academy_evenements enable row level security;
-- Lecture : mêmes règles que la fiche client (le commercial voit les événements de ses comptes).

create or replace function public.academy_evenement(p_cle text, p_evt jsonb)
returns uuid language plpgsql security definer set search_path to '' as $$
declare v_src public.sources_leads; v_id uuid; v_eq public.equipements_clients;
begin
  select * into v_src from public.sources_leads s
   where s.cle_hash = encode(sha256(convert_to(coalesce(p_cle, ''), 'UTF8')), 'hex') and s.actif and s.nom = 'Academy';
  if v_src.id is null then raise exception 'cle_invalide' using errcode = '28000'; end if;
  select * into v_eq from public.equipements_clients where id = (p_evt->>'equipement_id')::uuid;
  insert into public.academy_evenements (compte_id, contact_id, equipement_id, type, libelle)
  values (coalesce(v_eq.compte_id, (p_evt->>'compte_id')::uuid), coalesce(v_eq.contact_id, (p_evt->>'contact_id')::uuid),
          v_eq.id, p_evt->>'type', left(coalesce(p_evt->>'libelle', ''), 300))
  returning id into v_id;
  return v_id;
end $$;
revoke all on function public.academy_evenement(text, jsonb) from public;
grant execute on function public.academy_evenement(text, jsonb) to anon, authenticated;

-- ───────────── 4. Leads Academy ─────────────
-- Aucun changement : l'Academy appelle public.recevoir_lead(cle, lead) comme le site,
-- avec source = 'Academy' et parcours = 'formation' (inscription) ou 'masterclass' (achat de cours).

-- ───────────── 5. Rattrapage des affaires gagnées existantes ─────────────
-- Liste de travail pour l'ADV : affaires gagnées sans machine enregistrée.
-- select o.id, k.nom as compte, o.titre, o.created_at::date
--   from public.opportunites o join public.comptes k on k.id = o.compte_id
--  where o.issue = 'gagnee'
--    and not exists (select 1 from public.equipements_clients e where e.opportunite_id = o.id)
--  order by o.created_at desc;
