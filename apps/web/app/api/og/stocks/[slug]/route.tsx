import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import {
  DIMENSION_BUCKET_LABELS,
  DIMENSION_FALLBACK_LABEL,
  DIMENSION_KEYS,
} from '../../../../../lib/indicators/labels';
import type { Bucket } from '../../../../../lib/indicators/math';
import { getStockSnapshot, latestTally, toneOf, type StockSnapshot } from '../../../../../lib/stocks/snapshot';
import { displaySymbol, getStockBySlug } from '../../../../../lib/stocks/universe';

/**
 * GET /api/og/stocks/[slug] — per-ticker social card (X / LinkedIn /
 * Facebook / WhatsApp previews). Lives under /api so the URL is the same
 * for every locale and never goes through the locale proxy's redirects.
 *
 * Layout: header (price, moves, tone), then a price chart with the last
 * five sessions highlighted plus chips for today's active signals on the
 * left, and the 8-indicator × 5-day signal grid on the right — the same
 * story the page tells, readable at feed-thumbnail size.
 *
 * Reads the same cached snapshot as the page, so a share never triggers
 * an extra price fetch. Latin-only text on purpose: the built-in OG font
 * has no CJK glyphs, so Chinese names stay on the page itself.
 */

const W = 1200;
const H = 630;

const BG = '#151413';
const PANEL = '#1f1e1c';
const BORDER = '#2e2c29';
const TEXT = '#f4f2ee';
const SUB = '#b5b3ad';
const MUTED = '#77756f';
const RED = '#e5484d';
const GREEN = '#30a46c';

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TONE_LABEL = {
  bullish: 'Leaning bullish',
  bearish: 'Leaning bearish',
  mixed: 'Mixed signals',
  neutral: 'Neutral',
} as const;

function pct(v: number | null | undefined): string {
  return v == null || !Number.isFinite(v) ? '—' : `${v > 0 ? '+' : ''}${v.toFixed(2)}%`;
}

