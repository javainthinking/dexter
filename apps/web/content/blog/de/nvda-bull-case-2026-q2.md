---
title: NVDA Bull Case — Q2 2026 Thesen-Framework
description: Ein durchgearbeiteter Bull-Case für Nvidia — vier Säulen, drei strukturelle Bear-Risiken, vier Quartalsannahmen. Jede Filing-Saison aktualisiert.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: Das PickSkill-Research-Team — wir bauen einen AI-Analysten für Privatanleger.
pillar: thesis
tags:
  - nvda
  - thesis
  - semiconductors
  - ai-infrastructure
heroImage: /blog/nvda-bull-case-2026-q2/hero.png
heroAlt: Editoriale Infografik mit den vier NVDA-Bull-Case-Säulen
---

Dieser Beitrag ist ein **Thesen-Framework** statt einer Kurszielangabe. Nvidia (NVDA) ist 2026 der meistdiskutierte Name in der Retail-Finanzbranche; dieser Beitrag durchläuft, wie das PickSkill-Team einen Bull Case dafür strukturiert — die vier Annahmen, die 90% der Antwort bewegen, die Bear-Case-Szenarien, die jede invalidieren würden, und die expliziten Zahlen aus dem aktuellsten 10-K und Konsensdaten. **Quartalsweise aktualisiert.**

### Kernaussagen

- **Vier Säulen treiben den Bull Case**: Datacenter-TAM, Software-Marge-Moat (CUDA + Enterprise), Networking-Attach-Rate (NVLink, InfiniBand), Automotive-Optionalität (Drive-Plattform).
- **Die Datacenter-Säule wiegt ~70% der These.**
- **Der Bear Case ist nicht „kein Wachstum"** — sondern drei spezifische strukturelle Risiken.
- **Die Bewertungs-Lücke hängt mehr von angenommenen Terminal-Margen** ab als vom Kurzfristumsatz.

## Die vier Bull-Case-Säulen

### Säule 1 — Datacenter-TAM (Gewicht: ~70%)

Kern des Bull Case ist, dass der Datacenter-TAM für AI-Compute mehrjährig komponiert und die aktuellen Ausgaben rechtfertigt.

- Hyperscaler-AI-Capex wuchs 2024–2025 stark, und Guidance 2026 von MS / Google / Meta / Amazon signalisiert keine Pause.
- Inference-Workloads skalieren schneller als Training.
- Enterprise-On-Premise-AI-Compute ist noch früh.

### Säule 2 — Software-Marge-Moat (Gewicht: ~15%)

CUDA + Enterprise-Stack (NIM, NeMo) ziehen wiederkehrende Umsätze zu höheren Margen. Bull: Software-Beitrag wächst von tiefer einstelliger zu mittlerer zweistelliger %, zieht Mix-GM Richtung 80%+.

### Säule 3 — Networking-Attach-Rate (Gewicht: ~10%)

NVLink, InfiniBand, Spectrum-X verwandeln GPU-Verkauf in System-Verkauf. Bull: Networking attached an >90% großer Trainings-Cluster, Beitrag >15% des Datacenter-Umsatzes.

### Säule 4 — Automotive + Robotik-Optionalität (Gewicht: ~5%)

Drive + Isaac sind heute klein, bieten aber Optionalität auf mehrjährige Shifts.

## Der Bear Case — drei strukturelle Risiken

1. **Hyperscaler-Insourcing.** Google TPU, AWS Trainium, Meta MTIA, Microsoft Maia — alle Hyperscaler haben ernsthafte In-House-Silicon-Programme. Bear: 25–40% des Hyperscaler-AI-Computes wandert bis 2028 zu hauseigenem Silicon.
2. **Gross-Margin-Kompression.** Mit AMD MI, Intel Gaudi, Custom-Silicon-Wettbewerb komprimiert NVDAs Pricing-Power, drückt GM in die 60er.
3. **Capex-Verdauung.** Wenn Hyperscaler-2026-Ergebnisse trotz massivem 2024–2025-Capex flat-bis-down AI-Umsatzbeitrag zeigen, könnten 2027-Capex-Guidance bedeutsam gekürzt werden.

