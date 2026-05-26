---
title: Cómo encontrar acciones sobrevendidas en 60 segundos con PickSkill
description: >-
  Usa el panel de RSI para escanear una cartera o watchlist en busca de
  oportunidades sobrevendidas, filtra por régimen de tendencia y convierte
  candidatos en entradas ranked.
publishedAt: 2026-05-26T00:00:00.000Z
updatedAt: 2026-05-26T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    El equipo de investigación de PickSkill — construyendo un analista IA para
    inversores particulares.
pillar: how-to
tags:
  - Tutorial
  - RSI
  - Sobrevendido
  - Screening
  - Flujo de trabajo
heroImage: /blog/how-to-find-oversold-stocks/hero.png
heroAlt: >-
  Infografía editorial — cadena de filtros en embudo: ~30 candidatos brutos
  RSI<30 → ~12 tras ADX + MM 200 días → ~2 setups accionables tras confirmación
  multinivel.
---

**"Sobrevendido" es uno de los términos de inversión más buscados — y uno de los más maltratados.** Un filtro simple de RSI por debajo de 30 parece una gran señal en retrospectiva en gráficos donde funcionó. Los backtests muestran que el filtro de sobrevendido a secas es un lanzamiento de moneda, porque la mitad de las lecturas "sobrevendidas" ocurren en acciones claramente en tendencia bajista donde la condición de sobrevendido puede persistir durante semanas. Este tutorial recorre la búsqueda de candidatos sobrevendidos genuinamente accionables en 60 segundos — combinando la señal RSI con filtros de régimen de tendencia y eventos de confirmación que elevan significativamente la ventaja por señal.

### Puntos clave

- **4 pasos, ~60 segundos.** Abre el panel de RSI, ordena por RSI actual, filtra por régimen de tendencia, suma confirmación antes de actuar.
- **El RSI < 30 a secas es un lanzamiento de moneda.** Añadir [ADX](/blog/what-is-adx) > 25 y un filtro de dirección de tendencia reduce las señales falsas en un 40–60%.
- **El setup más limpio**: sobrevendido + ADX fuerte + precio por encima de la MA de 200 días + divergencia alcista en MACD.
- **Vigila los eventos de confirmación** — el RSI cruzando de vuelta por encima de 30 desde abajo, o una ruptura de precio por encima del swing high más reciente.
- **Funciona en posiciones de EE. UU., HK y acciones A** con manejo apropiado por mercado de las barras de día de límite.

## Por qué importa este flujo de trabajo

La regla "RSI por debajo de 30 = comprar" es una de las señales más conocidas del análisis técnico. También tiene un track record mucho peor de lo que sugiere la literatura:

- En mercados bajistas fuertemente tendenciales, el RSI puede mantenerse por debajo de 30 durante semanas mientras la acción sigue cayendo. Actuar a RSI = 28 significa atrapar un cuchillo en caída.
- En mercados laterales, el RSI cae por debajo de 30 rutinariamente por ruido. La mayoría de estas caídas revierten rápido sin producir movimientos accionables.
- Los setups sobrevendidos más limpios tienen estructura adicional: un régimen de tendencia confirmado, un nivel de soporte claro cerca y momentum empezando a girar.

Sin una herramienta que escanee tu cartera para el setup *combinado*, no puedes aplicar los filtros en capas de forma eficiente. Con la herramienta, el filtro es un clic y la calidad del candidato sube sustancialmente.

Para el concepto en sí, ver [¿Qué es el RSI?](/blog/what-is-rsi).

## El flujo de trabajo en 4 pasos

### Paso 1 — Abre el panel de RSI

Ve a [/indicators](/indicators) y selecciona RSI. El panel escanea cada posición en tu cartera por defecto (o cualquier cartera que selecciones) y muestra la lectura actual de RSI, el registro de 5 días de RSI y la clasificación de bucket (sobrevendido / saliendo del sobrevendido / neutral / sobrecomprado / saliendo del sobrecomprado).

Ordena por RSI ascendente. Las lecturas más bajas aparecen primero.

### Paso 2 — Identifica los candidatos

El panel surface tres categorías de "RSI bajo":

| Estado | Valor RSI | Acción |
|---|---|---|
| **Sobrevendido, aún cayendo** | < 25 y registro dice "decreciendo" | Espera — el momentum sigue negativo |
| **Sobrevendido, girando** | < 30 y registro dice "creciendo" | Candidato a watchlist |
| **Salida de sobrevendido** | Cruzó desde < 30 de vuelta por encima de 30 | Candidato accionable — evento de confirmación |

