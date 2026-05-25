# Web 端 Workflow(定时工作流)设计文档

> 状态:**设计已确认,暂未实现**
> 起草日期:2026-05-25
> 范围:Web 端的"可配置定时任务"能力。本地 CLI 模式的 `CronJob` 逻辑(`src/cron/`)完全不动。

## 1. 背景与目标

### 用户故事

> "我希望能在网页上配一些定时跑的流程,比如每天 9:30 自动拉我科技股组合的 MACD/RSI,生成一份 PPT 早报,发到我邮箱。能选基本操作、能串成流程、能管开关、能看历史。"

### 目标

- 用户可在 Web 端配置定时执行的"工作流",每个工作流由 1-N 个步骤组成。
- 步骤覆盖现有能力的常见组合:跑 agent prompt、拉指标、生成 Office 文档、发邮件。
- 简单易用的可视化配置 / 管理界面(列表 + 编辑器 + 运行历史)。
- 部署在 Vercel,沿用现有 NextAuth 多租户隔离。
- 架构上为未来规模化留迁移空间(见 §8)。

### 非目标(MVP)

- 不做条件分支 / 循环 / 失败跳转(steps 是线性序列)。
- 不做团队 / 共享 workflow(纯个人空间)。
- 不做完整模板引擎(变量插值只支持 `{{stepId.fieldName}}` 点路径)。
- 不替换 / 改造现有的 WhatsApp + CLI cron(`src/cron/`)流程。

---

## 2. 现状能力盘点

| 能力 | 位置 | 状态 |
|---|---|---|
| Agent 执行(分片续跑) | `apps/web/app/api/agent/route.ts`, `/resume/route.ts`, `apps/web/lib/agent-job-store.ts` | ✅ 可复用 |
| 分片 claim 模式 | `SELECT ... FOR UPDATE SKIP LOCKED` on `dexter_agent_jobs` | ✅ 直接套用 |
| 指标数据 | `/api/indicators/[dimension]` 支持 macd/ma/volume/flow/rsi/kdj/boll/adx/movers | ✅ 直调 |
| 组合(portfolio) | `/api/portfolios`, `dexter_portfolios` + `dexter_portfolio_holdings` | ✅ 直读 |
| Office 文档生成 | `src/tools/office/{index,spawn}.ts` + `src/runtime/office-run.ts`(agent tool,LLM 通过 `office_read`/`office_edit` 调用) | ✅ agent 层已具备 |
| Blob/R2 存储 | `src/adapters/blob/vercel-blob.ts`, `src/runtime/r2.ts` | ✅ 可上传产物 |
| 多语言导出 brief | `apps/web/lib/indicators/export-prompts.ts`(8 语言,含设计规范) | ✅ 直接复用为 `generate_doc` step 的 prompt 模板 |
| 邮件发送 | nodemailer transport,目前仅 `/api/auth/email/send` 用于登录验证码;`MAIL_FROM`、`SMTP_*` env 已配置 | ⚠️ 复用 transport,需新增 `sendWorkflowReport()` |
| 用户身份 | NextAuth.js v4(`getCurrentUser()` → `{id, email, name?, image?}`),`dexter_users` 表 | ✅ 全程沿用 |
| 现有 cron 触发 | `vercel.json` 仅一条 `/api/cron/cleanup-agent-jobs`(每天 5:00 UTC),Bearer `CRON_SECRET` 鉴权 | ✅ 沿用此模式 |
| Scheduler 抽象 | `src/adapters/scheduler/{local,vercel-cron}.ts`,Scheduler port | ✅ 复用 cron 表达式 / 时间计算 |
| 缺口:任意收件人邮件 | — | ❌ 需新增收件人验证流 |
| 缺口:多步骤 cron | 现有 `CronJob.payload` 是单条 message | ❌ 需要新 schema |

---

## 3. 数据模型

**决策**:新建独立表,不复用 `dexter_cron_jobs`。
**理由**:多步骤 + 运行历史的形状与单 payload 的 CLI CronJob 差异大,塞进同一张表会污染 jsonb 语义;CLI 与 Web 解耦后各自演进更干净;`src/cron/runner.ts` 后续作为 Phase D 的迁移目的地仍可独立读 `dexter_workflows`。

### 3.1 `dexter_workflows`

