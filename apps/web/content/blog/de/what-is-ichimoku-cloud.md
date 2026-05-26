---
title: Was ist die Ichimoku-Wolke? Ein komplettes Trading-System in einem Indikator
description: >-
  Ichimoku ist ein 5-Linien-System, das Trend, Momentum und
  Unterstützung/Widerstand gleichzeitig misst. Die Wolke, die 5 Komponenten und
  wie man sie tatsächlich nutzt.
publishedAt: 2026-05-26T00:00:00.000Z
updatedAt: 2026-05-26T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    Das PickSkill-Research-Team — wir bauen einen AI-Analysten für
    Privatanleger.
pillar: explainer
tags:
  - Ichimoku
  - Wolke
  - Technische Analyse
  - Trend
  - Indikatoren
heroImage: /blog/what-is-ichimoku-cloud/hero.png
heroAlt: >-
  Editorial-Infografik — die Ichimoku-Wolke (Kumo), Tenkan-sen und Kijun-sen
  gezeichnet, Preis oberhalb der Wolke bestätigt den Aufwärtstrend.
---

**Ichimoku Kinko Hyo („Ein-Blick-Gleichgewichtsdiagramm") ist ein japanisches technisches System, das fünf Linien auf einen Kurschart legt, um Trend, Momentum und Unterstützung/Widerstand gleichzeitig zu messen.** Es wirkt auf den ersten Blick einschüchternd — die meisten Retail-Charting-Plattformen rendern es als bunte Wolke mit mehreren überlappenden Linien — aber die zugrunde liegende Logik ist disziplinierter als die der meisten populären Indikatoren. Es ist das Standard-Trendsystem in Japan, hat in HK und Korea relevante Verbreitung und überraschend wenig Akzeptanz im US-Retail, obwohl es zu den meistzitierten „kompletten Systemen" in der Literatur zur technischen Analyse zählt.

### Kernpunkte

- **Fünf Komponenten**: Tenkan-sen (Wandlung), Kijun-sen (Basis), Senkou A & B (die Wolke), Chikou (nachlaufender Schluss).
- **Die Wolke (Kumo)**: Schattierter Bereich zwischen Senkou A und Senkou B, 26 Bars in die Zukunft projiziert. Kurs über der Wolke = Aufwärtstrend; darunter = Abwärtstrend; innerhalb = Konsolidierung.
- **Die Wolkendicke misst die Überzeugung**: dicke Wolke = starke Unterstützung/Widerstand; dünne Wolke = anfällig für Ausbruch.
- **Das gesamte System beantwortet auf einen Blick eine Frage**: Wo liegt der Kurs relativ zum jüngsten Gleichgewicht, und in welche Richtung bewegt sich das Gleichgewicht?
- **Die Standardparameter (9, 26, 52)** sind an historische japanische Handelstageszählungen gebunden und bleiben weltweit Standard.

## Die fünf Komponenten

Jede Linie beantwortet eine spezifische Frage:

| Linie | Formel | Periode | Beantwortete Frage |
|---|---|---|---|
| **Tenkan-sen** (転換線, „Wandlung") | (höchstes Hoch + niedrigstes Tief) / 2 | 9 Bars | Kurzfristiges Gleichgewicht |
| **Kijun-sen** (基準線, „Basis") | (höchstes Hoch + niedrigstes Tief) / 2 | 26 Bars | Mittelfristiges Gleichgewicht |
| **Senkou Span A** (先行スパンA) | (Tenkan + Kijun) / 2, 26 Bars vorausgeplottet | — | Vorlaufende Kante der Wolke, schnell |
| **Senkou Span B** (先行スパンB) | (höchstes Hoch + niedrigstes Tief) / 2 über 52 Bars, 26 Bars vorausgeplottet | 52 Bars | Vorlaufende Kante der Wolke, langsam |
| **Chikou Span** (遅行スパン, „nachlaufend") | Aktueller Schluss, 26 Bars *rückwärts* geplottet | — | Bestätigung der Trendstärke |

Die Wolke (Kumo) ist der Bereich zwischen Senkou A und Senkou B. Wenn Senkou A über Senkou B liegt, ist die Wolke bullisch eingefärbt (typischerweise grün); wenn darunter, bärisch (typischerweise rot).

Die Standardperioden 9 / 26 / 52 leiten sich aus historischen japanischen Handelskonventionen ab (an den Märkten wurde früher samstags gehandelt — eine 6-Tage-Woche machte 26 Bars zu genau einem Monat). Trotz des historischen Zufalls produzieren die Perioden ein ausbalanciertes Trendsystem, das sich über Jahrzehnte hinweg auf Tagesbars in den meisten großen Aktienmärkten bewährt hat.

## Die vier Kernsignale

Ichimoku produziert mehrere Signale; vier sind dominant:

### 1. Kurs versus Wolke

- **Kurs über der Wolke**: Aufwärtstrendregime bestätigt.
- **Kurs unter der Wolke**: Abwärtstrendregime bestätigt.
- **Kurs innerhalb der Wolke**: Konsolidierung / Spanne — die meisten Signale hier sind Rauschen.

Diese einzelne Prüfung ist verlässlicher als jedes Einzellinien-Kreuz.

### 2. Wolkenfarbe

- **Grüne Wolke (Senkou A über Senkou B)**: Zukunftsbias bullisch.
- **Rote Wolke (Senkou A unter Senkou B)**: Zukunftsbias bärisch.

Die Wolkenfarbe läuft dem Kurs voraus — sie kann umschlagen, während der Kurs noch innerhalb handelt, was signalisiert, dass das Regime im Begriff ist zu wechseln.

### 3. Tenkan/Kijun-Kreuz

Das Kreuzen der Tenkan-sen (9 Bars) über die Kijun-sen (26 Bars) ist analog zu einem Kreuzen gleitender Durchschnitte. Es ist am verlässlichsten, wenn:

- Beide Linien über der Wolke liegen (in einem Aufwärtstrend) für ein bullisches Tenkan/Kijun-Kreuz
- Beide Linien unter der Wolke liegen (in einem Abwärtstrend) für ein bärisches Kreuz
- Die Wolkenfarbe die Richtung bestätigt

### 4. Position der Chikou Span

Die Chikou Span ist der aktuelle Schluss, 26 Bars rückwärts geplottet. Wenn Chikou *über* der Kursaktion vor 26 Bars liegt, bestätigt sie die aktuelle Stärke gegenüber der jüngsten Historie. Wenn *darunter*, aktuelle Schwäche.

Viele Ichimoku-Trader verlangen, dass alle vier Signale ausgerichtet sind, bevor gehandelt wird — dieser Filter produziert weniger Signale, aber materiell höhere Edge pro Signal.

## Wolkendicke als Überzeugung

Die *Dicke* der Wolke (vertikaler Abstand zwischen Senkou A und Senkou B) misst, wie entschieden sich der Kurs bewegen müsste, um das Regime zu kippen:

- **Dicke Wolke**: starke Unterstützung (wenn der Kurs darüber liegt) oder starker Widerstand (wenn darunter). Der Kurs braucht erhebliches Momentum zum Durchbruch.
- **Dünne Wolke**: schwache Unterstützung/Widerstand. Der Kurs kann mit moderatem Momentum durchstoßen.
- **Wolkendrehung** (Kreuzen von Senkou A und B): Das Regime ist im Übergang; die nächste Richtungsbewegung ist oft das sauberste Setup.

Die Wolke signalisiert auch Timing: Wenn der Kurs sich der Wolkenkante nähert, ist mit einer Reaktion zu rechnen. Ein Abprallen an der Wolkenkante in Trendrichtung bestätigt den Trend; ein Durchbruch dreht ihn um.

## Vier Fallstricke, in die Privatanleger tappen

1. **Schlüsse aus einer einzelnen Linie isoliert ziehen.** Ichimoku ist ein *System* — seine Stärke kommt aus der Multi-Signal-Bestätigung. Nur das Tenkan/Kijun-Kreuz zu verwenden, ohne Kurs versus Wolke und Chikou-Position zu prüfen, lässt die Signalqualität auf gewöhnliches Niveau gleitender Durchschnitte zurückfallen.

2. **Innerhalb der Wolke handeln.** Die Wolke repräsentiert Konsolidierung; Signale innerhalb sind unruhig und edge-arm. Warten Sie, bis der Kurs aus der Wolke ausbricht (nach oben oder unten), bevor Sie auf Ichimoku-Signale reagieren.

3. **Fehlanwendung auf seitwärts gerichtete Märkte.** Ichimoku ist für die Trendidentifikation gebaut. In seitwärts gerichteten Märkten ([ADX](/blog/what-is-adx) unter 20) flacht die Wolke ab, und die Linien kreuzen sich ständig, ohne echte Signale zu produzieren. Kombinieren Sie mit ADX als Regimefilter.

4. **Die Standardparameter ändern.** Die Defaults 9/26/52 leiten sich aus historischen japanischen Konventionen ab und wurden über Jahrzehnte und Märkte hinweg validiert. Eine Neuoptimierung der Parameter auf einem einzelnen Instrument führt fast immer zu Overfitting — die optimierten Werte sehen im Backtest großartig aus und brechen im Forward-Test zusammen. Bleiben Sie bei den Defaults.

## Wie sich Ichimoku in verschiedenen Märkten verhält

| Markt | Ichimoku-Verbreitung | Hinweise |
|---|---|---|
| **Japan** | Sehr hoch — Standardsystem an Retail- und Institutionellen-Desks | Hier entstanden; kulturelle Koordination ist der stärkste Signalverstärker |
| **HK** | Mittel — wird in Verbindung mit westlichen Indikatoren verwendet | Multi-Markt-Plattformen unterstützen es |
| **A-Aktien** | Niedrig — die A-Aktien-Retail-Kultur konzentriert sich auf KDJ und MA-Stack | Ichimoku-Signale weniger selbsterfüllend als in Japan |
| **US** | Nische — primär von FX- und Krypto-Tradern verwendet, die aus japanischen Quellen gelernt haben | Weniger in der Aktien-Konvention verankert |

Für Multi-Markt-Portfolios ist Ichimoku am verlässlichsten bei japanischen Aktien, Währungspaaren und Krypto — wo die kulturelle Koordination des „alle beobachten die Wolke" denselben selbsterfüllenden Schub liefert, den der 200-Tage-MA bei US-Aktien hat.

## Wie Ichimoku in einen Multi-Signal-Workflow passt

Ichimoku deckt mehrere Schichten in einem Indikator ab:

| Schicht | Ichimoku-Komponente | Externes Backup |
|---|---|---|
| **Trend** | Kurs versus Wolke, Wolkenfarbe | [MA-Stack](/blog/what-is-ma), [ADX](/blog/what-is-adx) |
| **Momentum** | Tenkan/Kijun-Kreuz | [MACD](/blog/what-is-macd), [RSI](/blog/what-is-rsi) |
| **Bestätigung** | Chikou-Position | Volumen, [Kapitalfluss](/blog/what-is-capital-flow) |
| **Unterstützung/Widerstand** | Wolkenkanten + Kijun-sen | [Unterstützung/Widerstand](/blog/what-is-support-resistance)-Niveaus |

Auch Nutzer, die separate westliche Indikatoren neben Ichimoku laufen lassen, profitieren von der strukturellen Disziplin des Systems — die Forderung nach vier ausgerichteten Signalen filtert einen erheblichen Anteil falsch positiver Signale heraus, auf die Einzelindikator-Workflows reagieren.

> **Sehen Sie Ichimoku in Ihrem Portfolio.** Fragen Sie in [/chat](/chat): „Rendere die Ichimoku-Wolke auf jeder meiner japanischen Positionen und sage mir, welche über der Wolke mit grüner Wolkenfarbe und steigendem Tenkan/Kijun handeln." PickSkill berechnet das System auf den aktuellsten Kursen und legt die Multi-Signal-Ausrichtung offen.

## Häufige Folgeprompts

- *„Zeige mir für [Ticker] die aktuelle Ichimoku-Konfiguration. Wo liegt der Kurs relativ zu Wolke, Tenkan, Kijun und Chikou?"*
- *„Finde japanische Large-Caps, bei denen alle vier Ichimoku-Signale bullisch ausgerichtet sind: Kurs über der Wolke, grüne Wolke, bullisches T/K-Kreuz und Chikou über dem Kurs vor 26 Bars."*
- *„Vergleiche die Signalhäufigkeit von Ichimoku auf japanischen versus US-Aktien. Sind die Signale in JP-Märkten verlässlicher?"*
- *„Backteste die Regel der Vier-Signal-Ausrichtung auf den Komponenten des Nikkei 225 über die letzten 10 Jahre."*

## Weiterführende Literatur

- [Investopedia zu Ichimoku](https://www.investopedia.com/terms/i/ichimoku-cloud.asp) — umfassende Referenz.
- [Manesh Patel, *Trading with Ichimoku Clouds*](https://www.amazon.com/dp/0470609966) — die meistzitierte englischsprachige Ichimoku-Behandlung.
- [Hidenobu Sasakis Originalarbeit zu Ichimoku](https://en.wikipedia.org/wiki/Ichimoku_Kink%C5%8D_Hy%C5%8D) — die japanischsprachige Originalbehandlung aus den 1960er Jahren.

## FAQ

**Warum sieht Ichimoku so kompliziert aus?**
Fünf Linien plus eine schattierte Wolke sind viel Information für einen Chart. Die Komplexität ist beabsichtigt — Ichimoku versucht „Gibt es einen Trend, wie stark ist er und wo liegen die Schlüsselniveaus" gleichzeitig zu beantworten. Die meisten Trader empfinden es im ersten Monat als überwältigend und danach als natürlich. Beginnen Sie damit, alle Linien außer der Wolke und Tenkan/Kijun auszublenden, lernen Sie diese, und fügen Sie dann die Chikou Span hinzu.

**Sollte ich Ichimoku auf US-Aktien verwenden?**
Sie können — die Mathematik funktioniert auf jedem liquiden Markt identisch. Die Signale werden statistisch gültig sein, aber kulturell weniger selbsterfüllend als auf japanischen Aktien, wo Ichimoku die dominante Retail- und Institutionellen-Konvention ist. Bei US-Large-Caps haben RSI/MACD/MA-Stack die stärkere kulturelle Koordination.

**Sind die Standardparameter (9, 26, 52) optimal?**
Sie sind an historische japanische Handelstageszählungen gebunden (als die Märkte 6 Tage pro Woche handelten, entsprachen 9 = grob zwei Wochen, 26 = einem Monat, 52 = zwei Monaten). Sie sind in keinem modernen statistischen Sinne „optimal" — aber sie sind die Konvention. Eine Neuoptimierung auf einem einzelnen Instrument führt fast immer zu Overfitting; bleiben Sie bei den Defaults, sofern Sie keine starken Out-of-Sample-Belege für anderes haben.

**Was ist der Unterschied zwischen Senkou A und Senkou B?**
Senkou A ist die schnellere der beiden Wolkengrenzen (Durchschnitt aus Tenkan und Kijun). Senkou B ist die langsamere (52-Bar-Mittelpunkt). Wenn Senkou A über Senkou B liegt, ist die Wolke grün (bullisch); wenn darunter, rot (bärisch). Beide werden 26 Bars vor dem aktuellen Kurs geplottet — was die Wolke zu einer vorlaufenden Visualisierung zukünftiger Unterstützung/Widerstände macht.

**Kann ich Ichimoku auf Intraday-Charts verwenden?**
Ja — das System skaliert auf jeden Zeitrahmen. Auf Intraday-Charts übersetzen sich die Perioden 9/26/52 grob in 9 Stunden / 1 Tag / 2 Tage bei 60-Minuten-Bars oder 45 Minuten / 2,2 Stunden / 4,3 Stunden bei 5-Minuten-Bars. Die meisten Intraday-Ichimoku-Trader verwenden 1-Stunden- oder 4-Stunden-Bars; 5-Minuten-Ichimoku hat dieselben Rauschprobleme wie jeder andere 5-Minuten-Indikator.
