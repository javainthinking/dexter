---
title: >-
  Was ist ATR (Average True Range)? Die Volatilitätskennzahl, die Positionen
  dimensioniert
description: >-
  ATR misst die durchschnittliche Bar-Volatilität. Formel, warum es das richtige
  Werkzeug für Positionsgrößenbestimmung und Stops ist, das
  ATR-Multiplikator-Schema und vier Fallstricke.
publishedAt: 2026-05-26T00:00:00.000Z
updatedAt: 2026-05-26T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    Das PickSkill-Research-Team — wir bauen einen AI-Analysten für
    Privatanleger.
pillar: explainer
tags:
  - ATR
  - Volatilität
  - Technische Analyse
  - Positionsgrößenbestimmung
  - Indikatoren
heroImage: /blog/what-is-atr/hero.png
heroAlt: >-
  Editorial-Infografik — vier Aktien von niedrigem ATR (KO) bis hohem ATR
  (Small-Cap) angeordnet, demonstrieren, wie ATR-basierte Stops Positionsgrößen
  an Volatilität anpassen.
---

**Average True Range (ATR) ist der Durchschnitt der „True Range" über N Bars, wobei die True Range den größten Wert von (Tageshoch − Tagestief), (Tageshoch − vorheriger Schluss) oder (vorheriger Schluss − Tagestief) erfasst.** Es ist der wichtigste Indikator, den die meisten Privatanleger nicht nutzen. ATR liefert keine Einstiegssignale. Er sagt Ihnen etwas Nützlicheres: *wie stark sich diese Aktie in einem typischen Bar bewegt*, sodass Sie Positionen dimensionieren und Stops so setzen können, dass sie die zugrunde liegende Volatilität respektieren. Ein 1 %-Stop bei einer Aktie mit hohem ATR und ein 1 %-Stop bei einer Aktie mit niedrigem ATR sind nicht dasselbe Geschäft.

### Kernpunkte

- **Formel**: `True Range = max(Hoch − Tief, |Hoch − vorheriger Schluss|, |Tief − vorheriger Schluss|)`. Dann `ATR(N) = Durchschnitt der TR über die letzten N Bars`. Standard N = 14 (Wilder-Glättung).
- **ATR ist in Dollar-Einheiten** (z. B. 1,85 USD), nicht in Prozent. Dieselbe Aktie zu unterschiedlichen Preisen hat unterschiedliche ATR. ATR / Kurs ergibt das Prozent-Äquivalent.
- **Positionsgrößenbestimmung**: Eine gängige Regel lautet „1× ATR initialer Stop, 0,5–1 % Portfoliorisiko pro Trade". Größerer ATR = kleinere Position, um das Dollar-Risiko konstant zu halten.
- **Volatilitätsregime verschieben sich.** Der ATR einer Aktie kann sich in Monaten um Earnings, Makroschocks oder Nachrichten verdoppeln. Rekalibrieren Sie Stops und Größenbestimmung, wenn sich das Regime ändert.
- **ATR ist richtungsneutral.** Er sagt nichts darüber aus, in welche Richtung die Aktie geht. Paaren Sie ihn mit [MA-Stack](/blog/what-is-ma), [MACD](/blog/what-is-macd) oder anderen Richtungswerkzeugen.

## Wie wird ATR berechnet?

Die „True Range" für jeden Bar behandelt Übernacht-Gaps sauber:

```
TR[t] = max(
  Hoch[t] − Tief[t],
  |Hoch[t] − Schluss[t-1]|,
  |Tief[t]  − Schluss[t-1]|
)
```

Der erste Term ist die Intraday-Spanne des Bars. Der zweite und dritte Term fangen Gap-up- und Gap-down-Eröffnungen ab, bei denen die tatsächliche Kursbewegung vom vorherigen Schluss größer war als die eigene Spanne des Bars. Das „True" in True Range bedeutet: die größte plausible Bewegung, einschließlich Gaps.

Dann mittelt ATR über N Bars mit der Wilder-Glättung (dieselbe exponentielle Glättung, die im [RSI](/blog/what-is-rsi) verwendet wird):

```
ATR[t] = (ATR[t-1] × (N-1) + TR[t]) / N
```

Standard N = 14 auf praktisch jeder Plattform. Die Wilder-Glättung bedeutet, dass jeder neue TR ein Gewicht von 1/N (~7,1 % bei N = 14) erhält, wobei das Residuum fortgetragen wird.

## Was sagt ATR tatsächlich aus?

