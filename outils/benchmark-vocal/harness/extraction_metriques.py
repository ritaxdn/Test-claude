"""Couche B : transcription + contexte CRM -> extraction structurée, comparée à la fiche de référence.

Chaque élément extrait reçoit un statut :
  correct  : même information, bonne valeur
  erreur   : même information (même personne, même montant visé…) mais valeur fausse
  invente  : rien de tel n'a été dit (hallucination)
Chaque élément attendu non retrouvé est « manque ».
"""
from datetime import date
from normalise import normalise_nom, normalise_texte, ressemblance

LISTES = ["contacts", "technologies", "besoins", "signaux", "objections", "concurrents", "montants",
          "financement", "decideurs", "timing", "actions_perso"]
UNIQUES = ["client", "interet", "prochaine_etape", "changement_etape", "signal_terrain"]
CONF_OK = {"confiant", "a_verifier"}


def en_liste(v):
    if v is None:
        return []
    return v if isinstance(v, list) else [v]


class Comparateur:
    def __init__(self, grille, contexte):
        a = grille["appariement"]
        self.s_ok, self.s_meme, self.kw_min = a["nom_correct"], a["nom_meme_entite"], a["mots_cles_min"]
        self.titres = set(a["titres_ignores"])
        self.alias = {}
        for c in contexte.get("concurrents_connus", []):
            for x in [c["marque"]] + c.get("alias", []):
                self.alias[normalise_nom(x)] = normalise_nom(c["marque"])

    # -- briques
    def nom(self, a, b):
        r = ressemblance(normalise_nom(a or "", self.titres), normalise_nom(b or "", self.titres))
        return "egal" if r >= self.s_ok else "meme" if r >= self.s_meme else None

    def mots_cles(self, gt, texte):
        kws = gt.get("mots_cles") or []
        if not kws:
            return "egal" if self.nom(gt.get("texte"), texte) else None
        t = normalise_texte(texte or "")
        n = sum(1 for k in kws if normalise_texte(k) in t)
        return "egal" if n / len(kws) >= self.kw_min else None

    @staticmethod
    def jour(s):
        try:
            return date.fromisoformat(str(s)[:10])
        except Exception:
            return None

    # -- règles par type (gt, ext) -> "egal" | "meme" | None
    def r_nom(self, g, e):
        return self.nom(g.get("valeur"), e.get("valeur"))

    def r_contact(self, g, e):
        r = self.nom(g.get("nom"), e.get("nom"))
        if r == "egal" and bool(g.get("nouveau")) != bool(e.get("nouveau")) and "nouveau" in g:
            return "meme"
        return r

    def r_montant(self, g, e):
        try:
            # la proposition de la normalisation monétaire est ce que le commercial confirme à l'écran
            vg = int(round(float(g["valeur_mad"])))
            ve = int(round(float(e.get("valeur_mad_proposee", e.get("valeur_mad")))))
        except Exception:
            return None
        if vg == ve:
            return "egal" if g.get("objet") == e.get("objet") else "meme"
        return "meme" if g.get("objet") == e.get("objet") else None

    def r_etape(self, g, e):
        ok = g.get("type") == e.get("type") and str(g.get("date")) == str(e.get("date"))
        if g.get("heure"):
            ok = ok and str(g.get("heure"))[:5] == str(e.get("heure") or "")[:5]
        return "egal" if ok else "meme"

    def r_pipeline(self, g, e):
        return "egal" if normalise_texte(g.get("vers")) == normalise_texte(e.get("vers")) else "meme"

    def r_decideur(self, g, e):
        r = self.nom(g.get("nom"), e.get("nom"))
        if r == "egal" and g.get("role_achat") != e.get("role_achat"):
            return "meme"
        return r

    def r_objection(self, g, e):
        return "egal" if g.get("type") == e.get("type") else None

    def r_concurrent(self, g, e):
        a, b = normalise_nom(g.get("marque", "")), normalise_nom(e.get("marque", ""))
        a, b = self.alias.get(a, a), self.alias.get(b, b)
        return "egal" if a == b else self.nom(a, b)

    def r_financement(self, g, e):
        if g.get("duree_mois") in (None, ""):
            return "egal"
        return "egal" if str(g.get("duree_mois")) == str(e.get("duree_mois")) else "meme"

    def r_periode(self, g, e):
        g0, g1, e0, e1 = self.jour(g.get("debut")), self.jour(g.get("fin")), self.jour(e.get("debut")), self.jour(e.get("fin"))
        if not (g0 and g1 and e0 and e1):
            return None
        inter = (min(g1, e1) - max(g0, e0)).days + 1
        court = min((g1 - g0).days, (e1 - e0).days) + 1
        if inter > 0 and inter / max(1, court) >= 0.5:
            return "egal"
        return "meme" if abs((g0 - e0).days) <= 60 else None

    def r_technologie(self, g, e):
        if g.get("machine_catalogue") and g.get("machine_catalogue") == e.get("machine_catalogue"):
            return "egal"
        return self.nom(g.get("valeur"), e.get("valeur") or e.get("machine_catalogue"))

    def r_action(self, g, e):
        if self.mots_cles(g, e.get("texte")) != "egal":
            return None
        if g.get("echeance") and str(g.get("echeance")) != str(e.get("echeance")):
            return "meme"
        return "egal"

    def r_mots_cles(self, g, e):
        return self.mots_cles(g, e.get("texte") or e.get("valeur"))

    def r_valeur(self, g, e):
        return "egal" if g.get("valeur") == e.get("valeur") else "meme"

    def comparer(self, regle, g, e):
        return getattr(self, "r_" + regle)(g, e)


