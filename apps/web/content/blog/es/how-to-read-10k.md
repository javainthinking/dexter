---
title: Cómo leer un 10-K en 30 minutos — lo que Wall Street realmente lee
description: Lo que Wall Street realmente lee en un 10-K SEC. Los 4 Items (de 15) con señal, workflow de lectura de 30 minutos, técnica de diff YoY.
publishedAt: 2026-05-22
updatedAt: 2026-05-22
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: El equipo de investigación de PickSkill — construyendo un analista IA para inversores particulares.
pillar: how-to
tags:
  - filings
  - 10-k
  - fundamentals
  - research-workflow
heroImage: /blog/how-to-read-10k/hero.png
heroAlt: Infografía editorial de un informe 10-K en tonos oscuros cálidos con las cuatro secciones clave resaltadas (Riesgos, MD&A, Estados financieros, Notas) y un cronómetro de 30 minutos
---

Un **10-K** es el informe anual que toda empresa pública cotizada en EE. UU. presenta ante la SEC. Es la fuente más autorizada sobre el negocio — redactado por la dirección bajo responsabilidad legal, auditado donde importa, presentado en un formato estándar. Leído con cuidado, un 10-K responde a casi cualquier pregunta relevante para una decisión de inversión. Leído con descuido, son 150–300 páginas de cliché legal que entierran la señal en ruido.

Esta guía es el flujo de 30 minutos que usan los analistas profesionales: qué cuatro secciones leer en profundidad, qué 100+ páginas puedes pasar por alto y qué preguntas hacerle a cada sección. No necesitas conocimientos previos de contabilidad — no necesitas un máster en finanzas, necesitas un mapa.

### Puntos clave

- **Un 10-K tiene 15 Items numerados repartidos en cuatro Partes.** Cuatro Items hacen el 90% del trabajo; el resto es sobre todo cliché.
- **Orden de lectura: Item 7 (MD&A) → Item 8 (Estados financieros) → Item 1A (Factores de riesgo) → notas que hayas marcado.** Saltarte el Item 1 (descripción del negocio) ahorra 20 minutos y casi no se pierde señal.
- **El estado de flujos de caja es la sección más fiable de todo el documento.** El beneficio puede remodelarse dentro del GAAP; el efectivo entró o no entró.
- **Los Factores de riesgo eran cliché — ya no lo son.** Desde 2020 la SEC ha presionado a las empresas a divulgar riesgos específicos; el lenguaje genuinamente nuevo en el Item 1A es la sección que más leen los inversores profesionales.
- **PickSkill resume un 10-K en ~60 segundos**, con las cuatro secciones que importan extraídas, las partidas enlazadas a su fuente y los deltas año contra año precalculados.

## ¿Qué es un 10-K?

Un 10-K es el informe anual completo que una empresa pública cotizada en EE. UU. presenta ante la [SEC][sec] dentro de los 60–90 días posteriores al cierre de su ejercicio fiscal (según el tamaño del declarante). Contiene los estados financieros auditados, la discusión de la dirección que los enmarca, una divulgación explícita de los factores de riesgo y una serie de notas que explican las elecciones contables detrás de los números.

[sec]: https://www.sec.gov/edgar

Se publica en [EDGAR][edgar] (el sistema de archivos de la SEC) y se descarga gratis. Cada 10-K sigue la misma estructura numerada — Items 1 a 15 repartidos en cuatro Partes —, lo que hace el documento escaneable en cuanto tienes el mapa.

[edgar]: https://www.sec.gov/edgar

El primo trimestral del 10-K es el **10-Q**, que se presenta dentro de los 40–45 días posteriores al cierre de cada trimestre fiscal. El 10-Q es más corto (sin auditoría, sin refresco completo de factores de riesgo), y el flujo de abajo también funciona — solo que con menos profundidad en el MD&A.

## Las cuatro secciones que realmente importan

Un 10-K tiene 15 Items. Lee estos cuatro. Pasa por encima o salta el resto.

### Item 7 — Discusión y análisis de la dirección (MD&A)

**Qué es:** la narrativa propia de la dirección sobre el ejercicio, escrita en prosa. Por qué se movió el ingreso como se movió, qué impulsa los costes, en qué se ha gastado el capex, qué esperan a continuación.

**Tiempo de lectura:** 10–15 minutos. **Cada minuto vale la pena.**

**Qué buscar:**
- Cambio año contra año del ingreso, desglosado por segmento o geografía. Compáralo con el MD&A del año anterior — ¿se citan los mismos factores?
- La subsección "Liquidez y recursos de capital". Es donde la dirección habla de vencimientos de deuda, posición de caja y necesidades de financiación. Una empresa que dedica de repente tres párrafos a la liquidez que no estaban el año pasado está señalando tensión.
- Medidas no-GAAP que la empresa enfatiza (EBITDA ajustado, free cash flow, crecimiento orgánico). Fíjate qué ajustes está haciendo; una lista de "exclusiones" que crece es una bandera amarilla.

