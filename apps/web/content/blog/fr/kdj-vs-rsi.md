---
title: KDJ vs RSI — Quel oscillateur de momentum utiliser ?
description: >-
  KDJ et RSI mesurent tous deux le momentum, mais sur des formules et horizons
  différents. Comparaison en parallèle, dans quels contextes chacun gagne, et
  comment les combiner.
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
  - KDJ
  - RSI
  - Momentum
  - Analyse technique
  - Comparaison
heroImage: /blog/kdj-vs-rsi/hero.png
heroAlt: >-
  Infographie éditoriale — RSI en ligne unique en haut avec les références
  70/30, KDJ en trois lignes (K/D/J) en bas avec les références 80/20 et le
  débordement de la ligne J mis en évidence.
---

**RSI et KDJ sont tous deux des oscillateurs de momentum, mais ils posent des questions différentes. Le RSI mesure la force des variations de cours récentes par rapport à leur amplitude moyenne ; le KDJ mesure la position de la clôture dans la fourchette de prix récente puis lisse ce signal deux fois.** La plupart des débats retail les présentent comme substituts. Ils sont complémentaires — chacun a un edge propre dans un régime de marché spécifique, et la combinaison est plus informative que l'un ou l'autre pris seul.

### Points clés

- **Entrants différents** : le RSI utilise les variations close-to-close ; le KDJ utilise la position de la close dans le range.
- **Échelles différentes** : le RSI varie de 0 à 100 avec suracheté / survendu à 70 / 30 ; la ligne J du KDJ peut dépasser 0–100 (et ce dépassement est informatif).
- **Le RSI excelle en marchés tendanciels** — sa ligne 50 est un filtre de tendance propre.
- **Le KDJ excelle en marchés en range** — sa sensibilité à la position dans le range le rend plus précoce sur les renversements aux niveaux de swing.
- **La combinaison est plus puissante que chacun pris seul** — une divergence dans les deux simultanément est sensiblement à plus forte conviction qu'une divergence dans un seul. Le tableau de bord PickSkill [/indicators](/indicators) affiche les deux côte à côte sur chaque ligne.

## Les deux formules, côte à côte

### RSI (Relative Strength Index)

Développé par J. Welles Wilder en 1978. Plage 0–100 ; 14 périodes par défaut.

```
RS = Gain moyen(14) / Perte moyenne(14)
RSI = 100 − [100 / (1 + RS)]
```

Le « gain moyen » est la moyenne des barres où la clôture a monté ; la « perte moyenne » est la moyenne des valeurs absolues des barres où la clôture a baissé. Le lissage utilise la moyenne mobile modifiée de Wilder (un lissage exponentiel à 14 périodes avec α = 1/14), qui diffère légèrement d'une EMA standard.

