---
title: >-
  Qu'est-ce que l'analyse du volume ? La couche de confirmation que le retail
  saute
description: >-
  Le volume mesure la participation derrière chaque mouvement de cours. Pourquoi
  il confirme les cassures, les 4 motifs de volume qui comptent, et comment lire
  VROC et volume profile.
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
  - Volume
  - Analyse technique
  - Indicateurs
  - Participation
heroImage: /blog/what-is-volume-analysis/hero.png
heroAlt: >-
  Infographie éditoriale — histogramme de volume sur 25 barres avec la moyenne
  20 jours en pointillés et un pic de 2,5× RVOL mis en évidence en émeraude.
---

**Le volume est le nombre d'actions (ou de contrats) traités sur une barre donnée — et c'est la donnée la plus sous-utilisée de l'analyse technique retail.** Le cours vous dit où le marché est allé ; le volume vous dit combien de personnes y sont allées avec lui. Un mouvement à fort volume reflète une large conviction ; un mouvement à faible volume reflète une poignée de participants. Le graphique de cours seul peut être unanime sur la direction et ne vouloir dire que peu de chose si le volume en dessous indique que personne n'a montré son visage.

### Points clés

- **Trois motifs dominent l'analyse** : volume de cassure (un fort volume confirme une cassure), volume d'épuisement (un volume extrême en fin de mouvement signale un climax), et volume d'assèchement (le volume se contracte avant un grand mouvement directionnel).
- **La référence de base est la moyenne du volume sur 20 jours.** Une barre à 2× la moyenne 20 jours est significativement lourde ; à 3×, exceptionnelle. En dessous de 0,5× la moyenne, c'est « pas de participation » et signale une conviction proche de zéro.
- **Le volume confirme ; il ne guide pas.** Un mouvement de cours soutenu par le volume est plus susceptible de continuer. L'absence de volume est un drapeau jaune, pas un signal de vente.
- **Angle mort du volume** : il ne distingue pas les acheteurs des vendeurs. Utilisez les [indicateurs de flux de capitaux](/blog/what-is-capital-flow) (OBV, MFI, CMF) quand vous avez besoin d'un volume pondéré par la direction.
- **Disponible sur chaque graphique PickSkill** — le tableau de bord volume [/indicators](/indicators) affiche VROC, volume relatif et la classification de participation sur 5 jours pour chaque ligne.

## Qu'est-ce qu'un volume « normal » — et comment le mesurer ?

Le volume est toujours relatif. La même barre à 5M d'actions est un non-événement sur Apple et un événement extrême sur une micro-cap de 300M $ de capitalisation. Deux outils de normalisation font l'essentiel du travail :

### Volume relatif (RVOL)

```
RVOL = Volume du jour / Volume moyen 20 jours
```

Un simple ratio. RVOL = 1,0 est exactement la moyenne ; 2,0 est le double ; 0,5 la moitié. La fenêtre de 20 jours lisse les anomalies sur une seule barre tout en restant réactive aux changements de régime récents.

| RVOL | Interprétation |
|---|---|
| **< 0,5** | Calme — aucune participation, les signaux à ce volume sont surtout du bruit |
| **0,5–1,0** | En dessous de la moyenne — procéder avec prudence normale |
| **1,0–1,5** | Normal à actif — conditions standard |
| **1,5–2,5** | Lourd — participation significative ; les cassures ici tendent à confirmer |
| **> 2,5** | Exceptionnel — flux institutionnel, événement d'actualité, ou capitulation en cours |

Les tableaux de bord PickSkill affichent le RVOL sur chaque graphique pour voir d'un coup d'œil si le mouvement du jour se fait sur une vraie participation ou juste sur de la dérive de cours.

### Volume Rate of Change (VROC)

La variation en pourcentage du volume par rapport à N barres en arrière :

```
VROC(N) = ((Volume[t] − Volume[t-N]) / Volume[t-N]) × 100
```

