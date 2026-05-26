---
title: '¿Qué es el flujo de capitales? Indicadores de money flow, explicados'
description: >-
  El flujo de capitales mide si el dinero entra o sale de una acción en una
  barra dada — usando volumen ponderado por la dirección del precio. MFI, CMF,
  OBV — fórmulas, usos, trampas.
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
  - Flujo de capitales
  - Money flow
  - Volumen
  - Análisis técnico
  - Indicadores
heroImage: /blog/what-is-capital-flow/hero.png
heroAlt: >-
  Infografía editorial — barras de volumen coloreadas por dirección con una
  línea OBV acumulativa al alza debajo, ilustrando la acumulación bajo un precio
  lateral.
---

**Los indicadores de flujo de capitales combinan dirección del precio con volumen para estimar si el dinero está entrando en una acción (acumulación) o saliendo (distribución).** El volumen llano te dice *cuánto* se negoció; las herramientas de flujo de capitales te dicen *de qué lado* estaba el volumen. Bien hechos, capturan las primeras fases de acumulación antes de que el precio se haya movido lo suficiente como para que las herramientas de tendencia lo registren. Hechos a la ligera, son fáciles de sobreconfiar — el flujo es una señal entre varias, no un veredicto.

### Puntos clave

- **Dominan tres indicadores**: MFI (Money Flow Index), CMF (Chaikin Money Flow) y OBV (On-Balance Volume). Cada uno pondera el volumen por la dirección del precio de forma ligeramente distinta.
- **La idea central**: una barra verde con volumen pesado = presión compradora neta; una barra roja con volumen pesado = venta neta. Suma a lo largo de las barras para obtener una serie acumulada de presión.
- **El punto ciego del flujo de capitales**: no puede distinguir entre flujo institucional grande y flujo minorista agregado en la misma barra de volumen. Los mercados modernos difuminan aún más la distinción.
- **El uso de mayor valor es la divergencia**: cuando el precio hace un nuevo máximo pero el flujo no (o viceversa). Ver [¿Qué es la divergencia?](/blog/what-is-divergence).
- **Se renderiza en cada posición** — el panel de flujo de PickSkill en [/indicators](/indicators) aflora lecturas de MFI y CMF más una categoría de tendencia de flujo a 5 días para que veas si la acumulación está construyéndose o desvaneciéndose.

## ¿Cómo se calcula el flujo de capitales?

Tres formulaciones de uso común, cada una haciendo una suposición ligeramente distinta sobre cómo ponderar el volumen por la acción del precio.

### Money Flow Index (MFI)

Un RSI ponderado por volumen. Rango 0–100; sobrecompra >80, sobreventa <20.

```
Precio Típico (TP)      = (High + Low + Close) / 3
Raw Money Flow (RMF)    = TP × Volume
Positive Money Flow     = Suma de RMF en N barras donde TP subió
Negative Money Flow     = Suma de RMF en N barras donde TP bajó
Money Flow Ratio        = Positive MF / Negative MF
MFI                     = 100 − [100 / (1 + Money Flow Ratio)]
```

N por defecto = 14. MFI es el indicador de flujo más popular porque la escala 0–100 es familiar (se lee como RSI) y los umbrales de sobrecompra / sobreventa mapean intuitivamente.

### Chaikin Money Flow (CMF)

Pondera el volumen de cada barra por dónde se sitúa el cierre dentro del rango de la barra. Barras que cierran cerca del máximo reciben peso positivo; barras que cierran cerca del mínimo reciben peso negativo.

```
Money Flow Multiplier (MFM) = ((Close − Low) − (High − Close)) / (High − Low)
Money Flow Volume (MFV)     = MFM × Volume
CMF                         = Sum(MFV, N) / Sum(Volume, N)
```

