---
title: EV/EBITDA 란? 자본 구조를 꿰뚫는 평가 멀티플
description: EV/EBITDA 실전 가이드 — 무엇을 측정, 왜 자본 구조 교차 비교에서 PER 보다 우위, 자본 집약 사업을 어떻게 보이게 하는가, PER 대신 언제 쓸지.
publishedAt: 2026-05-23
updatedAt: 2026-05-23
author:
  name: PickSkill Team
  url: https://pickskill.ai
  bio: PickSkill 리서치 팀 — 개인 투자자를 위한 AI 애널리스트를 만듭니다.
pillar: explainer
tags:
  - valuation
  - ev-ebitda
  - multiples
  - fundamentals
heroImage: /blog/what-is-ev-ebitda/hero.png
heroAlt: EV/EBITDA 공식과 업종별 일반 범위를 보여주는 인포그래픽
---

**EV/EBITDA** 는 자본 구조를 꿰뚫는 평가 멀티플입니다. [PER](/blog/what-is-pe-ratio) 은 이자 차감 후·세후 이익으로 주가를 나누지만, EV/EBITDA 는 *기업가치*(전체 사업)를 *EBITDA*(자본 조달과 회계 선택이 왜곡하기 전의 이익)로 나눕니다. 한쪽은 부채가 많고 다른 쪽은 무차입이어도 동종업체 비교를 가능하게 합니다.

### 핵심 요약

- **EV/EBITDA = 기업가치 ÷ EBITDA.** EV = 시가총액 + 부채 − 현금 + 비지배지분. EBITDA = 이자·세금·감가상각·무형자산상각 차감 전 이익.
- **자본 구조와 무관.** 부채 수준이 다른 회사 비교가 EV/EBITDA 가 존재하는 주된 이유. PER 은 무너지지만 EV/EBITDA 는 무너지지 않음.
- **자본 집약 사업을 좋아 보이게 함** — Capex 무시 때문. 매년 10 억 달러 capex 쓰는 제철소가 동일 멀티플의 거의 안 쓰는 소프트웨어 회사보다 "저렴" 해 보임.
- **업종별 일반치**: 유틸리티 8–10×, 산업 10–14×, 소비/헬스케어 14–20×, 소프트웨어 18–30×+.
- **PickSkill 은 EV/EBITDA 계산**, 동종업체 비교, EV/EBITDA 와 PER 이 저평/고평에서 반대 신호일 때 자동 표시.

## EV/EBITDA 란?

```
EV/EBITDA = 기업가치 / EBITDA
여기서:
  기업가치 = 시가총액 + 총부채 − 현금 + 비지배지분
  EBITDA  = 영업이익 + 감가상각 + 무형자산상각
```

**기업가치(EV)** 는 전체 사업 인수 총비용 — 주식 전부 매입 *및* 부채 인수, 현금으로 일부 상쇄. **EBITDA** 는 네 가지 제외: 이자(조달 선택), 세금(관할), 감가상각, 상각(둘 다 비현금 회계 분배). 남는 건 capex 와 운전자본 차감 전 영업 현금 창출 대용.

## EV/EBITDA 가 PER 을 이길 때

1. **부채 수준이 다른 회사.** 레버리지 회사는 이자 높고 순이익 낮고 PER 기계적으로 상승. EV/EBITDA 는 이자선 위에서 자르니 비교가 깨끗. 통신회사 비교가 전형.
2. **최근 M&A 가 상각을 왜곡.** P/E 는 반영, EBITDA 는 안 함.
3. **국가 간 비교.** 세제 차이로 PER 잡음. EV/EBITDA 는 세금 중립.

## EV/EBITDA 가 호도할 때

