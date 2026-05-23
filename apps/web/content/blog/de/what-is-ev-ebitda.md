---
title: Was ist EV/EBITDA? Das Multiple jenseits der Kapitalstruktur
description: EV/EBITDA bewertet ein Unternehmen am operativen Gewinn vor Zinsen, Steuern, Abschreibungen. Formel, branchentypische Bänder, Vorteile, Fallstricke.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: Das PickSkill-Research-Team — wir bauen einen AI-Analysten für Privatanleger.
pillar: explainer
tags:
  - valuation
  - ev-ebitda
  - multiples
  - fundamentals
heroImage: /blog/what-is-ev-ebitda/hero.png
heroAlt: Editoriale Infografik mit der EV/EBITDA-Formel und typischen Bandbreiten je Sektor
---

**EV/EBITDA** ist der Bewertungsmultiplikator, der durch die Kapitalstruktur hindurchsieht. Wo das [KGV](/blog/what-is-pe-ratio) den Aktienkurs durch Gewinne nach Zinsen und Steuern teilt — beide abhängig davon, wie ein Unternehmen finanziert und besteuert wird — teilt EV/EBITDA den *Enterprise Value* (Wert des Gesamtunternehmens) durch *EBITDA* (Ergebnis vor den Dingen, die Finanzierungs- und Bilanzentscheidungen verzerren). Ergebnis ist ein Multiplikator, mit dem Sie zwei Unternehmen derselben Branche vergleichen können, auch wenn eines hoch verschuldet und das andere schuldenfrei ist.

### Kernaussagen

- **EV/EBITDA = Enterprise Value ÷ EBITDA.** EV = Marktkapitalisierung + Schulden − Cash + Minderheitenanteile. EBITDA = Gewinn vor Zinsen, Steuern, Abschreibungen.
- **Kapitalstruktur-agnostisch.** Unternehmen mit unterschiedlichem Verschuldungsgrad zu vergleichen ist der Hauptzweck von EV/EBITDA. Das KGV bricht zusammen; EV/EBITDA nicht.
- **Er schmeichelt kapitalintensiven Geschäften**, weil er Capex ignoriert. Ein Stahlwerk mit 1 Mrd. $/Jahr Capex sieht beim gleichen EV/EBITDA „billiger" aus als eine Softwarefirma, die fast nichts ausgibt.
- **Typische Werte**: Utilities 8–10×, Industrie 10–14×, Konsum/Healthcare 14–20×, Software 18–30×+.
- **PickSkill berechnet EV/EBITDA** mit vollständigem Peer-Vergleich und einer automatischen Markierung, wenn EV/EBITDA und KGV gegensätzliche Signale geben.

## Was ist EV/EBITDA?

```
EV/EBITDA = Enterprise Value / EBITDA
Mit:
  EV     = Marktkapitalisierung + Gesamtschulden − Cash + Minderheitenanteile
  EBITDA = Operatives Ergebnis + Abschreibungen
```

**Enterprise Value (EV)** ist die Gesamtkosten zum Erwerb des Gesamtunternehmens — Eigenkapital komplett kaufen UND Schulden übernehmen, vorhandenes Cash kompensiert einen Teil. **EBITDA** entfernt vier Dinge: Zinsen (Finanzierungswahl), Steuern (Jurisdiktion), Abschreibungen (beide nicht-zahlungswirksame Bilanzposten). Was übrig bleibt, ist eine grobe Annäherung an die operative Cash-Generierung vor Capex und Working Capital.

## Wann EV/EBITDA das KGV schlägt

1. **Unternehmen mit unterschiedlichen Verschuldungsgraden.** Ein verschuldetes Unternehmen hat höhere Zinsaufwendungen, niedrigeren Jahresüberschuss, höheres KGV (mechanisch). EV/EBITDA schneidet oberhalb der Zinslinie — der Vergleich bleibt sauber. Klassisches Beispiel: Telekoms.
2. **Jüngste Akquisitionen verzerren die Amortisation.** Das KGV reflektiert das; EBITDA nicht.
3. **Grenzüberschreitende Vergleiche.** Unterschiedliche Steuerregime machen das KGV rauschig; EV/EBITDA ist steuerneutral.

## Wann EV/EBITDA in die Irre führt

