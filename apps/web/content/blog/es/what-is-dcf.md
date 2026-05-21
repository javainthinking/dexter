---
title: ¿Qué es el DCF? Guía práctica del flujo de caja descontado
description: Una guía práctica del DCF — la fórmula, las cuatro hipótesis que mueven la valoración, los errores frecuentes y cómo modelar uno en menos de una hora.
publishedAt: 2026-05-21
updatedAt: 2026-05-21
author:
  name: Julian Zhou
  url: https://www.linkedin.com/in/julianzhou
  bio: Fundador de PickSkill. Antes, equity research en un fondo long-only cubriendo semiconductores.
pillar: explainer
tags:
  - valuation
  - dcf
  - fundamentals
heroImage: /blog/what-is-dcf/hero.png
heroAlt: Ilustración editorial de una línea de tiempo de flujos de caja estilizada en tonos oscuros cálidos con acentos esmeralda
---

El **flujo de caja descontado (DCF)** es un método de valoración que estima el valor presente de una empresa sumando todo el efectivo que se espera que genere en el futuro, descontado a una tasa que refleja el riesgo de no llegar a recibirlo. En una frase: el DCF responde "¿cuánto vale el negocio hoy, dada la caja que probablemente generará mañana?"

Es el método de valoración más enseñado en equity research, banca de inversión y finanzas corporativas — y también el más mal utilizado. Esta guía cubre la fórmula, las cuatro hipótesis que realmente importan, las trampas en las que caen los modeladores principiantes y una versión de 60 segundos de cómo PickSkill construye un DCF a demanda.

### Puntos clave

- **DCF = valor presente de los flujos de caja libres futuros.** Proyecta FCF para 5–10 años, descuenta cada año al WACC, suma un valor terminal, totaliza.
- **Cuatro hipótesis hacen el 95% del trabajo**: crecimiento de ingresos, margen EBIT terminal, WACC y método del valor terminal.
- **El valor terminal absorbe el 60–80% del EV total** en un DCF típico de 5 años — la hipótesis post-pronóstico domina la respuesta.
- **Un cambio de 100 bp en WACC mueve el EV un 8–15%.** Siempre muestra una tabla de sensibilidad WACC × crecimiento terminal.
- **PickSkill construye un primer DCF en 60–90 segundos** a partir de presentaciones SEC; cada hipótesis es editable y trazable.

## ¿Cuál es la fórmula del DCF?

La forma estándar es:

```
Valor Empresa = Σ ( FCFₜ / (1 + WACC)ᵗ )  +  Valor Terminal / (1 + WACC)ⁿ
```

En palabras llanas: proyecta el flujo de caja libre no apalancado (FCF) para cada año del periodo de proyección explícito (normalmente 5–10 años), descuenta cada año al coste medio ponderado del capital (WACC), y luego añade un valor terminal que representa todo lo posterior.

Dos variantes dominan en la práctica:

| Variante | Qué descuenta | Qué te da |
|---|---|---|
| **DCF no apalancado (FCFF)** | Flujo de caja libre a la firma | **Valor empresa** — divide entre acciones y descuenta deuda neta para estimar el precio intrínseco |
| **DCF apalancado (FCFE)** | Flujo de caja libre al accionista | **Valor del capital** directamente — sin retirar deuda |

El no apalancado es el predeterminado en equity research porque separa el rendimiento operativo de la estructura de capital. El DCF apalancado aparece más en modelos LBO de private equity.

## ¿Por qué importa el DCF?

Tres razones por las que se sigue usando a pesar de las críticas:

1. **Es un marco de pensamiento, no solo un número.** Construir un DCF te obliga a explicitar las hipótesis sobre una empresa — crecimiento de ingresos, trayectoria de márgenes, intensidad de capital, coste de capital. Aunque el output sea erróneo, la conversación sobre hipótesis es valiosa.
2. **Ancla los precios objetivo.** La mayoría de analistas sell-side y buy-side triangulan un objetivo promediando DCF, comparables y transacciones precedentes. El DCF es la pata fundamentalmente rigurosa.
3. **Saca a la luz lo que el mercado implícitamente asume.** Un DCF reverso — resolver la tasa de crecimiento que justifica el precio actual — te dice si el mercado está descontando un milagro o un desastre.

