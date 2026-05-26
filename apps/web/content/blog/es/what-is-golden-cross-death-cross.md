---
title: >-
  ¿Qué es el cruce dorado (y el cruce de la muerte)? La señal MA 50/200,
  explicada
description: >-
  Un cruce dorado es la MA de 50 días cruzando por encima de la MA de 200 días.
  Fórmula, tasas históricas de acierto, por qué el cruce solo está sobrevalorado
  y cómo usarlo bien.
publishedAt: 2026-05-25T00:00:00.000Z
updatedAt: 2026-05-25T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    El equipo de investigación de PickSkill — construyendo un analista IA para
    inversores particulares.
pillar: explainer
tags:
  - Cruce dorado
  - Cruce de la muerte
  - Media móvil
  - Análisis técnico
heroImage: /blog/what-is-golden-cross-death-cross/hero.png
heroAlt: >-
  Infografía editorial — la MM 50 cruza por encima de la MM 200; se destaca la
  variante underwater (la MM 200 aún con pendiente descendente).
---

**Un cruce dorado es el momento en que una media móvil de corto plazo (típicamente la de 50 días) cruza por encima de una media móvil de largo plazo (típicamente la de 200 días). Un cruce de la muerte es lo contrario — la MA corta cruzando por debajo de la larga.** A los medios financieros les encantan estos cruces porque dan grandes titulares. Los backtests muestran que la señal pura está más cerca de un cara o cruz de lo que los titulares admiten. El cruce se vuelve útil solo cuando entiendes qué versión estás viendo y en qué estado se encuentra la tendencia subyacente.

### Puntos clave

- **Definición estándar**: la SMA de 50 días cruza la SMA de 200 días en cierre diario. Algunas plataformas usan EMA(50) / EMA(200); la diferencia es pequeña.
- **La tasa histórica de acierto del cruce dorado es moderada, no mágica.** En el S&P 500 desde 1950, los cruces dorados han precedido retornos a 12 meses del ~10–12% — cerca de la media histórica del mercado. La asimetría viene de unos pocos grandes ganadores.
- **El cruce dorado "underwater" importa.** Cuando el cruce ocurre con la MA de 200 días todavía con pendiente negativa, la tendencia aún no ha cambiado — estás cogiendo la *primera señal* de un posible giro, no uno confirmado. PickSkill marca estos casos explícitamente con la señal *underwater golden cross*.
- **Los cruces de la muerte señalan cambio de régimen con más fiabilidad que los cruces dorados.** Los drawdowns posteriores a cruces de la muerte han promediado un ~6–10% antes de la recuperación; funcionan mejor como filtros risk-off que como disparadores de venta en corto.
- **Se renderiza en el panel de MA de [/indicators](/indicators)** para cada posición, con el historial de cruces y el estado underwater marcados explícitamente.

## ¿Cómo funciona mecánicamente el cruce dorado?

Dos medias móviles, dos pendientes, un punto de cruce.

| Componente | Fórmula | Significado |
|---|---|---|
| MA corta | `SMA(close, 50)` | ~2,5 meses de cierre — la tendencia de medio plazo |
| MA larga | `SMA(close, 200)` | ~10 meses de cierre — la tendencia de largo plazo |
| Cruce | El valor de la MA corta pasa de estar por debajo a estar por encima de la MA larga | "La tendencia media es ahora más fuerte que la tendencia larga" |

El cruce dorado ocurre en una barra específica — el día en que la corta cruza la larga desde abajo. Antes de esa barra, la corta estaba debajo; después, la corta está encima. El cruce es la discontinuidad; si se sostiene depende de lo que pase después.

La misma lógica aplica a otros pares de ventanas (20/60, 5/20 para horizontes más cortos), pero el 50/200 es de lejos el más observado porque responde la pregunta que les importa a las mesas institucionales de riesgo: "¿se ha vuelto positiva la imagen de medio plazo frente a la de largo plazo?".

## ¿Por qué importa el cruce (y por qué está sobrevalorado)?

El cruce importa porque dos mecanismos estructurales lo refuerzan:

1. **Las reglas sistemáticas de risk-on / risk-off lo usan.** Una parte no trivial de los fondos seguidores de tendencia y estrategias CTA operan con reglas simples de cruce de MAs. Cuando el S&P 500 cruza su MA de 200 días desde abajo, esos fondos reasignan a renta variable. El flujo es real y autocumplido el día del cruce — por eso el volumen suele dispararse en torno a cruces dorados de los índices principales.
2. **Los medios financieros lo amplifican.** Titulares como "el S&P 500 confirma cruce dorado" mueven flujo minorista. Funcione o no la señal, la atención desplaza capital marginal.

Está sobrevalorado porque el cruce puro tiene menos ventaja out-of-sample de lo que se cree:

- En índices de renta variable globales desde 1970, el retorno mediano a 12 meses tras un cruce dorado es aproximadamente igual al retorno incondicional a 12 meses del mismo índice. La media está sesgada al alza por un pequeño número de grandes ganadores, lo que significa que el resultado *típico* es poco notable.
- Los cruces son altamente dependientes del camino previo. Un cruce en el *fondo* de un drawdown profundo ("primer cruce tras un mercado bajista") tiene retornos forward materialmente mejores que un cruce durante una tendencia alcista larga. El titular "cruce dorado" trata ambos por igual.

Aquí es donde importa el calificador *underwater*.

## ¿Qué es un cruce dorado "underwater" — y por qué es la variante de mayor valor?

La propia SMA de 200 días tiene una pendiente. El cruce puede ocurrir en dos regímenes:

| Variante | Pendiente de la MA 200 en el cruce | Interpretación |
|---|---|---|
| **Cruce dorado underwater** | Pendiente **negativa** | La tendencia aún no ha girado; es la *primera señal* de que la tendencia bajista podría estar rompiéndose |
| **Cruce dorado estándar** | Pendiente **positiva** | La tendencia ya era alcista; es una señal de continuación tras un retroceso |

La versión underwater ha producido históricamente los retornos forward más fuertes — captura el cambio de régimen, no la continuación de régimen. También es la más rara de las dos: en los principales índices de EE. UU., los cruces dorados underwater ocurren aproximadamente 2–4 veces por década, típicamente al final de grandes drawdowns. Coger unos pocos de esos a lo largo de una carrera de 20 años vale más que reaccionar a cada cruce de continuación.

El panel *underwater golden cross* de PickSkill escanea todas las posiciones buscando este patrón específico — MA corta por encima de la MA larga, pero la MA larga todavía con pendiente negativa. Es un filtro deliberadamente estrecho que aflora el pequeño número de nombres que exhiben la variante de mayor ventaja.

## ¿Cómo se debe interpretar un cruce de la muerte?

Un cruce de la muerte es el evento simétrico: la SMA de 50 días cruza por debajo de la SMA de 200 días desde arriba. La interpretación estándar es "la tendencia de medio plazo se ha girado respecto a la de largo plazo".

Dos puntos prácticos que las guías minoristas subestiman:

- **Los cruces de la muerte tienden a llegar tarde, no temprano.** Cuando el cruce se imprime, el mercado a menudo ya ha caído un 15–25% desde su pico. Tratar el cruce de la muerte como una "señal de venta" en el momento del cruce es vender el suelo de una fase, no el techo.
- **Su uso de mayor valor es como filtro de riesgo en el lado largo, no como disparador de venta en corto.** "Si el S&P cierra por debajo de su SMA de 200 días, reduzco mi exposición solo-larga a 50%" es una regla defendible respaldada por décadas de datos de drawdown. "Vender en corto el S&P en un cruce de la muerte" tiene un perfil de riesgo/recompensa mucho peor por la dispersión de los retornos forward.

## Cuatro trampas al interpretar señales de cruce

1. **Tratar el cruce como binario.** El cruce es un momento; las tendencias son procesos. Un cruce seguido de una reversión inmediata de vuelta al otro lado de la línea ("cruce whipsaw") es común en mercados sin dirección y produce señales falsas consecutivas.
2. **Ignorar la pendiente de la MA larga.** Un cruce con la MA larga plana es mucho menos informativo que un cruce con la MA larga girando al alza. La combinación de *cruce más cambio de pendiente de la MA larga* es la configuración de mayor ventaja.
3. **Aplicar el cruce a valores individuales ruidosos.** El cruce 50/200 es más fiable en índices amplios y nombres de gran capitalización con tendencias suaves. En small caps con huecos frecuentes, el cruce se dispara repetidamente sin contenido informacional.
4. **Olvidar que el cruce es una señal derivada.** El cruce se construye a partir del precio; no puede decirte más de lo que ya está en el gráfico. La confirmación por volumen, la confirmación por amplitud (cuántos subcomponentes también están cruzando) y el contexto macro aportan información que el cruce solo no puede.

## Cómo se comportan los cruces en acciones A

El cruce SMA 50/200 está menos arraigado culturalmente en la comunidad minorista de acciones A que en EE. UU. La convención local enfatiza más el cruce 20/60, y el cruce diario 5/10 para swing trading. Dos efectos estructurales a tener en cuenta:

- **Los límites diarios de precio** crean patrones escalonados tanto en la SMA de 50 días como en la de 200 días durante movimientos desbocados. Las rachas de límite superior retrasan el cruce visible 1–3 barras respecto a un mercado de libre cotización. El cruce en sí sigue disparándose en el día correcto; las medias móviles solo van con retardo durante la fase de límite.
- **Rotación por reconstitución de índices.** Los índices de acciones A se reconstituyen de forma más agresiva que los índices de EE. UU. Un cruce en un índice de acciones A puede reflejar en parte un cambio en la composición del índice, no un cambio de tendencia de mercado — para señales de acciones individuales el cruce no se ve afectado, pero para el índice amplio conviene comprobar si una fecha de reconstitución está cerca.

