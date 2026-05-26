---
title: >-
  Qu'est-ce que l'oscillateur stochastique ? %K, %D et pourquoi KDJ est son
  cousin
description: >-
  Le stochastique mesure où se situe la clôture dans la fourchette récente.
  Formule, fast vs slow, relation avec le KDJ, et quatre pièges classiques du
  retail.
publishedAt: 2026-05-26T00:00:00.000Z
updatedAt: 2026-05-26T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    L'équipe de recherche PickSkill — un analyste IA pour les investisseurs
    particuliers.
pillar: explainer
tags:
  - Stochastique
  - KDJ
  - Momentum
  - Analyse technique
  - Indicateurs
heroImage: /blog/what-is-stochastic-oscillator/hero.png
heroAlt: >-
  Infographie éditoriale — Stochastique %K et %D oscillant entre 0 et 100,
  seuils 80/20 marqués, croisement de survente mis en évidence.
---

**L'oscillateur stochastique mesure où se situe la clôture actuelle dans la fourchette plus haut–plus bas récente des cours, sur une échelle 0–100.** Il a été développé par George Lane dans les années 1950 pour répondre à une question faussement simple : dans une fenêtre définie, à quelle distance du plus haut (ou du plus bas) se trouve le cours actuel ? Le stochastique est le parent de toute une famille d'outils de momentum — dont le [KDJ](/blog/what-is-kdj), qui est essentiellement un stochastique avec une ligne J ajoutée et est l'oscillateur par défaut de la communauté retail des actions A chinoises. Connaître le parent vous aide à lire chaque variante.

### Points clés

- **Formule** : `%K = ((Clôture − Bas(N)) / (Haut(N) − Bas(N))) × 100`. N = 14 par défaut dans la convention US.
- **Deux lignes** : %K (le stochastique brut) et %D (SMA 3 périodes de %K, la ligne de signal). Quand %K croise %D, c'est le signal de base.
- **Surachat au-dessus de 80, survente sous 20.** Mêmes seuils que le RSI mais construit à partir d'une formule différente (position dans la fourchette, pas force du changement).
- **Fast vs slow stochastique** : le fast est plus réactif mais plus bruité ; le slow est le standard lissé. La plupart des plateformes utilisent le slow par défaut.
- **Le [KDJ](/blog/what-is-kdj) étend le stochastique avec une ligne J** (`J = 3K − 2D`). La ligne J peut dépasser 0 ou 100, ce qui explique pourquoi le KDJ est plus populaire sur les marchés à mouvements brusques (actions A).

## Comment calcule-t-on l'oscillateur stochastique ?

Les maths complètes pour la forme la plus courante (slow stochastique) :

```
Raw %K = ((Clôture − Bas(N)) / (Haut(N) − Bas(N))) × 100
%K     = SMA 3 périodes de Raw %K
%D     = SMA 3 périodes de %K
```

N = 14 par défaut dans la convention US ; le KDJ utilise (9, 3, 3) dans la convention des actions A. Le lissage réduit le bruit — le « fast stochastique » non lissé est trop sensible pour un usage sur barres quotidiennes sur la plupart des actions.

La sortie est bornée 0–100 par construction :

- **%K = 100** signifie que la clôture est au plus haut prix des N dernières barres (force maximale)
- **%K = 0** signifie que la clôture est au plus bas prix des N dernières barres (faiblesse maximale)
- **%K = 50** signifie que la clôture est exactement au milieu de la fourchette récente

Cela rend le stochastique fondamentalement différent du [RSI](/blog/what-is-rsi), qui mesure la *force des changements de cours récents*, pas la *position dans une fourchette*. Les deux sont souvent d'accord mais pour des raisons légèrement différentes.

## Fast vs slow stochastique — quelle est la différence ?

Trois variantes de stochastique existent, par ordre croissant de lissage :

| Variante | Raw %K | %K (sortie) | %D | Usage |
|---|---|---|---|---|
| **Fast** | Brut | Brut | SMA 3 de %K | Traders actifs, intraday |
| **Slow** | Brut | SMA 3 de Raw | SMA 3 de %K | Standard pour barres quotidiennes |
| **Full** | Brut | SMA N de Raw (configurable) | SMA M de %K (configurable) | Optimisation personnalisée |

L'« oscillateur stochastique » sans qualificatif fait presque toujours référence à la version slow. Le fast stochastique génère trop de faux signaux sur barres quotidiennes pour être utile dans la plupart des timeframes retail ; il a sa place sur les graphiques intraday où le niveau de bruit est plus élevé.

## Que signifient surachat et survente ici ?

Les seuils 80/20 fonctionnent de manière similaire aux 70/30 du RSI :

- **Stochastique > 80** : la clôture est dans les 20 % supérieurs de la fourchette des N dernières barres — tendance haussière avec fort momentum récent.
- **Stochastique < 20** : la clôture est dans les 20 % inférieurs de la fourchette récente — tendance baissière avec momentum récent faible.

