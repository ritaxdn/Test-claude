# Nomenclature V01–V30 et suivi

Chaque commercial reçoit un bloc de codes (C1 : V01–V06, C2 : V07–V12, C3 : V13–V18, C4 : V19–V24, C5 : V25–V30) et utilise le prochain code libre. Une vraie visite ne se commande pas : à la réception, Rita peut échanger deux codes d'un même commercial pour que le vocal tombe sur la ligne du plan qui lui ressemble le plus. Ensuite le code ne change plus : c'est le seul nom du fichier et la seule clé dans le manifeste, les fiches et les résultats.

## Règles

- Fichier audio : `Vxx.<extension d'origine>` (`V07.m4a`), dans `dataset/audio/`. Jamais de nom de client, de personne ni de lieu dans un nom de fichier.
- Fiche de référence : `dataset/fiches/Vxx.json`.
- Commerciaux : pseudonymes `C1` à `C5`. La correspondance pseudonyme → personne n'est notée que dans le registre des consentements, gardé par Rita, jamais dans le dépôt.
- Un code n'est jamais réutilisé. Un vocal écarté garde son code avec le statut `ecarte`, et le remplaçant prend le code suivant libre (`V31`…).
- `V01` à `V20` : récits de vraies visites. `V21` à `V30` : vraies visites ou jeux de rôle, décidés après la première série selon ce qui manque (`python3 harness/bench.py couverture`). La colonne `scenario` du manifeste indique la situation recherchée : elle ne se lit jamais au commercial, sauf pour un jeu de rôle.

## Statuts (colonne `statut` du manifeste)

| Statut | Signification | Qui |
|---|---|---|
| `a_enregistrer` | code attribué, vocal attendu | Rita |
| `recu` | fichier déposé, nommé et noté au manifeste | Rita |
| `anonymise_verifie` | checklist d'anonymisation passée | annotateur 1 |
| `fiche_redigee` | fiche de référence écrite | annotateur 1 |
| `fiche_relue` | fiche relue sur l'audio, désaccords tranchés | annotateur 2 |
| `pret` | `bench.py fiches` sans erreur sur ce vocal | annotateur 1 |
| `ecarte` | retiré (consentement, qualité, anonymisation impossible) | Rita |

## Plan des 30 vocaux

| Code | Commercial | Langue dominante visée | Environnement visé | Durée visée | Situation recherchée |
|---|---|---|---|---|---|
| V01 | C1 | mixte | calme | 90 s | Démo réussie, associé financier présent, concurrent moins cher |
| V02 | C1 | darija | voiture | 120 s | Relance devis, prix discuté en millions |
| V03 | C1 | francais | showroom | 75 s | Démo au showroom, question technique sur une machine |
| V04 | C1 | mixte | rue | 60 s | Visite courte, rien de convenu |
| V05 | C1 | darija | calme | 150 s | Première visite, deux associés, intérêt fort |
| V06 | C1 | francais | voiture | 45 s | Refus, déjà équipé chez un concurrent |
| V07 | C2 | mixte | calme | 110 s | Accord de principe, financement 36 mois |
| V08 | C2 | darija | rue | 80 s | Concurrent cité avec un prix en millions |
| V09 | C2 | francais | showroom | 130 s | Comité de décision, objection sur la maintenance |
| V10 | C2 | mixte | showroom | 95 s | Client vu au showroom, devis à envoyer |
| V11 | C2 | darija | voiture | 170 s | Passage imprévu dans une clinique, récit décousu |
| V12 | C2 | mixte | calme | 60 s | Machine jugée inadaptée |
| V13 | C3 | francais | rue | 100 s | Négociation, offre concurrente précise |
| V14 | C3 | mixte | voiture | 140 s | Ouverture d'un nouveau centre, plusieurs machines |
| V15 | C3 | darija | calme | 90 s | Budget serré, financement demandé |
| V16 | C3 | mixte | showroom | 70 s | Démo interrompue |
| V17 | C3 | francais | voiture | 55 s | Visite de prospection à froid |
| V18 | C3 | mixte | calme | 180 s | Récit long et dense |
| V19 | C4 | darija | rue | 65 s | Prix rejeté |
| V20 | C4 | mixte | voiture | 120 s | Comparatif avec un concurrent, rendez-vous fixé |
| V21 | C4 | francais | calme | 85 s | Installation à planifier début janvier |
| V22 | C4 | darija | showroom | 100 s | Démo avec le technicien de la clinique |
| V23 | C4 | mixte | calme | 75 s | Récit qui s'arrête avant la suite |
| V24 | C4 | francais | rue | 60 s | Rencontre au salon, concurrent mentionné |
| V25 | C5 | mixte | voiture | 130 s | Accord verbal, budget en millions |
| V26 | C5 | darija | calme | 110 s | Comparaison technique avec un concurrent |
| V27 | C5 | francais | showroom | 90 s | Deux décideurs, devis validé |
| V28 | C5 | mixte | rue | 50 s | Client absent, discussion avec l'assistante |
| V29 | C5 | darija | voiture | 160 s | Visite complète en darija |
| V30 | C5 | mixte | calme | 80 s | Appel entrant transformé en visite |

La langue et l'environnement sont des cibles : si un commercial parle surtout français dans un vocal prévu « darija », on note la langue réelle au manifeste et on rééquilibre avec les vocaux suivants.

## Cartes de noms fictifs

Chaque commercial reçoit sa carte et n'utilise que ces noms. Liste à valider par Rita : vérifier qu'aucun nom ne correspond à un vrai client ou contact du CRM.

### Carte C1

Personnes : Dr Karim Lahrichi, Dr Nadia Benslimane, Dr Youssef Ouazzani, Dr Salma Berrada, Dr Hicham Sqalli, Dr Imane Kettani

Établissements : Clinique Al Wafae, Clinique Yasmine, Centre Dermatologique Anfa, Cabinet Hay Riad

### Carte C2

Personnes : Dr Mehdi Cherkaoui, Dr Leila Belghiti, Dr Omar Ziani, Dr Sanaa Naciri, Dr Reda Filali, Dr Ghita Zniber

Établissements : Institut Saphir, Clinique Les Orangers, Centre Esthétique Majorelle, Cabinet Gauthier

### Carte C3

Personnes : Dr Anas Tahiri, Dr Meryem El Khattabi, Dr Adil Boutaleb, Dr Houda Benkirane, Dr Tarik Lamrani, Dr Zineb Skalli

Établissements : Clinique Ennakhil, Centre Laser Agdal, Institut Perle, Clinique Ibn Battouta

### Carte C4

Personnes : Dr Amine Hajji, Dr Kenza El Mansouri, Dr Karim Bennis, Dr Nadia Rachidi, Dr Youssef Squalli, Dr Salma Guessous

Établissements : Cabinet Maârif, Centre Mogador, Clinique Atlas Sud, Institut Corail

### Carte C5

Personnes : Dr Hicham Mekouar, Dr Imane Bouzidi, Dr Mehdi Alami, Dr Leila Laraki, Dr Omar Benabdellah, Dr Sanaa Sebti

Établissements : Cabinet Racine, Centre Médical Palmier, Clinique Andalous, Institut Jasmin
