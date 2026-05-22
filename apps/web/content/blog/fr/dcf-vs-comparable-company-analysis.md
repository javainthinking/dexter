---
title: DCF vs analyse de sociétés comparables — quelle méthode de valorisation utiliser ?
description: Comparaison pratique des deux principales méthodes de valorisation actions — DCF (absolue) et analyse de sociétés comparables (relative). Quand chacune fonctionne le mieux, où chacune casse, et pourquoi les professionnels font tourner les deux.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: L'équipe de recherche PickSkill — un analyste IA pour les investisseurs particuliers.
pillar: explainer
tags:
  - valuation
  - dcf
  - comparables
  - fundamentals
heroImage: /blog/dcf-vs-comparable-company-analysis/hero.png
heroAlt: Infographie comparant le DCF (valorisation absolue) et l'analyse de sociétés comparables (valorisation relative) sur un tableau de score
---

Les deux méthodes que tout analyste actions apprend en premier sont le **DCF** (discounted cash flow) et l'**analyse de sociétés comparables** (Comps, multiples de marché). Elles répondent à la même question — combien vaut cette action ? — par des chemins complètement différents. Le DCF est **absolu** : il construit la valeur à partir du cash futur propre à l'entreprise. Les Comps sont **relatifs** : ils tarifient l'entreprise par rapport à ce que le marché paie aujourd'hui pour des entreprises similaires. Savoir sur lequel s'appuyer fait la différence entre un modèle qui survit à la relecture et un qui ne survit pas.

Ce guide passe en revue la comparaison côte-à-côte, quand chaque méthode fonctionne le mieux, leurs modes de défaillance, et pourquoi la plupart des analystes sell-side et buy-side font tourner les deux et triangulent.

### Points clés

- **Le DCF tarifie le cash futur ; les Comps tarifient le multiple présent.** Même question, cadres complètement différents.
- **Utilisez le DCF quand** : le business est suffisamment stable pour prévoir 5+ ans de cash, vous avez une vue sur les marges long terme, vous voulez tester « le marché se trompe-t-il ? ».
- **Utilisez les Comps quand** : le business change trop vite pour une prévision long terme, vous avez besoin d'un sanity check, vous benchmarkez contre des pairs, ou la structure de multiples du secteur est l'élément porteur de l'argument.
- **La plupart des modèles pros font tourner les deux** et rapportent le spread. Un écart persistant de 30%+ entre DCF et Comps est lui-même un signal — généralement lié au choix du peer-set ou aux hypothèses de marge terminale.
- **PickSkill fait tourner les deux** — `/chat` produit un DCF et une table Comps en parallèle à partir d'un seul prompt, avec le spread et une lecture en une phrase.

## Qu'est-ce que le DCF ?

Le **DCF** valorise une entreprise en projetant son [free cash flow](/blog/what-is-fcf) pendant 5–10 ans, en actualisant chaque année à aujourd'hui avec un [WACC](/blog/what-is-wacc), et en ajoutant une valeur terminale représentant tout ce qui suit. La formule :

```
EV = Σ FCFₜ / (1 + WACC)ᵗ + TV / (1 + WACC)ⁿ
```

