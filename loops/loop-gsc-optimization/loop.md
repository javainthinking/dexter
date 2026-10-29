# loop.md — PickSkill SEO / GEO 优化 Loop（主入口）

## 目标

每轮跑完一个闭环：

> 搜索表现数据（GSC）+ 内容与线上体检（GEO audit）→ 洞察 → 计划 → 实施 → 发布 → 下一轮回看

要优化的是两条获客漏斗（`apps/web/docs/blog-strategy.md` §1）：

- **SEO**：Google 上的高意图搜索词（"what is MACD"、"NVDA technical signals"、"如何读 10-K"）
- **GEO**：ChatGPT / Claude / Perplexity / AI Overviews 回答理财问题时引用 PickSkill

每轮的效果（CTR、排名、点击）在**发布后的读窗结束 + 3 天**之后回看，见下文「测量纪律」。

触发源有两种，流程相同：

1. **定期自跑**：Claude Desktop routine，建议每周一跑一次。loop 本身不设定时任务。routine 的提示词是：

   > 先 `cd ~/Workspace/products/dexter && git pull --ff-only`，然后重读 `loops/loop-gsc-optimization/loop.md`，按它跑一轮 SEO / GEO 优化 loop。

2. **飞书委派**：loops 台账仓的 `loop-feishu-trigger` 委派过来。聚焦主题以委派方给的输入为准，仍然从第 0 步完整执行。**发布确认门槛不因委派豁免**；委派请求原文里明确授权发布的，算已确认。

## 参考与差异

流程参照 apipick（`apipick/loops/loop-gsc-optimization`）和 2slides 的同名 loop。它们在几个月里用错误结论换来的测量规则，这里**从第一轮就内置**，写在下文「测量纪律」和 `scripts/seo/gsc-report.ts` 里，不再重新踩一遍。

PickSkill 特有的地方：

- **没有直接写数据库的发布路径**：博客是代码库里的 markdown，`apps/web/content/blog/<slug>.md`（英文）和 `apps/web/content/blog/<locale>/<slug>.md`（7 个译文语种）。所有改动都是代码变更，走「分支 → 本地验证 → 用户确认 → push」。**push main 就是 Vercel 生产部署。**
- **8 个语种**：en、fr、de、es、ja、ko、zh-CN、zh-TW。
- **多了 GEO 一维**：`scripts/seo/geo-audit.ts` 检查两类东西：
  - 内容结构：首段直接给答案、FAQ ≥ 3 条、站内链接、死链、译文覆盖、meta 宽度
  - 线上：JSON-LD、canonical、hreflang、H1、llms.txt 覆盖、robots 对 AI 爬虫的放行
- **GSC 不可用时降级运行**：只做 GEO 体检和内容修复，见「异常处理」。

## 第 0 步（每轮必做）：同步代码

```bash
cd /Users/julian/Workspace/products/dexter && git pull --ff-only
```

本地有未提交改动导致 pull 失败时，用 `git stash -u && git pull --ff-only && git stash pop`。**这里的 stash 只用于 pull，不得用来丢弃本 loop 目录下的改动**，见「档案红线」。

## 顺序编排

严格按顺序执行三步，上一步的产物是下一步的输入。任何一步不达标，就停在这一步修好，不跳步。

1. **input**：按 `input.md` 执行
   - 产出：`report/YYYYMMDD-input.md`，以及 `report/YYYYMMDD-assets/geo-audit.md`
   - 门槛：
     - 数据已更新，或已标明降级；机器报告和 GEO 体检都已生成
     - 到期的实验已判读
     - 每条发现都有数据支撑
     - 候选点按「影响 × 成本」排好序，选定了 1 个聚焦主题
2. **plan**：按 `plan.md` 执行
   - 输入：`YYYYMMDD-input.md`
   - 产出：`report/YYYYMMDD-plan.md`，需要回看效果的动作还要在 `experiments.json` 里预注册
   - 门槛：
     - 每个动作都落到具体文件或字段
     - 写明验证计划和成功判据
     - 要改的页面不在冻结页族里
3. **execute**：按 `execute.md` 执行
   - 输入：`YYYYMMDD-plan.md`
   - 产出：本地验证过的分支，以及 `report/YYYYMMDD-execute.md`
   - 门槛：
     - `geo-audit --gate`、typecheck、build 全部通过，dev 页面抽查通过
     - 发布状态写明，二选一：✅ 用户已确认并 push，或 ⏸️ 待用户确认

`YYYYMMDD` 是运行当天（Asia/Shanghai）。三步共用同一个日期，产物才串得起来。

## 每轮范围纪律

改动面太大，效果就无法归因。

