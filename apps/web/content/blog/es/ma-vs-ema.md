---
title: SMA vs EMA — ¿Qué media móvil deberías usar?
description: >-
  SMA pondera cada barra por igual; EMA pondera más las barras recientes.
  Comparativa lado a lado, cuándo gana cada una y por qué la SMA de 200 días
  importa más que su prima EMA.
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
  - SMA
  - EMA
  - Media móvil
  - Análisis técnico
  - Comparativa
heroImage: /blog/ma-vs-ema/hero.png
heroAlt: >-
  Infografía editorial — línea de precio con SMA(20) y EMA(20) superpuestas,
  mostrando cómo la EMA sigue al precio más de cerca que la SMA más lenta.
---

**La SMA (media móvil simple) es la media aritmética del precio de cierre en N barras — cada barra pesa igual. La EMA (media móvil exponencial) aplica un peso que decae exponencialmente, así que las barras recientes importan más.** La diferencia matemática es pequeña. La diferencia práctica — cuál reacciona más rápido, cuál es más estable y alrededor de cuál se coordinan las instituciones — impulsa la mayoría de la elección editorial. Hay respuestas correctas e incorrectas según lo que intentes hacer.

### Puntos clave

- **SMA reacciona más lento; EMA reacciona más rápido.** Esa única propiedad explica el 80% de cuándo usar cada una.
- **EMA es la elección correcta dentro de herramientas de momentum** ([MACD](/blog/what-is-macd) usa EMA(12) y EMA(26)) — la reactividad importa en esos contextos.
- **SMA es la elección correcta para filtros de tendencia.** La SMA de 200 días es la referencia institucional; la EMA de 200 días existe pero casi nadie la mira.
- **La diferencia se reduce al crecer la ventana.** En 200 barras, los valores de SMA y EMA típicamente se sitúan a 1–2% el uno del otro.
- **Ambas se renderizan en los paneles de [/indicators](/indicators) de PickSkill** — las tarjetas de MA por defecto usan SMA para la de 200 días, EMA para las 12 / 26 dentro de MACD y SMA para la pila 20 / 60.

## Las dos fórmulas, lado a lado

### Media Móvil Simple (SMA)

```
SMA(N) = (close[t] + close[t-1] + ... + close[t-N+1]) / N
```

Cada barra en la ventana recibe peso 1/N. En el día t+1 la barra más antigua sale y entra la nueva barra. La influencia de cada barra es binaria: está en la ventana o no.

### Media Móvil Exponencial (EMA)

```
EMA(N)[t] = α × close[t] + (1 − α) × EMA(N)[t−1]
            donde α = 2 / (N + 1)
```

El cierre de hoy recibe peso α; la EMA de ayer carga con el resto. La forma recursiva significa que *toda* barra anterior contribuye, con peso decayendo exponencialmente. Para N = 20, la barra más reciente recibe ~9,5% de peso; la de hace 10 días recibe ~3,7%; la de hace 50 días recibe ~0,4%.

Para un tratamiento más completo de ambas, ver [¿Qué es una media móvil?](/blog/what-is-ma).

## Comparativa lado a lado

| Propiedad | SMA | EMA |
|---|---|---|
| **Ponderación** | Igual en toda la ventana | Decaimiento exponencial |
| **Retardo** | Alto — retardo total de N/2 barras en datos tendenciales | Menor — retardo efectivo de ~N/3 barras |
| **Reacción a precios recientes** | Más lenta | Más rápida |
| **Efecto de barras atípicas** | Un único outlier sesga la SMA exactamente N barras, luego desaparece | La influencia del outlier decae suavemente para siempre |
| **Comportamiento en el borde de la ventana** | Caída brusca cuando la barra antigua sale de la ventana (el "efecto de caída") | Suave — sin caídas discretas |
| **Más usada por defecto para** | Filtros de tendencia (200 días), banda central de Bollinger | Herramientas de momentum (MACD 12 / 26) |
| **Coordinación institucional** | Alta — la SMA de 200 días es la referencia universal | Menor — solo dentro de herramientas específicas |
| **Coste computacional** | Mayor (suma de ventana en cada barra) | Menor (una multiplicación y suma) |

