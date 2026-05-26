---
title: PickSkill로 15분 만에 신규 종목 리서치하는 법
description: '사업 모델, 재무, 밸류에이션, 기술적 셋업, 리스크 — 완전한 1차 종목 리서치 워크플로우를 채팅과 지표 도구로 15분 안에.'
publishedAt: 2026-05-26T00:00:00.000Z
updatedAt: 2026-05-26T00:00:00.000Z
author:
  name: PickSkill Team
  url: 'https://pickskill.ai'
  bio: PickSkill 리서치 팀 — 개인 투자자를 위한 AI 애널리스트를 만들고 있습니다.
pillar: how-to
tags:
  - 튜토리얼
  - 리서치
  - 워크플로우
  - DCF
  - 10-K
  - 지표
heroImage: /blog/how-to-research-a-new-stock-in-15-minutes/hero.png
heroAlt: >-
  인포그래픽 — 좌측에 5단계 리서치 워크플로우 (비즈니스 → 재무 → 밸류에이션 → 기술 → 리스크), 우측에 TSM의 1페이지 의사결정
  카드.
---

**2~3시간이 걸리던 1차 종목 리서치 세션을 올바른 워크플로우로 15분 안에 완료할 수 있습니다.** 단계를 건너뛰기 때문이 아닙니다 — 프레임워크는 여전히 사업 모델, 재무, 밸류에이션, 기술적 셋업, 리스크를 모두 다룹니다 — PickSkill이 데이터 수집 단계를 수 초로 압축해 주기 때문에, 정작 필요한 15분, 즉 판단을 위한 시간을 남겨 줍니다. 이 튜토리얼은 정석적인 1차 워크플로우입니다. 고려 중인 신규 종목에 대해, 워치리스트에 추가할지 또는 더 많은 리서치 시간을 투입할지 결정하기 전에 사용하세요.

### 핵심 요약

- **5단계, 총 약 15분.** 사업 → 재무 → 밸류에이션 → 기술적 → 리스크. 각 단계는 한 번의 프롬프트입니다.
- **프레임워크는 구조화된 사고를 강제합니다** — 상위 질문에 답하기 전에 "이걸 사야 하나?"로 건너뛰지 못합니다.
- **한 페이지 요약을 출력**하여 [워치리스트](/blog/how-to-build-a-watchlist-that-actually-works)에 추가하거나 종목을 기각하기 적합합니다.
- **빠른 버전(15분)이 디스로케이션의 80%를 잡습니다.** 느린 버전(2시간 이상의 심층 작업)은 빠른 버전이 "흥미롭다"고 한 후에만 필요합니다.
- **미국, 홍콩, A주 종목에 동일한 워크플로우로 작동**합니다 — PickSkill은 시장에 맞는 공시를 가져옵니다.

## 이 워크플로우가 중요한 이유

대부분의 개인 투자자는 1차 리서치 단계에서 비틀거립니다. 두 가지 흔한 실패:

1. **차트로 곧장 건너뛰기.** "차트가 좋아 보인다"는 논거가 아닙니다. 근본 사업 모델과 재무 점검 없이는 가격 패턴을 사는 것입니다.
2. **디테일에 빠지기.** 종목이 더 깊은 작업을 할 가치가 있는지 결정하기도 전에 전체 10-K, 8-K, 최근 실적 발표 녹취록, 모든 애널리스트 리포트를 읽기. 다 읽고 났을 때는 구조화된 프레임워크가 있었다면 1시간 차에 기각했을 종목에 4시간을 쓴 셈입니다.

15분 1차 워크플로우는 기각 필터입니다. 리서치하는 종목 대부분은 이를 통과하지 못합니다. 핵심은 종목당 15분을 쓰고, 통과한 종목에만 2시간의 심층 분석을 예약하는 것입니다.

## 5단계 워크플로우

### 1단계 — 사업 모델 (3분)

[/chat](/chat)을 여세요. 이 프롬프트를 붙여넣으세요:

```text
Summarize [TICKER] in 5 bullets:
1. What does the company actually do (1 sentence)
2. Revenue split — top 3 segments and their % of total
3. Top 3 customers or customer concentration
4. Top 3 competitors  
5. The single most important question this business needs to get right
```

PickSkill은 최신 10-K와 최근 보도자료에서 구축한 간결한 사업 모델 요약을 반환합니다. "가장 중요한 단일 질문" 프레이밍은 사업을 실제로 움직이는 것이 무엇인지에 대한 명확성을 강제합니다 — 회사를 이해하는지, 아니면 단지 티커를 이해하는지에 대한 유용한 테스트입니다.

**이 단계의 위험 신호**: 5개 불릿 후에도 사업 모델이 명확하지 않음, 단일 고객에 대한 고객 집중도가 30% 이상, 보이는 경쟁 해자가 없음. 이런 것이 보이면 여기서 멈추세요. 종목은 다음 12분의 가치가 없습니다.

### 2단계 — 재무 건전성 (3분)

다음 프롬프트:

```text
For [TICKER], pull the last 4 quarters and last 3 years of:
- Revenue and revenue growth YoY
- Gross margin trajectory
- Operating margin trajectory  
- Free cash flow (last 4 quarters)
- Net debt position (cash − total debt)
- Share count change YoY (buybacks vs issuance)
```

PickSkill은 이를 작은 표로 렌더링합니다. 재무 이야기는 1분의 독서로 일관되게 보여야 합니다.

**이 단계의 위험 신호**: 매출 성장의 급격한 감속, 명확한 원인 없는 마진 압박, 의도적 성장 투자에서 비롯되지 않은 음의 잉여현금흐름, 인수 활동 없이 연 5% 이상 증가하는 주식 수.

### 3단계 — 밸류에이션 스냅샷 (3분)

다음 프롬프트:

```text
For [TICKER], compute:
- Current trailing P/E, forward P/E, EV/EBITDA, P/B
- 5-year historical range for each multiple (10th–90th percentile)
- Where current multiples sit within that historical range
- Compare current multiples to 3 closest peers
- Quick 5-year DCF — implied price at base assumptions
```

PickSkill은 멀티플, 동종업계 비교, 그리고 빠른 DCF([Build a DCF in 60 Seconds](/blog/build-dcf-in-60-seconds)에서 전체 버전 참조)를 반환합니다.

**이 단계의 위험 신호**: 모든 멀티플이 5년 범위의 상단에 있으면서 이를 정당화할 펀더멘털의 명확한 가속이 없음, DCF가 현재 가격보다 30% 이상 낮게 시사, 상대 밸류에이션이 모든 동종업계보다 높음.

### 4단계 — 기술적 셋업 (3분)

다음 프롬프트:

```text
For [TICKER], show me the current technical setup:
- Price vs 20 / 60 / 200-day MA
- Current MACD, RSI, KDJ readings
- Any active divergence (regular or hidden)
- Nearest support and resistance levels
- 5-day bucket trail across the full indicator suite
```

PickSkill은 [/indicators](/indicators) 데이터를 가져와 다중 신호 정렬을 표시합니다.

**이 단계의 위험 신호**: 깊은 과매수 진입(RSI > 75, 모든 지표가 높게 고정됨), 약세 다이버전스 형성, 가격이 200일 SMA에서 한참 위에 확장됨. 이는 지금-매수 셋업이 아니라 눌림목-대기 종목입니다.

### 5단계 — 리스크 (3분)

마지막 프롬프트:

```text
For [TICKER], list:
- Top 3 risks from the latest 10-K's risk factors section
- Top 3 risks from recent earnings calls (last 4 quarters)
- One downside scenario — what does this stock look like if the bull case is wrong?
```

PickSkill은 10-K 리스크 요인과 최근 경영진 코멘트를 요약합니다. 하방 시나리오 질문은 대부분의 개인 독자가 건너뛰는 것이고, 가장 비싼 실수를 잡는 질문입니다.

