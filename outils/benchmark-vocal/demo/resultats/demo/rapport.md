# Benchmark vocal — exécution « demo »

Couche A = audio → transcription. Couche B = transcription + contexte CRM → informations commerciales.
« Exactitude » = informations justes ÷ (attendues + inventées). Aucune moyenne globale : lire ligne par ligne.

La ligne de référence (transcription humaine) mesure la couche B seule : c'est le plafond atteignable avec une transcription parfaite.

## Tableau comparatif

| Critère | **E0-reference**<br>Transcription humaine + extraction (borne haute) | **X-demo**<br>Démo : STT généraliste → extraction | **Y-demo**<br>Démo : modèle audio natif |
|---|---|---|---|
| Darija | B : critiques 100 % | A : CER 14 % · termes 100 %<br>B : critiques 100 % | A : CER 4 % · termes 100 %<br>B : critiques 100 % |
| Français | B : critiques 100 % | A : CER 5 % · termes 75 %<br>B : critiques 67 % | A : CER 0 % · termes 100 %<br>B : critiques 100 % |
| Code-switching | B : critiques 100 % | A : CER 10 % · termes 88 %<br>B : critiques 100 % | A : CER 0 % · termes 100 %<br>B : critiques 100 % |
| Noms propres | B : 100 % | A : 100 %<br>B : 100 % | A : 100 %<br>B : 100 % |
| Machines | B : 100 % | A : 67 %<br>B : 50 % | A : 100 %<br>B : 100 % |
| Concurrents | B : 100 % | A : 100 %<br>B : 100 % | A : 100 %<br>B : 67 % |
| Montants | B : 100 % | A : 75 %<br>B : 100 % | A : 100 %<br>B : 100 % |
| Dates | B : 100 % | A : 100 %<br>B : 67 % | A : 100 %<br>B : 100 % |
| Décideurs | 100 % | 100 % | 100 % |
| Objections | 100 % | 100 % | 100 % |
| Étape convenue | 100 % | 50 % | 100 % |
| **False extraction rate** | **0,0 %**<br>0 affirmée(s) sans réserve | **8,8 %**<br>2 affirmée(s) sans réserve | **0,0 %**<br>0 affirmée(s) sans réserve |
| Erreurs critiques affirmées sans réserve / visite | 0,00 | 0,33 | 0,00 |
| **Corrections / visite** | **0,0**<br>dont ajouts 0,0 | **1,3**<br>dont ajouts 0,3 | **0,3**<br>dont ajouts 0,3 |
| Confirmations / visite | 1,0 | 1,7 | 1,7 |
| Questions / visite | 0,3 | 0,0 | 0,3 |
| Acceptables sans modification | 100 % | 67 % | 67 % |
| Fin du vocal → validation (estimé, médiane) | 61 s | 80 s | 88 s |
| Latence (médiane / p90) | 3,2 s / 3,2 s | 8,0 s / 8,0 s | 9,0 s / 9,0 s |
| Coût / minute | 0,004 $ | 0,011 $ | 0,022 $ |
| Citations introuvables dans le texte | 0 % | 12 % | 3 % |
| Garde-fous | aucun dépassé | ⚠ taux d'invention 8,8 % > 5 %<br>⚠ 0,33 erreur(s) critique(s) affirmée(s) sans réserve par vocal (max 0,10) | aucun dépassé |

## Environnement sonore (couche A : CER · termes critiques — couche B : critiques)

| Environnement | E0-reference | X-demo | Y-demo |
|---|---|---|---|
| calme | n/d · n/d — 100 % | 10 % · 88 % — 100 % | 0 % · 100 % — 100 % |
| voiture | n/d · n/d — 100 % | 14 % · 100 % — 100 % | 4 % · 100 % — 100 % |
| rue | n/d · n/d — 100 % | 5 % · 75 % — 67 % | 0 % · 100 % — 100 % |
| showroom | — | — | — |

## E0-reference — Transcription humaine + extraction (borne haute)

3 vocaux évalués.

### Par type de donnée

| Type | Catégorie | Attendus | Justes | Valeur fausse | Manqués | Inventés | Précision | Rappel | Affirmées à tort |
|---|---|---|---|---|---|---|---|---|---|
| Client (identité) | critique | 3 | 3 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Contacts (identité) | critique | 4 | 4 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Montants | critique | 4 | 4 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Étape convenue (type, date, heure) | critique | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Actions personnelles (et échéance) | importante | 2 | 2 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Décideurs / influenceurs | importante | 2 | 2 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Objections | importante | 3 | 3 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Concurrents | importante | 3 | 3 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Financement | importante | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Timing du projet | importante | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Technologies / machines | importante | 3 | 3 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Besoin / motivation | secondaire | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Signaux | secondaire | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Niveau d'intérêt | secondaire | 2 | 2 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Signal terrain généralisable | secondaire | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |

