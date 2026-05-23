---
title: Qué es Free Cash Flow (FCF) — FCFF vs FCFE
description: FCF es el número detrás de toda valoración honesta. FCFF vs FCFE, cálculo desde el estado de flujos en 60 segundos, cuatro trampas tech.
publishedAt: 2026-05-22
updatedAt: 2026-05-22
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: El equipo de investigación de PickSkill — construyendo un analista IA para inversores particulares.
pillar: explainer
tags:
  - valuation
  - fcf
  - cash-flow
  - fundamentals
heroImage: /blog/what-is-fcf/hero.png
heroAlt: Ilustración editorial de un flujo de caja pasando por un filtro hacia un embalse luminoso, tonos oscuros cálidos con acentos esmeralda
---

El **flujo de caja libre (FCF)** es el efectivo que un negocio genera y que está realmente disponible para los inversores después de pagar las operaciones y mantener la base de activos. Es el número que un modelo de valoración quiere — no el beneficio contable, que se puede remodelar con decisiones de amortización, oscilaciones de circulante o retribución en acciones. Si los beneficios de una empresa pintan bien pero su FCF no acompaña, esa brecha suele ser lo más importante que necesitas entender sobre la acción.

Esta guía cubre la definición, las dos variantes que importan (FCFF y FCFE), cómo extraer el FCF del estado de flujos de caja en menos de un minuto, y los cuatro errores que tuercen los modelos de tecnológicas en particular.

### Puntos clave

- **FCF = Flujo de caja operativo − Capex.** Caja del negocio menos el capital necesario para mantenerlo funcionando.
- **Dos variantes**: FCFF (free cash flow to the firm — para DCF no apalancado, ignora la estructura de capital) y FCFE (free cash flow to equity — para DCF apalancado).
- **El FCF gana al beneficio** en valoración porque depura partidas no monetarias (D&A, SBC), captura el capex real y refleja cambios en el circulante que el beneficio GAAP oculta.
- **La retribución en acciones (SBC) es coste real.** Sumarla como no monetaria sin modelar la dilución hace que el FCF de una tecnológica parezca 5–15% mejor de lo que es.
- **PickSkill calcula el FCF de cualquier empresa desde sus últimos cuatro 10-Q + 10-K** en menos de un minuto — ambas variantes, con las partidas originales enlazadas para verificación.

## ¿Cuál es la fórmula del FCF?

El punto de partida es el estado de flujos de caja. Dos caminos, según la variante que necesites:

```
FCFF (no apalancado) = Flujo de caja operativo + Intereses × (1 − t) − Capex
FCFE (apalancado)    = Flujo de caja operativo − Capex + Endeudamiento neto
```

Donde:

| Término | Significado |
|---|---|
| **Flujo de caja operativo (OCF)** | Caja generada por el negocio después de los cambios en circulante. Encabezamiento de la sección "operativa" del estado de flujos. |
| **Capex** | Capital expenditure — dinero gastado en propiedad, equipo, software, infraestructura. Final de la sección "inversión", etiquetado como "compras de inmovilizado" o similar. |
| **Intereses × (1 − t)** | Intereses después de impuestos, devueltos al cálculo de FCFF para que la cifra no esté sesgada por la estructura de capital. |
| **Endeudamiento neto** | Nueva deuda emitida menos deuda amortizada. En FCFE, es la caja que queda para los accionistas después de pagar a los prestamistas. |

**Ambas variantes restan Capex**, porque el dinero gastado en el edificio, el centro de datos o la línea de producción — ese efectivo no vuelve al inversor. Se reinvierte en el negocio. Una empresa en crecimiento puede tener un OCF espectacular y un FCF negativo porque toda la caja se está reinvirtiendo en expansión.

## ¿Por qué importa más el FCF que el beneficio?

El beneficio es el número de titular — el que bate o no a consenso en cada conference call. Pero la mayor parte del trabajo profesional de valoración corre sobre FCF. Tres razones:

1. **El beneficio se dobla más fácil.** Timing de amortización, contabilidad de inventarios, devengos, ingresos diferidos — todas palancas legales bajo GAAP que mueven el beneficio sin mover la caja. El FCF parte directamente del estado de flujos, esquivando la mayoría.
2. **El capex es real y el beneficio lo esconde.** Un negocio capital-intensivo (semis, telcos, aerolíneas) gasta miles de millones en equipos que se amortizan a lo largo de una década. El beneficio muestra la amortización; el FCF muestra el efectivo realmente gastado en el periodo. Pueden diferir en 30–50% en un año dado.
3. **El DCF quiere FCF.** El modelo de flujo de caja descontado se llama así por lo que descuenta — flujo de caja. Usar el beneficio como proxy es lo que crea ese tipo de trabajo de valoración que no sobrevive a una recesión (porque el beneficio aguanta cuando la caja ya se ha desplomado).

