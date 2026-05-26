---
title: Comment exporter un rapport de portefeuille en Excel en 60 secondes
description: >-
  Générez un classeur Excel multi-feuilles depuis votre portefeuille PickSkill —
  positions, indicateurs, valorisation, traces de signaux. Vraies formules,
  tableaux triables, prêt à partager.
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
  - Excel
  - Portefeuille
  - Export
  - Workflow
heroImage: /blog/export-portfolio-report-to-excel/hero.png
heroAlt: >-
  Infographie éditoriale — maquette de tableur avec plusieurs onglets de
  feuilles (Holdings · Indicators · Signal Trail · Valuation · Trade Log) et
  cellules en mise en forme conditionnelle.
---

**Un vrai classeur Excel avec analyse de portefeuille, ça voulait dire une heure à tirer tickers et cours, une heure à croiser les indicateurs, et une troisième heure à formater la sortie pour qu'elle soit utilisable par quelqu'un d'autre.** Ce tutoriel montre le même workflow en 60 secondes — chaque cellule sourcée sur données live, chaque formule réelle, chaque feuille structurée comme les analystes partagent vraiment des classeurs. Le `.xlsx` téléchargé est un fichier de travail : ouvrez-le, triez n'importe quelle colonne, montez des tableaux croisés dynamiques, partagez avec un collègue. Rien n'est une capture ; rien n'est un dump à plat.

C'est un tutoriel en 4 étapes. Chaque étape est un prompt ou un clic. Si vous avez un portefeuille configuré dans PickSkill, vous pouvez faire tourner tout le flow en moins d'une minute.

### Points clés

- **4 étapes, ~60 secondes.** Ouvrir le portefeuille, cliquer export, choisir Excel, rafraîchir dans votre tableur préféré.
- **Chaque valeur est sourcée sur données live** — cours depuis les flux marché, indicateurs calculés sur la dernière clôture, financiers depuis les filings les plus récents.
- **Le classeur est multi-feuilles et structuré pour le filtrage** — Positions, Indicateurs, Trace de signaux, Valorisation, Journal de trades à remplir.
- **Compatible avec Excel, Google Sheets, LibreOffice Calc, Numbers.** Format OpenXML de bout en bout — pas de verrou plateforme.
- **Marche sur les positions US, HK et actions A** avec des conventions de marché adaptées par feuille.

## Pourquoi c'est important

Excel reste le format d'échange universel pour l'analyse de portefeuille. Les PDF sont en lecture seule ; les decks de présentation ont la forme d'une présentation ; un fil de chat ne se trie pas. Le classeur Excel est le seul format sur lequel vous pouvez réellement *travailler* de façon collaborative — monter des tableaux croisés dynamiques, ajouter des colonnes, croiser avec vos propres données.

PickSkill compresse l'étape d'assemblage du classeur en un seul clic pour que votre temps retourne à l'analyse. Trois cas d'usage immédiats :

- **Votre tableau de bord personnel de portefeuille.** Sauvegardez le classeur, ré-exportez chaque semaine, et vous avez une trace glissante de l'évolution des indicateurs.
- **Partage avec des collaborateurs.** Amis, club d'investissement, partenaire — quiconque ayant Excel peut ouvrir et contribuer au même fichier.
- **Construire votre propre analyse personnalisée par-dessus.** Le classeur exporté est votre point de départ ; superposez vos propres colonnes, scénarios et notes sans reconstruire la base.

## Le workflow en 4 étapes

### Étape 1 — Ouvrir le portefeuille à exporter

Allez sur [/portfolios](/portfolios). Choisissez le portefeuille à transformer en classeur. (Pour une configuration initiale, voir [Suivre un portefeuille avec des indicateurs](/blog/track-a-portfolio-with-indicators).)

Le classeur scale bien sur tailles de portefeuille — d'une watchlist de 3 noms à un livre diversifié de 50. Les plus gros portefeuilles produisent une feuille Indicateurs plus épaisse mais la structure reste cohérente.

### Étape 2 — Cliquer « Exporter vers Excel »

La page de détail du portefeuille a un groupe de boutons « Exporter vers le chat » dans l'en-tête. Cliquez sur le bouton Excel. PickSkill ouvre un chat avec un prompt pré-rempli qui inclut le contexte du portefeuille.

Le prompt par défaut produit un classeur à 5 feuilles. Pour personnaliser avant d'envoyer :

- **Ajouter ou retirer des indicateurs précis** : « Inclus uniquement MACD, RSI et la pile MA — saute Bollinger et KDJ. » Utile quand le public ne connaît pas certains indicateurs.
- **Ajouter des fondamentaux** : « Inclus les 4 derniers trimestres de CA et BPA par position. » La feuille fondamentaux apparaît dans le classeur.
- **Ajouter des scénarios** : « Ajoute une feuille scénarios avec cibles haussier / base / baissier par position. » Une feuille scénarios vide est ajoutée à remplir.

