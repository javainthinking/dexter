---
title: Qu'est-ce que EV/EBITDA ? Le multiple agnostique
description: EV/EBITDA évalue une entreprise sur le profit opérationnel avant intérêts, impôts, amortissements. Formule, bandes sectorielles, pièges.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: L'équipe de recherche PickSkill — un analyste IA pour les investisseurs particuliers.
pillar: explainer
tags:
  - valuation
  - ev-ebitda
  - multiples
  - fundamentals
heroImage: /blog/what-is-ev-ebitda/hero.png
heroAlt: Infographie montrant la formule EV/EBITDA avec les fourchettes typiques par secteur
---

L'**EV/EBITDA** est le multiple de valorisation qui voit à travers la structure de capital. Là où le [PER](/blog/what-is-pe-ratio) divise le prix de l'action par le bénéfice après intérêts et impôts — tous deux dépendant du mode de financement et de la fiscalité — l'EV/EBITDA divise l'*Enterprise Value* (la valeur du business entier) par l'*EBITDA* (résultat avant les éléments qui distordent les décisions de financement et de comptabilisation). Résultat : un multiple qui permet de comparer deux entreprises du même secteur même si l'une est endettée et l'autre non.

### Points clés

- **EV/EBITDA = Enterprise Value ÷ EBITDA.** EV = capitalisation + dette − trésorerie + intérêts minoritaires. EBITDA = résultat avant intérêts, impôts, amortissements.
- **Agnostique à la structure de capital.** Comparer des entreprises avec des niveaux d'endettement différents est la raison principale d'exister de l'EV/EBITDA. Le PER casse sous cette comparaison ; pas l'EV/EBITDA.
- **Il flatte les sociétés capitalistiques** en ignorant le capex. Une aciérie qui dépense 1 Md$ par an en capex semble « moins chère » à même EV/EBITDA qu'un éditeur logiciel qui ne dépense presque rien.
- **Lectures typiques** : 8–10× utilities, 10–14× industrielles, 14–20× consommation/santé, 18–30×+ logiciel.
- **PickSkill calcule l'EV/EBITDA** avec comparaison peer-set complète et signale automatiquement quand EV/EBITDA et PER se contredisent.

## Qu'est-ce que l'EV/EBITDA ?

```
EV/EBITDA = Enterprise Value / EBITDA
Avec :
  EV     = Capitalisation + Dette totale − Trésorerie + Intérêts minoritaires
  EBITDA = Résultat opérationnel + Amortissements
```

L'**Enterprise Value (EV)** est le coût total pour acquérir tout le business — racheter tous les titres ET reprendre la dette, la trésorerie en place compensant une partie. L'**EBITDA** retire quatre choses : intérêts (choix de financement), impôts (juridiction), amortissements (allocations comptables non cash). Ce qui reste est une approximation de la génération de cash opérationnelle avant capex et BFR.

## Quand l'EV/EBITDA bat le PER

1. **Sociétés à niveaux d'endettement différents.** Une société endettée a plus de charges d'intérêts, un résultat net plus faible, un PER mécaniquement plus haut. L'EV/EBITDA coupe au-dessus de la ligne d'intérêts — la comparaison reste propre. Exemple classique : les telcos.
2. **Acquisitions récentes distordant l'amortissement.** Le PER le reflète ; l'EBITDA non.
3. **Comparaisons internationales.** Différents régimes fiscaux rendent le PER bruyant ; l'EV/EBITDA est neutre.

## Quand l'EV/EBITDA induit en erreur

1. **Business capitalistiques.** Aciérie, telco, aérien dépensent 5–15 % du CA en capex chaque année. L'EBITDA l'ignore. L'EV/EBITDA peut faire passer un business très lourd en capex pour bon marché, alors que son FCF est bien plus faible. Toujours pairer avec FCF yield — voir [Qu'est-ce que le FCF ?](/blog/what-is-fcf).
2. **Logiciel avec coûts de développement capitalisés.** Les SaaS capitalisent le software d'usage interne, le déplaçant des opex vers le capex (que l'EBITDA ne voit pas).
3. **Sociétés ajustant l'EBITDA agressivement.** « Adjusted EBITDA », « Pro Forma EBITDA », « EBITDAS » — chaque ajustement creuse l'écart avec le cash réel. Lisez toujours la réconciliation EBITDA dans le 10-K (voir [Lire un 10-K](/blog/how-to-read-10k)).

## Fourchettes typiques par secteur

| Secteur | EV/EBITDA typique |
|---|---|
| **Utilities** | 8–10× |
| **Industrielles / Matériaux** | 10–14× |
| **Consommation / Santé** | 14–20× |
| **Logiciel / Internet** | 18–30×+ |
| **Banques** | Non utilisé (PER ou P/Book) |

Comparer en brut entre secteurs n'a pas de sens — 9× utility vs 25× logiciel est une différence structurelle.

## EV/EBITDA vs PER

| Utilisez EV/EBITDA quand | Utilisez PER quand |
|---|---|
| Vous comparez des structures de capital différentes | Pairs à levier similaire |
| Vous comparez des juridictions / fiscalités | Même pays |
| Amortissement non-cash distord le résultat net | Compte de résultat propre |
| Comparaison post-M&A entre acquéreurs | Maturité, pas de deals récents |
| Analyse d'acquisition / LBO | Comparaison pure côté equity |

Pour la vue d'ensemble absolu vs relatif, voir [DCF vs comparables](/blog/dcf-vs-comparable-company-analysis).

## Comment PickSkill utilise l'EV/EBITDA

Ouvrez [/chat](/chat) et tapez :

> *« Compare AMD, AVGO, INTC et NVDA en EV/EBITDA — TTM et NTM — contre leurs moyennes 5 ans. Signale les noms où EV/EBITDA et PER divergent sur cher/pas cher. »*

PickSkill tire les composants de l'EV (capi + dette + minoritaires − trésorerie) et l'EBITDA (TTM + NTM consensus) pour chaque ticker depuis les filings SEC + données marché, calcule les deux multiples, et signale explicitement les cas où ils divergent — signal utile que la structure de capital, l'amortissement, ou les ajustements EBITDA agressifs font un vrai travail.

Se combine avec [DCF vs Comps](/blog/dcf-vs-comparable-company-analysis) — l'EV/EBITDA est le multiple titre de la table Comps en général.

## FAQ

**Quel est un « bon » EV/EBITDA ?**
Pas de « bon » universel. 9× est juste pour une utility ; 9× serait bon marché pour du logiciel sauf si quelque chose ne va pas. Toujours ancrer contre pairs et historique propre.

**Différence entre EV et capitalisation ?**
Capi = equity seulement. EV = equity + dette − trésorerie + minoritaires. Même société ; EV capture le coût total d'acquisition incluant la dette reprise.

**Forward ou trailing EBITDA ?**
NTM est le défaut analyste ; TTM plus défendable (réel). Utilisez les deux — l'écart traduit la vue de croissance du consensus.

**EV/EBITDA et EV/EBIT, pareil ?**
Non — EBIT soustrait les amortissements, EBITDA non. EV/EBIT est plus proche d'un « vrai bénéfice » ; EV/EBITDA plus proche du cash opérationnel avant capex. Business capitalistique → préférez EV/EBIT.

**D'où vient l'EBITDA dans PickSkill ?**
Calculé directement depuis le compte de résultat et le tableau de flux du dernier 10-K/10-Q. Réconcilié contre l'EBITDA reporté par la société (quand il existe) et signalant les ajustements appliqués (exclusion SBC, add-backs de restructuration, etc.) pour que vous voyiez l'agressivité du chiffre publié.
