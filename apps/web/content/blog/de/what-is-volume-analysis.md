---
title: >-
  Was ist Volumenanalyse? Die Bestätigungsschicht, die die meisten Privatanleger
  überspringen
description: >-
  Volumen misst die Marktteilnahme hinter jeder Kursbewegung. Warum Volumen
  Ausbrüche bestätigt, die 4 Volumenmuster, die zählen, und wie man VROC und
  Volumen-Profil liest.
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
  - Volumen
  - Technische Analyse
  - Indikatoren
  - Partizipation
heroImage: /blog/what-is-volume-analysis/hero.png
heroAlt: >-
  Editorial-Infografik — 25-Balken-Volumenhistogramm mit gestricheltem
  20-Tage-Durchschnitt und einem in Smaragdgrün hervorgehobenen
  2,5×-RVOL-Ausschlag.
---

**Volumen ist die Anzahl der Aktien (oder Kontrakte), die in einem bestimmten Bar gehandelt werden — und es ist der am stärksten unterbenutzte Datenpunkt in der technischen Retail-Analyse.** Der Kurs sagt Ihnen, wohin der Markt ging; das Volumen sagt Ihnen, wie viele Leute mitgegangen sind. Eine Bewegung auf hohem Volumen spiegelt breite Überzeugung wider; eine Bewegung auf geringem Volumen spiegelt eine Handvoll Teilnehmer wider. Der reine Kurs-Chart kann sich über die Richtung einig sein und immer noch wenig bedeuten, wenn das Volumen darunter sagt, dass niemand aufgetaucht ist.

### Kernaussagen

- **Drei Muster dominieren die Analyse**: Ausbruchsvolumen (hohes Volumen bestätigt einen Bruch), Erschöpfungsvolumen (extremes Volumen am Ende einer Bewegung signalisiert Climax) und Trockenphasen-Volumen (Volumen kontrahiert vor einer großen direktionalen Bewegung).
- **Die Basisreferenz ist das 20-Tage-Durchschnittsvolumen.** Ein Bar bei 2× des 20-Tage-Durchschnitts ist bedeutsam hoch; bei 3× außergewöhnlich. Unter 0,5× des Durchschnitts ist „keine Partizipation" und signalisiert nahezu null Überzeugung.
- **Volumen bestätigt; es führt nicht.** Eine Kursbewegung, die vom Volumen gestützt wird, setzt sich wahrscheinlicher fort. Fehlendes Volumen ist eine gelbe Flagge, kein Verkaufssignal.
- **Der blinde Fleck des Volumens**: Es unterscheidet nicht zwischen Käufern und Verkäufern. Verwenden Sie [Geldfluss-Indikatoren](/blog/what-is-capital-flow) (OBV, MFI, CMF), wenn Sie richtungsgewichtetes Volumen brauchen.
- **Auf jedem PickSkill-Chart verfügbar** — das [/indicators](/indicators)-Volumen-Dashboard zeigt VROC, relatives Volumen und den 5-Tage-Partizipations-Bucket für jede Position.

## Was ist „normales" Volumen — und wie misst man es?

Volumen ist immer relativ. Derselbe 5-Mio.-Aktien-Bar ist bei Apple ein Nicht-Ereignis und bei einem Micro-Cap mit 300-Mio.-$-Marktkapitalisierung ein Extremereignis. Zwei Normalisierungswerkzeuge erledigen den Großteil der Arbeit:

### Relatives Volumen (RVOL)

```
RVOL = Heutiges Volumen / 20-Tage-Durchschnittsvolumen
```

Ein einfaches Verhältnis. RVOL = 1,0 ist genau Durchschnitt; 2,0 ist doppelt; 0,5 ist die Hälfte. Das 20-Tage-Fenster glättet Einzel-Bar-Anomalien aus, während es auf jüngere Regimewechsel reagiert.

