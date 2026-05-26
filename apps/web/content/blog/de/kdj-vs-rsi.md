---
title: KDJ vs RSI — Welchen Momentum-Oszillator sollten Sie verwenden?
description: >-
  KDJ und RSI messen beide Momentum, aber mit unterschiedlichen Formeln und
  Zeitrahmen. Direkter Vergleich, wann jeder gewinnt, und wie man sie
  kombiniert.
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
  - KDJ
  - RSI
  - Momentum
  - Technische Analyse
  - Vergleich
heroImage: /blog/kdj-vs-rsi/hero.png
heroAlt: >-
  Editorial-Infografik — oben RSI als Einzellinie mit 70/30-Referenzen, unten
  KDJ als Dreierlinie (K/D/J) mit 80/20-Referenzen und hervorgehobenem
  J-Linien-Overshoot.
---

**RSI und KDJ sind beide Momentum-Oszillatoren, aber sie stellen unterschiedliche Fragen. RSI misst die Stärke jüngster Kursänderungen gegenüber ihrer durchschnittlichen Größe; KDJ misst, wo der Schluss innerhalb der jüngsten Kursrange sitzt, und glättet dieses Signal dann zweimal.** Die meisten Retail-Debatten stellen sie als Ersatzteile dar. Sie sind Ergänzungen — jeder hat eine eigene Edge in einem spezifischen Marktregime, und die Kombination ist informativer als jeder allein.

### Kernaussagen

- **Unterschiedliche Inputs**: RSI nutzt Close-zu-Close-Änderungen; KDJ nutzt Close-vs.-Range-Position.
- **Unterschiedliche Skalen**: RSI läuft 0–100 mit Überkauft / Überverkauft bei 70 / 30; die J-Linie des KDJ kann 0–100 überschreiten (und dieses Überschwingen ist informativ).
- **RSI ist in trendenden Märkten überlegen** — seine 50-Linie ist ein sauberer Trendfilter.
- **KDJ ist in seitwärts laufenden Märkten überlegen** — seine Sensitivität gegenüber der Range-Position macht ihn früher bei Umkehrungen an Schwung-Niveaus.
- **Die Kombination ist mächtiger als jeder allein** — Divergenz in beiden gleichzeitig hat materiell höhere Überzeugung als Divergenz in einem. Das PickSkill [/indicators](/indicators)-Dashboard läuft beide nebeneinander für jede Position.

## Die beiden Formeln nebeneinander

### RSI (Relative Strength Index)

Entwickelt von J. Welles Wilder 1978. Bereich 0–100; Standard 14 Perioden.

```
RS = Durchschnittsgewinn(14) / Durchschnittsverlust(14)
RSI = 100 − [100 / (1 + RS)]
```

Der „Durchschnittsgewinn" ist der Mittelwert der Bars, bei denen der Schluss gestiegen ist; „Durchschnittsverlust" ist der absolute Mittelwert der Bars, bei denen der Schluss gefallen ist. Die Glättung verwendet Wilders modifizierten gleitenden Durchschnitt (eine 14-Perioden-exponentielle Glättung mit α = 1/14), was leicht von einem Standard-EMA abweicht.

Für eine vertiefte Behandlung siehe [Was ist RSI?](/blog/what-is-rsi).

### KDJ (Stochastic-Oszillator mit J-Linie)

Eine Variante des klassischen Stochastic-Oszillators mit einer hinzugefügten J-Linie. Am weitesten verbreitet in der chinesischen A-Aktien-Retail-Community; Standard (9, 3, 3) Perioden.

```
RSV = ((Close − Low(9)) / (High(9) − Low(9))) × 100
K = (2/3 × K[prev]) + (1/3 × RSV)
D = (2/3 × D[prev]) + (1/3 × K)
J = 3 × K − 2 × D
```

K und D laufen 0–100; **J kann beide Enden überschreiten** (J > 100 oder J < 0) aufgrund seiner Konstruktion. Das Überschwingen ist das Unterscheidungsmerkmal der J-Linie — sie verstärkt Extreme und dreht früher als K oder D.

Für eine vertiefte Behandlung siehe [Was ist KDJ?](/blog/what-is-kdj).

