---
title: Cómo generar una presentación para inversores desde un chat en 90 segundos
description: >-
  Convierte una conversación de research en una presentación para inversores —
  tesis, financieros, comparables, riesgos. Un prompt, un PPTX, cada diapositiva
  editable.
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
  - Presentación para inversores
  - PowerPoint
  - Workflow
  - Presentación
heroImage: /blog/generate-investor-deck-from-chat/hero.png
heroAlt: >-
  Infografía editorial — un globo de prompt de chat fluye mediante una flecha
  hacia una diapositiva investor terminada, mostrando el flujo de trabajo
  chat-a-deck.
---

**Una presentación para inversores destila una tesis de research en 10–15 diapositivas que otro inversor puede leer en 5 minutos y formarse una opinión.** Las diapositivas necesitan una declaración de tesis clara, unos pocos gráficos bien elegidos, un resumen de valoración y una sección de riesgos honesta. Este tutorial recorre cómo generar esa presentación directamente desde una conversación de research de PickSkill — cada diapositiva anclada en el trabajo que ya hiciste en el chat, cada gráfico con fuente, el `.pptx` listo para descargar en 90 segundos.

Es un tutorial de 5 pasos. El paso más largo es aquel en el que tomas la decisión real de juicio inversor. Todo lo demás es mecánico.

### Puntos clave

- **5 pasos, ~90 segundos.** Abre un chat, construye la tesis, pide la presentación, edita el prompt, descarga.
- **La presentación se genera desde el historial de chat** — cada gráfico en la presentación cita el momento de la conversación donde se discutió.
- **10–15 diapositivas por defecto.** Portada, tesis, visión del negocio, financieros, valoración, configuración técnica, comparables, escenarios, riesgos, anexo.
- **El output es un archivo `.pptx` real** — edita cualquier diapositiva, presenta desde PowerPoint o Keynote, comparte sin conversión.
- **Funciona en nombres de EE. UU., HK y acciones A.** La presentación adapta las convenciones de disclosure por mercado.

## Por qué importa

El formato de presentación para inversores existe por una razón: obliga al analista a articular la tesis en una estructura que expone los eslabones débiles. Un memo de 15 páginas te deja esconder el hueco entre "me gusta esta acción" y "aquí está por qué le debería importar a alguien más". Una presentación de 12 diapositivas hace esos huecos visibles inmediatamente — y la disciplina de producir una mejora el análisis subyacente aunque nunca enseñes la presentación a nadie.

Se benefician tres audiencias:

- **Un potencial inversor o socio.** La presentación es la forma más eficiente de compartir una tesis para una segunda opinión.
- **Un comité de inversión formal.** Muchos clubs de inversión, family offices y fondos estudiantiles requieren presentaciones en formato presentación para posiciones nuevas.
- **Tu propia disciplina analítica.** Escribir la presentación es el test; compartirla es opcional. Si una tesis no se puede convertir limpiamente en presentación, normalmente tiene huecos ocultos que vale la pena abordar.

## El flujo de 5 pasos

### Paso 1 — Abre un chat y construye la tesis

Ve a [/chat](/chat) y recorre tu research. Una conversación típica de construcción de tesis se ve así:

```text
Construye un DCF a 5 años sobre TSMC. Muéstrame la sensibilidad del WACC.
¿Qué me dice el 10-K sobre la trayectoria del margen bruto?
Compara contra ASML y Lam Research en EV/EBITDA y crecimiento de FCF.
¿Cómo se ve la configuración técnica ahora mismo — MACD, RSI, pila de MA?
```

Los prompts exactos no importan tanto como la *cobertura*. Al final de la conversación deberías tener:

- Una lectura de valoración (DCF, comparables o ambas)
- Una visión de negocio / fundamental (trayectoria de márgenes, drivers de crecimiento, balance)
- Una posición competitiva (frente a 2–3 pares más cercanos)
- Un contexto técnico (régimen de tendencia actual, momentum, niveles clave)

Si no has construido la base, ver [Construir un DCF en 60 segundos](/blog/build-dcf-in-60-seconds), [Resumir un 10-K en 60 segundos](/blog/summarise-a-10k-in-60-seconds) y [Seguir una cartera con indicadores](/blog/track-a-portfolio-with-indicators) para las conversaciones previas.

### Paso 2 — Pide la presentación

Una vez tienes la tesis construida, pide a PickSkill que genere la presentación:

```text
Genera una presentación para inversores de 12 diapositivas a partir de esta conversación. 
Empieza con la tesis en una frase. Luego visión del negocio, financieros, 
valoración (DCF y comparables), configuración técnica, escenarios (bull/base/bear), 
riesgos y un anexo. Haz cada diapositiva lista para presentar.
```

Ese es todo el input. PickSkill usa el historial de la conversación como material fuente de la presentación — cada gráfico, tabla y bullet se traza a un intercambio específico en el chat.

### Paso 3 — Refina la estructura antes de la generación

Antes de que PickSkill se comprometa a generar, verás un esquema propuesto de diapositivas. Ediciones habituales en esta etapa:

- **Reordena diapositivas** — "mueve la configuración técnica a la diapositiva 4, antes de financieros" si presentas a una audiencia de traders.
- **Corta diapositivas** — "salta la diapositiva de comparables; a mi audiencia no le importa la valoración relativa".
- **Añade diapositivas** — "añade una diapositiva sobre calidad del management y track record de asignación de capital".
- **Ajusta profundidad** — "expande la sección de riesgos a 2 diapositivas — primera diapositiva para riesgos fundamentales, segunda para riesgos técnicos / de microestructura de mercado".

El patrón esquema-luego-genera ahorra un ciclo de regeneración. La presentación completa toma 30–60 segundos en ensamblarse; una iteración sobre el esquema toma 5 segundos.

### Paso 4 — Espera mientras PickSkill ensambla la presentación

PickSkill hace, en orden:

1. Compila el historial de chat relevante para la presentación (filtra conversaciones laterales, caminos exploratorios).
2. Tira los últimos datos para cada métrica referenciada — precios, financieros, múltiplos.
3. Renderiza los gráficos (precio + técnico, comparativa de valoración, abanico de escenarios) como imágenes embebidas.
4. Genera el contenido de las diapositivas con las convenciones estándar de presentación para inversores: declaración de tesis en la diapositiva 2, marco de valoración explícito, riesgos como pre-mortem en lugar de enterrados.
5. Compone el `.pptx` con títulos formateados, notas a pie citando fuentes y un anexo final con la procedencia de los datos.

Verás un resumen en streaming. Cuando termine, obtendrás un enlace de descarga válido 7 días.

### Paso 5 — Edita cualquier diapositiva, presenta, itera

El `.pptx` descargado se abre en PowerPoint, Keynote o Google Slides. Cada diapositiva es totalmente editable.

Para ediciones a nivel de presentación, vuelve al chat:

```text
Rehaz la diapositiva 8 (escenarios). Haz el caso alcista más agresivo — sube 
la hipótesis de crecimiento de ingresos del año 3 al 25% en lugar del 15%. 
Muéstrame el nuevo output del DCF.
```

```text
Añade una diapositiva entre la 5 y la 6 con el rango histórico de EV/EBITDA de 
los últimos 5 años y dónde se sitúa el múltiplo actual.
```

```text
Haz una versión de 5 minutos de esta presentación — mantén solo la portada, 
tesis, resumen de valoración y riesgos. Corta todo lo demás.
```

PickSkill re-genera con la nueva estructura.

> **Pruébalo ahora.** [Abre un chat](/chat), recorre una tesis y pide la presentación. Todo el bucle está por debajo de los 2 minutos.

## Cómo es el output

La estructura por defecto de 12 diapositivas:

| Diapositiva | Contenido |
|---|---|
| **1. Portada** | Ticker, nombre de la empresa, presentador, fecha, titular en una frase |
| **2. Tesis** | La tesis en ≤30 palabras, el precio objetivo / visión en una frase, el horizonte temporal |
| **3. Visión del negocio** | Split de ingresos (segmentos / geografías), posición competitiva, movimientos estratégicos recientes |
| **4. Financieros** | Últimos 4 trimestres de ingresos, margen EBIT, FCF, llamadas clave de tendencia |
| **5. Valoración — absoluta** | Resumen DCF con hipótesis clave, precio implícito, cuadrícula de sensibilidad |
| **6. Valoración — relativa** | EV/EBITDA, P/E, P/B vs sector / pares; actual vs rango histórico |
| **7. Configuración técnica** | Gráfico de precio con pila de MA, estado actual de MACD / RSI, niveles clave de soporte / resistencia |
| **8. Escenarios** | Casos bull / base / bear — cada uno con cambios de hipótesis explícitos y precio objetivo resultante |
| **9. Riesgos — fundamentales** | Top 3 riesgos fundamentales (compresión de márgenes, competencia, regulación, ejecución) |
| **10. Riesgos — mercado** | Riesgos técnicos (sobrecompra, divergencia, rupturas de niveles clave), liquidez, exposición a factores |
| **11. Conclusión** | La acción — comprar, mantener, vigilar, evitar — con guía de dimensionamiento y disciplina de nivel de entrada |
| **12. Anexo** | Fuentes de datos, notas metodológicas, disclaimer |

