---
title: Cómo construir un DCF en 60 segundos con PickSkill — tutorial paso a paso
description: Tutorial de 4 pasos para construir un DCF completo sobre cualquier acción US, HK o A-share en menos de un minuto — cada hipótesis con fuente, cada partida enlazada al 10-K, y el Excel listo para descargar.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: El equipo de investigación de PickSkill — construyendo un analista IA para inversores particulares.
pillar: how-to
tags:
  - tutorial
  - dcf
  - valuation
  - workflow
heroImage: /blog/build-dcf-in-60-seconds/hero.png
heroAlt: Infografía editorial comparando el tiempo de construir un DCF en Excel vs. en PickSkill — una barra de 60 minutos junto a una diminuta barra de 60 segundos
---

Construir un DCF en Excel a mano es un ejercicio de una hora: descargar cuatro 10-K, copiar las partidas, proyectar cinco años, estimar un [WACC](/blog/what-is-wacc), calcular el valor terminal, montar la tabla de sensibilidad. Este tutorial muestra el mismo flujo en PickSkill en menos de un minuto — cada input con su fuente, cada partida enlazada al filing, y el Excel listo para descargar. La matemática es idéntica a lo que harías a mano; lo que cambia es el tiempo que pasas recopilando datos frente al tiempo que pasas en los juicios que de verdad mueven la respuesta.

Es un tutorial de 4 pasos. Cada paso es un prompt o un clic. Si has leído [¿Qué es el DCF?](/blog/what-is-dcf) ya conoces el marco — esta guía solo te lleva por el producto.

### Puntos clave

- **Cuatro pasos, ~60 segundos.** Abre un chat, pega el prompt, edita cualquier hipótesis en línea, descarga el Excel.
- **Cada input tiene fuente.** Tipo libre de riesgo desde la curva de Treasuries actual; ERP y beta sectorial del dataset trimestral de Damodaran; historial de FCF de los últimos cuatro 10-Q/10-K (fuente: SEC EDGAR).
- **Cada hipótesis es editable.** Sobrescribe crecimiento de ingresos, margen EBIT terminal, WACC o método de valor terminal en el mismo chat — PickSkill re-corre el modelo en vivo.
- **Funciona en US, Hong Kong y A-shares.** PickSkill tira del filing adecuado por mercado.
- **El output es un `.xlsx` real** — no una captura. Ábrelo en Excel, compártelo con tu equipo o pégalo en tu deck.

## Por qué importa

La razón por la que la mayoría de inversores particulares no construye DCFs no es la dificultad conceptual — es la fricción. Para cuando has encontrado el último 10-K, descargado los datos suplementarios y montado la hoja de proyección, ya has gastado una hora antes de tocar el primer juicio. PickSkill comprime esa hora en segundos para que pases tu tiempo donde importa: en las cuatro hipótesis que de verdad mueven la valoración (crecimiento de ingresos, margen terminal, WACC, valor terminal — ver [¿Qué es el DCF?](/blog/what-is-dcf)).

Una regla razonable: si un DCF va a decidir si actúas sobre una posición, las hipótesis merecen al menos 20 minutos de reflexión. Gastar 60 minutos en plomería de datos no es una inversión en calidad — es un impuesto. Este tutorial elimina el impuesto.

## El flujo de 4 pasos

### Paso 1 — Abre un chat

Ve a [/chat](/chat). Si no has iniciado sesión, es un clic — gratis para probar, sin tarjeta.

### Paso 2 — Pide el DCF

Pega este prompt (cambia el ticker por el que estés investigando):

```text
Construye un DCF a 5 años para NVDA en Excel.
Incluye: hoja de hipótesis, proyección de FCF a 5 años, WACC con sensibilidad,
y un resumen de valoración con el precio por acción implícito.
Dime los cuatro inputs que debería vigilar.
```

Eso es todo. Sin configuración de ticker, sin elegir plantilla, sin formulario campo por campo.

### Paso 3 — Espera ~30 segundos mientras PickSkill trabaja

PickSkill hace, en orden:
1. Tira el último 10-K más los cuatro 10-Q anteriores de [SEC EDGAR][edgar] (o HKEx / Cninfo para nombres de HK / A-shares).
2. Extrae las partidas de cuenta de resultados, flujos y balance.
3. Calcula el [FCF](/blog/what-is-fcf) histórico (OCF − Capex) de los últimos cuatro ejercicios.
4. Tira el rendimiento del Treasury a 10 años actual como tipo libre de riesgo.
5. Tira la ERP sectorial y la beta sectorial más recientes de Damodaran.
6. Construye el WACC.
7. Proyecta los siguientes cinco años usando tasas históricas de crecimiento como punto de partida.
8. Calcula el valor terminal con Gordon Growth y múltiplo de salida.
9. Escribe el resultado en un `.xlsx` con vínculos de fórmulas entre hojas.

[edgar]: https://www.sec.gov/edgar

Verás un resumen en streaming mientras avanza, con cada filing extraído enlazado. Cuando termine, tendrás un enlace de descarga válido 7 días, además de un walk-through en el chat de las cuatro hipótesis.

### Paso 4 — Edita cualquier hipótesis y re-corre en vivo

Aquí empieza el trabajo de verdad. Cada una de las cuatro hipótesis que mueven el DCF es editable en línea:

```text
Sube el margen EBIT terminal al 38% y re-corre la tabla de sensibilidad.
```

```text
Usa la ERP implícita (4,2%) en lugar de la histórica y enséñame el nuevo
WACC y cómo cambia el precio implícito.
```

