---
title: Comment exporter l'analyse d'un portefeuille en PowerPoint en 60 secondes
description: >-
  Générez un PPTX prêt à présenter depuis votre portefeuille PickSkill — chaque
  graphique sourcé, chaque slide éditable. 4 étapes, un prompt, pensé pour la
  présentation live.
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
  - PowerPoint
  - Portefeuille
  - Export
  - Workflow
heroImage: /blog/export-portfolio-to-powerpoint/hero.png
heroAlt: >-
  Infographie éditoriale — une pile de miniatures de diapositives représentant
  le deck investisseur de 10 pages généré automatiquement, avec un tableau de
  synthèse des positions en couverture.
---

**Un vrai deck PowerPoint à partir d'une analyse de portefeuille, ça voulait dire une heure dans Excel à tirer des graphiques, une heure dans PowerPoint à mettre en page, et une troisième heure à corriger le formatage dès que quelqu'un relisait.** Ce tutoriel montre le même workflow en 60 secondes — chaque graphique sourcé sur des données live, chaque slide mise en page selon les conventions de design des desks de recherche professionnels, et le fichier `.pptx` prêt à télécharger, éditer et présenter. Les maths derrière l'analyse sont identiques à ce que vous construiriez à la main ; ce qui change, c'est le temps que vous passez à assembler par rapport au temps que vous passez en réunion.

C'est un tutoriel en 4 étapes. Chaque étape est un prompt ou un clic. Si vous avez déjà un portefeuille configuré dans PickSkill, vous pouvez faire tourner tout le flow en moins d'une minute.

### Points clés

- **4 étapes, ~60 secondes.** Ouvrir votre portefeuille, cliquer export, choisir PPT, éditer les titres de slides.
- **Chaque graphique est sourcé sur des données live.** Les indicateurs tournent sur la dernière clôture ; les financiers tirent du dernier filing ; les multiples de valorisation reflètent le consensus actuel.
- **Le PPTX est un vrai fichier PowerPoint** — pas une capture, pas un PDF. Ouvrez-le, éditez n'importe quelle slide, présentez depuis PowerPoint ou Keynote.
- **Marche sur les positions US, HK et actions A.** Le deck adapte titres et tournures d'analyste aux marchés que contient votre portefeuille.
- **La sortie inclut une structure par défaut de 10 slides** — couverture, synthèse des positions, signaux techniques, photo de valorisation, détail par ligne, alertes risque et annexe.

## Pourquoi c'est important

La raison pour laquelle la plupart des investisseurs particuliers ne partagent pas leur analyse, c'est que la *couche de présentation* est friction. Le temps d'avoir construit l'analyse que vous voulez partager, vous n'avez plus la patience pour l'assemblage du deck qui la rendrait partageable. Résultat : beaucoup de bon travail privé qui n'est jamais mis à l'épreuve par d'autres regards.

PickSkill compresse l'étape d'assemblage du deck en un seul clic pour que votre temps retourne à l'analyse. Trois publics en bénéficient :

- **Votre futur vous-même.** Sauvegarder une position dans un artefact présentable crée une trace que vous pourrez relire dans trois mois.
- **Toute personne avec qui vous discutez positions.** Amis, club d'investissement, partenaire qui gère le livre familial. Un deck rend la conversation plus structurée qu'un fil de chat.
- **Un futur employeur ou un comité d'entretien.** Analystes en herbe : un deck poli sur un portefeuille réel est l'objet d'entretien le plus crédible que vous puissiez apporter.

## Le workflow en 4 étapes

### Étape 1 — Ouvrir le portefeuille à exporter

Allez sur [/portfolios](/portfolios). Choisissez le portefeuille à transformer en deck — ou créez-en un de zéro en ajoutant 3–10 positions. (Pour une configuration initiale, voir [Suivre un portefeuille avec des indicateurs](/blog/track-a-portfolio-with-indicators).)

Le deck est conçu pour des portefeuilles de 3–15 positions. En dessous de 3, le deck est mince ; au-dessus de 15, la section par ligne devient trop longue pour une présentation typique de 20 minutes.

### Étape 2 — Cliquer « Exporter vers PowerPoint »

La page de détail du portefeuille a un groupe de boutons « Exporter vers le chat » dans l'en-tête. Cliquez sur le bouton PowerPoint. PickSkill ouvre un chat avec un prompt pré-rempli qui inclut l'état actuel de votre portefeuille — positions, dernières lectures d'indicateurs, changements de signaux récents, et tous les flags de divergence.

Vous pouvez éditer le prompt avant d'envoyer. Deux modifications fréquentes :

