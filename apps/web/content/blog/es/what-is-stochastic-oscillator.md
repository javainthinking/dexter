---
title: '¿Qué es el oscilador estocástico? %K, %D y por qué KDJ es su primo'
description: >-
  El estocástico mide dónde se sitúa el cierre dentro del rango reciente.
  Fórmula, estocástico rápido vs lento, su relación con KDJ y cuatro trampas
  frecuentes.
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
  - Estocástico
  - KDJ
  - Momentum
  - Análisis técnico
  - Indicadores
heroImage: /blog/what-is-stochastic-oscillator/hero.png
heroAlt: >-
  Infografía editorial — el Estocástico %K y %D oscilando entre 0 y 100,
  umbrales 80/20 marcados, cruce de sobreventa destacado.
---

**El oscilador estocástico mide dónde se sitúa el cierre actual dentro del rango de máximos y mínimos recientes, en una escala de 0 a 100.** Fue desarrollado por George Lane en los años 50 para responder una pregunta engañosamente simple: en una ventana definida, ¿qué tan cerca del máximo (o del mínimo) está el precio actual? El estocástico es el padre de toda una familia de herramientas de momentum — incluyendo el [KDJ](/blog/what-is-kdj), que es esencialmente el estocástico con una línea J añadida y es el oscilador por defecto en la comunidad minorista china de acciones A. Conocer al padre te ayuda a leer cada variante.

### Puntos clave

- **Fórmula**: `%K = ((Cierre − Mínimo(N)) / (Máximo(N) − Mínimo(N))) × 100`. N por defecto = 14 en la convención estadounidense.
- **Dos líneas**: %K (el estocástico crudo) y %D (SMA de 3 periodos de %K, la línea de señal). Cuando %K cruza %D, esa es la señal básica.
- **Sobrecomprado por encima de 80, sobrevendido por debajo de 20.** Mismos umbrales que el RSI pero construidos a partir de una fórmula distinta (posición en rango, no fuerza del cambio).
- **Rápido vs lento**: el rápido es más responsivo pero más ruidoso; el lento es el suavizado estándar. La mayoría de plataformas usa el lento por defecto.
- **El [KDJ](/blog/what-is-kdj) extiende el estocástico con una línea J** (`J = 3K − 2D`). La línea J puede sobrepasar por debajo de 0 o por encima de 100, razón por la que KDJ es más popular en mercados con oscilaciones más bruscas (acciones A).

## ¿Cómo se calcula el oscilador estocástico?

La matemática completa para la forma más común (estocástico lento):

```
%K crudo = ((Cierre − Mínimo(N)) / (Máximo(N) − Mínimo(N))) × 100
%K       = SMA de 3 periodos del %K crudo
%D       = SMA de 3 periodos del %K
```

N por defecto = 14 en la convención estadounidense; KDJ usa (9, 3, 3) en la convención A-share. El suavizado reduce el ruido — el "estocástico rápido" sin suavizar es demasiado sensible para uso en barras diarias en la mayoría de las acciones.

La salida está acotada entre 0 y 100 por construcción:

- **%K = 100** significa que el cierre está al precio más alto de las últimas N barras (fuerza máxima)
- **%K = 0** significa que el cierre está al precio más bajo de las últimas N barras (debilidad máxima)
- **%K = 50** significa que el cierre está exactamente en el medio del rango reciente

Esto hace al estocástico fundamentalmente distinto del [RSI](/blog/what-is-rsi), que mide la *fuerza de los cambios de precio recientes*, no la *posición en un rango*. Los dos a menudo coinciden pero por razones ligeramente distintas.

## Estocástico rápido vs lento — ¿cuál es la diferencia?

Existen tres sabores del estocástico, en orden creciente de suavizado:

| Variante | %K crudo | %K (salida) | %D | Caso de uso |
|---|---|---|---|---|
| **Rápido** | Crudo | Crudo | SMA-3 de %K | Traders activos, intradía |
| **Lento** | Crudo | SMA-3 de crudo | SMA-3 de %K | Estándar para barras diarias |
| **Full** | Crudo | SMA-N de crudo (configurable) | SMA-M de %K (configurable) | Optimización personalizada |

El "oscilador estocástico" sin calificador casi siempre se refiere a la versión lenta. El estocástico rápido genera demasiadas señales falsas en barras diarias para ser útil en la mayoría de los marcos temporales minoristas; tiene su lugar en gráficos intradía, donde el suelo de ruido es más alto.

## ¿Qué significan aquí sobrecomprado y sobrevendido?

Los umbrales 80/20 funcionan de forma similar a los 70/30 del RSI:

- **Estocástico > 80**: el cierre está en el 20% superior del rango reciente de N barras — tendencia alcista con momentum reciente fuerte.
- **Estocástico < 20**: el cierre está en el 20% inferior del rango reciente — tendencia bajista con momentum reciente débil.

