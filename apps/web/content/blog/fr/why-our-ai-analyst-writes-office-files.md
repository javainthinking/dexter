---
title: 'Pourquoi notre analyste IA écrit du Word, du PowerPoint et de l''Excel'
description: >-
  Les réponses de chat ne se présentent pas. Nous avons appris à PickSkill à
  générer des fichiers Word, PPT et Excel natifs pour que la recherche devienne
  un livrable que vous pouvez envoyer et présenter.
publishedAt: 2026-06-09
updatedAt: 2026-06-09
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: L'équipe de recherche PickSkill — un analyste IA pour les investisseurs particuliers.
pillar: build-in-public
tags:
  - file-generation
  - office
  - ai-analyst
  - product
  - build-in-public
heroImage: /blog/why-our-ai-analyst-writes-office-files/hero.png
heroAlt: >-
  Infographie éditoriale — une bulle de chat à gauche traversant une couche
  OfficeCLI vers trois sorties de fichiers natifs à droite : une note .docx, un
  deck .pptx et un classeur .xlsx, chacun étiqueté « vrai OpenXML, pas une
  capture d'écran ».
---

**Une réponse de chat se lit une fois puis se perd ; une note Word, un deck PowerPoint et un classeur Excel se transfèrent, s'éditent, se présentent et s'archivent.** Quand nous avons bâti [PickSkill](https://pickskill.ai) par-dessus l'agent open source [Dexter](https://github.com/virattt/dexter), la seule capacité que le CLI sous-jacent n'avait pas — et celle que nos tout premiers utilisateurs ont le plus réclamée — c'étaient les *livrables*. Nous avons donc ajouté OfficeCLI : une couche qui transforme l'analyse de l'agent en fichiers `.docx`, `.pptx` et `.xlsx` natifs. Pas des captures, pas des PDF, pas des dumps Markdown. Ce post est l'argumentaire build-in-public de pourquoi un analyste IA sérieux doit écrire des fichiers Office, et comment nous l'avons fait.

### Points clés

- **La sortie de chat ne se présente pas.** Le format qui se partage, s'édite et se présente en finance, c'est Word, PowerPoint et Excel — pas une transcription de chat.
- **PickSkill génère des fichiers OpenXML natifs** via OfficeCLI : de vraies notes `.docx`, des decks `.pptx` avec graphiques intégrés, et des classeurs `.xlsx` avec formules live inter-feuilles.
- **Chaque fichier est sourcé sur des données live** — indicateurs calculés sur la dernière clôture, financiers issus du dernier filing, valorisation issue du consensus actuel.
- **Les fichiers sont livrés sous forme de liens présignés valables 7 jours** sur Cloudflare R2, donc rien à installer et aucun lock-in plateforme.
- **Un prompt, trois formats.** La même recherche peut devenir une note, un deck ou un modèle — vous choisissez l'artefact selon le public.

## Pourquoi une réponse de chat n'est pas un livrable

L'IA générative a rendu les *réponses* de recherche bon marché. Elle n'a pas rendu les *artefacts* de recherche bon marché. Il y a un fossé entre « le modèle m'a dit que la marge de FCF de NVDA est de 18 % » et « j'ai une note de quatre pages que mon club d'investissement peut lire dimanche ». Ce fossé — la couche de présentation — est là où la plupart de l'analyse retail meurt en silence, car le temps d'avoir construit l'analyse que vous voulez partager, vous n'avez plus la patience d'assembler le deck ou le classeur qui la rendrait partageable.

Les formats comptent parce que les publics diffèrent. Une note est pour quelqu'un qui lit de la prose et veut l'argument. Un deck est pour une conversation live où vous déroulez la thèse. Un classeur est pour le collaborateur qui veut trier, pivoter et ajouter ses propres colonnes. Une transcription de chat ne sert aucun de ces trois — elle ne se trie pas, elle ne se présente pas, et elle se lit comme un journal de logs. Combler le fossé entre réponse et artefact est toute la raison d'être d'OfficeCLI.

## Ce que « OpenXML natif » veut vraiment dire

Quand nous disons que PickSkill génère de vrais fichiers Office, nous voulons dire que chaque forme, cellule, formule et graphique est un véritable objet OpenXML — le même format de fichier qu'écrit Microsoft Office. La distinction n'est pas cosmétique. Une capture d'écran d'un tableau, ce sont des pixels morts ; un vrai tableau `.xlsx` se trie, se filtre et alimente un tableau croisé dynamique. Un PDF de slides ne peut pas être rethématisé ; un vrai deck `.pptx` adopte votre template d'entreprise via Création → Variantes et vous laisse éditer n'importe quel titre de slide.

Voici ce que porte chaque format :

| Format | Ce que PickSkill écrit | Ce que vous pouvez en faire |
|---|---|---|
| **`.docx`** | Sections à titres, tableaux, affirmations sourcées, récit en prose | Éditer dans Word/Google Docs, transférer comme note, coller dans un rapport |
| **`.pptx`** | Couverture, slides positions/thèse, images de graphiques intégrées, titres éditables | Présenter depuis PowerPoint/Keynote, rethématiser, éditer n'importe quelle slide |
| **`.xlsx`** | Classeur multi-feuilles, formules live inter-feuilles, mise en forme conditionnelle, sparklines | Trier, pivoter, ajouter des colonnes, bâtir votre propre modèle par-dessus |

Parce que la sortie est de l'OpenXML standard, elle s'ouvre dans Excel, Google Sheets, LibreOffice, Apple Numbers, Keynote et Google Slides — aucun compte PickSkill nécessaire pour ouvrir un fichier que quelqu'un vous a partagé.

## Comment OfficeCLI s'insère dans la boucle d'agent

PickSkill hérite de la boucle d'agent plan-exécution-validation de Dexter (voir [De Dexter à PickSkill](/blog/from-dexter-to-pickskill) pour l'histoire complète des origines). La génération de fichiers s'insère comme étape finale de cette boucle : une fois que l'agent a recherché, calculé et validé, OfficeCLI compile le résultat en un document.

