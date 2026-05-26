---
title: Wie man in 90 Sekunden ein Investor-Deck aus einem Chat erzeugt
description: >-
  Verwandeln Sie einen Research-Chat in eine folienfertige Investor-Präsentation
  — These, Finanzdaten, Vergleichswerte, Risiken. Ein Prompt, ein PPTX, jede
  Folie editierbar.
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
  - Investor-Deck
  - PowerPoint
  - Workflow
  - Präsentation
heroImage: /blog/generate-investor-deck-from-chat/hero.png
heroAlt: >-
  Editorial-Infografik — eine Chat-Prompt-Sprechblase fließt per Pfeil in eine
  fertige Investor-Deck-Folie und zeigt den Chat-zu-Deck-Workflow.
---

**Ein Investor-Deck destilliert eine Research-These in 10–15 Folien, die ein anderer Anleger in 5 Minuten lesen und sich eine Meinung dazu bilden kann.** Die Folien brauchen eine klare Thesenaussage, einige gut gewählte Charts, eine Bewertungs-Zusammenfassung und einen ehrlichen Risiko-Abschnitt. Dieses Tutorial führt durch das Erzeugen dieses Decks direkt aus einer PickSkill-Research-Konversation — jede Folie in der Arbeit verankert, die Sie bereits im Chat geleistet haben, jedes Chart gequellt, die `.pptx` bereit zum Herunterladen in 90 Sekunden.

Es ist ein 5-Schritte-Tutorial. Der längste Schritt ist derjenige, in dem Sie das eigentliche Investment-Urteil fällen. Alles andere ist mechanisch.

### Kernaussagen

- **5 Schritte, ~90 Sekunden.** Chat öffnen, These bauen, Deck anfragen, Prompt editieren, herunterladen.
- **Das Deck wird aus der Chat-Historie erzeugt** — jedes Chart im Deck zitiert den Moment der Konversation, in dem es besprochen wurde.
- **10–15 Folien standardmäßig.** Titel, These, Geschäftsüberblick, Finanzdaten, Bewertung, technisches Setup, Vergleichswerte, Szenarien, Risiken, Anhang.
- **Die Ausgabe ist eine echte `.pptx`-Datei** — jede Folie editieren, aus PowerPoint oder Keynote präsentieren, ohne Konvertierung teilen.
- **Funktioniert mit US-, HK- und A-Aktien-Werten.** Das Deck passt Offenlegungs-Konventionen je Markt an.

## Warum das wichtig ist

Das Investor-Deck-Format existiert aus einem Grund: Es zwingt den Analysten, die These in einer Struktur zu artikulieren, die schwache Glieder freilegt. Ein 15-seitiges Memo lässt Sie die Lücke zwischen „Ich mag diese Aktie" und „hier ist, warum jemand anders sich darum kümmern sollte" verstecken. Ein 12-Folien-Deck macht diese Lücken sofort sichtbar — und die Disziplin, eines zu produzieren, verbessert die zugrunde liegende Analyse, selbst wenn Sie das Deck nie jemandem zeigen.

Drei Zielgruppen profitieren:

- **Ein potenzieller Investor oder Partner.** Das Deck ist der effizienteste Weg, eine These für eine Zweitmeinung zu teilen.
- **Ein formelles Investmentkomitee.** Viele Investmentclubs, Family Offices und Studentenfonds verlangen für neue Positionen Präsentationen im Deck-Format.
- **Ihre eigene analytische Disziplin.** Das Schreiben des Decks ist der Test; das Teilen ist optional. Wenn sich eine These nicht sauber zu einem Deck verdichten lässt, hat die These üblicherweise versteckte Lücken, die es wert sind angegangen zu werden.

## Der 5-Schritte-Workflow

### Schritt 1 — Chat öffnen und die These aufbauen

Gehen Sie zu [/chat](/chat) und arbeiten Sie Ihr Research durch. Eine typische Thesen-aufbauende Konversation sieht so aus:

```text
Bau ein 5-Jahres-DCF für TSMC. Zeig mir die WACC-Sensitivität.
Was sagt das 10-K mir über die Bruttomarge-Entwicklung?
Vergleich gegen ASML und Lam Research bei EV/EBITDA und FCF-Wachstum.
Wie sieht das technische Setup gerade aus — MACD, RSI, MA-Stack?
```

Die genauen Prompts zählen weniger als die *Abdeckung*. Am Ende der Konversation sollten Sie haben:

- Eine Bewertungs-Lesart (DCF, Vergleichswerte oder beides)
- Eine Geschäfts- / Fundamentalsicht (Margenentwicklung, Wachstumstreiber, Bilanz)
- Eine Wettbewerbsposition (gegen 2–3 nächste Peers)
- Einen technischen Kontext (aktuelles Trendregime, Momentum, Schlüsselniveaus)

Wenn Sie das Fundament noch nicht gebaut haben, siehe [Ein DCF in 60 Sekunden bauen](/blog/build-dcf-in-60-seconds), [Ein 10-K in 60 Sekunden zusammenfassen](/blog/summarise-a-10k-in-60-seconds) und [Ein Portfolio mit Indikatoren verfolgen](/blog/track-a-portfolio-with-indicators) für die vorgelagerten Konversationen.

### Schritt 2 — Nach dem Deck fragen

Sobald Sie die These aufgebaut haben, bitten Sie PickSkill, das Deck zu erzeugen:

```text
Erzeuge ein 12-Folien-Investor-Deck aus dieser Konversation.
Beginne mit der These in einem Satz. Dann Geschäftsüberblick, Finanzdaten,
Bewertung (sowohl DCF als auch Vergleichswerte), technisches Setup, Szenarien (Bull/Basis/Bear),
Risiken und ein Anhang. Mach jede Folie präsentationsfertig.
```

Das ist die gesamte Eingabe. PickSkill verwendet die Konversationshistorie als Quellmaterial des Decks — jedes Chart, jede Tabelle und jeder Bullet lässt sich auf einen spezifischen Austausch im Chat zurückführen.

### Schritt 3 — Die Struktur vor der Erzeugung verfeinern

Bevor PickSkill sich zur Erzeugung committet, sehen Sie eine vorgeschlagene Folien-Gliederung. Häufige Bearbeitungen in dieser Phase:

- **Folien umordnen** — „verschiebe das technische Setup auf Folie 4, vor die Finanzdaten", wenn Sie vor einem Trader-Publikum präsentieren.
- **Folien streichen** — „überspringe die Vergleichswerte-Folie; mein Publikum interessiert sich nicht für relative Bewertung."
- **Folien hinzufügen** — „füge eine Folie zur Managementqualität und zur Kapitalallokationshistorie hinzu."
- **Tiefe anpassen** — „erweitere den Risiko-Abschnitt auf 2 Folien — erste Folie für fundamentale Risiken, zweite für technische / Marktstruktur-Risiken."

Das Gliederung-dann-Erzeugen-Muster spart einen Regenerationszyklus. Das volle Deck dauert 30–60 Sekunden zum Zusammenbauen; eine Iteration auf der Gliederung dauert 5 Sekunden.

### Schritt 4 — Warten, während PickSkill das Deck zusammenstellt

PickSkill tut der Reihe nach:

1. Kompiliert die für das Deck relevante Chat-Historie (filtert Nebenkonversationen und explorative Sackgassen heraus).
2. Zieht die neuesten Daten für jede referenzierte Metrik — Kurse, Finanzdaten, Multiples.
3. Rendert die Charts (Kurs + Technik, Bewertungsvergleich, Szenario-Fan) als eingebettete Bilder.
4. Erzeugt den Folieninhalt mit den Standardkonventionen für Investor-Decks: Thesenaussage auf Folie 2, Bewertungsrahmen explizit, Risiken als Pre-Mortem statt vergraben.
5. Komponiert die `.pptx` mit formatierten Titeln, Fußnoten mit Quellenangaben und einem abschließenden Anhang mit Datenherkunft.

Sie sehen eine Streaming-Zusammenfassung. Wenn fertig, erhalten Sie einen 7 Tage lang gültigen Download-Link.

