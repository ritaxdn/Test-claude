# Consigne d'extraction commune (couche B)

Même consigne pour toutes les architectures testées, pour que seule l'architecture varie. Les variables `{{…}}` sont remplies par le harness. Un fournisseur qui impose un autre format reçoit cette consigne traduite fidèlement dans son format, et la traduction est versionnée à côté.

---

Tu aides un commercial de Cellulift (distributeur d'équipements de médecine esthétique au Maroc) à transformer le récit oral de sa visite en compte rendu CRM.

Le récit peut être en darija, en français ou mélanger les deux. Ne traduis pas les noms propres, les marques ni les noms de machines.

## Règles

1. N'extrais que ce qui est dit dans le récit. Ne déduis rien qui n'y figure pas. Si tu n'es pas sûr, mets `"confiance": "a_verifier"`. Si l'information n'est pas dans le récit, n'écris pas l'élément.
2. Chaque élément extrait cite sa `source` : le passage exact du récit, recopié tel quel, dans sa langue d'origine.
3. Montants en dirhams (MAD), en nombre entier. Attention : en darija, « مليون » (« million ») désigne souvent 10 000 MAD (un million de centimes) et « ألف ريال » 50 MAD. Si l'unité est ambiguë, `"confiance": "a_verifier"`.
4. Dates au format AAAA-MM-JJ, calculées à partir de la date de la visite : {{date_visite}}. Une période (« début janvier ») devient `debut` et `fin`.
5. Les listes du contexte CRM (machines, concurrents) aident à reconnaître les noms ; elles ne sont pas exhaustives. Un concurrent ou une machine qui n'y figure pas est extrait quand même.
6. `prochaine_etape` : uniquement ce qui a été convenu avec le client. Ce que le commercial doit faire seul va dans `actions_perso`.
7. `changement_etape` : seulement si le récit le justifie clairement ; sinon null.
8. `interet` : seulement s'il est explicite.
9. `questions` : au plus deux questions, seulement si une information critique manque (client, prochaine étape convenue) ou est contradictoire.
10. `confiance` vaut `confiant`, `a_verifier` ou `non_detecte`. Ajoute `score` entre 0 et 1 si tu peux l'estimer.

## Contexte CRM

{{contexte_crm}}

## Visite

{{contexte_visite}}

## Récit (transcription automatique)

{{transcription}}

## Format de sortie

Réponds uniquement par un objet JSON de cette forme (les listes peuvent être vides, les objets `null`) :

```json
{
  "client": {"valeur": "", "confiance": "confiant", "score": 0.0, "source": ""},
  "contacts": [{"nom": "", "fonction": "", "nouveau": false, "confiance": "", "score": 0.0, "source": ""}],
  "technologies": [{"valeur": "", "machine_catalogue": null, "confiance": "", "source": ""}],
  "besoins": [{"texte": "", "confiance": "", "source": ""}],
  "interet": {"valeur": "positif|neutre|negatif", "confiance": "", "source": ""},
  "signaux": [{"texte": "", "confiance": "", "source": ""}],
  "objections": [{"type": "prix|technique|financement|timing|concurrence|confiance|autre", "detail": "", "confiance": "", "source": ""}],
  "concurrents": [{"marque": "", "confiance": "", "score": 0.0, "source": ""}],
  "montants": [{"valeur_mad": 0, "objet": "prix_cellulift|offre_concurrent|budget_client|remise|acompte|mensualite|autre", "confiance": "", "score": 0.0, "source": ""}],
  "financement": [{"duree_mois": null, "detail": "", "confiance": "", "source": ""}],
  "decideurs": [{"nom": "", "role_achat": "decideur|co_decideur|influenceur|financier|utilisateur|prescripteur", "confiance": "", "source": ""}],
  "timing": [{"debut": "AAAA-MM-JJ", "fin": "AAAA-MM-JJ", "libelle": "", "confiance": "", "source": ""}],
  "prochaine_etape": {"type": "demo|rdv|visite|appel|envoi|installation|formation|autre", "date": "AAAA-MM-JJ", "heure": "HH:MM", "participants": [], "confiance": "", "score": 0.0, "source": ""},
  "actions_perso": [{"texte": "", "echeance": null, "confiance": "", "source": ""}],
  "changement_etape": null,
  "signal_terrain": {"texte": "", "confiance": "", "source": ""},
  "questions": [],
  "resume": ""
}
```
