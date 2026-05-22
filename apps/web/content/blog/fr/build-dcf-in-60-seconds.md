---
title: Comment construire un DCF en 60 secondes avec PickSkill — tutoriel pas à pas
description: Tutoriel en 4 étapes pour construire un DCF complet sur n'importe quel titre US, HK ou A-share en moins d'une minute — chaque hypothèse sourcée, chaque ligne reliée au 10-K, et l'Excel prêt à télécharger.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: L'équipe de recherche PickSkill — un analyste IA pour les investisseurs particuliers.
pillar: how-to
tags:
  - tutorial
  - dcf
  - valuation
  - workflow
heroImage: /blog/build-dcf-in-60-seconds/hero.png
heroAlt: Infographie éditoriale comparant le temps de construction d'un DCF dans Excel vs. PickSkill — une barre de 60 minutes à côté d'une minuscule barre de 60 secondes
---

Construire un DCF dans Excel à la main est un exercice d'une heure : récupérer quatre 10-K, copier les lignes, projeter cinq ans, estimer un [WACC](/blog/what-is-wacc), calculer la valeur terminale, monter la table de sensibilité. Ce tutoriel montre le même flux avec PickSkill en moins d'une minute — chaque input sourcé, chaque ligne reliée au filing, et l'Excel prêt à télécharger. Les mathématiques sont identiques à un calcul manuel ; ce qui change, c'est le temps passé à collecter les données par rapport au temps passé sur les jugements qui font vraiment bouger la réponse.

C'est un tutoriel en 4 étapes. Chaque étape est un prompt ou un clic. Si vous avez lu [Qu'est-ce que le DCF ?](/blog/what-is-dcf), vous avez le cadre — ce guide vous fait simplement passer dans le produit.

### Points clés

- **Quatre étapes, ~60 secondes.** Ouvrir un chat, coller le prompt, éditer n'importe quelle hypothèse en ligne, télécharger l'Excel.
- **Chaque input a une source.** Taux sans risque depuis la courbe Treasuries actuelle ; ERP et bêta sectoriel depuis le dataset trimestriel de Damodaran ; historique FCF depuis les quatre derniers 10-Q/10-K (source : SEC EDGAR).
- **Chaque hypothèse est modifiable.** Surchargez la croissance du CA, la marge EBIT terminale, le WACC ou la méthode de valeur terminale dans le même chat — PickSkill recalcule en direct.
- **Fonctionne sur US, Hong Kong et A-shares.** PickSkill tire le bon jeu de filings par marché.
- **La sortie est un vrai `.xlsx`** — pas une capture. Ouvrez-le dans Excel, partagez-le, collez-le dans votre deck.

## Pourquoi c'est important

