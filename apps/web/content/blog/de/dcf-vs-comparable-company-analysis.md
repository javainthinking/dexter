---
title: DCF vs Multiplikatoren-Analyse — welche Bewertungsmethode sollten Sie verwenden?
description: Praxisvergleich der beiden wichtigsten Eigenkapital-Bewertungsmethoden — DCF (absolut) und Multiplikatoren-Analyse (relativ). Wann jede am besten funktioniert, wo jede bricht, und warum die meisten Profis beide laufen lassen.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: Das PickSkill-Research-Team — wir bauen einen AI-Analysten für Privatanleger.
pillar: explainer
tags:
  - valuation
  - dcf
  - comparables
  - fundamentals
heroImage: /blog/dcf-vs-comparable-company-analysis/hero.png
heroAlt: Editoriale Infografik, die DCF (absolute Bewertung) und Multiplikatoren-Analyse (relative Bewertung) auf einem Scoreboard vergleicht
---

Die beiden Methoden, die jeder Equity-Research-Analyst zuerst lernt, sind **DCF** (Discounted Cash Flow) und **Multiplikatoren-Analyse** (Comps, Trading Multiples). Sie beantworten dieselbe Frage — was ist diese Aktie wert? — auf völlig verschiedenen Wegen. DCF ist **absolut**: er baut den Wert aus dem eigenen zukünftigen Cash des Unternehmens auf. Comps sind **relativ**: sie bepreisen das Unternehmen gegen das, was der Markt heute für ähnliche Unternehmen zahlt. Zu wissen, worauf man sich stützt, ist der Unterschied zwischen einem Modell, das die Prüfung übersteht, und einem, das das nicht tut.

Dieser Leitfaden durchläuft den Side-by-Side-Vergleich, wann jede Methode am besten funktioniert, ihre Versagensmuster und warum die meisten Profi-Analysten beide laufen lassen und triangulieren.

### Kernaussagen

- **DCF bepreist zukünftiges Cash; Comps bepreisen das gegenwärtige Multiple.** Dieselbe Frage, völlig andere Rahmen.
- **DCF verwenden, wenn**: das Geschäft stabil genug ist, um 5+ Jahre Cash zu prognostizieren, Sie eine Sicht auf langfristige Margen haben, Sie testen wollen „liegt der Markt falsch?".
- **Comps verwenden, wenn**: sich das Geschäft zu schnell ändert für eine sichere Langfristprognose, Sie eine Plausibilitätsprüfung brauchen, Sie gegen Peers benchmarken, oder die Multiple-Struktur des Sektors das tragende Element ist.
- **Die meisten Profi-Modelle laufen beide** und reporten den Spread. Eine andauernde 30%+-Lücke zwischen DCF und Comps ist selbst ein Signal — meist zur Peer-Set-Auswahl oder zur Annahme der terminalen Marge.
- **PickSkill lässt beide laufen** — `/chat` erzeugt aus einem Prompt einen DCF und eine Comps-Tabelle parallel, mit Spread und einsätziger Lesart.

## Was ist DCF?

**DCF** bewertet ein Unternehmen, indem es seine [Free Cash Flows](/blog/what-is-fcf) für 5–10 Jahre projiziert, jedes Jahr mit einem [WACC](/blog/what-is-wacc) auf heute abzinst und einen Terminal Value addiert, der alles danach repräsentiert. Die Formel:

```
EV = Σ FCFₜ / (1 + WACC)ᵗ + TV / (1 + WACC)ⁿ
```

Für den vollen Rahmen (die vier Annahmen, die 95% der Antwort bewegen, typische Fallstricke, Workflow) siehe [Was ist DCF?](/blog/what-is-dcf).

DCF ist die **absolute** Methode: Die Antwort hängt nicht davon ab, was andere Unternehmen kosten. Sie hängt davon ab, was *dieses* Unternehmen voraussichtlich produzieren wird, und welcher Diskontsatz das Risiko kompensiert.

## Was ist Multiplikatoren-Analyse?

**Comps** bewertet ein Unternehmen, indem sie die Trading-Multiples einer Peer-Gruppe auf das Ziel anwendet. 5–10 börsennotierte Peers auswählen, beobachten, was der Markt aktuell für sie zahlt (EV/EBITDA, EV/Sales, P/E, etc.), auf die Finanzen des Ziels anwenden und einen implizierten Kurs ableiten.

Skizze:

```
Peer-Group EV/EBITDA-Range:  10× – 14× (Median 12×)
Ziel-NTM EBITDA:             2,0 Mrd. $
Impliziter EV:               12× × 2,0 Mrd. = 24 Mrd. $
Minus Nettoverschuldung:     24 Mrd. − 4 Mrd. = 20 Mrd. $ Eigenkapital
Impliziter Aktienkurs:       20 Mrd. / 200 Mio. Aktien = 100 $
```

