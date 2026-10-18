"""Adaptateurs génériques. Aucun fournisseur n'est câblé ici : chaque architecture candidate se branche
par une commande (script local, CLI d'un fournisseur, notebook exporté…) ou par des sorties déjà produites.

STT   : oracle | fichier | commande | aucun
Extr. : fichier | commande
"""
import json
import os
import shlex
import subprocess
import time
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent


def _lire_sortie(chemin):
    p = Path(chemin)
    if not p.exists():
        raise FileNotFoundError(f"sortie absente : {p}")
    txt = p.read_text(encoding="utf-8")
    try:
        return json.loads(txt)
    except json.JSONDecodeError:
        return {"texte": txt}


def _commande(modele, valeurs, timeout):
    cmd = modele.format(**{k: shlex.quote(str(v)) for k, v in valeurs.items()})
    t0 = time.monotonic()
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
    dt = time.monotonic() - t0
    if r.returncode != 0:
        raise RuntimeError(f"commande en échec ({r.returncode}) : {cmd}\n{r.stderr[-2000:]}")
    return dt


def stt(cfg, fiche, audio, dossier_travail):
    a = cfg.get("adaptateur")
    vid = fiche["id"]
    if a == "oracle":
        return {"texte": fiche["transcription_reference"], "latence_s": 0.0, "cout_usd": 0.0, "oracle": True}
    if a == "aucun":
        return None
    if a == "fichier":
        base = RACINE / cfg["dossier"] / vid
        for ext in (".json", ".txt"):
            if base.with_suffix(ext).exists():
                return _lire_sortie(base.with_suffix(ext))
        raise FileNotFoundError(f"aucune transcription pour {vid} dans {cfg['dossier']}")
    if a == "commande":
        sortie = Path(dossier_travail) / f"{vid}.stt.out"
        dt = _commande(cfg["commande"], {"audio": audio, "sortie": sortie, "id": vid}, cfg.get("timeout_s", 600))
        out = _lire_sortie(sortie)
        out.setdefault("latence_s", round(dt, 2))
        return out
    raise ValueError(f"adaptateur STT inconnu : {a}")


def rendre_prompt(fiche, contexte, transcription):
    gabarit = (RACINE / "prompts" / "extraction.md").read_text(encoding="utf-8")
    gabarit = gabarit.split("---", 1)[1] if "---" in gabarit else gabarit
    crm = {"catalogue": [p["nom"] for p in contexte.get("catalogue", [])],
           "technologies": contexte.get("technologies", []),
           "concurrents_connus": [c["marque"] for c in contexte.get("concurrents_connus", [])],
           "showrooms": contexte.get("showrooms", []), "etapes_pipeline": contexte.get("etapes_pipeline", []),
           "roles_achat": contexte.get("roles_achat", [])}
    return (gabarit.replace("{{date_visite}}", fiche["date_visite"])
            .replace("{{contexte_crm}}", json.dumps(crm, ensure_ascii=False))
            .replace("{{contexte_visite}}", json.dumps(fiche.get("contexte", {}), ensure_ascii=False))
            .replace("{{transcription}}", transcription or ""))


def extraction(cfg, fiche, contexte, transcription, audio, dossier_travail):
    a = cfg.get("adaptateur")
    vid = fiche["id"]
    if a == "fichier":
        return _lire_sortie(RACINE / cfg["dossier"] / f"{vid}.json")
    if a == "commande":
        d = Path(dossier_travail)
        f_tr, f_ctx, f_pr, sortie = d / f"{vid}.transcription.txt", d / f"{vid}.contexte.json", d / f"{vid}.prompt.md", d / f"{vid}.extraction.out"
        f_tr.write_text(transcription or "", encoding="utf-8")
        f_ctx.write_text(json.dumps({"crm": contexte, "visite": fiche.get("contexte", {}), "date_visite": fiche["date_visite"]}, ensure_ascii=False), encoding="utf-8")
        f_pr.write_text(rendre_prompt(fiche, contexte, transcription), encoding="utf-8")
        dt = _commande(cfg["commande"], {"audio": audio, "transcription": f_tr, "contexte": f_ctx, "prompt": f_pr, "sortie": sortie, "id": vid}, cfg.get("timeout_s", 300))
        out = _lire_sortie(sortie)
        out.setdefault("latence_s", round(dt, 2))
        return out
    raise ValueError(f"adaptateur d'extraction inconnu : {a}")


def empreinte(*chemins):
    """Empreinte des fichiers qui définissent une exécution (consigne, grille, contexte) pour la reproductibilité."""
    import hashlib
    h = hashlib.sha256()
    for c in chemins:
        p = RACINE / c
        if p.exists():
            h.update(p.read_bytes())
    return h.hexdigest()[:12]


def env_requis(cfg):
    """Variables d'environnement attendues par une architecture (clés API). Jamais écrites dans les résultats."""
    manq = [v for v in cfg.get("variables_env", []) if not os.environ.get(v)]
    return manq
