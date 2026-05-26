---
title: Wie man bullische Divergenzen in einem Portfolio in 30 Sekunden findet
description: >-
  Das PickSkill-Divergenz-Dashboard scannt jede Position nach den 4
  Divergenztypen über MACD, RSI und KDJ — und zeigt nur gut definierte Pivots.
  Workflow in 4 Schritten.
publishedAt: 2026-05-25T00:00:00.000Z
updatedAt: 2026-05-25T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    Das PickSkill-Research-Team — wir bauen einen AI-Analysten für
    Privatanleger.
pillar: how-to
tags:
  - Tutorial
  - Divergenz
  - Technische Analyse
  - Workflow
  - Portfolio
heroImage: /blog/find-bullish-divergences/hero.png
heroAlt: >-
  Editorial-Infografik — ein Divergenz-Dashboard, das Tickers mit Divergenztyp
  (regular/hidden bullish/bearish), Mehr-Oszillator-Übereinstimmung und
  Pivot-Frische auflistet.
---

**Divergenz von Hand zu finden ist langsam — Sie zeichnen Pivots im Kurs, zeichnen entsprechende Pivots im MACD oder RSI, prüfen, ob die beiden sich uneinig sind, und wiederholen das für jeden Wert in Ihrem Portfolio.** Die meisten Privatanleger geben nach 3–5 Werten auf. PickSkills Divergenz-Dashboard läuft diesen Scan über jede Position in 30 Sekunden, wendet bestätigte-Pivot-Regeln an (kein Hindsight-Bias) und zeigt nur die Werte, bei denen das Muster gut definiert ist. Dieses Tutorial führt durch das produktive Nutzen des Dashboards — nicht nur durchklicken, sondern die Ausgabe in tatsächliche Entscheidungen verwandeln.

### Kernaussagen

- **4 Schritte, ~30 Sekunden.** Divergenz-Dashboard öffnen, aktive Liste scannen, in Kandidaten eintauchen, zusätzliche Filter vor dem Handeln schichten.
- **Das Dashboard scannt 4 Divergenztypen über 3 Oszillatoren** — reguläre bullische / bärische und versteckte bullische / bärische über [MACD](/blog/what-is-macd), [RSI](/blog/what-is-rsi) und [KDJ](/blog/what-is-kdj).
- **Nur bestätigte Pivots zählen.** Ein Pivot braucht mindestens N Bars auf jeder Seite, die ihn nicht übertreffen — kein Hindsight-Bias durch nachträgliches Linienzeichnen.
- **Multi-Oszillator-Divergenz ist die Variante mit der höchsten Edge.** Wenn dieselbe Divergenz in zwei von drei Oszillatoren auftaucht, ist das Signal materiell zuverlässiger als Divergenz in einem allein.
- **Versteckte Divergenz wird als erstklassiges Signal behandelt** — die meisten Retail-Plattformen vergraben sie; PickSkill bringt sie explizit ans Licht.

## Warum dieser Workflow wichtig ist

Divergenz ist eines der am meisten überversprochenen Werkzeuge in der technischen Analyse. Retail-Leitfäden behaupten routinemäßig 70%+ Genauigkeit; Backtests bei nackter Divergenz liegen näher an 35–45%. Die Lücke ist das Filtern — Divergenz ist eine *Bedingung*, kein *Signal*, und wird erst zuverlässig, wenn sie mit Trendfiltern und Bestätigungsereignissen geschichtet wird.

Der dashboardbasierte Workflow macht das Filtern praktikabel. Ohne ein Werkzeug, das alle Divergenzen über alle Positionen gleichzeitig anzeigt, können Sie den Multi-Oszillator-Filter nicht anwenden (der das Prüfen dreier Oszillatoren bei jedem Wert erfordert). Mit dem Werkzeug dauert der Filter einen Klick. Die Ökonomie des geschichteten Filterns kippt zu Ihren Gunsten.

Für das zugrunde liegende Konzept siehe [Was ist Divergenz?](/blog/what-is-divergence).

## Der 4-Schritte-Workflow

### Schritt 1 — Das Divergenz-Dashboard öffnen

Gehen Sie zu [/indicators](/indicators) und wählen Sie die Divergenz-Dimension. Das Dashboard scannt jede Position in Ihrem Default-Portfolio über die vier Divergenztypen in MACD, RSI und KDJ.

Die Ausgabe ist eine sortierbare Tabelle:

| Spalte | Bedeutung |
|---|---|
| Ticker | Die Position |
| Typ | Reguläre bullische / reguläre bärische / versteckte bullische / versteckte bärische |
| Oszillator(en) | Welche(r) Indikator(en) zeigen die Divergenz — MACD, RSI, KDJ oder eine Kombination |
| Pivot-Alter | Vor wie vielen Bars sich der zweite Pivot gebildet hat (neuer = frischeres Signal) |
| Stärke | Größe der Diskrepanz (größer = stärkeres Signal) |
| Trendregime | [ADX](/blog/what-is-adx)-Wert zum Zeitpunkt der Divergenz — Divergenz in trendenden Märkten ist zuverlässiger |

Die Standardsortierung ist nach *kombinierter Stärke × Frische × Multi-Oszillator-Übereinstimmung*. Die stärksten Signale erscheinen ganz oben.

### Schritt 2 — Scannen nach Mustern hoher Überzeugung

Drei spezifische Muster, nach denen Ausschau zu halten ist, in der Reihenfolge der Edge:

1. **Multi-Oszillator-reguläre bullische in überverkauften Werten.** Reguläre bullische Divergenz in zwei von drei Oszillatoren (z.B. MACD + RSI), bei einem Wert, bei dem RSI unter 35 oder KDJ unter 25 liegt, in einem Marktregime mit ADX über 25. Diese Kombination hat historisch die stärksten Forward-Renditen aller Divergenz-Muster geliefert.
2. **Versteckte bullische in bestätigten Aufwärtstrends.** Versteckte bullische Divergenz bei einem Wert, der über seinem 200-Tage-SMA liegt, wobei der 200-Tage noch steigt. Das versteckte bullische Muster fängt Trendwiederaufnahme nach einem Rücksetzer ein — statistisch zuverlässiger als Umkehrungen einzufangen.
3. **Multi-Oszillator-reguläre bärische in überkauften Werten.** Das Spiegelbild von Muster 1, verwendet fürs Risikomanagement (Trimmen von Long-Exposure) statt fürs Shorten. Eine bärische Divergenz früh in den eigenen Positionen zu erkennen ist eine der hebelträchtigsten Anwendungen des Dashboards.

Überspringen:

- **Einzel-Oszillator-Divergenz bei Werten mit [ADX](/blog/what-is-adx) unter 20.** Seitwärts laufende Märkte erzeugen kontinuierliche niedrigwertige Divergenzen. Das Dashboard zeigt sie an; ignorieren Sie sie.
- **Divergenz mit Pivot-Alter > 10 Bars.** Ältere Pivots sind eingepreist. Divergenz-Signale verfallen schnell — frische Signale (Pivot-Alter 1–5 Bars) sind, wo die Alpha sitzt.

### Schritt 3 — In den Kandidaten eintauchen

Klicken Sie einen Wert im Dashboard, um das Pro-Position-Indikator-Detail zu öffnen. Sie sollten verifizieren:

1. **Die Pivots sind real.** Schauen Sie auf den Chart und bestätigen Sie die beiden Pivots im Kurs und die beiden entsprechenden Pivots im Oszillator. PickSkills Pivot-Erkennung ist automatisiert, aber der Augen-Check fängt Sonderfälle ab (Gap-Tage, Limit-up-Bars bei A-Aktien, Earnings-Tag-Spitzen).
2. **Das Trendregime stimmt.** [ADX](/blog/what-is-adx) über 25, MA-Stack ausgerichtet, [Unterstützung / Widerstand](/blog/what-is-support-resistance)-Niveau in der Nähe. Divergenz an einem wichtigen Unterstützungs-Niveau ist materiell stärker als Divergenz mitten in einer Range.
3. **Volumen bestätigt.** [Geldfluss](/blog/what-is-capital-flow) trendet nach oben, während der Kurs seitwärts mahlt, ist die richtige Kulisse für bullische Divergenz; Flow trendet nach unten bei Kurshochs ist die richtige Kulisse für bärische Divergenz.

Diese Checks dauern etwa 30 Sekunden je Kandidat. Danach sinkt die Fehlsignalrate substanziell.

### Schritt 4 — Einen weiteren Filter vor dem Handeln schichten

Eine Divergenz ist ein *Watchlist-Trigger*, kein Einstiegs-Trigger. Warten Sie auf ein bestätigendes Ereignis, bevor Sie Größe aufbauen:

- **Bullische Divergenz**: Warten Sie darauf, dass die MACD-Linie die Signallinie nach oben kreuzt, oder RSI 50 von unten kreuzt, oder der Kurs über ein jüngstes Schwunghoch ausbricht.
- **Bärische Divergenz**: Warten Sie darauf, dass die MACD-Linie die Signallinie nach unten kreuzt, oder RSI 50 von oben kreuzt, oder der Kurs unter ein jüngstes Schwungtief bricht.

Das bestätigende Ereignis sagt Ihnen, *wann* die Bewegung beginnt. Ohne es kaufen oder verkaufen Sie in eine Bedingung, die wochenlang anhalten kann.

> **Jetzt ausprobieren.** [/indicators öffnen](/indicators) und die Divergenz-Ansicht wählen. Selbst bei einem 5-Werte-Portfolio sehen Sie wahrscheinlich mindestens eine aktive Divergenz pro Woche — das Volumen an Gelegenheiten ist höher, als die meisten Privatanleger erkennen, sobald der Scan automatisiert ist.

## Was das Dashboard fängt, das Hand-Scanning verpasst

Drei spezifische Muster profitieren dramatisch von der Automatisierung:

### 1. Versteckte Divergenz

Die meisten Retail-Charting-Plattformen vergraben versteckte Divergenz — die Pivot-Inversion ist mit dem Auge schwerer zu erkennen, und die meisten TA-Leitfäden konzentrieren sich auf reguläre Divergenz. PickSkill behandelt versteckte Divergenz als erstklassiges Signal, mit derselben Prominenz wie reguläre Divergenz angezeigt. Angesichts der besseren empirischen Bilanz der versteckten Divergenz für Trendfortsetzung ist das die Variante, der Sie *mehr* Aufmerksamkeit schenken sollten, nicht weniger.

### 2. Multi-Oszillator-Übereinstimmung

Hand-Scanning fängt selten Divergenz in zwei Oszillatoren gleichzeitig — Sie müssten MACD, dann RSI, dann KDJ bei jedem Wert prüfen, und der kognitive Aufwand bedeutet, dass Sie bei der ersten Divergenz aufhören, die Sie sehen. Das Dashboard zeigt Multi-Oszillator-Divergenz als distinkte Zeile an, sodass die Variante mit der höchsten Edge auf einen Blick sichtbar ist.

### 3. Portfolio-übergreifender Sweep

Hand-Scanning funktioniert bei 1–3 Werten. PickSkills Dashboard scannt Ihr gesamtes Portfolio (und auf Anfrage alle Ihre Watchlists) in derselben Ansicht. Der Sweep fängt Signale bei Werten ein, die Sie nicht prüfen würden — die Gelegenheiten, die Sie bei Werten finden, die Sie schon aufgegeben hatten.

## Vier Fallstricke beim Verwenden des Divergenz-Dashboards

1. **Divergenz als Kauf- / Verkaufsknopf behandeln.** Sie ist eine Bedingung. Warten Sie immer auf ein bestätigendes Ereignis ([MACD](/blog/what-is-macd)-Kreuz, [RSI](/blog/what-is-rsi)-Ausstieg aus dem Extrem, Niveau-Bruch), bevor Sie Größe aufbauen.
2. **Auf jede Divergenz reagieren, die das Dashboard zeigt.** Das Dashboard zeigt absichtlich alle Kandidaten an, einschließlich schwacher. Filtern Sie nach Trendregime (ADX > 25), Multi-Oszillator-Übereinstimmung, frischen Pivots und Überverkauft- / Überkauft-Bestätigung, bevor Sie handeln.
3. **Durch Invalidierung halten.** Divergenz-Trades haben spezifische Invalidierungsniveaus — wenn der Kurs das Schwungtief bricht, das den bullischen-Divergenz-Pivot definierte, ist der Trade falsch. Respektieren Sie die Invalidierung; mitteln Sie nicht nach.
4. **Positionsgrößen vergessen.** Selbst Divergenzen mit hoher Überzeugung scheitern in bedeutsamen Raten. Dimensionieren Sie Positionen so, dass sie die Versagensfälle überleben — dimensionieren Sie nie, als wäre die Divergenz eine Gewissheit.

## Wie sich Divergenz auf A-Aktien verhält

Das Dashboard behandelt die A-Aktien-Mikrostruktur speziell:

- **Limit-up- / Limit-down-Tage** sind als Ausreißer markiert und von der Pivot-Erkennung ausgeschlossen. Ohne diesen Filter wird der Limit-Preis zu einem künstlichen Pivot, der falsche Divergenz produziert.
- **Handelsstopps** schaffen Lücken in den Daten; Pivots, die einen Stopp überspannen, werden als verdächtig markiert und mit einer Warnung angezeigt.
- **Höherer Rauschboden**: A-Aktien handeln mit materiell höherer Tagesvolatilität. Das Dashboard verwendet ein größeres Pivot-Erkennungs-Fenster (N=5 statt N=3 auf US-Tagesbars) für A-Aktien-Werte, um Mikroschwünge herauszufiltern.

