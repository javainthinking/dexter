---
title: Wie Sie mit PickSkill in 60 Sekunden überverkaufte Aktien finden
description: >-
  Nutzen Sie das RSI-Dashboard, um ein Portfolio oder eine Watchlist auf
  überverkaufte Chancen zu scannen, nach Trendregime zu filtern und Kandidaten
  in priorisierte Einstiege umzuwandeln.
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
  - RSI
  - Überverkauft
  - Screening
  - Workflow
heroImage: /blog/how-to-find-oversold-stocks/hero.png
heroAlt: >-
  Editorial-Infografik — trichterförmige Filterkette: ~30 Kandidaten mit RSI<30
  → ~12 nach ADX+200-Tage-MA-Filter → ~2 handelbare Setups nach mehrschichtiger
  Bestätigung.
---

**„Überverkauft" gehört zu den meistgesuchten Anlagebegriffen — und zu den am meisten missbrauchten.** Ein einfacher Filter „RSI unter 30" sieht im Rückblick auf Charts, in denen er funktioniert hat, wie ein großartiges Signal aus. Backtests zeigen, dass der nackte Überverkauft-Filter ein Münzwurf ist, weil die Hälfte der „überverkauften" Werte in klar abwärts trendenden Aktien auftaucht, in denen der überverkaufte Zustand wochenlang anhalten kann. Dieses Tutorial führt Sie in 60 Sekunden zu echten handelbaren Überverkauft-Kandidaten — indem das RSI-Signal mit Trendregimefiltern und Bestätigungsereignissen kombiniert wird, die die Edge pro Signal deutlich anheben.

### Kernpunkte

- **4 Schritte, ~60 Sekunden.** RSI-Dashboard öffnen, nach aktuellem RSI sortieren, nach Trendregime filtern, Bestätigung vor dem Handeln darüber legen.
- **Ein nackter RSI < 30 ist ein Münzwurf.** Das Hinzufügen von [ADX](/blog/what-is-adx) > 25 und einem Trendrichtungsfilter senkt Fehlsignale um 40–60 %.
- **Das sauberste Setup**: überverkauft + ADX stark + Kurs über dem 200-Tage-MA + bullische Divergenz im MACD.
- **Achten Sie auf Bestätigungsereignisse** — RSI kreuzt von unten wieder über 30, oder ein Kursdurchbruch über das jüngste Swing-Hoch.
- **Funktioniert über US-, HK- und A-Aktien-Bestände** mit marktgerechter Behandlung von Limit-Tag-Bars.

## Warum dieser Workflow zählt

Die Regel „RSI unter 30 = kaufen" ist eines der bekanntesten Signale der technischen Analyse. Sie hat auch eine deutlich schlechtere Bilanz, als die Literatur vermuten lässt:

- In stark trendenden Bärenmärkten kann der RSI wochenlang unter 30 bleiben, während die Aktie weiterfällt. Bei RSI = 28 zu handeln, heißt in ein fallendes Messer zu greifen.
- In unruhigen Märkten taucht der RSI auf Rauschen routinemäßig unter 30 ein. Die meisten dieser Einbrüche kehren schnell zurück, ohne handelbare Bewegungen zu erzeugen.
- Die saubersten Überverkauft-Setups haben zusätzliche Struktur: ein bestätigtes Trendregime, ein klares Unterstützungsniveau in der Nähe und ein beginnendes Momentum-Drehen.

Ohne ein Werkzeug, das Ihr Portfolio nach dem *kombinierten* Setup scannt, können Sie die geschichteten Filter nicht effizient anwenden. Mit dem Werkzeug ist der Filter ein Klick, und die Qualität der Kandidaten hebt sich deutlich.

Zum Konzept selbst siehe [Was ist RSI?](/blog/what-is-rsi).

## Der 4-Schritte-Workflow

### Schritt 1 — RSI-Dashboard öffnen