N par défaut = 14. Le VROC mesure l'*accélération* du volume plutôt que son niveau actuel — utile pour détecter les changements de régime de volume (assèchement avant une cassure, envolée vers un sommet) que le ratio RVOL ne capture qu'après coup.

## Quels sont les quatre motifs de volume qui comptent ?

### 1. Volume de cassure

Une cassure (cours franchissant une résistance ou un support) sur fort volume — RVOL > 1,5, idéalement > 2,0 — a une probabilité de confirmation sensiblement plus élevée qu'une cassure sur faible volume. Le volume vous dit que la cassure reflète une large participation, pas un seul acheteur ayant accidentellement levé une offre.

La version la plus simple de cette règle bat presque tous les autres filtres techniques : *n'agir que sur les cassures qui se produisent avec au moins 1,5× le volume moyen*. Cette seule vérification élimine environ la moitié des fausses cassures.

### 2. Volume d'épuisement (climax)

Une barre RVOL 3–5× à la *fin* d'un mouvement de plusieurs semaines, généralement accompagnée d'une barre d'amplitude inhabituellement large (chandelier de climax), signale souvent un épuisement — la capacité acheteuse ou vendeuse a été consommée. Deux formes classiques :

- **Climax acheteur** : au sommet d'une tendance haussière, une barre parabolique imprime sur volume extrême ; le mouvement paraît euphorique. Souvent le plus haut *exact*, parfois le plus haut pour des mois.
- **Climax vendeur (capitulation)** : au creux d'une tendance baissière, une barre en gap-down imprime sur volume extrême ; le sentiment est uniformément négatif. Souvent la plus basse clôture avant un rallye de plusieurs semaines.

Les climax sont plus faciles à identifier après coup qu'en temps réel. Le motif structurel (volume extrême + barre extrême + en fin de long mouvement directionnel) est un déclencheur de watchlist, pas un signal de renversement autonome. Attendez une confirmation — une barre de renversement à la séance suivante, ou un croisement de momentum sur [MACD](/blog/what-is-macd) — avant d'agir.

### 3. Volume d'assèchement (le squeeze)

Le volume se contracte sous des niveaux de moyenne pendant plusieurs semaines, souvent associé à une consolidation du cours dans un range étroit. C'est le motif d'« enroulement » qui précède fréquemment les grands mouvements directionnels. L'intuition : la participation s'est asséchée parce que personne ne peut décider de la prochaine direction. Quand un catalyseur arrive, le volume revient à l'échelle et le cours bouge avec lui.

Le volume d'assèchement va naturellement avec le [squeeze des bandes de Bollinger](/blog/what-is-bollinger-bands) — les deux mesurent le même phénomène (compression de volatilité / de participation) sous des angles différents. Quand les deux s'alignent, la probabilité d'un mouvement directionnel imminent est sensiblement plus élevée.

### 4. Divergence de volume

Le cours fait un nouveau plus haut ; le volume sur la barre du nouveau plus haut est *inférieur* à celui de la barre du précédent plus haut. C'est une divergence baissière de volume — le nouveau plus haut est fait par moins de participants, ce qui précède historiquement un échec. Le motif miroir (plus bas plus bas sur volume déclinant = épuisement des vendeurs) est une divergence haussière de volume.

La divergence de volume est plus fiable que la divergence d'oscillateur aux tournants majeurs parce qu'elle mesure directement la participation plutôt que la dérivée seconde du cours. Voir [Qu'est-ce qu'une divergence ?](/blog/what-is-divergence) pour le cadre plus large.

## Qu'est-ce que le volume profile (et est-il utile pour le retail) ?

Le volume profile est une autre façon de tracer le volume — au lieu de montrer le volume par *barre de temps*, il montre le volume par *niveau de prix*. Le résultat est un histogramme horizontal sur le côté droit du graphique : des barres hautes aux niveaux où l'action a passé beaucoup de volume cumulé, des barres courtes là où elle en a peu.