El matiz de comportamiento clave: en un mercado fuertemente tendencial, el estocástico puede quedar fijado en o por encima de 80 (en tendencia alcista) o por debajo de 20 (en tendencia bajista) durante muchas barras consecutivas. Tratar "estocástico > 80" como automáticamente "sobrecomprado para vender" pierde dinero en mercados tendenciales. La señal es más útil en la *salida* del extremo — `%K cruza por debajo de 80 desde arriba` para señales de venta, `%K cruza por encima de 20 desde abajo` para señales de compra.

## Estocástico vs KDJ — ¿cuál es la diferencia?

KDJ es el estocástico con una adición: la línea J.

| Componente | Fórmula | Rango |
|---|---|---|
| **K** (KDJ) | Igual que %K del estocástico lento | 0–100 (acotado) |
| **D** (KDJ) | Igual que %D del estocástico lento | 0–100 (acotado) |
| **J** (KDJ) | `3K − 2D` | No acotado — puede ir por debajo de 0 o por encima de 100 |

La propiedad no acotada de la línea J es la razón entera por la que KDJ existe como indicador separado. Cuando el mercado está en un movimiento brusco, J sobrepasa por debajo de 0 o por encima de 100, lo que actúa como señal temprana de extremo — normalmente 1–3 barras antes de que K y D muestren el mismo extremo.

KDJ es el oscilador por defecto en la comunidad minorista china de acciones A por dos razones:

1. Los límites diarios de precio en acciones A (±10% en el mercado principal, ±20% en ChiNext/STAR) crean oscilaciones barra-a-barra más bruscas que las barras diarias estadounidenses. El sobrepaso de la línea J captura estos movimientos más bruscos con más limpieza que el RSI.
2. Coordinación cultural — como la comunidad minorista de acciones A usa KDJ por defecto, las señales son parcialmente autocumplidas en nombres A-share.

Para una comparación más profunda, ver [¿Qué es KDJ?](/blog/what-is-kdj) y [KDJ vs RSI](/blog/kdj-vs-rsi).

## Cuatro trampas al leer el estocástico

1. **Ir contra la tendencia con el estocástico.** "El estocástico está por encima de 80, así que vender" pierde dinero en tendencias alcistas. En mercados tendenciales, el estocástico queda fijado en extremos durante muchas barras; la señal correcta es la *salida* del extremo combinada con un evento de confirmación (ruptura de precio, cruce de momentum), no el extremo en sí.
2. **Usar el estocástico en acciones laterales.** Tickers de bajo momentum y alto ruido generan docenas de cruces de estocástico por trimestre, la mayoría de los cuales son ruido. Usa el estocástico en nombres con persistencia de tendencia razonable — los mismos criterios que MACD y otros osciladores de momentum.
3. **Ignorar el filtro de régimen de tendencia.** El estocástico sin filtro de tendencia es mayormente ruido. Cuando el [ADX](/blog/what-is-adx) está por debajo de 20, las señales del estocástico son lanzamientos de moneda. Cuando el ADX está por encima de 25 con una dirección de tendencia clara, las señales del estocástico en extremos tienen ventaja significativa.
4. **Confundir el estocástico con el estocástico RSI.** El estocástico mide la *posición del precio* en el rango; el estocástico RSI (StochRSI) mide la *posición del RSI* en su propio rango. Suenan similares pero miden cosas distintas y responden de manera diferente. El "estocástico" por defecto en la mayoría de plataformas es el estocástico original de Lane, no StochRSI.

## Cómo se comporta el estocástico en acciones A

La microestructura A-share hace que el estocástico (y el KDJ) sean particularmente sensibles:

- **Días de límite superior** topan el cierre al precio del límite, que es mecánicamente el máximo del rango de la barra. El %K del estocástico en un día de límite superior está en o cerca de 100 por construcción, independientemente del contexto de tendencia más amplio. PickSkill marca las barras de día de límite como atípicas en los paneles de indicadores.
- **Días de suspensión** congelan el cálculo. Cuando la acción reanuda tras una suspensión multi-día, la ventana de lookback incluye el periodo pre-suspensión, que puede ya no ser relevante — trata las lecturas de estocástico post-suspensión con cautela durante las primeras 5–10 barras.
- **Liquidación T+1** significa que los round-trips intradía son imposibles. Esto comprime la volatilidad intradía en la apertura de la siguiente sesión — haciendo que las señales de estocástico en acciones A sean más impulsadas por eventos y menos continuas que el estocástico de barras diarias en EE. UU.

Ver [Mejores indicadores para acciones A](/blog/best-indicators-for-a-shares) y [MACD en acciones A vs acciones estadounidenses](/blog/macd-on-a-shares-vs-us) para el contexto específico de mercado más amplio.