## Wo sie sich in der Interpretation unterscheiden

| Aspekt | RSI | KDJ |
|---|---|---|
| **Zugrunde liegender Input** | Close-zu-Close-Kursänderungen | Close vs. jüngste Hoch-Tief-Range |
| **Standardperiode** | 14 | 9 (schneller) |
| **Überkauft / Überverkauft** | 70 / 30 | 80 / 20 (K, D); J überschwingt |
| **Anzahl der Linien** | 1 Linie | 3 Linien (K, D, J) |
| **Stärkste Erkennung** | Trendstärke + Extreme | Umkehr in einer definierten Range |
| **Kreuz-Signale** | RSI kreuzt 50 (Trendfilter); 70 / 30 Ausstiege (Extreme-Ausstiege) | K kreuzt D (schneller); J-Wendepunkte (am schnellsten) |
| **Versagensmodus** | Bleibt während starker Trends überkauft / überverkauft | Whipsaws in Niedrigvolatilitäts-Seitwärtsbewegung |
| **Kulturell stärksten in** | US institutionell + Retail | A-Aktien-Retail; teilweise HK-Adoption |

Der grundlegende Unterschied: **RSI ist ein Kursänderungs-Indikator; KDJ ist ein Range-Positions-Indikator.** In einem trendenden Markt ist die „Stärke der Änderung"-Lesart des RSI informativ — starke Aufwärtsschlüsse treiben RSI in Richtung 70 und halten ihn dort. In einem seitwärts laufenden Markt ist die „Position in der Range"-Lesart des KDJ informativ — wenn der Schluss nahe dem Range-Hoch liegt, ist KDJ nahe 80, unabhängig davon, wie stark die Änderung war.

## Wann gewinnt RSI?

Drei Regime, in denen RSI mehr Signal als KDJ liefert:

1. **Bestätigte trendende Märkte.** Wenn [ADX](/blog/what-is-adx) > 25, bleiben die Überkauft- / Überverkauft-Werte des RSI als Fortsetzungssignale statt als Umkehrsignale zuverlässig. Ein anhaltender RSI > 70 in einem trendenden Markt ist *nicht* „überkauft zum Verkauf" — er ist „Aufwärtstrend mit Momentum". Die 50-Linie des RSI fungiert als sauberer Trendfilter: über 50 = Aufwärtstrend-Bias, darunter = Abwärtstrend.
2. **Hoch-Momentum-Werte mit glatten Trends.** Large-Cap-Tech, Mega-Cap-Werte, Indizes — Instrumente mit anhaltend gerichteten Bewegungen und begrenzter Mean Reversion. RSI erfasst die Persistenz von Momentum besser als KDJ, der zu sehr oszilliert.
3. **Multi-Zeitrahmen-Analyse.** Weil der RSI eine einzige Linie ist, ist der Multi-Zeitrahmen-Vergleich (Tages-RSI-Ausrichtung mit Wochen-RSI) sauberer. Die drei Linien des KDJ machen die Multi-Zeitrahmen-Analyse überladen.

Für einen tiefen Einblick in den RSI speziell siehe [Was ist RSI?](/blog/what-is-rsi).

## Wann gewinnt KDJ?

Drei Regime, in denen KDJ mehr Signal als RSI liefert:

1. **Seitwärts laufende Märkte an Schwung-Niveaus.** Wenn der Kurs in einer definierten Range schwankt (Unterstützung und Widerstand beide gut definiert), erfassen die früheren und sensitiveren Drehungen des KDJ die Umkehrungen an beiden Enden der Range, während RSI noch neutral ist.
2. **A-Aktien-Tagesbars.** Die A-Aktien-Retail-Community verwendet KDJ als Standard-Momentum-Werkzeug; die kulturelle Koordination bedeutet, dass die Signale bei A-Aktien-Werten teilweise selbsterfüllend sind. Das J-Linien-Überschwing-Muster ist ein anerkanntes Setup im lokalen Trader-Vokabular.
3. **Den Boden (oder die Spitze) schneller Bewegungen erwischen.** Die Drei-Linien-Konstruktion des KDJ bedeutet, dass J zuerst dreht, dann K den D zur Bestätigung kreuzt. Zwei-Stufen-Bestätigung ist schneller als die Einzel-Linien-Trajektorie des RSI und funktioniert gut bei Aktien mit scharfen Schwung-Pivots.

