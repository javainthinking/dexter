---
title: SMA vs EMA — Quelle moyenne mobile utiliser ?
description: >-
  La SMA pondère chaque barre à l'identique ; l'EMA pondère plus les barres
  récentes. Comparaison côte à côte, dans quels cas chacune gagne, et pourquoi
  la SMA 200 jours compte plus que sa cousine EMA.
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
  - SMA
  - EMA
  - Moyenne mobile
  - Analyse technique
  - Comparaison
heroImage: /blog/ma-vs-ema/hero.png
heroAlt: >-
  Infographie éditoriale — ligne de prix avec SMA(20) et EMA(20) superposées,
  montrant que l EMA suit le prix de plus près que la SMA plus lente.
---

**La SMA (simple moving average) est la moyenne arithmétique du cours de clôture sur N barres — chaque barre pondérée à l'identique. L'EMA (exponential moving average) applique une pondération qui décroît exponentiellement, donc les barres récentes pèsent plus.** La différence mathématique est mince. La différence pratique — laquelle réagit plus vite, laquelle est plus stable, et autour de laquelle les institutionnels se coordonnent — pilote l'essentiel du choix éditorial. Il y a de bonnes et de mauvaises réponses selon ce que vous cherchez à faire.

### Points clés

- **La SMA réagit plus lentement ; l'EMA réagit plus vite.** Cette seule propriété explique 80 % du choix.
- **L'EMA est le bon choix à l'intérieur des outils de momentum** (le [MACD](/blog/what-is-macd) utilise EMA(12) et EMA(26)) — la réactivité compte dans ces contextes.
- **La SMA est le bon choix pour les filtres de tendance.** La SMA 200 jours est la référence institutionnelle ; l'EMA 200 jours existe mais presque personne ne la regarde.
- **L'écart se réduit avec la longueur de la fenêtre.** À 200 barres, les valeurs SMA et EMA sont typiquement à 1–2 % l'une de l'autre.
- **Les deux s'affichent sur les tableaux de bord PickSkill [/indicators](/indicators)** — les cartes MA utilisent par défaut la SMA pour la 200 jours, l'EMA pour les 12 / 26 du MACD, et la SMA pour la pile 20 / 60.

## Les deux formules, côte à côte

### Simple Moving Average (SMA)

```
SMA(N) = (close[t] + close[t-1] + ... + close[t-N+1]) / N
```

Chaque barre de la fenêtre reçoit un poids 1/N. Au jour t+1, la barre la plus ancienne sort et la nouvelle entre. L'influence de chaque barre est binaire : elle est dans la fenêtre ou non.

### Exponential Moving Average (EMA)

```
EMA(N)[t] = α × close[t] + (1 − α) × EMA(N)[t−1]
            avec α = 2 / (N + 1)
```

La clôture du jour reçoit un poids α ; l'EMA de la veille porte le reste. La forme récursive signifie que *chaque* barre antérieure contribue, le poids décroissant exponentiellement. Pour N = 20, la barre la plus récente reçoit ~9,5 % du poids ; la barre d'il y a 10 jours, ~3,7 % ; la barre d'il y a 50 jours, ~0,4 %.

Pour un traitement plus complet des deux, voir [Qu'est-ce qu'une moyenne mobile ?](/blog/what-is-ma).

## Comparaison côte à côte

| Propriété | SMA | EMA |
|---|---|---|
| **Pondération** | Égale sur la fenêtre | Décroissance exponentielle |
| **Retard** | Élevé — retard de N/2 barres sur des données en tendance | Plus faible — retard effectif de ~N/3 barres |
| **Réaction aux cours récents** | Plus lente | Plus rapide |
| **Effet des barres outliers** | Un outlier biaise la SMA pendant exactement N barres, puis disparaît | L'influence d'un outlier décroît continûment, à jamais |
| **Comportement en bord de fenêtre** | Saut net quand la vieille barre sort de la fenêtre (effet « drop-off ») | Lisse — pas de sauts discrets |
| **Défaut le plus utilisé pour** | Filtres de tendance (200 jours), bande médiane de Bollinger | Outils de momentum (MACD 12 / 26) |
| **Coordination institutionnelle** | Élevée — la SMA 200 jours est la référence universelle | Plus faible — uniquement à l'intérieur d'outils spécifiques |
| **Coût computationnel** | Plus élevé (somme glissante à chaque barre) | Plus faible (une multiplication et une addition) |

