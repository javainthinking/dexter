# loops

Loop Engineering 的一组固定流程，每条 loop 都是：

- 一个入口文件 `loop.md`，加若干步骤文件
- 每一步的产物是下一步的输入，过了门槛才进入下一步
- 每轮的产物按日期归档到 `report/`

**第 0 步永远是**：先 `git pull --ff-only`，然后重读 `loop.md`。

| Loop | 做什么 | 触发 |
|---|---|---|
| [loop-gsc-optimization](loop-gsc-optimization/loop.md) | pickskill.ai 的 SEO / GEO 优化闭环。数据来自 GSC 和 GEO 体检，流程是洞察 → 计划 → 实施 → 发布 → 回看 | Claude Desktop routine（每周）或飞书委派 |

## 共用

- `tools/feishu-notify.sh`：每轮收尾时把小结推送到飞书群。webhook 放在 `loops/.env.feishu`，已被 gitignore。
- 新 loop 的写法参照这一条，以及 loops 台账仓 `javainthinking/loops` 里列出的其他项目的 loop。
