# Sécurité — BID (prototype)

Ce dossier contient un **prototype de démonstration** : aucune donnée ne quitte le navigateur, il n'y a ni
serveur, ni vrai KYC, ni paiement, ni séquestre. Les offres, les vérifications d'identité et de capacité, les
garanties et les autres enchérisseurs sont **simulés**. Ce qui suit décrit ce que le prototype protège, et ce
que le vrai produit devra imposer côté serveur.

## Ce que le prototype protège

| Risque | Protection |
| --- | --- |
| Injection de code (XSS) | Toute donnée affichée passe par `esc()`. CSP stricte : seul le script de la page (empreinte sha256) peut s'exécuter, aucune requête réseau (`connect-src 'none'`), pas de formulaire externe, pas de `<base>`, pas d'objets. |
| Données locales falsifiées | Tout ce qui est relu depuis `localStorage` est revalidé au chargement : types, bornes numériques, longueurs, listes autorisées. Une entrée corrompue est ignorée sans effacer le reste. |
| Clickjacking | `X-Frame-Options: DENY` et `frame-ancestors 'none'` (en-têtes HTTP, `vercel.json`). |
| Fuite d'URL | `Referrer-Policy: no-referrer`. |
| Accès matériel | `Permissions-Policy` : caméra, micro, géolocalisation, paiement désactivés. |
| Transport | HSTS (2 ans) quand le site est servi en HTTPS. |
| Spam du chat | Un message toutes les 3 secondes au plus. |
| Données personnelles (loi 09-08) | Le numéro de CIN n'est jamais stocké en clair (seulement masqué). Bouton « Supprimer mes données de ce navigateur » dans *Ma qualification*. |

La CSP est insérée dans chaque page au moment de la construction, avec l'empreinte du script. Toute
modification du script impose de régénérer les pages et `vercel.json` (même script de build).

## Limites assumées

Un prototype sans serveur **ne peut pas** empêcher quelqu'un de modifier son propre navigateur : se
déclarer « vérifié », s'attribuer une capacité, voir le prix de réserve dans le code source. C'est sans
conséquence ici, puisque rien n'est réel. Aucune de ces vérifications ne doit être reprise telle quelle.

## Ce que le vrai produit devra imposer côté serveur

1. **Offres** : validées uniquement par le serveur (montant ≥ offre courante + pas, capacité vérifiée,
   garantie constituée, live ouvert, enchérisseur ≠ vendeur). Horodatage serveur, anti-sniping côté serveur.
2. **Authentification** : comptes réels, sessions sécurisées (cookies `HttpOnly`, `Secure`, `SameSite`),
   double facteur pour les vendeurs, agents et notaires.
3. **Identité et capacité** : prestataire KYC agréé, justificatifs de financement vérifiés par un humain ou
   un partenaire bancaire ; le client ne reçoit qu'un statut, jamais les pièces.
4. **Prix de réserve** : jamais envoyé au navigateur ; seul « atteint / non atteint » est transmis.
5. **Données personnelles** : chiffrement des CIN et documents au repos, accès journalisé, durée de
   conservation définie, déclaration ou autorisation CNDP (loi 09-08), hébergement conforme.
6. **Journal d'audit** inaltérable de chaque offre et de chaque changement de statut d'un lot.
7. **Limitation de débit** et détection d'abus (offres, chat, création de comptes), modération du chat.
8. **Intégrité des enchères** : contrôles anti-collusion et anti-« shill bidding » (vendeur ou proches qui
   enchérissent), conflits d'intérêts agent / acheteur.
9. **Fonds** : aucune garantie détenue par BID ; dépôt auprès d'un notaire ou d'un établissement habilité.

## Signaler un problème

Ouvrez une issue sur le dépôt en indiquant « sécurité » dans le titre, sans détail exploitable en public ;
nous vous recontacterons pour les détails.
