---
title: Was ist DCF? Praktischer Leitfaden zum Discounted Cash Flow
description: Praktischer DCF-Leitfaden — Formel, die vier Annahmen mit Bewertungs-Hebel, häufige Fallstricke, wie man sein erstes Modell in einer Stunde baut.
publishedAt: 2026-05-21
updatedAt: 2026-05-21
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: Das PickSkill-Research-Team — wir bauen einen AI-Analysten für Privatanleger.
pillar: explainer
tags:
  - valuation
  - dcf
  - fundamentals
heroImage: /blog/what-is-dcf/hero.png
heroAlt: Editoriale Illustration einer stilisierten Cashflow-Zeitachse in warmen dunklen Tönen mit smaragdgrünen Akzenten
---

**Discounted Cash Flow (DCF)** ist eine Bewertungsmethode, die den heutigen Wert eines Unternehmens schätzt, indem sie sämtliches Cash, das es voraussichtlich in der Zukunft generiert, addiert und mit einem Zinssatz abzinst, der das Risiko widerspiegelt, dieses Cash nicht tatsächlich zu erhalten. In einem Satz: DCF beantwortet die Frage „Was ist das Geschäft heute wert, angesichts des Cashs, das es morgen wahrscheinlich abwirft?"

Es ist die meistgelehrte Bewertungsmethode in Equity Research, Investment Banking und Corporate Finance — und gleichzeitig die am häufigsten falsch eingesetzte. Dieser Leitfaden behandelt die Formel, die vier wirklich relevanten Annahmen, die Stolpersteine für Anfänger und eine 60-Sekunden-Version: wie PickSkill auf Abruf ein DCF baut.

### Kernaussagen

- **DCF = Barwert der zukünftigen freien Cashflows.** FCF für 5–10 Jahre projizieren, jedes Jahr mit dem WACC abzinsen, einen Terminal Value addieren, summieren.
- **Vier Annahmen erledigen 95% der Arbeit**: Umsatzwachstum, terminale EBIT-Marge, WACC und Terminal-Value-Methode.
- **Der Terminal Value macht 60–80% des Gesamt-EV** in einem typischen 5-Jahres-DCF aus — die Annahme nach der Prognoseperiode dominiert die Antwort.
- **Eine WACC-Verschiebung um 100 bp bewegt den Enterprise Value um 8–15%.** Eine WACC × terminale Wachstumsrate Sensitivitätstabelle ist Pflicht.
- **PickSkill baut auf Basis von SEC-Filings in 60–90 Sekunden ein erstes DCF**; jede Annahme ist editierbar und mit Quelle.

## Wie lautet die DCF-Formel?

Die Standardform:

```
Enterprise Value = Σ ( FCFₜ / (1 + WACC)ᵗ )  +  Terminal Value / (1 + WACC)ⁿ
```

Übersetzt: Projizieren Sie unverschuldete Free Cash Flows (FCF) für jedes Jahr des expliziten Prognosezeitraums (üblicherweise 5–10 Jahre), zinsen Sie jedes Jahr mit dem gewichteten Kapitalkosten (WACC) auf heute ab, und addieren Sie einen Terminal Value, der alles danach abbildet.

Zwei Spielarten dominieren in der Praxis:

| Spielart | Was wird abgezinst | Was ergibt sich |
|---|---|---|
| **Unverschuldetes DCF (FCFF)** | Free Cash Flow to the Firm | **Enterprise Value** — durch die Aktienzahl teilen und Nettoverschuldung abziehen → geschätzter intrinsischer Aktienkurs |
| **Verschuldetes DCF (FCFE)** | Free Cash Flow to Equity | **Eigenkapitalwert** direkt — keine Notwendigkeit, Schulden separat herauszurechnen |

Unverschuldet ist im Equity Research der Standard, weil es operative Performance und Kapitalstruktur trennt. Verschuldete DCFs tauchen häufiger in Private-Equity-LBO-Modellen auf.

## Warum DCF wichtig ist

Drei Gründe, warum man es trotz aller Kritik weiter benutzt:

1. **Es ist ein Denkrahmen, nicht nur eine Zahl.** Ein DCF zu bauen zwingt Sie, die Annahmen über ein Geschäft explizit zu machen — Umsatzwachstum, Margenpfad, Kapitalintensität, Kapitalkosten. Selbst wenn die Ausgabe falsch ist, ist das Gespräch über die Annahmen wertvoll.
2. **Es verankert Kursziele.** Die meisten Sell-Side- und Buy-Side-Analysten triangulieren ihr Kursziel als Durchschnitt aus DCF, Peer-Multiples und Vorgängertransaktionen. Das DCF ist das fundamental rigoroseste Bein.
3. **Es legt offen, was der Markt implizit annimmt.** Ein Reverse DCF — die Wachstumsrate herauslösen, die den heutigen Kurs rechtfertigt — sagt Ihnen, ob der Markt ein Wunder oder eine Katastrophe einpreist.

