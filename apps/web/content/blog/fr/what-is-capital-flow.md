---
title: Qu'est-ce que le flux de capitaux ? Les indicateurs de money flow expliqués
description: >-
  Le flux de capitaux mesure si l'argent entre dans une action ou en sort sur
  une barre donnée — via du volume pondéré par la direction. MFI, CMF, OBV —
  formules, usages, pièges.
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
  - Flux de capitaux
  - Money flow
  - Volume
  - Analyse technique
  - Indicateurs
heroImage: /blog/what-is-capital-flow/hero.png
heroAlt: >-
  Infographie éditoriale — barres de volume colorées par direction avec une
  ligne OBV cumulative en hausse en dessous, illustrant accumulation sous un
  prix latéral.
---

**Les indicateurs de flux de capitaux combinent la direction du cours et le volume pour estimer si l'argent entre dans une action (accumulation) ou en sort (distribution).** Le volume brut vous dit *combien* s'est traité ; les outils de flux de capitaux vous disent *de quel côté* était le volume. Bien utilisés, ils captent les premiers stades de l'accumulation avant que le cours n'ait bougé assez pour que les outils de tendance ne réagissent. Utilisés sans précaution, ils sont faciles à sur-interpréter — le flux est un signal parmi plusieurs, pas un verdict.

### Points clés

- **Trois indicateurs dominent** : MFI (Money Flow Index), CMF (Chaikin Money Flow) et OBV (On-Balance Volume). Chacun pondère le volume par la direction du cours d'une façon légèrement différente.
- **Idée centrale** : une barre verte à fort volume = pression acheteuse nette ; une barre rouge à fort volume = vente nette. Sommez sur les barres pour obtenir une série cumulative de pression.
- **Angle mort du flux de capitaux** : il ne peut pas distinguer un gros flux institutionnel d'un flux retail agrégé sur la même barre de volume. Les marchés modernes brouillent davantage la distinction.
- **L'usage à plus forte valeur est la divergence** : quand le cours fait un nouveau plus haut mais que le flux non (ou inversement). Voir [Qu'est-ce qu'une divergence ?](/blog/what-is-divergence).
- **Affichés sur chaque ligne** — le tableau de bord flux de PickSkill [/indicators](/indicators) remonte les lectures MFI et CMF plus une classification de tendance de flux sur 5 jours pour voir si l'accumulation se construit ou s'estompe.

## Comment calcule-t-on le flux de capitaux ?

Trois formulations couramment utilisées, chacune posant une hypothèse légèrement différente sur la pondération du volume par l'action de prix.

### Money Flow Index (MFI)

Un RSI pondéré par le volume. Plage 0–100 ; suracheté >80, survendu <20.

```
Typical Price (TP)   = (High + Low + Close) / 3
Raw Money Flow (RMF) = TP × Volume
Positive Money Flow  = Somme des RMF sur N barres où TP a monté
Negative Money Flow  = Somme des RMF sur N barres où TP a baissé
Money Flow Ratio     = Positive MF / Negative MF
MFI                  = 100 − [100 / (1 + Money Flow Ratio)]
```

N par défaut = 14. Le MFI est l'indicateur de flux le plus populaire parce que l'échelle 0–100 est familière (cela se lit comme le RSI) et que les seuils suracheté / survendu s'interprètent intuitivement.

### Chaikin Money Flow (CMF)

Pondère le volume de chaque barre par la position de la clôture dans le range de la barre. Les barres clôturant près du haut reçoivent une pondération positive ; celles clôturant près du bas, une pondération négative.

```
Money Flow Multiplier (MFM) = ((Close − Low) − (High − Close)) / (High − Low)
Money Flow Volume (MFV)     = MFM × Volume
CMF                         = Somme(MFV, N) / Somme(Volume, N)
```

