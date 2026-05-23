---
title: Comment résumer n'importe quel 10-K en 60 secondes avec PickSkill
description: Collez un prompt → MD&A, FCF, dette nette, croissance segments, diff YoY des Risk Factors, notes — chaque affirmation liée à la source EDGAR.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: L'équipe de recherche PickSkill — un analyste IA pour les investisseurs particuliers.
pillar: how-to
tags:
  - tutorial
  - 10-k
  - filings
  - workflow
heroImage: /blog/summarise-a-10k-in-60-seconds/hero.png
heroAlt: Infographie comparant la lecture manuelle d'un 10-K (30 min) à PickSkill (60 sec)
---

Le [guide pour lire un 10-K](/blog/how-to-read-10k) montre les quatre sections du rapport annuel qui comptent vraiment (Items 7, 8, 1A, et les annexes vers lesquelles ils renvoient). Cet exercice prend 30 minutes en autonomie. Ce tutoriel parcourt le même flux en 60 secondes avec PickSkill — highlights du MD&A, les trois chiffres d'états financiers qui comptent, un diff des Facteurs de Risque contre le filing de l'année précédente, et une liste d'annexes à poursuivre. Chaque affirmation est liée à la page du filing source.

### Points clés

- **Quatre étapes, ~60 secondes.** Ouvrir un chat, coller le prompt, obtenir un walk-through de 90 secondes, poser des follow-ups.
- **MD&A en clair.** Pas la paraphrase de la société — PickSkill extrait le commentaire opérationnel substantiel.
- **Trois chiffres financiers** automatiques : [FCF](/blog/what-is-fcf), dette nette, croissance YoY par segment.
- **Diff des Facteurs de Risque** contre le 10-K de l'année précédente — seul le langage nouveau ou substantiellement modifié, le boilerplate inchangé est supprimé.
- **Avec liens source.** Chaque affirmation et chaque chiffre à un clic du document original sur SEC EDGAR.

## Pourquoi c'est important

Un investisseur particulier qui lit vraiment les 10-Ks obtient un avantage significatif sur celui qui ne lit que les communiqués — mais lire un filing de 200 pages est un vrai investissement de temps, et les parties qui comptent sont éparpillées. Ce tutoriel retire la phase de chasse.

## Le flux en 4 étapes

### Étape 1 — Ouvrir un chat

[/chat](/chat) et connectez-vous (un clic, essai gratuit).

### Étape 2 — Coller le prompt

```text
Résume le dernier 10-K de NVDA. Donne-moi :
- Highlights du MD&A (drivers de CA YoY, langage sur la liquidité)
- FCF, dette nette, croissance par segment
- Changements de Facteurs de Risque vs. l'an dernier — uniquement nouveau ou substantiellement modifié
- Annexes à poursuivre
- Liens vers les pages source pour chaque affirmation
```

### Étape 3 — Attendez ~30 secondes

PickSkill :
1. Récupère le dernier 10-K (et celui de l'année précédente, pour le diff) sur [SEC EDGAR][edgar].
2. Extrait l'Item 7 (MD&A) et localise « Liquidity and Capital Resources ».
3. Extrait les trois états financiers ; calcule [FCF](/blog/what-is-fcf), dette nette, croissance par segment.
4. Diff de l'Item 1A contre le filing précédent mot par mot, fait remonter uniquement les paragraphes nouveaux ou substantiellement modifiés.
5. Flague 1–3 annexes les plus susceptibles de contenir des divulgations matérielles nouvelles.
6. Écrit le résultat comme walk-through en streaming de 90 secondes avec chaque affirmation liée à la page source.

[edgar]: https://www.sec.gov/edgar

### Étape 4 — Posez des follow-ups

C'est là que le tutoriel sépare un résumé d'un flux de recherche :

```text
Le diff Facteurs de Risque a mentionné « concentration clients » — sors le
langage exact et dis-moi quel client (cross-référence avec les segments).
```

```text
Le MD&A a noté que les marges opérationnelles se sont comprimées YoY — décompose
si c'était COGS, SG&A ou R&D. Montre-moi le delta YoY de chacun.
```

```text
Quel est le mur d'échéances de la société sur les 3 prochaines années ?
Tire de l'annexe d'échéancier de dette.
```

PickSkill garde le filing en contexte, donc chaque follow-up récupère directement du même document.

> **Essayez maintenant.** [Ouvrez un chat](/chat) et collez le prompt de l'Étape 2 avec n'importe quel ticker US.

## À quoi ressemble la sortie

| Section | Ce que vous obtenez |
|---|---|
| **MD&A** | 4–6 bullets couvrant les drivers YoY, le mouvement des marges, le commentaire liquidité. |
| **Financiers** | 3 chiffres : FCF TTM, dette nette récente, croissance YoY par segment. |
| **Diff Facteurs de Risque** | Liste courte de *seulement* les paragraphes nouveaux ou modifiés. |
| **Annexes à surveiller** | 1–3 numéros d'annexe + une phrase pourquoi chacune mérite lecture. |
| **Liens source** | Chaque ligne avec « [source] » → page exacte du filing sur EDGAR. |

## Ce qui n'est pas possible en 60 secondes

- **Analyse forensique comptable complète.**
- **Lire le proxy (DEF 14A).**
- **Vérifier chaque affirmation indépendamment.** Le walk-through est un point de départ.

## Pourquoi ce tutoriel complète l'explainer

Le [guide 10-K](/blog/how-to-read-10k) enseigne quoi chercher dans chaque section — c'est le framework. Ce tutoriel retire la friction pour y arriver. Lisez l'explainer une fois ; utilisez le tutoriel à chaque nouveau nom recherché.

Le même pattern se répète dans le foundation cluster :
- [Qu'est-ce que le DCF ?](/blog/what-is-dcf) → [Bâtir un DCF en 60 sec](/blog/build-dcf-in-60-seconds)
- [Qu'est-ce que le WACC ?](/blog/what-is-wacc) — couvert dans le tutoriel DCF
- [Qu'est-ce que le FCF ?](/blog/what-is-fcf) — chiffre #1 ci-dessus
- [Lire un 10-K en 30 min](/blog/how-to-read-10k) → ce tutoriel

## FAQ

**Ça marche sur HK et A-shares ?**
Oui — PickSkill reconnaît les tickers HKEx (ex. `9988.HK`) et tire le rapport annuel équivalent depuis HKEx Disclosure. A-shares depuis Cninfo.

**Quelle est la précision du diff Facteurs de Risque ?**
Substantiellement précis au niveau du paragraphe. PickSkill aligne phrase par phrase et supprime les éditions cosmétiques.

**Puis-je le lancer sur des 10-Q ?**
Oui — même flux, dites « résume le dernier 10-Q ». Le diff Risk Factors est moins utile sur 10-Q, mais le delta MD&A vs trimestre précédent est à haut signal.

**Et si le filing est trop long ?**
Un 10-K typique fait 150–300 pages. PickSkill gère jusqu'à ~500. Pour des conglomérats avec d'énormes 10-Ks, le flux prend 2–3 minutes.

**D'où PickSkill tire-t-il les filings ?**
Directement de [SEC EDGAR](https://www.sec.gov/edgar) pour les US, HKEx Disclosure pour Hong Kong, Cninfo pour A-shares. Pas d'intermédiaire.