```text
Stress-test al crecimiento de ingresos — baja Y4 e Y5 al 10% y enséñame el
caso a la baja.
```

PickSkill re-corre la misma plantilla Excel con los nuevos inputs y te da el diff. Sin re-subir, sin infierno de plantilla.

> **Pruébalo ahora.** [Abre un chat](/chat) y pega el prompt del Paso 2. El bucle completo está por debajo del minuto.

## Cómo es el output

El `.xlsx` descargado contiene cuatro hojas:

| Hoja | Contenido |
|---|---|
| **Assumptions (Hipótesis)** | Crecimiento de ingresos (Y1–Y5), trayectoria de margen EBIT, tipo impositivo, capex / ingresos, variación de circulante, inputs del WACC, método de valor terminal. Cada celda con nota de fuente. |
| **Projection (Proyección)** | Año a año: ingresos, EBIT, NOPAT, capex, ΔNWC, FCF, FCF descontado. Fórmulas enlazadas a Assumptions. |
| **Sensitivity (Sensibilidad)** | Cuadrícula `(WACC, crecimiento terminal)` mostrando el precio implícito en ±150 bp de WACC y ±100 bp de crecimiento. Celda base resaltada. |
| **Summary (Resumen)** | Conclusión — precio implícito (base, bajo, alto) vs. actual; las cuatro hipótesis; enlace al prompt que generó el archivo. |

Ábrelo en Excel o Google Sheets. Las fórmulas son vivas; sobrescribe cualquier cosa y la proyección se actualiza.

## Prompts de seguimiento útiles

Una vez que tienes el caso base, estos prompts mueven la aguja:

- *"Añade un quinto año de detalle — enséñame el camino del ingreso actual al ingreso del año 5, desglosado por segmento."*
- *"Corre un DCF inverso — ¿qué crecimiento de ingresos implica el precio actual?"*
- *"Compara mi DCF con consenso. ¿Dónde son mis hipótesis más tensas / más laxas que la media sell-side?"*
- *"Convierte este DCF en un one-pager para un lector no técnico. Incluye casos toro / oso / base con una frase cada uno."*
- *"Ahora haz el mismo DCF para AMD y ponlo en la misma hoja para comparar."*

Cada uno dispara una re-ejecución; el Excel se regenera con el nuevo contenido.

## Lo que no puedes hacer en 60 segundos

Salvedades honestas:

- **Proyecciones por segmento a medida** que requieren modelar unit economics (precio × volumen × geografía por línea de producto) suelen llevar más de 60 segundos. PickSkill puede hacerlo — solo necesitarás 3–5 minutos de ida y vuelta describiendo la segmentación.
- **DCFs de M&A con sinergias** que necesitan un modelo de deal junto al DCF standalone requieren subir los términos; las partes standalone son 60 segundos, la lógica del deal es otra conversación.
- **Nombres sin filings recientes** (IPO reciente, emisor extranjero con listing US) pueden tener una serie histórica por defecto más delgada. PickSkill te lo dice y ofrece usar estimaciones.
- **Decisiones que pesan más que el modelo.** Un DCF es un marco, no un oráculo. Usa este tutorial para quitar fricción de plomería, no para externalizar el juicio.

## FAQ

**¿Necesito subir algún dato?**
No. PickSkill tira todo de fuentes públicas (SEC EDGAR para US, HKEx para Hong Kong, Cninfo para A-shares) más feeds de mercado. Subir solo es relevante si quieres superponer tu propio modelo privado o tus notas.

**¿Qué precisión tienen las hipótesis por defecto?**
Los defaults están sourceados y son intencionalmente neutrales — son un punto de partida, no una respuesta final. Crecimiento por defecto = CAGR a 3 años; margen EBIT terminal por defecto = media a 3 años; WACC en vivo de las tablas sectoriales de Damodaran. El sentido del Paso 4 es precisamente sobrescribir los defaults con tu visión.

**¿Puedo guardar el DCF y volver más tarde?**
Sí — la sesión de chat persiste. Re-abre la conversación y pide "re-corre el DCF con el último 10-Q que acabo de ver" y PickSkill retoma donde lo dejaste, con el nuevo filing incorporado.

**¿Funciona en HK y A-shares?**
Sí. PickSkill reconoce tickers HKEx (p.ej. `9988.HK`, `0700.HK`) y A-shares (`600519.SS`, `000333.SZ`) y tira los filings adecuados por mercado (anuales / interinos / trimestrales). En A-shares, el tipo libre de riesgo por defecto es el CGB a 10 años; en HKEx, es el Treasury a 10 años (la mayoría de los HKEx se valoran de facto contra la curva en dólares).

**¿Qué hay de comparar con consenso?**
Añade *"…y compara cada input con las estimaciones de consenso"* al prompt original. PickSkill tira consenso de feeds de mercado y te enseña qué hipótesis están en, por encima o por debajo de la media sell-side. El puente entre tu visión y consenso es donde vive la mayoría del alpha — y de la mayoría del riesgo.

**¿Dónde aprendo el marco del DCF en sí?**
Empieza por [¿Qué es el DCF?](/blog/what-is-dcf) para el marco de valoración absoluta, [¿Qué es el WACC?](/blog/what-is-wacc) para la tasa de descuento que decide todo en silencio, y [¿Qué es el FCF?](/blog/what-is-fcf) para la capa de proyección de flujos. Para los 10-K que alimentan los inputs, [Cómo leer un 10-K en 30 minutos](/blog/how-to-read-10k) es la guía compañera. Este tutorial asume esos marcos; no los reemplaza.
