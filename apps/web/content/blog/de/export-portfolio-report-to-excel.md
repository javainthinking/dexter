---
title: Wie man einen Portfolio-Bericht in 60 Sekunden nach Excel exportiert
description: >-
  Erzeugen Sie aus Ihrem PickSkill-Portfolio eine mehrblättrige
  Excel-Arbeitsmappe — Positionen, Indikatoren, Bewertung, Signalpfade. Echte
  Formeln, sortierbare Tabellen, bereit zum Teilen.
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
  - Excel
  - Portfolio
  - Export
  - Workflow
heroImage: /blog/export-portfolio-report-to-excel/hero.png
heroAlt: >-
  Editorial-Infografik — Tabellenkalkulations-Mockup mit mehreren Blatt-Tabs
  (Holdings · Indicators · Signal Trail · Valuation · Trade Log) und bedingt
  formatierten Zellen.
---

**Eine echte Excel-Arbeitsmappe mit Portfolio-Analyse bedeutete früher eine Stunde Ticker und Kurse ziehen, eine Stunde Indikatoren querverweisen und eine dritte Stunde die Ausgabe so formatieren, dass jeder andere sie nutzen kann.** Dieses Tutorial zeigt denselben Workflow in 60 Sekunden — jede Zelle aus Live-Daten gequellt, jede Formel echt, jedes Blatt so strukturiert, wie Analysten tatsächlich Arbeitsmappen teilen. Die heruntergeladene `.xlsx` ist eine Arbeitsdatei: Öffnen Sie sie, sortieren Sie jede Spalte, bauen Sie Pivots, teilen Sie sie mit einem Kollegen. Nichts ist ein Screenshot; nichts ist ein flacher Dump.

Es ist ein 4-Schritte-Tutorial. Jeder Schritt ist ein Prompt oder ein Klick. Wenn Sie ein Portfolio in PickSkill eingerichtet haben, können Sie den gesamten Ablauf in unter einer Minute durchlaufen.

### Kernaussagen

- **4 Schritte, ~60 Sekunden.** Portfolio öffnen, Export klicken, Excel wählen, in Ihrem Tabellen-Programm der Wahl aktualisieren.
- **Jeder Wert ist aus Live-Daten gequellt** — Kurse aus Marktdaten-Feeds, Indikatoren auf dem aktuellsten Schluss berechnet, Finanzdaten aus den jüngsten Filings.
- **Die Arbeitsmappe ist mehrblättrig und für Filterung strukturiert** — Holdings, Indikatoren, Signalpfad, Bewertung, Trade-Log-Platzhalter.
- **Kompatibel mit Excel, Google Sheets, LibreOffice Calc, Numbers.** Durchgängig OpenXML-Format — kein Plattform-Lock-in.
- **Funktioniert mit US-, HK- und A-Aktien-Positionen** mit den angemessenen Marktkonventionen je Blatt.

## Warum das wichtig ist

Excel bleibt das universelle Austauschformat für Portfolio-Analyse. PDFs sind read-only; Präsentationsdecks sind präsentationsförmig; ein Chat-Thread sortiert nicht. Die Excel-Arbeitsmappe ist das einzige Format, in dem Sie tatsächlich kollaborativ *arbeiten* können — Pivots bauen, Spalten hinzufügen, mit Ihren eigenen Daten querverweisen.

PickSkill staucht den Arbeitsmappen-Aufbau-Schritt auf einen einzelnen Klick zusammen, damit Ihre Zeit zur Analyse zurückkehrt. Drei unmittelbare Anwendungsfälle:

- **Ihr persönliches Portfolio-Dashboard.** Speichern Sie die Arbeitsmappe, exportieren Sie wöchentlich neu, und Sie haben einen rollierenden Pfad, wie sich Indikatoren entwickelt haben.
- **Teilen mit Mitarbeitern.** Freunde, ein Investmentclub, ein Partner — jeder mit Excel kann dieselbe Datei öffnen und zu ihr beitragen.
- **Eigene Custom-Analyse darauf aufbauen.** Die exportierte Arbeitsmappe ist Ihr Ausgangspunkt; legen Sie Ihre eigenen Spalten, Szenarien und Notizen darüber, ohne die Basis neu aufzubauen.

## Der 4-Schritte-Workflow

### Schritt 1 — Öffnen Sie das Portfolio, das Sie exportieren möchten

