---
title: Qué es el WACC — La tasa de descuento del DCF
description: El WACC es la tasa de descuento que decide cada DCF. Fórmula, cuatro inputs clave, por qué 100pb mueven 8-15% el valor, workflow de triangulación.
publishedAt: 2026-05-22
updatedAt: 2026-05-22
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: El equipo de investigación de PickSkill — construyendo un analista IA para inversores particulares.
pillar: explainer
tags:
  - valuation
  - wacc
  - capital-cost
  - fundamentals
heroImage: /blog/what-is-wacc/hero.png
heroAlt: Ilustración editorial de un dial de promedio ponderado en tonos oscuros cálidos con acentos esmeralda
---

El **WACC (coste medio ponderado del capital)** es la rentabilidad mezclada que una empresa debe generar sobre sus activos para satisfacer a la vez a accionistas y a prestamistas. En un modelo DCF es la tasa con la que descontamos los flujos de caja futuros a hoy — el único número que determina, en silencio, si una acción parece "30% infravalorada" o "30% sobrevalorada". Si te equivocas con el WACC, todos los demás números del modelo se redondean a ruido.

Esta guía cubre la fórmula, las cuatro variables que realmente importan, los errores que sobreviven hasta los informes publicados y cómo triangular un WACC que aguante el contraexamen.

### Puntos clave

- **WACC = (E/V) × Re + (D/V) × Rd × (1 − t).** Peso del equity por coste del equity, más peso de la deuda por coste de la deuda después de impuestos.
- **Un cambio de 100 bp en WACC mueve un DCF a 5 años entre 8 y 15%.** La tabla de sensibilidad del WACC es lo primero que mira un revisor.
- **Cuatro variables hacen el 90% del trabajo**: tipo libre de riesgo, prima de riesgo del equity, beta y coste de la deuda después de impuestos. Gasta el tiempo aquí.
- **Usa valores de mercado, no contables, para los pesos E/V y D/V** — el patrimonio contable es un artefacto contable, no lo que el mercado valora en realidad.
- **PickSkill calcula un WACC trazable en menos de un minuto** a partir de los rendimientos actuales del Tesoro, los datos sectoriales de Damodaran y las propias presentaciones de la empresa — cada variable editable en línea.

## ¿Cuál es la fórmula del WACC?

La versión de manual, con un ajuste fiscal que importa en la práctica:

```
WACC = (E/V) × Re + (D/V) × Rd × (1 − t)
```

Donde:

| Símbolo | Significado |
|---|---|
| `E` | Valor de mercado del equity (precio × acciones en circulación) |
| `D` | Valor de mercado de la deuda (precio de bono si cotiza; si no, valor contable como proxy) |
| `V` | Capital total, `E + D` |
| `Re` | Coste del equity — lo que exigen los accionistas |
| `Rd` | Coste pre-impuestos de la deuda — lo que cobran los prestamistas |
| `t` | Tipo marginal (porque el interés es deducible) |

El `(1 − t)` es el detalle que sostiene todo — la deuda es más barata que el equity no solo porque los prestamistas exigen menos, sino porque el gasto financiero baja la factura fiscal. Una empresa con tipo del 25% y deuda al 5% antes de impuestos paga en realidad un 3,75% después.

## ¿Por qué importa el WACC?

Tres razones por las que en un DCF el WACC es el número más consecuente:

1. **Se compone a lo largo del horizonte de proyección.** 100 bp de cambio descuentan el flujo de caja del año 5 en `1,10⁵ vs 1,11⁵` — unos 4,5% de diferencia, que se amplía con cada año añadido. En un DCF típico a 5 años eso son entre 8 y 15% de variación en el enterprise value (análisis interno de PickSkill sobre ~200 modelos de gran capitalización en 2025).
2. **Gobierna la sensibilidad del denominador en el valor terminal.** El valor terminal Gordon Growth es `FCFn+1 / (WACC − g)`. Un movimiento de 50 bp en WACC con un crecimiento del 3% cambia el denominador del 7% al 7,5% — un 7% de variación en el terminal, que es el 60–80% del EV en la mayoría de DCFs a 5 años.
3. **Es la palanca que el revisor toca primero.** Cuando un analista discrepa del consensus, la primera pregunta es casi siempre "¿qué WACC estás usando?" Si no puedes defender el WACC, no puedes defender el modelo.

## Las cuatro variables que de verdad importan

