---
title: ¿Qué es EV/EBITDA? El múltiplo que ve a través de la estructura de capital
description: Guía práctica de EV/EBITDA — qué mide, por qué domina la comparación agnóstica de estructura de capital, cuándo favorece a las empresas capital-intensivas, y cuándo preferirlo al PER.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: El equipo de investigación de PickSkill — construyendo un analista IA para inversores particulares.
pillar: explainer
tags:
  - valuation
  - ev-ebitda
  - multiples
  - fundamentals
heroImage: /blog/what-is-ev-ebitda/hero.png
heroAlt: Infografía mostrando la fórmula EV/EBITDA con rangos típicos por sector
---

**EV/EBITDA** es el múltiplo de valoración que ve a través de la estructura de capital. Donde el [PER](/blog/what-is-pe-ratio) divide el precio del equity por beneficios después de intereses e impuestos — ambos dependientes de cómo se financia y tributa la empresa — EV/EBITDA divide el *enterprise value* (el valor del negocio entero) entre *EBITDA* (resultado antes de las cosas que distorsionan las decisiones de financiación y contabilidad). El resultado es un múltiplo que permite comparar dos empresas del mismo sector aunque una esté apalancada y otra no.

### Puntos clave

- **EV/EBITDA = Enterprise Value ÷ EBITDA.** EV = capitalización + deuda − caja + interés minoritario. EBITDA = beneficio antes de intereses, impuestos, depreciación y amortización.
- **Es agnóstico a la estructura de capital.** Comparar empresas con distintos niveles de deuda es la razón principal de que EV/EBITDA exista. El PER se rompe; EV/EBITDA no.
- **Favorece a las empresas capital-intensivas** ignorando el capex. Una acería con $1B/año de capex parece "barata" a igual EV/EBITDA que una software que casi no gasta.
- **Lecturas típicas**: 8–10× utilities, 10–14× industriales, 14–20× consumo/salud, 18–30×+ software.
- **PickSkill computa EV/EBITDA** con comparación peer-set completa y flag automático cuando EV/EBITDA y PER se contradicen.

## ¿Qué es EV/EBITDA?

```
EV/EBITDA = Enterprise Value / EBITDA
Donde:
  EV     = Capitalización + Deuda Total − Caja y Equivalentes + Interés Minoritario
  EBITDA = Resultado Operativo + Depreciación + Amortización
```

**Enterprise Value (EV)** es el coste total de adquirir todo el negocio — comprar todo el equity Y asumir la deuda, con la caja existente compensando parte. **EBITDA** elimina cuatro cosas: intereses (decisión de financiación), impuestos (jurisdicción), depreciación y amortización (ambas asignaciones contables no monetarias). Lo que queda es un proxy aproximado de la generación de caja operativa antes de capex y circulante.

## Cuándo EV/EBITDA vence al PER

1. **Empresas con distintos niveles de deuda.** Una apalancada tiene más intereses, menor resultado neto, mayor PER (mecánicamente). EV/EBITDA corta por encima de la línea de intereses — la comparación se mantiene limpia. Ejemplo clásico: telcos.
2. **Adquisiciones recientes distorsionando la amortización.** El PER lo refleja; el EBITDA no.
3. **Comparaciones transfronterizas.** Regímenes fiscales distintos hacen ruidoso el PER; EV/EBITDA es neutral.

## Cuándo EV/EBITDA engaña

1. **Negocios capital-intensivos.** Una acería, telco o aerolínea gasta 5–15% de ingresos en capex cada año. EBITDA lo ignora. EV/EBITDA puede hacer parecer barato un negocio cuyo FCF (tras capex) es mucho más débil. Combina siempre con FCF yield — ver [¿Qué es el FCF?](/blog/what-is-fcf).
2. **Software con costes de desarrollo capitalizados.** Las SaaS capitalizan software de uso interno, moviéndolo del opex al capex (donde EBITDA no lo ve).
3. **Empresas con EBITDA muy ajustado.** "Adjusted EBITDA", "Pro Forma EBITDA", "EBITDAS" — cada ajuste ensancha la brecha con la caja real. Lee siempre la conciliación de EBITDA del 10-K (ver [Cómo leer un 10-K](/blog/how-to-read-10k)).

## Bandas típicas por sector

| Sector | EV/EBITDA típico |
|---|---|
| **Utilities** | 8–10× |
| **Industriales / Materiales** | 10–14× |
| **Consumo / Salud** | 14–20× |
| **Software / Internet** | 18–30×+ |
| **Bancos** | No se usa (P/E o P/Book) |

Comparar en bruto entre sectores no tiene sentido — 9× utility vs 25× software es estructural.

## EV/EBITDA vs PER

| Usa EV/EBITDA cuando | Usa PER cuando |
|---|---|
| Comparas estructuras de capital distintas | Pares con apalancamiento similar |
| Comparas jurisdicciones / regímenes fiscales | Misma jurisdicción |
| Amortización no-cash distorsiona el neto | Cuenta de resultados limpia |
| Comparación post-M&A entre compradores | Maduros, sin deals recientes |
| Análisis de adquisición / LBO | Comparación pura por equity |

Para el panorama absoluto vs relativo, ver [DCF vs comparables](/blog/dcf-vs-comparable-company-analysis).

## Cómo PickSkill usa EV/EBITDA

Abre [/chat](/chat) y escribe:

> *"Compara AMD, AVGO, INTC y NVDA en EV/EBITDA — TTM y NTM — contra sus medias 5 años. Marca los nombres donde EV/EBITDA y PER discrepan sobre si están baratos o caros."*

PickSkill tira los componentes del EV (capitalización + deuda + interés minoritario − caja) y el EBITDA (TTM + NTM consenso) para cada ticker desde filings SEC + datos de mercado, computa ambos múltiplos, y marca explícitamente los casos donde discrepan — señal útil de que la estructura de capital, la amortización, o los ajustes agresivos de EBITDA están haciendo el trabajo real.

Se combina con [DCF vs Comps](/blog/dcf-vs-comparable-company-analysis) — EV/EBITDA suele ser el múltiplo headline de la tabla Comps.

## FAQ

**¿Cuál es un "buen" EV/EBITDA?**
No hay "bueno" universal. 9× es justo en utilities; 9× sería barato en software a menos que algo esté roto. Siempre anclar contra peers y propia historia.

**¿Diferencia entre EV y capitalización?**
Capitalización = solo equity. EV = equity + deuda − caja + minoritario. Misma empresa; EV captura el coste total de adquisición incluyendo la deuda asumida.

**¿Forward o trailing EBITDA?**
NTM es el default analista; TTM más defendible (real). Usa ambos — la brecha implica la visión de crecimiento del consenso.

**¿EV/EBITDA es lo mismo que EV/EBIT?**
No — EBIT resta D&A, EBITDA no. EV/EBIT está más cerca de "beneficio real"; EV/EBITDA más cerca del flujo operativo antes de capex. Negocios capital-intensivos: usa EV/EBIT.

**¿De dónde saca PickSkill el EBITDA?**
Computado directamente desde la cuenta de resultados y el estado de flujos del último 10-K/10-Q. Reconcilia contra el EBITDA reportado (cuando existe) y marca los ajustes (exclusión SBC, add-backs de reestructuración, etc.) para que veas qué tan agresivo es el reportado.
