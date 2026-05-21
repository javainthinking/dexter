---
title: Qu'est-ce que le DCF ? Guide pratique du discounted cash flow
description: Guide pratique du DCF — la formule, les quatre hypothèses qui font bouger la valorisation, les pièges classiques et comment modéliser en moins d'une heure.
publishedAt: 2026-05-21
updatedAt: 2026-05-21
author:
  name: Julian Zhou
  url: https://www.linkedin.com/in/julianzhou
  bio: Fondateur de PickSkill. Auparavant equity research dans un fonds long-only sur les semi-conducteurs.
pillar: explainer
tags:
  - valuation
  - dcf
  - fundamentals
heroImage: /blog/what-is-dcf/hero.png
heroAlt: Illustration éditoriale d'une frise des flux de trésorerie stylisée en tons sombres et chauds avec des accents émeraude
---

Le **discounted cash flow (DCF)** est une méthode de valorisation qui estime la valeur actuelle d'une entreprise en additionnant tout le cash qu'elle devrait générer dans le futur, actualisé à un taux qui reflète le risque de ne pas réellement le percevoir. En une phrase : le DCF répond à « combien vaut l'entreprise aujourd'hui, étant donné le cash qu'elle devrait générer demain ? »

C'est la méthode de valorisation la plus enseignée en equity research, en banque d'investissement et en finance d'entreprise — et également la plus mal utilisée. Ce guide couvre la formule, les quatre hypothèses qui comptent vraiment, les pièges qui font trébucher les modélisateurs débutants, et une version 60 secondes : comment PickSkill construit un DCF à la demande.

### Points clés

- **DCF = valeur présente des flux de trésorerie disponibles futurs.** Projeter les FCF sur 5–10 ans, actualiser chaque année au WACC, ajouter une valeur terminale, sommer.
- **Quatre hypothèses font 95% du travail** : croissance du chiffre d'affaires, marge EBIT terminale, WACC, méthode de la valeur terminale.
- **La valeur terminale représente 60–80% de l'EV total** dans un DCF type à 5 ans — l'hypothèse post-prévision domine la réponse.
- **Un changement de 100 bp sur le WACC bouge la valeur entreprise de 8–15%.** Toujours fournir une table de sensibilité WACC × croissance terminale.
- **PickSkill peut construire un premier DCF en 60–90 secondes** à partir de filings SEC ; chaque hypothèse est éditable et sourcée.

## Quelle est la formule du DCF ?

La forme standard :

```
Valeur Entreprise = Σ ( FCFₜ / (1 + WACC)ᵗ )  +  Valeur Terminale / (1 + WACC)ⁿ
```

En clair : projetez le free cash flow non endetté (FCF) pour chaque année d'une période de projection explicite (généralement 5–10 ans), actualisez chaque année au coût moyen pondéré du capital (WACC), puis ajoutez une valeur terminale représentant tout ce qui suit.

Deux variantes dominent en pratique :

| Variante | Ce qu'on actualise | Ce qu'on obtient |
|---|---|---|
| **DCF non endetté (FCFF)** | Free cash flow à la firme | **Valeur entreprise** — diviser par le nombre d'actions et retrancher la dette nette pour estimer le cours intrinsèque |
| **DCF endetté (FCFE)** | Free cash flow aux actionnaires | **Valeur des fonds propres** directement — pas besoin de retirer la dette |

Le non endetté est la norme en equity research car il sépare la performance opérationnelle de la structure de capital. Le DCF endetté apparaît plus dans les modèles LBO de private equity.

## Pourquoi le DCF compte

Trois raisons pour lesquelles les gens continuent à l'utiliser malgré les critiques :

1. **C'est un cadre de réflexion, pas seulement un chiffre.** Construire un DCF vous force à expliciter les hypothèses sur une entreprise — croissance du CA, trajectoire des marges, intensité capitalistique, coût du capital. Même si la sortie est fausse, la conversation sur les hypothèses a de la valeur.
2. **Il ancre les objectifs de cours.** La plupart des analystes sell-side et buy-side triangulent un objectif en moyennant DCF, comparables et transactions précédentes. Le DCF est la jambe la plus rigoureuse côté fondamentaux.
3. **Il révèle ce que le marché suppose implicitement.** Un DCF inversé — résoudre le taux de croissance qui justifie le cours actuel — vous dit si le marché price un miracle ou un désastre.

