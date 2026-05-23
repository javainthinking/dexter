/**
 * Export-to-PPT/Word/Excel prompt builders for the indicators surface.
 *
 * Strategy: serialize the current view's data into compact JSON, then
 * append a format-specific design brief. The combined payload becomes
 * the chat composer's pre-filled content. The agent on the chat side
 * has tools to actually generate the .pptx / .docx / .xlsx files.
 *
 * Two view shapes are exported:
 *   - Summary view: 8 dimensions × N tickers (bucket trails + daily changes).
 *   - Per-dimension view: 1 dimension × N tickers with the latest indicator
 *     values + a 5-day bucket trail (no full OHLCV — keeps the JSON tight).
 *
 * Both shapes drop into a single `buildExportPrompt(...)` builder.
 *
 * Locale: every prompt is fully localised to the user's UI language so
 * (a) the user can read the prompt before sending, and (b) the agent
 * produces a document in the same language. The lookup falls back to
 * English when a locale isn't yet translated.
 */

import { DIMENSION_KEYS, type DimensionKey } from './labels';
import type { Bucket } from './math';

export type ExportFormat = 'ppt' | 'word' | 'excel';

/** UI locales the prompts are translated for. Mirrors `lib/i18n/locales.ts`. */
export type ExportLang = 'en' | 'zh-CN' | 'zh-TW' | 'ja' | 'ko' | 'de' | 'fr' | 'es';

interface SummaryDim {
  bucket?: Bucket;
  bucketTrend?: Array<{ time: string; bucket: Bucket }>;
  bucketLabels?: Record<Bucket, string>;
  error?: string;
}

interface SummaryEntryLike {
  ticker: string;
  displayName: string | null;
  latestClose?: number | null;
  latestAsOf?: string | null;
  dailyChanges: Array<{ time: string; changePct: number | null }>;
  macd: SummaryDim;
  ma: SummaryDim;
  rsi: SummaryDim;
  kdj: SummaryDim;
  boll: SummaryDim;
  adx: SummaryDim;
  volume: SummaryDim;
  flow: SummaryDim;
}

interface DimTickerEntryLike {
  ticker: string;
  displayName?: string | null;
  prices?: Array<{ time: string; close: number | null }>;
  bucket?: Bucket;
  bucketTrend?: Array<{ time: string; bucket: Bucket }>;
  latest?: Record<string, number | null | string>;
  error?: string;
}

// ─── JSON shape builders (locale-independent) ────────────────────────

function summaryToJson(entries: SummaryEntryLike[], portfolioName: string | null) {
  const dimensions = DIMENSION_KEYS.map((k) => k);
  return {
    schemaVersion: 1,
    view: 'summary' as const,
    portfolio: portfolioName,
    dimensions,
    tickers: entries.map((e) => ({
      ticker: e.ticker,
      displayName: e.displayName,
      latestClose: e.latestClose ?? null,
      latestAsOf: e.latestAsOf ?? null,
      dailyChanges: e.dailyChanges,
      indicators: Object.fromEntries(
        DIMENSION_KEYS.map((k) => {
          const dim = e[k];
          if (dim?.error) return [k, { error: dim.error }];
          return [
            k,
            {
              bucket: dim?.bucket ?? null,
              label:
                dim?.bucket && dim?.bucketLabels ? dim.bucketLabels[dim.bucket] : null,
              trail: dim?.bucketTrend ?? [],
            },
          ];
        }),
      ),
    })),
  };
}

function dimensionToJson(
  dim: DimensionKey,
  tickers: DimTickerEntryLike[],
  portfolioName: string | null,
) {
  return {
    schemaVersion: 1,
    view: 'dimension' as const,
    portfolio: portfolioName,
    dimension: dim,
    tickers: tickers.map((t) => {
      if (t.error) {
        return { ticker: t.ticker, displayName: t.displayName ?? null, error: t.error };
      }
      const latestTime = t.prices?.[t.prices.length - 1]?.time ?? null;
      return {
        ticker: t.ticker,
        displayName: t.displayName ?? null,
        latestAsOf: latestTime,
        latest: t.latest ?? {},
        bucket: t.bucket ?? null,
        trail: t.bucketTrend ?? [],
      };
    }),
  };
}

// ─── Localised preambles + briefs ────────────────────────────────────
//
// Each locale gets its own preamble and one brief per format. Keeping
// them inline (rather than templating) lets translators read the
// surrounding context. Indicator acronyms (MACD/RSI/etc.) and hex
// colour codes stay constant across all languages.

const PREAMBLES: Record<ExportLang, (json: string) => string> = {
  en: (json) =>
    `Below is the current view data from the PickSkill indicators dashboard (JSON):\n\n\`\`\`json\n${json}\n\`\`\``,
  'zh-CN': (json) =>
    `以下是来自 PickSkill 指标面板的当前视图数据(JSON 格式):\n\n\`\`\`json\n${json}\n\`\`\``,
  'zh-TW': (json) =>
    `以下是來自 PickSkill 指標面板的當前檢視資料(JSON 格式):\n\n\`\`\`json\n${json}\n\`\`\``,
  ja: (json) =>
    `以下は PickSkill 指標ダッシュボードの現在のビューデータ(JSON 形式)です:\n\n\`\`\`json\n${json}\n\`\`\``,
  ko: (json) =>
    `다음은 PickSkill 지표 대시보드의 현재 뷰 데이터(JSON 형식)입니다:\n\n\`\`\`json\n${json}\n\`\`\``,
  de: (json) =>
    `Nachfolgend die Daten der aktuellen Ansicht aus dem PickSkill-Indikator-Dashboard (JSON):\n\n\`\`\`json\n${json}\n\`\`\``,
  fr: (json) =>
    `Voici les données de la vue actuelle du tableau de bord d'indicateurs PickSkill (JSON) :\n\n\`\`\`json\n${json}\n\`\`\``,
  es: (json) =>
    `A continuación los datos de la vista actual del panel de indicadores PickSkill (JSON):\n\n\`\`\`json\n${json}\n\`\`\``,
};

// ── PPT briefs (one per locale) ──────────────────────────────────────

