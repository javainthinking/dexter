---
title: DCF vs Comparable Company Analysis — Cuándo usar cuál
description: El DCF valora flujos futuros; los Comps valoran el múltiplo presente. Cuándo usar cada uno, modos de fallo, por qué los profesionales triangulan ambos.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: El equipo de investigación de PickSkill — construyendo un analista IA para inversores particulares.
pillar: explainer
tags:
  - valuation
  - dcf
  - comparables
  - fundamentals
heroImage: /blog/dcf-vs-comparable-company-analysis/hero.png
heroAlt: Infografía comparando DCF (valoración absoluta) y análisis de compañías comparables (valoración relativa) en un marcador
---

Los dos métodos que todo analista de equity aprende primero son **DCF** (flujo de caja descontado) y **análisis de compañías comparables** (Comps, múltiplos de cotización). Responden a la misma pregunta — ¿cuánto vale esta acción? — por caminos completamente distintos. DCF es **absoluto**: construye el valor a partir del propio cash futuro de la empresa. Comps es **relativo**: pone precio a la empresa contra lo que el mercado paga hoy por empresas similares. Saber en cuál apoyarse es la diferencia entre un modelo que sobrevive a la revisión y uno que no.

Esta guía repasa la comparación lado a lado, cuándo funciona mejor cada método, los modos de fallo de cada uno, y por qué la mayoría de los analistas sell-side y buy-side corren los dos y triangulan.

### Puntos clave

- **DCF pone precio al cash futuro; Comps pone precio al múltiplo presente.** Misma pregunta, marcos completamente diferentes.
- **Usa DCF cuando**: el negocio es estable para proyectar 5+ años de cash, tienes una visión sobre márgenes a largo plazo, quieres testear "¿se equivoca el mercado?".
- **Usa Comps cuando**: el negocio cambia demasiado rápido para una previsión a largo plazo, necesitas un sanity check, estás comparando con pares, o la estructura de múltiplos del sector es el pilar del argumento.
- **La mayoría de modelos profesionales corren los dos** y reportan el spread. Una brecha persistente de 30%+ entre DCF y Comps es en sí misma una señal — normalmente sobre la selección del peer-set o las hipótesis del margen terminal.
- **PickSkill corre los dos** — `/chat` produce un DCF y una tabla de Comps en paralelo desde un solo prompt, con el spread y una lectura en una frase.

## ¿Qué es DCF?

**DCF** valora una empresa proyectando su [free cash flow](/blog/what-is-fcf) durante 5–10 años, descontando cada año a hoy con un [WACC](/blog/what-is-wacc), y añadiendo un valor terminal que representa todo lo posterior. La fórmula:

```
EV = Σ FCFₜ / (1 + WACC)ᵗ + TV / (1 + WACC)ⁿ
```

Para el marco completo (las cuatro hipótesis que mueven el 95% de la respuesta, las trampas habituales, el flujo) ver [¿Qué es el DCF?](/blog/what-is-dcf).

DCF es el método **absoluto**: la respuesta no depende de lo que coticen otras empresas. Depende de lo que *esta* empresa se espera que produzca y del tipo de descuento que compensa por el riesgo.

## ¿Qué es el análisis de compañías comparables?

**Comps** valora una empresa aplicando los múltiplos de cotización de un grupo de pares al objetivo. Se eligen 5–10 pares cotizados, se observa lo que el mercado paga por ellos hoy (EV/EBITDA, EV/Sales, P/E, etc.), se aplica al financiero del objetivo, y se despeja el precio implícito.

Esbozo:

```
Rango EV/EBITDA del grupo de pares: 10× – 14× (mediana 12×)
EBITDA NTM del objetivo: $2,0B
EV implícito:            12× × $2,0B = $24B
Menos deuda neta:        $24B − $4B = $20B equity
Precio implícito:        $20B / 200M acciones = $100
```

