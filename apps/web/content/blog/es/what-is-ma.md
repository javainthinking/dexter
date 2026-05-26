---
title: '¿Qué es la media móvil? SMA, EMA y el filtro de tendencia que todos usan'
description: >-
  Una media móvil es la media móvil del precio de cierre en N barras. Fórmula,
  por qué 20/60/200 son las ventanas estándar y cuatro trampas en las que cae el
  inversor minorista.
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
  - Media móvil
  - Análisis técnico
  - Indicadores
  - Tendencia
heroImage: /blog/what-is-ma/hero.png
heroAlt: >-
  Infografía editorial — tres medias móviles (20/60/200) trazadas sobre una
  línea de precios, con un punto de cruce destacado en el cambio de tendencia.
---

**Una media móvil (MA) es la media aritmética del precio de cierre durante las últimas N barras, recalculada en cada barra nueva.** Es la base de todo indicador seguidor de tendencia — [MACD](/blog/what-is-macd), [Bandas de Bollinger](/blog/what-is-bollinger-bands), la nube Ichimoku, cruces dorado y de la muerte — todos se construyen a partir de una o más medias móviles. La mayoría de guías para minoristas las trata como señales independientes. No lo son. Las MAs son filtros; responden a "¿hay una tendencia?" para que otras herramientas respondan "¿qué hacer al respecto?".

### Puntos clave

- **Dominan dos variantes**: SMA (simple — cada barra pesa igual) y EMA (exponencial — las barras recientes pesan más). MACD usa EMA; el "filtro de tendencia" de 200 días es casi siempre SMA.
- **Tres ventanas hacen el 90% del trabajo**: 20 periodos (corto plazo), 60 periodos (medio), 200 periodos (largo plazo). En barras diarias eso equivale a ~1 mes, ~3 meses, ~10 meses.
- **El cruce entre dos MAs es la señal más citada del análisis técnico.** Precio por encima de la MA = tendencia alcista; precio por debajo = tendencia bajista. Una MA corta cruzando una MA larga = el [cruce dorado / de la muerte](/blog/what-is-golden-cross-death-cross).
- **Las MAs son retardadas por construcción.** Una SMA de 200 días refleja diez meses de precio; no girará hasta que la tendencia subyacente lleve semanas moviéndose. Ese retardo es una virtud cuando usas MAs como filtros, un defecto cuando las usas como disparadores.
- **Se renderiza en cada panel de indicadores de PickSkill** — la página [/indicators](/indicators) dibuja la pila 20/60/200 en cada gráfico para que el régimen de tendencia sea visible sin salir de la vista de cartera.

## ¿Cómo se calcula una media móvil?

La media móvil simple de N barras es la media aritmética:

```
SMA(N) = (close[t] + close[t-1] + ... + close[t-N+1]) / N
```

Cada barra dentro de la ventana pesa lo mismo. Una SMA de 20 días en un cierre del viernes usa los últimos 20 cierres de día hábil (es decir, ~4 semanas naturales); el lunes deja caer el día más antiguo y suma el nuevo.

La media móvil exponencial pondera más las barras recientes:

```
EMA(N)[t] = α × close[t] + (1 − α) × EMA(N)[t−1]
            donde α = 2 / (N + 1)
```

Para N = 20, α ≈ 0,0952 — el cierre de hoy recibe ~9,5% de peso, y la EMA de ayer carga con el resto. La EMA reacciona ~1–3 barras más rápido que la SMA de la misma longitud, razón por la que aparece dentro de [MACD](/blog/what-is-macd) (donde importa la reactividad) pero no como el filtro de tendencia de 200 días (donde importa la estabilidad).

| Ventana | Significado en barras diarias | Uso típico |
|---|---|---|
| **5 periodos** | Una semana de cotización | Intradía o swing trading; rara vez se usa sola |
| **20 periodos** | Un mes de cotización | Tendencia de corto plazo; banda central de Bollinger |
| **60 periodos** | Un trimestre de cotización | Régimen de medio plazo |
| **200 periodos** | ~10 meses de cotización | El filtro institucional "¿el mercado sube o baja?" |

## ¿Qué te dice realmente la relación precio-MA?

Tres estados, tres significados:

1. **Precio por encima de la MA, MA con pendiente positiva.** Tendencia alcista confirmada. Los retrocesos hacia la MA tienden a encontrar soporte. Es cuando las señales de momentum (cruce dorado de MACD, rupturas de RSI) tienen su mayor tasa de acierto.
2. **Precio oscilando alrededor de una MA plana.** Mercado lateral, sin dirección. Cada cruce de la MA es una falsa señal en potencia. [ADX](/blog/what-is-adx) por debajo de 20 confirma este régimen — desactiva cualquier seguidor de tendencia hasta que ADX suba.
3. **Precio por debajo de la MA, MA con pendiente negativa.** Tendencia bajista confirmada. Los rebotes hacia la MA tienden a fallar. El minorista solo-largo debería respetar este estado y apartarse; la MA te está diciendo que el camino de menor resistencia es bajar.

