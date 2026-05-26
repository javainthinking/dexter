---
title: >-
  Qu'est-ce que l'ATR (Average True Range) ? L'indicateur de volatilité qui
  dimensionne les positions
description: >-
  L'ATR mesure la volatilité moyenne par barre. Formule, pourquoi c'est le bon
  outil pour dimensionner les positions et placer les stops, le cadre
  ATR-multiple, et quatre pièges.
publishedAt: 2026-05-26T00:00:00.000Z
updatedAt: 2026-05-26T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    L'équipe de recherche PickSkill — un analyste IA pour les investisseurs
    particuliers.
pillar: explainer
tags:
  - ATR
  - Volatilité
  - Analyse technique
  - Dimensionnement de position
  - Indicateurs
heroImage: /blog/what-is-atr/hero.png
heroAlt: >-
  Infographie éditoriale — 4 titres ordonnés de faible ATR (KO) à fort ATR
  (small-cap), montrant comment des stops basés sur l ATR dimensionnent les
  positions selon la volatilité.
---

**L'Average True Range (ATR) est la moyenne du « true range » sur N barres, où le true range capture le plus grand entre (haut du jour − bas), (haut du jour − clôture de la veille), ou (clôture de la veille − bas du jour).** C'est l'indicateur le plus important que la plupart des investisseurs retail n'utilisent pas. L'ATR ne donne pas de signaux d'entrée. Il vous dit quelque chose de plus utile : *de combien cette action bouge dans une barre typique*, pour que vous puissiez dimensionner les positions et placer les stops d'une manière qui respecte la volatilité sous-jacente. Un stop de 1 % sur une action à ATR élevé et un stop de 1 % sur une action à ATR faible ne sont pas le même trade.

### Points clés

- **Formule** : `True Range = max(Haut − Bas, |Haut − Clôture Préc.|, |Bas − Clôture Préc.|)`. Puis `ATR(N) = moyenne du TR sur les N dernières barres`. N = 14 par défaut (lissage de Wilder).
- **L'ATR est en unités de dollars** (par exemple, 1,85 $), pas en pourcentage. La même action à différents prix a des ATR différents. ATR / Cours donne l'équivalent en pourcentage.
- **Dimensionnement de position** : une règle courante est « stop initial à 1× ATR, 0,5–1 % de risque portefeuille par trade ». ATR plus grand = position plus petite pour maintenir le risque en dollars constant.
- **Les régimes de volatilité changent.** L'ATR d'une action peut doubler en quelques mois autour des résultats, des chocs macro ou des news. Recalibrez les stops et le dimensionnement à mesure que le régime change.
- **L'ATR est neutre en direction.** Il ne dit rien sur la direction de l'action. Combinez-le avec la [pile MA](/blog/what-is-ma), [MACD](/blog/what-is-macd), ou autres outils directionnels.

## Comment calcule-t-on l'ATR ?

Le « true range » pour chaque barre gère proprement les gaps overnight :

```
TR[t] = max(
  Haut[t] − Bas[t],
  |Haut[t] − Clôture[t-1]|,
  |Bas[t]  − Clôture[t-1]|
)
```

Le premier terme est la fourchette intra-day de la barre. Les deuxième et troisième termes capturent respectivement les ouvertures en gap haussier et baissier, où le mouvement de cours réel depuis la clôture précédente était plus large que la fourchette propre de la barre. Le qualificatif « true » dans true range signifie : le plus grand mouvement plausible, incluant les gaps.

Ensuite l'ATR fait la moyenne sur N barres avec le lissage de Wilder (le même lissage exponentiel utilisé dans le [RSI](/blog/what-is-rsi)) :

```
ATR[t] = (ATR[t-1] × (N-1) + TR[t]) / N
```

N = 14 par défaut sur pratiquement toute plateforme. Le lissage de Wilder signifie que chaque nouveau TR a un poids de 1/N (~7,1 % à N = 14), avec le résiduel reporté.

## Que vous dit réellement l'ATR ?

