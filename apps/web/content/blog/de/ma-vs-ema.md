---
title: SMA vs EMA — Welchen gleitenden Durchschnitt sollten Sie verwenden?
description: >-
  SMA gewichtet jeden Bar gleich; EMA gewichtet jüngere Bars stärker. Direkter
  Vergleich, wann jeder gewinnt, und warum der 200-Tage-SMA wichtiger ist als
  sein EMA-Cousin.
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
  - SMA
  - EMA
  - Gleitender Durchschnitt
  - Technische Analyse
  - Vergleich
heroImage: /blog/ma-vs-ema/hero.png
heroAlt: >-
  Editorial-Infografik — Preislinie mit SMA(20) und EMA(20) übereinander; zeigt,
  wie die EMA dem Kurs enger folgt als die langsamere SMA.
---

**SMA (Simple Moving Average) ist das arithmetische Mittel des Schlusskurses über N Bars — jeder Bar gleich gewichtet. EMA (Exponential Moving Average) wendet eine exponentiell abklingende Gewichtung an, sodass jüngere Bars mehr zählen.** Der mathematische Unterschied ist klein. Der praktische Unterschied — welcher schneller reagiert, welcher stabiler ist und um welchen Institutionen koordinieren — treibt den größten Teil der redaktionellen Wahl. Es gibt richtige und falsche Antworten, je nachdem, was Sie versuchen zu tun.

### Kernaussagen

- **SMA reagiert langsamer; EMA reagiert schneller.** Diese eine Eigenschaft erklärt 80% des Wann jedes zu verwenden ist.
- **EMA ist die richtige Wahl innerhalb von Momentum-Werkzeugen** ([MACD](/blog/what-is-macd) verwendet EMA(12) und EMA(26)) — Reaktivität zählt in diesen Kontexten.
- **SMA ist die richtige Wahl für Trendfilter.** Der 200-Tage-SMA ist die institutionelle Referenz; der 200-Tage-EMA existiert, aber kaum jemand beobachtet ihn.
- **Die Kluft schrumpft mit wachsendem Fenster.** Bei 200 Bars liegen SMA- und EMA-Werte typischerweise innerhalb von 1–2% voneinander.
- **Beide werden auf den PickSkill [/indicators](/indicators)-Dashboards angezeigt** — die MA-Karten verwenden standardmäßig SMA für den 200-Tage, EMA für 12 / 26 im MACD und SMA für den 20 / 60-Stack.

## Die beiden Formeln nebeneinander

### Simple Moving Average (SMA)

```
SMA(N) = (close[t] + close[t-1] + ... + close[t-N+1]) / N
```

Jeder Bar im Fenster bekommt Gewicht 1/N. Am Tag t+1 fällt der älteste Bar heraus und der neue kommt hinein. Der Einfluss jedes Bars ist binär: Er ist im Fenster oder er ist es nicht.

### Exponential Moving Average (EMA)

```
EMA(N)[t] = α × close[t] + (1 − α) × EMA(N)[t−1]
            mit α = 2 / (N + 1)
```

Der heutige Schluss bekommt Gewicht α; der gestrige EMA trägt den Rest. Die rekursive Form bedeutet, dass *jeder* vorherige Bar beiträgt, mit exponentiell abklingender Gewichtung. Für N = 20 bekommt der jüngste Bar etwa 9,5% Gewicht; der Bar vor 10 Tagen etwa 3,7%; der Bar vor 50 Tagen etwa 0,4%.

Für eine gründlichere Behandlung beider siehe [Was ist ein gleitender Durchschnitt?](/blog/what-is-ma).

## Direkter Vergleich