Para la visión más amplia mercado a mercado, ver [Mejores indicadores para acciones A](/blog/best-indicators-for-a-shares) y [MACD en acciones A vs acciones estadounidenses](/blog/macd-on-a-shares-vs-us).

> **Síguelo en tu cartera.** La página [/indicators](/indicators) renderiza el estado del cruce 50/200 en cada posición, con el estado *underwater* marcado cuando la MA larga todavía tiene pendiente negativa. El registro de 5 días muestra cómo evolucionó el estado del cruce a lo largo de la semana de cotización.

## Cómo usar el cruce en un flujo real

El cruce es más útil como un input dentro de un filtro multi-señal, no como un disparador independiente. Un flujo práctico:

1. **Usa el cruce para definir régimen.** La asignación solo-larga está activa cuando el precio está por encima de la SMA de 200 días *y* la SMA de 50 días está por encima de la SMA de 200 días. Reduce o cubre cuando ambas condiciones fallan.
2. **Usa la variante *underwater* como disparador de watchlist.** Cuando un nombre individual imprime un cruce dorado underwater, ese nombre pasa de "ignorar" a "candidato a investigar". Confirma con trabajo fundamental antes de dimensionar la posición.
3. **Usa el cruce de la muerte como filtro de riesgo a nivel de cartera.** Pasa de exposición agresiva a defensiva cuando el índice amplio hace un cruce de la muerte; invierte cuando el índice recupera su SMA de 200 días e imprime un nuevo cruce dorado.

El cruce es un filtro para *cuándo mirar*, no un disparador para *qué hacer*. Combínalo con [MACD](/blog/what-is-macd) para confirmación de momentum, [RSI](/blog/what-is-rsi) para contexto de sobrecompra/sobreventa, y trabajo fundamental para dimensionar.

## Lecturas adicionales

- [Investopedia sobre el cruce dorado](https://www.investopedia.com/terms/g/goldencross.asp) — referencia completa con ejemplos históricos.
- [Meb Faber, *A Quantitative Approach to Tactical Asset Allocation*](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=962461) — el paper académico canónico que muestra que reglas simples de cruce de MA producen outperformance ajustada por riesgo en el tiempo.

## FAQ

**¿De verdad funciona el cruce dorado?**
El cruce 50/200 puro ha producido históricamente retornos forward a 12 meses aproximadamente en línea con el retorno incondicional del mercado — cerca de un cara o cruz por señal. La señal se vuelve significativamente positiva solo combinada con el estado *underwater* (MA larga todavía con pendiente negativa), confirmación por volumen y confirmación por amplitud. Trata el cruce como un disparador de watchlist y un filtro de régimen, no como un botón de compra.

**¿Es distinto un cruce 50/200 de un cruce 20/60?**
Sí — horizontes diferentes responden preguntas diferentes. El 50/200 (≈2,5 meses vs ≈10 meses) habla de régimen medio vs largo plazo; el 20/60 (≈1 mes vs ≈3 meses) habla de momentum corto vs medio plazo. El 20/60 produce señales más frecuentes pero menor ventaja por señal. La mayoría de los marcos institucionales de riesgo usan el 50/200; los swing traders vigilan el 20/60 o el 5/20.

**¿Cuál es la diferencia entre un cruce dorado y un cruce alcista de medias móviles?**
Los términos suelen usarse indistintamente, pero estrictamente: "cruce dorado" denota específicamente el cruce SMA 50/200 en gráfico de barras diarias. Cualquier otro par de ventanas (10/20, 20/60, 5/13) es un "cruce alcista de medias móviles" pero no el cruce dorado. La distinción importa sobre todo en titulares de medios financieros, que reservan "cruce dorado" para el evento 50/200.

**¿Por qué el cruce llega "tarde"?**
Ambos inputs son indicadores retardados. La SMA de 50 días refleja las últimas diez semanas de cierre; la de 200 días refleja los últimos diez meses. Cuando la corta cruza la larga, el precio subyacente normalmente lleva semanas moviéndose. El cruce es un evento de *confirmación*, no de *anticipación*. Si quieres señales más tempranas, necesitas indicadores adelantados (perfil de volumen, skew de opciones, divergencia de amplitud) — pero esos tienen sus propios problemas de falsos positivos.

**¿Puedo operar opciones sobre un cruce dorado?**
Puedes, pero la estructura es incómoda. El cruce es un evento de baja frecuencia (unas pocas veces al año en un único ticker, quizá semanal en una cartera de 50 nombres), y la volatilidad implícita en torno al cruce ya suele estar incorporando algún nivel de reconocimiento de la tendencia. Comprar calls *en el momento del cruce* a menudo paga una prima por el titular. La variante de mayor ventaja es posicionarse antes del cruce, usando la configuración *underwater* y una lectura sobrevendida de [RSI](/blog/what-is-rsi) como disparador de watchlist.