```ts
{
  id: uuid (pk)
  userId: uuid (fk → dexter_users)
  name: text
  description: text | null
  enabled: boolean (default true)

  schedule: jsonb  // 复用 src/cron/types.ts 的 CronSchedule
  // { kind: 'at',    at: '2026-04-01T14:00:00Z' }
  // { kind: 'every', everyMs: 3600000, anchorMs?: number, jitterMs?: number }
  // { kind: 'cron',  expr: '0 9 * * 1-5', tz: 'America/New_York', jitterMs?: number }

  activeHours: jsonb | null  // 复用 src/cron/types.ts 的 ActiveHours

  steps: jsonb  // WorkflowStep[]  ← 详见 §4

  state: jsonb  // WorkflowState
  // {
  //   nextRunAtMs?: number,
  //   lastRunAtMs?: number,
  //   lastRunStatus?: 'ok' | 'error' | 'cancelled',
  //   lastError?: string,
  //   consecutiveErrors: number,
  //   scheduleErrorCount: number,
  //   totalRuns: number,
  // }

  createdAt: timestamp
  updatedAt: timestamp
}

-- 索引:
-- (userId, enabled) — 列表查询
-- ((state->>'nextRunAtMs')::bigint) where enabled = true — heartbeat 扫表;数据量大时改 BRIN
```

### 3.2 `dexter_workflow_runs`

```ts
{
  id: uuid (pk)
  workflowId: uuid (fk → dexter_workflows)
  userId: uuid (fk → dexter_users)

  status: 'pending' | 'running' | 'ok' | 'error' | 'cancelled'
  startedAt: timestamp
  finishedAt: timestamp | null
  durationMs: integer | null

  currentStepIndex: integer (default 0)
  context: jsonb  // 跨步骤累积的输出,被后续 step 和邮件渲染读取
  artifacts: jsonb  // { stepId: string, kind: 'blob', url, filename, sizeBytes, mime }[]

  // 沿用 agent-job-store 的分片续跑字段:
  resumeToken: text | null
  chunkCount: integer (default 0)
  messages: jsonb | null  // agent step 的中间消息

  error: text | null
  errorStepIndex: integer | null

  // 可观测性 / 迁移用:
  dispatchedVia: text  // 'vercel-cron' | 'queue' | 'inngest' | 'manual' | 'local-runner'

  createdAt: timestamp
}

-- 索引:
-- (workflowId, createdAt desc) — 历史查询
-- (userId, createdAt desc) — 用户全局活动
-- (status) where status in ('pending','running') — 派发扫描
-- (userId, createdAt) — 30 天清理(TTL cron 用)
```

### 3.3 `dexter_workflow_email_recipients`(收件人验证表)

```ts
{
  id: uuid (pk)
  userId: uuid (fk)
  email: text
  verified: boolean (default false)
  verifyToken: text | null
  verifyTokenExpiresAt: timestamp | null
  verifiedAt: timestamp | null
  createdAt: timestamp

  unique(userId, email)
}
```

任意收件邮箱首次添加 → 发验证邮件 → 用户点确认 → 该邮箱才能用于 `send_email` step 的 `to`。当前账户邮箱默认视为已验证。

---

## 4. Step 类型(MVP)

`WorkflowStep` 公共形状:

```ts
type WorkflowStep = {
  id: string         // 步骤局部 ID(用于变量引用),由前端生成 nanoid
  name?: string      // 用户起的别名(选填)
  type: 'fetch_indicators' | 'agent_prompt' | 'generate_doc' | 'send_email'
  config: Record<string, unknown>  // 类型相关配置(见下)
}
```

### 4.1 `fetch_indicators`

```ts
config: {
  portfolioId: string
  dimensions: ('macd' | 'ma' | 'volume' | 'flow' | 'rsi' | 'kdj' | 'boll' | 'adx')[]
  days?: number  // 默认 140
}
```

**执行**:server-side 直调现有 indicators 数据层(**不**走 HTTP)。
**输出到 `context[stepId]`**:
```ts
{
  asOf: string,
  portfolioName: string,
  tickers: string[],
  byDimension: Record<dim, { tickers: [...] }>,
  summary: string  // 预渲染的 markdown 摘要,供后续 step 直接引用
}
```

### 4.2 `agent_prompt`

```ts
config: {
  prompt: string          // 支持 {{stepId.field}} 变量
  model?: string
  modelProvider?: string
}
```

