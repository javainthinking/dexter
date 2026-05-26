---
title: Qu'est-ce que le support et la résistance ? Les niveaux qui comptent vraiment
description: >-
  Le support et la résistance sont des niveaux de prix où les renversements se
  concentrent. Comment les identifier objectivement, pourquoi les chiffres ronds
  et les plus hauts antérieurs fonctionnent, et quatre pièges.
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
  - Support
  - Résistance
  - Analyse technique
  - Price action
  - Niveaux
heroImage: /blog/what-is-support-resistance/hero.png
heroAlt: >-
  Infographie éditoriale — le prix oscille entre une bande horizontale de
  résistance et une bande horizontale de support, avec les pivots confirmés à
  chaque niveau.
---

**Le support est un niveau de prix où la pression acheteuse a, à plusieurs reprises, absorbé l'offre — empêchant une baisse supplémentaire. La résistance est le miroir : un niveau de prix où l'offre a, à plusieurs reprises, plafonné les avancées.** Ce ne sont pas des lignes tracées à l'intuition ; ce sont des clusters statistiques de pivots de renversement qui, une fois identifiés, deviennent des points de repère sur lesquels le marché lui-même agit. La raison pour laquelle ils « fonctionnent » est réflexive — suffisamment de traders surveillent le même niveau pour que le niveau devienne auto-renforçant.

### Points clés

- **Un niveau devient support / résistance quand au moins 2–3 pivots de renversement confirmés se concentrent dans une bande étroite** — pas quand une seule barre rebondit par hasard.
- **Les niveaux les plus forts combinent plusieurs sources** : un plus haut de swing antérieur *plus* un chiffre rond *plus* une moyenne mobile majeure est sensiblement plus fort que n'importe lequel pris seul.
- **Les niveaux se dégradent à chaque test.** Chaque test supplémentaire d'un niveau puise dans la capacité d'absorption qui s'y trouve ; au troisième ou quatrième test, le niveau est généralement plus faible, pas plus fort.
- **Un support cassé devient résistance (et vice versa)** — le classique « basculement de polarité ». C'est l'observation isolée la plus fiable de l'analyse technique fondée sur les niveaux.
- **Affichés sur le tableau de bord support / résistance de [/indicators](/indicators)** pour chaque ligne, avec l'historique des niveaux et le compteur de tests récents explicitement remontés.

## Comment identifier objectivement support et résistance ?

L'approche désinvolte est « tracer une ligne horizontale là où il semble que le cours a rebondi ». Cela marche pour l'œil mais ne se généralise pas. L'approche objective utilise des pivots de swing confirmés regroupés dans une bande :

1. **Trouver les pivots de swing.** Un plus haut de swing est une barre dont le haut dépasse celui des N barres de part et d'autre ; un plus bas de swing est le miroir. Les valeurs N usuelles sont 3, 5 ou 7 sur barres quotidiennes — le choix arbitre la sensibilité (N plus petit = plus de pivots = plus de bruit) contre le signal (N plus grand = moins de pivots = pivots plus forts).
2. **Regrouper les pivots dans une bande.** Les pivots qui tombent dans une bande de prix étroite (par exemple ±0,5 % sur une action à 100 $, ou ±1 ATR pour un dimensionnement adaptatif) forment un niveau candidat.
3. **Exiger plusieurs confirmations.** Un niveau candidat a besoin d'au moins 2–3 pivots dans la bande pour être considéré comme un vrai niveau. Un seul rebond n'est qu'un seul rebond.
4. **Noter par ancienneté et fréquence.** Les pivots récents pèsent davantage que ceux d'il y a un an ; les bandes contenant plus de pivots pèsent davantage que celles au minimum.

Le tableau de bord *support / résistance* de PickSkill applique exactement cet algorithme sur chaque ligne, notant les niveaux candidats par récence × nombre et n'affichant que les N plus forts par ticker. Le résultat est un petit ensemble de niveaux à forte conviction plutôt qu'un graphique encombré de chaque rebond mineur.

## Quelles sources font qu'un niveau est « fort » ?

Les niveaux les plus forts ne sont pas une source unique — ce sont des confluences :

| Source | Ce qu'elle apporte |
|---|---|
| **Plus haut / plus bas de swing antérieur** | Preuve directe que le marché s'y est déjà retourné |
| **Chiffre rond** (100 $, 50 $, 10 $) | Magnétisme psychologique des chiffres ronds ; beaucoup d'ordres limite s'y concentrent |
| **Moyenne mobile majeure** (SMA 50 jours, 200 jours) | Déclencheurs systématiques de risk-on / risk-off qui s'en servent |
| **Niveaux de retracement Fibonacci** | Moins objectivement fondés mais largement surveillés, donc partiellement auto-réalisateurs |
| **VWAP / cours moyen pondéré par les volumes** | Cours de référence contre lequel les institutionnels traitent |
| **Bords d'un range de consolidation antérieur** | Frontières d'un range où beaucoup de participants ont traité |