El bucket accionable es "sobrevendido, girando" o "salida de sobrevendido". El bucket "sobrevendido, aún cayendo" necesita más tiempo. El filtro simple "RSI < 30" mezcla los tres y es la razón por la que la señal a secas rinde por debajo.

### Paso 3 — Añade el filtro de régimen de tendencia

Antes de actuar sobre cualquier candidato sobrevendido, verifica el régimen de tendencia:

1. **El ADX debe estar por encima de 25.** ADX bajo significa lateral; las señales sobrevendidas allí son aproximadamente aleatorias.
2. **Precio respecto a la MA de 200 días**: prefiere candidatos por encima de su SMA de 200 días (tendencia alcista de largo plazo con retroceso de corto plazo). Los candidatos por debajo de la MA de 200 días son setups estilo deep value que requieren trabajo fundamental.
3. **Contexto MACD**: prefiere candidatos donde el MACD aún no haya hecho un nuevo mínimo al mismo tiempo que el RSI (divergencia alcista — ver [¿Qué es la divergencia?](/blog/what-is-divergence)).

Aplica los tres filtros y el número de candidatos cae aproximadamente entre un 60% y un 80%. Los que quedan son los setups con mayor ventaja.

### Paso 4 — Genera un plan de entrada

Una vez que un candidato pasa los filtros, usa el chat para generar un plan de entrada estructurado:

```text
Para [ticker], el RSI acaba de salir del sobrevendido. Construye un plan de entrada:
- Precio actual vs el nivel de soporte más cercano
- Entrada sugerida (actual vs limit-buy en pullback)
- Nivel de stop inicial usando 2× ATR o por debajo del swing low más reciente
- Objetivo inicial basado en el nivel de resistencia más cercano
- Tamaño de posición para 1% de riesgo de cartera sobre una cuenta de $100K
```

PickSkill devuelve un plan estructurado con niveles con fuente, una posición dimensionada por [ATR](/blog/what-is-atr) y un ratio riesgo-recompensa. Ajusta hipótesis inline y vuelve a ejecutar.

> **Pruébalo ahora.** Abre [/indicators](/indicators), selecciona RSI y ordena ascendente. Incluso en una cartera de 10 nombres es probable que veas 1–3 candidatos sobrevendidos al mes — pero los candidatos *filtrados* (sobrevendido + ADX fuerte + por encima de 200 días + divergencia) son más raros y más accionables.

## Qué captura el panel que el escaneo manual pierde

### 1. El disparador "salida" vs la condición "en extremo"

El escaneo manual de gráficos encuentra a menudo nombres con RSI = 28 y concluye "sobrevendido, comprar". El panel distingue explícitamente entre *aún cayendo* y *girando al alza* — esto último es el estado accionable. La distinción suele aparecer 1–3 barras después del mínimo absoluto del RSI, que es exactamente cuándo los observadores discrecionales de gráficos tienden a actuar sobre lecturas crudas de "sobrevendido".

### 2. Escaneo simultáneo multi-nombre

El escaneo a mano funciona para unos pocos nombres. El panel escanea tu watchlist completa en segundos. En una watchlist de 30 nombres normalmente hay al menos un setup sobrevendido-girando accionable en cualquier momento — encontrarlo manualmente significa mirar 30 gráficos.

### 3. Detección combinada de RSI + régimen de tendencia + divergencia

La señal RSI a secas es un lanzamiento de moneda; la señal en capas tiene ventaja significativa. El escaneo en capas es impracticable a mano porque requiere verificar tres indicadores en cada nombre. La automatización hace del filtro multi-capa el *default* en lugar de una disciplina aspiracional.

## Cuatro trampas en el flujo de sobrevendido

1. **Actuar sobre RSI < 30 crudo sin filtros.** La tasa de acierto empírica es ~50% sobre la señal a secas. Añadir ADX y filtros de dirección la eleva al 60–70%.
2. **Comprar en tendencias bajistas claras.** "Sobrevendido" en una acción que ha perdido el 50% en un mes normalmente no es el suelo — es una acción de momentum que continuará cayendo. Respeta el filtro de la MA de 200 días.
3. **Ignorar el evento de salida.** Comprar a RSI = 25 con el RSI aún tendiendo a la baja significa que puede que no veas el suelo durante 5–15 barras más. Espera el cruce por encima de 30 (o al menos la estabilización en el registro de 5 días) antes de dimensionar.
4. **Dimensionar sin ATR.** Las acciones sobrevendidas a menudo tienen ATR más alto que su régimen normal. Usar un stop de porcentaje fijo (por ejemplo, 5%) en una acción con ATR elevado significa que el stop está a distancia de nivel de ruido; usar un stop 2× ATR dimensiona la operación a la volatilidad real.