Für einen tiefen Einblick in den KDJ speziell siehe [Was ist KDJ?](/blog/what-is-kdj).

## Wie man sie gemeinsam verwendet

Die sauberste Kombination — verwendet in den PickSkill-Multi-Indikator-Dashboards — läuft beide parallel und sucht nach *Übereinstimmung*:

| Signal | Interpretation |
|---|---|
| **RSI überverkauft + KDJ überverkauft + beide drehen nach oben** | Bullischer Umkehrkandidat mit hoher Überzeugung; die beiden Oszillatoren stimmen über die Bedingung und die Drehung überein |
| **RSI > 70 + KDJ > 80 + Kurs trendet weiter aufwärts** | Fortsetzung in bestätigtem Aufwärtstrend; nicht faden, sofern ADX keine Trendabschwächung zeigt |
| **RSI-Divergenz + KDJ-Divergenz am selben Schwung** | Multi-Oszillator-Divergenz — materiell höhere Edge als Divergenz in einem allein |
| **RSI sagt eine Sache, KDJ etwas anderes** | Konfliktierendes Signal — Setup überspringen, bis Ausrichtung entsteht |

Die Disziplin besteht darin, beide zu verlangen. Auf RSI allein (oder KDJ allein) zu reagieren heißt, auf einen Input zu reagieren; Übereinstimmung zu verlangen filtert einen substanziellen Anteil falscher Positive heraus.

## Vier Fallstricke beim RSI- / KDJ-Vergleich

1. **Entweder als eigenständigen Trigger behandeln.** Beide Oszillatoren sind *Filter* und *Bestätigungen*, keine eigenständigen Trigger. Kombinieren Sie sie mit einem Trendfilter (MA-Stack + [ADX](/blog/what-is-adx)) und einer Niveau-Referenz ([Unterstützung / Widerstand](/blog/what-is-support-resistance)), bevor Sie handeln.
2. **Standardperioden auf jedem Instrument verwenden.** Die Defaults (RSI 14, KDJ (9, 3, 3)) sind vernünftige Ausgangspunkte auf Tagesbars. Auf Wochenbars übersetzen sie sich in etwa 3 Monate und 9 Wochen — real betrachtet etwas anderes. Auf Intraday-Bars erfassen sie weit weniger Information, als Retail-Leitfäden annehmen. Passen Sie die Periode an den Zeitrahmen an, den Sie tatsächlich handeln.
3. **Den kulturellen Kontext ignorieren.** US-institutioneller Flow handelt auf RSI; A-Aktien-Retail-Flow handelt auf KDJ. Die kulturelle Koordination zählt, weil sie Signale teilweise selbsterfüllend macht. Bei A-Aktien-Werten hat KDJ zusätzliches informationelles Gewicht jenseits seines mathematischen Gehalts.
4. **Versuchen zu bestimmen, welcher „besser" ist.** Beide funktionieren; beide haben spezifische Versagensmodi; beide sind zusammen stärker. Die „RSI vs. KDJ"-Debatte ist ein Kategorienfehler — sie sind komplementäre Werkzeuge, keine Konkurrenten.

## Wie sie sich auf A-Aktien vs. US-Aktien verhalten

Die A-Aktien-Marktmikrostruktur ändert, worauf man sich stützt:

- **A-Aktien**: KDJ ist der Standard. Tägliche Limits, T+1-Abwicklung und höhere Retail-Partizipation begünstigen alle die Range-Positions-Rahmung gegenüber der Änderungsstärke-Rahmung. RSI funktioniert noch, ist aber kulturell sekundär. Die PickSkill-Dashboards zeigen beide mit KDJ als primärem Indikator auf A-Aktien-Charts.
- **US-Large-Caps**: RSI ist der Standard. Kontinuierliche Liquidität, tiefer institutioneller Flow und glattere Kursaktion begünstigen die Trendstärke-Rahmung des RSI. KDJ funktioniert noch, signalisiert aber häufiger — viele davon falsch positiv in trendenden Märkten.
- **HK-Werte**: Gemischte Kultur — lokales Trader-Vokabular nutzt KDJ; ausländischer institutioneller Flow nutzt RSI. Beide funktionieren; beides zu verwenden ist der konservative Standard.

