"""Normalisation de texte, de noms et de nombres pour le benchmark vocal.

Tout est en bibliothèque standard Python pour que le benchmark se relance n'importe où.
"""
import re
import unicodedata
from difflib import SequenceMatcher

# ---------------------------------------------------------------- texte
_AR_DIACRITIQUES = re.compile(r"[ً-ْٰـ]")  # harakat, alif suscrit, tatweel
_PONCT = re.compile(r"[^\w\s]", re.UNICODE)


def normalise_arabe(t):
    t = _AR_DIACRITIQUES.sub("", t)
    t = re.sub("[إأآٱ]", "ا", t)
    t = t.replace("ى", "ي").replace("ة", "ه").replace("ؤ", "و").replace("ئ", "ي")
    t = t.replace("ڭ", "ك").replace("گ", "ك").replace("ڤ", "ف")
    # chiffres arabes orientaux -> occidentaux
    return t.translate(str.maketrans("٠١٢٣٤٥٦٧٨٩", "0123456789"))


def sans_accents(t):
    return "".join(c for c in unicodedata.normalize("NFD", t) if unicodedata.category(c) != "Mn")


def normalise_texte(t):
    """Pour WER/CER : minuscules, sans ponctuation ni accents latins, arabe normalisé."""
    t = normalise_arabe(t or "")
    t = t.replace("’", "'").lower()
    t = re.sub(r"\[[^\]]*\]", " ", t)  # [inaudible]
    t = sans_accents(t)
    t = _PONCT.sub(" ", t)
    return re.sub(r"\s+", " ", t).strip()


def mots(t):
    return normalise_texte(t).split()


# ---------------------------------------------------------------- noms
def normalise_nom(t, titres=()):
    t = normalise_texte(t)
    m = [w for w in t.split() if w not in titres]
    return " ".join(m)


def ressemblance(a, b):
    """0..1. Compare aussi sans espaces (« Ben Nani » / « Bennani »)."""
    if not a or not b:
        return 0.0
    r1 = SequenceMatcher(None, a, b).ratio()
    r2 = SequenceMatcher(None, a.replace(" ", ""), b.replace(" ", "")).ratio()
    return max(r1, r2)


# ---------------------------------------------------------------- nombres
_UNITES_FR = {
    "zero": 0, "un": 1, "une": 1, "deux": 2, "trois": 3, "quatre": 4, "cinq": 5, "six": 6, "sept": 7, "huit": 8,
    "neuf": 9, "dix": 10, "onze": 11, "douze": 12, "treize": 13, "quatorze": 14, "quinze": 15, "seize": 16,
    "vingt": 20, "vingts": 20, "trente": 30, "quarante": 40, "cinquante": 50, "soixante": 60, "septante": 70,
    "huitante": 80, "nonante": 90,
}
# darija (graphie arabe normalisée + quelques graphies latines courantes)
_UNITES_DA = {
    "واحد": 1, "جوج": 2, "زوج": 2, "تلاته": 3, "ثلاثه": 3, "ربعه": 4, "اربعه": 4, "خمسه": 5, "سته": 6, "سبعه": 7,
    "تمنيه": 8, "ثمانيه": 8, "تسعه": 9, "عشره": 10, "حداش": 11, "طناش": 12, "تلطاش": 13, "ربعطاش": 14,
    "خمسطاش": 15, "سطاش": 16, "سبعطاش": 17, "تمنطاش": 18, "تسعطاش": 19, "عشرين": 20, "تلاتين": 30, "ثلاثين": 30,
    "ربعين": 40, "اربعين": 40, "خمسين": 50, "ستين": 60, "سبعين": 70, "تمانين": 80, "ثمانين": 80, "تسعين": 90,
    "مايه": 100, "ميه": 100, "ميتين": 200, "تلتميه": 300, "ربعميه": 400, "خمسميه": 500, "ستميه": 600,
    "سبعميه": 700, "تمنميه": 800, "تسعميه": 900,
    "wa7ed": 1, "jouj": 2, "zouj": 2, "tlata": 3, "rb3a": 4, "khamsa": 5, "setta": 6, "sb3a": 7, "tmnya": 8,
    "ts3ud": 9, "3achra": 10, "3achrin": 20, "tlatin": 30, "rb3in": 40, "khamsin": 50, "settin": 60, "sb3in": 70,
    "tmanin": 80, "ts3in": 90, "mya": 100, "miya": 100, "mitin": 200,
}
_MULT = {"cent": 100, "cents": 100, "mille": 1000, "mil": 1000, "k": 1000, "million": 1_000_000, "millions": 1_000_000,
         "الف": 1000, "الاف": 1000, "alf": 1000, "مليون": 1_000_000, "ملايين": 1_000_000, "mlyoun": 1_000_000, "melyoun": 1_000_000}


def nombres(t):
    """Extrait les nombres d'un texte : chiffres (240 000, 240.000, 285k, 2,5 millions), français en lettres,
    darija. Ne résout PAS le piège des centimes (« 28 مليون ») : c'est le rôle de la couche B, et la fiche
    de référence porte la valeur en MAD."""
    t = normalise_arabe(t or "").lower().replace("’", "'").replace("-", " ")
    t = sans_accents(t)
    out = []
    # 1) chiffres avec séparateurs de milliers, décimales, suffixes
    RX = r"(\d{1,3}(?:[ .\u202f\u00a0]\d{3})+|\d+(?:[.,]\d+)?)\s*(k|mille|mil|millions|million|الف|مليون|alf|mlyoun)?\b"
    for m in re.finditer(RX, t):
        brut, suf = m.group(1), m.group(2)
        if re.fullmatch(r"\d{1,3}(?:[ .\u202f\u00a0]\d{3})+", brut):
            v = float(re.sub(r"[ .  ]", "", brut))
        else:
            v = float(brut.replace(",", "."))
        if suf:
            v *= _MULT[suf]
        out.append(int(round(v)))
    # 2) nombres en lettres (français et darija), séquences de mots numériques
    t = re.sub(RX, " ", t)
    t = re.sub(r"quatre vingts?", "quatrevingt", t)
    toks = re.findall(r"[\w']+", t)
    cur, total, vu = 0, 0, False

    def vide():
        nonlocal cur, total, vu
        if vu:
            out.append(total + cur)
        cur, total, vu = 0, 0, False

    for w in toks:
        w2 = w[1:] if w.startswith("و") and (w[1:] in _UNITES_DA or w[1:] in _MULT) else w  # « و ربعين »
        if w in ("et", "و"):
            continue
        if w2 == "quatrevingt":
            cur += 80
            vu = True
        elif w2 in _UNITES_FR or w2 in _UNITES_DA:
            cur += _UNITES_FR.get(w2, _UNITES_DA.get(w2))
            vu = True
        elif w2 in ("cent", "cents"):
            cur = (cur or 1) * 100
            vu = True
        elif w2 in _MULT and _MULT[w2] >= 1000:
            if w2 == "k" and not vu:
                continue
            total += (cur or 1) * _MULT[w2]
            cur = 0
            vu = True
        else:
            vide()
    vide()
    return out


def contient_terme(hyp_norm, variantes):
    """Vrai si l'une des graphies acceptables apparaît dans l'hypothèse normalisée."""
    h = " " + hyp_norm + " "
    for v in variantes:
        v = normalise_texte(v)
        if v and (" " + v + " ") in h:
            return True
        if v and len(v) >= 6 and v.replace(" ", "") in h.replace(" ", ""):
            return True
    return False