El efecto de caída merece una pausa. Imagina una SMA de 20 días donde hace 20 barras el cierre fue de 80 USD y hoy la misma acción está en 100 USD. Cuando llegue mañana y la barra de 80 USD salga de la ventana, la SMA salta incluso si el cierre de hoy es plano — porque el promedio dejó caer un número bajo del cálculo. La SMA puede desplazarse discretamente sin información nueva. La EMA no tiene este artefacto; la influencia de la barra de 80 USD decae continua y suavemente.

## ¿Cuál reacciona más rápido?

EMA reacciona más rápido — por construcción. Para el mismo periodo N, el retardo efectivo de la EMA es aproximadamente N/3 barras mientras que el de la SMA es N/2 barras.

En un movimiento de precio agudo, la EMA girará 1–3 barras antes que la SMA de la misma longitud en gráficos diarios. En una tendencia sostenida, la EMA sigue más cerca del precio actual mientras la SMA sigue el medio de la tendencia. En un avance lento, la diferencia es pequeña.

La reacción más rápida es *toda la razón* por la que existe la EMA. También es la razón por la que la EMA produce más señales falsas — cada sensibilidad adicional viene con ruido adicional. El trade-off reactividad-vs-estabilidad es la decisión de diseño que hizo el desarrollador de cada herramienta:

- [MACD](/blog/what-is-macd) usa EMA porque las herramientas de momentum necesitan reactividad.
- La SMA de 200 días perdura porque el filtro institucional de riesgo quiere estabilidad.
- La banda central de Bollinger es SMA(20) porque la interpretación estadística de las bandas (sobre de desviación estándar) es más limpia alrededor de una media simple.

## ¿Cuándo gana SMA?

Tres contextos donde importa la ventaja de estabilidad de la SMA:

1. **Filtros de tendencia de ventana larga.** La SMA de 200 días es la referencia universal para régimen de tendencia — la coordinación institucional en este nivel específico es todo el sentido. Cambiar a una EMA de 200 días descarta la ventaja de coordinación sin ganancia informativa real. Quédate con SMA.
2. **Construcción de sobres estadísticos.** Las bandas de Bollinger usan SMA(20) como banda central porque el sobre de ±2 desviaciones estándar tiene una interpretación estadística limpia alrededor de una media aritmética. Alrededor de una EMA la interpretación se enturbia.
3. **Robustez a outliers en nombres de baja liquidez.** Una small cap poco líquida con un día de hueco por resultados verá su EMA sesgada durante semanas (porque la influencia del outlier nunca decae completamente en la EMA). La SMA deja caer el outlier completamente tras N barras — comportamiento más limpio para instrumentos de baja liquidez.

## ¿Cuándo gana EMA?

Tres contextos donde importa la ventaja de reactividad de la EMA:

1. **Dentro de herramientas de momentum.** [MACD](/blog/what-is-macd) (EMA(12) − EMA(26), suavizado por EMA(9)) es el ejemplo clásico. Todo el sentido de MACD es capturar cambios de momentum; el retardo de la SMA dejaría las señales de cruce demasiado tardías para ser útiles.
2. **Sistemas de swing de ventana corta.** Traders activos que ejecutan sistemas de cruce de MA de ventana corta (5/10, 10/20) típicamente prefieren EMA — los giros más rápidos capturan pivotes de swing que SMA pierde.
3. **Seguimiento de alta frecuencia de acciones de movimiento rápido.** Para una acción haciendo movimientos direccionales rápidos (tendencias alcistas parabólicas, reversiones agudas), el decaimiento continuo de la EMA produce un seguimiento más suave que las caídas discretas de la SMA.

## ¿Y qué hay de WMA, HMA y otras variantes?

