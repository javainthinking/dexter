---
title: Comment trouver des actions survendues en 60 secondes avec PickSkill
description: >-
  Utilisez le tableau de bord RSI pour scanner un portefeuille ou une watchlist
  à la recherche d'opportunités survendues, filtrer par régime de tendance et
  transformer les candidats en entrées classées.
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
  - RSI
  - Survendu
  - Screening
  - Workflow
heroImage: /blog/how-to-find-oversold-stocks/hero.png
heroAlt: >-
  Infographie éditoriale — chaîne de filtres en entonnoir : ~30 candidats bruts
  RSI<30 → ~12 après filtres ADX + MM 200 jours → ~2 setups actionnables après
  confirmation multi-niveaux.
---

**« Survendu » est l'un des termes d'investissement les plus recherchés — et l'un des plus mal utilisés.** Un simple filtre RSI < 30 paraît être un excellent signal rétrospectivement sur les graphiques où il a fonctionné. Les backtests montrent que le filtre survendu brut est un pile ou face, car la moitié des lectures « survendues » se produisent dans des actions clairement en tendance baissière où la condition de survente peut persister pendant des semaines. Ce tutoriel guide à travers la recherche de candidats survendus véritablement actionnables en 60 secondes — combinant le signal RSI avec des filtres de régime de tendance et des événements de confirmation qui élèvent significativement l'edge par signal.

### Points clés

- **4 étapes, ~60 secondes.** Ouvrir le tableau de bord RSI, trier par RSI courant, filtrer par régime de tendance, ajouter une confirmation avant d'agir.
- **RSI < 30 brut est un pile ou face.** Ajouter [ADX](/blog/what-is-adx) > 25 et un filtre de direction de tendance coupe les faux signaux de 40 à 60 %.
- **Le setup le plus propre** : survendu + ADX fort + cours au-dessus de la MA 200 jours + divergence haussière sur MACD.
- **Surveillez les événements de confirmation** — RSI repassant au-dessus de 30 depuis le bas, ou cassure du cours au-dessus du dernier plus haut de swing.
- **Fonctionne sur lignes US, Hong Kong et actions A** avec une gestion appropriée des barres de jours limites.

## Pourquoi ce workflow compte

La règle « RSI sous 30 = acheter » est l'un des signaux les plus connus en analyse technique. Elle a aussi un track record bien pire que ce que la littérature suggère :

- Dans des marchés baissiers fortement en tendance, le RSI peut rester sous 30 pendant des semaines alors que l'action continue de chuter. Agir à RSI = 28 signifie attraper un couteau qui tombe.
- Dans des marchés agités, le RSI plonge sous 30 régulièrement sur du bruit. La plupart de ces plongeons reviennent rapidement sans produire de mouvements tradables.
- Les setups survendus les plus propres ont une structure additionnelle : un régime de tendance confirmé, un niveau de support clair à proximité et un momentum qui commence à tourner.

Sans un outil qui scanne votre portefeuille à la recherche du setup *combiné*, vous ne pouvez pas appliquer les filtres par couches efficacement. Avec l'outil, le filtre est un clic et la qualité des candidats s'élève substantiellement.

Pour le concept lui-même, voir [Qu'est-ce que le RSI ?](/blog/what-is-rsi).

## Le workflow en 4 étapes

### Étape 1 — Ouvrir le tableau de bord RSI

Allez sur [/indicators](/indicators) et sélectionnez RSI. Le tableau de bord scanne chaque ligne de votre portefeuille par défaut (ou tout portefeuille que vous sélectionnez) et affiche la lecture RSI actuelle, la trace RSI sur 5 jours et la classification par bucket (survendu / survendu-en récupération / neutre / suracheté / suracheté-en repli).

Triez par RSI croissant. Les lectures les plus basses apparaissent en premier.

### Étape 2 — Identifier les candidats

Le tableau de bord fait remonter trois catégories de « RSI bas » :

| État | Valeur RSI | Action |
|---|---|---|
| **Survendu, toujours en baisse** | < 25 et trace dit « décroissant » | Attendre — momentum encore négatif |
| **Survendu, qui tourne** | < 30 et trace dit « croissant » | Candidat pour watchlist |
| **Sortie de survente** | A traversé de < 30 à au-dessus de 30 | Candidat à l'action — événement de confirmation |

Le bucket actionnable est « survendu, qui tourne » ou « sortie de survente ». Le bucket « survendu, toujours en baisse » a besoin de plus de temps. Le simple filtre « RSI < 30 » confond les trois et c'est pourquoi le signal brut sous-performe.

### Étape 3 — Ajouter le filtre de régime de tendance

Avant d'agir sur tout candidat survendu, vérifiez le régime de tendance :

1. **L'ADX doit être au-dessus de 25.** Un ADX faible signifie un marché en range agité ; les signaux survendus y sont à peu près aléatoires.
2. **Cours par rapport à la MA 200 jours** : préférez les candidats au-dessus de leur SMA 200 jours (tendance haussière long terme avec pullback court terme). Les candidats sous la 200 jours sont des setups de style deep-value qui exigent un travail fondamental.
3. **Contexte MACD** : préférez les candidats où le MACD n'a pas encore fait un nouveau plus bas en même temps que le RSI (divergence haussière — voir [Qu'est-ce que la divergence ?](/blog/what-is-divergence)).