La séquence, pour un deck de portefeuille, se déroule ainsi :

1. L'agent tire le cours actuel et l'historique de cours de chaque position.
2. Il fait tourner la suite d'indicateurs à huit dimensions ([/indicators](/indicators)) et détecte les signaux actifs.
3. Il tire les multiples de valorisation et la synthèse financière la plus récente.
4. Il rend les graphiques d'indicateurs en images haute résolution.
5. OfficeCLI compose le `.pptx` — en intégrant les graphiques, en formatant les tableaux, en liant les titres éditables à l'analyse.
6. Le fichier est écrit sur Cloudflare R2 et renvoyé comme lien de téléchargement présigné valable 7 jours.

Le choix de design clé : le fichier est lié à l'analyse, pas collé depuis elle. Demandez un changement dans le chat — « commence par la narration FCF », « compresse les slides par position à une seule chacune » — et l'agent ré-exécute l'analyse concernée et émet un fichier frais. Le document est en aval du raisonnement, donc il reste honnête.

> **Essayez maintenant.** Ouvrez n'importe quel portefeuille sur [/portfolios](/portfolios) et cliquez *Exporter vers PowerPoint* ou *Exporter vers Excel* — le fichier est prêt en environ une minute.

## Trois formats, trois publics

La raison pour laquelle nous avons bâti les trois plutôt que d'en choisir un, c'est que les analystes retail et semi-pro présentent à des salles différentes, et l'artefact doit correspondre à la salle :

- **Word** pour l'analyste qui pense en prose — une note de thèse, une synthèse de 10-K, une justification de position. Lisez notre tutoriel [deck investisseur depuis un chat](/blog/generate-investor-deck-from-chat) pour l'arbitrage prose-vs-slides.
- **PowerPoint** pour la présentation live — un club d'investissement, un comité d'entretien, un partenaire qui gère le livre familial. Voir [exporter un portefeuille en PowerPoint](/blog/export-portfolio-to-powerpoint).
- **Excel** pour le collaborateur qui veut *travailler* les chiffres — trier par force de signal, pivoter par secteur, superposer ses propres scénarios. Voir [exporter un rapport de portefeuille en Excel](/blog/export-portfolio-report-to-excel).

Une conversation de recherche, trois artefacts possibles. Vous choisissez le format quand vous choisissez le public — l'analyse en dessous est identique.

## Les réserves honnêtes

Build-in-public, ça veut dire signaler ce que la génération de fichiers ne fait pas :

- **C'est un instantané, pas un lien live.** Les formules du classeur se mettent à jour sur ses propres cellules, mais elles ne vont pas chercher en live de nouvelles données de marché. Pour rafraîchir, ré-exportez — environ 30 secondes.
- **Les templates d'entreprise personnalisés requièrent une configuration manuelle.** Le deck utilise le système de design de PickSkill ; les templates fortement brandés (polices personnalisées, placement du logo) s'appliquent post-export via votre thème Office.
- **Pas de VBA / macros.** La sortie, ce sont des données, des formules et des graphiques. Les macros et les rubans personnalisés restent des ajouts manuels.
- **Pas de synchro directe avec un courtier.** Les positions viennent du portefeuille que vous maintenez sur [/portfolios](/portfolios), pas d'un flux de courtier live.

Ce sont des frontières délibérées, pas des bugs — le fichier est un point de départ propre et sourcé que vous enrichissez, pas une black-box à laquelle vous devez faire aveuglément confiance.

## FAQ

**Pourquoi un analyste IA aurait-il besoin d'écrire des fichiers Office, au juste ?**
Parce que la recherche ne crée de la valeur que lorsqu'elle est partagée, et la finance se partage en Word, PowerPoint et Excel. Une réponse de chat ne peut être ni présentée, ni triée, ni archivée. Générer des fichiers Office natifs comble le fossé entre « le modèle a répondu à ma question » et « j'ai un livrable que mon collègue ou mon club peut réellement utiliser ».

**Les fichiers sont-ils de vrais documents Office ou juste des exports d'une capture d'écran ?**
De vrais documents OpenXML. Chaque cellule, formule, slide et graphique est un véritable objet Office — le classeur se trie et se pivote, le deck se rethématise et s'édite, la note s'ouvre dans Word ou Google Docs. Rien n'est une capture d'écran plate ni un PDF en lecture seule.

**Faut-il avoir Microsoft Office installé pour les utiliser ?**
Non. Les fichiers s'ouvrent dans Excel, Google Sheets, LibreOffice, Apple Numbers, Keynote et Google Slides. Parce que PickSkill écrit de l'OpenXML standard et évite les fonctions spécifiques à un éditeur dans l'export par défaut, les fichiers s'affichent correctement dans toutes les suites majeures compatibles Office.

**Combien de temps les liens de téléchargement durent-ils ?**
Chaque fichier est livré sous forme de lien présigné valable 7 jours sur Cloudflare R2. Le fichier lui-même est permanent une fois téléchargé — re-générez depuis le chat dès que vous avez besoin d'une version rafraîchie avec les données les plus récentes. Le lien est rattaché à votre compte.

**Une seule conversation de recherche peut-elle produire plus d'un format ?**
Oui. La même analyse peut devenir une note `.docx`, un deck `.pptx` ou un classeur `.xlsx` — vous choisissez l'artefact selon le public. La recherche sous-jacente est identique ; seul le livrable change, parce que le fichier est généré en aval du raisonnement de l'agent plutôt que collé dans un template figé.