El test institucional estándar de "¿la tendencia es alcista?": **¿está el cierre por encima de la SMA de 200 días y la propia SMA de 200 días tiene pendiente positiva?** Dos síes = tendencia alcista. Un sí / un no = candidato a reversión temprana. Dos noes = tendencia bajista. Este único chequeo filtra aproximadamente la mitad de los falsos positivos que producen los indicadores de corto plazo.

## ¿Por qué 20, 60 y 200?

No son números mágicos — son números *consensuados*. Varias décadas de convención de los traders los han convertido en las ventanas de facto que cualquier asistente de IA, plataforma de gráficos o herramienta de bróker trae por defecto. Dos consecuencias prácticas:

- **Valor de coordinación.** Como todos miran la de 200 días, la de 200 días importa. Cuando el precio cierra por debajo de la SMA de 200 días en un índice mayor, se disparan disparadores algorítmicos de risk-off en los fondos sistemáticos. El nivel se autorefuerza.
- **Estabilidad en backtests.** Optimizar el periodo sobre un único instrumento produce rutinariamente ventanas de 17 o 43 periodos que se ven mejor in-sample y rinden peor out-of-sample. Ceñirse a las ventanas estándar evita sobreajustar tu ojo al ruido.

Usa las ventanas estándar. Muévete solo cuando tengas evidencia de backtest para un mercado o instrumento específico que difiera de forma sistemática.

## Cuatro trampas en las que cae el lector minorista

1. **Operar el cruce de MAs como señal independiente.** Un cruce 20/60 tiene poca ventaja en aislamiento — las tasas de acierto históricas rondan la tasa de ganancia de largo plazo de la renta variable (la "señal" es simplemente la deriva del mercado). Solo se vuelve útil combinado con un filtro de tendencia y un oscilador de confirmación. Ver [el filtro de 3 indicadores](/blog/three-indicator-filter).
2. **Elegir la ventana que ajustó los últimos seis meses.** Blogs minoristas que recomiendan 13 / 34 / 89 (números de Fibonacci) u otras pilas exóticas suelen estar ajustando ruido. Quédate con 20 / 60 / 200 a menos que puedas demostrar evidencia out-of-sample.
3. **Ignorar la pendiente de la MA.** Una SMA de 200 días plana es un régimen distinto a una SMA de 200 días con pendiente positiva, aunque el precio esté por encima de la MA en ambos casos. La dirección de la pendiente es la mitad de la información.
4. **Aplicar SMA a valores muy volátiles o poco líquidos.** Cierres atípicos aislados (huecos al alza por resultados, días de límite superior en acciones A) mueven la SMA de forma desproporcionada y producen un sesgo falso durante las siguientes 20 barras. La EMA es más robusta a los outliers; para valores de baja liquidez, prefiere EMA o usa un filtro de mediana.

## Cómo se comportan las medias móviles en acciones A

La matemática es idéntica, pero la microestructura del mercado de acciones A cambia qué MAs funcionan:

- **Límites diarios de precio (±10% en el mercado principal, ±20% en ChiNext / STAR, ±5% en acciones ST).** Días consecutivos de límite superior crean una escalera en la SMA que sobreestima la fuerza de la tendencia durante ~5 barras. El límite inferior produce el efecto opuesto. Los paneles de PickSkill marcan las barras de límite como neutrales en el [registro de señales de 5 días](/blog/5-day-signal-trail) para que una racha de días en límite no produzca una falsa categoría de tendencia fuerte.
- **Suspensiones (停牌)** pueden durar días o semanas. La mayoría de los feeds de datos rellenan el hueco de la suspensión con el cierre anterior, congelando la MA. Cuando la acción reanuda, la SMA efectivamente reinicia; las señales de tendencia previas a la suspensión deben tratarse como obsoletas.
- **Mayor peso de la convención MA10 / MA20.** La comunidad minorista de acciones A vigila la MA de 10 días más de cerca que la comunidad estadounidense. Muchas plataformas locales traen por defecto una pila 5 / 10 / 20 / 60; la SMA de 200 días está menos arraigada culturalmente. La MA de 60 días funciona como filtro de medio plazo en la práctica.

Para una comparación mercado a mercado de cómo se comporta cada indicador de forma distinta entre acciones estadounidenses y acciones A, ver [MACD en acciones A vs acciones estadounidenses](/blog/macd-on-a-shares-vs-us).