const PPT_BRIEFS: Record<ExportLang, string> = {
  en: `\n\nUsing the data above, design and generate a professional presentation (PPT/PPTX). **Write all slide content in English.**

**Audience**: investors / analysts reading an indicator-scan report.

**Core principle — visualization first**:
- Anything that can be expressed as a chart must NOT be left as raw numbers or paragraphs.
- Every data slide must contain ≥1 chart.
- Combine numbers + visuals (icons / progress bars / sparklines / colour cells) instead of plain text walls.

**Recommended chart types**:
- **Signal distribution**: ring / donut chart (bullish / bearish / neutral share)
- **5-day signal trail**: render the trail as a row of 5 coloured blocks or dots (stable / flipping / flickering patterns visualised)
- **Cross-ticker comparison**: horizontal bar chart (composite score) or heatmap (tickers × indicators → colour matrix)
- **Price action**: a small sparkline per ticker
- **Per-ticker indicator readout**: radar chart (8 indicator axes) or gauge cluster
- **Trend evolution**: stacked bar / stream graph for indicator changes over 5 days

**Style**:
- Dark business style, market-colour aware (red-up CN / green-up US — pick one consistently).
- ≤15 slides, dense information but generous whitespace.

**⚠️ Text-vs-background contrast (mandatory)**:
- Every piece of text must contrast clearly with its page background — NO "similar colour, can't read the text" situations.
- On dark backgrounds (#0b1220, #14120b, etc.) use light body text (#F4F4F5, #E5E7EB). Avoid mid-grey (#6b7280, #94a3b8) for body — only for secondary annotation.
- On light backgrounds (#FFFFFF, #F9FAFB) use dark body text (#111827, #1f2937). Avoid pale grey (#9CA3AF) for body.
- Up/down colours: use saturated tones (#ef4444 / #22c55e) on dark backgrounds, not pastel reds/greens that vanish.
- Chart axis labels and legends MUST meet the same contrast bar as body text — no "it's just a legend, light grey is fine".
- Target: body ≥ 7:1 (WCAG AAA); annotations ≥ 4.5:1. Verify before settling on a palette.
- After every page, sanity-check: can a human read the text against its background within 1 second? If not, change the colour.

**Slide structure (each section must carry a matching visual)**:
1. **Cover**: title, date, # of tickers, time range (optional thumbnail heatmap backdrop)
2. **Overview**: **must** include a signal-distribution ring chart + a ranked bar chart (composite score) + brief text summary
3. **Per-stock analysis (1 slide per ticker)**:
   - Top: price sparkline + key numbers (latest close, 5D %)
   - Middle: 8-axis radar OR 5-day trail matrix
   - Bottom: key indicator readouts + one-line action note
4. **Cross-ticker comparison**: **must** use a heatmap or bar chart of top-N (bullish / bearish columns)
5. **Risks**: data limits, A-share price-limit days, synthetic-flow caveat (text OK; add small chart if data supports)

Please generate the PPTX directly for download.`,

  'zh-CN': `\n\n请基于以上技术指标数据,为我设计并生成一份专业的演示文稿(PPT/PPTX)。**所有幻灯片内容请使用简体中文。**

**整体定位**:面向投资者 / 分析师的指标扫描报告

**核心原则:数据可视化优先**
- 任何能用图表展示的内容,都不要只用文字或数字罗列
- 每张数据页都应至少包含 1 个图表,避免大段文字堆砌
- 数字 + 视觉(图标 / 进度条 / 迷你折线 / 色块)的组合比纯文字更有说服力

**推荐的图表类型**:
- **信号分布**:环形图 / 饼图(看多 / 看空 / 中性 各占比例)
- **5 日信号 trail**:5 个色块或圆点的序列(稳定 / 翻转 / 闪烁形态可视化)
- **跨标的对比**:横向条形图(按综合得分排序)、热力图(标的 × 指标)
- **价格走势**:每只标的一张迷你 sparkline 折线图
- **个股指标读数**:雷达图(8 个指标各为一个轴)、或仪表盘集合
- **趋势演化**:堆叠条 / 流图展示 5 日内各指标的变化

**风格**:
- 深色商务风,中国市场惯例(红涨绿跌,可调)
- 不超过 15 页,信息密度高但留白合理

**⚠️ 文字与背景的对比度(强制要求)**:
- 每一处文字都必须与所在 page 背景形成清晰对比 — **不允许"颜色相近,文字看不清"**
- 深色背景(#0b1220、#14120b 等)上的正文用浅色(#F4F4F5、#E5E7EB),避免中等灰度(#6b7280、#94a3b8 这类只适合次要标注)
- 浅色背景(#FFFFFF、#F9FAFB)上的正文用深色(#111827、#1f2937),避免浅灰(#9CA3AF)做主文
- 红涨绿跌:深色背景上用饱和度足够的(#ef4444 / #22c55e),不要用浅红粉 / 浅薄荷
- 图表轴标签、图例文字必须与正文对比度一致,不能因为"次要"就用浅灰
- 标准:正文 ≥ 7:1(WCAG AAA);次要标注 ≥ 4.5:1
- **每页完成后**自检:1 秒内能否清楚识别文字?不能则换色

**页面结构(每节配相应可视化)**:
1. **封面页**:标题、日期、覆盖标的数与时间范围(可放总体热力图作背景缩略)
2. **整体概览**:**必须包含信号分布环形图 + 综合得分条形图** + 简要文字总结
3. **个股分析(每只标的 1 页)**:
   - 顶部:股价 sparkline + 关键数字(最新价、5 日涨跌)
   - 中部:8 指标雷达图 或 5 日 trail 矩阵
   - 底部:关键指标读数 + 一句话操作建议
4. **横向对比**:**必须用热力图或条形图** 展示信号最强的 Top N(看多 / 看空各列)
5. **风险提示**:数据局限、A 股涨跌停影响、合成口径(资金流向)等

请直接生成 PPTX 文件供下载。`,

  'zh-TW': `\n\n請基於以上技術指標資料,為我設計並生成一份專業的簡報(PPT/PPTX)。**所有投影片內容請使用繁體中文。**

**整體定位**:面向投資者 / 分析師的指標掃描報告

**核心原則:資料視覺化優先**
- 任何能用圖表展示的內容,都不要只用文字或數字羅列
- 每張資料頁都應至少包含 1 個圖表
- 數字 + 視覺(圖示 / 進度條 / 迷你折線 / 色塊)的組合比純文字更有說服力

**推薦的圖表類型**:
- **訊號分佈**:環形圖 / 圓餅圖(看多 / 看空 / 中性 各佔比例)
- **5 日訊號 trail**:5 個色塊或圓點的序列(穩定 / 翻轉 / 閃爍形態視覺化)
- **跨標的比較**:橫向長條圖(按綜合得分排序)、熱力圖(標的 × 指標)
- **價格走勢**:每隻標的一張迷你 sparkline 折線圖
- **個股指標讀數**:雷達圖(8 個指標各為一個軸)、或儀表板集合
- **趨勢演化**:堆疊條 / 流圖展示 5 日內各指標的變化

**風格**:
- 深色商務風,中國市場慣例(紅漲綠跌,可調)
- 不超過 15 頁,資訊密度高但留白合理

**⚠️ 文字與背景的對比度(強制要求)**:
- 每處文字都必須與所在 page 背景形成清晰對比 — **不允許"顏色相近,文字看不清"**
- 深色背景(#0b1220、#14120b 等)上的正文用淺色(#F4F4F5、#E5E7EB),避免中等灰度(#6b7280、#94a3b8 這類只適合次要標註)
- 淺色背景(#FFFFFF、#F9FAFB)上的正文用深色(#111827、#1f2937),避免淺灰(#9CA3AF)做主文
- 紅漲綠跌:深色背景上用飽和度足夠的(#ef4444 / #22c55e),不要用淺紅粉 / 淺薄荷
- 圖表軸標籤、圖例文字必須與正文對比度一致
- 標準:正文 ≥ 7:1(WCAG AAA);次要標註 ≥ 4.5:1
- **每頁完成後**自檢:1 秒內能否清楚識別文字?不能則換色

**頁面結構(每節配相應可視化)**:
1. **封面頁**:標題、日期、覆蓋標的數與時間範圍
2. **整體概覽**:**必須包含訊號分佈環形圖 + 綜合得分長條圖** + 簡要文字總結
3. **個股分析(每隻標的 1 頁)**:股價 sparkline + 8 指標雷達圖或 5 日 trail 矩陣 + 操作建議
4. **橫向比較**:**必須用熱力圖或長條圖** 展示訊號最強的 Top N
5. **風險提示**:資料局限、A 股漲跌停影響、合成口徑(資金流向)等

請直接生成 PPTX 檔案供下載。`,

  ja: `\n\n上記の技術指標データに基づき、プロフェッショナルなプレゼンテーション(PPT/PPTX)を設計・生成してください。**すべてのスライド内容は日本語で記述してください。**

**対象**:投資家 / アナリスト向けの指標スキャンレポート

**コア原則:データの可視化最優先**
- グラフで表せるデータは、生の数字や文章の羅列にしないこと
- すべてのデータスライドにグラフを最低 1 つ
- 数字 + ビジュアル(アイコン / プログレスバー / スパークライン / カラーセル)の組み合わせで読みやすく

**推奨グラフタイプ**:
- **シグナル分布**: ドーナツチャート(強気 / 弱気 / 中立の割合)
- **5 日シグナル trail**: 5 つのカラーブロック / ドットの並びで可視化
- **銘柄間比較**: 横棒グラフ(総合スコア順)、ヒートマップ(銘柄 × 指標)
- **株価推移**: 各銘柄ごとのミニ sparkline
- **銘柄別指標**: レーダーチャート(8 軸)またはゲージクラスター
- **トレンド推移**: 5 日間の指標変化を積み上げ棒 / フローグラフで

**スタイル**:
- ダークビジネス調、市場色慣習(中国式の赤上昇 / 米国式の緑上昇 — 一貫して選択)
- 15 ページ以内、情報密度高め、適切な余白

**⚠️ 文字と背景のコントラスト(必須)**:
- 全ての文字は背景と明確にコントラストすること — **"色が似て読めない"を絶対に避ける**
- 暗い背景(#0b1220、#14120b 等)上の本文は明るい色(#F4F4F5、#E5E7EB)、中間グレー(#6b7280、#94a3b8)は副次注記のみ
- 明るい背景(#FFFFFF、#F9FAFB)上の本文は暗い色(#111827、#1f2937)、淡いグレー(#9CA3AF)を本文に使わない
- 上昇下落の色:暗い背景には十分に飽和した色(#ef4444 / #22c55e)、パステルカラーは避ける
- グラフの軸ラベル / 凡例も本文と同じコントラストを満たす
- 基準:本文 ≥ 7:1(WCAG AAA);注記 ≥ 4.5:1
- **各ページ完成後**自己確認:1 秒で読めるか?読めなければ色を変える

**スライド構成(各セクションにビジュアル必須)**:
1. **表紙**:タイトル、日付、銘柄数、期間
2. **全体概観**:**必須でシグナル分布ドーナツ + 総合スコア棒グラフ** + 要約文
3. **個別銘柄分析(各銘柄 1 ページ)**: 株価 sparkline + 8 指標レーダー / 5 日 trail マトリクス + アクション案
4. **銘柄間比較**:**必須でヒートマップまたは棒グラフ**(強気/弱気 Top N)
5. **リスク**: データ制約、A 株値幅制限、合成キャッシュフローの注意

PPTX ファイルを直接生成してダウンロード可能にしてください。`,

  ko: `\n\n위 기술 지표 데이터를 기반으로 전문 프레젠테이션(PPT/PPTX)을 설계하고 생성해 주세요. **모든 슬라이드 내용은 한국어로 작성하세요.**

**대상**: 투자자 / 애널리스트를 위한 지표 스캔 리포트

**핵심 원칙: 데이터 시각화 우선**
- 차트로 표현 가능한 데이터는 숫자나 문단으로 나열하지 않기
- 모든 데이터 슬라이드에 차트 ≥ 1
- 숫자 + 시각화(아이콘 / 프로그레스 바 / 스파크라인 / 색상 셀) 조합으로 가독성 향상

**권장 차트 유형**:
- **신호 분포**: 도넛 차트(강세 / 약세 / 중립 비율)
- **5일 신호 trail**: 5개 색상 블록 / 점의 시퀀스로 시각화
- **종목 간 비교**: 가로 막대(종합 점수 순), 히트맵(종목 × 지표)
- **주가 추이**: 종목별 미니 스파크라인
- **종목별 지표**: 레이더 차트(8축) 또는 게이지 클러스터
- **추세 변화**: 5일간 지표 변화를 누적 막대 / 플로우 그래프로

**스타일**:
- 다크 비즈니스 톤, 시장 색상 관행(중국식 적상 / 미국식 녹상 — 일관되게 선택)
- 15페이지 이내, 정보 밀도 높지만 여백 충분

**⚠️ 텍스트-배경 대비(필수)**:
- 모든 텍스트는 배경과 명확히 대비 — **"색이 비슷해서 읽기 어려운" 상황 절대 금지**
- 어두운 배경(#0b1220, #14120b 등)에 본문은 밝은 색(#F4F4F5, #E5E7EB), 중간 회색(#6b7280, #94a3b8)은 보조 주석에만
- 밝은 배경(#FFFFFF, #F9FAFB)에 본문은 어두운 색(#111827, #1f2937), 옅은 회색(#9CA3AF)을 본문에 사용 금지
- 상승/하락 색상: 어두운 배경에서는 채도 있는 색(#ef4444 / #22c55e), 파스텔 톤 피하기
- 차트 축 라벨, 범례도 본문과 동일한 대비 기준
- 기준: 본문 ≥ 7:1(WCAG AAA); 주석 ≥ 4.5:1
- **각 페이지 완성 후** 자체 검토: 1초 안에 읽히는가? 아니면 색 변경

**슬라이드 구조(각 섹션에 시각화 포함)**:
1. **표지**: 제목, 날짜, 종목 수, 기간
2. **전체 개요**: **필수로 신호 분포 도넛 + 종합 점수 막대** + 요약 문장
3. **개별 종목 분석(종목당 1페이지)**: 주가 스파크라인 + 8축 레이더 / 5일 trail 매트릭스 + 액션 노트
4. **종목 간 비교**: **필수로 히트맵 또는 막대 그래프**(강세/약세 Top N)
5. **리스크**: 데이터 한계, A주 가격 제한일, 합성 자금 흐름 주의

PPTX 파일을 직접 생성하여 다운로드 가능하게 해주세요.`,

  de: `\n\nErstellen Sie auf Basis der obigen Indikatordaten eine professionelle Präsentation (PPT/PPTX). **Sämtlicher Folieninhalt auf Deutsch.**

**Zielgruppe**: Investoren / Analysten, die einen Indikator-Scan-Bericht lesen.

**Kernprinzip — Visualisierung zuerst**:
- Alles, was sich grafisch darstellen lässt, NICHT als rohe Zahlen oder Textwüsten belassen.
- Jede Datenfolie braucht ≥ 1 Diagramm.
- Zahlen + Visualisierung (Icons / Fortschrittsbalken / Sparklines / Farbzellen) statt reiner Texte.

**Empfohlene Diagrammtypen**:
- **Signalverteilung**: Ringdiagramm (bullish / bearish / neutral Anteil)
- **5-Tage-Signal-Trail**: Reihe aus 5 farbigen Blöcken / Punkten (stabile / kippende / flackernde Muster)
- **Tickervergleich**: horizontales Balkendiagramm (Score-sortiert), Heatmap (Ticker × Indikator)
- **Kursverlauf**: Mini-Sparkline pro Ticker
- **Indikator-Übersicht pro Ticker**: Radar (8 Achsen) oder Anzeigen-Cluster
- **Trendverlauf**: gestapelte Balken / Stream-Graph für Indikatoränderungen über 5 Tage

**Stil**:
- Dunkler Business-Look, marktfarbsensitiv (rot-hoch CN / grün-hoch US — konsistent wählen).
- ≤ 15 Folien, hohe Informationsdichte mit großzügigem Weißraum.

**⚠️ Text-Hintergrund-Kontrast (zwingend)**:
- Jeder Text muss klar gegen den Folienhintergrund kontrastieren — **KEINE "Farbe ähnlich, Text nicht lesbar" Situation**.
- Auf dunklen Hintergründen (#0b1220, #14120b etc.) hellen Fließtext (#F4F4F5, #E5E7EB); mittlere Grautöne (#6b7280, #94a3b8) nur für Sekundäranmerkungen.
- Auf hellen Hintergründen (#FFFFFF, #F9FAFB) dunklen Fließtext (#111827, #1f2937); kein helles Grau (#9CA3AF) als Fließtext.
- Up/Down-Farben: gesättigte Töne (#ef4444 / #22c55e) auf dunklen Hintergründen, keine Pastelltöne.
- Achsen- und Legendentexte müssen die gleiche Kontraststufe erfüllen.
- Ziel: Fließtext ≥ 7:1 (WCAG AAA); Anmerkungen ≥ 4.5:1.
- **Nach jeder Folie** prüfen: Innerhalb 1 Sekunde lesbar? Sonst Farbe ändern.

**Folienstruktur (jeder Abschnitt mit passender Visualisierung)**:
1. **Titelfolie**: Titel, Datum, Tickerzahl, Zeitraum
2. **Gesamtübersicht**: **Pflicht**: Signalverteilungs-Ring + Score-Balkendiagramm + Kurzfazit
3. **Einzelaktien-Analyse (1 Folie pro Ticker)**: Sparkline + Radar / 5-Tage-Trail-Matrix + Handlungsempfehlung
4. **Tickervergleich**: **Pflicht**: Heatmap oder Balkendiagramm der Top-N (bullish / bearish)
5. **Risiken**: Datengrenzen, A-Share Preisbegrenzungstage, synthetischer Cashflow

Bitte generieren Sie die PPTX direkt zum Download.`,

  fr: `\n\nÀ partir des données ci-dessus, concevez et générez une présentation professionnelle (PPT/PPTX). **Rédigez tout le contenu des diapositives en français.**

**Public** : investisseurs / analystes lisant un rapport de scan d'indicateurs.

**Principe central — visualisation d'abord** :
- Tout ce qui peut être un graphique ne doit PAS rester en chiffres bruts ou en paragraphes.
- Chaque diapositive de données doit contenir ≥ 1 graphique.
- Chiffres + visuel (icônes / barres de progression / sparklines / cellules colorées) au lieu de texte brut.

**Types de graphiques recommandés** :
- **Distribution des signaux** : anneau (proportion haussier / baissier / neutre)
- **Trail de 5 jours** : 5 blocs / points colorés en séquence (motifs stables / inversés / clignotants)
- **Comparaison entre tickers** : barre horizontale (par score composite), heatmap (ticker × indicateur)
- **Évolution du prix** : mini-sparkline par ticker
- **Tableau d'indicateurs par ticker** : radar (8 axes) ou cluster de jauges
- **Évolution de tendance** : barres empilées / flow graph sur 5 jours

**Style** :
- Aspect business sombre, convention de couleur de marché (rouge-haut CN / vert-haut US — choisir une convention).
- ≤ 15 diapositives, densité informative élevée avec respiration.

**⚠️ Contraste texte/fond (obligatoire)** :
- Chaque texte doit contraster nettement avec son fond — **PAS de "couleurs proches, texte illisible"**.
- Fond sombre (#0b1220, #14120b, etc.) : corps clair (#F4F4F5, #E5E7EB) ; gris moyen (#6b7280, #94a3b8) uniquement pour annotations secondaires.
- Fond clair (#FFFFFF, #F9FAFB) : corps sombre (#111827, #1f2937) ; pas de gris pâle (#9CA3AF) pour le corps.
- Couleurs hausse/baisse : tons saturés (#ef4444 / #22c55e) sur fond sombre, éviter les pastels.
- Étiquettes d'axes et légendes : même contraste que le corps.
- Cible : corps ≥ 7:1 (WCAG AAA) ; annotations ≥ 4.5:1.
- **Après chaque diapositive**, vérifier : lisible en 1 seconde ? Sinon changer la couleur.

**Structure des diapositives (chaque section avec sa visualisation)** :
1. **Couverture** : titre, date, nombre de tickers, période
2. **Vue d'ensemble** : **obligatoire** : anneau de distribution + barre de score + texte synthétique
3. **Analyse par action (1 diapo par ticker)** : sparkline + radar / matrice trail 5 jours + recommandation
4. **Comparaison inter-tickers** : **obligatoire** : heatmap ou barres du Top N (haussier / baissier)
5. **Risques** : limites de données, jours de limite A-share, flux synthétique

Veuillez générer le fichier PPTX directement pour téléchargement.`,

  es: `\n\nCon los datos anteriores, diseña y genera una presentación profesional (PPT/PPTX). **Todo el contenido de las diapositivas debe estar en español.**

**Público**: inversores / analistas leyendo un informe de escaneo de indicadores.

**Principio central — visualización primero**:
- Todo lo que pueda ser un gráfico NO debe quedar como números crudos ni párrafos.
- Cada diapositiva de datos debe incluir ≥ 1 gráfico.
- Números + visual (iconos / barras de progreso / sparklines / celdas coloreadas) en lugar de muros de texto.

**Tipos de gráfico recomendados**:
- **Distribución de señales**: anillo (proporción alcista / bajista / neutral)
- **Trail de 5 días**: 5 bloques / puntos coloreados en secuencia (patrones estables / invertidos / parpadeantes)
- **Comparación entre tickers**: barra horizontal (por puntuación compuesta), mapa de calor (ticker × indicador)
- **Evolución de precio**: mini-sparkline por ticker
- **Lectura de indicadores por ticker**: radar (8 ejes) o conjunto de medidores
- **Evolución de tendencia**: barras apiladas / gráfico de flujo a 5 días

**Estilo**:
- Estilo business oscuro, convención de color del mercado (rojo-sube CN / verde-sube US — elegir una).
- ≤ 15 diapositivas, alta densidad informativa con espaciado generoso.

**⚠️ Contraste texto-fondo (obligatorio)**:
- Cada texto debe contrastar claramente con su fondo — **NUNCA "colores similares, texto ilegible"**.
- Fondo oscuro (#0b1220, #14120b, etc.): cuerpo claro (#F4F4F5, #E5E7EB); gris medio (#6b7280, #94a3b8) solo para notas secundarias.
- Fondo claro (#FFFFFF, #F9FAFB): cuerpo oscuro (#111827, #1f2937); no usar gris pálido (#9CA3AF) para cuerpo.
- Colores alza/baja: tonos saturados (#ef4444 / #22c55e) sobre fondos oscuros, evitar pasteles.
- Etiquetas de ejes y leyendas con el mismo contraste que el cuerpo.
- Objetivo: cuerpo ≥ 7:1 (WCAG AAA); anotaciones ≥ 4.5:1.
- **Tras cada diapositiva**, verificar: ¿legible en 1 segundo? Si no, cambiar el color.

**Estructura de diapositivas (cada sección con su visualización)**:
1. **Portada**: título, fecha, número de tickers, período
2. **Vista general**: **obligatorio**: anillo de distribución + barra de puntuación + resumen
3. **Análisis por valor (1 diapo por ticker)**: sparkline + radar / matriz trail 5 días + recomendación
4. **Comparación entre tickers**: **obligatorio**: mapa de calor o barras de Top N (alcista / bajista)
5. **Riesgos**: límites de datos, días de límite A-share, flujo sintético

Por favor genera el archivo PPTX directamente para descargar.`,
};