## Die vier Annahmen, auf die es wirklich ankommt

Die meisten DCF-Meinungsverschiedenheiten reduzieren sich auf eine dieser vier Zahlen. Verbringen Sie Ihre Zeit hier.

### 1. Umsatzwachstum Jahre 1–5

Zwei häufige Fehlerquellen. Bullische Modellierer extrapolieren das jüngste Wachstum unbegrenzt; bärische kehren ab Jahr drei zu BIP-Wachstum zurück. Die ehrliche Version trianguliert mit einem Unit-Economics-Aufbau (Preis × Menge × geografischer Mix) und stresst beide Richtungen.

### 2. Verlauf der operativen Marge

Die Annahme mit der größten Hebelwirkung bei wachstumsstarken Unternehmen. Ein 50-bp-Shift bei der terminalen EBIT-Marge kann ein Software-DCF um 30%+ bewegen. Zeigen Sie immer die angenommene terminale Marge und vergleichen Sie mit den reifen Peers des Unternehmens.

### 3. WACC (der Diskontsatz)

Die vom Markt geforderte Rendite für die Übernahme des Geschäftsrisikos. Formal:

```
WACC = (E/V) × Re  +  (D/V) × Rd × (1 − Steuer)
```

Wobei `Re` die Eigenkapitalkosten sind (meist über CAPM: risikofreier Zins + β × Marktrisikoprämie), `Rd` die Vorsteuer-Fremdkapitalkosten, und `E/V` sowie `D/V` die Eigenkapital- und Fremdkapitalgewichte der Kapitalstruktur. Eine 100-bp-Verschiebung des WACC bewegt den Enterprise Value bei einem 5-Jahres-DCF typischerweise um 8–15% (PickSkill-Analyse über etwa 200 Large-Cap-Modelle aus 2025). Die WACC × terminale Wachstumsrate Sensitivitätstabelle ist die nützlichste Darstellung in einem DCF — ein Beispiel auf dem [Indikatoren-Dashboard][indicators].

[indicators]: /indicators

### 4. Terminal Value

In einem 5-Jahres-DCF macht der Terminal Value in der Regel 60–80% des gesamten Enterprise Value aus (typische Spanne bei S&P 500 Large Caps; das [Damodaran-Datenset der NYU Stern][damodaran] veröffentlicht die zugrunde liegenden Daten quartalsweise). Also dominiert die Annahme darüber, was nach Jahr 5 passiert, das Ergebnis. Zwei Ansätze:

[damodaran]: https://pages.stern.nyu.edu/~adamodar/

