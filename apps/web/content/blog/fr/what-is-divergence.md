---
title: >-
  Qu'est-ce qu'une divergence ? Haussière, baissière et la variante cachée que
  le retail oublie
description: >-
  La divergence est un désaccord directionnel entre le cours et un indicateur.
  Définition, 4 types standard, pourquoi la plupart échouent, et comment filtrer
  celles qui réussissent.
publishedAt: 2026-05-25T00:00:00.000Z
updatedAt: 2026-05-25T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    L'équipe de recherche PickSkill — un analyste IA pour les investisseurs
    particuliers.
pillar: explainer
tags:
  - Divergence
  - Analyse technique
  - Momentum
  - Indicateurs
heroImage: /blog/what-is-divergence/hero.png
heroAlt: >-
  Infographie éditoriale — le prix fait un plus haut plus élevé tandis que le
  RSI fait un plus haut plus bas ; les deux pivots sont entourés pour marquer la
  divergence.
---

**La divergence est le motif technique où le cours et un oscillateur (MACD, RSI, KDJ, OBV) se déplacent dans des directions opposées sur le même mouvement.** Le cours fait un plus haut plus haut tandis que l'indicateur fait un plus haut plus bas — ou le cours fait un plus bas plus bas tandis que l'indicateur fait un plus bas plus haut. Le message sous-jacent : le mouvement visible sur le graphique n'est plus confirmé par le momentum (ou le volume, ou la largeur de marché) qui l'a porté. La plupart des lecteurs retail traitent la divergence comme un déclencheur de renversement. Les backtests disent que c'est un mauvais cadrage — c'est un *avertissement*, pas un signal.

### Points clés

- **Quatre types standard** : divergence haussière classique, divergence baissière classique, divergence haussière cachée, divergence baissière cachée. La paire « classique » avertit d'un renversement ; la paire « cachée » signale une continuation de tendance.
- **La plus grosse erreur** des lecteurs retail : traiter la divergence comme un déclencheur d'entrée autonome. Le taux de réussite brut d'une divergence classique simple tourne autour de 35–45 %, selon le marché et l'horizon temporel.
- **La divergence devient utile une fois filtrée** : confirmée par un croisement de momentum, soutenue par le contexte de volume et respectant le régime de tendance sous-jacent ([ADX](/blog/what-is-adx) > 25).
- **La divergence cachée est sous-enseignée et sans doute plus fiable** — les données historiques suggèrent que les setups de continuation de tendance surperforment les setups de renversement sur des métriques simples comme les rendements forward à 5 et 20 jours.
- **Le tableau de bord divergence de PickSkill [/indicators](/indicators)** scanne chaque ligne pour les quatre types de divergence sur MACD, RSI et KDJ — ne faisant remonter que les cas où les pivots de swing sont bien définis.

## Comment définir précisément une divergence ?

Une divergence requiert deux points de swing dans le cours et deux points de swing correspondants dans l'indicateur. Le « point de swing » doit être un pivot confirmé — pas n'importe quel plus haut ou plus bas local, mais un point avec au moins N barres de chaque côté qui ne le dépassent pas (N vaut typiquement 3–5 sur barres quotidiennes).

Étant donné deux pivots de prix confirmés et deux pivots d'indicateur confirmés sur la même fenêtre, quatre cas existent :

| Type | Cours | Indicateur | Implication |
|---|---|---|---|
| **Haussière classique** | Plus bas plus bas | Plus bas plus haut | Tendance baissière qui perd du momentum — candidate au renversement |
| **Baissière classique** | Plus haut plus haut | Plus haut plus bas | Tendance haussière qui perd du momentum — candidate au renversement |
| **Haussière cachée** | Plus bas plus haut | Plus bas plus bas | Repli dans tendance haussière achevé — candidate à la continuation |
| **Baissière cachée** | Plus haut plus bas | Plus haut plus haut | Rebond dans tendance baissière achevé — candidate à la continuation |