Zu den Multiplikatoren selbst siehe [Was ist P/E?](/blog/what-is-pe-ratio) und [Was ist EV/EBITDA?](/blog/what-is-ev-ebitda).

Comps ist die **relative** Methode: Die Antwort ist das, was der Markt heute für ähnliche Geschäfte zu zahlen bereit ist. Wenn der ganze Sektor re-ratet, bewegt sich der Comps-Wert mit.

## Der Side-by-Side-Vergleich

| Dimension | DCF (Absolut) | Comps (Relativ) |
|---|---|---|
| **Was wird bewertet** | Der zukünftige Cash des Unternehmens | Sein Platz im heutigen Markt |
| **Hauptinput** | Langfrist-FCF + WACC | Peer-Set + gewählter Multiplikator |
| **Zeithorizont** | Explizit 5–10 Jahre + Ewigkeit | Implizit (meist nächste 12 Monate) |
| **Empfindlich gegenüber** | Terminale Marge, WACC, Wachstum | Peer-Auswahl, Wahl des Multiplikators |
| **Am stärksten, wenn** | Cash stabil und prognostizierbar | Peers existieren und aktiv handeln |
| **Am schwächsten, wenn** | Geschäftsmodell im Umbruch | Keine sauberen Peers oder Sektor insgesamt mispreist |
| **Charakter der Ausgabe** | Eigenständiger innerer Wert | Wert relativ zu Peers |
| **Re-Rating-Risiko** | Niedrig (Terminal-Annahmen fix) | Hoch (Peer-Multiples können schnell komprimieren) |
| **Prüferfragen** | „Verteidige WACC und Terminal" | „Verteidige Peer-Set und Multiplikator" |

## Wann DCF am besten funktioniert

1. **Stabile, reife Geschäfte** mit prognostizierbaren Cashflow-Mustern. Versorger, Konsumgüter des täglichen Bedarfs, Industrie mit etablierter Nachfrage.
2. **Sie haben eine verteidigbare Sicht auf langfristige Margen.** DCF belohnt Überzeugung zur terminalen EBIT-Marge.
3. **Sie vermuten, der Markt liegt falsch.** Bei Kurzfristrauschen ist ein DCF, der am Langfrist-Cash verankert ist, das richtige Werkzeug, um die Lücke zu zeigen.
4. **Zyklische Tiefs.** Comps in einem zyklischen Trog sehen schrecklich aus (niedrige Multiples × gedämpfte Gewinne); DCF normalisiert über den Zyklus.

DCF versagt bei Frühphasen-Geschäften, Hyperwachstumsnamen mit 5-Jahres-Annahmen, die Vermutung sind, und Geschäften im strukturellen Wandel.

## Wann Comps am besten funktionieren

1. **Das Peer-Set ist sauber.** Software/SaaS mit 10+ Pure-Plays, die aktiv handeln. Banken, wo die regulatorische Bilanzierung den Vergleich stabilisiert.
2. **Sie wollen einen Plausibilitäts-Check.** Ein DCF, der 50% über dem nächstgelegenen Peer-Multiplikator impliziert, braucht eine Story, warum diese Firma diesen Aufschlag verdient.
3. **Sektorweites Re-Rating ist der Trade.** Comps fangen das ein — DCF kann das nicht wirklich.
4. **Begrenzte Sichtbarkeit auf den Langfrist-Cash.** Wenn 7 Jahre voraus zu projizieren Fiktion ist, ist ein 12-Monats-Forward-Multiplikator der Peers ehrlicher.

Comps versagen, wenn keine Peers existieren (einzigartiges Geschäft), wenn Peers als Sektor mispreist sind (Internet 2000), oder wenn der gewählte Multiplikator strukturell unangebracht ist (P/E auf einem verlustbringenden Unternehmen).

## Häufige Versagensmuster

134-Wörter-Checkliste:

1. **DCF: der Terminal-Schwanz wedelt mit dem Hund.** Terminal Value macht 60–80% des EV im typischen 5-Jahres-DCF aus — wer beim Terminal-Wachstum oder Exit-Multiple lässig ist, ist beim Großteil der Antwort lässig.
2. **DCF: falsche Präzision.** Einen impliziten Kurs auf zwei Dezimalstellen zu reporten behauptet eine Sicherheit, die das Modell nicht verdient. Reporten Sie eine Spanne.
3. **Comps: Peer-Set-Cherry-Picking.** Die 3 Peers mit dem höchsten Multiplikator auswählen und es „Median" nennen ist der häufigste Missbrauch im Sell-Side-Research. Peers nach Geschäftsmodell wählen, nicht nach Multiple.
4. **Comps: Multiple-Zyklus-Mismatch.** Den Multiplikator von heute auf eine Prognose 2 Jahre voraus anwenden setzt implizit voraus, dass Multiples sich nicht ändern. Sie tun es.
5. **Triangulation ohne Ehrlichkeit.** „Unser Ziel ist der Durchschnitt aus DCF und Comps" zu schreiben, ohne zuzugeben, welcher Methode Sie mehr trauen, ist ein Zeichen dafür, dass Sie sich absichern.