### Étape 3 — Attendre ~30 secondes pendant que PickSkill assemble le classeur

PickSkill exécute, dans l'ordre :

1. Tire le cours actuel, les métriques intraday et la série historique de cours (6 mois par défaut) pour chaque position.
2. Fait tourner la suite complète d'indicateurs ([MACD](/blog/what-is-macd), [RSI](/blog/what-is-rsi), [KDJ](/blog/what-is-kdj), [Bandes de Bollinger](/blog/what-is-bollinger-bands), [ADX](/blog/what-is-adx), pile MA, [volume](/blog/what-is-volume-analysis), [flux de capitaux](/blog/what-is-capital-flow)).
3. Détecte l'état de signal actuel et la trace de classification sur 5 jours par dimension.
4. Tire les multiples et ratios de valorisation (P/E, P/B, EV/EBITDA, rendement du dividende).
5. Rend toutes les valeurs dans un classeur multi-feuilles structuré.
6. Ajoute des formules Excel pour croiser entre feuilles afin que les changements se propagent.
7. Écrit le résultat dans un fichier `.xlsx` avec sparklines intégrées et mise en forme conditionnelle.

Vous verrez un résumé en streaming. À la fin, vous obtenez un lien de téléchargement valable 7 jours.

### Étape 4 — Ouvrir dans Excel et personnaliser

Le `.xlsx` téléchargé est un vrai fichier de travail. Ouvrez-le dans n'importe quel tableur. Éditions immédiates fréquentes :

- **Trier par force de signal** — cliquez sur l'en-tête de colonne du champ score de classification.
- **Ajouter une colonne notes** — chaque feuille a une colonne notes à droite pour les annotations personnelles.
- **Construire un tableau croisé dynamique** — pivot des positions par secteur ou classification de signal pour une autre vue des données.
- **Ajouter vos propres colonnes** — le classeur est conçu pour l'extension ; rien ne casse quand vous ajoutez des champs.

Pour des éditions plus lourdes, retournez dans le chat et demandez une mise à jour précise :

```text
Ajoute une feuille montrant la performance 1 mois, 3 mois et 6 mois
de chaque position contre le benchmark SPY.
```

```text
Refais la feuille indicateurs avec un schéma de couleurs heatmap — vert
pour classification haussière, rouge pour baissière, orange pour neutre.
```

```text
Ajoute une feuille screen qui flag chaque position avec divergence active
sur MACD ET RSI ET KDJ simultanément.
```

PickSkill ré-exécute l'assemblage du classeur avec la nouvelle structure et vous donne un téléchargement frais.

> **Essayez maintenant.** [Allez sur /portfolios](/portfolios), cliquez dans n'importe quel portefeuille, et cliquez « Exporter vers Excel ». Tout le tour dure moins d'une minute.

## À quoi ressemble la sortie

La structure par défaut en 5 feuilles :

| Feuille | Contenu |
|---|---|
| **1. Positions** | Une ligne par position — ticker, nom, marché, poids, cours actuel, variation du jour, variation 5 jours, variation 1 mois, valeur de position, notes. Triable. |
| **2. Indicateurs** | Une ligne par (position × indicateur) — valeur actuelle, libellé de classification, trace de classification sur 5 jours, annotation de signal. Croisements avec la feuille Positions. |
| **3. Trace de signaux** | Une ligne par position — l'évolution complète sur 5 jours à travers les 8 dimensions d'indicateurs, avec les transitions de classification mises en évidence. |
| **4. Valorisation** | Une ligne par position — P/E, P/E forward, P/B, EV/EBITDA, rendement du dividende, médianes sectorielles pour comparaison. |
| **5. Journal de trades** | Feuille vide pré-formatée — colonnes date, ticker, action, quantité, prix, motif. Pour votre propre journal de trading, pré-remplie avec la liste des positions. |

Les feuilles sont liées : changer un ticker dans la feuille Positions (par exemple renommer un en-tête de colonne) ne casse pas les croisements dans les autres feuilles. Ajouter des lignes au Journal de trades n'invalide pas le reste du classeur.

## Prompts de suivi utiles

Une fois le classeur de base posé, ces prompts apportent le plus de valeur :