Para la mayoría de empresas no financieras, el coste del equity es la mayor pieza (suele pesar entre 70 y 90%). Dentro del coste del equity, tres sub-variables del CAPM hacen casi todo el trabajo:

```
Re = Rf + β × ERP
```

### 1. El tipo libre de riesgo (Rf)

El rendimiento de un bono soberano largo — para acciones cotizadas en EE. UU., el Treasury a 10 o 30 años. Usa el rendimiento **actual**, no una media histórica. El rendimiento de hoy es lo que un inversor compara contra los retornos del equity hoy.

El 30 años es teóricamente más correcto para casar con un valor terminal perpetuo, pero el 10 años es la convención práctica — más líquido y mejor reflejo de la política de la Fed. La mayoría de mesas de sell-side usan el 10 años; alinearte facilita la comparación.

### 2. Prima de riesgo del equity (ERP)

El extra que los inversores exigen por tener equity en lugar de bonos libres de riesgo. No hay una ERP "correcta", solo rangos defendibles. Los dos métodos prácticos:

- **Histórico**: prima realizada a largo plazo de las acciones sobre el Tesoro. Los datos de EE. UU. apuntan a un 5,0–5,5% (los datos de Damodaran en NYU Stern, refrescados trimestralmente, son la referencia más citada).
- **Implícito**: despeja la ERP que justifica el precio actual del S&P 500 dadas las estimaciones de consenso. Hoy queda cerca del 4,0–4,5% — más bajo porque las valoraciones están elevadas.

Elige un método y divúlgalo. Mezclar histórico e implícito en distintas partes del mismo modelo es el tipo de incongruencia que captan los revisores.

[damodaran]: https://pages.stern.nyu.edu/~adamodar/

### 3. Beta (β)

La sensibilidad de los retornos de la acción a los retornos del mercado. Se calcula con regresiones rodantes — habitualmente 5 años con datos mensuales o 2 años con datos semanales.

Dos modos de fallo recurrentes:

- **Beta caduca en una empresa transformada.** Una beta de 5 años para una SaaS que acaba de comprar un negocio de hardware ya no es informativa — la mitad del periodo refleja un negocio distinto.
- **Comparables, sin desapalancar.** Cuando los comparables son ruidosos, lo estándar es promediar betas del peer-group, desapalancarlas para eliminar diferencias de estructura de capital y volver a apalancarlas a la estructura de la empresa objetivo. Saltarse el paso de desapalancar es el error más común en modelos de estudiantes.

### 4. Coste de la deuda después de impuestos (Rd × (1 − t))

Para empresas grado de inversión con bonos cotizados, lee el yield-to-maturity directamente. Para empresas cuya deuda no cotiza, infiere el coste añadiendo un spread de crédito (asociado al rating) al rendimiento del Treasury de duración equivalente. Damodaran publica spreads sintéticos por tramos de cobertura de intereses — útil cuando no tienes rating.

Aplica el tipo **marginal**, no el efectivo. La deducción de intereses escuda renta al tipo marginal, que puede diferir del efectivo cuando hay NOLs, rentas de origen extranjero o partidas atípicas.

## Cómo triangular un WACC en 15 minutos

Una secuencia práctica como la que usamos en la herramienta WACC de PickSkill:

1. **Saca el rendimiento del Treasury a 10 años de hoy.** De una fuente líquida; no promedies.
2. **Elige la ERP de una sola fuente** — Damodaran es la referencia estándar. Anota si es histórica o implícita; por defecto, histórica.
3. **Obtén una beta de regresión** y úsa la [beta sectorial de Damodaran][damodaran] como contraste. Si la beta de la empresa se aleja más de 0,3 del promedio sectorial, pregúntate por qué.
4. **Estima el coste de la deuda** vía YTM de bonos cotizados o vía el método del spread sintético (la búsqueda por "cobertura de intereses" de Damodaran).
5. **Calcula pesos con valores de mercado.** El peso del equity es directo. El peso de la deuda usa valor de mercado de la deuda — para deuda sin cotización, el valor contable es razonable si los tipos no se han movido 200 bp desde la emisión.
6. **Aplica el tipo marginal.** Para contribuyentes en EE. UU. son el 21% federal más estatal mezclado — usualmente 24–26% total.
7. **Contrasta contra el WACC sectorial.** Damodaran publica WACCs por industria trimestralmente. Si tu número se aleja más de 100 bp de la industria, anota por qué — y asume esa brecha cuando lo presentes.

