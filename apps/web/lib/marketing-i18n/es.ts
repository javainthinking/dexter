import type { FeaturesContent } from '../features';
import type { PricingContent } from '../pricing';

export const features: FeaturesContent = {
  index: {
    metaTitle: 'Funciones — PickSkill',
    metaDescription:
      'Qué hace PickSkill: un analista con IA para investigación y valoración, un panel de indicadores de cartera con 8 dimensiones y generación de PowerPoint / Word / Excel de nivel profesional.',
    eyebrow: 'Funciones',
    headline: 'Un analista con IA, un panel de señales y una fábrica de documentos.',
    sub: 'PickSkill investiga, modela y redacta tu trabajo de renta variable, y luego convierte la lectura en una presentación, un informe o una cartera en vivo que puedes compartir. Esto es lo que hace cada pieza.',
    tryFree: 'Pruébalo gratis',
    explore: 'Explorar {name}',
  },
  sections: {
    whatItDoes: 'Qué hace',
    howItWorks: 'Cómo funciona',
    faqHeading: 'Preguntas frecuentes',
    ctaSubtitle: 'Gratis para probar: 30 conversaciones al mes, sin tarjeta.',
    moreFeatures: 'Más funciones',
  },
  items: {
    'portfolio-indicators': {
      eyebrow: 'Análisis',
      name: 'Indicadores de Cartera',
      tagline: 'Ocho lentes técnicas sobre cada posición, con un rastro de señales de 5 días que filtra el ruido de una sola vela.',
      description:
        'Sigue tus posiciones de EE. UU., Hong Kong y acciones A en 8 dimensiones técnicas: MACD, RSI, KDJ, Bollinger, ADX, MA, volumen y flujo de capital, cada una con un rastro de señales de 5 días.',
      headline: 'Cada posición, de ocho formas, de un vistazo.',
      imageAlt:
        'Maqueta del producto del panel de indicadores de PickSkill: una cuadrícula de posiciones, cada una con grupos de señales de MACD/RSI/KDJ/flujo y un rastro de 5 días.',
      ctaLabel: 'Abrir el analista',
      capabilities: [
        { title: 'Ocho dimensiones de indicadores', body: 'MACD, medias móviles (20/60/200), RSI, KDJ, Bandas de Bollinger, ADX, volumen y flujo de capital, calculados sobre el último cierre de cada posición, con análisis de divergencias y de soporte/resistencia por encima.' },
        { title: 'El rastro de señales de 5 días', body: 'Cada dimensión incluye un rastro de grupos de 5 días para que veas si una señal alcista es estable, está cambiando o parpadea, en lugar de una sola vela ruidosa que se hace pasar por señal.' },
        { title: 'Diseñado para EE. UU., Hong Kong y acciones A', body: 'Las velas de límite al alza / límite a la baja / suspensión se detectan y se enmascaran como neutrales, de modo que una serie de días con límite de ±10 % nunca finge un grupo de tendencia fuerte. La misma matemática, consciente del mercado.' },
        { title: 'Visión cruzada de indicadores de un vistazo', body: 'Pasa el cursor sobre cualquier posición para alinear todas las dimensiones a la vez. La lectura disciplinada de múltiples señales (filtro de tendencia + disparador de momento + participación) en un solo vistazo en lugar de ocho pestañas.' },
        { title: 'Exporta al chat y luego a una presentación', body: 'Envía la vista del panel a un chat y conviértela en un PowerPoint, un Word o un Excel con un solo clic: la lectura de los indicadores se convierte en un artefacto que puedes compartir.' },
      ],
      howItWorks: [
        { step: 'Añade tus posiciones', detail: 'Crea una cartera con tickers de EE. UU., Hong Kong o acciones A, y añade posiciones por símbolo.' },
        { step: 'Lee las señales y el rastro', detail: 'Abre el panel de indicadores. Cada posición muestra las 8 dimensiones más el rastro de grupos de 5 días.' },
        { step: 'Filtra con la vista de múltiples señales', detail: 'Usa el ADX como filtro de régimen, MACD/RSI/KDJ como disparadores, y volumen + flujo como confirmación.' },
        { step: 'Exporta a una presentación', detail: 'Convierte el análisis en un PowerPoint, Word o Excel para una segunda opinión o un cliente.' },
      ],
      faq: [
        { q: '¿Qué indicadores están incluidos?', a: 'Las ocho dimensiones en todos los planes: MACD, medias móviles (20/60/200), RSI(14), KDJ(9,3,3), Bandas de Bollinger(20,2), ADX/DMI(14), relación volumen/precio y un indicador aproximado de flujo de capital, además de análisis de divergencias y de soporte/resistencia. Cualquier dimensión nueva que añadamos se incluye para todos.' },
        { q: '¿Qué es el rastro de señales de 5 días?', a: 'Para cada indicador, la señal del grupo (alcista / neutral / bajista) se recalcula para los últimos 5 días de negociación y se muestra como un rastro. Una señal que se mantiene durante 5 días es muy distinta de una que cambia a diario: el rastro lo hace visible y filtra el ruido de una sola vela.' },
        { q: '¿Funciona con las acciones A chinas?', a: 'Sí. Los paneles detectan las velas de límite al alza / límite a la baja / suspensión de las acciones A (máximo == mínimo) y las enmascaran como neutrales, de modo que las velas degeneradas nunca producen grupos de falsos positivos. El KDJ se destaca como el oscilador principal en los valores de acciones A según la convención local.' },
      ],
    },
    'research-documents': {
      eyebrow: 'Resultado',
      name: 'Documentos de Investigación',
      tagline: 'PowerPoint, Word y Excel de nivel profesional, generados a partir de una instrucción, basados en datos en vivo y editables al descargarlos.',
      description:
        'Genera presentaciones .pptx, informes .docx y modelos .xlsx nativos a partir de una sola instrucción: cada gráfico se basa en informes y datos de mercado en vivo, y cada archivo es editable.',
      headline: 'De una instrucción a una presentación lista para mostrar.',
      imageAlt:
        'Maqueta del producto que muestra una presentación de PowerPoint generada, un informe de Word y un modelo de Excel desplegados en abanico: el conjunto de documentos de investigación de PickSkill.',
      ctaLabel: 'Generar un documento',
      capabilities: [
        { title: 'PowerPoint, Word y Excel', body: '.pptx / .docx / .xlsx nativos, no capturas de pantalla ni PDF. Ábrelos en PowerPoint, Keynote, Word, Google Docs, Excel o Sheets y edita cada diapositiva, párrafo y celda.' },
        { title: 'Basado en datos en vivo', body: 'Los gráficos y las tablas se construyen a partir de los informes más recientes de la SEC, las fuentes de mercado y los indicadores calculados, no de la memoria del modelo. Cada cifra se remonta a una fuente.' },
        { title: 'Convenciones de presentaciones para inversores', body: 'Las presentaciones siguen la estructura que los analistas presentan de verdad: la tesis en la diapositiva 2, la valoración explícita, los riesgos analizados de antemano. Los libros de Excel se entregan con varias hojas y fórmulas reales entre hojas.' },
        { title: 'Edita con una nueva instrucción', body: 'Ajusta un supuesto de margen, reordena diapositivas, añade un escenario: pídelo en el chat y el archivo se regenera. Sin infiernos de plantillas ni reformateo manual.' },
        { title: 'Ocho idiomas', body: 'Genera la misma presentación o informe en inglés, chino simplificado / tradicional, japonés, coreano, alemán, francés o español, para el público al que vas a presentar.' },
        { title: 'Entregado como enlace de descarga', body: 'Los archivos se alojan en Cloudflare R2 y se entregan como un enlace de descarga válido durante 7 días en el chat: compártelo o incorpóralo a tu propia presentación.' },
      ],
      howItWorks: [
        { step: 'Haz la investigación en el chat', detail: 'Construye un DCF, lee un 10-K, compara competidores: la conversación se convierte en el material de origen.' },
        { step: 'Pide el documento', detail: '«Convierte esto en una presentación para inversores de 12 diapositivas» o «construye un DCF a 5 años en Excel». Una sola frase.' },
        { step: 'Descarga el archivo', detail: 'Un .pptx / .docx / .xlsx real, listo en unos 30–60 segundos con un enlace válido durante 7 días.' },
        { step: 'Edita o regenera', detail: 'Ábrelo y edítalo directamente, o vuelve a darle una instrucción en el chat para cambiar los supuestos y obtener un archivo nuevo.' },
      ],
      faq: [
        { q: '¿Los archivos son documentos de Office reales?', a: 'Sí: .pptx, .docx y .xlsx nativos generados con OfficeCLI, no capturas de pantalla ni PDF. Se abren y editan en PowerPoint, Keynote, Word, Excel, Google Workspace y LibreOffice. Cada forma, tabla y fórmula es un objeto de Office real.' },
        { q: '¿De dónde provienen los datos?', a: 'De fuentes en vivo en el momento de la generación: informes de la SEC EDGAR (y HKEx / Cninfo para Hong Kong y acciones A), fuentes de datos de mercado y los indicadores calculados sobre el último cierre. El modelo compone a partir de elementos con fuente en lugar de sus datos de entrenamiento, y por eso las cifras son actuales y rastreables.' },
        { q: '¿Cuántos archivos puedo generar?', a: 'Depende del plan: Free 2/mes, Starter 8, Pro 30, Power 100+. La calidad del resultado es la misma en todos los planes. Los enlaces de descarga se conservan durante 7 días.' },
      ],
    },
    'ai-analyst': {
      eyebrow: 'Investigación',
      name: 'Analista con IA',
      tagline: 'Pregunta cualquier cosa que le pedirías a un analista junior: obtén respuestas con fuentes, modelos en vivo y una memoria que conserva tu tesis entre sesiones.',
      description:
        'Un analista con IA que investiga informes de la SEC y datos de mercado, construye modelos DCF, lee 10-K y recuerda tu tesis entre sesiones, todo en lenguaje natural.',
      headline: 'El analista que hace la investigación, el modelado y la redacción.',
      imageAlt:
        'Maqueta del producto del chat de PickSkill: una pregunta de investigación, una respuesta con fuentes, citas y un gráfico, y un chip de memoria que conserva la tesis.',
      ctaLabel: 'Pregunta al analista',
      capabilities: [
        { title: 'Valoración bajo demanda', body: 'Modelos completos de flujo de caja descontado con tablas de sensibilidad, análisis de empresas comparables y DCF inversos: insumos con fuente, supuestos editables, en segundos.' },
        { title: 'Lee los informes por ti', body: 'Resume un 10-K en 60 segundos, compara los Factores de Riesgo año tras año, destaca las señales del MD&A y las notas a pie que conviene seguir, con cada afirmación enlazada a la página en EDGAR.' },
        { title: 'Investigación con múltiples fuentes', body: 'Reúne la web, los informes y los datos de mercado en un solo turno y luego responde con citas, no con una conjetura segura de sí misma. Es honesto sobre lo que puede y no puede verificar.' },
        { title: 'Memoria a largo plazo', body: 'Recuerda tu tesis, los tickers que sigues y tus preferencias entre sesiones, para que retomes donde lo dejaste en lugar de volver a explicar el contexto cada vez.' },
        { title: 'Cobertura de EE. UU., Hong Kong y acciones A', body: 'Reconoce los tickers de NYSE/NASDAQ, HKEx y SSE/SZSE y obtiene el conjunto de informes y las convenciones de mercado adecuados para cada mercado.' },
      ],
      howItWorks: [
        { step: 'Pregunta en lenguaje natural', detail: '«Construye un DCF a 5 años de TSMC», «qué cambió en los factores de riesgo de NVDA», «compara AMD e Intel por FCF».' },
        { step: 'Investiga', detail: 'Reúne informes, datos de mercado y la web, ejecuta el modelo o la comparación, y muestra su trabajo.' },
        { step: 'Obtén una respuesta con fuentes', detail: 'Una respuesta investigada con citas, gráficos y artefactos descargables, no una conjetura de caja negra.' },
        { step: 'Recuerda', detail: 'Tu tesis y tu contexto persisten entre sesiones, de modo que la siguiente pregunta se apoya en la anterior.' },
      ],
      faq: [
        { q: '¿En qué se diferencia esto de preguntarle a ChatGPT?', a: 'PickSkill fundamenta cada respuesta en datos en vivo: obtiene el 10-K real, calcula el DCF, ejecuta los indicadores y cita las fuentes en el momento de la consulta. Los chatbots genéricos responden a partir de sus datos de entrenamiento y suelen inventar cifras financieras. Esa fundamentación es la diferencia, sobre todo en el trabajo de valoración y de informes.' },
        { q: '¿Qué recuerda realmente la «memoria»?', a: 'Tu tesis de inversión, los tickers que sigues, tus preferencias y el contexto de conversaciones previas, persistidos entre sesiones y limitados a tu cuenta. Puedes revisar y editar las entradas de memoria, y son ilimitadas en todos los planes.' },
        { q: '¿Qué mercados están cubiertos?', a: 'EE. UU. (NYSE / NASDAQ), Hong Kong (HKEx) y acciones A chinas (SSE / SZSE). El analista obtiene los informes adecuados para cada mercado: 10-K/10-Q para EE. UU., interinos/anuales para Hong Kong, y la línea de beneficio neto 扣非 para las acciones A.' },
      ],
    },
  },
};

