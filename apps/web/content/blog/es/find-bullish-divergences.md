---
title: Cómo encontrar divergencias alcistas en una cartera en 30 segundos
description: >-
  El panel de divergencias de PickSkill escanea cada posición buscando los 4
  tipos de divergencia en MACD, RSI y KDJ — aflorando solo pivotes bien
  definidos. Flujo en 4 pasos.
publishedAt: 2026-05-25T00:00:00.000Z
updatedAt: 2026-05-25T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    El equipo de investigación de PickSkill — construyendo un analista IA para
    inversores particulares.
pillar: how-to
tags:
  - Tutorial
  - Divergencia
  - Análisis técnico
  - Workflow
  - Cartera
heroImage: /blog/find-bullish-divergences/hero.png
heroAlt: >-
  Infografía editorial — un panel de divergencias que lista los tickers con su
  tipo (regular/hidden bullish/bearish), acuerdo entre múltiples osciladores y
  frescura del pivote.
---

**Encontrar divergencia a mano es lento — dibujas pivotes en precio, dibujas pivotes correspondientes en MACD o RSI, comprueba si los dos discrepan y repite para cada nombre en tu cartera.** La mayoría de los inversores minoristas se rinden tras 3–5 nombres. El panel de divergencias de PickSkill ejecuta ese escaneo en cada posición en 30 segundos, aplica reglas de pivote confirmado (sin sesgo retrospectivo) y aflora solo los nombres donde el patrón está bien definido. Este tutorial recorre cómo usar el panel productivamente — no solo clicar a través, sino convertir el output en decisiones reales.

### Puntos clave

- **4 pasos, ~30 segundos.** Abre el panel de divergencias, escanea la lista activa, profundiza en candidatos, añade filtros adicionales antes de actuar.
- **El panel escanea 4 tipos de divergencia en 3 osciladores** — alcista / bajista regular y alcista / bajista oculta en [MACD](/blog/what-is-macd), [RSI](/blog/what-is-rsi) y [KDJ](/blog/what-is-kdj).
- **Solo cuentan los pivotes confirmados.** Un pivote necesita al menos N barras a cada lado que no lo superen — sin sesgo retrospectivo de dibujar líneas a toro pasado.
- **La divergencia multi-oscilador es la variante de mayor ventaja.** Cuando la misma divergencia aparece en dos de tres osciladores, la señal es materialmente más fiable que la divergencia en uno solo.
- **La divergencia oculta se trata como señal de primera clase** — la mayoría de las plataformas minoristas la entierran; PickSkill la aflora explícitamente.

## Por qué importa este flujo

La divergencia es una de las herramientas más sobreprometidas del análisis técnico. Las guías minoristas afirman rutinariamente 70%+ de precisión; los backtests sobre divergencia pura se sitúan más cerca del 35–45%. La brecha es el filtrado — la divergencia es una *condición*, no una *señal*, y solo se vuelve fiable cuando se combina con filtros de tendencia y eventos de confirmación.

El flujo basado en panel hace el filtrado práctico. Sin una herramienta que aflore todas las divergencias en todas las posiciones simultáneamente, no puedes aplicar el filtro multi-oscilador (que requiere comprobar tres osciladores en cada nombre). Con la herramienta, el filtro toma un clic. La economía del filtrado por capas se invierte a tu favor.

Para el concepto subyacente, ver [¿Qué es la divergencia?](/blog/what-is-divergence).

## El flujo de 4 pasos

### Paso 1 — Abre el panel de divergencias

Ve a [/indicators](/indicators) y selecciona la dimensión de divergencia. El panel escanea cada posición en tu cartera por defecto sobre los cuatro tipos de divergencia en MACD, RSI y KDJ.

El output es una tabla ordenable:

| Columna | Significado |
|---|---|
| Ticker | La posición |
| Tipo | Alcista regular / bajista regular / alcista oculta / bajista oculta |
| Oscilador(es) | Qué indicador(es) muestran la divergencia — MACD, RSI, KDJ o alguna combinación |
| Antigüedad del pivote | Cuántas barras atrás se formó el segundo pivote (más nuevo = señal más fresca) |
| Fuerza | Magnitud del desacuerdo (mayor = señal más fuerte) |
| Régimen de tendencia | Lectura de [ADX](/blog/what-is-adx) en el momento de la divergencia — la divergencia en mercados tendenciales es más fiable |

El orden por defecto es por *fuerza combinada × frescura × acuerdo multi-oscilador*. Las señales más fuertes aparecen arriba.

### Paso 2 — Escanea los patrones de alta convicción

Tres patrones específicos a buscar, en orden de ventaja:

1. **Alcista regular multi-oscilador en nombres sobrevendidos.** Divergencia alcista regular en dos de tres osciladores (p. ej. MACD + RSI), en un nombre donde RSI está por debajo de 35 o KDJ está por debajo de 25, en un régimen de mercado con ADX por encima de 25. Esta combinación ha entregado históricamente los retornos forward más fuertes de cualquier patrón de divergencia.
2. **Alcista oculta en tendencias alcistas confirmadas.** Divergencia alcista oculta en un nombre que está por encima de su SMA de 200 días con la de 200 días todavía con pendiente positiva. El patrón alcista oculto captura la reanudación de tendencia tras un retroceso — estadísticamente más fiable que cazar reversiones.
3. **Bajista regular multi-oscilador en nombres sobrecomprados.** El espejo del patrón 1, usado para gestión de riesgo (recortar exposición larga) en lugar de para vender en corto. Detectar una divergencia bajista temprano en tus propias posiciones es uno de los usos de mayor apalancamiento del panel.

Salta:

- **Divergencia de un solo oscilador en nombres con [ADX](/blog/what-is-adx) por debajo de 20.** Los mercados laterales generan divergencias continuas de baja calidad. El panel las aflora; ignóralas.
- **Divergencia con antigüedad de pivote > 10 barras.** Los pivotes antiguos ya están descontados. Las señales de divergencia decaen rápido — las señales frescas (antigüedad de pivote 1–5 barras) son donde se sitúa el alpha.

### Paso 3 — Profundiza en el candidato

Haz clic en un nombre en el panel para abrir el detalle de indicadores por posición. Deberías verificar:

1. **Los pivotes son reales.** Mira el gráfico y confirma los dos pivotes en precio y los dos pivotes correspondientes en el oscilador. La detección de pivotes de PickSkill está automatizada, pero el chequeo visual capta casos límite (días con hueco, barras de límite superior en acciones A, picos del día de resultados).
2. **El régimen de tendencia es correcto.** [ADX](/blog/what-is-adx) por encima de 25, pila de MA alineada, nivel de [soporte / resistencia](/blog/what-is-support-resistance) cercano. Divergencia en un nivel de soporte importante es materialmente más fuerte que divergencia en mitad de un rango.
3. **El volumen confirma.** [Flujo de capitales](/blog/what-is-capital-flow) tendiendo al alza mientras el precio se mueve lateral es el telón de fondo correcto para divergencia alcista; flujo tendiendo a la baja sobre máximos de precio es el telón de fondo correcto para divergencia bajista.

Estos chequeos toman ~30 segundos por candidato. Después de ellos, la tasa de falsos positivos cae sustancialmente.

### Paso 4 — Añade un filtro más antes de actuar

Una divergencia es un *disparador de watchlist*, no un disparador de entrada. Espera un evento de confirmación antes de dimensionar:

- **Divergencia alcista**: espera a que la línea MACD cruce por encima de la línea de señal, o RSI cruce 50 desde abajo, o el precio rompa por encima de un máximo de swing reciente.
- **Divergencia bajista**: espera a que la línea MACD cruce por debajo de la línea de señal, o RSI cruce 50 desde arriba, o el precio rompa por debajo de un mínimo de swing reciente.

El evento de confirmación te dice *cuándo* está empezando el movimiento. Sin él, estás comprando o vendiendo en una condición que puede persistir semanas.

> **Pruébalo ahora.** [Abre /indicators](/indicators) y selecciona la vista de divergencia. Incluso en una cartera de 5 posiciones probablemente verás al menos una divergencia activa por semana — el volumen de oportunidad es mayor de lo que la mayoría de los inversores minoristas se da cuenta una vez que el escaneo está automatizado.

## Lo que el panel capta y el escaneo a mano se pierde

Tres patrones específicos se benefician dramáticamente de la automatización:

### 1. Divergencia oculta

La mayoría de las plataformas minoristas de gráficos entierran la divergencia oculta — la inversión de pivotes es más difícil de detectar a ojo, y la mayoría de las guías de AT se centran en la divergencia regular. PickSkill trata la divergencia oculta como una señal de primera clase, aflorada con la misma prominencia que la divergencia regular. Dado que la divergencia oculta tiene el mejor track record empírico para continuación de tendencia, esta es la variante a la que deberías prestar *más* atención, no menos.

### 2. Acuerdo multi-oscilador

El escaneo a mano rara vez capta divergencia en dos osciladores simultáneamente — tendrías que comprobar MACD, luego RSI, luego KDJ en cada nombre, y la sobrecarga cognitiva significa que paras en la primera divergencia que ves. El panel aflora la divergencia multi-oscilador como una fila distinta, así que la variante de mayor ventaja es visible de un vistazo.

### 3. Barrido entre carteras

El escaneo a mano funciona para 1–3 nombres. El panel de PickSkill escanea tu cartera entera (y si lo pides, todas tus watchlists) en la misma vista. El barrido capta señales en nombres que no habrías pensado comprobar — las oportunidades que encuentras en nombres que ya habías dado por perdidos.

## Cuatro trampas al usar el panel de divergencias

