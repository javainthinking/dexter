---
title: Was ist Geldfluss? Money-Flow-Indikatoren erklärt
description: >-
  Geldfluss misst, ob auf einem Bar Geld in eine Aktie strömt oder sie verlässt
  — mit kursrichtungsgewichtetem Volumen. MFI, CMF, OBV — Formeln, Anwendungen,
  Fallstricke.
publishedAt: 2026-05-25T00:00:00.000Z
updatedAt: 2026-05-25T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    Das PickSkill-Research-Team — wir bauen einen AI-Analysten für
    Privatanleger.
pillar: explainer
tags:
  - Geldfluss
  - Money Flow
  - Volumen
  - Technische Analyse
  - Indikatoren
heroImage: /blog/what-is-capital-flow/hero.png
heroAlt: >-
  Editorial-Infografik — richtungsgefärbte Volumenbalken mit darunter
  ansteigender OBV-Kumulativlinie; zeigt Akkumulation unter seitwärts laufendem
  Kurs.
---

**Geldfluss-Indikatoren kombinieren Kursrichtung mit Volumen, um zu schätzen, ob Geld in eine Aktie strömt (Akkumulation) oder sie verlässt (Distribution).** Schlichtes Volumen sagt Ihnen *wie viel* gehandelt wurde; Geldfluss-Werkzeuge sagen Ihnen, *auf welcher Seite* das Volumen stand. Richtig eingesetzt fangen sie die frühen Stadien der Akkumulation ein, bevor sich der Kurs genug bewegt hat, damit Trend-Werkzeuge ansprechen. Beiläufig eingesetzt überschätzt man sie leicht — Flow ist ein Signal unter mehreren, kein Urteil.

### Kernaussagen

- **Drei Indikatoren dominieren**: MFI (Money Flow Index), CMF (Chaikin Money Flow) und OBV (On-Balance Volume). Jeder gewichtet Volumen nach Kursrichtung auf leicht unterschiedliche Weise.
- **Die Grundidee**: Ein grüner Bar mit hohem Volumen = Netto-Kaufdruck; ein roter Bar mit hohem Volumen = Netto-Verkaufsdruck. Die Summe über Bars ergibt eine kumulative Druckreihe.
- **Der blinde Fleck des Geldflusses**: Er kann nicht zwischen großen institutionellen Flows und aggregierten Retail-Flows auf demselben Volumen-Bar unterscheiden. Moderne Märkte verwischen die Unterscheidung weiter.
- **Die wertvollste Anwendung ist Divergenz**: wenn der Kurs ein neues Hoch bildet, der Flow aber nicht (oder umgekehrt). Siehe [Was ist Divergenz?](/blog/what-is-divergence).
- **Bei jeder Position sichtbar** — das PickSkill [/indicators](/indicators) Flow-Dashboard zeigt MFI- und CMF-Werte plus einen 5-Tage-Flow-Trend-Bucket, damit Sie sehen, ob Akkumulation aufbaut oder nachlässt.

## Wie wird der Geldfluss berechnet?

Drei häufig verwendete Formulierungen, jede mit einer leicht unterschiedlichen Annahme darüber, wie Volumen nach Kursaktion zu gewichten ist.

### Money Flow Index (MFI)

Ein volumengewichteter RSI. Bereich 0–100; überkauft >80, überverkauft <20.

```
Typical Price (TP)   = (High + Low + Close) / 3
Raw Money Flow (RMF) = TP × Volume
Positive Money Flow  = Summe von RMF über N Bars, in denen TP gestiegen ist
Negative Money Flow  = Summe von RMF über N Bars, in denen TP gefallen ist
Money Flow Ratio     = Positive MF / Negative MF
MFI                  = 100 − [100 / (1 + Money Flow Ratio)]
```

Standard N = 14. MFI ist der beliebteste Flow-Indikator, weil die 0–100-Skala vertraut ist (sie liest sich wie RSI) und die Überkauft- / Überverkauft-Schwellen intuitiv passen.

### Chaikin Money Flow (CMF)

Gewichtet das Volumen jedes Bars danach, wo der Schluss innerhalb der Range des Bars saß. Bars, die nahe am Hoch schließen, bekommen positives Gewicht; Bars, die nahe am Tief schließen, negatives Gewicht.

```
Money Flow Multiplier (MFM) = ((Close − Low) − (High − Close)) / (High − Low)
Money Flow Volume (MFV)     = MFM × Volume
CMF                         = Sum(MFV, N) / Sum(Volume, N)
```