// ── Word briefs (one per locale) ─────────────────────────────────────

const WORD_BRIEFS: Record<ExportLang, string> = {
  en: `\n\nUsing the data above, write a detailed research report (Word document / DOCX). **Write the entire report in English.**

**Core principle — words AND visuals**:
- Anything that can be visualised should ship with a chart (embedded image or styled table).
- Avoid long unbroken text — every 200-300 words intersperse a chart or data table.
- Conclusions stated in numbers must have visual backing.

**Recommended visualisations**:
- **Signal distribution chart** (after the abstract): pie / ring showing bullish / bearish / neutral proportion
- **Composite-score table**: sortable, with conditional-formatting colour
- **5-day signal trail visualisation**: one row per ticker, 5 colour cells = 5 daily buckets
- **Cross-indicator heatmap**: ticker × indicator matrix → see convergence at a glance
- **Price sparkline thumbnails**: one per ticker, embedded in the per-stock paragraph
- **Top-N ranking bar charts**: bullish / bearish leaders

**Report structure**:
1. **Abstract** (150-200 words): coverage, key findings, overall lean — **+ signal distribution chart**
2. **Section 1 — Methodology**: brief introduction to the indicator set (MACD / MA / RSI / KDJ / BOLL / ADX / Volume / Flow) and the 5-day trail logic — optional small visual.
3. **Section 2 — Per-stock analysis** (one paragraph per ticker):
   - Latest indicator readouts (small embedded table)
   - **Price sparkline thumbnail**
   - **5-day trail colour-cell row**
   - Trail-pattern interpretation (stable / flipping / flickering)
   - Cross-check vs price action
   - Action recommendation (enter / watch / exit)
4. **Section 3 — Cross-ticker comparison**: **heatmap + Top-N bars** + narrative (strongest signals, what to watch, what to avoid)
5. **Section 4 — Risks**: data limits, A-share limit-up/down impact, synthetic-flow caveat
6. **Appendix**: raw JSON + methodology notes

**Format**:
- Professional research-report tone, English
- 2000-3500 words + 6-10 charts minimum
- Please generate the DOCX directly for download`,

  'zh-CN': `\n\n请基于以上技术指标数据,撰写一份详细的研究报告(Word 文档 / DOCX)。**整份报告请使用简体中文。**

**核心原则:图文并茂**
- 任何能可视化的数据都应配图表(嵌入式图片或表格)
- 避免连续大段文字 — 每 200-300 字应穿插一张图或一个数据表
- 数字结论必须有可视化支撑

**推荐的可视化元素**:
- **信号分布图**(摘要后):饼图 / 环形图展示看多 / 看空 / 中性占比
- **个股综合得分表**:可排序的表格,加条件格式颜色
- **5 日信号 trail 可视化**:每只标的一行,5 列对应 5 天,用色块表示 bucket
- **跨指标热力图**:标的 × 指标 → 颜色矩阵,直观看出哪只信号最共振
- **价格走势缩略图**:每只标的的 sparkline,嵌入个股分析段落
- **Top N 排名条形图**:看多 / 看空各列前几名

**报告结构**:
1. **摘要**(150–200 字):本次扫描覆盖的标的数、关键发现、整体倾向 + **信号分布环形图**
2. **一、方法论**:简述指标体系(MACD / MA / RSI / KDJ / BOLL / ADX / 量价 / 资金流)与 5 日信号 trail 规则
3. **二、个股分析**:每只标的一段,包含
   - 最新指标读数(嵌入小表格)
   - **股价 sparkline 缩略图**
   - **5 日 trail 可视化色块行**
   - 5 日信号演化解读(稳定 / 翻转 / 闪烁三类形态)
   - 与价格走势的相互印证
   - 操作建议(进 / 观望 / 出)
4. **三、横向对比**:**包含热力图 + Top N 条形图** + 文字解读(信号最强、值得关注、应回避)
5. **四、风险提示**:数据局限、A 股涨跌停影响、合成口径(资金流向)
6. **附录**:原始数据 JSON 与方法学说明

**格式**:
- 专业研究报告口吻,中文
- 2000–3500 字 + 图表至少 6-10 张
- 直接生成 DOCX 文件供下载`,

  'zh-TW': `\n\n請基於以上技術指標資料,撰寫一份詳細的研究報告(Word 文件 / DOCX)。**整份報告請使用繁體中文。**

**核心原則:圖文並茂**
- 任何能視覺化的資料都應配圖表(嵌入圖片或表格)
- 避免連續大段文字 — 每 200-300 字穿插一張圖或資料表
- 數字結論必須有視覺化支撐

**推薦的視覺化元素**:
- **訊號分佈圖**(摘要後):圓餅圖 / 環形圖
- **個股綜合得分表**:可排序,加條件格式
- **5 日訊號 trail 視覺化**:每隻標的一行,5 個色塊
- **跨指標熱力圖**:標的 × 指標
- **價格走勢縮略圖**:每隻標的的 sparkline
- **Top N 排名長條圖**

**報告結構**:
1. **摘要**(150–200 字):覆蓋標的數、關鍵發現、整體傾向 + **訊號分佈環形圖**
2. **一、方法論**:指標體系(MACD / MA / RSI / KDJ / BOLL / ADX / 量價 / 資金流)與 5 日 trail 規則
3. **二、個股分析**:每隻標的一段(指標讀數 + sparkline + trail 色塊 + 形態解讀 + 操作建議)
4. **三、橫向比較**:**包含熱力圖 + Top N 長條圖** + 文字解讀
5. **四、風險提示**:資料局限、A 股漲跌停影響、合成口徑
6. **附錄**:原始資料 JSON 與方法學說明

**格式**:
- 專業研究報告口吻,繁體中文,2000–3500 字 + ≥ 6 張圖表
- 直接生成 DOCX 檔案供下載`,

  ja: `\n\n上記の技術指標データに基づき、詳細な調査レポート(Word/DOCX)を執筆してください。**レポート全体を日本語で記述してください。**

**コア原則:文字と視覚の組み合わせ**
- 視覚化可能なデータは必ずグラフ(埋め込み画像または整形表)を付ける
- 連続する長い文章を避け、200-300 文字ごとにグラフまたはデータ表を挿入
- 数字による結論は視覚的に裏付ける

**推奨ビジュアル要素**:
- **シグナル分布図**(要約後):パイ / ドーナツ
- **個別銘柄総合スコア表**:ソート可能、条件付き書式付き
- **5 日 trail 可視化**:銘柄ごとに 1 行 × 5 列のカラーセル
- **指標間ヒートマップ**:銘柄 × 指標
- **株価スパークライン**:銘柄ごとに 1 枚
- **Top N ランキング棒グラフ**

**レポート構成**:
1. **要約**(150-200 文字):カバレッジ、主要発見、全体傾向 + **シグナル分布ドーナツ**
2. **第 1 章 方法論**:指標体系(MACD/MA/RSI/KDJ/BOLL/ADX/出来高/資金フロー)と 5 日 trail ロジック
3. **第 2 章 個別銘柄分析**:銘柄ごとに 1 段落(指標読み値表 + スパークライン + trail カラーセル行 + 形態解釈 + 行動推奨)
4. **第 3 章 銘柄間比較**:**ヒートマップ + Top N 棒グラフ** + 解釈
5. **第 4 章 リスク**:データ制約、A 株値幅制限、合成キャッシュフローの注意
6. **付録**:原始 JSON + 方法論

**フォーマット**:
- プロフェッショナルなリサーチレポート調、日本語、2000-3500 文字 + 図表 6-10 枚以上
- DOCX を直接生成`,

  ko: `\n\n위 기술 지표 데이터를 기반으로 상세 리서치 리포트(Word/DOCX)를 작성해 주세요. **리포트 전체를 한국어로 작성하세요.**

**핵심 원칙: 텍스트와 시각화의 조합**
- 시각화 가능한 데이터는 차트(임베디드 이미지 또는 형식화된 표)와 함께 제공
- 긴 연속 문장 피하기 — 200-300자마다 차트 또는 표 삽입
- 숫자 결론에는 시각적 뒷받침 필수

**권장 시각화 요소**:
- **신호 분포 차트**(요약 후): 파이 / 도넛
- **종목 종합 점수 표**: 정렬 가능, 조건부 서식 색상
- **5일 trail 시각화**: 종목당 1행 × 5색상 셀
- **지표 간 히트맵**: 종목 × 지표
- **주가 스파크라인**: 종목당 1개
- **Top N 순위 막대 그래프**

**리포트 구조**:
1. **요약**(150-200자): 커버리지, 주요 발견, 전체 경향 + **신호 분포 도넛**
2. **1장 방법론**: 지표 체계(MACD/MA/RSI/KDJ/BOLL/ADX/거래량/자금흐름)와 5일 trail 로직
3. **2장 종목별 분석**: 종목당 1단락(지표 수치 + 스파크라인 + trail 색상 행 + 패턴 해석 + 액션 권고)
4. **3장 종목 간 비교**: **히트맵 + Top N 막대** + 해석
5. **4장 리스크**: 데이터 한계, A주 가격 제한, 합성 자금흐름 주의
6. **부록**: 원본 JSON + 방법론

**형식**:
- 전문 리서치 리포트 톤, 한국어, 2000-3500자 + 차트 ≥ 6개
- DOCX 직접 생성`,

  de: `\n\nVerfassen Sie auf Basis der obigen Indikatordaten einen ausführlichen Forschungsbericht (Word / DOCX). **Schreiben Sie den gesamten Bericht auf Deutsch.**

**Kernprinzip — Text UND Visualisierung**:
- Alles Visualisierbare muss mit einer Grafik (eingebettete Bilder oder formatierten Tabellen) erscheinen.
- Lange ununterbrochene Textblöcke vermeiden — alle 200-300 Wörter Grafik oder Datentabelle einbauen.
- Zahlbasierte Schlussfolgerungen müssen visuelle Unterstützung haben.

**Empfohlene Visualisierungen**:
- **Signalverteilung** (nach dem Abstract): Kreis / Ring
- **Composite-Score-Tabelle**: sortierbar, mit bedingter Formatierung
- **5-Tage-Trail-Visualisierung**: pro Ticker eine Zeile mit 5 Farbzellen
- **Indikator-Heatmap**: Ticker × Indikator
- **Kurs-Sparkline-Miniaturen**: pro Ticker eine
- **Top-N-Ranking-Balken**

**Berichtstruktur**:
1. **Abstract** (150-200 Wörter): Abdeckung, Kernerkenntnisse, Tendenz + **Signal-Ring-Diagramm**
2. **Abschnitt 1 — Methodik**: Indikator-Set (MACD/MA/RSI/KDJ/BOLL/ADX/Volumen/Flow) und 5-Tage-Trail-Logik
3. **Abschnitt 2 — Einzelaktien-Analyse**: pro Ticker ein Absatz (Werte + Sparkline + Trail-Farbzeile + Mustererklärung + Handlungsempfehlung)
4. **Abschnitt 3 — Tickervergleich**: **Heatmap + Top-N-Balken** + Interpretation
5. **Abschnitt 4 — Risiken**: Datengrenzen, A-Share Limit-Tage, synthetischer Flow
6. **Anhang**: Roh-JSON + Methodik

**Format**:
- Professioneller Forschungsberichts-Ton, Deutsch, 2000-3500 Wörter + ≥ 6 Diagramme
- DOCX direkt erzeugen`,

  fr: `\n\nÀ partir des données ci-dessus, rédigez un rapport de recherche détaillé (Word / DOCX). **Rédigez tout le rapport en français.**

**Principe central — texte ET visuel** :
- Tout ce qui est visualisable doit avoir un graphique (image embarquée ou tableau formaté).
- Éviter les longs blocs de texte — toutes les 200-300 mots, intercaler un graphique ou un tableau.
- Les conclusions chiffrées doivent avoir un support visuel.

**Visualisations recommandées** :
- **Distribution des signaux** (après le résumé) : camembert / anneau
- **Tableau des scores composites** : triable, mise en forme conditionnelle
- **Trail 5 jours** : une ligne par ticker × 5 cellules colorées
- **Heatmap inter-indicateurs** : ticker × indicateur
- **Miniatures sparkline du cours** : une par ticker
- **Barres Top N**

**Structure** :
1. **Résumé** (150-200 mots) : portée, conclusions clés, tendance + **anneau de distribution**
2. **Section 1 — Méthodologie** : set d'indicateurs (MACD/MA/RSI/KDJ/BOLL/ADX/Volume/Flow) et logique trail 5 jours
3. **Section 2 — Analyse par valeur** : un paragraphe par ticker (valeurs + sparkline + ligne trail + interprétation + recommandation)
4. **Section 3 — Comparaison** : **heatmap + barres Top N** + interprétation
5. **Section 4 — Risques** : limites des données, jours de limite A-share, flux synthétique
6. **Annexe** : JSON brut + méthodologie

**Format** :
- Ton professionnel, français, 2000-3500 mots + ≥ 6 graphiques
- Générer le DOCX directement`,

  es: `\n\nCon los datos anteriores, redacta un informe de investigación detallado (Word / DOCX). **Redacta todo el informe en español.**

**Principio central — texto Y visualización**:
- Todo lo visualizable debe llevar un gráfico (imagen embebida o tabla formateada).
- Evitar bloques largos de texto — cada 200-300 palabras intercalar un gráfico o tabla.
- Las conclusiones numéricas necesitan respaldo visual.

**Visualizaciones recomendadas**:
- **Distribución de señales** (tras el resumen): tarta / anillo
- **Tabla de puntuación compuesta**: ordenable, formato condicional
- **Trail de 5 días**: una fila por ticker × 5 celdas coloreadas
- **Mapa de calor entre indicadores**: ticker × indicador
- **Miniaturas sparkline de precio**: una por ticker
- **Barras Top N**

**Estructura**:
1. **Resumen** (150-200 palabras): cobertura, hallazgos clave, tendencia + **anillo de distribución**
2. **Sección 1 — Metodología**: conjunto de indicadores (MACD/MA/RSI/KDJ/BOLL/ADX/Volumen/Flujo) y lógica trail 5 días
3. **Sección 2 — Análisis por valor**: un párrafo por ticker (lecturas + sparkline + fila trail + interpretación + recomendación)
4. **Sección 3 — Comparación**: **mapa de calor + barras Top N** + interpretación
5. **Sección 4 — Riesgos**: límites de datos, días de límite A-share, flujo sintético
6. **Apéndice**: JSON crudo + metodología

**Formato**:
- Tono profesional, español, 2000-3500 palabras + ≥ 6 gráficos
- Generar el DOCX directamente`,
};

