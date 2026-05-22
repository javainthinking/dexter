---
title: Ein 10-K in 30 Minuten lesen — was Wall Street tatsächlich liest
description: Praxisleitfaden zum Lesen eines 10-K — die vier Abschnitte, die Investmententscheidungen bewegen, die 100+ Seiten, die man überspringen kann, und der 30-Minuten-Workflow professioneller Analysten.
publishedAt: 2026-05-22
updatedAt: 2026-05-22
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: Das PickSkill-Research-Team — wir bauen einen AI-Analysten für Privatanleger.
pillar: how-to
tags:
  - filings
  - 10-k
  - fundamentals
  - research-workflow
heroImage: /blog/how-to-read-10k/hero.png
heroAlt: Editoriale Infografik eines 10-K-Berichts in warmen dunklen Tönen mit den vier hervorgehobenen Schlüsselsektionen (Risikofaktoren, MD&A, Jahresabschluss, Anhänge) und einem 30-Minuten-Timer
---

Ein **10-K** ist der Jahresbericht, den jedes in den USA börsennotierte Unternehmen bei der SEC einreicht. Es ist die maßgeblichste Quelle über das Geschäft — vom Management unter rechtlicher Verantwortung verfasst, wo es zählt geprüft, in einem Standardformat eingereicht. Sorgfältig gelesen beantwortet ein 10-K nahezu jede Frage, die für eine Investmententscheidung relevant ist. Nachlässig gelesen sind es 150–300 Seiten juristischer Standardtext, in dem das Signal im Rauschen untergeht.

Dieser Leitfaden ist der 30-Minuten-Workflow, den professionelle Analysten verwenden: welche vier Abschnitte tief zu lesen sind, welche 100+ Seiten man überfliegen oder überspringen kann und welche Fragen man jedem Abschnitt stellt. Buchhaltungswissen ist nicht nötig — kein Finanzstudium, aber eine Karte.

### Kernaussagen

- **Ein 10-K hat 15 nummerierte Items in vier Parts.** Vier Items leisten 90 % der Arbeit; der Rest ist überwiegend Standardtext.
- **Reihenfolge: Item 7 (MD&A) → Item 8 (Abschluss) → Item 1A (Risikofaktoren) → markierte Anhänge.** Item 1 (Geschäftsbeschreibung) zu überspringen spart 20 Minuten bei minimalem Signalverlust.
- **Die Kapitalflussrechnung ist die zuverlässigste Sektion im ganzen Dokument.** Gewinne lassen sich innerhalb des GAAP umformen; Cash ist entweder geflossen oder nicht.
- **Risikofaktoren waren früher Standardtext — sind sie nicht mehr.** Seit 2020 drängt die SEC Unternehmen, spezifische Risiken offenzulegen; die wirklich neue Sprache in Item 1A ist die meistgelesene Sektion bei professionellen Investoren.
- **PickSkill fasst ein 10-K in ~60 Sekunden zusammen**, mit den vier wichtigen Sektionen extrahiert, jeder Posten zum Quellfiling verlinkt, Vorjahresdeltas vorberechnet.

## Was ist ein 10-K?

Ein 10-K ist der umfassende Jahresbericht, den ein US-börsennotiertes Unternehmen innerhalb von 60–90 Tagen nach Geschäftsjahresende (je nach Größe des Einreichers) bei der [SEC][sec] einreicht. Er enthält geprüfte Jahresabschlüsse, die Management-Diskussion zu deren Einordnung, eine explizite Risikofaktoren-Offenlegung und eine Reihe von Anhängen, die die buchhalterischen Entscheidungen hinter den Zahlen erläutern.

[sec]: https://www.sec.gov/edgar

Veröffentlicht wird er auf [EDGAR][edgar] (dem Filingsystem der SEC) und ist kostenlos abrufbar. Jedes 10-K folgt derselben nummerierten Struktur — Items 1 bis 15 in vier Parts — was das Dokument scannbar macht, sobald man die Karte hat.

[edgar]: https://www.sec.gov/edgar