Standard N = 20. CMF läuft von −1 bis +1; Werte über +0,05 zeigen Kaufdruck an; unter −0,05 Verkaufsdruck. Die Stärke des CMF ist Bar-für-Bar-Präzision (der Flow jedes Bars wird vollständig dadurch bestimmt, wo er innerhalb seiner Range schloss); seine Schwäche ist Sensitivität gegenüber einmaligen weitreichenden Bars.

### On-Balance Volume (OBV)

Der einfachste der drei und wohl der robusteste:

```
Wenn Close[t] > Close[t-1]: OBV[t] = OBV[t-1] + Volume[t]
Wenn Close[t] < Close[t-1]: OBV[t] = OBV[t-1] − Volume[t]
Sonst:                       OBV[t] = OBV[t-1]
```

OBV ist eine kumulative Reihe — sie hat keine absolute Bedeutung; was zählt, ist ihre Richtung relativ zur Kursrichtung. Wenn OBV nach oben tendiert, während der Kurs seitwärts läuft, baut Akkumulation darunter auf; wenn der Kurs neue Hochs bildet, OBV aber nicht, geschieht die Rallye auf schwächer werdender Partizipation.

Die drei Indikatoren stimmen die meiste Zeit überein. Wenn sie nicht übereinstimmen, ist OBV in der Regel der sauberste Lesewert dafür, ob das Nettovolumen die Kursbewegung stützt.

## Was sagt Geldfluss tatsächlich aus?

Drei reale Anwendungsfälle, in der Reihenfolge der Edge:

1. **Akkumulation vor Kursbewegung erkennen.** Aktien am Ende eines Abwärtstrends zeigen oft Flow-Indikatoren, die nach oben drehen, bevor der Kurs einen Boden bestätigt hat. Das Muster: OBV bodet aus und tendiert nach oben, während der Kurs noch seitwärts mahlt. Das ist eines der saubereren Setups für „vor dem Ausbruch kaufen" — wobei es routinemäßig Wochen braucht, bis es sich entfaltet, und viele Kandidaten keine Kurs-Folgebewegung produzieren.
2. **Einen Ausbruch bestätigen.** Ein Kursausbruch auf schwachem Flow (CMF nahe null, kein OBV-Neuhoch) scheitert wahrscheinlicher als ein Ausbruch auf starkem Flow (CMF positiv ansteigend, OBV stößt zu neuem Hoch durch). Behandeln Sie Flow als Bestätigung: erforderlich für Einstiege mit hoher Überzeugung, optional für opportunistische.
3. **Flow-Divergenz identifizieren.** Kurs bildet ein höheres Hoch; Flow bildet ein tieferes Hoch. Das ist bärische Divergenz speziell beim Geldfluss — unterscheidet sich von MACD- oder RSI-Divergenz und ist manchmal früher. Versteckte bullische Flow-Divergenz (Kurs höheres Tief, Flow tieferes Tief in einem Aufwärtstrend) erfasst Trendwiederaufnahme, die reine Kurs-Werkzeuge übersehen.

Der Anwendungsfall, der *nicht* so gut funktioniert wie gemeinhin angenommen: das Vorhersagen absoluter Hochs und Tiefs in Echtzeit. Flow-Signale sind an Extremen rauschiger als an Übergängen; der sauberere Lesewert liegt am Übergang (Abwärtstrend → Konsolidierung) statt am Extrem (Spitze eines Aufwärtstrends).

## Was übersieht Flow?

Drei strukturelle blinde Flecken, die man kennen sollte, bevor man dem Signal zu viel vertraut:

1. **Kann institutionellen nicht von Retail-Flow unterscheiden.** Ein 10%-Volumenanstieg könnte ein institutioneller Käufer sein, der akkumuliert, oder 10.000 Retail-Trades. Der Flow-Indikator behandelt beide identisch. Bei Werten mit starkem options-bedingtem Hedging-Flow (insbesondere Large-Cap-Tech) ist diese Verzerrung erheblich — Optionshändler-Hedges können den Tages-Flow dominieren, ohne fundamentale Überzeugung widerzuspiegeln.
2. **Kann Dark-Pool- / Off-Exchange-Volumen nicht sehen.** Moderne US-Aktienmärkte handeln 30–50% des Volumens außerbörslich. Tape-basierte Flow-Indikatoren sehen nur das Volumen des sichtbaren Marktes. Das Signal ist immer noch real (Sichtbarer-Markt-Flow korreliert mit Off-Exchange-Flow), aber die absoluten Werte sind nicht das vollständige Bild.
3. **Empfindlich gegen Gap-Tage.** Earnings-Gaps, News-Gaps und Übernacht-Stopps produzieren Ein-Bar-Volumenspitzen, die den Indikator für die nächsten N Bars dominieren. Der 14-Bar-MFI braucht 14 Sitzungen, um einen einzelnen anomalen Gap voll zu diskontieren.

