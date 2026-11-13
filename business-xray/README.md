# Business X-Ray

Entrez le nom ou le site d'une entreprise : l'app produit une analyse de son
business model, de sa proposition de valeur, de ses concurrents et de ses
opportunités. Chaque affirmation est marquée **Fait**, **Estimation** ou
**Hypothèse** et renvoie à des sources numérotées.

## Démarrer

```bash
cd business-xray
npm install
cp .env.example .env.local   # puis renseigner ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3100
```

## Fonctionnement

`POST /api/analyze` (`src/app/api/analyze/route.ts`) renvoie un flux NDJSON
d'événements (`status`, `search`, `fetch`, `notes`, puis `report` ou `error`).
Le pipeline (`src/lib/analyze.ts`) fait deux appels à Claude Opus 5.5 :

1. **Recherche** : Claude utilise la recherche web et la lecture de pages
   pour constituer un dossier. Chaque passage cité reçoit un marqueur `[n]`
   qui renvoie à un registre de sources numérotées.
2. **Structuration** : le dossier et la liste des sources sont convertis en
   rapport JSON validé par le schéma Zod de `src/lib/schema.ts`.

Les deux étapes sont séparées parce que les sorties structurées ne peuvent pas
être combinées avec les citations de la recherche web. Si un classifieur de
sécurité refuse une requête, l'API la relance sur un modèle de repli
(`fallbacks: "default"`).

Une analyse prend en général 1 à 4 minutes. Elle utilise jusqu'à 12 recherches
et 6 lectures de pages, facturées sur le compte Anthropic.

## Avant une mise en ligne publique

- Ajouter une authentification ou une limite de requêtes sur `/api/analyze` :
  chaque appel coûte des crédits API.
- La route a besoin d'un hébergement qui accepte des fonctions de 5 minutes
  (`maxDuration = 300`).
