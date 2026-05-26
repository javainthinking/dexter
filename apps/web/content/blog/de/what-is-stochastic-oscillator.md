---
title: 'Was ist der Stochastik-Oszillator? %K, %D und warum KDJ sein Cousin ist'
description: >-
  Die Stochastik misst, wo der Schlusskurs innerhalb der jüngsten Spanne liegt.
  Formel, Fast versus Slow Stochastic, das Verhältnis zu KDJ und vier
  Fallstricke.
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
  - Stochastik
  - KDJ
  - Momentum
  - Technische Analyse
  - Indikatoren
heroImage: /blog/what-is-stochastic-oscillator/hero.png
heroAlt: >-
  Editorial-Infografik — Stochastic %K und %D oszillieren zwischen 0–100,
  80/20-Schwellen markiert, überverkaufter Kreuzungspunkt hervorgehoben.
---

**Der Stochastik-Oszillator misst auf einer Skala von 0–100, wo der aktuelle Schlusskurs innerhalb der jüngsten Hoch-Tief-Spanne liegt.** Er wurde in den 1950er Jahren von George Lane entwickelt, um eine täuschend einfache Frage zu beantworten: Wie nahe liegt der aktuelle Kurs in einem definierten Fenster am Hoch (oder am Tief)? Die Stochastik ist die Mutter einer ganzen Familie von Momentum-Werkzeugen — einschließlich [KDJ](/blog/what-is-kdj), das im Wesentlichen die Stochastik mit einer zusätzlichen J-Linie ist und in der chinesischen A-Aktien-Retail-Community der Standardoszillator ist. Die Mutter zu kennen, hilft beim Lesen jeder Variante.

### Kernpunkte

- **Formel**: `%K = ((Schluss − Tief(N)) / (Hoch(N) − Tief(N))) × 100`. Standard N = 14 in der US-Konvention.
- **Zwei Linien**: %K (die rohe Stochastik) und %D (3-Perioden-SMA von %K, die Signallinie). Wenn %K %D kreuzt, ist das das Grundsignal.
- **Überkauft über 80, überverkauft unter 20.** Dieselben Schwellen wie beim RSI, aber aus einer anderen Formel gebildet (Position in der Spanne, nicht Stärke der Veränderung).
- **Fast versus Slow Stochastic**: Fast reagiert schneller, ist aber unruhiger; Slow ist die geglättete Standardvariante. Die meisten Plattformen verwenden standardmäßig Slow.
- **[KDJ](/blog/what-is-kdj) erweitert die Stochastik um eine J-Linie** (`J = 3K − 2D`). Die J-Linie kann über 0 oder 100 hinausschießen, weshalb KDJ in Märkten mit schärferen Bewegungen (A-Aktien) populärer ist.

## Wie wird der Stochastik-Oszillator berechnet?

Die vollständige Mathematik für die am weitesten verbreitete Form (Slow Stochastic):

```
Rohes %K = ((Schluss − Tief(N)) / (Hoch(N) − Tief(N))) × 100
%K       = 3-Perioden-SMA des rohen %K
%D       = 3-Perioden-SMA von %K
```

Standard N = 14 in der US-Konvention; KDJ verwendet (9, 3, 3) in der A-Aktien-Konvention. Die Glättung reduziert das Rauschen — die ungeglättete „Fast Stochastic" ist für den Einsatz auf Tagesbars bei den meisten Aktien zu empfindlich.

Die Ausgabe ist konstruktionsbedingt zwischen 0 und 100 begrenzt:

- **%K = 100** bedeutet, der Schluss liegt auf dem höchsten Preis der letzten N Bars (maximale Stärke).
- **%K = 0** bedeutet, der Schluss liegt auf dem niedrigsten Preis der letzten N Bars (maximale Schwäche).
- **%K = 50** bedeutet, der Schluss liegt genau in der Mitte der jüngsten Spanne.

Das macht die Stochastik fundamental anders als den [RSI](/blog/what-is-rsi), der die *Stärke der jüngsten Kursveränderungen* misst, nicht die *Position in einer Spanne*. Beide stimmen oft überein, aus leicht unterschiedlichen Gründen.

## Fast versus Slow Stochastic — was ist der Unterschied?