Más allá de SMA y EMA, existen docenas de variantes de media móvil:

| Variante | Esquema de ponderación | Nota |
|---|---|---|
| **WMA** (Weighted MA) | Decaimiento lineal en N barras | Entre SMA y EMA en reactividad |
| **HMA** (Hull MA) | Adaptativa — combina WMAs de longitudes distintas | Retardo muy bajo; popular entre traders activos, menos arraigada culturalmente |
| **TEMA / DEMA** | Suavizado exponencial triple / doble | Diseñadas para reducir el retardo de EMA aún más; mejora modesta |
| **VWMA** (Volume-Weighted MA) | Pondera cada barra por su volumen | Incorpora participación; útil para nombres de baja liquidez |
| **KAMA** (Kaufman Adaptive MA) | La longitud se adapta a la volatilidad del mercado | Más suave en mercados sin dirección, más rápida en tendencias; matemáticamente elegante, ventaja práctica modesta |

Para la mayoría de los casos de uso minoristas, SMA y EMA cubren el campo. Las variantes exóticas ofrecen mejoras marginales en escenarios específicos pero sacrifican coordinación institucional (nadie más está mirando tu línea KAMA) por ventaja teórica. Quédate con SMA y EMA salvo que tengas evidencia específica de backtest que justifique una variante.

## Cuatro trampas al elegir entre SMA y EMA

1. **Mezclar las dos en una sola señal sin pensar.** Una "EMA de 20 días cruzando SMA de 50 días" es una señal matemáticamente válida — pero la comparación es manzanas con naranjas (distintas características de retardo) y el resultado es más difícil de interpretar. Elige una familia y mantente consistente dentro de un sistema.
2. **Cambiar a EMA porque los backtests se ven mejor.** La reactividad más rápida de EMA produce *más* señales; algunas de esas señales adicionales son correctas (y elevan la curva de equity) y otras son falsas (y añaden drawdowns). El ajuste por backtest típicamente descubre EMA en datos que casualmente favorecen reactividad sobre estabilidad. Fuera de muestra, el efecto a menudo desaparece.
3. **Tratar la propiedad de "sin caída" de EMA como universalmente mejor.** El efecto de caída a veces es informativo — un cambio brusco de SMA cuando un outlier antiguo sale de la ventana te está diciendo que la acción del precio reciente es significativamente distinta de la de hace N barras. La EMA esconde esa información en su suavidad.
4. **Usar EMA para el filtro de tendencia de 200 días.** Este es el error más común. La SMA de 200 días importa porque todos la miran; la EMA de 200 días es solo una línea ligeramente más rápida sin coordinación institucional detrás. Cambiar pierde el beneficio de coordinación y no gana nada significativo.

## Cómo se comportan en acciones A vs acciones estadounidenses

La microestructura del mercado cambia el cálculo de forma sutil:

- **Acciones A**: los días de límite superior y límite inferior son outliers funcionales. La propiedad de SMA de "dejar caer la barra tras N barras" los maneja limpiamente; el decaimiento continuo de EMA significa que un día de límite superior sesga la EMA durante semanas. Para nombres de acciones A con días de límite frecuentes, SMA es más robusta.
- **Large caps estadounidenses**: la liquidez continua significa que los días outlier son raros; la diferencia EMA-vs-SMA es menor en la práctica. Cualquiera funciona; elige según la herramienta específica (EMA para momentum, SMA para filtros de tendencia).
- **Nombres de HK**: convención mixta; las plataformas locales suelen por defecto a SMA, los brokers extranjeros suelen por defecto a EMA. Cualquiera es aceptable.

Los paneles de PickSkill por defecto usan SMA para filtros de tendencia de ventana larga (50, 60, 200) y EMA para herramientas de momentum de ventana corta (12, 26 dentro de MACD). Esta es la convención usada en el rango más amplio de backtests académicos y coincide con la referencia institucional.

