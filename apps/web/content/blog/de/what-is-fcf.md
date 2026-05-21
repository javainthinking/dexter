---
title: Was ist Free Cash Flow (FCF)? Die Zahl hinter jeder ehrlichen Bewertung
description: Praxisleitfaden zum FCF — was er ist, warum er den Gewinn schlägt, wie man FCFF und FCFE aus der Kapitalflussrechnung herleitet, und die vier Fallstricke, die Tech-Modelle verzerren.
publishedAt: 2026-05-22
updatedAt: 2026-05-22
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: Das PickSkill-Research-Team — wir bauen einen AI-Analysten für Privatanleger.
pillar: explainer
tags:
  - valuation
  - fcf
  - cash-flow
  - fundamentals
heroImage: /blog/what-is-fcf/hero.png
heroAlt: Editoriale Illustration eines Cashflows, der durch einen Filter in ein helles Reservoir fließt, warme dunkle Töne mit smaragdgrünen Akzenten
---

Der **Free Cash Flow (FCF)** ist die Liquidität, die ein Unternehmen erwirtschaftet und die Investoren tatsächlich zur Verfügung steht, nachdem der operative Betrieb bezahlt und die Vermögensbasis erhalten wurde. Es ist die Zahl, die ein Bewertungsmodell will — nicht der buchhalterische Gewinn, der sich durch Abschreibungsentscheidungen, Working-Capital-Schwankungen oder aktienbasierte Vergütung neu formen lässt. Wenn die Gewinne eines Unternehmens gut aussehen, der FCF aber nicht mithält, ist diese Lücke meist das Wichtigste, was man über die Aktie verstehen muss.

Dieser Leitfaden behandelt die Definition, die zwei wichtigen Geschmacksrichtungen (FCFF und FCFE), wie man den FCF in unter einer Minute aus einer Kapitalflussrechnung herauszieht, und die vier Fallstricke, die insbesondere Tech-Modelle verzerren.

### Kernaussagen

- **FCF = Operativer Cashflow − Capex.** Cash aus dem Geschäft minus das Kapital, das nötig ist, um es am Laufen zu halten.
- **Zwei Varianten**: FCFF (Free Cash Flow to the Firm — für unverschuldetes DCF, ignoriert die Kapitalstruktur) und FCFE (Free Cash Flow to Equity — für verschuldetes DCF).
- **Der FCF schlägt den Gewinn** in der Bewertung, weil er nicht zahlungswirksame Posten (D&A, SBC) herausnimmt, tatsächliche Capex erfasst und Working-Capital-Veränderungen reflektiert, die der GAAP-Gewinn verbirgt.
- **Aktienbasierte Vergütung (SBC) ist ein realer Kostenposten.** SBC als nicht-cash zurückzurechnen, ohne die Verwässerung zu modellieren, lässt den FCF eines Tech-Unternehmens 5–15 % besser aussehen, als er ist.
- **PickSkill berechnet den FCF aus den letzten vier 10-Q + 10-K** in unter einer Minute — beide Varianten, mit den zugrundeliegenden Posten verlinkt für Verifizierung.

## Wie lautet die FCF-Formel?

Ausgangspunkt ist die Kapitalflussrechnung. Zwei Pfade, je nach Variante:

```
FCFF (unverschuldet) = Operativer Cashflow + Zinsen × (1 − t) − Capex
FCFE (verschuldet)   = Operativer Cashflow − Capex + Netto-Kreditaufnahme
```

Wo:

| Begriff | Bedeutung |
|---|---|
| **Operativer Cashflow (OCF)** | Vom Geschäft erwirtschafteter Cash nach Working-Capital-Veränderungen. Kopf der Sektion „operative Aktivitäten" in der Kapitalflussrechnung. |
| **Capex** | Capital expenditure — Geld für Sachanlagen, Ausrüstung, Software, Infrastruktur. Unten in der „Investitions"-Sektion, beschriftet als „Käufe von Sachanlagen" o. ä. |
| **Zinsen × (1 − t)** | Zinsaufwand nach Steuern, im FCFF hinzugerechnet, damit die Zahl nicht von der Kapitalstruktur verzerrt wird. |
| **Netto-Kreditaufnahme** | Neu ausgegebene minus zurückgezahlte Schulden. Im FCFE ist das der Cash, der nach den Gläubigern bei den Aktionären ankommt. |

