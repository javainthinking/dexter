---
title: Comment suivre un portefeuille multi-actions avec des indicateurs techniques dans PickSkill
description: Tutoriel en 5 étapes pour configurer un portefeuille, superposer huit dimensions d'indicateurs techniques, et utiliser des dashboards générés par IA (MACD, KDJ, divergence, flux de capitaux) pour repérer des signaux en secondes.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: L'équipe de recherche PickSkill — un analyste IA pour les investisseurs particuliers.
pillar: how-to
tags:
  - tutorial
  - portfolio
  - indicators
  - macd
  - kdj
heroImage: /blog/track-a-portfolio-with-indicators/hero.png
heroAlt: Infographie éditoriale d'un portefeuille multi-actions avec huit dimensions d'indicateurs techniques
---

Les investisseurs particuliers tombent sur le même mur : ils détiennent 8 à 15 positions, veulent savoir lesquelles sont à un point d'inflexion technique (croisement MACD, KDJ survendu, divergence RSI, flux anormal), mais lire le graphe de chaque position chaque jour n'est pas tenable. Ce tutoriel montre comment configurer un portefeuille dans PickSkill, superposer huit dimensions d'indicateurs, et obtenir un dashboard d'un coup d'œil qui ne vous fait zoomer que sur les noms qui le méritent.

### Points clés

- **Huit dimensions d'indicateurs** disponibles : prix, fondamentaux, sentiment, flux de capitaux, divergence, KDJ, MACD, support/résistance.
- **Un dashboard, toutes les positions.** Chaque dimension est rendue comme un rapport HTML triable.
- **Rafraîchissement à la demande** ou planification récurrente.
- **Fonctionne sur US, HK et A-shares.**
- **Utilise [/portfolios](/portfolios)** pour le stockage des positions et [/indicators](/indicators) pour les dashboards — le chat est la voie pour demander de nouvelles vues.

## Pourquoi c'est important

Suivre 12 noms × 8 dimensions à la main = 96 consultations par jour. La plupart compriment ça en « je regarde les positions qui m'inquiètent », ce qui veut dire que les signaux des positions qui ne vous inquiètent PAS passent silencieusement. Les dashboards transforment 96 consultations en un scan : vous voyez les 12 × 8 sur une page, triable, avec les moments d'inflexion en évidence.

## Le flux en 5 étapes

### Étape 1 — Créer ou choisir un portefeuille

Allez sur [/portfolios](/portfolios) et créez-en un nouveau ou utilisez un existant. Un portefeuille est juste un bucket nommé de positions (ticker + parts + base de coût optionnelle).

Si vous avez déjà ajouté des positions en langage naturel (« ajoute 100 NVDA à 135 à mon portefeuille principal »), elles y sont déjà.

### Étape 2 — Choisir les dimensions qui vous intéressent

| Dimension | Question répondue |
|---|---|
| **Prix** | Où est chaque nom vs. MM 5/20/60 jours ? |
| **Fondamentaux** | PER / PBR / Yield / Yield FCF par position |
| **Sentiment** | Sentiment news + actions analystes |
| **Flux de capitaux** | Flux institutionnel net 5–20 jours |
| **Divergence** | Divergence prix vs. volume ou prix vs. RSI |
| **KDJ** | Stochastic survendu (J<0) / surachat (J>100) |
| **MACD** | Golden/death cross + momentum histogramme |
| **Support/Résistance** | Positions sous coût, tests de résistance |

Les quatre à plus fort levier en pratique retail : Prix, MACD, Flux de capitaux, Divergence.

### Étape 3 — Ouvrir un chat et demander un dashboard

```text
Pour mon portefeuille « Tech Largecaps » :
- Lance le dashboard MACD
- Surligne les positions en golden cross ou death cross aujourd'hui
- Trie par force d'histogramme
```

PickSkill récupère la liste des positions, calcule le MACD sur les bars quotidiens récents de chaque nom, génère le dashboard en HTML téléchargeable, et affiche les noms en inflexion inline.

### Étape 4 — Croiser avec les autres dimensions

```text
Parmi les noms que tu as marqués golden cross MACD, lesquels ont aussi :
- Flux de capitaux positif sur 5 jours ?
- Divergence haussière (prix baisse, RSI monte) ?
- Au-dessus de leur MM 60 jours ?
```

C'est le vrai workflow — empiler les signaux pour réduire 12 candidats à 2–3.

### Étape 5 — Planifier le dashboard s'il est utile

```text
Lance ce dashboard MACD pour « Tech Largecaps » chaque jour ouvré après la clôture US.
Email-moi uniquement quand ≥1 position croise.
```

> **Essayez maintenant.** [Créez un portefeuille](/portfolios), puis [ouvrez un chat](/chat) et collez le prompt de l'Étape 3.

## Dimensions d'indicateurs qui méritent d'être connues

- **MACD** — croisement EMA 12 sur EMA 26 avec ligne signal 9. Golden cross = momentum haussier ; death cross = baissier.
- **KDJ** — variante de Stochastic avec la J-line amplifiant les extrêmes. J<0 survendu, J>100 surachat.
- **Divergence** — le prix fait un nouveau plus haut mais le RSI non (baissière), ou un nouveau plus bas mais le RSI non (haussière).
- **Flux de capitaux** — flux institutionnel/gros ordres. Pour HK et A-shares via données d'exchange, pour US approximé via block-trades.

## Ce qu'on ne peut pas faire ainsi

- **Signaux intraday.**
- **Stratégies sur options.**
- **Exécution automatique.**

## Comment cela complète le foundation cluster

Le foundation cluster ([DCF](/blog/what-is-dcf), [WACC](/blog/what-is-wacc), [FCF](/blog/what-is-fcf), [10-K](/blog/how-to-read-10k)) est de la **recherche fondamentale**. Ce tutoriel est du **monitoring technique**. La plupart des workflows retail bénéficient des deux couches.

## FAQ

**Dois-je configurer les portefeuilles manuellement ?**
Non — ajoutez des positions en langage naturel dans `/chat` et PickSkill les synchronise vers [/portfolios](/portfolios). Ou uploadez un CSV.

**Quelle fraîcheur des données ?**
US : clôture. A-shares et HK : intraday. Flux de capitaux : EOD partout.

**Puis-je faire tourner plusieurs portefeuilles en même temps ?**
Oui — « lance le dashboard MACD sur tous mes portefeuilles, groupé par portefeuille ».

**Ça marche sur A-shares ?**
Oui — KDJ et MACD sont particulièrement populaires en retail A-shares, et le moteur gère correctement les tickers `600519.SS`, `000333.SZ` et le calendrier de trading.

**Configurer l'email planifié ?**
Depuis le chat : « lance ce dashboard MACD chaque jour ouvré après clôture US, email si ≥1 cross ».
