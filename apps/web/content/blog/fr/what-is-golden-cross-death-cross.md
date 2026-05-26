---
title: >-
  Qu'est-ce qu'un croisement doré (et un croisement de la mort) ? Le signal MA
  50/200 expliqué
description: >-
  Un croisement doré, c'est la MA 50 jours qui passe au-dessus de la MA 200
  jours. Formule, taux de réussite historiques, pourquoi le croisement seul est
  surcoté, et comment l'utiliser correctement.
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
  - Croisement doré
  - Croisement de la mort
  - Moyenne mobile
  - Analyse technique
heroImage: /blog/what-is-golden-cross-death-cross/hero.png
heroAlt: >-
  Infographie éditoriale — la MM 50 jours croise au-dessus de la MM 200 jours ;
  la variante underwater (la MM 200 jours encore en pente descendante) est mise
  en évidence.
---

**Un croisement doré, c'est l'instant où une moyenne mobile de court terme (typiquement la 50 jours) passe au-dessus d'une moyenne mobile de long terme (typiquement la 200 jours). Un croisement de la mort est l'inverse — la MA courte qui passe en dessous de la longue.** Les médias financiers adorent ces croisements parce qu'ils font de bons titres. Les backtests montrent que le signal brut est plus proche d'un tirage à pile ou face que les manchettes ne le laissent croire. Le croisement ne devient utile que lorsqu'on comprend de quelle version on parle et dans quel état est la tendance sous-jacente.

### Points clés

- **Définition standard** : la SMA 50 jours croise la SMA 200 jours à la clôture quotidienne. Certaines plateformes utilisent EMA(50) / EMA(200) ; la différence est mince.
- **Le taux de réussite historique du croisement doré est modéré, pas magique.** Sur le S&P 500 depuis 1950, les croisements dorés ont précédé des rendements à 12 mois d'environ 10–12 % — proches de la moyenne de long terme du marché. L'asymétrie vient d'un petit nombre de gros gagnants.
- **Le croisement doré « underwater » compte.** Quand le croisement se produit alors que la 200 jours est encore inclinée à la baisse, la tendance n'a pas encore tourné — vous attrapez le *premier signe* d'un retournement possible, pas un retournement confirmé. PickSkill signale ces cas explicitement via le signal *croisement doré underwater*.
- **Les croisements de la mort signalent un changement de régime plus fiablement que les croisements dorés.** Les drawdowns suivant les croisements de la mort ont atteint en moyenne ~6–10 % avant reprise ; ils fonctionnent mieux comme filtres de risk-off que comme déclencheurs de short.
- **Affichés sur le tableau de bord MA de [/indicators](/indicators)** pour chaque ligne en portefeuille, avec l'historique des croisements et l'état underwater explicitement marqués.

## Comment fonctionne mécaniquement le croisement doré ?

Deux moyennes mobiles, deux pentes, un point de croisement.

| Composant | Formule | Sens |
|---|---|---|
| MA courte | `SMA(close, 50)` | ~2,5 mois de clôture — la tendance moyen terme |
| MA longue | `SMA(close, 200)` | ~10 mois de clôture — la tendance long terme |
| Croisement | La MA courte passe de sous à au-dessus de la MA longue | « La tendance moyen terme est désormais plus forte que la tendance long terme » |

Le croisement doré se produit sur une barre précise — le jour où la MA courte croise la longue par le bas. Avant cette barre, la courte était en dessous de la longue ; après, elle est au-dessus. Le croisement est la discontinuité ; qu'elle tienne ou non dépend de ce qui suit.

La même logique s'applique à d'autres paires de fenêtres (20/60, 5/20 pour les horizons plus courts), mais la 50/200 est de loin la plus scrutée parce qu'elle répond à la question qui intéresse les desks de risque institutionnels : « la photo moyen terme est-elle devenue positive par rapport à la photo long terme ? »

## Pourquoi le croisement compte (et pourquoi il est surcoté)

Le croisement compte parce que deux mécanismes structurels le renforcent :

1. **Des règles systématiques de risk-on / risk-off l'utilisent.** Une part non négligeable des fonds suiveurs de tendance et des stratégies CTA tradent sur des règles simples de croisement de MA. Quand le S&P 500 croise sa 200 jours par le bas, ces fonds réallouent vers les actions. Le flux est réel et auto-réalisateur le jour du croisement — c'est pourquoi le volume bondit souvent autour des croisements dorés sur indices majeurs.
2. **Les médias financiers l'amplifient.** Les titres « le S&P 500 confirme un croisement doré » attirent les flux retail. Que le signal « fonctionne » ou non, l'attention déplace du capital marginal.

Il est surcoté parce que le croisement brut a un edge out-of-sample plus faible qu'on ne le croit :

