---
title: Wie Sie eine neue Aktie in 15 Minuten mit PickSkill recherchieren
description: >-
  Ein vollständiger Erst-Recherche-Workflow — Geschäftsmodell, Finanzkennzahlen,
  Bewertung, technisches Setup und Risiken — in 15 Minuten mit den Chat- und
  Indikator-Tools.
publishedAt: 2026-05-26T00:00:00.000Z
updatedAt: 2026-05-26T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    Das PickSkill-Research-Team — wir bauen einen AI-Analysten für
    Privatanleger.
pillar: how-to
tags:
  - Tutorial
  - Recherche
  - Workflow
  - DCF
  - 10-K
  - Indikatoren
heroImage: /blog/how-to-research-a-new-stock-in-15-minutes/hero.png
heroAlt: >-
  Editorial-Infografik — links der 5-Schritte-Recherche-Workflow (Geschäft →
  Finanzen → Bewertung → Technisch → Risiken), rechts die
  Ein-Seiten-Entscheidungskarte für TSM.
---

**Eine Erst-Recherche-Sitzung zu einer Aktie, die früher 2–3 Stunden in Anspruch nahm, lässt sich mit dem richtigen Workflow in 15 Minuten erledigen.** Nicht, weil Sie Schritte überspringen — das Rahmenwerk deckt weiterhin Geschäftsmodell, Finanzkennzahlen, Bewertung, technisches Setup und Risiken ab —, sondern weil PickSkill den Schritt der Datenbeschaffung in Sekunden komprimiert und Ihnen die 15 Minuten lässt, die Sie tatsächlich brauchen: die Ermessensentscheidungen. Dieses Tutorial ist der kanonische Erst-Recherche-Workflow. Setzen Sie ihn für jeden neuen Namen ein, den Sie in Erwägung ziehen, bevor Sie entscheiden, ob Sie ihn auf eine Watchlist setzen oder zusätzliche Recherchezeit investieren.

### Kernpunkte

- **5 Schritte, insgesamt ca. 15 Minuten.** Geschäft → Finanzen → Bewertung → Technik → Risiken. Jeder Schritt ist ein Prompt.
- **Das Rahmenwerk erzwingt strukturiertes Denken** — kein vorschnelles Abgleiten zur Frage „Soll ich das kaufen?", bevor die vorgelagerten Fragen beantwortet sind.
- **Es produziert eine einseitige Zusammenfassung**, die sich entweder zum Aufnehmen in eine [Watchlist](/blog/how-to-build-a-watchlist-that-actually-works) oder zum Verwerfen des Namens eignet.
- **Die schnelle Variante (15 Minuten) erfasst 80 % der K.-o.-Kriterien.** Die langsame Variante (2+ Stunden Tiefenarbeit) ist nur dann nötig, wenn die schnelle Variante „interessant" sagt.
- **Funktioniert bei US-Aktien, Hongkong-Aktien und A-Aktien** mit identischem Workflow — PickSkill zieht die marktgerechten Einreichungen.

## Warum das wichtig ist

Die meisten Privatanleger stolpern bereits in der Phase der Erst-Recherche. Zwei häufige Fehler:

1. **Direkt zum Chart springen.** „Der Chart sieht gut aus" ist keine These. Ohne die Prüfung des zugrunde liegenden Geschäftsmodells und der Finanzen kaufen Sie ein Kursmuster.
2. **In Details ertrinken.** Den vollständigen 10-K, alle 8-K, das jüngste Earnings-Call-Transcript und sämtliche Analystenberichte zu lesen, bevor entschieden ist, ob ein Name überhaupt tiefere Arbeit wert ist. Wenn Sie damit fertig sind, haben Sie vier Stunden in einen Namen investiert, den Sie mit einem strukturierten Rahmenwerk schon nach einer Stunde abgelehnt hätten.

Der 15-Minuten-Erst-Recherche-Workflow ist der Ablehnungsfilter. Die meisten Namen, die Sie recherchieren, werden ihn nicht bestehen. Ziel ist es, pro Name 15 Minuten zu investieren und die zweistündige Tiefenanalyse den Namen vorzubehalten, die den Filter passieren.

## Der fünfstufige Workflow

### Schritt 1 — Geschäftsmodell (3 Minuten)

Öffnen Sie [/chat](/chat). Fügen Sie diesen Prompt ein:

```text
Summarize [TICKER] in 5 bullets:
1. What does the company actually do (1 sentence)
2. Revenue split — top 3 segments and their % of total
3. Top 3 customers or customer concentration
4. Top 3 competitors  
5. The single most important question this business needs to get right
```

PickSkill liefert eine prägnante Zusammenfassung des Geschäftsmodells, aufgebaut aus dem jüngsten 10-K und aktuellen Pressemitteilungen. Die Formulierung „die einzige wichtigste Frage" zwingt zur Klarheit darüber, was das Geschäft tatsächlich antreibt — ein guter Test dafür, ob Sie das Unternehmen verstehen oder nur das Tickersymbol.

**Warnzeichen in dieser Phase**: Das Geschäftsmodell ist nach fünf Punkten nicht klar, die Kundenkonzentration liegt bei über 30 % auf einem einzelnen Kunden, es ist kein sichtbarer Wettbewerbsgraben erkennbar. Stoppen Sie hier, wenn Sie das sehen; der Name ist die nächsten 12 Minuten nicht wert.

### Schritt 2 — Finanzielle Gesundheit (3 Minuten)

Nächster Prompt:

```text
For [TICKER], pull the last 4 quarters and last 3 years of:
- Revenue and revenue growth YoY
- Gross margin trajectory
- Operating margin trajectory  
- Free cash flow (last 4 quarters)
- Net debt position (cash − total debt)
- Share count change YoY (buybacks vs issuance)
```

PickSkill rendert dies als kleine Tabelle. Die finanzielle Geschichte sollte sich in einer Minute Leseaufwand erschließen lassen.

**Warnzeichen in dieser Phase**: Umsatzwachstum bricht scharf ein, Margen komprimieren ohne klare Ursache, negativer Free Cash Flow, der nicht aus bewussten Wachstumsinvestitionen stammt, Aktienanzahl wächst um 5 %+ pro Jahr ohne Akquisitionstätigkeit.

### Schritt 3 — Bewertungs-Snapshot (3 Minuten)

Nächster Prompt:

```text
For [TICKER], compute:
- Current trailing P/E, forward P/E, EV/EBITDA, P/B
- 5-year historical range for each multiple (10th–90th percentile)
- Where current multiples sit within that historical range
- Compare current multiples to 3 closest peers
- Quick 5-year DCF — implied price at base assumptions
```

PickSkill liefert die Multiplikatoren, den Peer-Vergleich und einen schnellen DCF (siehe [Build a DCF in 60 Seconds](/blog/build-dcf-in-60-seconds) für die ausführliche Variante).

**Warnzeichen in dieser Phase**: Jeder Multiplikator am oberen Ende seiner 5-Jahres-Bandbreite ohne klare Beschleunigung der Fundamentaldaten, die das rechtfertigt; vom DCF implizierter Preis mehr als 30 % unter dem aktuellen Kurs; relative Bewertung höher als bei jedem Peer.

### Schritt 4 — Technisches Setup (3 Minuten)

Nächster Prompt:

```text
For [TICKER], show me the current technical setup:
- Price vs 20 / 60 / 200-day MA
- Current MACD, RSI, KDJ readings
- Any active divergence (regular or hidden)
- Nearest support and resistance levels
- 5-day bucket trail across the full indicator suite
```

PickSkill zieht die [/indicators](/indicators)-Daten und legt die Multi-Signal-Ausrichtung offen.

**Warnzeichen in dieser Phase**: stark überkaufter Einstieg (RSI > 75, jeder Indikator am oberen Anschlag), eine sich bildende bärische Divergenz, ein Kurs, der weit über der 200-Tage-SMA liegt. Das sind keine „Jetzt kaufen"-Setups; das sind Namen, bei denen man auf einen Rücksetzer wartet.

### Schritt 5 — Risiken (3 Minuten)

Letzter Prompt:

```text
For [TICKER], list:
- Top 3 risks from the latest 10-K's risk factors section
- Top 3 risks from recent earnings calls (last 4 quarters)
- One downside scenario — what does this stock look like if the bull case is wrong?
```

PickSkill fasst die Risikofaktoren des 10-K und die jüngsten Management-Kommentare zusammen. Die Frage nach dem Negativszenario ist die, die die meisten Retail-Leser überspringen — und die, die die teuersten Fehler verhindert.

