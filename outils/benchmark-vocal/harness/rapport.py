"""Rapport Markdown : tableau comparatif, détail par type, calibration, et les erreurs réelles les plus graves."""


def pct(x, d=0):
    return "n/d" if x is None else f"{x * 100:.{d}f} %".replace(".", ",")


def num(x, d=1):
    return "n/d" if x is None else f"{x:.{d}f}".replace(".", ",")


def mad(v):
    try:
        return f"{int(v):,}".replace(",", " ") + " MAD"
    except Exception:
        return str(v)


def decrire(typ, it):
    if not it:
        return "—"
    if typ == "montants":
        return f"{mad(it.get('valeur_mad'))} ({it.get('objet', '?')})"
    if typ in ("contacts", "decideurs"):
        r = it.get("role_achat") or it.get("fonction") or ""
        return f"{it.get('nom')}{' · ' + r if r else ''}{' · nouveau' if it.get('nouveau') else ''}"
    if typ == "prochaine_etape":
        return f"{it.get('type')} · {it.get('date')} {it.get('heure') or ''}".strip()
    if typ == "timing":
        return f"{it.get('debut')} → {it.get('fin')}"
    if typ == "concurrents":
        return it.get("marque", "?")
    if typ == "objections":
        return f"{it.get('type')}{' · ' + it['detail'] if it.get('detail') else ''}"
    if typ == "financement":
        return f"{it.get('duree_mois') or '?'} mois"
    if typ == "changement_etape":
        return f"→ {it.get('vers')}"
    if typ == "actions_perso":
        return f"{it.get('texte')}{' · avant ' + it['echeance'] if it.get('echeance') else ''}"
    return str(it.get("valeur") or it.get("texte") or it)


LIGNES_B = {"Noms propres": ["client", "contacts"], "Machines": ["technologies"], "Concurrents": ["concurrents"],
            "Montants": ["montants"], "Dates": ["prochaine_etape", "timing"]}


def exact_types(S, types):
    T = [S["types"][t] for t in types if t in S["types"]]
    num_ = sum(t["correct"] for t in T)
    den = sum(t["attendus"] + t["invente"] for t in T)
    return num_ / den if den else None


def rappel_termes(S, cats):
    T = [S["termes_par_categorie"][c] for c in cats if c in S["termes_par_categorie"]]
    n = sum(t["n"] for t in T)
    return sum(t["rappel"] * t["n"] for t in T) / n if n else None