L'effet drop-off mérite qu'on s'y arrête. Imaginez une SMA 20 jours où il y a 20 barres la clôture était à 80 $ et aujourd'hui la même action est à 100 $. Quand demain arrive et que la barre à 80 $ sort de la fenêtre, la SMA bondit même si la clôture du jour est plate — parce que la moyenne a abandonné un chiffre bas du calcul. La SMA peut bouger de façon discrète sans nouvelle information. L'EMA n'a pas cet artefact ; l'influence de la barre à 80 $ décroît continûment et lissée.

## Laquelle réagit plus vite ?

L'EMA réagit plus vite — par construction. Pour la même période N, le retard effectif de l'EMA est d'environ N/3 barres tandis que celui de la SMA est de N/2 barres.

Sur un mouvement de cours net, l'EMA retournera 1–3 barres plus tôt que la SMA de même longueur sur des graphiques quotidiens. Sur une tendance soutenue, l'EMA suit plus près le cours actuel tandis que la SMA suit le milieu de la tendance. Sur un grignotage lent, la différence est mince.

La réaction plus rapide est *toute la raison d'être* de l'EMA. C'est aussi pourquoi l'EMA produit plus de faux signaux — chaque sensibilité supplémentaire vient avec du bruit supplémentaire. L'arbitrage réactivité-vs-stabilité est le choix de design fait par le développeur de chaque outil :

- Le [MACD](/blog/what-is-macd) utilise l'EMA parce que les outils de momentum ont besoin de réactivité.
- La SMA 200 jours perdure parce que le filtre de risque institutionnel veut de la stabilité.
- La bande médiane de Bollinger est une SMA(20) parce que l'interprétation statistique des bandes (enveloppe à un écart-type) est la plus propre autour d'une moyenne simple.

## Quand la SMA l'emporte-t-elle ?

Trois contextes où l'avantage de stabilité de la SMA compte :

1. **Filtres de tendance à fenêtre longue.** La SMA 200 jours est la référence universelle pour le régime de tendance — la coordination institutionnelle à ce niveau précis est tout l'enjeu. Passer à une EMA 200 jours abandonne l'avantage de coordination sans réel gain informationnel. Restez sur la SMA.
2. **Construction d'enveloppes statistiques.** Les bandes de Bollinger utilisent SMA(20) comme bande médiane parce que l'enveloppe à ±2 écarts-types a une interprétation statistique propre autour d'une moyenne arithmétique. Autour d'une EMA, l'interprétation devient plus trouble.
3. **Robustesse aux outliers sur les titres peu liquides.** Une small-cap peu traitée avec un jour de gap sur résultats verra son EMA biaisée pendant des semaines (parce que l'influence des outliers ne disparaît jamais totalement dans une EMA). La SMA abandonne complètement l'outlier après N barres — un comportement plus propre pour les instruments peu liquides.

## Quand l'EMA l'emporte-t-elle ?

Trois contextes où l'avantage de réactivité de l'EMA compte :

1. **À l'intérieur des outils de momentum.** Le [MACD](/blog/what-is-macd) (EMA(12) − EMA(26), lissé par EMA(9)) est l'exemple classique. Tout l'enjeu du MACD est de capturer les changements de momentum ; le retard d'une SMA rendrait les signaux de croisement trop tardifs pour être utiles.
2. **Systèmes de swing à fenêtre courte.** Les traders actifs faisant tourner des systèmes de croisement de MA à fenêtre courte (5/10, 10/20) préfèrent typiquement l'EMA — les retournements plus rapides capturent les pivots de swing que la SMA rate.
3. **Suivi haute fréquence d'actions à mouvements rapides.** Pour une action faisant des mouvements directionnels rapides (tendances haussières paraboliques, renversements nets), la décroissance continue de l'EMA produit un suivi plus lisse que les sauts discrets de la SMA.

## Et la WMA, la HMA et autres variantes ?

Au-delà de SMA et EMA, des dizaines de variantes de moyennes mobiles existent :

| Variante | Schéma de pondération | Note |
|---|---|---|
| **WMA** (Weighted MA) | Décroissance linéaire sur N barres | Entre SMA et EMA en réactivité |
| **HMA** (Hull MA) | Adaptative — combine des MA pondérées de différentes longueurs | Très faible retard ; populaire chez les traders actifs, moins ancrée culturellement |
| **TEMA / DEMA** | Triplement / doublement lissée exponentiellement | Conçue pour réduire encore le retard EMA ; amélioration modeste |
| **VWMA** (Volume-Weighted MA) | Pondère chaque barre par son volume | Incorpore la participation ; utile sur les titres peu liquides |
| **KAMA** (Kaufman Adaptive MA) | La longueur s'adapte à la volatilité du marché | La plus lisse en stagnation, la plus rapide en tendance ; élégante mathématiquement, edge pratique modeste |

Pour la plupart des cas d'usage retail, SMA et EMA couvrent le terrain. Les variantes exotiques offrent des améliorations marginales dans des scénarios précis mais sacrifient la coordination institutionnelle (personne d'autre ne regarde votre ligne KAMA) pour un edge théorique. Restez sur SMA et EMA sauf preuve backtestée justifiant une variante.