- 每轮只**聚焦 1 个主题**，也就是一组强相关的优化点。
- **A 类**（meta 重写）每轮 ≤ 5 个页族。1 个页族 = 同一 slug 的全部语种版本。
- **D 类**（全站性技术修复，如 sitemap、hreflang、canonical、robots、页面模板）**单独成轮**，不和内容优化混在一轮。
- **模板级 meta**（例如 `lib/stocks/copy.ts` 的 `metaTitle` 会影响全部股票页）算 D 类，单独成轮。
- **C 类**（新文章）每轮 ≤ 2 篇。8 语种的完整发布是重活；译文要自然，不得逐字直译。
- **T 类**（补齐缺失译文）每轮 ≤ 3 篇 × 缺失语种。新增 URL 不改动已有页面，可以和 G 类同轮，但不能和改同一页族的 A、B 类同轮。
- **已冻结的页族不得改动**，也就是 `experiments.json` 里还没出结论的实验所涉及的页面。

## 测量纪律（从 apipick / 2slides 的事故中提炼，判读前必读）

1. **两张表各管各的**
   - `dexter_gsc_totals_daily` 没有偏差，站点级、页面级、分段级的总量、CTR、期望点击都只能从这里出。
   - `dexter_gsc_daily` 有 query 维度，但被 GSC 的匿名化截断了：apipick 实测点击被少算了 **17.8 倍**，覆盖率还会逐月下滑。它只用来回答 query 级的问题，引用它的绝对量时必须同时写出覆盖率。
2. **趋势桶对齐数据末日，每个桶写明天数**
   - GSC 数据末日固定是「今天 − 3」。按自然周切桶时，最后一个桶几乎必然是残桶，而**残桶看起来恒是「在下滑」**。
3. **任何环比都要带上 1σ 和桶边界敏感性**
   - 1σ 按 `σ_日 × √7 × √2` 计算。
   - 敏感性：把桶的结束日挪 1–2 天，看结论是否还成立。
   - 改善或恶化幅度 < 2σ 的，记 ⚪，**不为它写解释**。apipick 有过一次：同一个指标只因桶结束日不同，读数在 −22.6% 到 +1.5% 之间摆动。
4. **判读一个指标前，先算这个位置的期望点击**
   - 期望 CTR 用本站同分段、同位置桶的全历史 CTR，即报告 §8。**不用通用 SERP 曲线**：apipick 实测通用曲线偏差 3–26 倍。
   - 期望点击 < 1 次/周的页面，CTR 翻倍也读不出来，只能看位置。
5. **读窗锚定实际 push 日，不是计划发布日**
   - 读窗 = push 日次日起 N 个完整自然日。push 当天是残日，不计入。
   - 判读日 = push 日 + N + 3。
   - 预注册时只写相对公式；绝对日期在 push 之后才写进 `experiments.json` 的 `publishedOn`。
   - 原因：apipick 有一轮从本地验证到用户确认 push 隔了 8 天，用计划日期算的读窗里有 29% 是发布前的天数，效应被稀释，结果恒偏向「读不出效果」。
6. **判读只有三种结果：✅ 达标 / ❌ 未达标 / ⚪ 不可判读**
   - 样本不够的记 ⚪，不得记 ❌。
   - **首次读到 ❌ 时不结案**，要用发布后的第 2 个完整周复核一次。apipick 实测，有一次效应从发布后第 6 天才开始。
7. **读窗内不偷看**
   - 实验没到判读日之前，报告不显示它的当期数据（`gsc-report.ts` 的 §7 已强制）。
   - 候选表会剔除冻结页族。
   - 提前看到数据会诱导「再改一下」，污染整个实验。

## 异常处理

- **GSC 403 或没有授权**：跑 `bun run scripts/seo/gsc-verify.ts` 诊断，会打印需要授权的 service account 邮箱。本轮转为 **GEO 降级轮**：
  - 只用 `geo-audit` 的发现选主题，只做 G、T、D 类。
  - 不建需要 GSC 判读的 A、B 类实验。
  - summary 里写明「GSC 不可用」，飞书通知里提醒授权。
- **GSC 拉数失败**（网络、配额）：重试 2 次。仍然失败，就用库里已有的数据，并标明数据截止日；数据旧于 7 天，就按 GEO 降级轮处理。
- **同一份报告已经处理过**（`report/PROCESSED.md` 标了 ✅）：不重复分析。
- **没有值得做的点**：input 写明结论后，跳过 plan 和 execute，summary 照写。
- **本地验证反复不过**：在 execute 内部循环修复。超出一轮能力的，缩小范围，先交付能验证的部分，其余记为遗留项。
- **⚠️ 发布红线**：任何 `git commit` 或 `git push` 之前都必须得到用户确认（push main 就是生产部署，dexter `AGENTS.md` 也这样要求）。用户不在场时，loop 停在「⏸️ 待用户确认」收尾，把待发布清单写进 summary 和飞书通知。
- **⚠️ 档案红线**：对 `loops/loop-gsc-optimization/` 下的任何文件，**禁止**使用 `git checkout`、`git restore`、`git stash drop`。
  - 这里的产物经常处于「已修改、未提交」状态，因为要等用户确认才能提交。此时 git 还原的目标是上一次提交，而不是你改坏之前的工作区，等于直接删档。apipick 就这样一次丢掉了 13 个实验档案。
  - 整文件重写 `experiments.json` 之前，先 `cp` 一份到本轮的 `report/YYYYMMDD-assets/`；要撤销时从这份副本 `cp` 回来。
  - 修改用 Edit 做局部替换，不要用脚本 `json.dump` 整体重排，否则会产生全文件 diff，审不出到底改了什么。

