import type { Locale } from '@web/lib/i18n/locales';

/**
 * Copy that only the desktop home screen uses. Everything else on the
 * page (hero subtitle, prompt samples, section names, taglines) is reused
 * from web's dictionaries and feature catalogue, so it stays in sync with
 * pickskill.ai. `{n}` / `{limit}` are substituted at render time.
 */
export interface HomeStrings {
  badge: string;
  greetMorning: string;
  greetAfternoon: string;
  greetEvening: string;
  welcomeBack: string;
  headline: string;
  workspace: string;
  statPlan: string;
  planConversations: string;
  planUnlimited: string;
  statPortfolios: string;
  portfoliosOf: string;
  portfoliosUnlimited: string;
  statHoldings: string;
  holdingsDetail: string;
  statConversations: string;
  conversationsDetail: string;
  launchEyebrow: string;
  launchTitle: string;
  recentTitle: string;
  viewAll: string;
  tickers: string;
  open: string;
}

const en: HomeStrings = {
  badge: 'PickSkill for Mac',
  greetMorning: 'Good morning',
  greetAfternoon: 'Good afternoon',
  greetEvening: 'Good evening',
  welcomeBack: 'Welcome back',
  headline: 'What are we researching today?',
  workspace: 'Your workspace',
  statPlan: 'Plan',
  planConversations: '{n} conversations / month',
  planUnlimited: 'Unlimited conversations',
  statPortfolios: 'Portfolios',
  portfoliosOf: 'of {limit} on your plan',
  portfoliosUnlimited: 'unlimited on your plan',
  statHoldings: 'Holdings',
  holdingsDetail: 'tickers tracked across portfolios',
  statConversations: 'Conversations',
  conversationsDetail: 'saved on this Mac',
  launchEyebrow: 'Workbench',
  launchTitle: 'Pick up where you left off.',
  recentTitle: 'Recent portfolios',
  viewAll: 'View all',
  tickers: '{n} tickers',
  open: 'Open',
};

const zhCN: HomeStrings = {
  badge: 'PickSkill Mac 版',
  greetMorning: '早上好',
  greetAfternoon: '下午好',
  greetEvening: '晚上好',
  welcomeBack: '欢迎回来',
  headline: '今天研究点什么？',
  workspace: '你的工作区',
  statPlan: '套餐',
  planConversations: '每月 {n} 次对话',
  planUnlimited: '对话不限量',
  statPortfolios: '组合',
  portfoliosOf: '套餐上限 {limit} 个',
  portfoliosUnlimited: '套餐内不限数量',
  statHoldings: '持仓',
  holdingsDetail: '所有组合中跟踪的标的',
  statConversations: '对话',
  conversationsDetail: '保存在这台 Mac 上',
  launchEyebrow: '工作台',
  launchTitle: '从上次停下的地方继续。',
  recentTitle: '最近的组合',
  viewAll: '查看全部',
  tickers: '{n} 个标的',
  open: '打开',
};

const zhTW: HomeStrings = {
  badge: 'PickSkill Mac 版',
  greetMorning: '早安',
  greetAfternoon: '午安',
  greetEvening: '晚安',
  welcomeBack: '歡迎回來',
  headline: '今天要研究什麼？',
  workspace: '你的工作區',
  statPlan: '方案',
  planConversations: '每月 {n} 次對話',
  planUnlimited: '對話不限量',
  statPortfolios: '投資組合',
  portfoliosOf: '方案上限 {limit} 個',
  portfoliosUnlimited: '方案內不限數量',
  statHoldings: '持股',
  holdingsDetail: '所有組合中追蹤的標的',
  statConversations: '對話',
  conversationsDetail: '儲存在這台 Mac 上',
  launchEyebrow: '工作台',
  launchTitle: '從上次停下的地方繼續。',
  recentTitle: '最近的投資組合',
  viewAll: '查看全部',
  tickers: '{n} 個標的',
  open: '開啟',
};

const ja: HomeStrings = {
  badge: 'PickSkill for Mac',
  greetMorning: 'おはようございます',
  greetAfternoon: 'こんにちは',
  greetEvening: 'こんばんは',
  welcomeBack: 'おかえりなさい',
  headline: '今日は何をリサーチしますか？',
  workspace: 'ワークスペース',
  statPlan: 'プラン',
  planConversations: '月 {n} 回の会話',
  planUnlimited: '会話は無制限',
  statPortfolios: 'ポートフォリオ',
  portfoliosOf: 'プラン上限 {limit} 件',
  portfoliosUnlimited: 'プラン内で無制限',
  statHoldings: '保有銘柄',
  holdingsDetail: '全ポートフォリオで追跡中の銘柄',
  statConversations: '会話',
  conversationsDetail: 'この Mac に保存',
  launchEyebrow: 'ワークベンチ',
  launchTitle: '前回の続きから。',
  recentTitle: '最近のポートフォリオ',
  viewAll: 'すべて表示',
  tickers: '{n} 銘柄',
  open: '開く',
};

