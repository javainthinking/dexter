import type { FeaturesContent } from '../features';
import type { PricingContent } from '../pricing';

export const features: FeaturesContent = {
  index: {
    metaTitle: 'Funktionen — PickSkill',
    metaDescription:
      'Was PickSkill leistet: ein AI-Analyst für Research und Bewertung, ein Portfolio-Indikatoren-Dashboard mit 8 Dimensionen sowie die Erstellung von PowerPoint, Word und Excel auf Investorenniveau.',
    eyebrow: 'Funktionen',
    headline: 'Ein AI-Analyst, ein Signal-Dashboard und eine Dokumenten-Fabrik.',
    sub: 'PickSkill recherchiert, modelliert und entwirft Ihre Aktienanalysen — und verwandelt die Erkenntnisse anschließend in ein Deck, einen Report oder ein Live-Portfolio, das Sie teilen können. Hier erfahren Sie, was jeder Baustein leistet.',
    tryFree: 'Kostenlos testen',
    explore: '{name} entdecken',
  },
  sections: {
    whatItDoes: 'Was es leistet',
    howItWorks: 'So funktioniert es',
    faqHeading: 'Häufig gestellte Fragen',
    ctaSubtitle: 'Kostenlos testen — 30 Konversationen pro Monat, ohne Kreditkarte.',
    moreFeatures: 'Weitere Funktionen',
  },
  items: {
    'portfolio-indicators': {
      eyebrow: 'Analyse',
      name: 'Portfolio-Indikatoren',
      tagline: 'Acht technische Perspektiven auf jede Position — mit einem 5-Tage-Signalverlauf, der das Rauschen einzelner Bars herausfiltert.',
      description:
        'Verfolgen Sie US-, HK- und A-Aktien-Positionen über 8 technische Dimensionen — MACD, RSI, KDJ, Bollinger, ADX, MAs, Volumen, Kapitalfluss — jeweils mit einem 5-Tage-Signalverlauf.',
      headline: 'Jede Position, achtfach — auf einen Blick.',
      imageAlt:
        'Produkt-Mockup des PickSkill-Indikatoren-Dashboards — ein Raster aus Positionen, jede mit MACD/RSI/KDJ/Flow-Signal-Buckets und einem 5-Tage-Verlauf.',
      ctaLabel: 'Analyst öffnen',
      capabilities: [
        { title: 'Acht Indikator-Dimensionen', body: 'MACD, gleitende Durchschnitte (20/60/200), RSI, KDJ, Bollinger-Bänder, ADX, Volumen und Kapitalfluss — berechnet auf den jüngsten Schlusskurs jeder Position, ergänzt um Divergenz- sowie Unterstützungs-/Widerstands-Scans.' },
        { title: 'Der 5-Tage-Signalverlauf', body: 'Jede Dimension liefert einen 5-Tage-Bucket-Verlauf, sodass Sie sehen, ob ein bullisches Signal stabil ist, kippt oder flackert — kein einzelner verrauschter Bar, der sich als Signal ausgibt.' },
        { title: 'Gemacht für US-, HK- und A-Aktien', body: 'Limit-up-, Limit-down- und Halt-Bars werden erkannt und als neutral maskiert, sodass eine Folge von ±10%-Limit-Tagen niemals einen Starker-Trend-Bucket vortäuscht. Dieselbe Mathematik, marktbewusst angewandt.' },
        { title: 'Indikatorübergreifend auf einen Blick', body: 'Fahren Sie über eine Position, um alle Dimensionen gleichzeitig auszurichten. Der disziplinierte Multi-Signal-Blick — Trendfilter plus Momentum-Trigger plus Marktbeteiligung — in einem Scan statt in acht Tabs.' },
        { title: 'In den Chat exportieren, dann ins Deck', body: 'Senden Sie die Dashboard-Ansicht in einen Chat und verwandeln Sie sie mit einem Klick in eine PowerPoint, Word oder Excel — die Indikator-Analyse wird zum teilbaren Artefakt.' },
      ],
      howItWorks: [
        { step: 'Positionen hinzufügen', detail: 'Bauen Sie ein Portfolio aus US-, HK- oder A-Aktien-Tickern und fügen Sie Positionen per Symbol hinzu.' },
        { step: 'Signale und Verlauf lesen', detail: 'Öffnen Sie das Indikatoren-Dashboard. Jede Position zeigt alle 8 Dimensionen sowie den 5-Tage-Bucket-Verlauf.' },
        { step: 'Mit dem Multi-Signal-Blick filtern', detail: 'Nutzen Sie ADX als Regime-Filter, MACD/RSI/KDJ als Trigger sowie Volumen plus Flow als Bestätigung.' },
        { step: 'In ein Deck exportieren', detail: 'Verwandeln Sie die Analyse in eine PowerPoint, Word oder Excel — für eine Zweitmeinung oder einen Kunden.' },
      ],
      faq: [
        { q: 'Welche Indikatoren sind enthalten?', a: 'Alle acht Dimensionen in jedem Tarif: MACD, gleitende Durchschnitte (20/60/200), RSI(14), KDJ(9,3,3), Bollinger-Bänder(20,2), ADX/DMI(14), Volumen-Kurs-Verhältnis sowie ein Kapitalfluss-Proxy — ergänzt um Divergenz- und Unterstützungs-/Widerstands-Scans. Jede neue Dimension, die wir ergänzen, ist für alle enthalten.' },
        { q: 'Was ist der 5-Tage-Signalverlauf?', a: 'Für jeden Indikator wird das Bucket-Signal (bullisch / neutral / bärisch) für die letzten 5 Handelstage neu berechnet und als Verlauf dargestellt. Ein Signal, das 5 Tage hält, unterscheidet sich grundlegend von einem, das täglich kippt — der Verlauf macht das sichtbar und filtert das Rauschen einzelner Bars.' },
        { q: 'Funktioniert das bei chinesischen A-Aktien?', a: 'Ja. Die Dashboards erkennen Limit-up-, Limit-down- und Halt-Bars (High == Low) bei A-Aktien und maskieren sie als neutral, sodass degenerierte Bars niemals falsch-positive Buckets erzeugen. KDJ wird gemäß lokaler Konvention als primärer Oszillator für A-Aktien-Titel hervorgehoben.' },
      ],
    },
    'research-documents': {
      eyebrow: 'Ergebnis',
      name: 'Research-Dokumente',
      tagline: 'PowerPoint, Word und Excel auf Investorenniveau — aus einem Prompt generiert, aus Live-Daten gespeist, nach dem Download editierbar.',
      description:
        'Generieren Sie native .pptx-Decks, .docx-Reports und .xlsx-Modelle aus einem einzigen Prompt — jedes Diagramm gespeist aus aktuellen Filings und Marktdaten, jede Datei editierbar.',
      headline: 'Vom Prompt zum präsentationsreifen Deck.',
      imageAlt:
        'Produkt-Mockup mit einem generierten PowerPoint-Deck, einem Word-Report und einem Excel-Modell, aufgefächert — der Output-Stack der PickSkill-Research-Dokumente.',
      ctaLabel: 'Dokument generieren',
      capabilities: [
        { title: 'PowerPoint, Word und Excel', body: 'Native .pptx / .docx / .xlsx — keine Screenshots, keine PDFs. Öffnen Sie sie in PowerPoint, Keynote, Word, Google Docs, Excel oder Sheets und bearbeiten Sie jede Folie, jeden Absatz und jede Zelle.' },
        { title: 'Aus Live-Daten gespeist', body: 'Diagramme und Tabellen entstehen aus den jüngsten SEC-Filings, Markt-Feeds und berechneten Indikatoren — nicht aus dem Gedächtnis des Modells. Jede Zahl lässt sich bis zur Quelle zurückverfolgen.' },
        { title: 'Konventionen des Investoren-Decks', body: 'Decks folgen der Struktur, die Analysten tatsächlich präsentieren: These auf Folie 2, Bewertung explizit, Risiken im Pre-Mortem durchdacht. Excel-Arbeitsmappen kommen mehrblättrig mit echten blattübergreifenden Formeln.' },
        { title: 'Bearbeiten durch erneutes Prompten', body: 'Verschieben Sie eine Margen-Annahme, ordnen Sie Folien neu an, fügen Sie ein Szenario hinzu — fragen Sie im Chat, und die Datei wird neu generiert. Kein Template-Albtraum, keine manuelle Neuformatierung.' },
        { title: 'Acht Sprachen', body: 'Generieren Sie dasselbe Deck oder denselben Report auf Englisch, in vereinfachtem oder traditionellem Chinesisch, Japanisch, Koreanisch, Deutsch, Französisch oder Spanisch — für das Publikum, dem Sie präsentieren.' },
        { title: 'Als Download-Link geliefert', body: 'Dateien werden auf Cloudflare R2 gehostet und als 7-Tage-Download-Link im Chat geliefert — teilen Sie ihn oder übernehmen Sie ihn in Ihr eigenes Deck.' },
      ],
      howItWorks: [
        { step: 'Recherche im Chat erledigen', detail: 'Bauen Sie ein DCF, lesen Sie ein 10-K, vergleichen Sie Peers — das Gespräch wird zum Ausgangsmaterial.' },
        { step: 'Nach dem Dokument fragen', detail: '„Verwandle das in ein 12-Folien-Investoren-Deck" oder „baue ein 5-Jahres-DCF in Excel". Ein Satz.' },
        { step: 'Datei herunterladen', detail: 'Eine echte .pptx / .docx / .xlsx, in ~30–60 Sekunden bereit, mit einem 7-Tage-Link.' },
        { step: 'Bearbeiten oder neu generieren', detail: 'Direkt öffnen und bearbeiten oder im Chat erneut prompten, um Annahmen zu ändern und eine frische Datei zu erhalten.' },
      ],
      faq: [
        { q: 'Sind die Dateien echte Office-Dokumente?', a: 'Ja — native .pptx, .docx und .xlsx, generiert über OfficeCLI, keine Screenshots oder PDFs. Sie öffnen und bearbeiten sich in PowerPoint, Keynote, Word, Excel, Google Workspace und LibreOffice. Jede Form, jede Tabelle und jede Formel ist ein echtes Office-Objekt.' },
        { q: 'Woher stammen die Daten?', a: 'Aus Live-Quellen zum Zeitpunkt der Generierung: SEC-EDGAR-Filings (sowie HKEx / Cninfo für HK- / A-Aktien), Marktdaten-Feeds und die auf den jüngsten Schlusskurs berechneten Indikatoren. Das Modell setzt aus belegten Primitiven zusammen statt aus seinen Trainingsdaten — deshalb sind die Zahlen aktuell und nachvollziehbar.' },
        { q: 'Wie viele Dateien kann ich generieren?', a: 'Je nach Tarif: Free 2/Monat, Starter 8, Pro 30, Power 100+. Die Ausgabequalität ist in jedem Tarif gleich. Download-Links bleiben 7 Tage verfügbar.' },
      ],
    },
    'ai-analyst': {
      eyebrow: 'Research',
      name: 'AI-Analyst',
      tagline: 'Fragen Sie alles, was Sie einen Junior-Analysten fragen würden — und erhalten Sie belegte Antworten, Live-Modelle und ein Gedächtnis, das Ihre These über Sitzungen hinweg bewahrt.',
      description:
        'Ein AI-Analyst, der SEC-Filings und Marktdaten recherchiert, DCF-Modelle baut, 10-Ks liest und sich Ihre These über Sitzungen hinweg merkt — in verständlichem Deutsch.',
      headline: 'Der Analyst, der die Recherche, Modellierung und das Verfassen übernimmt.',
      imageAlt:
        'Produkt-Mockup des PickSkill-Chats — eine Research-Frage, eine belegte Antwort mit Zitaten und einem Diagramm sowie ein Memory-Chip, der die These festhält.',
      ctaLabel: 'Analyst fragen',
      capabilities: [
        { title: 'Bewertung auf Abruf', body: 'Vollständige Discounted-Cash-Flow-Modelle mit Sensitivitätstabellen, Vergleichsunternehmensanalysen und Reverse-DCFs — belegte Inputs, editierbare Annahmen, in Sekunden.' },
        { title: 'Liest Filings für Sie', body: 'Fasst ein 10-K in 60 Sekunden zusammen, vergleicht Risikofaktoren im Jahresvergleich, deckt MD&A-Signale und nachzugehende Fußnoten auf — jede Aussage verlinkt mit der Seite auf EDGAR.' },
        { title: 'Multi-Quellen-Research', body: 'Zieht Web, Filings und Marktdaten in einem Zug heran und antwortet anschließend mit Zitaten — keine selbstsichere Vermutung. Ehrlich darüber, was es verifizieren kann und was nicht.' },
        { title: 'Langzeitgedächtnis', body: 'Merkt sich Ihre These, die von Ihnen verfolgten Ticker und Präferenzen über Sitzungen hinweg, sodass Sie dort weitermachen, wo Sie aufgehört haben, statt jedes Mal den Kontext neu zu erklären.' },
        { title: 'Abdeckung von US-, HK- und A-Aktien', body: 'Erkennt NYSE/NASDAQ-, HKEx- und SSE/SZSE-Ticker und zieht je Markt das passende Filing-Set sowie die passenden Marktkonventionen heran.' },
      ],
      howItWorks: [
        { step: 'In verständlichem Deutsch fragen', detail: '„Baue ein 5-Jahres-DCF zu TSMC", „was hat sich bei den Risikofaktoren von NVDA geändert", „vergleiche AMD und Intel beim FCF".' },
        { step: 'Es recherchiert', detail: 'Zieht Filings, Marktdaten und das Web heran — führt das Modell oder den Vergleich aus — und zeigt seinen Rechenweg.' },
        { step: 'Belegte Antwort erhalten', detail: 'Eine recherchierte Antwort mit Zitaten, Diagrammen und herunterladbaren Artefakten — keine Blackbox-Vermutung.' },
        { step: 'Es merkt sich alles', detail: 'Ihre These und Ihr Kontext bleiben über Sitzungen hinweg erhalten, sodass die nächste Frage auf der letzten aufbaut.' },
      ],
      faq: [
        { q: 'Worin unterscheidet sich das von einer Frage an ChatGPT?', a: 'PickSkill verankert jede Antwort in Live-Daten — es zieht das tatsächliche 10-K heran, berechnet das DCF, führt die Indikatoren aus und nennt Quellen zum Zeitpunkt der Abfrage. Generische Chatbots antworten aus Trainingsdaten und erfinden regelmäßig Finanzkennzahlen. Die Verankerung macht den Unterschied, besonders bei Bewertungs- und Filing-Arbeit.' },
        { q: 'Was merkt sich das „Gedächtnis" tatsächlich?', a: 'Ihre Investmentthese, die von Ihnen verfolgten Ticker, Präferenzen und den bisherigen Gesprächskontext — über Sitzungen hinweg gespeichert und auf Ihr Konto beschränkt. Sie können Gedächtniseinträge einsehen und bearbeiten, und sie sind in jedem Tarif unbegrenzt.' },
        { q: 'Welche Märkte werden abgedeckt?', a: 'USA (NYSE / NASDAQ), Hongkong (HKEx) und chinesische A-Aktien (SSE / SZSE). Der Analyst zieht marktgerechte Filings heran — 10-K/10-Q für die USA, Zwischen- und Jahresberichte für HK sowie die 扣非-Nettogewinnzeile für A-Aktien.' },
      ],
    },
  },
};

