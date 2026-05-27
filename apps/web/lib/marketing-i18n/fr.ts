import type { FeaturesContent } from '../features';
import type { PricingContent } from '../pricing';

export const features: FeaturesContent = {
  index: {
    metaTitle: 'Fonctionnalités — PickSkill',
    metaDescription:
      'Ce que fait PickSkill : un analyste IA pour la recherche et la valorisation, un tableau de bord d’indicateurs de portefeuille à 8 dimensions, et la génération de PowerPoint / Word / Excel de qualité investisseur.',
    eyebrow: 'Fonctionnalités',
    headline: 'Un analyste IA, un tableau de bord de signaux et une usine à documents.',
    sub: 'PickSkill effectue la recherche, la modélisation et la rédaction de votre travail sur actions — puis transforme l’analyse en présentation, en rapport ou en portefeuille vivant que vous pouvez partager. Voici ce que fait chaque brique.',
    tryFree: 'Essayer gratuitement',
    explore: 'Découvrir {name}',
  },
  sections: {
    whatItDoes: 'Ce que ça fait',
    howItWorks: 'Comment ça marche',
    faqHeading: 'Questions fréquentes',
    ctaSubtitle: 'Gratuit à l’essai — 30 conversations par mois, sans carte bancaire.',
    moreFeatures: 'Plus de fonctionnalités',
  },
  items: {
    'portfolio-indicators': {
      eyebrow: 'Analyse',
      name: 'Indicateurs de portefeuille',
      tagline: 'Huit angles techniques sur chaque position — avec un historique de signal sur 5 jours qui filtre le bruit d’une seule bougie.',
      description:
        'Suivez vos positions américaines, hongkongaises et en actions A à travers 8 dimensions techniques — MACD, RSI, KDJ, Bollinger, ADX, MA, volume, flux de capitaux — chacune avec un historique de signal sur 5 jours.',
      headline: 'Chaque position, sous huit angles — en un coup d’œil.',
      imageAlt:
        'Maquette produit du tableau de bord d’indicateurs PickSkill — une grille de positions, chacune avec ses paliers de signal MACD/RSI/KDJ/flux et un historique sur 5 jours.',
      ctaLabel: 'Ouvrir l’analyste',
      capabilities: [
        { title: 'Huit dimensions d’indicateurs', body: 'MACD, moyennes mobiles (20/60/200), RSI, KDJ, bandes de Bollinger, ADX, volume et flux de capitaux — calculés sur le dernier cours de clôture de chaque position, avec en plus des analyses de divergence et de support/résistance.' },
        { title: 'L’historique de signal sur 5 jours', body: 'Chaque dimension est accompagnée d’un historique de paliers sur 5 jours, pour voir si un signal haussier est stable, en train de basculer ou clignotant — pas une seule bougie bruitée qui se fait passer pour un signal.' },
        { title: 'Conçu pour les actions américaines, hongkongaises et A', body: 'Les bougies de limite haute / limite basse / suspension sont détectées et masquées en neutre, pour qu’une série de séances à ±10% ne simule jamais un palier de forte tendance. Les mêmes calculs, adaptés à chaque marché.' },
        { title: 'Vue croisée des indicateurs en un coup d’œil', body: 'Survolez une position pour aligner toutes les dimensions d’un coup. La lecture multi-signaux disciplinée — filtre de tendance + déclencheur de momentum + participation — en un seul regard plutôt qu’en huit onglets.' },
        { title: 'Exporter vers le chat, puis vers une présentation', body: 'Envoyez la vue du tableau de bord dans un chat et transformez-la en PowerPoint ou en Excel en un clic — la lecture des indicateurs devient un livrable partageable.' },
        { title: 'Partager en lecture seule via un lien', body: 'Partagez une vue de portefeuille vivante avec une seule URL — positions, signaux et historique — sans compte requis pour le destinataire.' },
      ],
      howItWorks: [
        { step: 'Ajoutez vos positions', detail: 'Composez un portefeuille de tickers américains, hongkongais ou en actions A — ou importez une watchlist.' },
        { step: 'Lisez les signaux + l’historique', detail: 'Ouvrez le tableau de bord d’indicateurs. Chaque position affiche les 8 dimensions et l’historique de paliers sur 5 jours.' },
        { step: 'Filtrez avec la vue multi-signaux', detail: 'Utilisez l’ADX comme filtre de régime, MACD/RSI/KDJ comme déclencheurs, volume + flux comme confirmation.' },
        { step: 'Exportez ou partagez', detail: 'Transformez la lecture en présentation/Excel, ou partagez un lien en lecture seule pour un second avis.' },
      ],
      faq: [
        { q: 'Quels indicateurs sont inclus ?', a: 'Les huit dimensions sur tous les plans : MACD, moyennes mobiles (20/60/200), RSI(14), KDJ(9,3,3), bandes de Bollinger(20,2), ADX/DMI(14), relation volume/prix, et un proxy de flux de capitaux — plus les analyses de divergence et de support/résistance. Toute nouvelle dimension que nous ajoutons est incluse pour tout le monde.' },
        { q: 'Qu’est-ce que l’historique de signal sur 5 jours ?', a: 'Pour chaque indicateur, le palier (haussier / neutre / baissier) est recalculé sur les 5 derniers jours de bourse et affiché sous forme d’historique. Un signal qui tient 5 jours est très différent de celui qui bascule chaque jour — l’historique le rend visible et filtre le bruit d’une seule bougie.' },
        { q: 'Cela fonctionne-t-il sur les actions A chinoises ?', a: 'Oui. Les tableaux de bord détectent les bougies de limite haute / limite basse / suspension des actions A (plus haut == plus bas) et les masquent en neutre, pour que les bougies dégénérées ne produisent jamais de faux paliers positifs. Le KDJ est mis en avant comme oscillateur principal sur les valeurs en actions A, selon la convention locale.' },
      ],
    },
    'research-documents': {
      eyebrow: 'Livrable',
      name: 'Documents de recherche',
      tagline: 'Des PowerPoint, Word et Excel de qualité investisseur — générés à partir d’une instruction, sourcés sur des données en direct, modifiables dès le téléchargement.',
      description:
        'Générez des présentations .pptx, des rapports .docx et des modèles .xlsx natifs à partir d’une seule instruction — chaque graphique sourcé sur des dépôts et des données de marché en direct, chaque fichier modifiable.',
      headline: 'D’une instruction à une présentation prête à présenter.',
      imageAlt:
        'Maquette produit montrant une présentation PowerPoint générée, un rapport Word et un modèle Excel en éventail — la pile de documents de recherche produite par PickSkill.',
      ctaLabel: 'Générer un document',
      capabilities: [
        { title: 'PowerPoint, Word et Excel', body: 'Des .pptx / .docx / .xlsx natifs — pas des captures d’écran, pas des PDF. Ouvrez-les dans PowerPoint, Keynote, Word, Google Docs, Excel ou Sheets et modifiez chaque diapositive, paragraphe et cellule.' },
        { title: 'Sourcés sur des données en direct', body: 'Les graphiques et tableaux sont construits à partir des dépôts SEC les plus récents, des flux de marché et des indicateurs calculés — pas la mémoire du modèle. Chaque chiffre remonte à une source.' },
        { title: 'Conventions de présentation investisseur', body: 'Les présentations suivent la structure que les analystes présentent réellement : thèse en diapositive 2, valorisation explicite, risques anticipés en pre-mortem. Les classeurs Excel sont livrés en multi-feuilles avec de vraies formules inter-feuilles.' },
        { title: 'Modifier en réinstruisant', body: 'Poussez une hypothèse de marge, réorganisez les diapositives, ajoutez un scénario — demandez-le dans le chat et le fichier se régénère. Pas d’enfer des modèles, pas de remise en forme manuelle.' },
        { title: 'Huit langues', body: 'Générez la même présentation ou le même rapport en anglais, chinois simplifié / traditionnel, japonais, coréen, allemand, français ou espagnol — pour l’audience à qui vous présentez.' },
        { title: 'Livré via un lien de téléchargement', body: 'Les fichiers sont hébergés sur Cloudflare R2 et livrés via un lien de téléchargement valable 7 jours dans le chat — partagez-le, ou intégrez-le à votre propre présentation.' },
      ],
      howItWorks: [
        { step: 'Faites la recherche dans le chat', detail: 'Construisez un DCF, lisez un 10-K, comparez des pairs — la conversation devient la matière première.' },
        { step: 'Demandez le document', detail: '« Transforme ça en présentation investisseur de 12 diapositives » ou « construis un DCF sur 5 ans dans Excel ». Une seule phrase.' },
        { step: 'Téléchargez le fichier', detail: 'Un vrai .pptx / .docx / .xlsx, prêt en ~30–60 secondes avec un lien valable 7 jours.' },
        { step: 'Modifiez ou régénérez', detail: 'Ouvrez et modifiez directement, ou réinstruisez dans le chat pour changer les hypothèses et obtenir un fichier neuf.' },
      ],
      faq: [
        { q: 'Les fichiers sont-ils de vrais documents Office ?', a: 'Oui — des .pptx, .docx et .xlsx natifs générés via OfficeCLI, pas des captures d’écran ni des PDF. Ils s’ouvrent et se modifient dans PowerPoint, Keynote, Word, Excel, Google Workspace et LibreOffice. Chaque forme, tableau et formule est un véritable objet Office.' },
        { q: 'D’où proviennent les données ?', a: 'De sources en direct au moment de la génération : dépôts SEC EDGAR (et HKEx / Cninfo pour les actions hongkongaises / A), flux de données de marché, et indicateurs calculés sur le dernier cours de clôture. Le modèle compose à partir de primitives sourcées plutôt que de ses données d’entraînement, ce qui explique pourquoi les chiffres sont actuels et traçables.' },
        { q: 'Combien de fichiers puis-je générer ?', a: 'Selon le plan : Free 2/mois, Starter 8, Pro 30, Power 100+. La génération de fichiers utilise toujours le modèle IA avancé quel que soit le plan, pour que la qualité reste élevée. Les liens de téléchargement sont conservés 7 jours.' },
      ],
    },
    'ai-analyst': {
      eyebrow: 'Recherche',
      name: 'Analyste IA',
      tagline: 'Demandez tout ce que vous demanderiez à un analyste junior — obtenez des réponses sourcées, des modèles en direct, et une mémoire qui retient votre thèse d’une session à l’autre.',
      description:
        'Un analyste IA qui étudie les dépôts SEC et les données de marché, construit des modèles DCF, lit les 10-K et retient votre thèse d’une session à l’autre — en langage clair.',
      headline: 'L’analyste qui fait la recherche, la modélisation et la rédaction.',
      imageAlt:
        'Maquette produit du chat PickSkill — une question de recherche, une réponse sourcée avec citations et un graphique, et une puce de mémoire retenant la thèse.',
      ctaLabel: 'Interroger l’analyste',
      capabilities: [
        { title: 'Valorisation à la demande', body: 'Des modèles de flux de trésorerie actualisés complets avec tables de sensibilité, analyse de sociétés comparables et DCF inversés — entrées sourcées, hypothèses modifiables, en quelques secondes.' },
        { title: 'Lit les dépôts pour vous', body: 'Résume un 10-K en 60 secondes, compare les facteurs de risque d’une année sur l’autre, fait ressortir le signal du MD&A et les notes de bas de page à creuser — chaque affirmation reliée à sa page sur EDGAR.' },
        { title: 'Recherche multi-sources', body: 'Croise le web, les dépôts et les données de marché en un seul tour, puis répond avec citations — pas une supposition confiante. Honnête sur ce qu’il peut et ne peut pas vérifier.' },
        { title: 'Mémoire à long terme', body: 'Retient votre thèse, votre watchlist et vos préférences d’une session à l’autre, pour que vous reprenniez là où vous vous étiez arrêté au lieu de réexpliquer le contexte à chaque fois.' },
        { title: 'Couverture des actions américaines, hongkongaises et A', body: 'Reconnaît les tickers NYSE/NASDAQ, HKEx et SSE/SZSE et récupère le bon jeu de dépôts et les conventions de marché propres à chaque place.' },
      ],
      howItWorks: [
        { step: 'Demandez en langage clair', detail: '« Construis un DCF sur 5 ans pour TSMC », « qu’est-ce qui a changé dans les facteurs de risque de NVDA », « compare AMD et Intel sur le FCF ».' },
        { step: 'Il fait la recherche', detail: 'Croise les dépôts, les données de marché et le web — exécute le modèle ou la comparaison — et montre son raisonnement.' },
        { step: 'Obtenez une réponse sourcée', detail: 'Une réponse documentée avec citations, graphiques et livrables téléchargeables — pas une supposition opaque.' },
        { step: 'Il se souvient', detail: 'Votre thèse et votre contexte persistent d’une session à l’autre, pour que la question suivante s’appuie sur la précédente.' },
      ],
      faq: [
        { q: 'En quoi est-ce différent de demander à ChatGPT ?', a: 'PickSkill ancre chaque réponse dans des données en direct — il récupère le 10-K réel, calcule le DCF, exécute les indicateurs et cite ses sources au moment de la requête. Les chatbots génériques répondent à partir de leurs données d’entraînement et fabriquent régulièrement des chiffres financiers. L’ancrage fait toute la différence, surtout pour le travail de valorisation et sur les dépôts.' },
        { q: 'Que retient réellement la « mémoire » ?', a: 'Votre thèse d’investissement, votre watchlist, vos préférences et le contexte des conversations précédentes — persistés d’une session à l’autre et limités à votre compte. Vous pouvez consulter et modifier les entrées de mémoire, et elles sont illimitées sur tous les plans.' },
        { q: 'Quels marchés sont couverts ?', a: 'Les États-Unis (NYSE / NASDAQ), Hong Kong (HKEx) et les actions A chinoises (SSE / SZSE). L’analyste récupère les dépôts adaptés à chaque marché — 10-K/10-Q pour les États-Unis, rapports intérimaires/annuels pour Hong Kong, et la ligne de résultat net 扣非 pour les actions A.' },
      ],
    },
  },
};