N par défaut = 20. Le CMF varie de −1 à +1 ; des valeurs au-dessus de +0,05 indiquent une pression acheteuse ; en dessous de −0,05, une pression vendeuse. La force du CMF est sa précision barre par barre (le flux de chaque barre est déterminé entièrement par sa position de clôture dans son range) ; sa faiblesse est sa sensibilité aux barres ponctuelles à amplitude large.

### On-Balance Volume (OBV)

Le plus simple des trois, et sans doute le plus robuste :

```
Si Close[t] > Close[t-1]: OBV[t] = OBV[t-1] + Volume[t]
Si Close[t] < Close[t-1]: OBV[t] = OBV[t-1] − Volume[t]
Sinon:                    OBV[t] = OBV[t-1]
```

L'OBV est une série cumulative — elle n'a pas de sens absolu ; ce qui compte est sa direction par rapport à la direction du cours. Quand l'OBV monte alors que le cours oscille, l'accumulation se construit en dessous ; quand le cours fait de nouveaux plus hauts mais que l'OBV non, le rallye se produit sur une participation qui faiblit.

Les trois indicateurs s'accordent la plupart du temps. Quand ils divergent, l'OBV est en général la lecture la plus propre pour savoir si le volume net soutient le mouvement du cours.

## Que vous dit vraiment le flux de capitaux ?

Trois cas d'usage réels, par ordre d'edge :

1. **Détecter l'accumulation avant que le cours ne bouge.** Les titres en fin de tendance baissière montrent souvent des indicateurs de flux qui retournent à la hausse avant que le cours n'ait confirmé un creux. Le motif : l'OBV touche un creux et amorce une remontée alors que le cours grappille latéralement. C'est l'un des setups les plus propres pour « acheter avant la cassure » — même si cela met souvent des semaines à se concrétiser, et beaucoup de candidats ne produisent pas de confirmation par le cours.
2. **Confirmer une cassure.** Une cassure de cours sur flux faible (CMF proche de zéro, pas de nouveau plus haut OBV) est plus susceptible d'échouer qu'une cassure sur flux fort (CMF s'envolant en positif, OBV perçant à un nouveau plus haut). Traitez le flux comme une confirmation : requis pour les entrées à forte conviction, optionnel pour les entrées opportunistes.
3. **Identifier une divergence de flux.** Le cours fait un plus haut plus haut ; le flux fait un plus haut plus bas. C'est une divergence baissière spécifiquement sur le flux de capitaux — différente d'une divergence MACD ou RSI, et parfois plus précoce. La divergence haussière cachée de flux (plus bas plus haut du cours, plus bas plus bas du flux dans une tendance haussière) attrape la reprise de tendance que les outils purement cours ratent.

Le cas d'usage qui *ne* fonctionne *pas* aussi bien qu'on le croit : prédire en temps réel les sommets et creux absolus. Les signaux de flux sont plus bruités aux extrêmes qu'aux transitions ; la lecture la plus propre est à la transition (tendance baissière → consolidation) plutôt qu'à l'extrême (pic d'une tendance haussière).

## Que rate le flux ?

Trois angles morts structurels à connaître avant de trop se fier au signal :

1. **Ne distingue pas le flux institutionnel du flux retail.** Une hausse de volume de 10 % peut être un acheteur institutionnel qui accumule ou 10 000 trades retail. L'indicateur de flux les traite identiquement. Pour les titres à fort flux de couverture lié aux options (en particulier les grosses tech), cette distorsion est non négligeable — les couvertures des market makers d'options peuvent dominer le flux quotidien sans refléter de conviction fondamentale.
2. **Ne voit pas le volume dark pool / hors marché.** Les marchés actions américains modernes traitent 30–50 % du volume hors marché. Les indicateurs de flux du tape public ne voient que le volume du marché visible. Le signal reste réel (le flux visible est corrélé au flux hors marché), mais les lectures absolues ne donnent pas l'image complète.
3. **Sensibles aux jours de gap.** Les gaps sur résultats, gaps d'actualités et suspensions de nuit produisent des pics de volume sur une barre qui dominent l'indicateur pendant les N barres suivantes. Le MFI 14 barres met 14 séances à pleinement absorber un seul gap anormal.