**Beide Varianten ziehen Capex ab**, weil das Geld für Gebäude, Rechenzentrum oder Produktionslinie — dieses Geld steht dem Investor nicht zur Verfügung. Es wird ins Geschäft reinvestiert. Ein wachsendes Unternehmen kann spektakulären OCF und negativen FCF haben, weil der gesamte Cash in die Expansion zurückgepflügt wird.

## Warum ist FCF wichtiger als Gewinn?

Der Gewinn ist die Schlagzeilen-Zahl — die, die in jedem Earnings Call den Konsens übertrifft oder verfehlt. Aber der Großteil professioneller Bewertungsarbeit läuft auf FCF. Drei Gründe:

1. **Gewinn lässt sich leichter biegen.** Abschreibungstiming, Vorrätebewertung, Rückstellungen, abgegrenzte Erlöse — alles GAAP-konforme Hebel, die Gewinn verschieben, ohne Cash zu verschieben. Der FCF startet direkt in der Kapitalflussrechnung und umgeht das meiste davon.
2. **Capex ist real, und der Gewinn verbirgt es.** Ein kapitalintensives Geschäft (Halbleiter, Telcos, Airlines) gibt Milliarden für Equipment aus, das über ein Jahrzehnt abgeschrieben wird. Der Gewinn zeigt die Abschreibung; der FCF zeigt den in der Periode tatsächlich ausgegebenen Cash. Sie können in einem Jahr um 30–50 % auseinanderlaufen.
3. **DCF will FCF.** Das Discounted-Cash-Flow-Modell heißt nach dem, was es diskontiert — Cashflow. Gewinn als Proxy zu verwenden produziert die Art von Bewertung, die einen Abschwung nicht übersteht (weil Gewinn weiter besteht, wenn der Cashflow schon zusammengebrochen ist).

## In 60 Sekunden FCF aus einer Kapitalflussrechnung ziehen

Praktischer Workflow an einem echten Filing:

1. **Letztes 10-Q oder 10-K** auf [SEC EDGAR][edgar] öffnen. Zur Kapitalflussrechnung blättern (meist Seite 4–5 der Financials).
2. **„Netto-Cash bereitgestellt durch operative Aktivitäten" lesen.** Das ist OCF. Die zuverlässigste Einzelzahl in der Rechnung.
3. **„Investitionen in Sachanlagen" oder „Käufe von Sachanlagen und Ausrüstung"** in der Investitionssektion lesen. Negatives Vorzeichen beachten — Capex ist ein Cash-Abfluss.
4. **FCF = OCF − Capex berechnen.** Für unverschuldete DCF-Nutzung Zinsen nach Steuern zurückrechnen (Zinsen aus der GuV; mit `1 − Grenzsteuersatz` multiplizieren).
5. **Gegen die Pressemitteilung prüfen.** Die meisten Unternehmen berichten den FCF selbst in ihren Earnings-Releases. Weicht Ihre Zahl um mehr als 5 % ab, haben Sie eine Definitionslücke — meist um kapitalisierte Software oder akquisitionsbezogene Posten. Abstimmen, nicht überpinseln.

[edgar]: https://www.sec.gov/edgar
[chat]: /chat

Eine 60-Sekunden-Übung zum Verinnerlichen: Öffnen Sie NVDAs aktuelles 10-K mit [PickSkill][chat], fragen Sie „zeig mir den FCF der letzten 4 Geschäftsjahre und erklär die YoY-Veränderung". Sie sehen, wie OCF und Capex jedes Jahr lagen, mit den zugrundeliegenden Posten zum Filing verlinkt.

## FCFF vs FCFE — was nutzen

| Variante | Was es darstellt | Diskontiert bei | Wann verwenden |
|---|---|---|---|
| **FCFF** | Cash für *alle* Kapitalgeber (Eigen- + Fremdkapital) | WACC | Standard-Sell-Side-Equity-DCF |
| **FCFE** | Cash *nur* für Aktionäre, nach Zinsen und Schuldendienst | Eigenkapitalkosten (Re) | LBO-Modelle, Bewertung von Finanzdienstleistern, recap-getriebene Thesen |

