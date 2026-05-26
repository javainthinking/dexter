---
title: Cómo exportar un informe de cartera a Excel en 60 segundos
description: >-
  Genera un libro de Excel multi-hoja desde tu cartera de PickSkill —
  posiciones, indicadores, valoración, registros de señales. Fórmulas reales,
  tablas ordenables, listo para compartir.
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
  - Excel
  - Cartera
  - Exportar
  - Workflow
heroImage: /blog/export-portfolio-report-to-excel/hero.png
heroAlt: >-
  Infografía editorial — maqueta de hoja de cálculo con varias pestañas de hojas
  (Holdings · Indicators · Signal Trail · Valuation · Trade Log) y celdas con
  formato condicional.
---

**Un libro de Excel real con análisis de cartera solía significar una hora sacando tickers y precios, una hora cruzando indicadores y una tercera hora dando formato al output para que alguien más pueda usarlo.** Este tutorial muestra el mismo flujo en 60 segundos — cada celda con datos en vivo, cada fórmula real, cada hoja estructurada como los analistas comparten libros realmente. El `.xlsx` descargado es un archivo de trabajo: ábrelo, ordena cualquier columna, construye pivots, compártelo con un colega. Nada es una captura; nada es un volcado plano.

Es un tutorial de 4 pasos. Cada paso es un prompt o un clic. Si tienes una cartera configurada en PickSkill, puedes correr todo el flujo en menos de un minuto.

### Puntos clave

- **4 pasos, ~60 segundos.** Abre la cartera, haz clic en exportar, elige Excel, actualiza en tu hoja de cálculo preferida.
- **Cada valor tiene fuente en datos en vivo** — precios de feeds de mercado, indicadores calculados sobre el cierre más reciente, financieros de los últimos filings.
- **El libro es multi-hoja y estructurado para filtrar** — Posiciones, Indicadores, Registro de Señales, Valoración, plantilla de Trade Log.
- **Compatible con Excel, Google Sheets, LibreOffice Calc, Numbers.** Formato OpenXML en todo — sin bloqueo de plataforma.
- **Funciona en posiciones de EE. UU., HK y acciones A** con las convenciones de mercado adecuadas por hoja.

## Por qué importa

Excel sigue siendo el formato universal de intercambio para análisis de cartera. Los PDFs son solo lectura; las presentaciones tienen forma de presentación; un hilo de chat no se ordena. El libro de Excel es el único formato con el que de verdad puedes *trabajar* colaborativamente — construir pivots, añadir columnas, cruzar con tus propios datos.

PickSkill comprime el paso de ensamblar el libro en un único clic para que tu tiempo vuelva al análisis. Tres casos de uso inmediatos:

- **Tu propio panel personal de cartera.** Guarda el libro, re-exporta semanalmente y tienes un registro continuo de cómo han evolucionado los indicadores.
- **Compartir con colaboradores.** Amigos, un club de inversión, un socio — cualquiera con Excel puede abrir y contribuir al mismo archivo.
- **Construir tu propio análisis personalizado encima.** El libro exportado es tu punto de partida; añade encima tus propias columnas, escenarios y notas sin reconstruir la base.

## El flujo de 4 pasos

### Paso 1 — Abre la cartera que quieres exportar

Ve a [/portfolios](/portfolios). Elige la cartera que quieres convertir en libro. (Para configuración por primera vez, ver [Seguir una cartera con indicadores](/blog/track-a-portfolio-with-indicators).)

El libro escala bien en distintos tamaños de cartera — desde una watchlist de 3 nombres hasta una cartera diversificada de 50 nombres. Carteras más grandes producen una hoja de Indicadores más gruesa pero la estructura se mantiene consistente.

### Paso 2 — Haz clic en "Exportar a Excel"

La página de detalle de la cartera tiene un grupo de botones "Exportar al chat" en la cabecera. Haz clic en el botón de Excel. PickSkill abre un chat con un prompt prerelleno que incluye el contexto de la cartera.

El prompt por defecto produce un libro de 5 hojas. Para personalizar antes de enviar:

- **Añade indicadores específicos u omite otros**: "Incluye solo MACD, RSI y la pila de MA — salta Bollinger y KDJ". Útil cuando la audiencia no está familiarizada con ciertos indicadores.
- **Añade fundamentales**: "Incluye los últimos 4 trimestres de ingresos y BPA por posición". La hoja de fundamentales aparece en el libro.
- **Añade escenarios**: "Añade una hoja de escenarios con precios objetivo bull / base / bear por posición". Se añade una hoja de escenarios en blanco para que la rellenes.