// ── Excel briefs (one per locale) ────────────────────────────────────

const EXCEL_BRIEFS: Record<ExportLang, string> = {
  en: `\n\nUsing the data above, generate a structured Excel workbook (XLSX). **All headers and any explanatory text should be in English.**

**Core principle — use Excel's native visualization features**:
- Every data sheet should use conditional formatting (data bars / colour scales / icon sets) so numbers are scannable at a glance.
- Include a dedicated chart sheet — not just numeric tables.
- Use Excel sparklines (in-cell mini charts) for the 5-day trend column.

**Workbook design**:
- **Sheet 1 "Composite Signals"**: one row per ticker, columns include
  - Ticker / Name / Latest Close / Day Change % / 5-Day Change %
  - Each indicator's current bucket (bullish / bearish / neutral)
  - Composite score (count of bullish − count of bearish across 8 indicators)
  - **In-cell sparkline column for the 5-day daily-change series**
  - **Conditional formatting**: data bars on the composite-score column; colour fill on bucket columns (bullish / bearish / neutral each a colour); 3-colour scale on the day-change column
- **Sheet 2 "5-Day Trail"**: one row per (ticker × trading day), columns are each indicator's bucket for that day
  - **Colour-fill each bucket cell** (bullish green/red, bearish opposite, neutral grey) — natural heatmap
  - Optional **bucket-flip count** column showing trail stability
- **Sheet 3 "Indicator Details"**: latest raw values per ticker (MACD DIF/DEA/HIST, RSI, KDJ K/D/J, BOLL %B, etc.)
  - **Per-column conditional formatting**: RSI 3-colour scale (overbought red / mid white / oversold green), same for KDJ K, data bars for ADX, etc.
- **Sheet 4 "Charts"** (required): at minimum
  - **Pie / ring chart**: overall bullish / bearish / neutral distribution
  - **Horizontal bar chart**: tickers sorted by composite score
  - **Scatter or heatmap**: ticker × indicator (optional, if data supports)
- **Sheet 5 "Raw Data"**: full JSON text for cross-checking

**Format**:
- English headers
- Numeric columns: red-up / green-down conditional formatting (Chinese market convention) or your preferred convention — be consistent
- Bucket columns: colour fill (bullish / bearish dedicated, neutral grey)
- Freeze top row + ticker column
- Right-align numbers + tabular-nums style
- Please generate the XLSX directly for download`,

  'zh-CN': `\n\n请基于以上技术指标数据,生成一份结构化的 Excel 工作簿(XLSX)。**所有表头和说明文字请使用简体中文。**

**核心原则:用 Excel 原生的可视化能力**
- 每个数据 sheet 都应配条件格式(数据条 / 色阶 / 图标集) 让数字直观可读
- 单独的图表 sheet,而不是只有数字表格
- 用 Excel sparkline(单元格内迷你图)展示 5 日趋势

**工作表设计**:
- **Sheet 1 "综合信号"**:每行一只标的,列包含
  - 标的代码 / 名称 / 最新价 / 日涨跌% / 5 日涨跌%
  - 各指标当前 bucket(看多 / 看空 / 中性)
  - 综合评分(8 指标看多数 − 看空数)
  - **5 日涨跌的 sparkline 列(单元格内迷你折线)**
  - **条件格式**:综合评分用数据条;bucket 列用颜色填充;涨跌列用三色色阶
- **Sheet 2 "5 日趋势"**:每行 = 标的 × 交易日,列为各指标当日 bucket
  - **每个 bucket 格子用颜色填充**(形成天然热力图)
  - 可加 **bucket 翻转次数列**
- **Sheet 3 "指标明细"**:每只标的最新原始数值(MACD DIF/DEA/HIST、RSI、KDJ K/D/J、BOLL %B 等)
  - **每列条件格式**:RSI 三色色阶(超买红 / 中性白 / 超卖绿)、KDJ K 同理、ADX 数据条等
- **Sheet 4 "图表"**(必出):至少包含
  - **饼图 / 环形图**:看多 / 看空 / 中性整体分布
  - **横向条形图**:标的按综合评分排序
  - **散点图或热力图**:标的 × 指标(可选)
- **Sheet 5 "原始数据"**:完整 JSON 文本,方便复核

**格式**:
- 中文表头
- 数值列条件格式:涨标红、跌标绿(中国惯例)
- bucket 列颜色填充
- 冻结首行表头 + 首列代码
- 数据列右对齐 + tabular-nums

请直接生成 XLSX 文件供下载。`,

  'zh-TW': `\n\n請基於以上技術指標資料,生成一份結構化的 Excel 活頁簿(XLSX)。**所有表頭和說明文字請使用繁體中文。**

**核心原則:善用 Excel 原生視覺化功能**
- 每個資料 sheet 都應配條件式格式設定(資料橫條 / 色階 / 圖示集)
- 單獨的圖表 sheet
- 用 Excel sparkline(儲存格內迷你圖)展示 5 日趨勢

**工作表設計**:
- **Sheet 1 "綜合訊號"**: 每行一隻標的,欄位包含 代碼 / 名稱 / 最新價 / 日漲跌% / 5 日漲跌% / 各指標 bucket / 綜合評分 / 5 日 sparkline / 條件式格式
- **Sheet 2 "5 日趨勢"**: 標的 × 交易日的 bucket 矩陣,每個 bucket 格用顏色填充
- **Sheet 3 "指標明細"**: 各指標的最新原始數值,每列適配的條件式格式
- **Sheet 4 "圖表"**(必出):圓餅 / 環形圖、橫向長條圖、(可選)熱力圖
- **Sheet 5 "原始資料"**:完整 JSON 文字

**格式**:
- 繁體中文表頭
- 數值條件式格式:漲標紅、跌標綠(中國慣例)
- 凍結首行 + 首列
- 數值右對齊 + tabular-nums

請直接生成 XLSX 檔案供下載。`,

  ja: `\n\n上記の指標データに基づき、構造化された Excel ワークブック(XLSX)を生成してください。**すべてのヘッダーと説明テキストを日本語で記述してください。**

**コア原則:Excel ネイティブの可視化機能を活用**
- すべてのデータシートに条件付き書式(データバー / カラースケール / アイコンセット)を適用し、数字を一目で読み取れるように
- 独立したチャートシートを用意(数字テーブルだけにしない)
- Excel スパークライン(セル内ミニチャート)で 5 日トレンドを表示

**ワークブック設計**:
- **Sheet 1 "総合シグナル"**: 銘柄ごとに 1 行、列に 銘柄/名称/最新価/日次騰落%/5日騰落%/各指標 bucket/総合スコア/5日スパークライン/条件付き書式
- **Sheet 2 "5日トレンド"**: 銘柄 × 取引日の bucket マトリクス、各 bucket セルにカラーフィル
- **Sheet 3 "指標詳細"**: 各指標の最新生値、列ごとの条件付き書式
- **Sheet 4 "チャート"**(必須):円 / ドーナツ、横棒、(オプション)ヒートマップ
- **Sheet 5 "生データ"**: 完全な JSON テキスト

**フォーマット**:
- 日本語ヘッダー
- 数値の条件付き書式:中国式(赤上昇 / 緑下落)または一貫したコンベンション
- 先頭行 + 銘柄列を固定
- 数値は右揃え + tabular-nums

XLSX を直接生成してください。`,

  ko: `\n\n위 지표 데이터를 기반으로 구조화된 Excel 워크북(XLSX)을 생성해 주세요. **모든 헤더와 설명 텍스트는 한국어로 작성하세요.**

**핵심 원칙: Excel 네이티브 시각화 기능 활용**
- 모든 데이터 시트에 조건부 서식(데이터 막대 / 색상 스케일 / 아이콘 세트) 적용
- 별도의 차트 시트 (숫자 테이블만 두지 말 것)
- Excel 스파크라인(셀 내 미니 차트)으로 5일 추세 표시

**워크북 구성**:
- **Sheet 1 "종합 신호"**: 종목별 1행, 열: 종목/이름/최신가/일간 변동%/5일 변동%/각 지표 bucket/종합 점수/5일 스파크라인/조건부 서식
- **Sheet 2 "5일 추이"**: 종목 × 거래일의 bucket 매트릭스, 각 bucket 셀 색상 채우기
- **Sheet 3 "지표 상세"**: 각 지표 최신값, 열별 조건부 서식
- **Sheet 4 "차트"** (필수): 파이 / 도넛, 가로 막대, (선택) 히트맵
- **Sheet 5 "원본 데이터"**: 전체 JSON 텍스트

**서식**:
- 한국어 헤더
- 수치 조건부 서식: 중국식(상승 적 / 하락 녹) 또는 일관된 규칙
- 첫 행 + 종목 열 고정
- 수치 우정렬 + tabular-nums

XLSX를 직접 생성해 주세요.`,

  de: `\n\nErstellen Sie auf Basis der obigen Indikatordaten eine strukturierte Excel-Arbeitsmappe (XLSX). **Alle Überschriften und erklärenden Texte auf Deutsch.**

**Kernprinzip — Excels native Visualisierungen nutzen**:
- Jedes Datenblatt mit bedingter Formatierung (Datenbalken / Farbskalen / Symbolsätze).
- Eigenes Diagrammblatt — nicht nur Zahlentabellen.
- Excel-Sparklines (zellinterne Mini-Charts) für die 5-Tage-Trend-Spalte.

**Mappenstruktur**:
- **Sheet 1 "Composite Signals"**: pro Ticker eine Zeile mit Ticker/Name/Schlusskurs/Tages-%/5T-%/jedes Indikator-Bucket/Composite Score/5-Tage-Sparkline/bedingte Formatierung
- **Sheet 2 "5-Tage-Trail"**: Ticker × Handelstag-Matrix der Buckets, jede Zelle farbgefüllt
- **Sheet 3 "Indikator-Details"**: aktuelle Rohwerte pro Indikator, spaltenspezifische Formatierung
- **Sheet 4 "Diagramme"** (Pflicht): Kreis/Ring, horizontaler Balken, (optional) Heatmap
- **Sheet 5 "Rohdaten"**: vollständiger JSON-Text

**Format**:
- Deutsche Überschriften
- Numerische Formatierung: rot-hoch / grün-tief (CN-Konvention) oder konsistent
- Erste Zeile + Ticker-Spalte fixieren
- Zahlen rechtsbündig + tabular-nums

Bitte erzeugen Sie die XLSX direkt zum Download.`,

  fr: `\n\nÀ partir des données ci-dessus, générez un classeur Excel structuré (XLSX). **Tous les en-têtes et textes explicatifs en français.**

**Principe central — utiliser les fonctions natives de visualisation Excel** :
- Chaque feuille de données avec mise en forme conditionnelle (barres de données / dégradés / icônes).
- Une feuille dédiée aux graphiques (pas seulement des tableaux numériques).
- Sparklines Excel (mini-graphiques dans la cellule) pour la colonne de tendance 5 jours.

**Structure du classeur** :
- **Feuille 1 "Signaux composites"** : une ligne par ticker avec ticker/nom/dernier cours/var. quotid.%/var. 5J%/bucket de chaque indicateur/score composite/sparkline 5J/mise en forme conditionnelle
- **Feuille 2 "Trail 5 jours"** : matrice ticker × jour de trading des buckets, chaque cellule avec remplissage couleur
- **Feuille 3 "Détails des indicateurs"** : valeurs brutes par indicateur, mise en forme par colonne
- **Feuille 4 "Graphiques"** (obligatoire) : camembert/anneau, barres horizontales, (optionnel) heatmap
- **Feuille 5 "Données brutes"** : texte JSON complet

**Format** :
- En-têtes en français
- Mise en forme numérique : rouge-haut / vert-bas (convention CN) ou cohérente
- Figer la première ligne + colonne ticker
- Nombres alignés à droite + tabular-nums

Veuillez générer le XLSX directement.`,

  es: `\n\nCon los datos anteriores, genera un libro Excel estructurado (XLSX). **Todos los encabezados y textos explicativos en español.**

**Principio central — usar funciones nativas de visualización de Excel**:
- Cada hoja de datos con formato condicional (barras de datos / escalas de color / conjuntos de iconos).
- Hoja dedicada a gráficos (no solo tablas numéricas).
- Sparklines de Excel (mini-gráficos en celda) para la columna de tendencia 5 días.

**Estructura del libro**:
- **Hoja 1 "Señales compuestas"**: una fila por ticker con ticker/nombre/último cierre/var. diaria%/var. 5D%/bucket de cada indicador/puntuación compuesta/sparkline 5D/formato condicional
- **Hoja 2 "Trail 5 días"**: matriz ticker × día de cotización de buckets, cada celda con relleno de color
- **Hoja 3 "Detalles de indicadores"**: valores brutos por indicador, formato por columna
- **Hoja 4 "Gráficos"** (obligatorio): tarta/anillo, barras horizontales, (opcional) mapa de calor
- **Hoja 5 "Datos brutos"**: texto JSON completo

**Formato**:
- Encabezados en español
- Formato numérico: rojo-arriba / verde-abajo (convención CN) o consistente
- Inmovilizar primera fila + columna ticker
- Números alineados a la derecha + tabular-nums

Por favor genera el XLSX directamente.`,
};

