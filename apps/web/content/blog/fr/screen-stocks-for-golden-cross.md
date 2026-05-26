---
title: Comment screener les actions à croisement doré en 60 secondes
description: >-
  Trouvez chaque action de votre watchlist avec un croisement MA 50/200 frais —
  et la variante underwater à plus fort edge. Workflow en 4 étapes avec
  PickSkill.
publishedAt: 2026-05-25T00:00:00.000Z
updatedAt: 2026-05-25T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    L'équipe de recherche PickSkill — un analyste IA pour les investisseurs
    particuliers.
pillar: how-to
tags:
  - Tutoriel
  - Croisement doré
  - Moyenne mobile
  - Screening
  - Workflow
heroImage: /blog/screen-stocks-for-golden-cross/hero.png
heroAlt: >-
  Infographie éditoriale — tableau de screening listant les tickers avec leur
  statut de croisement frais (UNDERWATER / standard / DEATH) et la confirmation
  par le volume.
---

**Un croisement doré, c'est la moyenne mobile 50 jours qui passe au-dessus de la moyenne mobile 200 jours — l'un des événements techniques les plus scrutés sur les actions.** Scanner un portefeuille ou une watchlist à la main pour des croisements frais signifie vérifier le graphique de chaque titre, ce qui scale mal. Le tableau de bord MA de PickSkill fait tourner le scan automatiquement et fait remonter à la fois le croisement doré standard et la variante *underwater* à plus fort edge, où la MA 200 jours est encore inclinée à la baisse au moment du croisement. Ce tutoriel parcourt l'usage du screener dans un vrai workflow — pas juste repérer les croisements, mais agir dessus avec les bons filtres.

### Points clés

- **4 étapes, ~60 secondes.** Ouvrir le tableau de bord MA, identifier les croisements frais, filtrer par l'état underwater, superposer la confirmation avant d'agir.
- **La variante underwater a historiquement produit de meilleurs rendements forward** que le croisement standard — elle attrape un changement de régime plutôt qu'une continuation.
- **Le screening multi-filtres réduit le bruit** : croisement frais + pente + confirmation par volume + contexte [support / résistance](/blog/what-is-support-resistance).
- **Marche sur les valeurs US, HK et actions A** avec un traitement de croisement adapté au marché (exclusion des jours limites pour les actions A).
- **S'apparie naturellement au workflow [/portfolios](/portfolios)** — scannez votre watchlist existante ou construisez-en une à partir de la sortie du screener.

## Pourquoi ce workflow compte

Le croisement 50/200 brut a un edge autonome mince — les taux de réussite historiques sont proches du rendement inconditionnel du marché. La raison pour laquelle les traders continuent à le surveiller, c'est que la variante *underwater* — croisement frais avec la 200 jours encore inclinée à la baisse — a des rendements forward sensiblement meilleurs. Sans outil qui sépare les deux variantes, les investisseurs retail traitent chaque croisement à l'identique et manquent le sous-ensemble à plus fort edge.

L'autre raison pour laquelle le screening manuel échoue : le croisement est un événement instantané. Quand vous le remarquez via un titre médiatique (« le S&P 500 confirme un croisement doré »), il est intégré depuis deux semaines. Attraper le croisement dans les 1–3 barres de l'événement compte ; faire cela sur une watchlist de 20 noms requiert de l'automatisation.

Pour le concept sous-jacent, voir [Qu'est-ce qu'un croisement doré (et un croisement de la mort) ?](/blog/what-is-golden-cross-death-cross).

## Le workflow en 4 étapes

### Étape 1 — Ouvrir le tableau de bord MA

Allez sur [/indicators](/indicators) et sélectionnez la dimension moyenne mobile. Le tableau de bord fait remonter le statut actuel du croisement 50/200 de chaque position, plus la pente de la MA longue, et marque les croisements frais (dans les 5 dernières barres).

La vue est triable par :

| Tri | Usage |
|---|---|
| **Fraîcheur du croisement** | Les croisements les plus récents en haut — les plus actionnables |
| **Flag underwater** | Croisements underwater priorisés — variante à plus fort edge |
| **Force de tendance** | S'apparie à la lecture [ADX](/blog/what-is-adx) |
| **Confirmation par volume** | Croisements avec volume au-dessus de 1,5× la moyenne 20 jours — meilleure confirmation |

Le tri par défaut priorise les croisements underwater frais avec confirmation par volume — soit la variante à plus fort edge.

### Étape 2 — Identifier les croisements frais

Trois états que le tableau de bord peut montrer pour chaque position :

| État | Ce qu'il signifie |
|---|---|
| **Croisement doré standard (tendance haussière déjà en place)** | 50 au-dessus de 200 ; 200 inclinée à la hausse. Continuation de tendance. |
| **Croisement doré underwater** | 50 au-dessus de 200 ; 200 toujours inclinée à la baisse. Candidat à changement de régime — la variante plus rare et à plus fort edge. |
| **Croisement de la mort (baissier) ou pré-croisement** | 50 sous 200, ou 50 et 200 proches d'un croisement baissier. Signal de risk-off. |

