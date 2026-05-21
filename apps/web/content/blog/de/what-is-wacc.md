---
title: Was ist der WACC? Der Diskontsatz, der jede Bewertung leise entscheidet
description: Praxisleitfaden zum WACC — die Formel, die vier Inputs, die wirklich Bewegung bringen, warum 100 bp die Bewertung um 8–15 % verschieben, und wie man einen WACC wählt, der die Prüfung übersteht.
publishedAt: 2026-05-22
updatedAt: 2026-05-22
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: Das PickSkill-Research-Team — wir bauen einen AI-Analysten für Privatanleger.
pillar: explainer
tags:
  - valuation
  - wacc
  - capital-cost
  - fundamentals
heroImage: /blog/what-is-wacc/hero.png
heroAlt: Editoriale Illustration einer stilisierten Gewichtungs-Anzeige in warmen dunklen Tönen mit smaragdgrünen Akzenten
---

Der **WACC (gewichtete durchschnittliche Kapitalkosten)** ist die Mischrendite, die ein Unternehmen aus seinen Vermögenswerten erwirtschaften muss, um sowohl Eigen- als auch Fremdkapitalgeber zufriedenzustellen. In einem DCF-Modell ist er der Satz, mit dem zukünftige Cashflows auf heute abgezinst werden — die eine Zahl, die leise entscheidet, ob eine Aktie 30 % unterbewertet oder 30 % überbewertet wirkt. Stimmt der WACC nicht, runden sich alle anderen Zahlen im Modell zu Rauschen.

Dieser Leitfaden behandelt die Formel, die vier Inputs, die das Ergebnis wirklich bewegen, die Fehler, die es bis in veröffentlichte Reports schaffen, und wie man einen WACC trianguliert, der dem Kreuzverhör standhält.

### Kernaussagen

- **WACC = (E/V) × Re + (D/V) × Rd × (1 − t).** Eigenkapitalgewicht × Eigenkapitalkosten + Fremdkapitalgewicht × Fremdkapitalkosten nach Steuern.
- **Eine Verschiebung des WACC um 100 bp bewegt einen 5-Jahres-DCF um 8–15 %.** Die WACC-Sensitivitätstabelle ist das Erste, was ein Prüfer ansieht.
- **Vier Inputs erledigen 90 % der Arbeit**: risikofreier Zinssatz, Marktrisikoprämie, Beta, Fremdkapitalkosten nach Steuern. Die Zeit gehört hierher.
- **Verwenden Sie Marktwerte, nicht Buchwerte, für die E/V- und D/V-Gewichte** — Buch-Eigenkapital ist ein Bilanzierungsartefakt, nicht das, was der Markt tatsächlich preist.
- **PickSkill berechnet einen quellenbelegten WACC in unter einer Minute** aus aktuellen Treasury-Renditen, Damodarans Branchendaten und den Geschäftsberichten des Unternehmens — jeder Input ist im Chat editierbar.

## Wie lautet die WACC-Formel?

Die Lehrbuchform mit einer Steueranpassung, die in der Praxis zählt:

```
WACC = (E/V) × Re + (D/V) × Rd × (1 − t)
```

Wo:

| Symbol | Bedeutung |
|---|---|
| `E` | Marktwert des Eigenkapitals (Aktienkurs × Aktienzahl) |
| `D` | Marktwert des Fremdkapitals (Anleihekurse, sofern gehandelt; sonst Buchwert als Näherung) |
| `V` | Gesamtkapital, `E + D` |
| `Re` | Eigenkapitalkosten — was die Aktionäre fordern |
| `Rd` | Vorsteuer-Fremdkapitalkosten — was die Gläubiger verlangen |
| `t` | Grenzsteuersatz (weil Zinsen steuerlich absetzbar sind) |

`(1 − t)` ist das tragende Detail — Fremdkapital ist nicht nur deshalb billiger als Eigenkapital, weil Gläubiger weniger verlangen, sondern weil Zinsaufwand die Steuerlast senkt. Ein Unternehmen mit 25 % Grenzsteuersatz und 5 % Vorsteuer-Schuldkosten zahlt nach Steuern tatsächlich 3,75 %.