### Calibration de la confiance

| Type | Cible | « Confiant » juste | « À vérifier » juste | Seuil de score recommandé |
|---|---|---|---|---|
| Client (identité) | 98 % | 100 % (3) | — | ≥ 0.50 (précision 100 %, couvre 100 %) |
| Contacts (identité) | 98 % | 100 % (4) | — | ≥ 0.50 (précision 100 %, couvre 100 %) |
| Montants | 99 % | 100 % (1) | 100 % (3) | ≥ 0.50 (précision 100 %, couvre 100 %) |
| Étape convenue (type, date, heure) | 98 % | 100 % (1) | — | ≥ 0.50 (précision 100 %, couvre 100 %) |
| Actions personnelles (et échéance) | 90 % | 100 % (2) | — | pas de score fourni |
| Décideurs / influenceurs | 93 % | 100 % (2) | — | pas de score fourni |
| Objections | 90 % | 100 % (3) | — | pas de score fourni |
| Concurrents | 95 % | 100 % (3) | — | ≥ 0.50 (précision 100 %, couvre 100 %) |
| Financement | 93 % | 100 % (1) | — | pas de score fourni |
| Timing du projet | 90 % | 100 % (1) | — | pas de score fourni |
| Technologies / machines | 93 % | 100 % (3) | — | pas de score fourni |
| Besoin / motivation | 80 % | 100 % (1) | — | pas de score fourni |
| Signaux | 80 % | 100 % (1) | — | pas de score fourni |
| Niveau d'intérêt | 85 % | 100 % (2) | — | pas de score fourni |
| Signal terrain généralisable | 80 % | 100 % (1) | — | pas de score fourni |

### Erreurs les plus graves

Aucune.

## X-demo — Démo : STT généraliste → extraction

3 vocaux évalués.

### Par type de donnée

| Type | Catégorie | Attendus | Justes | Valeur fausse | Manqués | Inventés | Précision | Rappel | Affirmées à tort |
|---|---|---|---|---|---|---|---|---|---|
| Client (identité) | critique | 3 | 3 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Contacts (identité) | critique | 4 | 4 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Montants | critique | 4 | 4 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Étape convenue (type, date, heure) | critique | 1 | 1 | 0 | 0 | 1 | 50 % | 100 % | 1 |
| Actions personnelles (et échéance) | importante | 2 | 2 | 0 | 0 | 1 | 67 % | 100 % | 1 |
| Décideurs / influenceurs | importante | 2 | 2 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Objections | importante | 3 | 3 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Concurrents | importante | 3 | 3 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Financement | importante | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Timing du projet | importante | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Technologies / machines | importante | 3 | 2 | 0 | 1 | 1 | 67 % | 67 % | 0 |
| Besoin / motivation | secondaire | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Signaux | secondaire | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Niveau d'intérêt | secondaire | 2 | 2 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Signal terrain généralisable | secondaire | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |

### Calibration de la confiance

| Type | Cible | « Confiant » juste | « À vérifier » juste | Seuil de score recommandé |
|---|---|---|---|---|
| Client (identité) | 98 % | 100 % (3) | — | ≥ 0.50 (précision 100 %, couvre 100 %) |
| Contacts (identité) | 98 % | 100 % (4) | — | ≥ 0.50 (précision 100 %, couvre 100 %) |
| Montants | 99 % | 100 % (1) | 100 % (3) | ≥ 0.50 (précision 100 %, couvre 100 %) |
| Étape convenue (type, date, heure) | 98 % | 50 % (2) | — | ≥ 0.71 (précision 100 %, couvre 100 %) |
| Actions personnelles (et échéance) | 90 % | 67 % (3) | — | pas de score fourni |
| Décideurs / influenceurs | 93 % | 100 % (2) | — | pas de score fourni |
| Objections | 90 % | 100 % (3) | — | pas de score fourni |
| Concurrents | 95 % | 100 % (2) | 100 % (1) | ≥ 0.50 (précision 100 %, couvre 100 %) |
| Financement | 93 % | 100 % (1) | — | pas de score fourni |
| Timing du projet | 90 % | 100 % (1) | — | pas de score fourni |
| Technologies / machines | 93 % | 100 % (1) | 50 % (2) | ≥ 0.61 (précision 100 %, couvre 100 %) |
| Besoin / motivation | 80 % | 100 % (1) | — | pas de score fourni |
| Signaux | 80 % | 100 % (1) | — | pas de score fourni |
| Niveau d'intérêt | 85 % | 100 % (2) | — | pas de score fourni |
| Signal terrain généralisable | 80 % | 100 % (1) | — | pas de score fourni |

