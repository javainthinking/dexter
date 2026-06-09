---
title: 'Von Dexter zu PickSkill: Bauen auf einem Open-Source-Agenten'
description: >-
  Wie wir PickSkill auf Dexter, dem Open-Source-Finanzagenten, gebaut haben —
  mit Web-App, Word-/PowerPoint-/Excel-Generierung und einer 8-Indikatoren-Portfolio-Suite.
publishedAt: 2026-06-09
updatedAt: 2026-06-09
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: Das PickSkill-Research-Team — wir bauen einen AI-Analysten für Privatanleger.
pillar: build-in-public
tags:
  - open-source
  - dexter
  - ai-analyst
  - architecture
  - build-in-public
heroImage: /blog/from-dexter-to-pickskill/hero.png
heroAlt: >-
  Editorial-Infografik — ein Vorher/Nachher-Architekturdiagramm, das links
  Dexter, den Open-Source-CLI-Agenten, zeigt, der in die PickSkill-Web-App
  rechts überfließt, mit neuen Schichten für die Office-Datei-Generierung und
  die Portfolio-Indikator-Suite.
---

**PickSkill begann als Fork von [Dexter](https://github.com/virattt/dexter), dem autonomen Open-Source-Finanzagenten von [@virattt](https://twitter.com/virattt) — „Claude Code, aber gebaut für Finanz-Research".** Dexter gab uns eine kampferprobte Agenten-Schleife: ein CLI-Werkzeug, geschrieben in TypeScript mit Ink und LangChain, das eine Finanzfrage in einen Research-Plan zerlegt, Werkzeuge gegen Live-Marktdaten ausführt, die eigene Arbeit prüft und iteriert, bis eine quellenbelegte Antwort vorliegt. Wir nahmen diesen Kern und bauten nach außen — eine browser-native Web-App, native Word-/PowerPoint-/Excel-Generierung, Portfolio-Verwaltung und eine technische Indikator-Suite mit acht Dimensionen. Dieser Beitrag ist der ehrliche Build-in-public-Bericht darüber, was wir behalten, was wir hinzugefügt und warum.

### Kernaussagen

- **PickSkill ist auf Dexter gebaut**, dem Open-Source-Finanzagenten (MIT-lizenziert, [github.com/virattt/dexter](https://github.com/virattt/dexter)). Wir behielten die Agenten-Schleife; fast alles drumherum haben wir neu gebaut.
- **Die größte einzelne Änderung war die Oberfläche.** Dexter ist ein CLI; PickSkill ist eine mehrsprachige Web-App unter [pickskill.ai](https://pickskill.ai). Die Agenten-Laufzeit ist geteilt; das Interaktionsmodell nicht.
- **Wir haben native Office-Generierung hinzugefügt** — der Agent schreibt jetzt echte `.docx`-, `.pptx`- und `.xlsx`-Dateien, keine Screenshots oder Markdown-Dumps.
- **Wir haben Portfolio-Verwaltung und ein Acht-Indikatoren-Dashboard hinzugefügt** — MACD, MA-Stack, RSI, KDJ, Bollinger Bands, ADX/DMI, Volumen und Geldfluss, jeweils mit einer [5-Tage-Signalspur](/blog/5-day-signal-trail).
- **Wir haben die Abdeckung auf US-, Hongkong- und A-Aktien-Märkte erweitert** mit marktspezifischen Konventionen — einschließlich der Maskierung von A-Aktien-Limit-up-/Limit-down-Bars, damit sie keine falschen Signale auslösen.

## Was ist Dexter, und warum von Open Source starten?

Dexter ist ein Open-Source-AI-Agent für tiefe Finanz-Research, geschrieben in TypeScript mit Ink (React für das Terminal) und LangChain. Seine Design-These ist einfach: Nimm eine komplexe Finanzfrage, verwandle sie in einen Schritt-für-Schritt-Research-Plan, führe jeden Schritt mit dem richtigen Werkzeug gegen Live-Daten aus, validiere selbst und verfeinere, bis die Antwort sicher und quellenbelegt ist. Es läuft in einem Terminal, protokolliert jeden Werkzeugaufruf in einem Scratchpad und persistiert Modell- und Provider-Auswahl in einer lokalen Konfiguration. Das Repository ist MIT-lizenziert und öffentlich auf [GitHub](https://github.com/virattt/dexter).

Von Dexter aus zu starten statt bei null war eine bewusste GTM-Entscheidung. Der schwerste Teil eines Analysten-Agenten ist nicht die Chatbox — es ist die Schleife, die plant, Werkzeuge aufruft und Live-Finanzdaten abgleicht, ohne Zahlen zu halluzinieren. Dexter hatte diese Schleife bereits offen gelöst. Darauf zu bauen bedeutete, dass wir unsere ersten Monate auf die *Produktoberfläche* verwenden konnten — die Web-App, die Datei-Ausgaben, die Portfolio-Schicht — statt Agenten-Klempnerei neu herzuleiten, die ein starkes Open-Source-Projekt bereits bewiesen hatte.

## Was wir auf Dexter aufgesetzt haben

Die Tabelle unten bildet die Vererbung ab. Die linke Spalte ist Dexters Beitrag; die rechte Spalte ist, was PickSkill hinzugefügt hat, um daraus ein Consumer-Produkt zu machen.

| Schicht | Von Dexter (Open Source) | Von PickSkill hinzugefügt |
|---|---|---|
| **Agenten-Schleife** | Aufgabenplanung, Werkzeugausführung, Selbstreflexion, Scratchpad-Logging | Mandantenfähiger Sitzungszustand, Quota + Billing, Erinnerung über Sitzungen hinweg |
| **Oberfläche** | Interaktives CLI (Ink/React-im-Terminal) | Browser-Web-App, 8 Locales, Mobile-Layout, teilbare Links |
| **Daten** | Live-Finanzen + Marktdaten | US- + Hongkong- + A-Aktien-Abdeckung, Limit-Bar-Maskierung, Geldfluss-Proxy |
| **Ausgabe** | Terminal-Text + Scratchpad-JSONL | Native `.docx` / `.pptx` / `.xlsx` via OfficeCLI über vorsignierte Links |
| **Analyse** | On-Demand-Finanzschlussfolgerungen | [/portfolios](/portfolios)-Verwaltung + [/indicators](/indicators)-Dashboard mit 8 Dimensionen |

Das Muster in dieser Tabelle ist die ganze Strategie: den bewährten Kern behalten, alles produktisieren, was ein Privatanleger berührt.

## Wie die Web-Version die Architektur veränderte

Der Wechsel von einem CLI zu einer Web-App ist kein UI-Reskin — er ändert das Threading-Modell. Ein CLI-Agent besitzt das Terminal: ein Benutzer, eine Sitzung, blockierende Ausgabe, lokale Dateien. Ein Web-Agent bedient viele Benutzer gleichzeitig, streamt Teilausgaben an einen Browser, persistiert die Sitzungshistorie serverseitig und schreibt Artefakte in Objektspeicher statt auf die lokale Festplatte.

Während also die *Agenten-Schleife* von Dexter geerbt ist, ist die Laufzeit darum herum neu. Sitzungen sind mandantenfähig und fortsetzbar — Sie können den Tab schließen und dasselbe Research-Gespräch später wieder aufnehmen. Werkzeugausgaben streamen in den Browser, während sie geschehen, genauso wie Dexter ins Terminal streamt. Und generierte Dateien landen auf Cloudflare R2 als 7-Tage-vorsignierte Download-Links statt in einem lokalen Verzeichnis, weil ein Web-Benutzer keine Shell hat, um eine Datei mit `cat` auszugeben. Die ehrliche Einordnung: Dexter gab uns das Gehirn; die Web-App ist ein neuer Körper, gebaut, um es zu nicht-technischen Benutzern zu tragen.

> **Sehen Sie es laufen.** Öffnen Sie [/chat](/chat) und stellen Sie eine beliebige Finanzfrage — die Agenten-Schleife, mit der Sie sprechen, ist Dexters, produktisiert für den Browser.

## Warum Office-Datei-Generierung wichtig ist

Die mit Abstand am häufigsten gewünschte Fähigkeit, die Dexters CLI nicht hatte, waren *Lieferobjekte*. Eine Terminal-Antwort ist großartig für die Person, die die Abfrage gestartet hat; sie ist nutzlos für die Kollegin, den Investmentclub oder das Interview-Komitee, das etwas braucht, das es öffnen kann. Retail- und Semi-Pro-Analysten leben in Word, PowerPoint und Excel — diese drei Formate sind die universelle Austauschschicht der Finanzwelt.

Also fügten wir OfficeCLI hinzu: Der Agent kompiliert seine Analyse jetzt in native OpenXML-Dateien. Keine Screenshots, keine PDFs, kein Markdown — echte `.docx`-Memos mit Überschriften und Tabellen, echte `.pptx`-Decks mit eingebetteten Charts und editierbaren Folientiteln und echte `.xlsx`-Arbeitsmappen mit Live-Formeln über mehrere Tabellenblätter und bedingter Formatierung. Jede Datei wird als 7-Tage-vorsignierter Link ausgeliefert. Wir haben drei Schritt-für-Schritt-Anleitungen für die häufigsten Abläufe geschrieben: [Portfolio nach PowerPoint exportieren](/blog/export-portfolio-to-powerpoint), [Report nach Excel exportieren](/blog/export-portfolio-report-to-excel) und [Investor-Deck aus einem Chat erzeugen](/blog/generate-investor-deck-from-chat).

## Portfolio-Verwaltung und die Acht-Indikatoren-Suite

Dexter beantwortet Fragen einzeln. PickSkill fügt *fortlaufende* Analyse hinzu: ein Portfolio, das Sie unter [/portfolios](/portfolios) pflegen, und ein Indikator-Dashboard unter [/indicators](/indicators), das kontinuierlich über jede Position läuft. Das Dashboard berechnet acht technische Dimensionen auf dem aktuellsten Schluss:

1. **MACD** — Momentum und Crossover-Zustand ([was ist MACD](/blog/what-is-macd))
2. **Gleitende Durchschnitte** — MA5 / MA20 / MA60-Stack und [Goldenes / Todeskreuz](/blog/what-is-golden-cross-death-cross)
3. **RSI(14)** — überkauft / überverkauft ([was ist RSI](/blog/what-is-rsi))
4. **KDJ(9,3,3)** — stochastisches Momentum, beliebt bei A-Aktien ([was ist KDJ](/blog/what-is-kdj))
5. **Bollinger Bands(20,2)** — Volatilitäts-Hülle ([was sind Bollinger Bands](/blog/what-is-bollinger-bands))
6. **ADX/DMI(14)** — Trendstärke ([was ist ADX](/blog/what-is-adx))
7. **Volumen- / Kurs-Beziehung** ([Volumenanalyse](/blog/what-is-volume-analysis))
8. **Geldfluss-Proxy** ([was ist Geldfluss](/blog/what-is-capital-flow))

Jede Dimension wird mit einer [5-Tage-Signalspur](/blog/5-day-signal-trail) ausgeliefert — fünf Punkte, die zeigen, wie sich die Bucket-Einstufung über die Handelswoche entwickelt hat, sodass Sie die Trajektorie lesen, nicht nur die heutige Momentaufnahme. Und weil wir A-Aktien abdecken, erkennt das Dashboard Limit-up- / Limit-down- / Halt-Bars (wo das Hoch gleich dem Tief ist) und maskiert sie als neutral, sodass ein degenerierter Bar nie ein falsches bullishes oder bearishes Signal erzeugt.

## Was wir von Dexter behielten — und was wir änderten

Wir behielten die Philosophie, die Dexter definiert: quellenbelegte Ausgabe oder es ist nicht passiert, editierbare Annahmen statt Blackbox-Antworten und eine selbstvalidierende Agenten-Schleife. Diese Prinzipien bilden direkt unser GTM-Versprechen ab — *PickSkill ist der AI-Analyst, der Aktienarbeit in einfachem Deutsch recherchiert, modelliert und entwirft.*

Was wir änderten, ist alles, was ein nicht-technischer Benutzer berührt. Die Provider-Schicht wurde generalisiert — Dexter unterstützt mehrere Modell-Provider, und PickSkill wird mit OpenAIs gpt-5.5-Familie als Standard ausgeliefert, unterstützt aber Anthropic, Google Gemini, xAI und lokales Ollama über dieselbe Agenten-Oberfläche. Wir fügten Billing, Erinnerung, mehrsprachige UI und die Lieferobjekt-Schicht hinzu. Für das größere Bild davon, wo AI in der Aktien-Research heute tatsächlich Hebel liefert, siehe [KI für Aktienforschung 2026](/blog/ai-for-stock-research-2026).

## Was als Nächstes kommt

Ein paar Punkte auf der öffentlichen Roadmap, im selben Build-in-public-Geist:

- **Geplante Re-Exporte** — eine Portfolio-Arbeitsmappe oder ein Deck in einem Takt automatisch auffrischen und an Sie ausliefern, statt den Prompt von Hand erneut auszuführen.
- **Earnings-Call-Transkriptextraktion** — der Q&A-Abschnitt, in dem das zukunftsgerichtete Signal lebt, nicht nur die vorbereiteten Anmerkungen.
- **Mehr Märkte** — Tokio und Indien als Nächstes, jeweils eine 2–3-monatige Integration, um den Filing-Extraktor und die Indikator-Konventionen richtig hinzubekommen.

Wenn es eine Workflow-Lücke gibt, die Sie geschlossen sehen wollen, [sagen Sie es uns](/feedback) — die Roadmap reagiert darauf, was Benutzer tatsächlich brauchen.

## FAQ

**Ist PickSkill dasselbe wie Dexter?**
Nein. PickSkill ist auf Dexters Open-Source-Agenten-Schleife gebaut, ist aber ein eigenständiges Produkt. Dexter ist ein CLI-Research-Werkzeug für Entwickler; PickSkill ist eine gehostete Web-App mit Accounts, Billing, Portfolio-Verwaltung, Office-Datei-Generierung und Multi-Markt-Abdeckung. Wir behielten Dexters Agenten-Kern und seine „quellenbelegte Ausgabe"-Philosophie und bauten dann ein Consumer-Produkt darum herum.

**Ist Dexter Open Source, und kann ich es direkt verwenden?**
Ja. Dexter ist MIT-lizenziert und öffentlich unter [github.com/virattt/dexter](https://github.com/virattt/dexter). Sie können es klonen, in Ihrem Terminal ausführen und heute für Finanz-Research verwenden. PickSkill existiert für Menschen, die dieselbe Agenten-Power ohne das Ausführen eines CLI wollen — im Browser, mit Lieferobjekten und einer Portfolio-Schicht.

**Was hat PickSkill tatsächlich auf Dexter aufgesetzt?**
Vier wesentliche Schichten: eine mehrsprachige Web-App-Oberfläche, native Word-/PowerPoint-/Excel-Generierung via OfficeCLI, Portfolio-Verwaltung mit einem Acht-Indikatoren-Dashboard und 5-Tage-Signalspur sowie US-/HK-/A-Aktien-Marktabdeckung mit Limit-Bar-Maskierung. Die zugrunde liegende Plan-Ausführen-Validieren-Agenten-Schleife ist von Dexter geerbt.

**Welche AI-Modelle verwendet PickSkill?**
Der Standard ist OpenAIs gpt-5.5-Familie. PickSkill unterstützt außerdem Anthropic, Google Gemini, xAI und lokale Ollama-Modelle über dieselbe Agenten-Oberfläche und erbt damit Dexters Multi-Provider-Design. Die Modellwahl ändert den Workflow nicht — quellenbelegte Ausgabe und editierbare Annahmen gelten über alle Provider hinweg.

**Warum auf einem bestehenden Open-Source-Projekt bauen statt bei null anfangen?**
Der schwere Teil eines Analysten-Agenten ist die Schleife, die plant, Werkzeuge aufruft und Live-Daten abgleicht, ohne zu halluzinieren — Dexter hatte das bereits offen bewiesen. Darauf zu bauen ließ uns unsere frühen Monate auf die Produktoberfläche verwenden, die echte Benutzer berühren (Web-App, Office-Dateien, Portfolio-Dashboard), statt Agenten-Klempnerei neu herzuleiten.
