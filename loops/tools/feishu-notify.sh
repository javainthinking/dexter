#!/usr/bin/env bash
# Send a markdown notification to a Feishu (Lark) group via custom bot webhook.
#
# Usage:
#   printf '%s' "<markdown body>" | loops/tools/feishu-notify.sh --title "GSC 优化 Loop 20260717"
#
# Config (loops/.env.feishu, gitignored):
#   FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxx
#   FEISHU_WEBHOOK_SECRET=xxxx        # 可选，机器人开了「签名校验」才需要
#
# Exit code is always 0 unless config is missing — 通知失败不应阻塞 loop（调用方按 loop.md 记录一笔即可）。

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env.feishu"

TITLE="Loop 通知"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --title) TITLE="$2"; shift 2 ;;
    *) echo "unknown arg: $1" >&2; exit 1 ;;
  esac
done

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a; source "$ENV_FILE"; set +a
fi

if [[ -z "${FEISHU_WEBHOOK_URL:-}" ]]; then
  echo "⚠️  FEISHU_WEBHOOK_URL 未配置（loops/.env.feishu），跳过通知" >&2
  exit 2
fi

BODY="$(cat)"
if [[ -z "$BODY" ]]; then
  echo "⚠️  stdin 为空，跳过通知" >&2
  exit 2
fi

# 签名（机器人开启「签名校验」时）：sign = base64(hmac_sha256(key = timestamp + "\n" + secret, msg = ""))
SIGN_FIELDS=""
if [[ -n "${FEISHU_WEBHOOK_SECRET:-}" ]]; then
  TS="$(date +%s)"
  SIGN="$(printf '' | openssl dgst -sha256 -hmac "$(printf '%s\n%s' "$TS" "$FEISHU_WEBHOOK_SECRET")" -binary | base64)"
  SIGN_FIELDS="$(jq -n --arg ts "$TS" --arg sign "$SIGN" '{timestamp:$ts, sign:$sign}')"
fi

PAYLOAD="$(jq -n \
  --arg title "$TITLE" \
  --arg body "$BODY" \
  '{
    msg_type: "interactive",
    card: {
      config: { wide_screen_mode: true },
      header: { title: { tag: "plain_text", content: $title }, template: "blue" },
      elements: [ { tag: "markdown", content: $body } ]
    }
  }')"
if [[ -n "$SIGN_FIELDS" ]]; then
  PAYLOAD="$(jq -n --argjson a "$SIGN_FIELDS" --argjson b "$PAYLOAD" '$a + $b')"
fi

RESP="$(curl -sS -m 15 -X POST "$FEISHU_WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d "$PAYLOAD" 2>&1)"

if echo "$RESP" | jq -e '.code == 0' >/dev/null 2>&1; then
  echo "✅ 飞书通知已发送：$TITLE"
else
  echo "⚠️  飞书通知发送失败（不阻塞 loop）：$RESP" >&2
fi
exit 0