N por defecto = 20. CMF va de −1 a +1; valores por encima de +0,05 indican presión compradora; por debajo de −0,05 indican venta. La fuerza del CMF es la precisión barra a barra (el flujo de cada barra está determinado enteramente por dónde cerró dentro de su rango); su debilidad es la sensibilidad a barras individuales de rango amplio.

### On-Balance Volume (OBV)

El más simple de los tres y posiblemente el más robusto:

```
Si Close[t] > Close[t-1]: OBV[t] = OBV[t-1] + Volume[t]
Si Close[t] < Close[t-1]: OBV[t] = OBV[t-1] − Volume[t]
Si no:                    OBV[t] = OBV[t-1]
```

OBV es una serie acumulada — no tiene significado absoluto; lo que importa es su dirección relativa a la dirección del precio. Cuando OBV tiende al alza mientras el precio se mueve lateral, la acumulación se está construyendo por debajo; cuando el precio hace nuevos máximos pero OBV no, el rally está ocurriendo con participación debilitándose.

Los tres indicadores coinciden la mayor parte del tiempo. Cuando difieren, OBV suele ser la lectura más limpia sobre si el volumen neto está apoyando el movimiento del precio.

## ¿Qué te dice realmente el flujo de capitales?

Tres casos de uso reales, en orden de ventaja:

1. **Detectar acumulación antes de que el precio se mueva.** Acciones al final de una tendencia bajista a menudo muestran que los indicadores de flujo giran al alza antes de que el precio haya confirmado un suelo. El patrón: OBV hace suelo y empieza a tender al alza mientras el precio sigue moviéndose lateral. Esta es una de las configuraciones más limpias para "comprar antes de la ruptura" — aunque rutinariamente lleva semanas materializarse y muchos candidatos no producen seguimiento de precio.
2. **Confirmar una ruptura.** Una ruptura de precio con flujo débil (CMF cerca de cero, sin nuevo máximo de OBV) tiene más probabilidad de fallar que una ruptura con flujo fuerte (CMF disparándose positivo, OBV golpeando un nuevo máximo). Trata el flujo como confirmación: requerido para entradas de alta convicción, opcional para las oportunistas.
3. **Identificar divergencia de flujo.** El precio hace un máximo más alto; el flujo hace un máximo más bajo. Es divergencia bajista en el flujo de capitales específicamente — distinta de la divergencia de MACD o RSI y a veces más temprana. La divergencia alcista oculta de flujo (precio mínimo más alto, flujo mínimo más bajo en una tendencia alcista) captura la reanudación de tendencia que las herramientas puramente de precio se pierden.

El caso de uso que *no* funciona tan bien como se cree: predecir techos y suelos absolutos en tiempo real. Las señales de flujo son más ruidosas en extremos que en transiciones; la lectura más limpia es en la transición (tendencia bajista → consolidación) más que en el extremo (pico de una tendencia alcista).

## ¿Qué se pierde el flujo?

Tres puntos ciegos estructurales que vale la pena conocer antes de sobreconfiar en la señal:

1. **No puede distinguir flujo institucional de minorista.** Un pico de volumen del 10% podría ser un comprador institucional acumulando o 10.000 operaciones minoristas. El indicador de flujo trata ambos por igual. Para nombres con fuerte flujo de cobertura relacionado con opciones (large-cap tecnológicas especialmente), esta distorsión no es trivial — las coberturas de dealers de opciones pueden dominar el flujo diario sin reflejar convicción fundamental.
2. **No puede ver el volumen de dark pools / fuera de bolsa.** Los mercados modernos de renta variable estadounidenses negocian el 30–50% del volumen fuera de bolsa. Los indicadores de flujo basados en la cinta pública solo ven el volumen del mercado iluminado. La señal sigue siendo real (el flujo del mercado iluminado correlaciona con el flujo fuera de bolsa), pero las lecturas absolutas no son la imagen completa.
3. **Sensible a días con hueco.** Huecos de resultados, huecos de noticias y suspensiones overnight producen picos de volumen de una barra que dominan el indicador durante las siguientes N barras. El MFI de 14 barras tarda 14 sesiones en descontar completamente un único hueco anómalo.