## 收尾

### 1. 更新批次台账

在 `report/PROCESSED.md` 追加一行：

```markdown
| gsc-reports/gsc-report-<数据末日>.md 或「GEO 降级」 | <数据窗口> | ✅ 已处理 / ⏭️ 跳过（原因） | YYYYMMDD | report/YYYYMMDD.md · <commit 或 ⏸️ 待确认> |
```

### 2. 写 Loop Summary

不论完整走完还是中途停止，都要写 `report/YYYYMMDD.md`：

```markdown
# YYYYMMDD SEO / GEO Loop Summary

## 概况
- 数据：gsc-report-<末日>.md（窗口 <start> → <end>）/ GEO 降级（原因）
- 聚焦主题：…
- 结果：✅ 已发布 / ⏸️ 待用户确认 / ⚠️ 部分完成 / ⏭️ 跳过（原因）

## 各步骤产物
- input / plan / execute：report/YYYYMMDD-*.md · 分支 <name>

## 本轮做了什么
- 解决的问题（引用数据：展示 / CTR / 位置，或 audit 规则命中数）
- 改了哪些页面、文件

## 验证
- geo-audit --gate / typecheck / build / dev 抽查：<结果>
- 发布状态与实际 push 日：<日期或 ⏸️>
- 回滚：原始文件在 report/YYYYMMDD-assets/originals/

## 实验与回看
| 实验 id | 页族 | 指标 | 成功判据 | 读窗 | 判读日 |
|---|---|---|---|---|---|
（读窗与判读日在 push 后才写绝对日期；未 push 写「push 日次日起 N 天」）

## 遗留项
- [ ] …

## 复盘
- 顺利或卡住的地方；流程本身要改什么
```

### 3. 发飞书通知

summary 写完立即发，任何结束状态都发：

```bash
printf '%s' "<小结正文>" | loops/tools/feishu-notify.sh --title "PickSkill SEO/GEO Loop YYYYMMDD"
```

小结正文用 lark_md，控制在 12 行以内：

```markdown
**状态**：✅ 已发布 / ⏸️ 待确认发布 / ⚠️ 部分交付 / ⏭️ 跳过（原因）
**聚焦主题**：一句话
**关键发现**：1–2 条，附数据
**交付**：改了什么 + 验证结论 + 分支
**待办**：需要用户做什么（如确认后 push、给 GSC 授权）
**回看**：哪个实验、哪天判读
**详情**：loops/loop-gsc-optimization/report/YYYYMMDD.md
```

- webhook 凭证在 `loops/.env.feishu`，已被 gitignore。
- 没配置或发送失败都不阻塞 loop，在 summary 里记一笔「通知未送达」。

## 完成标准

- 三步按顺序执行，或按异常规则合理跳过。
- `report/YYYYMMDD.md` 一页看清四件事：用了什么数据、做了什么、验证结果如何、还剩什么。
- `report/PROCESSED.md` 已更新；需要回看的动作已登记在 `experiments.json`。
- 本轮产物和代码改动**分开提交**，都要在用户确认之后。产物的 commit message 例如 `chore(loops): seo-geo YYYYMMDD round`。
- 飞书通知已发送，或已记录「未送达」。

## 文件与命令

| 路径 | 作用 |
|---|---|
| `input.md` / `plan.md` / `execute.md` | 三步的执行说明 |
| `experiments.json` | 实验预注册、冻结页族和出队项的**唯一权威来源** |
| `gsc-reports/` | `gsc-report.ts` 生成的机器报告 |
| `report/` | 每轮产物：`YYYYMMDD-input/plan/execute.md`、`YYYYMMDD.md`、`YYYYMMDD-assets/`、`PROCESSED.md` |

| 命令（在仓库根目录执行） | 作用 |
|---|---|
| `bun run gsc:verify` | 诊断 GSC 授权并自动识别 property |
| `bun run gsc:pull` | 拉数入库：从库里最后一天续拉；首次用 `-- --days 90` 回填 |
| `bun run gsc:report` | 生成机器报告 |
| `bun run gsc:sitemap` | 检查 sitemap 是否同步，有漂移时自动重新提交（不是发布动作） |
| `bun run geo:audit -- --live --out <file>` | 内容 + 线上全量体检（调查用，恒 exit 0） |
| `bun run geo:audit -- --gate` | 提交前闸门：只拦新增或改动的值 |

环境变量放在仓库根目录 `.env.local`，已被 gitignore：
- `GSC_SERVICE_ACCOUNT_KEY_FILE`：可以和 2slides、apipick 共用同一个 service account
- `GSC_SITE_URL`：由 `gsc:verify` 自动识别后填入
- `DIRECT_URL`、`DATABASE_URL`

两张数据表 `dexter_gsc_daily`、`dexter_gsc_totals_daily` 由 `src/db/migrations/0011_gsc.sql` 创建。