## Quatre pièges dans le choix entre SMA et EMA

1. **Mélanger les deux dans un seul signal sans réfléchir.** Une « EMA 20 jours croisant une SMA 50 jours » est un signal mathématiquement valide — mais la comparaison est apples-to-oranges (caractéristiques de retard différentes) et le résultat est plus difficile à interpréter. Choisissez une famille et restez-y cohérent dans un système.
2. **Passer à l'EMA parce que les backtests paraissent meilleurs.** La réactivité plus rapide de l'EMA produit *plus* de signaux ; certains de ces signaux supplémentaires sont corrects (et soulèvent la courbe d'équité) et d'autres sont faux (et ajoutent du drawdown). Le tuning de backtest trouve typiquement l'EMA sur des données qui happen à favoriser la réactivité sur la stabilité. Hors échantillon, l'effet a souvent disparu.
3. **Traiter la propriété « pas de drop-off » de l'EMA comme universellement meilleure.** L'effet drop-off est parfois informationnel — un saut net de la SMA quand un vieil outlier sort de la fenêtre vous dit que l'action de prix récente est significativement différente d'il y a N barres. L'EMA cache cette information dans son lissage.
4. **Utiliser l'EMA pour le filtre de tendance 200 jours.** C'est l'erreur la plus fréquente. La SMA 200 jours compte parce que tout le monde la regarde ; l'EMA 200 jours est juste une ligne légèrement plus rapide sans coordination institutionnelle derrière elle. Le changement perd le bénéfice de coordination sans rien gagner de significatif.

## Comportement sur actions A vs actions américaines

La microstructure du marché modifie subtilement le calcul :

- **Actions A** : les jours limit-up et limit-down sont des outliers fonctionnels. La propriété « abandonne la barre après N barres » de la SMA les gère proprement ; la décroissance continue de l'EMA signifie qu'un jour limit-up biaise l'EMA pendant des semaines. Pour les actions A à jours limites fréquents, la SMA est plus robuste.
- **Grandes capitalisations US** : liquidité continue signifie que les jours outliers sont rares ; la différence EMA-vs-SMA est plus mince en pratique. L'une ou l'autre marche ; choisissez selon l'outil spécifique (EMA pour le momentum, SMA pour les filtres de tendance).
- **Valeurs HK** : convention mixte ; les plateformes locales utilisent souvent la SMA par défaut, les courtiers étrangers souvent l'EMA. L'une ou l'autre est acceptable.

Les tableaux de bord PickSkill utilisent par défaut la SMA pour les filtres de tendance à fenêtre longue (50, 60, 200) et l'EMA pour les outils de momentum à fenêtre courte (12, 26 à l'intérieur du MACD). C'est la convention utilisée dans la plus large gamme de backtests académiques et correspond à la référence institutionnelle.