Les variantes « classiques » sont celles que couvre tout manuel d'analyse technique débutant. Les variantes « cachées » sont mathématiquement symétriques mais reçoivent une infime fraction de l'attention.

## Pourquoi la divergence échoue-t-elle si souvent ?

La raison mécanique : les indicateurs sont *dérivés* du cours. Le MACD est la différence de deux EMAs de clôture. Le RSI est une fonction normalisée des clôtures haussières récentes vs les clôtures baissières. Quand le cours fait un nouvel extrême mais que l'indicateur ne le fait pas, l'indicateur vous dit que les changements de cours *récents* étaient plus petits en magnitude que les changements qui ont porté l'extrême précédent. C'est informatif — le momentum s'essouffle. Mais un momentum qui s'essouffle n'est pas un renversement. Les marchés peuvent grappiller pendant des semaines dans un momentum déclinant sans renverser.

La raison empirique : les taux de base de la divergence ne sont pas aussi forts que le prétendent les guides. À travers divers marchés et horizons :

- **Divergence haussière classique**, taux signal-vers-renversement : ~35–45 % sur barres quotidiennes sans filtres.
- **Divergence baissière classique** : fourchette similaire, légèrement plus haute en bear markets où les « faux rallies » produisent des échecs fréquents.
- **Divergence cachée** : 50–60 % sur barres quotidiennes dans des régimes clairement en tendance ; proche du pile ou face dans les marchés erratiques.

Les chiffres s'améliorent sensiblement avec des filtres. Ils se dégradent sensiblement dans la stagnation à faible volatilité. Le fait que la plupart des guides retail citent une « précision de 70 %+ » pour la divergence reflète un biais de survie dans les exemples qu'ils présentent — pas ce que le signal délivre réellement.

## Quels filtres font que la divergence fonctionne réellement ?

Trois filtres, appliqués en combinaison, font passer la divergence du territoire pile ou face à une composante exploitable d'un système multi-signaux :

1. **Filtre de régime de tendance.** Une divergence sur oscillateur de momentum exige un marché en tendance pour que le mécanisme sous-jacent (épuisement du momentum) ait du sens. Quand l'[ADX](/blog/what-is-adx) est en dessous de 20, le marché est en range et la divergence n'est que deux pivots aléatoires — à ignorer. Quand l'ADX dépasse 25, la divergence a un vrai avantage signal/bruit.

2. **Événement de confirmation.** La divergence est une *condition*, pas un *signal*. Attendez un événement confirmateur — un croisement de la ligne MACD, une sortie du RSI hors de la zone extrême, ou une cassure de niveau structurel — avant d'agir sur la divergence. La condition vous dit *de quel côté* vous mettre ; la confirmation vous dit *quand*.

3. **Confirmation par volume / participation.** La divergence est la plus fiable quand le mouvement qui *devrait* faire le plus haut plus haut (dans le cas baissier) le fait sur volume déclinant. Si le nouveau plus haut imprime sur volume élevé, la divergence est plus susceptible d'échouer — un achat lourd n'est pas la signature d'une tendance haussière qui s'essouffle.

Appliqués ensemble, ces filtres réduisent le nombre de setups de divergence de 60–80 % mais relèvent sensiblement le taux de réussite par setup. Le compromis est un nombre de trades plus faible ; l'avantage est beaucoup moins de bruit.

## Qu'est-ce que la divergence cachée — et pourquoi mérite-t-elle plus d'attention ?

La divergence cachée est la cousine continuation-de-tendance de la divergence classique. Les pivots s'inversent :

- **Haussière cachée** : dans une tendance haussière, le cours fait un plus bas plus haut (repli mais maintien du plus bas de swing antérieur) tandis que l'indicateur fait un plus bas plus bas (repli plus profond du momentum que ce que le cours suggère). Interprétation : le repli est terminé, la tendance reprend.
- **Baissière cachée** : dans une tendance baissière, le cours fait un plus haut plus bas (rallie mais échoue à dépasser le plus haut de swing antérieur) tandis que l'indicateur fait un plus haut plus haut (rebond du momentum plus fort que ce que le cours suggère). Interprétation : le rebond est terminé, la tendance baissière reprend.

