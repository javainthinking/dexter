---
title: Qu'est-ce que le free cash flow (FCF) ? Le chiffre derrière chaque valorisation honnête
description: Guide pratique du FCF — qu'est-ce que c'est, pourquoi il bat le résultat comptable, comment calculer FCFF et FCFE depuis le tableau de flux, et les quatre pièges qui faussent les modèles tech.
publishedAt: 2026-05-22
updatedAt: 2026-05-22
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: L'équipe de recherche PickSkill — un analyste IA pour les investisseurs particuliers.
pillar: explainer
tags:
  - valuation
  - fcf
  - cash-flow
  - fundamentals
heroImage: /blog/what-is-fcf/hero.png
heroAlt: Illustration éditoriale d'un flux de trésorerie passant par un filtre vers un réservoir lumineux, tons sombres et chauds avec accents émeraude
---

Le **free cash flow (FCF)** est la trésorerie qu'une entreprise génère et qui est réellement disponible pour les investisseurs, une fois les opérations payées et la base d'actifs maintenue. C'est le chiffre que veut un modèle de valorisation — pas le bénéfice comptable, qui peut être remodelé par les choix d'amortissement, les oscillations du BFR ou la rémunération en actions. Si les bénéfices d'une société brillent mais que le FCF ne suit pas, cet écart est généralement la chose la plus importante à comprendre sur le titre.

Ce guide couvre la définition, les deux variantes qui comptent (FCFF et FCFE), comment extraire le FCF d'un tableau de flux en moins d'une minute, et les quatre pièges qui faussent en particulier les modèles de sociétés tech.

### Points clés

- **FCF = Cash-flow opérationnel − Capex.** Cash issu de l'activité, moins le capital nécessaire pour la maintenir.
- **Deux variantes** : FCFF (free cash flow to the firm — pour DCF non endetté, indépendant de la structure de capital) et FCFE (free cash flow to equity — pour DCF endetté).
- **Le FCF bat le bénéfice** en valorisation parce qu'il évacue les éléments non cash (D&A, SBC), capte le capex réel et reflète les variations de BFR que le bénéfice GAAP masque.
- **La rémunération en actions (SBC) est un coût réel.** Réintégrer la SBC comme non cash sans modéliser la dilution fait paraître le FCF d'une tech 5–15 % meilleur qu'il ne l'est.
- **PickSkill calcule le FCF depuis les quatre derniers 10-Q + 10-K** en moins d'une minute — les deux variantes, avec les lignes source liées pour vérification.

## Quelle est la formule du FCF ?

Le point de départ est le tableau de flux de trésorerie. Deux chemins selon la variante :

```
FCFF (non endetté) = Cash-flow opérationnel + Intérêts × (1 − t) − Capex
FCFE (endetté)     = Cash-flow opérationnel − Capex + Endettement net
```

Où :

| Terme | Sens |
|---|---|
| **Cash-flow opérationnel (OCF)** | Trésorerie générée par l'activité après variations de BFR. Tête de la section « activités opérationnelles » du tableau de flux. |
| **Capex** | Capital expenditure — argent dépensé en immobilisations, équipements, logiciels, infrastructure. Bas de la section « investissement », libellé « acquisitions d'immobilisations » ou similaire. |
| **Intérêts × (1 − t)** | Charge d'intérêts après impôt, réajoutée dans le FCFF pour que le chiffre ne soit pas biaisé par la structure de capital. |
| **Endettement net** | Dette nouvelle émise moins dette remboursée. Dans le FCFE, c'est la trésorerie qui reste aux actionnaires après les prêteurs. |

**Les deux variantes soustraient le capex**, parce que la trésorerie dépensée dans le bâtiment, le data center, la ligne de production — cette trésorerie ne revient pas à l'investisseur. Elle est réinvestie dans l'activité. Une société en croissance peut avoir un OCF spectaculaire et un FCF négatif parce que tout le cash est réinjecté dans l'expansion.

## Pourquoi le FCF compte-t-il plus que le bénéfice ?

Le bénéfice est le chiffre de la une — celui qui bat ou rate le consensus à chaque publication. Mais la majorité du travail de valorisation pro s'appuie sur le FCF. Trois raisons :

1. **Le bénéfice se tord plus facilement.** Timing d'amortissement, comptabilité des stocks, éléments à régulariser, produits constatés d'avance — autant de leviers conformes GAAP qui déplacent le bénéfice sans déplacer la trésorerie. Le FCF part directement du tableau de flux et en contourne la plupart.
2. **Le capex est réel, et le bénéfice le masque.** Une activité capital-intensive (semi-conducteurs, télécoms, aérien) dépense des milliards en équipements amortis sur dix ans. Le bénéfice voit l'amortissement ; le FCF voit la trésorerie réellement décaissée sur la période. Ils peuvent diverger de 30 à 50 % une année donnée.
3. **Le DCF veut du FCF.** Le modèle de cash-flows actualisés tire son nom de ce qu'il actualise — du cash-flow. Utiliser le bénéfice en proxy donne le type de travail de valorisation qui ne survit pas à une récession (parce que le bénéfice tient quand le cash-flow s'est déjà effondré).