El panel de flujo de PickSkill marca explícitamente las barras de día con hueco y las barras de día de límite (para acciones A) como outliers; las lecturas de flujo suavizadas las excluyen de la ventana rodante para evitar que eventos puntuales dominen la lectura.

## Cuatro trampas al interpretar señales de flujo

1. **Leer el nivel absoluto en lugar de la tendencia.** "MFI está en 65" apenas informa. "MFI ha subido de 35 a 65 en las últimas 8 barras mientras el precio se ha mantenido lateral" es el mismo número pero una señal mucho más fuerte. Los indicadores de flujo son más útiles vía su pendiente y trayectoria, no su valor instantáneo.
2. **Confundir volumen con flujo.** Un día alcista de volumen pesado es alcista; un día bajista de volumen pesado es bajista. El volumen solo es neutral; amplifica cualquier dirección en la que la barra haya cerrado. Los indicadores de flujo son volumen *ponderado por dirección* — esa ponderación es todo el contenido informativo. Si solo miras barras de volumen sin la capa de dirección, no estás mirando flujo.
3. **Ignorar el contexto de flujo de todo el mercado.** Una acción con OBV creciente durante una caída general del mercado es más informativa que una acción con OBV creciente en un rally general del mercado — en la primera, se está construyendo convicción real contra la corriente; en la segunda, el flujo es solo beta de mercado. Siempre compara el flujo contra el flujo del mercado amplio.
4. **Operar el flujo sin un disparador de acción del precio.** Que el flujo gire al alza no significa comprar; significa "vigila un disparador de compra". Espera una confirmación de acción del precio (ruptura por encima de un nivel, cruce de MA, giro de MACD) antes de dimensionar.

## Cómo se comporta el flujo de capitales en acciones A

El mercado de acciones A tiene dinámicas adicionales de flujo que conviene entender:

- **El flujo Northbound / Southbound** (entradas del Stock Connect desde Hong Kong) es una serie de flujo separada y públicamente divulgada. No es lo mismo que el MFI / CMF / OBV en la cinta — captura específicamente el flujo institucional extranjero a través del canal connect. Muchas plataformas locales agregan esto en un indicador "北向资金净流入" que es informativo sobre *quién* está comprando, no solo *cuánto* volumen se negoció.
- **Las restricciones de day trading (T+1) comprimen las señales de flujo.** Como los inversores en acciones A no pueden vender en el mismo día, el volumen diario está fuertemente sesgado hacia compras iniciales — el riesgo overnight se mantiene, no se deshace. Esto hace que el OBV de acciones A sea más direccional que el OBV de EE. UU. pero también más propenso a picos de manada de un día.
- **Los días de límite superior truncan el flujo.** Cuando una acción se bloquea en límite superior, el volumen en el libro de órdenes puede ser enorme pero el volumen ejecutado es pequeño. La mayoría de los feeds de datos reportan el volumen ejecutado; los indicadores de flujo que usan volumen ejecutado subestiman la demanda real en días de límite. Opera las señales de flujo de días de límite con cautela.

Ver [Mejores indicadores para acciones A](/blog/best-indicators-for-a-shares) para el manual más amplio.

> **Sigue el flujo en tus posiciones.** El panel de flujo de [/indicators](/indicators) renderiza MFI y CMF para cada posición, aflora la categoría de tendencia de flujo a 5 días y marca explícitamente patrones de acumulación (OBV creciente durante precio lateral) y patrones de distribución (OBV decreciente durante precio creciente).

## Cómo encaja el flujo en un flujo multi-señal

El flujo es la *capa de participación* — responde a "¿el volumen está apoyando el movimiento?". Esa capa encaja en una pila más amplia:

| Capa | Herramienta | Pregunta |
|---|---|---|
| **Tendencia** | Pila de MA, [ADX](/blog/what-is-adx) | ¿Dirección? ¿Fuerza? |
| **Momentum** | [MACD](/blog/what-is-macd), [RSI](/blog/what-is-rsi) | ¿Dirección reciente del cambio? |
| **Participación** | MFI, CMF, OBV | ¿El movimiento está respaldado por volumen? |
| **Volatilidad** | [Bandas de Bollinger](/blog/what-is-bollinger-bands) | ¿El movimiento es proporcionado? |
| **Mapa** | [Soporte / resistencia](/blog/what-is-support-resistance) | ¿Dónde están los niveles clave? |

Usa la capa de participación para *confirmar* señales de las otras capas, no para generar señales por sí sola. Una configuración alcista con OBV creciente, cruce dorado de MACD y precio por encima de la MA de 50 días tiene materialmente más convicción que cualquiera de esas por separado.

## Lecturas adicionales

- [Paper de Money Flow de Marc Chaikin](https://www.chaikinanalytics.com/) — el tratamiento del propio desarrollador del CMF y la teoría de persistencia del money flow.
- [Joseph Granville, *New Strategy of Daily Stock Market Timing*](https://www.amazon.com/dp/0136150896) — referencia original de OBV; la sección de metodología aún vale la pena leer.

## FAQ

**¿Qué indicador de flujo debería usar?**
Empieza con OBV — es el más simple y robusto. Usa MFI cuando quieras una lectura acotada 0–100 como RSI. Usa CMF para precisión barra a barra cuando te importe cómo cada barra individual cerró dentro de su rango. Los tres coinciden la mayor parte del tiempo; cuando difieren, OBV suele ser la señal más limpia. El panel de flujo de PickSkill aflora los tres.

**¿Es "smart money flow" lo mismo que flujo de capitales?**
"Smart money flow" es un término de marketing, no una definición técnica. La mayoría de los indicadores de "smart money" son versiones reempaquetadas de OBV / MFI / CMF, a veces con una ponderación por hora del día (el volumen del final del día recibe más peso bajo la teoría de que las instituciones operan al cierre). La señal subyacente es la misma familia; la marca varía.

**¿Puede el flujo de capitales predecir hacia dónde va una acción?**
Predecir es demasiado fuerte. El flujo de capitales puede decirte si el movimiento actual está bien respaldado por volumen (elevando la probabilidad de continuación) o mal respaldado (elevando la probabilidad de fallo). No puede decirte dirección en aislamiento — el flujo se aplana durante largos periodos laterales y produce señales falsas durante huecos por noticias. Trátalo como un modificador de confianza sobre señales de otras herramientas, no como un pronóstico direccional.

**¿Por qué el flujo se ve distinto en plataformas distintas?**
Tres causas: (1) distintos valores de N (14 vs 21 para MFI; 20 vs 21 para CMF), (2) distinto tratamiento del volumen de pre-mercado / after-hours (algunas incluyen horarios extendidos; PickSkill usa solo sesión regular por consistencia), (3) distinto tratamiento de días con hueco. Por consistencia, PickSkill usa volumen de sesión regular, excluye barras de día de límite (acciones A) y aplica un único conjunto de valores N por defecto en todas las posiciones.

**¿Cómo interactúa el flujo con la cobertura relacionada con opciones?**
En large caps con fuerte actividad de opciones, la cobertura del dealer puede impulsar el 20–40% del flujo diario sin reflejar convicción fundamental — una acción con exposición gamma creciente fuerza a los dealers a comprar en días alcistas y vender en días bajistas, lo que infla las lecturas de flujo en ambas direcciones. Para nombres con fuerte actividad de opciones, las señales de flujo son menos informativas que para nombres con menos opciones; combina el flujo con datos de skew de volatilidad implícita y exposición gamma para una lectura completa.