- *« Ajoute une feuille Risque — métriques de concentration, expositions sectorielles, matrice de corrélation entre positions. »*
- *« Ajoute une feuille Watchlist avec 10 tickers que je pourrais ajouter à ce portefeuille, classés par leur setup technique actuel. »*
- *« Ajoute une feuille Macro — VIX, taux 10 ans, dollar index, pétrole — pour corréler le comportement du portefeuille avec les drivers macro. »*
- *« Convertis les libellés de classification d'indicateurs en scores numériques (−2 à +2) pour calculer des moyennes de signal au niveau portefeuille. »*
- *« Fais le même classeur pour un autre portefeuille et fusionne les deux pour comparer côte à côte. »*

Chaque prompt déclenche une nouvelle génération de classeur.

## Ce qui n'est pas faisable en 60 secondes

Réserves honnêtes :

- **Architectures de formules personnalisées.** Si vous avez besoin d'une structure de formules Excel précise (plages nommées avec conventions spécifiques, références entre classeurs, VBA personnalisé), vous les ajouterez manuellement par-dessus l'export.
- **Mises à jour temps réel.** Le classeur est une photo au moment de l'export. PickSkill ne pousse pas de mises à jour live dans un fichier Excel déjà ouvert. Pour rafraîchir, ré-exportez depuis le chat — 30 secondes.
- **Scripts VBA / macros lourds.** La sortie, ce sont des données et des formules. Les macros, rubans personnalisés et logique conditionnelle en VBA restent des ajouts manuels.
- **Connexion directe à votre compte de courtage.** PickSkill ne tire pas de données de position live depuis des courtiers tiers ; la liste des positions vient du portefeuille que vous maintenez manuellement dans [/portfolios](/portfolios).

## Comment ça marche sous le capot

Pour les curieux techniques :

- PickSkill assemble d'abord la structure du classeur (liste des feuilles, colonnes, valeurs de données et formules).
- Les données de chaque feuille sont générées en utilisant la même logique backend qui alimente les tableaux de bord [/indicators](/indicators).
- Le fichier `.xlsx` est écrit au format OpenXML — chaque cellule, formule, mise en forme conditionnelle et sparkline est un vrai objet Excel.
- Les références entre feuilles utilisent la notation A1 standard pour fonctionner dans n'importe quel tableur compatible.

La sortie se comporte comme un classeur construit à la main pour l'édition et le partage mais est générée en quelques secondes.

## FAQ

**Faut-il avoir Excel installé pour utiliser la sortie ?**
Non — le fichier `.xlsx` s'ouvre dans Excel, Google Sheets, LibreOffice Calc, Apple Numbers ou tout outil compatible OpenXML. Toutes les formules standard (SUM, AVERAGE, IF, INDEX, MATCH) fonctionnent à travers ces outils ; PickSkill évite les fonctions spécifiques Excel dans l'export par défaut.

**Les formules se mettent-elles à jour en direct quand j'ouvre le classeur ?**
Les formules se mettent à jour contre les propres cellules du classeur (les changements sur une cellule se propagent aux cellules dépendantes). Elles ne récupèrent *pas* de données marché fraîches en live — ce serait demandé une connexion de données active. Pour rafraîchir les données sous-jacentes, ré-exportez depuis le chat.

**Puis-je partager le classeur avec quelqu'un qui n'a pas de compte PickSkill ?**
Oui — le classeur est un fichier autonome. Une fois téléchargé, partagez-le comme vous partagez normalement des fichiers Excel (email, drive cloud, Slack). Le destinataire n'a pas besoin de compte PickSkill pour ouvrir ou utiliser le fichier.

**Cela marche-t-il pour les portefeuilles avec actions A ou HK ?**
Oui. Le classeur reconnaît les tickers HKEx (`9988.HK`, `0700.HK`) et actions A (`600519.SS`, `000333.SZ`) et applique des conventions adaptées au marché. Les barres de jour limite (actions A) sont marquées dans la feuille Trace de signaux pour que les signaux techniques de ces barres soient traités comme outliers.

**Comment faire pour que ce classeur se mette à jour automatiquement chaque semaine ?**
Deux options. La voie simple : marquez la session de chat en favori et relancez le prompt d'export chaque semaine — PickSkill reconstruit le fichier avec les données fraîches. La voie plus automatisée (en cours de design) : des workflows planifiés qui ré-exécutent l'export à intervalle régulier et vous envoient le fichier mis à jour par email — voir le [document de design des workflows](/blog) pour la fonctionnalité à venir.

**Puis-je ajouter mes propres indicateurs personnalisés au classeur ?**
La feuille Indicateurs est structurée pour que vous puissiez ajouter des colonnes pour vos propres métriques sur la droite. Les croisements entre feuilles ne casseront pas. Pour que PickSkill calcule la métrique à votre place, demandez dans le chat — la plupart des variantes courantes (périodes d'indicateurs différentes, seuils de classification différents, signaux personnalisés) peuvent être ajoutées sur demande.
