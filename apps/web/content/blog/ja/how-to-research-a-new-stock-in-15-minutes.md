---
title: PickSkillで新しい銘柄を15分でリサーチする方法
description: 事業モデル、財務、バリュエーション、テクニカル、リスクを網羅した完全な初回リサーチワークフローを、chatと指標ツールを使って15分で実施する手順。
publishedAt: 2026-05-26T00:00:00.000Z
updatedAt: 2026-05-26T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: PickSkillリサーチチーム — 個人投資家のためのAIアナリストを構築中。
pillar: how-to
tags:
  - tutorial
  - research
  - workflow
  - dcf
  - 10k
  - indicators
  - チュートリアル
  - リサーチ
  - ワークフロー
heroImage: /blog/how-to-research-a-new-stock-in-15-minutes/hero.png
heroAlt: >-
  インフォグラフィック — 左に 5 ステップのリサーチ・ワークフロー (ビジネス → 財務 → バリュエーション → テクニカル → リスク)、右に TSM
  の 1 ページ決定カード。
---

**かつて2〜3時間かかっていた初回の銘柄リサーチセッションは、適切なワークフローを使えば15分で完了できます。** ステップを飛ばしているからではなく — フレームワークは依然として事業モデル、財務、バリュエーション、テクニカル、リスクをカバーします — PickSkillがデータ収集ステップを数秒に圧縮し、実際に必要な15分(判断の時間)を残してくれるからです。本チュートリアルはその初回リサーチワークフローの定番形です。検討中の任意の新規銘柄について、ウォッチリストに加えるか、さらに深いリサーチに時間を投じるかを決める前に使ってみてください。

### 重要なポイント

- **5ステップ、合計約15分。** 事業 → 財務 → バリュエーション → テクニカル → リスク。各ステップは1プロンプトです。
- **フレームワークが構造的思考を強制する** — 上流の問いに答える前に「これを買うべきか?」へ飛んでしまうことを防ぎます。
- **1ページのサマリーを出力** し、[ウォッチリスト](/blog/how-to-build-a-watchlist-that-actually-works)への追加や却下の判断に使えます。
- **高速版(15分)はディールブレーカーの80%を捕捉します。** 低速版(2時間以上の深掘り)は、高速版が「面白い」と言った場合にのみ必要です。
- **米国株、香港株、A株のいずれにも同じワークフローで使えます** — PickSkillが市場に応じた開示資料を取得します。

## なぜこれが重要か

多くの個人投資家は初回リサーチの段階でつまずきます。よくある2つの失敗:

1. **いきなりチャートに飛ぶ。** 「チャートが良さそう」はテーゼではありません。事業モデルと財務のチェックがなければ、価格パターンを買っているだけです。
2. **詳細に溺れる。** 銘柄が深掘りに値するかを決める前に、10-Kの全文、8-K、最新の決算電話会議トランスクリプト、すべてのアナリストレポートを読む。読み終える頃には、構造化されたフレームワークなら1時間目で却下していた銘柄に4時間費やしています。

15分の初回ワークフローは却下フィルターです。リサーチする銘柄のほとんどはこれを通過しません。要点は、1銘柄あたり15分を費やし、通過した銘柄のために2時間の深掘りを温存することです。

## 5ステップのワークフロー

### ステップ1 — 事業モデル(3分)

[/chat](/chat)を開き、このプロンプトを貼り付けます:

```text
Summarize [TICKER] in 5 bullets:
1. What does the company actually do (1 sentence)
2. Revenue split — top 3 segments and their % of total
3. Top 3 customers or customer concentration
4. Top 3 competitors  
5. The single most important question this business needs to get right
```

PickSkillは最新の10-Kと最近のプレスリリースから構築した簡潔な事業モデルサマリーを返します。「最も重要な単一の問い」というフレーミングは、事業を実際に動かしているものへの明晰さを強制し、企業を理解しているのか単にティッカーを知っているだけなのかを見極めるテストになります。

**この段階の赤信号**:5項目読んでも事業モデルが明確でない、単一顧客への集中度が30%超、目に見える競争優位がない。これらが見えたらここで止めましょう — 残りの12分の価値はありません。

### ステップ2 — 財務の健全性(3分)

次のプロンプト:

```text
For [TICKER], pull the last 4 quarters and last 3 years of:
- Revenue and revenue growth YoY
- Gross margin trajectory
- Operating margin trajectory  
- Free cash flow (last 4 quarters)
- Net debt position (cash − total debt)
- Share count change YoY (buybacks vs issuance)
```