## Les quatre hypothèses qui comptent vraiment

La plupart des désaccords sur un DCF se résument à des désaccords sur l'un de ces quatre chiffres. Concentrez votre temps ici.

### 1. Croissance du CA en années 1–5

Deux modes d'échec sont courants. Les modélisateurs haussiers extrapolent la croissance récente indéfiniment ; les baissiers reviennent à une croissance type PIB dès l'année trois. La version honnête triangule avec une construction bottom-up (prix × volume × mix géographique) et teste les deux directions.

### 2. Trajectoire de la marge opérationnelle

L'hypothèse la plus leviée pour les entreprises à forte croissance. Un décalage de 50 bp sur la marge EBIT terminale peut faire bouger un DCF software de 30%+. Toujours afficher la marge terminale assumée et la comparer aux comparables matures de l'entreprise.

### 3. WACC (le taux d'actualisation)

Le rendement exigé par le marché pour assumer le risque de cette entreprise. Formellement :

```
WACC = (E/V) × Re  +  (D/V) × Rd × (1 − taux d'imp.)
```

Où `Re` est le coût des fonds propres (généralement via CAPM : taux sans risque + β × prime de risque actions), `Rd` est le coût avant impôt de la dette, et `E/V` et `D/V` sont les pondérations equity et dette dans la structure de capital. Un mouvement de 100 bp sur le WACC fait typiquement bouger la valeur entreprise de 8–15% sur un DCF à 5 ans (analyse interne PickSkill sur environ 200 modèles large-cap en 2025). Tabuler la sensibilité WACC vs. croissance terminale est l'élément le plus utile d'un DCF — un exemple sur le [tableau de bord indicateurs][indicators].

[indicators]: /indicators

### 4. Valeur terminale

Dans un DCF à 5 ans, la valeur terminale représente généralement 60–80% de la valeur entreprise totale (fourchette typique sur les large caps du S&P 500 ; le [jeu de données Damodaran de NYU Stern][damodaran] publie les données sous-jacentes chaque trimestre). Donc l'hypothèse sur ce qui se passe après l'année 5 domine le résultat. Deux approches :

[damodaran]: https://pages.stern.nyu.edu/~adamodar/