### Erreurs les plus graves

- **V03 · Étape convenue (type, date, heure)** (critique, inventé, affirmé « confiant ») : attendu **—**, obtenu **visite · 2027-01-05** — « je repasse peut-être en début d'année »
- **V03 · Actions personnelles (et échéance)** (importante, inventé, affirmé « confiant ») : attendu **—**, obtenu **Repasser voir le Dr Tazi · avant 2027-01-05** — « je repasse peut-être en début d'année »
- **V03 · Technologies / machines** (importante, manqué) : attendu **HIFU**, obtenu **—** — « un HIFU de chez Alma »
- **V03 · Technologies / machines** (importante, inventé, affirmé « a_verifier ») : attendu **—**, obtenu **ultrasons focalisés** — « un I fou de chez Alma »

### Termes critiques ratés à la transcription

- V01 (mixte, calme) · montant : « ميتين و ربعين ألف » non retrouvé — nombres entendus : 1, 24, 240, 285000

## Y-demo — Démo : modèle audio natif

3 vocaux évalués.

### Par type de donnée

| Type | Catégorie | Attendus | Justes | Valeur fausse | Manqués | Inventés | Précision | Rappel | Affirmées à tort |
|---|---|---|---|---|---|---|---|---|---|
| Client (identité) | critique | 3 | 3 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Contacts (identité) | critique | 4 | 4 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Montants | critique | 4 | 4 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Étape convenue (type, date, heure) | critique | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Actions personnelles (et échéance) | importante | 2 | 2 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Décideurs / influenceurs | importante | 2 | 2 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Objections | importante | 3 | 3 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Concurrents | importante | 3 | 2 | 0 | 1 | 0 | 100 % | 67 % | 0 |
| Financement | importante | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Timing du projet | importante | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Technologies / machines | importante | 3 | 3 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Besoin / motivation | secondaire | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Signaux | secondaire | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Niveau d'intérêt | secondaire | 2 | 2 | 0 | 0 | 0 | 100 % | 100 % | 0 |
| Signal terrain généralisable | secondaire | 1 | 1 | 0 | 0 | 0 | 100 % | 100 % | 0 |

### Calibration de la confiance

| Type | Cible | « Confiant » juste | « À vérifier » juste | Seuil de score recommandé |
|---|---|---|---|---|
| Client (identité) | 98 % | 100 % (3) | — | ≥ 0.50 (précision 100 %, couvre 100 %) |
| Contacts (identité) | 98 % | 100 % (4) | — | ≥ 0.50 (précision 100 %, couvre 100 %) |
| Montants | 99 % | 100 % (1) | 100 % (3) | ≥ 0.50 (précision 100 %, couvre 100 %) |
| Étape convenue (type, date, heure) | 98 % | 100 % (1) | — | ≥ 0.50 (précision 100 %, couvre 100 %) |
| Actions personnelles (et échéance) | 90 % | 100 % (2) | — | pas de score fourni |
| Décideurs / influenceurs | 93 % | 100 % (1) | 100 % (1) | pas de score fourni |
| Objections | 90 % | 100 % (3) | — | pas de score fourni |
| Concurrents | 95 % | 100 % (2) | — | ≥ 0.50 (précision 100 %, couvre 100 %) |
| Financement | 93 % | 100 % (1) | — | pas de score fourni |
| Timing du projet | 90 % | 100 % (1) | — | pas de score fourni |
| Technologies / machines | 93 % | 100 % (3) | — | pas de score fourni |
| Besoin / motivation | 80 % | 100 % (1) | — | pas de score fourni |
| Signaux | 80 % | 100 % (1) | — | pas de score fourni |
| Niveau d'intérêt | 85 % | 100 % (1) | 100 % (1) | pas de score fourni |
| Signal terrain généralisable | 80 % | 100 % (1) | — | pas de score fourni |

### Erreurs les plus graves

- **V02 · Concurrents** (importante, manqué) : attendu **BTL**, obtenu **—** — « عند BTL »

---
Décision : ce rapport ne choisit pas. Comparer compréhension métier, inventions, effort de correction, latence et coût, puis trancher en équipe.