Las diapositivas usan un sistema tipográfico consistente y una paleta de color alineada con la marca diseñada para legibilidad en una sala de reunión (≥18pt en texto de cuerpo, gráficos de alto contraste).

## Lo que no puedes hacer en 90 segundos

Salvedades honestas:

- **Investigación primaria original.** La presentación se construye desde las fuentes de datos de PickSkill y el trabajo en tu chat. Si tu tesis depende de una entrevista de investigación primaria (un channel check con un cliente, una conversación con un ex-empleado), ese contenido necesita adición manual.
- **Modelos de valoración fuertemente personalizados.** Un DCF estándar, una valoración relativa o un marco sum-of-the-parts funciona de salida. Un modelo de opciones reales sobre un pipeline biotech, o un DCF de utility regulada con mecánica de rate-base, requiere más conversación previa personalizada.
- **Disclosure legal de grado regulatorio.** El anexo incluye un disclaimer básico. Si usas la presentación en un contexto regulado (asesor registrado, gestor de fondo), el lenguaje de compliance necesita revisión por counsel — PickSkill no es asesoramiento legal.

## Prompts de seguimiento habituales

- *"Haz una versión one-pager de esta presentación — una sola diapositiva, formato resumen ejecutivo."*
- *"Genera la misma presentación para el competidor más cercano, comparación lado a lado."*
- *"Traduce la presentación a mandarín / japonés / alemán para una audiencia no anglófona."*
- *"Convierte la diapositiva de configuración técnica en una vista multi-temporalidad — gráficos diario, semanal, mensual."*
- *"Añade una diapositiva 'preguntas que espero de la audiencia' al final con respuestas preparadas."*

## FAQ

**¿En qué se diferencia esto del PPT de exportación de cartera?**
La [exportación de cartera](/blog/export-portfolio-to-powerpoint) genera una presentación *a partir de los datos* — posiciones, indicadores, snapshots de valoración, todo renderizado en una estructura estándar. Este tutorial genera una presentación *a partir de una conversación de tesis* — el contenido de las diapositivas lo da forma lo que realmente investigaste y argumentaste, no una plantilla fija. Usa la exportación de cartera para revisiones periódicas de posiciones; usa el flujo chat-a-presentación para pitches de posiciones nuevas.

**¿La presentación cita momentos específicos en el chat?**
Sí — las notas al pie del anexo y los pies de gráfico referencian los momentos prompt-y-respuesta donde se originó el contenido. Esto hace fácil retrazar la cadena analítica cuando defiendes una diapositiva y hace la presentación auditable para cualquiera que revise tu trabajo.

**¿Puedo generar la presentación en otro idioma?**
Sí — añade "en [idioma]" al prompt en el paso 2. PickSkill soporta los 8 idiomas usados en la plataforma. Gráficos, títulos de diapositivas, texto de cuerpo y notas al pie se traducen todos; los valores de datos y los tickers permanecen en su forma nativa.

**¿Y si mi tesis depende de algo que no está en la conversación?**
Añádelo antes de generar: "Nota que he confirmado por separado mediante investigación primaria que el cliente Y está migrando al producto Z para fin de Q3". PickSkill incluye la adición como bullet atribuido en la diapositiva relevante. Cualquier cosa que no esté en la conversación no está en la presentación por diseño — la presentación está anclada en el chat.

**¿Cómo se compara esto con usar ChatGPT o Claude directamente para escribir una presentación?**
La diferencia está en el *anclaje*. El chat de PickSkill ya tiró los filings en vivo, calculó el DCF, ejecutó los indicadores y tiró los comparables. La composición de la presentación se basa en esos primitivos con fuente, no en el conocimiento general del modelo. El resultado es materialmente menos propenso a números fabricados o datos obsoletos, que es el modo de fallo de la generación de presentaciones impulsada por chatbots genéricos.

**¿Puedo guardar la presentación y volver para actualizarla más tarde?**
Sí — la sesión de chat persiste. Reabre la conversación y pide "regenera la presentación con los datos de hoy y añade una diapositiva para la nueva publicación de resultados" — PickSkill reconstruye la presentación con el nuevo contexto superpuesto a la tesis original.