Concentrez-vous sur l'état underwater. Sur les principaux indices, les croisements dorés underwater se produisent 2–4 fois par décennie et tendent à marquer la fin de drawdowns significatifs. Sur les titres individuels, ils apparaissent plus fréquemment mais représentent toujours le setup structurellement à plus fort edge.

Pour les besoins du tableau de bord, « frais » signifie que le croisement s'est produit dans les 5 dernières barres de trading. Les croisements plus anciens ont été intégrés.

### Étape 3 — Superposer des filtres supplémentaires

Un croisement frais à lui seul est un point de départ, pas un déclencheur d'entrée. Appliquez ces filtres dans l'ordre :

1. **Confirmation par volume.** Le volume du jour de croisement devrait être au moins 1,5× la moyenne 20 jours. Les croisements à volume léger échouent à des taux sensiblement plus élevés que les croisements à volume lourd. Voir [Analyse du volume](/blog/what-is-volume-analysis) pour le contexte plus large.
2. **Alignement du flux de capitaux.** Le [flux de capitaux](/blog/what-is-capital-flow) (MFI, CMF, OBV) devrait être en tendance haussière en parallèle du croisement. Les croisements sur flux déclinant sont plus susceptibles d'être de faux signaux.
3. **Proximité d'un niveau de support.** Un croisement survenant près d'un [niveau de support](/blog/what-is-support-resistance) significatif est structurellement plus fort qu'un croisement dans le vide — le niveau fournit un ancrage naturel pour la gestion du risque.
4. **Pas de signal de momentum contradictoire.** Le [RSI](/blog/what-is-rsi) ne devrait pas être profondément en territoire suracheté (>75) au moment du croisement — un croisement directement en suracheté est souvent un sommet de continuation, pas une fraîche opportunité d'entrée.

Appliquez les quatre filtres et le nombre de croisements actionnables chute de 70–80 %. Les candidats restants ont des profils de rendement forward sensiblement meilleurs.

### Étape 4 — Générer un plan d'entrée

Une fois qu'un candidat passe les filtres, utilisez le chat PickSkill pour générer un plan d'entrée structuré :

```text
Pour [ticker], génère un plan d'entrée autour du croisement doré frais :
- Prix d'entrée suggéré (actuel vs repli vers la MA 50 jours)
- Niveau de stop (sous le plus bas de swing récent ou la MA 200 jours, le plus bas des deux)
- Cible initiale (le prochain niveau de résistance)
- Dimensionnement de position basé sur un risque de 1 % du portefeuille par trade
```

PickSkill renvoie un plan structuré avec niveaux sourcés, rationnel de cible et formule de dimensionnement. Vous pouvez ajuster les hypothèses dans le chat et relancer.

> **Essayez maintenant.** [Ouvrez /indicators](/indicators), sélectionnez la vue MA, et triez par underwater + fraîcheur. Même sur un petit portefeuille, vous verrez probablement 1–2 candidats underwater frais par trimestre — le volume d'opportunités de qualité est plus élevé que la plupart des investisseurs retail ne le pensent une fois le screening automatisé.

## Ce que le tableau de bord attrape et que le screening manuel rate

### 1. La distinction underwater

L'inspection de graphique à la main traite chaque croisement doré à l'identique. Le tableau de bord distingue le croisement standard (continuation de tendance) du croisement underwater (changement de régime). Le second est rare et structurellement à plus fort edge — l'automatisation le fait remonter explicitement.

### 2. Scan simultané multi-titres

Le screening manuel marche pour quelques titres ; le tableau de bord scanne un portefeuille de 20+ noms en secondes. La largeur attrape des setups que vous n'auriez pas pensé à vérifier — en particulier sur des titres que vous aviez déjà abandonnés ou que vous n'aviez pas visités depuis des semaines.

### 3. Fraîcheur sous 5 barres

Le croisement 50/200 est le plus actionnable dans les 1–3 barres de l'événement. L'inspection manuelle attrape souvent le croisement 1–2 semaines en retard, moment où la partie facile du mouvement s'est déjà produite. Le tableau de bord fait remonter les croisements frais dès qu'ils s'impriment.

## Quatre pièges dans l'usage du screener

1. **Agir sur le croisement seul, sans filtres.** Le croisement brut est proche d'un pile ou face. Sans confirmation par volume, contrôle du régime de tendance et proximité de niveau, vous tradez du bruit.
2. **Ignorer la distinction underwater.** Un croisement doré standard dans une tendance haussière existante est la variante à fort volume et faible edge. Le croisement underwater est la variante rare et à plus fort edge. Ne les confondez pas.
3. **Chasser le jour du croisement.** L'entrée la plus propre est souvent un *repli* vers la MA 50 jours après la confirmation du croisement, pas l'achat au moment où le croisement s'imprime. Le premier repli vers le niveau de croisement est le point d'entrée à plus fort edge sur un croisement typique réussi.
4. **Pas de discipline d'invalidation.** Définissez le niveau de stop *avant* d'entrer — le plus bas de swing récent ou la MA 200 jours, le plus bas des deux. Si le cours atteint le stop, le trade est faux ; fermez-le. Le croisement est un signal probabiliste, pas une certitude.