| Élément | Sens |
|---|---|
| **Point of Control (POC)** | Le niveau de prix avec le plus de volume cumulé sur la fenêtre |
| **Value Area (VA)** | La plage de prix contenant 70 % du volume cumulé total |
| **Low Volume Nodes (LVN)** | Niveaux de prix avec peu de volume cumulé — les prix tendent à les traverser rapidement |
| **High Volume Nodes (HVN)** | Niveaux de prix avec beaucoup de volume cumulé — les prix tendent à y faire pause ou s'y retourner |

Le POC et les HVN fonctionnent comme une forme raffinée de [support / résistance](/blog/what-is-support-resistance) — des niveaux où le marché a historiquement transigé en taille. Le volume profile est le plus utile sur les horizons intraday pour le trading actif et sur les graphiques de plus long terme (année en cours, 5 ans) pour comprendre où sont réellement les niveaux majeurs.

Pour la plupart des lecteurs retail, le volume en barres quotidiennes + la pile MA standard + les niveaux standard de support / résistance livrent 80 % de la valeur. Le volume profile est une montée en gamme pour les traders actifs sérieux ; les bases couvrent l'essentiel.

## Quatre pièges classiques du retail

1. **Ignorer le volume entièrement.** Le piège le plus courant. Une cassure qui « a fière allure » sur le graphique de cours mais se produit sur 0,6× le volume moyen est la moitié du signal que vous croyez. Superposez toujours le volume ; traitez les signaux à faible volume avec scepticisme par défaut.
2. **Pondérer également toutes les barres à fort volume.** Une barre à fort volume au *début* d'un mouvement (cassure) est haussière ; une barre à fort volume à la *fin* d'un mouvement (climax) est baissière. Même volume, implications opposées. Le contexte — où se situe le volume dans la tendance — est la moitié de l'information.
3. **Oublier de quelles séances vient le volume.** Le volume sur résultats, le volume de jour de gap et le volume de jour limite ne sont pas le même volume que celui d'une séance normale. Une barre à 4× le RVOL un jour de résultats est essentiellement du bruit déjà intégré ; une barre à 4× le RVOL un jour sans événement est une vraie conviction. Les tableaux de bord PickSkill marquent explicitement les barres de jour d'événement comme outliers.
4. **Confondre volume et flux de capitaux.** Le volume est neutre en direction — une journée baissière à 3× RVOL est un volume *baissier*, pas une « forte participation ». Le volume amplifie la direction de la barre sur laquelle il se trouve. Pour obtenir un flux directionnel, utilisez les [indicateurs de flux de capitaux](/blog/what-is-capital-flow) (OBV, MFI, CMF).

## Comportement différent du volume sur les actions A

Le volume sur actions A a des caractéristiques structurelles qui modifient l'interprétation :

- **Le règlement T+1** restreint les allers-retours dans la journée. Le volume quotidien penche vers les achats initiaux à détenir pendant la nuit — cela rend les signaux de volume sur actions A plus directionnels que sur actions américaines, mais aussi plus sujets aux extrêmes de mimétisme d'une journée.
- **Les jours limit-up / limit-down tronquent le volume.** Quand un titre se bloque au limit-up, le carnet d'ordres acheteur peut être énorme mais le volume exécuté faible. Les outils de volume standard sous-estiment la vraie demande des jours limites. Les tableaux de bord PickSkill A-share marquent les jours limites comme outliers dans le calcul du RVOL.
- **Cascades d'appels de marge.** La participation retail des actions A inclut un financement sur marge significatif. Les cascades de liquidations forcées produisent des pics de volume explosifs qui ressemblent à des climax mais sont mécaniques plutôt que discrétionnaires — le volume vient de vendeurs forcés, pas de conviction. Associez les signaux de volume aux données de solde de marge (公开发布) lorsqu'elles sont disponibles.

Voir [Meilleurs indicateurs pour les actions A](/blog/best-indicators-for-a-shares) pour le playbook spécifique au marché plus large.

> **Suivez le volume sur vos positions.** Le tableau de bord [/indicators](/indicators) affiche RVOL, VROC et la classification de participation sur 5 jours sur chaque graphique — pour voir d'un coup d'œil quels mouvements ont une vraie conviction derrière eux.