Es gibt drei Spielarten der Stochastik in steigender Reihenfolge der Glättung:

| Variante | Rohes %K | %K (Ausgabe) | %D | Anwendungsfall |
|---|---|---|---|---|
| **Fast** | Roh | Roh | 3-SMA von %K | Aktive Trader, Intraday |
| **Slow** | Roh | 3-SMA des Rohen | 3-SMA von %K | Standard für Tagesbars |
| **Full** | Roh | N-SMA des Rohen (konfigurierbar) | M-SMA von %K (konfigurierbar) | Individuelle Optimierung |

Der „Stochastik-Oszillator" ohne Qualifikation bezieht sich fast immer auf die Slow-Variante. Die Fast Stochastic erzeugt auf Tagesbars zu viele Fehlsignale, um für die meisten Retail-Zeitrahmen nützlich zu sein; sie hat ihren Platz auf Intraday-Charts, wo der Rauschpegel höher ist.

## Was bedeuten überkauft und überverkauft hier?

Die Schwellen 80/20 funktionieren ähnlich wie die 70/30 beim RSI:

- **Stochastik > 80**: Der Schluss liegt in den oberen 20 % der jüngsten N-Bar-Spanne — Aufwärtstrend mit starkem jüngsten Momentum.
- **Stochastik < 20**: Der Schluss liegt in den unteren 20 % der jüngsten Spanne — Abwärtstrend mit schwachem jüngsten Momentum.

Die zentrale Verhaltensnuance: In einem stark trendenden Markt kann die Stochastik (in einem Aufwärtstrend) bei oder über 80 oder (in einem Abwärtstrend) unter 20 für viele aufeinanderfolgende Bars „klemmen". „Stochastik > 80" automatisch als „überkauft zum Verkaufen" zu behandeln, verliert in trendenden Märkten Geld. Das Signal ist nützlicher beim *Ausstieg* aus einem Extremwert — `%K kreuzt 80 von oben nach unten` für Verkaufssignale, `%K kreuzt 20 von unten nach oben` für Kaufsignale.

## Stochastik versus KDJ — was ist der Unterschied?

KDJ ist die Stochastik mit einer Ergänzung: der J-Linie.

| Komponente | Formel | Spanne |
|---|---|---|
| **K** (KDJ) | Wie das %K der Slow Stochastic | 0–100 (begrenzt) |
| **D** (KDJ) | Wie das %D der Slow Stochastic | 0–100 (begrenzt) |
| **J** (KDJ) | `3K − 2D` | Unbegrenzt — kann unter 0 oder über 100 gehen |

Die unbegrenzte Eigenschaft der J-Linie ist der eigentliche Grund, warum KDJ als eigener Indikator existiert. Wenn der Markt in einer scharfen Bewegung ist, schießt J über 0 oder 100 hinaus, was als frühes Extrem-Signal fungiert — typischerweise 1–3 Bars, bevor K und D dasselbe Extrem zeigen.

KDJ ist aus zwei Gründen der Standardoszillator in der chinesischen A-Aktien-Retail-Community:

1. Die täglichen Preisgrenzen der A-Aktien (±10 % am Hauptboard, ±20 % bei ChiNext/STAR) erzeugen schärfere Bar-zu-Bar-Bewegungen als US-Tagesbars. Der Überschuss der J-Linie erfasst diese schärferen Bewegungen sauberer als der RSI.
2. Kulturelle Koordination — weil die A-Aktien-Retail-Community KDJ als Standard verwendet, sind die Signale auf A-Aktien-Namen teilweise selbsterfüllend.

Für einen tieferen Vergleich siehe [Was ist KDJ?](/blog/what-is-kdj) und [KDJ versus RSI](/blog/kdj-vs-rsi).

## Vier Fallstricke beim Lesen der Stochastik