Pourquoi cela compte : la divergence cachée attrape la *reprise* de tendances établies, ce qui est statistiquement l'opportunité à plus fort edge dans les marchés en tendance. La divergence classique tente d'attraper la *fin* des tendances, ce qui est statistiquement plus difficile. La plupart des recherches en trend-following (Faber, Asness, Moskowitz) trouvent que la persistance des tendances est un phénomène plus fiable que le timing de leur renversement.

Le tableau de bord *top divergence* de PickSkill fait remonter les quatre types sur MACD, RSI et KDJ — en étiquetant explicitement les variantes cachées pour qu'elles reçoivent l'attention qu'elles méritent.

## Quatre pièges dans la lecture de la divergence

1. **Dessiner les pivots a posteriori.** La divergence est facile à repérer rétrospectivement sur un graphique où l'œil sait où seront les swings. La discipline consiste à identifier les pivots en temps réel selon une règle fixe (par exemple, pivot confirmé = pas de point plus haut / plus bas dans les N barres suivantes). Les pivots rétrospectifs ne coïncideront pas avec les pivots en temps réel.
2. **Utiliser la divergence sur des titres erratiques.** Les tickers à faible momentum et fort bruit génèrent des centaines de « divergences » qui ne sont que deux pivots aléatoires dans le bruit. Limitez l'analyse de divergence aux titres dotés d'une persistance de tendance raisonnable — les mêmes titres où le MACD et autres outils de momentum fonctionnent.
3. **Ignorer la magnitude de la divergence.** Un plus haut plus bas de 2 barres dans le cours face à un plus haut plus haut de 5 barres dans le MACD est un type de divergence ; un mouvement MACD profondément négatif sur 50 barres face à un swing de cours marginalement plus bas est une divergence bien plus forte. La taille du désaccord est informative, pas seulement son existence.
4. **Confondre divergence et sur-achat / sur-vente.** RSI > 70 est *suracheté*. RSI qui fait un plus haut plus bas tandis que le cours fait un plus haut plus haut est une *divergence baissière*. Les deux coïncident souvent mais ne sont pas la même chose — la suracheté est une condition statique ; la divergence est un motif de pivots.

## Comportement de la divergence sur les actions A

Les mécanismes sont identiques, mais la microstructure du marché modifie quelles divergences sont réelles :

- **Les limites journalières tronquent les swings.** Les séances limit-up plafonnent l'amplitude au prix limite, ce qui signifie que le pivot de cours est artificiel — ce n'est pas là où le marché aurait clôturé en libre échange. Une divergence construite sur un pivot de jour limite est mécaniquement suspecte ; les tableaux de bord PickSkill excluent les barres limites de la détection de pivots.
- **Les suspensions créent de faux pivots.** Quand un titre est suspendu plusieurs jours puis reprend, le gap de reprise ressemble à un pivot net mais c'est en fait un événement de découverte des prix après un gel. Traitez la divergence post-suspension avec un scepticisme supplémentaire.
- **Régime de volatilité plus élevée.** Les actions A se traitent avec une volatilité quotidienne sensiblement plus élevée que les large caps américaines. Le « bruit de fond » de la détection de pivots est plus haut ; exigez des pivots plus larges (N=5 vs N=3 sur barres quotidiennes) pour filtrer les micro-swings.

Pour la comparaison marché par marché plus large, voir [Meilleurs indicateurs pour les actions A](/blog/best-indicators-for-a-shares).

> **Trouvez les divergences sur votre portefeuille.** Le tableau de bord [/indicators](/indicators) scanne chaque ligne pour les quatre types de divergence sur MACD, RSI et KDJ — ne faisant remonter que les mouvements où les pivots sont bien définis.

## Comment la divergence s'inscrit dans un workflow multi-signaux

La divergence est un *déclencheur de watchlist*, pas un déclencheur d'entrée :

