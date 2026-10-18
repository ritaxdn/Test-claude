# Checklist d'anonymisation

À passer pour **chaque vocal**, avant qu'il entre dans `dataset/audio/` et avant tout envoi à un fournisseur. Une personne la remplit, une seconde la contrôle sur un échantillon d'au moins un vocal sur trois. Le résultat est reporté dans `dataset/manifeste.csv` (colonne `statut` et `notes`).

## 1. Réception

- [ ] Le fichier est nommé `Vxx.ext` selon la nomenclature, sans aucun nom de client, de personne ou de lieu.
- [ ] Le code `Vxx` correspond à une ligne du manifeste et au bon commercial.
- [ ] La date de la visite, l'environnement et la durée réelle sont notés dans le manifeste.
- [ ] Le commercial a signalé ou non un vrai nom échappé.

## 2. Écoute complète, du début à la fin

- [ ] Aucun vrai nom de client, d'établissement, de médecin, d'associé, d'assistante ou de technicien.
- [ ] Les noms utilisés viennent de la carte du commercial.
- [ ] Aucun numéro de téléphone, adresse précise (rue, numéro), e-mail, numéro de CIN ou de registre de commerce.
- [ ] Aucune information sur un patient (nom, pathologie, traitement).
- [ ] Aucun propos personnel sans lien avec la visite (vie privée, tiers).
- [ ] Ville, quartier, machines, concurrents, montants, financement, dates : conservés, ils font partie du test.

## 3. Si un élément identifiant est présent

Choisir une seule option et la noter dans `notes` :

- **Réenregistrer** : le commercial refait le récit avec les noms de sa carte (option préférée) ;
- **Couper par du silence** le passage concerné, sans rien remplacer, si l'élément n'apparaît qu'une fois. Les termes critiques de ce passage sont alors exclus de la fiche ;
- **Écarter** le vocal et le remplacer par un autre.

On ne remplace jamais un nom par un bip ou par une voix de synthèse : cela fausserait le test des noms propres.

## 4. Fichier

- [ ] Métadonnées supprimées (position GPS, nom de l'appareil, auteur). Par exemple : `ffmpeg -i entree.m4a -map_metadata -1 -c copy V07.m4a`.
- [ ] Format d'origine conservé, sans compression ni réduction de bruit supplémentaire.
- [ ] Une copie de sauvegarde dans l'espace à accès restreint, et nulle part ailleurs (pas de copie sur un téléphone, une messagerie ou un ordinateur personnel).

## 5. Avant tout envoi à un fournisseur

- [ ] Le vocal a passé les étapes 1 à 4 et porte le statut `anonymise_verifie`.
- [ ] Le fournisseur fait partie de la liste validée et son option sans conservation ou sans entraînement est activée.
- [ ] L'envoi est noté (fournisseur, date) dans le suivi de l'exécution.

## 6. Fin du benchmark

- [ ] Suppression des vocaux et des fiches à la date prévue au formulaire de consentement, ou plus tôt si un commercial retire son accord.
- [ ] Suppression confirmée auprès des fournisseurs qui l'exigent ou le permettent.
- [ ] Date de suppression notée.
