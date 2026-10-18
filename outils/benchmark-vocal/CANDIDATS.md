# Fournisseurs candidats au benchmark vocal

Document de comparaison, à l'appui de la décision. Aucun fournisseur n'est choisi, branché ni payé.

Relevé le 18 octobre 2026 dans les documentations publiques des éditeurs (pages officielles, fiches de modèles, conditions). Prix en dollars US, hors taxes, tarif public sans engagement. Les prix et les conditions changent souvent : à revérifier le jour de l'inscription.

Légende : **ND** = non documenté dans les sources officielles consultées · **[Déd.]** = déduction, pas une affirmation de l'éditeur.

## L'essentiel

- **Aucun éditeur ne revendique la darija mélangée au français.**
  - Plusieurs couvrent l'arabe marocain seul, c'est-à-dire la locale `ar-MA` : Google Chirp 3 (en Preview), Azure Speech et Deepgram Nova-3 (monolingue).
  - D'autres gèrent le code-switching, mais sans arabe marocain : Gemini 3.5 Transcribe, AssemblyAI Universal-3.5 Pro, Speechmatics Melia 1, ElevenLabs Scribe v2.
  - Le benchmark est donc indispensable : aucun chiffre publié ne porte sur des vocaux de téléphone en darija et en français.
- **Une seule piste vraiment entraînée sur la darija :** les modèles open source sortis fin septembre 2026 par Mistral avec le Ministère de la Transition Numérique (Voxtral-Mini-4B-Realtime-Arabic). Ils sont très récents et doivent être hébergés par nos soins.
- **Les recherches publiées confirment l'enjeu :** sur la darija, Whisper-large-v3 sans adaptation affiche un WER de 87,2 % (article Casablanca, https://arxiv.org/html/2410.04527v1).
- **Coût du benchmark lui-même :** 30 vocaux d'environ 1 min 45 font environ 50 minutes d'audio, soit moins de 1 $ par moteur STT aux tarifs relevés. Le coût ne départage pas les moteurs à ce stade ; il comptera en production.
- **Cadre légal (loi 09-08, voir le formulaire de consentement).**
  - Un traitement dans l'UE se fait dans un pays reconnu par la CNDP (délibération n° 236-2015) ; un traitement aux États-Unis, non.
  - Hors de la liste, il faut le consentement exprès des commerciaux ou une autorisation de la CNDP.
  - La colonne « Région » est donc décisive.

---

## A · STT multilingue généraliste → extraction

