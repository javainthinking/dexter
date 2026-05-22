---
title: Cómo rastrear una cartera multi-acción con indicadores técnicos en PickSkill
description: Tutorial de 5 pasos para configurar una cartera, superponer ocho dimensiones de indicadores técnicos, y usar dashboards generados por IA (MACD, KDJ, divergencia, flujo de capital) para detectar señales en segundos.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: El equipo de investigación de PickSkill — construyendo un analista IA para inversores particulares.
pillar: how-to
tags:
  - tutorial
  - portfolio
  - indicators
  - macd
  - kdj
heroImage: /blog/track-a-portfolio-with-indicators/hero.png
heroAlt: Infografía editorial mostrando una cartera multi-acción con ocho dimensiones de indicadores técnicos
---

Los inversores particulares chocan con el mismo muro: tienen 8–15 posiciones, quieren saber cuáles están en un punto de inflexión técnica (cruce MACD, KDJ sobreventa, divergencia RSI, flujo anormal), pero leer el gráfico de cada posición todos los días es insostenible. Este tutorial muestra cómo configurar una cartera en PickSkill, superponer ocho dimensiones de indicadores, y conseguir un dashboard de un vistazo que solo te haga hacer zoom en los nombres que de verdad merecen atención.

### Puntos clave

- **Ocho dimensiones de indicadores** out of the box: precio, fundamentales, sentimiento, flujo de capital, divergencia, KDJ, MACD, soporte/resistencia.
- **Un dashboard, cada posición.** Cada dimensión renderiza como reporte HTML ordenable sobre todas las holdings.
- **Refresh on demand** o actualizaciones programadas. Los reportes default son HTML cacheado contra el último cierre.
- **Funciona en US, HK y A-shares.**
- **Usa [/portfolios](/portfolios)** para holdings y [/indicators](/indicators) para dashboards — chat es la forma de pedir nuevas vistas.

## Por qué importa

Rastrear 12 nombres × 8 dimensiones a mano = 96 lookups por día. La mayoría comprime eso a "miro las pocas posiciones que me preocupan", lo que significa que las señales de las posiciones que NO te preocupan se escapan silenciosamente. Los dashboards convierten 96 lookups en un escaneo: ves los 12 × 8 en una página, ordenable, con los momentos de inflexión resaltados.

## El flujo de 5 pasos

### Paso 1 — Crear o elegir una cartera

Ve a [/portfolios](/portfolios) y crea o usa una existente. Una cartera es un bucket con nombre de holdings (ticker + acciones + base de coste opcional).

Si ya añadiste holdings vía lenguaje natural ("añade 100 NVDA a $135 a mi cartera principal"), ya están ahí.

### Paso 2 — Elegir las dimensiones que te importan

| Dimensión | Pregunta que responde |
|---|---|
| **Precio** | ¿Dónde está cada nombre vs MA 5/20/60? |
| **Fundamentales** | PE / PB / Yield / FCF Yield por holding |
| **Sentimiento** | Sentimiento de noticias + acción de analistas |
| **Flujo de capital** | Flujo institucional neto últimos 5–20 días |
| **Divergencia** | Divergencia precio-vs-volumen o precio-vs-RSI |
| **KDJ** | Sobreventa Stochastic (J<0) / sobrecompra (J>100) |
| **MACD** | Golden/death cross + momentum histograma |
| **Soporte/Resistencia** | Posiciones bajo coste, nombres en resistencia |

Los cuatro de más palanca para retail: Precio, MACD, Flujo de capital, Divergencia.

### Paso 3 — Abrir un chat y pedir un dashboard

```text
Para mi cartera "Tech Largecaps":
- Corre el dashboard MACD
- Resalta las posiciones en golden cross o death cross hoy
- Ordena por fuerza del histograma
```

PickSkill saca el listado de la cartera, corre MACD contra los bars más recientes de cada nombre, genera el dashboard como HTML descargable, y te muestra los nombres en inflección inline.

### Paso 4 — Cross-reference con otras dimensiones

```text
De los nombres que marcaste en golden cross MACD, cuáles también:
- ¿Flujo de capital positivo últimos 5 días?
- ¿Divergencia alcista (precio baja, RSI sube)?
- ¿Por encima de su MA 60 días?
```

Este es el workflow real — apila señales para acotar 12 candidatos a 2–3.

### Paso 5 — Programar el dashboard si es útil

```text
Corre este dashboard MACD para "Tech Largecaps" cada día tras el cierre US.
Envíame email solo cuando ≥1 posición cruce.
```

> **Pruébalo ahora.** [Crea una cartera](/portfolios), luego [abre un chat](/chat) y pega el prompt del Paso 3.

## Dimensiones de indicadores que conviene conocer

- **MACD** — cruce de EMA 12 sobre EMA 26 con línea de señal 9. Golden cross = momentum alcista; death cross = bajista.
- **KDJ** — variante de Stochastic con la línea J amplificando extremos. J<0 sobreventa, J>100 sobrecompra.
- **Divergencia** — precio hace nuevo máximo pero RSI no (bajista), o nuevo mínimo pero RSI no (alcista).
- **Flujo de capital** — flujo institucional neto, disponible para HK y A-shares vía datos de exchange, aproximado para US desde block-trades.

## Lo que no puedes hacer así

- **Señales intradía.**
- **Estrategias de opciones.**
- **Auto-ejecutar órdenes.**

## Cómo complementa al foundation cluster

El foundation cluster ([DCF](/blog/what-is-dcf), [WACC](/blog/what-is-wacc), [FCF](/blog/what-is-fcf), [10-K](/blog/how-to-read-10k)) es **investigación fundamental**. Este tutorial es **monitoreo técnico**. Casi todos los workflows retail se benefician de ambos.

## FAQ

**¿Tengo que configurar carteras manualmente?**
No — añade holdings vía lenguaje natural en `/chat` y PickSkill las sincroniza a [/portfolios](/portfolios). O sube CSV.

**¿Qué tan fresca es la data?**
US: cierre del día. A-shares y HK: intradía. Flujo de capital: end-of-day en todos los mercados.

**¿Puedo correr dashboards a través de múltiples carteras?**
Sí — "corre el MACD dashboard a través de todas mis carteras, agrupado por cartera".

**¿Funciona en A-shares?**
Sí — KDJ y MACD son particularmente populares en A-shares retail, y el engine maneja tickers `600519.SS`, `000333.SZ` correctamente.

**¿Cómo configuro email programado?**
Desde el chat: "corre este dashboard MACD cada día tras cierre US, email si ≥1 cross".