1. **Den Trend mit der Stochastik gegen den Strich handeln.** „Stochastik über 80, also verkaufen" verliert in Aufwärtstrends Geld. In trendenden Märkten klemmt die Stochastik viele Bars lang an Extremwerten; das richtige Signal ist der *Ausstieg* aus dem Extrem in Kombination mit einem Bestätigungsereignis (Kursausbruch, Momentum-Kreuz), nicht das Extrem selbst.
2. **Die Stochastik auf unruhige Werte anwenden.** Werte mit niedrigem Momentum und hohem Rauschen erzeugen Dutzende Stochastik-Kreuze pro Quartal, von denen die meisten Rauschen sind. Verwenden Sie die Stochastik auf Namen mit angemessener Trendpersistenz — dieselben Kriterien wie für MACD und andere Momentum-Oszillatoren.
3. **Den Trendregimefilter ignorieren.** Die Stochastik ohne Trendfilter ist meist Rauschen. Wenn der [ADX](/blog/what-is-adx) unter 20 liegt, sind Stochastik-Signale Münzwürfe. Wenn der ADX über 25 mit klarer Trendrichtung liegt, haben Stochastik-Signale an Extremwerten eine bedeutsame Edge.
4. **Stochastik mit Stochastik-RSI verwechseln.** Die Stochastik misst die *Kurs*-Position in der Spanne; der Stochastik-RSI (StochRSI) misst die *RSI*-Position in ihrer eigenen Spanne. Sie klingen ähnlich, messen aber Unterschiedliches und reagieren unterschiedlich. Die standardmäßige „Stochastik" der meisten Plattformen ist die ursprüngliche Lane-Stochastik, nicht StochRSI.

## Wie sich die Stochastik auf A-Aktien verhält

Die A-Aktien-Mikrostruktur macht Stochastik (und KDJ) besonders empfindlich:

- **Limit-up-Tage** deckeln den Schluss am Limit-Preis, was mechanisch das Hoch der Bar-Spanne ist. Die Stochastik %K an einem Limit-up-Tag liegt konstruktionsbedingt bei oder nahe 100, unabhängig vom breiteren Trendkontext. PickSkill kennzeichnet Limit-Tag-Bars in den Indikator-Dashboards als Ausreißer.
- **Aussetzungstage** frieren die Berechnung ein. Wenn die Aktie nach einer mehrtägigen Aussetzung wieder gehandelt wird, enthält das Lookback-Fenster den Zeitraum vor der Aussetzung, der möglicherweise nicht mehr relevant ist — behandeln Sie Stochastik-Werte nach Aussetzung in den ersten 5–10 Bars mit Vorsicht.
- **T+1-Abwicklung** macht Round-Trips am selben Tag unmöglich. Das komprimiert die Intraday-Volatilität in den Eröffnungsbar der nächsten Sitzung — wodurch A-Aktien-Stochastik-Signale stärker ereignisgetrieben und weniger kontinuierlich sind als US-Tagesbar-Stochastik.

Siehe [Beste Indikatoren für A-Aktien](/blog/best-indicators-for-a-shares) und [MACD bei A-Aktien versus US-Aktien](/blog/macd-on-a-shares-vs-us) für den breiteren marktspezifischen Kontext.

> **Sehen Sie es in Ihrem Portfolio.** Die [/indicators](/indicators)-Seite rendert KDJ (die am häufigsten verwendete Stochastik-Variante im PickSkill-Universum) über jede Position hinweg, mit K-, D- und J-Linien plus dem 5-Tage-Bucket-Pfad.

## Wie die Stochastik in einen Multi-Signal-Workflow passt

Die Stochastik ist eine Eingangsgröße in einem mehrschichtigen Workflow:

| Schicht | Werkzeug | Beantwortete Frage |
|---|---|---|
| **Trendfilter** | MA-Stack + [ADX](/blog/what-is-adx) | Gibt es einen Trend? Ist er stark genug zum Handeln? |
| **Momentum / Oszillator** | Stochastik / [KDJ](/blog/what-is-kdj) / [RSI](/blog/what-is-rsi) | Wo befindet sich die Bewegung in ihrem Momentum-Zyklus? |
| **Bestätigung** | %K kreuzt %D, [MACD](/blog/what-is-macd)-Kreuz | Wann handeln? |
| **Niveau / Karte** | [Unterstützung / Widerstand](/blog/what-is-support-resistance) | Wo liegen die Schlüsselniveaus? |

Das sauberste Einstiegssetup: bestätigter Trend (ADX > 25, MA-Stack ausgerichtet), Stochastik verlässt den überverkauften Bereich von unter 20, %K kreuzt %D nach oben, Kurs durchbricht ein jüngstes Swing-Hoch — vier Signale ausgerichtet. Das Auslassen eines der vier Signale reduziert die Edge pro Signal erheblich.