export const pricing: PricingContent = {
  metaTitle: 'Tarifs — PickSkill',
  metaDescription:
    'Plans PickSkill : Free, Starter 15 $/mois, Pro 39 $/mois, Power 129 $/mois. La facturation annuelle fait économiser 20 %. Essai Pro de 7 jours, sans carte. Annulable à tout moment.',
  heroEyebrow: 'Plans & tarifs',
  heroHeadline: 'Un analyste IA pour le prix de quelques cafés.',
  heroSub:
    'Recherchez, modélisez et rédigez votre travail sur actions en langage clair. Les plans annuels font économiser 20 %. Chaque nouveau compte bénéficie d’un essai Pro de 7 jours — sans carte bancaire.',
  perMonth: '/mois',
  mostPopular: 'Le plus populaire',
  everyPlanNote:
    'Les 8 dimensions d’indicateurs et la mémoire à long terme illimitée sont incluses dans tous les plans.',
  faqHeading: 'Questions fréquentes',
  plans: {
    free: {
      blurb: 'Essayez l’analyste IA.',
      annualNote: 'Sans carte bancaire',
      cta: 'Essayer gratuitement',
      features: [
        '30 conversations / mois',
        '5 tours de recherche approfondie / mois',
        '1 portefeuille · 10 positions',
        '2 fichiers / mois (PPT / Word / Excel)',
        'Les 8 dimensions d’indicateurs',
        'Mémoire à long terme illimitée',
      ],
    },
    starter: {
      blurb: 'Pour l’investisseur particulier actif.',
      annualNote: '12 $/mois facturé annuellement (144 $/an)',
      cta: 'Commencer avec Starter',
      features: [
        '200 conversations / mois',
        '50 tours de recherche approfondie / mois',
        '3 portefeuilles · 25 positions chacun',
        '8 fichiers / mois',
        '1 watchlist · jusqu’à 20 symboles',
        'Support par e-mail sous 48 h',
      ],
    },
    pro: {
      blurb: 'Idéal pour le travail d’analyste au quotidien.',
      annualNote: '32 $/mois facturé annuellement (384 $/an)',
      cta: 'Passer à Pro',
      features: [
        'Modèle IA avancé',
        '1 000 conversations / mois',
        '300 tours de recherche approfondie / mois',
        '10 portefeuilles · 50 positions chacun',
        '30 fichiers / mois',
        'Actualisation automatique des cours toutes les 15 min',
        'Export du tableau de bord vers une présentation',
        'Support par e-mail sous 24 h',
      ],
    },
    power: {
      blurb: 'Pour les utilisateurs avancés et les pros.',
      annualNote: '104 $/mois facturé annuellement · + dépassement à l’usage',
      cta: 'Contactez-nous',
      features: [
        'Tout ce qui est inclus dans Pro, plus :',
        'Conversations & recherche illimitées',
        'Portefeuilles illimités · 100 positions',
        '100+ fichiers / mois',
        'Cours en temps réel à la demande (auto 5 min)',
        'Exports de tableau de bord illimités',
        'Support via canal Slack partagé',
      ],
    },
  },
  faq: [
    { q: 'Y a-t-il un essai gratuit de Pro ?', a: 'Chaque nouveau compte bénéficie de 7 jours d’accès Pro complet dès l’inscription — sans carte bancaire. À la fin de l’essai, vous choisissez votre plan ou restez sur Free.' },
    { q: 'Qu’est-ce qui compte comme une « conversation » ?', a: 'Un échange aller-retour avec l’IA sur un sujet — y compris les relances et les appels d’outils au sein de ce fil. Nous comptons l’ensemble du fil comme une seule conversation au regard de votre quota mensuel.' },
    { q: 'Comment fonctionne la génération de fichiers ?', a: 'Demandez à l’IA de créer un fichier PowerPoint, Word ou Excel. Nous le générons, l’hébergeons sur Cloudflare R2 et vous donnons un lien de téléchargement valable 7 jours dans le chat. Chaque fichier compte pour un au regard de votre quota mensuel quelle que soit sa longueur, et utilise toujours le modèle IA avancé.' },
    { q: 'Puis-je basculer entre facturation mensuelle et annuelle ?', a: 'Oui, à tout moment. Mensuel → annuel facture un montant annuel au prorata et décale votre date de renouvellement. Annuel → mensuel prend effet à votre prochain renouvellement.' },
    { q: 'Mes données sont-elles conservées si je change de plan ?', a: 'Oui. Portefeuilles, positions, entrées de mémoire et historique des conversations suivent votre compte. Si vous passez sous une limite, les données plus anciennes deviennent en lecture seule jusqu’à ce que vous en supprimiez ou que vous montiez de plan — rien n’est supprimé.' },
    { q: 'Quels moyens de paiement acceptez-vous ?', a: 'Les principales cartes bancaires via Stripe. Les méthodes locales (Alipay, WeChat Pay) pour les régions prises en charge sont prévues dans la feuille de route.' },
  ],
};
