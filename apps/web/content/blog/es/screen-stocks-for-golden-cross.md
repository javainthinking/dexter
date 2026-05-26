---
title: Cómo cribar acciones por cruce dorado en 60 segundos
description: >-
  Encuentra cada acción de tu watchlist con un cruce fresco de MA 50/200 — y la
  variante underwater de mayor ventaja. Flujo en 4 pasos con PickSkill.
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
  - Cruce dorado
  - Media móvil
  - Screening
  - Workflow
heroImage: /blog/screen-stocks-for-golden-cross/hero.png
heroAlt: >-
  Infografía editorial — una tabla de screener que lista los tickers con su
  estado de cruce fresco (UNDERWATER / standard / DEATH) y confirmación de
  volumen.
---

**Un cruce dorado es la media móvil de 50 días cruzando por encima de la de 200 días — uno de los eventos técnicos más vigilados en renta variable.** Escanear una cartera o watchlist en busca de cruces frescos a mano significa revisar el gráfico de cada nombre, lo que escala mal. El panel de MA de PickSkill ejecuta el escaneo automáticamente y aflora tanto el cruce dorado estándar como la variante *underwater* de mayor ventaja, donde la MA de 200 días todavía tiene pendiente negativa en el momento del cruce. Este tutorial recorre cómo usar el screener como parte de un flujo real — no solo detectar cruces, sino actuar sobre ellos con los filtros correctos.

### Puntos clave

- **4 pasos, ~60 segundos.** Abre el panel de MA, identifica cruces frescos, filtra por el estado underwater, añade confirmación antes de actuar.
- **La variante underwater ha producido históricamente retornos forward más fuertes** que el cruce estándar — captura cambio de régimen en lugar de continuación.
- **El screening multi-filtro reduce ruido**: cruce fresco + pendiente + confirmación por volumen + contexto de [soporte / resistencia](/blog/what-is-support-resistance).
- **Funciona en nombres de EE. UU., HK y acciones A** con manejo de cruce específico de mercado (exclusión de días de límite para acciones A).
- **Se empareja naturalmente con el flujo de [/portfolios](/portfolios)** — escanea tu watchlist existente o construye una desde el output del screener.

## Por qué importa este flujo

El cruce 50/200 puro tiene poca ventaja independiente — las tasas históricas de acierto se sitúan cerca del retorno incondicional del mercado. La razón por la que los traders todavía lo vigilan es que la variante *underwater* — cruce fresco con la MA de 200 días todavía con pendiente negativa — tiene retornos forward materialmente mejores. Sin una herramienta que separe las dos variantes, los inversores minoristas tratan cada cruce por igual y se pierden el subconjunto de mayor ventaja.

La otra razón por la que el screening a mano falla: el cruce es un evento momentáneo. Cuando lo ves por el titular ("S&P 500 confirma cruce dorado"), lleva dos semanas descontado. Capturar el cruce dentro de 1–3 barras del evento importa; hacerlo en una watchlist de 20 nombres requiere automatización.

Para el concepto subyacente, ver [¿Qué es el cruce dorado (y el cruce de la muerte)?](/blog/what-is-golden-cross-death-cross).

## El flujo de 4 pasos

### Paso 1 — Abre el panel de MA

Ve a [/indicators](/indicators) y selecciona la dimensión de media móvil. El panel aflora el estado actual del cruce 50/200 de cada posición, más la pendiente de la MA larga, y marca cruces frescos (en las últimas 5 barras).

La vista es ordenable por:

| Ordenamiento | Uso |
|---|---|
| **Frescura del cruce** | Cruces más nuevos arriba — más accionables |
| **Marca underwater** | Cruces underwater priorizados — variante de mayor ventaja |
| **Fuerza de tendencia** | Empareja con la lectura de [ADX](/blog/what-is-adx) |
| **Confirmación por volumen** | Cruces con volumen por encima de 1,5× la media de 20 días — mejor seguimiento |

El orden por defecto prioriza cruces underwater frescos con confirmación por volumen — es decir, la variante de mayor ventaja.

### Paso 2 — Identifica cruces frescos

Tres estados que el panel puede mostrar para cada posición:

| Estado | Qué significa |
|---|---|
| **Cruce dorado estándar (tendencia alcista ya activa)** | 50 por encima de 200; 200 con pendiente positiva. Continuación de tendencia. |
| **Cruce dorado underwater** | 50 por encima de 200; 200 todavía con pendiente negativa. Candidato a cambio de régimen — la variante más rara y de mayor ventaja. |
| **Cruce bajista (de la muerte) o pre-cruce** | 50 por debajo de 200, o 50 y 200 cerca de cruzarse en dirección bajista. Señal risk-off. |

