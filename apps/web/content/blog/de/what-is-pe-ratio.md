---
title: Was ist das KGV (P/E-Ratio)? Trailing, Forward, Shiller
description: KGV = Kurs / Gewinn je Aktie. Trailing-, Forward- und Shiller-Varianten; vier Vergleichsfallen; wie man gegen Peers, Eigenhistorie, Marktnorm ankert.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: Das PickSkill-Research-Team — wir bauen einen AI-Analysten für Privatanleger.
pillar: explainer
tags:
  - valuation
  - pe-ratio
  - multiples
  - fundamentals
heroImage: /blog/what-is-pe-ratio/hero.png
heroAlt: Editoriale Infografik mit der KGV-Formel und einer Lese-Skala von niedrig bis hoch
---

Das **KGV** (Kurs-Gewinn-Verhältnis, P/E) ist die am häufigsten zitierte Zahl an Aktienmärkten. Es ist gleichzeitig die am häufigsten missverstandene. Das KGV beantwortet eine simple Frage — wie viel zahlen Investoren pro Dollar aktuellen Gewinns — aber eine einzelne KGV-Zahl sagt fast nichts ohne Kontext: welcher Gewinn? trailing oder forward? GAAP oder bereinigt? Vergleich womit? Richtig verwendet ist das KGV der schnellste Sanity-Check in der Bewertung. Nachlässig verwendet ist es die Hauptquelle von „Diese Aktie sieht billig aus"-Thesen, die sich später als falsch erweisen.

Dieser Leitfaden behandelt die Formel, die wirklich relevanten Varianten (TTM vs Forward, Shiller CAPE), das Signal, das das KGV gibt, und die vier Fallstricke, die KGV-Vergleiche in der echten Research verbiegen.

### Kernaussagen

- **KGV = Aktienkurs / Gewinn je Aktie.** Ein einfaches Verhältnis mit einem täuschend komplexen Nenner.
- **Drei wissenswerte Varianten**: TTM (Trailing Twelve Months, rückblickend), NTM (Next Twelve Months, vorausschauend, der Default der Analysten) und Shiller CAPE (10-Jahres-Glättung, der Goldstandard für Makro-Vergleiche).
- **Hohes KGV = der Markt erwartet Wachstum; niedriges KGV = der Markt sieht Risiko oder Niedergang.** Beides ist nicht automatisch gut oder schlecht — Kontext ist alles.
- **Wenn Gewinne lügen, lügt das KGV mit.** Zyklische Tiefs (niedrige Gewinne, hohes KGV), Einmal-Gewinne (hohe Gewinne, niedriges KGV), aggressive GAAP-vs-bereinigt-Überleitungen — alle verzerren das KGV.
- **KGV funktioniert nur im Vergleich** — gegen die eigene Historie, gegen Peers, gegen den Markt. Eine nackte KGV-Zahl ist eine halbe Wahrheit.

## Was ist das KGV?

Die Formel in einer Zeile:

```
KGV = Aktienkurs / Gewinn je Aktie
```

Aktie bei 150 $, Gewinn je Aktie 5 $ → KGV 30. Der Markt zahlt heute 30 $ für jeden Dollar des *aktuellen* Gewinns — das ist nur dann sinnvoll, wenn es mit einer Sicht auf das Wachstum der Gewinne kombiniert wird.

Welcher Gewinn in die Formel kommt, ist so wichtig wie der Preis:
- **TTM-KGV**: Gewinne der letzten 12 Monate. Rückblickend. Am besten verteidigbar, aber Rückspiegel.
- **NTM-KGV**: Konsens-Schätzungen für die nächsten 12 Monate. Vorausschauend, Profi-Default.
- **Shiller-KGV (CAPE)**: 10 Jahre inflationsbereinigte Gewinne im Nenner. Glättet Zyklen. Hauptsächlich auf Marktebene (S&P 500).

## Welches Signal gibt das KGV?

Das KGV reflektiert zwei Dinge im Bündel: **erwartetes Wachstum** und **wahrgenommenes Risiko**.

| KGV-Lesung | Typische Interpretation |
|---|---|
| **< 10** | Deep Value, gedrückte Gewinne (zyklisches Tief), oder strukturell rückläufiges Geschäft |
| **10–15** | Reifes, stabiles Geschäft mit niedrigen-mittleren Wachstumserwartungen |
| **15–25** | „Normale" Range des US-Marktes der letzten 20 Jahre |
| **25–40** | Über-Markt-Multiplikator; Markt preist nennenswertes Wachstum ein |
| **> 40** | Hyperwachstum-Pricing oder gedrückte Gewinne, die das Multiple aufblähen |

Schlüsselwort ist *Interpretation*. Ein KGV 40× auf einer Firma mit 30% Wachstum und hoher FCF-Konvertierung ist rational. Ein KGV 40× auf einer 5%-Wachstum-Firma ist eine Story-Aktie, die zu brechen wartet. Der Rahmen, der Wachstum korrekt bepreist, findet sich in [Was ist DCF?](/blog/what-is-dcf).

## Die vier Fallstricke, die KGV-Vergleiche verbiegen

