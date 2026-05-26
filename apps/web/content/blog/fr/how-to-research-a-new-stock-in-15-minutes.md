---
title: Comment rechercher une nouvelle action en 15 minutes avec PickSkill
description: >-
  Un workflow complet de première passe de recherche actions — modèle
  économique, financiers, valorisation, setup technique et risques — en 15
  minutes avec le chat et les indicateurs.
publishedAt: 2026-05-26T00:00:00.000Z
updatedAt: 2026-05-26T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    L'équipe de recherche PickSkill — un analyste IA pour les investisseurs
    particuliers.
pillar: how-to
tags:
  - Tutoriel
  - Recherche
  - Workflow
  - DCF
  - 10-K
  - Indicateurs
heroImage: /blog/how-to-research-a-new-stock-in-15-minutes/hero.png
heroAlt: >-
  Infographie éditoriale — workflow de recherche en 5 étapes à gauche
  (entreprise → finances → valorisation → technique → risques), carte de
  décision sur une page pour TSM à droite.
---

**Une session de première passe de recherche actions qui prenait 2 à 3 heures peut être complétée en 15 minutes avec le bon workflow.** Pas parce que vous sautez des étapes — le cadre couvre toujours le modèle économique, les financiers, la valorisation, le setup technique et les risques — mais parce que PickSkill compresse l'étape de collecte de données en secondes et vous laisse les 15 minutes dont vous avez réellement besoin : les jugements. Ce tutoriel est le workflow canonique de première passe. Utilisez-le pour tout nouveau nom que vous considérez, avant de décider de l'ajouter à une watchlist ou d'engager plus de temps de recherche.

### Points clés

- **5 étapes, ~15 minutes au total.** Activité → financiers → valorisation → technique → risques. Chaque étape est un prompt.
- **Le cadre force une pensée structurée** — pas de saut à « devrais-je acheter ? » avant d'avoir répondu aux questions amont.
- **Produit un résumé d'une page** adapté à l'ajout à une [watchlist](/blog/how-to-build-a-watchlist-that-actually-works) ou au rejet du nom.
- **La version rapide (15 minutes) attrape 80 % des dealbreakers.** La version lente (2+ heures de travail approfondi) n'est nécessaire qu'après que la version rapide ait dit « intéressant ».
- **Fonctionne sur les noms US, Hong Kong et actions A** avec le même workflow — PickSkill récupère les filings appropriés au marché.

## Pourquoi c'est important

La plupart des investisseurs retail trébuchent à l'étape de première passe de recherche. Deux défaillances courantes :

1. **Sauter directement au graphique.** « Le graphique paraît bien » n'est pas une thèse. Sans la vérification du modèle économique et des financiers, vous achetez un pattern de prix.
2. **Se noyer dans les détails.** Lire le 10-K complet, les 8-K, la dernière transcription d'earnings call et tous les rapports d'analystes avant de décider si un nom mérite même un travail plus profond. Au moment où vous finissez, vous avez passé 4 heures sur un nom que vous auriez rejeté à l'heure une avec un cadre structuré.

Le workflow de première passe de 15 minutes est le filtre de rejet. La plupart des noms que vous rechercherez ne le passeront pas. Le point est de passer 15 minutes par nom et de réserver le deep dive de 2 heures pour les noms qui le passent.

## Le workflow en 5 étapes

### Étape 1 — Modèle économique (3 minutes)

Ouvrez [/chat](/chat). Collez ce prompt :

```text
Résume [TICKER] en 5 bullets :
1. Que fait réellement l'entreprise (1 phrase)
2. Répartition du chiffre d'affaires — top 3 segments et leur % du total
3. Top 3 clients ou concentration client
4. Top 3 concurrents  
5. La seule question la plus importante que cette entreprise doit bien gérer
```

PickSkill renvoie un résumé concis du modèle économique construit à partir du dernier 10-K et des récents communiqués. Le cadrage « seule question la plus importante » force la clarté sur ce qui pilote réellement l'activité — un test utile pour savoir si vous comprenez l'entreprise ou juste le ticker.

**Red flags à cette étape** : modèle économique pas clair après 5 bullets, concentration client supérieure à 30 % sur un seul client, pas de barrière concurrentielle visible. Arrêtez-vous ici si vous voyez ces éléments ; le nom ne mérite pas les 12 minutes suivantes.

### Étape 2 — Santé financière (3 minutes)

Prompt suivant :

```text
Pour [TICKER], récupère les 4 derniers trimestres et 3 dernières années de :
- Chiffre d'affaires et croissance du CA YoY
- Trajectoire de la marge brute
- Trajectoire de la marge opérationnelle  
- Free cash flow (4 derniers trimestres)
- Position de dette nette (cash − dette totale)
- Évolution du nombre d'actions YoY (rachats vs émissions)
```

PickSkill rend cela en petit tableau. L'histoire financière devrait être cohérente en une minute de lecture.