Der Standard in 90 % der Equity Research ist FCFF, diskontiert mit dem [WACC](/blog/what-is-wacc), was den Enterprise Value gibt. Netto-Verschuldung abziehen → Eigenkapitalwert; durch Aktienzahl teilen → impliziter Aktienkurs.

FCFE ist strukturell seltener, weil es das explizite Modellieren des Schuldenplans erfordert — Zinsen, Tilgungen, Neuemissionen pro Jahr. In einem LBO ist genau das der Punkt. In einem typischen Equity-Research-DCF ist FCFF sauberer.

## Vier Fallstricke, die Tech-Modelle verzerren

Moderne Tech-Unternehmen sind dort, wo die FCF-Analyse am häufigsten schiefläuft. Vier zu kennende Fallen:

1. **SBC als nicht-cash behandeln.** Aktienbasierte Vergütung ist ein realer Kostenposten — das Unternehmen reicht Eigenkapital an Mitarbeiter weiter, die sonst Bargeld-Gehalt fordern würden. GAAP rechnet SBC im operativen Cashflow zurück (es ist nicht zahlungswirksam); die meisten Analysten vergessen dann, die Verwässerung durch die Aktien-Grants zu modellieren. Ergebnis: eine „FCF-Marge", die 5–15 % zu hoch erscheint. Fix: entweder SBC vom FCF abziehen oder die Aktienzahl-Wachstum explizit modellieren, sodass der Wert pro Aktie die Verwässerung reflektiert.
2. **Kapitalisierte Software-Entwicklungskosten.** Viele SaaS-Unternehmen kapitalisieren einen Teil der Engineer-Gehälter als „Software zum internen Gebrauch" (ASC 350-40). Diese Kosten wandern aus OCF (wo sie operative Cash mindern würden) in Capex (wo sie den FCF mindern). Beide Wege treffen den FCF — aber wenn Sie zwei Unternehmen vergleichen und eines aggressiv kapitalisiert und das andere nicht, ist der FCF-Vergleich Äpfel vs. Birnen. Normalisieren, indem Sie kapitalisierte Software wieder hinzurechnen.
3. **Working-Capital-Rückenwind im Wachstumsmodus.** Ein hyperwachstendes Unternehmen, das schneller Cash von Kunden einsammelt (abgegrenzte Erlöse), als es ausgibt, hat Working-Capital-Releases, die den OCF schöner aussehen lassen. Das ist echter Cash — nicht falsch — aber nicht nachhaltig, wenn das Wachstum nachlässt. Working-Capital-Veränderungen als Funktion des Umsatzwachstums modellieren, nicht als Konstante.
4. **Capex-Policy-Wechsel.** Ein reifender SaaS-Anbieter, der von eigenen Rechenzentren in die Public Cloud wechselt, sollte fallendes Capex sehen — das ist strukturell, kein Earnings Management. Ein Unternehmen in Schwierigkeiten, das „Capex aufschiebt", um ein Quartals-FCF-Ziel zu treffen, verbirgt Probleme. Capex als % vom Umsatz über 3–5 Jahre betrachten, nicht isoliert.

## FCF Yield: die eine Kennzahl, die zählt

Unter dem Dutzend FCF-abgeleiteter Kennzahlen, die Analysten verwenden, ist die **FCF Yield** am direktesten mit dem Anleihemarkt und mit anderen Aktien vergleichbar:

```
FCF Yield = FCF je Aktie / Aktienkurs
```

Es ist die Cash-Rendite, die ein Aktionär erhielte, wenn der gesamte FCF ausgeschüttet würde (was in der Praxis nicht passiert — Unternehmen reinvestieren, kaufen Aktien zurück oder behalten Cash). Aber sie ist die richtige Vergleichsgröße zum risikofreien Zins.

| FCF Yield | Lesart |
|---|---|
| **>8 %** | Nach historischen Maßstäben günstig; oft eine Value-Story oder ein Titel, in den Sorgen eingepreist sind |
| **4–8 %** | Vernünftig für eingeschwungene Large Caps |
| **1–4 %** | Premium-Bewertung; Wachstum oder einzigartige Positionierung eingepreist |
| **<1 %** | Entweder tief growth-eingepreist, oder capex-lastig ohne übrigen Cash für Aktionäre |

