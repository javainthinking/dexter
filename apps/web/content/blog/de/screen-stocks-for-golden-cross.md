---
title: Wie man Aktien in 60 Sekunden nach einem Goldenen Kreuz screent
description: >-
  Finden Sie jede Aktie in Ihrer Watchlist mit einem frischen 50/200-MA-Kreuz —
  und die Underwater-Variante mit der höheren Edge. Workflow in 4 Schritten mit
  PickSkill.
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
  - Goldenes Kreuz
  - Gleitender Durchschnitt
  - Screening
  - Workflow
heroImage: /blog/screen-stocks-for-golden-cross/hero.png
heroAlt: >-
  Editorial-Infografik — eine Screener-Tabelle, die Tickers mit ihrem aktuellen
  Kreuz-Status (UNDERWATER / standard / DEATH) und Volumenbestätigung auflistet.
---

**Ein Goldenes Kreuz ist der 50-Tage-gleitende-Durchschnitt, der den 200-Tage-gleitenden-Durchschnitt von unten kreuzt — eines der meistbeobachteten technischen Ereignisse in Aktien.** Ein Portfolio oder eine Watchlist von Hand nach frischen Kreuzen zu scannen bedeutet, jeden Wert auf seinem Chart zu prüfen, was schlecht skaliert. PickSkills MA-Dashboard läuft den Scan automatisch und zeigt sowohl das Standard-Goldene-Kreuz als auch die *Underwater*-Variante mit der höheren Edge, bei der der 200-Tage zum Zeitpunkt des Kreuzes noch fällt. Dieses Tutorial führt durch das Verwenden des Screeners als Teil eines realen Workflows — nicht nur Kreuze erkennen, sondern auf sie mit den richtigen Filtern reagieren.

### Kernaussagen

- **4 Schritte, ~60 Sekunden.** MA-Dashboard öffnen, frische Kreuze identifizieren, nach Underwater-Zustand filtern, Bestätigung vor dem Handeln schichten.
- **Die Underwater-Variante hat historisch stärkere Forward-Renditen produziert** als das Standardkreuz — sie fängt Regimewechsel statt Fortsetzung ein.
- **Multi-Filter-Screening reduziert Rauschen**: frisches Kreuz + Steigung + Volumenbestätigung + [Unterstützungs- / Widerstands](/blog/what-is-support-resistance)-Kontext.
- **Funktioniert mit US-, HK- und A-Aktien-Werten** mit angemessener marktspezifischer Kreuz-Behandlung (Limit-Tag-Ausschluss für A-Aktien).
- **Passt natürlich zum [/portfolios](/portfolios)-Workflow** — scannen Sie Ihre bestehende Watchlist oder bauen Sie eine aus der Screener-Ausgabe.

## Warum dieser Workflow wichtig ist

Das nackte 50/200-Kreuz hat dünne eigenständige Edge — historische Trefferquoten liegen nahe der unkonditionalen Marktrendite. Der Grund, warum Trader es trotzdem beobachten, ist, dass die *Underwater*-Variante — frisches Kreuz mit dem 200-Tage noch fallend — materiell bessere Forward-Renditen hat. Ohne ein Werkzeug, das die beiden Varianten trennt, behandeln Privatanleger jedes Kreuz identisch und verpassen die Untermenge mit der höheren Edge.

