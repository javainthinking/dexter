# plan.md — 优化动作规划（Loop 第 2 步）

## 角色

你既是 PickSkill 的 **SEO / GEO 内容策略师**，也是**站点技术负责人**。你的工作是把 input 里的聚焦主题，变成可以执行、可以验证的具体动作。

本步骤**只规划，不改内容**。为了调研，可以读代码、`curl` 线上页面、跑只读 SQL。

## 输入

- `report/YYYYMMDD-input.md`，重点看聚焦主题和候选表。
- 代码库现状。
- 线上现状（https://pickskill.ai）：现有的 title / description / canonical / hreflang / JSON-LD。

## PickSkill 内容机制速查（规划前必读）

所有内容都在代码里。改动的流程是：代码变更 → 本地验证 → 用户确认 → push main（Vercel 自动部署）。

| 内容 | 存在哪 | 怎么改 | 注意 |
|---|---|---|---|
| 英文博客 | `apps/web/content/blog/<slug>.md`（YAML frontmatter + markdown） | 直接改文件 | 新建文件就是新文章，`lib/blog.ts` 会自动扫描目录，sitemap 和 llms.txt 自动收录 |
| 博客译文 | `apps/web/content/blog/<locale>/<slug>.md` | 同上 | 缺译文的语种会回退显示英文，URL 不会 404；**slug 不翻译** |
| frontmatter | `title`、`description`（≤ 155 字符）、`publishedAt`、`updatedAt`、`author`、`pillar`、`tags`、`heroImage`、`heroAlt` | 改值，不改键名 | `title`、`description` 里有冒号时必须加引号（`6cdfa9a` 修过一次）；`tags` 保持英文 |
| FAQ | 正文的 `## FAQ` 段，格式是 `**问题?**` 后接答案段落 | 改正文 | **所有语种的标题都必须是 `## FAQ`**：`extractFaq` 只认这个英文词，写成「常见问题」会让 FAQPage schema 消失 |
| 配图 | `apps/web/public/blog/<slug>/hero.png`（1200×630） | 流程见 `apps/web/docs/blog-strategy.md` §6 | 新文章没有配图时，heroImage 可以留空，记为遗留项 |
| 博客渲染、JSON-LD | `apps/web/app/[lang]/blog/[slug]/page.tsx`（BlogPosting、BreadcrumbList、FAQPage） | 改代码，属于 D 类 | |
| 股票页 meta | `apps/web/lib/stocks/copy.ts`（每个语种的 `metaTitle` / `metaDescription` 模板） | 改模板会影响**全部**股票页，算 D 类，单独成轮 | 只有 8 个语种里的部分语种有股票页，看 `STOCK_PAGE_LOCALES` |
| 产品和营销页文案 | `apps/web/app/[lang]/dictionaries/*.json`、`apps/web/lib/marketing-i18n/`、`apps/web/lib/features.ts` | 8 个语种同步改 | 改 `/pricing`、`/chat` 这类转化页属于产品决策，只提建议 |
| sitemap | `apps/web/app/sitemap.ts` | D 类 | 只列可以公开访问、返回 200 的 URL |
| llms.txt | `apps/web/app/llms.txt/route.ts`（博客部分自动生成，其余手写） | 改手写段落 | 往 Key facts 里加内容前先问两个问题：这个说法一年后还成立吗？对每个页面都成立吗？ |
| robots.txt | `apps/web/public/robots.txt` | D 类 | 现在的策略是放行 AI 搜索爬虫、禁止只抓训练数据的爬虫，改动前要和用户确认 |

**写作约定**，以现有语料和 `apps/web/docs/blog-strategy.md` §4 为准：

- **首段直接给答案**：第一段用加粗句子直接回答标题里的问题，然后是 `### Key takeaways` 列表。
- 尽量用疑问句做 H2，每一节对应一个真实的搜索问题；答案引擎按段落摘取，这样命中率更高。
- 每篇至少 3 条 FAQ，至少 3 个站内链接：指向相关文章，以及 `/chat`、`/indicators` 等产品入口。
- 作者统一写 `PickSkill Team`；`updatedAt` 要随实质性修改一起更新。
- 译文要自然、符合当地读者的表达习惯，**不得逐字直译**。DCF、WACC 这类技术术语保留英文，首次出现时解释（见 `apps/web/docs/blog-i18n.md` §3–4）。
- 金融内容不给买卖建议，股票相关的表述要保持中性。

