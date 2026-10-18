"""Construit dataset/contexte/crm.json à partir du CRM : catalogue machines actives et technologies (catégories).

Deux sources possibles :
  python3 harness/contexte_crm.py --supabase           lit la table `produits` via l'API du CRM
      (variables d'environnement CRM_SUPABASE_URL et CRM_SUPABASE_KEY, clé en lecture seule ; jamais écrites)
  python3 harness/contexte_crm.py --export produits.json   part d'un export JSON de la table `produits`

Les concurrents connus et les autres réglages sont conservés tels quels dans crm.json.
Les prix catalogue ne sont pas envoyés aux fournisseurs : ils restent dans catalogue_crm.json et ne servent
qu'à la normalisation monétaire locale (plage de montants plausibles).
"""
import argparse
import json
import os
import sys
import urllib.request
from datetime import date
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
CTX = RACINE / "dataset" / "contexte"


def depuis_supabase():
    url, cle = os.environ.get("CRM_SUPABASE_URL"), os.environ.get("CRM_SUPABASE_KEY")
    if not url or not cle:
        sys.exit("CRM_SUPABASE_URL et CRM_SUPABASE_KEY doivent être définies.")
    req = urllib.request.Request(
        url.rstrip("/") + "/rest/v1/produits?select=nom,categorie,marque,reference,prix_catalogue_mad,medical_only&actif=eq.true&order=nom",
        headers={"apikey": cle, "Authorization": "Bearer " + cle})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8")), "API du CRM (table produits, actif = vrai)"


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--supabase", action="store_true")
    g.add_argument("--export")
    a = p.parse_args()
    if a.supabase:
        produits, source = depuis_supabase()
    else:
        produits, source = json.loads(Path(a.export).read_text(encoding="utf-8")), f"export de la table produits ({Path(a.export).name})"
    produits = sorted(produits, key=lambda x: x["nom"])
    (CTX / "catalogue_crm.json").write_text(json.dumps(
        {"_doc": "Copie du catalogue du CRM. Ne pas modifier à la main : relancer harness/contexte_crm.py.",
         "source": source, "date": date.today().isoformat(), "produits": produits}, ensure_ascii=False, indent=1), encoding="utf-8")
    crm = json.loads((CTX / "crm.json").read_text(encoding="utf-8"))
    crm["catalogue"] = [{"nom": x["nom"], "categorie": x.get("categorie"), "marque": x.get("marque"), "reference": x.get("reference")} for x in produits]
    crm["technologies"] = sorted({x["categorie"] for x in produits if x.get("categorie")})
    crm["_catalogue"] = f"{len(produits)} machines actives, {source}, {date.today().isoformat()}"
    (CTX / "crm.json").write_text(json.dumps(crm, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(produits)} machines, {len(crm['technologies'])} technologies → dataset/contexte/crm.json")


if __name__ == "__main__":
    main()