## Cómo extraer el FCF de un estado de flujos en 60 segundos

Flujo práctico con un filing real:

1. **Abre el último 10-Q o 10-K de la empresa** en [SEC EDGAR][edgar]. Ve al estado de flujos de caja (habitualmente página 4–5 de los financials).
2. **Lee "Caja neta proporcionada por actividades operativas".** Eso es OCF. La cifra más fiable del estado.
3. **Lee "Adquisiciones de inmovilizado" o "Capital expenditures"** en la sección de inversión. Cuidado con el signo negativo — el capex es salida de caja.
4. **Calcula FCF = OCF − Capex.** Para uso en DCF no apalancado, suma también los intereses después de impuestos (busca intereses en la cuenta de resultados; multiplica por `1 − tipo marginal`).
5. **Contrasta contra la nota de prensa.** La mayoría de empresas reportan su propia cifra de FCF en los releases de resultados. Si tu número difiere en más de 5%, tienes una brecha de definición — habitualmente alrededor de software capitalizado o partidas de M&A. Reconcilia, no lo tapes.

[edgar]: https://www.sec.gov/edgar
[chat]: /chat

Un ejercicio de 60 segundos para interiorizar el concepto: abre el último 10-K de NVDA con [PickSkill][chat], pregunta "muéstrame el FCF de los últimos 4 ejercicios y explica el cambio año a año". Verás cómo se movieron OCF y capex cada año, con las partidas subyacentes enlazadas al filing.

## FCFF vs FCFE — cuál usar

| Variante | Qué representa | Tasa de descuento | Cuándo usarla |
|---|---|---|---|
| **FCFF** | Caja para *todos* los proveedores de capital (equity + deuda) | WACC | DCF estándar de equity sell-side |
| **FCFE** | Caja *solo* para accionistas, después de intereses y servicio de deuda | Coste del equity (Re) | Modelos LBO, valoración de financieras, tesis impulsadas por recap |

El estándar en el 90% de equity research es FCFF descontado al [WACC](/blog/what-is-wacc), dándote un valor de empresa. Resta la deuda neta y tienes valor del equity; divide por acciones y tienes precio implícito por acción.

El FCFE se usa menos porque requiere modelar explícitamente el calendario de deuda — los intereses, amortizaciones y emisiones de cada año. En un LBO, eso es precisamente el objeto. En un DCF típico de equity research, el FCFF es más limpio.

## Cuatro errores que tuercen los modelos de tecnológicas

Las tecnológicas modernas son donde el análisis de FCF más a menudo se descarrila. Cuatro trampas a conocer:

1. **Tratar el SBC como no monetario.** La retribución en acciones es un coste real — la empresa entrega equity a empleados que de otro modo exigirían salario en efectivo. GAAP devuelve el SBC en el flujo operativo (no es caja); la mayoría de los analistas luego olvidan modelar la dilución que las concesiones de equity provocan. Resultado: un "margen FCF" 5–15% más alto del real. Solución: o restar el SBC del FCF, o modelar el crecimiento de acciones de forma explícita para que el valor por acción refleje la dilución.
2. **Costes de desarrollo de software capitalizados.** Muchas SaaS capitalizan parte del salario de ingeniería bajo "software de uso interno" (ASC 350-40). Ese coste se mueve del OCF (donde reduciría caja de operaciones) al capex (donde reduce el FCF). Ambas rutas golpean al FCF — pero si comparas dos empresas y una capitaliza agresivamente y la otra no, la comparación de FCF es manzanas contra peras. Normaliza sumando el software capitalizado de vuelta.
3. **Vientos de cola de circulante en modo crecimiento.** Una empresa de hipercrecimiento que cobra de clientes (ingresos diferidos) más rápido de lo que gasta tiene liberaciones de circulante que adornan el OCF. Es caja real — no está mal — pero no es sostenible cuando el crecimiento se ralentiza. Modela los cambios de circulante como función del crecimiento de ingresos, no como constantes.
4. **Cambios de política de capex.** Una SaaS que madura migrando de data centers propios a la nube pública debería ver capex caer — eso es estructural, no manipulación. Una empresa en apuros "aplazando capex" para batir un objetivo trimestral de FCF está escondiendo problemas. Mira el capex como % de ingresos en 3–5 años, no en aislado.