Un niveau combinant trois ou quatre sources (par exemple un plus haut de swing antérieur à 100,40 $ qui est aussi la SMA 200 jours à 100,55 $ avec un chiffre rond à 100 $) est bien plus fort qu'un niveau à source unique. Le tableau de bord PickSkill marque les niveaux de confluence — ceux soutenus par plusieurs sources indépendantes — d'un repère distinct.

## Pourquoi les niveaux fonctionnent-ils ?

Trois mécanismes qui se renforcent :

1. **Mémoire du carnet d'ordres.** Les ordres limite postés aux chiffres ronds et aux points de renversement antérieurs s'accumulent avec le temps. Quand le cours atteint le niveau, ces ordres absorbent le flux.
2. **Ancrage comportemental.** Les traders qui ont acheté à un plus bas antérieur ancrent leur douleur à ce niveau ; si le cours retest le niveau par-dessous, les acheteurs antérieurs qui sortent à l'équilibre deviennent un mur de vendeurs. C'est « le support cassé devient résistance ».
3. **Coordination auto-réalisatrice.** Parce que la plupart des participants utilisent des outils similaires pour identifier les mêmes niveaux, ils tradent contre les niveaux de façon similaire. La coordination produit de vrais rebonds au niveau, ce qui valide l'usage des niveaux, ce qui renforce la boucle de coordination.

Aucun de ces mécanismes n'est magique. Ils expliquent pourquoi les niveaux sont des signaux réels tout en expliquant pourquoi les niveaux finissent par céder — quand les conditions fondamentales changent suffisamment pour que le carnet d'ordres et les ancrages comportementaux ne dominent plus, les niveaux lâchent.

## Que signifie la cassure d'un niveau ?

Une « cassure » survient quand le cours clôture significativement à travers un niveau sur volume — pas juste une mèche intra-séance. Deux comportements dominent l'après-cassure :

- **Continuation.** Le cours traverse et poursuit. Le niveau était le dernier obstacle significatif ; une fois franchi, le prochain mouvement vise le *prochain* niveau au-dessus (résistance cassée) ou en dessous (support cassé).
- **Basculement de polarité (le support cassé devient résistance).** Le cours casse sous le support, chute, puis remonte pour retester le niveau cassé — qui agit désormais comme résistance. C'est le motif isolé le plus fiable de l'analyse fondée sur les niveaux. Il fonctionne parce que la composition du carnet d'ordres a basculé : ceux qui ont acheté au niveau sont en perte et veulent sortir à l'équilibre ; ceux qui ont shorté la cassure veulent en remettre à des prix plus hauts. Les deux forces vendent dans le retest.

Les basculements de polarité ont une fiabilité plus élevée que la cassure initiale elle-même, c'est pourquoi « attendre le retest » est l'un des rares conseils de price action à recevoir un soutien empirique constant à travers les marchés.

## Quatre pièges dans l'usage de support et résistance

1. **Tracer des lignes, pas des zones.** Le support n'est pas un prix — c'est une bande. Traiter un prix unique (par exemple 100,00 $) comme un niveau dur invite la chasse aux stops et les fausses cassures. Utilisez une bande de ±0,5–1,0 % (ou ±0,5 ATR pour les titres volatils).
2. **Compter trop de niveaux.** Un graphique avec 12 lignes horizontales ne diffère pas d'un graphique sans lignes — aucune ne fonctionne comme point de référence. Limitez-vous à 2–4 niveaux forts par horizon ; si votre graphique en exige plus, les niveaux sont trop faibles.
3. **Ignorer la dégradation des niveaux.** Chaque test d'un niveau consomme une partie de sa capacité d'absorption. Au troisième ou quatrième test, la probabilité d'une cassure nette monte fortement — paradoxalement, plus un niveau est « testé », plus il devient fragile en fin de course. Traitez les tests répétés comme un avertissement, pas une confirmation.
4. **Trader le niveau comme un déclencheur binaire.** « Acheter au support » sans confirmation (volume, [RSI](/blog/what-is-rsi) survendu, motif de chandelier au niveau) revient à rattraper des couteaux qui tombent environ une fois sur deux. Attendez au moins un signal de confirmation au niveau — ce filtre seul réduit sensiblement le taux de faux positifs.

## Comportement des niveaux sur les actions A

Les mécanismes sont universels ; la microstructure ajuste l'application :

- **Les séances à limite de prix créent des niveaux artificiels.** Une clôture limit-up au prix limite n'est pas un vrai « plus haut » — c'est un plafond arbitraire imposé par la bourse. Traiter les clôtures limit-up comme niveaux de résistance surestime le cas. Le tableau de bord PickSkill exclut les pivots de jours limites de la construction des niveaux.
- **La psychologie des chiffres ronds est plus forte.** La communauté retail des actions A est plus attentive aux niveaux ronds que le flux institutionnel américain. 10 ¥, 100 ¥ et les niveaux clés d'indices (par exemple 3000 sur le Shanghai Composite) agissent comme des ancres psychologiques plus fortes que des niveaux américains équivalents.
- **La confirmation par le volume compte davantage.** Les volumes sur actions A sont fortement bimodaux — jours calmes vs jours chauds. Les cassures de niveau sur volume de jour calme échouent souvent ; les cassures sur volume de jour chaud (3×+ la moyenne 20 jours) ont tendance à confirmer.