La nuance comportementale clé : dans un marché fortement en tendance, le stochastique peut s'épingler à ou au-dessus de 80 (en tendance haussière) ou en dessous de 20 (en tendance baissière) pendant de nombreuses barres consécutives. Traiter « stochastique > 80 » comme automatiquement « surachat à vendre » fait perdre de l'argent en marché de tendance. Le signal est plus utile à la *sortie* d'un extrême — `%K croise sous 80 depuis le haut` pour les signaux de vente, `%K croise au-dessus de 20 depuis le bas` pour les signaux d'achat.

## Stochastique vs KDJ — quelle est la différence ?

Le KDJ est un stochastique avec un ajout : la ligne J.

| Composant | Formule | Plage |
|---|---|---|
| **K** (KDJ) | Identique au %K du slow stochastique | 0–100 (borné) |
| **D** (KDJ) | Identique au %D du slow stochastique | 0–100 (borné) |
| **J** (KDJ) | `3K − 2D` | Non borné — peut descendre sous 0 ou dépasser 100 |

La propriété non bornée de la ligne J est la raison d'être du KDJ comme indicateur séparé. Quand le marché est dans un mouvement brusque, J dépasse 0 ou 100, agissant comme un signal d'extrême précoce — typiquement 1 à 3 barres avant que K et D ne montrent le même extrême.

Le KDJ est l'oscillateur par défaut dans la communauté retail des actions A chinoises pour deux raisons :

1. Les limites de prix journalières des actions A (±10 % sur le marché principal, ±20 % sur ChiNext/STAR) créent des mouvements barre par barre plus brusques que les barres quotidiennes US. Le dépassement de la ligne J capture ces mouvements plus brusques plus proprement que le RSI ne le fait.
2. Coordination culturelle — parce que la communauté retail des actions A utilise le KDJ par défaut, les signaux sont partiellement auto-réalisateurs sur les noms d'actions A.