Für mehr zur marktweisen Behandlung siehe [Beste Indikatoren für A-Aktien](/blog/best-indicators-for-a-shares).

## Häufige Follow-up-Workflows

Sobald Sie einen Kandidaten aus dem Divergenz-Dashboard haben, sind das die natürlichen nächsten Schritte:

- *„Zeig mir dieselbe Divergenzerkennung auf meiner vollständigen Watchlist, nicht nur auf dem aktuellen Portfolio."*
- *„Filtere die aktiven Divergenzen auf nur diejenigen mit ADX über 25 und steigendem 200-Tage-MA."*
- *„Backteste dieses Divergenz-Muster — wie ist die historische Trefferquote bei diesem spezifischen Ticker über die letzten 5 Jahre?"*
- *„Erzeuge einen Einstiegsplan für den Top-Divergenz-Kandidaten — Einstiegspreis, Stop-Level, Ziel, Positionsgröße."*
- *„Erstelle eine Watchlist jeder Position, die seit mehr als 5 Tagen in aktiver Divergenz ohne Auflösung ist — das sind die am längsten coilenden Setups."*

## Weiterführende Literatur

- [Was ist Divergenz?](/blog/what-is-divergence) — das zugrunde liegende Konzept und die vier Typen.
- [Der 3-Indikator-Filter](/blog/three-indicator-filter) — Divergenz mit [ADX](/blog/what-is-adx) und Momentum-Bestätigung kombinieren.
- [Constance Brown, *Technical Analysis for the Trading Professional*](https://www.amazon.com/dp/0071596666) — Praktiker-Referenz zu Divergenz-Mustern.

## FAQ

**Wie oft wird das Dashboard eine Divergenz zeigen?**
Bei einem 10-Werte-Portfolio sehen Sie in einer typischen Woche 2–5 aktive Divergenzen. Multi-Oszillator-Divergenz (die Variante mit der höheren Edge) ist seltener — vielleicht eine pro Woche pro 10 Positionen. Versteckte Divergenz erscheint in klar trendenden Märkten häufiger und in volatilen Märkten seltener.

**Sollte ich jede Divergenz als Trade nehmen?**
Nein. Das Dashboard zeigt *Kandidaten*; das Filtern geschieht danach. Schichten Sie Trendregime, Multi-Oszillator-Übereinstimmung, frische Pivots und bestätigende Ereignisse, bevor Sie handeln. Das Filtern reduziert die Zahl der Trades um 60–80%, hebt aber die Edge je Trade substanziell an.

**Was ist der Unterschied zwischen regulärer und versteckter Divergenz?**
Reguläre Divergenz ist eine Umkehr-Warnung (Kurs bildet ein neues Extrem; der Indikator nicht). Versteckte Divergenz ist ein Fortsetzungssignal (Kurs bildet ein höheres Tief in einem Aufwärtstrend; der Indikator bildet ein tieferes Tief). Die beiden Muster sind mathematisch symmetrisch, haben aber entgegengesetzte Implikationen. Versteckte Divergenz hat die bessere empirische Bilanz in trendenden Märkten.

**Warum zeigt das Dashboard manchmal Divergenz bei Werten, die sich nicht bewegen?**
Divergenz ist eine *Bedingung*, keine Bewegungsgarantie. Viele Divergenzen lösen sich durch langsamen Drift statt scharfer Umkehr. Das Dashboard zeigt die Bedingung; ob die Bewegung Materialität gewinnt, hängt davon ab, ob das bestätigende Ereignis eintrifft. Deshalb zählt die Disziplin des Wartens auf Bestätigung mehr als die Disziplin des Erkennens der Divergenz.

**Kann ich E-Mail-Alerts bekommen, wenn sich eine neue Divergenz in meinem Portfolio bildet?**
Die Funktion „Geplante Workflows" (in Design, siehe das [Workflows-Designdokument](/blog)) wird das unterstützen — tägliche oder stündliche Scans, die Ihnen E-Mails senden, wenn neue Divergenzen auftauchen. Für jetzt ist das Dashboard On-Demand: Öffnen Sie es, wenn Sie den Scan möchten, und Sie erhalten den aktuellen Zustand.
