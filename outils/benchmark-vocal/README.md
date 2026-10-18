# Benchmark vocal (transcription + extraction)

Outil interne, hors application : rien ici n'est déployé ni appelé par le CRM. Le protocole complet est dans [PROTOCOLE.md](PROTOCOLE.md).

Python 3.9 ou plus, aucune dépendance.

```bash
cd outils/benchmark-vocal

# 1. Le plan de dataset couvre-t-il les situations voulues ?
python3 harness/bench.py couverture

# 2. Les fiches de référence sont-elles conformes ?
python3 harness/bench.py fiches

# 3. Produire les sorties d'une architecture (elle doit être "actif": true dans config/architectures.json)
python3 harness/bench.py lancer --archi A-stt-general --run 2026-11-04

# 4. Comparer toutes les architectures de l'exécution
python3 harness/bench.py evaluer --run 2026-11-04
#    → resultats/2026-11-04/rapport.md, evaluation.json, <archi>.par_vocal.csv

# Démonstration complète sur données fictives
python3 harness/bench.py demo --afficher
```

## Brancher un fournisseur

Chaque architecture déclare deux adaptateurs dans `config/architectures.json` :

- **STT** : `oracle` (transcription humaine), `fichier` (sorties déjà produites, un `<id>.json` ou `<id>.txt` par vocal), `commande` (un script ou une CLI appelée pour chaque vocal avec `{audio}` et `{sortie}`), ou `aucun` (modèle audio natif qui renvoie lui-même sa transcription dans le champ `transcription`).
- **Extraction** : `fichier` ou `commande`. La commande reçoit `{prompt}` (la consigne commune déjà remplie), `{transcription}`, `{contexte}`, `{audio}` et écrit le JSON demandé dans `{sortie}`.

Une sortie STT est un JSON `{"texte": "...", "latence_s": 4.2, "cout_usd": 0.01}` (latence et coût facultatifs : le harness chronomètre la commande). Une sortie d'extraction suit le format de `prompts/extraction.md`.

Les clés d'API se passent par variables d'environnement (`variables_env`), jamais dans les fichiers.

## Données

`dataset/audio/` et `dataset/fiches/` sont exclus de Git : ce sont des données commerciales réelles. Seuls le manifeste, le schéma, le contexte et la démonstration sont versionnés.
