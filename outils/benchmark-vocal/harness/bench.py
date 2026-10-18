#!/usr/bin/env python3
"""Benchmark vocal Cellulift : transcription (couche A) + compréhension commerciale (couche B).

  python3 harness/bench.py couverture                     vérifie le manifeste contre les cibles
  python3 harness/bench.py fiches                         contrôle les fiches de référence
  python3 harness/bench.py lancer --archi A-stt-general   produit les sorties d'une architecture
  python3 harness/bench.py evaluer --run 2026-11-04       compare toutes les architectures d'une exécution
  python3 harness/bench.py demo                           démonstration de bout en bout sur données fictives

Aucune architecture n'est appelée sans `actif: true` dans config/architectures.json.
"""
import argparse
import csv
import json
import statistics
import sys
import time
from collections import Counter, defaultdict
from datetime import date, datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import adapters  # noqa: E402
import monnaie  # noqa: E402
from extraction_metriques import evaluer_extraction, effort, en_liste  # noqa: E402
from stt_metriques import evaluer_stt  # noqa: E402
import rapport  # noqa: E402

RACINE = Path(__file__).resolve().parent.parent
BRUT = False  # --brut : évaluer les extractions sans la normalisation monétaire


def charger(chemin):
    return json.loads((RACINE / chemin).read_text(encoding="utf-8"))