| RVOL | Interpretation |
|---|---|
| **< 0,5** | Ruhig — keine Partizipation, Signale bei diesem Volumen sind überwiegend Rauschen |
| **0,5–1,0** | Unterdurchschnittlich — mit normaler Vorsicht fortfahren |
| **1,0–1,5** | Normal bis aktiv — Standardbedingungen |
| **1,5–2,5** | Hoch — bedeutsame Partizipation; Ausbrüche hier folgen tendenziell durch |
| **> 2,5** | Außergewöhnlich — institutioneller Flow, News-Ereignis oder Kapitulation in Arbeit |

Die PickSkill-Dashboards zeigen RVOL auf jedem Chart, sodass Sie auf einen Blick sehen, ob die heutige Bewegung auf echter Partizipation oder nur Kurs-Drift basiert.

### Volume Rate of Change (VROC)

Die prozentuale Veränderung des Volumens gegenüber vor N Bars:

```
VROC(N) = ((Volume[t] − Volume[t-N]) / Volume[t-N]) × 100
```

Standard N = 14. VROC misst die *Beschleunigung* des Volumens statt seines aktuellen Niveaus — nützlich, um Volumen-Regimewechsel zu erkennen (Trockenphase vor einem Ausbruch, Anstieg in ein Hoch hinein), die das RVOL-Verhältnis erst im Nachhinein erfasst.

## Welche vier Volumenmuster sind wichtig?

### 1. Ausbruchsvolumen

Ein Ausbruch (Kurs bewegt sich über Widerstand oder unter Unterstützung) auf hohem Volumen — RVOL > 1,5, idealerweise > 2,0 — hat eine substanziell höhere Wahrscheinlichkeit der Folgebewegung als ein Ausbruch auf geringem Volumen. Das Volumen sagt Ihnen, dass der Ausbruch breite Partizipation widerspiegelt und nicht einen einzelnen Käufer, der versehentlich ein Angebot hochzieht.

Die einfachste Version dieser Regel schlägt fast jeden anderen technischen Filter: *Reagieren Sie nur auf Ausbrüche, die auf mindestens 1,5× Durchschnittsvolumen erfolgen*. Dieser eine Check eliminiert etwa die Hälfte aller falschen Ausbrüche.

### 2. Erschöpfungsvolumen (Climax)

Ein 3–5× RVOL-Bar am *Ende* einer mehrwöchigen Bewegung, üblicherweise begleitet von einem ungewöhnlich breiten Bar (Climax-Kerze), signalisiert oft Erschöpfung — die Käufer- oder Verkäuferkapazität ist verbraucht. Zwei klassische Formen:

- **Kauf-Climax**: An der Spitze eines Aufwärtstrends druckt ein parabolischer Bar auf extremem Volumen; die Bewegung fühlt sich euphorisch an. Oft *exakt* das Hoch, manchmal das Hoch für Monate.
- **Verkaufs-Climax (Kapitulation)**: Am Boden eines Abwärtstrends druckt ein Gap-down-Bar auf extremem Volumen; die Stimmung ist einheitlich negativ. Oft der niedrigste Schluss vor einer mehrwöchigen Rallye.

Climaxes sind im Nachhinein leichter zu identifizieren als in Echtzeit. Das strukturelle Muster (extremes Volumen + extremer Bar + am Ende einer langen direktionalen Bewegung) ist ein Watchlist-Trigger, kein eigenständiges Umkehr-Signal. Warten Sie auf Bestätigung — eine Umkehrkerze in der nächsten Sitzung oder ein Momentum-Kreuz beim [MACD](/blog/what-is-macd) —, bevor Sie handeln.

### 3. Trockenphasen-Volumen (der Squeeze)