**Red flags à cette étape** : croissance du CA qui décélère brutalement, marges qui se compriment sans cause claire, free cash flow négatif qui ne provient pas d'investissements de croissance intentionnels, nombre d'actions en hausse de 5 %+ par an sans activité d'acquisition.

### Étape 3 — Instantané de valorisation (3 minutes)

Prompt suivant :

```text
Pour [TICKER], calcule :
- P/E trailing actuel, P/E forward, EV/EBITDA, P/B
- Fourchette historique sur 5 ans pour chaque multiple (10e–90e percentile)
- Où les multiples actuels se situent dans cette fourchette historique
- Compare les multiples actuels aux 3 pairs les plus proches
- DCF rapide sur 5 ans — prix implicite aux hypothèses de base
```

PickSkill renvoie les multiples, la comparaison avec les pairs et un DCF rapide (voir [Construire un DCF en 60 secondes](/blog/build-dcf-in-60-seconds) pour la version complète).

**Red flags à cette étape** : chaque multiple au sommet de sa fourchette sur 5 ans sans accélération claire des fondamentaux pour le justifier ; prix implicite du DCF plus de 30 % en dessous du courant ; valorisation relative plus élevée que tous les pairs.

### Étape 4 — Setup technique (3 minutes)

Prompt suivant :

```text
Pour [TICKER], montre-moi le setup technique actuel :
- Cours vs MA 20 / 60 / 200 jours
- Lectures actuelles MACD, RSI, KDJ
- Divergence active (régulière ou cachée)
- Niveaux de support et résistance les plus proches
- Trace de bucket sur 5 jours sur la suite d'indicateurs complète
```

PickSkill récupère les données [/indicators](/indicators) et fait remonter l'alignement multi-signal.

**Red flags à cette étape** : entrée profondément surachetée (RSI > 75, tous les indicateurs épinglés haut), divergence baissière en formation, cours étendu très au-dessus de la SMA 200 jours. Ce ne sont pas des setups à acheter maintenant ; ce sont des noms à attendre le pullback.

### Étape 5 — Risques (3 minutes)

Prompt final :

```text
Pour [TICKER], liste :
- Top 3 risques de la section facteurs de risque du dernier 10-K
- Top 3 risques des earnings calls récents (4 derniers trimestres)
- Un scénario adverse — à quoi ressemble cette action si le bull case a tort ?
```

PickSkill résume les facteurs de risque du 10-K et les commentaires récents du management. La question du scénario adverse est celle que la plupart des lecteurs retail sautent — et celle qui attrape les erreurs les plus coûteuses.

**Red flags à cette étape** : les risques déclarés par le management incluent concentration sur un seul client, surplomb réglementaire, stress de bilan, ou toute formulation « going concern ». Ce ne sont pas des disqualifications automatiques mais ils devraient recadrer la conversation sur le dimensionnement de position.

## Comment compiler la sortie

Après l'étape 5, demandez :

```text
Compile cette conversation en un résumé d'une page que je peux sauvegarder :
- Modèle économique en 2 phrases
- Trajectoire financière en 4 bullets
- Résumé valorisation avec 3 lignes bull/base/bear
- Statut du setup technique
- Top 3 risques
- Décision : watchlist, recherche approfondie, ou passe
```

PickSkill renvoie un one-pager structuré. Sauvegardez-le via le marque-page de session chat. Si vous décidez de mettre le nom sur la [watchlist](/blog/how-to-build-a-watchlist-that-actually-works), le one-pager devient votre document de thèse.

> **Essayez maintenant.** Ouvrez [/chat](/chat) et exécutez les 5 prompts ci-dessus sur un nom que vous considérez. La boucle entière prend ~15 minutes incluant le temps de lecture.

## Ce que le workflow attrape et que la recherche ad-hoc manque

### 1. Rejet structurel vs rejet piloté par le prix

La recherche ad-hoc rejette souvent les noms sur la base de l'apparence du graphique (« paraît suracheté ») sans vérifier si l'entreprise vaut même la peine d'être détenue à un quelconque prix. Le workflow structuré inverse l'ordre : activité → financiers → valorisation → technique. Si l'activité ou les financiers échouent, le graphique n'a pas d'importance ; si l'activité et les financiers passent, le graphique vous dit sur le timing, pas sur la viabilité.

### 2. La question du scénario adverse

L'étape la plus sautée dans la recherche retail est « à quoi ressemble le bear case ? ». Le workflow structuré la force. Sans elle, vous sur-pondérez le bull case et sous-préparez la variance.

### 3. Synthèse multi-sources en un seul endroit

Le workflow tire les données 10-K, les résultats récents, les multiples actuels, la comparaison avec les pairs et l'état technique dans une seule session chat. Chaque pièce prendrait 10–20 minutes à rassembler manuellement — PickSkill compresse chacune en secondes, laissant du temps pour la vraie réflexion.

## Quatre pièges dans la recherche actions

