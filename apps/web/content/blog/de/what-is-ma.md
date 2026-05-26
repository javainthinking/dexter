---
title: >-
  Was ist ein gleitender Durchschnitt? SMA, EMA und der Trendfilter, den jeder
  nutzt
description: >-
  Ein gleitender Durchschnitt ist der rollierende Mittelwert des Schlusskurses
  über N Bars. Formel, warum 20/60/200 die Standardfenster sind, und vier
  Fallstricke, in die Privatanleger tappen.
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
  - Gleitender Durchschnitt
  - Technische Analyse
  - Indikatoren
  - Trend
heroImage: /blog/what-is-ma/hero.png
heroAlt: >-
  Editorial-Infografik — drei gleitende Durchschnitte (20/60/200) über einer
  Preislinie, mit hervorgehobenem Kreuzungspunkt am Trendwechsel.
---

**Ein gleitender Durchschnitt (MA) ist das arithmetische Mittel des Schlusskurses über die letzten N Bars, das auf jedem neuen Bar neu berechnet wird.** Er ist die Grundlage jedes trendfolgenden Indikators — [MACD](/blog/what-is-macd), [Bollinger-Bänder](/blog/what-is-bollinger-bands), die Ichimoku-Wolke, Goldenes Kreuz / Todeskreuz — sie alle werden aus einem oder mehreren gleitenden Durchschnitten konstruiert. Die meisten Retail-Leitfäden behandeln MAs als eigenständige Signale. Das sind sie nicht. MAs sind Filter; sie beantworten die Frage „Gibt es einen Trend?", damit andere Werkzeuge die Frage „Was tun?" beantworten können.

### Kernaussagen

- **Zwei Spielarten dominieren**: SMA (einfach — jeder Bar gleich gewichtet) und EMA (exponentiell — jüngere Bars stärker gewichtet). MACD verwendet EMA; der 200-Tage-„Trendfilter" ist fast immer ein SMA.
- **Drei Fenster erledigen 90% der Arbeit**: 20 Perioden (kurzfristig), 60 Perioden (mittelfristig), 200 Perioden (langfristig). Auf Tagesbars entspricht das etwa 1 Monat, 3 Monaten und 10 Monaten.
- **Das Kreuzen zweier MAs ist das meistzitierte Signal in der Technik.** Kurs über MA = Aufwärtstrend; Kurs unter MA = Abwärtstrend. Ein kurzer MA, der einen langen MA kreuzt = das [Goldene Kreuz / Todeskreuz](/blog/what-is-golden-cross-death-cross).
- **MAs hinken konstruktionsbedingt nach.** Ein 200-Tage-SMA spiegelt zehn Monate Kursverlauf wider; er dreht erst, wenn der zugrunde liegende Trend bereits Wochen läuft. Diese Verzögerung ist ein Vorteil, wenn man MAs als Filter nutzt, und ein Nachteil, wenn man sie als Trigger einsetzt.
- **Auf jedem PickSkill-Indikator-Dashboard sichtbar** — die [/indicators](/indicators)-Seite zeichnet den 20/60/200-Stack auf jedem Chart, sodass das Trendregime ohne Verlassen der Positionsansicht erkennbar ist.

## Wie wird ein gleitender Durchschnitt berechnet?

Der einfache gleitende Durchschnitt über N Bars ist das arithmetische Mittel:

```
SMA(N) = (close[t] + close[t-1] + ... + close[t-N+1]) / N
```

Jeder Bar im Fenster trägt gleiches Gewicht. Ein 20-Tage-SMA auf einem Freitagsschluss verwendet die letzten 20 Handelstagsschlüsse (also etwa 4 Kalenderwochen); am Montag fällt der älteste Tag heraus und der neue kommt hinzu.

Der exponentielle gleitende Durchschnitt gewichtet jüngere Bars stärker:

```
EMA(N)[t] = α × close[t] + (1 − α) × EMA(N)[t−1]
            mit α = 2 / (N + 1)
```