Das PickSkill-Flow-Dashboard markiert Gap-Tag-Bars und Limit-Tag-Bars (für A-Aktien) explizit als Ausreißer; die geglätteten Flow-Werte schließen sie vom rollenden Fenster aus, damit einmalige Ereignisse den Lesewert nicht dominieren.

## Vier Fallstricke beim Interpretieren von Flow-Signalen

1. **Das absolute Level statt den Trend lesen.** „MFI ist 65" ist kaum informativ. „MFI ist über die letzten 8 Bars von 35 auf 65 gestiegen, während der Kurs flach war" ist dieselbe Zahl, aber ein viel stärkeres Signal. Flow-Indikatoren sind am nützlichsten über ihre Steigung und Trajektorie, nicht über ihren Momentaufnahmewert.
2. **Volumen mit Flow verwechseln.** Ein Tag mit hohem Volumen nach oben ist bullisch; ein Tag mit hohem Volumen nach unten ist bärisch. Volumen allein ist neutral; es verstärkt die Richtung, in die der Bar zufällig schloss. Flow-Indikatoren sind Volumen *gewichtet nach Richtung* — diese Gewichtung ist der gesamte Informationsgehalt. Wenn Sie nur Volumen-Bars ohne Richtungsüberlagerung anschauen, schauen Sie nicht auf Flow.
3. **Marktweiten Flow-Kontext ignorieren.** Eine Aktie mit steigendem OBV während eines marktweiten Selloffs ist informativer als eine Aktie mit steigendem OBV in einer marktweiten Rallye — bei ersterer baut echte Überzeugung gegen den Strom auf; bei letzterer ist der Flow nur Markt-Beta. Prüfen Sie Flow immer gegen den breiteren Markt-Flow.
4. **Flow ohne Price-Action-Trigger handeln.** Wenn der Flow nach oben dreht, heißt das nicht „kaufen"; es heißt „auf einen Kauftrigger warten". Warten Sie auf eine Price-Action-Bestätigung (Ausbruch über ein Niveau, MA-Kreuz, MACD-Drehung), bevor Sie Größe aufbauen.

## Wie sich Geldfluss auf A-Aktien verhält

Der A-Aktien-Markt hat zusätzliche Flow-Dynamiken, die es zu verstehen lohnt:

- **Northbound- / Southbound-Flow** (Stock-Connect-Zuflüsse aus Hongkong) ist eine separate, öffentlich offengelegte Flow-Serie. Sie ist nicht dasselbe wie tape-basiertes MFI / CMF / OBV — sie erfasst speziell den ausländischen institutionellen Flow über den Connect-Kanal. Viele lokale Plattformen aggregieren das zu einem „北向资金净流入"-Indikator, der darüber informiert, *wer* kauft, nicht nur *wie viel* Volumen gehandelt wurde.
- **Day-Trading-Beschränkungen (T+1) komprimieren Flow-Signale.** Weil A-Aktien-Investoren nicht am selben Tag verkaufen können, ist das Tagesvolumen stark zu Erstkäufen verzerrt — Übernachtrisiko wird gehalten, nicht aufgelöst. Das macht A-Aktien-OBV gerichteter als US-OBV, aber auch anfälliger für Ein-Tages-Herding-Spitzen.
- **Limit-up-Tage beschneiden Flow.** Wenn eine Aktie am Limit-up festsitzt, kann das Volumen im Orderbuch enorm sein, aber das ausgeführte Volumen ist klein. Die meisten Datenfeeds melden das ausgeführte Volumen; Flow-Indikatoren, die das ausgeführte Volumen nutzen, unterschätzen die echte Nachfrage an Limit-Tagen. Limit-Tag-Flow-Signale mit Vorsicht handeln.

Siehe [Beste Indikatoren für A-Aktien](/blog/best-indicators-for-a-shares) für das breitere Playbook.

> **Verfolgen Sie Flow in Ihren Positionen.** Das [/indicators](/indicators)-Flow-Dashboard zeigt MFI und CMF für jede Position, zeigt den 5-Tage-Flow-Trend-Bucket und markiert explizit Akkumulationsmuster (steigendes OBV während seitwärts laufendem Kurs) und Distributionsmuster (fallendes OBV während steigendem Kurs).

## Wie Flow in einen Mehrsignal-Workflow passt

Flow ist die *Partizipationsschicht* — sie beantwortet „stützt das Volumen die Bewegung?". Diese Schicht fügt sich in einen breiteren Stack ein:

| Schicht | Werkzeug | Frage |
|---|---|---|
| **Trend** | MA-Stack, [ADX](/blog/what-is-adx) | Richtung? Stärke? |
| **Momentum** | [MACD](/blog/what-is-macd), [RSI](/blog/what-is-rsi) | Jüngste Änderungsrichtung? |
| **Partizipation** | MFI, CMF, OBV | Wird die Bewegung vom Volumen gestützt? |
| **Volatilität** | [Bollinger-Bänder](/blog/what-is-bollinger-bands) | Ist die Bewegung proportional? |
| **Karte** | [Unterstützung / Widerstand](/blog/what-is-support-resistance) | Wo liegen die Schlüssel-Niveaus? |

Verwenden Sie die Partizipationsschicht, um Signale aus den anderen Schichten zu *bestätigen*, nicht um Signale eigenständig zu erzeugen. Ein bullisches Setup mit steigendem OBV, MACD-Goldenem-Kreuz und Kurs über dem 50-Tage-MA hat materiell höhere Überzeugung als jedes davon allein.

## Weiterführende Literatur

- [Marc Chaikins Money-Flow-Paper](https://www.chaikinanalytics.com/) — die eigene Behandlung des Entwicklers zu CMF und der Persistenz-des-Geldflusses-Theorie.
- [Joseph Granville, *New Strategy of Daily Stock Market Timing*](https://www.amazon.com/dp/0136150896) — ursprüngliche OBV-Referenz; der Methodologieabschnitt ist noch lesenswert.

## FAQ

**Welchen Flow-Indikator soll ich verwenden?**
Beginnen Sie mit OBV — er ist der einfachste und robusteste. Verwenden Sie MFI, wenn Sie einen begrenzten 0–100-Wert wie beim RSI möchten. Verwenden Sie CMF für Bar-für-Bar-Präzision, wenn Sie sich darum kümmern, wie jeder einzelne Bar innerhalb seiner Range schloss. Die drei stimmen meistens überein; wenn sie nicht übereinstimmen, ist OBV in der Regel das sauberste Signal. Das PickSkill-Flow-Dashboard zeigt alle drei.

**Ist „Smart Money Flow" dasselbe wie Geldfluss?**
„Smart Money Flow" ist ein Marketingbegriff, keine technische Definition. Die meisten „Smart-Money"-Indikatoren sind umverpackte Versionen von OBV / MFI / CMF, manchmal mit einer Tageszeit-Gewichtung (späte-Tag-Volumen bekommt mehr Gewicht unter der Theorie, dass Institutionen in den Schluss hinein handeln). Das zugrunde liegende Signal stammt aus derselben Familie; das Branding variiert.

**Kann Geldfluss vorhersagen, wohin eine Aktie geht?**
Vorhersagen ist zu stark formuliert. Geldfluss kann Ihnen sagen, ob die aktuelle Bewegung gut durch Volumen gestützt wird (was die Wahrscheinlichkeit der Fortsetzung erhöht) oder schlecht gestützt (was die Wahrscheinlichkeit des Scheiterns erhöht). Er kann Ihnen die Richtung nicht isoliert sagen — Flow flacht in langen Seitwärtsphasen ab und produziert während newsgetriebener Gaps Fehlsignale. Behandeln Sie ihn als Konfidenzmodifikator für Signale aus anderen Werkzeugen, nicht als gerichtete Prognose.

**Warum sieht Flow auf verschiedenen Plattformen unterschiedlich aus?**
Drei Ursachen: (1) unterschiedliche N-Werte (14 vs. 21 beim MFI; 20 vs. 21 beim CMF), (2) unterschiedlicher Umgang mit Pre-Market- / After-Hours-Volumen (einige beziehen erweiterte Handelszeiten ein; PickSkill verwendet aus Konsistenzgründen nur reguläre Sitzungen), (3) unterschiedliche Gap-Tag-Behandlung. Für Konsistenz verwendet PickSkill regulär-Sitzungs-Volumen, schließt Limit-Tag-Bars (A-Aktien) aus und wendet einen einzigen Satz von Default-N-Werten über alle Positionen an.

**Wie interagiert Flow mit options-bedingtem Hedging?**
Bei stark beoptionierten Large-Caps kann Händler-Hedging 20–40% des Tages-Flow ausmachen, ohne fundamentale Überzeugung widerzuspiegeln — eine Aktie mit steigendem Gamma-Exposure zwingt Händler, an Aufwärtstagen zu kaufen und an Abwärtstagen zu verkaufen, was Flow-Werte in beide Richtungen aufbläht. Bei Werten mit starker Optionsaktivität sind Flow-Signale weniger informativ als bei weniger optionierten Werten; kombinieren Sie Flow mit Skew impliziter Volatilität und Gamma-Exposure-Daten für ein vollständiges Bild.