**执行**:走现有 `runAgentForMessage()`,沿用 agent-job 分片续跑模式。完整 tool access(包括 office、finance、memory 等)。
**输出到 `context[stepId]`**:
```ts
{
  finalAnswer: string,
  touchedFiles: string[],  // office 工具产生的本地文件路径
  blobUrls: string[]       // 自动把 touchedFiles 上传到 Blob 后的 URL
}
```

### 4.3 `generate_doc`

```ts
config: {
  format: 'pptx' | 'docx' | 'xlsx'
  title: string                       // 支持变量
  sourceSteps: string[]               // 引用哪些前置 step 作为数据源
  locale?: string                     // 默认用账户语言
}
```

**执行**:内部组装为一个 `agent_prompt` —— 套用 `apps/web/lib/indicators/export-prompts.ts` 已有的多语言 design brief,数据从 `sourceSteps` 里取,跑完 agent 后把 office 工具触摸的文件上传 Blob,记录到 `artifacts`。
**输出到 `context[stepId]`**:
```ts
{
  format, filename, blobUrl, sizeBytes
}
```

### 4.4 `send_email`

```ts
config: {
  to: string[]                        // 必须全部在 dexter_workflow_email_recipients 且 verified
  subject: string                     // 支持变量
  body: {
    mode: 'auto-summary' | 'markdown' | 'plain'
    template?: string                 // mode != auto-summary 时使用
  }
  attachments: {
    fromSteps: string[]               // 引用 step 的 artifacts 作为附件
  }
}
```

**执行**:复用现有 nodemailer transport,新增 `sendWorkflowReport()`。`auto-summary` 模式自动把 context 里的 step 输出渲染成结构化邮件正文。
**输出**:`{ messageId, deliveredTo: string[] }`

---

## 5. 执行模型(Vercel 上)

```
┌──────────────────────────┐
│ Vercel Cron (* * * * *)  │   1 条 heartbeat,不随用户数增长
└──────────┬───────────────┘
           ▼
┌──────────────────────────┐
│ /api/workflows/tick      │   只做扫表 + 派发,不跑工作流
│  - 扫 nextRunAtMs <= now │
│    AND enabled,SKIP LOCKED
│  - 为每个到期 workflow   │
│    create workflow_run    │
│  - HTTP POST 触发 dispatch│
│  - 更新 nextRunAtMs       │
└──────────┬───────────────┘
           ▼ (fire-and-forget)
┌──────────────────────────┐
│ /api/workflows/dispatch  │   单次 run 的一段执行
│  - SELECT FOR UPDATE      │
│    SKIP LOCKED 抢锁       │
│  - 跑当前 step            │
│  - 时间预算到 → 保存状态  │
│    返回 → 等下一个 tick   │
│    继续(分片续跑)        │
│  - 最后一步完成 → mark ok │
└──────────────────────────┘
```

**关键决策**:

- **heartbeat 与 dispatch 解耦**:heartbeat 永远只是个扫描器(<5s 内必须完成),从不跑业务。这样无论同时到期多少 workflow,heartbeat 都不会超时;真正的执行靠 dispatch 函数并发跑。
- **每个 step 边界 = 一个天然分片点**:agent step 沿用 `CHUNK_BUDGET_MS = 200s` 的预算,到点切;轻量 step(fetch_indicators / send_email)单分片内完成。
- **幂等性强制**:dispatch 必须幂等(同一个 run 被重复触发不能产生重复副作用),用 `currentStepIndex` + advisory lock。Phase B+ 换 Queues / Inngest 都是 at-least-once,这是底线契约。
- **失败重试**:沿用现有 cron 退避(30s → 1m → 5m → 15m → 60m),3 次连续 schedule 错误自动 disable。

### 5.1 触发路径汇总

| 路径 | 鉴权 | 用途 |
|---|---|---|
| Vercel Cron → `/api/workflows/tick` | Bearer `CRON_SECRET` | 定时扫描 |
| `/api/workflows/tick` → `/api/workflows/dispatch` | 内部 Bearer | 派发 |
| 用户点"立即运行" → `/api/workflows/[id]/run` | NextAuth session | 手动触发,创建 run 后直接 POST dispatch |
| 续跑 → `/api/workflows/dispatch` | Bearer `CRON_SECRET` | heartbeat 顺带把 pending 状态的 run 也扫一遍 |

---

## 6. UI 设计

### 6.1 路由