## Comment le volume s'inscrit dans un workflow multi-signaux

Le volume est le *modificateur de participation* — il relève ou abaisse la conviction sur les signaux de toutes les autres couches :

| Type de signal | Ajouter le volume pour demander |
|---|---|
| Cassure de résistance | La cassure est-elle sur fort volume ? (>1,5× RVOL) |
| Croisement doré MACD | Le croisement est-il soutenu par une hausse de participation ? |
| Continuation de tendance | Chaque poussée vers un nouveau plus haut se fait-elle sur un volume plus élevé que la précédente ? |
| Renversement au sommet | Y a-t-il une combinaison climax de volume + barre de renversement ? |

La règle universelle la plus simple : *si un signal se produit sur un volume inférieur à la moyenne, traitez-le comme à demi-conviction*. Cette seule discipline filtre une part substantielle des faux positifs dans n'importe quel workflow technique.

## Pour aller plus loin

- [Investopedia sur l'analyse du volume](https://www.investopedia.com/articles/technical/02/010702.asp) — référence complète couvrant RVOL, VROC et les motifs standard.
- [Anna Coulling, *A Complete Guide to Volume Price Analysis*](https://www.amazon.com/dp/1491249390) — traitement par une praticienne de l'action de prix confirmée par le volume.

## FAQ

**Qu'est-ce qui compte comme volume « lourd » ?**
Lourd est relatif — mesuré contre la moyenne 20 jours du titre lui-même. Une règle de pouce utile : un RVOL entre 1,5 et 2,5 est significativement lourd ; au-dessus de 2,5 c'est exceptionnel et presque toujours lié à un catalyseur spécifique (résultats, actualités, cassure technique). Les tableaux de bord PickSkill affichent le RVOL avec ces seuils mis en évidence pour rendre les barres lourdes visibles d'un coup d'œil.

**Faut-il utiliser le volume sur des graphiques intraday ?**
Oui, avec des réserves. Le volume intraday a une forte saisonnalité (lourd à l'ouverture et à la clôture, léger à la mi-journée) ; comparez le volume intraday à la moyenne à la même heure sur les 20 dernières séances, pas seulement à la barre précédente. Sinon, vous prendrez chaque pic de fin d'après-midi pour un vrai signal.

**Pourquoi le volume diffère-t-il selon les plateformes ?**
Trois causes : (1) certaines plateformes incluent le volume hors heures ; PickSkill n'utilise que la séance régulière pour la cohérence, (2) certaines plateformes comptent les odd lots ; la plupart non, et (3) pour les actions américaines cotées sur plusieurs bourses, le volume affiché ne couvre parfois qu'une seule place. Pour la cohérence, les tableaux de bord PickSkill utilisent le volume consolidé toutes places confondues pour les valeurs américaines et le volume rapporté par la bourse pour les valeurs HK et A.

**Puis-je utiliser le volume pour prédire la direction d'une cassure ?**
Non — le volume confirme la direction une fois choisie ; il ne prédit pas dans quel sens la cassure ira. Un volume d'assèchement pendant une consolidation vous dit qu'un mouvement directionnel est plus probable ; il ne vous dit pas haussier ou baissier. Pour l'anticipation directionnelle, utilisez les motifs d'accumulation ([flux de capitaux](/blog/what-is-capital-flow) en tendance haussière pendant que le cours oscille), pas le volume brut.

**Qu'est-ce que le VWAP (volume-weighted average price) et est-ce la même chose que le volume ?**
Le VWAP est un prix dérivé calculé en pondérant le prix de chaque barre par son volume. C'est un prix de référence — très utilisé par les desks d'exécution institutionnels — mais ce n'est pas un *indicateur* de volume. Le VWAP vous donne le prix moyen pondéré par les volumes ; le volume brut vous donne le niveau de participation. Questions différentes ; utilisez les deux, ne les confondez pas.