## Errores frecuentes que sobreviven al modelo publicado

Una checklist de 134 palabras que merece la pena memorizar:

1. **Pesos por valor contable en lugar de valor de mercado.** El patrimonio contable es lo que registra la contabilidad; el de mercado es lo que poseen los inversores. Una empresa rentable puede tener un patrimonio contable que sea un cuarto del de mercado — usar valores contables sobrepondera la deuda y tripleconta el coste del equity.
2. **Coste de la deuda sin impuestos.** Olvidar el `(1 − t)` infla el WACC entre 100 y 200 bp en empresas con mucha deuda.
3. **Tipo fiscal caduco.** Las empresas en transición (reforma fiscal en EE. UU., multinacionales mudando sede) tienen tipos que no coinciden con el statutory. Verifícalo contra la nota fiscal del último 10-K.
4. **Ignorar leasings.** Bajo IFRS 16 / ASC 842, los arrendamientos operativos están en balance como deuda — y muchos analistas de retail / aerolíneas / restaurantes siguen olvidando incluirlos en `D/V`.
5. **CAPM para una empresa privada sin desapalancar betas.** Una beta de comparables con la estructura de capital equivocada produce números sin sentido. Desapalancar y reapalancar, siempre.

## Cómo PickSkill construye un WACC

Abre un chat y escribe:

> *"Calcula un WACC para AMD — muéstrame los inputs y deja que ajuste la ERP."*

PickSkill toma el rendimiento del Treasury a 10 años de hoy, la ERP más reciente de Damodaran y la beta sectorial, los rendimientos de los bonos cotizados de la empresa (o el spread sintético si no tiene deuda rated), y el tipo marginal de la nota fiscal del último 10-K. Calcula la media ponderada, expone cada input y te deja modificar cualquiera de ellos en línea — el resultado se actualiza en vivo, y la fuente de cada número está a un clic.

La matemática es la misma del DCF que harías en Excel. La diferencia es que los 8 minutos de recopilación de datos se reducen a ~30 segundos, y los inputs están con fuente — cuando un revisor pregunta "¿de dónde sale esa ERP?", la respuesta es un enlace, no una conjetura.

Este WACC se alimenta directamente en la [herramienta DCF](/blog/what-is-dcf) si quieres el flujo de valoración completo.

## FAQ

**¿Cuál es un WACC típico para una empresa cotizada?**
Para grandes capitalizaciones de EE. UU. en 2025–2026, los WACCs se agrupan entre 8% y 11%. Sectores defensivos maduros (utilities, consumo básico) están en 6–8%; tecnología y biotecnología de alto crecimiento, entre 10 y 13%; productores cíclicos de materias primas pueden estar entre 9 y 15% según apalancamiento.

**¿Debería cambiar el WACC durante el horizonte de proyección?**
Teóricamente, sí — la estructura de capital suele converger hacia un objetivo a largo plazo. En la práctica la mayoría de analistas usan un WACC único en todo el horizonte para mantener el modelo tratable, y solo lo flexionan en el paso del terminal. Ambos enfoques son defendibles; lo importante es ser consistente dentro de un mismo modelo.

**¿Por qué usar valor de mercado de la deuda en lugar de valor contable?**
Cuando los tipos suben, el valor de mercado de la deuda a tipo fijo baja por debajo del contable. Una empresa que emitió notas al 3% cuando los tipos estaban al 2% tiene deuda que hoy cotiza significativamente por debajo de la par — y ese valor menor de mercado es lo que realmente respalda al equity. En deuda investment-grade pública, la brecha puede ser de 5–15% sobre la par; ignorarla distorsiona D/V.

**¿Puedo usar un único WACC para una empresa multi-segmento?**
Solo como primera aproximación. Si la empresa opera negocios con perfiles de riesgo claramente distintos (software de consumo + procesamiento de pagos + hardware), una valoración por suma de las partes con WACCs por segmento es más honesta. Para un primer borrador, un WACC mezclado ponderado por EBIT del segmento es aceptable.

**¿Dónde encuentro los inputs actuales del WACC?**
La [página de datos de Damodaran en NYU Stern][damodaran] es la referencia estándar, actualizada trimestralmente con tipos libres de riesgo, primas de riesgo del equity, betas sectoriales y spreads de crédito sintéticos. [PickSkill](/chat) usa esos valores por defecto y te permite sobrescribir cualquiera de ellos en línea.