### Schritt 5 — Beliebige Folie editieren, präsentieren, iterieren

Die heruntergeladene `.pptx` öffnet sich in PowerPoint, Keynote oder Google Slides. Jede Folie ist vollständig editierbar.

Für Deck-Level-Bearbeitungen kehren Sie in den Chat zurück:

```text
Mach Folie 8 (Szenarien) neu. Mach den Bull-Case aggressiver — schiebe die Year-3-
Umsatzwachstumsannahme auf 25% statt 15%. Zeig mir die neue DCF-Ausgabe.
```

```text
Füge eine Folie zwischen 5 und 6 hinzu mit der historischen EV/EBITDA-Range über die letzten
5 Jahre und wo das aktuelle Multiple sitzt.
```

```text
Mach eine 5-Minuten-Version dieses Decks — behalte nur den Titel, die These, die
Bewertungs-Zusammenfassung und die Risiken. Streiche alles andere.
```

PickSkill regeneriert mit der neuen Struktur.

> **Jetzt ausprobieren.** [Chat öffnen](/chat), eine These durchgehen und nach dem Deck fragen. Die gesamte Schleife dauert unter 2 Minuten.

## So sieht die Ausgabe aus

Die Standard-12-Folien-Struktur:

| Folie | Inhalt |
|---|---|
| **1. Titel** | Ticker, Firmenname, Vortragender, Datum, Ein-Satz-Schlagzeile |
| **2. These** | Die These in ≤30 Wörtern, das Kursziel / die Sicht in einem Satz, der Zeithorizont |
| **3. Geschäftsüberblick** | Umsatzaufteilung (Segmente / Geografien), Wettbewerbsposition, jüngste strategische Schritte |
| **4. Finanzdaten** | Letzte 4 Quartale Umsatz, EBIT-Marge, FCF, wichtige Trend-Callouts |
| **5. Bewertung — absolut** | DCF-Zusammenfassung mit Schlüsselannahmen, implizierter Kurs, Sensitivitäts-Raster |
| **6. Bewertung — relativ** | EV/EBITDA, KGV, KBV vs. Sektor / Peers; aktuell vs. historische Range |
| **7. Technisches Setup** | Kurs-Chart mit MA-Stack, aktueller MACD- / RSI-Status, Schlüssel-Unterstützungs- / Widerstands-Niveaus |
| **8. Szenarien** | Bull- / Basis- / Bear-Cases — jeder mit expliziten Annahmenänderungen und resultierendem Kursziel |
| **9. Risiken — fundamental** | Top-3-fundamentale Risiken (Margenkompression, Wettbewerb, Regulierung, Ausführung) |
| **10. Risiken — Markt** | Technische Risiken (überkauft, Divergenz, Schlüsselniveau-Brüche), Liquidität, Faktor-Exposure |
| **11. Schlussfolgerung** | Die Aktion — kaufen, halten, beobachten, vermeiden — mit Größen-Anleitung und Einstiegs-Disziplin |
| **12. Anhang** | Datenquellen, Methodik-Notizen, Disclaimer |

Die Folien verwenden ein konsistentes typografisches System und eine markenkonforme Farbpalette, ausgelegt auf Lesbarkeit in einem Meeting-Setting (≥18pt Body-Text, kontrastreiche Charts).

## Was Sie in 90 Sekunden nicht hinbekommen

Ehrliche Vorbehalte:

- **Originale Primärforschung.** Das Deck baut auf PickSkills Datenquellen und der Arbeit in Ihrem Chat. Wenn Ihre These von einem Primärforschungs-Interview abhängt (ein Channel-Check mit einem Kunden, ein Gespräch mit einem ehemaligen Mitarbeiter), muss dieser Inhalt manuell ergänzt werden.
- **Stark angepasste Bewertungsmodelle.** Ein Standard-DCF, eine relative Bewertung oder ein Sum-of-the-Parts-Rahmen funktioniert out-of-the-box. Ein Real-Options-Modell für eine Biotech-Pipeline oder ein regulierter Utility-DCF mit Rate-Base-Mechanik erfordert mehr Custom-Konversation im Vorfeld.
- **Compliance-konforme rechtliche Offenlegung.** Der Anhang enthält einen einfachen Disclaimer. Wenn Sie das Deck in einem regulierten Kontext verwenden (registrierter Anlageberater, Fondsmanager), muss die Compliance-Sprache von einem Anwalt geprüft werden — PickSkill ist keine Rechtsberatung.