- `/workflows` — 列表
- `/workflows/new` — 新建编辑器
- `/workflows/[id]` — 编辑 + 查看历史

### 6.2 列表页

表格列:名称 / 计划摘要(自然语言)/ 上次运行(时间 + 状态徽章)/ 下次运行 / 启用开关 / 操作(▶ 立即运行 / ✏ 编辑 / 🗑 删除)。

### 6.3 编辑器布局

```
┌───────────────────────────────────────────────────────┐
│ 名称: [_________________]   ●○ 启用                   │
│ 描述: [_____________________________________]         │
├───────────────────────────────────────────────────────┤
│ 计划                                                  │
│  ○ 单次  ● 周期  ○ Cron 表达式                        │
│   预设: [每个交易日 9:30 ET ▾] | [每小时] | 自定义    │
│   下 5 次触发: 2026-05-26 09:30, 05-27 09:30, ...    │
├───────────────────────────────────────────────────────┤
│ 步骤                                                  │
│ ┌─────────────────────────────────────────────┐      │
│ │ 1. 📊 拉取指标                              │      │
│ │    组合: [我的科技股 ▾]                      │      │
│ │    维度: ☑MACD ☑RSI ☐KDJ ☐BOLL ...          │      │
│ │    [删除] [↑] [↓]                            │      │
│ └─────────────────────────────────────────────┘      │
│                + 在此处加步骤                          │
│ ┌─────────────────────────────────────────────┐      │
│ │ 2. 📄 生成文档                              │      │
│ │    格式: ●PPTX ○DOCX ○XLSX                  │      │
│ │    标题: [{{step1.portfolioName}} 早报]      │      │
│ │    使用数据: ☑ 步骤 1                        │      │
│ └─────────────────────────────────────────────┘      │
│                + 添加步骤                              │
│ ┌─────────────────────────────────────────────┐      │
│ │ 3. ✉ 发邮件                                │      │
│ │    收件人: [julian@data.cloud] [+ 添加]      │      │
│ │    主题: 早报 - {{date}}                    │      │
│ │    正文: ●自动汇总 ○Markdown ○纯文本        │      │
│ │    附件: ☑ 步骤 2 (PPTX)                    │      │
│ └─────────────────────────────────────────────┘      │
├───────────────────────────────────────────────────────┤
│ 自然语言预览                                          │
│ "每个交易日 09:30 ET,从【我的科技股】拉取 MACD/RSI    │
│  → 生成 PPT 早报 → 发送至 julian@data.cloud"          │
├───────────────────────────────────────────────────────┤
│ [保存]  [立即运行测试]  [查看历史 →]                  │
└───────────────────────────────────────────────────────┘
```

**UI 关键决策**:

- 不上拖拽,↑↓ 按钮够用(移动端友好)。
- Schedule 选择器分层:90% 用户走预设 chip,5% 走自定义周期表单,5% 写 cron 表达式;统一显示"下 5 次触发"预览。
- 变量自动补全:任何输入框打 `{{` 弹下拉,列出前置 step 的可用字段。
- 自然语言预览:把整个工作流翻译成一句话,用户秒懂。
- 步骤之间的"+ 在此处加步骤"按钮,而不是只在底部加 —— 顺序编辑友好。

### 6.4 运行历史

抽屉式打开,列出该 workflow 历次 run:时间线、每个 step 的状态/耗时、context 折叠展示、artifacts 下载链接、报错原文。提供"重跑此次"按钮。

---

## 7. 安全 / 反滥用

| 项 | 措施 |
|---|---|
| 用户隔离 | 所有路由 `getCurrentUser()`,SQL 强制 `where userId = ?` |
| 内部触发鉴权 | tick / dispatch 用 `Authorization: Bearer ${CRON_SECRET}`,同 cleanup-agent-jobs |
| 任意收件人邮件 | `dexter_workflow_email_recipients` 验证流;未验证地址在保存时 reject |
| 配额 | 单用户活跃 workflow ≤ 10;每分钟同一 workflow 最多触发 1 次(防止 cron 表达式写错把账户打爆) |
| Token / Cost | agent step 沿用现有 token 配额逻辑,不另起 |
| 运行历史 TTL | 30 天清理(新增清理 cron,沿用 cleanup-agent-jobs 模式);artifacts Blob 同步过期 |
| 注入防护 | 变量插值只支持点路径,不上 JS 表达式;prompt 拼接前对变量值做长度限制 |