## 动作类型与成本

| 类型 | 动作 | 典型改动 | 成本 | 要不要预注册实验 |
|---|---|---|---|---|
| A | 重写 meta（title / description） | 1 个页族的 1–8 个 md 文件的 frontmatter | 低 | **要**（看 CTR） |
| B | 强化或刷新内容：扩写段落、FAQ、站内链接、数据 | 1 个页族的正文 | 中 | 要（看位置或点击） |
| C | 新文章 | 新增 1 + 7 个 md，加配图 | 高 | 不要：没有基线可比。summary 里记下「上线后 28 天的展示和位置」，作为观察项 |
| D | 全站技术修复：sitemap、hreflang、模板 meta、JSON-LD | 代码 | 中 | 看情况。模板 meta 要（看分段 CTR）；纯修错不要 |
| G | GEO 结构：首段直接给答案、疑问句 H2、FAQ、修死链 | 正文 | 低到中 | 页面有展示时要；纯修死链不要 |
| T | 补齐缺失译文 | 新增某语种的 md | 中 | 不要（新 URL）。记录「上线后 28 天该语种页的展示」 |

**预注册**的写法：在 `experiments.json` 的 `experiments` 里追加一条。**先 `cp` 一份备份，再用 Edit 局部追加**：

```json
{
  "id": "a-what-is-macd-meta-YYYYMMDD",
  "pages": ["/blog/what-is-macd"],
  "windowDays": 14,
  "publishedOn": null,
  "status": "pending-publish",
  "hypothesis": "标题加入「怎么看金叉死叉」以命中 §2 的 4 个 query，CTR 从 0.8% 提到 ≥ 1.6%",
  "metric": "页族 CTR（无偏 totals，全部语种）",
  "successIf": "读窗 CTR ≥ 前窗 × 1.5 且点击 Δ ≥ 2σ；期望点击 < 1/周 → ⚪"
}
```

- `pages` 写不带语种前缀的路径，一个页族的全部语种一起冻结。
- `windowDays` 一般用 14。期望点击 < 3/周的页面用 28，否则样本不够。
- **成功判据在预注册时写死**，判读时不得临场调整。

## 规划约束

- **不改冻结页族**：页面在 `experiments.json` 里、还没出结论的，一律不改。
- **遵守范围纪律**（见 `loop.md`）：A ≤ 5 个页族、C ≤ 2 篇、T ≤ 3 篇；D 单独成轮。
- A 类改 meta 的同时不改正文，B 类改正文的同时不改 meta，否则无法归因。
- **改英文原文时，同一页族的译文要跟上**：至少同步 `title` / `description` / FAQ 这些在 SERP 上可见的部分，并更新 `updatedAt`，否则 `translation-stale` 会命中。
- 每一处要改的 meta，都先用 `geo-audit` 的宽度预算自查：title 加「 — PickSkill」后 ≤ 65 units，description ≤ 160 units；全角字符算 2，半角算 1。

## 产出

写入 `report/YYYYMMDD-plan.md`：

```markdown
# YYYYMMDD 优化计划

## 聚焦主题
（承接 input，一句话）

## 动作清单
| # | 类型 | 页族 / 文件 | 现状（原文或数据） | 改成什么 | 依据（input 里的发现编号） |

## 逐项细节
### 动作 1
- 文件：`apps/web/content/blog/...`（列出全部语种）
- 原值 → 新值（meta 类逐语种列出；正文类写结构，不必全文）
- 宽度自查：title xx units / description xx units

## 预注册实验
| id | 页族 | 指标 | 成功判据 | windowDays |
（不需要预注册的动作写明原因）

## 验证计划
- 本地：`bun run geo:audit -- --gate`、web typecheck、build、dev 抽查哪些 URL
- 上线后：`geo:audit --live` 复查哪些 URL；需要的话跑 `gsc:sitemap`

## 风险与回滚
- 原文件备份到 `report/YYYYMMDD-assets/originals/`，回滚 = 把这些文件拷回去
```

## 完成标准（交给 execute.md）

- 每个动作都落到具体文件，原值和新值都写清楚了。
- 需要回看的动作已在 `experiments.json` 预注册，`publishedOn` 为 `null`。
- 不碰冻结页族，符合范围纪律。
- 验证计划能直接照着执行。