Appliquez les trois filtres et le nombre de candidats chute de ~60 à 80 %. Ceux qui restent sont les setups à edge plus élevé.

### Étape 4 — Générer un plan d'entrée

Une fois qu'un candidat passe les filtres, utilisez le chat pour générer un plan d'entrée structuré :

```text
Pour [ticker], le RSI vient de sortir de la survente. Construis-moi un plan d'entrée :
- Cours actuel vs niveau de support le plus proche
- Entrée suggérée (actuel vs ordre à cours limité sur pullback)
- Niveau de stop initial avec 2× ATR ou sous le dernier plus bas de swing
- Cible initiale basée sur le niveau de résistance le plus proche
- Taille de position pour 1 % de risque portefeuille sur un compte de 100 000 $
```

PickSkill renvoie un plan structuré avec niveaux sourcés, une position dimensionnée par [ATR](/blog/what-is-atr) et un ratio risque-rendement. Ajustez les hypothèses inline et relancez.

> **Essayez maintenant.** Ouvrez [/indicators](/indicators), sélectionnez RSI et triez par ordre croissant. Même sur un portefeuille de 10 lignes vous verrez probablement 1 à 3 candidats survendus par mois — mais les candidats *filtrés* (survendu + ADX fort + au-dessus 200 jours + divergence) sont plus rares et plus actionnables.

## Ce que le tableau de bord attrape et que le scan manuel manque

### 1. Le déclencheur de « sortie » vs la condition « en extrême »

Le scan manuel de graphiques trouve souvent des noms avec RSI = 28 et conclut « survendu, à acheter ». Le tableau de bord distingue explicitement entre *encore en baisse* et *en train de tourner à la hausse* — ce dernier étant l'état actionnable. La distinction apparaît généralement 1 à 3 barres après le plus bas absolu du RSI, ce qui est exactement quand les observateurs discrétionnaires de graphiques tendent à agir sur des lectures « survendu » brutes.

### 2. Scan simultané multi-noms

Le scan manuel fonctionne pour quelques noms. Le tableau de bord scanne votre watchlist complète en quelques secondes. Sur une watchlist de 30 noms, il y a généralement au moins un setup survendu-qui-tourne actionnable à tout moment — le trouver manuellement signifie regarder 30 graphiques.

### 3. Détection combinée RSI + régime de tendance + divergence

Le signal RSI brut est un pile ou face ; le signal par couches a un edge significatif. Le scan par couches est impraticable à la main car il exige de vérifier trois indicateurs sur chaque nom. L'automatisation fait du filtre multi-couches le *défaut* plutôt qu'une discipline aspirationnelle.

## Quatre pièges dans le workflow survendu

1. **Agir sur RSI < 30 brut sans filtres.** Le taux de réussite empirique est ~50 % sur le signal brut. Ajouter ADX et filtres de direction l'élève à 60–70 %.
2. **Acheter dans des tendances baissières claires.** « Survendu » sur une action qui a perdu 50 % en un mois n'est généralement pas le fond — c'est une action à momentum qui continuera plus bas. Respectez le filtre de la MA 200 jours.
3. **Ignorer l'événement de sortie.** Acheter à RSI = 25 avec le RSI toujours en tendance baissière signifie que vous pourriez ne pas voir le fond pendant 5 à 15 barres de plus. Attendez le croisement au-dessus de 30 (ou au moins la stabilisation de la trace sur 5 jours) avant de dimensionner.
4. **Dimensionner sans ATR.** Les actions survendues ont souvent un ATR plus élevé que leur régime normal. Utiliser un stop à pourcentage fixe (par exemple, 5 %) sur une action à ATR élevé signifie que le stop est à distance de bruit ; utiliser un stop à 2× ATR dimensionne le trade à la volatilité réelle.