Das Quartalspendant ist das **10-Q**, das innerhalb von 40–45 Tagen nach Quartalsende eingereicht wird. Das 10-Q ist kürzer (kein Audit, keine vollständige Risikofaktoren-Aktualisierung), und der Workflow unten funktioniert auch dort — nur mit weniger Tiefe im MD&A.

## Die vier Abschnitte, auf die es ankommt

Ein 10-K hat 15 Items. Diese vier lesen. Den Rest überfliegen oder überspringen.

### Item 7 — Management Discussion & Analysis (MD&A)

**Was es ist:** die eigene Erzählung des Managements zum Geschäftsjahr in Prosa. Warum sich der Umsatz so bewegte, was die Kostenseite treibt, wofür Capex ausgegeben wurde, was sie als Nächstes erwarten.

**Lesezeit:** 10–15 Minuten. **Jede Minute lohnt sich.**

**Worauf achten:**
- Umsatzveränderung im Jahresvergleich, aufgeschlüsselt nach Segment oder Geografie. Vergleichen Sie mit dem MD&A des Vorjahres — werden dieselben Faktoren angeführt?
- Die Unterabschnitt „Liquidity and Capital Resources". Dort spricht das Management über Schuldenfälligkeiten, Cashposition und mögliche Finanzierungsbedarfe. Ein Unternehmen, das plötzlich drei Absätze auf Liquidität verwendet, die letztes Jahr noch nicht da waren, signalisiert Stress.
- Vom Unternehmen hervorgehobene Non-GAAP-Kennzahlen (bereinigtes EBITDA, Free Cash Flow, organisches Wachstum). Achten Sie, welche Bereinigungen vorgenommen werden; eine wachsende Liste „ausgeschlossener" Posten ist gelbe Flagge.

### Item 8 — Jahresabschluss

**Was es ist:** die drei geprüften Tabellen — GuV, Bilanz, Kapitalflussrechnung — plus die Anhänge, die die Posten erläutern.

**Lesezeit:** 10 Minuten für die Tabellen, plus gezieltes Lesen der Anhänge.

**Worauf achten, in Prioritätsreihenfolge:**
1. **Kapitalflussrechnung.** Die am wenigsten manipulierbare Tabelle. Der Kopfteil des operativen Cashflows überleitet vom Jahresüberschuss zum operativen Cash — jeder Überleitungsposten ist eine Stelle, an der GAAP-Gewinn von der Cash-Realität abweicht. (Free Cash Flow = `OCF − Capex`; vgl. [Was ist Free Cash Flow?](/blog/what-is-fcf).)
2. **GuV.** Lesen Sie von oben nach unten und suchen Sie ausgeprägte Veränderungen in Brutto- und operativer Marge sowie ungewöhnliche Sondereffekte im operativen Ergebnis.
3. **Bilanz.** Konzentrieren Sie sich auf drei Zeilen: Zahlungsmittel und Äquivalente (zum Vorjahr), Gesamtschulden, Goodwill (groß oder wachsend = jüngste Übernahmen; prüfen, ob diese ihre Kapitalkosten verdienen).

### Item 1A — Risikofaktoren

**Was es ist:** die Risiken, die das Management offenlegen muss. Früher 5–10 Seiten Standardsprache; seit den SEC-Modernisierungsregeln von 2020 werden Unternehmen gedrängt, *spezifische* Risiken offenzulegen.

**Lesezeit:** 5–8 Minuten. Der Trick ist *Diffs* zu lesen — was ist neu gegenüber Vorjahr.

**Worauf achten:**
- **Neue Risikofaktoren**, die im Vorjahres-Filing fehlten. Sie haben fast immer Substanz. Ein Unternehmen fügt nicht beiläufig einen Risikofaktor hinzu — mehr Text bedeutet mehr Rechtsrisiko, also steht die neue Sprache da, weil Legal darauf bestand.
- Risiken im Zusammenhang mit **Kundenkonzentration** (ein Kunde >10 % des Umsatzes), Lieferkettenabhängigkeit, regulatorischen Änderungen oder Covenants-Compliance.
- Risiken, die das Unternehmen im *Plural* formuliert — „Rechtsstreitigkeiten" vs. „der Rechtsstreit" — deuten meist auf einen aktiven Disput hin.