export const pricing: PricingContent = {
  metaTitle: 'Precios — PickSkill',
  metaDescription:
    'Planes de PickSkill: Free, Starter $15/mes, Pro $39/mes, Power $129/mes. La facturación anual ahorra un 20 %. Cancela cuando quieras.',
  heroEyebrow: 'Planes y precios',
  heroHeadline: 'Un analista con IA por el precio de unos cafés.',
  heroSub:
    'Investiga, modela y redacta trabajo de renta variable en lenguaje natural. Los planes anuales ahorran un 20 %. Cancela cuando quieras.',
  perMonth: '/mes',
  mostPopular: 'Más popular',
  everyPlanNote:
    'Las 8 dimensiones de indicadores y la memoria a largo plazo ilimitada se incluyen en todos los planes.',
  comparisonHeading: 'Comparar planes',
  billing: {
    monthly: 'Mensual',
    annual: 'Anual',
    save: 'Ahorra 20%',
    billedAnnually: 'facturación anual',
  },
  faqHeading: 'Preguntas frecuentes',
  plans: {
    free: {
      blurb: 'Prueba el analista con IA.',
      annualNote: 'Sin tarjeta',
      cta: 'Pruébalo gratis',
      features: [
        '30 conversaciones / mes',
        '5 turnos de investigación profunda / mes',
        '1 cartera · 10 posiciones',
        '2 archivos generados / mes (PPT / Word / Excel)',
        'Las 8 dimensiones de indicadores',
        'Memoria a largo plazo ilimitada',
      ],
    },
    starter: {
      blurb: 'Para el inversor minorista activo.',
      annualNote: '$12/mes con facturación anual ($144/año)',
      cta: 'Empieza con Starter',
      features: [
        '200 conversaciones / mes',
        '50 turnos de investigación profunda / mes',
        '3 carteras · 25 posiciones cada una',
        '8 archivos generados / mes (PPT / Word / Excel)',
        'Soporte por correo',
      ],
    },
    pro: {
      blurb: 'Lo mejor para el trabajo diario de analista.',
      annualNote: '$32/mes con facturación anual ($384/año)',
      cta: 'Pásate a Pro',
      features: [
        '1.000 conversaciones / mes',
        '300 turnos de investigación profunda / mes',
        '10 carteras · 50 posiciones cada una',
        '30 archivos generados / mes (PPT / Word / Excel)',
        'Soporte por correo',
      ],
    },
    power: {
      blurb: 'Para usuarios avanzados y profesionales.',
      annualNote: '$104/mes con facturación anual ($1,248/año)',
      cta: 'Pásate a Power',
      features: [
        'Todo lo de Pro, y además:',
        'Conversaciones e investigación ilimitadas',
        'Carteras ilimitadas · 100 posiciones',
        '100+ archivos generados / mes (PPT / Word / Excel)',
        'Soporte por correo prioritario',
      ],
    },
  },
  comparison: [
    {
      title: 'El asistente con IA',
      rows: [
        { label: 'Conversaciones / mes', values: ['30', '200', '1.000', 'Ilimitadas'] },
        { label: 'Turnos de investigación profunda / mes', values: ['5', '50', '300', 'Ilimitados'] },
        { label: 'Flujos especializados (DCF, investigación en X)', values: [true, true, true, true] },
        { label: 'Memoria a largo plazo', values: ['Ilimitada', 'Ilimitada', 'Ilimitada', 'Ilimitada'] },
      ],
    },
    {
      title: 'Documentos',
      rows: [
        { label: 'Archivos / mes (PPT · Word · Excel)', values: ['2', '8', '30', '100+'] },
        { label: 'Enlaces de descarga retenidos', values: ['7 días', '7 días', '7 días', '7 días'] },
      ],
    },
    {
      title: 'Carteras',
      rows: [
        { label: 'Carteras', values: ['1', '3', '10', 'Ilimitadas'] },
        { label: 'Posiciones por cartera', values: ['10', '25', '50', '100'] },
        { label: 'Actualización de cotizaciones', values: ['Bajo demanda', 'Bajo demanda', 'Bajo demanda', 'Bajo demanda'] },
      ],
    },
    {
      title: 'Panel de indicadores',
      rows: [
        { label: 'Dimensiones de indicadores', values: ['Las 8', 'Las 8', 'Las 8', 'Las 8'] },
        { label: 'Exporta el panel (PPT / Word / Excel)', values: [true, true, true, true] },
      ],
    },
    {
      title: 'Mercados e idiomas',
      rows: [
        { label: 'Cobertura de mercados (EE. UU. · HK · acciones A)', values: [true, true, true, true] },
        { label: 'Idiomas de salida', values: ['8', '8', '8', '8'] },
      ],
    },
    {
      title: 'Soporte',
      rows: [
        { label: 'Soporte', values: ['Comunidad', 'Correo', 'Correo', 'Correo prioritario'] },
        { label: 'Cancela cuando quieras', values: [true, true, true, true] },
      ],
    },
  ],
  faq: [
    { q: '¿Qué cuenta como una «conversación»?', a: 'Un hilo de ida y vuelta con la IA sobre un tema, incluidas las repreguntas y las llamadas a herramientas dentro de ese hilo. Contamos todo el hilo como una conversación frente a tu cuota mensual.' },
    { q: '¿Cómo funciona la generación de archivos?', a: 'Pídele a la IA que cree un archivo de PowerPoint, Word o Excel. Lo generamos, lo alojamos en Cloudflare R2 y te damos un enlace de descarga válido durante 7 días en el chat. Cada archivo cuenta como uno frente a tu cuota mensual, independientemente de su longitud.' },
    { q: '¿Puedo cambiar entre facturación mensual y anual?', a: 'Sí, cuando quieras. De mensual a anual se cobra un importe anual prorrateado y se desplaza tu fecha de renovación. De anual a mensual surte efecto en tu próxima renovación.' },
    { q: '¿Mis datos se conservan si subo o bajo de plan?', a: 'Sí. Las carteras, las posiciones, las entradas de memoria y el historial de conversaciones se mueven con tu cuenta. Si bajas de plan por debajo de un límite, los datos más antiguos pasan a ser de solo lectura hasta que elimines algunos o subas de plan; no se borra nada.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Las principales tarjetas de crédito a través de Stripe. Los métodos locales (Alipay, WeChat Pay) para las regiones admitidas están en la hoja de ruta.' },
  ],
};
