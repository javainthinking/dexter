---
title: Qu'est-ce que le PER ? Le multiple que tout le monde cite (et que la moitié utilise mal)
description: Guide pratique du PER (price-to-earnings) — ce qu'il mesure réellement, quand il ment, les variantes TTM/forward/Shiller, et les quatre pièges qui faussent les comparaisons PER.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: L'équipe de recherche PickSkill — un analyste IA pour les investisseurs particuliers.
pillar: explainer
tags:
  - valuation
  - pe-ratio
  - multiples
  - fundamentals
heroImage: /blog/what-is-pe-ratio/hero.png
heroAlt: Infographie montrant la formule PER avec une échelle de lecture du bas vers le haut
---

Le **PER** (price-to-earnings, ratio cours/bénéfice) est le chiffre le plus cité des marchés actions. C'est aussi le plus mal compris. Le PER répond à une question simple — combien les investisseurs paient-ils par dollar de bénéfices actuels — mais un chiffre PER isolé ne dit presque rien sans contexte : quels bénéfices ? trailing ou forward ? GAAP ou ajustés ? comparé à quoi ? Bien utilisé, le PER est le sanity check le plus rapide en valorisation. Mal utilisé, c'est la source principale des thèses « cette action a l'air bon marché » qui se révèlent fausses.

Ce guide couvre la formule, les variantes qui comptent (TTM vs forward, Shiller CAPE), le signal que donne le PER et les quatre pièges qui faussent les comparaisons PER en pratique.

### Points clés

