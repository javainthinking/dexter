---
title: Comment construire une watchlist qui fonctionne vraiment (pas un dépotoir)
description: >-
  Une watchlist focalisée de 8 à 15 noms avec thèse, niveaux et cadence de revue
  bat un dépotoir de 50 noms à chaque fois. Configuration pas à pas dans
  PickSkill.
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
  - Watchlist
  - Portefeuille
  - Workflow
  - Onboarding
heroImage: /blog/how-to-build-a-watchlist-that-actually-works/hero.png
heroAlt: >-
  Infographie éditoriale — exemple de watchlist avec 6 tickers organisés en
  Positions actives / Buy-the-Dip / Suivi-de-thèse, chacune avec une thèse en
  une phrase et un niveau d entrée.
---

**La plupart des watchlists d'investisseurs sont des dépotoirs — 40+ tickers sans structure, sans thèse sur la raison de la présence de chacun, et sans cadence pour les revoir.** Une watchlist focalisée de 8 à 15 noms avec une thèse d'une phrase par nom, des niveaux d'entrée définis et une cadence de revue hebdomadaire bat un dépotoir de 50 noms à chaque fois. Ce tutoriel guide à travers la configuration de watchlist qui compose réellement — la même configuration que la plateforme PickSkill est conçue pour supporter — et la discipline pour la garder utile dans trois mois.

### Points clés

- **8 à 15 noms est la bonne taille.** Moins de 8 = ensemble d'opportunités trop fin ; plus de 15 = rien ne reçoit d'attention. La limite cognitive de noms que vous pouvez réellement suivre est à un chiffre, pas à deux.
- **Chaque nom a besoin d'une thèse d'une phrase**. « Pourquoi est-ce sur ma watchlist ? » Trois catégories : own-it-watch (position active), buy-the-dip (en attente d'entrée), follow-the-thesis (suivre mais sans trader bientôt).
- **Chaque nom a besoin d'un niveau d'entrée**. Sans un « prix d'action » défini, vous chasserez soit la force, soit n'agirez jamais.
- **Cadence de revue hebdomadaire** — 30 minutes une fois par semaine — suffit pour garder la liste pertinente. La revue quotidienne est excessive ; mensuelle est trop lente.
- **Cullez agressivement**. Les noms qui ne correspondent pas à la thèse 90 jours plus tard devraient être retirés, pas « gardés au cas où ».

## Pourquoi la plupart des watchlists échouent

Trois modes de défaillance courants :

1. **Le dépotoir** : Tout ce qui est intéressant va sur la liste. Six mois plus tard, c'est 40+ noms et la watchlist est un générateur de bruit, pas un outil de focalisation.
2. **La liste oubliée** : Créée lors de phases de recherche enthousiastes, puis jamais revue. Les noms restent sur la liste avec une thèse périmée, des catalyseurs manqués et des niveaux d'entrée obsolètes.
3. **La liste trop revue** : Vérifiée quotidiennement, tradée de manière réactive, sans temps pour que la thèse sous-jacente joue. La watchlist devient une liste de paris à fort turnover.

La solution est structurelle : une liste de taille fixe, une discipline de thèse, une cadence de revue claire et un culling agressif.

## La configuration en 4 étapes

### Étape 1 — Définir vos catégories de thèse

Trois buckets couvrent presque tous les usages de watchlist :

| Catégorie | Description | Taille typique |
|---|---|---|
| **Positions actives** | Noms que vous détenez actuellement | 5–10 (correspond au portefeuille typique) |
| **Buy-the-dip** | Noms que vous voulez détenir à un niveau d'entrée spécifique | 3–5 |
| **Follow-the-thesis** | Noms suivant une thèse d'investissement (suivi long terme, pas d'action à court terme) | 2–5 |

Total : 10–20 noms selon votre niveau d'activité. Si votre nombre dépasse 20, la discipline est de culler — pas d'élargir.

### Étape 2 — Ajouter chaque nom avec une thèse d'une phrase

Allez sur [/portfolios](/portfolios) et créez un portefeuille watchlist pour chaque catégorie (ou un portefeuille avec des notes par ligne). Pour chaque nom, écrivez une thèse d'une phrase :

