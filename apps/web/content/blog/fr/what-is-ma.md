---
title: >-
  Qu'est-ce qu'une moyenne mobile ? SMA, EMA et le filtre de tendance que tout
  le monde utilise
description: >-
  Une moyenne mobile est la moyenne glissante du cours de clôture sur N barres.
  Formule, pourquoi 20/60/200 sont les fenêtres standard, et quatre pièges
  classiques du retail.
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
  - Moyenne mobile
  - Analyse technique
  - Indicateurs
  - Tendance
heroImage: /blog/what-is-ma/hero.png
heroAlt: >-
  Infographie éditoriale — trois moyennes mobiles (20/60/200) tracées sur une
  ligne de prix, avec un point de croisement mis en évidence au moment du
  retournement de tendance.
---

**Une moyenne mobile (MA) est la moyenne arithmétique du cours de clôture sur les N dernières barres, recalculée à chaque nouvelle barre.** C'est le socle de tout indicateur de suivi de tendance — [MACD](/blog/what-is-macd), [bandes de Bollinger](/blog/what-is-bollinger-bands), nuage d'Ichimoku, croisements dorés / de la mort — tous sont construits à partir d'une ou plusieurs moyennes mobiles. La plupart des guides retail traitent les MA comme des signaux autonomes. Ce n'est pas le cas. Les MA sont des filtres ; elles répondent à « y a-t-il une tendance ? » pour que d'autres outils répondent à « que faire dans ce cas ? ».

### Points clés

