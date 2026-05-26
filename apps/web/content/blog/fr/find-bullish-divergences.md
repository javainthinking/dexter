---
title: Comment trouver les divergences haussières sur un portefeuille en 30 secondes
description: >-
  Le tableau de bord divergence de PickSkill scanne chaque position pour les 4
  types de divergence sur MACD, RSI et KDJ — ne faisant remonter que les pivots
  bien définis. Workflow en 4 étapes.
publishedAt: 2026-05-25T00:00:00.000Z
updatedAt: 2026-05-25T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    L'équipe de recherche PickSkill — un analyste IA pour les investisseurs
    particuliers.
pillar: how-to
tags:
  - Tutoriel
  - Divergence
  - Analyse technique
  - Workflow
  - Portefeuille
heroImage: /blog/find-bullish-divergences/hero.png
heroAlt: >-
  Infographie éditoriale — tableau de bord des divergences listant les tickers
  avec leur type (regular/hidden bullish/bearish), l accord multi-oscillateurs
  et la fraîcheur du pivot.
---

**Trouver une divergence à la main, c'est lent — vous tracez des pivots dans le cours, vous tracez des pivots correspondants dans le MACD ou le RSI, vous vérifiez s'ils ne s'accordent pas, et vous répétez pour chaque titre du portefeuille.** La plupart des investisseurs particuliers abandonnent après 3–5 noms. Le tableau de bord divergence de PickSkill fait tourner ce scan sur chaque position en 30 secondes, applique des règles de pivot confirmé (pas de biais rétrospectif) et ne fait remonter que les titres où le motif est bien défini. Ce tutoriel passe en revue l'usage productif du tableau de bord — pas seulement le clic, mais la transformation de la sortie en décisions réelles.

### Points clés

- **4 étapes, ~30 secondes.** Ouvrir le tableau de bord divergence, scanner la liste active, creuser les candidats, superposer des filtres supplémentaires avant d'agir.
- **Le tableau de bord scanne 4 types de divergence sur 3 oscillateurs** — haussière / baissière classique et haussière / baissière cachée sur [MACD](/blog/what-is-macd), [RSI](/blog/what-is-rsi) et [KDJ](/blog/what-is-kdj).
- **Seuls les pivots confirmés comptent.** Un pivot doit avoir au moins N barres de chaque côté qui ne le dépassent pas — pas de biais rétrospectif consistant à tracer des lignes après coup.
- **La divergence multi-oscillateurs est la variante à plus fort edge.** Quand la même divergence apparaît dans deux des trois oscillateurs, le signal est sensiblement plus fiable que dans un seul.
- **La divergence cachée est traitée comme un signal de première classe** — la plupart des plateformes retail l'enterrent ; PickSkill la met explicitement en avant.

## Pourquoi ce workflow compte

La divergence est l'un des outils d'analyse technique les plus sur-promis. Les guides retail revendiquent régulièrement une précision de 70 %+ ; les backtests sur la divergence brute s'établissent plus près de 35–45 %. L'écart, c'est le filtrage — la divergence est une *condition*, pas un *signal*, et elle ne devient fiable que superposée à des filtres de tendance et des événements de confirmation.

Le workflow basé sur le tableau de bord rend le filtrage praticable. Sans outil qui fait remonter toutes les divergences sur toutes les positions simultanément, vous ne pouvez pas appliquer le filtre multi-oscillateurs (qui requiert de vérifier trois oscillateurs sur chaque titre). Avec l'outil, le filtre prend un clic. L'économie du filtrage en couches bascule en votre faveur.

Pour le concept sous-jacent, voir [Qu'est-ce qu'une divergence ?](/blog/what-is-divergence).

## Le workflow en 4 étapes

### Étape 1 — Ouvrir le tableau de bord divergence

Allez sur [/indicators](/indicators) et sélectionnez la dimension divergence. Le tableau de bord scanne chaque position dans votre portefeuille par défaut sur les quatre types de divergence dans MACD, RSI et KDJ.

