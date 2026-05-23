---
title: Wie man jedes 10-K in 60 Sekunden mit PickSkill zusammenfasst
description: Einen Prompt einfügen → MD&A-Highlights, FCF, Nettoverschuldung, Segmentwachstum, YoY-Risiko-Diff, Fußnoten — jede Aussage mit EDGAR-Quelle verlinkt.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: Das PickSkill-Research-Team — wir bauen einen AI-Analysten für Privatanleger.
pillar: how-to
tags:
  - tutorial
  - 10-k
  - filings
  - workflow
heroImage: /blog/summarise-a-10k-in-60-seconds/hero.png
heroAlt: Infografik, die das Lesen eines 10-K von Hand (30 Min) mit PickSkill (60 Sek) vergleicht
---

Der [10-K-Leseleitfaden](/blog/how-to-read-10k) zeigt die vier Sektionen des Jahresberichts, die wirklich zählen (Items 7, 8, 1A und die daraus folgenden Anhänge). Das ist eine 30-Minuten-Übung in Eigenregie. Dieses Tutorial durchläuft denselben Workflow in 60 Sekunden mit PickSkill — MD&A-Highlights, die drei wichtigen Zahlen aus dem Abschluss, ein Diff der Risikofaktoren gegen das Vorjahres-Filing und eine Liste von Anhängen, die nachzuverfolgen sind. Jede Behauptung ist mit der Seite des Quell-Filings verlinkt.

### Kernaussagen

- **Vier Schritte, ~60 Sekunden.** Chat öffnen, Prompt einfügen, 90-Sekunden-Walkthrough erhalten, Follow-ups stellen.
- **MD&A in klarer Sprache.** Nicht die Paraphrase des Unternehmens — PickSkill extrahiert den substanziellen operativen Kommentar.
- **Drei Finanzzahlen** automatisch: [FCF](/blog/what-is-fcf), Nettoverschuldung, segmentweise YoY-Umsatzwachstum.
- **Risikofaktor-Diff** gegen das Vorjahres-10-K — nur neue oder wesentlich geänderte Sprache wird hervorgehoben, unverändertes Boilerplate unterdrückt.
- **Mit Quelllinks.** Jede Behauptung und jede Zahl einen Klick vom Originalfiling auf SEC EDGAR entfernt.

## Warum das wichtig ist

Ein Privatanleger, der tatsächlich 10-Ks liest, gewinnt einen bedeutsamen Vorteil gegenüber dem, der nur Earnings-Pressemitteilungen liest — aber ein 200-Seiten-Filing zu lesen ist echtes Zeitinvestment, und die wichtigen Teile sind übers Dokument verstreut. Dieses Tutorial entfernt die Suchphase.

## Der 4-Schritte-Workflow

### Schritt 1 — Chat öffnen

[/chat](/chat) öffnen und anmelden (ein Klick, kostenlose Testphase).

### Schritt 2 — Prompt einfügen

```text
Fass das aktuellste 10-K von NVDA zusammen. Gib mir:
- MD&A-Highlights (YoY-Umsatztreiber, Liquiditätssprache)
- FCF, Nettoverschuldung, Umsatzwachstum nach Segment
- Risikofaktor-Änderungen vs. Vorjahr — nur neu oder wesentlich verändert
- Anhänge, die ich nachverfolgen sollte
- Quelllinks für jede Behauptung
```

### Schritt 3 — ~30 Sekunden warten

PickSkill:
1. Zieht das aktuellste 10-K (und das Vorjahres-Filing für den Diff) von [SEC EDGAR][edgar].
2. Extrahiert Item 7 (MD&A) und findet „Liquidity and Capital Resources".
3. Extrahiert die drei Finanzabschlüsse; berechnet [FCF](/blog/what-is-fcf), Nettoverschuldung, segmentweises Wachstum.
4. Diffed Item 1A gegen das Vorjahres-Filing wortgenau und hebt nur die neuen oder wesentlich umgeschriebenen Absätze hervor.
5. Markiert 1–3 Anhänge, die am wahrscheinlichsten materielle neue Offenlegungen enthalten.
6. Schreibt das Ergebnis als gestreamten 90-Sekunden-Walkthrough mit jeder Behauptung zur Quellseite verlinkt.

[edgar]: https://www.sec.gov/edgar

### Schritt 4 — Follow-ups stellen

Hier wird aus der Zusammenfassung ein Research-Workflow:

```text
Der Risikofaktor-Diff hat „Kundenkonzentration" erwähnt — zieh den genauen
Wortlaut und sag mir, welcher Kunde gemeint ist (mit Segmentoffenlegung
abgleichen).
```

```text
Das MD&A merkte komprimierende Margen YoY an — schlüssel auf, ob das COGS,
SG&A oder R&D war. Zeig mir die YoY-Delta für jeden.
```

```text
Wie sieht die Schuldenfälligkeits-Mauer der Firma für die nächsten 3 Jahre aus?
Aus dem Schuldenplan-Anhang ziehen.
```

PickSkill hält das Filing im Kontext, sodass jede Folgefrage direkt aus demselben Dokument abruft.

> **Jetzt ausprobieren.** [Chat öffnen](/chat) und Prompt aus Schritt 2 mit einem beliebigen US-Ticker einfügen.

## So sieht die Ausgabe aus

| Sektion | Was Sie bekommen |
|---|---|
| **MD&A** | 4–6 Bullets über YoY-Umsatztreiber, Margenbewegung, Liquiditäts-/Kapitalressourcenkommentar. |
| **Financials** | 3 Zahlen: TTM-FCF, aktuellste Nettoverschuldung, YoY-Umsatzwachstum nach Segment. |
| **Risikofaktor-Diff** | Eine kurze Liste *ausschließlich* der neuen oder wesentlich geänderten Risikoabsätze. |
| **Anhang-Watchlist** | 1–3 Anhang-Nummern + je ein Satz, warum lesenswert. |
| **Quelllinks** | Jede Zeile mit „[source]" → exakte Seite des Filings auf EDGAR. |

## Was in 60 Sekunden nicht geht

- **Vollständige forensische Bilanzanalyse** — Aufdeckung von Umsatzrealisierungs-Irregularitäten oder aggressiver Kostenkapitalisierung erfordert tiefes Lesen der Anhänge.
- **Lesen der Proxy (DEF 14A)** — Vorstandsvergütung und Related-Party-Transaktionen in separater Filing.
- **Unabhängige Verifikation jeder Aussage.** Der Walkthrough ist ein Startpunkt.

## Warum dieses Tutorial den Explainer ergänzt

Der [10-K-Leitfaden](/blog/how-to-read-10k) lehrt, wonach in jeder Sektion zu schauen ist — das ist der Rahmen für das Investmentleben. Dieses Tutorial entfernt die Reibung, dorthin zu kommen. Lesen Sie den Explainer einmal; verwenden Sie das Tutorial bei jedem neuen Recherche-Namen.

Das gleiche Muster wiederholt sich im Foundation-Cluster:
- [Was ist DCF?](/blog/what-is-dcf) → [DCF in 60 Sek](/blog/build-dcf-in-60-seconds)
- [Was ist WACC?](/blog/what-is-wacc) — im DCF-Tutorial abgedeckt
- [Was ist FCF?](/blog/what-is-fcf) — Zahl #1 in der Output-Tabelle oben
- [10-K in 30 Min](/blog/how-to-read-10k) → dieses Tutorial

## FAQ

**Funktioniert das für Hongkong und A-Shares?**
Ja — PickSkill erkennt HKEx-Ticker (z. B. `9988.HK`) und zieht den entsprechenden Jahresbericht aus HKEx Disclosure. A-Shares aus Cninfo.

**Wie genau ist der Risikofaktor-Diff?**
Auf Absatzebene substanziell genau. PickSkill alignt satzweise und unterdrückt kosmetische Änderungen (Neunummerierung, Satzumstellung).

**Kann ich das auf 10-Qs laufen lassen?**
Ja — gleicher Workflow, sagen Sie „fass das aktuelle 10-Q zusammen". Der Risk-Factors-Diff ist auf 10-Qs weniger nützlich, aber der MD&A-Delta vs. Vorquartal ist hochinformativ.

**Was, wenn das Filing zu lang ist?**
Ein typisches 10-K hat 150–300 Seiten. PickSkill verarbeitet bis ~500. Für Multi-Segment-Konzerne mit riesigen 10-Ks dauert der Flow 2–3 Minuten.

**Woher bezieht PickSkill die Filings?**
Direkt von [SEC EDGAR](https://www.sec.gov/edgar) für US, HKEx Disclosure für Hongkong, Cninfo für A-Shares. Kein Drittdaten-Vermittler — Text und Zahlen stimmen exakt mit dem Behördenfiling überein.