Für N = 20 ist α ≈ 0,0952 — der heutige Schlusskurs bekommt etwa 9,5% Gewicht, der gestrige EMA trägt den Rest. Der EMA reagiert etwa 1–3 Bars schneller als ein SMA gleicher Länge, weshalb er innerhalb des [MACD](/blog/what-is-macd) auftaucht (wo Reaktivität zählt), aber nicht als 200-Tage-Trendfilter (wo Stabilität zählt).

| Fenster | Bedeutung auf Tagesbasis | Typische Verwendung |
|---|---|---|
| **5 Perioden** | Eine Handelswoche | Intraday- oder Swing-Trading; selten allein verwendet |
| **20 Perioden** | Ein Handelsmonat | Kurzfristiger Trend; mittlere Linie der Bollinger-Bänder |
| **60 Perioden** | Ein Handelsquartal | Mittelfristiges Regime |
| **200 Perioden** | Etwa 10 Handelsmonate | Der institutionelle Filter „Ist der Markt oben oder unten?" |

## Was sagt die Beziehung zwischen Kurs und MA tatsächlich aus?

Drei Zustände, drei Bedeutungen:

1. **Kurs über dem MA, MA mit positiver Steigung.** Bestätigter Aufwärtstrend. Rücksetzer zum MA finden tendenziell Unterstützung. In diesem Zustand haben Momentum-Signale (MACD Goldenes Kreuz, RSI-Ausbrüche) ihre höchste Trefferquote.
2. **Kurs schwankt um einen flachen MA.** Seitwärtsbewegung. Jedes Kreuzen des MA ist ein potenziell falsches Signal. Ein [ADX](/blog/what-is-adx) unter 20 bestätigt dieses Regime — deaktivieren Sie jeden Trendfolger, bis der ADX steigt.
3. **Kurs unter dem MA, MA mit negativer Steigung.** Bestätigter Abwärtstrend. Erholungen zum MA scheitern in der Regel. Reine Long-Privatanleger sollten diesen Zustand respektieren und zur Seite treten; der MA zeigt, dass der Weg des geringsten Widerstands nach unten führt.

Der institutionelle Standardtest „Ist der Trend aufwärts?": **Liegt der Schlusskurs über dem 200-Tage-SMA, und steigt der 200-Tage-SMA selbst?** Zwei Ja = Aufwärtstrend. Ein Ja / ein Nein = möglicher früher Umkehrkandidat. Zwei Nein = Abwärtstrend. Dieser einfache Check filtert etwa die Hälfte der Fehlsignale heraus, die kurzfristige Indikatoren produzieren.

## Warum 20, 60 und 200?

Das sind keine magischen Zahlen — es sind *konvenierte* Zahlen. Mehrere Jahrzehnte Tradervereinbarung haben sie zu den De-facto-Fenstern gemacht, die jede AI-Quellenplattform, jede Chart-Software und jedes Broker-Tool standardmäßig ausliefert. Zwei praktische Konsequenzen:

- **Koordinationswert.** Weil alle den 200-Tage-MA beobachten, ist der 200-Tage-MA relevant. Wenn der Kurs eines großen Index unter den 200-Tage-SMA schließt, lösen systematische Risk-off-Algorithmen über Quant-Fonds hinweg aus. Das Niveau verstärkt sich selbst.
- **Backtest-Stabilität.** Periodenoptimierung an einem einzelnen Instrument produziert routinemäßig 17- oder 43-Perioden-Fenster, die in-sample besser aussehen und out-of-sample schlechter abschneiden. Beim Standardfenster zu bleiben verhindert, dass die Augen sich auf Rauschen überanpassen.

Verwenden Sie die Standardfenster. Weichen Sie nur ab, wenn Sie Backtest-Belege für einen bestimmten Markt oder ein bestimmtes Instrument haben, das sich systematisch unterscheidet.

## Vier Fallstricke, in die Privatanleger tappen