## Extraire le FCF d'un tableau de flux en 60 secondes

Flux pratique sur un filing réel :

1. **Ouvrez le dernier 10-Q ou 10-K** sur [SEC EDGAR][edgar]. Allez au tableau de flux de trésorerie (en général à la page 4–5 des états).
2. **Lisez « Trésorerie nette générée par les activités opérationnelles ».** C'est l'OCF. Le chiffre le plus fiable de la table.
3. **Lisez « Acquisitions d'immobilisations » ou « Capital expenditures »** dans la section investissement. Attention au signe négatif — le capex est une sortie de trésorerie.
4. **Calculez FCF = OCF − Capex.** Pour un usage DCF non endetté, réajoutez les intérêts après impôt (trouvez les intérêts dans le compte de résultat, multipliez par `1 − taux marginal`).
5. **Vérifiez contre le communiqué.** La plupart des sociétés publient leur propre chiffre de FCF dans les communiqués de résultats. Si votre chiffre diffère de plus de 5 %, vous avez une divergence de définition — généralement autour de logiciels capitalisés ou d'éléments liés aux acquisitions. Rapprochez, ne maquillez pas.

[edgar]: https://www.sec.gov/edgar
[chat]: /chat

Un exercice de 60 secondes pour intérioriser : ouvrez le dernier 10-K de NVDA dans [PickSkill][chat], demandez « montre-moi le FCF des 4 derniers exercices et explique la variation année par année ». Vous verrez comment OCF et capex ont bougé chaque année, chaque poste lié au filing.

## FCFF vs FCFE — lequel utiliser

| Variante | Représente | Taux d'actualisation | Quand l'utiliser |
|---|---|---|---|
| **FCFF** | Trésorerie pour *tous* les apporteurs de capital (actionnaires + créanciers) | WACC | DCF actions sell-side standard |
| **FCFE** | Trésorerie pour les *seuls* actionnaires, après intérêts et service de la dette | Coût des fonds propres (Re) | Modèles LBO, valorisation des financières, thèses pilotées par recap |

Le défaut dans 90 % de l'equity research est le FCFF actualisé au [WACC](/blog/what-is-wacc), qui donne une valeur d'entreprise. Soustrayez la dette nette pour obtenir la valeur des fonds propres ; divisez par le nombre d'actions pour le cours implicite.

Le FCFE est moins courant parce qu'il exige de modéliser explicitement le calendrier de dette — intérêts, remboursements, nouvelles émissions par an. Dans un LBO, c'est précisément le sujet. Dans un DCF actions classique, le FCFF est plus propre.

## Quatre pièges qui faussent les modèles de tech

Les sociétés tech modernes sont là où l'analyse FCF déraille le plus souvent. Quatre traps à connaître :

1. **Traiter la SBC comme non cash.** La rémunération en actions est un coût réel — l'entreprise donne du capital à des salariés qui exigeraient sinon un salaire en cash. GAAP réajoute la SBC dans le cash-flow opérationnel (parce que non cash) ; la plupart des analystes oublient ensuite de modéliser la dilution causée par les attributions. Résultat : une « marge FCF » 5–15 % plus haute qu'en réalité. Correctif : soit retrancher la SBC du FCF, soit modéliser explicitement la croissance du nombre d'actions pour que la valeur par action reflète la dilution.
2. **Coûts de développement logiciel capitalisés.** Beaucoup de SaaS capitalisent une partie des salaires d'ingénierie sous « logiciels à usage interne » (ASC 350-40). Ce coût passe de l'OCF (où il abaisserait la trésorerie d'exploitation) au capex (où il abaisse le FCF). Les deux chemins touchent le FCF — mais quand vous comparez deux sociétés et que l'une capitalise agressivement et pas l'autre, la comparaison de FCF est une pomme contre une poire. Normalisez en réintégrant le logiciel capitalisé.
3. **Vents arrière de BFR en croissance.** Une société en hypercroissance qui encaisse plus vite qu'elle ne dépense (produits constatés d'avance) bénéficie de libérations de BFR qui embellissent l'OCF. C'est de la vraie trésorerie — ce n'est pas faux — mais ce n'est pas durable quand la croissance ralentit. Modélisez les variations de BFR en fonction de la croissance du revenu, pas en constante.
4. **Changements de politique de capex.** Une SaaS qui migre de ses propres data centers vers le cloud public devrait voir son capex baisser — c'est structurel, pas du pilotage. Une société en difficulté qui « décale le capex » pour atteindre un objectif trimestriel de FCF cache ses problèmes. Regardez le capex en % du revenu sur 3–5 ans, pas isolément.