Para los múltiplos en sí, ver [¿Qué es el P/E?](/blog/what-is-pe-ratio) y [¿Qué es EV/EBITDA?](/blog/what-is-ev-ebitda).

Comps es el método **relativo**: la respuesta es lo que el mercado está dispuesto a pagar hoy por negocios similares. Si todo el sector se re-rateaa, el valor de Comps se mueve con él.

## La comparación lado a lado

| Dimensión | DCF (Absoluto) | Comps (Relativo) |
|---|---|---|
| **Qué valora** | Cash futuro propio de la empresa | Lugar de la empresa en el mercado de hoy |
| **Input clave** | FCF a largo plazo + WACC | Conjunto de pares + múltiplo elegido |
| **Horizonte temporal** | 5–10 años explícitos + perpetuidad | Implícito (mayormente próximos 12 meses) |
| **Sensible a** | Margen terminal, WACC, crecimiento | Selección de pares, elección de múltiplo |
| **Más fuerte cuando** | El cash es estable y previsible | Existen pares y cotizan activamente |
| **Más débil cuando** | El modelo de negocio está en transición | No hay pares limpios, o el sector entero está mispriced |
| **Carácter de la salida** | Valor intrínseco independiente | Valor relativo a pares |
| **Riesgo de re-rating** | Bajo (hipótesis terminales fijas) | Alto (los múltiplos de pares pueden comprimirse rápido) |
| **Escrutinio del revisor** | "Defiende el WACC y el terminal" | "Defiende el peer-set y el múltiplo" |

## Cuándo funciona mejor el DCF

1. **Negocios estables y maduros** con patrones de cash previsibles. Utilities, consumo básico, industriales con demanda asentada.
2. **Tienes una visión defendible sobre márgenes a largo plazo.** El DCF recompensa la convicción sobre el margen EBIT terminal.
3. **Sospechas que el mercado se equivoca.** Si el mercado está poniendo precio basado en ruido a corto, un DCF anclado en el cash a largo es la herramienta adecuada para demostrar la brecha.
4. **Fondos cíclicos.** Comps en un trough cíclico se ve fatal (múltiplos bajos sobre beneficios deprimidos); DCF normaliza a lo largo del ciclo.

DCF falla en negocios en fase temprana, nombres de hipercrecimiento donde las hipótesis a 5 años son adivinanzas, y negocios atravesando un cambio estructural.

## Cuándo funciona mejor Comps

1. **El conjunto de pares está limpio.** Software/SaaS con 10+ pure-plays cotizando activamente. Bancos, donde la contabilidad regulatoria mantiene la comparación estable.
2. **Quieres un sanity check.** Un DCF que implica un 50% por encima del múltiplo de cotización del par más cercano necesita una historia que justifique esa prima.
3. **El re-rating de todo el sector es la tesis.** Comps captura eso — DCF realmente no.
4. **Visibilidad limitada del cash a largo.** Cuando proyectar 7 años es ficción, un múltiplo a 12 meses de pares es más honesto.

Comps falla cuando no existen pares (negocio único), cuando los pares están mispriced como sector (internet en 2000), o cuando el múltiplo elegido es estructuralmente inapropiado (P/E sobre una empresa en pérdidas).

## Modos de fallo habituales

Checklist de 134 palabras:

1. **DCF: la cola del terminal mueve al perro.** El valor terminal es el 60–80% del EV en un DCF típico a 5 años — si eres casual con la tasa de crecimiento terminal o el múltiplo de salida, eres casual con la mayor parte de la respuesta.
2. **DCF: falsa precisión.** Reportar un precio implícito a dos decimales implica una confianza que el modelo no se ha ganado. Reporta un rango.
3. **Comps: cherry-picking del peer-set.** Elegir los 3 pares con múltiplo más alto y llamarlo "mediana" es el abuso más común en research sell-side. Selecciona pares por modelo de negocio, no por múltiplo.
4. **Comps: desajuste entre múltiplo y ciclo.** Aplicar el múltiplo de hoy a una previsión a 2 años asume implícitamente que los múltiplos no cambian. Cambian.
5. **Triangulación sin honestidad.** Reportar "nuestro objetivo es la media de DCF y Comps" sin reconocer cuál confías más es una señal de que estás cubriéndote.

