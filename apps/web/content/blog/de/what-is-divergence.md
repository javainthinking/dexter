---
title: >-
  Was ist Divergenz? Bullisch, bärisch und die versteckte Variante, die
  Privatanleger übersehen
description: >-
  Divergenz ist, wenn Kurs und Indikator sich in der Richtung uneinig sind.
  Definition, die 4 Standardtypen, warum die meisten Divergenzen scheitern, und
  wie man die filtert, die es nicht tun.
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
  - Divergenz
  - Technische Analyse
  - Momentum
  - Indikatoren
heroImage: /blog/what-is-divergence/hero.png
heroAlt: >-
  Editorial-Infografik — der Kurs bildet ein höheres Hoch, der RSI ein tieferes
  Hoch; beide Pivotpunkte sind eingekreist und markieren die Divergenz.
---

**Divergenz ist das technische Muster, bei dem Kurs und ein Oszillator (MACD, RSI, KDJ, OBV) sich über denselben Schwung in entgegengesetzte Richtungen bewegen.** Der Kurs bildet ein höheres Hoch, während der Indikator ein tieferes Hoch bildet — oder der Kurs bildet ein tieferes Tief, während der Indikator ein höheres Tief bildet. Die zugrunde liegende Botschaft: Die Bewegung, die Sie auf dem Chart sehen, wird vom Momentum (oder Volumen oder von der Marktbreite), das sie getrieben hat, nicht länger bestätigt. Die meisten Retail-Leser behandeln Divergenz als Umkehr-Trigger. Backtests sagen, dass dies der falsche Rahmen ist — sie ist eine *Warnung*, kein Signal.

### Kernaussagen

- **Vier Standardtypen**: reguläre bullische, reguläre bärische, versteckte bullische, versteckte bärische. Das „reguläre" Paar sind Umkehr-Warnungen; das „versteckte" Paar sind Trendfortsetzungs-Signale.
- **Der größte Einzelfehler** der Retail-Leser: Divergenz als eigenständigen Einstiegs-Trigger zu behandeln. Die Basis-Trefferquote bei nackter regulärer Divergenz liegt bei etwa 35–45%, je nach Markt und Zeitrahmen.
- **Divergenz wird nützlich, wenn sie gefiltert wird**: bestätigt durch ein Momentum-Kreuz, gestützt durch den Volumenkontext und unter Beachtung des zugrunde liegenden Trendregimes ([ADX](/blog/what-is-adx) > 25).
- **Versteckte Divergenz wird zu wenig gelehrt und ist wohl zuverlässiger** — historische Daten legen nahe, dass Trendfortsetzungs-Setups auf einfachen Metriken wie 5- und 20-Tage-Forward-Renditen Umkehr-Setups schlagen.
- **Das PickSkill [/indicators](/indicators) Divergenz-Dashboard** scannt jede Position nach den vier Divergenztypen über MACD, RSI und KDJ — und zeigt nur die Fälle an, in denen die Schwung-Pivots gut definiert sind.

## Wie ist Divergenz präzise definiert?

Divergenz erfordert zwei Schwungpunkte im Kurs und zwei entsprechende Schwungpunkte im Indikator. Der „Schwungpunkt" muss ein bestätigter Pivot sein — nicht irgendein lokales Hoch oder Tief, sondern eines mit mindestens N Bars auf jeder Seite, die ihn nicht übertreffen (N liegt typischerweise bei 3–5 auf Tagesbars).

Gegeben zwei bestätigte Kurs-Pivots und zwei bestätigte Indikator-Pivots über dasselbe Fenster existieren vier Fälle:

| Typ | Kurs | Indikator | Implikation |
|---|---|---|---|
| **Reguläre bullische** | Tieferes Tief | Höheres Tief | Abwärtstrend verliert Momentum — Umkehrkandidat |
| **Reguläre bärische** | Höheres Hoch | Tieferes Hoch | Aufwärtstrend verliert Momentum — Umkehrkandidat |
| **Versteckte bullische** | Höheres Tief | Tieferes Tief | Aufwärtstrend-Rücksetzer abgeschlossen — Fortsetzungskandidat |
| **Versteckte bärische** | Tieferes Hoch | Höheres Hoch | Abwärtstrend-Erholung abgeschlossen — Fortsetzungskandidat |

Die „regulären" Varianten sind diejenigen, die jedes Einführungsbuch zur technischen Analyse abdeckt. Die „versteckten" Varianten sind mathematisch symmetrisch, bekommen aber nur einen Bruchteil der Aufmerksamkeit.

## Warum scheitert Divergenz so oft?