Le tableau de bord flux de PickSkill marque explicitement les barres de jour de gap et les barres de jour limite (pour les actions A) comme outliers ; les lectures de flux lissées les excluent de la fenêtre glissante pour empêcher des événements ponctuels de dominer la lecture.

## Quatre pièges dans l'interprétation des signaux de flux

1. **Lire le niveau absolu plutôt que la tendance.** « MFI à 65 » est à peine informatif. « MFI passé de 35 à 65 sur les 8 dernières barres alors que le cours est resté plat » est le même chiffre mais un signal bien plus fort. Les indicateurs de flux sont les plus utiles via leur pente et leur trajectoire, pas leur valeur instantanée.
2. **Confondre volume et flux.** Une journée haussière à fort volume est haussière ; une journée baissière à fort volume est baissière. Le volume seul est neutre ; il amplifie la direction dans laquelle la barre a clôturé. Les indicateurs de flux sont du volume *pondéré par la direction* — cette pondération est tout le contenu informationnel. Si vous ne regardez que les barres de volume sans la surcouche directionnelle, vous ne regardez pas le flux.
3. **Ignorer le contexte de flux à l'échelle du marché.** Une action avec un OBV en hausse pendant une vente large du marché est plus informative qu'une action avec un OBV en hausse pendant un rallye général — dans le premier cas, une vraie conviction se construit à contre-courant ; dans le second, le flux n'est que du bêta de marché. Vérifiez toujours le flux par rapport au flux marché.
4. **Trader le flux sans déclencheur de price action.** Un flux qui retourne à la hausse ne veut pas dire acheter ; cela veut dire « guetter un déclencheur d'achat ». Attendez une confirmation par la price action (cassure au-dessus d'un niveau, croisement de MA, retournement MACD) avant de dimensionner.

## Comportement du flux de capitaux sur les actions A

Le marché des actions A présente des dynamiques de flux supplémentaires à comprendre :

- **Le flux Northbound / Southbound** (entrées de Stock Connect depuis Hong Kong) est une série de flux séparée et publiquement divulguée. Ce n'est pas la même chose que le MFI / CMF / OBV sur le tape — elle capture spécifiquement le flux institutionnel étranger via le canal Connect. Beaucoup de plateformes locales agrègent cela en un indicateur « 北向资金净流入 » informatif sur *qui* achète, pas seulement *quel volume* s'est traité.
- **Les restrictions de day-trading (T+1) compriment les signaux de flux.** Parce que les investisseurs en actions A ne peuvent pas vendre le jour même, le volume quotidien est fortement biaisé vers les achats initiaux — le risque de nuit est conservé, pas dénoué. Cela rend l'OBV des actions A plus directionnel que l'OBV américain mais aussi plus sujet aux pics de mimétisme d'une journée.
- **Les jours limit-up tronquent le flux.** Quand un titre se bloque au limit-up, le volume sur le carnet d'ordres peut être énorme mais le volume exécuté est faible. La plupart des flux de données rapportent le volume exécuté ; les indicateurs de flux utilisant le volume exécuté sous-estiment la vraie demande des jours limites. Tradez les signaux de flux des jours limites avec prudence.

Voir [Meilleurs indicateurs pour les actions A](/blog/best-indicators-for-a-shares) pour le playbook plus large.

> **Suivez le flux sur vos positions.** Le tableau de bord flux de [/indicators](/indicators) affiche MFI et CMF pour chaque position, fait remonter la classification de tendance de flux sur 5 jours et marque explicitement les motifs d'accumulation (OBV en hausse pendant un cours latéral) et de distribution (OBV en baisse pendant un cours en hausse).

## Comment le flux s'inscrit dans un workflow multi-signaux

Le flux est la *couche participation* — il répond à « le volume soutient-il le mouvement ? ». Cette couche s'insère dans une pile plus large :