## Le FCF yield : le seul ratio qui mérite l'attention

Parmi la douzaine de ratios dérivés du FCF, le **FCF yield** est le plus directement comparable au marché obligataire et à d'autres actions :

```
FCF yield = FCF par action / cours
```

C'est le rendement en cash qu'un actionnaire recevrait si tout le FCF était distribué (ce n'est pas le cas en pratique — les sociétés réinvestissent, rachètent leurs actions ou gardent du cash). Mais c'est le bon benchmark contre le taux sans risque.

| FCF yield | Lecture |
|---|---|
| **>8 %** | Bon marché par les normes historiques ; souvent une valeur ou un titre avec inquiétudes intégrées |
| **4–8 %** | Raisonnable pour des grandes capitalisations en régime de croisière |
| **1–4 %** | Valorisation premium ; on intègre de la croissance ou un positionnement unique |
| **<1 %** | Soit profondément growth, soit capex lourd sans cash restant pour les actionnaires |

Comparez toujours à l'historique de l'entreprise (le yield s'étend-il ou se comprime-t-il ?) et aux pairs du même secteur — les FCF yields des sociétés software ne ressemblent pas à ceux des utilities, et c'est structurel, pas un signal.

## Comment PickSkill construit un FCF à la demande

Ouvrez un chat et tapez :

> *« Sors-moi le FCF d'AMD sur les 4 derniers exercices et explique la variation année par année. »*

PickSkill récupère le dernier 10-K plus les quatre 10-Q précédents sur SEC EDGAR, extrait OCF et capex ligne par ligne, calcule le FCF par an et vous montre le pont année contre année avec chaque variation matérielle reliée à la divulgation originale. Vous voulez le FCFE ? Ajoutez *« ...montre aussi le FCFE en supposant le calendrier de dette actuel »* — même flux, on ajoute juste l'endettement net.

Cette série de FCF alimente directement [l'outil DCF](/blog/what-is-dcf) ; [l'outil WACC](/blog/what-is-wacc) fournit le taux d'actualisation.

## FAQ

**Quelle est la différence entre FCF et résultat net ?**
Le résultat net est le bénéfice GAAP — ce qui reste après tous les frais, y compris non-cash comme l'amortissement. Le FCF est la trésorerie réellement générée après paiement du capital nécessaire au maintien de l'activité. Ils peuvent diverger de 30 à 50 % dans les secteurs capital-intensifs, ou présenter un net positif et un FCF négatif persistant dans les sociétés en forte croissance qui réinvestissent massivement.

**Pourquoi le FCF est-il parfois négatif ?**
Trois raisons, par gravité croissante. (1) L'entreprise est en croissance — elle dépense plus de capex que son cash-flow courant ne peut financer (Amazon pendant la majeure partie de sa première décennie). (2) Le BFR consomme du cash — généralement accumulation de stocks ou créances qui s'allongent. (3) L'activité est structurellement déficitaire — l'OCF lui-même est négatif. Identifier laquelle compte : la première est un choix d'investissement délibéré ; la troisième est un problème existentiel.

**FCF et EBITDA, c'est pareil ?**
Non. L'EBITDA est le résultat avant intérêts, impôts et amortissement — un proxy de cash-flow opérationnel qui ignore trois choses : les variations de BFR, le capex et l'impôt. Le FCF intègre les trois. L'EBITDA est utile pour la comparabilité opérationnelle entre sociétés ; le FCF est ce que la valorisation actualise vraiment.

**Pour les tech, FCF ou EPS ?**
Les deux. L'EPS raconte le récit GAAP de bénéfice par action que la société veut raconter. Le FCF (avec la SBC traitée honnêtement) raconte ce qui est réellement disponible pour un actionnaire. Le graphique le plus utile dans une analyse tech est la marge FCF et la croissance d'EPS côte à côte sur 5 ans — quand ils divergent de manière persistante, c'est là qu'il y a une question intéressante.

**D'où PickSkill tire-t-il ses données de FCF ?**
Extraction directe des filings SEC EDGAR (10-K, 10-Q) via [PickSkill](/chat). Le cash-flow opérationnel et le capex sortent du tableau de flux directement ; le chiffre est rapproché du FCF non-GAAP publié par la société (quand il existe) et les lignes source sont liées. Pas d'intermédiaire de données, donc les chiffres correspondent au filing.