- **PER = Prix par action / Bénéfice par action.** Un ratio simple avec un dénominateur d'une complexité trompeuse.
- **Trois variantes utiles à connaître** : TTM (douze derniers mois, rétrospectif), NTM (douze prochains mois, prospectif, le défaut des analystes) et Shiller CAPE (lissé sur 10 ans, l'étalon pour les comparaisons macro).
- **Un PER élevé = le marché attend de la croissance ; un PER bas = le marché voit du risque ou un déclin.** Aucun n'est automatiquement bon ou mauvais — le contexte fait tout.
- **Le PER ment quand les bénéfices mentent.** Creux cycliques (E faible, PER élevé), plus-values exceptionnelles (E élevé, PER bas), rapprochements GAAP/ajusté agressifs — tous déforment le PER.
- **Le PER ne fonctionne qu'en comparaison** — contre l'historique propre, contre les pairs, contre le marché. Un PER nu n'est que la moitié d'une information.

## Qu'est-ce que le PER ?

Formule en une ligne :

```
PER = Prix par action / Bénéfice par action
```

Une action à 150 $, BPA 5 $ → PER 30. Le marché paie 30 $ aujourd'hui pour chaque dollar de bénéfice *actuel* — ce qui n'a de sens qu'avec une vue sur l'évolution future des bénéfices.

Les bénéfices utilisés dans la formule importent autant que le prix :
- **PER TTM** : bénéfices des 12 derniers mois. Rétrospectif. Le plus défendable car réels, mais rétroviseur uniquement.
- **PER NTM** : estimations consensus des bénéfices sur 12 mois. Défaut des pros.
- **PER Shiller (CAPE)** : 10 ans de bénéfices ajustés inflation au dénominateur. Lisse les cycles. Utilisé surtout au niveau marché.

## Quel signal donne le PER ?

Le PER reflète deux choses combinées : **croissance attendue** et **risque perçu**.

| Lecture du PER | Interprétation typique |
|---|---|
| **< 10** | Deep value, bénéfices déprimés (creux cyclique), ou business en déclin structurel |
| **10–15** | Mature et stable, attentes de croissance faible-modérée |
| **15–25** | Fourchette « normale » du marché US sur 20 ans |
| **25–40** | Multiple au-dessus du marché ; croissance significative pricée |
| **> 40** | Hypercroissance, ou bénéfices déprimés gonflant le multiple |

Le mot clé est *interprétation*. Un PER 40× sur une société qui croît à 30 % avec forte conversion FCF est rationnel. Un PER 40× sur une société qui croît 5 % est une « story stock ». Le cadre qui price la croissance correctement est [Qu'est-ce que le DCF ?](/blog/what-is-dcf).

## Les quatre pièges qui faussent les comparaisons PER

1. **Bénéfices cycliques.** Au creux d'un cycle, les bénéfices sont déprimés, ce qui gonfle mécaniquement le PER. Moyennez les bénéfices sur le cycle puis recalculez.
2. **Éléments exceptionnels.** Une plus-value de cession de 500 M$ dans le résultat net baisse mécaniquement le PER sans changer le business. Vérifiez toujours si les bénéfices comportent des items non récurrents.
3. **Rémunération en actions (SBC).** Le GAAP inclut la SBC en charge ; les bénéfices « ajustés » l'excluent souvent. Sur les big tech, l'ajusté peut être 30–50 % supérieur au GAAP juste à cause de la SBC. PER 20× sur EPS ajusté devient 30× sur EPS GAAP — même société, lecture très différente. Voir [Qu'est-ce que le FCF ?](/blog/what-is-fcf).
4. **Comparaisons inter-sectorielles.** Les utilities à 12–15× car croissance lente et stable ; les logiciels à 35× car rapide et moins stable. Les comparer en PER brut, c'est pommes contre poires.

Règle des 134 mots : **ne citez jamais un PER sans ancre** — historique propre, peer-set, ou norme marché long terme. Sinon ce n'est pas de la donnée, c'est de l'ambiance.

## PER vs autres multiples

| Multiple | Quand | Caveat |
|---|---|---|
| **PER** | Business mature à bénéfices stables | Casse à zéro/négatif ; sensible à la compta |
| **PER forward** | Croissance où les bénéfices courants sous-estiment le run-rate | Dépend de la justesse du consensus |
| **EV/EBITDA** | Business capitalistique ; comparaison cross-structure | Ignore le capex — voir [Qu'est-ce que l'EV/EBITDA ?](/blog/what-is-ev-ebitda) |
| **EV/Sales** | Sociétés de croissance en pertes (SaaS jeune, biotech) | Ne dit rien sur la rentabilité |
| **P/Book** | Banques, business asset-heavy | Inutile en asset-light |

Pour la vue d'ensemble absolu vs relatif, [DCF vs analyse de sociétés comparables](/blog/dcf-vs-comparable-company-analysis).

## Utiliser le PER de façon productive

Un workflow qui survit à la relecture :

1. **Tirez le PER TTM et NTM** de la société. L'écart entre les deux donne l'attente de croissance du marché.
2. **Tirez les mêmes deux ratios pour 5–8 pairs.** Calculez la médiane.
3. **Calculez la fourchette 5 ans du PER propre** (bas, moyen, haut). Où se situe le PER actuel ?
4. **Demandez : pourquoi le PER actuel est-il là ?** S'il dépasse la médiane peer et l'historique propre, le marché price quelque chose — quoi ?
5. **Stress-testez la croissance implicite.** Si le PER actuel n'a de sens qu'avec 20 % de croissance sur 5 ans, est-ce plausible ?

C'est exactement ce que PickSkill fait tourner quand vous demandez une « comparaison PER ».

## Comment PickSkill utilise le PER

Ouvrez [/chat](/chat) et tapez :

> *« Sors-moi le PER TTM et NTM de NVDA, compare contre son historique 5 ans et contre AMD, AVGO, INTC et TSM. Montre-moi quelle croissance des bénéfices le PER actuel implique vis-à-vis des pairs. »*

PickSkill tire le PER TTM du dernier 10-K/10-Q, le NTM du consensus, la fourchette 5 ans propre, les mêmes deux pour le peer-set, et calcule la croissance implicite multi-années qui justifierait le multiple courant. Sortie en une table — équivalente à 40 minutes de tableur fait main.

Cela se combine avec le [workflow Comps](/blog/dcf-vs-comparable-company-analysis) — le PER est le titre, Comps est la table structurée derrière.

## FAQ

**Quelle différence entre PER TTM et NTM ?**
TTM = douze derniers mois, rétrospectif, bénéfices réels reportés. NTM = douze prochains mois, prospectif, estimations consensus. La plupart des pros citent le forward car l'investissement est sur le futur ; le trailing est défendable si vous ne voulez pas dépendre du consensus.

**Quel est un « bon » PER ?**
Pas de « bon » PER universel. 12× sur une utility est juste ; 12× sur une SaaS qui croît 30 % suggère que le marché pense la croissance fausse. Toujours ancrer contre (a) historique propre, (b) pairs, (c) marché général.

**Qu'est-ce que le PER Shiller (CAPE) ?**
PER ajusté cyclique, popularisé par l'économiste Robert Shiller. Utilise 10 ans de bénéfices ajustés inflation comme dénominateur. Surtout au niveau marché (CAPE S&P 500 célèbre).

**Le PER peut-il être négatif ?**
Mathématiquement oui, quand les bénéfices sont négatifs. En pratique les analystes reportent « N/M » et passent à EV/Sales ou EV/EBITDA. Le PER ne marche qu'avec des bénéfices positifs et raisonnablement stables.

**Où trouver le PER d'une action ?**
La plupart des services financiers (Yahoo Finance, Bloomberg, votre broker) affichent le TTM par défaut. Le forward nécessite le consensus. [PickSkill](/chat) calcule les trois depuis les sources primaires et expose l'écart entre les trois comme signal.