| Couche | Outil | Question |
|---|---|---|
| **Tendance** | Pile MA, [ADX](/blog/what-is-adx) | Direction ? Force ? |
| **Momentum** | [MACD](/blog/what-is-macd), [RSI](/blog/what-is-rsi) | Direction récente du changement ? |
| **Participation** | MFI, CMF, OBV | Le mouvement est-il soutenu par le volume ? |
| **Volatilité** | [Bandes de Bollinger](/blog/what-is-bollinger-bands) | Le mouvement est-il proportionné ? |
| **Carte** | [Support / résistance](/blog/what-is-support-resistance) | Où sont les niveaux clés ? |

Utilisez la couche participation pour *confirmer* les signaux des autres couches, pas pour générer des signaux seule. Un setup haussier avec OBV en hausse, croisement doré MACD et cours au-dessus de la MA 50 jours est sensiblement à plus forte conviction que chacun pris seul.

## Pour aller plus loin

- [Le papier sur le Money Flow de Marc Chaikin](https://www.chaikinanalytics.com/) — le traitement par le développeur du CMF et de la théorie de la persistance du money flow.
- [Joseph Granville, *New Strategy of Daily Stock Market Timing*](https://www.amazon.com/dp/0136150896) — référence originale sur l'OBV ; la section méthodologique vaut toujours la lecture.

## FAQ

**Quel indicateur de flux utiliser ?**
Commencez par l'OBV — c'est le plus simple et le plus robuste. Utilisez le MFI quand vous voulez une lecture bornée 0–100 comme le RSI. Utilisez le CMF pour la précision barre par barre quand vous tenez à savoir où chaque barre a clôturé dans son range. Les trois s'accordent la plupart du temps ; quand ils divergent, l'OBV est en général le signal le plus propre. Le tableau de bord flux de PickSkill affiche les trois.

**Le « smart money flow » est-il la même chose que le flux de capitaux ?**
« Smart money flow » est un terme marketing, pas une définition technique. La plupart des indicateurs « smart money » sont des versions reconditionnées d'OBV / MFI / CMF, parfois avec une pondération par heure de la journée (le volume de fin de séance pèse plus, sur la théorie que les institutions tradent dans la clôture). Le signal sous-jacent appartient à la même famille ; seul l'habillage varie.

**Le flux de capitaux peut-il prédire où va une action ?**
« Prédire » est trop fort. Le flux de capitaux peut vous dire si le mouvement en cours est bien soutenu par le volume (augmentant la probabilité de continuation) ou mal soutenu (augmentant la probabilité d'échec). Il ne peut pas vous donner la direction en isolation — le flux stagne pendant les longues phases latérales et produit de faux signaux lors des gaps liés à des actualités. Traitez-le comme un modificateur de confiance sur les signaux des autres outils, pas comme une prévision directionnelle.

**Pourquoi le flux est-il différent selon les plateformes ?**
Trois causes : (1) des valeurs N différentes (14 vs 21 pour le MFI ; 20 vs 21 pour le CMF), (2) un traitement différent du volume pre-market / after-hours (certaines incluent les séances étendues ; PickSkill n'utilise que la séance régulière pour la cohérence), (3) un traitement différent des jours de gap. Pour la cohérence, PickSkill utilise le volume de séance régulière, exclut les barres de jours limites (actions A) et applique un seul jeu de valeurs N par défaut sur toutes les positions.

**Comment le flux interagit-il avec les couvertures liées aux options ?**
Sur les grosses caps fortement optionnées, la couverture des market makers peut piloter 20–40 % du flux quotidien sans refléter de conviction fondamentale — un titre à exposition gamma croissante force les market makers à acheter les jours de hausse et vendre les jours de baisse, ce qui gonfle les lectures de flux dans les deux directions. Pour les titres à forte activité d'options, les signaux de flux sont moins informatifs que pour les titres moins optionnés ; associez le flux au skew de volatilité implicite et aux données d'exposition gamma pour une lecture complète.