## Warum die Profis beide laufen lassen

Die beiden Methoden sind komplementär, nicht ersetzbar. Übliche Praxis:

- **DCF laufen lassen.** Intrinsische Wertspanne basierend auf Ihrer Fundamentalsicht.
- **Comps laufen lassen.** Relative Wertspanne basierend auf aktuellen Peer-Multiplikatoren.
- **Spread reporten.** Wenn DCF 100 $ sagt und Comps 75 $, ist der Spread die interessante Frage. Üblicherweise eines von drei Dingen:
  - Ihre terminale Marge ist optimistischer als das, was Peer-Gewinne implizieren.
  - Der Sektor ist aktuell mispreist (Ihre Sicht), DCF fängt den „richtigen" Preis ein.
  - Ihr Peer-Set ist falsch — Sie haben Namen mit strukturell anderer Ökonomie aufgenommen.

Das **Triangulations-Gespräch** — erklären, warum DCF und Comps abweichen — ist, wo die analytische Schärfe sichtbar wird. Ein Modell, in dem DCF und Comps auf 10% übereinstimmen, bedeutet meist, dass nichts Interessantes gesagt wird.

## Wie PickSkill beide laufen lässt

[/chat](/chat) öffnen und tippen:

> *„Bewerte NVDA per DCF und Trading-Multiplikator-Comps. Gib mir den implizierten Kurs jeder Methode, den Spread und eine einzeilige Lesart, woher der Spread kommt."*

PickSkill führt den [DCF-Workflow](/blog/build-dcf-in-60-seconds) aus (gequellte Inputs aus SEC-Filings + Damodaran + aktuellen Yields), baut eine Comps-Tabelle aus einem Peer-Set, das Sie überschreiben können (Default: die im 10-K gemeldeten Segment-Peers), und zeigt beide implizierten Kurse nebeneinander mit dem Spread und dem dominierenden Treiber der Lücke.

`„…und zeig mir auch den EV/EBITDA-Spread zwischen NVDA und dem Peer-Median über die letzten 8 Quartale"` anhängen, um zu sehen, ob das aktuelle relative Multiple ein jüngstes Re-Rating oder eine stabile strukturelle Prämie ist.

## FAQ

**Welche Methode ist „korrekter"?**
Keine. Sie beantworten unterschiedliche Fragen. DCF fragt, was der Cashflow isoliert wert ist; Comps fragen, was der Markt aktuell für ähnliche Ströme zahlt. Beide sind richtig; sie weichen ab, weil sie verschiedene Bezugsrahmen verwenden.

**Warum weichen sie oft um 20–40% ab?**
Meist: (1) Sie sind optimistischer bei der terminalen Marge als der Markt bei Peer-Run-Rate-Margen; (2) Ihr Peer-Set hat eine andere Wachstum-vs-Qualität-Mischung als das Ziel; (3) der Sektor ist aktuell zum langfristigen Fair Value mispreist. Die Größe der Lücke ist informativ; sie zu erklären ist, wo der Analyst sein Honorar verdient.

**Kann ich beide für dasselbe Kursziel verwenden?**
Ja, die meisten Sell-Side-Ziele sind eine gewichtete Mischung aus DCF, Comps und (oft) Vergleichstransaktionen. Die Gewichte sind Urteil — typischerweise 50% DCF / 30% Comps / 20% Transaktionen für reife Namen; stärker Richtung Comps, wenn das Geschäft zu dynamisch für Langfristprognosen ist.

**EV/EBITDA, EV/Sales, P/E — welchen Multiplikator in Comps?**
Den im Sektor stabilsten. Kapitalintensive Zykliker: EV/EBITDA. Software/SaaS mit negativem GAAP-Ergebnis: EV/Sales oder EV/ARR. Reife, stabile Geschäfte: P/E. Banken: P/Book oder P/Tangible Book. P/E auf einem Hyperwachstums-Tech-Namen ohne Gewinne zu verwenden ist ein klassischer Fehler.

**Wählt PickSkill das Peer-Set automatisch?**
Ja, mit einem Default — typischerweise die Namen, die das Ziel im Item 1 „competition"-Abschnitt seines 10-K nennt, gefiltert nach aktivem liquiden Handel. Sie können das Peer-Set im Chat überschreiben („nimm diese 6 Peers stattdessen") und PickSkill rechnet die Comps mit Ihrem Set neu. Das Peer-Set ist der meinungsstärkste Input in Comps; es editierbar zu halten ist der Punkt.