Gehen Sie zu [/portfolios](/portfolios). Wählen Sie das Portfolio, das Sie in eine Arbeitsmappe verwandeln möchten. (Für das Einrichten beim ersten Mal siehe [Ein Portfolio mit Indikatoren verfolgen](/blog/track-a-portfolio-with-indicators).)

Die Arbeitsmappe skaliert gut über Portfolio-Größen — von einer 3-Werte-Watchlist bis zu einem 50-Werte-diversifizierten Buch. Größere Portfolios produzieren ein dickeres Indikatoren-Blatt, aber die Struktur bleibt konsistent.

### Schritt 2 — Klicken Sie auf „Nach Excel exportieren"

Die Portfolio-Detailseite hat im Header einen „Export to chat"-Cluster von Buttons. Klicken Sie auf den Excel-Button. PickSkill öffnet einen Chat mit einem vorbefüllten Prompt, der den Portfolio-Kontext enthält.

Der Default-Prompt erzeugt eine 5-Blatt-Arbeitsmappe. Zum Anpassen vor dem Senden:

- **Bestimmte Indikatoren hinzufügen oder andere weglassen**: „Schließe nur MACD, RSI und den MA-Stack ein — überspringe Bollinger und KDJ." Nützlich, wenn das Publikum mit bestimmten Indikatoren unvertraut ist.
- **Fundamentaldaten hinzufügen**: „Schließe die letzten 4 Quartale Umsatz und EPS je Position ein." Das Fundamentaldaten-Blatt erscheint in der Arbeitsmappe.
- **Szenarien hinzufügen**: „Füge ein Szenarien-Blatt mit Bull- / Basis- / Bear-Kurszielen je Position hinzu." Ein leeres Szenarien-Blatt wird zum Befüllen hinzugefügt.

### Schritt 3 — Warten Sie ~30 Sekunden, während PickSkill die Arbeitsmappe zusammenstellt

PickSkill tut der Reihe nach:

1. Zieht aktuellen Kurs, Intraday-Metriken und historische Kursreihen (Standard 6 Monate) für jede Position.
2. Lässt die volle Indikator-Suite ([MACD](/blog/what-is-macd), [RSI](/blog/what-is-rsi), [KDJ](/blog/what-is-kdj), [Bollinger-Bänder](/blog/what-is-bollinger-bands), [ADX](/blog/what-is-adx), MA-Stack, [Volumen](/blog/what-is-volume-analysis), [Geldfluss](/blog/what-is-capital-flow)) laufen.
3. Erkennt aktuellen Signalzustand und den 5-Tage-Bucket-Pfad je Dimension.
4. Zieht Bewertungs-Multiples und -Verhältnisse (KGV, KBV, EV/EBITDA, Dividendenrendite).
5. Rendert alle Werte in eine strukturierte mehrblättrige Arbeitsmappe.
6. Fügt Excel-Formeln hinzu, um zwischen Blättern querzuverweisen, sodass Änderungen weiterpropagieren.
7. Schreibt das Ergebnis in eine `.xlsx`-Datei mit eingebetteten Sparklines und bedingter Formatierung.

Sie sehen eine Streaming-Zusammenfassung der Arbeit. Wenn fertig, erhalten Sie einen 7 Tage lang gültigen Download-Link.

### Schritt 4 — In Excel öffnen und anpassen

Die heruntergeladene `.xlsx` ist eine echte Arbeitsdatei. Öffnen Sie sie in einem beliebigen Tabellen-Werkzeug. Häufige unmittelbare Bearbeitungen:

- **Nach Signalstärke sortieren** — klicken Sie auf den Spaltenkopf im Bucket-Score-Feld.
- **Eine Notizen-Spalte hinzufügen** — jedes Blatt hat rechts eine Notizen-Spalte für persönliche Annotationen.
- **Eine Pivot-Tabelle bauen** — Pivot Positionen nach Sektor oder Signal-Bucket für einen anderen Datenschnitt.
- **Eigene Spalten hinzufügen** — die Arbeitsmappe ist auf Erweiterung ausgelegt; nichts geht kaputt, wenn Sie Felder hinzufügen.

Für größere Bearbeitungen gehen Sie zurück in den Chat und fordern eine spezifische Aktualisierung an:

```text
Füge ein Blatt hinzu, das die 1-Monats-, 3-Monats- und 6-Monats-Performance jeder
Position gegenüber dem SPY-Benchmark zeigt.
```

```text
Mach das Indikatoren-Blatt mit einem Heatmap-Farbschema neu — grün für bullischen Bucket,
rot für bärisch, gelb für neutral.
```

```text
Füge ein Screen-Blatt hinzu, das jede Position mit aktiver Divergenz in MACD UND RSI
UND KDJ gleichzeitig markiert.
```

PickSkill führt den Arbeitsmappen-Aufbau mit der neuen Struktur neu aus und gibt Ihnen einen frischen Download.

> **Jetzt ausprobieren.** [Zu /portfolios gehen](/portfolios), in ein beliebiges Portfolio klicken und „Nach Excel exportieren" klicken. Die gesamte Schleife dauert unter einer Minute.

## So sieht die Ausgabe aus

Die Standard-5-Blatt-Struktur:

| Blatt | Inhalt |
|---|---|
| **1. Holdings** | Eine Zeile pro Position — Ticker, Name, Markt, Gewicht, aktueller Kurs, Tagesveränderung, 5-Tages-Veränderung, 1-Monats-Veränderung, Positionswert, Notizen. Sortierbar. |
| **2. Indikatoren** | Eine Zeile pro (Position × Indikator) — aktueller Wert, Bucket-Label, 5-Tage-Bucket-Pfad, Signal-Annotation. Querverweise zum Holdings-Blatt. |
| **3. Signalpfad** | Eine Zeile pro Position — die volle 5-Tage-Entwicklung über alle 8 Indikator-Dimensionen, mit hervorgehobenen Bucket-Übergängen. |
| **4. Bewertung** | Eine Zeile pro Position — KGV, Forward-KGV, KBV, EV/EBITDA, Dividendenrendite, Sektormediane zum Vergleich. |
| **5. Trade-Log** | Vorformatiertes leeres Blatt — Spalten für Datum, Ticker, Aktion, Menge, Kurs, Begründung. Für Ihre eigene Trade-Journalführung, vorbefüllt mit der Holdings-Liste. |

Die Blätter sind verlinkt: Das Ändern eines Tickers im Holdings-Blatt (z.B. Umbenennen eines Spaltenkopfes) bricht die Querverweise in den anderen Blättern nicht. Das Hinzufügen von Zeilen zum Trade-Log macht den Rest der Arbeitsmappe nicht ungültig.

## Häufige Follow-up-Prompts

Sobald Sie die Basis-Arbeitsmappe haben, bringen diese Prompts den meisten Wert:

- *„Füge ein Risiko-Blatt hinzu — Konzentrationsmetriken, Sektor-Exposures, Korrelationsmatrix über Positionen."*
- *„Füge ein Watchlist-Blatt mit 10 Tickern hinzu, die ich diesem Portfolio hinzufügen könnte, gerankt nach ihrem aktuellen technischen Setup."*
- *„Füge ein Macro-Blatt hinzu — VIX, 10-jährige Rendite, Dollar-Index, Öl — damit ich Portfolio-Verhalten mit Macro-Treibern korrelieren kann."*
- *„Wandle die Indikator-Bucket-Labels in numerische Scores (−2 bis +2) um, damit ich Portfolio-weite Signal-Durchschnitte berechnen kann."*
- *„Mach dieselbe Arbeitsmappe für ein anderes Portfolio und merge die beiden, damit ich nebeneinander vergleichen kann."*

Jeder Prompt löst eine frische Arbeitsmappen-Erzeugung aus.

## Was Sie in 60 Sekunden nicht hinbekommen

Ehrliche Vorbehalte:

- **Custom-Formel-Architekturen.** Wenn Sie eine spezifische Excel-Formel-Struktur brauchen (benannte Bereiche mit spezifischen Konventionen, übergreifende Arbeitsmappen-Verweise, Custom-VBA), fügen Sie diese manuell zum Export hinzu.
- **Echtzeit-Updates.** Die Arbeitsmappe ist ein Snapshot zum Exportzeitpunkt. PickSkill schiebt keine Live-Updates in eine bereits geöffnete Excel-Datei. Zum Auffrischen exportieren Sie neu aus dem Chat — dauert 30 Sekunden.
- **Schweres Macro- / VBA-Skripting.** Die Ausgabe besteht aus Daten und Formeln. Macros, Custom-Ribbons und bedingte VBA-Logik bleiben manuelle Ergänzungen.
- **Direktverbindung zu Ihrem Brokerage-Konto.** PickSkill zieht keine Live-Positionsdaten von Drittanbieter-Brokerages; die Holdings-Liste kommt aus Ihrem manuell gepflegten Portfolio in [/portfolios](/portfolios).