## Comportement différent des croisements sur les actions A

La microstructure des actions A modifie les critères de screening :

- **Accent culturel sur 20/60.** La communauté retail des actions A surveille le croisement 20/60 plus attentivement que le 50/200. Le tableau de bord remonte les deux ; sur les valeurs A, pondérez davantage le croisement 20/60 comme signal de coordination.
- **Exclusion des jours limites.** Les barres limit-up et limit-down créent des effets escalier dans les deux MA. PickSkill marque ces barres comme outliers dans la détection de croisement — sans ce filtre, des journées limites consécutives produiraient de faux signaux de croisement frais.
- **Gestion des suspensions.** Quand un titre est suspendu plusieurs jours puis reprend, la pile MA redémarre de fait. Les croisements qui surviennent dans les 10 barres après une reprise de suspension doivent être traités avec prudence.

Voir [Meilleurs indicateurs pour les actions A](/blog/best-indicators-for-a-shares) pour le playbook plus large et [MACD sur actions A vs actions américaines](/blog/macd-on-a-shares-vs-us) pour la comparaison transverse.

## Workflows de suivi fréquents

Une fois que vous avez un candidat depuis le screener de croisement, voici les prochains mouvements naturels :

- *« Pour chaque titre avec un croisement doré underwater frais, vérifie si le MACD est aussi dans un état haussier et ne fais remonter que les noms avec les deux signaux alignés. »*
- *« Génère une watchlist de chaque action du S&P 500 actuellement à moins de 2 barres d'un croisement doré underwater. »*
- *« Backtest le croisement underwater 50/200 sur ce ticker précis sur les 10 dernières années — taux de réussite, rendement moyen, temps jusqu'à la cible. »*
- *« Construis un portefeuille des 10 meilleurs candidats croisement underwater équipondérés, avec un stop automatique à la MA 200 jours. »*
- *« Compare le croisement actuel de ce ticker à son croisement doré précédent il y a 2 ans — celui-ci était-il underwater, et qu'est-il arrivé ensuite ? »*

## Pour aller plus loin

- [Qu'est-ce qu'un croisement doré (et un croisement de la mort) ?](/blog/what-is-golden-cross-death-cross) — le concept sous-jacent et la variante underwater.
- [Qu'est-ce qu'une moyenne mobile ?](/blog/what-is-ma) — la fondation du signal de croisement.
- [Meb Faber, *A Quantitative Approach to Tactical Asset Allocation*](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=962461) — soutien académique pour des règles simples de croisement de MA.

## FAQ

**À quelle fréquence les croisements dorés underwater se produisent-ils ?**
Sur les principaux indices, 2–4 fois par décennie — généralement à la fin de drawdowns significatifs. Sur les titres individuels, plus fréquemment (quelques-uns par an sur une watchlist de 20 noms). La rareté du signal au niveau indice est une partie de ce qui rend précieux le signal au niveau titre individuel : quand une action individuelle imprime un signal en l'absence de signal d'indice, le mouvement est spécifique au titre plutôt que global au marché.

**Le croisement doré standard est-il sans valeur ?**
Pas sans valeur, mais à plus faible edge. Le croisement standard (dans une tendance haussière existante) fonctionne plus comme un filtre « la tendance est intacte » que comme un signal d'entrée. Utilisez-le comme contrôle de régime au niveau portefeuille (« plus de mes positions sont au-dessus de la SMA 200 jours qu'en dessous ») plutôt que comme déclencheur sur titre individuel.

**Pourquoi la variante underwater est-elle meilleure ?**
Deux raisons. (1) Elle attrape un *changement de régime* plutôt qu'une continuation — historiquement le setup à plus fort edge. (2) Elle est plus rare, ce qui signifie qu'elle souffre moins du sur-trading. Les investisseurs discrétionnaires qui tradent chaque croisement standard font tourner une stratégie à forte rotation et faible edge ; les investisseurs qui attendent les croisements underwater font tourner une stratégie à plus faible rotation et plus fort edge.

**Puis-je trader des options sur un croisement doré ?**
C'est possible, mais le timing compte. La volatilité implicite autour du croisement intègre souvent un certain niveau de reconnaissance de tendance. La structure plus propre consiste à se positionner *avant* le croisement en utilisant le setup underwater comme déclencheur de watchlist, plus une lecture RSI survendue et une cassure de niveau de prix comme déclencheur d'entrée. Acheter des calls *au* croisement paie souvent une prime pour le titre médiatique.

**Quel horizon temporel le screener utilise-t-il ?**
Barres quotidiennes par défaut — conformément à la convention standard pour le croisement 50/200. Le screening de croisement hebdomadaire (MA 50 semaines vs MA 200 semaines) est disponible via prompt chat — utile pour un positionnement de très long terme mais moins actionnable. Le screening de croisement intraday n'est pas affiché parce que le signal se dégrade fortement sur les horizons courts.