ATR ist ein Dollarbetrag: „1,85 USD ATR bei einer 100-USD-Aktie" bedeutet, dass die typische Bar-Bewegung (einschließlich Übernacht-Gaps) 1,85 USD beträgt. Das ist aus mehreren Gründen direkter nützlich als die Prozent-Volatilität:

- **Stops sind Dollar-Ereignisse.** Ob Ihr Stop ausgelöst wird, hängt von Dollar-Bewegungen ab, nicht von Prozent-Bewegungen.
- **Risiko pro Aktie ist die richtige Einheit zur Größenbestimmung.** Dollar-ATR = erwartete Dollar-Bewegung pro Aktie = die richtige Referenz für das Risiko pro Aktie.
- **Der aktienübergreifende Vergleich ist in ATR % ehrlicher.** Teilen Sie den ATR durch den aktuellen Kurs, um den ATR % zu erhalten — direkt vergleichbar über Aktien mit unterschiedlichen Preisniveaus.

| Aktie | Kurs | ATR | ATR % | Interpretation |
|---|---|---|---|---|
| Mega-Cap (z. B. KO) | 60 USD | 0,45 USD | 0,75 % | Niedrige Volatilität — großes, stabiles Geschäft |
| Tech-Large-Cap (z. B. AAPL) | 180 USD | 2,40 USD | 1,3 % | Mittlere Volatilität |
| Wachstumswert (z. B. PLTR) | 35 USD | 1,20 USD | 3,4 % | Höhere Volatilität |
| Small-Cap | 25 USD | 1,30 USD | 5,2 % | Hohe Volatilität — weitere Stops nötig |

Das Muster: Große, stabile Geschäfte haben einen niedrigen ATR %; kleine, wachstumsstarke oder nachrichtengetriebene Namen haben einen hohen ATR %. Die aktienübergreifenden Unterschiede sind groß und für die Größenbestimmung relevant.

## Das ATR-Multiplikator-Schema für Stops

Der häufigste praktische Einsatz von ATR ist das Setzen initialer Stop-Loss-Marken bei einem Vielfachen des ATR:

- **1× ATR Stop**: Eng. Nützlich für Setups mit hoher Überzeugung, bei denen Sie minimalen Spielraum für Rauschen wünschen. Wird häufig ausgelöst.
- **2× ATR Stop**: Standard. Die meisten Swing-Trading-Systeme verwenden 2× ATR als Default. Filtert Routine-Rauschen heraus; fängt echte Umkehrungen ab.
- **3× ATR Stop**: Weit. Wird für langfristige Positions-Trades verwendet, bei denen Sie moderate Korrekturen überstehen wollen.

Beispiel mit AAPL bei 180 USD, ATR = 2,40 USD:

| Stop | Stop-Abstand | Stop-Preis | Risiko pro Aktie |
|---|---|---|---|
| 1× ATR | 2,40 USD | 177,60 USD | 2,40 USD |
| 2× ATR | 4,80 USD | 175,20 USD | 4,80 USD |
| 3× ATR | 7,20 USD | 172,80 USD | 7,20 USD |

Für 1 % Portfoliorisiko pro Trade auf einem 100.000-USD-Konto (1.000 USD Risikobudget):

| Stop-Vielfaches | Aktien (Risiko = 4,80 USD/Aktie bei 2× ATR) | Position in USD |
|---|---|---|
| 2× ATR (4,80 USD Risiko/Aktie) | 1.000 USD / 4,80 USD = 208 Aktien | 208 × 180 USD = 37.440 USD |

Das ATR-Multiplikator-Schema dimensioniert automatisch kleinere Positionen bei Aktien mit hohem ATR und größere Positionen bei Aktien mit niedrigem ATR, sodass das Dollar-Risiko pro Trade konstant bleibt. Das ist das einfachste bedeutsame Upgrade gegenüber einer Größenbestimmung mit fester Aktienzahl oder festem Dollarbetrag.

## Warum Volatilitätsregime zählen

ATR ist nicht statisch — er verschiebt sich im Zeitverlauf, wenn sich das Volatilitätsregime verschiebt. Drei Muster, die man erkennen sollte:

1. **Earnings-Ausweitung**: ATR steigt typischerweise in den 2–3 Sitzungen rund um eine Earnings-Veröffentlichung um 50–100 %, dann beruhigt er sich wieder. Stops, die auf dem Vor-Earnings-ATR basieren, können durch Routine-Earnings-Tagesbewegungen ausgelöst werden.

2. **Makroschock-Ausweitung**: Der ATR für den gesamten Markt weitet sich während VIX-Spitzen (Zinsentscheidungen, geopolitische Ereignisse, Bankenstress) aus. Ein 14-Bar-ATR spiegelt dies innerhalb von 7–10 Sitzungen wider; Positionen, die in das Regime hinein gehalten werden, sollten neu dimensioniert werden.