- **Gordon Growth (ewige Rente)**: `TV = FCFn+1 / (WACC − g)`. Einfach, aber empfindlich gegenüber dem Spread `(WACC − g)` — eine 50-bp-Verschiebung auf einer Seite kann den TV um 20%+ bewegen.
- **Exit-Multiple**: `TV = EBITDA × Multiple`. Leichter zu verteidigen („Vergleichsunternehmen handeln heute mit 12× EBITDA"), aber fixiert das aktuelle Marktumfeld ein.

Anspruchsvolle DCFs berichten beide Methoden und verwenden den Spread als Plausibilitätscheck.

## Häufige Fallstricke (die, die Modelle leise sprengen)

Eine 134-Wort-Checkliste, die man im Kopf haben sollte:

1. **Doppelte Erfassung des Working Capital.** Wenn Ihr FCF die Working-Capital-Veränderungen bereits enthält, ziehen Sie sie in der EV-zu-Eigenkapital-Brücke nicht erneut ab.
2. **Nominal- und Realzins vermischt.** Nominale Cashflows mit einem realen WACC abzinsen überschätzt den Wert pro Prognosejahr um etwa 2–3%.
3. **Veraltetes Beta.** Ein 5-Jahres-Monatsbeta für ein Unternehmen, das gerade sein Geschäftsmodell gepivotet hat, ist nicht mehr informativ.
4. **Konstante Capex während eines Wachstumsumbruchs.** Ein reifes SaaS-Unternehmen, das von eigenen Rechenzentren auf Cloud wechselt, sollte sinkende Capex haben — modellieren Sie das.
5. **Aktienbasierte Vergütung (SBC) ignorieren.** SBC als non-cash add-back zu behandeln, ohne die Verwässerung zu modellieren, bläht das Ergebnis bei Tech-Werten um 5–15% auf.

## So bauen Sie Ihr erstes DCF in unter einer Stunde

Pragmatische Reihenfolge für Einsteiger:

1. **3 Jahre historische Finanzdaten ziehen.** GuV, Bilanz, Cashflow-Rechnung. [SEC EDGAR][edgar] ist kostenlos; [PickSkill][chat] zieht sie automatisch.

[edgar]: https://www.sec.gov/edgar
[chat]: /chat

2. **Historischen Free Cash Flow berechnen.** Operativer Cashflow − Capex = FCF. Plotten Sie es.
3. **5 Jahre projizieren.** Umsatzwachstum, EBIT-Marge, Steuerquote, Capex als % vom Umsatz, Working-Capital-Veränderungen. Eine Annahme pro Zeile mit Kommentar zur Begründung.
4. **WACC wählen.** In einer seriösen Quelle nachschlagen (das [Damodaran-Datenset der NYU Stern][damodaran] ist Goldstandard, quartalsweise aktualisiert mit risikofreien Zinsen, Marktrisikoprämien und Branchen-Betas) oder via CAPM mit aktuellen Staatsanleiherenditen ableiten.
5. **Terminal-Value-Methode wählen** — probieren Sie sowohl Gordon Growth als auch Exit-Multiple, berichten Sie beide.
6. **Sensitivitätstabelle laufen lassen.** WACC auf einer Achse (±150 bp um Ihre Basis), terminale Wachstumsrate oder Exit-Multiple auf der anderen. Die Zelle Ihrer Basisannahme markieren.
7. **200-Wort-Kommentar schreiben**, was wahr sein müsste, damit das Ergebnis stimmt.

Schritt 7 ist es, was ein Modell, das eine Entscheidung informiert, von einem trennt, das eine Entscheidung nur dekoriert.

## Wie PickSkill ein DCF auf Abruf baut

Öffnen Sie einen Chat und tippen Sie etwa:

> *„Bau ein DCF für NVDA in Excel — Annahmenblatt, 5-Jahres-FCF-Prognose, WACC + Sensitivität, Bewertungsübersicht."*

PickSkill zieht die Historie aus SEC-Filings + Marktdaten, wählt sinnvolle Defaults für jede der vier Annahmen oben (mit Quellen), führt die Rechnung aus, legt das Ergebnis in eine herunterladbare Excel-Datei und führt Sie im Chat durch die Annahmen. Das erste DCF dauert 60–90 Sekunden.

Das Modell ist keine Blackbox — jede Annahme ist editierbar, jede Zahl ist mit Quelle versehen, und Sie können Folgefragen stellen wie *„heb das Umsatzwachstum in Jahr 2 auf 25% und lass die Sensitivität neu laufen"*, ohne Excel zu öffnen.

> **Ihr erstes DCF bauen.** Öffnen Sie [/chat](/chat) und fragen Sie nach einem DCF für einen beliebigen Ticker — PickSkill liefert ein gequelltes Excel-Modell in 60 Sekunden. [Tutorial](/blog/build-dcf-in-60-seconds).

## FAQ

**Was ist der Unterschied zwischen DCF und NPV?**
Der Nettobarwert (NPV) ist die allgemeine Technik, künftige Cashflows auf heute abzuzinsen. Das DCF ist die Anwendung des NPV auf die Bewertung eines gesamten Unternehmens. Gleiche Mathematik, engerer Anwendungsbereich.

**Ist DCF für Tech-Unternehmen noch relevant?**
Ja, mit Anpassungen. Behandeln Sie aktienbasierte Vergütung als realen Kostenposten (nicht als Non-Cash-Add-back). Verwenden Sie längere explizite Prognosezeiträume (7–10 Jahre), um die Wachstumsrampe abzubilden. Tabellieren Sie die Sensitivität bei der terminalen Marge großzügig — dort liegt der Wert.

**Warum bewegt ein kleiner WACC-Wechsel das Ergebnis so stark?**
Das DCF kompoundiert den Diskont über die Prognoseperiode. Eine 100-bp-Verschiebung des WACC verschiebt den abgezinsten Cashflow jedes Jahres, und der Effekt kompoundiert — typischerweise 8–15% beim Enterprise Value für ein 5-Jahres-DCF.

**Sollte ich unverschuldetes oder verschuldetes DCF benutzen?**
Unverschuldet (FCFF) in den meisten Equity-Research-Kontexten, weil es Operatives von Kapitalstrukturentscheidungen trennt. Verschuldet (FCFE), wenn die Kapitalstruktur selbst Gegenstand der Analyse ist — LBOs, Recap-getriebene Thesen, alles wo sich der Verschuldungsgrad wesentlich ändert.

**Wo finde ich aktuelle WACC-Inputs?**
Die [Damodaran-Datenseite an der NYU Stern][damodaran] ist die Standardreferenz, quartalsweise aktualisiert mit risikofreien Zinsen, Marktrisikoprämien, Branchen-Betas und Länderrisikoprämien. [PickSkill][chat] verwendet diese Werte als Default und lässt Sie jeden davon inline überschreiben.
