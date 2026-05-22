---
title: Cómo resumir cualquier 10-K en 60 segundos con PickSkill
description: Tutorial de 4 pasos que lleva el último 10-K de cualquier empresa cotizada en EE. UU. desde EDGAR a través de MD&A + Estados financieros + diff de Riesgos a un walk-through de 90 segundos.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: El equipo de investigación de PickSkill — construyendo un analista IA para inversores particulares.
pillar: how-to
tags:
  - tutorial
  - 10-k
  - filings
  - workflow
heroImage: /blog/summarise-a-10k-in-60-seconds/hero.png
heroAlt: Infografía comparando leer un 10-K a mano (30 min) versus PickSkill (60 seg)
---

La [guía para leer un 10-K](/blog/how-to-read-10k) muestra las cuatro secciones del informe anual que realmente importan (Items 7, 8, 1A, y las notas que esos te lleven a chequear). Ese es un ejercicio de 30 minutos por tu cuenta. Este tutorial recorre el mismo flujo en 60 segundos con PickSkill — highlights del MD&A, los tres números de estados financieros que importan, un diff de Factores de Riesgo contra el filing del año anterior, y una lista de notas para perseguir. Cada afirmación está enlazada a la página del filing original.

### Puntos clave

- **Cuatro pasos, ~60 segundos.** Abre un chat, pega el prompt, obtén un walk-through de 90 segundos, pide follow-ups.
- **MD&A en lenguaje claro.** No el parafraseo de la empresa — PickSkill extrae el comentario operativo sustantivo.
- **Tres números financieros** automáticos: [FCF](/blog/what-is-fcf), deuda neta, crecimiento de ingreso YoY por segmento.
- **Diff de Factores de Riesgo** contra el 10-K del año anterior — solo el lenguaje nuevo o cambiado sustancialmente, el boilerplate inmutable se suprime.
- **Con enlaces a fuente.** Cada afirmación y número está a un click del documento original en SEC EDGAR.

## Por qué importa

Un inversor que de verdad lee 10-Ks obtiene una ventaja significativa sobre el que solo lee notas de prensa de resultados — pero leer un filing de 200 páginas es una inversión real de tiempo, y las partes que importan están dispersas. Este tutorial quita la fase de búsqueda.

## El flujo de 4 pasos

### Paso 1 — Abre un chat

Ve a [/chat](/chat) e inicia sesión (un click, prueba gratis).

### Paso 2 — Pega el prompt

```text
Resume el último 10-K de NVDA. Dame:
- Highlights del MD&A (drivers de ingreso YoY, lenguaje de liquidez)
- FCF, deuda neta, crecimiento de ingreso por segmento
- Cambios en Factores de Riesgo vs. el año pasado — solo nuevos o sustancialmente cambiados
- Notas que debería perseguir
- Enlaces a las páginas fuente para cada afirmación
```

### Paso 3 — Espera ~30 segundos

PickSkill:
1. Saca el último 10-K (y el del año anterior, para el diff) de [SEC EDGAR][edgar].
2. Extrae Item 7 (MD&A) y localiza "Liquidity and Capital Resources".
3. Extrae los tres estados financieros; computa [FCF](/blog/what-is-fcf), deuda neta, crecimiento por segmento.
4. Difde Item 1A contra el filing del año anterior palabra a palabra, surface solo lo nuevo o cambiado sustancialmente.
5. Marca 1–3 notas con más probabilidad de revelaciones materiales nuevas.
6. Escribe el resultado como walk-through streaming de 90 segundos con cada afirmación enlazada a la página fuente.

[edgar]: https://www.sec.gov/edgar

### Paso 4 — Pide follow-ups

Aquí el tutorial separa un resumen de un flujo de investigación:

```text
El diff de Factores de Riesgo mencionó "concentración de clientes" — saca el
lenguaje exacto y dime qué cliente referencia (cross-check con segmentos).
```

```text
El MD&A notó que los márgenes operativos se comprimieron YoY — desglosa si
fue COGS, SG&A o R&D. Muéstrame el delta YoY de cada uno.
```

```text
¿Cuál es el muro de vencimientos de deuda de la empresa los próximos 3 años?
Saca de la nota de calendario de deuda.
```

PickSkill mantiene el filing en contexto, así cada follow-up recupera directamente del mismo documento.

> **Pruébalo ahora.** [Abre un chat](/chat) y pega el prompt del Paso 2 con cualquier ticker US.

## Cómo es el output

| Sección | Qué obtienes |
|---|---|
| **MD&A** | 4–6 bullets cubriendo drivers de ingreso YoY, movimiento de márgenes, comentario sobre liquidez. |
| **Estados financieros** | 3 números: FCF TTM, deuda neta más reciente, crecimiento de ingreso YoY por segmento. |
| **Diff Factores de Riesgo** | Una lista corta de *solo* los nuevos o cambiados sustancialmente. |
| **Notas a vigilar** | 1–3 números de nota + una frase de por qué cada una merece lectura. |
| **Enlaces fuente** | Cada línea con "[source]" a la página exacta del filing en EDGAR. |

## Lo que no puedes hacer en 60 segundos

- **Análisis forense completo** — encontrar irregularidades de reconocimiento de ingresos o capitalización agresiva.
- **Leer el proxy (DEF 14A)** — compensación ejecutiva y partes vinculadas en filing separado.
- **Verificar cada afirmación independientemente.** El walk-through es punto de partida.

## Por qué este tutorial complementa al explainer

La [guía 10-K](/blog/how-to-read-10k) enseña qué buscar en cada sección — eso es el framework. Este tutorial quita la fricción de llegar ahí. Lee el explainer una vez; usa el tutorial cada vez que investigues un nombre nuevo.

El mismo patrón se repite en la foundation cluster:
- [¿Qué es el DCF?](/blog/what-is-dcf) → [Build a DCF in 60 Seconds](/blog/build-dcf-in-60-seconds)
- [¿Qué es el WACC?](/blog/what-is-wacc) — cubierto en el tutorial DCF
- [¿Qué es el FCF?](/blog/what-is-fcf) — número #1 arriba
- [Cómo leer un 10-K](/blog/how-to-read-10k) → este tutorial

## FAQ

**¿Funciona en Hong Kong y A-shares?**
Sí — PickSkill reconoce tickers HKEx (e.g. `9988.HK`) y tira el informe anual de HKEx Disclosure. A-shares de Cninfo.

**¿Qué tan preciso es el diff de Factores de Riesgo?**
Sustancialmente preciso a nivel de párrafo. PickSkill hace alineación a nivel de oración y suprime ediciones cosméticas.

**¿Puedo correrlo en 10-Q?**
Sí — di "resume el último 10-Q". El diff de Risk Factors es menos útil en 10-Q (las empresas raramente refrescan Item 1A), pero el delta de MD&A vs trimestre anterior es alta señal.

**¿Y si el filing es muy largo?**
Un 10-K típico es 150–300 páginas. PickSkill maneja hasta ~500. Para conglomerados con 10-Ks masivos el flujo tarda 2–3 minutos.

**¿De dónde saca PickSkill los filings?**
Directo de [SEC EDGAR](https://www.sec.gov/edgar) para US, HKEx Disclosure para HK, Cninfo para A-shares. Sin intermediarios.