function briefFor(format: ExportFormat, lang: ExportLang): string {
  const table = format === 'ppt' ? PPT_BRIEFS : format === 'word' ? WORD_BRIEFS : EXCEL_BRIEFS;
  return table[lang] ?? table.en;
}

function preambleFor(lang: ExportLang, json: string): string {
  return (PREAMBLES[lang] ?? PREAMBLES.en)(json);
}

// ─── Public API ──────────────────────────────────────────────────────

/**
 * Build the full chat-composer content for an export action.
 *
 * The combined payload reads as: localised preamble line + JSON code
 * fence + format-specific design brief in the same language. Locale
 * is resolved through PROMPTS / PREAMBLES with an English fallback so
 * a newly-added locale that doesn't yet have translations still
 * produces a usable prompt instead of breaking.
 */
export function buildExportPrompt(args: {
  format: ExportFormat;
  lang: ExportLang;
  portfolioName: string | null;
  summaryEntries?: SummaryEntryLike[];
  dimensionTickers?: DimTickerEntryLike[];
  dimension?: DimensionKey;
}): string | null {
  const { format, lang, portfolioName } = args;
  let payload: unknown;
  if (args.summaryEntries && args.summaryEntries.length > 0) {
    payload = summaryToJson(args.summaryEntries, portfolioName);
  } else if (
    args.dimensionTickers &&
    args.dimensionTickers.length > 0 &&
    args.dimension
  ) {
    payload = dimensionToJson(args.dimension, args.dimensionTickers, portfolioName);
  } else {
    return null;
  }

  const json = JSON.stringify(payload, null, 2);
  return preambleFor(lang, json) + briefFor(format, lang) + '\n';
}