- Sur les indices actions mondiaux depuis 1970, le rendement médian à 12 mois suivant un croisement doré est à peu près égal au rendement à 12 mois inconditionnel du même indice. La moyenne est tirée vers le haut par un petit nombre de gros gagnants, ce qui signifie que le résultat *typique* est sans relief.
- Les croisements sont fortement dépendants de la trajectoire antérieure. Un croisement au *creux* d'un gros drawdown (« premier croisement après un bear market ») a des rendements forward sensiblement meilleurs qu'un croisement pendant une longue tendance haussière. Le titre « croisement doré » traite les deux à l'identique.

C'est ici que le qualificatif *underwater* prend tout son sens.

## Qu'est-ce qu'un croisement doré « underwater » — et pourquoi est-ce la variante à la plus forte valeur ?

La SMA 200 jours possède elle-même une pente. Le croisement peut se produire dans deux régimes :

| Variante | Pente de la 200 jours au moment du croisement | Interprétation |
|---|---|---|
| **Croisement doré underwater** | Inclinée **à la baisse** | La tendance n'a pas encore tourné ; c'est le *premier signe* qu'une cassure de la tendance baissière est possible |
| **Croisement doré standard** | Inclinée **à la hausse** | La tendance était déjà haussière ; c'est un signal de continuation après un repli |

La version underwater a historiquement produit les rendements forward les plus forts — elle capture un changement de régime, pas une continuation de régime. C'est aussi la plus rare des deux : sur les principaux indices américains, les croisements dorés underwater se produisent 2 à 4 fois par décennie, typiquement à la fin de drawdowns majeurs. En attraper quelques-uns sur une carrière de 20 ans est plus précieux que de réagir à chaque croisement de continuation.

Le tableau de bord *top des croisements dorés* de PickSkill scanne toutes les lignes pour ce motif précis — MA courte au-dessus de la MA longue, mais MA longue toujours inclinée à la baisse. C'est un filtre volontairement étroit qui fait remonter le petit nombre de titres affichant la variante à plus fort edge.

## Comment interpréter un croisement de la mort ?

Un croisement de la mort est l'événement symétrique : la SMA 50 jours croise la SMA 200 jours par le haut. L'interprétation standard est « la tendance moyen terme a basculé par rapport à la tendance long terme ».

Deux points pratiques sous-estimés dans les guides retail :

- **Les croisements de la mort sont en général tardifs, pas précoces.** Quand le croisement s'imprime, le marché a souvent déjà chuté de 15–25 % depuis son sommet. Traiter le croisement de la mort comme un « signal de vente » au moment du croisement, c'est vendre le bas d'une phase, pas le haut.
- **Leur usage à plus forte valeur est en filtre de risque côté long, pas en déclencheur de short.** « Si le S&P clôture sous sa SMA 200 jours, je ramène l'exposition actions long-only à 50 % » est une règle défendable, soutenue par des décennies de données de drawdown. « Vendre à découvert le S&P sur un croisement de la mort » a un profil rendement/risque nettement moins bon, en raison de la dispersion des rendements forward.

## Quatre pièges dans l'interprétation des croisements

1. **Traiter le croisement comme binaire.** Le croisement est un instant ; les tendances sont des processus. Un croisement suivi d'un retour immédiat de l'autre côté de la ligne (« whipsaw ») est fréquent dans les marchés erratiques et produit des faux signaux à la chaîne.
2. **Ignorer la pente de la MA longue.** Un croisement avec la MA longue plate est beaucoup moins informatif qu'un croisement avec la MA longue elle-même qui retourne à la hausse. La combinaison *croisement + changement de pente de la MA longue* est le setup à plus fort edge.
3. **Appliquer le croisement à des titres bruyants.** Le croisement 50/200 est le plus fiable sur les indices larges et les grandes capitalisations à tendances lisses. Sur les small caps avec des gaps fréquents, le croisement se déclenche à répétition sans contenu informationnel.
4. **Oublier que le croisement est un signal dérivé.** Le croisement est construit à partir du cours ; il ne peut rien vous dire de plus que ce qui est déjà dans le graphique. La confirmation par le volume, la confirmation par la largeur de marché (combien de sous-composants croisent aussi), et le contexte macro ajoutent tous de l'information que le croisement seul ne peut fournir.

## Comportement des croisements sur les actions A

Le croisement SMA 50/200 est culturellement moins ancré dans la communauté retail des actions A qu'aux États-Unis. La convention locale met davantage l'accent sur le croisement 20/60 et sur le croisement 5/10 quotidien pour le swing trading. Deux effets structurels à garder en tête :

- **Les limites journalières** créent des effets escalier dans la 50 jours comme dans la 200 jours pendant les mouvements en série. Les séries limit-up retardent le croisement visible de 1–3 barres par rapport à un marché libre. Le croisement lui-même se produit toujours le bon jour ; ce sont les moyennes mobiles qui retardent pendant la phase limite.
- **Rotation de la composition des indices.** Les indices d'actions A sont reconstitués plus agressivement que les indices américains. Un croisement sur un indice A peut refléter en partie un changement de composition plutôt qu'un changement de tendance — pour les signaux sur titre individuel le croisement n'est pas affecté, mais pour l'indice large il vaut la peine de vérifier si une date de reconstitution est proche.

