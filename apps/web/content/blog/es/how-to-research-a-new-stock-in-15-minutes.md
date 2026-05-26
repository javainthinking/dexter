---
title: Cómo investigar una nueva acción en 15 minutos con PickSkill
description: >-
  Un flujo completo de investigación de primer pase — modelo de negocio,
  finanzas, valoración, setup técnico y riesgos — en 15 minutos con las
  herramientas de chat e indicadores.
publishedAt: 2026-05-26T00:00:00.000Z
updatedAt: 2026-05-26T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: >-
    El equipo de investigación de PickSkill — construyendo un analista IA para
    inversores particulares.
pillar: how-to
tags:
  - Tutorial
  - Investigación
  - Flujo de trabajo
  - DCF
  - 10-K
  - Indicadores
heroImage: /blog/how-to-research-a-new-stock-in-15-minutes/hero.png
heroAlt: >-
  Infografía editorial — flujo de investigación en 5 pasos a la izquierda
  (negocio → finanzas → valuación → técnico → riesgos), tarjeta de decisión de
  una página para TSM a la derecha.
---

**Una sesión de primer pase de investigación de acción que solía tomar 2–3 horas puede completarse en 15 minutos con el flujo correcto.** No porque te saltes pasos — el marco sigue cubriendo modelo de negocio, finanzas, valoración, setup técnico y riesgos — sino porque PickSkill comprime el paso de recopilación de datos a segundos y te deja con los 15 minutos que realmente necesitas: los juicios. Este tutorial es el flujo canónico de primer pase. Úsalo para cualquier nombre nuevo que estés considerando, antes de decidir si añadirlo a una watchlist o comprometer más tiempo de investigación.

### Puntos clave

- **5 pasos, ~15 minutos en total.** Negocio → finanzas → valoración → técnico → riesgos. Cada paso es un prompt.
- **El marco fuerza pensamiento estructurado** — sin saltarse a "¿debería comprar esto?" antes de responder las preguntas upstream.
- **Produce un resumen de una página** adecuado para añadir a una [watchlist](/blog/how-to-build-a-watchlist-that-actually-works) o rechazar el nombre.
- **La versión rápida (15 minutos) captura el 80% de los dealbreakers.** La versión lenta (2+ horas de trabajo profundo) solo se necesita después de que la rápida diga "interesante".
- **Funciona en nombres de EE. UU., HK y acciones A** con el mismo flujo — PickSkill extrae los filings apropiados por mercado.

## Por qué importa esto

La mayoría de inversores minoristas tropiezan en la etapa de investigación de primer pase. Dos fallos comunes:

1. **Saltar directamente al gráfico.** "El gráfico tiene buena pinta" no es una tesis. Sin el chequeo subyacente de modelo de negocio y finanzas, estás comprando un patrón de precio.
2. **Ahogarse en detalle.** Leer el 10-K completo, el 8-K, la última transcripción de earnings call y cada informe de analistas antes de decidir si un nombre merece siquiera trabajo más profundo. Para cuando terminas, has pasado 4 horas en un nombre que habrías rechazado en la primera hora con un marco estructurado.

El flujo de primer pase de 15 minutos es el filtro de rechazo. La mayoría de los nombres que investigues no lo pasarán. El objetivo es dedicar 15 minutos por nombre y reservar la inmersión profunda de 2 horas para los nombres que pasen.

## El flujo en 5 pasos

### Paso 1 — Modelo de negocio (3 minutos)

Abre [/chat](/chat). Pega este prompt:

```text
Resume [TICKER] en 5 bullets:
1. Qué hace realmente la empresa (1 frase)
2. Desglose de ingresos — top 3 segmentos y su % del total
3. Top 3 clientes o concentración de clientes
4. Top 3 competidores  
5. La pregunta única más importante que este negocio necesita acertar
```

PickSkill devuelve un resumen conciso del modelo de negocio construido a partir del último 10-K y notas de prensa recientes. El marco de "pregunta única más importante" fuerza claridad sobre qué impulsa realmente al negocio — una buena prueba de si entiendes la empresa o solo el ticker.

**Banderas rojas en esta etapa**: modelo de negocio no claro tras 5 bullets, concentración de clientes superior al 30% en un solo cliente, sin foso competitivo visible. Para aquí si ves esto; el nombre no merece los próximos 12 minutos.

### Paso 2 — Salud financiera (3 minutos)

Siguiente prompt:

```text
Para [TICKER], extrae los últimos 4 trimestres y últimos 3 años de:
- Ingresos y crecimiento de ingresos YoY
- Trayectoria del margen bruto
- Trayectoria del margen operativo  
- Flujo de caja libre (últimos 4 trimestres)
- Posición de deuda neta (efectivo − deuda total)
- Cambio YoY en número de acciones (recompras vs emisión)
```

PickSkill lo renderiza como una tabla pequeña. La historia financiera debería ser coherente en un minuto de lectura.