## Por qué los profesionales corren los dos

Los dos métodos son complementarios, no sustitutos. Práctica habitual:

- **Corre DCF.** Obtén un rango de valor intrínseco basado en tu visión de fundamentales.
- **Corre Comps.** Obtén un rango de valor relativo basado en cotización actual de pares.
- **Reporta el spread.** Si DCF dice $100 y Comps dice $75, el spread es la pregunta interesante. Normalmente una de tres cosas:
  - Tu margen terminal es más optimista que lo que implican los beneficios de los pares.
  - El sector está actualmente mispriced (tu visión) y DCF captura el precio "correcto".
  - Tu peer-set está mal — has incluido nombres con economías estructuralmente distintas.

La **conversación de triangulación** — explicar por qué DCF y Comps discrepan — es donde se ve el filo analítico. Un modelo donde DCF y Comps coinciden dentro del 10% suele significar que no se está diciendo nada interesante.

## Cómo PickSkill corre los dos

Abre [/chat](/chat) y escribe:

> *"Valora NVDA usando DCF y comps de múltiplos. Dame el precio implícito de cada uno, el spread, y una frase de dónde viene el spread."*

PickSkill corre el [flujo DCF](/blog/build-dcf-in-60-seconds) (inputs sourceados de filings SEC + Damodaran + rendimientos actuales), construye una tabla Comps desde un peer-set que puedes sobrescribir (default = los pares de segmento del 10-K), y te muestra los dos precios implícitos lado a lado con el spread y el driver dominante de la brecha.

Añade `"…y muéstrame también el spread de EV/EBITDA entre NVDA y la mediana de pares en los últimos 8 trimestres"` para ver si el múltiplo relativo actual es un re-rating reciente o una prima estructural estable.

## FAQ

**¿Qué método es más "correcto"?**
Ninguno. Responden preguntas distintas. DCF pregunta qué vale el flujo de caja en aislado; Comps pregunta qué paga el mercado por flujos similares. Ambos son correctos; discrepan porque usan referencias distintas.

**¿Por qué suelen diferir 20–40%?**
Normalmente: (1) eres más optimista en margen terminal que el mercado en margen run-rate de pares; (2) tu peer-set tiene una mezcla diferente de crecimiento vs. calidad respecto al objetivo; (3) el sector está actualmente mispriced respecto al valor justo a largo plazo. El tamaño de la brecha es informativo; explicarlo es donde el analista se gana el sueldo.

**¿Puedo usar los dos para el mismo target?**
Sí, la mayoría de targets sell-side son un blend ponderado de DCF, Comps y (a menudo) transacciones precedentes. Los pesos son juicio — normalmente 50% DCF / 30% Comps / 20% transacciones para nombres maduros, con más peso a Comps cuando el negocio es demasiado dinámico para proyecciones a largo.

**EV/EBITDA, EV/Sales, P/E — ¿cuál usar en Comps?**
El múltiplo más estable para el sector. Cíclicos capital-intensivos: EV/EBITDA. Software/SaaS con resultado GAAP negativo: EV/Sales o EV/ARR. Negocios maduros y estables: P/E. Bancos: P/Book o P/Tangible Book. Usar P/E en un nombre tech hipercrecimiento sin beneficios es un error clásico.

**¿PickSkill auto-elige el peer-set?**
Sí, con un default — normalmente los nombres que el objetivo lista en la subsección "competition" del Item 1 del 10-K, filtrados por trading activo y líquido. Puedes sobrescribir el peer-set en el chat ("usa estos 6 pares en su lugar") y PickSkill re-corre los Comps con tu conjunto. El peer-set es el input más opinionado en Comps; hacerlo editable es el punto.