Gehen Sie zu [/indicators](/indicators) und wählen Sie RSI aus. Das Dashboard scannt jede Position in Ihrem Standardportfolio (oder einem beliebigen ausgewählten Portfolio) und zeigt den aktuellen RSI-Wert, den 5-Tage-RSI-Pfad und die Bucket-Klassifizierung (überverkauft / überverkauft-erholend / neutral / überkauft / überkauft-abkühlend).

Sortieren Sie aufsteigend nach RSI. Die niedrigsten Werte erscheinen zuerst.

### Schritt 2 — Kandidaten identifizieren

Das Dashboard hebt drei Kategorien von „niedrigem RSI" hervor:

| Zustand | RSI-Wert | Aktion |
|---|---|---|
| **Überverkauft, weiter fallend** | < 25 und Pfad sagt „abnehmend" | Warten — Momentum noch negativ |
| **Überverkauft, drehend** | < 30 und Pfad sagt „zunehmend" | Watchlist-Kandidat |
| **Überverkauft-Ausstieg** | Kreuzte von < 30 zurück über 30 | Aktionskandidat — Bestätigungsereignis |

Der handelbare Bucket ist „überverkauft, drehend" oder „überverkauft-Ausstieg". Der Bucket „überverkauft, weiter fallend" braucht mehr Zeit. Der einfache Filter „RSI < 30" vermischt alle drei und ist der Grund, warum das nackte Signal unterdurchschnittlich abschneidet.

### Schritt 3 — Trendregimefilter darüber legen

Vor dem Handeln eines jeden Überverkauft-Kandidaten prüfen Sie das Trendregime:

1. **Der ADX muss über 25 liegen.** Ein niedriger ADX bedeutet seitwärts gerichtete Hin-und-Her-Bewegung; Überverkauft-Signale sind dort grob zufällig.
2. **Kurs relativ zum 200-Tage-MA**: bevorzugen Sie Kandidaten über ihrem 200-Tage-SMA (langfristiger Aufwärtstrend mit kurzfristigem Rücksetzer). Kandidaten unter dem 200-Tage sind Deep-Value-artige Setups, die fundamentale Arbeit erfordern.
3. **MACD-Kontext**: bevorzugen Sie Kandidaten, bei denen der MACD nicht gleichzeitig mit dem RSI ein neues Tief gemacht hat (bullische Divergenz — siehe [Was ist Divergenz?](/blog/what-is-divergence)).

Wenden Sie alle drei Filter an, und die Anzahl der Kandidaten sinkt um ~60–80 %. Die verbleibenden sind die Setups mit der höheren Edge.

### Schritt 4 — Einstiegsplan erzeugen

Sobald ein Kandidat die Filter besteht, verwenden Sie den Chat, um einen strukturierten Einstiegsplan zu erzeugen:

```text
Für [Ticker] hat der RSI gerade den überverkauften Bereich verlassen. 
Erstelle mir einen Einstiegsplan:
- Aktueller Kurs versus nächstem Unterstützungsniveau
- Vorgeschlagener Einstieg (aktuell versus Limit-Kauf bei Rücksetzer)
- Initiales Stop-Niveau mit 2× ATR oder unter dem jüngsten Swing-Tief
- Initiales Kursziel basierend auf dem nächsten Widerstandsniveau
- Positionsgröße für 1 % Portfoliorisiko auf einem 100.000-USD-Konto
```

PickSkill liefert einen strukturierten Plan mit gequellten Niveaus, einer durch [ATR](/blog/what-is-atr) dimensionierten Position und einem Chance-Risiko-Verhältnis. Annahmen können inline angepasst und neu durchgerechnet werden.

> **Probieren Sie es jetzt aus.** Öffnen Sie [/indicators](/indicators), wählen Sie RSI und sortieren Sie aufsteigend. Selbst bei einem 10-Werte-Portfolio sehen Sie wahrscheinlich 1–3 Überverkauft-Kandidaten pro Monat — aber die *gefilterten* Kandidaten (überverkauft + ADX stark + über 200-Tage + Divergenz) sind seltener und handelbarer.