1. **Kapitalintensive Geschäfte.** Stahlwerk, Telco, Airline geben 5–15% vom Umsatz pro Jahr für Capex aus. EBITDA ignoriert das. EV/EBITDA kann ein capex-schweres Geschäft billig aussehen lassen, während das FCF-Bild (nach Capex) viel schwächer ist. Immer mit FCF-Rendite paaren — siehe [Was ist FCF?](/blog/what-is-fcf).
2. **Software mit aktivierten Entwicklungskosten.** SaaS-Firmen aktivieren interne Software, was sie vom OpEx in den Capex verschiebt (wo EBITDA sie nicht sieht).
3. **Unternehmen mit aggressiv adjustiertem EBITDA.** „Adjusted EBITDA", „Pro Forma EBITDA", „EBITDAS" — jede Anpassung weitet die Lücke zwischen EBITDA und echtem Cash. Lesen Sie immer die EBITDA-Überleitung im 10-K (siehe [10-K-Leitfaden](/blog/how-to-read-10k)).

## Typische Bandbreiten je Sektor

| Sektor | Typische EV/EBITDA |
|---|---|
| **Utilities** | 8–10× |
| **Industrie / Materialien** | 10–14× |
| **Konsum / Healthcare** | 14–20× |
| **Software / Internet** | 18–30×+ |
| **Banken** | Wird nicht verwendet (KGV oder P/Book) |

Cross-Sektor-Vergleich auf rohem EV/EBITDA ist nicht sinnvoll — 9× Utility vs 25× Software ist strukturell.

## EV/EBITDA vs KGV

| EV/EBITDA verwenden, wenn | KGV verwenden, wenn |
|---|---|
| Sie verschiedene Kapitalstrukturen vergleichen | Peers mit ähnlichem Leverage |
| Sie über Jurisdiktionen / Steuerregime vergleichen | Gleicher Standort |
| Hohe nicht-zahlungswirksame Amortisation verzerrt Nettogewinn | Saubere GuV |
| Vergleich nach M&A | Reife, ohne kürzliche Deals |
| Akquisitions- / LBO-Analyse | Reiner Aktien-Vergleich |

Für das Big Picture absolut vs. relativ siehe [DCF vs Multiplikatoren-Analyse](/blog/dcf-vs-comparable-company-analysis).

## Wie PickSkill EV/EBITDA nutzt

[/chat](/chat) öffnen und tippen:

> *„Vergleich AMD, AVGO, INTC und NVDA per EV/EBITDA — TTM und NTM — gegen ihre 5-Jahres-Durchschnitte. Markier jeden Namen, bei dem EV/EBITDA und KGV einander widersprechen, ob billig oder teuer."*

PickSkill zieht die EV-Komponenten (Marktkapitalisierung + Schulden + Minderheitenanteile − Cash) und EBITDA (TTM + Konsens NTM) für jeden Ticker aus SEC-Filings + Marktdaten, berechnet beide Multiplikatoren, und markiert explizit Fälle, in denen die beiden gegensätzliche Signale geben — nützliches Signal, dass Kapitalstruktur, Amortisation oder aggressive EBITDA-Anpassungen wirklich am Werk sind.

Paart sich mit [DCF vs Comps](/blog/dcf-vs-comparable-company-analysis) — EV/EBITDA ist typischerweise der Schlagzeilen-Multiplikator in der Comps-Tabelle.

## FAQ

**Was ist ein „gutes" EV/EBITDA?**
Es gibt kein universelles „gutes". 9× ist fair für Utilities; 9× wäre billig für Software, sofern nicht etwas kaputt ist. Immer gegen Peers und eigene Historie verankern.

**Unterschied zwischen EV und Marktkapitalisierung?**
Marktkapitalisierung = nur Eigenkapital. EV = Eigenkapital + Schulden − Cash + Minderheitenanteile. Gleiches Unternehmen; EV erfasst die Gesamtkosten der Übernahme inklusive übernommener Schulden.

**Forward oder Trailing EBITDA?**
NTM ist der Analysten-Default; TTM verteidigbarer (real). Beide verwenden — die Lücke impliziert die Konsens-Wachstumssicht.

**Ist EV/EBITDA dasselbe wie EV/EBIT?**
Nein — EBIT zieht Abschreibungen ab, EBITDA nicht. EV/EBIT ist näher am „echten Gewinn"; EV/EBITDA näher am operativen Cash vor Capex. Kapitalintensive Geschäfte: EV/EBIT.

**Woher bezieht PickSkill EBITDA?**
Direkt aus GuV und Kapitalflussrechnung des aktuellsten 10-K/10-Q berechnet. Abgleich gegen das vom Unternehmen selbst berichtete EBITDA (wo vorhanden) und Markierung der angewandten Anpassungen (SBC-Ausschluss, Restrukturierungs-Add-backs etc.), sodass Sie die Aggressivität der berichteten Zahl sehen.