Immer gegen die eigene Historie (Yield expandiert oder kontrahiert?) und gegen Branchen-Peers vergleichen — Software-FCF-Yields sehen anders aus als Versorger-FCF-Yields, und das ist strukturell, kein Signal.

## Wie PickSkill FCF auf Abruf baut

Chat öffnen und tippen:

> *„Zieh den FCF für AMD über die letzten 4 Geschäftsjahre und erklär die YoY-Veränderung."*

PickSkill holt das aktuelle 10-K plus die letzten vier 10-Qs von SEC EDGAR, extrahiert OCF und Capex zeilenweise, berechnet den FCF pro Jahr und zeigt die YoY-Brücke mit jeder materiellen Veränderung zur Offenlegung verlinkt. FCFE statt FCF? Ergänzen Sie *„...zeig auch FCFE auf Basis des aktuellen Schuldenplans"* — gleicher Workflow, nur Netto-Kreditaufnahme dazu.

Diese FCF-Reihe ist das, was in das [DCF-Tool](/blog/what-is-dcf) fließt; das [WACC-Tool](/blog/what-is-wacc) liefert den Diskontsatz.

## FAQ

**Was ist der Unterschied zwischen FCF und Jahresüberschuss?**
Jahresüberschuss ist der GAAP-Gewinn — was nach allen Aufwendungen einschließlich nicht-zahlungswirksamer Posten wie Abschreibung übrig bleibt. FCF ist der tatsächlich erwirtschaftete Cash, nachdem das Unternehmen das zum Erhalt des Betriebs nötige Kapital bezahlt hat. Sie können in kapitalintensiven Sektoren um 30–50 % divergieren, oder es kann anhaltend positiver Jahresüberschuss bei negativem FCF in schnell wachsenden Unternehmen vorliegen, die stark reinvestieren.

**Warum ist FCF manchmal negativ?**
Drei Gründe, nach Schwere geordnet. (1) Das Unternehmen wächst — gibt mehr Capex aus, als der aktuelle Cashflow finanzieren kann (Amazon den größten Teil seines ersten Jahrzehnts). (2) Working Capital verschlingt Cash — meist Vorratsaufbau oder langsamere Forderungen. (3) Das Geschäft ist strukturell unprofitabel — der operative Cashflow selbst ist negativ. Diese drei zu unterscheiden ist entscheidend: die erste ist eine bewusste Investitionsentscheidung; die dritte ist ein existenzielles Problem.

**Ist FCF dasselbe wie EBITDA?**
Nein. EBITDA ist Ergebnis vor Zinsen, Steuern und Abschreibung — ein Proxy für operativen Cashflow, der drei Dinge ignoriert: Working-Capital-Veränderungen, Capex und Steuern. FCF berücksichtigt alle drei. EBITDA ist nützlich für die operative Vergleichbarkeit zwischen Unternehmen; FCF ist das, was die Bewertung tatsächlich diskontiert.

**Für Tech-Aktien: FCF oder EPS?**
Beide. EPS erzählt die GAAP-Gewinn-pro-Aktie-Erzählung, die das Unternehmen erzählen will. FCF (nach ehrlicher SBC-Behandlung) erzählt, was einem Aktionär tatsächlich zur Verfügung steht. Die nützlichste Einzelgrafik in einer Tech-Aktien-Analyse ist FCF-Marge und EPS-Wachstum nebeneinander über 5 Jahre — wo sie nachhaltig divergieren, liegt die interessante Frage.

**Wie bezieht PickSkill FCF-Daten?**
Direkte Extraktion aus SEC-EDGAR-Filings (10-K, 10-Q) via [PickSkill](/chat). Operativer Cashflow und Capex stammen direkt aus der Kapitalflussrechnung; die Zahl wird gegen das vom Unternehmen selbst veröffentlichte Non-GAAP-FCF (sofern vorhanden) abgestimmt und die Ursprungsposten sind verlinkt. Kein Drittdaten-Vermittler, daher passen die Zahlen zum Filing.
