---
title: 为什么我们的 AI 分析师会写 Word、PowerPoint 和 Excel
description: 聊天答案无法交付。我们教会 PickSkill 生成原生的 Word、PPT 和 Excel 文件,让研究成为一份可发送、可演示的可交付物。
publishedAt: 2026-06-09
updatedAt: 2026-06-09
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: PickSkill 研究团队 — 为个人投资者打造 AI 分析师。
pillar: build-in-public
tags:
  - file-generation
  - office
  - ai-analyst
  - product
  - build-in-public
heroImage: /blog/why-our-ai-analyst-writes-office-files/hero.png
heroAlt: 编辑风格信息图 — 左侧一个聊天气泡,经过一层 OfficeCLI,流向右侧三个原生文件输出:一份 .docx 备忘录、一份 .pptx 演示文稿和一个 .xlsx 工作簿,每个都标注着「真实 OpenXML,不是截图」。
---

**一个聊天答案读过一次就丢了;而一份 Word 备忘录、一份 PowerPoint 演示文稿和一个 Excel 工作簿会被转发、编辑、演示和归档。** 当我们在开源 [Dexter](https://github.com/virattt/dexter) agent 之上构建 [PickSkill](https://pickskill.ai) 时,底层 CLI 唯一没有的、也是我们最早一批用户呼声最高的那项能力 —— 就是*可交付物*。于是我们加入了 OfficeCLI:一个把 agent 的分析变成原生 `.docx`、`.pptx` 和 `.xlsx` 文件的层。不是截图、不是 PDF、不是 Markdown 堆砌。本文是关于「为什么一个严肃的 AI 分析师必须会写 Office 文件、以及我们是怎么做的」的 build-in-public 论证。

### 核心要点

- **聊天输出无法交付。** 在金融领域真正被分享、编辑和演示的格式是 Word、PowerPoint 和 Excel —— 不是聊天记录。
- **PickSkill 通过 OfficeCLI 生成原生 OpenXML 文件**:真正的 `.docx` 备忘录、带内嵌图表的 `.pptx` 演示文稿,以及带实时跨表公式的 `.xlsx` 工作簿。
- **每个文件都来自实时数据** —— 指标在最新收盘上计算,财务来自最新一份申报,估值来自当前共识。
- **文件以 Cloudflare R2 上 7 天有效的预签名链接交付**,所以没有任何东西要安装,也没有平台锁定。
- **一句 prompt,三种格式。** 同一份研究可以变成备忘录、演示文稿或模型 —— 你为受众挑选那件产物。

## 为什么一个聊天答案不是可交付物

生成式 AI 让研究*答案*变便宜了。它没有让研究*产物*变便宜。在「模型告诉我 NVDA 的 FCF 利润率是 18%」和「我有一份四页备忘录、我的投资俱乐部周日能读」之间,存在一道鸿沟。这道鸿沟 —— 演示层 —— 正是大多数散户分析悄悄死掉的地方,因为等你把想分享的分析做完,你已经没耐心再去拼那份让它可被分享的演示文稿或工作簿了。

格式之所以重要,是因为受众不同。备忘录是给那个读散文、想要论证的人。演示文稿是给一场你要逐步讲解论点的现场对话。工作簿是给那个想排序、透视、加自己列的协作者。一段聊天记录这三者都服务不了 —— 它无法排序、无法演示、读起来像一份日志。弥合答案与产物之间的鸿沟,就是 OfficeCLI 存在的全部理由。

## 「原生 OpenXML」究竟意味着什么

当我们说 PickSkill 生成真正的 Office 文件时,意思是每一个形状、单元格、公式和图表都是一个货真价实的 OpenXML 对象 —— 与 Microsoft Office 写出的文件格式相同。这个区别不是表面功夫。一张表的截图是死像素;一个真正的 `.xlsx` 表能排序、能筛选、能喂给透视表。一份幻灯片的 PDF 无法重新换主题;一份真正的 `.pptx` 演示文稿能通过 Design → Variants 套上你的企业模板,并让你编辑任意一页的标题。

下面是每种格式承载的内容:

| 格式 | PickSkill 写出什么 | 你能用它做什么 |
|---|---|---|
| **`.docx`** | 带标题的章节、表格、有出处的论断、散文叙述 | 在 Word/Google Docs 里编辑,作为备忘录转发,粘进一份报告 |
| **`.pptx`** | 封面、持仓/论点幻灯、内嵌图表图片、可编辑标题 | 用 PowerPoint/Keynote 演示、重新换主题、编辑任意幻灯 |
| **`.xlsx`** | 多工作表工作簿、实时跨表公式、条件格式、迷你图 | 排序、透视、加列,在其上搭你自己的模型 |

因为输出是标准 OpenXML,它能在 Excel、Google Sheets、LibreOffice、Apple Numbers、Keynote 和 Google Slides 中打开 —— 打开别人分享给你的文件,无需 PickSkill 账户。

## OfficeCLI 如何嵌入 agent 循环

PickSkill 继承了 Dexter 的规划-执行-校验 agent 循环(完整的起源故事见 [从 Dexter 到 PickSkill](/blog/from-dexter-to-pickskill))。文件生成作为这个循环的最后一个阶段嵌入进去:一旦 agent 完成研究、计算和校验,OfficeCLI 就把结果编译成一份文档。

对于一份组合演示文稿,流程是这样的:

1. agent 拉取每只持仓的当前价和价格历史。
2. 它跑那套八维指标套件([/indicators](/indicators))并检测活跃信号。
3. 它拉取估值倍数和最新的财务摘要。
4. 它把指标图渲染成高分辨率图片。
5. OfficeCLI 组装 `.pptx` —— 内嵌图表、格式化表格、把可编辑标题绑定到分析上。
6. 文件被写入 Cloudflare R2,并以 7 天有效的预签名下载链接返回。

关键的设计选择:文件是*绑定*到分析上的,而不是从分析里粘贴出来的。在聊天里要求一处改动 —— 「以 FCF 叙事开头」「把每只持仓的幻灯各压成一页」 —— agent 就会重跑相关分析并发出一份新文件。文档处于推理的下游,所以它保持诚实。

> **现在试试。** 在 [/portfolios](/portfolios) 打开任意组合,点击 *Export to PowerPoint* 或 *Export to Excel* —— 文件大约一分钟就绪。

## 三种格式,三类受众

我们之所以把三种都做出来、而不是只挑一种,是因为散户和半职业分析师面对的是不同的房间,而产物必须匹配那个房间:

- **Word** 给那个用散文思考的分析师 —— 一份论点备忘录、一份 10-K 摘要、一份仓位理由。关于散文与幻灯的取舍,读我们的 [从一次聊天生成投资演示](/blog/generate-investor-deck-from-chat) 教程。
- **PowerPoint** 给现场演示 —— 一个投资俱乐部、一个面试委员会、一位掌管家庭账户的合伙人。见[把组合导出为 PowerPoint](/blog/export-portfolio-to-powerpoint)。
- **Excel** 给那个想*动手处理*数字的协作者 —— 按信号强度排序、按行业透视、叠加自己的情景。见[把组合报告导出为 Excel](/blog/export-portfolio-report-to-excel)。

一场研究对话,三种可能的产物。你在选择受众时就选择了格式 —— 底层的分析是一模一样的。

## 诚实的说明

build-in-public 意味着要标明文件生成做不到什么:

- **它是一个快照,不是一条实时链接。** 工作簿的公式会对自己的单元格更新,但它们不会实时拉取新的市场数据。要刷新,就重新导出 —— 大约 30 秒。
- **自定义企业模板需要手动设置。** 演示文稿使用 PickSkill 的设计系统;重度品牌化的模板(自定义字体、Logo 位置)在导出后通过你的 Office 主题套用。
- **没有 VBA / 宏。** 输出是数据、公式和图表。宏和自定义功能区仍是手动添加项。
- **没有直接的券商同步。** 持仓来自你在 [/portfolios](/portfolios) 维护的组合,而不是实时的券商数据源。

这些是刻意设定的边界,不是 bug —— 文件是一个干净、有出处的起点,供你在其上构建,而不是一个你必须盲目信任的黑箱。

## FAQ

**一个 AI 分析师究竟为什么需要写 Office 文件?**
因为研究只有在被分享时才创造价值,而金融用 Word、PowerPoint 和 Excel 来分享。一个聊天答案无法被演示、排序或归档。生成原生 Office 文件,弥合了「模型回答了我的问题」和「我有一份同事或俱乐部真正能用的可交付物」之间的鸿沟。

**这些文件是真正的 Office 文档,还是只是截图的导出?**
真正的 OpenXML 文档。每个单元格、公式、幻灯和图表都是货真价实的 Office 对象 —— 工作簿能排序和透视,演示文稿能换主题和编辑,备忘录能在 Word 或 Google Docs 里打开。没有任何东西是扁平的截图或只读的 PDF。

**我需要装 Microsoft Office 才能用它们吗?**
不用。文件能在 Excel、Google Sheets、LibreOffice、Apple Numbers、Keynote 和 Google Slides 里打开。因为 PickSkill 写的是标准 OpenXML,并在默认导出中避免使用厂商专有的函数,所以文件能在每一个主流的 Office 兼容套件里正确渲染。

**下载链接能用多久?**
每个文件都以 Cloudflare R2 上 7 天有效的预签名链接交付。文件本身一旦下载就是永久的 —— 任何时候需要带最新数据的刷新版本,都可以从聊天里重新生成。链接的作用范围限定在你的账户内。

**一场研究对话能产出不止一种格式吗?**
能。同一份分析可以变成 `.docx` 备忘录、`.pptx` 演示文稿或 `.xlsx` 工作簿 —— 你为受众挑选那件产物。底层的研究是一模一样的;只有可交付物在变,因为文件是在 agent 推理的下游生成的,而不是粘进一个固定模板里。