```text
NVDA — Position active. Cycle de dépenses d'entraînement IA 2026-2027 ; alléger 
       si la marge forward se comprime sous 70 %.

TSM — Buy-the-dip. Capacité 3nm sold-out jusqu'en 2027 ; entrée à 185 $ 
      (pullback vers la MA 50 jours).

PLTR — Follow-the-thesis. Pipeline de contrats gouvernementaux qui mûrit ; pas 
       encore en trading, j'attends de la clarté sur le CA commercial 2027.
```

Si vous ne pouvez pas écrire une thèse d'une phrase, le nom n'a pas sa place sur la watchlist. Faites la recherche pour en formuler une, ou passez.

### Étape 3 — Définir les niveaux d'entrée / sortie par nom

Pour chaque nom buy-the-dip, définissez le niveau d'entrée :

```text
TSM — Entrée 185 $ (pullback vers MA 50 jours + niveau de support le plus proche)
```

Pour chaque position active, définissez les conditions de sortie :

```text
NVDA — Alléger de 25 % si la marge brute forward se comprime sous 70 % pendant 2 trimestres
      Alléger de 50 % si un client majeur signale une coupe de capex
      Sortir si la thèse IA se casse (preuves larges de surcapacité de calcul)
```

Les tableaux de bord PickSkill font remonter le cours actuel et les niveaux de support/résistance les plus proches par ligne — associez-les à vos seuils d'entrée / sortie définis pour voir quels noms sont proches d'être actionnables.

### Étape 4 — Mettre en place la revue hebdomadaire

Choisissez un jour par semaine (le dimanche soir fonctionne pour la plupart du retail). Passez 30 minutes :

1. **Scanner le tableau de bord [/indicators](/indicators)** pour toute ligne montrant des changements de signal frais (nouvelles lectures survendues, drapeaux de divergence, croisements dorés).
2. **Revoir les noms buy-the-dip** par rapport au cours actuel. Y en a-t-il près des niveaux d'entrée ?
3. **Relire chaque thèse** — tient-elle toujours ? Si une thèse s'est cassée matériellement, cullez le nom.
4. **Noter tout nouveau candidat** à ajouter. Soyez sélectif — chaque ajout force un cull ailleurs.

La cadence hebdomadaire de 30 minutes est la discipline que la plupart des investisseurs retail sautent. C'est la différence entre une watchlist qui compose de l'insight et une qui se fossilise.

> **Essayez maintenant.** Ouvrez [/portfolios](/portfolios) et créez un portefeuille « Watchlist ». Ajoutez 8 à 10 noms avec des thèses d'une phrase dans le champ description. Lancez le tableau de bord [/indicators](/indicators) dessus. La revue hebdomadaire prend 30 minutes une fois que vous avez la structure.

## Comment utiliser les fonctionnalités PickSkill pour soutenir le workflow

| Discipline | Fonctionnalité PickSkill |
|---|---|
| **Niveaux d'entrée définis** | [Tableau de bord support/résistance](/blog/what-is-support-resistance) — voir à quelle distance chaque nom est de son niveau d'entrée |
| **Suivi de thèse** | Notes par ligne ; sessions [/chat](/chat) par nom pour recherche plus profonde |
| **Alertes de signal** | Tableau de bord [/indicators](/indicators) avec trace de bucket sur 5 jours sur MACD, RSI, KDJ, divergence |
| **Déclencheurs de cull** | Revue des résultats trimestriels via [chat-to-deck](/blog/generate-investor-deck-from-chat) |
| **Partage pour second avis** | [Partage de portefeuille via lien](/blog/share-a-portfolio-via-link) pour qu'un ami le revoie |

Le but d'une watchlist est de *focaliser* votre attention. Les fonctionnalités produit ci-dessus sont conçues pour cette focalisation, pas pour la surface.

## Quatre pièges classiques du retail

1. **Laisser la liste s'étendre indéfiniment.** Chaque nouveau nom dilue l'attention sur les noms existants. Plafonnez dur à 15 noms actifs sur la watchlist ; forcez un cull pour chaque ajout.
2. **Sauter la phrase de thèse.** Les noms sans thèse sont du bruit non structuré. Forcez chaque ajout à en avoir une.
3. **Pas de cadence de revue.** Les watchlists deviennent obsolètes dans les 60 jours suivant le dernier contact. Une revue hebdomadaire de 30 minutes est la discipline de maintenance minimale.
4. **Refuser de culler.** Les noms qui n'ont pas gagné leur place après 90 jours devraient être retirés. « Peut-être plus tard » n'est pas une thèse.