1. **Zyklische Gewinne.** Im zyklischen Tief sind Gewinne gedrückt, was das KGV mechanisch aufbläht. Über den Zyklus mitteln und dann KGV berechnen.
2. **Einmal-Posten.** 500 Mio. $ Veräußerungsgewinn im Jahresüberschuss senkt das KGV mechanisch, ohne das Geschäft zu verändern. Immer prüfen, ob die berichteten Gewinne nicht wiederkehrende Items enthalten.
3. **Aktienbasierte Vergütung (SBC).** GAAP enthält SBC als Aufwand; die „bereinigten" Gewinne schließen sie meist aus. Big Tech hat hier 30–50% Differenz allein durch SBC. KGV 20× auf bereinigtem EPS wird zu 30× auf GAAP-EPS — gleiche Firma, sehr unterschiedliche Lesart. Siehe [Was ist FCF?](/blog/what-is-fcf).
4. **Branchenübergreifende Vergleiche.** Versorger bei 12–15× weil langsam und stabil; Software bei 35× weil schnell und unbeständig. Beide am rohen KGV zu vergleichen ist Äpfel mit Birnen.

Die 134-Wörter-Regel: **niemals ein KGV ohne Anker zitieren** — eigene Historie, Peer-Set oder langfristige Marktnorm. Sonst sind das keine Daten, sondern Stimmung.

## KGV vs andere Multiplikatoren

| Multiplikator | Am besten für | Vorbehalt |
|---|---|---|
| **KGV** | Reife, profitable Geschäfte mit stabilen Gewinnen | Bricht bei null/negativ; sensitiv gegenüber Bilanzwahl |
| **Forward-KGV** | Wachstumsfirmen, deren aktuelle Gewinne die Run-Rate untertreiben | Hängt davon ab, dass der Konsens stimmt |
| **EV/EBITDA** | Kapitalintensive Geschäfte; Vergleich über Kapitalstruktur | Ignoriert Capex — siehe [Was ist EV/EBITDA?](/blog/what-is-ev-ebitda) |
| **EV/Sales** | Verlust-Wachstumsfirmen (frühe SaaS, Biotech) | Sagt nichts über Profitabilität |
| **P/Buch** | Banken, bilanzschwere Geschäfte | Wertlos bei Asset-Light |

Für das Big Picture absolut vs. relativ siehe [DCF vs Multiplikatoren-Analyse](/blog/dcf-vs-comparable-company-analysis).

## Wie man das KGV produktiv nutzt

Ein Workflow, der die Prüfung übersteht:

1. **TTM-KGV und NTM-KGV des Unternehmens ziehen.** Die Lücke zwischen beiden offenbart die Wachstumserwartung des Marktes.
2. **Dieselben zwei Verhältnisse für 5–8 Peers ziehen.** Median bilden.
3. **Eigene 5-Jahres-KGV-Range berechnen** (Tief, Mittel, Hoch). Wo liegt das aktuelle KGV in dieser Range?
4. **Fragen: warum liegt das KGV jetzt da, wo es liegt?** Wenn es über Peer-Median UND über der eigenen Historie ist, preist der Markt etwas ein — was?
5. **Stresstest des implizierten Wachstums.** Wenn das aktuelle KGV nur bei „20% Gewinnwachstum 5 Jahre lang" Sinn ergibt, ist das plausibel?

Genau das fährt PickSkill, wenn Sie nach einem „KGV-Vergleich" fragen.

## Wie PickSkill das KGV nutzt

[/chat](/chat) öffnen und tippen:

> *„Zieh NVDAs TTM- und NTM-KGV, vergleich gegen seine 5-Jahres-Historie und gegen AMD, AVGO, INTC und TSM. Zeig mir, welches implizite Gewinnwachstum das aktuelle KGV relativ zu Peers impliziert."*

PickSkill zieht TTM-KGV aus dem aktuellsten 10-K/10-Q, NTM-KGV aus dem Konsens, die eigene 5-Jahres-Range, dieselben zwei Metriken für das Peer-Set und berechnet das implizierte Mehrjahreswachstum, das den aktuellen Multiplikator rechtfertigen würde. Output: eine Tabelle — Handarbeit etwa 40 Minuten.

Kombiniert sich mit dem [Comps-Workflow](/blog/dcf-vs-comparable-company-analysis) — KGV ist die Schlagzeile, Comps die strukturierte Tabelle dahinter.

## FAQ

**Was ist der Unterschied zwischen TTM- und NTM-KGV?**
TTM = Trailing Twelve Months, rückblickend, echte gemeldete Gewinne. NTM = Next Twelve Months, vorausschauend, Konsens-Schätzungen. Die meisten Profis zitieren Forward, weil Investieren um die Zukunft geht; Trailing ist verteidigbar, wenn man sich nicht auf den Konsens verlassen will.

**Was ist ein „gutes" KGV?**
Es gibt kein universelles „gutes" KGV. 12× auf einer Versorgeraktie ist fair; 12× auf einer SaaS-Firma mit 30% Wachstum suggeriert, dass der Markt das Wachstum für unecht hält. Immer gegen (a) eigene Historie, (b) Peers, (c) breiten Markt verankern.

**Was ist das Shiller-KGV (CAPE)?**
Zyklisch bereinigtes KGV, popularisiert vom Yale-Ökonomen Robert Shiller. Verwendet 10-Jahre inflationsbereinigte Gewinne im Nenner. Hauptsächlich auf Marktebene (S&P-500-CAPE ist bekannt).

**Kann ein KGV negativ sein?**
Mathematisch ja, bei negativen Gewinnen. In der Praxis melden Analysten „N/M" (nicht aussagekräftig) und wechseln zu EV/Sales oder EV/EBITDA. KGV funktioniert nur bei positiven, einigermaßen stabilen Gewinnen.

**Wo finde ich das KGV einer Aktie?**
Die meisten Finanzdienste (Yahoo Finance, Bloomberg, Ihr Broker) zeigen TTM standardmäßig. Forward benötigt Konsens-Schätzungen. [PickSkill](/chat) berechnet alle drei (TTM, NTM, Shiller) aus Primärquellen und legt die Lücken zwischen ihnen als Signal offen.