| Étape | Outil | Question à laquelle elle répond |
|---|---|---|
| **1. Filtre** | [ADX](/blog/what-is-adx) > 25, pile MA alignée | Y a-t-il une tendance réelle à contre-tradet ou à suivre ? |
| **2. Setup** | Divergence sur un oscillateur de momentum | La tendance montre-t-elle un essoufflement (classique) ou une reprise (cachée) ? |
| **3. Déclencheur** | Croisement MACD, croisement RSI de 50, cassure de pivot | Quand agir ? |
| **4. Confirmation** | Contexte volume / largeur | Le mouvement est-il soutenu par la participation ? |

Sautez une étape et la divergence est essentiellement du bruit. Superposez les quatre et la divergence devient un motif utile dans un workflow structuré. Voir [Combiner MACD, RSI et ADX en un filtre à 3 indicateurs](/blog/three-indicator-filter) pour une recette d'empilement précise.

## Pour aller plus loin

- [Investopedia sur la divergence haussière](https://www.investopedia.com/terms/d/divergence.asp) — référence pour les quatre types standard.
- [Constance Brown, *Technical Analysis for the Trading Professional*](https://www.amazon.com/dp/0071596666) — traitement par une praticienne de la divergence de momentum avec un accent sur les variantes cachées.

## FAQ

**La divergence haussière est-elle un signal d'achat fiable ?**
Seule, non — les taux de réussite historiques sont dans la fourchette 35–45 % pour une divergence haussière classique brute sur barres quotidiennes. Le signal devient utile filtré : régime de tendance (ADX > 25), événement de confirmation (croisement MACD ou sortie du RSI hors de la zone survendue) et alignement volume / largeur. Appliquez les trois et le taux de réussite monte à une fourchette exploitable. Sautez-les et vous tradez du bruit.

**Quel indicateur donne les meilleurs signaux de divergence ?**
Il n'y a pas d'indicateur unique meilleur. La divergence MACD a plus de structure (l'histogramme amplifie le désaccord) ; la divergence RSI est plus propre aux extrêmes (>70 / <30) ; la divergence KDJ est la plus populaire dans la communauté retail des actions A. Le tableau de bord divergence de PickSkill scanne les trois pour permettre la comparaison. En pratique, une divergence qui apparaît dans *deux des trois* oscillateurs simultanément est sensiblement plus fiable qu'une divergence dans un seul.

**Pourquoi la divergence cachée est-elle peu couverte dans la plupart des livres de trading ?**
Deux raisons : (1) c'est mathématiquement le motif le plus dur à repérer (les pivots s'inversent), et (2) les motifs de continuation de tendance sont narrativement moins satisfaisants que les motifs de renversement (« attraper le creux » vend plus de livres qu'« acheter le repli »). Les données suggèrent le contraire de la narration : la divergence cachée dans des tendances confirmées est le setup à plus fort edge. Le tableau de bord *top divergence* de PickSkill étiquette explicitement les variantes cachées pour qu'elles reçoivent l'attention qu'elles méritent.

**Puis-je trader des options sur un signal de divergence ?**
C'est possible, mais le timing compte. La divergence est une *condition* ; il faut un *déclencheur* (croisement, cassure, confirmation). Acheter des calls long-dated sur la divergence sans déclencheur revient à payer du theta en attendant. La structure plus propre consiste à attendre l'événement déclencheur, puis se positionner sur le mouvement avec un dimensionnement adapté. Pour une discussion sur la combinaison de la divergence avec d'autres signaux avant de dimensionner un trade d'options, voir [Filtre à 3 indicateurs](/blog/three-indicator-filter).

**Quelle est la différence entre divergence et convergence ?**
La convergence est l'absence de divergence — cours et indicateur se déplaçant ensemble. Dans certaine littérature, « convergence » désigne le moment où une divergence se résout (le cours rattrape l'indicateur, ou inversement) ; dans d'autres, elle signifie simplement l'alignement. L'ambiguïté terminologique n'aide pas — l'usage moderne emploie « divergence » comme un motif et « convergence » comme sa résolution.