Pour un traitement approfondi, voir [Qu'est-ce que le RSI ?](/blog/what-is-rsi).

### KDJ (oscillateur stochastique avec une ligne J)

Une variante de l'oscillateur stochastique classique avec une ligne J ajoutée. Le plus largement utilisé dans la communauté retail chinoise des actions A ; périodes par défaut (9, 3, 3).

```
RSV = ((Close − Low(9)) / (High(9) − Low(9))) × 100
K = (2/3 × K[prev]) + (1/3 × RSV)
D = (2/3 × D[prev]) + (1/3 × K)
J = 3 × K − 2 × D
```

K et D varient de 0 à 100 ; **J peut dépasser les deux bornes** (J > 100 ou J < 0) par construction. Le dépassement est la caractéristique distinctive de la ligne J — elle amplifie les extrêmes et retourne plus tôt que K ou D.

Pour un traitement approfondi, voir [Qu'est-ce que le KDJ ?](/blog/what-is-kdj).

## Où ils diffèrent dans l'interprétation

| Aspect | RSI | KDJ |
|---|---|---|
| **Entrant sous-jacent** | Variations close-to-close | Close vs range haut-bas récent |
| **Période par défaut** | 14 | 9 (plus rapide) |
| **Suracheté / survendu** | 70 / 30 | 80 / 20 (K, D) ; J dépasse |
| **Nombre de lignes** | 1 ligne | 3 lignes (K, D, J) |
| **Meilleure détection** | Force de tendance + extrêmes | Renversement dans un range défini |
| **Signaux de croisement** | Croisement de 50 (filtre de tendance) ; sorties de 70 / 30 (sorties d'extrême) | K croisant D (plus rapide) ; points de retournement de J (le plus rapide) |
| **Mode d'échec** | Reste suracheté / survendu pendant les tendances fortes | Whipsaws en stagnation faible volatilité |
| **Le plus culturel chez** | Institutionnel + retail US | Retail actions A ; adoption partielle à HK |

La différence fondamentale : **le RSI est un indicateur de variation de prix ; le KDJ est un indicateur de position dans le range.** Dans un marché tendanciel, la lecture « force de la variation » du RSI est informative — les clôtures fortement haussières poussent le RSI vers 70 et l'y maintiennent. Dans un marché en range, la lecture « position dans le range » du KDJ est informative — quand la close est près du haut du range, le KDJ est près de 80 quelle que soit la force de la variation.

## Quand le RSI l'emporte-t-il ?

Trois régimes où le RSI délivre plus de signal que le KDJ :

1. **Marchés tendanciels confirmés.** Quand l'[ADX](/blog/what-is-adx) > 25, les lectures suracheté / survendu du RSI restent fiables comme signaux de continuation plutôt que de renversement. Un RSI persistant > 70 dans un marché tendanciel n'est *pas* « suracheté à vendre » — c'est « tendance haussière avec momentum ». La ligne 50 du RSI agit comme un filtre de tendance propre : au-dessus de 50 = biais haussier, en dessous = biais baissier.
2. **Titres à fort momentum aux tendances lisses.** Grandes capitalisations tech, méga-caps, indices — instruments à mouvements directionnels soutenus et faible mean reversion. Le RSI capture mieux la persistance du momentum que le KDJ, qui oscille trop.
3. **Analyse multi-horizon.** Parce que le RSI est une ligne unique, la comparaison multi-horizon (alignement du RSI quotidien avec le RSI hebdomadaire) est plus propre. Les trois lignes du KDJ rendent l'analyse multi-horizon encombrée.

Pour un approfondissement spécifique au RSI, voir [Qu'est-ce que le RSI ?](/blog/what-is-rsi).

## Quand le KDJ l'emporte-t-il ?

Trois régimes où le KDJ délivre plus de signal que le RSI :

1. **Marchés en range aux niveaux de swing.** Quand le cours oscille dans un range défini (support et résistance tous deux bien définis), les retournements plus précoces et plus sensibles du KDJ attrapent les renversements aux deux extrémités du range alors que le RSI est encore neutre.
2. **Barres quotidiennes sur actions A.** La communauté retail des actions A utilise le KDJ comme outil de momentum par défaut ; la coordination culturelle rend les signaux partiellement auto-réalisateurs sur les valeurs A. Le motif de dépassement de la ligne J est un setup reconnu dans le vocabulaire des traders locaux.
3. **Attraper le creux (ou le sommet) de mouvements rapides.** La construction à trois lignes du KDJ fait que J tourne en premier, puis K croise D en confirmation. La confirmation en deux temps est plus rapide que la trajectoire en ligne unique du RSI et fonctionne bien sur les titres à pivots de swing nets.

Pour un approfondissement spécifique au KDJ, voir [Qu'est-ce que le KDJ ?](/blog/what-is-kdj).

## Comment les utiliser ensemble

La combinaison la plus propre — utilisée dans les tableaux de bord multi-indicateurs PickSkill — fait tourner les deux en parallèle et cherche l'*accord* :

| Signal | Interprétation |
|---|---|
| **RSI survendu + KDJ survendu + les deux qui retournent à la hausse** | Candidat de renversement haussier à forte conviction ; les deux oscillateurs s'accordent sur la condition et sur le retournement |
| **RSI > 70 + KDJ > 80 + cours toujours en tendance haussière** | Continuation dans une tendance haussière confirmée ; ne pas fader sauf si l'ADX montre un affaiblissement de la tendance |
| **Divergence RSI + divergence KDJ sur le même swing** | Divergence multi-oscillateurs — sensiblement plus à fort edge qu'une divergence dans un seul |
| **RSI dit une chose, KDJ une autre** | Signal contradictoire — passer le setup jusqu'à émergence d'un alignement |

La discipline est d'exiger les deux. Agir sur le RSI seul (ou le KDJ seul) revient à agir sur un seul entrant ; exiger l'accord filtre une part substantielle des faux positifs.

## Quatre pièges dans la comparaison RSI / KDJ

1. **Traiter l'un ou l'autre comme un déclencheur autonome.** Les deux oscillateurs sont des *filtres* et des *confirmations*, pas des déclencheurs autonomes. Associez-les à un filtre de tendance (pile MA + [ADX](/blog/what-is-adx)) et à une référence de niveau ([support / résistance](/blog/what-is-support-resistance)) avant d'agir.
2. **Utiliser les périodes par défaut sur chaque instrument.** Les défauts (RSI 14, KDJ (9, 3, 3)) sont des points de départ raisonnables sur barres quotidiennes. Sur barres hebdomadaires, ils correspondent à ~3 mois et ~9 semaines — différents dans la réalité. Sur barres intraday, ils capturent bien moins d'information que ne le supposent les guides retail. Adaptez la période à l'horizon que vous tradez réellement.
3. **Ignorer le contexte culturel.** Le flux institutionnel US trade sur le RSI ; le flux retail actions A trade sur le KDJ. La coordination culturelle compte parce qu'elle rend les signaux partiellement auto-réalisateurs. Sur les valeurs A, le KDJ a un poids informationnel supplémentaire au-delà de son contenu mathématique.
4. **Essayer de déterminer lequel est « meilleur ».** Les deux fonctionnent ; les deux ont des modes d'échec spécifiques ; les deux sont plus forts ensemble. Le débat « RSI vs KDJ » est une erreur de catégorie — ce sont des outils complémentaires, pas des concurrents.

## Comportement sur actions A vs actions américaines

La microstructure du marché modifie sur quel oscillateur s'appuyer :

- **Actions A** : le KDJ est l'outil par défaut. Limites journalières, règlement T+1 et participation retail plus forte favorisent tous le cadrage par position dans le range plutôt que par force de variation. Le RSI fonctionne encore mais est culturellement secondaire. Les tableaux de bord PickSkill affichent les deux avec le KDJ comme indicateur principal sur les graphiques d'actions A.
- **Grandes capitalisations US** : le RSI est l'outil par défaut. Liquidité continue, flux institutionnel profond et action de prix plus lisse favorisent le cadrage par force de tendance du RSI. Le KDJ fonctionne encore mais signale plus souvent — beaucoup de faux positifs en marchés tendanciels.
- **Valeurs HK** : culture mixte — le vocabulaire des traders locaux utilise le KDJ ; le flux institutionnel étranger utilise le RSI. Les deux fonctionnent ; utiliser les deux est le défaut prudent.

Voir [MACD sur actions A vs actions américaines](/blog/macd-on-a-shares-vs-us) pour l'analyse marché par marché plus large et [Meilleurs indicateurs pour les actions A](/blog/best-indicators-for-a-shares) pour le playbook spécifique aux actions A.

> **Faites tourner les deux sur votre portefeuille.** Le tableau de bord [/indicators](/indicators) affiche RSI et KDJ côte à côte pour chaque ligne, met en évidence l'accord / désaccord d'un coup d'œil et signale la divergence multi-oscillateurs comme un signal distinct.

## Pour aller plus loin

- [Investopedia sur le RSI](https://www.investopedia.com/terms/r/rsi.asp) et l'[oscillateur stochastique (famille KDJ)](https://www.investopedia.com/terms/s/stochasticoscillator.asp) — traitements de référence.
- [J. Welles Wilder Jr., *New Concepts in Technical Trading Systems*](https://www.amazon.com/dp/0894590278) — la référence originale du développeur du RSI.

## FAQ

**Lequel commencer pour un débutant ?**
Le RSI. L'échelle 0–100 est intuitive, la ligne unique plus facile à lire, et les seuils 50 / 30 / 70 sont largement connus. Le KDJ ajoute de la puissance mais aussi de la complexité ; commencez par le RSI, ajoutez le KDJ une fois les bases des oscillateurs de momentum intégrées.

**Le KDJ et le stochastique sont-ils la même chose ?**
Le KDJ est une variante du stochastique. Le stochastique standard ne trace que K et D ; le KDJ ajoute la ligne J (`J = 3K − 2D`). Les maths de K et D sont identiques entre les deux. La ligne J est le seul ajout, et c'est l'élément le plus spécifique aux actions A.

**Peut-on les utiliser sur des horizons intraday ?**
Vous le pouvez, mais réduisez vos attentes. Sur des graphiques en 5 ou 15 minutes, les deux oscillateurs génèrent des dizaines de signaux par séance, la plupart du bruit. Utilisez des paramètres adaptés à l'intraday (RSI 8 ou 9 périodes, KDJ (5, 3, 3)) et exigez une confirmation multi-signaux. La plupart du travail intraday retail surutilise ces oscillateurs par rapport à leur edge réel.

**Qu'est-ce que le dépassement de la ligne J du KDJ, et est-ce la même chose que RSI > 70 ?**
La ligne J est construite comme `3K − 2D`, ce qui veut dire qu'elle peut dépasser la plage 0–100 qui borne K et D. Une lecture J > 100 ou J < 0 est un « extrême profond » — plus extrême que ce que K, D ou le RSI montreraient. Elle précède souvent le retournement effectif de 1–3 barres. Le RSI n'a pas cette propriété de dépassement ; il est borné 0–100 par construction. Le dépassement J est l'un des edges du KDJ.

**Pourquoi mon graphique montre-t-il des valeurs RSI / KDJ différentes d'une autre plateforme ?**
RSI : le lissage de Wilder vs un lissage EMA standard produit de petites différences. KDJ : des valeurs de départ différentes pour le lissage récursif de K et D produisent des lectures différentes en début de période (l'écart s'estompe après ~30 barres). Pour la cohérence, les tableaux de bord PickSkill utilisent le lissage de Wilder pour le RSI et une pondération 2/3 prev + 1/3 current pour le KDJ — les conventions utilisées dans les backtests académiques et dans les plateformes retail les plus largement déployées.