Volumen, das über mehrere Wochen unter den Durchschnitt kontrahiert, oft gepaart mit Kurskonsolidierung in einer engen Range. Das ist das „Coiling"-Muster, das häufig großen direktionalen Bewegungen vorausgeht. Die Intuition: Partizipation ist ausgetrocknet, weil niemand die nächste Richtung entscheiden kann. Wenn ein Katalysator eintrifft, kommt das Volumen in Stärke zurück und der Kurs bewegt sich damit.

Trockenphasen-Volumen passt natürlich zum [Bollinger-Band-Squeeze](/blog/what-is-bollinger-bands) — beide messen dasselbe Phänomen (Volatilitäts- / Partizipationskompression) aus unterschiedlichen Blickwinkeln. Wenn beide übereinstimmen, ist die Wahrscheinlichkeit einer bevorstehenden direktionalen Bewegung materiell höher.

### 4. Volumen-Divergenz

Kurs bildet ein neues Hoch; das Volumen am neuen-Hoch-Bar ist *niedriger* als am vorherigen neuen-Hoch-Bar. Das ist bärische Volumen-Divergenz — das neue Hoch wird von weniger Teilnehmern gebildet, was historisch einem Scheitern vorangeht. Das Spiegelmuster (tiefere Tiefs auf abnehmendem Volumen = Erschöpfung der Verkäufer) ist bullische Volumen-Divergenz.

Volumen-Divergenz ist an wichtigen Wendepunkten zuverlässiger als Oszillator-Divergenz, weil sie direkt die Partizipation misst statt der zweiten Ableitung des Kurses. Siehe [Was ist Divergenz?](/blog/what-is-divergence) für den breiteren Rahmen.

## Was ist Volumen-Profil (und ist es für Privatanleger nützlich)?

Volumen-Profil ist eine andere Art, Volumen darzustellen — statt Volumen pro *Zeit-Bar* zeigt es Volumen pro *Kursniveau*. Das Ergebnis ist ein horizontales Histogramm auf der rechten Seite des Charts: hohe Balken bei Kursniveaus, an denen die Aktie viel kumuliertes Volumen verbracht hat, kurze Balken, wo sie wenig verbracht hat.

| Feature | Bedeutung |
|---|---|
| **Point of Control (POC)** | Das Kursniveau mit dem höchsten akkumulierten Volumen im Fenster |
| **Value Area (VA)** | Der Kursbereich, der 70% des gesamten akkumulierten Volumens enthält |
| **Low Volume Nodes (LVN)** | Kursniveaus mit wenig akkumuliertem Volumen — Kurse bewegen sich tendenziell schnell durch diese |
| **High Volume Nodes (HVN)** | Kursniveaus mit hohem akkumuliertem Volumen — Kurse pausieren oder kehren in deren Nähe tendenziell um |

Der POC und die HVNs fungieren als verfeinerte Form von [Unterstützung / Widerstand](/blog/what-is-support-resistance) — Niveaus, an denen der Markt historisch in Größe gehandelt hat. Volumen-Profil ist am nützlichsten auf Intraday-Zeitrahmen fürs aktive Trading und auf längerfristigen Charts (Year-to-Date, 5 Jahre), um zu verstehen, wo wichtige Niveaus tatsächlich liegen.

Für die meisten Retail-Leser liefern Tagesbar-Volumen + der Standard-MA-Stack + Standard-Unterstützungs- / Widerstands-Niveaus 80% des Werts. Volumen-Profil ist ein Upgrade für ernsthafte aktive Trader; die Grundlagen bringen Sie den größten Teil des Weges.

## Vier Fallstricke, in die Privatanleger tappen