export const pricing: PricingContent = {
  metaTitle: 'Preise — PickSkill',
  metaDescription:
    'PickSkill-Tarife: Free, Starter $15/Mon., Pro $39/Mon., Power $129/Mon. Jährliche Abrechnung spart 20%. Jederzeit kündbar.',
  heroEyebrow: 'Tarife & Preise',
  heroHeadline: 'Ein AI-Analyst zum Preis von ein paar Kaffees.',
  heroSub:
    'Recherchieren, modellieren und entwerfen Sie Aktienanalysen in verständlichem Deutsch. Jahrestarife sparen 20%. Jederzeit kündbar.',
  perMonth: '/Mon.',
  mostPopular: 'Am beliebtesten',
  everyPlanNote:
    'Alle 8 Indikator-Dimensionen sowie unbegrenztes Langzeitgedächtnis sind in jedem Tarif enthalten.',
  comparisonHeading: 'Tarife vergleichen',
  billing: {
    monthly: 'Monatlich',
    annual: 'Jährlich',
    save: '20% sparen',
    billedAnnually: 'jährlich abgerechnet',
  },
  faqHeading: 'Häufig gestellte Fragen',
  plans: {
    free: {
      blurb: 'Den AI-Analysten testen.',
      annualNote: 'Ohne Kreditkarte',
      cta: 'Kostenlos testen',
      features: [
        '30 Konversationen / Monat',
        '5 Deep-Research-Durchläufe / Monat',
        '1 Portfolio · 10 Positionen',
        '2 generierte Dateien / Monat (PPT / Word / Excel)',
        'Alle 8 Indikator-Dimensionen',
        'Unbegrenztes Langzeitgedächtnis',
      ],
    },
    starter: {
      blurb: 'Für den aktiven Privatanleger.',
      annualNote: '$12/Mon. bei jährlicher Abrechnung ($144/Jahr)',
      cta: 'Mit Starter beginnen',
      features: [
        'Alles aus Free, plus:',
        '200 Konversationen / Monat',
        '50 Deep-Research-Durchläufe / Monat',
        '3 Portfolios · je 25 Positionen',
        '8 generierte Dateien / Monat (PPT / Word / Excel)',
        'E-Mail-Support',
      ],
    },
    pro: {
      blurb: 'Am besten für die tägliche Analystenarbeit.',
      annualNote: '$32/Mon. bei jährlicher Abrechnung ($384/Jahr)',
      cta: 'Auf Pro wechseln',
      features: [
        'Alles aus Starter, plus:',
        '1.000 Konversationen / Monat',
        '300 Deep-Research-Durchläufe / Monat',
        '10 Portfolios · je 50 Positionen',
        '30 generierte Dateien / Monat (PPT / Word / Excel)',
      ],
    },
    power: {
      blurb: 'Für Power-User und Profis.',
      annualNote: '$104/Mon. bei jährlicher Abrechnung ($1,248/Jahr)',
      cta: 'Auf Power wechseln',
      features: [
        'Alles aus Pro, plus:',
        'Unbegrenzte Konversationen & Research',
        'Unbegrenzte Portfolios · 100 Positionen',
        '100+ generierte Dateien / Monat (PPT / Word / Excel)',
        'Bevorzugter E-Mail-Support',
      ],
    },
  },
  comparison: [
    {
      title: 'Der AI-Assistent',
      rows: [
        { label: 'Konversationen / Monat', values: ['30', '200', '1.000', 'Unbegrenzt'] },
        { label: 'Deep-Research-Durchläufe / Monat', values: ['5', '50', '300', 'Unbegrenzt'] },
        { label: 'Spezialisierte Workflows (DCF, X-Recherche)', values: [true, true, true, true] },
        { label: 'Langzeitgedächtnis', values: ['Unbegrenzt', 'Unbegrenzt', 'Unbegrenzt', 'Unbegrenzt'] },
      ],
    },
    {
      title: 'Dokumente',
      rows: [
        { label: 'Dateien / Monat (PPT · Word · Excel)', values: ['2', '8', '30', '100+'] },
        { label: 'Download-Links verfügbar', values: ['7 Tage', '7 Tage', '7 Tage', '7 Tage'] },
      ],
    },
    {
      title: 'Portfolios',
      rows: [
        { label: 'Portfolios', values: ['1', '3', '10', 'Unbegrenzt'] },
        { label: 'Positionen pro Portfolio', values: ['10', '25', '50', '100'] },
        { label: 'Kursaktualisierung', values: ['Auf Abruf', 'Auf Abruf', 'Auf Abruf', 'Auf Abruf'] },
      ],
    },
    {
      title: 'Indikator-Dashboard',
      rows: [
        { label: 'MACD (Trend)', values: [true, true, true, true] },
        { label: 'Gleitende Durchschnitte — MA', values: [true, true, true, true] },
        { label: 'RSI (Momentum)', values: [true, true, true, true] },
        { label: 'KDJ (Stochastik)', values: [true, true, true, true] },
        { label: 'Bollinger-Bänder — BOLL', values: [true, true, true, true] },
        { label: 'ADX (Trendstärke)', values: [true, true, true, true] },
        { label: 'Volumen', values: [true, true, true, true] },
        { label: 'Kapitalfluss (geschätzt)', values: [true, true, true, true] },
        { label: 'Dashboard exportieren (PPT / Word / Excel)', values: [true, true, true, true] },
      ],
    },
    {
      title: 'Märkte & Sprachen',
      rows: [
        { label: 'Marktabdeckung (USA · HK · A-Aktien)', values: [true, true, true, true] },
        { label: 'Ausgabesprachen', values: ['8', '8', '8', '8'] },
      ],
    },
    {
      title: 'Support',
      rows: [
        { label: 'Support', values: ['Community', 'E-Mail', 'E-Mail', 'Bevorzugte E-Mail'] },
        { label: 'Jederzeit kündbar', values: [true, true, true, true] },
      ],
    },
  ],
  faq: [
    { q: 'Was zählt als eine „Konversation"?', a: 'Ein Hin-und-Her-Thread mit der AI zu einem Thema — einschließlich der Folgefragen und Tool-Aufrufe innerhalb dieses Threads. Wir zählen den gesamten Thread als eine Konversation auf Ihr Monatskontingent.' },
    { q: 'Wie funktioniert die Datei-Generierung?', a: 'Bitten Sie die AI, eine PowerPoint-, Word- oder Excel-Datei zu erstellen. Wir generieren sie, hosten sie auf Cloudflare R2 und geben Ihnen einen 7-Tage-Download-Link im Chat. Jede Datei zählt unabhängig von ihrer Länge als eine auf Ihr Monatskontingent.' },
    { q: 'Kann ich zwischen monatlicher und jährlicher Abrechnung wechseln?', a: 'Ja, jederzeit. Monatlich → jährlich berechnet einen anteiligen Jahresbetrag und verschiebt Ihr Verlängerungsdatum. Jährlich → monatlich wird zur nächsten Verlängerung wirksam.' },
    { q: 'Bleiben meine Daten bei einem Upgrade oder Downgrade erhalten?', a: 'Ja. Portfolios, Positionen, Gedächtniseinträge und Gesprächsverlauf wandern mit Ihrem Konto. Bei einem Downgrade unter ein Limit werden ältere Daten schreibgeschützt, bis Sie einige entfernen oder upgraden — nichts wird gelöscht.' },
    { q: 'Welche Zahlungsmethoden akzeptieren Sie?', a: 'Gängige Kreditkarten über Stripe. Lokale Methoden (Alipay, WeChat Pay) für unterstützte Regionen stehen auf der Roadmap.' },
  ],
};
