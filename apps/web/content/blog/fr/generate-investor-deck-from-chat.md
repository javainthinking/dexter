---
title: Comment générer un deck investisseur depuis un chat en 90 secondes
description: >-
  Transformez une conversation de recherche en présentation investisseur —
  thèse, financiers, comparables, risques. Un prompt, un PPTX, chaque slide
  éditable.
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
  - Deck investisseur
  - PowerPoint
  - Workflow
  - Présentation
heroImage: /blog/generate-investor-deck-from-chat/hero.png
heroAlt: >-
  Infographie éditoriale — une bulle de prompt chat s écoule via une flèche vers
  une diapositive investisseur finalisée, illustrant le workflow chat-vers-deck.
---

**Un deck investisseur distille une thèse de recherche en 10 à 15 slides qu'un autre investisseur peut lire en 5 minutes et sur lesquelles il se forme une opinion.** Les slides ont besoin d'un énoncé de thèse clair, de quelques graphiques bien choisis, d'une synthèse de valorisation et d'une section risques honnête. Ce tutoriel passe en revue la génération de ce deck directement depuis une conversation de recherche PickSkill — chaque slide ancrée dans le travail que vous avez déjà fait dans le chat, chaque graphique sourcé, le `.pptx` prêt à télécharger en 90 secondes.

C'est un tutoriel en 5 étapes. L'étape la plus longue est celle où vous prenez le vrai jugement d'investissement. Tout le reste est mécanique.

### Points clés

- **5 étapes, ~90 secondes.** Ouvrir un chat, bâtir la thèse, demander le deck, éditer le prompt, télécharger.
- **Le deck est généré à partir de l'historique du chat** — chaque graphique du deck cite le moment de la conversation où il a été discuté.
- **10–15 slides par défaut.** Couverture, thèse, vue business, financiers, valorisation, setup technique, comparables, scénarios, risques, annexe.
- **La sortie est un vrai fichier `.pptx`** — éditez n'importe quelle slide, présentez depuis PowerPoint ou Keynote, partagez sans conversion.
- **Marche sur les valeurs US, HK et actions A.** Le deck adapte les conventions de disclosure par marché.

## Pourquoi c'est important

Le format deck investisseur existe pour une raison : il force l'analyste à articuler la thèse dans une structure qui expose les maillons faibles. Une note de 15 pages vous permet de cacher l'écart entre « j'aime cette action » et « voici pourquoi quelqu'un d'autre devrait s'en soucier ». Un deck de 12 slides rend ces écarts immédiatement visibles — et la discipline d'en produire un améliore l'analyse sous-jacente même si vous ne montrez jamais le deck à personne.

Trois publics en bénéficient :

- **Un investisseur ou partenaire potentiel.** Le deck est la façon la plus efficace de partager une thèse pour un second avis.
- **Un comité d'investissement formel.** Beaucoup de clubs d'investissement, family offices et fonds étudiants exigent des présentations au format deck pour les nouvelles positions.
- **Votre propre discipline analytique.** Écrire le deck est l'épreuve ; le partager est optionnel. Si une thèse ne peut pas se mettre en deck proprement, la thèse a généralement des trous cachés qu'il vaut la peine de traiter.

## Le workflow en 5 étapes

### Étape 1 — Ouvrir un chat et bâtir la thèse

Allez sur [/chat](/chat) et déroulez votre recherche. Une conversation typique de construction de thèse ressemble à :

```text
Construis un DCF à 5 ans sur TSMC. Montre-moi la sensibilité au WACC.
Que dit le 10-K sur la trajectoire de marge brute ?
Compare contre ASML et Lam Research sur EV/EBITDA et croissance du FCF.
À quoi ressemble le setup technique actuel — MACD, RSI, pile MA ?
```

Les prompts exacts comptent moins que la *couverture*. À la fin de la conversation, vous devez avoir :

- Une lecture de valorisation (DCF, comparables ou les deux)
- Une vue business / fondamentale (trajectoire de marge, drivers de croissance, bilan)
- Une position concurrentielle (face à 2–3 pairs les plus proches)
- Un contexte technique (régime de tendance actuel, momentum, niveaux clés)

Si vous n'avez pas construit la fondation, voir [Construire un DCF en 60 secondes](/blog/build-dcf-in-60-seconds), [Résumer un 10-K en 60 secondes](/blog/summarise-a-10k-in-60-seconds) et [Suivre un portefeuille avec des indicateurs](/blog/track-a-portfolio-with-indicators) pour les conversations en amont.

### Étape 2 — Demander le deck

