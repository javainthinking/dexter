---
title: 'De Dexter à PickSkill : bâtir sur un agent open source'
description: >-
  Comment nous avons bâti PickSkill sur Dexter, l'agent finance open source — en
  ajoutant une web app, la génération Word/PowerPoint/Excel et une suite de
  portefeuille à 8 indicateurs.
publishedAt: 2026-06-09
updatedAt: 2026-06-09
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: L'équipe de recherche PickSkill — un analyste IA pour les investisseurs particuliers.
pillar: build-in-public
tags:
  - open-source
  - dexter
  - ai-analyst
  - architecture
  - build-in-public
heroImage: /blog/from-dexter-to-pickskill/hero.png
heroAlt: >-
  Infographie éditoriale — un diagramme d'architecture avant/après montrant
  Dexter, l'agent CLI open source, à gauche, alimentant la web app PickSkill à
  droite, avec de nouvelles couches pour la génération de fichiers Office et la
  suite d'indicateurs de portefeuille.
---

**PickSkill a démarré comme un fork de [Dexter](https://github.com/virattt/dexter), l'agent finance autonome open source de [@virattt](https://twitter.com/virattt) — « Claude Code, mais conçu pour la recherche financière ».** Dexter nous a donné une boucle d'agent éprouvée : un outil CLI, écrit en TypeScript avec Ink et LangChain, qui décompose une question finance en un plan de recherche, exécute des outils sur des données de marché live, vérifie son propre travail et itère jusqu'à obtenir une réponse sourcée. Nous avons pris ce cœur et bâti autour — une web app native navigateur, la génération native Word/PowerPoint/Excel, la gestion de portefeuille et une suite d'indicateurs techniques à huit dimensions. Ce post est le récit build-in-public honnête de ce que nous avons gardé, de ce que nous avons ajouté, et pourquoi.

### Points clés

- **PickSkill est bâti sur Dexter**, l'agent finance open source (sous licence MIT, [github.com/virattt/dexter](https://github.com/virattt/dexter)). Nous avons gardé la boucle d'agent ; nous avons reconstruit presque tout autour.
- **Le plus grand changement, c'est la surface.** Dexter est un CLI ; PickSkill est une web app multi-locale sur [pickskill.ai](https://pickskill.ai). Le runtime de l'agent est partagé ; le modèle d'interaction, non.
- **Nous avons ajouté la génération Office native** — l'agent écrit désormais de vrais fichiers `.docx`, `.pptx` et `.xlsx`, pas des captures d'écran ni des dumps Markdown.
- **Nous avons ajouté la gestion de portefeuille et un dashboard à huit indicateurs** — MACD, pile MA, RSI, KDJ, Bandes de Bollinger, ADX/DMI, volume et flux de capitaux, chacun avec une [trace de signal sur 5 jours](/blog/5-day-signal-trail).
- **Nous avons étendu la couverture aux marchés US, Hong Kong et actions A** avec des conventions spécifiques par marché — y compris le masquage des barres de jour limite (limit-up / limit-down) sur actions A pour qu'elles ne déclenchent pas de faux signaux.

## Qu'est-ce que Dexter, et pourquoi partir de l'open source ?

Dexter est un agent IA open source pour la recherche financière approfondie, écrit en TypeScript avec Ink (React pour le terminal) et LangChain. Sa thèse de design est simple : prendre une question finance complexe, la transformer en un plan de recherche étape par étape, exécuter chaque étape avec le bon outil sur des données live, s'auto-valider et raffiner jusqu'à ce que la réponse soit fiable et sourcée. Il tourne dans un terminal, journalise chaque appel d'outil dans un scratchpad et persiste les choix de modèle et de provider dans une config locale. Le dépôt est sous licence MIT et public sur [GitHub](https://github.com/virattt/dexter).

Partir de Dexter plutôt que de zéro était une décision GTM délibérée. Le plus dur dans un agent analyste, ce n'est pas la zone de chat — c'est la boucle qui planifie, appelle des outils et réconcilie des données financières live sans halluciner les chiffres. Dexter avait déjà résolu cette boucle au grand jour. Bâtir dessus signifiait que nous pouvions consacrer nos premiers mois à la *surface produit* — la web app, les sorties de fichiers, la couche portefeuille — au lieu de re-dériver une plomberie d'agent qu'un solide projet open source avait déjà éprouvée.

## Ce que nous avons ajouté par-dessus Dexter

Le tableau ci-dessous cartographie l'héritage. La colonne de gauche est l'apport de Dexter ; celle de droite est ce que PickSkill a ajouté pour en faire un produit grand public.

| Couche | De Dexter (open source) | Ajouté par PickSkill |
|---|---|---|
| **Boucle d'agent** | Planification de tâches, exécution d'outils, auto-réflexion, journalisation scratchpad | État de session multi-tenant, quota + facturation, mémoire entre sessions |
| **Surface** | CLI interactive (Ink/React-dans-le-terminal) | Web app navigateur, 8 locales, layout mobile, liens partageables |
| **Données** | Financiers + données de marché live | Couverture US + Hong Kong + actions A, masquage des barres de jour limite, proxy de flux de capitaux |
| **Sortie** | Texte terminal + scratchpad JSONL | `.docx` / `.pptx` / `.xlsx` natifs via OfficeCLI sur liens présignés |
| **Analyse** | Raisonnement financier à la demande | Gestion [/portfolios](/portfolios) + dashboard [/indicators](/indicators) à 8 dimensions |

Le schéma de ce tableau, c'est toute la stratégie : garder le cœur éprouvé, productiser tout ce que touche un investisseur particulier.

## Comment la version web a changé l'architecture

Passer d'un CLI à une web app n'est pas un relookage d'UI — cela change le modèle de threading. Un agent CLI possède le terminal : un utilisateur, une session, sortie bloquante, fichiers locaux. Un agent web sert plusieurs utilisateurs en concurrence, streame une sortie partielle vers un navigateur, persiste l'historique de session côté serveur et écrit les artefacts dans un stockage objet plutôt que sur le disque local.

Donc, si la *boucle d'agent* est héritée de Dexter, le runtime autour est neuf. Les sessions sont multi-tenant et reprenables — vous pouvez fermer l'onglet et reprendre la même conversation de recherche plus tard. La sortie des outils streame vers le navigateur au fil de l'eau, comme Dexter streame vers le terminal. Et les fichiers générés atterrissent sur Cloudflare R2 sous forme de liens de téléchargement présignés valables 7 jours plutôt que dans un répertoire local, parce qu'un utilisateur web n'a pas de shell pour faire un `cat` sur un fichier. La formulation honnête : Dexter nous a donné le cerveau ; la web app est un nouveau corps conçu pour le porter jusqu'aux utilisateurs non techniques.

> **Voyez-le tourner.** Ouvrez [/chat](/chat) et posez n'importe quelle question finance — la boucle d'agent à laquelle vous parlez est celle de Dexter, productisée pour le navigateur.

## Pourquoi la génération de fichiers Office compte

La capacité la plus demandée que le CLI de Dexter n'avait pas, c'étaient les *livrables*. Une réponse dans le terminal, c'est parfait pour la personne qui a lancé la requête ; c'est inutile pour le collègue, le club d'investissement ou le comité d'entretien qui a besoin de quelque chose qu'il peut ouvrir. Les analystes retail et semi-pro vivent dans Word, PowerPoint et Excel — ces trois formats sont la couche d'échange universelle de la finance.

Nous avons donc ajouté OfficeCLI : l'agent compile désormais son analyse en fichiers OpenXML natifs. Pas des captures, pas des PDF, pas du Markdown — de vraies notes `.docx` avec titres et tableaux, de vrais decks `.pptx` avec graphiques intégrés et titres de slides éditables, et de vrais classeurs `.xlsx` avec formules live inter-feuilles et mise en forme conditionnelle. Chaque fichier est livré sous forme de lien présigné valable 7 jours. Nous avons écrit trois tutoriels pas-à-pas pour les flux les plus courants : [exporter un portefeuille en PowerPoint](/blog/export-portfolio-to-powerpoint), [exporter un rapport en Excel](/blog/export-portfolio-report-to-excel) et [générer un deck investisseur depuis un chat](/blog/generate-investor-deck-from-chat).

## Gestion de portefeuille et suite à huit indicateurs

Dexter répond aux questions une par une. PickSkill ajoute une analyse *permanente* : un portefeuille que vous maintenez sur [/portfolios](/portfolios) et un dashboard d'indicateurs sur [/indicators](/indicators) qui tourne en continu sur chaque position. Le dashboard calcule huit dimensions techniques sur la dernière clôture :

1. **MACD** — momentum et état de croisement ([c'est quoi le MACD](/blog/what-is-macd))
2. **Moyennes mobiles** — pile MA5 / MA20 / MA60 et [croisement doré / croisement de la mort](/blog/what-is-golden-cross-death-cross)
3. **RSI(14)** — suracheté / survendu ([c'est quoi le RSI](/blog/what-is-rsi))
4. **KDJ(9,3,3)** — momentum stochastique, populaire sur les actions A ([c'est quoi le KDJ](/blog/what-is-kdj))
5. **Bandes de Bollinger(20,2)** — enveloppe de volatilité ([c'est quoi les Bandes de Bollinger](/blog/what-is-bollinger-bands))
6. **ADX/DMI(14)** — force de tendance ([c'est quoi l'ADX](/blog/what-is-adx))
7. **Relation volume / cours** ([analyse du volume](/blog/what-is-volume-analysis))
8. **Proxy de flux de capitaux** ([c'est quoi le flux de capitaux](/blog/what-is-capital-flow))

Chaque dimension est livrée avec une [trace de signal sur 5 jours](/blog/5-day-signal-trail) — cinq points montrant comment la classification a évolué sur la semaine de bourse, pour que vous lisiez une trajectoire, pas seulement l'instantané du jour. Et parce que nous couvrons les actions A, le dashboard détecte les barres de jour limite / suspension (où le plus haut égale le plus bas) et les masque comme neutres, pour qu'une barre dégénérée ne produise jamais de faux signal haussier ou baissier.

## Ce que nous avons gardé de Dexter — et ce que nous avons changé

Nous avons gardé la philosophie qui définit Dexter : sortie sourcée sinon ça compte pas, hypothèses éditables plutôt que réponses black-box, et une boucle d'agent auto-validante. Ces principes correspondent directement à notre promesse GTM — *PickSkill est l'analyste IA qui recherche, modélise et rédige du travail actions en langage clair.*

Ce que nous avons changé, c'est tout ce que touche un utilisateur non technique. La couche provider a été généralisée — Dexter prend en charge plusieurs providers de modèles, et PickSkill est livré avec la famille gpt-5.5 d'OpenAI par défaut tout en prenant en charge Anthropic, Google Gemini, xAI et Ollama local via la même surface d'agent. Nous avons ajouté la facturation, la mémoire, l'UI multilingue et la couche de livrables. Pour la vue d'ensemble de là où l'IA en recherche actions apporte vraiment du levier aujourd'hui, voir [IA pour la recherche actions en 2026](/blog/ai-for-stock-research-2026).

## La suite

Quelques éléments de la roadmap publique, dans le même esprit build-in-public :

- **Ré-exports planifiés** — rafraîchir automatiquement un classeur ou un deck de portefeuille à une cadence donnée et vous le livrer, au lieu de relancer le prompt à la main.
- **Extraction des transcripts de earnings calls** — la section Q&A, là où vit le signal prospectif, pas seulement les remarques préparées.
- **Plus de marchés** — Tokyo et l'Inde ensuite, chacun une intégration de 2–3 mois pour bien régler l'extracteur de filings et les conventions d'indicateurs.

S'il y a un gap de workflow que vous voulez voir résolu, [dites-nous](/feedback) — la roadmap est sensible à ce dont les utilisateurs ont réellement besoin.

## FAQ

**PickSkill est-il la même chose que Dexter ?**
Non. PickSkill est bâti sur la boucle d'agent open source de Dexter, mais c'est un produit distinct. Dexter est un outil de recherche CLI pour développeurs ; PickSkill est une web app hébergée avec comptes, facturation, gestion de portefeuille, génération de fichiers Office et couverture multi-marchés. Nous avons gardé le cœur d'agent de Dexter et sa philosophie de « sortie sourcée », puis bâti un produit grand public autour.

**Dexter est-il open source, et puis-je l'utiliser directement ?**
Oui. Dexter est sous licence MIT et public sur [github.com/virattt/dexter](https://github.com/virattt/dexter). Vous pouvez le cloner, le faire tourner dans votre terminal et l'utiliser pour la recherche financière dès aujourd'hui. PickSkill existe pour ceux qui veulent la même puissance d'agent sans faire tourner un CLI — dans un navigateur, avec des livrables et une couche portefeuille.

**Qu'a réellement ajouté PickSkill par-dessus Dexter ?**
Quatre couches majeures : une surface de web app multi-locale, la génération native Word/PowerPoint/Excel via OfficeCLI, la gestion de portefeuille avec un dashboard à huit indicateurs et trace de signal sur 5 jours, et la couverture des marchés US/HK/actions A avec masquage des barres de jour limite. La boucle d'agent sous-jacente plan-exécution-validation est héritée de Dexter.

**Quels modèles IA PickSkill utilise-t-il ?**
Le défaut est la famille gpt-5.5 d'OpenAI. PickSkill prend aussi en charge les modèles Anthropic, Google Gemini, xAI et Ollama local via la même surface d'agent, héritant du design multi-provider de Dexter. Le choix du modèle ne change pas le workflow — sortie sourcée et hypothèses éditables tiennent quel que soit le provider.

**Pourquoi bâtir sur un projet open source existant plutôt que de zéro ?**
Le plus dur dans un agent analyste, c'est la boucle qui planifie, appelle des outils et réconcilie des données live sans halluciner — Dexter l'avait déjà éprouvée au grand jour. Bâtir dessus nous a permis de consacrer nos premiers mois à la surface produit que touchent les vrais utilisateurs (web app, fichiers Office, dashboard de portefeuille) plutôt qu'à re-dériver une plomberie d'agent.
