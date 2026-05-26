---
title: >-
  ¿Qué es el ATR (Average True Range)? La medida de volatilidad que dimensiona
  las posiciones
description: >-
  El ATR mide la volatilidad promedio por barra. Fórmula, por qué es la
  herramienta correcta para sizing y stops, el marco de múltiplos de ATR y
  cuatro trampas.
publishedAt: 2026-05-26T00:00:00.000Z
updatedAt: 2026-05-26T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    El equipo de investigación de PickSkill — construyendo un analista IA para
    inversores particulares.
pillar: explainer
tags:
  - ATR
  - Volatilidad
  - Análisis técnico
  - Sizing
  - Indicadores
heroImage: /blog/what-is-atr/hero.png
heroAlt: >-
  Infografía editorial — 4 acciones ordenadas de bajo ATR (KO) a alto ATR
  (small-cap), mostrando cómo los stops basados en ATR dimensionan posiciones
  según la volatilidad.
---

**El Average True Range (ATR) es el promedio del "rango verdadero" sobre N barras, donde el rango verdadero captura el mayor entre (máximo de hoy − mínimo de hoy), (máximo de hoy − cierre de ayer), o (cierre de ayer − mínimo de hoy).** Es el indicador más importante que la mayoría de los inversores minoristas no usa. El ATR no da señales de entrada. Te dice algo más útil: *cuánto se mueve esta acción en una barra típica*, para que puedas dimensionar posiciones y fijar stops de una manera que respete la volatilidad subyacente. Un stop del 1% en una acción de ATR alto y un stop del 1% en una acción de ATR bajo no son la misma operación.

### Puntos clave

- **Fórmula**: `Rango Verdadero = max(Máx − Mín, |Máx − CierreAnt|, |Mín − CierreAnt|)`. Luego `ATR(N) = promedio del TR sobre las últimas N barras`. N por defecto = 14 (suavizado de Wilder).
- **El ATR está en unidades de dólares** (p. ej., $1,85), no en porcentaje. La misma acción a precios distintos tiene ATR distinto. ATR / Precio da el equivalente en porcentaje.
- **Sizing de posición**: una regla común es "stop inicial 1× ATR, 0,5–1% de riesgo de cartera por operación". Mayor ATR = menor posición para mantener el riesgo en dólares constante.
- **Los regímenes de volatilidad cambian.** El ATR de una acción puede duplicarse en meses alrededor de resultados, shocks macro o noticias. Recalibra stops y sizing a medida que cambia el régimen.
- **El ATR es neutro respecto a dirección.** No dice nada sobre hacia dónde va la acción. Empareja con [pila MA](/blog/what-is-ma), [MACD](/blog/what-is-macd) u otras herramientas direccionales.

## ¿Cómo se calcula el ATR?

El "rango verdadero" para cada barra maneja los huecos de apertura con limpieza:

```
TR[t] = max(
  Máximo[t] − Mínimo[t],
  |Máximo[t] − Cierre[t-1]|,
  |Mínimo[t]  − Cierre[t-1]|
)
```

El primer término es el rango intradía de la barra. El segundo y tercero capturan aperturas con gap al alza y con gap a la baja respectivamente, donde el movimiento real del precio desde el cierre anterior fue mayor que el propio rango de la barra. El calificador "verdadero" en rango verdadero significa: el mayor movimiento plausible, incluyendo gaps.

Luego el ATR promedia sobre N barras con el suavizado de Wilder (el mismo suavizado exponencial usado en el [RSI](/blog/what-is-rsi)):

```
ATR[t] = (ATR[t-1] × (N-1) + TR[t]) / N
```

N por defecto = 14 en prácticamente todas las plataformas. El suavizado de Wilder significa que cada nuevo TR tiene peso 1/N (~7,1% a N = 14), con el residual arrastrándose.

## ¿Qué te dice realmente el ATR?

El ATR es una cantidad en dólares: "ATR de $1,85 en una acción de $100" significa que el movimiento típico de la barra (incluyendo gaps nocturnos) es de $1,85. Eso es más directamente útil que la volatilidad porcentual por varias razones:

- **Los stops son eventos en dólares.** Que tu stop se ejecute depende de movimientos en dólares, no porcentuales.
- **El riesgo por acción es la unidad correcta para sizing.** ATR en dólares = movimiento esperado en dólares por acción = la referencia correcta de riesgo por acción.
- **La comparación entre acciones es más honesta en ATR%.** Divide el ATR por el precio actual para obtener ATR% — directamente comparable entre acciones a distintos niveles de precio.

| Acción | Precio | ATR | ATR% | Interpretación |
|---|---|---|---|---|
| Mega-cap (p. ej. KO) | $60 | $0,45 | 0,75% | Baja volatilidad — gran negocio estable |
| Tech large-cap (p. ej. AAPL) | $180 | $2,40 | 1,3% | Volatilidad moderada |
| Crecimiento (p. ej. PLTR) | $35 | $1,20 | 3,4% | Mayor volatilidad |
| Small-cap | $25 | $1,30 | 5,2% | Alta volatilidad — se necesitan stops más amplios |

