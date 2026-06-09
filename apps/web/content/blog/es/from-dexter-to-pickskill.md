---
title: 'De Dexter a PickSkill: construir sobre un agente open-source'
description: >-
  Cómo construimos PickSkill sobre Dexter, el agente de finanzas open-source —
  añadiendo una web app, generación de Word/PowerPoint/Excel y una suite de
  cartera de 8 indicadores.
publishedAt: 2026-06-09
updatedAt: 2026-06-09
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: El equipo de investigación de PickSkill — construyendo un analista IA para inversores particulares.
pillar: build-in-public
tags:
  - open-source
  - dexter
  - ai-analyst
  - architecture
  - build-in-public
heroImage: /blog/from-dexter-to-pickskill/hero.png
heroAlt: >-
  Infografía editorial — un diagrama de arquitectura antes/después que muestra a
  Dexter, el agente CLI open-source, a la izquierda, fluyendo hacia la web app
  de PickSkill a la derecha, con nuevas capas para la generación de archivos
  Office y la suite de indicadores de cartera.
---

**PickSkill nació como un fork de [Dexter](https://github.com/virattt/dexter), el agente de finanzas autónomo open-source de [@virattt](https://twitter.com/virattt) — "Claude Code, pero construido para investigación financiera".** Dexter nos dio un bucle de agente probado en batalla: una herramienta CLI, escrita en TypeScript con Ink y LangChain, que descompone una pregunta financiera en un plan de investigación, ejecuta herramientas contra datos de mercado en vivo, revisa su propio trabajo e itera hasta tener una respuesta con fuentes. Tomamos ese núcleo y construimos hacia fuera — una web app nativa del navegador, generación nativa de Word/PowerPoint/Excel, gestión de cartera y una suite de indicadores técnicos de ocho dimensiones. Este post es el relato honesto build-in-public de qué conservamos, qué añadimos y por qué.

### Puntos clave

- **PickSkill está construido sobre Dexter**, el agente de finanzas open-source (licencia MIT, [github.com/virattt/dexter](https://github.com/virattt/dexter)). Conservamos el bucle de agente; reconstruimos casi todo lo demás a su alrededor.
- **El mayor cambio individual fue la superficie.** Dexter es un CLI; PickSkill es una web app multi-idioma en [pickskill.ai](https://pickskill.ai). El runtime del agente es compartido; el modelo de interacción no.
- **Añadimos generación nativa de Office** — el agente ahora escribe archivos `.docx`, `.pptx` y `.xlsx` reales, no capturas de pantalla ni volcados de Markdown.
- **Añadimos gestión de cartera y un dashboard de ocho indicadores** — MACD, pila de MA, RSI, KDJ, Bollinger Bands, ADX/DMI, volumen y flujo de capitales, cada uno con un [rastro de señal de 5 días](/blog/5-day-signal-trail).
- **Extendimos la cobertura a los mercados de EE. UU., Hong Kong y acciones A** con convenciones específicas por mercado — incluyendo el enmascarado de las barras de límite (limit-up / limit-down) de acciones A para que no disparen señales falsas.

## ¿Qué es Dexter, y por qué partir de open source?

Dexter es un agente IA open-source para investigación financiera profunda, escrito en TypeScript con Ink (React para la terminal) y LangChain. Su tesis de diseño es simple: tomar una pregunta financiera compleja, convertirla en un plan de investigación paso a paso, ejecutar cada paso con la herramienta adecuada contra datos en vivo, autovalidarse y refinar hasta que la respuesta sea sólida y con fuentes. Corre en una terminal, registra cada llamada a herramienta en un scratchpad y persiste las elecciones de modelo y proveedor en una config local. El repositorio tiene licencia MIT y es público en [GitHub](https://github.com/virattt/dexter).

Partir de Dexter en lugar de empezar desde cero fue una decisión GTM deliberada. La parte más difícil de un agente analista no es el cuadro de chat — es el bucle que planifica, llama herramientas y reconcilia datos financieros en vivo sin alucinar cifras. Dexter ya había resuelto ese bucle en abierto. Construir sobre él significó que pudimos dedicar nuestros primeros meses a la *superficie de producto* — la web app, los outputs de archivo, la capa de cartera — en lugar de volver a derivar la plumería de agente que un sólido proyecto open-source ya había demostrado.

## Qué añadimos sobre Dexter

La tabla siguiente mapea la herencia. La columna izquierda es la contribución de Dexter; la derecha es lo que PickSkill añadió para convertirlo en un producto de consumo.

| Capa | De Dexter (open source) | Añadido por PickSkill |
|---|---|---|
| **Bucle de agente** | Planificación de tareas, ejecución de herramientas, autorreflexión, logging en scratchpad | Estado de sesión multi-tenant, cuota + facturación, memoria entre sesiones |
| **Superficie** | CLI interactivo (Ink/React en terminal) | Web app de navegador, 8 idiomas, layout móvil, enlaces compartibles |
| **Datos** | Financieros + datos de mercado en vivo | Cobertura de EE. UU. + Hong Kong + acciones A, enmascarado de barras de límite, proxy de flujo de capitales |
| **Output** | Texto de terminal + scratchpad JSONL | `.docx` / `.pptx` / `.xlsx` nativos vía OfficeCLI sobre enlaces presignados |
| **Análisis** | Razonamiento financiero on-demand | Gestión de [/portfolios](/portfolios) + dashboard de [/indicators](/indicators) con 8 dimensiones |

El patrón de esa tabla es toda la estrategia: conservar el núcleo probado, productizar todo lo que toca un inversor particular.

## Cómo la versión web cambió la arquitectura

Pasar de un CLI a una web app no es un reskin de UI — cambia el modelo de threading. Un agente CLI posee la terminal: un usuario, una sesión, output bloqueante, archivos locales. Un agente web sirve a muchos usuarios de forma concurrente, hace streaming de output parcial a un navegador, persiste el historial de sesión en el servidor y escribe artefactos en almacenamiento de objetos en lugar del disco local.

Así que aunque el *bucle de agente* se hereda de Dexter, el runtime que lo rodea es nuevo. Las sesiones son multi-tenant y reanudables — puedes cerrar la pestaña y retomar la misma conversación de investigación más tarde. El output de las herramientas se transmite al navegador a medida que ocurre, igual que Dexter transmite a la terminal. Y los archivos generados aterrizan en Cloudflare R2 como enlaces de descarga presignados de 7 días en lugar de en un directorio local, porque un usuario web no tiene una shell desde la que hacer `cat` a un archivo. El planteamiento honesto: Dexter nos dio el cerebro; la web app es un cuerpo nuevo construido para llevarlo a usuarios no técnicos.

> **Míralo en acción.** Abre [/chat](/chat) y haz cualquier pregunta financiera — el bucle de agente con el que estás hablando es el de Dexter, productizado para el navegador.

## Por qué importa la generación de archivos Office

La capacidad más solicitada que el CLI de Dexter no tenía eran los *entregables*. Una respuesta en terminal es genial para quien corrió la query; es inútil para el colega, el club de inversión o el comité de entrevistas que necesita algo que pueda abrir. Los analistas retail y semi-pro viven en Word, PowerPoint y Excel — esos tres formatos son la capa universal de intercambio de las finanzas.

Así que añadimos OfficeCLI: el agente ahora compila su análisis en archivos OpenXML nativos. No capturas de pantalla, no PDFs, no Markdown — memos `.docx` reales con encabezados y tablas, decks `.pptx` reales con gráficos embebidos y títulos de diapositiva editables, y libros `.xlsx` reales con fórmulas en vivo entre hojas y formato condicional. Cada archivo se entrega como un enlace presignado de 7 días. Escribimos tres tutoriales paso a paso para los flujos más habituales: [exportar una cartera a PowerPoint](/blog/export-portfolio-to-powerpoint), [exportar un informe a Excel](/blog/export-portfolio-report-to-excel) y [generar un deck para inversores desde un chat](/blog/generate-investor-deck-from-chat).

## Gestión de cartera y la suite de ocho indicadores

Dexter responde preguntas de una en una. PickSkill añade análisis *permanente*: una cartera que mantienes en [/portfolios](/portfolios) y un dashboard de indicadores en [/indicators](/indicators) que corre de forma continua sobre cada posición. El dashboard computa ocho dimensiones técnicas sobre el cierre más reciente:

1. **MACD** — momentum y estado de cruce ([qué es MACD](/blog/what-is-macd))
2. **Medias móviles** — pila MA5 / MA20 / MA60 y [cruce dorado / cruce de la muerte](/blog/what-is-golden-cross-death-cross)
3. **RSI(14)** — sobrecompra / sobreventa ([qué es RSI](/blog/what-is-rsi))
4. **KDJ(9,3,3)** — momentum estocástico, popular en acciones A ([qué es KDJ](/blog/what-is-kdj))
5. **Bollinger Bands(20,2)** — envolvente de volatilidad ([qué es Bollinger Bands](/blog/what-is-bollinger-bands))
6. **ADX/DMI(14)** — fuerza de tendencia ([qué es ADX](/blog/what-is-adx))
7. **Relación volumen / precio** ([análisis de volumen](/blog/what-is-volume-analysis))
8. **Proxy de flujo de capitales** ([qué es flujo de capitales](/blog/what-is-capital-flow))

Cada dimensión viene con un [rastro de señal de 5 días](/blog/5-day-signal-trail) — cinco puntos que muestran cómo evolucionó la categoría a lo largo de la semana bursátil, para que leas trayectoria, no solo la foto de hoy. Y como cubrimos acciones A, el dashboard detecta las barras de límite (limit-up / limit-down / halt, donde el máximo iguala al mínimo) y las enmascara como neutrales, para que una barra degenerada nunca produzca una señal alcista o bajista falsa.

## Qué conservamos de Dexter — y qué cambiamos

Conservamos la filosofía que define a Dexter: output con fuentes o no cuenta, asunciones editables sobre respuestas de caja negra, y un bucle de agente que se autovalida. Esos principios se mapean directamente sobre nuestra promesa GTM — *PickSkill es el analista IA que investiga, modela y redacta trabajo de equity en lenguaje claro.*

Lo que cambiamos es todo lo que toca un usuario no técnico. La capa de proveedor se generalizó — Dexter soporta múltiples proveedores de modelo, y PickSkill viene con la familia gpt-5.5 de OpenAI por defecto mientras soporta Anthropic, Google Gemini, xAI y Ollama local a través de la misma superficie de agente. Añadimos facturación, memoria, UI multi-idioma y la capa de entregables. Para el panorama más amplio de dónde la IA en investigación de equity realmente aporta palanca hoy, ver [IA para investigación de acciones en 2026](/blog/ai-for-stock-research-2026).

## Qué sigue

Algunos puntos del roadmap público, en el mismo espíritu build-in-public:

- **Re-exportaciones programadas** — autorrefresca un libro de cartera o un deck con cierta cadencia y te lo entrega, en lugar de re-ejecutar el prompt a mano.
- **Extracción de transcripts de earnings calls** — la sección de Q&A, donde vive la señal forward-looking, no solo las declaraciones preparadas.
- **Más mercados** — Tokio e India a continuación, cada uno una integración de 2–3 meses para acertar con el extractor de filings y las convenciones de indicadores.

Si hay un workflow gap que quieres resuelto, [dínoslo](/feedback) — el roadmap responde a lo que los usuarios realmente necesitan.

## FAQ

**¿PickSkill es lo mismo que Dexter?**
No. PickSkill está construido sobre el bucle de agente open-source de Dexter, pero es un producto separado. Dexter es una herramienta CLI de investigación para desarrolladores; PickSkill es una web app alojada con cuentas, facturación, gestión de cartera, generación de archivos Office y cobertura multi-mercado. Conservamos el núcleo de agente de Dexter y su filosofía de "output con fuentes", y luego construimos un producto de consumo a su alrededor.

**¿Dexter es open source, y puedo usarlo directamente?**
Sí. Dexter tiene licencia MIT y es público en [github.com/virattt/dexter](https://github.com/virattt/dexter). Puedes clonarlo, correrlo en tu terminal y usarlo para investigación financiera hoy mismo. PickSkill existe para quienes quieren el mismo poder de agente sin correr un CLI — en un navegador, con entregables y una capa de cartera.

**¿Qué añadió PickSkill realmente sobre Dexter?**
Cuatro capas principales: una superficie de web app multi-idioma, generación nativa de Word/PowerPoint/Excel vía OfficeCLI, gestión de cartera con un dashboard de ocho indicadores y rastro de señal de 5 días, y cobertura de mercados de EE. UU./HK/acciones A con enmascarado de barras de límite. El bucle de agente subyacente de planificar-ejecutar-validar se hereda de Dexter.

**¿Qué modelos de IA usa PickSkill?**
El predeterminado es la familia gpt-5.5 de OpenAI. PickSkill también soporta modelos de Anthropic, Google Gemini, xAI y Ollama local a través de la misma superficie de agente, heredando el diseño multi-proveedor de Dexter. La elección de modelo no cambia el workflow — el output con fuentes y las asunciones editables se mantienen entre proveedores.

**¿Por qué construir sobre un proyecto open-source existente en lugar de desde cero?**
La parte difícil de un agente analista es el bucle que planifica, llama herramientas y reconcilia datos en vivo sin alucinar — Dexter ya lo había demostrado en abierto. Construir sobre él nos dejó dedicar nuestros primeros meses a la superficie de producto que tocan los usuarios reales (web app, archivos Office, dashboard de cartera) en lugar de volver a derivar la plumería de agente.