La sortie est un tableau triable :

| Colonne | Sens |
|---|---|
| Ticker | La position |
| Type | Haussière classique / baissière classique / haussière cachée / baissière cachée |
| Oscillateur(s) | Quel(s) indicateur(s) montre(nt) la divergence — MACD, RSI, KDJ ou une combinaison |
| Âge du pivot | Combien de barres en arrière s'est formé le second pivot (plus récent = signal plus frais) |
| Force | Magnitude du désaccord (plus large = signal plus fort) |
| Régime de tendance | Lecture [ADX](/blog/what-is-adx) au moment de la divergence — la divergence en marchés tendanciels est plus fiable |

Le tri par défaut est par *force combinée × fraîcheur × accord multi-oscillateurs*. Les signaux les plus forts apparaissent en haut.

### Étape 2 — Scanner les motifs à forte conviction

Trois motifs précis à chercher, par ordre d'edge :

1. **Haussière classique multi-oscillateurs sur titres survendus.** Divergence haussière classique dans deux des trois oscillateurs (par exemple MACD + RSI), sur un titre où le RSI est en dessous de 35 ou le KDJ en dessous de 25, dans un régime de marché avec ADX au-dessus de 25. Cette combinaison a historiquement délivré les meilleurs rendements forward de tous les motifs de divergence.
2. **Haussière cachée en tendances haussières confirmées.** Divergence haussière cachée sur un titre au-dessus de sa SMA 200 jours avec la 200 jours toujours inclinée à la hausse. Le motif haussier caché attrape la reprise de tendance après un repli — statistiquement plus fiable que d'attraper les renversements.
3. **Baissière classique multi-oscillateurs sur titres surachetés.** Le miroir du motif 1, utilisé pour la gestion du risque (alléger l'exposition long) plutôt que pour shorter. Détecter tôt une divergence baissière dans vos propres positions est l'un des usages à plus fort levier du tableau de bord.

Sautez :

- **Divergence sur oscillateur unique sur titres avec [ADX](/blog/what-is-adx) en dessous de 20.** Les marchés en range génèrent en continu des divergences de basse qualité. Le tableau de bord les fait remonter ; ignorez-les.
- **Divergence avec âge de pivot > 10 barres.** Les pivots plus anciens ont été intégrés. Les signaux de divergence se dégradent vite — les signaux frais (âge de pivot 1–5 barres) sont là où se trouve l'alpha.

### Étape 3 — Creuser le candidat

Cliquez sur un nom dans le tableau de bord pour ouvrir le détail d'indicateurs par position. Vous devez vérifier :

1. **Les pivots sont réels.** Regardez le graphique et confirmez les deux pivots dans le cours et les deux pivots correspondants dans l'oscillateur. La détection de pivots de PickSkill est automatisée, mais la vérification à l'œil attrape les cas limites (jours de gap, barres limit-up en actions A, pics de jour de résultats).
2. **Le régime de tendance est le bon.** [ADX](/blog/what-is-adx) au-dessus de 25, pile MA alignée, niveau de [support / résistance](/blog/what-is-support-resistance) à proximité. Une divergence à un niveau de support majeur est sensiblement plus forte qu'une divergence au milieu d'un range.
3. **Le volume confirme.** [Flux de capitaux](/blog/what-is-capital-flow) en tendance haussière pendant que le cours grappille latéralement est le bon contexte pour une divergence haussière ; flux en tendance baissière sur des plus hauts de cours est le bon contexte pour une divergence baissière.

Ces vérifications prennent ~30 secondes par candidat. Après elles, le taux de faux positifs chute sensiblement.

### Étape 4 — Superposer un filtre supplémentaire avant d'agir

Une divergence est un *déclencheur de watchlist*, pas un déclencheur d'entrée. Attendez un événement confirmateur avant de dimensionner :

- **Divergence haussière** : attendez que la ligne MACD croise au-dessus de la ligne signal, ou que le RSI croise 50 par le bas, ou que le cours casse au-dessus d'un plus haut de swing récent.
- **Divergence baissière** : attendez que la ligne MACD croise sous la ligne signal, ou que le RSI croise 50 par le haut, ou que le cours casse sous un plus bas de swing récent.

L'événement confirmateur vous dit *quand* le mouvement démarre. Sans lui, vous achetez ou vendez dans une condition qui peut persister pendant des semaines.

> **Essayez maintenant.** [Ouvrez /indicators](/indicators) et sélectionnez la vue divergence. Même sur un portefeuille de 5 positions, vous verrez probablement au moins une divergence active par semaine — le volume d'opportunité est plus élevé que la plupart des investisseurs retail ne le réalisent une fois le scan automatisé.

## Ce que le tableau de bord attrape et que le scan manuel rate

Trois motifs précis bénéficient massivement de l'automatisation :

### 1. La divergence cachée

La plupart des plateformes de graphiques retail enterrent la divergence cachée — l'inversion de pivots est plus difficile à repérer à l'œil, et la plupart des guides AT se concentrent sur la divergence classique. PickSkill traite la divergence cachée comme un signal de première classe, mise en avant avec la même importance que la divergence classique. Étant donné que la divergence cachée a le meilleur dossier empirique pour la continuation de tendance, c'est la variante à laquelle vous devriez prêter *plus* d'attention, pas moins.

### 2. L'accord multi-oscillateurs

Le scan à la main attrape rarement une divergence dans deux oscillateurs simultanément — il faudrait vérifier MACD, puis RSI, puis KDJ sur chaque titre, et la charge cognitive fait qu'on s'arrête à la première divergence vue. Le tableau de bord fait remonter la divergence multi-oscillateurs comme une ligne distincte, donc la variante à plus fort edge est visible d'un coup d'œil.

### 3. Le balayage transverse au portefeuille

Le scan à la main marche pour 1–3 noms. Le tableau de bord PickSkill scanne tout votre portefeuille (et si vous le demandez, toutes vos watchlists) dans la même vue. Le balayage attrape des signaux sur des titres auxquels vous n'auriez pas pensé à vérifier — les opportunités que vous trouvez sur des titres que vous aviez déjà abandonnés.

## Quatre pièges dans l'usage du tableau de bord divergence

1. **Traiter la divergence comme un bouton acheter / vendre.** C'est une condition. Attendez toujours un événement confirmateur (croisement [MACD](/blog/what-is-macd), sortie du [RSI](/blog/what-is-rsi) hors d'un extrême, cassure de niveau) avant de dimensionner.
2. **Agir sur chaque divergence que le tableau de bord fait remonter.** Le tableau de bord remonte intentionnellement tous les candidats, y compris les faibles. Filtrez par régime de tendance (ADX > 25), accord multi-oscillateurs, pivots frais et confirmation suracheté / survendu avant d'agir.
3. **Garder à travers l'invalidation.** Les trades de divergence ont des niveaux d'invalidation précis — si le cours casse le plus bas de swing qui définissait le pivot de divergence haussière, le trade est faux. Honorez l'invalidation ; ne moyennez pas à la baisse.
4. **Oublier le dimensionnement de position.** Même les divergences à forte conviction échouent à des taux significatifs. Dimensionnez les positions pour survivre aux cas d'échec — ne dimensionnez jamais comme si la divergence était une certitude.