1. **Sauter l'étape modèle économique.** Connaître le ticker d'une action n'est pas connaître l'entreprise. Sans le résumé en 5 bullets, vous tradez un ticker, vous ne recherchez pas une entreprise.
2. **Ignorer le scénario adverse.** Les bull cases se vendent eux-mêmes ; les bear cases doivent être délibérément mis en avant. Si vous ne pouvez pas articuler le bear case, vous n'avez pas fait la recherche.
3. **Traiter « tout vert » comme un achat.** Une action avec des fondamentaux forts, une valorisation attractive et de bons techniques n'est pas automatiquement un achat — parfois c'est un nom où l'argent facile a été fait et où les 12 prochains mois seront plats. Le dimensionnement de position et la discipline de niveau d'entrée comptent.
4. **Ne pas engager la sortie en watchlist ou rejet.** Tout l'intérêt de la première passe de 15 minutes est la prise de décision à la fin. « Je dois y penser » est le tueur — il consomme de la bande passante mentale sans produire de décision. Forcez-vous à atterrir sur watchlist, recherche approfondie, ou passe.

## Comment cela s'applique sur les actions A

Le workflow fonctionne identiquement sur les noms actions A et Hong Kong. Deux ajustements spécifiques :

- Pour les actions A, le « 扣非净利润 » (résultat net hors éléments non récurrents) est le chiffre de bénéfices pertinent ; PickSkill l'utilise par défaut pour calculer le P/E et la croissance du BPA des actions A.
- Les multiples de valorisation des actions A sont structurellement plus bas que les pairs US pour la plupart des secteurs. Comparez à la fourchette historique des actions A, pas à l'équivalent US.

Voir [Meilleurs indicateurs pour les actions A](/blog/best-indicators-for-a-shares) pour le playbook plus large spécifique au marché.

## Prompts de suivi courants

Après la première passe de 15 minutes :

- *« DCF plus profond sur [ticker] — table de sensibilité complète, projection de CA par segment. »*
- *« Compare [ticker] à ses 3 pairs les plus proches sur la pile complète de multiples et la croissance du FCF. »*
- *« Génère un investor deck pour [ticker] à partir de cette conversation. »* (Voir [Générer un investor deck depuis un chat](/blog/generate-investor-deck-from-chat).)
- *« Ajoute [ticker] à ma watchlist avec cette thèse : [...] »*
- *« Programme une re-revue de [ticker] pour la prochaine publication de résultats. »*

## Pour aller plus loin

- [Construire un DCF en 60 secondes](/blog/build-dcf-in-60-seconds) — le deep dive de valorisation quand la première passe de 15 minutes passe.
- [Comment lire un 10-K en 30 minutes](/blog/how-to-read-10k) — la version lecture approfondie manuelle des étapes 1 + 2.
- [Comment construire une watchlist qui fonctionne vraiment](/blog/how-to-build-a-watchlist-that-actually-works) — où vont ensuite les noms qui passent la première passe.

## FAQ

**Pourquoi 15 minutes — n'est-ce pas trop rapide pour une action ?**
Pour une décision oui/non de première passe, 15 minutes c'est plus qu'assez — la plupart des noms devraient être rejetés à cette étape. Le travail approfondi (modéliser des hypothèses spécifiques, lire chaque filing SEC récent, parler à d'ex-employés) est réservé au petit sous-ensemble de noms qui survit à la première passe. Passer 4 heures sur chaque nom que vous rencontrez est le mode de défaillance dominant des investisseurs retail motivés.

**Puis-je rechercher plusieurs noms en parallèle ?**
Oui — PickSkill supporte des sessions chat parallèles. De nombreux utilisateurs ouvrent 3 à 5 sessions simultanément et exécutent le même template de 5 prompts sur chacune. La structure rend la recherche en lot pratique.

**Que faire si PickSkill n'a pas de données sur le nom ?**
PickSkill couvre la plupart des noms cotés aux États-Unis (NYSE / NASDAQ), à Hong Kong (HKEx) et en actions A (SSE / SZSE). Pour les noms très petits ou récemment cotés, la couverture peut être plus mince — PickSkill vous dira quels points de données sont indisponibles plutôt que de fabriquer.

**Faut-il sauvegarder les sessions chat ?**
Oui — chaque session chat dans PickSkill est persistante. Marquez les sessions de recherche utiles pour référence ultérieure. Quand vous décidez de prendre une position, la session chat est la trace d'audit de comment vous êtes arrivé à la thèse.

**En quoi cela diffère-t-il de la recherche générique ChatGPT ?**
Le chat PickSkill est ancré dans des filings en direct, des données de marché et des indicateurs calculés — pas dans les données d'entraînement du modèle. ChatGPT hallucinera les chiffres de CA et les P/E ; PickSkill les tire de sources primaires au moment de la requête. La différence structurelle compte le plus pour les étapes financière et valorisation, où des chiffres périmés ou fabriqués peuvent complètement changer la conclusion.