Voir [Meilleurs indicateurs pour les actions A](/blog/best-indicators-for-a-shares) pour la vue marché par marché plus large.

> **Visualisez-le sur vos positions.** Le tableau de bord support / résistance de [/indicators](/indicators) affiche les principaux niveaux pour chaque position, notés par récence et confluence, avec l'historique des tests récents visible.

## Comment support / résistance s'inscrit dans un workflow multi-signaux

Les niveaux sont la *carte* ; les oscillateurs et les tendances sont le *terrain*. La combinaison :

| Couche | Outil | Question à laquelle elle répond |
|---|---|---|
| **Carte** | Niveaux de support / résistance | Où sont les points de prix significatifs ? |
| **Tendance** | MA 50/200 + [ADX](/blog/what-is-adx) | Dans quelle direction le marché penche-t-il ? |
| **Momentum** | [MACD](/blog/what-is-macd), [RSI](/blog/what-is-rsi) | Le mouvement au niveau est-il soutenu par le momentum ? |
| **Volatilité** | [Bandes de Bollinger](/blog/what-is-bollinger-bands) | Le mouvement au niveau est-il proportionné ou extrême ? |

Un setup haussier avec les quatre alignés (cours au support de confluence, dans une tendance haussière confirmée, avec RSI survendu et toucher de la bande inférieure de Bollinger) est sensiblement à plus fort edge que n'importe quelle couche prise seule. Sautez des couches et le niveau seul est plus proche d'un pile ou face.

## Pour aller plus loin

- [Investopedia sur support et résistance](https://www.investopedia.com/trading/support-and-resistance-basics/) — référence complète couvrant tous les motifs standard.
- [Al Brooks, *Price Action Trading*](https://www.brookspriceaction.com/) — traitement par un praticien de la façon dont les niveaux interagissent avec le contexte barre à barre.

## FAQ

**Comment savoir quel niveau de support est le plus important ?**
Notez selon trois facteurs : (1) la récence — à quel point le niveau a été récemment respecté, (2) le nombre de tests — combien de pivots confirmés se groupent au niveau, et (3) la confluence — combien de sources indépendantes (swing antérieur, chiffre rond, moyenne mobile, VWAP) s'alignent au niveau. Un niveau avec les trois (récent, 3+ tests, confluence multi-sources) est le plus à forte conviction ; un niveau avec un seul est bien plus faible. Le tableau de bord PickSkill note les niveaux selon ces facteurs et n'affiche que les N premiers par ticker.

**Un chiffre rond est-il toujours un support / une résistance ?**
Seul, non — les chiffres ronds ne sont que faiblement auto-réalisateurs. Ils deviennent des supports / résistances significatifs quand ils coïncident avec un pivot structurel (un plus haut ou plus bas antérieur formé près du chiffre rond) ou une moyenne mobile majeure. Un chiffre rond flottant dans l'espace sans pivots à proximité n'est qu'un chiffre.

**Quelle est la différence entre support / résistance et une moyenne mobile ?**
Une moyenne mobile est une ligne de référence continue qui se met à jour à chaque barre ; les niveaux de support / résistance sont des lignes horizontales statiques issues de pivots passés. Les deux sont des points de repère, mais répondent à des questions différentes. Les moyennes mobiles vous disent « quel est le prix typique récent ? » — support / résistance vous dit « où le marché s'est-il historiquement retourné ? ». Les signaux les plus forts surviennent quand les deux s'alignent au même prix.

**Pourquoi un support cassé devient-il résistance ?**
Trois forces poussent dans la même direction. (1) Les traders qui ont acheté au niveau sont désormais en moins-value ; beaucoup vendront à l'équilibre lors du retest, offrant de l'offre. (2) Les traders qui ont shorté la cassure guettent un rallye pour ajouter à leur position. (3) Les systèmes algorithmiques sont programmés pour rentrer en échelle dans le mouvement quand un niveau bascule. Les trois sont vendeurs lors du retest, ce qui explique pourquoi le retest tend à échouer et pourquoi le basculement de polarité fonctionne.

**Puis-je trader support / résistance sur des graphiques intraday ?**
Vous le pouvez, mais l'identification des niveaux devient plus bruitée à mesure que la taille des barres rétrécit. Sur des graphiques en 5 minutes, chaque micro-pivot ressemble à un niveau ; presque aucun n'a la confluence requise pour être réel. Si vous tradez en intraday, utilisez les niveaux d'horizon plus long (quotidien, hebdomadaire) comme référence et les barres intraday uniquement pour timer les entrées. Les tableaux de bord PickSkill n'affichent actuellement que les niveaux en barres quotidiennes — ce sont les niveaux que les institutionnels tradent effectivement.