Der andere Grund, warum Hand-Screening scheitert: Das Kreuz ist ein Moment-in-der-Zeit-Ereignis. Bis Sie es per Schlagzeile bemerken („S&P 500 bestätigt Goldenes Kreuz"), ist es seit zwei Wochen eingepreist. Das Kreuz innerhalb von 1–3 Bars des Ereignisses zu erwischen zählt; das über eine 20-Werte-Watchlist hinweg zu tun erfordert Automatisierung.

Für das zugrunde liegende Konzept siehe [Was ist ein Goldenes Kreuz (und Todeskreuz)?](/blog/what-is-golden-cross-death-cross).

## Der 4-Schritte-Workflow

### Schritt 1 — Das MA-Dashboard öffnen

Gehen Sie zu [/indicators](/indicators) und wählen Sie die Moving-Average-Dimension. Das Dashboard zeigt den aktuellen 50/200-Kreuz-Status jeder Position, plus die Steigung des langen MA, und markiert frische Kreuze (innerhalb der letzten 5 Bars).

Die Ansicht ist sortierbar nach:

| Sortierung | Verwendung |
|---|---|
| **Kreuz-Frische** | Neueste Kreuze oben — am handelnswertesten |
| **Underwater-Flag** | Underwater-Kreuze priorisiert — Variante mit höherer Edge |
| **Trendstärke** | Paart mit [ADX](/blog/what-is-adx)-Wert |
| **Volumenbestätigung** | Kreuze mit Volumen über 1,5× des 20-Tage-Durchschnitts — bessere Folgebewegung |

Die Standardsortierung priorisiert frische Underwater-Kreuze mit Volumenbestätigung — d.h. die Variante mit der höchsten Edge.

### Schritt 2 — Frische Kreuze identifizieren

Drei Zustände, die das Dashboard für jede Position zeigen kann:

| Zustand | Was es bedeutet |
|---|---|
| **Standard-Goldenes-Kreuz (Aufwärtstrend bereits aufwärts)** | 50 über 200; 200 steigend. Trendfortsetzung. |
| **Underwater-Goldenes-Kreuz** | 50 über 200; 200 noch fallend. Regimewechsel-Kandidat — die seltenere Variante mit höherer Edge. |
| **Bärisches (Todes-)Kreuz oder Vor-Kreuz** | 50 unter 200, oder 50 und 200 nahe einem bärischen Kreuz. Risk-off-Signal. |

Fokussieren Sie sich auf den Underwater-Zustand. Über große Indizes hinweg treten Underwater-Goldene-Kreuze 2–4 mal pro Jahrzehnt auf und markieren tendenziell das Ende bedeutsamer Drawdowns. Bei Einzelwerten treten sie häufiger auf, repräsentieren aber dennoch das strukturell hochwertigere Setup.

Für die Zwecke des Dashboards bedeutet „frisch", dass das Kreuz innerhalb der letzten 5 Handelsbars geschah. Ältere Kreuze sind eingepreist.

### Schritt 3 — Zusätzliche Filter schichten

Ein frisches Kreuz allein ist ein Ausgangspunkt, kein Einstiegs-Trigger. Wenden Sie diese Filter in Reihenfolge an:

1. **Volumenbestätigung.** Das Volumen des Kreuz-Tags sollte mindestens 1,5× des 20-Tage-Durchschnitts betragen. Kreuze auf geringem Volumen scheitern in signifikant höheren Raten als Kreuze auf hohem Volumen. Siehe [Volumenanalyse](/blog/what-is-volume-analysis) für den breiteren Kontext.
2. **Geldfluss-Ausrichtung.** [Geldfluss](/blog/what-is-capital-flow) (MFI, CMF, OBV) sollte parallel zum Kreuz nach oben tendieren. Kreuze auf fallendem Flow sind wahrscheinlicher Fehlsignale.
3. **Unterstützungs-Niveau-Nähe.** Ein Kreuz, das in der Nähe eines bedeutsamen [Unterstützungs-Niveaus](/blog/what-is-support-resistance) auftritt, ist strukturell stärker als eines, das im freien Raum geschieht — das Niveau liefert einen natürlichen Risikomanagement-Anker.
4. **Kein widersprüchliches Momentum-Signal.** [RSI](/blog/what-is-rsi) sollte zum Zeitpunkt des Kreuzes nicht tief im überkauften Bereich liegen (>75) — ein Kreuz in unmittelbar überkauft ist oft eine Fortsetzungs-Spitze, keine frische Einstiegsgelegenheit.

Wenden Sie alle vier Filter an und die Zahl handelnswerter Kreuze sinkt um 70–80%. Die verbleibenden Kandidaten haben materiell bessere Forward-Rendite-Profile.

### Schritt 4 — Einen Einstiegsplan erzeugen

Sobald ein Kandidat die Filter besteht, verwenden Sie PickSkills Chat, um einen strukturierten Einstiegsplan zu erzeugen:

```text
Für [Ticker], erzeuge einen Einstiegsplan rund um das frische Goldene Kreuz:
- Vorgeschlagener Einstiegspreis (aktuell vs. Rücksetzer zum 50-Tage-MA)
- Stop-Level (unter dem jüngsten Schwungtief oder dem 200-Tage-MA, was niedriger ist)
- Erstes Ziel (das nächste Widerstands-Niveau)
- Positionsgrößenbestimmung basierend auf 1% Portfolio-Risiko je Trade
```

PickSkill liefert einen strukturierten Plan mit gequellten Niveaus, Ziel-Begründung und einer Größen-Formel. Sie können Annahmen im Chat anpassen und neu laufen lassen.

> **Jetzt ausprobieren.** [/indicators öffnen](/indicators), die MA-Ansicht wählen und nach Underwater + Frische sortieren. Selbst bei einem kleinen Portfolio sehen Sie wahrscheinlich 1–2 frische Underwater-Kandidaten pro Quartal — das Volumen hochqualitativer Gelegenheiten ist höher, als die meisten Privatanleger erwarten, sobald das Screening automatisiert ist.

## Was das Dashboard fängt, das Hand-Screening verpasst

### 1. Die Underwater-Unterscheidung

Hand-Chart-Inspektion behandelt jedes Goldene Kreuz identisch. Das Dashboard unterscheidet das Standardkreuz (Trendfortsetzung) vom Underwater-Kreuz (Regimewechsel). Letzteres ist selten und strukturell höher in der Edge — Automatisierung bringt es explizit ans Licht.

### 2. Simultanes Scannen mehrerer Werte

Hand-Screening funktioniert für einige Werte; das Dashboard scannt ein 20+-Werte-Portfolio in Sekunden. Die Breite fängt Setups ein, die Sie nicht prüfen würden — insbesondere bei Werten, die Sie schon aufgegeben oder seit Wochen nicht besucht hatten.

### 3. Sub-5-Bar-Frische

Das 50/200-Kreuz ist innerhalb von 1–3 Bars des Ereignisses am handelnswertesten. Hand-Inspektion erwischt das Kreuz oft 1–2 Wochen zu spät, bis dahin ist der einfache Teil der Bewegung bereits geschehen. Das Dashboard zeigt frische Kreuze in dem Moment, in dem sie drucken.

## Vier Fallstricke beim Verwenden des Screeners

1. **Auf das Kreuz allein reagieren, ohne Filter.** Das nackte Kreuz liegt nahe an einem Münzwurf. Ohne Volumenbestätigung, Trendregime-Check und Niveau-Nähe handeln Sie Rauschen.
2. **Die Underwater-Unterscheidung ignorieren.** Ein Standard-Goldenes-Kreuz in einem bestehenden Aufwärtstrend ist die hochvolumige, niedrig-Edge-Variante. Das Underwater-Kreuz ist die seltene, höher-Edge-Variante. Verwechseln Sie sie nicht.
3. **Den Kreuz-Tag jagen.** Der sauberste Einstieg ist oft ein *Rücksetzer* zum 50-Tage-MA, nachdem das Kreuz bestätigt wurde, nicht im Moment des Druckens des Kreuzes zu kaufen. Der erste Rücksetzer zum Kreuz-Niveau ist der Einstiegspunkt mit der höchsten Edge bei einem typischen erfolgreichen Kreuz.
4. **Keine Invalidierungs-Disziplin.** Definieren Sie das Stop-Level *vor* dem Einstieg — das jüngste Schwungtief oder der 200-Tage-MA, was niedriger ist. Wenn der Kurs den Stop erreicht, ist der Trade falsch; schließen Sie ihn. Das Kreuz ist ein probabilistisches Signal, keine Gewissheit.

## Wie sich Kreuze auf A-Aktien anders verhalten

A-Aktien-Mikrostruktur ändert die Screening-Kriterien:

- **Kultureller Schwerpunkt auf 20/60.** Die A-Aktien-Retail-Community beobachtet das 20/60-Kreuz enger als das 50/200. Das Dashboard zeigt beide; bei A-Aktien-Werten gewichten Sie das 20/60-Kreuz schwerer als Koordinationssignal.
- **Limit-Tag-Ausschluss.** Limit-up- und Limit-down-Bars schaffen Stufenmuster in beiden MAs. PickSkill markiert diese Bars als Ausreißer in der Kreuz-Erkennung — ohne diesen Filter würden aufeinanderfolgende Limit-Tage falsche frische-Kreuz-Signale produzieren.
- **Stopp-Behandlung.** Wenn eine Aktie tagelang gestoppt ist und dann wieder aufgenommen wird, startet der MA-Stack praktisch neu. Kreuze, die innerhalb von 10 Bars nach einer Stopp-Wiederaufnahme auftreten, sollten mit Vorsicht behandelt werden.

Siehe [Beste Indikatoren für A-Aktien](/blog/best-indicators-for-a-shares) für das breitere Playbook und [MACD bei A-Aktien vs US-Aktien](/blog/macd-on-a-shares-vs-us) für den marktübergreifenden Vergleich.

## Häufige Follow-up-Workflows

Sobald Sie einen Kandidaten aus dem Kreuz-Screener haben, sind das natürliche nächste Schritte:

- *„Für jeden Wert mit einem frischen Underwater-Goldenen-Kreuz, prüfe, ob MACD ebenfalls in einem bullischen Zustand ist, und zeige nur die Werte mit ausgerichteten Signalen."*
- *„Erzeuge eine Watchlist jeder Aktie im S&P 500, die derzeit innerhalb von 2 Bars eines Underwater-Goldenen-Kreuzes ist."*
- *„Backteste das 50/200-Underwater-Kreuz bei diesem spezifischen Ticker über die letzten 10 Jahre — Trefferquote, durchschnittliche Rendite, Zeit zum Ziel."*
- *„Baue ein Portfolio aus den Top-10-Underwater-Kreuz-Kandidaten gleichgewichtet, mit einem automatisierten Stop am 200-Tage-MA."*
- *„Vergleich das aktuelle Kreuz dieses Tickers mit seinem vorherigen Goldenen Kreuz vor 2 Jahren — war jenes Underwater, und was passierte danach?"*

## Weiterführende Literatur

- [Was ist ein Goldenes Kreuz (und Todeskreuz)?](/blog/what-is-golden-cross-death-cross) — das zugrunde liegende Konzept und die Underwater-Variante.
- [Was ist ein gleitender Durchschnitt?](/blog/what-is-ma) — die Grundlage des Kreuz-Signals.
- [Meb Faber, *A Quantitative Approach to Tactical Asset Allocation*](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=962461) — akademische Stützung für einfache MA-Kreuz-Regeln.

## FAQ

**Wie oft treten Underwater-Goldene-Kreuze auf?**
Bei großen Indizes 2–4 mal pro Jahrzehnt — üblicherweise am Ende bedeutsamer Drawdowns. Bei Einzelaktien häufiger (einige pro Jahr in einer 20-Werte-Watchlist). Die Seltenheit des Index-Level-Signals ist Teil dessen, was das Einzel-Wert-Signal wertvoll macht: Wenn eine einzelne Aktie in Abwesenheit eines Indexsignals eines druckt, ist die Bewegung wertspezifisch und nicht marktweit.

**Ist das Standard-Goldene-Kreuz wertlos?**
Nicht wertlos, aber niedrig in der Edge. Das Standardkreuz (in einem bestehenden Aufwärtstrend) fungiert mehr als „Trend ist intakt"-Filter denn als Einstiegssignal. Verwenden Sie es als portfolioweites Regime-Check („mehr meiner Positionen sind über dem 200-Tage-SMA als darunter") statt als Einzel-Wert-Trigger.