L'ATR est un montant en dollars : « ATR de 1,85 $ sur une action à 100 $ » signifie que le mouvement typique de la barre (incluant les gaps overnight) est de 1,85 $. C'est plus directement utile que la volatilité en pourcentage pour plusieurs raisons :

- **Les stops sont des événements en dollars.** Que votre stop soit touché ou non dépend des mouvements en dollars, pas en pourcentage.
- **Le risque par action est la bonne unité pour le dimensionnement.** ATR en dollars = mouvement en dollars attendu par action = la bonne référence de risque par action.
- **La comparaison entre actions est plus honnête en ATR%.** Divisez l'ATR par le cours actuel pour obtenir l'ATR% — directement comparable entre actions à différents niveaux de prix.

| Action | Cours | ATR | ATR% | Interprétation |
|---|---|---|---|---|
| Mega-cap (ex. KO) | 60 $ | 0,45 $ | 0,75 % | Faible volatilité — grande activité stable |
| Tech large cap (ex. AAPL) | 180 $ | 2,40 $ | 1,3 % | Volatilité modérée |
| Nom de croissance (ex. PLTR) | 35 $ | 1,20 $ | 3,4 % | Volatilité plus élevée |
| Small cap | 25 $ | 1,30 $ | 5,2 % | Forte volatilité — stops plus larges nécessaires |

Le motif : les grandes activités stables ont une faible ATR% ; les noms small, croissance ou news-driven ont une forte ATR%. Les différences entre actions sont grandes et elles comptent pour le dimensionnement.

## Le cadre ATR-multiple pour les stops

L'usage pratique le plus courant de l'ATR est de placer les stop-loss initiaux à un multiple de l'ATR :

- **Stop à 1× ATR** : Serré. Utile pour les setups à forte conviction où vous voulez un minimum de marge pour le bruit. Touche le stop fréquemment.
- **Stop à 2× ATR** : Standard. La plupart des systèmes de swing trading utilisent 2× ATR par défaut. Filtre le bruit de routine ; attrape les vrais retournements.
- **Stop à 3× ATR** : Large. Utilisé pour les trades de position long terme où vous voulez survivre à des corrections modérées.

Exemple avec AAPL à 180 $, ATR = 2,40 $ :

| Stop | Distance du Stop | Prix du Stop | Risque par action |
|---|---|---|---|
| 1× ATR | 2,40 $ | 177,60 $ | 2,40 $ |
| 2× ATR | 4,80 $ | 175,20 $ | 4,80 $ |
| 3× ATR | 7,20 $ | 172,80 $ | 7,20 $ |

Pour un risque portefeuille de 1 % par trade sur un compte de 100 000 $ (budget de risque de 1 000 $) :

| Multiple de stop | Actions (risque = 4,80 $/action à 2× ATR) | Taille de position en dollars |
|---|---|---|
| 2× ATR (4,80 $ risque/action) | 1 000 $ / 4,80 $ = 208 actions | 208 × 180 $ = 37 440 $ |

Le cadre ATR-multiple dimensionne automatiquement des positions plus petites sur les actions à ATR élevé et plus grandes sur celles à ATR faible, maintenant le risque en dollars par trade constant. C'est l'amélioration significative la plus simple par rapport au dimensionnement à actions fixes ou à dollars fixes.

## Pourquoi les régimes de volatilité comptent

L'ATR n'est pas statique — il évolue dans le temps à mesure que le régime de volatilité change. Trois schémas à reconnaître :

1. **Expansion sur résultats** : l'ATR augmente typiquement de 50–100 % dans les 2–3 séances autour d'une publication de résultats, puis se réajuste. Les stops placés sur l'ATR pré-résultats peuvent être touchés par des mouvements de routine en journée de résultats.

2. **Expansion sur choc macro** : l'ATR de l'ensemble du marché s'élargit lors des pics du VIX (décisions de taux, événements géopolitiques, stress bancaire). Un ATR sur 14 barres reflétera cela dans les 7–10 séances ; les positions tenues à travers le régime devraient être redimensionnées.