---

## 8. 规模化与未来迁移路径

**核心洞察**:Vercel Cron 永远只用 1 条 heartbeat(40 条上限完全不是瓶颈),真正会撞墙的是 heartbeat 下面的 fan-out 层。**数据模型 + step 编译器跨阶段不变**,只换"谁来 fire dispatch"。

### 8.1 容量估算

| 规模(活跃 workflow) | 现架构表现 | 备注 |
|---|---|---|
| 3 万 | ✅ 完全够用 | 1000 函数并发,十几倍冗余 |
| 30 万 | ⚠️ 接近边界 | heartbeat 扫表 + fan-out 开始吃力 |
| 300 万 | ❌ 撑不住 | 需换基础设施 |

LLM token 成本会先于 Vercel 计算成本爆炸 —— 账单会先告诉你该重构了。

### 8.2 分阶段迁移路径

```
Phase A (0  - 1万):    Vercel Cron → HTTP fan-out → dispatcher                  ← MVP 起点
Phase B (1万 - 10万):   Vercel Cron → Vercel Queues (GA) → workers
Phase C (10万 - 100万): Vercel Cron → Inngest / Trigger.dev → workers
Phase D (>100万):       脱离 Vercel,src/cron/runner.ts 跑在 Railway/ECS 多副本 + Redis 选主
```

**Phase D 的隐藏价值**:`src/cron/runner.ts` 已经写好了。让它读 `dexter_workflows` 表而不是 `~/.dexter/jobs.json`,就是生产级 worker。所以本地 cron 不动还有这层意义 —— 它是 Phase D 的雏形。

### 8.3 现在就要做对的预留(不做就会被锁死)

1. **`schedule.jitterMs` 字段**:MVP 不用,但表里留好;Phase B+ 应对并发峰值用。
2. **`workflow_runs.dispatchedVia` 字段**:记录触发来源;迁移时能并行跑两套验证。
3. **dispatch 路由强幂等**:同 run 重复 dispatch 无副作用(advisory lock + `currentStepIndex` 单调推进)。
4. **step 内禁用强时间假设**:不能写"9:30 这一秒拉数据"的逻辑,Vercel Cron 有 30s-2min 抖动;市场开盘类需求要么 schedule 提前,要么 step 自行等数据可用。

### 8.4 撞墙时的优化清单(按生效顺序)

1. `nextRunAtMs` BRIN 索引(单调时间字段正合适)
2. heartbeat 按 `userId % N` 分片扫描
3. schedule 加 jitter 抹峰
4. 轻 step 合并执行(`fetch_indicators` + `send_email` 一个分片跑完)
5. 切 Vercel Queues / Inngest

---

## 9. 分阶段实现建议

| Phase | 范围 | 估时 | 完成定义 |
|---|---|---|---|
| **Phase 1 骨架** | 表 + CRUD + 列表 + 编辑器(仅支持 `agent_prompt` + `send_email`)+ tick + dispatch + 立即运行 | 2-3 天 | 能"定时跑 prompt,把 finalAnswer 邮件发给当前账户邮箱"端到端闭环 |
| **Phase 2 投递面** | `fetch_indicators` step + 收件人验证 + 运行历史抽屉 + 变量插值 | 1-2 天 | 能用真实组合数据驱动 prompt,能发给任意已验证邮箱 |
| **Phase 3 文档生成** | `generate_doc` step + Blob 上传 + 邮件附件 | 2 天 | 能定时生成 PPT/Word/Excel 并作为附件发出 |
| **Phase 4 打磨** | schedule 预设模板 + 自然语言预览 + 清理 cron + 退避重试 + 配额 | 1-2 天 | 生产可用 |

---

## 10. 待确认的设计问题

实施前需锁定:

1. **Vercel 计划**:Pro(分钟级 cron)还是 Hobby(每天 1 次)?Hobby 上 schedule 颗粒度向上取整到小时,或改为手动触发为主。
2. **Schema 决策**:已建议新建 `dexter_workflows`,等开工前再 review 一次。
3. **邮件收件人策略**:已建议"任意邮箱 + 首次验证"。是否接受?
4. **运行产物保留**:已建议 30 天 + Blob TTL 同步。是否接受?
5. **MVP 是否包含 `generate_doc`**:Phase 3 才上,Phase 1 是否需要至少一个降级版本(只发 finalAnswer 邮件正文,无附件)?

