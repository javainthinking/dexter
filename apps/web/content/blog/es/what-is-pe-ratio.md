---
title: ¿Qué es el PER? El múltiplo que todos citan (y la mitad usa mal)
description: PER = precio / beneficio por acción. Variantes trailing, forward y Shiller; las cuatro trampas; cómo anclar contra pares, historial e índice.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: El equipo de investigación de PickSkill — construyendo un analista IA para inversores particulares.
pillar: explainer
tags:
  - valuation
  - pe-ratio
  - multiples
  - fundamentals
heroImage: /blog/what-is-pe-ratio/hero.png
heroAlt: Infografía editorial mostrando la fórmula del PER con un rango de interpretación de bajo a alto
---

El **PER** (price-to-earnings, ratio precio/beneficio) es el número más citado en los mercados de equity. También es el más malinterpretado. El PER responde a una pregunta simple — cuánto pagan los inversores por cada dólar de beneficios actuales — pero un número de PER aislado no dice casi nada sin contexto: ¿qué beneficios? ¿trailing o forward? ¿GAAP o ajustados? ¿comparado con qué? Bien usado, el PER es el sanity check más rápido en valoración. Mal usado, es la fuente principal de las tesis "esta acción parece barata" que resultan equivocadas.

Esta guía cubre la fórmula, las variantes que importan (TTM vs forward, Shiller CAPE), la señal que da el PER y las cuatro trampas que distorsionan las comparaciones de PER en la investigación real.

### Puntos clave

- **PER = Precio por acción / Beneficio por acción.** Un ratio simple con un denominador engañosamente complejo.
- **Tres variantes que merecen conocerse**: trailing twelve months (TTM, retrospectivo), next twelve months (NTM, prospectivo, el default del analista), y Shiller CAPE (suavizado a 10 años, el estándar para comparaciones macro).
- **Un PER alto = el mercado espera crecimiento; un PER bajo = el mercado ve riesgo o declive.** Ninguno es automáticamente bueno o malo — el contexto es todo.
- **El PER miente cuando los beneficios mienten.** Fondos cíclicos (E bajo, PER alto), ganancias puntuales (E alto, PER bajo), conciliaciones agresivas GAAP vs ajustadas — todas distorsionan el PER.
- **El PER solo funciona en comparación** — contra la propia historia de la empresa, contra peers, contra el mercado. Un número PER desnudo es media verdad.

## ¿Qué es el PER?

La fórmula en una línea:

```
PER = Precio por acción / Beneficio por acción
```

Si una acción cotiza a $150 y gana $5 por acción, el PER es 30. El mercado paga hoy $30 por cada $1 de beneficio *actual* — lo que solo es significativo combinado con una visión sobre si los beneficios crecerán, se mantendrán o caerán.

Los beneficios usados en la fórmula importan tanto como el precio:
- **PER trailing (TTM)**: usa beneficios de los últimos 12 meses. Retrospectivo. El más defendible porque los beneficios son reales, pero solo retrovisor.
- **PER forward (NTM)**: usa estimaciones de consenso de los beneficios próximos 12 meses. El default profesional.
- **PER Shiller (CAPE)**: usa 10 años de beneficios ajustados por inflación como denominador. Suaviza ciclos. Se usa principalmente a nivel mercado (S&P 500), no para acciones individuales.

## ¿Qué señala el PER?

El PER refleja dos cosas combinadas: **crecimiento esperado** y **riesgo percibido**.

| Lectura del PER | Interpretación típica |
|---|---|
| **< 10** | Deep value, beneficios deprimidos (cíclico en trough), o negocio estructuralmente en declive |
| **10–15** | Negocio maduro y estable, expectativas de crecimiento bajo-moderado |
| **15–25** | Rango "normal" del mercado US últimos 20 años |
| **25–40** | Múltiplo por encima del mercado; el mercado descuenta crecimiento relevante |
| **> 40** | Precios de hipercrecimiento, o beneficios deprimidos inflando el múltiplo |

La palabra clave es *interpretación*. Un PER 40× sobre una empresa que crece 30% con alta conversión a FCF es racional. Un PER 40× sobre una empresa que crece 5% es una "story stock" esperando a romperse. El marco que pone precio al crecimiento correctamente está en [¿Qué es el DCF?](/blog/what-is-dcf).

## Las cuatro trampas que distorsionan las comparaciones de PER

