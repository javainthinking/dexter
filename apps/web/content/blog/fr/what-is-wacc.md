---
title: Qu'est-ce que le WACC ? Le taux d'actualisation
description: Le WACC est le taux d'actualisation qui décide tout DCF. Formule, quatre inputs clés, pourquoi 100pb bougent 8-15% de valeur, workflow de triangulation.
publishedAt: 2026-05-22
updatedAt: 2026-05-22
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: L'équipe de recherche PickSkill — un analyste IA pour les investisseurs particuliers.
pillar: explainer
tags:
  - valuation
  - wacc
  - capital-cost
  - fundamentals
heroImage: /blog/what-is-wacc/hero.png
heroAlt: Illustration éditoriale d'un cadran de moyenne pondérée stylisé en tons sombres et chauds avec des accents émeraude
---

Le **WACC (coût moyen pondéré du capital)** est le rendement mixte qu'une entreprise doit générer sur ses actifs pour satisfaire à la fois les actionnaires et les créanciers. Dans un modèle DCF, c'est le taux utilisé pour actualiser les flux de trésorerie futurs au présent — le chiffre unique qui détermine, en silence, si une action paraît « sous-évaluée de 30 % » ou « surévaluée de 30 % ». Si vous vous trompez de WACC, tous les autres chiffres du modèle finissent en bruit.

Ce guide couvre la formule, les quatre variables qui comptent vraiment, les erreurs qui survivent jusqu'aux rapports publiés et comment trianguler un WACC qui tient sous contre-examen.

### Points clés

- **WACC = (E/V) × Re + (D/V) × Rd × (1 − t).** Pondération des fonds propres × coût des fonds propres, plus pondération de la dette × coût de la dette après impôts.
- **Un déplacement de 100 bp du WACC fait bouger un DCF à 5 ans de 8 à 15 %.** La table de sensibilité du WACC est ce que le relecteur regarde en premier.
- **Quatre variables font 90 % du travail** : taux sans risque, prime de risque actions, bêta, coût de la dette après impôts. Concentrez votre temps ici.
- **Utilisez des valeurs de marché, pas comptables, pour les pondérations E/V et D/V** — les fonds propres comptables sont un artefact, pas ce que le marché valorise réellement.
- **PickSkill calcule un WACC sourcé en moins d'une minute** à partir des rendements obligataires actuels, des données sectorielles de Damodaran et des filings de l'entreprise — chaque variable étant éditable en ligne.

## Quelle est la formule du WACC ?

La version de manuel, avec un ajustement fiscal qui compte en pratique :

```
WACC = (E/V) × Re + (D/V) × Rd × (1 − t)
```

Où :

| Symbole | Sens |
|---|---|
| `E` | Valeur de marché des capitaux propres (cours × nombre d'actions) |
| `D` | Valeur de marché de la dette (prix obligataires si traités ; sinon valeur comptable en proxy) |
| `V` | Capital total, `E + D` |
| `Re` | Coût des capitaux propres — ce qu'exigent les actionnaires |
| `Rd` | Coût de la dette avant impôts — ce qu'exigent les prêteurs |
| `t` | Taux d'imposition marginal (l'intérêt étant déductible) |

Le `(1 − t)` est le détail porteur — la dette est moins chère que les fonds propres non seulement parce que les prêteurs exigent moins, mais parce que la charge d'intérêts réduit l'impôt. Une entreprise au taux marginal de 25 % avec une dette à 5 % avant impôts paie en réalité 3,75 % après impôts.

## Pourquoi le WACC est-il important ?

Trois raisons pour lesquelles le WACC est le chiffre le plus conséquent d'un DCF :

1. **Il se cumule sur l'horizon de prévision.** 100 bp de mouvement actualisent le cash-flow de l'année 5 à `1,10⁵ vs 1,11⁵` — environ 4,5 % d'écart, qui s'élargit chaque année supplémentaire. Sur un DCF type à 5 ans, cela représente 8 à 15 % de variation de la valeur d'entreprise (analyse interne PickSkill sur ~200 modèles large-cap en 2025).
2. **Il pilote la sensibilité du dénominateur de la valeur terminale.** La valeur terminale Gordon Growth est `FCFn+1 / (WACC − g)`. Un mouvement de 50 bp du WACC à un taux de croissance de 3 % fait passer le dénominateur de 7 % à 7,5 % — soit 7 % de variation sur la valeur terminale, qui représente 60–80 % de l'EV d'un DCF à 5 ans.
3. **C'est le levier que le relecteur tire en premier.** Quand un objectif de cours diverge du consensus, la première question est presque toujours « quel WACC utilisez-vous ? ». Si vous ne pouvez pas défendre le WACC, vous ne pouvez pas défendre le modèle.