El patrón: los negocios grandes y estables tienen ATR% bajo; los nombres pequeños, de crecimiento o impulsados por noticias tienen ATR% alto. Las diferencias entre acciones son grandes y importan para el sizing.

## El marco de múltiplos de ATR para los stops

El uso práctico más común del ATR es fijar stop loss iniciales como múltiplo del ATR:

- **Stop 1× ATR**: Estrecho. Útil para setups de alta convicción donde quieres margen mínimo para ruido. Se ejecuta con frecuencia.
- **Stop 2× ATR**: Estándar. La mayoría de sistemas de swing-trading usan 2× ATR por defecto. Filtra el ruido rutinario; captura reversiones genuinas.
- **Stop 3× ATR**: Amplio. Usado para operaciones de posición de largo plazo donde quieres sobrevivir a correcciones moderadas.

Ejemplo con AAPL a $180, ATR = $2,40:

| Stop | Distancia del stop | Precio del stop | Riesgo por acción |
|---|---|---|---|
| 1× ATR | $2,40 | $177,60 | $2,40 |
| 2× ATR | $4,80 | $175,20 | $4,80 |
| 3× ATR | $7,20 | $172,80 | $7,20 |

Para un riesgo de cartera del 1% por operación sobre una cuenta de $100K (presupuesto de riesgo $1.000):

| Múltiplo de stop | Acciones (riesgo = $4,80/acción a 2× ATR) | Tamaño de posición en dólares |
|---|---|---|
| 2× ATR ($4,80 riesgo/acción) | $1.000 / $4,80 = 208 acciones | 208 × $180 = $37.440 |

El marco de múltiplos de ATR dimensiona automáticamente posiciones más pequeñas en acciones de ATR alto y posiciones más grandes en acciones de ATR bajo, manteniendo constante el riesgo en dólares por operación. Es la mejora significativa más simple sobre el sizing por número fijo de acciones o por dólares fijos.

## Por qué importan los regímenes de volatilidad

El ATR no es estático — cambia con el tiempo a medida que cambia el régimen de volatilidad. Tres patrones a reconocer:

1. **Expansión por resultados**: el ATR sube típicamente entre el 50% y el 100% en las 2–3 sesiones alrededor de una publicación de resultados, luego retrocede. Stops fijados sobre el ATR pre-resultados pueden ejecutarse por movimientos rutinarios de día de resultados.

2. **Expansión por shock macro**: el ATR del mercado entero se amplía durante picos de VIX (decisiones de tipos, eventos geopolíticos, estrés bancario). Un ATR de 14 barras reflejará esto en 7–10 sesiones; las posiciones mantenidas en el régimen deberían redimensionarse.

3. **Compresión antes de la ruptura**: un ATR cayendo durante muchas semanas consecutivas a menudo precede a un movimiento direccional brusco. El "ATR squeeze" se empareja de forma natural con el [squeeze de Bandas de Bollinger](/blog/what-is-bollinger-bands) — ambos miden el mismo fenómeno de compresión.

Los paneles de PickSkill exponen el ATR como métrica seguida para que puedas ver los cambios de régimen de un vistazo.

## Cuatro trampas al usar el ATR

1. **Fijar stops sin ATR.** Los stops de porcentaje fijo (por ejemplo, "siempre stop del 5%") ignoran que el 5% en una acción tranquila y el 5% en una acción volátil son muy distintos en términos de con qué frecuencia el stop captura ruido vs reversiones reales. Los stops basados en ATR son conscientes del ruido.

2. **Usar el ATR para dirección.** El ATR es neutro respecto a dirección por construcción — te dice cuánto se mueve la acción, no en qué dirección. Tratar "ATR alto" como bajista o "ATR bajo" como alcista es un error de categoría. Empareja con herramientas direccionales.

3. **No ajustar el ATR al régimen.** Un ATR calculado sobre las últimas 14 barras de mercado tranquilo subestima la volatilidad a la que te enfrentarás en el siguiente régimen. Tras un cambio de régimen (resultados, noticias, macro), dale al ATR 7–10 barras para reflejar la nueva normalidad antes de dimensionar nuevas posiciones.

4. **Confundir ATR con volatilidad realizada (sigma).** Ambos miden volatilidad pero con matemática distinta. La volatilidad realizada es la desviación estándar de los retornos diarios y es la que usa el pricing de opciones. El ATR es el rango verdadero promedio y es más intuitivo para stops y sizing. Generalmente coinciden en dirección pero los números no son intercambiables.

## Cómo encaja el ATR en un flujo de trabajo multi-señal

El ATR es la *capa* de volatilidad que dimensiona todo lo demás:

| Capa | Herramienta | Pregunta que responde |
|---|---|---|
| **Dirección** | Pila MA, [MACD](/blog/what-is-macd), filtro de tendencia | ¿Hacia dónde va el mercado? |
| **Setup** | [Divergencia](/blog/what-is-divergence), [soporte/resistencia](/blog/what-is-support-resistance) | ¿Hay un patrón accionable? |
| **Disparador** | Cruce %K de %D, cruce de línea MACD | ¿Cuándo actuar? |
| **Volatilidad / sizing** | **ATR** | ¿De qué tamaño debe ser la posición? ¿Dónde debe ir el stop? |
| **Confirmación** | [Volumen](/blog/what-is-volume-analysis), [flujo de capital](/blog/what-is-capital-flow) | ¿El movimiento está respaldado por participación? |