Eine alleine bei voller Stärke komprimiert die Bull-Case-Bewertung um 30–50%.

## Vier vierteljährlich zu tracker Annahmen

| Annahme | Bull-Frame | Bear-Frame |
|---|---|---|
| **Datacenter-Umsatzwachstum YoY** | hält 30%+ mehrere Jahre | normalisiert auf 10–15% bis 2027 |
| **Gross-Margin-Trajektorie** | hält 70%+ bis 2028 | komprimiert Richtung 60% |
| **Hyperscaler-Capex-Guidance** | weiterhin Step-up | flacht ab oder guides nach unten |
| **Networking-Attach-Rate** | wächst zu >15% | stagniert <10% |

DCF hochsensitiv auf die ersten beiden. PickSkills [DCF-Tool](/blog/build-dcf-in-60-seconds) lässt jeden anpassen.

## Wie PickSkill diese These baut + aktualisiert

> *„Bau eine Bull-Case-These für NVDA. Verwende das aktuellste 10-K und 10-Q für Financials, Konsens für Forward-Wachstum, Damodaran für den Diskontsatz. Liste die vier Annahmen, die die Antwort bewegen, die Bear-Case-Gegenposition jeder, und den DCF-implizierten Kurs. Aktualisiere Annahmen quartalsweise."*

PickSkill: zieht aktuellstes 10-K + 10-Q, Konsens-Forward, berechnet [WACC](/blog/what-is-wacc), baut [DCF](/blog/what-is-dcf) mit den vier Säulen als separate Wachstumstreiber, gibt Bull/Bear-impliziter Kurs + Spread aus, generiert Excel.

Danach ist es *Ihre* These zum Bearbeiten.

## Typische Fehler beim Lesen einer NVDA-These

1. **NVDA als ein einziges Geschäft behandeln.** Mindestens vier: Gaming, Pro-Visualisierung, Datacenter, Automotive.
2. **An die letzten 24 Monate ankern.** AI-Compute-Ausgaben 2024–2025 ungewöhnlich konzentriert.
3. **Kundenkonzentration ignorieren.** Siehe [10-K-Leseleitfaden](/blog/how-to-read-10k).
4. **Software-Umsatz und Software-Margen-Lift verwechseln.**

## FAQ

**Aktueller Bull-impliziter Kurs?**
Zahlen im Beitrag sind Frame-Level; für den live berechneten Kurs PickSkills [DCF-Tool](/blog/build-dcf-in-60-seconds) verwenden. Bewusst hier nicht festgenagelt — würde in 90 Tagen veraltet sein.

**Warum ein Framework statt einer Empfehlung?**
Eine These ist nur nützlich, wenn sie mit Ihrer eigenen Überzeugung über die vier Schlüsselannahmen kombiniert wird; jemand anderes These zu kopieren ist die Recherche mit dem niedrigsten Edge.

**Funktioniert für AMD, AVGO, TSM?**
Gleiche 4-Säulen / 3-Risiken-Struktur gilt, mit sektorspezifischen Anpassungen.

**Wie oft aktualisiert PickSkill?**
Quartalsweise, im 10-Q / 10-K-Veröffentlichungsrhythmus.

**Was, wenn ich dem Bull-Frame nicht zustimme?**
Das ist die richtige Reaktion. Das Framework ist die *Struktur* der Bull-Case-These, kein Anspruch auf ihre Richtigkeit. PickSkill führt auch das Bear-Case-Szenario aus denselben Financials aus.

> **NVDA in PickSkill verfolgen.** Öffnen Sie [/chat](/chat), fügen Sie NVDA ein, erhalten Sie ein Quartalsupdate-Framework.