**Warnzeichen in dieser Phase**: Zu den vom Management genannten Risiken zählen Einzelkundenkonzentration, regulatorische Belastungen, Bilanzstress oder eine „Going-Concern"-Formulierung. Das sind keine automatischen Disqualifikationen, aber sie sollten die Diskussion über die Positionsgröße neu rahmen.

## Wie Sie den Output zusammenstellen

Nach Schritt 5 fragen Sie:

```text
Compile this conversation into a one-page summary I can save:
- Business model in 2 sentences
- Financials trajectory in 4 bullets
- Valuation summary with 3-line bull/base/bear
- Technical setup status
- Top 3 risks
- Decision: watchlist, deeper research, or pass
```

PickSkill liefert einen strukturierten One-Pager. Speichern Sie ihn über das Lesezeichen der Chat-Sitzung. Wenn Sie den Namen auf die [Watchlist](/blog/how-to-build-a-watchlist-that-actually-works) setzen, wird der One-Pager zu Ihrem Thesenpapier.

> **Probieren Sie es jetzt aus.** Öffnen Sie [/chat](/chat) und führen Sie die fünf oben genannten Prompts für einen Namen aus, den Sie in Erwägung ziehen. Die gesamte Schleife dauert inklusive Lesezeit etwa 15 Minuten.

## Was der Workflow erfasst, das ad-hoc-Recherche übersieht

### 1. Strukturelle Ablehnung versus kursgetriebene Ablehnung