PickSkill diffed Risikofaktoren automatisch gegen das Vorjahres-Filing und zeigt nur neue oder wesentlich geänderte Formulierungen. Das ist der signalstärkste Brocken in einem 10-K und der am leichtesten zu übersehende beim Lesen von oben nach unten.

### Die markierten Anhänge

**Was es ist:** 30–80 Seiten Detail hinter jedem Posten — Umsatzrealisierungspolitik, Segmentdefinitionen, Leasing, Steuerpositionen, Schuldenplan, aktienbasierte Vergütung, Verpflichtungen und Eventualverbindlichkeiten.

**Lesezeit:** gezielt — 5 Minuten für die 1–3 Anhänge, die Sie beim Lesen von Items 7 und 8 markiert haben.

**Worauf achten:**
- **Umsatzrealisierung** (meist Note 2). Subscription-Unternehmen müssen Leistungsverpflichtungen und Vertragsverbindlichkeiten ausweisen — diese sagen etwas über Backlog und Verlängerungsrisiko.
- **Schuldenplan.** Listet jede Fazilität, Zinssatz, Fälligkeit. Aus dieser Tabelle eine „Maturity Wall" zu zeichnen ist der sauberste Weg, Refinanzierungsrisiko zu bewerten.
- **Verpflichtungen und Eventualverbindlichkeiten.** Anhängige Rechtsstreitigkeiten, außerbilanzielle Verpflichtungen, Bestellobligo. Die spannendste Eventualverbindlichkeit ist die, zu der das Management knapp wird.
- **Ertragsteuern.** Überleitung vom gesetzlichen zum effektiven Satz. Große Abweichungen = intensive Steuerplanung; prüfen, ob die günstigen Posten nachhaltig sind.

## Der 30-Minuten-Workflow

Praktische Sequenz:

1. **2 Min — Deckblatt & Inhalt.** Bestätigen Sie den Berichtszeitraum, die Einreicherklasse (beeinflusst die Fristen) und lokalisieren Sie Items 7, 8 und 1A.
2. **15 Min — Item 7 MD&A.** Lesen Sie von oben bis unten. Markieren Sie alle Anhangsverweise, denen Sie nachgehen wollen. Unterstreichen Sie Zahlen, die Sie gegen Item 8 verifizieren wollen.
3. **10 Min — Item 8 Abschluss.** Zuerst Kapitalflussrechnung, dann GuV, dann Bilanz. Drei Zahlen ziehen: FCF, Nettoverschuldung, segmentweises Umsatzwachstum YoY.
4. **5 Min — Item 1A Diff.** Vergleichen Sie mit dem 10-K des Vorjahres und lesen Sie nur neue oder wesentlich geänderte Sprache.
5. **3 Min — gezielte Anhänge**, die Sie unterwegs markiert haben.

Item 1 (Business) auslassen, außer es ist Ihr erster Blick auf den Wert — meist stabiler Standardtext, der sich jahresweise wiederholt. Items 9–15 auslassen, außer aus konkretem Anlass (Vorstandsvergütung, Governance etc.).

## Typische Fehler beim 10-K-Lesen

Eine 134-Wörter-Checkliste, die man sich merken sollte:

1. **Item 1 von oben bis unten lesen.** Standardtext. Überspringen, außer es ist der erste Kontakt mit dem Unternehmen.
2. **Non-GAAP ohne Abstimmung glauben.** Suchen Sie immer die GAAP-zu-Non-GAAP-Überleitung (meist nach dem MD&A oder als Exhibit 99 zur Pressemitteilung). Die Größe der Brücke zeigt, wie viel das Management bereinigt.
3. **Den Auditbericht ignorieren.** Eine saubere Meinung ist ein Absatz; alles Längere ist gelbe Flagge (Critical Audit Matters, Einschränkungen, Going-Concern-Zweifel).
4. **Nur das aktuelle 10-K lesen.** Das Signal liegt im Diff zum Vorjahr. Risikofaktoren, MD&A-Sprache und Anhangsoffenlegungen sind erst gegen ihre Vorjahresbasis aussagekräftig.
5. **Den Proxy überspringen.** Der Proxy (DEF 14A) erklärt Vorstandsvergütung, Boardunabhängigkeit und Related-Party-Transaktionen — wesentlicher Kontext, den das 10-K nicht abdeckt.