## Was das Dashboard erfasst, was manuelles Scannen verfehlt

### 1. Der „Ausstiegs"-Trigger versus die „im Extrem"-Bedingung

Manuelles Chart-Scannen findet oft Namen mit RSI = 28 und schließt „überverkauft, kaufen". Das Dashboard unterscheidet explizit zwischen *weiter fallend* und *nach oben drehend* — letzteres ist der handelbare Zustand. Die Unterscheidung zeigt sich meist 1–3 Bars nach dem absoluten RSI-Tief, also genau dann, wenn diskretionäre Chartbeobachter dazu neigen, auf rohe „überverkauft"-Werte zu reagieren.

### 2. Gleichzeitiges Multi-Namen-Scannen

Hand-Scannen funktioniert für einige Namen. Das Dashboard scannt Ihre vollständige Watchlist in Sekunden. Über eine 30-Namen-Watchlist gibt es zu jeder Zeit meist mindestens ein handelbares Überverkauft-drehend-Setup — manuell zu finden bedeutet, sich 30 Charts anzusehen.

### 3. Kombinierte RSI + Trendregime + Divergenzerkennung

Das nackte RSI-Signal ist ein Münzwurf; das geschichtete Signal hat bedeutsame Edge. Der geschichtete Scan ist von Hand kaum praktikabel, weil er bei jedem Namen drei Indikatoren prüfen muss. Automatisierung macht den Multi-Schichten-Filter zur *Standardroutine* statt zur angestrebten Disziplin.

## Vier Fallstricke im Überverkauft-Workflow

1. **Auf nacktes RSI < 30 ohne Filter reagieren.** Die empirische Trefferquote liegt beim nackten Signal bei ~50 %. Das Hinzufügen von ADX und Richtungsfiltern hebt sie auf 60–70 %.
2. **In klare Abwärtstrends hineinkaufen.** „Überverkauft" bei einer Aktie, die in einem Monat 50 % verloren hat, ist meist nicht der Boden — es ist ein Momentum-Wert, der weiter fallen wird. Respektieren Sie den 200-Tage-MA-Filter.
3. **Das Ausstiegsereignis ignorieren.** Bei RSI = 25 mit weiter abwärts gerichtetem RSI zu kaufen, bedeutet, den Boden möglicherweise noch 5–15 Bars nicht zu sehen. Warten Sie auf das Kreuz über 30 (oder zumindest auf die Stabilisierung im 5-Tage-Pfad), bevor Sie aufstocken.
4. **Größenbestimmung ohne ATR.** Überverkaufte Aktien haben oft einen höheren ATR als in ihrem Normalregime. Ein fester Prozent-Stop (z. B. 5 %) bei einer Aktie mit erhöhtem ATR bedeutet, dass der Stop auf Rausch-Niveau-Distanz liegt; ein 2× ATR Stop dimensioniert den Trade an die tatsächliche Volatilität.

## Wie sich das auf A-Aktien anwendet

Die A-Aktien-Marktdynamik verändert die Überverkauft-Dynamik:

- **Limit-down-Sequenzen** können RSI-Werte unter 20 über 3–5 aufeinanderfolgende Bars erzeugen, selbst wenn die Aktie noch mehr Abwärtspotenzial hat. Paaren Sie den RSI-Filter mit dem Ausschluss von Limit-Tagen (die PickSkill-A-Aktien-Dashboards tun dies automatisch).
- **Daytrading-Beschränkungen (T+1)** bedeuten, dass Retail-Überverkauft-Käufer Übernachtrisiko eingehen. Positionsgrößenbestimmung zählt umso mehr.
- **Die Sektorrotation bei A-Aktien ist schneller als bei US-Aktien**: Überverkauft-Kandidaten innerhalb eines Sektors, der *aus* der Gunst rotiert, bleiben oft länger überverkauft. Prüfen Sie den Sektortrend gegen.