1. **Volumen komplett ignorieren.** Der häufigste Fallstrick. Ein Ausbruch, der auf dem Kurs-Chart „großartig aussieht", aber auf 0,6× Durchschnittsvolumen geschieht, ist das halbe Signal, das Sie denken. Überlagern Sie immer Volumen; behandeln Sie Niedrig-Volumen-Signale standardmäßig mit Skepsis.
2. **Alle Hoch-Volumen-Bars gleich gewichten.** Ein Hoch-Volumen-Bar am *Anfang* einer Bewegung (Ausbruch) ist bullisch; ein Hoch-Volumen-Bar am *Ende* einer Bewegung (Climax) ist bärisch. Dasselbe Volumen, entgegengesetzte Implikationen. Kontext — wo das Volumen im Trend sitzt — ist die Hälfte der Information.
3. **Vergessen, aus welchen Sitzungen das Volumen kam.** Earnings-Volumen, Gap-Tag-Volumen und Limit-Tag-Volumen sind nicht dasselbe wie normales Sitzungsvolumen. Ein 4× RVOL-Bar am Earnings-Tag ist überwiegend eingepreistes Rauschen; ein 4× RVOL-Bar an einem ereignisfreien Tag ist echte Überzeugung. Die PickSkill-Dashboards markieren ereignisbezogene Bars explizit als Ausreißer.
4. **Volumen mit Geldfluss verwechseln.** Volumen ist richtungsneutral — ein 3× RVOL-Abwärtstag ist *bärisches* Volumen, nicht „hohe Partizipation". Volumen verstärkt die Richtung des Bars, auf dem es sitzt. Für gerichteten Flow verwenden Sie [Geldfluss-Indikatoren](/blog/what-is-capital-flow) (OBV, MFI, CMF).

## Wie sich Volumen auf A-Aktien unterschiedlich verhält

A-Aktien-Volumen hat strukturelle Eigenschaften, die die Interpretation verändern:

- **T+1-Abwicklung** beschränkt taggleiche Round-Trips. Das Tagesvolumen verzerrt sich zu Erstkäufen, die über Nacht gehalten werden müssen — das macht A-Aktien-Volumen-Signale gerichteter als US-Volumen-Signale, aber auch anfälliger für Ein-Tages-Herding-Extreme.
- **Limit-up- / Limit-down-Tage beschneiden Volumen.** Wenn eine Aktie am Limit-up festsitzt, kann das Gebots-Orderbuch enorm sein, aber das ausgeführte Volumen klein. Standard-Volumen-Werkzeuge unterschätzen echte Nachfrage an Limit-Tagen. Die PickSkill-A-Aktien-Dashboards markieren Limit-Tage als Ausreißer in der RVOL-Berechnung.
- **Margin-Call-Kaskaden.** A-Aktien-Retail-Partizipation umfasst signifikante Margin-Finanzierung. Zwangsliquidations-Kaskaden produzieren explosive Volumenspitzen, die wie Climaxes aussehen, aber mechanisch und nicht diskretionär sind — das Volumen kommt von Zwangsverkäufern, nicht aus Überzeugung. Kombinieren Sie Volumen-Signale wo verfügbar mit Margin-Saldo-Daten (公开发布).

Siehe [Beste Indikatoren für A-Aktien](/blog/best-indicators-for-a-shares) für das breitere marktspezifische Playbook.

> **Verfolgen Sie Volumen über Ihre Positionen hinweg.** Das [/indicators](/indicators)-Dashboard zeigt RVOL, VROC und den 5-Tage-Partizipations-Bucket auf jedem Chart — damit Sie auf einen Blick sehen, welche Bewegungen echte Überzeugung hinter sich haben.

## Wie Volumen in einen Mehrsignal-Workflow passt

Volumen ist der *Partizipationsmodifikator* — es erhöht oder senkt die Überzeugung für Signale aus jeder anderen Schicht:

| Signaltyp | Volumen-Frage hinzufügen |
|---|---|
| Ausbruch aus Widerstand | Ist der Bruch auf hohem Volumen? (>1,5× RVOL) |
| MACD-Goldenes-Kreuz | Wird das Kreuz durch Partizipationszunahme gestützt? |
| Trendfortsetzung | Ist jeder Schub zu einem neuen Hoch auf höherem Volumen als der letzte? |
| Top-Umkehr | Gibt es eine Volumen-Climax + Umkehrkerzen-Kombination? |