def markdown(res, grille, run):
    ids = list(res)
    L = [f"# Benchmark vocal — exécution « {run} »", "",
         "Couche A = audio → transcription. Couche B = transcription + contexte CRM → informations commerciales.",
         "« Exactitude » = informations justes ÷ (attendues + inventées). Aucune moyenne globale : lire ligne par ligne.", ""]
    if any(r.get("role") == "reference" for r in res.values()):
        L.append("La ligne de référence (transcription humaine) mesure la couche B seule : c'est le plafond atteignable avec une transcription parfaite.\n")
    L += ["## Tableau comparatif", "", "| Critère | " + " | ".join(f"**{i}**<br>{res[i]['libelle']}" for i in ids) + " |",
          "|---|" + "---|" * len(ids)]

    def ligne(nom, f):
        L.append(f"| {nom} | " + " | ".join(f(res[i]["synthese"]) for i in ids) + " |")

    for nom, cle in (("Darija", "darija"), ("Français", "francais"), ("Code-switching", "mixte")):
        ligne(nom, lambda S, c=cle: (f"A : CER {pct(S['langues'][c]['cer'])} · termes {pct(S['langues'][c]['termes'])}<br>" if S['langues'][c]['cer'] is not None else "")
              + f"B : critiques {pct(S['langues'][c]['critique_B'])}" if S['langues'][c]['n'] else "—")
    for nom, types in LIGNES_B.items():
        cats = grille["stt"]["lignes_tableau"].get(nom, [])
        ligne(nom, lambda S, t=types, c=cats: (f"A : {pct(rappel_termes(S, c))}<br>" if rappel_termes(S, c) is not None else "") + f"B : {pct(exact_types(S, t))}")
    ligne("Décideurs", lambda S: pct(exact_types(S, ["decideurs"])))
    ligne("Objections", lambda S: pct(exact_types(S, ["objections"])))
    ligne("Étape convenue", lambda S: pct(exact_types(S, ["prochaine_etape"])))
    ligne("**False extraction rate**", lambda S: f"**{pct(S['taux_invention'], 1)}**<br>{S['inventions_confiantes']} affirmée(s) sans réserve")
    ligne("Erreurs critiques affirmées sans réserve / visite", lambda S: num(S["ux"]["erreurs_silencieuses_critiques"], 2))
    ligne("**Corrections / visite**", lambda S: f"**{num(S['ux']['corrections'])}**<br>dont ajouts {num(S['ux']['ajouts'])}")
    ligne("Confirmations / visite", lambda S: num(S["ux"]["confirmations"]))
    ligne("Questions / visite", lambda S: num(S["ux"]["questions"]))
    ligne("Acceptables sans modification", lambda S: pct(S["ux"]["acceptables_sans_modif"]))
    ligne("Fin du vocal → validation (estimé, médiane)", lambda S: f"{num(S['ux']['temps_total_median_s'], 0)} s")
    ligne("Latence (médiane / p90)", lambda S: f"{num(S['latence']['mediane_s'])} s / {num(S['latence']['p90_s'])} s")
    ligne("Coût / minute", lambda S: "n/d" if S["cout_usd_par_minute"] is None else f"{num(S['cout_usd_par_minute'], 3)} $")
    ligne("Citations introuvables dans le texte", lambda S: pct(S["sources_introuvables"]))
    L.append("| Garde-fous | " + " | ".join("<br>".join("⚠ " + g for g in res[i]["garde_fous"]) or "aucun dépassé" for i in ids) + " |")
    L += ["", "## Environnement sonore (couche A : CER · termes critiques — couche B : critiques)", "",
          "| Environnement | " + " | ".join(ids) + " |", "|---|" + "---|" * len(ids)]
    for env in ("calme", "voiture", "rue", "showroom"):
        L.append(f"| {env} | " + " | ".join(
            (lambda e: "—" if not e["n"] else f"{pct(e['cer'])} · {pct(e['termes'])} — {pct(e['critique_B'])}")(res[i]["synthese"]["environnements"][env]) for i in ids) + " |")

    for i in ids:
        r, S = res[i], res[i]["synthese"]
        L += ["", f"## {i} — {r['libelle']}", "", f"{S['vocaux']} vocaux évalués.", "",
              "### Par type de donnée", "",
              "| Type | Catégorie | Attendus | Justes | Valeur fausse | Manqués | Inventés | Précision | Rappel | Affirmées à tort |",
              "|---|---|---|---|---|---|---|---|---|---|"]
        for typ, t in S["types"].items():
            if t["attendus"] or t["extraits"]:
                L.append(f"| {grille['types'][typ]['libelle']} | {t['categorie']} | {t['attendus']} | {t['correct']} | {t['erreur']} | {t['manque']} | {t['invente']} | {pct(t['precision'])} | {pct(t['rappel'])} | {t['silencieuses']} |")
        L += ["", "### Calibration de la confiance", "",
              "| Type | Cible | « Confiant » juste | « À vérifier » juste | Seuil de score recommandé |", "|---|---|---|---|---|"]
        for typ, c in S["calibration"].items():
            pl = c["par_etiquette"]
            s = c["seuil_recommande"]
            seuil = (f"≥ {s['seuil']:.2f} (précision {pct(s['precision'])}, couvre {pct(s['couverture'])})" if s
                     else ("cible non atteinte : toujours « à vérifier »" if c["avec_score"] else "pas de score fourni"))
            L.append(f"| {grille['types'][typ]['libelle']} | {pct(c['cible'])} | "
                     f"{(pct(pl['confiant']['precision']) + ' (' + str(pl['confiant']['n']) + ')') if 'confiant' in pl else '—'} | "
                     f"{(pct(pl['a_verifier']['precision']) + ' (' + str(pl['a_verifier']['n']) + ')') if 'a_verifier' in pl else '—'} | {seuil} |")
        L += ["", "### Erreurs les plus graves", ""]
        if not r["erreurs"]:
            L.append("Aucune.")
        for e in r["erreurs"]:
            st = {"erreur": "valeur fausse", "invente": "inventé", "manque": "manqué"}[e["statut"]]
            conf = f", affirmé « {e['confiance']} »" if e["confiance"] else ""
            src = (e["extrait"] or {}).get("source") if e["extrait"] else (e["attendu"] or {}).get("source")
            L.append(f"- **{e['vocal']} · {grille['types'][e['type']]['libelle']}** ({e['categorie']}, {st}{conf}) : "
                     f"attendu **{decrire(e['type'], e['attendu'])}**, obtenu **{decrire(e['type'], e['extrait'])}**"
                     + (f" — « {src} »" if src else ""))
        if r["termes_rates"]:
            L += ["", "### Termes critiques ratés à la transcription", ""]
            for t in r["termes_rates"]:
                extra = f" — nombres entendus : {', '.join(str(x) for x in t['nombres_entendus']) or 'aucun'}" if t["categorie"] == "montant" else ""
                L.append(f"- {t['vid']} ({t['langue']}, {t['environnement']}) · {t['categorie']} : « {t['terme']} » non retrouvé{extra}")
    L += ["", "---", "Décision : ce rapport ne choisit pas. Comparer compréhension métier, inventions, effort de correction, latence et coût, puis trancher en équipe."]
    return "\n".join(L) + "\n"