Céntrate en el estado underwater. En los índices principales, los cruces dorados underwater ocurren 2–4 veces por década y tienden a marcar el fin de drawdowns significativos. En nombres individuales aparecen con más frecuencia pero siguen representando la configuración estructuralmente de mayor ventaja.

Para los propósitos del panel, "fresco" significa que el cruce ocurrió dentro de las últimas 5 barras de cotización. Los cruces más antiguos ya están descontados.

### Paso 3 — Añade filtros adicionales

Un cruce fresco solo es un punto de partida, no un disparador de entrada. Aplica estos filtros en orden:

1. **Confirmación por volumen.** El volumen del día del cruce debería ser al menos 1,5× la media de 20 días. Los cruces de volumen ligero fallan a tasas significativamente más altas que los cruces de volumen pesado. Ver [Análisis de volumen](/blog/what-is-volume-analysis) para el contexto más amplio.
2. **Alineación de flujo de capitales.** El [flujo de capitales](/blog/what-is-capital-flow) (MFI, CMF, OBV) debería tender al alza junto con el cruce. Los cruces con flujo decreciente tienen más probabilidad de ser señales falsas.
3. **Proximidad a nivel de soporte.** Un cruce que ocurre cerca de un [nivel de soporte](/blog/what-is-support-resistance) significativo es estructuralmente más fuerte que uno que ocurre en espacio abierto — el nivel proporciona un ancla natural de gestión de riesgo.
4. **Sin señal contradictoria de momentum.** [RSI](/blog/what-is-rsi) no debería estar profundamente en territorio de sobrecompra (>75) en el momento del cruce — un cruce hacia sobrecompra inmediata a menudo es un techo de continuación, no una oportunidad de entrada fresca.

Aplica los cuatro filtros y el número de cruces accionables cae un 70–80%. Los candidatos restantes tienen perfiles de retornos forward materialmente mejores.

### Paso 4 — Genera un plan de entrada

Una vez que un candidato pasa los filtros, usa el chat de PickSkill para generar un plan de entrada estructurado:

```text
Para [ticker], genera un plan de entrada en torno al cruce dorado fresco:
- Precio de entrada sugerido (actual vs retroceso a la MA de 50 días)
- Nivel de stop (por debajo del mínimo de swing más reciente o la MA de 200 días, lo que sea menor)
- Objetivo inicial (el siguiente nivel de resistencia)
- Dimensionamiento de posición basado en un 1% de riesgo de cartera por operación
```

PickSkill devuelve un plan estructurado con niveles con fuente, racional de objetivos y una fórmula de dimensionamiento. Puedes ajustar hipótesis en el chat y re-ejecutar.

> **Pruébalo ahora.** [Abre /indicators](/indicators), selecciona la vista de MA y ordena por underwater + frescura. Incluso en una cartera pequeña probablemente verás 1–2 candidatos underwater frescos por trimestre — el volumen de oportunidades de alta calidad es mayor de lo que la mayoría de los inversores minoristas espera una vez que el screening está automatizado.

## Lo que el panel capta y el screening a mano se pierde

### 1. La distinción underwater

La inspección manual de gráficos trata cada cruce dorado por igual. El panel distingue el cruce estándar (continuación de tendencia) del cruce underwater (cambio de régimen). Esta última es rara y estructuralmente de mayor ventaja — la automatización la aflora explícitamente.

### 2. Escaneo multi-nombre simultáneo

El screening a mano funciona para unos pocos nombres; el panel escanea una cartera de 20+ nombres en segundos. La amplitud capta configuraciones que no habrías pensado comprobar — particularmente en nombres que ya habías dado por perdidos o no visitabas hacía semanas.

### 3. Frescura sub-5-barras

El cruce 50/200 es más accionable dentro de 1–3 barras del evento. La inspección manual a menudo capta el cruce con 1–2 semanas de retraso, momento en que la parte fácil del movimiento ya ha ocurrido. El panel aflora cruces frescos en el momento en que se imprimen.

## Cuatro trampas al usar el screener

1. **Actuar solo sobre el cruce, sin filtros.** El cruce puro está cerca de un cara o cruz. Sin confirmación por volumen, chequeo de régimen de tendencia y proximidad de nivel, estás operando ruido.
2. **Ignorar la distinción underwater.** Un cruce dorado estándar en una tendencia alcista existente es la variante de alto volumen y baja ventaja. El cruce underwater es la variante rara y de mayor ventaja. No las confundas.
3. **Perseguir el día del cruce.** La entrada más limpia es a menudo un *retroceso* a la MA de 50 días después de que el cruce haya confirmado, no comprar el momento en que el cruce se imprime. El primer retroceso al nivel del cruce es el punto de entrada de mayor ventaja en un cruce típico exitoso.
4. **Sin disciplina de invalidación.** Define el nivel de stop *antes* de entrar — el mínimo de swing más reciente o la MA de 200 días, lo que sea menor. Si el precio alcanza el stop, la operación está equivocada; ciérrala. El cruce es una señal probabilística, no una certeza.