Une fois la thèse construite, demandez à PickSkill de générer le deck :

```text
Génère un deck investisseur en 12 slides à partir de cette conversation.
Commence par la thèse en une phrase. Puis vue business, financiers,
valorisation (DCF et comparables), setup technique, scénarios (haussier/base/baissier),
risques et une annexe. Que chaque slide soit prête à présenter.
```

C'est tout l'input. PickSkill utilise l'historique de conversation comme matière source du deck — chaque graphique, tableau et bullet remonte à un échange précis dans le chat.

### Étape 3 — Affiner la structure avant génération

Avant que PickSkill ne s'engage à générer, vous verrez un plan de slides proposé. Édits fréquents à ce stade :

- **Réordonner les slides** — « déplace le setup technique en slide 4, avant les financiers » si vous présentez à un public de traders.
- **Couper des slides** — « saute la slide comparables ; mon public ne s'intéresse pas à la valorisation relative. »
- **Ajouter des slides** — « ajoute une slide sur la qualité du management et l'historique d'allocation du capital. »
- **Ajuster la profondeur** — « étends la section risques sur 2 slides — première slide pour les risques fondamentaux, seconde pour les risques techniques / de structure de marché. »

Le pattern plan-puis-génération économise un cycle de régénération. Le deck complet prend 30–60 secondes à assembler ; une itération sur le plan prend 5 secondes.

### Étape 4 — Attendre pendant que PickSkill assemble le deck

PickSkill exécute, dans l'ordre :

1. Compile l'historique de chat pertinent pour le deck (filtre les discussions parallèles, impasses exploratoires).
2. Tire les dernières données pour chaque métrique référencée — cours, financiers, multiples.
3. Rend les graphiques (cours + technique, comp de valorisation, éventail de scénarios) en images intégrées.
4. Génère le contenu des slides selon les conventions standard du deck investisseur : énoncé de thèse en slide 2, cadre de valorisation explicite, risques en pre-mortem plutôt qu'enterrés.
5. Compose le `.pptx` avec titres formatés, notes de bas de page citant les sources et une annexe finale avec la provenance des données.

Vous verrez un résumé en streaming. À la fin, vous obtenez un lien de téléchargement valable 7 jours.

### Étape 5 — Éditer n'importe quelle slide, présenter, itérer

Le `.pptx` téléchargé s'ouvre dans PowerPoint, Keynote ou Google Slides. Chaque slide est entièrement éditable.

Pour des édits au niveau du deck, retournez dans le chat :

```text
Refais la slide 8 (scénarios). Rends le cas haussier plus agressif — pousse l'hypothèse
de croissance du CA en année 3 à 25 % au lieu de 15 %. Montre-moi la nouvelle sortie DCF.
```

```text
Ajoute une slide entre la 5 et la 6 montrant la plage historique d'EV/EBITDA sur
les 5 dernières années et où se situe le multiple actuel.
```

```text
Fais une version 5 minutes de ce deck — garde uniquement la couverture, la thèse,
la synthèse de valorisation et les risques. Coupe le reste.
```

PickSkill re-génère avec la nouvelle structure.

> **Essayez maintenant.** [Ouvrez un chat](/chat), déroulez une thèse, et demandez le deck. Tout le tour dure moins de 2 minutes.

## À quoi ressemble la sortie

La structure par défaut en 12 slides :

| Slide | Contenu |
|---|---|
| **1. Couverture** | Ticker, nom de la société, présentateur, date, accroche d'une phrase |
| **2. Thèse** | La thèse en ≤30 mots, l'objectif de cours / la vue en une phrase, l'horizon temporel |
| **3. Vue business** | Décomposition du CA (segments / géographies), position concurrentielle, mouvements stratégiques récents |
| **4. Financiers** | 4 derniers trimestres de CA, marge EBIT, FCF, points de tendance clés |
| **5. Valorisation — absolue** | Synthèse DCF avec hypothèses clés, prix implicite, grille de sensibilité |
| **6. Valorisation — relative** | EV/EBITDA, P/E, P/B vs secteur / pairs ; actuel vs plage historique |
| **7. Setup technique** | Graphique de cours avec pile MA, état MACD / RSI actuel, niveaux clés de support / résistance |
| **8. Scénarios** | Cas haussier / base / baissier — chacun avec changements d'hypothèses explicites et objectif de cours résultant |
| **9. Risques — fondamentaux** | Top 3 des risques fondamentaux (compression de marge, concurrence, régulation, exécution) |
| **10. Risques — marché** | Risques techniques (suracheté, divergence, cassures de niveaux clés), liquidité, exposition factorielle |
| **11. Conclusion** | L'action — acheter, garder, surveiller, éviter — avec guidance de taille et discipline de niveau d'entrée |
| **12. Annexe** | Sources de données, notes de méthodologie, disclaimer |