3. **Compression avant breakout** : un ATR en baisse pendant de nombreuses semaines consécutives précède souvent un mouvement directionnel brusque. Le « squeeze ATR » se combine naturellement avec le [squeeze des bandes de Bollinger](/blog/what-is-bollinger-bands) — les deux mesurent le même phénomène d'enroulement.

Les tableaux de bord PickSkill font remonter l'ATR comme métrique suivie pour que vous puissiez voir les changements de régime d'un coup d'œil.

## Quatre pièges dans l'utilisation de l'ATR

1. **Placer des stops sans ATR.** Les stops à pourcentage fixe (par exemple, « toujours 5 % de stop ») ignorent le fait que 5 % sur une action calme et 5 % sur une action volatile sont très différents en termes de fréquence à laquelle le stop touche du bruit vs de vrais retournements. Les stops basés sur l'ATR sont conscients du bruit.

2. **Utiliser l'ATR pour la direction.** L'ATR est neutre en direction par construction — il vous dit de combien l'action bouge, pas dans quel sens. Traiter « ATR élevé » comme baissier ou « ATR faible » comme haussier est une erreur de catégorie. Combinez avec des outils directionnels.

3. **Ne pas ajuster l'ATR pour le régime.** L'ATR calculé sur les 14 dernières barres de marché calme sous-estime la volatilité à laquelle vous ferez face dans le prochain régime. Après un changement de régime (résultats, news, macro), donnez à l'ATR 7–10 barres pour refléter la nouvelle norme avant de dimensionner de nouvelles positions.

4. **Confondre ATR et volatilité réalisée (sigma).** Tous deux mesurent la volatilité mais avec des maths différentes. La volatilité réalisée est l'écart-type des rendements quotidiens et est ce qu'utilise le pricing d'options. L'ATR est l'average true range et est plus intuitif pour les stops et le dimensionnement. Ils s'accordent généralement sur la direction mais les chiffres ne sont pas interchangeables.

## Comment l'ATR s'intègre dans un workflow multi-signal

L'ATR est la couche de *volatilité* qui dimensionne tout le reste :

| Couche | Outil | Question à laquelle elle répond |
|---|---|---|
| **Direction** | Pile MA, [MACD](/blog/what-is-macd), filtre de tendance | Dans quel sens va le marché ? |
| **Setup** | [Divergence](/blog/what-is-divergence), [support/résistance](/blog/what-is-support-resistance) | Y a-t-il un pattern actionnable ? |
| **Déclencheur** | Croisement %K de %D, croisement de ligne MACD | Quand agir ? |
| **Volatilité / dimensionnement** | **ATR** | Quelle doit être la taille de la position ? Où placer le stop ? |
| **Confirmation** | [Volume](/blog/what-is-volume-analysis), [flux de capitaux](/blog/what-is-capital-flow) | Le mouvement est-il soutenu par la participation ? |

La couche la plus oubliée dans le trading retail est la volatilité. Sans elle, les tailles de position sont arbitraires et les stops sont soit trop serrés (whipsawed) soit trop larges (pertes surdimensionnées).

## Comportement de l'ATR sur les actions A

La microstructure du marché des actions A modifie l'interprétation de l'ATR :

- **Les jours limit-up/limit-down** plafonnent la fourchette de la barre au prix limite (±10 % sur le marché principal). Un jour limite, le true range est exactement le mouvement limite ; l'ATR calculé sur plusieurs jours limites consécutifs dépassera la vraie volatilité. Les tableaux de bord actions A PickSkill marquent les barres de jours limites comme outliers.
- **Le règlement T+1** comprime la volatilité intraday dans les ouvertures de la séance suivante. La fréquence des jours en gap sur les actions A est plus élevée que sur les large caps US ; la gestion des gaps dans la formule du true range compte davantage.
- **Les suspensions** créent des discontinuités. Les lectures d'ATR post-suspension devraient être décotées pour les 5–10 premières barres.

