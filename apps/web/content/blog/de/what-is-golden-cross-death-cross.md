---
title: Was ist ein Goldenes Kreuz (und Todeskreuz)? Das 50/200-MA-Signal erklärt
description: >-
  Ein Goldenes Kreuz entsteht, wenn der 50-Tage-MA den 200-Tage-MA von unten
  kreuzt. Formel, historische Trefferquoten, warum das nackte Signal überschätzt
  wird, und wie man es richtig nutzt.
publishedAt: 2026-05-25T00:00:00.000Z
updatedAt: 2026-05-25T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    Das PickSkill-Research-Team — wir bauen einen AI-Analysten für
    Privatanleger.
pillar: explainer
tags:
  - Goldenes Kreuz
  - Todeskreuz
  - Gleitender Durchschnitt
  - Technische Analyse
heroImage: /blog/what-is-golden-cross-death-cross/hero.png
heroAlt: >-
  Editorial-Infografik — die 50-Tage-MA kreuzt die 200-Tage-MA von unten; die
  Underwater-Variante (200-Tage-MA noch fallend) ist hervorgehoben.
---

**Ein Goldenes Kreuz ist der Moment, in dem ein kurzfristiger gleitender Durchschnitt (typischerweise der 50-Tage) einen langfristigen gleitenden Durchschnitt (typischerweise den 200-Tage) von unten nach oben kreuzt. Ein Todeskreuz ist das Gegenteil — der kurze MA kreuzt den langen MA von oben nach unten.** Finanzmedien lieben diese Kreuze, weil sie sich gut als Schlagzeile eignen. Backtests zeigen, dass das nackte Signal näher an einer Münzwurf-Wahrscheinlichkeit liegt, als die Schlagzeilen einräumen. Das Kreuz wird erst dann nützlich, wenn man versteht, welche Variante man vor sich hat und in welchem Zustand sich der zugrunde liegende Trend befindet.

### Kernaussagen

- **Standarddefinition**: 50-Tage-SMA kreuzt 200-Tage-SMA auf Tagesschlusskursbasis. Einige Plattformen verwenden EMA(50) / EMA(200); der Unterschied ist gering.
- **Die historische Trefferquote des Goldenen Kreuzes ist moderat, nicht magisch.** Beim S&P 500 seit 1950 haben Goldene Kreuze 12-Monats-Renditen von etwa 10–12% vorangegangen — nahe dem langfristigen Marktdurchschnitt. Die Schiefe stammt von einigen wenigen großen Gewinnern.
- **Das „Underwater"-Goldene-Kreuz zählt.** Wenn das Kreuz erfolgt, während der 200-Tage immer noch fällt, hat sich der Trend noch nicht gedreht — Sie erwischen das *erste Anzeichen* einer möglichen Wende, nicht eine bestätigte. PickSkill markiert diese explizit über das *Underwater-Goldenes-Kreuz*-Signal.
- **Todeskreuze signalisieren Regimewechsel zuverlässiger als Goldene Kreuze.** Drawdowns nach Todeskreuzen lagen im Schnitt bei etwa 6–10% vor der Erholung; sie funktionieren besser als Risk-off-Filter denn als Short-Trigger.
- **Auf dem [/indicators](/indicators) MA-Dashboard** für jede Position sichtbar, mit Kreuz-Historie und explizit markiertem Underwater-Status.

## Wie funktioniert das Goldene Kreuz mechanisch?

Zwei gleitende Durchschnitte, zwei Steigungen, ein Schnittpunkt.

| Komponente | Formel | Bedeutung |
|---|---|---|
| Kurzer MA | `SMA(close, 50)` | Etwa 2,5 Monate Schlüsse — der mittelfristige Trend |
| Langer MA | `SMA(close, 200)` | Etwa 10 Monate Schlüsse — der langfristige Trend |
| Kreuz | Wert des kurzen MA geht von unter zu über dem Wert des langen MA | „Der mittelfristige Trend ist jetzt stärker als der langfristige Trend" |

Das Goldene Kreuz geschieht an einem ganz bestimmten Bar — dem Tag, an dem der kurze MA den langen MA von unten kreuzt. Davor lag der kurze MA unter dem langen, danach liegt er darüber. Das Kreuzen ist die Unstetigkeit; ob es Bestand hat, hängt davon ab, was als Nächstes passiert.

Dieselbe Logik gilt für andere Fensterpaare (20/60, 5/20 für kürzere Horizonte), aber das 50/200 wird mit Abstand am meisten beobachtet, weil es die Frage beantwortet, die institutionelle Risk-Desks interessiert: „Hat sich das mittelfristige Bild gegenüber dem langfristigen Bild ins Positive gedreht?"

