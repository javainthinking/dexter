/**
 * Wire shape of GET /api/stocks/indicator-cards — shared by the route and
 * the chat's inline indicator cards. Types only, safe for client bundles.
 */

import type { DimensionKey } from '../indicators/labels';
import type { Bucket } from '../indicators/math';

export type CardTone = 'bullish' | 'bearish' | 'mixed' | 'neutral';

export interface IndicatorCardDim {
  bucket: Bucket;
  /** Last 5 daily buckets, oldest → newest. */
  trail: Bucket[];
}

export interface IndicatorCardData {
  ticker: string;
  slug: string;
  symbol: string;
  name: string;
  asOf: string;
  close: number | null;
  changePct: number | null;
  fiveDayChangePct: number | null;
  closes: Array<number | null>;
  dims: Record<DimensionKey, IndicatorCardDim>;
  tone: CardTone;
  toneLabel: string;
  tallyText: string;
}

export type IndicatorCardResult = IndicatorCardData | { ticker: string; slug: string | null; error: string };