## Warum WACC wichtig ist

Drei Gründe, warum der WACC im DCF als die folgenreichste Zahl behandelt wird:

1. **Er kompoundiert über die Prognoseperiode.** Eine WACC-Bewegung um 100 bp diskontiert den Cashflow des fünften Jahres mit `1,10⁵ vs 1,11⁵` — etwa 4,5 % Spread, der sich mit jedem zusätzlichen Prognosejahr weitet. In einem typischen 5-Jahres-DCF entspricht das einer 8–15 %-Schwankung des Enterprise Value (PickSkill-Analyse über etwa 200 Large-Cap-Modelle aus 2025).
2. **Er steuert die Nennerempfindlichkeit des Terminal Values.** Der Gordon-Growth-Terminal Value lautet `FCFn+1 / (WACC − g)`. Eine 50-bp-Verschiebung des WACC bei 3 % Wachstum ändert den Nenner von 7 % auf 7,5 % — eine 7 %-Verschiebung des Terminal Values, der in den meisten 5-Jahres-DCFs 60–80 % des EV ausmacht.
3. **Er ist der Hebel, an dem der Prüfer zuerst zieht.** Wenn ein Kursziel vom Konsens abweicht, lautet die erste Frage fast immer „Welchen WACC verwenden Sie?". Kann der WACC nicht verteidigt werden, kann das Modell nicht verteidigt werden.

## Die vier Inputs, auf die es wirklich ankommt

Für die meisten Nicht-Finanzunternehmen sind die Eigenkapitalkosten der größte Teil des WACC (typischerweise 70–90 % Gewicht). Innerhalb der Eigenkapitalkosten erledigen drei Sub-Inputs des CAPM fast die ganze Arbeit:

```
Re = Rf + β × ERP
```

### 1. Der risikofreie Zinssatz (Rf)

Die Rendite einer langlaufenden Staatsanleihe — bei US-notierten Aktien die 10- oder 30-jährige Treasury. Verwenden Sie die **aktuelle** Rendite, nicht einen historischen Durchschnitt. Die heutige Rendite ist das, was ein Anleger heute gegen Aktienrenditen abwägt.

Theoretisch ist die 30-jährige passender, um einen ewigen Terminal Value zu spiegeln; die 10-jährige ist aber die Praxisnorm — liquider und sauberer im Tracking der Fed-Politik. Die meisten Sell-Side-Desks verwenden die 10-jährige; sich daran auszurichten erleichtert die Vergleichbarkeit.

### 2. Marktrisikoprämie (ERP)

Die Zusatzrendite, die Investoren für das Halten von Aktien statt risikofreier Anleihen verlangen. Es gibt keine einzige „richtige" ERP, nur Bandbreiten, die akademisch standhalten. Zwei praktische Methoden:

- **Historisch**: langfristig realisierte Prämie der Aktien gegenüber Treasuries. US-Daten weisen auf ~5,0–5,5 % hin (das Damodaran-Datenset auf der NYU-Stern-Seite ist die meistzitierte Quelle, vierteljährlich aktualisiert).
- **Implizit**: Lösen Sie nach der ERP auf, die der aktuelle S&P 500 angesichts der Konsens-Gewinnprognosen impliziert. Heute liegt das näher an 4,0–4,5 % — niedriger, weil Bewertungen erhöht sind.

Wählen Sie eine Methode und legen Sie sie offen. Zwischen Historik und Implizit innerhalb desselben Modells zu mischen ist genau die Art von Inkonsistenz, die Prüfer aufspüren.

[damodaran]: https://pages.stern.nyu.edu/~adamodar/

### 3. Beta (β)

Die Empfindlichkeit der Aktienrendite gegenüber der Marktrendite. Berechnet über rollierende Regression — typischerweise 5 Jahre monatlich oder 2 Jahre wöchentlich.

Zwei häufige Fehlermodi:

- **Veraltetes Beta bei transformiertem Unternehmen.** Ein 5-Jahres-Beta für eine SaaS-Firma, die gerade ein Hardwaregeschäft erworben hat, ist nicht mehr informativ — die halbe Periode reflektiert ein anderes Geschäft.
- **Pure-Play-Comparable ohne De-Leveraging.** Wenn börsennotierte Vergleichsunternehmen verrauscht sind, lautet die Standardlösung: Peer-Beta-Durchschnitt nehmen, de-leveragen, dann auf die Zielkapitalstruktur re-leveragen. Den De-Leveraging-Schritt zu überspringen ist der häufigste Fehler in Studentenmodellen.

### 4. Fremdkapitalkosten nach Steuern (Rd × (1 − t))

Bei Investment-Grade-Unternehmen mit gehandelten Anleihen lesen Sie die Yield-to-Maturity direkt ab. Wenn das Fremdkapital nicht gehandelt wird, leiten Sie die Kosten ab, indem Sie einen Kreditspread (passend zum Rating) auf die laufzeitgleiche Treasury-Rendite addieren. Damodaran veröffentlicht synthetische Kreditspreads nach Zinsdeckungsklassen — nützlich, wenn es kein Rating gibt.

Verwenden Sie den **Grenzsteuersatz**, nicht den effektiven. Der Zinsabzug schirmt Einkommen zum Grenzsteuersatz ab, der bei NOLs, Auslandseinkünften oder Sonderposten erheblich vom effektiven abweichen kann.

## Wie man in 15 Minuten einen WACC trianguliert

Eine pragmatische Sequenz, wie sie das PickSkill-WACC-Tool verwendet:

1. **Ziehen Sie die heutige 10-jährige Treasury-Rendite.** Aus einer liquiden Quelle; nicht mitteln.
2. **Wählen Sie die ERP aus einer einzigen Quelle** — Damodaran ist die Standardreferenz. Notieren Sie historisch vs. implizit; Default ist historisch.
3. **Holen Sie ein Regressions-Beta** und ziehen Sie das [Damodaran-Branchen-Beta-Datenset][damodaran] als Sanity-Check heran. Liegt das unternehmensspezifische Beta mehr als 0,3 vom Branchendurchschnitt entfernt, fragen Sie, warum.
4. **Schätzen Sie die Fremdkapitalkosten** über YTM gehandelter Anleihen oder über die synthetische Spread-Methode (Damodarans „Interest Coverage"-Tabelle).
5. **Berechnen Sie Gewichte mit Marktwerten.** Das Eigenkapitalgewicht ist direkt. Das Fremdkapitalgewicht verwendet den Marktwert des Fremdkapitals — bei nicht gehandeltem Fremdkapital ist der Buchwert ein vernünftiger Proxy, wenn sich die Zinsen seit Emission nicht um 200 bp bewegt haben.
6. **Wenden Sie den Grenzsteuersatz an.** Für US-Steuerpflichtige sind das 21 % Bundessteuer plus gemischte Staatssteuer — insgesamt meist 24–26 %.
7. **Quervergleich mit dem Branchen-WACC.** Damodaran veröffentlicht Branchen-WACCs quartalsweise. Liegt Ihre Zahl mehr als 100 bp neben der Branche, notieren Sie warum — und stehen Sie zur Differenz, wenn Sie präsentieren.

## Häufige Fallstricke, die es bis ins veröffentlichte Modell schaffen

Eine 134-Wort-Checkliste, die man sich einprägen sollte:

1. **Buchwert- statt Marktwert-Gewichte.** Buch-Eigenkapital ist, was die Buchhaltung erfasst; Markt-Eigenkapital ist, was Investoren tatsächlich halten. Ein profitables Unternehmen kann Buch-Eigenkapital haben, das ein Viertel des Markt-Eigenkapitals beträgt — Buchwert-Gewichte übergewichten Fremdkapital und dreifach-rechnen die Eigenkapitalkosten.
2. **Vorsteuer-Fremdkapitalkosten.** Das `(1 − t)` zu vergessen bläht den WACC bei verschuldeten Unternehmen um 100–200 bp.
3. **Veralteter Steuersatz.** Unternehmen im Übergang (US-Steuerreform, Sitzverlagerung von Multinationalen) haben oft Sätze, die nicht zum Statutory-Satz passen. Mit der Steuer-Note im aktuellen 10-K verifizieren.
4. **Leasingverbindlichkeiten ignorieren.** Unter IFRS 16 / ASC 842 stehen Operating Leases als Schuld in der Bilanz — und viele Analysten in Retail / Airlines / Restaurants vergessen sie noch immer in `D/V`.
5. **CAPM für ein nicht-börsennotiertes Unternehmen ohne De-Leveraging der Peer-Betas.** Ein Peer-Beta mit falscher Kapitalstruktur produziert Unsinn. Immer de-leveragen und re-leveragen.

## So baut PickSkill einen WACC

Chat öffnen und tippen:

> *„Zieh einen WACC für AMD — zeig die Inputs und lass mich die ERP anpassen."*

PickSkill holt die heutige 10-jährige Treasury-Rendite, Damodarans aktuelle ERP und Branchen-Beta, die Anleiherenditen des Unternehmens (oder den synthetischen Spread bei nicht-gerateter Schuld) und den Grenzsteuersatz aus der Steuer-Note des aktuellen 10-K. Er berechnet den gewichteten Durchschnitt, legt jeden Input offen und lässt Sie jeden inline ändern — das Ergebnis aktualisiert sich live, und die Quelle jedes Wertes ist einen Klick entfernt.

Die Mathematik ist dieselbe wie in Excel. Der Unterschied: 8 Minuten Datensammlung werden auf ~30 Sekunden komprimiert, und jeder Input ist quellenbelegt — wenn ein Prüfer fragt „woher kommt die ERP?", lautet die Antwort ein Link, keine Vermutung.

Dieser WACC fließt direkt in das [DCF-Tool](/blog/what-is-dcf), wenn Sie den vollen Bewertungsfluss wollen.

## FAQ

**Wie hoch ist ein typischer WACC für ein börsennotiertes Unternehmen?**
Für US-Large-Caps 2025–2026 clustern WACCs zwischen 8 und 11 %. Defensive Reifesektoren (Utilities, Verbrauchsgüter) liegen bei 6–8 %; wachstumsstarke Tech und Biotech bei 10–13 %; zyklische Rohstoffproduzenten je nach Verschuldung bei 9–15 %.

**Sollte der WACC sich über die Prognoseperiode ändern?**
Lehrbuchmäßig ja — die Kapitalstruktur konvergiert in der Regel zu einem langfristigen Ziel. In der Praxis verwenden die meisten Analysten einen einzigen WACC über den gesamten Horizont, um das Modell handhabbar zu halten, und biegen ihn nur im Terminal-Schritt. Beide Ansätze sind vertretbar; entscheidend ist Konsistenz innerhalb eines einzelnen Modells.

**Warum Marktwert der Schulden statt Buchwert?**
Wenn Zinsen steigen, fällt der Marktwert festverzinslicher Schulden unter den Buchwert. Ein Unternehmen, das 3 %-Notes emittiert hat, als Zinsen bei 2 % lagen, hat Anleihen, die heute deutlich unter Par handeln — und dieser niedrigere Marktwert stützt tatsächlich die Eigenkapitalforderung. Bei Investment-Grade-Öffentlichanleihen kann die Lücke 5–15 % unter Par liegen; sie zu ignorieren verzerrt D/V.

**Kann ich für ein Multi-Segment-Unternehmen einen einzigen WACC verwenden?**
Nur als erster Wurf. Wenn ein Unternehmen Geschäfte mit materiell unterschiedlichen Risikoprofilen führt (Consumer-Software + Zahlungsverkehr + Hardware), ist eine Sum-of-the-Parts-Bewertung mit segmentspezifischen WACCs ehrlicher. Für ein Erstmodell ist ein nach Segment-EBIT gewichteter Misch-WACC akzeptabel.

**Wo finde ich aktuelle WACC-Inputs?**
Die [Damodaran-Datenseite an der NYU Stern][damodaran] ist die Standardreferenz, vierteljährlich aktualisiert mit risikofreien Zinsen, Marktrisikoprämien, Branchen-Betas und synthetischen Kreditspreads. [PickSkill](/chat) verwendet diese Werte als Defaults und erlaubt das inline Überschreiben jedes einzelnen.