- **Deux variantes dominent** : SMA (simple — chaque barre pondérée à l'identique) et EMA (exponentielle — les barres récentes pèsent plus). Le MACD utilise une EMA ; le « filtre de tendance » à 200 jours est presque toujours une SMA.
- **Trois fenêtres font 90 % du travail** : 20 périodes (court terme), 60 périodes (moyen), 200 périodes (long terme). Sur des barres quotidiennes, cela correspond à environ 1 mois, 3 mois et 10 mois.
- **Le croisement entre deux MA est le signal le plus cité en analyse technique.** Cours au-dessus de la MA = tendance haussière ; cours en dessous = tendance baissière. Une MA courte qui croise une MA longue = le [croisement doré / de la mort](/blog/what-is-golden-cross-death-cross).
- **Les MA sont retardataires par construction.** Une SMA à 200 jours reflète dix mois de cours ; elle ne retournera pas avant que la tendance sous-jacente ne soit en mouvement depuis plusieurs semaines. Ce retard est une vertu lorsqu'on utilise les MA comme filtres, un défaut quand on s'en sert comme déclencheurs.
- **Rendues sur chaque tableau de bord indicateurs PickSkill** — la page [/indicators](/indicators) trace la pile 20/60/200 sur chaque graphique, pour que le régime de tendance soit visible sans quitter la vue portefeuille.

## Comment calcule-t-on une moyenne mobile ?

La moyenne mobile simple sur N barres est la moyenne arithmétique :

```
SMA(N) = (close[t] + close[t-1] + ... + close[t-N+1]) / N
```

Chaque barre de la fenêtre a un poids égal. Une SMA à 20 jours sur une clôture du vendredi utilise les 20 dernières clôtures de séance (soit environ 4 semaines calendaires) ; le lundi elle abandonne la barre la plus ancienne et ajoute la nouvelle.

La moyenne mobile exponentielle pondère plus fortement les barres récentes :

```
EMA(N)[t] = α × close[t] + (1 − α) × EMA(N)[t−1]
            avec α = 2 / (N + 1)
```

Pour N = 20, α ≈ 0,0952 — la clôture du jour reçoit ~9,5 % du poids, l'EMA de la veille porte le reste. L'EMA réagit ~1–3 barres plus vite que la SMA de même longueur, c'est pourquoi elle apparaît à l'intérieur du [MACD](/blog/what-is-macd) (où la réactivité compte) mais pas comme filtre de tendance à 200 jours (où la stabilité prime).

| Fenêtre | Sens en barres quotidiennes | Usage typique |
|---|---|---|
| **5 périodes** | Une semaine de trading | Intraday ou swing trading ; rarement utilisée seule |
| **20 périodes** | Un mois de trading | Tendance court terme ; bande médiane des Bollinger |
| **60 périodes** | Un trimestre de trading | Régime moyen terme |
| **200 périodes** | ~10 mois de trading | Le filtre institutionnel « le marché est-il haussier ou baissier ? » |

## Que vous dit réellement la relation cours-MA ?

Trois états, trois lectures :

1. **Cours au-dessus de la MA, MA inclinée à la hausse.** Tendance haussière confirmée. Les replis vers la MA ont tendance à trouver du support. C'est le moment où les signaux de momentum (croisement doré du MACD, sorties RSI) affichent leur meilleur taux de réussite.
2. **Cours oscillant autour d'une MA plate.** Marché sans tendance, en range. Chaque croisement de la MA est un faux signal en puissance. Un [ADX](/blog/what-is-adx) en dessous de 20 confirme ce régime — désactivez tout suiveur de tendance jusqu'à ce que l'ADX remonte.
3. **Cours sous la MA, MA inclinée à la baisse.** Tendance baissière confirmée. Les rebonds vers la MA ont tendance à échouer. Le retail long-only devrait respecter cet état et s'écarter ; la MA vous dit que le chemin de moindre résistance est vers le bas.

Le test institutionnel standard « la tendance est-elle haussière ? » : **la clôture est-elle au-dessus de la SMA 200 jours, et la SMA 200 jours est-elle elle-même inclinée à la hausse ?** Deux oui = tendance haussière. Un oui / un non = candidate à un renversement précoce. Deux non = tendance baissière. Cette simple vérification filtre environ la moitié des faux positifs produits par les indicateurs de court terme.

## Pourquoi 20, 60 et 200 ?

Ce ne sont pas des chiffres magiques — ce sont des chiffres *consensuels*. Plusieurs décennies de convention chez les traders en ont fait les fenêtres par défaut de tout assistant IA de cotation, plateforme de graphiques et outil de courtage. Deux conséquences pratiques :

- **Valeur de coordination.** Parce que tout le monde regarde la 200 jours, la 200 jours compte. Quand le cours clôture sous la SMA 200 jours sur un indice majeur, les déclencheurs algorithmiques de risk-off s'allument dans les fonds systématiques. Le niveau est auto-renforçant.
- **Stabilité des backtests.** L'optimisation de période sur un seul instrument produit régulièrement des fenêtres à 17 ou 43 périodes qui paraissent meilleures in-sample et sous-performent out-of-sample. Rester sur les fenêtres standard évite de surajuster votre œil au bruit.

Utilisez les fenêtres standard. Ne dérogez que si vous disposez de preuves backtestées sur un marché ou un instrument qui se comporte systématiquement différemment.

## Quatre pièges classiques du retail

1. **Trader le croisement de MA comme un signal autonome.** Un croisement 20/60 a un edge mince en isolation — les taux de réussite historiques tournent autour du taux de victoire moyen des actions (donc le « signal » n'est que la dérive du marché). Il ne devient utile que combiné à un filtre de tendance et à un oscillateur de confirmation. Voir [le filtre à 3 indicateurs](/blog/three-indicator-filter).
2. **Choisir la fenêtre qui collait aux six derniers mois.** Les blogs retail qui recommandent 13 / 34 / 89 (suite de Fibonacci) ou une autre pile exotique surajustent généralement au bruit. Restez sur 20 / 60 / 200 sauf preuve out-of-sample du contraire.
3. **Ignorer la pente de la MA.** Une SMA 200 jours plate est un régime différent d'une SMA 200 jours inclinée à la hausse, même si le cours est au-dessus dans les deux cas. La direction de la pente est la moitié de l'information.
4. **Appliquer la SMA à des titres très volatils ou peu liquides.** Des clôtures aberrantes isolées (gap-up sur résultats, séances limit-up en actions A) font bouger la SMA de façon disproportionnée et produisent un biais sur les 20 barres suivantes. L'EMA est plus robuste aux outliers ; pour les titres peu liquides, préférez l'EMA ou utilisez un filtre médian.

## Comportement des moyennes mobiles sur les actions A

Les maths sont identiques, mais la microstructure du marché A modifie quelles MA fonctionnent :

- **Limites journalières (±10 % sur le marché principal, ±20 % sur ChiNext / STAR, ±5 % sur les actions ST).** Des séances limit-up consécutives créent un effet escalier dans la SMA qui surestime la force de la tendance pendant ~5 barres. Le limit-down fait l'inverse. Les tableaux de bord PickSkill marquent les barres limites comme neutres dans la [trace de signal sur 5 jours](/blog/5-day-signal-trail), pour qu'une série de séances limites ne produise pas de fausse classification en tendance forte.
- **Les suspensions de cotation (停牌)** peuvent durer des jours, voire des semaines. La plupart des flux de données comblent l'écart par la dernière clôture, ce qui fige la MA. À la reprise, la SMA redémarre de fait ; les signaux de tendance antérieurs à la suspension doivent être considérés comme obsolètes.
- **Convention MA10 / MA20 plus marquée.** La communauté retail des actions A regarde la MA 10 jours plus attentivement que la communauté américaine. Beaucoup de plateformes locales livrent par défaut une pile 5 / 10 / 20 / 60 ; la SMA 200 jours est culturellement moins ancrée. La MA 60 jours joue en pratique le rôle de filtre moyen terme.

Pour une comparaison marché par marché du comportement de chaque indicateur entre les actions américaines et les actions A, voir [MACD sur actions A vs actions américaines](/blog/macd-on-a-shares-vs-us).

> **Visualisez-le sur votre portefeuille.** La page [/indicators](/indicators) affiche la pile MA 20 / 60 / 200 sur chaque ligne, avec le statut du dernier croisement et la trace de régime de tendance sur 5 jours.

## Comment les MA s'articulent avec les autres indicateurs

Les MA sont la *couche filtre* ; les oscillateurs de momentum sont la *couche déclencheur*. La combinaison qui bat systématiquement chacun pris isolément :

| Couche | Outil | Question à laquelle elle répond |
|---|---|---|
| **Filtre de tendance** | Cours vs SMA 200 jours + pente | Y a-t-il une tendance ? Dans quelle direction ? |
| **Force de tendance** | [ADX](/blog/what-is-adx) | La tendance est-elle assez forte pour être tradée ? |
| **Déclencheur de momentum** | Croisement [MACD](/blog/what-is-macd), extrême [RSI](/blog/what-is-rsi) | Quand agir ? |
| **Enveloppe de volatilité** | [Bandes de Bollinger](/blog/what-is-bollinger-bands) | Quelle distance est trop grande ? |

La pile MA répond gratuitement à la première question, tous les jours. Sans elle, tous les autres indicateurs du graphique opèrent à l'aveugle.

## Pour aller plus loin

- [Moving Average sur Investopedia](https://www.investopedia.com/terms/m/movingaverage.asp) — référence complète couvrant SMA, EMA, WMA et variantes adaptatives.
- [Jack Schwager, *Technical Analysis*](https://www.amazon.com/dp/0470121351) — le chapitre 6 sur les systèmes de moyennes mobiles reste la référence du praticien.
- [Le cursus du CFA Institute sur les indicateurs de tendance](https://www.cfainstitute.org/) — pour le traitement académique.

## FAQ

**Faut-il utiliser SMA ou EMA ?**
Utilisez la SMA pour les filtres de tendance à fenêtre longue (200 jours) — la stabilité prime sur la réactivité et les clôtures aberrantes ont moins de chance de biaiser une moyenne longue. Utilisez l'EMA pour les outils de momentum à fenêtre courte (les 12 / 26 à l'intérieur du MACD, ou tout système 5–20 périodes) — la réactivité compte, et la pondération exponentielle de l'EMA suit mieux les cours récents. Ne vous torturez pas sur le choix pour des fenêtres moyennes ; à 60 périodes, l'écart est suffisamment petit pour se perdre dans le bruit du marché.

**Pourquoi la MA 200 jours est-elle autant scrutée ?**
Deux raisons : la coordination institutionnelle (les fonds systématiques s'en servent comme déclencheur de risk-off, ce qui lui donne une dynamique auto-réalisatrice à ce niveau) et des décennies de recherche empirique (Bauer & Dahlquist, Faber et d'autres ont montré que rester long quand le cours est au-dessus de la 200 jours et passer en cash quand il est en dessous produit des rendements proches du buy-and-hold avec un drawdown sensiblement plus faible). Le niveau compte parce que le marché agit comme s'il comptait.

**Puis-je optimiser la fenêtre MA pour mon titre préféré ?**
Vous le pouvez, mais vous ne devriez probablement pas. L'optimisation de fenêtre trouve de façon fiable des combinaisons qui paraissent excellentes sur la période in-sample et qui s'effondrent sur les 12 mois suivants. Restez sur les fenêtres standard (20 / 60 / 200) sauf raison structurelle spécifique — un titre à liquidité anormalement haute ou basse, un instrument à cycle saisonnier clair. Si vous optimisez, conservez les 30 % de données les plus récentes en hold-out et exigez que la fenêtre optimisée batte les fenêtres par défaut sur la période out-of-sample.

**La moyenne mobile est-elle un indicateur avancé ou retardé ?**
Retardé — par construction. Chaque terme de la formule MA est construit à partir de clôtures passées ; il n'y a pas de prévision dedans. C'est pour cela que les MA sont les plus utiles comme filtres (état du monde) plutôt que comme déclencheurs (quand agir). La MA vous dit que la tendance existe ; il vous faut un autre outil pour timer l'entrée.

**Pourquoi mes graphiques affichent-ils une valeur de MA différente de celle d'une autre plateforme ?**
Trois raisons fréquentes : (1) des définitions de fenêtre différentes (5 jours de trading vs 5 jours calendaires), (2) des points de départ différents pour l'initialisation de l'EMA (certaines plateformes l'amorcent à partir de la première clôture disponible, d'autres à partir d'une SMA des N premières barres), (3) des traitements différents des séances hors marché / limit-up / suspendues. Pour la cohérence, les [tableaux de bord PickSkill](/indicators) utilisent des fenêtres en jours de trading avec des EMA initialisées par SMA et excluent les barres suspendues de la moyenne — la même convention que dans les backtests académiques.