Ad-hoc-Recherche lehnt Namen häufig auf Basis des Chartbildes ab („sieht überkauft aus"), ohne zu prüfen, ob das Geschäft überhaupt zu irgendeinem Preis besitzenswert ist. Der strukturierte Workflow dreht die Reihenfolge um: Geschäft → Finanzen → Bewertung → Technik. Wenn Geschäft oder Finanzen durchfallen, ist der Chart irrelevant; bestehen Geschäft und Finanzen, sagt Ihnen der Chart etwas über Timing, nicht über Tragfähigkeit.

### 2. Die Frage nach dem Negativszenario

Der am häufigsten übersprungene Schritt in der Retail-Recherche lautet: „Wie sieht der Bear Case aus?" Der strukturierte Workflow erzwingt ihn. Ohne diese Frage übergewichten Sie den Bull Case und sind auf die Varianz nicht vorbereitet.

### 3. Multi-Quellen-Synthese an einem Ort

Der Workflow zieht 10-K-Daten, jüngste Earnings, aktuelle Multiplikatoren, Peer-Vergleich und technischen Zustand in eine einzige Chat-Sitzung. Jeder einzelne Baustein würde manuell 10–20 Minuten kosten — PickSkill komprimiert jeden auf Sekunden und lässt Zeit für das eigentliche Nachdenken.

## Vier Fallstricke in der Aktienrecherche

1. **Den Schritt zum Geschäftsmodell überspringen.** Das Tickersymbol einer Aktie zu kennen, heißt nicht, das Unternehmen zu kennen. Ohne die Fünf-Punkte-Zusammenfassung handeln Sie ein Ticker, Sie recherchieren kein Unternehmen.
2. **Das Negativszenario ignorieren.** Bull Cases verkaufen sich von selbst; Bear Cases müssen bewusst zutage gefördert werden. Wenn Sie den Bear Case nicht artikulieren können, haben Sie die Recherche nicht abgeschlossen.
3. **„Alles grün" als Kaufsignal werten.** Eine Aktie mit starken Fundamentaldaten, attraktiver Bewertung und guter Technik ist nicht automatisch ein Kauf — manchmal ist es ein Name, bei dem das einfache Geld bereits verdient wurde und die nächsten 12 Monate seitwärts laufen. Positionsgröße und Disziplin beim Einstiegskurs sind entscheidend.
4. **Den Output nicht in eine Watchlist oder Ablehnung überführen.** Der ganze Zweck der 15-Minuten-Erst-Recherche ist die Entscheidung am Ende. „Muss ich mir noch überlegen" ist der Killer — es verbraucht mentale Bandbreite, ohne eine Entscheidung zu produzieren. Zwingen Sie sich, auf Watchlist, tiefere Recherche oder verwerfen zu landen.

## Wie sich das auf A-Aktien anwenden lässt

Der Workflow funktioniert bei A-Aktien und Hongkong-Aktien identisch. Zwei spezifische Anpassungen:

- Bei A-Aktien ist „扣非净利润" (Nettogewinn unter Ausschluss nicht wiederkehrender Posten) die relevante Gewinnzahl; PickSkill verwendet diese standardmäßig bei der Berechnung von KGV und EPS-Wachstum für A-Aktien.
- Bewertungsmultiplikatoren für A-Aktien liegen in den meisten Sektoren strukturell niedriger als bei US-Peers. Vergleichen Sie mit der historischen Bandbreite der A-Aktien, nicht mit dem US-Pendant.

Siehe [Beste Indikatoren für A-Aktien](/blog/best-indicators-for-a-shares) für den breiteren marktspezifischen Spielplan.

## Häufige Folgeprompts

Nach der 15-Minuten-Erst-Recherche:

- *„Vertiefter DCF zu [Ticker] — vollständige Sensitivitätstabelle, segmentbezogene Umsatzprojektion."*
- *„Vergleiche [Ticker] mit den drei nächsten Peers über den vollständigen Multiplikator-Stack und das FCF-Wachstum."*
- *„Erstelle aus diesem Gespräch ein Investorendeck für [Ticker]."* (Siehe [Generate an Investor Deck from a Chat](/blog/generate-investor-deck-from-chat).)
- *„Setze [Ticker] mit dieser These auf meine Watchlist: [...]"*
- *„Plane eine erneute Prüfung von [Ticker] zum nächsten Earnings-Termin."*

## Weiterführende Literatur

- [Build a DCF in 60 Seconds](/blog/build-dcf-in-60-seconds) — die Bewertungs-Tiefenanalyse, wenn die 15-Minuten-Erst-Recherche besteht.
- [How to Read a 10-K in 30 Minutes](/blog/how-to-read-10k) — die manuelle Tiefenlese-Version von Schritt 1 + Schritt 2.
- [How to Build a Watchlist That Actually Works](/blog/how-to-build-a-watchlist-that-actually-works) — wohin erfolgreich getestete Erst-Recherche-Namen wandern.

## FAQ

**Warum 15 Minuten — ist das nicht zu schnell für eine Aktie?**
Für eine Erst-Recherche-Ja-Nein-Entscheidung sind 15 Minuten mehr als ausreichend — die meisten Namen sollten in dieser Phase abgelehnt werden. Die Tiefenarbeit (konkrete Annahmen modellieren, jede jüngste SEC-Einreichung lesen, mit ehemaligen Mitarbeitern sprechen) bleibt der kleinen Teilmenge an Namen vorbehalten, die die Erst-Recherche bestehen. Vier Stunden für jeden Namen aufzuwenden, dem Sie begegnen, ist der dominante Fehlermodus motivierter Privatanleger.

**Kann ich mehrere Namen parallel recherchieren?**
Ja — PickSkill unterstützt parallele Chat-Sitzungen. Viele Nutzer öffnen 3–5 Sitzungen gleichzeitig und führen dasselbe Fünf-Prompt-Template auf jeder aus. Die Struktur macht Batch-Recherche praktikabel.

**Was, wenn PickSkill zu dem Namen keine Daten hat?**
PickSkill deckt die meisten an den US-Börsen (NYSE / NASDAQ), in Hongkong (HKEx) und in Festlandchina (SSE / SZSE) gelisteten Namen ab. Bei sehr kleinen oder erst kürzlich gelisteten Namen kann die Abdeckung dünner sein — PickSkill wird Ihnen mitteilen, welche Datenpunkte fehlen, anstatt sie zu erfinden.

**Sollte ich die Chat-Sitzungen speichern?**
Ja — jede Chat-Sitzung in PickSkill ist persistent. Setzen Sie Lesezeichen auf nützliche Recherche-Sitzungen für späteren Bezug. Wenn Sie eine Position eingehen, ist die Chat-Sitzung der Prüfpfad dafür, wie Sie zur These gelangt sind.

**Wie unterscheidet sich das von generischer ChatGPT-Recherche?**
Der Chat von PickSkill ist in Live-Einreichungen, Marktdaten und berechneten Indikatoren verankert — nicht in den Trainingsdaten des Modells. ChatGPT halluziniert Umsatzzahlen und KGVs; PickSkill zieht diese zur Abfragezeit aus Primärquellen. Der strukturelle Unterschied wirkt sich am stärksten bei den Finanz- und Bewertungsschritten aus, in denen veraltete oder erfundene Zahlen die Schlussfolgerung vollständig kippen können.