1. **자본 집약 사업.** 제철·통신·항공은 매출의 5–15% 매년 capex. EBITDA 는 무시. EV/EBITDA 가 싸 보여도 FCF 는 훨씬 약함. FCF 수익률과 함께 보기 — [FCF 란?](/blog/what-is-fcf).
2. **소프트웨어 개발비 자본화.** SaaS 는 내부 소프트웨어 자본화로 영업비용에서 capex 로 이동, EBITDA 가 안 봄. 32× EV/EBITDA 의 SaaS 가 자본화 안 하는 32× 동종업체와 근본 현금 경제가 다름.
3. **공격적으로 EBITDA 조정.** "Adjusted EBITDA", "Pro Forma EBITDA", "EBITDAS" — 조정이 늘수록 실제 현금과의 간극이 벌어짐. 10-K 의 EBITDA 조정표를 먼저 읽기 — [10-K 30 분 독해](/blog/how-to-read-10k).

## 업종별 범위 (개략)

| 업종 | 일반 EV/EBITDA |
|---|---|
| **유틸리티** | 8–10× |
| **산업/소재** | 10–14× |
| **소비/헬스케어** | 14–20× |
| **소프트웨어/인터넷** | 18–30×+ |
| **은행** | 사용 안 함 (PER 또는 P/Book) |

업종 교차 원시 EV/EBITDA 비교는 무의미.

## EV/EBITDA vs PER

| EV/EBITDA 쓸 때 | PER 쓸 때 |
|---|---|
| 자본 구조 교차 비교 | 레버리지 유사한 동종업체 |
| 국가/세제 교차 비교 | 동일 국가 |
| 큰 비현금 상각이 순이익 왜곡 | 손익계산서 깨끗·안정 |
| M&A 후 인수자 교차 비교 | 성숙·최근 거래 없음 |
| LBO/인수 분석 | 순수 자기자본 비교 |

절대 vs 상대 평가는 [DCF vs 동종업체 비교](/blog/dcf-vs-comparable-company-analysis).

## PickSkill 의 EV/EBITDA 활용

[/chat](/chat) 에서 입력:

> *"AMD, AVGO, INTC, NVDA 를 EV/EBITDA — TTM·NTM 양쪽 — 으로 비교하고 각각의 5 년 평균과 대조. EV/EBITDA 와 PER 이 저평/고평에서 반대 신호를 주는 이름에 표시."*

PickSkill 은 SEC 공시 + 시장 데이터에서 EV 구성요소(시가총액 + 부채 + 비지배지분 − 현금)와 EBITDA(TTM + 컨센서스 NTM)를 각 티커별로 가져와, 두 멀티플 모두 계산, 둘이 반대 신호인 경우를 명시적으로 표시 — 자본 구조나 상각, 공격적 EBITDA 조정이 실제 작용 중이라는 유용한 신호.

[DCF vs Comps](/blog/dcf-vs-comparable-company-analysis) 와 페어링.

## FAQ

**"좋은" EV/EBITDA 는?**
보편적 "좋음" 없음. 유틸리티 9× 는 공정; 소프트웨어 9× 는 무언가 잘못 안 된 한 저렴. 동종업체 + 자사 이력을 앵커로.

**EV 와 시가총액 차이?**
시가총액 = 자기자본만. EV = 자기자본 + 부채 − 현금 + 비지배지분. 같은 회사, EV 는 인수 총비용 반영.

**포워드 또는 트레일링 EBITDA?**
NTM 기본, TTM 방어 가능. 둘 다 사용해 간극을 컨센서스 성장관으로 읽기.

**EV/EBITDA 와 EV/EBIT 같나?**
다름 — EBIT 은 D&A 차감, EBITDA 는 안 함. EV/EBIT 은 "진짜 이익" 에 가깝고, EV/EBITDA 는 capex 전 영업 현금에 가까움. 자본 집약 사업은 EV/EBIT, 자산 경량은 EV/EBITDA.

**PickSkill 은 EBITDA 어디서?**
최신 10-K/10-Q 의 손익·현금흐름표에서 직접 계산. 회사 자체 공표 EBITDA(있다면) 와 대조하고, 회사 적용 조정(SBC 제외, 구조조정 가산 등)을 명시해 공표값의 공격성을 가시화.