const ko: HomeStrings = {
  badge: 'PickSkill for Mac',
  greetMorning: '좋은 아침입니다',
  greetAfternoon: '좋은 오후입니다',
  greetEvening: '좋은 저녁입니다',
  welcomeBack: '다시 오신 것을 환영합니다',
  headline: '오늘은 무엇을 리서치할까요?',
  workspace: '내 워크스페이스',
  statPlan: '요금제',
  planConversations: '월 {n}회 대화',
  planUnlimited: '대화 무제한',
  statPortfolios: '포트폴리오',
  portfoliosOf: '요금제 한도 {limit}개',
  portfoliosUnlimited: '요금제 내 무제한',
  statHoldings: '보유 종목',
  holdingsDetail: '전체 포트폴리오에서 추적 중인 종목',
  statConversations: '대화',
  conversationsDetail: '이 Mac에 저장됨',
  launchEyebrow: '워크벤치',
  launchTitle: '하던 작업을 이어서 하세요.',
  recentTitle: '최근 포트폴리오',
  viewAll: '전체 보기',
  tickers: '{n}개 종목',
  open: '열기',
};

const fr: HomeStrings = {
  badge: 'PickSkill pour Mac',
  greetMorning: 'Bonjour',
  greetAfternoon: 'Bon après-midi',
  greetEvening: 'Bonsoir',
  welcomeBack: 'Bon retour',
  headline: 'Sur quoi enquête-t-on aujourd’hui ?',
  workspace: 'Votre espace de travail',
  statPlan: 'Offre',
  planConversations: '{n} conversations / mois',
  planUnlimited: 'Conversations illimitées',
  statPortfolios: 'Portefeuilles',
  portfoliosOf: 'sur {limit} inclus dans votre offre',
  portfoliosUnlimited: 'illimités dans votre offre',
  statHoldings: 'Positions',
  holdingsDetail: 'titres suivis dans vos portefeuilles',
  statConversations: 'Conversations',
  conversationsDetail: 'enregistrées sur ce Mac',
  launchEyebrow: 'Atelier',
  launchTitle: 'Reprenez là où vous vous étiez arrêté.',
  recentTitle: 'Portefeuilles récents',
  viewAll: 'Tout voir',
  tickers: '{n} titres',
  open: 'Ouvrir',
};

const de: HomeStrings = {
  badge: 'PickSkill für Mac',
  greetMorning: 'Guten Morgen',
  greetAfternoon: 'Guten Tag',
  greetEvening: 'Guten Abend',
  welcomeBack: 'Willkommen zurück',
  headline: 'Was recherchieren wir heute?',
  workspace: 'Ihr Arbeitsbereich',
  statPlan: 'Tarif',
  planConversations: '{n} Unterhaltungen / Monat',
  planUnlimited: 'Unbegrenzte Unterhaltungen',
  statPortfolios: 'Portfolios',
  portfoliosOf: 'von {limit} in Ihrem Tarif',
  portfoliosUnlimited: 'unbegrenzt in Ihrem Tarif',
  statHoldings: 'Positionen',
  holdingsDetail: 'verfolgte Ticker über alle Portfolios',
  statConversations: 'Unterhaltungen',
  conversationsDetail: 'auf diesem Mac gespeichert',
  launchEyebrow: 'Werkbank',
  launchTitle: 'Machen Sie dort weiter, wo Sie aufgehört haben.',
  recentTitle: 'Letzte Portfolios',
  viewAll: 'Alle anzeigen',
  tickers: '{n} Ticker',
  open: 'Öffnen',
};

const es: HomeStrings = {
  badge: 'PickSkill para Mac',
  greetMorning: 'Buenos días',
  greetAfternoon: 'Buenas tardes',
  greetEvening: 'Buenas noches',
  welcomeBack: 'Bienvenido de nuevo',
  headline: '¿Qué investigamos hoy?',
  workspace: 'Tu espacio de trabajo',
  statPlan: 'Plan',
  planConversations: '{n} conversaciones / mes',
  planUnlimited: 'Conversaciones ilimitadas',
  statPortfolios: 'Carteras',
  portfoliosOf: 'de {limit} en tu plan',
  portfoliosUnlimited: 'ilimitadas en tu plan',
  statHoldings: 'Posiciones',
  holdingsDetail: 'tickers seguidos en tus carteras',
  statConversations: 'Conversaciones',
  conversationsDetail: 'guardadas en este Mac',
  launchEyebrow: 'Mesa de trabajo',
  launchTitle: 'Continúa donde lo dejaste.',
  recentTitle: 'Carteras recientes',
  viewAll: 'Ver todas',
  tickers: '{n} tickers',
  open: 'Abrir',
};

export const homeStrings: Record<Locale, HomeStrings> = {
  en,
  fr,
  de,
  es,
  ja,
  ko,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
};

/** "{n} tickers" → "3 tickers". */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}
