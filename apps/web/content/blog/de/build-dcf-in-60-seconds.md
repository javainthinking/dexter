---
title: Wie man ein DCF in 60 Sekunden mit PickSkill baut
description: Chat öffnen, einen Prompt einfügen, ein 5-Jahres-DCF in Excel erhalten — jeder Input verlinkt, jede Annahme bearbeitbar. US, HK, A-Share Ticker.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: Das PickSkill-Research-Team — wir bauen einen AI-Analysten für Privatanleger.
pillar: how-to
tags:
  - tutorial
  - dcf
  - valuation
  - workflow
heroImage: /blog/build-dcf-in-60-seconds/hero.png
heroAlt: Editoriale Infografik, die die Zeit zum Bauen eines DCF in Excel mit PickSkill vergleicht — ein 60-Minuten-Balken neben einem winzigen 60-Sekunden-Balken
---

Ein DCF in Excel von Hand zu bauen ist eine Stunden-Übung: vier 10-Ks ziehen, Positionen kopieren, fünf Jahre projizieren, einen [WACC](/blog/what-is-wacc) schätzen, den Terminal Value berechnen, eine Sensitivitätstabelle aufstellen. Dieses Tutorial zeigt denselben Workflow in PickSkill in unter einer Minute — jeder Input mit Quelle, jede Position zum Filing verlinkt, das Excel direkt downloadbar. Die Mathematik ist identisch zu dem, was Sie von Hand bauen würden; was sich ändert, ist das Zeitverhältnis von Datensammlung zu Beurteilungen, die die Antwort tatsächlich bewegen.

Es ist ein 4-Schritte-Tutorial. Jeder Schritt ist ein Prompt oder ein Klick. Wenn Sie [Was ist DCF?](/blog/what-is-dcf) gelesen haben, kennen Sie den Rahmen — diese Anleitung führt Sie nur durch das Produkt.

### Kernaussagen

- **Vier Schritte, ~60 Sekunden.** Chat öffnen, Prompt einfügen, beliebige Annahme inline bearbeiten, Excel herunterladen.
- **Jeder Input mit Quelle.** Risikofreier Zinssatz aus der aktuellen Treasury-Kurve; ERP und Branchen-Beta aus Damodarans quartalsweise aktualisiertem Datensatz; FCF-Historie aus den letzten vier 10-Q/10-K (Quelle: SEC EDGAR).
- **Jede Annahme editierbar.** Überschreiben Sie Umsatzwachstum, terminale EBIT-Marge, WACC oder Terminal-Value-Methode im selben Chat — PickSkill rechnet live neu.
- **Funktioniert für US, Hongkong und A-Shares.** PickSkill zieht das richtige Filing-Set je Markt.
- **Die Ausgabe ist eine echte `.xlsx`-Datei** — kein Screenshot. Öffnen Sie es in Excel, teilen Sie es im Team oder fügen Sie es in Ihre Deck-Folien ein.

## Warum das wichtig ist

Der Grund, warum die meisten Privatanleger keine DCFs bauen, ist nicht die konzeptionelle Schwierigkeit — es ist die Reibung. Wenn Sie das aktuellste 10-K gefunden, die Zusatzdaten heruntergeladen und das Projektionssheet aufgebaut haben, ist eine Stunde vergangen, bevor Sie überhaupt eine Beurteilung getroffen haben. PickSkill staucht diese Stunde auf Sekunden zusammen, damit Sie Ihre Zeit dort verbringen, wo es zählt: auf den vier Annahmen, die wirklich die Bewertung bewegen (Umsatzwachstum, terminale Marge, WACC, Terminal Value — siehe [Was ist DCF?](/blog/what-is-dcf)).

Eine vernünftige Faustregel: Wenn ein DCF entscheidet, ob Sie auf eine Position handeln, verdienen die Annahmen mindestens 20 Minuten Nachdenken. 60 Minuten in Daten-Klempnerei zu stecken ist keine Investition in Qualität — es ist eine Steuer. Dieses Tutorial entfernt die Steuer.

## Der 4-Schritte-Workflow

### Schritt 1 — Chat öffnen

Gehen Sie auf [/chat](/chat). Falls Sie nicht angemeldet sind: Ein-Klick-Login — kostenlos zum Testen, keine Kreditkarte.

### Schritt 2 — Nach dem DCF fragen

Fügen Sie diesen Prompt ein (Ticker durch Ihren Recherchewert ersetzen):