- **Croissance Gordon (perpétuité)** : `VT = FCFn+1 / (WACC − g)`. Simple mais sensible au spread `(WACC − g)` — un mouvement de 50 bp sur l'un ou l'autre peut faire bouger la VT de 20%+.
- **Multiple de sortie** : `VT = EBITDA × multiple`. Plus facile à défendre (« les comparables se traitent aujourd'hui à 12× EBITDA ») mais incorpore l'environnement de marché actuel.

Les DCF sophistiqués rapportent les deux méthodes et utilisent l'écart comme contrôle de cohérence.

## Pièges classiques (ceux qui cassent silencieusement les modèles)

Une checklist de 134 mots à garder en tête :

1. **Double comptage du BFR.** Si votre FCF reflète déjà les variations de BFR, ne les soustrayez pas à nouveau dans le pont EV → equity.
2. **Mélange taux nominal/réel.** Actualiser des flux nominaux à un WACC réel surévalue la valeur d'environ 2–3% par année de projection.
3. **Bêta obsolète.** Un bêta mensuel sur 5 ans pour une entreprise qui vient de pivoter son modèle n'est plus informatif.
4. **Capex constant pendant une transition de croissance.** Une SaaS mature qui migre de datacenters internes vers le cloud devrait voir son capex baisser — modélisez-le.
5. **Ignorer la rémunération en actions (SBC).** Traiter la SBC comme un add-back non cash sans modéliser la dilution gonfle le résultat de 5–15% pour les tech.

## Comment construire votre premier DCF en moins d'une heure

Une séquence pragmatique recommandée aux modélisateurs débutants :

1. **Récupérer 3 ans d'états financiers historiques.** Compte de résultat, bilan, tableau de flux. [SEC EDGAR][edgar] est gratuit ; [PickSkill][chat] les extrait automatiquement.

[edgar]: https://www.sec.gov/edgar
[chat]: /chat

2. **Calculer le free cash flow historique.** Cash flow opérationnel − capex = FCF. Tracez-le.
3. **Projeter 5 ans.** Croissance du CA, marge EBIT, taux d'impôt, capex en % du CA, variations de BFR. Une ligne par hypothèse avec un commentaire qui la justifie.
4. **Choisir un WACC.** Cherchez sur une source crédible (le [jeu de données Damodaran de NYU Stern][damodaran] est la référence, mis à jour chaque trimestre avec taux sans risque, primes de risque actions, bêtas par industrie) ou dérivez-le via CAPM avec les rendements actuels des Treasuries.
5. **Choisir une approche de valeur terminale** — essayez les deux (Gordon growth et multiple de sortie), rapportez les deux.
6. **Lancer une table de sensibilité.** WACC sur un axe (±150 bp autour de votre base), croissance terminale ou multiple de sortie sur l'autre. Surlignez la cellule de votre hypothèse de base.
7. **Rédigez un commentaire de 200 mots** sur ce qui devrait être vrai pour que le résultat soit juste.

L'étape 7 est ce qui sépare un modèle qui éclaire une décision d'une feuille de calcul qui la décore.

## Comment PickSkill construit un DCF à la demande

Ouvrez un chat et tapez quelque chose comme :

> *« Construis un DCF pour NVDA dans Excel — feuille d'hypothèses, projection de FCF à 5 ans, WACC + sensibilité, synthèse de valorisation. »*

PickSkill récupère les historiques depuis les filings SEC + les données de marché, choisit des valeurs par défaut sensées pour chacune des quatre hypothèses ci-dessus (avec sources), exécute le calcul, dépose le résultat dans un fichier Excel téléchargeable, et vous guide dans les hypothèses en discussion. Un premier DCF prend 60–90 secondes.

Le modèle n'est pas une boîte noire — chaque hypothèse est éditable, chaque chiffre est sourcé, et vous pouvez poser des questions de suivi comme *« remonte la croissance du CA en année 2 à 25% et refais tourner la sensibilité »* sans ouvrir Excel.

## FAQ

**Quelle est la différence entre DCF et VAN ?**
La Valeur Actuelle Nette (VAN) est la technique générale d'actualisation des flux futurs au présent. Le DCF est l'application de la VAN à la valorisation d'une entreprise entière. Mêmes maths, périmètre plus étroit.

**Le DCF est-il encore pertinent pour les valeurs technologiques ?**
Oui, avec des ajustements. Traitez la rémunération en actions (SBC) comme un coût réel (pas un add-back non cash). Utilisez des périodes de projection plus longues (7–10 ans) pour capturer la rampe de croissance. Tabulez généreusement la sensibilité sur la marge terminale — c'est là que la valeur vit.

**Pourquoi un petit changement de WACC fait-il autant bouger la réponse ?**
Le DCF compose l'actualisation sur la période de projection. Un mouvement de 100 bp sur le WACC décale le flux actualisé de chaque année, et l'effet se compose — typiquement 8–15% sur la valeur entreprise pour un DCF à 5 ans.

**Faut-il utiliser le DCF non endetté ou endetté ?**
Non endetté (FCFF) dans la plupart des contextes equity research car il sépare l'opérationnel des décisions de structure de capital. Endetté (FCFE) quand la structure de capital est l'enjeu — LBOs, thèses pilotées par un recap, tout cas où le levier change matériellement.

**Où trouver les inputs WACC actuels ?**
La [page de données Damodaran de NYU Stern][damodaran] est la référence standard, mise à jour chaque trimestre avec taux sans risque, primes de risque actions, bêtas par industrie et primes de risque pays. [PickSkill][chat] utilise ces valeurs par défaut et permet de les surcharger.