- **Changer la locale** : le titre du deck et les en-têtes de chapitre prennent par défaut la langue de votre compte. Si le deck est pour un public précis (présentation en anglais à une équipe US, en chinois à des lecteurs continentaux), ajustez en conséquence.
- **Ajouter un accent personnalisé** : « Concentre la section technique sur les divergences et conditions de suracheté » ou « Mets en avant la narration FCF » — PickSkill pondère la composition du deck vers votre accent.

### Étape 3 — Attendre ~30 secondes pendant que PickSkill assemble le deck

PickSkill exécute, dans l'ordre :

1. Tire le cours actuel, la dernière clôture et l'historique 6 mois pour chaque position.
2. Fait tourner la suite complète d'indicateurs ([MACD](/blog/what-is-macd), [RSI](/blog/what-is-rsi), [KDJ](/blog/what-is-kdj), [Bandes de Bollinger](/blog/what-is-bollinger-bands), [ADX](/blog/what-is-adx), pile MA, [volume](/blog/what-is-volume-analysis), [flux de capitaux](/blog/what-is-capital-flow)) sur chaque position.
3. Détecte les motifs de signal actifs (croisement doré, divergence, proximité support / résistance, changements de classification sur la fenêtre 5 jours).
4. Tire les photos de valorisation (P/E, EV/EBITDA, P/B) et la synthèse financière la plus récente.
5. Rend les graphiques d'indicateurs comme images intégrées.
6. Génère le contenu du deck avec les conventions de design d'une présentation de recherche éditoriale.
7. Compose le fichier `.pptx` avec graphiques intégrés, tableaux formatés et titres de slides éditables.

Vous verrez un résumé en streaming pendant l'exécution. À la fin, vous obtenez un lien de téléchargement valable 7 jours.

### Étape 4 — Éditer n'importe quelle slide, relancer pour des sections précises

Le `.pptx` téléchargé est un vrai fichier PowerPoint. Ouvrez-le dans PowerPoint, Keynote ou Google Slides. Chaque titre de slide, chaque légende de graphique et chaque tableau est directement éditable.

Pour des éditions plus profondes, retournez dans le chat et demandez des changements précis :

```text
Refais la slide des signaux techniques. Mets en avant les trois positions
avec divergence active et rétrograde les autres en un seul bullet de synthèse.
```

```text
Ajoute une slide sur les tendances de flux de capitaux. Pour chaque position,
montre si le flux net a été positif ou négatif sur les 5 dernières séances.
```

```text
Compresse les slides de détail par ligne — une slide par position au lieu de deux,
en ne montrant que la trace de classification technique et le dernier graphique
d'indicateurs.
```

PickSkill ré-exécute l'assemblage du deck avec le nouvel accent et vous donne un téléchargement frais.

> **Essayez maintenant.** [Allez sur /portfolios](/portfolios), cliquez dans n'importe quel portefeuille, et cliquez « Exporter vers PowerPoint ». Tout le tour dure moins d'une minute.

## À quoi ressemble la sortie

La structure par défaut en 10 slides :

| Slide | Contenu |
|---|---|
| **1. Couverture** | Nom du portefeuille, date, nombre de positions, valeur totale, performance en titre |
| **2. Synthèse des positions** | Tableau de toutes les positions — ticker, poids, cours actuel, rendement 1J / 5J / 1M, marché |
| **3. Vue d'ensemble des signaux techniques** | Tableau type heat-map montrant la classification de chaque position sur les 8 dimensions d'indicateurs |
| **4. Alertes actives** | Positions avec changements de signaux matériels — croisements dorés frais, flags de divergence, lectures survendues |
| **5. Photo de valorisation** | P/E, P/B, EV/EBITDA des positions vs médianes sectorielles |
| **6–8. Détail par ligne** | Pour chaque position (ou chaque position à plus fort poids si le portefeuille est large) : le graphique de cours avec les MA clés, le récit du signal dominant, la trace de classification sur 5 jours |
| **9. Alertes risque** | Risque de concentration, biais sectoriels, avertissements de divergence, et toute position s'approchant d'un support / résistance clé |
| **10. Annexe** | Sources de données, définitions d'indicateurs, horodatages, disclaimer |

Les slides utilisent un système typographique cohérent, une palette de couleurs alignée à la marque et des graphiques intégrés (pas des descriptions textuelles de graphiques). Le résultat est prêt à présenter sans travail de formatage par slide.

## Prompts de suivi utiles

Une fois le deck de base posé, ces prompts déplacent l'aiguille :