---

## 11. 替代架构:Vercel Workflow DevKit(强烈推荐评估)

本设计的 §3 `workflow_runs` 表 + §5 分片续跑机制,本质是手搓的"durable execution"。**Vercel Workflow DevKit**(包 `workflow` + `@workflow/ai` + `@workflow/next`)就是为这个问题开箱设计的,并且已经 GA。在 Phase 1 动工前必须评估清楚要不要直接用它。

### 11.1 对照映射

| 自建方案(§3-§5) | Workflow DevKit 等价物 |
|---|---|
| `dexter_workflow_runs` 表 + 状态字段(`resumeToken` / `chunkCount` / `messages` / `currentStepIndex`) | 框架内置,运行状态由 Workflow 后端管理 |
| 手写"时间预算到 → 保存状态 → 等下一个 tick 续跑" | `"use workflow"` + `"use step"` 指令,框架自动续跑 |
| heartbeat → fan-out HTTP → dispatch 的派发链路 | `start(myWorkflow, [args])`,框架负责调度 |
| advisory lock + `SELECT FOR UPDATE SKIP LOCKED` 防重 | step 级幂等天然支持(结果持久化、replay 安全) |
| 退避 / 重试逻辑(沿用 `src/cron/runner.ts`) | `FatalError` / `RetryableError` + 内置退避 |
| agent step 的中间 `messages` 持久化 | `DurableAgent`(from `@workflow/ai/agent`)自带 |
| SSE 流式回前端 | `getWritable<UIMessageChunk>()` + namespaced streams |
| 用户点"立即运行" → 创建 run → POST dispatch | `await start(workflow, args)`,一行 |
| 用户审批 / 等待外部事件(未来扩展) | `createHook()` + `resumeHook()`(`"use workflow"` 内挂起,API 路由唤醒) |

### 11.2 用 Workflow DevKit 后的 step 形态(示意)

```ts
// apps/web/workflows/run-portfolio-report.ts
import { start } from "workflow/api";
import { DurableAgent } from "@workflow/ai/agent";
import { getWritable } from "workflow";

async function fetchIndicators(portfolioId: string, dims: string[]) {
  "use step";  // 全 Node 能力,自动重试,结果持久化
  return await loadIndicators(portfolioId, dims);
}

async function sendEmail(to: string[], subject: string, body: string, attachments: Blob[]) {
  "use step";
  return await sendWorkflowReport({ to, subject, body, attachments });
}

export async function portfolioReportWorkflow(params: {
  userId: string;
  portfolioId: string;
  dims: string[];
  recipients: string[];
}) {
  "use workflow";

  const data = await fetchIndicators(params.portfolioId, params.dims);

  const agent = new DurableAgent({
    model: "anthropic/claude-sonnet-4-6",  // 走 Vercel AI Gateway
    system: "你是金融分析助手,根据指标数据生成 PPT 早报",
    tools: { /* office_read, office_edit 等 */ },
  });

  const result = await agent.stream({
    messages: [{ role: "user", content: buildExportPrompt(data, "pptx") }],
    writable: getWritable<UIMessageChunk>(),  // 前端实时看进度
    maxSteps: 20,
  });

  await sendEmail(params.recipients, `${data.portfolioName} 早报`, result.text, [/* pptx blob */]);
}

// Cron 触发(替换 §5 的 tick + dispatch 两条路由):
export async function POST() {  // /api/workflows/tick
  const due = await scanDueWorkflows();
  for (const wf of due) {
    await start(portfolioReportWorkflow, [wf.params]);  // fire-and-forget
  }
  return Response.json({ dispatched: due.length });
}
```

代码量大幅减少,可观测性(`npx workflow web`)、重放、崩溃恢复全部白送。

### 11.3 用 Workflow DevKit 的代价