## Wie PickSkill ein 10-K für Sie liest

Chat öffnen und tippen:

> *„Fass das aktuellste 10-K von NVDA zusammen — gib mir MD&A-Highlights, FCF, Nettoverschuldung, die wichtigsten Risikofaktor-Änderungen vs. Vorjahr und Anhänge, auf die ich schauen sollte."*

PickSkill zieht das aktuellste 10-K von [SEC EDGAR][edgar], extrahiert Items 7, 8 und 1A, rechnet den Risikofaktor-Diff gegen das Vorjahres-Filing, berechnet [FCF](/blog/what-is-fcf)- und [WACC](/blog/what-is-wacc)-Inputs (für ein [DCF](/blog/what-is-dcf), falls gewünscht) und liefert einen 90-Sekunden-Walkthrough, in dem jede Aussage zur Quellseite verlinkt ist. Insgesamt ~60 Sekunden.

Das ersetzt das eigene Lesen des Filings bei wichtigen Entscheidungen nicht. Es ist ein Weg, vorab zu wissen, welche 4 Sektionen tiefes Lesen verdienen und welche 100+ Seiten überflogen werden können.

## FAQ

**Worin unterscheidet sich ein 10-K vom 10-Q?**
Das 10-K ist die jährliche Einreichung — geprüft, umfassend, mit vollen Risikofaktoren und MD&A. Das 10-Q ist die Quartalseinreichung — ungeprüft, kürzer, das MD&A ist typischerweise ein Delta zum Vorquartal statt einer vollen Erzählung. Die meisten Profis lesen 10-Qs für das Cashflow-Update und das MD&A-Delta und reservieren das tiefe Lesen für das 10-K.

**Wann werden 10-Ks eingereicht?**
Die Frist hängt von der Einreicherklasse ab: Large Accelerated Filers (~$700M+ Public Float) innerhalb von 60 Tagen nach Geschäftsjahresende; Accelerated Filers innerhalb von 75 Tagen; Non-Accelerated Filers innerhalb von 90 Tagen. Die meisten US-Large-Caps haben ein Dezember-Geschäftsjahr und reichen das 10-K Ende Februar ein.

**Wo finde ich vergangene 10-Ks?**
[SEC EDGAR][edgar] ist das offizielle, kostenlose Archiv. Suche nach Firmennamen oder Ticker. Vergangene 10-Ks meist 20+ Jahre zurück. [PickSkill](/chat) zieht direkt von EDGAR — kein Drittdaten-Vermittler, Zahlen und Wortlaut entsprechen dem Filing.

**Ist die Auditmeinung immer zuverlässig?**
Eine saubere („uneingeschränkte") Meinung bedeutet, dass der Auditor die Aussagen in allen wesentlichen Punkten als sachgerecht betrachtet. Sie *zertifiziert nicht*, dass das Geschäft gesund ist — nur, dass die Buchführung GAAP-konform ist. Lesen Sie die 2019 eingeführte „Critical Audit Matters"-Sektion für die Punkte, die der Auditor als urteilsintensiv markiert hat.

**Wie spüre ich am schnellsten Bilanzierungs-Rote-Flaggen auf?**
Drei Signale aus der Kapitalflussrechnung: (1) wachsende Lücke zwischen Jahresüberschuss und operativem Cashflow, (2) operativer Cashflow zunehmend von Working-Capital-Releases abhängig (sinkende Forderungen, steigende Verbindlichkeiten), (3) Capex, der jahresweise stark gefallen ist. Keines allein ist konklusiv; kombiniert lohnen sie sich zu untersuchen.
