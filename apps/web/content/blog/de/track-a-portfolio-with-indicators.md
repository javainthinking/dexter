---
title: Wie man ein Multi-Aktien-Portfolio mit technischen Indikatoren in PickSkill verfolgt
description: 5-Schritte-Tutorial zum Einrichten eines Portfolios, Überlagern von acht technischen Indikator-Dimensionen darüber, und Verwenden von KI-generierten Dashboards (MACD, KDJ, Divergenz, Kapitalfluss) zum Erkennen von Signalen über alle Positionen in Sekunden.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: Das PickSkill-Research-Team — wir bauen einen AI-Analysten für Privatanleger.
pillar: how-to
tags:
  - tutorial
  - portfolio
  - indicators
  - macd
  - kdj
heroImage: /blog/track-a-portfolio-with-indicators/hero.png
heroAlt: Editoriale Infografik eines Multi-Aktien-Portfolios mit acht Indikator-Dimensionen
---

Privatanleger stoßen an dieselbe Wand: Sie halten 8–15 Positionen, wollen wissen, welche an einem technischen Wendepunkt sind (MACD-Cross, KDJ-Überverkauft, RSI-Divergenz, abnormer Kapitalfluss), aber jeden Tag das Chart jeder Position zu lesen ist nicht haltbar. Dieses Tutorial zeigt, wie man in PickSkill ein Portfolio einrichtet, acht Indikator-Dimensionen darüberlegt und ein Signal-Dashboard auf einen Blick erhält, sodass man nur in die Namen reinzoomt, die wirklich Aufmerksamkeit verdienen.

### Kernaussagen

- **Acht Indikator-Dimensionen** out of the box: Preis, Fundamentaldaten, Sentiment, Kapitalfluss, Divergenz, KDJ, MACD, Support/Resistance.
- **Ein Dashboard, jede Position.** Jede Dimension als sortierbarer HTML-Report über alle Holdings.
- **On-Demand-Refresh** oder geplante Aktualisierungen.
- **US, HK und A-Shares unterstützt.**
- **Verwendet [/portfolios](/portfolios)** für Holdings-Speicherung und [/indicators](/indicators) für Dashboards — Chat ist der Weg, neue Views anzufordern.

## Warum das wichtig ist

12 Namen × 8 Dimensionen manuell verfolgen = 96 Chart-Lookups pro Tag. Die meisten komprimieren das zu „ich schaue nur die wenigen Positionen an, die mich nervös machen", was bedeutet, dass Signale von Positionen, die nicht-nervös sind, leise vorbeischlüpfen. Die Dashboards machen aus 96 Lookups einen Scan: 12 × 8 auf einer Seite, sortierbar, mit Wendepunkten hervorgehoben.

## Der 5-Schritte-Workflow

### Schritt 1 — Portfolio anlegen oder wählen

[/portfolios](/portfolios) öffnen und entweder neu anlegen oder ein bestehendes nutzen. Ein Portfolio ist ein benannter Bucket von Holdings (Ticker + Anteile + optional Kostenbasis).