> **Ve ambas en tus gráficos.** La página [/indicators](/indicators) renderiza la pila estándar de MA — 20 / 60 / 200 (SMA) más las EMAs internas 12 / 26 de MACD — en cada posición, con el estado de cruce y la dirección de la pendiente marcados.

## Cómo se materializa la elección en un flujo real

El modelo mental más limpio: **usa SMA para el *mapa* (dónde ha estado el precio en promedio durante la ventana), usa EMA para el *motor* (cómo está cambiando el momentum ahora mismo).**

| Etapa del flujo | Herramienta | Tipo de MA |
|---|---|---|
| **Régimen de tendencia** | MA 200 días | SMA |
| **Contexto de medio plazo** | MA 50 días | SMA |
| **Contexto de corto plazo** | MA 20 días | SMA |
| **Oscilador de momentum** | [MACD](/blog/what-is-macd) | EMA (interna) |
| **Sobre de volatilidad** | [Banda central de Bollinger](/blog/what-is-bollinger-bands) | SMA |
| **Filtro de entrada de swing trade** | Sistema de cruce 5/10 | EMA |

Usa ambas, pero usa cada una en el lugar adecuado.

## Lecturas adicionales

- [Comparativa de SMA y EMA en Investopedia](https://www.investopedia.com/ask/answers/05/smaema.asp) — referencia concisa para las diferencias mecánicas.
- [Robert Colby, *The Encyclopedia of Technical Market Indicators*](https://www.amazon.com/dp/0070120579) — tratamiento exhaustivo de variantes de media móvil con backtests históricos.

## FAQ

**¿Debería usar siempre EMA porque reacciona más rápido?**
No. Una reacción más rápida significa tanto más señales correctas como más señales falsas. Para filtros de tendencia de ventana larga, la estabilidad de la SMA es el *punto*. Para herramientas de momentum de ventana corta, la reactividad de la EMA es el *punto*. Elige la correcta para el trabajo, no optimices todo por velocidad.

**¿Por qué es la SMA de 200 días más famosa que la EMA de 200 días?**
Décadas de convención institucional. La SMA de 200 días está codificada en las reglas de gestión de riesgo de muchos fondos sistemáticos y es la referencia en prácticamente cada plataforma de gráficos por defecto. La coordinación autocumplida en el nivel hace que el nivel importe, independientemente de si SMA o EMA es "matemáticamente mejor". La EMA de 200 días existe pero recibe mucha menos atención institucional.

**¿Son SMA y EMA matemáticamente equivalentes en horizontes largos?**
Convergen en tendencia central pero nunca se vuelven idénticas. En 200 barras, los valores de SMA y EMA típicamente se sitúan a 1–2% el uno del otro en datos suavemente tendenciales; en datos volátiles la diferencia puede ser mayor. Tienen características de retardo distintas en todo el rango — incluso en N largo, la EMA es más rápida por un margen pequeño pero medible.

**¿Cuál es mejor para acciones que mantengo a largo plazo?**
Para holds de largo plazo, la media móvil es mayormente un indicador de *contexto* (¿la tendencia amplia es alcista o bajista?), no un indicador de *señal*. SMA está bien. La SMA de 200 días en particular te dice el régimen de un vistazo y coincide con lo que miran las mesas institucionales de riesgo. Reserva el debate EMA para contextos intradía y de swing trading donde la reactividad impulsa los resultados.

**¿Por qué mis gráficos muestran valores de SMA / EMA distintos a otra plataforma?**
Tres causas comunes: (1) distintos puntos de partida para el cálculo recursivo de la EMA (algunas plataformas siembran desde una media simple de las primeras N barras; otras desde el primer cierre), (2) distinto tratamiento de sesiones after-hours / pre-mercado, (3) distinta convención sobre qué lado de la barra se grafica la media móvil (centrada vs final de ventana). Por consistencia, PickSkill usa graficado al final de ventana, EMAs sembradas por SMA y datos solo de sesión regular — las convenciones estándar en backtests académicos.