> **Míralo en tu cartera.** La página [/indicators](/indicators) renderiza la pila de MA 20 / 60 / 200 en cada posición con el estado más reciente del cruce y el registro de régimen de tendencia de los últimos 5 días.

## Cómo se combinan las MAs con otros indicadores

Las MAs son la *capa filtro*; los osciladores de momentum son la *capa disparador*. La combinación que supera consistentemente a cualquiera por separado:

| Capa | Herramienta | Pregunta que responde |
|---|---|---|
| **Filtro de tendencia** | Precio vs SMA 200 días + pendiente | ¿Hay tendencia? ¿En qué dirección? |
| **Fuerza de tendencia** | [ADX](/blog/what-is-adx) | ¿Es la tendencia lo bastante fuerte para operarla? |
| **Disparador de momentum** | Cruce de [MACD](/blog/what-is-macd), extremo de [RSI](/blog/what-is-rsi) | ¿Cuándo actuar? |
| **Sobre de volatilidad** | [Bandas de Bollinger](/blog/what-is-bollinger-bands) | ¿Hasta dónde es demasiado lejos? |

La pila de MAs responde a la primera pregunta gratis, todos los días. Sin ella, todos los demás indicadores del gráfico están operando a ciegas.

## Lecturas adicionales

- [Media móvil en Investopedia](https://www.investopedia.com/terms/m/movingaverage.asp) — referencia completa que cubre SMA, EMA, WMA y variantes adaptativas.
- [*Technical Analysis* de Jack Schwager](https://www.amazon.com/dp/0470121351) — el capítulo 6 sobre sistemas de media móvil sigue siendo la referencia para profesionales.
- [Currículo del CFA Institute sobre indicadores de tendencia](https://www.cfainstitute.org/) — para el tratamiento financiero formal.

## FAQ

**¿Debería usar SMA o EMA?**
Usa SMA para filtros de tendencia de ventana larga (200 días) — la estabilidad importa más que la reactividad y los cierres atípicos tienen menos probabilidad de sesgar un promedio largo. Usa EMA para herramientas de momentum de ventana corta (las 12 / 26 dentro de MACD o cualquier sistema de 5–20 periodos) — la reactividad importa y la ponderación exponencial de la EMA sigue mejor los precios recientes. No agonices sobre la elección para ventanas medias; la diferencia en 60 periodos es lo bastante pequeña como para perderse en el ruido del mercado.

**¿Por qué se vigila tanto la MA de 200 días?**
Dos razones: coordinación institucional (los fondos sistemáticos la usan como disparador risk-off, así que tiene momentum auto-cumplido en el nivel) y décadas de investigación empírica (Bauer & Dahlquist, Faber y otros han mostrado que mantenerse largo por encima de la MA de 200 días y pasarse a efectivo por debajo produce retornos cercanos a comprar y mantener con drawdown materialmente menor). El nivel importa porque el mercado actúa como si importara.

**¿Puedo optimizar la ventana de la MA para mi acción favorita?**
Puedes, pero probablemente no deberías. La optimización de ventana encuentra fiablemente combinaciones que se ven geniales en el periodo in-sample y fallan los siguientes 12 meses. Quédate con las ventanas estándar (20 / 60 / 200) salvo que tengas una razón estructural específica — una acción con liquidez anormalmente alta o baja, un instrumento con un ciclo estacional claro — para apartarte. Si optimizas, reserva el 30% más reciente de tus datos y exige que la ventana optimizada supere a las ventanas por defecto en el periodo out-of-sample.

**¿Es la media móvil un indicador adelantado o retardado?**
Retardado — por construcción. Cada término de la fórmula de la MA se construye a partir de cierres pasados; no hay pronóstico ahí dentro. Por eso las MAs son más útiles como filtros (estado del mundo) que como disparadores (cuándo actuar). La MA te dice que la tendencia existe; necesitas una herramienta separada para temporizar la entrada.

**¿Por qué mi gráfico muestra un valor de MA distinto al de otra plataforma?**
Tres razones habituales: (1) diferentes definiciones de ventana (5 días hábiles vs 5 días naturales), (2) diferentes puntos de partida para la inicialización de la EMA (algunas plataformas siembran desde el primer cierre disponible, otras desde una SMA de las primeras N barras), (3) distinto tratamiento de las sesiones after-hours / límite / suspensión. Por consistencia, los [paneles de PickSkill](/indicators) usan ventanas de días hábiles con EMAs sembradas por SMA y excluyen barras suspendidas del promedio — la misma convención usada en backtests académicos.