Der mechanische Grund: Indikatoren werden *aus* dem Kurs abgeleitet. MACD ist die Differenz zweier EMAs des Schlusskurses. RSI ist eine normalisierte Funktion der jüngsten Aufwärts- vs. Abwärtsschlüsse. Wenn der Kurs ein neues Extrem bildet, der Indikator aber nicht, sagt der Indikator Ihnen, dass *jüngere* Kursänderungen kleiner waren als die Kursänderungen, die das vorherige Extrem getrieben haben. Das ist informativ — das Momentum schwächt sich ab. Aber abnehmendes Momentum ist nicht dasselbe wie eine Umkehr. Märkte können wochenlang mit abnehmendem Momentum dahindümpeln, ohne sich umzukehren.

Der empirische Grund: Die Basisraten für Divergenz sind nicht so stark, wie Leitfäden behaupten. Über diverse Märkte und Zeitrahmen hinweg:

- **Reguläre bullische Divergenz** Signal-zu-Umkehr-Trefferquote: etwa 35–45% auf Tagesbars ohne Filter.
- **Reguläre bärische Divergenz**: ähnlicher Bereich, leicht höher in Bärenmärkten, wo die „falschen Rallyes" häufige Fehlschläge produzieren.
- **Versteckte Divergenz**: 50–60% auf Tagesbars in klar trendenden Regimen; nahe am Münzwurf in volatilen Märkten.

Die Zahlen verbessern sich materiell mit Filtern. Die Zahlen verschlechtern sich materiell in volatilitätsarmer Seitwärtsbewegung. Dass die meisten Retail-Leitfäden für Divergenz „70%+ Genauigkeit" angeben, spiegelt Survivorship Bias in den gezeigten Beispielen wider — nicht das, was das Signal tatsächlich liefert.

## Welche Filter machen Divergenz tatsächlich nützlich?

Drei Filter, in Kombination angewendet, heben Divergenz vom Münzwurf-Terrain auf eine nutzbare Komponente in einem Mehrsignal-System:

1. **Trendregime-Filter.** Divergenz an einem Momentum-Oszillator erfordert einen trendenden Markt, damit der zugrunde liegende Mechanismus (Momentum-Erschöpfung) Sinn ergibt. Wenn [ADX](/blog/what-is-adx) unter 20 liegt, ist der Markt seitwärts und Divergenz ist nur zwei zufällige Pivots — ignorieren Sie sie. Wenn ADX über 25 liegt, hat Divergenz einen echten Signal-Rausch-Vorteil.

2. **Bestätigungsereignis.** Divergenz ist eine *Bedingung*, kein *Signal*. Warten Sie auf ein bestätigendes Ereignis — ein MACD-Linien-Kreuz, einen RSI-Ausstieg aus der Extremzone oder einen Kursausbruch eines strukturellen Niveaus —, bevor Sie auf die Divergenz reagieren. Die Bedingung sagt Ihnen, *welche Seite* einzunehmen ist; die Bestätigung sagt Ihnen, *wann*.

3. **Volumen- / Partizipationsbestätigung.** Divergenz ist am zuverlässigsten, wenn der Schwung, der *eigentlich* das höhere Hoch bilden sollte (im bärischen Fall), dies auf nachlassendem Volumen tut. Wenn das neue Kurshoch auf hohem Volumen druckt, ist die Divergenz wahrscheinlicher zum Scheitern verurteilt — schweres Kaufen ist nicht die Signatur eines erschöpfenden Aufwärtstrends.

Zusammen angewendet reduzieren diese Filter die Zahl der Divergenz-Setups um 60–80%, heben aber die Trefferquote pro Setup deutlich an. Der Trade-off sind weniger Trades; der Vorteil ist deutlich weniger Rauschen.

## Was ist versteckte Divergenz — und warum verdient sie mehr Aufmerksamkeit?

Versteckte Divergenz ist der trendfortsetzungs-orientierte Cousin der regulären Divergenz. Die Pivots sind invertiert:

- **Versteckte bullische**: In einem Aufwärtstrend bildet der Kurs ein höheres Tief (Rücksetzer, hält aber das vorherige Schwungtief), während der Indikator ein tieferes Tief bildet (tieferer Rücksetzer im Momentum, als der Kurs suggeriert). Interpretation: Der Rücksetzer ist abgeschlossen, der Trend setzt sich fort.
- **Versteckte bärische**: In einem Abwärtstrend bildet der Kurs ein tieferes Hoch (Erholung scheitert am vorherigen Schwunghoch), während der Indikator ein höheres Hoch bildet (stärkere Erholung im Momentum, als der Kurs suggeriert). Interpretation: Die Erholung ist vorbei, der Abwärtstrend setzt sich fort.