## Cómo se aplica esto en acciones A

Las dinámicas del mercado A-share cambian las dinámicas del sobrevendido:

- **Secuencias de límite inferior** pueden producir lecturas de RSI por debajo de 20 durante 3–5 barras consecutivas, incluso cuando la acción tiene más recorrido a la baja. Empareja el filtro RSI con exclusión de días de límite (los paneles A-share de PickSkill lo hacen automáticamente).
- **Restricciones de day-trading (T+1)** significan que los compradores minoristas de sobrevendido están asumiendo riesgo overnight. El sizing de posición importa más.
- **La rotación sectorial en A-share es más rápida que en EE. UU.**: los candidatos sobrevendidos dentro de un sector que está rotando *hacia fuera* a menudo permanecen sobrevendidos más tiempo. Contrasta la tendencia del sector.

Ver [Mejores indicadores para acciones A](/blog/best-indicators-for-a-shares) para el playbook más amplio.

## Flujos de seguimiento habituales

- *"Muéstrame candidatos sobrevendidos en mi watchlist completa donde ADX > 25 Y el precio esté por encima de la MA de 200 días Y MACD muestre divergencia alcista — la pila de alta ventaja."*
- *"Para cada candidato sobrevendido, calcula el stop 2× ATR y el nivel de resistencia más cercano. Ordena por ratio riesgo-recompensa."*
- *"Hace un backtest del setup sobrevendido en capas (RSI < 30 → cruce de RSI > 30 + ADX > 25 + por encima de 200 días) en el S&P 500 durante los últimos 10 años. ¿Cuál es la tasa de acierto?"*
- *"Para mis posiciones de acciones A, excluye cualquier nombre que haya tocado límite inferior en los últimos 5 días del escaneo de sobrevendido."*

## Lecturas adicionales

- [¿Qué es el RSI?](/blog/what-is-rsi) — el concepto subyacente.
- [Combinando MACD, RSI y ADX en un filtro de 3 indicadores](/blog/three-indicator-filter) — el enfoque en capas en detalle.

## FAQ

**¿Qué nivel de RSI cuenta como sobrevendido?**
30 es el umbral convencional pero no es mágico. En mercados fuertemente tendenciales, 25 puede ser el umbral funcional; en mercados laterales, 35 captura más setups utilizables. Los paneles de PickSkill usan 30 por defecto para comparabilidad entre mercados.

**¿Por qué la señal "RSI < 30 comprar" a secas rinde por debajo?**
Porque mezcla tres estados distintos: sobrevendido-y-aún-cayendo (el suelo no se ha formado), sobrevendido-y-girando (el estado accionable) y sobrevendido-en-mercado-bajista (donde la condición persiste durante semanas). El filtro en capas (ADX + MA de 200 días + divergencia + cruce de vuelta por encima de 30) aborda cada modo de fallo.

**¿Cuánto debería esperar después de que el RSI salga del sobrevendido?**
Para la mayoría de setups, el cruce por encima de 30 es en sí mismo el disparador. Esperar más (por ejemplo, RSI > 50) reduce significativamente el número de operaciones pero aumenta la ventaja por operación en mercados tendenciales. El trade-off es entre capturar más reversiones (temprano) y capturar solo las confirmadas (tarde). Los paneles de PickSkill muestran ambos: el evento de cruce y la confirmación "RSI > 50".

**¿Debería operar setups sobrevendidos en acciones individuales o esperar lecturas de sobrevendido a nivel de mercado?**
El sobrevendido a nivel de mercado (VIX > 30, RSI del SPY < 30) es más raro pero históricamente tiene una ventaja mucho mayor — estás capturando dislocaciones en lugar de drawdowns específicos del nombre. Los setups sobrevendidos a nivel de acción son más frecuentes pero requieren juicio específico de cada nombre sobre si la empresa está estructuralmente bien o en problemas.

**¿Puedo recibir alertas por email cuando acciones en mi cartera se vuelvan sobrevendidas?**
La funcionalidad de workflows programados (en diseño — ver el [doc de diseño de workflows](/blog)) lo soportará. Por ahora, el panel de RSI es bajo demanda: ábrelo cuando quieras el escaneo y obtienes el estado actual. Muchos usuarios revisan habitualmente el panel de RSI una vez por semana como parte de su rutina de revisión de cartera.