## Häufige Follow-up-Prompts

- *„Mach eine One-Pager-Version dieses Decks — einzelne Folie, Executive-Summary-Format."*
- *„Erzeuge dasselbe Deck für den nächsten Wettbewerber, nebeneinander vergleichen."*
- *„Übersetze das Deck auf Mandarin / Japanisch / Deutsch für ein nicht-englischsprachiges Publikum."*
- *„Wandle die Folie zum technischen Setup in eine Multi-Zeitrahmen-Ansicht — Tages-, Wochen-, Monats-Charts."*
- *„Füge eine ‚Fragen, die ich vom Publikum erwarte'-Folie am Ende mit vorbereiteten Antworten hinzu."*

## FAQ

**Wie unterscheidet sich das vom Portfolio-Export-PPT?**
Der [Portfolio-Export](/blog/export-portfolio-to-powerpoint) erzeugt ein Deck *aus den Daten* — Positionen, Indikatoren, Bewertungs-Snapshots, alles in einer Standardstruktur gerendert. Dieses Tutorial erzeugt ein Deck *aus einer Thesen-Konversation* — der Folieninhalt wird durch das geformt, was Sie tatsächlich recherchiert und argumentiert haben, nicht durch ein festes Template. Verwenden Sie den Portfolio-Export für periodische Positions-Reviews; verwenden Sie den Chat-zu-Deck-Flow für Pitches neuer Positionen.

**Zitiert das Deck spezifische Momente im Chat?**
Ja — Anhang-Fußnoten und Chart-Beschriftungen verweisen auf die Prompt-und-Antwort-Momente, in denen der Inhalt entstand. Das macht es einfach, die analytische Kette beim Verteidigen einer Folie zurückzuverfolgen, und es macht das Deck für jeden, der Ihre Arbeit prüft, nachvollziehbar.

**Kann ich das Deck in einer anderen Sprache erzeugen?**
Ja — fügen Sie „auf [Sprache]" zum Prompt in Schritt 2 hinzu. PickSkill unterstützt die 8 Locales, die über die Plattform verwendet werden. Charts, Folientitel, Body-Text und Fußnoten werden übersetzt; Datenwerte und Ticker-Symbole bleiben in ihrer nativen Form.

**Was, wenn meine These von etwas abhängt, das nicht in der Konversation ist?**
Fügen Sie es vor der Erzeugung hinzu: „Beachte, dass ich separat über Primärforschung bestätigt habe, dass Kunde Y bis Ende Q3 auf Produkt Z migriert." PickSkill nimmt die Ergänzung als attribuierten Bullet in die relevante Folie auf. Alles, was nicht in der Konversation steht, ist per Design nicht im Deck — das Deck ist im Chat verankert.

**Wie vergleicht sich das mit der Verwendung von ChatGPT oder Claude direkt zum Schreiben eines Decks?**
Der Unterschied liegt in der *Verankerung*. PickSkills Chat hat bereits die Live-Filings gezogen, das DCF berechnet, die Indikatoren ausgeführt und Vergleichswerte gezogen. Die Deck-Komposition basiert auf diesen gequellten Primitiven, nicht auf dem allgemeinen Wissen des Modells. Das Ergebnis ist materiell weniger anfällig für erfundene Zahlen oder veraltete Daten, was der Versagensmodus generischer Chatbot-getriebener Deck-Erzeugung ist.

**Kann ich das Deck speichern und später zurückkehren, um es zu aktualisieren?**
Ja — die Chat-Sitzung persistiert. Öffnen Sie die Konversation erneut und fragen Sie „regeneriere das Deck mit den heutigen Daten und füge eine Folie für die neue Earnings-Veröffentlichung hinzu" — PickSkill baut das Deck mit dem neuen Kontext über die ursprüngliche These geschichtet neu.