**이 단계의 위험 신호**: 경영진이 명시한 리스크에 단일 고객 집중, 규제 위협, 대차대조표 압박, 또는 "going concern" 표현이 포함됨. 이는 자동 실격 사유는 아니지만 포지션 사이징 대화를 재구성해야 합니다.

## 출력을 정리하는 법

5단계 후 이렇게 요청하세요:

```text
Compile this conversation into a one-page summary I can save:
- Business model in 2 sentences
- Financials trajectory in 4 bullets
- Valuation summary with 3-line bull/base/bear
- Technical setup status
- Top 3 risks
- Decision: watchlist, deeper research, or pass
```

PickSkill은 구조화된 한 페이지 요약을 반환합니다. 채팅 세션 북마크를 통해 저장하세요. 종목을 [워치리스트](/blog/how-to-build-a-watchlist-that-actually-works)에 두기로 결정하면, 그 한 페이지가 논거 문서가 됩니다.

> **지금 시도해 보세요.** [/chat](/chat)을 열고 고려 중인 종목에 위의 5개 프롬프트를 실행하세요. 전체 루프는 읽기 시간을 포함해 약 15분입니다.

## 워크플로우가 임기응변 리서치가 놓치는 것을 어떻게 잡아내는가

### 1. 구조적 기각 대 가격 기반 기각

임기응변 리서치는 종종 사업이 어떤 가격에서든 보유할 가치가 있는지조차 확인하지 않고 차트 모습("과매수처럼 보임")에 기반해 종목을 기각합니다. 구조화된 워크플로우는 순서를 뒤집습니다: 사업 → 재무 → 밸류에이션 → 기술적. 사업이나 재무가 실패하면 차트는 중요하지 않고, 사업과 재무가 통과하면 차트는 타이밍에 대해 알려줄 뿐 실행 가능성에 대해서가 아닙니다.

### 2. 하방 시나리오 질문

개인 리서치에서 가장 많이 건너뛰는 단일 단계는 "약세 케이스는 어떻게 생겼나?"입니다. 구조화된 워크플로우는 이를 강제합니다. 그것이 없으면 강세 케이스를 과도하게 가중하고 변동성에 대한 준비가 부족해집니다.

### 3. 한 곳에서 다중 소스 종합

워크플로우는 10-K 데이터, 최근 실적, 현재 멀티플, 동종업계 비교, 기술적 상태를 하나의 채팅 세션에 가져옵니다. 각각을 수동으로 수집하면 10~20분이 걸립니다 — PickSkill은 각각을 수 초로 압축해 실제 사고를 위한 시간을 남깁니다.

## 종목 리서치에서의 네 가지 함정

1. **사업 모델 단계 건너뛰기.** 주식의 티커를 아는 것이 회사를 아는 것은 아닙니다. 5개 불릿 요약 없이는 사업이 아닌 티커를 거래하는 것입니다.
2. **하방 시나리오 무시.** 강세 케이스는 스스로 팔립니다. 약세 케이스는 의도적으로 끌어내야 합니다. 약세 케이스를 설명할 수 없다면 리서치가 끝나지 않은 것입니다.
3. **"모두 초록"을 매수로 취급하기.** 강한 펀더멘털, 매력적인 밸류에이션, 좋은 기술적 지표를 가진 주식이 자동으로 매수 대상인 것은 아닙니다 — 때로는 쉬운 돈은 이미 벌렸고 향후 12개월은 횡보일 종목일 수 있습니다. 포지션 사이징과 진입 수준 규율이 중요합니다.
4. **결과물을 워치리스트나 기각으로 확정하지 않기.** 15분 1차의 핵심은 끝에서의 의사결정입니다. "좀 생각해 봐야겠다"가 킬러입니다 — 결정을 만들지 않으면서 정신적 대역폭을 소비합니다. 워치리스트, 더 깊은 리서치, 또는 패스 중 하나로 착륙하도록 강제하세요.

## A주에서 이 방법은 어떻게 적용되는가

워크플로우는 A주와 홍콩 주식에 동일하게 작동합니다. 두 가지 구체적 조정:

- A주의 경우 "扣非净利润"(비경상 항목 제외 순이익)이 관련 이익 숫자입니다. PickSkill은 A주 P/E와 EPS 성장 계산 시 이를 기본값으로 사용합니다.
- A주 밸류에이션 멀티플은 대부분의 섹터에서 미국 동종업계보다 구조적으로 낮습니다. 미국 동등치가 아닌 A주 역사적 범위와 비교하세요.

더 넓은 시장별 플레이북은 [Best Indicators for A-shares](/blog/best-indicators-for-a-shares)를 참고하세요.

## 일반적인 후속 프롬프트

15분 1차 후:

- *"[ticker]에 대한 더 깊은 DCF — 전체 민감도 표, 세그먼트 수준 매출 예측."*
- *"[ticker]를 가장 가까운 3개 동종업계와 전체 멀티플 스택 및 FCF 성장으로 비교해."*
- *"이 대화에서 [ticker]에 대한 투자자 덱을 생성해."* ([Generate an Investor Deck from a Chat](/blog/generate-investor-deck-from-chat) 참조.)
- *"이 논거로 [ticker]를 내 워치리스트에 추가해: [...]"*
- *"다음 실적 발표를 위해 [ticker]의 재검토를 예약해."*

## 더 읽기

- [Build a DCF in 60 Seconds](/blog/build-dcf-in-60-seconds) — 15분 1차가 통과할 때의 밸류에이션 심층 분석.
- [How to Read a 10-K in 30 Minutes](/blog/how-to-read-10k) — 1단계 + 2단계의 수동 심층 독해 버전.
- [How to Build a Watchlist That Actually Works](/blog/how-to-build-a-watchlist-that-actually-works) — 성공한 1차 종목이 다음으로 가는 곳.

## FAQ

**왜 15분 — 주식에 너무 빠르지 않나요?**
1차 예/아니오 결정에는 15분이면 충분합니다 — 대부분의 종목은 이 단계에서 기각되어야 합니다. 심층 작업(구체적 가정 모델링, 최근 모든 SEC 공시 읽기, 전 직원 대화)은 1차를 통과하는 소수의 종목에만 예약됩니다. 마주치는 모든 종목에 4시간을 쓰는 것은 동기 부여된 개인 투자자의 지배적 실패 모드입니다.

**여러 종목을 병렬로 리서치할 수 있나요?**
예 — PickSkill은 병렬 채팅 세션을 지원합니다. 많은 사용자가 동시에 3~5개의 세션을 열고 각각에 동일한 5-프롬프트 템플릿을 실행합니다. 구조는 배치 리서치를 실용적으로 만듭니다.

**PickSkill에 그 종목의 데이터가 없으면 어떻게 하나요?**
PickSkill은 대부분의 미국 상장(NYSE / NASDAQ), 홍콩 상장(HKEx), A주 상장(SSE / SZSE) 종목을 다룹니다. 매우 작거나 최근 상장된 종목의 경우 커버리지가 얇을 수 있습니다 — PickSkill은 데이터를 조작하기보다 어떤 데이터 포인트가 사용 불가능한지 알려줍니다.

**채팅 세션을 저장해야 하나요?**
예 — PickSkill의 모든 채팅 세션은 영구 저장됩니다. 유용한 리서치 세션은 나중에 참조할 수 있도록 북마크하세요. 포지션을 취하기로 결정하면 채팅 세션이 어떻게 논거에 도달했는지에 대한 감사 추적이 됩니다.

**이것은 일반 ChatGPT 리서치와 어떻게 다른가요?**
PickSkill의 채팅은 모델의 학습 데이터가 아니라 실시간 공시, 시장 데이터, 계산된 지표에 기반합니다. ChatGPT는 매출 수치와 P/E 비율을 환각으로 만들어내지만, PickSkill은 쿼리 시점에 1차 소스에서 가져옵니다. 이 구조적 차이는 진부하거나 조작된 숫자가 결론을 완전히 바꿀 수 있는 재무 및 밸류에이션 단계에서 가장 중요합니다.