> **Visualisez les deux sur vos graphiques.** La page [/indicators](/indicators) affiche la pile MA standard — 20 / 60 / 200 (SMA) plus les EMA internes 12 / 26 du MACD — sur chaque ligne, avec le statut de croisement et la direction de pente signalés.

## Comment le choix se concrétise dans un vrai workflow

Le modèle mental le plus propre : **utilisez la SMA pour la *carte* (où le cours est passé en moyenne sur la fenêtre), utilisez l'EMA pour le *moteur* (comment le momentum change maintenant).**

| Étape du workflow | Outil | Type de MA |
|---|---|---|
| **Régime de tendance** | MA 200 jours | SMA |
| **Contexte moyen terme** | MA 50 jours | SMA |
| **Contexte court terme** | MA 20 jours | SMA |
| **Oscillateur de momentum** | [MACD](/blog/what-is-macd) | EMA (interne) |
| **Enveloppe de volatilité** | [Bande médiane de Bollinger](/blog/what-is-bollinger-bands) | SMA |
| **Filtre d'entrée swing-trade** | Système de croisement 5/10 | EMA |

Utilisez les deux, mais utilisez chacune au bon endroit.

## Pour aller plus loin

- [Comparaison SMA et EMA sur Investopedia](https://www.investopedia.com/ask/answers/05/smaema.asp) — référence concise sur les différences mécaniques.
- [Robert Colby, *The Encyclopedia of Technical Market Indicators*](https://www.amazon.com/dp/0070120579) — traitement exhaustif des variantes de moyennes mobiles avec backtests historiques.

## FAQ

**Faut-il toujours utiliser l'EMA parce qu'elle réagit plus vite ?**
Non. Une réaction plus rapide signifie à la fois plus de signaux corrects et plus de faux signaux. Pour les filtres de tendance à fenêtre longue, la stabilité de la SMA est *l'enjeu*. Pour les outils de momentum à fenêtre courte, la réactivité de l'EMA est *l'enjeu*. Choisissez la bonne pour le poste, n'optimisez pas tout pour la vitesse.

**Pourquoi la SMA 200 jours est-elle plus célèbre que l'EMA 200 jours ?**
Des décennies de convention institutionnelle. La SMA 200 jours est codée en dur dans les règles de gestion du risque de nombreux fonds systématiques et est la référence dans pratiquement chaque plateforme de graphiques par défaut. La coordination auto-réalisatrice au niveau fait que le niveau compte, indépendamment du fait que la SMA ou l'EMA soit « mathématiquement meilleure ». L'EMA 200 jours existe mais commande beaucoup moins d'attention institutionnelle.

**SMA et EMA sont-elles mathématiquement équivalentes sur longs horizons ?**
Elles convergent en tendance centrale mais ne deviennent jamais identiques. À 200 barres, les valeurs SMA et EMA sont typiquement à 1–2 % l'une de l'autre sur des données lissées en tendance ; sur des données volatiles, l'écart peut être plus large. Elles ont des caractéristiques de retard différentes en permanence — même à grand N, l'EMA est plus rapide d'une marge mince mais mesurable.

**Laquelle est meilleure pour les actions que je détiens long terme ?**
Pour les détentions de long terme, la moyenne mobile est surtout un indicateur de *contexte* (la tendance large est-elle haussière ou baissière ?), pas un indicateur de *signal*. La SMA convient. La SMA 200 jours en particulier vous donne le régime d'un coup d'œil et correspond à ce que regardent les desks de risque institutionnels. Réservez le débat EMA aux contextes intraday et swing-trading où la réactivité pilote les résultats.

**Pourquoi mes graphiques montrent-ils des valeurs SMA / EMA différentes d'une autre plateforme ?**
Trois causes fréquentes : (1) points de départ différents pour le calcul récursif de l'EMA (certaines plateformes l'amorcent à partir d'une moyenne simple des N premières barres ; d'autres de la première clôture), (2) traitement différent des séances after-hours / pre-market, (3) convention différente sur le côté de la barre où la moyenne mobile est tracée (centrée vs fin de fenêtre). Pour la cohérence, PickSkill utilise un tracé en fin de fenêtre, des EMA amorcées par SMA et des données de séance régulière uniquement — les conventions standard dans les backtests académiques.