Les slides utilisent un système typographique cohérent et une palette de couleurs alignée à la marque conçue pour la lisibilité en réunion (corps de texte ≥18pt, graphiques à fort contraste).

## Ce qui n'est pas faisable en 90 secondes

Réserves honnêtes :

- **Recherche primaire originale.** Le deck est construit à partir des sources de données PickSkill et du travail dans votre chat. Si votre thèse repose sur un entretien de recherche primaire (un channel check avec un client, une conversation avec un ancien salarié), ce contenu doit être ajouté manuellement.
- **Modèles de valorisation très personnalisés.** Un DCF standard, une valorisation relative, ou un cadre somme-des-parties marche immédiatement. Un modèle d'options réelles sur un pipeline biotech, ou un DCF d'utility régulée avec mécanique de base tarifaire, requiert plus de conversation personnalisée en amont.
- **Disclosure juridique de niveau conformité.** L'annexe inclut un disclaimer de base. Si vous utilisez le deck dans un contexte régulé (conseiller enregistré, gérant de fonds), le langage de conformité doit être revu par un avocat — PickSkill n'est pas un conseil juridique.

## Prompts de suivi utiles

- *« Fais une version one-pager de ce deck — une seule slide, format résumé exécutif. »*
- *« Génère le même deck pour le concurrent le plus proche, comparaison côte à côte. »*
- *« Traduis le deck en mandarin / japonais / allemand pour un public non anglophone. »*
- *« Convertis la slide setup technique en vue multi-horizon — graphiques quotidien, hebdomadaire, mensuel. »*
- *« Ajoute une slide "questions que j'attends du public" à la fin, avec réponses préparées. »*

## FAQ

**En quoi est-ce différent de l'export PPT depuis le portefeuille ?**
L'[export portefeuille](/blog/export-portfolio-to-powerpoint) génère un deck *à partir des données* — positions, indicateurs, photos de valorisation, le tout rendu dans une structure standard. Ce tutoriel génère un deck *à partir d'une conversation de thèse* — le contenu des slides est façonné par ce que vous avez réellement recherché et argumenté, pas par un template fixe. Utilisez l'export portefeuille pour les revues de positions périodiques ; utilisez le flow chat-vers-deck pour les pitches de nouvelles positions.

**Le deck cite-t-il des moments précis du chat ?**
Oui — les notes de bas de page d'annexe et les légendes de graphiques référencent les moments prompt-et-réponse où le contenu est né. Cela facilite la retrace de la chaîne analytique pour défendre une slide, et cela rend le deck auditable pour quiconque relit votre travail.

**Puis-je générer le deck dans une autre langue ?**
Oui — ajoutez « en [langue] » au prompt à l'étape 2. PickSkill prend en charge les 8 locales utilisées sur la plateforme. Graphiques, titres de slides, corps de texte et notes de bas de page sont tous traduits ; les valeurs de données et symboles ticker restent dans leur forme native.

**Et si ma thèse dépend de quelque chose qui n'est pas dans la conversation ?**
Ajoutez-le avant de générer : « Note que j'ai confirmé séparément via une recherche primaire que le client Y migre vers le produit Z avant la fin du T3. » PickSkill inclut l'ajout comme un bullet attribué dans la slide appropriée. Tout ce qui n'est pas dans la conversation n'est pas dans le deck par design — le deck est ancré dans le chat.

**Comment cela se compare-t-il à utiliser ChatGPT ou Claude directement pour écrire un deck ?**
La différence tient à l'*ancrage*. Le chat PickSkill a déjà tiré les filings live, calculé le DCF, fait tourner les indicateurs et tiré les comparables. La composition du deck est basée sur ces primitives sourcées, pas sur la connaissance générale du modèle. Le résultat est sensiblement moins sujet aux chiffres fabriqués ou aux données obsolètes, qui sont le mode d'échec de la génération de deck pilotée par un chatbot générique.

**Puis-je sauvegarder le deck et y revenir pour le mettre à jour plus tard ?**
Oui — la session de chat persiste. Rouvrez la conversation et demandez « re-génère le deck avec les données du jour et ajoute une slide pour la nouvelle publication de résultats » — PickSkill reconstruit le deck avec le nouveau contexte superposé à la thèse d'origine.