> **Míralo en tu cartera.** La página [/indicators](/indicators) renderiza KDJ (la variante de estocástico más usada en el universo de PickSkill) en cada posición, con las líneas K, D y J más el registro de buckets de 5 días.

## Cómo encaja el estocástico en un flujo de trabajo multi-señal

El estocástico es un input en un flujo en capas:

| Capa | Herramienta | Pregunta que responde |
|---|---|---|
| **Filtro de tendencia** | Pila MA + [ADX](/blog/what-is-adx) | ¿Hay tendencia? ¿Es lo bastante fuerte para operarla? |
| **Momentum / oscilador** | Estocástico / [KDJ](/blog/what-is-kdj) / [RSI](/blog/what-is-rsi) | ¿Dónde está el movimiento en su ciclo de momentum? |
| **Confirmación** | %K cruzando %D, cruce de [MACD](/blog/what-is-macd) | ¿Cuándo actuar? |
| **Nivel / mapa** | [Soporte / resistencia](/blog/what-is-support-resistance) | ¿Dónde están los niveles clave? |

El setup de entrada más limpio: tendencia confirmada (ADX > 25, pila MA alineada), el estocástico sale del sobrevendido desde por debajo de 20, %K cruza %D al alza, el precio rompe un swing high reciente — cuatro señales alineadas. Saltarse cualquiera de las cuatro reduce significativamente la ventaja por señal.

## Prompts de seguimiento habituales

- *"Para cada posición, muestra los valores actuales del KDJ más el registro de 5 días. Marca cualquiera donde K salió del sobrevendido y J esté subiendo rápidamente."*
- *"Compara las señales de estocástico y RSI en mi watchlist de acciones A. ¿Qué nombres tienen ambos en extremos?"*
- *"Encuentra nombres del S&P 500 con %K del estocástico saliendo del sobrevendido Y un cruce de MA de 50 días por encima de MA de 200 días — candidatos a reversión alcista."*
- *"Hace un backtest del cruce de %K sobre %D desde sobrevendido en [ticker] durante los últimos 5 años. ¿Cuál es la tasa de acierto?"*

## Lecturas adicionales

- [Investopedia sobre el oscilador estocástico](https://www.investopedia.com/terms/s/stochasticoscillator.asp) — referencia completa.
- [Trabajo original de George Lane sobre el estocástico](https://www.amazon.com/George-Lane/e/B001JS4OBC) — tratamiento del propio desarrollador del indicador.

## FAQ

**Estocástico vs RSI — ¿cuál es mejor?**
Ninguno — miden cosas distintas. El RSI captura la *fuerza de los cambios de precio recientes*; el estocástico captura la *posición dentro del rango de precios reciente*. En mercados tendenciales, el RSI tiende a ser más útil (puede acompañar una tendencia sin falsas reversiones). En mercados laterales, el estocástico tiende a ser más útil (identifica los extremos del rango con limpieza). Los paneles de PickSkill ejecutan ambos para que puedas compararlos. Ver [KDJ vs RSI](/blog/kdj-vs-rsi) para un tratamiento más profundo.

**¿Por qué mi gráfico muestra valores de estocástico distintos a los de otra plataforma?**
Dos causas habituales: (1) periodos distintos (14 vs 9 para %K, 3 vs 5 para el suavizado de %D), y (2) variante rápida vs lenta. Los paneles de PickSkill usan el estocástico lento estándar con periodos por defecto para coincidir con la convención de plataforma más común.

**¿Cuál es la relación entre el estocástico y el KDJ?**
KDJ es el estocástico lento con una línea J añadida (`J = 3K − 2D`). La matemática de K y D es idéntica entre ambos. La línea J del KDJ es la única adición, y proporciona señales de aviso temprano vía sobrepaso por debajo de 0 o por encima de 100. El estocástico es la convención dominante en EE. UU.; el KDJ es la convención dominante en la comunidad minorista A-share.

**¿Puede el estocástico predecir dirección?**
El estocástico identifica *extremos* y *cruces*; no predice dirección absoluta aisladamente. Un estocástico cruzando al alza desde el sobrevendido te dice que el momentum se ha vuelto positivo en este extremo específico; no te dice que la tendencia mayor se reanudará. Empareja las señales del estocástico con un filtro de tendencia (pila MA + ADX) y un evento de confirmación (ruptura de precio, cruce de MACD) antes de actuar.

**¿Debería usar el estocástico en gráficos intradía?**
Puedes, pero reduce expectativas. El estocástico intradía genera muchas señales por sesión, la mayoría de las cuales son ruido. Usa periodos de estilo intradía (5 o 7 en lugar de 14) y exige confirmación multi-señal. La mayoría del trabajo intradía minorista sobreutiliza el estocástico en relación con su ventaja real.