/** "Bullish · golden cross" → "golden cross" for compact chips. */
function reason(label: string): string {
  const i = label.indexOf(' · ');
  return i >= 0 ? label.slice(i + 3) : label;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await context.params;
  const stock = getStockBySlug(slug);
  if (!stock) return new Response('not found', { status: 404 });
  const snapshot = await getStockSnapshot(stock.ticker);
  const symbol = displaySymbol(stock);
  // Cards are seen off-site where the reader's colour setting is unknown,
  // so follow each market's own convention: green-up for US, red-up for HK / A-shares.
  const [UP, DOWN] = stock.market === 'us' ? [GREEN, RED] : [RED, GREEN];
  const signColor = (v: number | null | undefined) => (v == null || v === 0 ? SUB : v > 0 ? UP : DOWN);
  const bucketColor = (b: Bucket) => (b === 'bullish' ? UP : b === 'bearish' ? DOWN : MUTED);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: BG,
          color: TEXT,
          padding: '34px 52px 26px',
          fontFamily: 'sans-serif',
        }}
      >
        <Header stock={stock} symbol={symbol} snapshot={snapshot} signColor={signColor} UP={UP} DOWN={DOWN} />
        {snapshot ? (
          <div style={{ display: 'flex', flex: 1, gap: 24, marginTop: 18 }}>
            <ChartPanel snapshot={snapshot} signColor={signColor} bucketColor={bucketColor} />
            <GridPanel snapshot={snapshot} bucketColor={bucketColor} />
          </div>
        ) : (
          <div style={{ display: 'flex', flex: 1 }} />
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
            fontSize: 20,
            color: MUTED,
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex', fontWeight: 700, color: TEXT, fontSize: 24 }}>PickSkill</div>
            <div style={{ display: 'flex' }}>· 8 indicators · every day · free</div>
          </div>
          <div style={{ display: 'flex' }}>pickskill.ai/stocks/{stock.slug}</div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      // CDN-cache the PNG; the snapshot behind it refreshes every few hours anyway.
      headers: { 'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    },
  );
}

function Header({
  stock,
  symbol,
  snapshot,
  signColor,
  UP,
  DOWN,
}: {
  stock: { name: { en: string }; exchange: string };
  symbol: string;
  snapshot: StockSnapshot | null;
  signColor: (v: number | null | undefined) => string;
  UP: string;
  DOWN: string;
}) {
  const tally = snapshot ? latestTally(snapshot) : null;
  const tone = tally ? toneOf(tally) : null;
  const toneColor = tone === 'bullish' ? UP : tone === 'bearish' ? DOWN : SUB;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <div style={{ display: 'flex', fontSize: 56, fontWeight: 700, letterSpacing: -1, lineHeight: 1 }}>{symbol}</div>
          <div style={{ display: 'flex', fontSize: 28, color: SUB }}>
            {stock.name.en} · {stock.exchange}
          </div>
        </div>
        {snapshot && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 22, marginTop: 10 }}>
            <div style={{ display: 'flex', fontSize: 40, fontWeight: 700 }}>{snapshot.close?.toFixed(2) ?? '—'}</div>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 600, color: signColor(snapshot.changePct) }}>
              {pct(snapshot.changePct)}
            </div>
            <div style={{ display: 'flex', fontSize: 22, color: MUTED }}>5D</div>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 600, color: signColor(snapshot.fiveDayChangePct), marginLeft: -12 }}>
              {pct(snapshot.fiveDayChangePct)}
            </div>
          </div>
        )}
      </div>
      {tone && tally && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              fontWeight: 700,
              color: toneColor,
              border: `2px solid ${toneColor}`,
              borderRadius: 999,
              padding: '6px 20px',
            }}
          >
            {TONE_LABEL[tone]}
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 20 }}>
            <div style={{ display: 'flex', color: UP }}>▲ {tally.bullish} bullish</div>
            <div style={{ display: 'flex', color: DOWN }}>▼ {tally.bearish} bearish</div>
            <div style={{ display: 'flex', color: SUB }}>● {tally.neutral} neutral</div>
          </div>
          <div style={{ display: 'flex', fontSize: 18, color: MUTED }}>as of {snapshot?.asOf}</div>
        </div>
      )}
    </div>
  );
}