## Comment cela s'applique sur les actions A

La dynamique du marché des actions A modifie la dynamique de la survente :

- **Les séquences limit-down** peuvent produire des lectures RSI sous 20 sur 3 à 5 barres consécutives, même quand l'action a encore plus de baisse devant elle. Associez le filtre RSI à une exclusion des jours limites (les tableaux de bord actions A PickSkill le font automatiquement).
- **Les restrictions de day-trading (T+1)** signifient que les acheteurs retail de survendu s'engagent à un risque overnight. Le dimensionnement de position compte davantage.
- **La rotation sectorielle dans les actions A est plus rapide que dans les actions US** : les candidats survendus dans un secteur en train de rotater *hors* de faveur restent souvent survendus plus longtemps. Recoupez avec la tendance sectorielle.

Voir [Meilleurs indicateurs pour les actions A](/blog/best-indicators-for-a-shares) pour le playbook plus large.

## Workflows de suivi courants

- *« Montre-moi les candidats survendus sur ma watchlist complète où ADX > 25 ET cours au-dessus de la MA 200 jours ET MACD montre divergence haussière — la pile à fort edge. »*
- *« Pour chaque candidat survendu, calcule le stop à 2× ATR et le niveau de résistance le plus proche. Classe par ratio risque-rendement. »*
- *« Backteste le setup survendu par couches (RSI < 30 → croisement RSI > 30 + ADX > 25 + au-dessus 200 jours) sur le S&P 500 sur les 10 dernières années. Quel est le taux de réussite ? »*
- *« Pour mes lignes actions A, exclus tout nom ayant atteint limit-down dans les 5 derniers jours du scan survendu. »*

## Pour aller plus loin

- [Qu'est-ce que le RSI ?](/blog/what-is-rsi) — le concept sous-jacent.
- [Combiner MACD, RSI et ADX en un filtre à 3 indicateurs](/blog/three-indicator-filter) — l'approche par couches en détail.

## FAQ

**Quel niveau de RSI compte comme survendu ?**
30 est le seuil conventionnel mais il n'est pas magique. Dans des marchés fortement en tendance, 25 peut être le seuil opérationnel ; dans des marchés agités, 35 capture plus de setups utilisables. Les tableaux de bord PickSkill ont 30 par défaut pour une comparabilité entre marchés.

**Pourquoi le signal brut « acheter RSI < 30 » sous-performe-t-il ?**
Parce qu'il confond trois états différents : survendu-et-encore-en-baisse (le fond ne s'est pas formé), survendu-et-qui-tourne (l'état actionnable) et survendu-en-marché-baissier (où la condition persiste des semaines). Le filtre par couches (ADX + MA 200 jours + divergence + cross-back au-dessus de 30) adresse chaque mode de défaillance.

**Combien de temps faut-il attendre après que le RSI sorte de la survente ?**
Pour la plupart des setups, le croisement au-dessus de 30 est lui-même le déclencheur. Attendre plus longtemps (par exemple, RSI > 50) réduit significativement le nombre de trades mais augmente l'edge par trade dans les marchés en tendance. Le compromis est entre attraper plus de retournements (tôt) et n'attraper que ceux confirmés (tard). Les tableaux de bord PickSkill font remonter les deux : l'événement de croisement et la confirmation « RSI > 50 ».

**Faut-il trader des setups survendus sur actions individuelles ou attendre des lectures de survente à l'échelle du marché ?**
La survente à l'échelle du marché (VIX > 30, RSI du SPY < 30) est plus rare mais historiquement à edge bien plus élevé — vous attrapez des dislocations plutôt que des drawdowns spécifiques à un nom. Les setups survendus au niveau de l'action sont plus fréquents mais exigent un jugement spécifique au nom sur le fait que l'entreprise soit structurellement saine ou en difficulté.

**Puis-je recevoir des alertes email quand des actions de mon portefeuille deviennent survendues ?**
La fonctionnalité de workflows planifiés (en design — voir le [document de design des workflows](/blog)) supportera cela. Pour l'instant, le tableau de bord RSI est à la demande : ouvrez-le quand vous voulez le scan, et vous obtenez l'état actuel. De nombreux utilisateurs vérifient habituellement le tableau de bord RSI une fois par semaine dans le cadre de leur revue de portefeuille de routine.