def manifeste(dossier):
    with open(RACINE / dossier / "manifeste.csv", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def fiche(dossier, vid):
    p = RACINE / dossier / "fiches" / f"{vid}.json"
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else None


# ------------------------------------------------------------------ couverture
def cmd_couverture(a):
    cib = charger("config/couverture.json")
    rows = manifeste(a.dataset)
    ok = True
    print(f"Vocaux prévus : {len(rows)} (cible {cib['total_cible']})")
    coms = {r["commercial"] for r in rows}
    print(f"Commerciaux : {len(coms)} (minimum {cib['commerciaux_min']})")
    ok &= len(coms) >= cib["commerciaux_min"]
    for dim in ("langue", "environnement"):
        c = Counter(r[dim] for r in rows)
        for k, v in cib[dim].items():
            etat = "ok" if c[k] >= v else "MANQUE"
            ok &= c[k] >= v
            print(f"  {dim:13} {k:10} {c[k]:3} / {v}  {etat}")
    sit = Counter(s for r in rows for s in r["situations"].split("|") if s)
    for s in cib["situations"]:
        etat = "ok" if sit[s] >= cib["situations_min"] else "MANQUE"
        ok &= sit[s] >= cib["situations_min"]
        print(f"  situation    {s:22} {sit[s]:3}  {etat}")
    hors = [r["id"] for r in rows if r["duree_reelle_s"] and not (cib["duree_s"]["min"] <= float(r["duree_reelle_s"]) <= cib["duree_s"]["max"])]
    if hors:
        print("Durées hors cible :", ", ".join(hors))
    print("Couverture complète." if ok else "Couverture incomplète : voir MANQUE.")
    return 0 if ok else 1


# ------------------------------------------------------------------ contrôle des fiches
def cmd_fiches(a):
    from extraction_metriques import source_trouvee
    grille = charger("config/grille.json")
    err = 0
    for r in manifeste(a.dataset):
        f = fiche(a.dataset, r["id"])
        if not f:
            print(f"{r['id']} : pas encore de fiche")
            continue
        pb = []
        for k in ("id", "date_visite", "contexte", "transcription_reference", "sens_fr", "termes_critiques", "attendu", "validation"):
            if k not in f:
                pb.append(f"champ manquant : {k}")
        v = f.get("validation", {})
        if not v.get("relu_par") or v.get("relu_par") == v.get("redige_par"):
            pb.append("fiche non relue par une seconde personne")
        for typ in grille["types"]:
            for it in en_liste(f.get("attendu", {}).get(typ)):
                src = it.get("source")
                if src and not source_trouvee(src, f.get("transcription_reference", "")):
                    pb.append(f"{typ} : source introuvable dans la transcription « {src[:50]} »")
                if typ in ("prochaine_etape", "timing", "actions_perso"):
                    for d in ("date", "debut", "fin", "echeance"):
                        if it.get(d):
                            try:
                                date.fromisoformat(it[d])
                            except ValueError:
                                pb.append(f"{typ}.{d} n'est pas une date AAAA-MM-JJ : {it[d]}")
                if typ == "montants" and not isinstance(it.get("valeur_mad"), (int, float)):
                    pb.append("montant sans valeur_mad numérique")
        for p in pb:
            print(f"{r['id']} : {p}")
        err += len(pb)
    print("Fiches conformes." if not err else f"{err} problème(s).")
    return 0 if not err else 1


# ------------------------------------------------------------------ exécution d'une architecture
def cmd_lancer(a):
    archs = {x["id"]: x for x in charger(a.config)["architectures"]}
    arch = archs.get(a.archi)
    if not arch:
        sys.exit(f"architecture inconnue : {a.archi}")
    if not arch.get("actif") and not a.forcer:
        sys.exit(f"{a.archi} n'est pas active (actif: false dans {a.config}).")
    manq = adapters.env_requis(arch)
    if manq:
        sys.exit("variables d'environnement manquantes : " + ", ".join(manq))
    contexte = charger(f"{a.dataset}/contexte/crm.json")
    run = a.run or datetime.now().strftime("%Y-%m-%d")
    out = RACINE / a.resultats / run / arch["id"]
    (out / "stt").mkdir(parents=True, exist_ok=True)
    (out / "extraction").mkdir(parents=True, exist_ok=True)
    (out / "travail").mkdir(parents=True, exist_ok=True)
    n = 0
    for r in manifeste(a.dataset):
        if a.seulement and r["id"] not in a.seulement.split(","):
            continue
        f = fiche(a.dataset, r["id"])
        if not f:
            continue
        audio = RACINE / a.dataset / r["audio"]
        besoin_audio = arch["stt"]["adaptateur"] == "commande" or (arch["stt"]["adaptateur"] == "aucun" and arch["extraction"]["adaptateur"] == "commande")
        if besoin_audio and not audio.exists():
            print(f"{r['id']} : audio absent, ignoré")
            continue
        s = adapters.stt(arch["stt"], f, audio, out / "travail")
        if s is not None:
            (out / "stt" / f"{r['id']}.json").write_text(json.dumps(s, ensure_ascii=False, indent=1), encoding="utf-8")
        texte = (s or {}).get("texte", "")
        e = adapters.extraction(arch["extraction"], f, contexte, texte, audio, out / "travail")
        # sortie brute conservée telle quelle ; la normalisation monétaire ajoute ses propositions à côté
        (out / "extraction_brute").mkdir(exist_ok=True)
        (out / "extraction_brute" / f"{r['id']}.json").write_text(json.dumps(e, ensure_ascii=False, indent=1), encoding="utf-8")
        if arch.get("normalisation_monetaire", True):
            e = monnaie.normaliser_extraction(e, f.get("contexte"))
        (out / "extraction" / f"{r['id']}.json").write_text(json.dumps(e, ensure_ascii=False, indent=1), encoding="utf-8")
        n += 1
        print(f"{r['id']} ok")
    meta = {"architecture": arch, "date": datetime.now().isoformat(timespec="seconds"), "vocaux": n,
            "empreintes": {"consigne": adapters.empreinte("prompts/extraction.md"),
                           "grille": adapters.empreinte("config/grille.json"),
                           "contexte": adapters.empreinte(f"{a.dataset}/contexte/crm.json")}}
    (out / "execution.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{n} vocal(aux) traités → {out.relative_to(RACINE)}")


# ------------------------------------------------------------------ évaluation
def calibration(lignes, grille):
    """Par type : précision par étiquette de confiance, et seuil de score minimal atteignant la précision cible."""
    res = {}
    for typ, conf in grille["types"].items():
        L = [l for l in lignes if l["type"] == typ and l["extrait"] is not None]
        if not L:
            continue
        par_lab = {}
        for lab in ("confiant", "a_verifier"):
            M = [l for l in L if l["confiance"] == lab]
            if M:
                par_lab[lab] = {"n": len(M), "precision": round(sum(l["statut"] == "correct" for l in M) / len(M), 3)}
        S = [l for l in L if isinstance(l.get("score"), (int, float))]
        seuil = None
        courbe = []
        if S:
            nb_ok = sum(l["statut"] == "correct" for l in S) or 1
            for t in [x / 100 for x in range(50, 100)]:
                M = [l for l in S if l["score"] >= t]
                if not M:
                    continue
                p = sum(l["statut"] == "correct" for l in M) / len(M)
                cov = sum(l["statut"] == "correct" for l in M) / nb_ok
                courbe.append((t, round(p, 3), round(cov, 3)))
                if seuil is None and p >= conf["precision_cible"]:
                    seuil = {"seuil": t, "precision": round(p, 3), "couverture": round(cov, 3)}
        res[typ] = {"cible": conf["precision_cible"], "par_etiquette": par_lab, "seuil_recommande": seuil,
                    "avec_score": len(S), "courbe": courbe[::5]}
    return res


def agreger_types(lignes, grille, ids=None):
    out = {}
    for typ, conf in grille["types"].items():
        L = [l for l in lignes if l["type"] == typ and (ids is None or l["vid"] in ids)]
        c = Counter(l["statut"] for l in L)
        n_gt = c["correct"] + c["erreur"] + c["manque"]
        n_ext = c["correct"] + c["erreur"] + c["invente"]
        out[typ] = {"categorie": conf["categorie"], "attendus": n_gt, "extraits": n_ext, "correct": c["correct"],
                    "erreur": c["erreur"], "manque": c["manque"], "invente": c["invente"],
                    "precision": round(c["correct"] / n_ext, 3) if n_ext else None,
                    "rappel": round(c["correct"] / n_gt, 3) if n_gt else None,
                    "exactitude": round(c["correct"] / (n_gt + c["invente"]), 3) if (n_gt + c["invente"]) else None,
                    "silencieuses": sum(1 for l in L if l["statut"] in ("erreur", "invente") and l["confiance"] == "confiant")}
    return out


def exactitude(lignes, filtre):
    L = [l for l in lignes if filtre(l)]
    c = Counter(l["statut"] for l in L)
    den = c["correct"] + c["erreur"] + c["manque"] + c["invente"]
    return round(c["correct"] / den, 3) if den else None


def evaluer_architecture(dossier, rows, fiches, grille, contexte, cfg_arch):
    vocaux, lignes, stt_res = [], [], []
    for r in rows:
        vid = r["id"]
        f = fiches.get(vid)
        pe = dossier / ("extraction_brute" if BRUT else "extraction") / f"{vid}.json"
        if not f or not pe.exists():
            continue
        ps = dossier / "stt" / f"{vid}.json"
        s = json.loads(ps.read_text(encoding="utf-8")) if ps.exists() else None
        e = json.loads(pe.read_text(encoding="utf-8"))
        if s is None and e.get("transcription"):
            s = {"texte": e["transcription"], "latence_s": 0}
        texte = (s or {}).get("texte", "")
        st = evaluer_stt(f, s) if s and not s.get("oracle") else None
        L = evaluer_extraction(f, e, grille, contexte, texte)
        for l in L:
            l["vid"] = vid
        lat = ((s or {}).get("latence_s") or 0) + (e.get("latence_s") or 0)
        ux = effort(L, e, grille, lat)
        duree = float(r.get("duree_reelle_s") or (s or {}).get("duree_s") or r.get("duree_cible_s") or 60)
        cout = None
        c = cfg_arch.get("cout", {})
        if c.get("stt_usd_par_minute") is not None or (s or {}).get("cout_usd") is not None:
            cout = ((s or {}).get("cout_usd") if (s or {}).get("cout_usd") is not None else c.get("stt_usd_par_minute", 0) * duree / 60)
            cout += e.get("cout_usd") if e.get("cout_usd") is not None else (c.get("extraction_usd_par_vocal") or 0)
        vocaux.append({"id": vid, "langue": r["langue"], "environnement": r["environnement"], "commercial": r["commercial"],
                       "duree_s": duree, "latence_s": lat, "cout_usd": cout, "ux": ux, "stt": st})
        if st:
            for t in st["termes"]:
                stt_res.append(dict(t, vid=vid, langue=r["langue"], environnement=r["environnement"], texte=st["texte"]))
        lignes += L
    return vocaux, lignes, stt_res


def synthese(vocaux, lignes, stt_res, grille):
    n = len(vocaux) or 1
    ext = [l for l in lignes if l["extrait"] is not None]
    inv = [l for l in ext if l["statut"] == "invente"]
    S = {"vocaux": len(vocaux)}
    # couche A par tranche de langue / environnement
    def tranche(cle, val):
        V = [v for v in vocaux if v[cle] == val]
        T = [t for t in stt_res if t[cle] == val]
        ids = {v["id"] for v in V}
        return {"n": len(V),
                "cer": round(statistics.mean(v["stt"]["cer"] for v in V if v["stt"]), 3) if any(v["stt"] for v in V) else None,
                "wer": round(statistics.mean(v["stt"]["wer"] for v in V if v["stt"]), 3) if any(v["stt"] for v in V) else None,
                "termes": round(sum(t["trouve"] for t in T) / len(T), 3) if T else None,
                "critique_B": exactitude(lignes, lambda l: l["vid"] in ids and l["categorie"] == "critique")}
    S["langues"] = {k: tranche("langue", k) for k in ("darija", "francais", "mixte")}
    S["environnements"] = {k: tranche("environnement", k) for k in ("calme", "voiture", "rue", "showroom")}
    S["termes_par_categorie"] = {}
    for cat in grille["stt"]["categories_termes"]:
        T = [t for t in stt_res if t["categorie"] == cat]
        if T:
            S["termes_par_categorie"][cat] = {"n": len(T), "rappel": round(sum(t["trouve"] for t in T) / len(T), 3)}
    S["types"] = agreger_types(lignes, grille)
    S["categories"] = {c: {"exactitude": exactitude(lignes, lambda l, c=c: l["categorie"] == c),
                           "invention": round(sum(1 for l in inv if l["categorie"] == c) / max(1, sum(1 for l in ext if l["categorie"] == c)), 3)}
                       for c in grille["categories"]}
    S["taux_invention"] = round(len(inv) / len(ext), 3) if ext else None
    S["inventions_confiantes"] = sum(1 for l in inv if l["confiance"] == "confiant")
    S["sources_introuvables"] = round(sum(1 for l in ext if l["source_ok"] is False) / len(ext), 3) if ext else None
    U = [v["ux"] for v in vocaux]
    moy = lambda k: round(sum(u[k] for u in U) / n, 2)
    S["ux"] = {"corrections": moy("corrections"), "confirmations": moy("confirmations"), "questions": moy("questions"),
               "ajouts": moy("ajouts"), "erreurs_silencieuses_critiques": moy("erreurs_silencieuses_critiques"),
               "acceptables_sans_modif": round(sum(u["acceptable_sans_modif"] for u in U) / n, 3),
               "temps_revue_median_s": statistics.median(u["temps_revue_s"] for u in U) if U else None,
               "temps_total_median_s": statistics.median(u["temps_total_s"] for u in U) if U else None}
    lat = [v["latence_s"] for v in vocaux]
    S["latence"] = {"mediane_s": round(statistics.median(lat), 1) if lat else None,
                    "p90_s": round(sorted(lat)[int(0.9 * (len(lat) - 1))], 1) if lat else None}
    cout = [v for v in vocaux if v["cout_usd"] is not None]
    S["cout_usd_par_minute"] = round(sum(v["cout_usd"] for v in cout) / (sum(v["duree_s"] for v in cout) / 60), 4) if cout else None
    S["calibration"] = calibration(lignes, grille)
    return S


def erreurs_majeures(lignes, stt_res, grille, n=15):
    poids = {c: v["poids_erreur"] for c, v in grille["categories"].items()}
    E = []
    for l in lignes:
        if l["statut"] == "correct":
            continue
        g = poids[l["categorie"]] * (2 if l["confiance"] == "confiant" and l["statut"] in ("erreur", "invente") else 1)
        E.append({"gravite": g, "vocal": l["vid"], "type": l["type"], "categorie": l["categorie"], "statut": l["statut"],
                  "confiance": l["confiance"], "attendu": l["attendu"], "extrait": l["extrait"]})
    E.sort(key=lambda x: -x["gravite"])
    A = [t for t in stt_res if not t["trouve"] and t["categorie"] in ("montant", "nom", "concurrent", "date", "machine", "clinique")]
    return E[:n], A[:n]


def garde_fous(S, grille):
    g = grille["garde_fous"]
    al = []
    if g.get("taux_invention_max") is not None and S["taux_invention"] is not None and S["taux_invention"] > g["taux_invention_max"]:
        al.append(f"taux d'invention {rapport.pct(S['taux_invention'], 1)} > {rapport.pct(g['taux_invention_max'])}")
    if g.get("erreurs_silencieuses_critiques_max_par_vocal") is not None and S["ux"]["erreurs_silencieuses_critiques"] > g["erreurs_silencieuses_critiques_max_par_vocal"]:
        al.append(f"{rapport.num(S['ux']['erreurs_silencieuses_critiques'], 2)} erreur(s) critique(s) affirmée(s) sans réserve par vocal (max {rapport.num(g['erreurs_silencieuses_critiques_max_par_vocal'], 2)})")
    if g.get("latence_mediane_max_s") is not None and S["latence"]["mediane_s"] is not None and S["latence"]["mediane_s"] > g["latence_mediane_max_s"]:
        al.append(f"latence médiane {S['latence']['mediane_s']} s > {g['latence_mediane_max_s']} s")
    if g.get("cout_max_usd_par_minute") is not None and S["cout_usd_par_minute"] is not None and S["cout_usd_par_minute"] > g["cout_max_usd_par_minute"]:
        al.append(f"coût {S['cout_usd_par_minute']} $/min > {g['cout_max_usd_par_minute']}")
    return al


def cmd_evaluer(a):
    global BRUT
    BRUT = getattr(a, "brut", False)
    grille = charger("config/grille.json")
    contexte = charger(f"{a.dataset}/contexte/crm.json")
    rows = manifeste(a.dataset)
    fiches = {r["id"]: fiche(a.dataset, r["id"]) for r in rows}
    archs = {x["id"]: x for x in charger(a.config)["architectures"]}
    base = RACINE / a.resultats / a.run
    res = {}
    for d in sorted(p for p in base.iterdir() if p.is_dir()):
        cfg = archs.get(d.name, {"id": d.name, "libelle": d.name})
        vocaux, lignes, stt_res = evaluer_architecture(d, rows, fiches, grille, contexte, cfg)
        if not vocaux:
            continue
        S = synthese(vocaux, lignes, stt_res, grille)
        E, A = erreurs_majeures(lignes, stt_res, grille)
        res[d.name] = {"libelle": cfg.get("libelle", d.name), "role": cfg.get("role"), "synthese": S, "erreurs": E,
                       "termes_rates": A, "garde_fous": garde_fous(S, grille), "vocaux": vocaux}
        with open(base / f"{d.name}.par_vocal{'-brut' if BRUT else ''}.csv", "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["vocal", "langue", "environnement", "wer", "cer", "corrections", "confirmations", "questions", "silencieuses_critiques", "acceptable", "temps_total_s"])
            for v in vocaux:
                w.writerow([v["id"], v["langue"], v["environnement"], v["stt"]["wer"] if v["stt"] else "", v["stt"]["cer"] if v["stt"] else "",
                            v["ux"]["corrections"], v["ux"]["confirmations"], v["ux"]["questions"], v["ux"]["erreurs_silencieuses_critiques"],
                            v["ux"]["acceptable_sans_modif"], v["ux"]["temps_total_s"]])
    suf = "-brut" if BRUT else ""
    (base / f"evaluation{suf}.json").write_text(json.dumps(res, ensure_ascii=False, indent=1, default=str), encoding="utf-8")
    md = rapport.markdown(res, grille, a.run)
    (base / f"rapport{suf}.md").write_text(md, encoding="utf-8")
    print(md if a.afficher else f"Rapport : {(base / f'rapport{suf}.md').relative_to(RACINE)}")


def cmd_demo(a):
    """Démonstration sur 3 vocaux fictifs et 2 architectures fictives, dont les sorties sont rejouées depuis demo/sorties."""
    ns = argparse.Namespace(dataset="demo", config="demo/architectures.json", resultats="demo/resultats", run="demo", forcer=True, seulement=None, afficher=a.afficher, brut=False)
    for arch in charger(ns.config)["architectures"]:
        ns.archi = arch["id"]
        cmd_lancer(ns)
    cmd_evaluer(ns)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--dataset", default="dataset")
    p.add_argument("--config", default="config/architectures.json")
    p.add_argument("--resultats", default="resultats")
    sp = p.add_subparsers(dest="cmd", required=True)
    sp.add_parser("couverture")
    sp.add_parser("fiches")
    l = sp.add_parser("lancer")
    l.add_argument("--archi", required=True)
    l.add_argument("--run")
    l.add_argument("--seulement", help="liste d'ids séparés par des virgules")
    l.add_argument("--forcer", action="store_true", help="lancer même si actif: false")
    e = sp.add_parser("evaluer")
    e.add_argument("--run", required=True)
    e.add_argument("--afficher", action="store_true")
    e.add_argument("--brut", action="store_true", help="sans la normalisation monétaire (pour mesurer son apport)")
    d = sp.add_parser("demo")
    d.add_argument("--afficher", action="store_true")
    a = p.parse_args()
    sys.exit({"couverture": cmd_couverture, "fiches": cmd_fiches, "lancer": cmd_lancer, "evaluer": cmd_evaluer, "demo": cmd_demo}[a.cmd](a))


if __name__ == "__main__":
    main()