Siehe [MACD bei A-Aktien vs US-Aktien](/blog/macd-on-a-shares-vs-us) für die breitere marktweise Analyse und [Beste Indikatoren für A-Aktien](/blog/best-indicators-for-a-shares) für das A-Aktien-Playbook.

> **Lassen Sie beide auf Ihrem Portfolio laufen.** Das [/indicators](/indicators)-Dashboard zeigt RSI und KDJ nebeneinander für jede Position, zeigt Übereinstimmung / Nichtübereinstimmung auf einen Blick und markiert Multi-Oszillator-Divergenz als separates Signal.

## Weiterführende Literatur

- [Investopedia zum RSI](https://www.investopedia.com/terms/r/rsi.asp) und [Stochastic-Oszillator (KDJ-Familie)](https://www.investopedia.com/terms/s/stochasticoscillator.asp) — Referenzbehandlungen.
- [J. Welles Wilder Jr., *New Concepts in Technical Trading Systems*](https://www.amazon.com/dp/0894590278) — die ursprüngliche RSI-Referenz des Entwicklers.

## FAQ

**Mit welchem sollte ein Anfänger beginnen?**
RSI. Die 0–100-Skala ist intuitiv, die einzelne Linie ist leichter zu lesen, und die 50- / 30- / 70-Schwellen sind weithin bekannt. KDJ fügt Kraft hinzu, aber auch Komplexität; beginnen Sie mit RSI, fügen Sie KDJ hinzu, sobald Sie die Grundlagen von Momentum-Oszillatoren verinnerlicht haben.

**Sind KDJ und Stochastic dasselbe?**
KDJ ist eine Variante des Stochastic. Standard-Stochastic plottet nur K und D; KDJ fügt die J-Linie hinzu (`J = 3K − 2D`). Die K- und D-Mathematik ist zwischen den beiden identisch. Die J-Linie ist die einzige Erweiterung und das A-Aktien-spezifischste Element.

**Kann ich sie auf Intraday-Zeitrahmen verwenden?**
Sie können, aber reduzieren Sie die Erwartungen. Auf 5-Minuten- oder 15-Minuten-Charts erzeugen beide Oszillatoren Dutzende von Signalen pro Sitzung, die meisten davon Rauschen. Verwenden Sie intraday-typische Parametereinstellung (RSI 8 oder 9 Perioden, KDJ (5, 3, 3)) und verlangen Sie Multi-Signal-Bestätigung. Die meiste Retail-Intraday-Arbeit überstrapaziert diese Oszillatoren relativ zu ihrer tatsächlichen Edge.

**Was ist das J-Linien-Überschwingen beim KDJ, und ist es dasselbe wie RSI > 70?**
Die J-Linie ist als `3K − 2D` konstruiert, was bedeutet, dass sie den 0–100-Bereich, der K und D begrenzt, überschreiten kann. Ein Wert von J > 100 oder J < 0 ist ein „tiefes Extrem" — extremer als das, was K, D oder RSI zeigen würden. Es geht der tatsächlichen Drehung oft 1–3 Bars voraus. RSI hat diese Überschwing-Eigenschaft nicht; RSI ist konstruktionsbedingt auf 0–100 beschränkt. Das J-Überschwingen ist eine der Edges des KDJ.

**Warum zeigt mein Chart andere RSI- / KDJ-Werte als eine andere Plattform?**
RSI: Wilders Glättung vs. Standard-EMA-Glättung erzeugt kleine Unterschiede. KDJ: unterschiedliche Startwerte für die rekursive K- und D-Glättung erzeugen unterschiedliche Frühzeit-Werte (der Unterschied wäscht sich nach etwa 30 Bars heraus). Für Konsistenz verwenden die PickSkill-Dashboards Wilder-Glättung für RSI und 2/3-Vor + 1/3-Aktuell-Gewichtung für KDJ — die Konventionen aus akademischen Backtests und den am weitesten verbreiteten Retail-Plattformen.