- *« Ajoute une slide one-pager pour le cas haussier et une slide pour le cas baissier sur la plus grosse position. »*
- *« Transforme la vue d'ensemble des signaux techniques en format feu tricolore — uniquement des points vert / orange / rouge. »*
- *« Ajoute une slide d'annexe montrant l'historique complet de classification sur 5 jours pour chaque position. »*
- *« Fais une version de ce deck en mandarin pour un public sinophone. »*
- *« Génère le même contenu en document Word pour quelqu'un qui préfère la prose aux slides. »* (Voir [Générer un deck investisseur depuis un chat](/blog/generate-investor-deck-from-chat) pour les arbitrages de format.)

Chaque prompt déclenche une nouvelle génération de deck avec la nouvelle structure.

## Ce qui n'est pas faisable en 60 secondes

Réserves honnêtes :

- **Templates de design personnalisés.** Le deck utilise le propre template de design de PickSkill. Vous pouvez éditer librement le contenu des slides, mais des templates d'entreprise fortement brandés (polices personnalisées, placement du logo, systèmes de couleurs précis) requièrent une configuration manuelle post-export. La plupart des thèmes PowerPoint s'appliquent proprement au deck exporté via Design → Variantes.
- **Slides de prévision / projection.** Le deck montre l'état *actuel* et les signaux *récents* — il ne prédit pas où vont les cours ensuite. Les prévisions requièrent des prompts explicites et du contexte supplémentaire.
- **Modélisation de synergies pour M&A.** Si vous utilisez le deck dans un contexte de pitch de deal, les slides par ligne couvrent le cas standalone ; la modélisation des synergies spécifiques au deal nécessite sa propre conversation.

## Comment ça marche sous le capot

Pour les curieux techniques :

- PickSkill compile d'abord la structure des slides (un squelette JSON avec specs de graphiques, contenu textuel et indications de mise en page).
- Chaque graphique est rendu en PNG haute résolution en utilisant le même code d'indicateurs qui alimente le tableau de bord [/indicators](/indicators).
- Le fichier PPTX est assemblé programmatiquement au format OpenXML — chaque forme, tableau et image est un vrai objet PowerPoint, pas une rastérisation plate.
- Les titres de slides et le corps de texte sont liés à la sortie d'analyse du modèle, donc éditer dans le chat ré-exécute l'analyse et produit un deck frais.

Le résultat se comporte comme un deck construit à la main pour l'édition mais est généré en quelques secondes.

## FAQ

**Faut-il avoir PowerPoint installé pour utiliser la sortie ?**
Non — le fichier `.pptx` s'ouvre dans PowerPoint, Keynote, Google Slides, LibreOffice Impress, ou tout outil compatible PPTX. Même sans PowerPoint, toute suite Office-compatible moderne rend le fichier correctement.

**Puis-je éditer individuellement les graphiques du deck ?**
Les graphiques sont intégrés comme images — ils peuvent être déplacés, redimensionnés et remplacés, mais pas restylés directement dans PowerPoint. Pour changer un graphique, retournez dans le chat et demandez le re-rendu avec le nouveau style (horizon différent, indicateur différent, etc.). Le nouveau graphique sera intégré au prochain export.

**Cela marche-t-il pour les portefeuilles avec actions A ou HK ?**
Oui. PickSkill reconnaît les tickers HKEx (par ex. `9988.HK`, `0700.HK`) et actions A (`600519.SS`, `000333.SZ`) et tire les bonnes sources de données par marché. Le deck s'adapte : les positions actions A reçoivent la surcouche d'interprétation [MACD sur actions A](/blog/macd-on-a-shares-vs-us) ; les barres de jour limite sont marquées comme outliers dans les sections techniques.

**Combien de temps le lien de téléchargement est-il valide ?**
7 jours. Le fichier lui-même est permanent une fois téléchargé — re-générez depuis le chat à tout moment si vous voulez une version rafraîchie. L'URL de téléchargement est rattachée à votre compte ; la partager avec quelqu'un hors de votre compte ne fonctionne pas.

**Puis-je générer le même deck dans une autre langue ?**
Oui — ajoutez « en [langue] » au prompt. PickSkill prend en charge les 8 locales utilisées sur le reste de la plateforme (anglais, chinois simplifié, chinois traditionnel, japonais, coréen, allemand, français, espagnol). Les libellés des axes de graphiques et la terminologie de classification d'indicateurs sont traduits aux côtés des titres et du corps des slides.

**Puis-je sauvegarder le deck et y revenir plus tard ?**
Oui — la session de chat persiste. Rouvrez la conversation et demandez « re-génère le deck avec les données du jour » et PickSkill construit un `.pptx` frais avec les lectures les plus récentes. Le pattern d'historique de session permet d'itérer sur le deck d'un même portefeuille sur plusieurs sessions sans repartir de zéro.