1. **运行模型限制**:`"use workflow"` 函数在沙盒 VM 里跑,不能直接用 `fs`、`crypto`、原生 `fetch`、`setTimeout`。所有 I/O 必须放 step。我们现有 `runAgentForMessage()`、`office tool spawn`、Postgres 操作全部要包装成 step,不是无成本。
2. **序列化约束**:跨 workflow / step 边界传的数据必须可序列化(函数、class instance、Symbol 都不行)。当前 agent loop 传的 LangChain 工具实例需要重新设计。
3. **学习曲线 + 抽象成本**:团队要熟悉 `"use workflow"` / `"use step"` / hooks / streaming 这套心智模型。设计错位的代价是 sandbox 错误。
4. **可观测性绑 Vercel**:`npx workflow inspect` / observability 面板是 Vercel 产品。脱离 Vercel(Phase D)时这套不能跟着走 —— 但其实 Phase D 自然会重写编排层,无所谓。
5. **目前 dexter 没装**:`node_modules/workflow` 不存在,需要 `npm i workflow @workflow/ai @workflow/next` 并按官方文档(`https://vercel.com/docs/workflow`、bundled 在 `node_modules/workflow/docs/`)做框架接入。
6. **跟 §5 的关系**:用了 Workflow DevKit 之后,§3 的 `dexter_workflow_runs` 表退化为"用户视角的执行历史快照"(只读、定期从 Workflow 后端同步或事件钩入),不再是执行机制本身。§5 的 tick / dispatch 路由消失,留一个 cron-driven `start()` 即可。

### 11.4 推荐立场

**Phase 1 阶段:用 Workflow DevKit。**

理由:
- 我们要解决的核心问题(durable execution、agent 续跑、step 编排、流式回前端、重试退避)100% 命中它的设计目标。
- 自建分片机制虽然能复用 agent-job-store 的代码,但**它本来就是为单次 agent 调用设计的**,不是为多步骤工作流;复用过来要新增 currentStepIndex、context 累加、artifacts 上传等一堆字段,等于在自己造小一号的 Workflow DevKit。
- `DurableAgent` 直接覆盖 `agent_prompt` step,我们等于一开始就拿到一个生产级 agent 编排器。
- Phase D 真要脱离 Vercel 时,无非是把 `start(workflow, args)` 那一行换成"读 `dexter_workflows`、跑自己的 worker",steps 本身的纯函数化设计(必须可序列化、必须幂等)反而让脱离更容易。

**但**:这是个有重量的决策,实施前需要做一次 spike —— 拿 1 天搭一个最小可跑 demo(单 step、单 workflow、定时触发、邮件发送),验证:
- 我们现有的 `runAgentForMessage()` 能不能干净地包装成 step
- `office tool` 的子进程 spawn(`src/tools/office/spawn.ts`)能否在 step 内正常工作
- 流式输出到前端的延迟是否可接受
- 失败重试 / 部分完成的语义是否符合预期

Spike 通过 → Phase 1 全面采用;Spike 暴露阻塞性问题 → 回到自建方案(§3-§5)。

### 11.5 §8 规模化路径在 Workflow DevKit 下的变化

| Phase | 自建路径 | Workflow DevKit 路径 |
|---|---|---|
| A (0-1万) | Vercel Cron → HTTP fan-out → dispatcher | Vercel Cron → `start()` × N |
| B (1-10万) | + Vercel Queues 缓冲 | 框架自带调度,无需改动 |
| C (10-100万) | + Inngest / Trigger.dev | 同上(或评估 Workflow DevKit 自身的多 region / 配额能力) |
| D (>100万) | src/cron/runner.ts 自托管多副本 | 自托管 Workflow 后端 或 重写编排为自托管 worker |

Workflow DevKit 在 B、C 阶段优势最大;D 阶段两条路殊途同归。

---

## 12. 参考文件 / 复用清单

实施时可直接复用或参照:

- 分片续跑模式:`apps/web/app/api/agent/route.ts`, `apps/web/lib/agent-job-store.ts`
- Vercel Cron + Bearer 鉴权样板:`apps/web/app/api/cron/cleanup-agent-jobs/route.ts`
- nodemailer transport + 邮件模板风格:`apps/web/app/api/auth/email/send/`
- Schedule 计算 / 时区处理:`src/cron/schedule.ts`, `src/cron/types.ts`
- 退避策略 / 错误处理:`src/cron/runner.ts`, `src/cron/executor.ts`
- 多语言文档生成 brief:`apps/web/lib/indicators/export-prompts.ts`
- Office tool + R2/Blob 上传:`src/tools/office/`, `src/runtime/{office-run,r2}.ts`, `src/adapters/blob/vercel-blob.ts`
- 指标 API:`apps/web/app/api/indicators/[dimension]/`
- 组合 API:`apps/web/app/api/portfolios/`
- NextAuth 用户上下文:`getCurrentUser()` 调用点遍布 `apps/web/app/api/`