La capa más omitida en el trading minorista es la volatilidad. Sin ella, los tamaños de posición son arbitrarios y los stops son o demasiado estrechos (saltados por ruido) o demasiado amplios (pérdidas sobredimensionadas).

## Cómo se comporta el ATR en acciones A

La microestructura del mercado A-share cambia la interpretación del ATR:

- **Días de límite superior/inferior** topan el rango de la barra al precio del límite (±10% en el mercado principal). En un día de límite, el rango verdadero es exactamente el movimiento del límite; un ATR calculado en días consecutivos de límite sobrepasará la volatilidad real. Los paneles A-share de PickSkill marcan las barras de día de límite como atípicas.
- **Liquidación T+1** comprime la volatilidad intradía en las aperturas de la siguiente sesión. La frecuencia de gaps en A-share es mayor que en large-cap EE. UU.; el manejo de gaps en la fórmula de rango verdadero importa más.
- **Suspensiones** crean discontinuidades. Las lecturas de ATR post-suspensión deben descontarse durante las primeras 5–10 barras.

Ver [Mejores indicadores para acciones A](/blog/best-indicators-for-a-shares) para el playbook más amplio específico de mercado.

> **Mira el ATR en tu cartera.** En [/chat](/chat), pregunta "para cada posición, muestra el ATR actual, ATR% y el cambio vs promedio de 60 días. Marca cualquiera donde el ATR sea más de 1,5× su promedio de 60 días — esos son nombres con régimen cambiado que necesitan recalibración del stop-loss."

## Prompts de seguimiento habituales

- *"Para [ticker], calcula el stop 2× ATR y dime cuántas acciones debería mantener para 1% de riesgo de cartera."*
- *"Encuentra nombres del S&P 500 donde el ATR se haya comprimido un 30%+ en las últimas 8 semanas — candidatos a squeeze de Bollinger."*
- *"Compara el ATR actual de mis posiciones con su rango de 12 meses. ¿Cuáles están en extremos de volatilidad baja (posible ruptura) vs extremos de volatilidad alta (evitar por ahora)?"*
- *"Hace un backtest de un trailing stop de 2× ATR en [ticker] durante los últimos 5 años. ¿Cómo se compara con un stop fijo del 5%?"*

## Lecturas adicionales

- [Investopedia sobre el ATR](https://www.investopedia.com/terms/a/atr.asp) — referencia completa.
- [J. Welles Wilder Jr., *New Concepts in Technical Trading Systems*](https://www.amazon.com/dp/0894590278) — tratamiento original del desarrollador sobre el rango verdadero y el ATR.

## FAQ

**¿Debería usar ATR o desviación estándar para volatilidad?**
ATR para stops y sizing — está en unidades de dólares y es directamente aplicable. Desviación estándar (o volatilidad realizada anualizada, σ) para pricing de opciones y análisis estadístico — está en porcentaje y asume normalidad. Los dos generalmente coinciden en dirección pero responden preguntas distintas.

**¿Cuál es el múltiplo de ATR correcto para los stops?**
2× ATR es el punto de partida más común para swing trades. 1× ATR es estrecho (ejecuciones frecuentes, adecuado para setups de muy alta convicción). 3× ATR es amplio (usado para operaciones de posición donde quieres sobrevivir a correcciones moderadas). La elección depende del horizonte de tenencia y la tolerancia personal a whipsaw vs pérdidas sobredimensionadas.

**¿Por qué el ATR está en unidades de dólares en lugar de porcentaje?**
El ATR fue diseñado por Wilder para aplicarse a futuros de commodities, donde el riesgo denominado en dólares es la unidad natural. Para acciones, el ATR en dólares sigue siendo la unidad correcta para decisiones de stops y sizing (tu stop es un evento en dólares, no en porcentaje). Para comparación entre acciones, divide el ATR por el precio actual para obtener ATR%.

**¿Cómo se relaciona el ATR con el ancho de las Bandas de Bollinger?**
Ambos miden volatilidad pero con fórmulas distintas. El ancho de Bollinger usa la desviación estándar del cierre; el ATR usa el rango verdadero (que incluye gaps). Cuando los dos divergen (ATR subiendo pero ancho cayendo), normalmente señala volatilidad impulsada por gaps — los rangos diarios se están ampliando pero los *precios de cierre* siguen dentro de una banda estrecha. Esta es una señal útil de detección de régimen.

**¿Debería ajustar el ATR por splits de acciones?**
Sí — cualquier indicador basado en precio por barra necesita ajuste por splits para comparación histórica. La mayoría de plataformas lo manejan automáticamente; los cálculos manuales de ATR sobre datos históricos crudos sin ajuste por splits producirán falsos cambios de régimen en las fechas de split. Los paneles de PickSkill usan precios ajustados por splits en todo momento.