## FCF yield: el ratio que sí merece la pena

Entre la docena de ratios derivados del FCF que usan los analistas, el **FCF yield** es el más directamente comparable contra el mercado de bonos y otras acciones:

```
FCF yield = FCF por acción / precio de la acción
```

Es el retorno de caja que un accionista recibiría si todo el FCF se distribuyera (no se distribuye en la práctica — las empresas reinvierten, recompran, o acumulan caja). Pero es el benchmark correcto contra el tipo libre de riesgo.

| FCF yield | Lectura |
|---|---|
| **>8%** | Barato por normas históricas; suele ser un valor o un nombre con preocupaciones ya descontadas |
| **4–8%** | Razonable para grandes capitalizaciones en estado estable |
| **1–4%** | Valoración premium; descontando crecimiento o posicionamiento único |
| **<1%** | O profundamente premium en crecimiento, o capex pesado sin caja sobrante para accionistas |

Compara siempre contra la historia de la propia empresa (¿está expandiéndose o comprimiéndose?) y contra peers del mismo sector — los FCF yields de software son distintos a los de utilities, y eso es estructura, no señal.

## Cómo construye PickSkill el FCF

Abre un chat y escribe:

> *"Saca el FCF de AMD de los últimos 4 ejercicios y explica el cambio año a año."*

PickSkill toma el último 10-K más los cuatro 10-Q anteriores de SEC EDGAR, extrae OCF y capex partida por partida, calcula el FCF de cada año y te muestra el puente año contra año con cada cambio material enlazado a la divulgación original. ¿Quieres FCFE? Añade *"...muestra también el FCFE asumiendo el calendario de deuda actual"* — mismo flujo, solo añade endeudamiento neto.

Esta serie de FCF es la que alimenta la [herramienta DCF](/blog/what-is-dcf); la [herramienta WACC](/blog/what-is-wacc) suministra la tasa de descuento.

## FAQ

**¿Cuál es la diferencia entre FCF y beneficio neto?**
El beneficio neto es el resultado GAAP — lo que queda tras restar todos los gastos, incluidos los no monetarios como la amortización. El FCF es el efectivo realmente generado tras pagar el capital necesario para mantener las operaciones. Pueden divergir en 30–50% en sectores capital-intensivos, o persistir con beneficio neto positivo y FCF negativo en empresas de fuerte crecimiento que reinvierten mucho.

**¿Por qué a veces el FCF es negativo?**
Tres razones, en orden de gravedad. (1) La empresa está creciendo — gasta más capex del que su flujo de caja actual puede financiar (Amazon durante la mayor parte de su primera década). (2) El circulante está consumiendo caja — habitualmente acumulación de inventario o cobros más lentos. (3) El negocio es estructuralmente no rentable — el flujo operativo en sí es negativo. Identificar cuál importa: la primera es una decisión deliberada de inversión; la tercera es un problema existencial.

**¿Es lo mismo FCF que EBITDA?**
No. El EBITDA es beneficio antes de intereses, impuestos, amortización y depreciación — un proxy del flujo operativo que ignora tres cosas: cambios en circulante, capex e impuestos. El FCF contabiliza las tres. El EBITDA es útil para comparabilidad operacional entre empresas; el FCF es lo que la valoración descuenta de verdad.

**Para tecnológicas, ¿FCF o EPS?**
Ambos. El EPS te cuenta la narrativa GAAP de beneficio por acción que la empresa quiere contar. El FCF (con SBC tratado honestamente) te cuenta lo que realmente queda disponible para el accionista. La gráfica única más útil en un análisis de tecnológica es el margen FCF y el crecimiento de EPS en paralelo durante 5 años — cuando divergen de forma persistente, ahí está la pregunta interesante.

**¿De dónde saca PickSkill los datos de FCF?**
Extracción directa de los filings de SEC EDGAR (10-K, 10-Q) vía [PickSkill](/chat). El flujo de caja operativo y el capex vienen del estado de flujos directamente; la cifra se reconcilia contra el FCF no-GAAP de la propia empresa (cuando lo publica) y las partidas originales están enlazadas. Sin intermediario de datos, así que los números coinciden con el filing.
