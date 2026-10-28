/**
 * About / Privacy / Terms copy for en, zh-CN and zh-TW. The zh-TW text
 * was first converted from zh-CN with OpenCC (s2twp, Taiwan phrasing);
 * when wording changes, update all three locales here.
 *
 * {{TOKENS}} are filled from LEGAL_FACTS in ./facts.ts at render time.
 */

import type { LegalDocs } from './types';

export const LEGAL_CONTENT: LegalDocs = {
  "about": {
    "en": {
      "metaTitle": "About PickSkill — AI Analyst for Retail Investors",
      "metaDescription": "PickSkill is an AI analyst that researches stocks, tracks technical signals across US, Hong Kong and China A-share markets, and turns analysis into decks, reports and models.",
      "title": "About PickSkill",
      "lead": "PickSkill is an AI analyst for individual investors. It researches companies with cited sources, tracks technical signals across US, Hong Kong and China A-share markets, and turns the analysis into ready-to-share decks, reports and spreadsheets.",
      "sections": [
        {
          "id": "what",
          "heading": "What does PickSkill do?",
          "body": [
            "PickSkill does the legwork a research analyst would: it pulls market data, filings and news, runs the numbers, and explains what it found in plain language, with links to where every figure came from.",
            {
              "list": [
                "AI analyst chat: ask any question about a company, sector or market and get a researched, sourced answer.",
                "Portfolio indicators: eight technical indicators (MACD, moving averages, RSI, KDJ, Bollinger Bands, ADX/DMI, volume and an estimated money-flow proxy) for every holding, every day, with a five-day signal trail.",
                "Document generation: native PowerPoint, Word and Excel files built from the analysis.",
                "Free stock signal pages: public, login-free technical-signal pages for popular US, Hong Kong and A-share tickers.",
                "PickSkill for Mac: the same workbench in a native desktop app."
              ]
            }
          ]
        },
        {
          "id": "principles",
          "heading": "How do we build it?",
          "body": [
            {
              "list": [
                "Sources over opinions. Answers cite the data and documents they rely on, so you can check them.",
                "Code does the math. Indicators, comparisons and figures are computed deterministically; AI writes the explanation, it does not invent numbers.",
                "Research, not advice. PickSkill helps you understand a security. It never tells you to buy or sell, and nothing it produces is investment advice."
              ]
            }
          ]
        },
        {
          "id": "data",
          "heading": "Where does the data come from?",
          "body": [
            "Market data comes from licensed and public providers including Valyu and Yahoo Finance; company filings come from public sources such as SEC EDGAR; web research uses search providers such as Exa and Tavily. Language models are provided by OpenAI and other AI providers. Market data can be delayed or contain errors, and every page states the date of the data it shows."
          ]
        },
        {
          "id": "company",
          "heading": "Who is behind PickSkill?",
          "body": [
            "PickSkill was founded in 2026. The research agent at its core builds on Dexter, an open-source financial research agent."
          ]
        },
        {
          "id": "contact",
          "heading": "How can I contact PickSkill?",
          "body": [
            "Use the {{FEEDBACK}} for support questions, bug reports, product ideas, partnerships, press and privacy requests. Sign in first and your message reaches the team directly; we reply to the email on your account."
          ]
        }
      ]
    },
    "zh-CN": {
      "metaTitle": "关于 PickSkill — 面向个人投资者的 AI 分析师",
      "metaDescription": "PickSkill 是一款 AI 分析师：研究个股、跟踪美股、港股、A股技术信号，并把分析一键生成 PPT、研报和表格。",
      "title": "关于 PickSkill",
      "lead": "PickSkill 是面向个人投资者的 AI 分析师。它用有出处的数据研究公司，跟踪美股、港股和 A股的技术信号，并把分析变成可直接分享的 PPT、研报和表格。",
      "sections": [
        {
          "id": "what",
          "heading": "PickSkill 能做什么？",
          "body": [
            "PickSkill 承担了研究员的基础工作：获取行情、公告和新闻，完成计算，再用通俗的语言解释结论，并标注每个数字的来源。",
            {
              "list": [
                "AI 分析师对话：就公司、行业或市场提问，获得有研究、有来源的回答。",
                "组合技术指标：为每只持仓每天计算 8 项指标（MACD、均线、RSI、KDJ、布林带、ADX/DMI、成交量与估算资金流），并展示近 5 日信号轨迹。",
                "文档生成：基于分析生成原生 PowerPoint、Word 和 Excel 文件。",
                "免费个股信号页：热门美股、港股、A股的技术信号公开页面，无需登录。",
                "PickSkill Mac 版：同样的工作台，原生桌面应用。"
              ]
            }
          ]
        },
        {
          "id": "principles",
          "heading": "我们坚持什么原则？",
          "body": [
            {
              "list": [
                "来源优先于观点。回答会注明所依据的数据和文件，方便你核实。",
                "计算交给代码。指标、比较和数字都由程序确定性地计算；AI 负责解释，不会编造数字。",
                "研究，而非建议。PickSkill 帮助你理解一只证券，从不建议买入或卖出，其产出均不构成投资建议。"
              ]
            }
          ]
        },
        {
          "id": "data",
          "heading": "数据从哪里来？",
          "body": [
            "行情数据来自 Valyu、Yahoo Finance 等授权及公开数据源；公司公告来自 SEC EDGAR 等公开渠道；网络检索使用 Exa、Tavily 等搜索服务。语言模型由 OpenAI 等 AI 服务商提供。行情数据可能存在延迟或误差，每个页面都会注明数据日期。"
          ]
        },
        {
          "id": "company",
          "heading": "PickSkill 由谁运营？",
          "body": [
            "PickSkill 创立于 2026 年。其核心研究智能体基于开源金融研究智能体 Dexter 构建。"
          ]
        },
        {
          "id": "contact",
          "heading": "如何联系 PickSkill？",
          "body": [
            "产品支持、问题报告、功能建议、商务合作、媒体及隐私相关请求，请通过{{FEEDBACK}}提交。登录后提交的消息会直接送达团队，我们会回复到你账户绑定的邮箱。"
          ]
        }
      ]
    },
    "zh-TW": {
      "metaTitle": "關於 PickSkill — 面向個人投資者的 AI 分析師",
      "metaDescription": "PickSkill 是一款 AI 分析師：研究個股、跟蹤美股、港股、A股技術訊號，並把分析一鍵生成 PPT、研報和表格。",
      "title": "關於 PickSkill",
      "lead": "PickSkill 是面向個人投資者的 AI 分析師。它用有出處的資料研究公司，跟蹤美股、港股和 A股的技術訊號，並把分析變成可直接分享的 PPT、研報和表格。",
      "sections": [
        {
          "id": "what",
          "heading": "PickSkill 能做什麼？",
          "body": [
            "PickSkill 承擔了研究員的基礎工作：獲取行情、公告和新聞，完成計算，再用通俗的語言解釋結論，並標註每個數字的來源。",
            {
              "list": [
                "AI 分析師對話：就公司、行業或市場提問，獲得有研究、有來源的回答。",
                "組合技術指標：為每隻持倉每天計算 8 項指標（MACD、均線、RSI、KDJ、布林帶、ADX/DMI、成交量與估算資金流），並展示近 5 日訊號軌跡。",
                "檔案生成：基於分析生成原生 PowerPoint、Word 和 Excel 檔案。",
                "免費個股訊號頁：熱門美股、港股、A股的技術訊號公開頁面，無需登入。",
                "PickSkill Mac 版：同樣的工作臺，原生桌面應用。"
              ]
            }
          ]
        },
        {
          "id": "principles",
          "heading": "我們堅持什麼原則？",
          "body": [
            {
              "list": [
                "來源優先於觀點。回答會註明所依據的資料和檔案，方便你核實。",
                "計算交給程式碼。指標、比較和數字都由程式確定性地計算；AI 負責解釋，不會編造數字。",
                "研究，而非建議。PickSkill 幫助你理解一隻證券，從不建議買入或賣出，其產出均不構成投資建議。"
              ]
            }
          ]
        },
        {
          "id": "data",
          "heading": "資料從哪裡來？",
          "body": [
            "行情資料來自 Valyu、Yahoo Finance 等授權及公開資料來源；公司公告來自 SEC EDGAR 等公開渠道；網路檢索使用 Exa、Tavily 等搜尋服務。語言模型由 OpenAI 等 AI 服務商提供。行情資料可能存在延遲或誤差，每個頁面都會註明資料日期。"
          ]
        },
        {
          "id": "company",
          "heading": "PickSkill 由誰運營？",
          "body": [
            "PickSkill 創立於 2026 年。其核心研究智慧體基於開源金融研究智慧體 Dexter 構建。"
          ]
        },
        {
          "id": "contact",
          "heading": "如何聯絡 PickSkill？",
          "body": [
            "產品支援、問題報告、功能建議、商務合作、媒體及隱私相關請求，請透過{{FEEDBACK}}提交。登入後提交的訊息會直接送達團隊，我們會回覆到你帳戶繫結的郵箱。"
          ]
        }
      ]
    }
  },
  "privacy": {
    "en": {
      "metaTitle": "Privacy Policy — PickSkill",
      "metaDescription": "How PickSkill collects, uses, shares and protects your information, the service providers we rely on, and the choices and rights you have.",
      "title": "Privacy Policy",
      "lead": "This policy explains what information PickSkill collects, how we use it, who we share it with, and the choices you have. We do not sell your personal information, and we do not use your conversations to train AI models.",
      "sections": [
        {
          "id": "who",
          "heading": "Who is responsible for your data?",
          "body": [
            "PickSkill (\"we\", \"us\") operates pickskill.ai, the PickSkill desktop app and related services, and is responsible for the personal information described here. You can reach us through the {{FEEDBACK}}."
          ]
        },
        {
          "id": "collect",
          "heading": "What information do we collect?",
          "body": [
            {
              "list": [
                "Account information: your email address and, if you sign in with Google, your name and profile picture.",
                "Content you provide: questions and messages you send, conversation history, portfolios and holdings you create, files and screenshots you attach to feedback, and the documents PickSkill generates for you.",
                "Billing information: your plan, subscription status and payment history. Card details are entered on and stored by Stripe; we never see or store full card numbers.",
                "Usage and device information: pages viewed, features used, approximate location derived from IP address, browser and device type, and referral source (for example, which link brought you here).",
                "Technical logs: IP address, user agent and request metadata kept by our hosting and infrastructure providers for security and reliability."
              ]
            }
          ]
        },
        {
          "id": "use",
          "heading": "How do we use it?",
          "body": [
            {
              "list": [
                "To provide the service: answer your questions, run analyses, maintain your portfolios and generate files.",
                "To manage your account and subscription, including sign-in codes and billing.",
                "To keep PickSkill secure: detect abuse, enforce usage limits and prevent fraud.",
                "To improve the product, using aggregated usage statistics.",
                "To communicate with you about the service, such as security notices and important changes."
              ]
            },
            "We do not sell or rent your personal information, we do not use it for third-party advertising, and we do not use your content to train AI models."
          ]
        },
        {
          "id": "ai",
          "heading": "How is my content processed by AI?",
          "body": [
            "To answer a request, PickSkill sends the relevant parts of your conversation to the language-model provider that serves it, currently OpenAI models accessed through the MemoryLake gateway, and may send search terms or ticker symbols to data and search providers. These providers process the data to return a result to us under their own terms and privacy policies. Do not include sensitive personal information (such as government ID numbers or account passwords) in your messages."
          ]
        },
        {
          "id": "share",
          "heading": "Who do we share it with?",
          "body": [
            "We share information only with service providers that help us run PickSkill, only to the extent they need it:",
            {
              "list": [
                "Vercel: hosting and content delivery.",
                "Supabase: database for accounts, conversations and portfolios.",
                "Cloudflare R2: storage for generated files and feedback attachments.",
                "Stripe: payment processing and subscription billing.",
                "Google: Google sign-in and Google Analytics.",
                "MemoryLake and OpenAI: language-model processing.",
                "Valyu, Yahoo Finance, Exa and Tavily: market data and web search (these receive queries such as tickers or search terms, not your account details).",
                "Our email delivery provider: sending sign-in codes and service emails."
              ]
            },
            "We may also disclose information if required by law, to protect the rights and safety of PickSkill or its users, or as part of a merger, acquisition or sale of assets, in which case this policy will continue to apply."
          ]
        },
        {
          "id": "cookies",
          "heading": "Do you use cookies?",
          "body": [
            {
              "list": [
                "Essential cookies keep you signed in (the session cookie) and remember your language choice.",
                "Analytics cookies from Google Analytics help us understand how the site is used. You can block them in your browser or with Google's opt-out add-on without affecting core features.",
                "Local storage in your browser remembers preferences such as the up/down colour convention, dismissed hints and your active portfolio. It never leaves your device."
              ]
            }
          ]
        },
        {
          "id": "retention",
          "heading": "How long do you keep it?",
          "body": [
            {
              "list": [
                "Account information, conversations and portfolios: for as long as your account is active, or until you delete them.",
                "Download links for generated files expire after 7 days.",
                "Background job records: deleted about 24 hours after the job finishes.",
                "Billing records: as long as required for tax and accounting obligations.",
                "When you ask us to delete your account, we delete or anonymise your personal information within {{DELETION_DAYS}} days, except where we must keep it to meet legal obligations."
              ]
            }
          ]
        },
        {
          "id": "rights",
          "heading": "What are my rights?",
          "body": [
            "Depending on where you live (for example under the GDPR, UK GDPR or California law), you may have the right to access, correct, export or delete your personal information, to object to or restrict certain processing, and to withdraw consent. To exercise any of these rights, submit a request through the {{FEEDBACK}} while signed in to your account. We will respond within the time required by applicable law, and you may also lodge a complaint with your local data-protection authority."
          ]
        },
        {
          "id": "transfers",
          "heading": "Where is my data stored?",
          "body": [
            "PickSkill's servers and primary database are located in the United States. If you use PickSkill from another country, your information will be transferred to and processed in the United States and other countries where our providers operate, with safeguards required by applicable law."
          ]
        },
        {
          "id": "security",
          "heading": "How do you protect it?",
          "body": [
            "We use encryption in transit (HTTPS), access controls, and providers with established security programmes. No method of transmission or storage is completely secure, so we cannot guarantee absolute security."
          ]
        },
        {
          "id": "children",
          "heading": "Can children use PickSkill?",
          "body": [
            "PickSkill is intended for adults and is not directed at anyone under 18. We do not knowingly collect information from children; if you believe a child has provided us information, tell us through the {{FEEDBACK}} and we will delete it."
          ]
        },
        {
          "id": "changes",
          "heading": "Will this policy change?",
          "body": [
            "We may update this policy as the product evolves. We will change the \"last updated\" date above and, for material changes, notify signed-in users in the product or by email."
          ]
        },
        {
          "id": "contact",
          "heading": "How do I contact you about privacy?",
          "body": [
            "Submit a privacy request through the {{FEEDBACK}} while signed in. We reply to the email address on your account."
          ]
        }
      ]
    },
    "zh-CN": {
      "metaTitle": "隐私政策 — PickSkill",
      "metaDescription": "PickSkill 如何收集、使用、共享和保护你的信息，我们依赖的服务商，以及你享有的选择与权利。",
      "title": "隐私政策",
      "lead": "本政策说明 PickSkill 收集哪些信息、如何使用、与谁共享，以及你可以做出的选择。我们不会出售你的个人信息，也不会用你的对话训练 AI 模型。",
      "sections": [
        {
          "id": "who",
          "heading": "谁对你的数据负责？",
          "body": [
            "PickSkill（以下简称“我们”）运营 pickskill.ai、PickSkill 桌面应用及相关服务，并对本政策所述的个人信息负责。你可以通过{{FEEDBACK}}联系我们。"
          ]
        },
        {
          "id": "collect",
          "heading": "我们收集哪些信息？",
          "body": [
            {
              "list": [
                "账户信息：你的邮箱地址；如使用 Google 登录，还包括你的姓名和头像。",
                "你提供的内容：你发送的问题和消息、对话记录、你创建的组合与持仓、你在反馈中附带的文件和截图，以及 PickSkill 为你生成的文档。",
                "账单信息：你的套餐、订阅状态和付款记录。银行卡信息在 Stripe 页面输入并由 Stripe 保存，我们不会看到或存储完整卡号。",
                "使用与设备信息：浏览的页面、使用的功能、根据 IP 地址推断的大致位置、浏览器和设备类型，以及来源渠道（例如你从哪个链接访问本站）。",
                "技术日志：托管和基础设施服务商为安全与稳定运行而保留的 IP 地址、User-Agent 及请求元数据。"
              ]
            }
          ]
        },
        {
          "id": "use",
          "heading": "我们如何使用这些信息？",
          "body": [
            {
              "list": [
                "提供服务：回答你的问题、运行分析、维护你的组合并生成文件。",
                "管理你的账户和订阅，包括登录验证码和计费。",
                "保障安全：识别滥用、执行用量限制并防范欺诈。",
                "基于汇总的使用统计改进产品。",
                "就服务相关事项与你沟通，例如安全通知和重要变更。"
              ]
            },
            "我们不会出售或出租你的个人信息，不会将其用于第三方广告，也不会用你的内容训练 AI 模型。"
          ]
        },
        {
          "id": "ai",
          "heading": "我的内容如何经过 AI 处理？",
          "body": [
            "为回答你的请求，PickSkill 会将对话中的相关内容发送给提供服务的语言模型服务商（目前为通过 MemoryLake 网关调用的 OpenAI 模型），并可能将搜索词或股票代码发送给数据和搜索服务商。这些服务商依据其自身条款和隐私政策处理数据并将结果返回给我们。请不要在消息中包含敏感个人信息（如身份证号或账户密码）。"
          ]
        },
        {
          "id": "share",
          "heading": "我们与谁共享信息？",
          "body": [
            "我们仅在必要范围内，与协助运营 PickSkill 的服务商共享信息：",
            {
              "list": [
                "Vercel：网站托管与内容分发。",
                "Supabase：存储账户、对话和组合的数据库。",
                "Cloudflare R2：存储生成的文件和反馈附件。",
                "Stripe：支付处理与订阅计费。",
                "Google：Google 登录与 Google Analytics。",
                "MemoryLake 与 OpenAI：语言模型处理。",
                "Valyu、Yahoo Finance、Exa 与 Tavily：行情数据与网络检索（它们接收的是股票代码或搜索词等查询内容，而非你的账户信息）。",
                "邮件发送服务商：发送登录验证码和服务邮件。"
              ]
            },
            "在法律要求、为保护 PickSkill 或用户的权利与安全，或在合并、收购、资产出售等情形下，我们也可能披露信息；届时本政策将继续适用。"
          ]
        },
        {
          "id": "cookies",
          "heading": "我们使用 Cookie 吗？",
          "body": [
            {
              "list": [
                "必要 Cookie：保持你的登录状态（会话 Cookie）并记住你选择的语言。",
                "分析 Cookie：Google Analytics 帮助我们了解网站的使用情况。你可以在浏览器中屏蔽，或使用 Google 提供的停用插件，不影响核心功能。",
                "浏览器本地存储：记住涨跌颜色习惯、已关闭的提示和当前组合等偏好，这些数据不会离开你的设备。"
              ]
            }
          ]
        },
        {
          "id": "retention",
          "heading": "我们保留信息多久？",
          "body": [
            {
              "list": [
                "账户信息、对话和组合：在账户有效期间保留，或直至你将其删除。",
                "生成文件的下载链接在 7 天后失效。",
                "后台任务记录：任务完成约 24 小时后删除。",
                "账单记录：按税务和会计义务要求的期限保留。",
                "你申请注销账户后，我们将在 {{DELETION_DAYS}} 天内删除或匿名化你的个人信息，法律要求保留的除外。"
              ]
            }
          ]
        },
        {
          "id": "rights",
          "heading": "我享有哪些权利？",
          "body": [
            "视你所在地区的法律（例如 GDPR、英国 GDPR、美国加州法律或中国《个人信息保护法》）而定，你可能有权访问、更正、导出或删除你的个人信息，反对或限制某些处理，以及撤回同意。如需行使上述权利，请登录账户后通过{{FEEDBACK}}提交申请。我们将在适用法律规定的期限内答复；你也可以向当地数据保护机构投诉。"
          ]
        },
        {
          "id": "transfers",
          "heading": "我的数据存储在哪里？",
          "body": [
            "PickSkill 的服务器和主数据库位于美国。如果你在其他国家或地区使用 PickSkill，你的信息将被传输至美国以及我们的服务商运营所在的其他国家处理，并采取适用法律要求的保护措施。"
          ]
        },
        {
          "id": "security",
          "heading": "我们如何保护信息？",
          "body": [
            "我们采用传输加密（HTTPS）、访问控制，并选用具备成熟安全体系的服务商。但任何传输或存储方式都无法做到绝对安全，我们无法保证绝对的安全性。"
          ]
        },
        {
          "id": "children",
          "heading": "未成年人可以使用 PickSkill 吗？",
          "body": [
            "PickSkill 面向成年人，不针对 18 岁以下人士。我们不会故意收集未成年人的信息；如你认为有未成年人向我们提供了信息，请通过{{FEEDBACK}}告知我们，我们将予以删除。"
          ]
        },
        {
          "id": "changes",
          "heading": "本政策会更新吗？",
          "body": [
            "随着产品发展，我们可能更新本政策。我们会修改上方的“最后更新”日期；如有重大变更，会通过产品内通知或邮件告知已登录用户。"
          ]
        },
        {
          "id": "contact",
          "heading": "隐私问题如何联系我们？",
          "body": [
            "请登录后通过{{FEEDBACK}}提交隐私相关请求，我们会回复到你账户绑定的邮箱。"
          ]
        }
      ]
    },
    "zh-TW": {
      "metaTitle": "隱私政策 — PickSkill",
      "metaDescription": "PickSkill 如何收集、使用、共享和保護你的資訊，我們依賴的服務商，以及你享有的選擇與權利。",
      "title": "隱私政策",
      "lead": "本政策說明 PickSkill 收集哪些資訊、如何使用、與誰共享，以及你可以做出的選擇。我們不會出售你的個人資訊，也不會用你的對話訓練 AI 模型。",
      "sections": [
        {
          "id": "who",
          "heading": "誰對你的資料負責？",
          "body": [
            "PickSkill（以下簡稱“我們”）運營 pickskill.ai、PickSkill 桌面應用及相關服務，並對本政策所述的個人資訊負責。你可以透過{{FEEDBACK}}聯絡我們。"
          ]
        },
        {
          "id": "collect",
          "heading": "我們收集哪些資訊？",
          "body": [
            {
              "list": [
                "帳戶資訊：你的郵箱地址；如使用 Google 登入，還包括你的姓名和頭像。",
                "你提供的內容：你傳送的問題和訊息、對話記錄、你建立的組合與持倉、你在意見回饋中附帶的檔案和截圖，以及 PickSkill 為你生成的檔案。",
                "帳單資訊：你的套餐、訂閱狀態和付款記錄。銀行卡資訊在 Stripe 頁面輸入並由 Stripe 儲存，我們不會看到或儲存完整卡號。",
                "使用與裝置資訊：瀏覽的頁面、使用的功能、根據 IP 地址推斷的大致位置、瀏覽器和裝置型別，以及來源渠道（例如你從哪個連結訪問本站）。",
                "技術日誌：託管和基礎設施服務商為安全與穩定執行而保留的 IP 地址、User-Agent 及請求後設資料。"
              ]
            }
          ]
        },
        {
          "id": "use",
          "heading": "我們如何使用這些資訊？",
          "body": [
            {
              "list": [
                "提供服務：回答你的問題、執行分析、維護你的組合並生成檔案。",
                "管理你的帳戶和訂閱，包括登入驗證碼和計費。",
                "保障安全：識別濫用、執行用量限制並防範欺詐。",
                "基於彙總的使用統計改進產品。",
                "就服務相關事項與你溝通，例如安全通知和重要變更。"
              ]
            },
            "我們不會出售或出租你的個人資訊，不會將其用於第三方廣告，也不會用你的內容訓練 AI 模型。"
          ]
        },
        {
          "id": "ai",
          "heading": "我的內容如何經過 AI 處理？",
          "body": [
            "為回答你的請求，PickSkill 會將對話中的相關內容傳送給提供服務的語言模型服務商（目前為透過 MemoryLake 閘道器呼叫的 OpenAI 模型），並可能將搜尋詞或股票程式碼傳送給資料和搜尋服務商。這些服務商依據其自身條款和隱私政策處理資料並將結果返回給我們。請不要在訊息中包含敏感個人資訊（如身份證號或帳戶密碼）。"
          ]
        },
        {
          "id": "share",
          "heading": "我們與誰共享資訊？",
          "body": [
            "我們僅在必要範圍內，與協助運營 PickSkill 的服務商共享資訊：",
            {
              "list": [
                "Vercel：網站託管與內容分發。",
                "Supabase：儲存帳戶、對話和組合的資料庫。",
                "Cloudflare R2：儲存生成的檔案和意見回饋附件。",
                "Stripe：支付處理與訂閱計費。",
                "Google：Google 登入與 Google Analytics。",
                "MemoryLake 與 OpenAI：語言模型處理。",
                "Valyu、Yahoo Finance、Exa 與 Tavily：行情資料與網路檢索（它們接收的是股票程式碼或搜尋詞等查詢內容，而非你的帳戶資訊）。",
                "郵件傳送服務商：傳送登入驗證碼和服務郵件。"
              ]
            },
            "在法律要求、為保護 PickSkill 或使用者的權利與安全，或在合併、收購、資產出售等情形下，我們也可能披露資訊；屆時本政策將繼續適用。"
          ]
        },
        {
          "id": "cookies",
          "heading": "我們使用 Cookie 嗎？",
          "body": [
            {
              "list": [
                "必要 Cookie：保持你的登入狀態（會話 Cookie）並記住你選擇的語言。",
                "分析 Cookie：Google Analytics 幫助我們瞭解網站的使用情況。你可以在瀏覽器中遮蔽，或使用 Google 提供的停用外掛，不影響核心功能。",
                "瀏覽器本地儲存：記住漲跌顏色習慣、已關閉的提示和當前組合等偏好，這些資料不會離開你的裝置。"
              ]
            }
          ]
        },
        {
          "id": "retention",
          "heading": "我們保留資訊多久？",
          "body": [
            {
              "list": [
                "帳戶資訊、對話和組合：在帳戶有效期間保留，或直至你將其刪除。",
                "生成檔案的下載連結在 7 天后失效。",
                "後臺任務記錄：任務完成約 24 小時後刪除。",
                "帳單記錄：按稅務和會計義務要求的期限保留。",
                "你申請登出帳戶後，我們將在 {{DELETION_DAYS}} 天內刪除或匿名化你的個人資訊，法律要求保留的除外。"
              ]
            }
          ]
        },
        {
          "id": "rights",
          "heading": "我享有哪些權利？",
          "body": [
            "視你所在地區的法律（例如 GDPR、英國 GDPR、美國加州法律或中國《個人資訊保護法》）而定，你可能有權訪問、更正、匯出或刪除你的個人資訊，反對或限制某些處理，以及撤回同意。如需行使上述權利，請登入帳戶後透過{{FEEDBACK}}提交申請。我們將在適用法律規定的期限內答覆；你也可以向當地資料保護機構投訴。"
          ]
        },
        {
          "id": "transfers",
          "heading": "我的資料儲存在哪裡？",
          "body": [
            "PickSkill 的伺服器和主資料庫位於美國。如果你在其他國家或地區使用 PickSkill，你的資訊將被傳輸至美國以及我們的服務商運營所在的其他國家處理，並採取適用法律要求的保護措施。"
          ]
        },
        {
          "id": "security",
          "heading": "我們如何保護資訊？",
          "body": [
            "我們採用傳輸加密（HTTPS）、訪問控制，並選用具備成熟安全體系的服務商。但任何傳輸或儲存方式都無法做到絕對安全，我們無法保證絕對的安全性。"
          ]
        },
        {
          "id": "children",
          "heading": "未成年人可以使用 PickSkill 嗎？",
          "body": [
            "PickSkill 面向成年人，不針對 18 歲以下人士。我們不會故意收集未成年人的資訊；如你認為有未成年人向我們提供了資訊，請透過{{FEEDBACK}}告知我們，我們將予以刪除。"
          ]
        },
        {
          "id": "changes",
          "heading": "本政策會更新嗎？",
          "body": [
            "隨著產品發展，我們可能更新本政策。我們會修改上方的“最後更新”日期；如有重大變更，會透過產品內通知或郵件告知已登入使用者。"
          ]
        },
        {
          "id": "contact",
          "heading": "隱私問題如何聯絡我們？",
          "body": [
            "請登入後透過{{FEEDBACK}}提交隱私相關請求，我們會回覆到你帳戶繫結的郵箱。"
          ]
        }
      ]
    }
  },
  "terms": {
    "en": {
      "metaTitle": "Terms of Service — PickSkill",
      "metaDescription": "The terms that govern your use of PickSkill, including subscriptions and billing, acceptable use, AI-generated output, and the fact that nothing on PickSkill is investment advice.",
      "title": "Terms of Service",
      "lead": "These terms govern your use of PickSkill. By creating an account or using the service you agree to them. The short version: PickSkill is a research tool, not an investment adviser, and you are responsible for your own investment decisions.",
      "sections": [
        {
          "id": "service",
          "heading": "What do these terms cover?",
          "body": [
            "These Terms of Service form an agreement between you and PickSkill (\"PickSkill\", \"we\", \"us\") covering pickskill.ai, the PickSkill desktop app, public pages such as the stock signal pages, and related services (together, the \"Service\"). Our Privacy Policy explains how we handle personal information."
          ]
        },
        {
          "id": "advice",
          "heading": "Is PickSkill investment advice?",
          "body": [
            "No. PickSkill provides general information and research tools for educational purposes only. Nothing on the Service, including AI-generated answers, technical signals, reports or files, is investment, financial, legal, tax or accounting advice, or a recommendation or solicitation to buy, sell or hold any security.",
            {
              "list": [
                "PickSkill is not a registered investment adviser, broker-dealer or financial planner, and does not know your personal circumstances.",
                "Technical indicators describe past price behaviour and do not predict future returns. Market data may be delayed, incomplete or inaccurate.",
                "Investing involves risk, including loss of principal. Do your own research and consult a licensed professional before making investment decisions. You are solely responsible for your decisions and their outcomes."
              ]
            }
          ]
        },
        {
          "id": "accounts",
          "heading": "Who can use PickSkill?",
          "body": [
            "You must be at least 18 years old and able to form a binding contract. You are responsible for keeping your account secure and for activity under it. Tell us promptly through the {{FEEDBACK}} if you suspect unauthorised access."
          ]
        },
        {
          "id": "billing",
          "heading": "How do subscriptions and billing work?",
          "body": [
            {
              "list": [
                "PickSkill offers a free plan and paid plans with the features and usage limits shown on the pricing page. Limits may be enforced automatically.",
                "Paid plans are billed in advance, monthly or yearly, through Stripe, and renew automatically until cancelled.",
                "You can cancel at any time from the billing portal in your account; cancellation takes effect at the end of the current billing period and you keep access until then.",
                "Except where required by law or stated otherwise at purchase, payments are non-refundable and we do not provide refunds or credits for partial periods.",
                "We may change prices with at least 30 days' notice; changes apply from your next renewal."
              ]
            }
          ]
        },
        {
          "id": "use",
          "heading": "What am I not allowed to do?",
          "body": [
            {
              "list": [
                "Break the law, infringe others' rights, or use the Service to manipulate markets or commit fraud.",
                "Scrape, bulk-download or resell the Service or its data, or use it to build a competing product.",
                "Circumvent usage limits, share accounts, or access the Service through automated means other than features we provide.",
                "Interfere with or disrupt the Service, probe it for vulnerabilities without permission, or upload malware.",
                "Use the Service to generate unlawful, harassing or misleading content, or misrepresent AI output as professional advice."
              ]
            }
          ]
        },
        {
          "id": "content",
          "heading": "Who owns my content and the AI output?",
          "body": [
            "You keep ownership of the content you submit. You grant us a limited licence to host, process and transmit it only as needed to operate and improve the Service. Subject to these terms, you may use the output PickSkill generates for you, including files, for your own purposes.",
            "AI output can be inaccurate, incomplete or out of date, and similar output may be produced for other users. Review output carefully and verify important facts against primary sources before relying on it."
          ]
        },
        {
          "id": "third-party",
          "heading": "What about third-party data?",
          "body": [
            "The Service includes data and content from third parties such as market-data, filings and search providers. It is provided as is, may be subject to the providers' own terms, and we do not guarantee its accuracy, completeness or timeliness."
          ]
        },
        {
          "id": "ip",
          "heading": "Who owns PickSkill?",
          "body": [
            "The Service, including its software, design and branding, belongs to PickSkill and its licensors and is protected by intellectual-property laws. These terms do not grant you any rights to our trademarks. Open-source components remain subject to their own licences."
          ]
        },
        {
          "id": "disclaimer",
          "heading": "What warranties do you give?",
          "body": [
            "The Service is provided \"as is\" and \"as available\". To the fullest extent permitted by law, we disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, accuracy and non-infringement, and we do not warrant that the Service will be uninterrupted or error-free."
          ]
        },
        {
          "id": "liability",
          "heading": "What is PickSkill's liability?",
          "body": [
            "To the fullest extent permitted by law, PickSkill will not be liable for any indirect, incidental, special, consequential or punitive damages, or for any trading or investment losses, lost profits or lost data, arising from your use of the Service. Our total liability for any claim relating to the Service is limited to the greater of the amount you paid us in the 12 months before the claim or US$100. Some jurisdictions do not allow these limitations, so they may not fully apply to you."
          ]
        },
        {
          "id": "indemnity",
          "heading": "Do I indemnify PickSkill?",
          "body": [
            "You agree to indemnify and hold PickSkill harmless from claims and expenses arising from your misuse of the Service or your violation of these terms or of others' rights."
          ]
        },
        {
          "id": "termination",
          "heading": "Can my access be suspended or ended?",
          "body": [
            "You may stop using the Service and delete your account at any time. We may suspend or terminate your access if you breach these terms, create risk or legal exposure for us, or if we discontinue the Service; where reasonable we will give notice. Sections that by their nature should survive termination will survive."
          ]
        },
        {
          "id": "changes",
          "heading": "Will these terms change?",
          "body": [
            "We may update these terms. We will change the \"last updated\" date above and, for material changes, notify you in the product or by email before they take effect. Continuing to use the Service after changes take effect means you accept them."
          ]
        },
        {
          "id": "contact",
          "heading": "How do I contact you?",
          "body": [
            "Questions about these terms can be sent through the {{FEEDBACK}} while signed in."
          ]
        }
      ]
    },
    "zh-CN": {
      "metaTitle": "服务条款 — PickSkill",
      "metaDescription": "使用 PickSkill 的条款，包括订阅与计费、可接受的使用方式、AI 生成内容，以及 PickSkill 上的任何内容均不构成投资建议。",
      "title": "服务条款",
      "lead": "本条款约束你对 PickSkill 的使用。注册账户或使用本服务即表示你同意本条款。简而言之：PickSkill 是研究工具，不是投资顾问，你需对自己的投资决策负责。",
      "sections": [
        {
          "id": "service",
          "heading": "本条款适用于什么？",
          "body": [
            "本服务条款是你与 PickSkill（以下简称“我们”）之间的协议，适用于 pickskill.ai、PickSkill 桌面应用、个股信号页等公开页面及相关服务（统称“本服务”）。我们如何处理个人信息，请参阅隐私政策。"
          ]
        },
        {
          "id": "advice",
          "heading": "PickSkill 提供投资建议吗？",
          "body": [
            "不提供。PickSkill 仅出于教育目的提供一般性信息和研究工具。本服务上的任何内容，包括 AI 生成的回答、技术信号、报告或文件，均不构成投资、财务、法律、税务或会计建议，也不构成买入、卖出或持有任何证券的推荐或要约。",
            {
              "list": [
                "PickSkill 不是注册投资顾问、证券经纪商或理财规划师，也不了解你的个人情况。",
                "技术指标描述的是历史价格表现，不能预测未来收益。行情数据可能存在延迟、缺失或错误。",
                "投资有风险，可能损失本金。请自行研究，并在做出投资决策前咨询持牌专业人士。你对自己的决策及其结果承担全部责任。"
              ]
            }
          ]
        },
        {
          "id": "accounts",
          "heading": "谁可以使用 PickSkill？",
          "body": [
            "你必须年满 18 周岁并具备订立有效合同的能力。你有责任保护账户安全，并对账户下的活动负责。如怀疑账户被未经授权访问，请及时通过{{FEEDBACK}}告知我们。"
          ]
        },
        {
          "id": "billing",
          "heading": "订阅和计费如何运作？",
          "body": [
            {
              "list": [
                "PickSkill 提供免费套餐和付费套餐，功能和用量限制以定价页面所示为准，限制可能会被自动执行。",
                "付费套餐通过 Stripe 按月或按年预先收费，并在取消前自动续订。",
                "你可以随时在账户的账单管理页面取消订阅；取消在当前计费周期结束时生效，在此之前你仍可继续使用。",
                "除法律另有规定或购买时另有说明外，已支付的费用不予退还，我们不对未使用完的周期提供退款或抵扣。",
                "我们可能调整价格，并将至少提前 30 天通知；新价格自你下一次续订时生效。"
              ]
            }
          ]
        },
        {
          "id": "use",
          "heading": "哪些行为是禁止的？",
          "body": [
            {
              "list": [
                "违反法律、侵犯他人权利，或利用本服务操纵市场、实施欺诈。",
                "抓取、批量下载或转售本服务或其数据，或用于开发竞争产品。",
                "规避用量限制、共享账户，或通过我们提供的功能以外的自动化方式访问本服务。",
                "干扰或破坏本服务，未经许可探测其漏洞，或上传恶意软件。",
                "利用本服务生成违法、骚扰或误导性内容，或将 AI 产出冒充为专业建议。"
              ]
            }
          ]
        },
        {
          "id": "content",
          "heading": "我的内容和 AI 产出归谁所有？",
          "body": [
            "你保留所提交内容的所有权。你授予我们有限的许可，仅在运营和改进本服务所必需的范围内托管、处理和传输这些内容。在遵守本条款的前提下，你可以将 PickSkill 为你生成的产出（包括文件）用于自己的目的。",
            "AI 产出可能不准确、不完整或已过时，其他用户也可能获得相似的产出。在依赖产出之前，请仔细审阅，并根据原始来源核实重要事实。"
          ]
        },
        {
          "id": "third-party",
          "heading": "第三方数据如何处理？",
          "body": [
            "本服务包含来自行情数据、公告和搜索服务商等第三方的数据和内容。这些内容按“现状”提供，可能受相应服务商条款约束，我们不保证其准确性、完整性或及时性。"
          ]
        },
        {
          "id": "ip",
          "heading": "PickSkill 归谁所有？",
          "body": [
            "本服务（包括软件、设计和品牌）归 PickSkill 及其许可方所有，受知识产权法律保护。本条款不授予你使用我们商标的任何权利。开源组件仍受其各自许可证约束。"
          ]
        },
        {
          "id": "disclaimer",
          "heading": "你们提供哪些保证？",
          "body": [
            "本服务按“现状”和“现有”基础提供。在法律允许的最大范围内，我们不作任何明示或默示的保证，包括适销性、特定用途适用性、准确性和不侵权，也不保证本服务不中断或无错误。"
          ]
        },
        {
          "id": "liability",
          "heading": "PickSkill 承担什么责任？",
          "body": [
            "在法律允许的最大范围内，对于因你使用本服务而产生的任何间接、附带、特殊、后果性或惩罚性损害，或任何交易或投资损失、利润损失或数据丢失，PickSkill 不承担责任。就与本服务相关的任何索赔，我们的累计责任以你在索赔前 12 个月内向我们支付的金额或 100 美元中较高者为限。部分司法辖区不允许上述限制，因此可能不完全适用于你。"
          ]
        },
        {
          "id": "indemnity",
          "heading": "我需要承担赔偿责任吗？",
          "body": [
            "因你滥用本服务、违反本条款或侵犯他人权利而引起的索赔和费用，你同意赔偿 PickSkill 并使其免受损害。"
          ]
        },
        {
          "id": "termination",
          "heading": "我的使用权限可能被暂停或终止吗？",
          "body": [
            "你可以随时停止使用本服务并注销账户。如你违反本条款、给我们带来风险或法律责任，或我们终止本服务，我们可以暂停或终止你的访问权限；在合理情况下我们会事先通知。依其性质应在终止后继续有效的条款将继续有效。"
          ]
        },
        {
          "id": "changes",
          "heading": "本条款会变更吗？",
          "body": [
            "我们可能更新本条款。我们会修改上方的“最后更新”日期；如有重大变更，会在生效前通过产品内通知或邮件告知你。变更生效后继续使用本服务，即表示你接受变更后的条款。"
          ]
        },
        {
          "id": "contact",
          "heading": "如何联系我们？",
          "body": [
            "关于本条款的问题，请登录后通过{{FEEDBACK}}提交。"
          ]
        }
      ]
    },
    "zh-TW": {
      "metaTitle": "服務條款 — PickSkill",
      "metaDescription": "使用 PickSkill 的條款，包括訂閱與計費、可接受的使用方式、AI 生成內容，以及 PickSkill 上的任何內容均不構成投資建議。",
      "title": "服務條款",
      "lead": "本條款約束你對 PickSkill 的使用。註冊帳戶或使用本服務即表示你同意本條款。簡而言之：PickSkill 是研究工具，不是投資顧問，你需對自己的投資決策負責。",
      "sections": [
        {
          "id": "service",
          "heading": "本條款適用於什麼？",
          "body": [
            "本服務條款是你與 PickSkill（以下簡稱“我們”）之間的協議，適用於 pickskill.ai、PickSkill 桌面應用、個股訊號頁等公開頁面及相關服務（統稱“本服務”）。我們如何處理個人資訊，請參閱隱私政策。"
          ]
        },
        {
          "id": "advice",
          "heading": "PickSkill 提供投資建議嗎？",
          "body": [
            "不提供。PickSkill 僅出於教育目的提供一般性資訊和研究工具。本服務上的任何內容，包括 AI 生成的回答、技術訊號、報告或檔案，均不構成投資、財務、法律、稅務或會計建議，也不構成買入、賣出或持有任何證券的推薦或要約。",
            {
              "list": [
                "PickSkill 不是註冊投資顧問、證券經紀商或理財規劃師，也不瞭解你的個人情況。",
                "技術指標描述的是歷史價格表現，不能預測未來收益。行情資料可能存在延遲、缺失或錯誤。",
                "投資有風險，可能損失本金。請自行研究，並在做出投資決策前諮詢持牌專業人士。你對自己的決策及其結果承擔全部責任。"
              ]
            }
          ]
        },
        {
          "id": "accounts",
          "heading": "誰可以使用 PickSkill？",
          "body": [
            "你必須年滿 18 週歲並具備訂立有效合約的能力。你有責任保護帳戶安全，並對帳戶下的活動負責。如懷疑帳戶被未經授權訪問，請及時透過{{FEEDBACK}}告知我們。"
          ]
        },
        {
          "id": "billing",
          "heading": "訂閱和計費如何運作？",
          "body": [
            {
              "list": [
                "PickSkill 提供免費套餐和付費套餐，功能和用量限制以定價頁面所示為準，限制可能會被自動執行。",
                "付費套餐透過 Stripe 按月或按年預先收費，並在取消前自動續訂。",
                "你可以隨時在帳戶的帳單管理頁面取消訂閱；取消在當前計費週期結束時生效，在此之前你仍可繼續使用。",
                "除法律另有規定或購買時另有說明外，已支付的費用不予退還，我們不對未使用完的週期提供退款或抵扣。",
                "我們可能調整價格，並將至少提前 30 天通知；新價格自你下一次續訂時生效。"
              ]
            }
          ]
        },
        {
          "id": "use",
          "heading": "哪些行為是禁止的？",
          "body": [
            {
              "list": [
                "違反法律、侵犯他人權利，或利用本服務操縱市場、實施欺詐。",
                "抓取、批次下載或轉售本服務或其資料，或用於開發競爭產品。",
                "規避用量限制、共享帳戶，或透過我們提供的功能以外的自動化方式訪問本服務。",
                "干擾或破壞本服務，未經許可探測其漏洞，或上傳惡意軟體。",
                "利用本服務生成違法、騷擾或誤導性內容，或將 AI 產出冒充為專業建議。"
              ]
            }
          ]
        },
        {
          "id": "content",
          "heading": "我的內容和 AI 產出歸誰所有？",
          "body": [
            "你保留所提交內容的所有權。你授予我們有限的許可，僅在運營和改進本服務所必需的範圍內託管、處理和傳輸這些內容。在遵守本條款的前提下，你可以將 PickSkill 為你生成的產出（包括檔案）用於自己的目的。",
            "AI 產出可能不準確、不完整或已過時，其他使用者也可能獲得相似的產出。在依賴產出之前，請仔細審閱，並根據原始來源核實重要事實。"
          ]
        },
        {
          "id": "third-party",
          "heading": "第三方資料如何處理？",
          "body": [
            "本服務包含來自行情資料、公告和搜尋服務商等第三方的資料和內容。這些內容按“現狀”提供，可能受相應服務商條款約束，我們不保證其準確性、完整性或及時性。"
          ]
        },
        {
          "id": "ip",
          "heading": "PickSkill 歸誰所有？",
          "body": [
            "本服務（包括軟體、設計和品牌）歸 PickSkill 及其許可方所有，受智慧財產權法律保護。本條款不授予你使用我們商標的任何權利。開源元件仍受其各自許可證約束。"
          ]
        },
        {
          "id": "disclaimer",
          "heading": "你們提供哪些保證？",
          "body": [
            "本服務按“現狀”和“現有”基礎提供。在法律允許的最大範圍內，我們不作任何明示或默示的保證，包括適銷性、特定用途適用性、準確性和不侵權，也不保證本服務不中斷或無錯誤。"
          ]
        },
        {
          "id": "liability",
          "heading": "PickSkill 承擔什麼責任？",
          "body": [
            "在法律允許的最大範圍內，對於因你使用本服務而產生的任何間接、附帶、特殊、後果性或懲罰性損害，或任何交易或投資損失、利潤損失或資料丟失，PickSkill 不承擔責任。就與本服務相關的任何索賠，我們的累計責任以你在索賠前 12 個月內向我們支付的金額或 100 美元中較高者為限。部分司法轄區不允許上述限制，因此可能不完全適用於你。"
          ]
        },
        {
          "id": "indemnity",
          "heading": "我需要承擔賠償責任嗎？",
          "body": [
            "因你濫用本服務、違反本條款或侵犯他人權利而引起的索賠和費用，你同意賠償 PickSkill 並使其免受損害。"
          ]
        },
        {
          "id": "termination",
          "heading": "我的使用許可權可能被暫停或終止嗎？",
          "body": [
            "你可以隨時停止使用本服務並登出帳戶。如你違反本條款、給我們帶來風險或法律責任，或我們終止本服務，我們可以暫停或終止你的訪問許可權；在合理情況下我們會事先通知。依其性質應在終止後繼續有效的條款將繼續有效。"
          ]
        },
        {
          "id": "changes",
          "heading": "本條款會變更嗎？",
          "body": [
            "我們可能更新本條款。我們會修改上方的“最後更新”日期；如有重大變更，會在生效前透過產品內通知或郵件告知你。變更生效後繼續使用本服務，即表示你接受變更後的條款。"
          ]
        },
        {
          "id": "contact",
          "heading": "如何聯絡我們？",
          "body": [
            "關於本條款的問題，請登入後透過{{FEEDBACK}}提交。"
          ]
        }
      ]
    }
  }
};