## Häufige Folgeprompts

- *„Zeige mir für jede Position die aktuellen KDJ-Werte plus 5-Tage-Pfad. Markiere alle, bei denen K den überverkauften Bereich verlassen hat und J schnell steigt."*
- *„Vergleiche Stochastik- und RSI-Signale über meine A-Aktien-Watchlist hinweg. Welche Namen haben beide an Extremen?"*
- *„Finde S&P-500-Namen, bei denen die Stochastik %K den überverkauften Bereich verlässt UND der 50-Tage-MA über den 200-Tage-MA kreuzt — bullische Umkehrkandidaten."*
- *„Backteste das Kreuzen von Stochastik %K und %D aus dem überverkauften Bereich auf [Ticker] über die letzten 5 Jahre. Wie hoch ist die Trefferquote?"*

## Weiterführende Literatur

- [Investopedia zum Stochastik-Oszillator](https://www.investopedia.com/terms/s/stochasticoscillator.asp) — umfassende Referenz.
- [George Lanes Originalarbeit zur Stochastik](https://www.amazon.com/George-Lane/e/B001JS4OBC) — die Behandlung des Indikators durch den Entwickler selbst.

## FAQ

**Stochastik versus RSI — was ist besser?**
Keines — sie messen Unterschiedliches. Der RSI erfasst die *Stärke der jüngsten Kursveränderungen*; die Stochastik erfasst die *Position innerhalb der jüngsten Kursspanne*. In trendenden Märkten tendiert der RSI dazu, nützlicher zu sein (er kann einen Trend ohne falsche Umkehrungen mitreiten). In seitwärts gerichteten Märkten tendiert die Stochastik dazu, nützlicher zu sein (sie identifiziert die Extreme der Spanne sauber). Die PickSkill-Dashboards führen beide, sodass Sie vergleichen können. Siehe [KDJ versus RSI](/blog/kdj-vs-rsi) für eine tiefere Behandlung.

**Warum zeigt mein Chart andere Stochastik-Werte als eine andere Plattform?**
Zwei häufige Ursachen: (1) unterschiedliche Perioden (14 versus 9 für %K, 3 versus 5 für die Glättung von %D), und (2) Fast versus Slow Variante. Die PickSkill-Dashboards verwenden die Standard-Slow-Stochastik mit Default-Perioden, um der gängigsten Plattformkonvention zu entsprechen.

**Was ist das Verhältnis zwischen Stochastik und KDJ?**
KDJ ist die Slow Stochastic mit einer zusätzlichen J-Linie (`J = 3K − 2D`). Die K- und D-Mathematik ist zwischen beiden identisch. Die J-Linie von KDJ ist die einzige Ergänzung und liefert Frühwarnsignale durch Überschießen über 0 oder 100. Stochastik ist die vorherrschende Konvention in den USA; KDJ ist die vorherrschende Konvention in der A-Aktien-Retail-Community.

**Kann die Stochastik die Richtung vorhersagen?**
Die Stochastik identifiziert *Extreme* und *Kreuze*; sie sagt nicht isoliert die absolute Richtung voraus. Eine Stochastik, die aus dem überverkauften Bereich nach oben kreuzt, sagt Ihnen, dass das Momentum an diesem spezifischen Extrem positiv geworden ist; sie sagt Ihnen nicht, dass der größere Trend sich fortsetzen wird. Paaren Sie Stochastik-Signale mit einem Trendfilter (MA-Stack + ADX) und einem Bestätigungsereignis (Kursausbruch, MACD-Kreuz), bevor Sie handeln.

**Sollte ich die Stochastik auf Intraday-Charts verwenden?**
Sie können, aber reduzieren Sie die Erwartungen. Intraday-Stochastik erzeugt viele Signale pro Sitzung, von denen die meisten Rauschen sind. Verwenden Sie Intraday-Stil-Perioden (5 oder 7 statt 14) und verlangen Sie Multi-Signal-Bestätigung. Die meiste Retail-Intraday-Arbeit übernutzt die Stochastik im Verhältnis zu ihrer tatsächlichen Edge.