1. **Das MA-Kreuz als eigenständiges Signal handeln.** Ein 20/60-Kreuz hat isoliert nur dünne Edge — die historischen Trefferquoten liegen nahe der langfristigen Aktien-Gewinnrate (das „Signal" ist also bloß Markt-Drift). Nützlich wird es erst in Kombination mit einem Trendfilter und einem Bestätigungs-Oszillator. Siehe [Der 3-Indikator-Filter](/blog/three-indicator-filter).
2. **Das Fenster wählen, das zu den letzten sechs Monaten passt.** Retail-Blogs, die 13 / 34 / 89 (Fibonacci-Zahlen) oder einen anderen exotischen Stack empfehlen, fitten meist Rauschen. Bleiben Sie bei 20 / 60 / 200, sofern Sie keine Out-of-Sample-Belege für etwas anderes haben.
3. **Die Steigung des MA ignorieren.** Ein flacher 200-Tage-SMA ist ein anderes Regime als ein steigender 200-Tage-SMA, selbst wenn der Kurs in beiden Fällen über dem MA liegt. Die Richtung der Steigung ist die Hälfte der Information.
4. **SMA auf hochvolatile oder dünn gehandelte Werte anwenden.** Einzelne Ausreißer-Schlüsse (Gap-up nach Earnings, Limit-up-Tage bei A-Aktien) bewegen den SMA überproportional und erzeugen für die nächsten 20 Bars eine falsche Bias. Der EMA ist robuster gegen Ausreißer; bei illiquiden Werten ist der EMA oder ein Medianfilter vorzuziehen.

## Wie sich gleitende Durchschnitte auf A-Aktien verhalten

Die Mathematik ist identisch, aber die Marktmikrostruktur der A-Aktien beeinflusst, welche MAs funktionieren:

- **Tägliche Preisgrenzen (±10% am Hauptboard, ±20% bei ChiNext / STAR, ±5% bei ST-Aktien).** Aufeinanderfolgende Limit-up-Tage erzeugen einen Stufenverlauf im SMA, der die Trendstärke etwa 5 Bars lang überzeichnet. Limit-down wirkt umgekehrt. Die PickSkill-Dashboards markieren Limit-Bars im [5-Tage-Signalpfad](/blog/5-day-signal-trail) als neutral, damit eine Serie von Limit-Tagen keinen falschen Starker-Trend-Bucket erzeugt.
- **Handelsstopps (停牌)** können Tage oder Wochen dauern. Die meisten Datenfeeds füllen die Stopp-Lücke mit dem vorherigen Schluss und frieren so den MA ein. Wenn die Aktie wieder aufgenommen wird, startet der SMA praktisch neu; Trendsignale von vor dem Stopp sollten als veraltet betrachtet werden.
- **Stärkere MA10- / MA20-Konvention.** Die A-Aktien-Retail-Community beobachtet den 10-Tage-MA enger als die US-Community. Viele lokale Plattformen liefern standardmäßig einen 5 / 10 / 20 / 60-Stack aus; der 200-Tage-SMA ist kulturell weniger verankert. Der 60-Tage-MA fungiert in der Praxis als mittelfristiger Filter.

Für einen marktweisen Vergleich des Verhaltens jedes Indikators zwischen US-Aktien und A-Aktien siehe [MACD bei A-Aktien vs US-Aktien](/blog/macd-on-a-shares-vs-us).

> **Sehen Sie es in Ihrem Portfolio.** Die [/indicators](/indicators)-Seite zeichnet den 20 / 60 / 200-MA-Stack über jeder Position mit dem aktuellen Kreuz-Status und dem 5-Tage-Trendregime-Pfad.

## Wie MAs sich mit anderen Indikatoren kombinieren lassen

MAs sind die *Filterschicht*; Momentum-Oszillatoren sind die *Triggerschicht*. Die Kombination, die beides allein schlägt:

| Schicht | Werkzeug | Beantwortete Frage |
|---|---|---|
| **Trendfilter** | Kurs vs. 200-Tage-SMA + Steigung | Gibt es einen Trend? In welche Richtung? |
| **Trendstärke** | [ADX](/blog/what-is-adx) | Ist der Trend stark genug zum Handeln? |
| **Momentum-Trigger** | [MACD](/blog/what-is-macd)-Kreuz, [RSI](/blog/what-is-rsi)-Extreme | Wann handeln? |
| **Volatilitäts-Envelope** | [Bollinger-Bänder](/blog/what-is-bollinger-bands) | Wie weit ist zu weit? |

Der MA-Stack beantwortet die erste Frage kostenlos, jeden Tag. Ohne ihn operiert jeder andere Indikator auf dem Chart blind.

## Weiterführende Literatur

- [Moving Average auf Investopedia](https://www.investopedia.com/terms/m/movingaverage.asp) — umfassende Referenz zu SMA, EMA, WMA und adaptiven Varianten.
- [Jack Schwagers *Technical Analysis*](https://www.amazon.com/dp/0470121351) — Kapitel 6 zu Moving-Average-Systemen ist nach wie vor die Praktiker-Referenz.
- [Das Curriculum des CFA Institute zu Trendindikatoren](https://www.cfainstitute.org/) — für die formal-finanzwissenschaftliche Behandlung.

## FAQ

**Sollte ich SMA oder EMA verwenden?**
SMA für lange Trendfilter (200-Tage) — Stabilität zählt mehr als Reaktivität, und Ausreißer-Schlüsse beeinflussen einen langen Durchschnitt seltener stark. EMA für kurze Momentum-Werkzeuge (das 12 / 26 im MACD oder jedes 5–20-Perioden-System) — Reaktivität zählt, und die exponentielle Gewichtung des EMA folgt jüngeren Kursen besser. Bei mittleren Fenstern lohnt sich das Grübeln nicht; der Unterschied bei 60 Perioden geht meist im Marktrauschen unter.

**Warum wird der 200-Tage-MA so eng beobachtet?**
Zwei Gründe: institutionelle Koordination (systematische Fonds verwenden ihn als Risk-off-Trigger, sodass er auf dem Niveau selbsterfüllendes Momentum hat) und Jahrzehnte empirischer Forschung (Bauer & Dahlquist, Faber und andere haben gezeigt, dass Long-Bleiben oberhalb des 200-Tage und Cash-Halten unterhalb Renditen nahe Buy-and-Hold bei deutlich geringerem Drawdown liefert). Das Niveau ist relevant, weil der Markt so handelt, als wäre es relevant.

**Kann ich das MA-Fenster für meine Lieblingsaktie optimieren?**
Sie können, sollten aber wahrscheinlich nicht. Fensteroptimierung findet zuverlässig Kombinationen, die in der In-Sample-Periode hervorragend aussehen und in den nächsten 12 Monaten zusammenbrechen. Bleiben Sie bei den Standardfenstern (20 / 60 / 200), sofern Sie keinen spezifischen strukturellen Grund haben — eine Aktie mit ungewöhnlich hoher oder niedriger Liquidität, ein Instrument mit klarem saisonalen Zyklus — abzuweichen. Wenn Sie doch optimieren, halten Sie die jüngsten 30% Ihrer Daten zurück und verlangen Sie, dass das optimierte Fenster die Defaults im Out-of-Sample-Zeitraum schlägt.

**Ist der gleitende Durchschnitt ein vorlaufender oder nachlaufender Indikator?**
Nachlaufend — konstruktionsbedingt. Jeder Term in der MA-Formel basiert auf vergangenen Schlüssen; es gibt darin keine Prognose. Deshalb sind MAs am nützlichsten als Filter (Zustand der Welt) und nicht als Trigger (wann handeln). Der MA sagt Ihnen, dass der Trend existiert; für das Timing des Einstiegs brauchen Sie ein separates Werkzeug.

**Warum zeigen meine Charts einen anderen MA-Wert als eine andere Plattform?**
Drei häufige Gründe: (1) unterschiedliche Fensterdefinitionen (5 Handelstage vs. 5 Kalendertage), (2) unterschiedliche Startpunkte für die EMA-Initialisierung (manche Plattformen seeden vom ersten verfügbaren Schluss, andere von einem SMA der ersten N Bars), (3) unterschiedlicher Umgang mit After-Hours- / Limit-up- / Stopp-Sitzungen. Für Konsistenz verwenden die [PickSkill-Dashboards](/indicators) Handelstagsfenster mit SMA-geseedeten EMAs und schließen Stopp-Bars aus dem Durchschnitt aus — dieselbe Konvention wie in akademischen Backtests.