## Comportement de la divergence sur les actions A

Le tableau de bord gère spécifiquement la microstructure des actions A :

- **Les jours limit-up / limit-down** sont marqués comme outliers et exclus de la détection de pivots. Sans ce filtre, le prix limite devient un pivot artificiel qui produit de fausses divergences.
- **Les suspensions** créent des gaps dans les données ; les pivots qui enjambent une suspension sont marqués comme suspects et remontés avec un avertissement.
- **Bruit de fond plus élevé** : les actions A se traitent avec une volatilité quotidienne sensiblement plus élevée. Le tableau de bord utilise une fenêtre de détection de pivots plus large (N=5 vs N=3 sur barres quotidiennes US) pour les valeurs A afin de filtrer les micro-swings.

Pour plus sur la gestion marché par marché, voir [Meilleurs indicateurs pour les actions A](/blog/best-indicators-for-a-shares).

## Workflows de suivi fréquents

Une fois que vous avez un candidat depuis le tableau de bord divergence, les prochains mouvements naturels :

- *« Montre-moi la même détection de divergence sur toute ma watchlist, pas seulement le portefeuille actuel. »*
- *« Filtre les divergences actives à seulement celles avec ADX au-dessus de 25 et la MA 200 jours inclinée à la hausse. »*
- *« Backtest ce motif de divergence — quel est le taux de réussite historique sur ce ticker précis sur les 5 dernières années ? »*
- *« Génère un plan d'entrée pour le candidat top divergence — prix d'entrée, niveau de stop, cible, taille de position. »*
- *« Fais une watchlist de chaque position en divergence active depuis plus de 5 jours sans résolution — ce sont les setups les plus longuement enroulés. »*