Wenn Sie Holdings per Natural Language hinzugefügt haben („füg NVDA 100 Anteile zu 135 zu meinem Haupt-Portfolio hinzu"), sind sie schon da.

### Schritt 2 — Indikator-Dimensionen wählen

| Dimension | Beantwortet |
|---|---|
| **Preis** | Wo ist jeder Name vs. MA 5/20/60? |
| **Fundamentaldaten** | KGV / KBV / Dividenden- / FCF-Yield pro Holding |
| **Sentiment** | News + Analysten-Action-Sentiment |
| **Kapitalfluss** | Net institutional flow letzte 5–20 Handelstage |
| **Divergenz** | Preis-vs-Volumen oder Preis-vs-RSI Divergenz |
| **KDJ** | Stochastic überverkauft (J<0) / überkauft (J>100) |
| **MACD** | Golden/Death Cross + Histogram-Momentum |
| **Support/Resistance** | Verlustpositionen, Namen am Widerstand |

Die vier mit der höchsten Hebelwirkung für Retail: Preis, MACD, Kapitalfluss, Divergenz.

### Schritt 3 — Chat öffnen und Dashboard anfordern

```text
Für mein „Tech Largecaps"-Portfolio:
- Führ das MACD-Dashboard aus
- Markier Positionen mit Golden Cross oder Death Cross heute
- Nach Histogramm-Stärke sortieren
```

PickSkill holt die Positionsliste, berechnet MACD gegen die jüngsten Tagesbars jedes Namens, generiert das Dashboard als herunterladbare HTML-Datei und zeigt die Wendepunkt-Namen inline.

### Schritt 4 — Cross-Reference mit anderen Dimensionen

```text
Von den Namen mit MACD Golden Cross, welche zeigen auch:
- Positiven Kapitalfluss letzte 5 Tage?
- Bullische Divergenz (Preis runter, RSI hoch)?
- Über ihrem 60-Tage-Schnitt?
```

Das ist der eigentliche Research-Workflow — Signale stapeln, von 12 Kandidaten auf 2–3 reduzieren.

### Schritt 5 — Nützliches Dashboard zeitplanen

```text
Führ dieses MACD-Dashboard für „Tech Largecaps" jeden Handelstag nach US-Schluss aus.
E-Mail nur wenn ≥1 Position kreuzt.
```

> **Jetzt ausprobieren.** [Portfolio anlegen](/portfolios), dann [Chat öffnen](/chat) und Prompt aus Schritt 3 einfügen.

## Indikatoren, die Vertieftes Wissen verdienen

- **MACD** — Kreuz von 12-EMA über 26-EMA mit 9-Perioden-Signallinie. Golden Cross = bullisches Momentum; Death Cross = bearisches Momentum.
- **KDJ** — Variante von Stochastic mit J-Linie, die Extreme verstärkt. J<0 überverkauft, J>100 überkauft.
- **Divergenz** — Preis macht neues Hoch, RSI nicht (bearisch); oder Preis macht neues Tief, RSI nicht (bullisch).
- **Kapitalfluss** — Netto institutional/Block-Order-Fluss. Für HK und A-Shares via Börsen-disclosure-Daten verfügbar, für US über Block-Trades approximiert.

## Was hier nicht geht

- **Intraday-Signale.**
- **Optionsstrategien.**
- **Auto-Orderausführung.**

## Wie das den Foundation-Cluster ergänzt

Foundation-Cluster ([DCF](/blog/what-is-dcf), [WACC](/blog/what-is-wacc), [FCF](/blog/what-is-fcf), [10-K](/blog/how-to-read-10k)) ist **fundamentale Recherche**. Dieses Tutorial ist **technisches Monitoring**. Die meisten Retail-Workflows profitieren von beiden Schichten.

## FAQ

**Muss ich Portfolios manuell einrichten?**
Nein — Holdings per Natural Language in `/chat` hinzufügen, PickSkill spiegelt nach [/portfolios](/portfolios). Oder CSV-Upload.

**Wie frisch sind die Daten?**
US: End-of-Day. A-Shares und HK: intraday. Kapitalfluss: EOD über alle Märkte.

**Kann ich Dashboards über mehrere Portfolios gleichzeitig laufen lassen?**
Ja — „lass das MACD-Dashboard über alle meine Portfolios laufen, gruppiert nach Portfolio".

**Funktioniert auf A-Shares?**
Ja — KDJ und MACD sind besonders populär unter A-Share-Retail; die Engine handhabt `600519.SS`, `000333.SZ` und den Handelskalender korrekt.

**Wie richte ich geplante E-Mails ein?**
Aus dem Chat: „führ dieses MACD-Dashboard jeden Handelstag nach US-Schluss aus, E-Mail wenn ≥1 Cross". Die Planung integriert sich mit der E-Mail-Adresse, mit der Sie sich registriert haben.