**Banderas rojas en esta etapa**: crecimiento de ingresos desacelerando bruscamente, márgenes comprimiéndose sin causa clara, flujo de caja libre negativo que no es por inversión intencional en crecimiento, número de acciones subiendo un 5%+ anualmente sin actividad de adquisición.

### Paso 3 — Snapshot de valoración (3 minutos)

Siguiente prompt:

```text
Para [TICKER], calcula:
- P/E trailing y forward actuales, EV/EBITDA, P/B
- Rango histórico de 5 años para cada múltiplo (percentil 10–90)
- Dónde se sitúan los múltiplos actuales dentro de ese rango histórico
- Compara los múltiplos actuales con 3 pares más cercanos
- DCF rápido a 5 años — precio implícito en hipótesis base
```

PickSkill devuelve los múltiplos, la comparación de pares y un DCF rápido (ver [Construye un DCF en 60 segundos](/blog/build-dcf-in-60-seconds) para la versión completa).

**Banderas rojas en esta etapa**: cada múltiplo en la parte alta de su rango de 5 años sin aceleración clara en fundamentales que lo justifique; precio implícito por DCF más del 30% por debajo del actual; valoración relativa más alta que cada par.

### Paso 4 — Setup técnico (3 minutos)

Siguiente prompt:

```text
Para [TICKER], muéstrame el setup técnico actual:
- Precio vs MA de 20 / 60 / 200 días
- Lecturas actuales de MACD, RSI, KDJ
- Cualquier divergencia activa (regular u oculta)
- Niveles de soporte y resistencia más cercanos
- Registro de buckets de 5 días en toda la suite de indicadores
```

PickSkill extrae los datos de [/indicators](/indicators) y muestra la alineación multi-señal.

**Banderas rojas en esta etapa**: entrada profundamente sobrecomprada (RSI > 75, cada indicador anclado alto), divergencia bajista formándose, precio extendido muy por encima de la SMA de 200 días. Estos no son setups de compra-ya; son nombres para esperar a pullback.

### Paso 5 — Riesgos (3 minutos)

Prompt final:

```text
Para [TICKER], lista:
- Top 3 riesgos de la sección de factores de riesgo del último 10-K
- Top 3 riesgos de las earnings calls recientes (últimos 4 trimestres)
- Un escenario adverso — ¿cómo se ve esta acción si el caso alcista se equivoca?
```

PickSkill resume los factores de riesgo del 10-K y los comentarios recientes de la dirección. La pregunta del escenario adverso es la que la mayoría del minorista se salta — y la que captura los errores más caros.

**Banderas rojas en esta etapa**: los riesgos declarados por la dirección incluyen concentración en un único cliente, presión regulatoria, estrés de balance, o cualquier lenguaje de "going concern". Estos no son descalificadores automáticos pero deberían reenmarcar la conversación de sizing de posición.

## Cómo compilar la salida

Después del paso 5, pregunta:

```text
Compila esta conversación en un resumen de una página que pueda guardar:
- Modelo de negocio en 2 frases
- Trayectoria financiera en 4 bullets
- Resumen de valoración con 3 líneas alcista/base/bajista
- Estado del setup técnico
- Top 3 riesgos
- Decisión: watchlist, investigación más profunda o pasar
```

PickSkill devuelve una página estructurada. Guárdala vía el bookmark de la sesión de chat. Si decides poner el nombre en la [watchlist](/blog/how-to-build-a-watchlist-that-actually-works), la página única se convierte en tu documento de tesis.

> **Pruébalo ahora.** Abre [/chat](/chat) y ejecuta los 5 prompts anteriores en un nombre que estés considerando. Todo el loop son ~15 minutos incluyendo tiempo de lectura.

## Qué captura el flujo que la investigación ad-hoc pierde

### 1. Rechazo estructural vs rechazo movido por precio

La investigación ad-hoc a menudo rechaza nombres basándose en la apariencia del gráfico ("parece sobrecomprado") sin verificar si el negocio merece siquiera ser poseído a cualquier precio. El flujo estructurado invierte el orden: negocio → finanzas → valoración → técnico. Si el negocio o las finanzas fallan, el gráfico no importa; si negocio y finanzas pasan, el gráfico te dice sobre timing, no sobre viabilidad.

### 2. La pregunta del escenario adverso

El paso más omitido en la investigación minorista es "¿cómo se ve el caso bajista?" El flujo estructurado lo fuerza. Sin él, sobreponderas el caso alcista y subpreparas para la varianza.

### 3. Síntesis multi-fuente en un solo lugar

El flujo extrae datos del 10-K, resultados recientes, múltiplos actuales, comparación de pares y estado técnico en una sola sesión de chat. Cada pieza tomaría entre 10 y 20 minutos recopilar manualmente — PickSkill comprime cada una a segundos, dejando tiempo para el pensamiento real.

## Cuatro trampas en la investigación de acciones