function ChartPanel({
  snapshot,
  signColor,
  bucketColor,
}: {
  snapshot: StockSnapshot;
  signColor: (v: number | null | undefined) => string;
  bucketColor: (b: Bucket) => string;
}) {
  const CW = 600;
  const CH = 205;
  const pts = snapshot.prices
    .map((p, i) => ({ i, time: p.time, c: p.close }))
    .filter((p): p is { i: number; time: string; c: number } => p.c != null);
  const n = snapshot.prices.length;
  const min = Math.min(...pts.map((p) => p.c));
  const max = Math.max(...pts.map((p) => p.c));
  const span = max - min || 1;
  const recent = snapshot.dailyChanges;
  const idxByTime = new Map(snapshot.prices.map((p, i) => [p.time, i]));
  const firstRecent = recent.length ? idxByTime.get(recent[0].time) ?? n - 5 : n - 5;
  // Two-speed x axis: history squeezed into the left ~74%, the last five
  // sessions spread across the rest so each day's dot is legible.
  const split = CW * 0.74;
  const pivot = Math.max(1, firstRecent - 1);
  const x = (i: number) =>
    i <= pivot
      ? 8 + (i / pivot) * (split - 8)
      : split + ((i - pivot) / Math.max(1, n - 1 - pivot)) * (CW - 20 - split);
  const y = (c: number) => 12 + (1 - (c - min) / span) * (CH - 24);
  const path = pts.map((p, k) => `${k === 0 ? 'M' : 'L'}${x(p.i).toFixed(1)},${y(p.c).toFixed(1)}`).join(' ');

  const bandX = split + 4;

  // Chips: today's non-neutral calls, strongest story first.
  const active = DIMENSION_KEYS.filter((k) => snapshot.dims[k].bucket !== 'neutral').slice(0, 3);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 640,
        background: PANEL,
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
        padding: '16px 18px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, color: MUTED, letterSpacing: 3 }}>
        <div style={{ display: 'flex' }}>PRICE · ~90 SESSIONS</div>
        <div style={{ display: 'flex', color: SUB }}>LAST 5 DAYS</div>
      </div>
      <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ marginTop: 6 }}>
        <rect x={bandX} y={0} width={CW - bandX} height={CH} fill="#ffffff" fillOpacity={0.06} rx={10} />
        <path d={path} fill="none" stroke={TEXT} strokeWidth={3} strokeLinejoin="round" />
        {recent.map((d) => {
          const i = idxByTime.get(d.time);
          const c = i != null ? snapshot.prices[i].close : null;
          if (i == null || c == null) return null;
          return (
            <circle key={d.time} cx={x(i)} cy={y(c)} r={7} fill={signColor(d.changePct)} stroke={PANEL} strokeWidth={3} />
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        {active.length === 0 ? (
          <div style={{ display: 'flex', fontSize: 20, color: SUB }}>All 8 indicators neutral today · waiting for a signal</div>
        ) : (
          active.map((k) => {
            const b = snapshot.dims[k].bucket;
            const color = bucketColor(b);
            return (
              <div
                key={k}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 16,
                  color,
                  border: `1.5px solid ${color}`,
                  borderRadius: 10,
                  padding: '5px 10px',
                }}
              >
                <div style={{ display: 'flex', fontWeight: 700 }}>
                  {b === 'bullish' ? '▲' : '▼'} {DIMENSION_FALLBACK_LABEL[k].toUpperCase()}
                </div>
                <div style={{ display: 'flex', color: SUB }}>{reason(DIMENSION_BUCKET_LABELS[k][b].en)}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function GridPanel({ snapshot, bucketColor }: { snapshot: StockSnapshot; bucketColor: (b: Bucket) => string }) {
  const days = snapshot.dims.macd.bucketTrend.map((s) => s.time);
  const CELL_W = 58;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        background: PANEL,
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
        padding: '16px 18px',
      }}
    >
      <div style={{ display: 'flex', fontSize: 16, color: MUTED, letterSpacing: 3 }}>5-DAY SIGNAL TIMELINE</div>
      <div style={{ display: 'flex', marginTop: 10, marginBottom: 2 }}>
        <div style={{ display: 'flex', width: 72 }} />
        {days.map((t, i) => {
          const d = new Date(`${t}T00:00:00Z`);
          const latest = i === days.length - 1;
          return (
            <div
              key={t}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: CELL_W,
                fontSize: 15,
                color: latest ? TEXT : MUTED,
                fontWeight: latest ? 700 : 400,
              }}
            >
              <div style={{ display: 'flex' }}>{WEEKDAY[d.getUTCDay()]}</div>
              <div style={{ display: 'flex', fontSize: 12 }}>{t.slice(5).replace('-', '/')}</div>
            </div>
          );
        })}
      </div>
      {DIMENSION_KEYS.map((k) => (
        <div key={k} style={{ display: 'flex', alignItems: 'center', height: 29 }}>
          <div style={{ display: 'flex', width: 72, fontSize: 16, color: SUB, letterSpacing: 1 }}>
            {DIMENSION_FALLBACK_LABEL[k].toUpperCase()}
          </div>
          {snapshot.dims[k].bucketTrend.map((s, i) => {
            const latest = i === snapshot.dims[k].bucketTrend.length - 1;
            const color = bucketColor(s.bucket);
            const neutral = s.bucket === 'neutral';
            return (
              <div key={s.time} style={{ display: 'flex', width: CELL_W, justifyContent: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 22,
                    borderRadius: 6,
                    background: neutral ? 'transparent' : color,
                    border: neutral ? `1.5px solid ${BORDER}` : latest ? `2px solid ${TEXT}` : 'none',
                    color: neutral ? MUTED : '#ffffff',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {s.bucket === 'bullish' ? '▲' : s.bucket === 'bearish' ? '▼' : '·'}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