PickSkillは小さな表として描画します。財務ストーリーは1分の読み込みで一貫しているはずです。

**この段階の赤信号**:売上成長の急減速、明確な原因のないマージン圧縮、意図的な成長投資以外のフリーキャッシュフローのマイナス、買収活動なしに株式数が年5%以上増加。

### ステップ3 — バリュエーションスナップショット(3分)

次のプロンプト:

```text
For [TICKER], compute:
- Current trailing P/E, forward P/E, EV/EBITDA, P/B
- 5-year historical range for each multiple (10th–90th percentile)
- Where current multiples sit within that historical range
- Compare current multiples to 3 closest peers
- Quick 5-year DCF — implied price at base assumptions
```

PickSkillは倍率、ピア比較、簡易DCFを返します(詳細版は[60秒でDCFを組む](/blog/build-dcf-in-60-seconds)を参照)。

**この段階の赤信号**:すべての倍率が5年レンジの上限にありながら、それを正当化するファンダメンタルズの明確な加速がない;DCF含意価格が現在価格より30%以上低い;相対バリュエーションがすべてのピアより高い。

### ステップ4 — テクニカルセットアップ(3分)

次のプロンプト:

```text
For [TICKER], show me the current technical setup:
- Price vs 20 / 60 / 200-day MA
- Current MACD, RSI, KDJ readings
- Any active divergence (regular or hidden)
- Nearest support and resistance levels
- 5-day bucket trail across the full indicator suite
```

PickSkillは[/indicators](/indicators)データを引き出し、マルチシグナルのアラインメントを表示します。

**この段階の赤信号**:深く買われ過ぎた参入(RSI > 75、すべての指標が上限に張り付き)、弱気ダイバージェンスの形成、価格が200日SMAから大きく上方乖離。これらは「今すぐ買い」のセットアップではなく、「押し目を待つ」銘柄です。

### ステップ5 — リスク(3分)

最後のプロンプト:

```text
For [TICKER], list:
- Top 3 risks from the latest 10-K's risk factors section
- Top 3 risks from recent earnings calls (last 4 quarters)
- One downside scenario — what does this stock look like if the bull case is wrong?
```

PickSkillは10-Kのリスクファクターと直近の経営陣コメンタリーを要約します。下振れシナリオの問いは個人投資家が最も頻繁にスキップするステップであり、最も高くつくミスを捕捉する問いです。

**この段階の赤信号**:経営陣が明示するリスクに単一顧客集中、規制リスク、バランスシートの逼迫、または「継続企業」文言が含まれる。これらは自動的に失格ではありませんが、ポジションサイジングの議論を再フレームすべきサインです。

## アウトプットの編集方法

ステップ5の後、こう尋ねます:

```text
Compile this conversation into a one-page summary I can save:
- Business model in 2 sentences
- Financials trajectory in 4 bullets
- Valuation summary with 3-line bull/base/bear
- Technical setup status
- Top 3 risks
- Decision: watchlist, deeper research, or pass
```

PickSkillは構造化された1ページャーを返します。chatセッションのブックマークから保存しましょう。[ウォッチリスト](/blog/how-to-build-a-watchlist-that-actually-works)に追加すると決めたなら、その1ページャーがテーゼ文書になります。

> **今すぐ試す。** [/chat](/chat)を開き、検討中の銘柄に対して上記の5つのプロンプトを実行してみましょう。読み時間込みで全体は約15分です。

## 場当たり的リサーチでは捕捉できないこと

### 1. 構造的却下 vs 価格起点の却下

場当たり的リサーチはチャートの見た目(「買われ過ぎに見える」)で却下しがちで、その事業がどの価格でも保有に値するかを確認しません。構造化されたワークフローは順序を反転させます:事業 → 財務 → バリュエーション → テクニカル。事業や財務が落ちればチャートは無関係;事業と財務が通れば、チャートは「タイミング」を語るのであって「成立性」を語るのではありません。

### 2. 下振れシナリオの問い

個人投資家のリサーチで最も頻繁にスキップされるステップは「弱気シナリオはどう見えるか?」です。構造化ワークフローはこれを強制します。これがないと強気シナリオに過剰加重し、バリアンスへの備えが不足します。

### 3. 1か所でのマルチソース統合

ワークフローは10-Kデータ、直近の決算、現在の倍率、ピア比較、テクニカル状態を1つのchatセッションに引き込みます。手動だと各パートに10〜20分かかります — PickSkillは各々を数秒に圧縮し、実際の思考のための時間を残します。

## 銘柄リサーチで陥る4つの罠