**Warum ist die Underwater-Variante besser?**
Zwei Gründe. (1) Sie fängt *Regimewechsel* statt Fortsetzung ein — historisch das Setup mit höherer Edge. (2) Sie ist seltener, was bedeutet, dass sie weniger unter Über-Handeln leidet. Diskretionäre Anleger, die jedes Standardkreuz handeln, fahren eine hochrotierende, niedrig-Edge-Strategie; Anleger, die auf Underwater-Kreuze warten, fahren eine niedrigerrotierende, höher-Edge-Strategie.

**Kann ich Optionen auf ein Goldenes Kreuz handeln?**
Sie können, aber Timing zählt. Implizite Volatilität rund um das Kreuz preist oft ein gewisses Maß an Trenderkennung ein. Die sauberere Struktur ist, sich *vor* dem Kreuz zu positionieren — mit dem Underwater-Setup als Watchlist-Trigger, plus einem überverkauften RSI-Wert und einem Kursniveau-Bruch als Einstiegs-Trigger. Calls *am* Kreuz zu kaufen zahlt oft eine Prämie für die Schlagzeile.

**Welchen Zeitrahmen verwendet der Screener?**
Tagesbars standardmäßig — passend zur Standardkonvention für das 50/200-Kreuz. Wöchentliches Kreuz-Screening (50-Wochen vs. 200-Wochen MA) ist per Chat-Prompt verfügbar — nützlich für sehr langfristiges Positionieren, aber weniger handelnswert. Intraday-Kreuz-Screening wird nicht angezeigt, weil das Signal auf kurzen Zeitrahmen stark degradiert.