| | **OpenAI gpt-transcribe** | **AssemblyAI Universal-3.5 Pro** | **ElevenLabs Scribe v2** |
|---|---|---|---|
| Arabe / darija | Codes ISO acceptés ; arabe et darija non listés sur la page (ND) | Arabe dans les 18 langues ; aucun dialecte cité | Arabe « Good » (WER entre 10 et 20 %) ; darija non citée |
| Français | Oui | Oui | « Excellent » (WER ≤ 5 %) |
| Code-switching | Paramètre `languages` (« plus d'une langue dans l'enregistrement »), sans garantie sur le mélange | Natif entre ses 18 langues ; paire arabe-français non démontrée | « Plusieurs langues dans un même fichier », détection automatique ; paires non précisées |
| Contexte / vocabulaire | `prompt` et `keywords` | `prompt` en langage naturel et `keyterms_prompt` (jusqu'à 1 000 termes) | `keyterms` jusqu'à 1 000 en batch (+20 %) |
| Type | STT | STT | STT |
| Latence | Batch avec texte renvoyé au fil du traitement ; pas de chiffre | Batch : « moins d'environ 10 s » sur les exemples de démo ; pas de SLA | Batch : ND |
| Tarif | 0,0045 $/min | 0,21 $/h (0,0035 $/min), keyterms +0,05 $/h | 0,22 $/h (0,0037 $/min), keyterms +0,05 $/h |
| Conservation | Endpoint de transcription : aucune rétention pour la surveillance des abus | Audio supprimé sous 24 à 48 h, transcriptions 30 jours (réglable jusqu'à 1 h) ; un article d'aide dit « indéfini » sans réglage, contradiction | Historique activé par défaut ; éléments supprimés gardés jusqu'à 30 jours en sauvegarde |
| Entraînement | Non par défaut (opt-in) | Possible selon contrat, sauf opt-out et sauf données traitées dans l'UE | Oui par défaut, avec opt-out ; non par défaut en Enterprise |
| Région | US, ou UE (`eu.api.openai.com`) après approbation et avenant, +10 % | UE (`api.eu.assemblyai.com`) pour le batch | US par défaut ; UE réservée à l'Enterprise |
| Zero retention / entreprise | ZDR sur approbation d'OpenAI | Zero retention en streaming et en synchrone avec opt-out ; offre auto-hébergée | `enable_logging=false`, Enterprise uniquement |
| Limites | 25 Mo par fichier | 5 Go, 10 h | 5 Go selon la référence API (3 Go selon une autre page), 10 h |
| Documentation | [transcription](https://developers.openai.com/api/docs/guides/speech-to-text) · [prix](https://developers.openai.com/api/docs/pricing) · [données](https://developers.openai.com/api/docs/guides/your-data) | [modèle](https://www.assemblyai.com/docs/pre-recorded-audio/universal-3-5-pro) · [prix](https://www.assemblyai.com/pricing) · [données](https://www.assemblyai.com/docs/data-retention-and-model-training) · [région UE](https://www.assemblyai.com/docs/speech-to-text/pre-recorded-audio/select-the-region) | [capacités](https://elevenlabs.io/docs/overview/capabilities/speech-to-text) · [prix](https://elevenlabs.io/pricing/api) · [entraînement](https://elevenlabs.io/docs/help-center/legal/is-my-data-used-to-improve-eleven-labs-ai-models) · [résidence](https://elevenlabs.io/docs/overview/administration/data-residency) |

[Déd.] Sans contrat Enterprise, AssemblyAI en UE et OpenAI en UE sont les deux options qui évitent à la fois l'entraînement et un traitement hors liste CNDP. ElevenLabs n'en offre aucune hors Enterprise.

## B · STT spécialisé darija / arabe maghrébin → extraction

| | **Voxtral-Mini-4B-Realtime-Arabic** (Mistral × MTNRA) | **Azure AI Speech, `ar-MA`** (fast transcription ou LLM Speech) | **Google Chirp 3, `ar-MA`** |
|---|---|---|---|
| Arabe / darija | Fine-tuné pour le code-switching arabe. CER moyen de 8,82 % sur 7 benchmarks arabes, dont un benchmark darija (scores seulement en graphique) | Locale « Arabic (Morocco) » ; ne dit pas si elle couvre la darija parlée | Locale `ar-MA` en **Preview**, multi-région UE |
| Français | Non cité sur la fiche (la presse parle d'arabe, français et anglais mélangés) | `fr-FR` complet | `fr-FR` GA |
| Code-switching | Objectif déclaré du modèle (arabe) | Plusieurs `locales` : identification de langue, par phrase selon les exemples (la doc se contredit) ; LLM Speech multilingue par défaut | Plusieurs codes possibles (`["ar-MA","fr-FR"]`) ; code-switching non mentionné |
| Contexte / vocabulaire | ND | LLM Speech : prompt de contexte et phrase list ; Custom Speech pour `ar-MA` (audio + transcription, ou texte) | Adaptation jusqu'à 1 000 phrases ; prompt personnalisé en Preview |
| Type | STT, temps réel | STT (LLM Speech : transcription assistée par un LLM) | STT |
| Latence | Réglable, 480 ms recommandés en temps réel | « Plus rapide que le temps réel », pas de chiffre | ND ; synchrone limité à moins d'1 min, batch de 1 min à 1 h |
| Tarif | Gratuit (Apache 2.0) ; coût de l'hébergement : un GPU de 16 Go ou plus, avec vLLM | **Non lisible** (la page de prix affiche « $- ») : à relever avec le calculateur Azure | 0,016 $/min (barème Standard), batch dynamique 0,003 $/min |
| Conservation | Chez nous : aucune donnée envoyée à un tiers | Temps réel et fast : « Microsoft does not retain or store the data » ; batch : durée réglable | V1 : audio non stocké, transcription asynchrone gardée environ 5 jours ; pour la V2 (Chirp 3) : ND |
| Entraînement | Sans objet | ND sur la page STT ; modèles Custom Speech privés | Seulement avec le « data logging » (opt-in) |
| Région | Notre infrastructure | UE : France Central, West Europe, North Europe, Sweden Central… ; aucune au Maroc | Multi-région `eu` |
| Zero retention / entreprise | Auto-hébergement complet | Conteneurs (audio jamais envoyé au cloud), conteneurs déconnectés | ZDR spécifique : ND |
| Maturité | Sorti fin septembre 2026 ; pas d'API ni de prix ; données d'entraînement non déclarées | Service établi | Locale en Preview |
| Documentation | [fiche](https://huggingface.co/mistralai/Voxtral-Mini-4B-Realtime-Arabic) · [LIDstral-Arabic](https://huggingface.co/mistralai/LIDstral-Arabic) | [langues](https://learn.microsoft.com/azure/ai-services/speech-service/language-support) · [fast transcription](https://learn.microsoft.com/azure/ai-services/speech-service/fast-transcription-create) · [LLM Speech](https://learn.microsoft.com/azure/ai-services/speech-service/llm-speech) · [prix](https://azure.microsoft.com/en-us/pricing/details/speech/) · [données](https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-ai/speech-service/speech-to-text/data-privacy-security) · [régions](https://learn.microsoft.com/azure/ai-services/speech-service/regions) | [Chirp 3](https://docs.cloud.google.com/speech-to-text/docs/models/chirp-3) · [langues](https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages) · [prix](https://cloud.google.com/speech-to-text/pricing) · [données](https://docs.cloud.google.com/speech-to-text/docs/v1/data-usage-faq) |

En réserve :
- **Deepgram Nova-3 `ar-MA`.**
  - Dialecte marocain explicite, mais monolingue : le mode multilingue n'inclut pas l'arabe.
  - Tarif : 0,0043 $/min.
  - Données gardées pour l'amélioration des modèles par défaut (`mip_opt_out=false`).
  - Endpoint UE.
  - Documentation : [langues](https://developers.deepgram.com/docs/models-languages-overview), [opt-out](https://developers.deepgram.com/docs/the-deepgram-model-improvement-partnership-program).
- **Speechmatics.**
  - Arabe maghrébin annoncé, mais pas de pack arabe-français.
  - Entraînement en opt-in uniquement ; région EU1.
  - Documentation : [arabe](https://www.speechmatics.com/speech-to-text/arabic), [langues](https://docs.speechmatics.com/speech-to-text/languages).
- **Modèles open source mineurs.**
  - MoulSot v0.3 (AtlasIA) : WER 38,99 % ; rapport technique à paraître.
  - DVoice (SpeechBrain) : WER 18,28 % sur son propre jeu de test.
  - Plus anecdotiques ou à écarter :
    - Whisper fine-tunés par des particuliers ;
    - MMS de Meta, dont la licence interdit l'usage commercial.

## C · Modèle audio natif : audio + contexte → JSON

| | **Google Gemini 3.8 Flash** | **OpenAI gpt-audio-1.5** | **Mistral Voxtral Small** |
|---|---|---|---|
| Arabe / darija | Pas de liste de langues pour l'audio (ND) | ND | Arabe absent de la liste citée en exemple ; darija non citée |
| Français | ND (pas de liste) | ND | Oui |
| Code-switching | ND | ND | ND |
| Contexte | Prompt libre, plus le contexte CRM dans la même requête | Prompt système et messages | Prompt de chat, contexte de 32 000 tokens |
| Type | Audio natif | Audio natif (Chat Completions uniquement) | Audio natif |
| Latence | ND | ND | ND |
| Tarif | 0,75 $ par million de tokens en entrée jusqu'au 31/12/2026, puis 1,50 $ ; 1 920 tokens par minute d'audio, soit environ 0,0014 $/min, puis 0,0029 $/min [Déd.] ; sortie 3,75 $ par million | Audio : 32 $ en entrée et 64 $ en sortie par million de tokens ; tokens par minute ND | 0,004 $/min d'audio + 0,1 $ en entrée et 0,4 $ en sortie par million de tokens |
| Conservation | API payante : journaux anti-abus « pour une durée limitée » ; Vertex : cache de 24 h maximum, désactivable | Journaux anti-abus 30 jours | 30 jours glissants, sauf ZDR |
| Entraînement | API payante : non ; offre gratuite : oui (à exclure) ; Vertex : jamais sans autorisation | Non par défaut | Contradiction dans la doc (« jamais » contre « sous réserve d'opt-out ») : à faire confirmer par écrit |
| Région | Gemini API : non garantie ; Vertex : endpoint `eu` garanti (+10 %) | US, UE possible après approbation | UE par défaut (`api.eu.mistral.ai`) |
| Zero retention / entreprise | Vertex : ZDR sur demande | ZDR « avec limitations » sur Chat Completions | ZDR sur plans payants, sur demande validée |
| Documentation | [audio](https://ai.google.dev/gemini-api/docs/audio) · [prix](https://ai.google.dev/gemini-api/docs/pricing) · [Vertex ZDR](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/vertex-ai-zero-data-retention) · [résidence Vertex](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/data-residency) | [modèle](https://developers.openai.com/api/docs/models/gpt-audio-1.5) · [audio](https://developers.openai.com/api/docs/guides/audio-chat-completions) · [données](https://developers.openai.com/api/docs/guides/your-data) | [fiche](https://docs.mistral.ai/models/voxtral-small-25-07) · [prix](https://mistral.ai/pricing/api/) · [ZDR](https://docs.mistral.ai/admin/monitor-comply/zero-data-retention) |

Anthropic (Claude) n'accepte pas l'audio en entrée selon sa documentation (« text and image input »), et ne peut donc pas figurer en C.

## D · STT → traduction en français → extraction

La partie STT reprend un candidat de A ou de B. Ce qui se compare ici, c'est le modèle de langage qui traduit puis extrait. Les mêmes modèles servent à l'extraction dans A, B et F, ainsi qu'à la référence E0. Prix par million de tokens, en entrée / en sortie.

| | **Mistral** (Small 4 / Large 4) | **OpenAI** (gpt-6-luna / gpt-6.1-sol) | **Anthropic** (Claude Haiku 5.5 / Opus 5.5) |
|---|---|---|---|
| Arabe | « Strong expected performance », sans score ; Mistral Saba retiré | Non documenté | Score publié pour la génération 4.5 (Sonnet : 97,2 % de la performance en anglais) ; rien pour 5.5 ; dialectes non cités |
| Sortie JSON contrainte | Oui (`response_format` avec schéma) | Oui (Structured Outputs, `strict`) | Oui (`json_schema`, outils `strict`) |
| Tarif modèle rapide | 0,15 $ / 0,60 $ | 0,10 $ / 0,50 $ | 0,10 $ / 0,50 $ (prompt jusqu'à 100 000 tokens) |
| Tarif haut de gamme | 0,68 $ / 2,09 $ (prix promotionnel) | 2 $ / 10 $ | 4 $ / 20 $ |
| Conservation | 30 jours, sauf ZDR | Journaux anti-abus jusqu'à 30 jours | 30 jours |
| Entraînement | Opt-out à activer (Admin › Privacy) : par prudence, le désactiver | Non par défaut | Non par défaut |
| Région | UE par défaut, endpoint UE | US, UE ou Émirats (après approbation, +10 %) | API directe : `global` ou `us` uniquement, **pas d'UE** ; via Bedrock ou Vertex, régions UE non vérifiées |
| Zero retention | Sur demande, plans payants | Sur approbation | Sur demande |
| Documentation | [prix](https://docs.mistral.ai/inference/pricing) · [langues](https://docs.mistral.ai/resources/languages) · [ZDR](https://docs.mistral.ai/admin/monitor-comply/zero-data-retention) · [régions](https://docs.mistral.ai/inference/regional-inference) | [prix](https://developers.openai.com/api/docs/pricing) · [JSON](https://developers.openai.com/api/docs/guides/structured-outputs) · [données](https://developers.openai.com/api/docs/guides/your-data) | [prix](https://platform.claude.com/docs/en/about-claude/pricing) · [multilingue](https://platform.claude.com/docs/en/build-with-claude/multilingual-support) · [conservation](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) · [résidence](https://platform.claude.com/docs/en/manage-claude/data-residency) |

Google Gemini (3.5 Flash-Lite à 0,30 $ / 2,50 $, Gemini 4 Argon à 2 $ / 10 $ jusqu'au 30/11/2026 puis 4 $ / 20 $) est une quatrième option. Sur Vertex, l'endpoint `eu` garantit un traitement dans l'UE.

## F · Deux STT combinés → extraction

Le principe : un moteur fort en darija et un moteur fort en français, ou un moteur qui gère explicitement le code-switching, dont les deux transcriptions sont données ensemble à l'extraction.

| | **Gemini 3.5 Transcribe** | **Speechmatics Melia 1** | Paire à composer |
|---|---|---|---|
| Rôle | Le seul qui documente le code-switching intra-phrase (« sans configuration ») | Multilingue automatique, avec la langue indiquée par segment | Moteur darija de B + moteur généraliste de A |
| Arabe | Uniquement `ar-EG` (Égypte), pas de `ar-MA` | Pack « Global Arabic » : arabe standard, Golfe, Égypte, Levant ; Maghreb non cité | Selon la paire |
| Français | `fr-FR` | Oui | |
| Vocabulaire | `custom_vocabulary` jusqu'à 1 000 termes | Dictionnaire indisponible sur Melia (« Not yet ») | |
| Tarif | 2 $ en entrée audio et 12 $ en sortie par million de tokens (environ 0,005 $/min au total) | 0,12 $/h (0,002 $/min) | Somme des deux |
| Conservation | Gemini API payante : journaux anti-abus de durée non précisée ; Vertex : voir C | Batch : 7 jours, suppression anticipée possible | |
| Entraînement | API payante et Vertex : non | Opt-in uniquement | |
| Région | Vertex `eu` à vérifier pour ce modèle | EU1 ou US1 | |
| Documentation | [modèle](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-transcribe) · [prix](https://ai.google.dev/gemini-api/docs/pricing) | [modèles](https://docs.speechmatics.com/speech-to-text/models) · [prix](https://www.speechmatics.com/pricing) · [conditions](https://www.speechmatics.com/legal/terms-of-service) · [régions](https://docs.speechmatics.com/get-started/authentication) | |

---

## À faire confirmer par écrit avant toute inscription

- **Mistral :** l'entraînement sur les données API. La documentation se contredit.
- **Azure :** les tarifs de la fast transcription et de LLM Speech, illisibles sur la page publique ; la disponibilité de ces fonctions dans une région UE ; l'usage des données pour LLM Speech.
- **Google :**
  - la conservation pour la version 2 de Speech-to-Text (Chirp 3), non documentée ;
  - la sortie de Preview de `ar-MA` ;
  - la disponibilité de Gemini 3.5 Transcribe et de Gemini 3.8 Flash sur Vertex `eu`.
- **Deepgram :** la conservation par défaut (page introuvable) et le surcoût éventuel de l'opt-out d'entraînement.
- **OpenAI :** les délais d'approbation pour le traitement UE ou la ZDR.
- **Anthropic :** la disponibilité en région UE via Bedrock ou Vertex.
- **Voxtral Arabic :** le support du français et les données d'entraînement.

## Grille de décision proposée

Pour chaque candidat, répondre par oui ou non avant de l'admettre au benchmark :

1. Traitement possible dans un pays de la liste CNDP (UE notamment), ou consentement exprès des commerciaux recueilli pour ce fournisseur ?
2. Aucune utilisation des données pour l'entraînement, garantie par défaut ou par un réglage activé ?
3. Conservation connue et compatible avec la date de suppression du formulaire ?
4. Arabe et français couverts dans le même appel, ou rôle clair dans une combinaison F ?
5. Accessible sans contrat Enterprise pendant le benchmark, ou contrat déjà en place ?

La qualité réelle sur nos vocaux reste à mesurer : ce document ne compare que des promesses et des conditions.