1. **Saltarse el paso del modelo de negocio.** Conocer el ticker de una acción no es conocer la empresa. Sin el resumen de 5 bullets, estás operando un ticker, no investigando un negocio.
2. **Ignorar el escenario adverso.** Los casos alcistas se venden solos; los casos bajistas necesitan ser surfaced deliberadamente. Si no puedes articular el caso bajista, no has hecho la investigación.
3. **Tratar "todo verde" como compra.** Una acción con fundamentales fuertes, valoración atractiva y buen técnico no es automáticamente una compra — a veces es un nombre donde el dinero fácil ya se ha hecho y los próximos 12 meses son planos. Sizing de posición y disciplina de nivel de entrada importan.
4. **No comprometer la salida a una watchlist o rechazo.** El objetivo entero del primer pase de 15 minutos es la toma de decisión al final. "Necesito pensarlo" es el asesino — consume ancho de banda mental sin producir una decisión. Fuérzate a aterrizar en watchlist, investigación más profunda o pasar.

## Cómo se aplica esto en acciones A

El flujo funciona idénticamente en nombres A-share y HK. Dos ajustes específicos:

- Para acciones A, el "扣非净利润" (beneficio neto excluyendo no recurrente) es la cifra de beneficios relevante; PickSkill usa esto por defecto al calcular el P/E y el crecimiento del BPA de acciones A.
- Los múltiplos de valoración de acciones A son estructuralmente más bajos que los de pares estadounidenses para la mayoría de sectores. Compara con el rango histórico A-share, no con el equivalente estadounidense.

Ver [Mejores indicadores para acciones A](/blog/best-indicators-for-a-shares) para el playbook más amplio específico de mercado.

## Prompts de seguimiento habituales

Tras el primer pase de 15 minutos:

- *"DCF más profundo en [ticker] — tabla completa de sensibilidad, proyección de ingresos a nivel de segmento."*
- *"Compara [ticker] con sus 3 pares más cercanos en la pila completa de múltiplos y crecimiento de FCF."*
- *"Genera un deck para inversores de [ticker] a partir de esta conversación."* (Ver [Genera un deck para inversores desde un chat](/blog/generate-investor-deck-from-chat).)
- *"Añade [ticker] a mi watchlist con esta tesis: [...]"*
- *"Programa una revisión de [ticker] para la próxima publicación de resultados."*

## Lecturas adicionales

- [Construye un DCF en 60 segundos](/blog/build-dcf-in-60-seconds) — la inmersión profunda en valoración cuando el primer pase de 15 minutos pasa.
- [Cómo leer un 10-K en 30 minutos](/blog/how-to-read-10k) — la versión manual de lectura profunda de los pasos 1 + 2.
- [Cómo construir una watchlist que realmente funciona](/blog/how-to-build-a-watchlist-that-actually-works) — adonde van los nombres del primer pase exitoso a continuación.

## FAQ

**¿Por qué 15 minutos — no es demasiado rápido para una acción?**
Para una decisión de primer pase sí/no, 15 minutos es más que suficiente — la mayoría de nombres deberían ser rechazados en esta etapa. El trabajo profundo (modelar hipótesis específicas, leer cada filing reciente de la SEC, hablar con ex-empleados) se reserva para el pequeño subconjunto de nombres que sobrevive al primer pase. Pasar 4 horas en cada nombre con el que te topas es el modo de fallo dominante de los inversores minoristas motivados.

**¿Puedo investigar múltiples nombres en paralelo?**
Sí — PickSkill soporta sesiones de chat en paralelo. Muchos usuarios abren 3–5 sesiones simultáneamente y ejecutan la misma plantilla de 5 prompts en cada una. La estructura hace práctica la investigación por lotes.

**¿Qué pasa si PickSkill no tiene datos sobre el nombre?**
PickSkill cubre la mayoría de los nombres listados en EE. UU. (NYSE / NASDAQ), HK (HKEx) y acciones A (SSE / SZSE). Para nombres muy pequeños o recién listados, la cobertura puede ser más fina — PickSkill te dirá qué puntos de datos no están disponibles en lugar de fabricarlos.

**¿Debería guardar las sesiones de chat?**
Sí — cada sesión de chat en PickSkill es persistente. Marca las sesiones de investigación útiles para referencia posterior. Cuando decidas tomar una posición, la sesión de chat es la pista de auditoría de cómo llegaste a la tesis.

**¿En qué se diferencia esto de la investigación genérica con ChatGPT?**
El chat de PickSkill está anclado en filings en vivo, datos de mercado e indicadores calculados — no en los datos de entrenamiento del modelo. ChatGPT alucinará cifras de ingresos y ratios P/E; PickSkill las extrae de fuentes primarias en el momento de la consulta. La diferencia estructural importa más en los pasos financiero y de valoración, donde números obsoletos o fabricados pueden cambiar por completo la conclusión.