1. **事業モデルのステップをスキップする。** 銘柄のティッカーを知ることは企業を知ることではありません。5項目のサマリーがなければ、企業をリサーチしているのではなくティッカーをトレードしているだけです。
2. **下振れシナリオを無視する。** 強気シナリオは自分から売り込んできますが、弱気シナリオは意図的に表面化させなければなりません。弱気シナリオを言語化できなければ、リサーチは終わっていません。
3. **「全部グリーン」を買いと扱う。** 強いファンダメンタルズ、魅力的なバリュエーション、良好なテクニカルが揃った銘柄は自動的に買いではありません — 簡単な利益はすでに取られ、今後12カ月は横ばいの銘柄もあります。ポジションサイジングと参入水準の規律が重要です。
4. **アウトプットをウォッチリスト追加または却下にコミットしない。** 15分の初回ワークフロー全体の目的は、最後に意思決定することです。「もう少し考える」が killer — メンタル帯域を消費するのに決定を生まない。ウォッチリスト、深掘りリサーチ、却下のいずれかに着地することを自分に強制しましょう。

## A株でのワークフロー適用

ワークフローはA株と香港株でも同一に機能します。2つの具体的調整:

- A株では「扣非净利润」(非経常的項目を除いた純利益)が関連する利益数値です;PickSkillはA株のPERとEPS成長率を計算する際にこれをデフォルトで使います。
- A株のバリュエーション倍率は、ほとんどのセクターで米国ピアより構造的に低くなっています。米国の同等品ではなくA株の歴史的レンジと比較しましょう。

市場固有のプレイブック全般は[A株のベスト指標](/blog/best-indicators-for-a-shares)を参照。

## よくあるフォローアッププロンプト

15分の初回ワークフローの後:

- *「[ticker]のより深いDCF — 完全な感応度表、セグメント別売上予測。」*
- *「[ticker]を3つの最も近いピアと、完全な倍率スタックおよびFCF成長で比較して。」*
- *「この会話から[ticker]の投資家向けデックを生成して。」*([chatから投資家デックを生成する](/blog/generate-investor-deck-from-chat)を参照。)
- *「[ticker]を次のテーゼでウォッチリストに追加して:[...]」*
- *「次の決算発表に向けて[ticker]の再レビューをスケジュールして。」*

## 参考文献

- [60秒でDCFを組む](/blog/build-dcf-in-60-seconds) — 15分の初回ワークフローを通過した後のバリュエーション深掘り。
- [10-Kを30分で読む方法](/blog/how-to-read-10k) — ステップ1+ステップ2の手動深読み版。
- [機能するウォッチリストの作り方](/blog/how-to-build-a-watchlist-that-actually-works) — 初回ワークフローを通過した銘柄の次の行き先。

## FAQ

**Why 15 minutes — isn't that too fast for a stock?**
初回のyes/no判断には、15分で十分以上です — ほとんどの銘柄はこの段階で却下されるはずです。深い作業(具体的な仮定のモデル化、最近のSEC提出書類全部の読み込み、元従業員への取材)は、初回を生き残った少数の銘柄のためにとっておきます。出会うすべての銘柄に4時間かけるのが、意欲ある個人投資家の最大の失敗パターンです。

**Can I research multiple names in parallel?**
はい — PickSkillは並列のchatセッションをサポートします。多くのユーザーは同時に3〜5セッションを開き、各々で同じ5プロンプトテンプレートを実行します。構造化されているため、バッチリサーチが実用的になります。

**What if PickSkill doesn't have data on the name?**
PickSkillは米国上場(NYSE / NASDAQ)、香港上場(HKEx)、A株上場(SSE / SZSE)のほとんどの銘柄をカバーします。非常に小型または上場直後の銘柄ではカバレッジが薄いことがあります — PickSkillはデータをでっち上げるのではなく、利用不可能なデータポイントを明示します。

**Should I save the chat sessions?**
はい — PickSkillのすべてのchatセッションは永続化されます。有用なリサーチセッションを後参照のためにブックマークしましょう。ポジションを取ると決めたとき、chatセッションはテーゼに到達した経緯の監査証跡になります。

**How does this differ from generic ChatGPT research?**
PickSkillのchatは、モデルの訓練データではなく、ライブの提出書類、マーケットデータ、計算済み指標に接地しています。ChatGPTは売上高数値やPER倍率をハルシネートします;PickSkillはクエリ時に一次ソースから引き出します。この構造的差異は、財務とバリュエーションのステップで最も重要です — 古い数値や捏造された数値は結論を完全に変え得ます。