Siehe [Beste Indikatoren für A-Aktien](/blog/best-indicators-for-a-shares) für den breiteren Spielplan.

## Häufige Folge-Workflows

- *„Zeige mir Überverkauft-Kandidaten über meine gesamte Watchlist, bei denen ADX > 25 UND der Kurs über dem 200-Tage-MA UND der MACD bullische Divergenz zeigt — der Stack mit hoher Edge."*
- *„Berechne für jeden Überverkauft-Kandidaten den 2× ATR Stop und das nächste Widerstandsniveau. Ranke nach Chance-Risiko-Verhältnis."*
- *„Backteste das geschichtete Überverkauft-Setup (RSI < 30 → Kreuz RSI > 30 + ADX > 25 + über 200-Tage) auf dem S&P 500 über die letzten 10 Jahre. Wie hoch ist die Trefferquote?"*
- *„Schließe für meine A-Aktien-Bestände alle Namen aus, die in den letzten 5 Tagen Limit-down erreicht haben, aus dem Überverkauft-Scan aus."*

## Weiterführende Literatur

- [Was ist RSI?](/blog/what-is-rsi) — das zugrunde liegende Konzept.
- [MACD, RSI und ADX zu einem 3-Indikator-Filter kombinieren](/blog/three-indicator-filter) — der geschichtete Ansatz im Detail.

## FAQ

**Welcher RSI-Wert gilt als überverkauft?**
30 ist die konventionelle Schwelle, aber sie ist nicht magisch. In stark trendenden Märkten kann 25 die funktionierende Schwelle sein; in unruhigen Märkten fängt 35 mehr brauchbare Setups ab. Die PickSkill-Dashboards setzen standardmäßig auf 30 für marktübergreifende Vergleichbarkeit.

**Warum schneidet das nackte „RSI < 30 kaufen"-Signal unterdurchschnittlich ab?**
Weil es drei verschiedene Zustände vermischt: überverkauft-und-weiter-fallend (der Boden hat sich noch nicht gebildet), überverkauft-und-drehend (der handelbare Zustand) und überverkauft-im-Bärenmarkt (wo der Zustand wochenlang anhält). Der geschichtete Filter (ADX + 200-Tage-MA + Divergenz + Kreuz-zurück-über-30) adressiert jeden Fehlermodus.

**Wie lange sollte ich warten, nachdem der RSI den überverkauften Bereich verlassen hat?**
Bei den meisten Setups ist das Kreuz über 30 selbst der Trigger. Längeres Warten (z. B. RSI > 50) reduziert die Anzahl der Trades erheblich, erhöht aber die Edge pro Trade in trendenden Märkten. Der Trade-off ist zwischen dem Mitnehmen von mehr Umkehrungen (früh) und nur dem Mitnehmen bestätigter (spät). Die PickSkill-Dashboards zeigen beides: das Kreuzereignis und die „RSI > 50"-Bestätigung.

**Sollte ich Überverkauft-Setups bei Einzelaktien handeln oder auf marktweite Überverkauft-Werte warten?**
Marktweite Überverkauft-Phasen (VIX > 30, SPY RSI < 30) sind seltener, historisch aber mit deutlich höherer Edge — Sie fangen Dislokationen ab statt namensspezifischer Drawdowns. Überverkauft-Setups auf Aktienebene sind häufiger, erfordern aber namensspezifisches Urteilsvermögen darüber, ob das Unternehmen strukturell gesund oder in Schwierigkeiten ist.

**Kann ich E-Mail-Warnungen erhalten, wenn Aktien in meinem Portfolio überverkauft werden?**
Die geplante-Workflows-Funktion (in Design — siehe das [Workflows-Designdokument](/blog)) wird das unterstützen. Vorerst ist das RSI-Dashboard On-Demand: Öffnen Sie es, wenn Sie den Scan möchten, und Sie erhalten den aktuellen Stand. Viele Nutzer prüfen das RSI-Dashboard routinemäßig einmal pro Woche als Teil ihres Portfolio-Reviews.