Voir [Meilleurs indicateurs pour les actions A](/blog/best-indicators-for-a-shares) pour le playbook plus large spécifique au marché.

> **Voyez l'ATR sur votre portefeuille.** Dans [/chat](/chat), demandez « pour chaque ligne, montre l'ATR actuel, l'ATR% et le changement vs moyenne sur 60 jours. Signale toutes les lignes où l'ATR dépasse de plus de 1,5× sa moyenne sur 60 jours — ce sont les noms en changement de régime qui nécessitent une recalibration de stop-loss ».

## Prompts de suivi courants

- *« Pour [ticker], calcule le stop à 2× ATR et dis-moi combien d'actions je devrais détenir pour un risque portefeuille de 1 %. »*
- *« Trouve les actions du S&P 500 où l'ATR s'est comprimé de 30 %+ sur les 8 dernières semaines — candidats au squeeze de Bollinger. »*
- *« Compare l'ATR actuel de mes lignes à leur fourchette sur 12 mois. Lesquelles sont à des extrêmes de basse volatilité (potentiel breakout) vs hautes (à éviter pour l'instant) ? »*
- *« Backteste un stop trailing à 2× ATR sur [ticker] sur les 5 dernières années. Comment se compare-t-il à un stop fixe à 5 % ? »*

## Pour aller plus loin

- [Investopedia sur l'ATR](https://www.investopedia.com/terms/a/atr.asp) — référence exhaustive.
- [J. Welles Wilder Jr., *New Concepts in Technical Trading Systems*](https://www.amazon.com/dp/0894590278) — traitement original du true range et de l'ATR par le développeur.

## FAQ

**Faut-il utiliser l'ATR ou l'écart-type pour la volatilité ?**
ATR pour les stops et le dimensionnement de position — il est en unités de dollars et directement applicable. Écart-type (ou volatilité réalisée annualisée, σ) pour le pricing d'options et l'analyse statistique — il est en unités de pourcentage et suppose la normalité. Les deux s'accordent généralement sur la direction mais répondent à des questions différentes.

**Quel est le bon multiple d'ATR pour les stops ?**
2× ATR est le point de départ le plus courant pour les swing trades. 1× ATR est serré (touches de stop fréquentes, adapté aux setups à très forte conviction). 3× ATR est large (utilisé pour les trades de position où vous voulez survivre à des corrections modérées). Le choix dépend de la durée de détention et de la tolérance personnelle au whipsaw vs aux pertes surdimensionnées.

**Pourquoi l'ATR est-il en unités de dollars au lieu de pourcentage ?**
L'ATR a été conçu par Wilder pour être appliqué aux futures sur matières premières, où le risque libellé en dollars est l'unité naturelle. Pour les actions, l'ATR en dollars reste la bonne unité pour les décisions de stops et de dimensionnement (votre stop est un événement en dollars, pas en pourcentage). Pour la comparaison entre actions, divisez l'ATR par le cours actuel pour obtenir l'ATR%.

**Comment l'ATR se rapporte-t-il à la largeur des bandes de Bollinger ?**
Tous deux mesurent la volatilité mais avec des formules différentes. La largeur de bande de Bollinger utilise l'écart-type des clôtures ; l'ATR utilise le true range (qui inclut les gaps). Quand les deux divergent (ATR en hausse mais largeur en baisse), cela signale généralement une volatilité tirée par les gaps — les fourchettes quotidiennes s'élargissent mais les *prix de clôture* restent dans une bande serrée. C'est un signal utile de détection de régime.

**Faut-il ajuster l'ATR pour les splits ?**
Oui — tout indicateur basé sur les prix par barre nécessite un ajustement pour les splits pour la comparaison historique. La plupart des plateformes gèrent cela automatiquement ; les calculs manuels d'ATR sur des données historiques brutes sans ajustement de split produiront de faux changements de régime aux dates de split. Les tableaux de bord PickSkill utilisent des prix ajustés des splits partout.