Die einfachste universelle Regel: *Wenn ein Signal auf unterdurchschnittlichem Volumen geschieht, behandeln Sie es als Halb-Überzeugung*. Diese eine Disziplin filtert einen substanziellen Anteil falscher Positiv-Setups in jedem technischen Workflow heraus.

## Weiterführende Literatur

- [Investopedia zur Volumenanalyse](https://www.investopedia.com/articles/technical/02/010702.asp) — umfassende Referenz zu RVOL, VROC und den Standardmustern.
- [Anna Coulling, *A Complete Guide to Volume Price Analysis*](https://www.amazon.com/dp/1491249390) — Praktiker-Behandlung der volumen-bestätigten Price Action.

## FAQ

**Was zählt als „hohes" Volumen?**
Hoch ist relativ — gemessen am eigenen 20-Tage-Durchschnitt der Aktie. Eine nützliche Faustregel: RVOL zwischen 1,5 und 2,5 ist bedeutsam hoch; über 2,5 ist außergewöhnlich und fast immer an einen spezifischen Katalysator gebunden (Earnings, News, technischer Ausbruch). Die PickSkill-Dashboards zeigen RVOL mit hervorgehobenen Schwellen, damit hohe Bars auf einen Blick sichtbar sind.

**Sollte ich Volumen auf Intraday-Charts verwenden?**
Ja, mit Vorbehalten. Intraday-Volumen hat starke Intraday-Saisonalität (hoch bei Open und Close, leicht zur Mittagszeit); vergleichen Sie Intraday-Volumen mit dem zur gleichen Uhrzeit gemittelten Durchschnitt der letzten 20 Sitzungen, nicht nur mit dem vorherigen Bar. Sonst halten Sie jeden Spätnachmittag-Anstieg für ein echtes Signal.

**Warum ist Volumen auf verschiedenen Plattformen unterschiedlich?**
Drei Ursachen: (1) einige Plattformen beziehen erweiterte Handelszeiten-Volumen ein; PickSkill verwendet aus Konsistenzgründen nur reguläre Sitzungen, (2) einige Plattformen zählen Odd Lots; die meisten noch nicht, und (3) bei US-Aktien, die an mehreren Börsen gelistet sind, deckt das Schlagzeilen-Volumen manchmal nur einen Handelsplatz. Für Konsistenz verwenden die PickSkill-Dashboards Consolidated-Tape-Volumen über alle Handelsplätze für US-Werte und börsengemeldetes Volumen für HK- und A-Aktien.

**Kann ich Volumen verwenden, um die Richtung eines Ausbruchs vorherzusagen?**
Nein — Volumen bestätigt die Richtung, sobald sie gewählt wurde; es sagt nicht voraus, in welche Richtung der Ausbruch gehen wird. Trockenphasen-Volumen während einer Konsolidierung sagt Ihnen, dass eine direktionale Bewegung wahrscheinlicher ist; es sagt Ihnen nicht, ob oben oder unten. Für gerichtete Antizipation verwenden Sie Akkumulationsmuster ([Geldfluss](/blog/what-is-capital-flow) steigt, während Kurs seitwärts läuft), nicht rohes Volumen.

**Was ist Volume Weighted Average Price (VWAP) und ist es dasselbe wie Volumen?**
VWAP ist ein abgeleiteter Kurs, berechnet durch Gewichtung des Kurses jedes Bars mit seinem Volumen. Es ist ein Referenzkurs — stark genutzt von institutionellen Execution-Desks —, aber kein Volumen-*Indikator*. VWAP sagt Ihnen den volumengewichteten Durchschnittskurs; rohes Volumen sagt Ihnen das Partizipationsniveau. Unterschiedliche Fragen; verwenden Sie beide, vermischen Sie sie nicht.