1. **Tratar la divergencia como botón de compra / venta.** Es una condición. Siempre espera un evento de confirmación (cruce de [MACD](/blog/what-is-macd), salida de [RSI](/blog/what-is-rsi) de extremo, ruptura de nivel) antes de dimensionar.
2. **Actuar sobre cada divergencia que el panel aflora.** El panel aflora intencionalmente todos los candidatos incluyendo los débiles. Filtra por régimen de tendencia (ADX > 25), acuerdo multi-oscilador, pivotes frescos y confirmación de sobreventa / sobrecompra antes de actuar.
3. **Aguantar a través de invalidación.** Las operaciones de divergencia tienen niveles específicos de invalidación — si el precio rompe el mínimo de swing que definió el pivote de divergencia alcista, la operación está equivocada. Honra la invalidación; no promedies a la baja.
4. **Olvidar el dimensionamiento.** Incluso las divergencias de alta convicción fallan en tasas significativas. Dimensiona posiciones para sobrevivir los casos de fallo — nunca dimensiones como si la divergencia fuera una certeza.

## Cómo se comporta la divergencia en acciones A

El panel maneja la microestructura de acciones A específicamente:

- **Los días de límite superior / inferior** se marcan como outliers y se excluyen de la detección de pivotes. Sin este filtro, el precio límite se convierte en un pivote artificial que produce divergencia falsa.
- **Las suspensiones** crean huecos en los datos; los pivotes que abarcan una suspensión se marcan como sospechosos y se afloran con una advertencia.
- **Mayor suelo de ruido**: las acciones A cotizan con volatilidad diaria materialmente mayor. El panel usa una ventana mayor de detección de pivotes (N=5 vs N=3 en barras diarias de EE. UU.) para nombres de acciones A para filtrar micro-movimientos.

Para más sobre el manejo mercado a mercado, ver [Mejores indicadores para acciones A](/blog/best-indicators-for-a-shares).

## Flujos de seguimiento habituales

Una vez tienes un candidato del panel de divergencias, estos son los siguientes movimientos naturales:

- *"Muéstrame la misma detección de divergencia en mi watchlist completa, no solo en la cartera actual."*
- *"Filtra las divergencias activas solo a aquellas con ADX por encima de 25 y la MA de 200 días con pendiente positiva."*
- *"Hace backtest de este patrón de divergencia — ¿cuál es la tasa histórica de acierto en este ticker específico durante los últimos 5 años?"*
- *"Genera un plan de entrada para el candidato top de divergencia — precio de entrada, nivel de stop, objetivo, tamaño de posición."*
- *"Haz una watchlist de cada posición que lleve en divergencia activa más de 5 días sin resolución — estas son las configuraciones más enrolladas."*

## Lecturas adicionales

- [¿Qué es la divergencia?](/blog/what-is-divergence) — el concepto subyacente y los cuatro tipos.
- [El filtro de 3 indicadores](/blog/three-indicator-filter) — combinar divergencia con [ADX](/blog/what-is-adx) y confirmación de momentum.
- [Constance Brown, *Technical Analysis for the Trading Professional*](https://www.amazon.com/dp/0071596666) — referencia práctica sobre patrones de divergencia.

## FAQ

**¿Con qué frecuencia aflorará el panel una divergencia?**
En una cartera de 10 posiciones, verás 2–5 divergencias activas en una semana típica. La divergencia multi-oscilador (la variante de mayor ventaja) es más rara — quizá una por semana por cada 10 posiciones. La divergencia oculta aparece más a menudo en mercados claramente tendenciales y menos en mercados laterales.

**¿Debería tomar cada divergencia como operación?**
No. El panel aflora *candidatos*; el filtrado ocurre después. Aplica régimen de tendencia, acuerdo multi-oscilador, pivotes frescos y eventos de confirmación antes de actuar. El filtrado reduce el número de operaciones en un 60–80% pero eleva sustancialmente la ventaja por operación.

**¿Cuál es la diferencia entre divergencia regular y oculta?**
La divergencia regular es un aviso de reversión (el precio hace un nuevo extremo; el indicador no). La divergencia oculta es una señal de continuación (el precio hace un mínimo más alto en una tendencia alcista; el indicador hace un mínimo más bajo). Los dos patrones son matemáticamente simétricos pero tienen implicaciones opuestas. La divergencia oculta tiene el mejor track record empírico en mercados tendenciales.

**¿Por qué el panel a veces muestra divergencia en nombres que no se mueven?**
La divergencia es una *condición*, no una garantía de movimiento. Muchas divergencias se resuelven vía deriva lenta en lugar de reversión aguda. El panel aflora la condición; si el movimiento se materializa depende de que llegue el evento de confirmación. Por eso la disciplina de esperar la confirmación importa más que la disciplina de detectar la divergencia.

**¿Puedo recibir alertas por email cuando se forma una nueva divergencia en mi cartera?**
La funcionalidad de workflows programados (en diseño, ver el [documento de diseño de workflows](/blog)) soportará esto — escaneos diarios u horarios que te envíen por email cuando aparezcan nuevas divergencias. Por ahora, el panel es bajo demanda: ábrelo cuando quieras el escaneo y obtienes el estado actual.
