# Kit de collecte des 30 vocaux

Ce dossier sert à constituer le dataset réel du benchmark, dans le cadre du protocole V1 gelé (`../PROTOCOLE.md`). Il ne modifie ni le protocole ni le harness.

| Fichier | Pour qui | Quand |
|---|---|---|
| `1-consentement.md` | chaque commercial volontaire, signé avant tout enregistrement | étape 1 |
| `2-consigne-commerciaux.md` | à remettre au commercial, avec sa carte de noms | étape 2 |
| `3-nomenclature.md` | Rita et les annotateurs : codes V01–V30, statuts, plan, cartes de noms | étapes 2 à 4 |
| `4-checklist-anonymisation.md` | annotateur 1, contrôlé par annotateur 2 | à chaque vocal reçu |

## Déroulé

1. **Préparer.** Rita valide la liste de noms fictifs (`../dataset/noms_fictifs.csv`), complète les concurrents dans `../dataset/contexte/crm.json`, désigne l'espace de stockage à accès restreint et la personne qui relira les fiches.
2. **Recueillir les consentements.** Un formulaire signé par commercial, rangé dans le registre des consentements (hors dépôt Git).
3. **Lancer la collecte.** Chaque commercial reçoit la consigne, sa carte de noms et son bloc de codes. Première série : environ 20 récits de vraies visites.
4. **À chaque vocal reçu.** Nommer, noter au manifeste, passer la checklist d'anonymisation, puis rédiger et relire la fiche de référence.
5. **Compléter.** `python3 harness/bench.py couverture` montre ce qui manque ; les derniers codes servent aux jeux de rôle qui comblent les trous.
6. **Clore.** Quand les 30 vocaux sont au statut `pret`, `python3 harness/bench.py fiches` ne signale plus rien et le dataset est figé pour les exécutions.

Aucun vocal n'est envoyé à un fournisseur avant que la liste des fournisseurs soit validée (voir `../CANDIDATS.md`).