Pour le cadre complet (les quatre hypothèses qui font bouger 95 % de la réponse, les pièges courants, le flux), voir [Qu'est-ce que le DCF ?](/blog/what-is-dcf).

Le DCF est la méthode **absolue** : la réponse ne dépend pas de ce que valent les autres entreprises. Elle dépend de ce que *cette* entreprise est censée produire et du taux d'actualisation qui rémunère le risque.

## Qu'est-ce que l'analyse de sociétés comparables ?

Les **Comps** valorisent une entreprise en appliquant les multiples de marché d'un groupe de pairs à la cible. On choisit 5–10 pairs cotés, on observe ce que le marché paie pour eux aujourd'hui (EV/EBITDA, EV/Sales, P/E, etc.), on l'applique aux financiers de la cible, on en déduit un prix implicite.

Esquisse :

```
Plage EV/EBITDA des pairs : 10× – 14× (médiane 12×)
EBITDA NTM de la cible :   2,0 Md$
EV implicite :              12× × 2,0 Md$ = 24 Md$
Moins dette nette :         24 Md$ − 4 Md$ = 20 Md$ d'equity
Prix implicite par action : 20 Md$ / 200 M actions = 100 $
```

Pour les multiples eux-mêmes, voir [Qu'est-ce que le P/E ?](/blog/what-is-pe-ratio) et [Qu'est-ce que l'EV/EBITDA ?](/blog/what-is-ev-ebitda).

Les Comps sont la méthode **relative** : la réponse est ce que le marché est prêt à payer aujourd'hui pour des business similaires. Si tout le secteur se re-rate, la valeur Comps suit.

## La comparaison côte-à-côte

| Dimension | DCF (Absolu) | Comps (Relatif) |
|---|---|---|
| **Ce qu'il valorise** | Le cash futur propre à l'entreprise | Sa place dans le marché d'aujourd'hui |
| **Input clé** | FCF à long terme + WACC | Groupe de pairs + multiple choisi |
| **Horizon de temps** | 5–10 ans explicites + perpétuité | Implicite (essentiellement les 12 prochains mois) |
| **Sensible à** | Marge terminale, WACC, croissance | Sélection des pairs, choix du multiple |
| **Le plus fort quand** | Le cash est stable et prévisible | Les pairs existent et se traitent activement |
| **Le plus faible quand** | Le modèle d'affaires est en transition | Pas de pairs propres, ou tout le secteur est mispricé |
| **Caractère de la sortie** | Valeur intrinsèque autonome | Valeur relative aux pairs |
| **Risque de re-rating** | Faible (hypothèses terminales figées) | Fort (les multiples de pairs peuvent se comprimer vite) |
| **Scrutin du relecteur** | « Défends le WACC et le terminal » | « Défends le peer-set et le multiple » |

## Quand le DCF fonctionne le mieux

1. **Business stables, matures** avec des cash flows prévisibles. Utilities, biens de consommation de base, industriels avec demande établie.
2. **Vous avez une vue défendable sur les marges long terme.** Le DCF récompense la conviction sur la marge EBIT terminale.
3. **Vous suspectez que le marché se trompe.** Si le marché tarifie sur du bruit court terme, un DCF ancré sur le cash long terme est l'outil pour démontrer l'écart.
4. **Bas de cycle.** Les Comps en creux cyclique ont l'air affreux (multiples bas × résultats déprimés) ; le DCF normalise à travers le cycle.

Le DCF échoue sur les businesses en phase précoce, les noms hypercroissance où les hypothèses à 5 ans sont du devinage, et les businesses traversant un changement structurel.

## Quand les Comps fonctionnent le mieux

1. **Le peer-set est propre.** Logiciel/SaaS avec 10+ pure-plays cotés activement. Banques où la comptabilité réglementaire stabilise la comparaison.
2. **Vous voulez un sanity check.** Un DCF qui implique 50% au-dessus du multiple du pair le plus proche a besoin d'une histoire qui justifie cette prime.
3. **Le re-rating sectoriel est la thèse.** Les Comps capturent ça — le DCF ne le fait pas vraiment.
4. **Visibilité limitée sur le cash long terme.** Quand projeter à 7 ans relève de la fiction, un multiple forward 12 mois de pairs est plus honnête.

Les Comps échouent quand il n'y a pas de pairs (business unique), quand les pairs sont mispricés comme secteur (internet en 2000), ou quand le multiple choisi est structurellement inadapté (P/E sur une société en pertes).

## Modes de défaillance habituels

Checklist de 134 mots :

1. **DCF : la queue (terminal) qui remue le chien.** La valeur terminale fait 60–80 % de l'EV dans un DCF type 5 ans — si vous êtes désinvolte sur le taux de croissance terminal ou le multiple de sortie, vous êtes désinvolte sur la plus grande partie de la réponse.
2. **DCF : fausse précision.** Reporter un prix implicite à deux décimales prétend une confiance que le modèle n'a pas méritée. Reportez une fourchette.
3. **Comps : cherry-picking du peer-set.** Choisir les 3 pairs au multiple le plus haut et appeler ça « médiane » est l'abus le plus courant en sell-side. Sélectionnez les pairs par modèle d'affaires, pas par multiple.
4. **Comps : décalage multiple/cycle.** Appliquer le multiple d'aujourd'hui à une prévision à 2 ans suppose implicitement que les multiples ne bougent pas. Ils bougent.
5. **Triangulation malhonnête.** Reporter « notre objectif est la moyenne du DCF et des Comps » sans reconnaître à laquelle vous croyez davantage signale que vous vous couvrez.

## Pourquoi les pros font tourner les deux

Les deux méthodes sont complémentaires, pas substituables. Pratique courante :

- **Faites tourner le DCF.** Obtenez une fourchette de valeur intrinsèque basée sur votre vue des fondamentaux.
- **Faites tourner les Comps.** Obtenez une fourchette de valeur relative basée sur les multiples des pairs aujourd'hui.
- **Reportez le spread.** Si le DCF dit 100 $ et les Comps disent 75 $, le spread est la question intéressante. Habituellement l'une de trois choses :
  - Votre marge terminale est plus optimiste que ce qu'impliquent les résultats des pairs.
  - Le secteur est actuellement mispricé (votre vue) et le DCF capture le prix « correct ».
  - Votre peer-set est faux — vous avez inclus des noms avec des économies structurellement différentes.

La **conversation de triangulation** — expliquer pourquoi DCF et Comps divergent — est l'endroit où l'analyse se montre. Un modèle où DCF et Comps s'accordent à 10 % près signifie habituellement que rien d'intéressant n'est dit.

## Comment PickSkill fait tourner les deux

Ouvrez [/chat](/chat) et tapez :

> *« Valorise NVDA avec DCF et trading-multiple Comps. Donne-moi le prix implicite de chacun, le spread, et une lecture en une phrase d'où vient le spread. »*

PickSkill fait tourner le [flux DCF](/blog/build-dcf-in-60-seconds) (inputs sourcés via filings SEC + Damodaran + rendements actuels), construit une table Comps depuis un peer-set que vous pouvez écraser (défaut = pairs de segment du 10-K), et vous affiche les deux prix implicites côte-à-côte avec le spread et le moteur dominant de l'écart.

Ajoutez `« …et montre-moi aussi le spread EV/EBITDA entre NVDA et la médiane des pairs sur les 8 derniers trimestres »` pour voir si le multiple relatif actuel est un re-rating récent ou une prime structurelle stable.

## FAQ

**Quelle méthode est plus « correcte » ?**
Aucune. Elles répondent à des questions différentes. Le DCF demande ce que vaut le flux de cash en isolation ; les Comps demandent ce que le marché paie pour des flux similaires. Les deux sont corrects ; elles divergent parce qu'elles utilisent des référentiels différents.

**Pourquoi divergent-elles souvent de 20–40 % ?**
En général : (1) vous êtes plus optimiste sur la marge terminale que le marché ne l'est sur la marge run-rate des pairs ; (2) votre peer-set a un mix croissance/qualité différent de la cible ; (3) le secteur est actuellement mispricé par rapport à la juste valeur long terme. La taille de l'écart est informative ; l'expliquer est là où l'analyste gagne ses honoraires.

**Puis-je utiliser les deux pour le même objectif de cours ?**
Oui, la plupart des targets sell-side sont une blend pondérée de DCF, Comps et (souvent) transactions précédentes. Les poids sont du jugement — typiquement 50 % DCF / 30 % Comps / 20 % transactions pour les noms matures ; davantage de Comps quand le business est trop dynamique pour des prévisions long terme.

**EV/EBITDA, EV/Sales, P/E — quel multiple en Comps ?**
Le multiple le plus stable pour le secteur. Cycliques capitalistiques : EV/EBITDA. Logiciel/SaaS au résultat GAAP négatif : EV/Sales ou EV/ARR. Mature et stable : P/E. Banques : P/Book ou P/Tangible Book. Utiliser P/E sur un tech hypercroissance sans bénéfice est une erreur classique.

**PickSkill choisit-il automatiquement le peer-set ?**
Oui, avec un défaut — typiquement les noms cités par la cible dans la sous-section « competition » de l'Item 1 du 10-K, filtrés sur la liquidité. Vous pouvez écraser le peer-set en chat (« utilise plutôt ces 6 pairs ») et PickSkill refait les Comps avec votre ensemble. Le peer-set est l'input le plus subjectif des Comps ; le rendre éditable est le point.