### Item 8 — Estados financieros

**Qué es:** los tres estados auditados — cuenta de resultados, balance, estado de flujos de caja — más las notas que explican las partidas.

**Tiempo de lectura:** 10 minutos para los estados, más lectura selectiva de notas.

**Qué mirar, por orden de prioridad:**
1. **Estado de flujos de caja.** Es el menos manipulable. La cabecera del bloque de flujo operativo concilia el beneficio neto con la caja generada por operaciones — cada partida de ajuste es un punto donde el beneficio GAAP difiere de la realidad de caja. (Free cash flow = `OCF − Capex`; ver [¿Qué es el flujo de caja libre?](/blog/what-is-fcf).)
2. **Cuenta de resultados.** Lee de arriba a abajo buscando cambios fuertes en margen bruto, margen operativo y cualquier partida no recurrente en el resultado operativo.
3. **Balance.** Concéntrate en tres líneas: efectivo y equivalentes (frente al año anterior), deuda total y fondo de comercio (grande o creciendo = adquisiciones recientes; comprueba si están ganando su coste de capital).

### Item 1A — Factores de riesgo

**Qué es:** los riesgos que la dirección está obligada a divulgar. Solía ser 5–10 páginas de lenguaje genérico; desde las normas de modernización de la SEC de 2020, se ha empujado a las empresas a divulgar riesgos *específicos*.

**Tiempo de lectura:** 5–8 minutos. El truco es leer *diffs* — qué hay nuevo frente al año pasado.

**Qué buscar:**
- **Factores de riesgo nuevos que no estaban en el filing del año anterior.** Casi siempre tienen significado. Una empresa no añade un factor de riesgo casualmente — añadir lenguaje crea exposición legal, así que el lenguaje nuevo está porque el asesor jurídico insistió.
- Riesgos ligados a **concentración de clientes** (un solo cliente >10% del ingreso), dependencia de cadena de suministro, cambio regulatorio o cumplimiento de covenants de deuda.
- Riesgos que la empresa formula en *plural* — "asuntos litigiosos" vs. "el litigio" — habitualmente indican una disputa activa.

PickSkill diffs automáticamente los Factores de Riesgo contra el filing del año anterior y muestra solo el lenguaje nuevo o sustancialmente cambiado. Es el trozo de mayor señal en un 10-K y el más fácil de pasar por alto al leer de arriba a abajo.

### Las notas que marcaste

**Qué es:** 30–80 páginas de detalle detrás de cada partida — política de reconocimiento de ingresos, definiciones de segmento, leasings, posiciones fiscales, calendario de deuda, retribución basada en acciones, compromisos y contingencias.

**Tiempo de lectura:** dirigido — 5 minutos para las 1–3 notas que marcaste mientras leías los Items 7 y 8.

**Qué buscar:**
- **Reconocimiento de ingresos** (suele ser la Nota 2). Las empresas de suscripción deben detallar sus obligaciones de desempeño y pasivos por contratos — eso te dice sobre el backlog y el riesgo de renovación.
- **Calendario de deuda.** Lista cada línea, su tipo, su vencimiento. Construir un gráfico de "muro de vencimientos" desde esta tabla es la forma más limpia de evaluar el riesgo de refinanciación.
- **Compromisos y contingencias.** Litigios pendientes, obligaciones fuera de balance, compromisos de compra. La contingencia que más quieres encontrar es aquella en la que la dirección está siendo lacónica.
- **Impuesto sobre sociedades.** La conciliación entre tipo estatutario y tipo efectivo. Brechas grandes = intensidad de planificación fiscal; comprueba si los items favorables son sostenibles.

## El flujo de 30 minutos

Secuencia práctica:

1. **2 min — Portada e índice.** Confirma el periodo cubierto, la categoría de declarante (afecta a los plazos) y localiza Items 7, 8 y 1A.
2. **15 min — Item 7 MD&A.** Lee de arriba a abajo. Marca cualquier referencia a notas que quieras seguir. Subraya números que quieras verificar contra el Item 8.
3. **10 min — Item 8 Estados financieros.** Primero flujos de caja, luego cuenta de resultados, después balance. Extrae tres números: FCF, deuda neta y crecimiento de ingreso año contra año por segmento.
4. **5 min — diff del Item 1A.** Compara contra el 10-K del año anterior y lee solo lo nuevo o sustancialmente cambiado.
5. **3 min — notas dirigidas** que marcaste durante el camino.

Sáltate el Item 1 (Negocio) salvo que sea tu primera vez con la empresa — es sobre todo cliché que se repite año a año. Sáltate los Items 9–15 salvo que tengas un motivo concreto (retribución de ejecutivos, gobernanza, etc.).

