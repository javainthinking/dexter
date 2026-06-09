---
title: 'Warum unser AI-Analyst Word, PowerPoint und Excel schreibt'
description: >-
  Chat-Antworten lassen sich nicht ausliefern. Wir haben PickSkill beigebracht,
  native Word-, PPT- und Excel-Dateien zu erzeugen, damit Research zu einem
  Lieferobjekt wird, das Sie senden und präsentieren können.
publishedAt: 2026-06-09
updatedAt: 2026-06-09
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: Das PickSkill-Research-Team — wir bauen einen AI-Analysten für Privatanleger.
pillar: build-in-public
tags:
  - file-generation
  - office
  - ai-analyst
  - product
  - build-in-public
heroImage: /blog/why-our-ai-analyst-writes-office-files/hero.png
heroAlt: >-
  Editorial-Infografik — eine Chat-Blase links, die durch eine OfficeCLI-Schicht
  in drei native Datei-Ausgaben rechts fließt: ein .docx-Memo, ein .pptx-Deck
  und eine .xlsx-Arbeitsmappe, jeweils beschriftet mit „echtes OpenXML, kein
  Screenshot".
---

**Eine Chat-Antwort wird einmal gelesen und ist verloren; ein Word-Memo, ein PowerPoint-Deck und eine Excel-Arbeitsmappe werden weitergeleitet, editiert, präsentiert und abgelegt.** Als wir [PickSkill](https://pickskill.ai) auf dem Open-Source-[Dexter](https://github.com/virattt/dexter)-Agenten bauten, war die einzige Fähigkeit, die das zugrunde liegende CLI nicht hatte — und die, nach der unsere frühesten Benutzer am meisten fragten — *Lieferobjekte*. Also fügten wir OfficeCLI hinzu: eine Schicht, die die Analyse des Agenten in native `.docx`-, `.pptx`- und `.xlsx`-Dateien verwandelt. Keine Screenshots, keine PDFs, keine Markdown-Dumps. Dieser Beitrag ist die Build-in-public-Begründung dafür, warum ein ernsthafter AI-Analyst Office-Dateien schreiben muss und wie wir es gemacht haben.

### Kernaussagen

- **Chat-Ausgabe lässt sich nicht ausliefern.** Das Format, das in der Finanzwelt geteilt, editiert und präsentiert wird, ist Word, PowerPoint und Excel — kein Chat-Transkript.
- **PickSkill erzeugt native OpenXML-Dateien** via OfficeCLI: echte `.docx`-Memos, `.pptx`-Decks mit eingebetteten Charts und `.xlsx`-Arbeitsmappen mit Live-Formeln über mehrere Tabellenblätter.
- **Jede Datei ist aus Live-Daten gequellt** — Indikatoren berechnet auf dem aktuellsten Schluss, Finanzdaten aus dem jüngsten Filing, Bewertung aus dem aktuellen Konsens.
- **Dateien werden als 7-Tage-vorsignierte Links** auf Cloudflare R2 ausgeliefert, also gibt es nichts zu installieren und keinen Plattform-Lock-in.
- **Ein Prompt, drei Formate.** Dieselbe Research kann zu einem Memo, einem Deck oder einem Modell werden — Sie wählen das Artefakt für die Zielgruppe.

## Warum eine Chat-Antwort kein Lieferobjekt ist

Generative AI machte Research-*Antworten* billig. Sie machte Research-*Artefakte* nicht billig. Es gibt eine Lücke zwischen „das Modell hat mir gesagt, dass NVDAs FCF-Marge 18% beträgt" und „ich habe ein vierseitiges Memo, das mein Investmentclub am Sonntag lesen kann". Diese Lücke — die Präsentationsschicht — ist der Ort, an dem die meiste Retail-Analyse still stirbt, denn bis Sie die Analyse aufgebaut haben, die Sie teilen wollen, ist die Geduld aufgebraucht, das Deck oder die Arbeitsmappe zusammenzustellen, die sie teilbar macht.

Die Formate sind wichtig, weil die Zielgruppen sich unterscheiden. Ein Memo ist für jemanden, der Fließtext liest und das Argument will. Ein Deck ist für ein Live-Gespräch, in dem Sie die These durchgehen. Eine Arbeitsmappe ist für den Mitarbeiter, der sortieren, pivotieren und eigene Spalten hinzufügen will. Ein Chat-Transkript bedient keine dieser drei — es kann nicht sortiert werden, es kann nicht präsentiert werden, und es liest sich wie ein Log. Die Lücke zwischen Antwort und Artefakt zu schließen ist der ganze Grund, warum OfficeCLI existiert.

## Was „natives OpenXML" tatsächlich bedeutet

Wenn wir sagen, dass PickSkill echte Office-Dateien erzeugt, meinen wir, dass jede Form, Zelle, Formel und jedes Chart ein echtes OpenXML-Objekt ist — dasselbe Dateiformat, das Microsoft Office schreibt. Die Unterscheidung ist nicht kosmetisch. Ein Screenshot einer Tabelle sind tote Pixel; eine echte `.xlsx`-Tabelle sortiert, filtert und speist eine Pivot-Tabelle. Ein PDF von Folien kann nicht neu eingefärbt werden; ein echtes `.pptx`-Deck übernimmt Ihr Corporate-Template über Design → Varianten und lässt Sie jeden Folientitel editieren.

Hier ist, was jedes Format trägt:

| Format | Was PickSkill schreibt | Was Sie damit tun können |
|---|---|---|
| **`.docx`** | Abschnitte mit Überschriften, Tabellen, quellenbelegte Aussagen, Fließtext-Narrativ | In Word/Google Docs editieren, als Memo weiterleiten, in einen Report einfügen |
| **`.pptx`** | Titel, Holdings-/Thesen-Folien, eingebettete Chart-Bilder, editierbare Titel | Aus PowerPoint/Keynote präsentieren, neu einfärben, jede Folie editieren |
| **`.xlsx`** | Arbeitsmappe mit mehreren Tabellenblättern, Live-Formeln über Blätter, bedingte Formatierung, Sparklines | Sortieren, pivotieren, Spalten hinzufügen, eigenes Modell darauf aufbauen |

Weil die Ausgabe Standard-OpenXML ist, öffnet sie sich in Excel, Google Sheets, LibreOffice, Apple Numbers, Keynote und Google Slides — kein PickSkill-Account nötig, um eine Datei zu öffnen, die jemand mit Ihnen geteilt hat.

## Wie OfficeCLI in die Agenten-Schleife passt

PickSkill erbt Dexters Plan-Ausführen-Validieren-Agenten-Schleife (siehe [Von Dexter zu PickSkill](/blog/from-dexter-to-pickskill) für die vollständige Entstehungsgeschichte). Die Datei-Generierung fügt sich als letzte Stufe dieser Schleife ein: Sobald der Agent recherchiert, berechnet und validiert hat, kompiliert OfficeCLI das Ergebnis in ein Dokument.

Die Sequenz, für ein Portfolio-Deck, läuft so:

1. Der Agent zieht den aktuellen Kurs und die Kurshistorie für jede Position.
2. Er lässt die Acht-Dimensionen-Indikator-Suite ([/indicators](/indicators)) laufen und erkennt aktive Signale.
3. Er zieht Bewertungs-Multiples und die jüngste Finanzzusammenfassung.
4. Er rendert die Indikator-Charts als hochauflösende Bilder.
5. OfficeCLI komponiert das `.pptx` — bettet die Charts ein, formatiert die Tabellen, bindet editierbare Titel an die Analyse.
6. Die Datei wird auf Cloudflare R2 geschrieben und als 7-Tage-vorsignierter Download-Link zurückgegeben.

Die entscheidende Design-Entscheidung: Die Datei ist an die Analyse gebunden, nicht aus ihr eingefügt. Bitten Sie im Chat um eine Änderung — „beginne mit dem FCF-Narrativ", „komprimiere die Pro-Position-Folien auf je eine" — und der Agent führt die relevante Analyse erneut aus und gibt eine frische Datei aus. Das Dokument liegt stromabwärts der Schlussfolgerung, also bleibt es ehrlich.

> **Jetzt ausprobieren.** Öffnen Sie ein beliebiges Portfolio unter [/portfolios](/portfolios) und klicken Sie auf *Nach PowerPoint exportieren* oder *Nach Excel exportieren* — die Datei ist in etwa einer Minute bereit.

## Drei Formate, drei Zielgruppen

Der Grund, warum wir alle drei gebaut haben, statt eines auszuwählen, ist, dass Retail- und Semi-Pro-Analysten vor verschiedenen Räumen präsentieren, und das Artefakt muss zum Raum passen:

- **Word** für den Analysten, der in Fließtext denkt — ein Thesen-Memo, eine 10-K-Zusammenfassung, eine Positions-Begründung. Lesen Sie unsere [Investor-Deck-aus-Chat](/blog/generate-investor-deck-from-chat)-Anleitung für den Fließtext-vs-Folien-Trade-off.
- **PowerPoint** für die Live-Präsentation — ein Investmentclub, ein Interview-Komitee, ein Partner, der das Familien-Buch führt. Siehe [Portfolio nach PowerPoint exportieren](/blog/export-portfolio-to-powerpoint).
- **Excel** für den Mitarbeiter, der die Zahlen *bearbeiten* will — nach Signalstärke sortieren, nach Sektor pivotieren, eigene Szenarien einziehen. Siehe [Portfolio-Report nach Excel exportieren](/blog/export-portfolio-report-to-excel).

Ein Research-Gespräch, drei mögliche Artefakte. Sie wählen das Format, wenn Sie die Zielgruppe wählen — die Analyse darunter ist identisch.

## Die ehrlichen Vorbehalte

Build-in-public bedeutet, zu kennzeichnen, was die Datei-Generierung nicht tut:

- **Es ist eine Momentaufnahme, kein Live-Link.** Die Formeln der Arbeitsmappe aktualisieren sich gegen ihre eigenen Zellen, aber sie holen keine neuen Marktdaten live. Zum Auffrischen erneut exportieren — etwa 30 Sekunden.
- **Custom-Corporate-Templates brauchen manuelles Setup.** Das Deck verwendet PickSkills Design-System; stark gebrandete Templates (Custom-Fonts, Logo-Platzierung) werden nach dem Export über Ihr Office-Theme angewendet.
- **Kein VBA / keine Makros.** Die Ausgabe besteht aus Daten, Formeln und Charts. Makros und Custom-Ribbons bleiben manuelle Ergänzungen.
- **Kein direkter Broker-Sync.** Positionen kommen aus dem Portfolio, das Sie unter [/portfolios](/portfolios) pflegen, nicht aus einem Live-Broker-Feed.

Das sind bewusste Grenzen, keine Bugs — die Datei ist ein sauberer, quellenbelegter Ausgangspunkt, auf dem Sie aufbauen, keine Blackbox, der Sie blind vertrauen müssen.

## FAQ

**Warum muss ein AI-Analyst überhaupt Office-Dateien schreiben?**
Weil Research nur dann Wert schafft, wenn sie geteilt wird, und die Finanzwelt teilt in Word, PowerPoint und Excel. Eine Chat-Antwort kann nicht präsentiert, sortiert oder abgelegt werden. Native Office-Dateien zu erzeugen schließt die Lücke zwischen „das Modell hat meine Frage beantwortet" und „ich habe ein Lieferobjekt, das meine Kollegin oder mein Club tatsächlich verwenden kann".

**Sind die Dateien echte Office-Dokumente oder nur Exporte eines Screenshots?**
Echte OpenXML-Dokumente. Jede Zelle, Formel, Folie und jedes Chart ist ein echtes Office-Objekt — die Arbeitsmappe sortiert und pivotiert, das Deck färbt neu ein und editiert, das Memo öffnet sich in Word oder Google Docs. Nichts ist ein flacher Screenshot oder ein schreibgeschütztes PDF.

**Brauche ich Microsoft Office installiert, um sie zu verwenden?**
Nein. Die Dateien öffnen sich in Excel, Google Sheets, LibreOffice, Apple Numbers, Keynote und Google Slides. Weil PickSkill Standard-OpenXML schreibt und im Standard-Export herstellerspezifische Funktionen vermeidet, rendern die Dateien über jede große Office-kompatible Suite korrekt.

**Wie lange sind die Download-Links gültig?**
Jede Datei wird als 7-Tage-vorsignierter Link auf Cloudflare R2 ausgeliefert. Die Datei selbst ist nach dem Download dauerhaft — regenerieren Sie sie jederzeit aus dem Chat, wenn Sie eine aufgefrischte Version mit den neuesten Daten brauchen. Der Link ist auf Ihren Account begrenzt.

**Kann ein Research-Gespräch mehr als ein Format erzeugen?**
Ja. Dieselbe Analyse kann zu einem `.docx`-Memo, einem `.pptx`-Deck oder einer `.xlsx`-Arbeitsmappe werden — Sie wählen das Artefakt für die Zielgruppe. Die zugrunde liegende Research ist identisch; nur das Lieferobjekt ändert sich, weil die Datei stromabwärts der Schlussfolgerung des Agenten erzeugt wird statt in ein festes Template eingefügt.