3. **Kompression vor dem Ausbruch**: Ein über viele aufeinanderfolgende Wochen fallender ATR geht häufig einer scharfen Richtungsbewegung voraus. Die „ATR-Squeeze" paart sich natürlich mit der [Bollinger-Band-Squeeze](/blog/what-is-bollinger-bands) — beide messen dasselbe Aufwickelphänomen.

Die PickSkill-Dashboards führen ATR als verfolgte Kennzahl, sodass Sie Regimewechsel auf einen Blick sehen.

## Vier Fallstricke beim Einsatz von ATR

1. **Stops ohne ATR setzen.** Stops mit festem Prozentsatz (z. B. „immer 5 % Stop") ignorieren die Tatsache, dass 5 % bei einer ruhigen Aktie und 5 % bei einer volatilen Aktie sehr unterschiedlich sind, was angeht, wie häufig der Stop auf Rauschen versus echte Umkehrungen reagiert. ATR-basierte Stops sind rauschsensibel.

2. **ATR für die Richtung verwenden.** ATR ist konstruktionsbedingt richtungsneutral — er sagt Ihnen, wie stark sich die Aktie bewegt, nicht in welche Richtung. „Hohen ATR" als bärisch oder „niedrigen ATR" als bullisch zu behandeln, ist ein Kategorienfehler. Paaren Sie ihn mit Richtungswerkzeugen.

3. **ATR nicht an das Regime anpassen.** ATR, der auf den letzten 14 ruhigen Marktbars berechnet wurde, unterzeichnet die Volatilität, der Sie im nächsten Regime begegnen werden. Nach einem Regimewechsel (Earnings, Nachrichten, Makro) geben Sie ATR 7–10 Bars Zeit, das neue Normal widerzuspiegeln, bevor Sie in neue Positionen einsteigen.

4. **ATR mit realisierter Volatilität (Sigma) verwechseln.** Beide messen Volatilität, aber mit unterschiedlicher Mathematik. Die realisierte Volatilität ist die Standardabweichung der Tagesrenditen und wird beim Optionspricing verwendet. ATR ist die durchschnittliche True Range und ist für Stops und Größenbestimmung intuitiver. Sie stimmen in der Richtung meist überein, aber die Zahlen sind nicht austauschbar.

## Wie ATR in einen Multi-Signal-Workflow passt

ATR ist die *Volatilitäts*-Schicht, die alles andere dimensioniert:

| Schicht | Werkzeug | Beantwortete Frage |
|---|---|---|
| **Richtung** | MA-Stack, [MACD](/blog/what-is-macd), Trendfilter | In welche Richtung geht der Markt? |
| **Setup** | [Divergenz](/blog/what-is-divergence), [Unterstützung/Widerstand](/blog/what-is-support-resistance) | Gibt es ein handelbares Muster? |
| **Trigger** | %K kreuzt %D, MACD-Linien-Kreuz | Wann handeln? |
| **Volatilität / Größenbestimmung** | **ATR** | Wie groß sollte die Position sein? Wo sollte der Stop sitzen? |
| **Bestätigung** | [Volumen](/blog/what-is-volume-analysis), [Kapitalfluss](/blog/what-is-capital-flow) | Wird die Bewegung von Beteiligung gestützt? |

Die am häufigsten übersprungene Schicht im Retail-Trading ist die Volatilität. Ohne sie sind Positionsgrößen willkürlich, und Stops sind entweder zu eng (ausgespielt) oder zu weit (übergroße Verluste).

## Wie sich ATR auf A-Aktien verhält

Die A-Aktien-Marktmikrostruktur verändert die Interpretation des ATR:

- **Limit-up-/Limit-down-Tage** deckeln die Bar-Spanne am Limit-Preis (±10 % am Hauptboard). An einem Limit-Tag ist die True Range genau die Limit-Bewegung; ATR, der über aufeinanderfolgende Limit-Tage berechnet wird, überzeichnet die wahre Volatilität. Die PickSkill-A-Aktien-Dashboards kennzeichnen Limit-Tag-Bars als Ausreißer.
- **T+1-Abwicklung** komprimiert die Intraday-Volatilität in die Eröffnungen der nächsten Sitzungen. Die Häufigkeit von Gap-Tagen ist bei A-Aktien höher als bei US-Large-Caps; die Gap-Behandlung in der True-Range-Formel zählt mehr.
- **Aussetzungen** erzeugen Diskontinuitäten. ATR-Werte nach einer Aussetzung sollten in den ersten 5–10 Bars abgewertet werden.

Siehe [Beste Indikatoren für A-Aktien](/blog/best-indicators-for-a-shares) für den breiteren marktspezifischen Spielplan.

> **Sehen Sie ATR in Ihrem Portfolio.** Fragen Sie in [/chat](/chat): „Zeige mir für jede Position den aktuellen ATR, ATR % und die Veränderung gegenüber dem 60-Tage-Durchschnitt. Markiere alle, bei denen der ATR mehr als 1,5× seines 60-Tage-Durchschnitts beträgt — diese Namen befinden sich in einem Regimewechsel und benötigen eine Stop-Loss-Rekalibrierung."

## Häufige Folgeprompts

- *„Berechne für [Ticker] den 2× ATR Stop und sage mir, wie viele Aktien ich für 1 % Portfoliorisiko halten sollte."*
- *„Finde S&P-500-Namen, deren ATR sich in den letzten 8 Wochen um 30 %+ komprimiert hat — Bollinger-Squeeze-Kandidaten."*
- *„Vergleiche den aktuellen ATR meiner Positionen mit ihrer 12-Monats-Spanne. Welche befinden sich an Niedrigvolatilitätsextremen (potenzieller Ausbruch) versus Hochvolatilitätsextremen (vorerst meiden)?"*
- *„Backteste einen 2× ATR Trailing Stop auf [Ticker] über die letzten 5 Jahre. Wie schneidet er im Vergleich zu einem festen 5 %-Stop ab?"*

## Weiterführende Literatur

- [Investopedia zu ATR](https://www.investopedia.com/terms/a/atr.asp) — umfassende Referenz.
- [J. Welles Wilder Jr., *New Concepts in Technical Trading Systems*](https://www.amazon.com/dp/0894590278) — die ursprüngliche Behandlung der True Range und des ATR durch den Entwickler.

## FAQ

**Sollte ich ATR oder Standardabweichung für die Volatilität verwenden?**
ATR für Stops und Positionsgrößenbestimmung — er liegt in Dollar-Einheiten vor und ist direkt anwendbar. Die Standardabweichung (oder die annualisierte realisierte Volatilität, σ) für Optionspricing und statistische Analyse — sie liegt in Prozent vor und unterstellt Normalität. Beide stimmen meist in der Richtung überein, beantworten aber unterschiedliche Fragen.

**Was ist das richtige ATR-Vielfache für Stops?**
2× ATR ist der häufigste Startpunkt für Swing-Trades. 1× ATR ist eng (häufige Stop-Auslösungen, geeignet für Setups mit sehr hoher Überzeugung). 3× ATR ist weit (verwendet für Positions-Trades, bei denen Sie moderate Korrekturen überstehen wollen). Die Wahl hängt von der Haltedauer und der persönlichen Toleranz gegenüber Ausspielungen versus übergroßen Verlusten ab.

**Warum ist ATR in Dollar-Einheiten statt in Prozent?**
ATR wurde von Wilder für die Anwendung auf Rohstoff-Futures entworfen, bei denen das in Dollar denominierte Risiko die natürliche Einheit ist. Für Aktien ist Dollar-ATR weiterhin die richtige Einheit für Stop- und Größenentscheidungen (Ihr Stop ist ein Dollar-Ereignis, kein Prozent-Ereignis). Für den aktienübergreifenden Vergleich teilen Sie den ATR durch den aktuellen Kurs, um den ATR % zu erhalten.

**Wie verhält sich ATR zur Bollinger-Band-Breite?**
Beide messen Volatilität, aber mit unterschiedlichen Formeln. Die Bollinger-Bandbreite verwendet die Standardabweichung des Schlusskurses; ATR verwendet die True Range (die Gaps einschließt). Wenn beide divergieren (ATR steigt, aber die Bandbreite fällt), signalisiert das meist gap-getriebene Volatilität — die Tagesspannen weiten sich aus, aber die *Schlusskurse* liegen noch in einem engen Band. Dies ist ein nützliches Signal zur Regime-Erkennung.

**Sollte ich ATR für Aktiensplits anpassen?**
Ja — jeder kursbasierte Indikator pro Bar braucht eine Split-Anpassung für den historischen Vergleich. Die meisten Plattformen handhaben dies automatisch; manuelle ATR-Berechnungen auf rohen historischen Daten ohne Split-Anpassung erzeugen falsche Regimewechsel an Split-Daten. Die PickSkill-Dashboards verwenden durchgängig splitbereinigte Kurse.