```text
Bau ein 5-Jahres-DCF für NVDA in Excel.
Enthalten: Annahmensheet, 5-Jahres-FCF-Projektion, WACC mit Sensitivität,
und eine Bewertungs-Summary mit dem implizierten Aktienkurs.
Zeig mir die vier Inputs, auf die ich achten sollte.
```

Das ist die gesamte Eingabe. Kein Ticker-Setup, keine Template-Wahl, kein Feld-für-Feld-Formular.

### Schritt 3 — ~30 Sekunden warten, während PickSkill arbeitet

PickSkill tut, der Reihe nach:
1. Zieht das aktuellste 10-K plus die vier vorherigen 10-Qs von [SEC EDGAR][edgar] (oder HKEx / Cninfo für HK / A-Share-Werte).
2. Extrahiert GuV-, Kapitalflussrechnungs- und Bilanzpositionen.
3. Berechnet historische [FCF](/blog/what-is-fcf) (OCF − Capex) für die letzten vier Geschäftsjahre.
4. Zieht die aktuelle 10-jährige Treasury-Rendite als risikofreien Zinssatz.
5. Zieht Damodarans aktuelle Branchen-ERP und Branchen-Beta.
6. Baut den WACC.
7. Projiziert die nächsten fünf Jahre mit historischen Wachstumsraten als Default.
8. Berechnet den Terminal Value sowohl mit Gordon Growth als auch mit Exit-Multiple.
9. Schreibt das Ergebnis in eine `.xlsx`-Datei mit Formel-Links zwischen Blättern.

[edgar]: https://www.sec.gov/edgar

Während der Verarbeitung sehen Sie eine Streaming-Zusammenfassung, in der jedes geholte Filing verlinkt ist. Am Ende erhalten Sie einen 7 Tage gültigen Download-Link plus einen In-Chat-Walkthrough zu den vier Annahmen.

### Schritt 4 — Beliebige Annahme bearbeiten, live neu rechnen

Hier beginnt die eigentliche Arbeit. Jede der vier DCF-bewegenden Annahmen ist inline editierbar:

```text
Heb die terminale EBIT-Marge auf 38% und lass die Sensitivitätstabelle neu laufen.
```

```text
Verwende die implizite ERP (4,2%) statt der historischen und zeig mir den neuen
WACC und wie sich der implizierte Kurs ändert.
```

```text
Stresstest beim Umsatzwachstum — lass Y4 und Y5 auf 10% sinken und zeig mir
den Downside-Case.
```

PickSkill rechnet dasselbe Excel-Template mit neuen Inputs neu und gibt Ihnen den Diff. Kein Re-Upload, keine Template-Hölle.

> **Jetzt ausprobieren.** [Chat öffnen](/chat) und den Prompt aus Schritt 2 einfügen. Die ganze Schleife dauert unter einer Minute.

## So sieht die Ausgabe aus

Die heruntergeladene `.xlsx` enthält vier Blätter:

| Blatt | Inhalt |
|---|---|
| **Assumptions (Annahmen)** | Umsatzwachstum (Y1–Y5), EBIT-Margen-Pfad, Steuersatz, Capex / Umsatz, Working-Capital-Veränderung, WACC-Inputs, Terminal-Value-Methode. Jede Zelle mit Quellenhinweis. |
| **Projection (Projektion)** | Jahr für Jahr: Umsatz, EBIT, NOPAT, Capex, ΔNWC, FCF, diskontierter FCF. Formeln zu Assumptions verlinkt. |
| **Sensitivity (Sensitivität)** | `(WACC, terminales Wachstum)`-Raster mit dem implizierten Kurs über ±150 bp WACC und ±100 bp terminales Wachstum. Basisfall-Zelle hervorgehoben. |
| **Summary (Zusammenfassung)** | Schlussfolgerung — implizierter Kurs (Basis, niedrig, hoch) vs. aktuell; die vier Annahmen inline; Link zurück zum Prompt, der die Datei erzeugt hat. |

In Excel oder Google Sheets öffnen. Die Formeln sind live; überschreiben Sie irgendetwas und die Projektion aktualisiert sich.

## Nützliche Follow-up-Prompts

Sobald Sie den Basisfall haben, machen diese Prompts den Unterschied:

- *„Füg ein fünftes Jahr Detailtiefe hinzu — zeig mir den Pfad vom aktuellen Umsatz zum Year-5-Umsatz, segmentweise aufgeteilt."*
- *„Lass ein Reverse-DCF laufen — welches Umsatzwachstum impliziert der aktuelle Kurs?"*
- *„Vergleich mein DCF mit dem Konsens. Wo sind meine Annahmen straffer / lockerer als der Sell-Side-Durchschnitt?"*
- *„Mach aus diesem DCF einen One-Pager für einen nicht-technischen Leser. Inklusive Bull-, Bear- und Base-Case mit je einem Satz."*
- *„Jetzt mach dasselbe DCF für AMD und leg beide auf ein Sheet, damit ich vergleichen kann."*