Pour la vue marché par marché plus large, voir [Meilleurs indicateurs pour les actions A](/blog/best-indicators-for-a-shares) et [MACD sur actions A vs actions américaines](/blog/macd-on-a-shares-vs-us).

> **Suivez-le sur votre portefeuille.** La page [/indicators](/indicators) affiche le statut du croisement 50/200 sur chaque ligne, avec l'état *underwater* signalé lorsque la MA longue est encore inclinée à la baisse. La trace sur 5 jours montre l'évolution du statut de croisement au fil de la semaine boursière.

## Comment utiliser le croisement dans un vrai workflow

Le croisement est le plus utile comme l'un des entrants d'un filtre multi-signaux, pas comme déclencheur autonome. Un workflow pragmatique :

1. **Utilisez le croisement pour définir le régime.** L'allocation long-only est active quand le cours est au-dessus de la SMA 200 jours *et* que la SMA 50 jours est au-dessus de la SMA 200 jours. Réduisez ou couvrez quand les deux conditions tombent.
2. **Utilisez la variante *underwater* comme déclencheur de watchlist.** Quand un titre individuel imprime un croisement doré underwater, ce titre passe de « ignorer » à « candidat à la recherche ». Confirmez par un travail fondamental avant de dimensionner la position.
3. **Utilisez le croisement de la mort comme filtre de risque au niveau du portefeuille.** Passez d'une exposition agressive à défensive quand l'indice large imprime un croisement de la mort ; faites l'inverse quand l'indice repasse au-dessus de sa SMA 200 jours et imprime un nouveau croisement doré.

Le croisement est un filtre pour *quand regarder*, pas un déclencheur pour *quoi faire*. Associez-le au [MACD](/blog/what-is-macd) pour la confirmation de momentum, au [RSI](/blog/what-is-rsi) pour le contexte sur/survendu et à un travail fondamental pour le dimensionnement.

## Pour aller plus loin

- [Investopedia sur le croisement doré](https://www.investopedia.com/terms/g/goldencross.asp) — référence complète avec exemples historiques.
- [Meb Faber, *A Quantitative Approach to Tactical Asset Allocation*](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=962461) — le papier académique canonique montrant que des règles simples de croisement de MA produisent une surperformance ajustée du risque dans le temps.

## FAQ

**Le croisement doré fonctionne-t-il vraiment ?**
Le croisement 50/200 brut a historiquement produit des rendements forward à 12 mois en gros en ligne avec le rendement inconditionnel du marché — proche d'un tirage à pile ou face par signal. Le signal ne devient significativement positif que combiné à l'état *underwater* (MA longue encore inclinée à la baisse), à la confirmation par le volume et à la confirmation par la largeur de marché. Traitez le croisement comme un déclencheur de watchlist et un filtre de régime, pas comme un bouton « acheter ».

**Un croisement 50/200 est-il différent d'un croisement 20/60 ?**
Oui — des horizons différents répondent à des questions différentes. Le 50/200 (≈2,5 mois vs ≈10 mois) parle du régime moyen vs long terme ; le 20/60 (≈1 mois vs ≈3 mois) parle du momentum court vs moyen terme. Le 20/60 produit des signaux plus fréquents mais un edge par signal plus faible. La plupart des cadres de risque institutionnels utilisent le 50/200 ; les swing traders surveillent le 20/60 ou le 5/20.

**Quelle est la différence entre un croisement doré et un croisement haussier de moyennes mobiles ?**
Les termes sont souvent utilisés indifféremment, mais à proprement parler : « croisement doré » désigne spécifiquement le croisement SMA 50/200 sur un graphique en barres quotidiennes. Toute autre paire de fenêtres (10/20, 20/60, 5/13) est un « croisement haussier de moyennes mobiles » mais pas un croisement doré. La distinction compte surtout dans les titres des médias financiers, qui réservent « croisement doré » à l'événement 50/200.

**Pourquoi le croisement est-il « tardif » ?**
Les deux entrants sont des indicateurs retardés. La SMA 50 jours reflète les dix dernières semaines de clôture ; la 200 jours reflète les dix derniers mois. Quand la courte croise la longue, le cours sous-jacent est en général en mouvement depuis plusieurs semaines. Le croisement est un événement de *confirmation*, pas d'*anticipation*. Si vous voulez des signaux plus précoces, il vous faut des indicateurs avancés (profil de volume, skew des options, divergence de breadth) — mais ceux-ci ont leurs propres problèmes de faux positifs.

**Puis-je trader des options sur un croisement doré ?**
C'est possible, mais la structure est inconfortable. Le croisement est un événement à basse fréquence (quelques fois par an sur un même ticker, peut-être hebdomadaire sur un portefeuille de 50 noms), et la volatilité implicite autour du croisement intègre souvent déjà un certain niveau de reconnaissance de tendance. Acheter des calls *au moment du croisement* paie souvent une prime pour le titre médiatique. La variante à plus fort edge consiste à se positionner avant le croisement, en utilisant le setup *underwater* et une lecture RSI survendue comme déclencheur de watchlist.