## Les quatre variables qui comptent vraiment

Pour la plupart des sociétés non financières, le coût des fonds propres est la plus grosse pièce du WACC (typiquement 70 à 90 %). À l'intérieur, trois sous-variables CAPM font presque tout le travail :

```
Re = Rf + β × ERP
```

### 1. Le taux sans risque (Rf)

Le rendement d'une obligation souveraine longue — pour les actions cotées aux États-Unis, le Treasury 10 ou 30 ans. Utilisez le rendement **actuel**, pas une moyenne historique. Le rendement d'aujourd'hui est ce qu'un investisseur arbitre contre les rendements actions.

Le 30 ans est plus correct théoriquement pour matcher une valeur terminale perpétuelle, mais le 10 ans est la convention pratique — plus liquide et reflet plus propre de la politique Fed. La plupart des desks sell-side utilisent le 10 ans ; s'aligner facilite la comparaison.

### 2. Prime de risque actions (ERP)

Le supplément de rendement exigé pour détenir des actions plutôt que des obligations sans risque. Il n'y a pas d'ERP « correcte » unique, seulement des plages défendables. Deux méthodes pratiques :

- **Historique** : prime à long terme réalisée des actions sur les Treasuries. Les données US pointent vers 5,0–5,5 % (le dataset Damodaran sur NYU Stern, mis à jour trimestriellement, est la référence la plus citée).
- **Implicite** : résolvez l'ERP qui justifie le prix actuel du S&P 500 vu le consensus de bénéfices. Aujourd'hui cela tombe plutôt à 4,0–4,5 % — plus bas car les valorisations sont élevées.

Choisissez une méthode et déclarez-la. Mélanger historique et implicite dans différentes sections d'un même modèle est l'incohérence type que les relecteurs attrapent.

[damodaran]: https://pages.stern.nyu.edu/~adamodar/

### 3. Bêta (β)

La sensibilité des rendements de l'action à ceux du marché. Calculée par régression glissante — typiquement 5 ans en mensuel, ou 2 ans en hebdomadaire.

Deux modes d'échec courants :

- **Bêta obsolète sur une entreprise transformée.** Une bêta 5 ans pour un éditeur SaaS qui vient d'acquérir un business hardware n'est plus informative — la moitié de la période reflète un autre métier.
- **Bêta pure-play, sans dé-leverager.** Quand les pairs cotés sont bruyants, le standard est de moyenner les bêtas, les dé-leverager pour neutraliser les structures de capital, puis re-leverager au profil de la cible. Sauter l'étape de dé-leverage est la faute la plus courante en modèles d'étudiants.

### 4. Coût de la dette après impôts (Rd × (1 − t))

Pour les sociétés investment-grade avec obligations cotées, lisez le yield-to-maturity directement. Pour les sociétés dont la dette ne cote pas, inférez le coût en ajoutant un spread de crédit (associé à la notation) au rendement du Treasury de duration équivalente. Damodaran publie des spreads synthétiques par tranche de couverture d'intérêts — utile quand vous n'avez pas de notation.

Appliquez le taux **marginal**, pas l'effectif. La déduction d'intérêts abrite du revenu au taux marginal, qui peut diverger sensiblement de l'effectif quand il y a des reports déficitaires, des revenus de source étrangère ou des éléments exceptionnels.

## Comment trianguler un WACC en 15 minutes

Une séquence pragmatique, telle qu'utilisée dans l'outil WACC de PickSkill :

1. **Récupérez le rendement Treasury 10 ans d'aujourd'hui.** Source liquide ; ne moyennez pas.
2. **Choisissez l'ERP d'une seule source** — Damodaran est la référence. Notez si vous utilisez l'historique ou l'implicite ; par défaut, historique.
3. **Obtenez une bêta de régression**, et croisez avec le [dataset bêta sectoriel Damodaran][damodaran]. Si la bêta de l'entreprise s'éloigne de plus de 0,3 de la moyenne du secteur, demandez pourquoi.
4. **Estimez le coût de la dette** via YTM des obligations cotées, ou via le spread synthétique (lookup « interest coverage » de Damodaran).
5. **Calculez les pondérations en valeurs de marché.** La pondération equity est directe. La pondération dette utilise la valeur de marché de la dette — pour de la dette non cotée, la valeur comptable est un proxy raisonnable si les taux n'ont pas bougé de 200 bp depuis l'émission.
6. **Appliquez le taux marginal.** Pour un contribuable US, c'est 21 % fédéral plus un mix d'État — soit 24–26 % au total.
7. **Comparez au WACC sectoriel.** Damodaran publie des WACCs sectoriels trimestriellement. Si votre chiffre s'écarte de plus de 100 bp du secteur, écrivez pourquoi — et assumez l'écart en présentation.