def source_trouvee(source, transcription):
    """La citation fournie par le système existe-t-elle dans le texte qu'il a reçu ? (≥ 80 % des mots)"""
    m = normalise_texte(source or "").split()
    if not m:
        return False
    t = set(normalise_texte(transcription or "").split())
    return sum(1 for w in m if w in t) / len(m) >= 0.8


def apparier(cmp, regle, gts, exts):
    """Appariement glouton : d'abord les égalités, puis les « même information, valeur fausse »."""
    paires, g_libres, e_libres = [], list(range(len(gts))), list(range(len(exts)))
    for niveau in ("egal", "meme"):
        for gi in list(g_libres):
            for ei in list(e_libres):
                if cmp.comparer(regle, gts[gi], exts[ei]) == niveau:
                    paires.append((gi, ei, niveau))
                    g_libres.remove(gi)
                    e_libres.remove(ei)
                    break
    return paires, g_libres, e_libres


def evaluer_extraction(fiche, sortie, grille, contexte, transcription):
    cmp = Comparateur(grille, contexte)
    att = fiche.get("attendu", {})
    lignes = []
    for typ, conf in grille["types"].items():
        gts = en_liste(att.get(typ))
        tout = en_liste((sortie or {}).get(typ))
        exts = [e for e in tout if isinstance(e, dict) and e.get("confiance", "confiant") in CONF_OK]
        paires, gl, el = apparier(cmp, conf["regle"], gts, exts)
        base = {"type": typ, "categorie": conf["categorie"]}
        for gi, ei, niv in paires:
            e = exts[ei]
            lignes.append(dict(base, statut="correct" if niv == "egal" else "erreur", attendu=gts[gi], extrait=e,
                               confiance=e.get("confiance", "confiant"), score=e.get("score"),
                               source_ok=source_trouvee(e.get("source"), transcription)))
        for gi in gl:
            lignes.append(dict(base, statut="manque", attendu=gts[gi], extrait=None, confiance=None, score=None, source_ok=None))
        for ei in el:
            e = exts[ei]
            lignes.append(dict(base, statut="invente", attendu=None, extrait=e, confiance=e.get("confiance", "confiant"),
                               score=e.get("score"), source_ok=source_trouvee(e.get("source"), transcription)))
    return lignes


def effort(lignes, sortie, grille, latence_s):
    m = grille["modele_effort"]
    compte_manque = set(grille["manquants_comptes_comme_correction"])
    montres = [l for l in lignes if l["extrait"] is not None]
    a_confirmer = sum(1 for l in montres if l["confiance"] == "a_verifier" and l["statut"] == "correct")
    corrections = sum(1 for l in montres if l["statut"] in ("erreur", "invente"))
    ajouts = sum(1 for l in lignes if l["statut"] == "manque" and l["categorie"] in compte_manque)
    questions = len((sortie or {}).get("questions") or [])
    silencieuses = sum(1 for l in montres if l["statut"] in ("erreur", "invente") and l["confiance"] == "confiant")
    silencieuses_crit = sum(1 for l in montres if l["statut"] in ("erreur", "invente") and l["confiance"] == "confiant" and l["categorie"] == "critique")
    revue = (m["base"] + m["lecture_par_element"] * len(montres) + m["confirmation"] * a_confirmer
             + m["correction"] * corrections + m["ajout_manquant"] * ajouts + m["question"] * questions)
    return {"elements_montres": len(montres), "confirmations": a_confirmer, "corrections": corrections + ajouts,
            "corrections_valeurs": corrections, "ajouts": ajouts, "questions": questions,
            "erreurs_silencieuses": silencieuses, "erreurs_silencieuses_critiques": silencieuses_crit,
            "acceptable_sans_modif": corrections + ajouts == 0,
            "temps_revue_s": revue, "temps_total_s": revue + (latence_s or 0)}