## Warum zählt das Kreuz (und warum wird es überschätzt)?

Das Kreuz zählt, weil zwei strukturelle Mechanismen es verstärken:

1. **Systematische Risk-on- / Risk-off-Regeln nutzen es.** Ein nicht unerheblicher Teil der Trendfolger-Fonds und CTA-Strategien handelt auf einfachen MA-Kreuz-Regeln. Wenn der S&P 500 seinen 200-Tage-MA von unten kreuzt, schichten diese Fonds in Aktien um. Der Flow ist real und am Tag des Kreuzes selbsterfüllend — weshalb das Volumen um große Index-Goldene-Kreuze herum oft hochschnellt.
2. **Finanzmedien verstärken es.** Schlagzeilen wie „S&P 500 bestätigt Goldenes Kreuz" treiben Retail-Flow. Ob das Signal „funktioniert" oder nicht, die Aufmerksamkeit verschiebt marginales Kapital.

Es wird überschätzt, weil das nackte Kreuz schwächere Out-of-Sample-Edge hat, als gemeinhin angenommen:

- Über globale Aktienindizes hinweg seit 1970 entspricht die mediane 12-Monats-Rendite nach einem Goldenen Kreuz ungefähr der unkonditionalen 12-Monats-Rendite desselben Index. Der Mittelwert wird durch eine kleine Zahl großer Gewinner nach oben verzerrt, was bedeutet, dass das *typische* Ergebnis unspektakulär ausfällt.
- Kreuze sind stark pfadabhängig vom vorherigen Trend. Ein Kreuz am *Boden* eines tiefen Drawdowns („erstes Kreuz nach einem Bärenmarkt") hat materiell bessere Forward-Renditen als ein Kreuz während eines langen Aufwärtstrends. Die Schlagzeile „Goldenes Kreuz" behandelt beide identisch.

Hier kommt der Zusatz *underwater* ins Spiel.

## Was ist ein „Underwater"-Goldenes-Kreuz — und warum ist es die wertvollste Variante?

Der 200-Tage-SMA hat selbst eine Steigung. Das Kreuz kann in zwei Regimen auftreten:

| Variante | Steigung des 200-Tage beim Kreuz | Interpretation |
|---|---|---|
| **Underwater-Goldenes-Kreuz** | **Fallend** | Trend hat sich noch nicht gedreht; das ist das *erste Anzeichen*, dass der Abwärtstrend brechen könnte |
| **Standard-Goldenes-Kreuz** | **Steigend** | Trend war bereits aufwärts; das ist ein Fortsetzungssignal nach einem Rücksetzer |

Die Underwater-Variante hat historisch die stärksten Forward-Renditen produziert — sie erfasst einen Regimewechsel, nicht eine Regimefortsetzung. Sie ist auch die seltenere der beiden: Über die großen US-Indizes hinweg treten Underwater-Goldene-Kreuze etwa 2–4 mal pro Jahrzehnt auf, typischerweise am Ende großer Drawdowns. Wenige davon über eine 20-jährige Karriere zu erwischen ist wertvoller, als auf jedes Fortsetzungskreuz zu reagieren.

Das PickSkill *Underwater-Goldenes-Kreuz*-Dashboard scannt alle Positionen nach genau diesem Muster — kurzer MA über langem MA, aber langer MA noch fallend. Es ist bewusst ein enger Filter, der die kleine Zahl von Werten zeigt, die die Variante mit der höheren Edge aufweisen.

## Wie sollte ein Todeskreuz interpretiert werden?

Ein Todeskreuz ist das symmetrische Ereignis: Der 50-Tage-SMA kreuzt den 200-Tage-SMA von oben nach unten. Die Standardinterpretation lautet: „Der mittelfristige Trend hat sich relativ zum langfristigen Trend gedreht."

Zwei praktische Punkte, die Retail-Leitfäden zu wenig betonen:

- **Todeskreuze sind eher spät als früh.** Bis das Kreuz druckt, ist der Markt oft bereits 15–25% von seinem Hoch gefallen. Das Todeskreuz im Moment des Kreuzens als „Verkaufssignal" zu behandeln heißt, den Boden einer Phase zu verkaufen, nicht das Hoch.
- **Ihre wertvollste Anwendung ist als Long-Side-Risikofilter, nicht als Short-Trigger.** „Wenn der S&P unter seinem 200-Tage-SMA schließt, reduziere ich Long-only-Aktienexposure auf 50%" ist eine verteidigbare Regel, gestützt durch jahrzehntelange Drawdown-Daten. „Den S&P bei einem Todeskreuz shorten" hat ein deutlich schlechteres Risiko/Rendite-Profil aufgrund der Streuung der Forward-Renditen.

## Vier Fallstricke beim Interpretieren von Kreuz-Signalen

1. **Das Kreuz binär behandeln.** Das Kreuz ist ein Moment; Trends sind Prozesse. Ein Kreuz, gefolgt von einer unmittelbaren Umkehr zurück über die Linie („Whipsaw-Kreuz"), ist in volatilen Märkten häufig und produziert aufeinanderfolgende Fehlsignale.
2. **Die Steigung des langen MA ignorieren.** Ein Kreuz bei flachem langem MA ist weit weniger aussagekräftig als ein Kreuz, bei dem der lange MA selbst dreht. Die Kombination aus *Kreuz plus Steigungsänderung des langen MA* ist die Variante mit der höheren Edge.
3. **Das Kreuz auf verrauschte Einzelwerte anwenden.** Das 50/200-Kreuz ist am zuverlässigsten bei breiten Indizes und Large-Caps mit glatten Trends. Bei Small-Caps mit häufigen Gaps feuert das Kreuz wiederholt ohne informativen Inhalt.
4. **Vergessen, dass das Kreuz ein abgeleitetes Signal ist.** Das Kreuz wird aus dem Kurs konstruiert; es kann nicht mehr aussagen als das, was bereits im Chart steht. Volumenbestätigung, Marktbreite-Bestätigung (wie viele Subkomponenten ebenfalls kreuzen) und Makro-Kontext liefern zusätzliche Information, die das Kreuz allein nicht hat.

## Wie sich Kreuze auf A-Aktien verhalten

Das 50/200-SMA-Kreuz ist in der A-Aktien-Retail-Community kulturell weniger verankert als in den USA. Lokale Konvention betont eher das 20/60-Kreuz und das tägliche 5/10-Kreuz fürs Swing-Trading. Zwei strukturelle Effekte zum Mitdenken:

- **Tägliche Preisgrenzen** erzeugen während Runaway-Bewegungen Stufenmuster sowohl im 50-Tage- als auch im 200-Tage-SMA. Limit-up-Serien verzögern das sichtbare Kreuz um 1–3 Bars gegenüber einem frei handelnden Markt. Das Kreuz selbst feuert am korrekten Tag; die gleitenden Durchschnitte hinken nur während der Limit-Phase nach.
- **Index-Rekonstitution.** A-Aktien-Indizes werden aggressiver rekonstituiert als US-Indizes. Ein Kreuz bei einem A-Aktien-Index kann teilweise die Indexzusammensetzung statt einer Markttrendänderung widerspiegeln — bei Einzelaktien-Signalen ist das Kreuz davon unberührt, aber beim breiteren Index lohnt es sich zu prüfen, ob ein Rekonstitutions-Datum naheliegt.

Für die breitere marktweise Sicht siehe [Beste Indikatoren für A-Aktien](/blog/best-indicators-for-a-shares) und [MACD bei A-Aktien vs US-Aktien](/blog/macd-on-a-shares-vs-us).

> **Verfolgen Sie es in Ihrem Portfolio.** Die [/indicators](/indicators)-Seite zeigt den 50/200-Kreuz-Status für jede Position, mit gekennzeichnetem *Underwater*-Zustand, wenn der lange MA noch fällt. Der 5-Tage-Pfad zeigt, wie sich der Kreuz-Status über die Handelswoche entwickelt hat.

## Wie man das Kreuz in einem realen Workflow nutzt

Das Kreuz ist am nützlichsten als ein Input in einem Mehrfach-Signal-Filter, nicht als eigenständiger Trigger. Ein praktischer Workflow:

1. **Verwenden Sie das Kreuz zur Regime-Definition.** Long-only-Allokation ist aktiv, wenn der Kurs über dem 200-Tage-SMA *und* der 50-Tage-SMA über dem 200-Tage-SMA liegt. Reduzieren oder hedgen, wenn beide Bedingungen verletzt sind.
2. **Verwenden Sie die *Underwater*-Variante als Watchlist-Trigger.** Wenn ein einzelner Wert ein Underwater-Goldenes-Kreuz druckt, rückt dieser Wert von „ignorieren" zu „Research-Kandidat" auf. Bestätigen Sie mit fundamentaler Arbeit, bevor Sie die Position aufbauen.
3. **Verwenden Sie das Todeskreuz als portfolioweiten Risikofilter.** Wechseln Sie von aggressiver zu defensiver Exposure, wenn der breite Index ein Todeskreuz druckt; kehren Sie um, wenn der Index seinen 200-Tage-SMA zurückerobert und ein frisches Goldenes Kreuz druckt.

Das Kreuz ist ein Filter dafür, *wann hinzuschauen*, nicht ein Trigger dafür, *was zu tun*. Kombinieren Sie es mit [MACD](/blog/what-is-macd) zur Momentum-Bestätigung, [RSI](/blog/what-is-rsi) für Überkauft-/Überverkauft-Kontext und fundamentaler Arbeit für die Positionsgrößenbestimmung.

## Weiterführende Literatur

- [Investopedia zum Goldenen Kreuz](https://www.investopedia.com/terms/g/goldencross.asp) — umfassende Referenz mit historischen Beispielen.
- [Meb Faber, *A Quantitative Approach to Tactical Asset Allocation*](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=962461) — die kanonische akademische Arbeit, die zeigt, dass einfache MA-Kreuz-Regeln im Zeitverlauf risikoadjustierte Outperformance liefern.

## FAQ

**Funktioniert das Goldene Kreuz tatsächlich?**
Das nackte 50/200-Kreuz hat historisch 12-Monats-Forward-Renditen produziert, die etwa mit der unkonditionalen Marktrendite übereinstimmen — auf Einzelsignal-Basis nahe einem Münzwurf. Das Signal wird erst dann sinnvoll positiv, wenn es mit dem *Underwater*-Zustand (langer MA fällt noch), Volumenbestätigung und Marktbreite-Bestätigung kombiniert wird. Behandeln Sie das Kreuz als Watchlist-Trigger und Regime-Filter, nicht als Kauftaste.

**Ist ein 50/200-Kreuz anders als ein 20/60-Kreuz?**
Ja — unterschiedliche Horizonte beantworten unterschiedliche Fragen. Das 50/200 (≈2,5 Monate vs. ≈10 Monate) spricht das mittel- vs. langfristige Regime an; das 20/60 (≈1 Monat vs. ≈3 Monate) spricht das kurz- vs. mittelfristige Momentum an. Das 20/60 produziert häufigere Signale, aber geringere Edge je Signal. Die meisten institutionellen Risikoframeworks nutzen das 50/200; Swing-Trader beobachten das 20/60 oder 5/20.

**Was ist der Unterschied zwischen einem Goldenen Kreuz und einem bullischen MA-Crossover?**
Die Begriffe werden oft synonym verwendet, aber streng genommen bezeichnet „Goldenes Kreuz" speziell das 50/200-SMA-Kreuz auf einem Tagesbasis-Chart. Jedes andere Fensterpaar (10/20, 20/60, 5/13) ist ein „bullischer Moving-Average-Crossover", aber nicht das Goldene Kreuz. Die Unterscheidung zählt vor allem in Finanzmedien-Schlagzeilen, die „Goldenes Kreuz" für das 50/200-Ereignis reservieren.

**Warum ist das Kreuz „spät"?**
Beide Inputs sind nachlaufende Indikatoren. Der 50-Tage-SMA spiegelt die letzten zehn Wochen wider; der 200-Tage die letzten zehn Monate. Bis der kurze den langen kreuzt, bewegt sich der zugrunde liegende Kurs in der Regel schon wochenlang. Das Kreuz ist ein *Bestätigungs*-Ereignis, kein *Antizipations*-Ereignis. Wenn Sie frühere Signale wollen, brauchen Sie vorlaufende Indikatoren (Volumenprofil, Options-Skew, Marktbreite-Divergenz) — aber die haben ihre eigenen Fehlsignalprobleme.

**Kann ich Optionen auf ein Goldenes Kreuz handeln?**
Sie können, aber die Struktur ist heikel. Das Kreuz ist ein seltenes Ereignis (einige Male pro Jahr bei einem einzelnen Ticker, vielleicht wöchentlich in einem 50-Werte-Portfolio), und die implizite Volatilität um das Kreuz herum preist oft bereits ein gewisses Maß an Trenderkennung ein. Calls *im Moment des Kreuzes* zu kaufen zahlt oft eine Prämie für die Schlagzeile. Die Variante mit der höheren Edge ist, sich vor dem Kreuz zu positionieren — mit dem *Underwater*-Setup und einem überverkauften [RSI](/blog/what-is-rsi)-Wert als Watchlist-Trigger.