Warum das zählt: Versteckte Divergenz fängt die *Wiederaufnahme* etablierter Trends ein, was statistisch die Gelegenheit mit der höheren Edge in trendenden Märkten ist. Reguläre Divergenz versucht das *Ende* von Trends einzufangen, was statistisch schwieriger ist. Die meiste Trendfolgeforschung (Faber, Asness, Moskowitz) findet, dass die Persistenz von Trends das zuverlässigere Phänomen ist als das Timing ihrer Umkehr.

Das PickSkill *Top-Divergenz*-Dashboard zeigt alle vier Typen über MACD, RSI und KDJ — wobei versteckte Varianten explizit beschriftet werden, damit sie die Aufmerksamkeit bekommen, die sie verdienen.

## Vier Fallstricke beim Lesen von Divergenz

1. **Die Pivots im Nachhinein einzeichnen.** Divergenz ist auf einem Chart, dessen Auge weiß, wo die Schwünge liegen werden, im Rückblick leicht zu erkennen. Die Disziplin liegt darin, Pivots in Echtzeit nach einer festen Regel zu identifizieren (z.B. bestätigter Pivot = kein höherer / tieferer Punkt in den nächsten N Bars). Rückschau-Pivots werden mit Echtzeit-Pivots nicht übereinstimmen.
2. **Divergenz bei volatilen Aktien anwenden.** Niedrig-Momentum-, hochverrauschte Ticker erzeugen hunderte „Divergenzen", die nur zwei zufällige Pivots im Rauschen sind. Beschränken Sie die Divergenzanalyse auf Werte mit angemessener Trendpersistenz — dieselben Werte, bei denen MACD und andere Momentum-Werkzeuge funktionieren.
3. **Die Größe der Divergenz ignorieren.** Ein 2-Bar-tieferes Hoch im Kurs gegen ein 5-Bar-höheres Hoch im MACD ist eine Art Divergenz; ein 50-Bar tief negativer MACD-Schwung gegen einen marginal niedrigeren Kursschwung ist eine viel stärkere. Die Größe der Diskrepanz ist informativ, nicht nur ihre Existenz.
4. **Divergenz mit Überkauft / Überverkauft verwechseln.** RSI > 70 ist *überkauft*. RSI, der ein tieferes Hoch bildet, während der Kurs ein höheres Hoch bildet, ist *bärische Divergenz*. Beides tritt oft zusammen auf, ist aber nicht dasselbe — überkauft ist eine statische Bedingung; Divergenz ist ein Muster in Pivots.

## Wie sich Divergenz auf A-Aktien verhält

Die Mechanik ist identisch, aber die Marktmikrostruktur ändert, welche Divergenzen real sind:

- **Tägliche Limits beschneiden Schwünge.** Limit-up-Tage deckeln die Tagesrange beim Limit-Preis, was bedeutet, dass der Kurs-Pivot künstlich ist — er liegt nicht da, wo sich der Markt in einer frei handelnden Sitzung eingependelt hätte. Divergenz, die auf einem Limit-Tag-Pivot aufbaut, ist mechanisch verdächtig; die PickSkill-Dashboards schließen Limit-Tag-Bars von der Pivot-Erkennung aus.
- **Handelsstopps erzeugen falsche Pivots.** Wenn eine Aktie tagelang gestoppt ist und dann wieder aufgenommen wird, sieht der Wiederaufnahme-Gap wie ein scharfer Pivot aus, ist aber tatsächlich ein Preisentdeckungsereignis nach einem Einfrieren. Behandeln Sie Post-Stopp-Divergenz mit zusätzlicher Skepsis.
- **Höheres Volatilitätsregime.** A-Aktien handeln mit materiell höherer Tagesvolatilität als US-Large-Caps. Der „Rauschboden" für Pivot-Erkennung ist höher; verlangen Sie größere Pivots (N=5 statt N=3 auf Tagesbars), um Mikroschwünge herauszufiltern.

Für den breiteren marktweisen Vergleich siehe [Beste Indikatoren für A-Aktien](/blog/best-indicators-for-a-shares).

> **Finden Sie Divergenzen in Ihrem Portfolio.** Das [/indicators](/indicators)-Dashboard scannt jede Position nach den vier Divergenztypen über MACD, RSI und KDJ — und zeigt nur Schwünge, bei denen die Pivots gut definiert sind.

## Wie Divergenz in einen Mehrsignal-Workflow passt

Divergenz ist ein *Watchlist-Trigger*, kein Einstiegs-Trigger:

