"""Normalisation métier des montants exprimés à la marocaine.

S'applique APRÈS l'extraction, sur chaque montant extrait, à partir de sa phrase source.
Ne modifie jamais la transcription, ni la valeur extraite : elle ajoute une proposition et,
s'il existe une ambiguïté, met l'élément « à vérifier » pour que le commercial confirme.

Usages couverts (config/monnaie.json) :
  « 28 مليون » / « 28 mlyoun » sans unité   → 28 millions de centimes = 280 000 MAD (ou 28 000 000 MAD)
  « 2 مليار » sans unité                     → 2 milliards de centimes = 20 000 000 MAD
  « ألف ريال » / « 1000 rial »               → 1 000 ryals = 50 MAD (1 MAD = 20 ryals)
  « 500 centimes » / « سنتيم »                → 5 MAD
  « 240 » seul, dans un montant              → 240 000 MAD (milliers sous-entendus) ou 240 MAD
  « 240 000 درهم », « 2 millions de dirhams » → MAD explicite, pas d'ambiguïté
"""
import json
import re
from pathlib import Path

from normalise import nombres, normalise_arabe, sans_accents

RACINE = Path(__file__).resolve().parent.parent
_CFG = None


def cfg():
    global _CFG
    if _CFG is None:
        _CFG = json.loads((RACINE / "config" / "monnaie.json").read_text(encoding="utf-8"))
    return _CFG


def _texte(t):
    t = sans_accents(normalise_arabe(t or "")).lower().replace("’", "'")
    return re.sub(r"[،,;:!?«»\"()]", " ", t)


def _a(mots, t):
    return any(re.search(r"(?<!\w)" + re.escape(m) + r"(?!\w)", t) for m in mots)


def interpretations(source):
    """Liste des lectures possibles (valeur MAD, règle) du montant cité dans `source`."""
    c = cfg()["unites"]
    t = _texte(source)
    ns = nombres(source)
    if not ns:
        return []
    n = max(ns)
    mad, ryal, cent = _a(c["dirham"], t), _a(c["ryal"], t), _a(c["centime"], t)
    mill, mrd, alf = _a(c["million"], t), _a(c["milliard"], t), _a(c["mille"], t)
    # nombres() a déjà appliqué les multiplicateurs (mille, million…) : on repart de la valeur dite
    if mrd:
        base = n * 1_000_000_000 if n < 1000 else n
        if mad:
            return [(base, "milliard de dirhams (unité explicite)")]
        return [(base // 100, "milliard sans unité lu en centimes (usage marocain)")] + ([] if cent else [(base, "milliard lu en dirhams")])
    if mill:
        base = n
        if mad:
            return [(base, "million de dirhams (unité explicite)")]
        if cent:
            return [(base // 100, "million de centimes (unité explicite)")]
        return [(base // 100, "million sans unité lu en centimes (usage marocain)"), (base, "million lu en dirhams")]
    if ryal:
        return [(round(n / 20), "ryals convertis en dirhams (1 MAD = 20 ryals)")]
    if cent:
        return [(round(n / 100), "centimes convertis en dirhams")]
    if mad or alf:
        return [(n, "dirhams" if mad else "milliers de dirhams")]
    # nombre seul : milliers sous-entendus, ou valeur telle quelle
    out = []
    if n < 10_000:
        out.append((n * 1000, "nombre seul lu en milliers de dirhams"))
    out.append((n, "nombre seul lu en dirhams"))
    return out


def plage(contexte_visite):
    p = cfg()["plage_plausible_mad"]
    return p["min"], p["max"]


def normaliser_montant(item, contexte_visite=None):
    """Retourne une copie de l'élément avec, si utile, `valeur_mad_proposee`, `normalisation_monetaire`
    et une confiance abaissée à « a_verifier ». Ne touche jamais `valeur_mad` ni `source`."""
    it = dict(item)
    src = it.get("source") or ""
    lect = interpretations(src)
    if not lect:
        return it
    lo, hi = plage(contexte_visite)
    plaus = [(v, r) for v, r in lect if lo <= v <= hi] or lect
    ref = ((contexte_visite or {}).get("affaire") or {}).get("montant_mad")
    if ref and len(plaus) > 1:
        plaus = sorted(plaus, key=lambda x: abs(x[0] - ref))
    try:
        val = int(round(float(it.get("valeur_mad"))))
    except Exception:
        val = None
    ambigu = len(plaus) > 1
    implicite = any("sans unité" in r or "nombre seul" in r for _, r in plaus)
    prop = plaus[0][0]
    trace = {"source": src, "lectures": [{"valeur_mad": v, "regle": r} for v, r in lect],
             "plausibles": [v for v, _ in plaus], "proposition": prop, "ambigu": ambigu}
    if val == prop and not ambigu:
        trace["decision"] = "valeur extraite conforme"
        it["normalisation_monetaire"] = trace
        return it
    if val != prop:
        it["valeur_mad_proposee"] = prop
        trace["decision"] = f"valeur extraite {val} : proposition {prop} à confirmer"
    else:
        trace["decision"] = "lectures multiples : confirmation demandée"
    if ambigu or val != prop or implicite:
        it["confiance"] = "a_verifier"
    it["normalisation_monetaire"] = trace
    return it


def normaliser_extraction(sortie, contexte_visite=None):
    if not isinstance(sortie, dict) or not isinstance(sortie.get("montants"), list):
        return sortie
    out = dict(sortie)
    out["montants"] = [normaliser_montant(m, contexte_visite) if isinstance(m, dict) else m for m in sortie["montants"]]
    return out
