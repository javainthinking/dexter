# execute.md — 实施、验证、发布（Loop 第 3 步）

## 角色

你是 PickSkill 的**内容工程师**。按 `report/YYYYMMDD-plan.md` 实施改动，在本地验证到全绿，然后**停下来等用户确认发布**。

## 1. 开分支、备份原文件

```bash
cd /Users/julian/Workspace/products/dexter
git checkout -b seo/YYYYMMDD-<主题短名>
mkdir -p loops/loop-gsc-optimization/report/YYYYMMDD-assets/originals
# 把计划里要改的每个文件按原路径拷进 originals/（新建的文件不用拷）
```

## 2. 实施

- 严格照计划做，不顺手扩大范围。发现计划外的问题，记进遗留项。
- meta 类改动用 Edit 局部替换 frontmatter 的值，不要整文件重写。
- 改了英文原文，同一页族的译文按计划同步，并更新 `updatedAt`。
- 新文章或新译文：
  - 照现有文章的 frontmatter 结构写。
  - FAQ 标题一律用 `## FAQ`。
  - 首段用加粗句子直接给答案，然后是 `### Key takeaways`。
  - 至少 3 个站内链接。

## 3. 本地验证（必须全绿）

```bash
# 内容闸门：只拦相对 origin/main 新增或改动的值（meta 宽度、FAQ ≥ 3、description 唯一、死链）
bun run geo:audit -- --gate

# web 的类型检查和构建（构建前要先停掉在跑的 dev server）
cd apps/web && bunx tsc --noEmit && bunx next build --webpack && cd ../..

# 启动 dev 抽查
cd apps/web && PORT=3107 bun run dev -- -p 3107
```

dev 抽查用 gstack `/browse`，每个改动的页族至少看三个版本：英文、zh-CN、另一个改了的语种。逐项确认：

- 正文渲染正常，FAQ 区块出现。
- 查看源码：
  - `<title>` 和 `meta description` 是新值。
  - BlogPosting 的 `inLanguage` 和语种一致。
  - 有 FAQPage 的 JSON-LD。
  - canonical 指向自己。
- 新文章另外要确认：`/sitemap.xml` 和 `/llms.txt` 里出现了它。

**做完要停掉 dev server。** 恢复它对 `apps/web/next-env.d.ts` 的改动时，只用 `git checkout -- apps/web/next-env.d.ts`。这是唯一允许的 git 还原，而且这个文件不在 loop 目录里。

验证反复不过时，在这一步内循环修复。超出一轮能力的，缩小范围，先交付能验证的部分。

## 4. 发布（⚠️ 必须先得到用户确认）

把以下内容整理给用户：改了哪些文件、原值和新值的摘要、验证结果、分支名。然后**等待确认**。

- **用户不在场**（routine 无人值守）：停在这里。发布状态写「⏸️ 待用户确认」，进入收尾。
- **用户确认后**：
  1. 代码和内容一个 commit；本轮的 loop 产物另一个 commit，message 用 `chore(loops): seo-geo YYYYMMDD round`。
  2. 合入 main 并 push，按用户选择用快进合并或 PR。
  3. **记下实际 push 日期**（`date +%F`）。
  4. 在 `experiments.json` 里，把本轮预注册条目的 `publishedOn` 设为这个日期，`status` 改为 `reading`。然后按 `loop.md` 测量纪律第 5 条复算读窗和判读日，写进 execute 产物。**即便和计划一致，也要写明「已复算」。**
  5. 等 Vercel 部署完成，即线上页面出现了新 title。然后：
     ```bash
     bun run geo:audit -- --live --out loops/loop-gsc-optimization/report/YYYYMMDD-assets/geo-audit-after.md
     bun run gsc:sitemap        # 新增了 URL 时才需要
     ```
     确认改动的页面在线上不再命中对应规则。

## 5. 处理到期实验的结论（如果有）

input 里判读出结论的实验，在用户确认后更新 `experiments.json`：

- ✅ / ⚪：`status` 改为 `verdict`，`verdict` 写一句结论和数据，页族随之解冻。
- 首次 ❌：**不结案**。`verdict` 写「首次 ❌，复核日 <日期>」，`status` 保持 `reading`，`windowDays` 延长到覆盖发布后第 2 个完整周。
- 确定不再追的方向，移到 `dequeued`，并写明 `reason`、`reopenIf`、`closedOn`。

编辑 `experiments.json` 之前先 `cp` 一份到 `report/YYYYMMDD-assets/`，用 Edit 局部修改。**禁止 `git checkout` 或 `git restore` 这个文件**。

## 产出

写入 `report/YYYYMMDD-execute.md`：

```markdown
# YYYYMMDD 实施记录

## 改动
| 文件 | 改了什么 |

## 验证
- geo:audit --gate：✅ / ❌（输出摘要）
- tsc / next build：…
- dev 抽查：逐个 URL 写结果

## 发布
- 状态：✅ 已 push（实际 push 日 YYYY-MM-DD，commit <sha>）/ ⏸️ 待用户确认（分支 <name>）
- 读窗复算：<实验 id>：读窗 <start> → <end>，判读日 <date>（已复算）
- 上线复查：geo-audit-after.md 摘要

## 回滚
- `report/YYYYMMDD-assets/originals/` 里的文件拷回原路径，然后提交、push
```

## 完成标准

- 本地验证全绿，或者已缩小范围、交付了能验证的部分。
- 发布状态写明了。已 push 的，读窗已按实际 push 日复算并写进 `experiments.json`。
- 回滚路径可以直接执行。
- 回到 `loop.md` 收尾：台账、summary、飞书通知。