## Las cuatro hipótesis que realmente importan

La mayoría de los desacuerdos sobre DCF se reducen a desacuerdos sobre uno de estos cuatro números. Gasta tu tiempo aquí.

### 1. Crecimiento de ingresos en años 1–5

Dos modos de fallo habituales. Los modeladores en escenario alcista extrapolan el crecimiento reciente indefinidamente; los pesimistas vuelven al crecimiento tipo PIB en el año tres. La versión honesta triangula con un build de unidad económica (precio × volumen × mix geográfico) y hace pruebas de estrés en ambas direcciones.

### 2. Trayectoria del margen operativo

La hipótesis con más apalancamiento para empresas de alto crecimiento. Un cambio de 50 bp en el margen EBIT terminal puede mover un DCF de software un 30%+. Siempre revela el margen terminal que asumes y compáralo con los pares maduros de la empresa.

### 3. WACC (la tasa de descuento)

El retorno que el mercado exige por asumir el riesgo de esta empresa. Formalmente:

```
WACC = (E/V) × Re  +  (D/V) × Rd × (1 − tasa imp.)
```

Donde `Re` es el coste del equity (normalmente vía CAPM: tasa libre de riesgo + β × prima de riesgo del equity), `Rd` es el coste de la deuda antes de impuestos, y `E/V` y `D/V` son los pesos de equity y deuda en la estructura de capital. Un cambio de 100 bp en WACC suele mover el valor empresa entre 8–15% en un DCF de 5 años (análisis interno de PickSkill sobre ~200 modelos large-cap en 2025). Tabular la sensibilidad WACC vs. crecimiento terminal es la exposición más útil de un DCF — ver un ejemplo en el [tablero de indicadores][indicators].

[indicators]: /indicators

### 4. Valor terminal

En un DCF de 5 años, el valor terminal normalmente representa el 60–80% del valor empresa total (rango típico en grandes capitalizaciones del S&P 500; el [dataset de Damodaran en NYU Stern][damodaran] publica los datos subyacentes trimestralmente). Así que la hipótesis sobre lo que pasa después del año 5 domina el resultado. Dos enfoques:

[damodaran]: https://pages.stern.nyu.edu/~adamodar/

- **Crecimiento Gordon (perpetuidad)**: `VT = FCFn+1 / (WACC − g)`. Simple pero sensible al spread `(WACC − g)` — un movimiento de 50 bp en cualquiera puede mover VT un 20%+.
- **Múltiplo de salida**: `VT = EBITDA × múltiplo`. Más fácil de defender ("las comparables hoy cotizan a 12× EBITDA") pero incorpora el entorno de mercado actual.

Los DCF sofisticados reportan ambos métodos y usan el spread como chequeo de cordura.

## Errores frecuentes (los que rompen silenciosamente los modelos)

Una lista de 134 palabras que vale la pena memorizar:

1. **Doble contabilización del capital circulante.** Si tu FCF ya refleja los cambios en capital circulante, no los restes otra vez en el puente de EV a equity.
2. **Mezclar tipos nominales y reales.** Descontar flujos nominales a un WACC real infla el valor un 2–3% por cada año de proyección.
3. **Beta desactualizada.** Una beta mensual de 5 años en una empresa que acaba de pivotar su modelo de negocio ya no es informativa.
4. **Capex constante durante una transición de crecimiento.** Una SaaS madura que migra de centros de datos propios a la nube debería tener capex decreciente — modélalo.
5. **Ignorar la retribución basada en acciones (SBC).** Tratar el SBC como un add-back no monetario sin modelar la dilución infla el resultado un 5–15% en empresas tecnológicas.

## Cómo construir tu primer DCF en menos de una hora