## Errores frecuentes al leer 10-Ks

134 palabras que merece la pena memorizar:

1. **Leer el Item 1 de arriba a abajo.** Cliché. Sáltatelo salvo que sea tu primer contacto con la empresa.
2. **Fiarte de no-GAAP sin reconciliar.** Busca siempre la tabla de conciliación GAAP a no-GAAP (suele venir tras el MD&A o adjunta como Exhibit 99 al comunicado). El tamaño del puente te dice cuánto está ajustando la dirección.
3. **Ignorar el Informe del auditor.** Una opinión limpia es un párrafo; cualquier cosa más larga es bandera amarilla (cuestiones críticas de auditoría, opinión con salvedades, dudas sobre empresa en funcionamiento).
4. **Leer solo el 10-K actual.** La señal está en el diff frente al año anterior. Los Factores de riesgo, el lenguaje del MD&A y las notas solo significan algo contra su línea base previa.
5. **Saltarte el proxy.** El proxy (DEF 14A) explica retribución de ejecutivos, independencia del consejo y operaciones con partes vinculadas — contexto material que el 10-K no aborda.

## Cómo lee PickSkill un 10-K por ti

Abre un chat y escribe:

> *"Resume el último 10-K de NVDA — dame los highlights del MD&A, el FCF, la deuda neta, los cambios clave en Factores de Riesgo vs. el año anterior y las notas que debería mirar."*

PickSkill saca el último 10-K de [SEC EDGAR][edgar], extrae los Items 7, 8 y 1A, ejecuta el diff de Factores de Riesgo contra el filing del año anterior, calcula los inputs de [FCF](/blog/what-is-fcf) y [WACC](/blog/what-is-wacc) (para un [DCF](/blog/what-is-dcf) si quieres), y devuelve un walk-through de 90 segundos con cada afirmación enlazada a la página de la fuente original. Todo el proceso tarda ~60 segundos.

No reemplaza leer el filing por ti mismo cuando hay mucho en juego. Es la forma de saber por adelantado qué 4 secciones merecen lectura profunda y qué 100+ páginas pueden ir rápido.

## Los 4 Items que realmente llevan señal

| Item # | Sección | Por qué importa |
|---|---|---|
| 1 | Business | Descripción en lenguaje claro de qué hace la empresa y cómo gana dinero |
| 1A | Risk Factors | Lista jurídica de cosas que podrían descarrilar la tesis (el diff YoY es oro) |
| 7 | MD&A | Explicación de los números por la dirección — lee lo que no dicen |
| 8 | Estados financieros + notas | Los números, más las notas que explican elecciones contables |

Los otros 11 Items son fórmulas estándar (biografías de directivos, consejo, auditores) o reformulaciones de los mismos datos. Hojear, no leer en detalle.

## FAQ

**¿En qué se diferencia un 10-K de un 10-Q?**
El 10-K es la presentación anual — auditada, completa, con factores de riesgo completos y MD&A. El 10-Q es la trimestral — sin auditar, más corta, y el MD&A suele ser un delta frente al trimestre anterior en lugar de una narrativa completa. La mayoría de los analistas profesionales leen los 10-Q para la actualización del cash flow y el delta de MD&A, y reservan la lectura profunda para el 10-K.

**¿Cuándo se presentan los 10-K?**
El plazo depende del tamaño del declarante: grandes acelerados (~700M$+ de capital flotante público) tienen 60 días desde el cierre fiscal; acelerados, 75 días; no acelerados, 90 días. La mayoría de las grandes cap. estadounidenses cierran en diciembre y presentan su 10-K a finales de febrero.

**¿Dónde encuentro los 10-K antiguos de una empresa?**
[SEC EDGAR][edgar] es el archivo oficial gratuito. Busca por nombre o ticker. Suelen ir 20 años atrás. [PickSkill](/chat) tira directamente de EDGAR — sin intermediarios de datos, así que los números y el texto coinciden con el filing.

**¿La opinión del auditor es siempre fiable?**
Una opinión limpia ("sin salvedades") significa que el auditor cree que los estados presentan razonablemente la posición financiera en todos los aspectos materiales. *No* certifica que el negocio esté sano — solo que la contabilidad es coherente con GAAP. Lee la sección "Critical Audit Matters", introducida en 2019, para los puntos que el auditor marcó como requiriendo juicio adicional.

**¿Cuál es la forma más rápida de detectar banderas rojas contables?**
Tres señales del estado de flujos de caja: (1) brecha creciente entre beneficio neto y flujo operativo, (2) flujo operativo que depende cada vez más de liberaciones de circulante (cobros bajando, pagos subiendo), (3) capex que ha caído fuerte año contra año. Ninguna es concluyente por sí sola; combinadas merecen investigar.