## Comment cela s'intègre dans un workflow d'investissement plus large

La watchlist se situe entre recherche et action :

| Étape | Surface | Question à laquelle elle répond |
|---|---|---|
| **Découverte** | Actualités, X / Reddit, screens | Qu'est-ce qui est intéressant ? |
| **Recherche initiale** | [/chat](/chat) — DCF, 10-K, comparables | Cela mérite-t-il un travail plus profond ? |
| **Watchlist** | [/portfolios](/portfolios) + thèse + niveaux | Suivre jusqu'à actionnable |
| **Action** | Décisions d'entrée / sortie, dimensionnement via [ATR](/blog/what-is-atr) | Quand et combien ? |
| **Revue** | Vérification d'indicateur hebdomadaire + revisite mensuelle de thèse | La thèse est-elle intacte ? |

Les noms devraient circuler à travers ce pipeline, pas s'empiler à l'étape watchlist. La discipline est de bouger les noms *hors* de la watchlist — vers des positions actives, ou hors de la liste entièrement — pas seulement d'en ajouter de nouveaux.

## Prompts de suivi courants

- *« Pour ma watchlist, montre-moi quels noms sont à moins de 5 % de leurs niveaux d'entrée définis. Trie par proximité. »*
- *« Lance le scan de divergence sur ma watchlist. Y a-t-il des noms montrant une divergence haussière multi-oscillateurs dans les 5 dernières barres ? »*
- *« Génère une revue hebdomadaire d'une page pour ma watchlist — cours actuel vs niveau d'entrée, état des indicateurs, thèse intacte oui/non. »*
- *« Backteste une règle qui achète les noms de watchlist quand ils atteignent le niveau d'entrée ET que le RSI croise au-dessus de 30 depuis le bas. Quel est le taux de réussite ? »*

## Pour aller plus loin

- [Suivre un portefeuille avec les indicateurs](/blog/track-a-portfolio-with-indicators) — le tutoriel amont sur l'ajout de lignes à PickSkill.
- [Comment rechercher une nouvelle action en 15 minutes](/blog/how-to-research-a-new-stock-in-15-minutes) — le workflow de recherche qui produit des candidats pour la watchlist.

## FAQ

**Combien de noms devrais-je avoir sur ma watchlist ?**
8 à 15 est le sweet spot. Moins (3–7) signifie trop peu d'opportunités pour le travail que vous investissez ; plus (20+) signifie que rien ne reçoit de vraie attention. La limite cognitive sur combien de thèses distinctes vous pouvez tenir et mettre à jour est à un chiffre — c'est ce qui pilote la borne supérieure.

**Ma watchlist devrait-elle chevaucher mon portefeuille ?**
Oui — vos lignes actives devraient être sur la watchlist pour le suivi d'indicateurs et la revue de thèse. La watchlist est plus grande que le portefeuille par définition (elle inclut des noms que vous ne possédez pas encore), mais chaque nom détenu devrait y figurer.

**À quelle fréquence revoir la watchlist ?**
Hebdomadaire est la cadence standard. Quotidien est excessif et engendre du trading réactif. Mensuel est trop lent — au moment où un signal arrive, vous pouvez avoir manqué l'entrée. Choisissez un jour fixe par semaine (dimanche soir ou samedi matin est courant) et traitez-le comme non négociable.

**Quelle est la différence entre une watchlist et un portefeuille ?**
Un portefeuille est ce que vous détenez. Une watchlist est ce que vous suivez. Dans PickSkill, les deux surfaces existent sous [/portfolios](/portfolios) — vous pouvez avoir plusieurs portefeuilles libellés différemment. De nombreux utilisateurs ont un portefeuille « Actif » (positions actuelles), un portefeuille « Watchlist » (suivis mais pas détenus) et un portefeuille « Recherche » (recherche approfondie en cours, pas encore engagée).

**Quand devrais-je culler un nom de la watchlist ?**
Trois déclencheurs : (1) la thèse s'est cassée (le bull case ne s'applique plus), (2) le nom est sur la liste depuis 90+ jours sans chemin court terme vers l'action, (3) vous ne pouvez pas articuler la thèse en une phrase après une vérification trimestrielle. Un culling agressif est ce qui garde la liste utile.