Una secuencia pragmática que recomendamos a modeladores principiantes:

1. **Saca 3 años de estados financieros históricos.** Cuenta de resultados, balance, flujo de caja. [SEC EDGAR][edgar] es gratis; [PickSkill][chat] los extrae automáticamente.

[edgar]: https://www.sec.gov/edgar
[chat]: /chat

2. **Calcula el flujo de caja libre histórico.** Flujo de caja operativo − capex = FCF. Plotéalo.
3. **Proyecta 5 años.** Crecimiento de ingresos, margen EBIT, tipo impositivo, capex como % de ingresos, cambios en capital circulante. Una hoja por hipótesis con un comentario justificándola.
4. **Elige un WACC.** Búscalo en una fuente fiable (el [dataset de Damodaran en NYU Stern][damodaran] es el estándar de oro, actualizado trimestralmente con tasas libres de riesgo, primas de riesgo del equity y betas por industria) o derívalo vía CAPM con los rendimientos actuales del Tesoro.
5. **Elige un método de valor terminal** — prueba tanto crecimiento Gordon como múltiplo de salida, reporta los dos.
6. **Corre una tabla de sensibilidad.** WACC en un eje (±150 bp alrededor de tu base), crecimiento terminal o múltiplo de salida en el otro. Resalta la celda de tu hipótesis base.
7. **Escribe un comentario de 200 palabras** sobre lo que tendría que ser cierto para que el resultado fuera correcto.

El paso 7 es lo que separa un modelo que informa una decisión de una hoja de cálculo que la decora.

## Cómo construye PickSkill un DCF a demanda

Abre un chat y escribe algo como:

> *"Construye un DCF para NVDA en Excel — hoja de hipótesis, proyección de FCF a 5 años, WACC + sensibilidad, resumen de valoración."*

PickSkill extrae los históricos de presentaciones SEC + datos de mercado, elige valores por defecto sensatos para cada una de las cuatro hipótesis anteriores (con fuentes), ejecuta el cálculo, deja el resultado en un archivo Excel descargable, y te explica las hipótesis en el chat. Un primer DCF toma 60–90 segundos.

El modelo no es una caja negra — cada hipótesis es editable, cada número está referenciado, y puedes preguntar cosas como *"sube el crecimiento de ingresos en el año 2 al 25% y vuelve a correr la sensibilidad"* sin abrir Excel.

## FAQ

**¿Cuál es la diferencia entre DCF y VAN?**
El Valor Actual Neto (VAN) es la técnica general de descontar flujos futuros al presente. El DCF es la aplicación del VAN para valorar una empresa entera. Misma matemática, alcance más estrecho.

**¿Sigue siendo relevante el DCF para empresas tecnológicas?**
Sí, con ajustes. Trata la retribución basada en acciones como un coste real (no como un add-back no monetario). Usa periodos de proyección más largos (7–10 años) para capturar la rampa de crecimiento. Pon sensibilidad generosa en el margen terminal — ahí vive el valor.

**¿Por qué un pequeño cambio en WACC mueve tanto la respuesta?**
El DCF compone el descuento a lo largo del periodo de proyección. Un movimiento de 100 bp en WACC desplaza el flujo descontado de cada año y el impacto se compone — normalmente 8–15% sobre el valor empresa en un DCF de 5 años.

**¿Debería usar DCF no apalancado o apalancado?**
No apalancado (FCFF) para la mayoría de contextos de equity research, porque separa lo operativo de las decisiones de estructura de capital. Apalancado (FCFE) cuando la estructura de capital es el punto del análisis — LBOs, tesis impulsadas por recap, cualquier escenario en que el apalancamiento cambie materialmente.

**¿Dónde encuentro inputs actuales de WACC?**
La [página de datos de Damodaran en NYU Stern][damodaran] es la referencia estándar, actualizada trimestralmente con tasas libres de riesgo, primas de riesgo del equity, betas por industria y primas de riesgo país. [PickSkill][chat] usa esos valores por defecto y te permite sobrescribirlos.