### Paso 3 — Espera ~30 segundos mientras PickSkill ensambla el libro

PickSkill hace, en orden:

1. Tira precio actual, métricas intradía e historia de precio (por defecto 6 meses) para cada posición.
2. Ejecuta la suite completa de indicadores ([MACD](/blog/what-is-macd), [RSI](/blog/what-is-rsi), [KDJ](/blog/what-is-kdj), [bandas de Bollinger](/blog/what-is-bollinger-bands), [ADX](/blog/what-is-adx), pila de MA, [volumen](/blog/what-is-volume-analysis), [flujo de capitales](/blog/what-is-capital-flow)).
3. Detecta el estado actual de señales y el registro de categorías a 5 días por dimensión.
4. Tira múltiplos y ratios de valoración (P/E, P/B, EV/EBITDA, rentabilidad por dividendo).
5. Renderiza todos los valores en un libro multi-hoja estructurado.
6. Añade fórmulas de Excel para cruzar entre hojas de modo que los cambios se propaguen.
7. Escribe el resultado en un archivo `.xlsx` con sparklines embebidos y formato condicional.

Verás un resumen en streaming del trabajo. Cuando termine, obtendrás un enlace de descarga válido 7 días.

### Paso 4 — Abre en Excel y personaliza

El `.xlsx` descargado es un archivo de trabajo real. Ábrelo en cualquier herramienta de hojas de cálculo. Ediciones inmediatas habituales:

- **Ordena por fuerza de señal** — haz clic en la cabecera de la columna de puntuación de categoría.
- **Añade una columna de notas** — cada hoja tiene una columna de notas a la derecha para anotaciones personales.
- **Construye una tabla pivote** — pivota las posiciones por sector o categoría de señal para un corte distinto de los datos.
- **Añade tus propias columnas** — el libro está diseñado para extenderse; nada se rompe cuando añades campos.

Para ediciones mayores, vuelve al chat y pide una actualización específica:

```text
Añade una hoja mostrando el rendimiento a 1 mes, 3 meses y 6 meses de cada 
posición contra el benchmark SPY.
```

```text
Rehaz la hoja de indicadores con un esquema de color heatmap — verde para 
categoría alcista, rojo para bajista, ámbar para neutral.
```

```text
Añade una hoja de screening que marque cada posición con divergencia activa 
en MACD Y RSI Y KDJ simultáneamente.
```

PickSkill re-ejecuta el ensamblaje del libro con la nueva estructura y te entrega una nueva descarga.

> **Pruébalo ahora.** [Ve a /portfolios](/portfolios), entra en cualquier cartera y haz clic en "Exportar a Excel". Todo el bucle está por debajo del minuto.

## Cómo es el output

La estructura por defecto de 5 hojas:

| Hoja | Contenido |
|---|---|
| **1. Posiciones** | Una fila por posición — ticker, nombre, mercado, peso, precio actual, cambio del día, cambio a 5 días, cambio a 1 mes, valor de la posición, notas. Ordenable. |
| **2. Indicadores** | Una fila por (posición × indicador) — valor actual, etiqueta de categoría, registro de categoría a 5 días, anotación de señal. Cruces con la hoja de Posiciones. |
| **3. Registro de Señales** | Una fila por posición — la evolución completa de 5 días en las 8 dimensiones de indicadores, con las transiciones de categoría resaltadas. |
| **4. Valoración** | Una fila por posición — P/E, P/E forward, P/B, EV/EBITDA, rentabilidad por dividendo, medianas del sector para comparación. |
| **5. Trade Log** | Hoja en blanco preformateada — columnas para fecha, ticker, acción, cantidad, precio, racional. Para tu propio diario de operaciones, prerelleno con la lista de posiciones. |

Las hojas están enlazadas: cambiar un ticker en la hoja de Posiciones (p. ej. renombrar una cabecera de columna) no rompe los cruces en las otras hojas. Añadir filas al Trade Log no invalida el resto del libro.

## Prompts de seguimiento habituales

Una vez que tienes el libro base, estos prompts añaden más valor:

- *"Añade una hoja de Riesgo — métricas de concentración, exposiciones sectoriales, matriz de correlación entre posiciones."*
- *"Añade una hoja de Watchlist con 10 tickers que podría añadir a esta cartera, rankeados por su configuración técnica actual."*
- *"Añade una hoja de Macro — VIX, rendimiento del 10 años, índice del dólar, petróleo — para que pueda correlacionar el comportamiento de la cartera con drivers macro."*
- *"Convierte las etiquetas de categoría de indicadores en puntuaciones numéricas (−2 a +2) para que pueda calcular promedios de señal a nivel de cartera."*
- *"Haz el mismo libro para otra cartera y fusiona los dos para poder comparar lado a lado."*

Cada prompt dispara una generación fresca del libro.

## Lo que no puedes hacer en 60 segundos

Salvedades honestas:

- **Arquitecturas de fórmulas personalizadas.** Si necesitas una estructura de fórmula específica de Excel (rangos con nombre con convenciones específicas, referencias entre libros, VBA personalizado), las añadirás manualmente sobre la exportación.
- **Actualizaciones en tiempo real.** El libro es una instantánea en el momento de la exportación. PickSkill no empuja actualizaciones en vivo a un archivo Excel ya abierto. Para refrescar, re-exporta desde el chat — toma 30 segundos.
- **Macros pesadas / scripting VBA.** El output son datos y fórmulas. Las macros, ribbons personalizados y lógica VBA condicional siguen siendo adiciones manuales.
- **Conexión directa con tu cuenta de bróker.** PickSkill no tira datos de posiciones en vivo de brókeres de terceros; la lista de posiciones viene de tu cartera mantenida manualmente en [/portfolios](/portfolios).

## Cómo funciona por dentro

Para los técnicamente curiosos:

- PickSkill ensambla primero la estructura del libro (una lista de hojas, columnas, valores de datos y fórmulas).
- Los datos de cada hoja se generan usando la misma lógica de backend que alimenta los paneles de [/indicators](/indicators).
- El archivo `.xlsx` se escribe usando el formato OpenXML — cada celda, fórmula, formato condicional y sparkline es un objeto Excel real.
- Las referencias entre hojas usan notación A1 estándar para que funcionen en cualquier herramienta de hojas de cálculo compatible.

El output se comporta como un libro construido a mano para fines de edición y compartición pero se genera en segundos.

## FAQ

**¿Necesito tener Excel instalado para usar el output?**
No — el archivo `.xlsx` se abre en Excel, Google Sheets, LibreOffice Calc, Apple Numbers o cualquier herramienta compatible con OpenXML. Todas las fórmulas estándar (SUM, AVERAGE, IF, INDEX, MATCH) funcionan en estas herramientas; PickSkill evita funciones específicas de Excel en la exportación por defecto.

**¿Las fórmulas se actualizan en vivo cuando abro el libro?**
Las fórmulas se actualizan contra las propias celdas del libro (cambios en una celda se propagan a las dependientes). *No* tiran datos de mercado nuevos en vivo — eso requeriría una conexión de datos activa. Para refrescar los datos subyacentes, re-exporta desde el chat.

**¿Puedo compartir el libro con alguien que no tenga cuenta de PickSkill?**
Sí — el libro es un archivo autónomo. Una vez descargado, compártelo como compartas normalmente archivos Excel (email, drive en la nube, Slack). El destinatario no necesita cuenta de PickSkill para abrirlo o usarlo.

**¿Funciona para carteras con posiciones en acciones A o HK?**
Sí. El libro reconoce tickers HKEx (`9988.HK`, `0700.HK`) y tickers de acciones A (`600519.SS`, `000333.SZ`) y aplica convenciones apropiadas al mercado. Las barras de día de límite (acciones A) se marcan en la hoja de Registro de Señales para que las señales técnicas de esas barras se traten como outliers.

**¿Cómo consigo que este libro se actualice automáticamente cada semana?**
Dos opciones. La forma simple: marca la sesión de chat como favorita y re-ejecuta el prompt de exportación semanalmente — PickSkill reconstruye el archivo con los últimos datos. La forma más automatizada (en diseño): workflows programados que re-ejecuten la exportación según un calendario y te envíen por email el archivo actualizado — ver el [documento de diseño de workflows](/blog) para la próxima funcionalidad.

**¿Puedo añadir mis propios indicadores personalizados al libro?**
La hoja de Indicadores está estructurada para que puedas añadir columnas para tus propias métricas a la derecha. Los cruces entre hojas no se romperán. Para que PickSkill calcule la métrica por ti, pídelo en el chat — la mayoría de las variaciones habituales (distintos periodos de indicadores, distintos umbrales de categoría, señales personalizadas) pueden añadirse a petición.