## Cómo se comportan los cruces de forma distinta en acciones A

La microestructura de acciones A cambia los criterios de screening:

- **Énfasis cultural en 20/60.** La comunidad minorista de acciones A vigila el cruce 20/60 más de cerca que el 50/200. El panel aflora ambos; en nombres de acciones A, pondera más el cruce 20/60 como señal de coordinación.
- **Exclusión de días de límite.** Las barras de límite superior e inferior crean patrones escalonados en ambas MAs. PickSkill marca estas barras como outliers en la detección del cruce — sin este filtro, días consecutivos de límite producirían señales falsas de cruce fresco.
- **Manejo de suspensiones.** Cuando una acción se suspende durante días y luego reanuda, la pila de MA efectivamente reinicia. Los cruces que ocurren dentro de 10 barras de una reanudación de suspensión deben tratarse con cautela.

Ver [Mejores indicadores para acciones A](/blog/best-indicators-for-a-shares) para el manual más amplio y [MACD en acciones A vs acciones estadounidenses](/blog/macd-on-a-shares-vs-us) para la comparación entre mercados.

## Flujos de seguimiento habituales

Una vez tienes un candidato del screener de cruces, estos son los siguientes movimientos naturales:

- *"Para cada nombre con un cruce dorado underwater fresco, comprueba si MACD también está en estado alcista y aflora solo los nombres con ambas señales alineadas."*
- *"Genera una watchlist de cada acción en el S&P 500 actualmente a menos de 2 barras de un cruce dorado underwater."*
- *"Hace backtest del cruce underwater 50/200 en este ticker específico durante los últimos 10 años — tasa de acierto, retorno medio, tiempo al objetivo."*
- *"Construye una cartera de los top 10 candidatos de cruce underwater equiponderada, con un stop automatizado en la MA de 200 días."*
- *"Compara el cruce actual de este ticker con su cruce dorado anterior de hace 2 años — ¿aquel era underwater y qué pasó después?"*

## Lecturas adicionales

- [¿Qué es el cruce dorado (y el cruce de la muerte)?](/blog/what-is-golden-cross-death-cross) — el concepto subyacente y la variante underwater.
- [¿Qué es una media móvil?](/blog/what-is-ma) — la base de la señal del cruce.
- [Meb Faber, *A Quantitative Approach to Tactical Asset Allocation*](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=962461) — respaldo académico para reglas simples de cruce de MA.

## FAQ

**¿Con qué frecuencia ocurren los cruces dorados underwater?**
En los índices principales, 2–4 veces por década — normalmente al final de drawdowns significativos. En acciones individuales, con más frecuencia (unos pocos al año en una watchlist de 20 nombres). La rareza de la señal a nivel de índice es parte de lo que hace valiosa la señal a nivel de nombre individual: cuando una acción individual imprime uno en ausencia de una señal de índice, el movimiento es específico del nombre en lugar de del mercado.

**¿Es el cruce dorado estándar inútil?**
No inútil, pero de menor ventaja. El cruce estándar (en una tendencia alcista existente) funciona más como un filtro de "la tendencia está intacta" que como una señal de entrada. Úsalo como chequeo de régimen a nivel de cartera ("más de mis posiciones están por encima de la SMA de 200 días que por debajo") en lugar de como disparador a nivel de nombre individual.

**¿Por qué es mejor la variante underwater?**
Dos razones. (1) Captura *cambio de régimen* en lugar de continuación — históricamente la configuración de mayor ventaja. (2) Es más rara, lo que significa que sufre menos de sobre-operación. Los inversores discrecionales que operan cada cruce estándar corren una estrategia de alta rotación y baja ventaja; los inversores que esperan cruces underwater corren una estrategia de menor rotación y mayor ventaja.

**¿Puedo operar opciones sobre un cruce dorado?**
Puedes, pero el timing importa. La volatilidad implícita en torno al cruce a menudo está incorporando algún nivel de reconocimiento de tendencia. La estructura más limpia es posicionarse *antes* del cruce usando la configuración underwater como disparador de watchlist, más una lectura sobrevendida de RSI y una ruptura de nivel de precio como disparador de entrada. Comprar calls *en* el cruce a menudo paga una prima por el titular.

**¿Qué temporalidad usa el screener?**
Barras diarias por defecto — coincidiendo con la convención estándar para el cruce 50/200. El screening de cruce semanal (MA 50 semanas vs MA 200 semanas) está disponible vía prompt de chat — útil para posicionamiento de muy largo plazo pero menos accionable. El screening de cruce intradía no se aflora porque la señal se degrada bruscamente en temporalidades cortas.