La raison pour laquelle la plupart des investisseurs particuliers ne construisent pas de DCF, ce n'est pas la difficulté conceptuelle — c'est la friction. Le temps de trouver le dernier 10-K, télécharger les données supplémentaires et monter la feuille de projection, vous avez consommé une heure avant de toucher au premier jugement. PickSkill compresse cette heure à quelques secondes pour que vous passiez votre temps là où ça compte : sur les quatre hypothèses qui font vraiment bouger la valorisation (croissance du CA, marge terminale, WACC, valeur terminale — voir [Qu'est-ce que le DCF ?](/blog/what-is-dcf)).

Une règle raisonnable : si un DCF doit décider si vous agissez sur une position, les hypothèses méritent au moins 20 minutes de réflexion. Passer 60 minutes en plomberie de données n'est pas un investissement dans la qualité — c'est un impôt. Ce tutoriel supprime cet impôt.

## Le flux en 4 étapes

### Étape 1 — Ouvrir un chat

Allez sur [/chat](/chat). Si vous n'êtes pas connecté, c'est un clic — gratuit à essayer, pas de carte bancaire.

### Étape 2 — Demander le DCF

Collez ce prompt (remplacez le ticker par celui que vous étudiez) :

```text
Construis un DCF à 5 ans pour NVDA dans Excel.
Inclus : feuille d'hypothèses, projection FCF 5 ans, WACC avec sensibilité,
et une synthèse de valorisation avec le prix par action implicite.
Dis-moi les quatre inputs auxquels je dois faire attention.
```

C'est tout. Pas de pré-configuration de ticker, pas de sélection de template, pas de formulaire champ par champ.

### Étape 3 — Attendez ~30 secondes pendant que PickSkill travaille

PickSkill exécute, dans l'ordre :
1. Récupère le dernier 10-K plus les quatre 10-Q précédents sur [SEC EDGAR][edgar] (ou HKEx / Cninfo pour les noms HK / A-shares).
2. Extrait les lignes du compte de résultat, du tableau de flux et du bilan.
3. Calcule l'historique [FCF](/blog/what-is-fcf) (OCF − Capex) pour les quatre derniers exercices.
4. Récupère le rendement du Treasury 10 ans actuel comme taux sans risque.
5. Récupère l'ERP sectorielle et le bêta sectoriel les plus récents de Damodaran.
6. Construit le WACC.
7. Projette les cinq prochaines années en utilisant les taux de croissance historiques comme point de départ.
8. Calcule la valeur terminale en Gordon Growth et multiple de sortie.
9. Écrit le résultat dans un `.xlsx` avec des liens de formules entre feuilles.

[edgar]: https://www.sec.gov/edgar

Vous verrez un résumé en streaming pendant l'exécution, chaque filing récupéré étant lié. À la fin, vous obtenez un lien de téléchargement valable 7 jours, plus un walk-through dans le chat des quatre hypothèses.

### Étape 4 — Éditer n'importe quelle hypothèse, recalculer en direct

C'est là que le vrai travail commence. Chacune des quatre hypothèses qui font bouger le DCF est éditable en ligne :

```text
Pousse la marge EBIT terminale à 38% et recalcule la table de sensibilité.
```

```text
Utilise l'ERP implicite (4,2%) au lieu de l'historique et montre-moi le nouveau
WACC et comment il change le prix implicite.
```

```text
Stress-test sur la croissance du CA — baisse Y4 et Y5 à 10% et montre-moi le
scénario baissier.
```

PickSkill recalcule le même template Excel avec les nouveaux inputs et vous donne le diff. Pas de re-upload, pas d'enfer de template.

> **Essayez maintenant.** [Ouvrez un chat](/chat) et collez le prompt de l'Étape 2. Toute la boucle dure moins d'une minute.

## À quoi ressemble la sortie

Le `.xlsx` téléchargé contient quatre feuilles :

| Feuille | Contenu |
|---|---|
| **Assumptions (Hypothèses)** | Croissance du CA (Y1–Y5), trajectoire de marge EBIT, taux d'imposition, capex / CA, ΔBFR, inputs du WACC, méthode de valeur terminale. Chaque cellule annotée de sa source. |
| **Projection** | Année par année : CA, EBIT, NOPAT, capex, ΔNWC, FCF, FCF actualisé. Formules liées à Assumptions. |
| **Sensitivity (Sensibilité)** | Grille `(WACC, croissance terminale)` montrant le prix implicite sur ±150 bp de WACC et ±100 bp de croissance terminale. Cellule du cas de base mise en évidence. |
| **Summary (Synthèse)** | Conclusion — prix implicite (base, bas, haut) vs. cours actuel ; les quatre hypothèses en ligne ; lien vers le prompt qui a généré le fichier. |

Ouvrez-le dans Excel ou Google Sheets. Les formules sont vivantes ; surchargez n'importe quoi et la projection se met à jour.

## Prompts de suivi utiles

Une fois le cas de base posé, ces prompts déplacent l'aiguille :

- *« Ajoute un cinquième niveau de détail — montre-moi le chemin du CA actuel au CA de l'année 5, décomposé par segment. »*
- *« Lance un DCF inversé — quelle croissance de CA le cours actuel implique-t-il ? »*
- *« Compare mon DCF au consensus. Où mes hypothèses sont-elles plus tendues / plus laxistes que la moyenne sell-side ? »*
- *« Convertis ce DCF en one-pager pour un lecteur non technique. Inclus les cas haussier / baissier / base en une phrase chacun. »*
- *« Fais maintenant le même DCF pour AMD et mets les deux sur une feuille pour comparer. »*

Chacun déclenche une recalcul ; l'Excel est régénéré avec le nouveau contenu.

## Ce qui n'est pas faisable en 60 secondes

Réserves honnêtes :

- **Projections segmentaires sur mesure** qui exigent de modéliser l'unit economics (prix × volume × géographie par ligne de produit) prennent en général plus de 60 secondes. PickSkill peut le faire — il faut juste 3 à 5 minutes d'aller-retour pour décrire la segmentation.
- **DCFs M&A à fortes synergies** nécessitent un modèle de deal en parallèle du DCF standalone ; les parties standalone sont en 60 secondes, la logique du deal est une autre conversation.
- **Noms sans filings récents** (IPO récente, émetteur étranger coté aux US) peuvent avoir une série historique par défaut plus mince. PickSkill vous le dit et propose d'utiliser des estimations.
- **Décisions plus lourdes que le modèle.** Un DCF est un cadre, pas un oracle. Utilisez ce tutoriel pour retirer la friction de plomberie, pas pour externaliser le jugement.

## FAQ

**Dois-je téléverser des données ?**
Non. PickSkill tire tout de sources publiques (SEC EDGAR pour US, HKEx pour Hong Kong, Cninfo pour A-shares) + flux de données marché. L'upload n'est pertinent que si vous voulez superposer votre propre modèle privé ou vos notes.

**Quelle est la précision des hypothèses par défaut ?**
Les défauts sont sourcés et volontairement neutres — c'est un point de départ, pas une réponse finale. Croissance par défaut = CAGR sur 3 ans ; marge EBIT terminale par défaut = moyenne 3 ans ; WACC tiré en direct des tables sectorielles de Damodaran. Le but de l'Étape 4 est précisément d'écraser les défauts avec votre vision.

**Puis-je sauvegarder le DCF et y revenir plus tard ?**
Oui — la session de chat persiste. Rouvrez la conversation et demandez « recalcule le DCF avec le dernier 10-Q que je viens de voir » et PickSkill reprend là où vous l'aviez laissé, avec le nouveau filing intégré.

**Ça marche sur HK et A-shares ?**
Oui. PickSkill reconnaît les tickers HKEx (ex. `9988.HK`, `0700.HK`) et A-shares (`600519.SS`, `000333.SZ`) et récupère les filings adaptés par marché (annuel / intérimaire / trimestriel). Pour les A-shares, le taux sans risque par défaut est le CGB 10 ans ; pour HKEx, c'est le Treasury 10 ans (la plupart des HKEx étant en pratique valorisés contre la courbe dollar).

**Et la comparaison au consensus ?**
Ajoutez *« …et compare chaque input aux estimations consensus »* au prompt initial. PickSkill tire le consensus des flux de marché et vous montre quelles hypothèses sont à, au-dessus ou en-dessous de la moyenne sell-side. Le pont entre votre vision et le consensus est l'endroit où vit la majeure partie de l'alpha — et de la majeure partie du risque.

**Où apprendre le cadre DCF lui-même ?**
Commencez par [Qu'est-ce que le DCF ?](/blog/what-is-dcf) pour le cadre de valorisation absolue, [Qu'est-ce que le WACC ?](/blog/what-is-wacc) pour le taux d'actualisation qui décide silencieusement de tout, et [Qu'est-ce que le FCF ?](/blog/what-is-fcf) pour la couche de projection des flux. Pour les 10-K qui fournissent les inputs, [Lire un 10-K en 30 minutes](/blog/how-to-read-10k) est le guide compagnon. Ce tutoriel suppose ces cadres ; il ne les remplace pas.