1. **Beneficios cíclicos.** En el trough de un ciclo los beneficios están deprimidos, inflando mecánicamente el PER. Promedia los beneficios a lo largo del ciclo y vuelve a calcular.
2. **Partidas atípicas.** $500M de plusvalía por desinversión en el beneficio neto baja mecánicamente el PER sin cambiar el negocio. Siempre verifica si los beneficios reportados incluyen items no recurrentes.
3. **Retribución basada en acciones.** GAAP incluye SBC como gasto; los beneficios "ajustados" suelen excluirlo. En tech grande, ajustados pueden ser 30–50% más altos que GAAP por SBC solo. PER 20× sobre EPS ajustado pasa a 30× sobre GAAP EPS — misma empresa, lectura muy distinta. Ver [¿Qué es el FCF?](/blog/what-is-fcf).
4. **Comparaciones cross-sector.** Utilities a 12–15× porque son crecimiento lento y estable; software a 35× porque es crecimiento rápido y menos estable. Compararlas por PER bruto es manzanas y peras.

La regla de 134 palabras: **nunca cites un PER sin un ancla** — historia propia, peer-set, o norma de mercado a largo plazo. Sin eso no son datos, son vibras.

## PER vs otros múltiplos

| Múltiplo | Mejor para | Caveat |
|---|---|---|
| **PER** | Negocios maduros con beneficios estables | Se rompe en cero/negativo; sensible a contabilidad |
| **PER forward** | Empresas de crecimiento donde el beneficio actual subestima el run-rate | Depende de que el consenso acierte |
| **EV/EBITDA** | Negocios capital-intensivos; comparación cross-capital-structure | Ignora capex — ver [¿Qué es EV/EBITDA?](/blog/what-is-ev-ebitda) |
| **EV/Sales** | Empresas de crecimiento en pérdidas (SaaS temprano, biotech) | No dice nada sobre rentabilidad |
| **P/Book** | Bancos y negocios pesados en balance | Inútil en negocios asset-light |

Para el panorama absoluto vs relativo, ver [DCF vs análisis de comparables](/blog/dcf-vs-comparable-company-analysis).

## Cómo usar el PER de forma productiva

Un workflow que sobrevive a la revisión:

1. **Saca el PER TTM y NTM** de la empresa. La brecha entre ambos cuenta la expectativa de crecimiento del mercado.
2. **Saca los mismos dos ratios para 5–8 peers.** Calcula la mediana.
3. **Calcula el rango PER 5 años** propio de la empresa (bajo, medio, alto). ¿Dónde está el PER actual dentro de ese rango?
4. **Pregunta: ¿por qué el PER está donde está?** Si supera mediana peer y supera la propia historia, el mercado está descontando algo — ¿qué?
5. **Stress-test del crecimiento implícito.** Si el PER actual solo tiene sentido con 20% de crecimiento de beneficios durante 5 años, ¿es plausible?

Esto es exactamente lo que corre PickSkill cuando pides una "comparación PER".

## Cómo usa PickSkill el PER

Abre [/chat](/chat) y escribe:

> *"Saca el PER TTM y NTM de NVDA, compáralo contra su historia 5 años y contra AMD, AVGO, INTC y TSM. Enséñame qué crecimiento implícito de beneficios implica el PER actual relativo a peers."*

PickSkill tira el PER TTM del último 10-K/10-Q, el NTM del consenso, el rango 5 años propio, los mismos dos del peer-set y computa el crecimiento implícito multi-año que justificaría el múltiplo actual. Output en una tabla — 40 minutos de hoja de cálculo a mano.

Esto se combina con el [workflow de Comps](/blog/dcf-vs-comparable-company-analysis) — el PER es la cabecera, Comps es la tabla estructurada detrás.

## FAQ

**¿Qué diferencia hay entre PER TTM y NTM?**
TTM = trailing twelve months, mirando atrás. Beneficios reales reportados. NTM = next twelve months, mirando adelante. Estimaciones de consenso. La mayoría de los analistas pro cita el forward porque invertir es sobre el futuro; el trailing es defendible si no quieres depender del consenso.

**¿Cuál es un PER "bueno"?**
No hay PER "bueno" universal. 12× en utility es justo; 12× en SaaS creciendo 30% sugiere que el mercado piensa que el crecimiento es falso. Siempre ancla contra (a) la historia propia, (b) peers, (c) el mercado en general.

**¿Qué es el Shiller PER (CAPE)?**
Cyclically Adjusted PER, popularizado por el economista Robert Shiller. Usa beneficios ajustados por inflación a 10 años como denominador para suavizar ciclos. Sobre todo a nivel mercado (el CAPE del S&P 500 es famoso) para evaluar si las acciones están caras vs. su historia.

**¿Puede el PER ser negativo?**
Matemáticamente sí, cuando los beneficios son negativos. En la práctica los analistas reportan "N/M" (no significativo) y cambian a EV/Sales o EV/EBITDA. El PER solo funciona con beneficios positivos y razonablemente estables.

**¿Dónde encuentro el PER de una acción?**
La mayoría de servicios financieros (Yahoo Finance, Bloomberg, tu bróker) muestran TTM por defecto. El forward requiere estimaciones de consenso. [PickSkill](/chat) computa los tres (TTM, NTM, Shiller) desde fuentes primarias y expone la brecha entre ellos como señal.