| Stufe | Werkzeug | Beantwortete Frage |
|---|---|---|
| **1. Filter** | [ADX](/blog/what-is-adx) > 25, MA-Stack ausgerichtet | Gibt es einen echten Trend zum Folgen oder Faden? |
| **2. Setup** | Divergenz an einem Momentum-Oszillator | Zeigt der Trend Erschöpfung (regulär) oder Wiederaufnahme (versteckt)? |
| **3. Trigger** | MACD-Kreuz, RSI kreuzt 50, Kursausbruch eines Pivots | Wann handeln? |
| **4. Bestätigen** | Volumen- / Marktbreite-Kontext | Wird die Bewegung durch Partizipation gestützt? |

Überspringen Sie eine Stufe und die Divergenz ist überwiegend Rauschen. Schichten Sie alle vier und Divergenz wird zu einem nützlichen Muster in einem strukturierten Workflow. Siehe [MACD, RSI und ADX zu einem 3-Indikator-Filter kombinieren](/blog/three-indicator-filter) für ein konkretes Schichtungs-Rezept.

## Weiterführende Literatur

- [Investopedia zur bullischen Divergenz](https://www.investopedia.com/terms/d/divergence.asp) — Referenz für die vier Standardtypen.
- [Constance Brown, *Technical Analysis for the Trading Professional*](https://www.amazon.com/dp/0071596666) — Praktiker-Behandlung von Momentum-Divergenz mit Schwerpunkt auf versteckten Varianten.

## FAQ

**Ist bullische Divergenz ein zuverlässiges Kaufsignal?**
Allein nein — historische Trefferquoten liegen bei 35–45% für nackte reguläre bullische Divergenz auf Tagesbars. Das Signal wird nützlich, wenn gefiltert wird: Trendregime (ADX > 25), Bestätigungsereignis (MACD-Kreuz oder RSI-Ausstieg aus überverkauft) und Volumen- / Marktbreite-Ausrichtung. Wenden Sie alle drei an und die Trefferquote steigt in einen brauchbaren Bereich. Überspringen Sie sie und Sie handeln Rauschen.

**Welcher Indikator liefert die besten Divergenz-Signale?**
Es gibt keinen einzigen besten Indikator. MACD-Divergenz hat mehr Struktur (das Histogramm verstärkt die Diskrepanz); RSI-Divergenz ist sauberer an Extremen (>70 / <30); KDJ-Divergenz ist in der A-Aktien-Retail-Community am beliebtesten. Das PickSkill-Divergenz-Dashboard scannt alle drei, sodass Sie vergleichen können. In der Praxis ist Divergenz, die in *zwei von drei* Oszillatoren gleichzeitig auftritt, materiell zuverlässiger als Divergenz in nur einem allein.

**Warum wird versteckte Divergenz in den meisten Trading-Büchern nicht behandelt?**
Zwei Gründe: (1) sie ist mathematisch das schwerer zu erkennende Muster (die Pivots invertieren), und (2) Trendfortsetzungs-Muster sind narrativ weniger befriedigend als Umkehr-Muster („den Boden erwischen" verkauft mehr Bücher als „den Rücksetzer kaufen"). Die Daten legen das Gegenteil nahe: Versteckte Divergenz in bestätigten Trends ist das Setup mit der höheren Edge. Das PickSkill *Top-Divergenz*-Dashboard beschriftet versteckte Varianten explizit, damit sie die Aufmerksamkeit bekommen, die sie verdienen.

**Kann ich Optionen auf ein Divergenz-Signal handeln?**
Sie können, aber Timing zählt. Die Divergenz ist eine *Bedingung*; Sie brauchen einen *Trigger* (Kreuz, Bruch, Bestätigung). Lang laufende Calls auf Divergenz ohne Trigger zu kaufen zahlt Zeitverfall, während Sie warten. Die sauberere Struktur ist, auf das Triggerereignis zu warten und sich dann mit angemessener Größe in der Bewegung zu positionieren. Für eine Diskussion, wie man Divergenz mit anderen Signalen kombiniert, bevor man eine Option dimensioniert, siehe [Drei-Indikator-Filter](/blog/three-indicator-filter).

**Was ist der Unterschied zwischen Divergenz und Konvergenz?**
Konvergenz ist das Fehlen von Divergenz — Kurs und Indikator bewegen sich gemeinsam. In einigen Literaturstellen wird „Konvergenz" verwendet, um den Moment zu beschreiben, in dem sich eine Divergenz auflöst (Kurs holt zum Indikator auf oder umgekehrt); in anderen bedeutet es einfach Ausrichtung. Die terminologische Mehrdeutigkeit ist nicht hilfreich — der moderne Gebrauch verwendet „Divergenz" als Muster und „Konvergenz" als Auflösung.
