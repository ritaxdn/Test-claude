"""Couche A : audio -> transcription. WER/CER en contexte, et surtout le rappel des termes critiques."""
from normalise import normalise_texte, nombres, contient_terme


def distance(a, b):
    """Distance d'édition (Levenshtein) entre deux séquences."""
    prev = list(range(len(b) + 1))
    for i, x in enumerate(a, 1):
        cur = [i]
        for j, y in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (x != y)))
        prev = cur
    return prev[-1]


def wer_cer(ref, hyp):
    r, h = normalise_texte(ref), normalise_texte(hyp)
    rw, hw = r.split(), h.split()
    wer = distance(rw, hw) / max(1, len(rw))
    rc, hc = r.replace(" ", ""), h.replace(" ", "")
    cer = distance(list(rc), list(hc)) / max(1, len(rc))
    return round(wer, 4), round(cer, 4)



def termes_critiques(fiche, hyp):
    """Pour chaque terme critique de la fiche : retrouvé ou non dans la transcription automatique.
    Montant : retrouvé si la valeur prononcée apparaît parmi les nombres lus dans l'hypothèse
    (la conversion en MAD, centimes compris, est jugée en couche B)."""
    hn = normalise_texte(hyp)
    nums = set(nombres(hyp))
    out = []
    for t in fiche.get("termes_critiques", []):
        var = [t["terme"]] + t.get("variantes", [])
        if t["categorie"] == "montant":
            prononces = set()
            for v in var:
                prononces |= set(nombres(v))
            ok = bool(prononces & nums) or contient_terme(hn, var)
            vu = sorted(nums)[:8]
        else:
            ok = contient_terme(hn, var)
            vu = None
        out.append({"terme": t["terme"], "categorie": t["categorie"], "trouve": ok,
                    "nombres_entendus": vu})
    return out


def evaluer_stt(fiche, sortie):
    hyp = (sortie or {}).get("texte", "")
    wer, cer = wer_cer(fiche["transcription_reference"], hyp)
    return {"wer": wer, "cer": cer, "termes": termes_critiques(fiche, hyp), "texte": hyp,
            "latence_s": (sortie or {}).get("latence_s"), "cout_usd": (sortie or {}).get("cout_usd")}