Pour une comparaison plus approfondie, voir [Qu'est-ce que le KDJ ?](/blog/what-is-kdj) et [KDJ vs RSI](/blog/kdj-vs-rsi).

## Quatre pièges dans la lecture du stochastique

1. **Fader la tendance avec le stochastique.** « Stochastique au-dessus de 80, donc vendre » fait perdre de l'argent en tendance haussière. En marchés de tendance, le stochastique s'épingle aux extrêmes pendant de nombreuses barres ; le bon signal est la *sortie* de l'extrême combinée à un événement de confirmation (cassure de prix, croisement de momentum), pas l'extrême lui-même.
2. **Utiliser le stochastique sur des actions agitées.** Les titres à faible momentum et bruit élevé génèrent des dizaines de croisements stochastiques par trimestre, dont la plupart sont du bruit. Utilisez le stochastique sur des noms avec une persistance de tendance raisonnable — mêmes critères que MACD et autres oscillateurs de momentum.
3. **Ignorer le filtre de régime de tendance.** Le stochastique sans filtre de tendance est principalement du bruit. Quand l'[ADX](/blog/what-is-adx) est sous 20, les signaux stochastiques sont des pile ou face. Quand l'ADX dépasse 25 avec une direction de tendance claire, les signaux stochastiques aux extrêmes ont un edge significatif.
4. **Confondre stochastique et stochastique RSI.** Le stochastique mesure la position du *cours* dans la fourchette ; le stochastique RSI (StochRSI) mesure la position du *RSI* dans sa propre fourchette. Ils sonnent similaires mais mesurent des choses différentes et répondent différemment. Le « stochastique » par défaut sur la plupart des plateformes est le stochastique original de Lane, pas le StochRSI.

## Comportement du stochastique sur les actions A

La microstructure des actions A rend le stochastique (et le KDJ) particulièrement sensible :

- **Les jours limit-up** plafonnent la clôture au prix limite, qui est mécaniquement le haut de la fourchette de la barre. Le %K stochastique un jour de limit-up est à ou près de 100 par construction, quel que soit le contexte de tendance plus large. PickSkill marque les barres de jours limites comme outliers dans les tableaux de bord d'indicateurs.
- **Les jours de suspension** gèlent le calcul. Quand l'action reprend après une suspension de plusieurs jours, la fenêtre de lookback inclut la période pré-suspension, qui peut ne plus être pertinente — traitez les lectures stochastiques post-suspension avec prudence pour les 5 à 10 premières barres.
- **Le règlement T+1** rend impossibles les allers-retours dans la journée. Cela comprime la volatilité intraday dans l'ouverture de la séance suivante — rendant les signaux stochastiques des actions A plus événementiels et moins continus que le stochastique en barres quotidiennes US.

Voir [Meilleurs indicateurs pour les actions A](/blog/best-indicators-for-a-shares) et [MACD sur actions A vs actions américaines](/blog/macd-on-a-shares-vs-us) pour le contexte spécifique au marché plus large.

> **Visualisez-le sur votre portefeuille.** La page [/indicators](/indicators) restitue le KDJ (la variante de stochastique la plus utilisée dans l'univers PickSkill) sur chaque ligne, avec les lignes K, D et J plus la trace de bucket sur 5 jours.

## Comment le stochastique s'intègre dans un workflow multi-signal

Le stochastique est un input dans un workflow par couches :

| Couche | Outil | Question à laquelle elle répond |
|---|---|---|
| **Filtre de tendance** | Pile MA + [ADX](/blog/what-is-adx) | Y a-t-il une tendance ? Est-elle assez forte pour être tradée ? |
| **Momentum / oscillateur** | Stochastique / [KDJ](/blog/what-is-kdj) / [RSI](/blog/what-is-rsi) | Où en est le mouvement dans son cycle de momentum ? |
| **Confirmation** | Croisement %K de %D, [MACD](/blog/what-is-macd) | Quand agir ? |
| **Niveau / carte** | [Support / résistance](/blog/what-is-support-resistance) | Où sont les niveaux clés ? |

Le setup d'entrée le plus propre : tendance confirmée (ADX > 25, pile MA alignée), stochastique sortant de la survente depuis sous 20, %K croise %D à la hausse, le cours casse un plus haut récent — quatre signaux alignés. Sauter l'un des quatre réduit significativement l'edge par signal.

## Prompts de suivi courants

- *« Pour chaque ligne, montre les valeurs KDJ actuelles plus la trace sur 5 jours. Signale toutes celles où K est sorti de la survente et J monte rapidement. »*
- *« Compare les signaux stochastique et RSI sur ma watchlist actions A. Lesquelles ont les deux aux extrêmes ? »*
- *« Trouve les actions du S&P 500 avec %K stochastique sortant de la survente ET un croisement MA 50 jours au-dessus de la MA 200 jours — candidats à un retournement haussier. »*
- *« Backteste le croisement de %K avec %D depuis la survente sur [ticker] sur les 5 dernières années. Quel est le taux de réussite ? »*

## Pour aller plus loin

- [Investopedia sur l'oscillateur stochastique](https://www.investopedia.com/terms/s/stochasticoscillator.asp) — référence exhaustive.
- [Le travail original de George Lane sur le stochastique](https://www.amazon.com/George-Lane/e/B001JS4OBC) — traitement par le développeur lui-même.

## FAQ

**Stochastique vs RSI — lequel est meilleur ?**
Aucun — ils mesurent des choses différentes. Le RSI capture la *force des changements de cours récents* ; le stochastique capture la *position dans la fourchette récente*. En marchés de tendance, le RSI tend à être plus utile (il peut accompagner une tendance sans faux retournements). En marchés en range, le stochastique tend à être plus utile (il identifie proprement les extrêmes de range). Les tableaux de bord PickSkill exécutent les deux pour que vous puissiez comparer. Voir [KDJ vs RSI](/blog/kdj-vs-rsi) pour un traitement plus approfondi.

**Pourquoi mon graphique affiche-t-il des valeurs stochastiques différentes d'une autre plateforme ?**
Deux causes courantes : (1) périodes différentes (14 vs 9 pour %K, 3 vs 5 pour le lissage de %D), et (2) variante fast vs slow. Les tableaux de bord PickSkill utilisent le slow stochastique standard avec les périodes par défaut pour correspondre à la convention la plus courante des plateformes.

**Quelle est la relation entre stochastique et KDJ ?**
Le KDJ est un slow stochastique avec une ligne J ajoutée (`J = 3K − 2D`). Les maths de K et D sont identiques entre les deux. La ligne J du KDJ est le seul ajout, et elle fournit des signaux d'alerte précoce via le dépassement au-delà de 0 ou 100. Le stochastique est la convention dominante aux États-Unis ; le KDJ est la convention dominante dans la communauté retail des actions A.

**Le stochastique peut-il prédire la direction ?**
Le stochastique identifie les *extrêmes* et les *croisements* ; il ne prédit pas la direction absolue isolément. Un stochastique croisant à la hausse depuis la survente vous dit que le momentum a basculé en positif à cet extrême spécifique ; il ne vous dit pas que la tendance plus large reprendra. Combinez les signaux stochastiques avec un filtre de tendance (pile MA + ADX) et un événement de confirmation (cassure de prix, croisement MACD) avant d'agir.

**Faut-il utiliser le stochastique sur les graphiques intraday ?**
Vous le pouvez, mais réduisez les attentes. Le stochastique intraday génère de nombreux signaux par séance, dont la plupart sont du bruit. Utilisez des périodes intraday (5 ou 7 au lieu de 14) et exigez une confirmation multi-signal. La plupart du travail intraday retail sur-utilise le stochastique par rapport à son edge réel.