Jeder Prompt löst eine Neuberechnung aus; das Excel wird mit dem neuen Inhalt regeneriert.

## Was Sie in 60 Sekunden nicht hinbekommen

Ehrliche Vorbehalte:

- **Maßgeschneiderte Segmentprognosen**, die Unit Economics modellieren (Preis × Menge × Geografie pro Produktlinie), dauern in der Regel länger als 60 Sekunden. PickSkill kann das — Sie brauchen nur 3–5 Minuten Hin und Her, um die Segmentierung zu beschreiben.
- **Synergie-schwere M&A-DCFs**, die ein Deal-Modell neben dem Standalone-DCF erfordern, brauchen das Hochladen der Deal-Bedingungen; die Standalone-Teile sind 60 Sekunden, die Deal-Logik ist ein eigenes Gespräch.
- **Werte ohne aktuelle Filings** (kürzliche IPO, Foreign Private Issuer mit US-Listing) können eine dünnere Default-Historie haben. PickSkill teilt das mit und bietet Schätzungen als Alternative.
- **Entscheidungen, die schwerer wiegen als das Modell.** Ein DCF ist ein Rahmen, kein Orakel. Verwenden Sie dieses Tutorial, um Klempnerei-Reibung zu entfernen, nicht um die Beurteilung auszulagern.

## FAQ

**Muss ich Daten hochladen?**
Nein. PickSkill zieht alles aus öffentlichen Quellen (SEC EDGAR für US, HKEx für Hongkong, Cninfo für A-Shares) plus Marktdaten-Feeds. Upload ist nur relevant, wenn Sie Ihr eigenes privates Modell oder Ihre Notizen darüberlegen wollen.

**Wie genau sind die Default-Annahmen?**
Die Defaults sind belegt und absichtlich neutral — sie sind ein Ausgangspunkt, nicht eine Endantwort. Umsatzwachstum-Default = 3-Jahres-CAGR; terminale EBIT-Marge-Default = 3-Jahres-Mittel; WACC live aus Damodarans Branchentabellen. Der Sinn von Schritt 4 ist genau, die Defaults mit Ihrer eigenen Sicht zu überschreiben.

**Kann ich das DCF speichern und später zurückkehren?**
Ja — die Chat-Sitzung persistiert. Öffnen Sie das Gespräch erneut und fragen Sie „lass das DCF mit dem neuen 10-Q, das ich gerade gesehen habe, neu laufen", und PickSkill setzt fort, wo Sie aufgehört haben, mit dem neuen Filing eingebaut.

**Funktioniert das für HK- und A-Share-Werte?**
Ja. PickSkill erkennt HKEx-Ticker (z. B. `9988.HK`, `0700.HK`) und A-Share-Ticker (`600519.SS`, `000333.SZ`) und zieht die passenden Filings je Markt (Jahres-, Halbjahres-, Quartals-). Für A-Shares ist der Default-Risikofrei-Zinssatz die 10-jährige CGB; für HKEx ist es der 10-jährige Treasury (die meisten HKEx-Werte preisen in der Praxis gegen die Dollar-Kurve).

**Was ist mit Konsens-Vergleich?**
Hängen Sie *„…und vergleich jeden Input mit den Konsens-Schätzungen"* an den ursprünglichen Prompt an. PickSkill zieht den Konsens aus Marktdaten und zeigt Ihnen, welche Annahmen über, unter oder am Sell-Side-Mittel liegen. Die Brücke zwischen Ihrer Sicht und dem Konsens ist der Ort, an dem das meiste Alpha — und das meiste Risiko — wohnt.

**Wo lerne ich den DCF-Rahmen selbst?**
Starten Sie mit [Was ist DCF?](/blog/what-is-dcf) für den Absolute-Valuation-Rahmen, [Was ist der WACC?](/blog/what-is-wacc) für den Diskontsatz, der alles leise entscheidet, und [Was ist Free Cash Flow?](/blog/what-is-fcf) für die Cashflow-Projektionsschicht. Für die 10-Ks, aus denen die Inputs kommen, ist [Ein 10-K in 30 Minuten lesen](/blog/how-to-read-10k) der Begleiter. Dieses Tutorial setzt diese Rahmen voraus; es ersetzt sie nicht.