| Eigenschaft | SMA | EMA |
|---|---|---|
| **Gewichtung** | Gleich über das Fenster | Exponentiell abklingend |
| **Verzögerung** | Hoch — volle N/2-Bar-Verzögerung bei trendenden Daten | Niedriger — etwa N/3-Bar effektive Verzögerung |
| **Reaktion auf jüngste Kurse** | Langsamer | Schneller |
| **Effekt von Ausreißer-Bars** | Einzelner Ausreißer biast den SMA für genau N Bars und fällt dann raus | Ausreißer-Einfluss klingt für immer glatt ab |
| **Verhalten am Fensterrand** | Scharfer Abfall, wenn alter Bar das Fenster verlässt (der „Drop-off-Effekt") | Glatt — keine diskreten Abfälle |
| **Meistgenutzter Default für** | Trendfilter (200-Tage), Bollinger-Mittellinie | Momentum-Werkzeuge (MACD 12 / 26) |
| **Institutionelle Koordination** | Hoch — der 200-Tage-SMA ist die universelle Referenz | Niedriger — nur innerhalb spezifischer Werkzeuge |
| **Rechenkosten** | Höher (Fenstersumme je Bar) | Niedriger (eine Multiplikation und Addition) |

Der Drop-off-Effekt lohnt einen kurzen Halt. Stellen Sie sich einen 20-Tage-SMA vor, bei dem vor 20 Bars der Schluss bei $80 lag und die Aktie heute bei $100 steht. Wenn morgen kommt und der $80-Bar aus dem Fenster fällt, springt der SMA, selbst wenn der heutige Schluss flach ist — weil der Durchschnitt eine niedrige Zahl aus der Berechnung verloren hat. Der SMA kann sich diskret verschieben, ohne neue Information. Der EMA hat diese Eigenart nicht; der Einfluss des $80-Bars klingt kontinuierlich und glatt ab.

## Welcher reagiert schneller?

EMA reagiert schneller — konstruktionsbedingt. Für dieselbe Periode N beträgt die effektive Verzögerung des EMA etwa N/3 Bars, während die des SMA N/2 Bars beträgt.

Bei einer scharfen Kursbewegung dreht der EMA 1–3 Bars früher als der SMA gleicher Länge auf Tageschart. Bei einem anhaltenden Trend folgt der EMA dem aktuellen Kurs enger, während der SMA der Mitte des Trends folgt. Bei einer langsamen Bewegung ist der Unterschied klein.

Die schnellere Reaktion ist *der einzige Grund*, warum der EMA existiert. Sie ist auch der Grund, warum der EMA mehr Fehlsignale produziert — jede zusätzliche Sensitivität kommt mit zusätzlichem Rauschen. Der Reaktivitäts-vs.-Stabilitäts-Trade-off ist die Designentscheidung, die jeder Werkzeug-Entwickler getroffen hat:

- [MACD](/blog/what-is-macd) nutzt EMA, weil Momentum-Werkzeuge Reaktivität brauchen.
- Der 200-Tage-SMA hält sich, weil der institutionelle Risikofilter Stabilität will.
- Die Bollinger-Mittellinie ist SMA(20), weil die statistische Interpretation der Bänder (Standardabweichungs-Envelope) am saubersten um einen einfachen Mittelwert ist.

## Wann gewinnt SMA?

Drei Kontexte, in denen der Stabilitätsvorteil des SMA zählt:

1. **Lange Trendfilter.** Der 200-Tage-SMA ist die universelle Referenz für das Trendregime — institutionelle Koordination auf genau diesem Niveau ist der gesamte Punkt. Auf einen 200-Tage-EMA umzuschalten verwirft den Koordinationsvorteil ohne echten Informationsgewinn. Bleiben Sie beim SMA.
2. **Statistische Envelope-Konstruktion.** Bollinger-Bänder verwenden SMA(20) als Mittellinie, weil das ±2-Standardabweichungs-Envelope eine saubere statistische Interpretation um ein arithmetisches Mittel hat. Um einen EMA wird die Interpretation matschiger.
3. **Ausreißer-Robustheit bei illiquiden Werten.** Ein dünn gehandelter Small-Cap mit einem Earnings-Gap-Tag wird seinen EMA wochenlang gebiast sehen (weil der Ausreißer-Einfluss im EMA nie vollständig abklingt). Der SMA verliert den Ausreißer nach N Bars vollständig — saubereres Verhalten für illiquide Instrumente.

## Wann gewinnt EMA?

Drei Kontexte, in denen der Reaktivitätsvorteil des EMA zählt:

1. **Innerhalb von Momentum-Werkzeugen.** [MACD](/blog/what-is-macd) (EMA(12) − EMA(26), geglättet durch EMA(9)) ist das klassische Beispiel. Der ganze Punkt des MACD ist, Momentum-Änderungen zu erfassen; die Verzögerung des SMA würde die Kreuz-Signale zu spät machen, um nützlich zu sein.
2. **Kurzfenster-Swing-Systeme.** Aktive Trader, die Kurzfenster-MA-Kreuz-Systeme laufen lassen (5/10, 10/20), bevorzugen typischerweise EMA — die schnelleren Drehungen erfassen Swing-Pivots, die der SMA verpasst.
3. **Hochfrequenz-Verfolgung schnell laufender Aktien.** Bei einer Aktie, die schnelle direktionale Bewegungen macht (parabolische Aufwärtstrends, scharfe Umkehrungen), produziert das kontinuierliche Abklingen des EMA glattere Verfolgung als die diskreten Abfälle des SMA.

## Was ist mit WMA, HMA und anderen Varianten?

Jenseits von SMA und EMA existieren Dutzende von Moving-Average-Varianten:

| Variante | Gewichtungsschema | Hinweis |
|---|---|---|
| **WMA** (Weighted MA) | Lineares Abklingen über N Bars | Zwischen SMA und EMA in Reaktivität |
| **HMA** (Hull MA) | Adaptiv — kombiniert gewichtete MAs unterschiedlicher Länge | Sehr niedrige Verzögerung; beliebt bei aktiven Tradern, kulturell weniger verankert |
| **TEMA / DEMA** | Dreifach / doppelt exponentiell geglättet | Entworfen, um die EMA-Verzögerung weiter zu reduzieren; bescheidene Verbesserung |
| **VWMA** (Volume-Weighted MA) | Gewichtet jeden Bar mit seinem Volumen | Bezieht Partizipation ein; nützlich für illiquide Werte |
| **KAMA** (Kaufman Adaptive MA) | Länge passt sich der Marktvolatilität an | Am glattesten in Seitwärtsphasen, am schnellsten in Trends; mathematisch elegant, bescheidene praktische Edge |

Für die meisten Retail-Anwendungsfälle decken SMA und EMA das Feld ab. Die exotischen Varianten bieten marginale Verbesserungen in spezifischen Szenarien, tauschen aber institutionelle Koordination (sonst beobachtet niemand Ihre KAMA-Linie) gegen theoretische Edge. Bleiben Sie bei SMA und EMA, sofern Sie keine spezifischen Backtest-Belege haben, die eine Variante rechtfertigen.

## Vier Fallstricke bei der Wahl zwischen SMA und EMA

1. **Die beiden in einem einzigen Signal vermischen, ohne nachzudenken.** Ein „20-Tage-EMA, der den 50-Tage-SMA kreuzt" ist ein mathematisch valides Signal — aber der Vergleich ist Äpfel-mit-Birnen (unterschiedliche Verzögerungscharakteristika) und das Ergebnis ist schwerer zu interpretieren. Wählen Sie eine Familie und bleiben Sie innerhalb eines Systems konsistent.
2. **Auf EMA wechseln, weil Backtests besser aussehen.** Die schnellere Reaktivität des EMA produziert *mehr* Signale; einige dieser zusätzlichen Signale sind korrekt (und heben die Equity-Kurve) und einige sind falsch (und addieren Drawdowns). Backtest-Tuning entdeckt typischerweise EMA bei Daten, die zufällig Reaktivität gegenüber Stabilität bevorzugen. Out-of-Sample ist der Effekt oft weg.
3. **Die „kein Drop-off"-Eigenschaft des EMA als universell besser behandeln.** Der Drop-off-Effekt ist manchmal informativ — eine scharfe SMA-Verschiebung, wenn ein alter Ausreißer das Fenster verlässt, sagt Ihnen, dass die jüngere Kursaktion bedeutsam anders ist als vor N Bars. Der EMA versteckt diese Information in seiner Glätte.
4. **EMA für den 200-Tage-Trendfilter verwenden.** Das ist der häufigste Fehler. Der 200-Tage-SMA zählt, weil alle ihn beobachten; der 200-Tage-EMA ist nur eine etwas schnellere Linie ohne institutionelle Koordination dahinter. Das Wechseln verliert den Koordinationsvorteil und gewinnt nichts Bedeutsames.

## Wie sie sich auf A-Aktien vs. US-Aktien verhalten

Die Marktmikrostruktur ändert die Rechnung subtil:

- **A-Aktien**: Limit-up- und Limit-down-Tage sind funktionelle Ausreißer. Die „Bar nach N Bars fallenlassen"-Eigenschaft des SMA bewältigt sie sauber; das kontinuierliche Abklingen des EMA bedeutet, dass ein Limit-up-Tag den EMA wochenlang biast. Für A-Aktien-Werte mit häufigen Limit-Tagen ist SMA robuster.
- **US-Large-Caps**: Kontinuierliche Liquidität bedeutet, dass Ausreißer-Tage selten sind; der EMA-vs.-SMA-Unterschied ist in der Praxis kleiner. Beides funktioniert; wählen Sie basierend auf dem spezifischen Werkzeug (EMA für Momentum, SMA für Trendfilter).
- **HK-Werte**: Gemischte Konvention; lokale Plattformen verwenden oft standardmäßig SMA, ausländische Broker oft standardmäßig EMA. Beides ist akzeptabel.

Die PickSkill-Dashboards verwenden standardmäßig SMA für lange Trendfilter (50, 60, 200) und EMA für kurze Momentum-Werkzeuge (12, 26 innerhalb MACD). Das ist die Konvention, die in der breitesten Spanne akademischer Backtests verwendet wird und der institutionellen Referenz entspricht.

> **Sehen Sie beide auf Ihren Charts.** Die [/indicators](/indicators)-Seite zeigt den Standard-MA-Stack — 20 / 60 / 200 (SMA) plus die internen 12 / 26 EMAs des MACD — über jeder Position, mit markiertem Kreuz-Status und Steigungsrichtung.

## Wie sich die Wahl in einem realen Workflow auswirkt

Das sauberste mentale Modell: **Verwenden Sie SMA für die *Karte* (wo der Kurs im Durchschnitt über das Fenster war), verwenden Sie EMA für den *Motor* (wie sich das Momentum gerade jetzt ändert).**

| Workflow-Stufe | Werkzeug | MA-Spielart |
|---|---|---|
| **Trendregime** | 200-Tage-MA | SMA |
| **Mittelfristiger Kontext** | 50-Tage-MA | SMA |
| **Kurzfristiger Kontext** | 20-Tage-MA | SMA |
| **Momentum-Oszillator** | [MACD](/blog/what-is-macd) | EMA (intern) |
| **Volatilitäts-Envelope** | [Bollinger-Mittellinie](/blog/what-is-bollinger-bands) | SMA |
| **Swing-Trade-Einstiegsfilter** | 5/10-Kreuz-System | EMA |

Verwenden Sie beide, aber jeden am richtigen Ort.

## Weiterführende Literatur

- [Investopedia-Vergleich von SMA und EMA](https://www.investopedia.com/ask/answers/05/smaema.asp) — knappe Referenz zu den mechanischen Unterschieden.
- [Robert Colby, *The Encyclopedia of Technical Market Indicators*](https://www.amazon.com/dp/0070120579) — erschöpfende Behandlung von Moving-Average-Varianten mit historischen Backtests.

## FAQ

**Sollte ich immer EMA verwenden, weil er schneller reagiert?**
Nein. Schnellere Reaktion bedeutet sowohl mehr korrekte Signale als auch mehr falsche Signale. Für lange Trendfilter ist die Stabilität des SMA der *Punkt*. Für kurze Momentum-Werkzeuge ist die Reaktivität des EMA der *Punkt*. Wählen Sie den richtigen für die Aufgabe, optimieren Sie nicht alles auf Geschwindigkeit.

**Warum ist der 200-Tage-SMA berühmter als der 200-Tage-EMA?**
Jahrzehnte institutioneller Konvention. Der 200-Tage-SMA ist in den Risikomanagement-Regeln vieler systematischer Fonds fest verdrahtet und ist die Referenz in praktisch jedem Chart-Plattform-Default. Selbsterfüllende Koordination am Niveau macht das Niveau relevant, unabhängig davon, ob SMA oder EMA „mathematisch besser" ist. Der 200-Tage-EMA existiert, befehligt aber weit weniger institutionelle Aufmerksamkeit.

**Sind SMA und EMA über lange Horizonte mathematisch äquivalent?**
Sie konvergieren in der zentralen Tendenz, werden aber nie identisch. Bei 200 Bars liegen die SMA- und EMA-Werte bei glatt trendenden Daten typischerweise innerhalb von 1–2% voneinander; bei volatilen Daten kann die Kluft größer sein. Sie haben durchgehend unterschiedliche Verzögerungscharakteristika — selbst bei langem N ist der EMA um eine kleine, aber messbare Marge schneller.

**Welcher ist besser für Aktien, die ich langfristig halte?**
Für langfristige Halten ist der gleitende Durchschnitt überwiegend ein *Kontext*-Indikator (ist der breitere Trend aufwärts oder abwärts?), kein *Signal*-Indikator. SMA ist in Ordnung. Insbesondere der 200-Tage-SMA sagt Ihnen das Regime auf einen Blick und passt zu dem, was institutionelle Risk-Desks beobachten. Sparen Sie sich die EMA-Debatte für Intraday- und Swing-Trading-Kontexte auf, wo Reaktivität Ergebnisse treibt.

**Warum zeigen meine Charts andere SMA- / EMA-Werte als eine andere Plattform?**
Drei häufige Ursachen: (1) unterschiedliche Startpunkte für die EMA-Rekursivberechnung (einige Plattformen seeden von einem einfachen Mittel der ersten N Bars; andere vom ersten Schluss), (2) unterschiedlicher Umgang mit After-Hours- / Pre-Market-Sitzungen, (3) unterschiedliche Konvention, auf welcher Seite des Bars der gleitende Durchschnitt geplottet wird (zentriert vs. End-of-Window). Für Konsistenz verwendet PickSkill End-of-Window-Plotting, SMA-geseedete EMAs und Daten nur aus regulären Sitzungen — die Konventionen, die in akademischen Backtests Standard sind.