## Wie das unter der Haube funktioniert

Für die technisch Interessierten:

- PickSkill stellt zuerst die Arbeitsmappen-Struktur zusammen (eine Liste von Blättern, Spalten, Datenwerten und Formeln).
- Die Daten jedes Blattes werden mit derselben Backend-Logik erzeugt, die die [/indicators](/indicators)-Dashboards antreibt.
- Die `.xlsx`-Datei wird im OpenXML-Format geschrieben — jede Zelle, Formel, bedingte Formatierung und Sparkline ist ein echtes Excel-Objekt.
- Übergreifende Blatt-Verweise verwenden Standard-A1-Notation, sodass sie in jedem kompatiblen Tabellen-Werkzeug funktionieren.

Die Ausgabe verhält sich wie eine handgebaute Arbeitsmappe für Bearbeitungs- und Teilungszwecke, wird aber in Sekunden erzeugt.

## FAQ

**Muss ich Excel installiert haben, um die Ausgabe zu verwenden?**
Nein — die `.xlsx`-Datei öffnet sich in Excel, Google Sheets, LibreOffice Calc, Apple Numbers oder jedem OpenXML-kompatiblen Werkzeug. Alle Standardformeln (SUM, AVERAGE, IF, INDEX, MATCH) funktionieren über diese Werkzeuge hinweg; PickSkill vermeidet im Default-Export Excel-spezifische Funktionen.

**Aktualisieren sich die Formeln live, wenn ich die Arbeitsmappe öffne?**
Die Formeln aktualisieren sich gegen die eigenen Zellen der Arbeitsmappe (Änderungen an einer Zelle propagieren zu abhängigen Zellen). Sie holen *nicht* live neue Marktdaten — das würde eine aktive Datenverbindung erfordern. Um die zugrunde liegenden Daten aufzufrischen, exportieren Sie neu aus dem Chat.

**Kann ich die Arbeitsmappe mit jemandem teilen, der kein PickSkill-Konto hat?**
Ja — die Arbeitsmappe ist eine eigenständige Datei. Einmal heruntergeladen teilen Sie sie, wie Sie normalerweise Excel-Dateien teilen (E-Mail, Cloud-Laufwerk, Slack). Der Empfänger braucht kein PickSkill-Konto, um sie zu öffnen oder zu nutzen.

**Funktioniert das für Portfolios mit A-Aktien- oder HK-Positionen?**
Ja. Die Arbeitsmappe erkennt HKEx-Ticker (`9988.HK`, `0700.HK`) und A-Aktien-Ticker (`600519.SS`, `000333.SZ`) und wendet marktangepasste Konventionen an. Limit-Tag-Bars (A-Aktien) sind im Signalpfad-Blatt markiert, sodass technische Signale aus diesen Bars als Ausreißer behandelt werden.

**Wie bekomme ich diese Arbeitsmappe dazu, sich automatisch wöchentlich zu aktualisieren?**
Zwei Optionen. Der einfache Weg: Bookmarken Sie die Chat-Sitzung und führen Sie den Export-Prompt wöchentlich neu aus — PickSkill baut die Datei mit den neuesten Daten neu. Der automatisiertere Weg (in Design): geplante Workflows, die den Export nach einem Zeitplan neu ausführen und Ihnen die aktualisierte Datei mailen — siehe das [Workflows-Designdokument](/blog) für die kommende Funktion.

**Kann ich meine eigenen Custom-Indikatoren zur Arbeitsmappe hinzufügen?**
Das Indikatoren-Blatt ist so strukturiert, dass Sie auf der rechten Seite Spalten für eigene Metriken hinzufügen können. Die übergreifenden Blatt-Verweise gehen nicht kaputt. Damit PickSkill die Metrik für Sie berechnet, fragen Sie im Chat — die häufigsten Variationen (andere Indikator-Perioden, andere Bucket-Schwellen, Custom-Signale) können auf Anfrage hinzugefügt werden.