## Pièges classiques qui survivent jusqu'au modèle publié

Une checklist de 134 mots à garder en tête :

1. **Pondérations en valeurs comptables au lieu de marché.** Les fonds propres comptables sont ce que la compta enregistre ; les fonds propres de marché sont ce que les investisseurs détiennent. Une société rentable peut avoir des fonds propres comptables au quart des fonds propres de marché — utiliser des valeurs comptables surpondère la dette et triple-compte le coût des fonds propres.
2. **Coût de la dette avant impôts.** Oublier le `(1 − t)` gonfle le WACC de 100 à 200 bp sur les sociétés très endettées.
3. **Taux d'imposition obsolète.** Les sociétés en transition (réforme fiscale US, multinationales déplaçant leur siège) ont des taux qui ne matchent pas le taux statutaire. Vérifiez avec la note fiscale du dernier 10-K.
4. **Ignorer les loyers.** Sous IFRS 16 / ASC 842, les loyers opérationnels figurent au bilan comme dette — et beaucoup d'analystes du retail / aérien / restauration les omettent encore dans `D/V`.
5. **CAPM pour une société privée sans dé-leverager les bêtas comparables.** Une bêta de pairs avec la mauvaise structure de capital produit du n'importe quoi. Toujours dé-leverager puis re-leverager.

## Comment PickSkill construit un WACC

Ouvrez un chat et tapez :

> *« Sors-moi un WACC pour AMD — montre-moi les inputs et laisse-moi ajuster l'ERP. »*

PickSkill récupère le rendement Treasury 10 ans d'aujourd'hui, la dernière ERP et la bêta sectorielle Damodaran, les rendements obligataires de l'entreprise (ou le spread synthétique si pas de dette notée), et le taux marginal de la note fiscale du dernier 10-K. Il calcule la moyenne pondérée, expose chaque input et vous laisse en modifier n'importe lequel en ligne — le résultat se met à jour en direct, et la source de chaque chiffre est à un clic.

Les maths sont les mêmes que dans Excel. La différence : les 8 minutes de collecte sont compressées à ~30 secondes, et chaque input est sourcé — quand un relecteur demande « d'où vient l'ERP ? », la réponse est un lien, pas une supposition.

Ce WACC se branche directement sur [l'outil DCF](/blog/what-is-dcf) pour la valorisation complète.

## FAQ

**Quel est un WACC typique pour une société cotée ?**
Pour les large-caps US 2025–2026, les WACCs se groupent entre 8 et 11 %. Les secteurs défensifs matures (utilities, biens de consommation de base) sont plutôt 6–8 % ; tech et biotech à forte croissance, 10–13 % ; producteurs de matières premières cycliques, 9–15 % selon le levier.

**Le WACC doit-il évoluer sur l'horizon de prévision ?**
Théoriquement, oui — la structure de capital converge habituellement vers une cible long terme. En pratique, la plupart des analystes utilisent un WACC unique sur tout l'horizon pour garder le modèle traitable, et ne le flexent qu'à l'étape du terminal. Les deux sont défendables ; l'essentiel est la cohérence interne au modèle.

**Pourquoi utiliser la valeur de marché de la dette plutôt que la comptable ?**
Quand les taux montent, la valeur de marché d'une dette à taux fixe tombe sous la comptable. Une société qui a émis du 3 % quand les taux étaient à 2 % détient aujourd'hui de la dette qui cote sensiblement sous le pair — et c'est cette valeur de marché qui appuie réellement la créance des actionnaires. Sur de la dette IG cotée, l'écart peut être de 5–15 % du pair ; l'ignorer fausse D/V.

**Puis-je utiliser un WACC unique pour une société multi-segments ?**
Seulement en première approche. Si la société opère des métiers à profils de risque très différents (software grand public + paiements + hardware), une valorisation somme des parties avec WACCs par segment est plus honnête. Pour un premier jet, un WACC mixé pondéré par EBIT du segment est acceptable.

**Où trouver les inputs WACC actuels ?**
La [page de données Damodaran à NYU Stern][damodaran] est la référence standard, mise à jour trimestriellement avec taux sans risque, prime de risque actions, bêtas sectoriels et spreads de crédit synthétiques. [PickSkill](/chat) utilise ces valeurs par défaut et permet d'écraser chacune en ligne.