## Pour aller plus loin

- [Qu'est-ce qu'une divergence ?](/blog/what-is-divergence) — le concept sous-jacent et les quatre types.
- [Le filtre à 3 indicateurs](/blog/three-indicator-filter) — combiner la divergence avec [ADX](/blog/what-is-adx) et une confirmation de momentum.
- [Constance Brown, *Technical Analysis for the Trading Professional*](https://www.amazon.com/dp/0071596666) — référence praticien sur les motifs de divergence.

## FAQ

**À quelle fréquence le tableau de bord fait-il remonter une divergence ?**
Sur un portefeuille de 10 positions, vous verrez 2–5 divergences actives dans une semaine typique. La divergence multi-oscillateurs (variante à plus fort edge) est plus rare — peut-être une par semaine pour 10 positions. La divergence cachée apparaît plus souvent dans les marchés clairement tendanciels et moins souvent dans les marchés erratiques.

**Faut-il prendre chaque divergence comme un trade ?**
Non. Le tableau de bord fait remonter des *candidats* ; le filtrage se fait ensuite. Superposez régime de tendance, accord multi-oscillateurs, pivots frais et événements confirmateurs avant d'agir. Le filtrage réduit le nombre de trades de 60–80 % mais relève sensiblement l'edge par trade.

**Quelle est la différence entre divergence classique et cachée ?**
La divergence classique est un avertissement de renversement (le cours fait un nouvel extrême ; l'indicateur non). La divergence cachée est un signal de continuation (le cours fait un plus bas plus haut dans une tendance haussière ; l'indicateur fait un plus bas plus bas). Les deux motifs sont mathématiquement symétriques mais ont des implications opposées. La divergence cachée a le meilleur dossier empirique en marchés tendanciels.

**Pourquoi le tableau de bord montre-t-il parfois une divergence sur des titres qui ne bougent pas ?**
La divergence est une *condition*, pas une garantie de mouvement. Beaucoup de divergences se résolvent par une lente dérive plutôt que par un renversement net. Le tableau de bord fait remonter la condition ; que le mouvement se concrétise dépend de l'arrivée de l'événement confirmateur. C'est pour cela que la discipline d'attendre la confirmation compte plus que la discipline de repérer la divergence.

**Puis-je recevoir des alertes email quand une nouvelle divergence se forme dans mon portefeuille ?**
La fonctionnalité de workflows planifiés (en cours de design, voir le [document de design des workflows](/blog)) le supportera — scans quotidiens ou horaires qui vous envoient un email quand de nouvelles divergences apparaissent. Pour l'instant, le tableau de bord est à la demande : ouvrez-le quand vous voulez le scan, et vous obtenez l'état actuel.
