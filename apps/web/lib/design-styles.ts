/**
 * Catalog of brand design systems referenced from the
 * VoltAgent/awesome-design-md repo. Each entry is one design.md file
 * we can load into the chat composer.
 *
 * `slug` — directory name in the repo (also used in the raw URL).
 * `name` — human-friendly display name.
 * `iconSlug` — Simple Icons CDN slug; some brands need a different
 *   slug than the directory name. `null` = no Simple Icons coverage,
 *   render the initial letter as a fallback.
 * `color` — primary brand color (hex without #) used for the Simple
 *   Icons fill and the card's gradient background.
 *
 * Source of truth: https://github.com/VoltAgent/awesome-design-md/tree/main/design-md
 * (last synced 2026-05-23, 70 brands).
 */

export interface DesignStyleBrand {
  slug: string;
  name: string;
  iconSlug: string | null;
  color: string;
}

const RAW_BASE =
  'https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md';

/**
 * Per-brand path on the raw CDN. The file is uppercase `DESIGN.md`
 * in every directory of the repo — GitHub raw URLs are case-sensitive,
 * so a lowercase path returns 404. Verified across all 71 brands.
 */
export function getDesignMdUrl(slug: string): string {
  return `${RAW_BASE}/${slug}/DESIGN.md`;
}

export const designStyleBrands: DesignStyleBrand[] = [
  { slug: 'airbnb',     name: 'Airbnb',      iconSlug: 'airbnb',     color: 'FF5A5F' },
  { slug: 'airtable',   name: 'Airtable',    iconSlug: 'airtable',   color: 'FCB400' },
  { slug: 'apple',      name: 'Apple',       iconSlug: 'apple',      color: '000000' },
  { slug: 'binance',    name: 'Binance',     iconSlug: 'binance',    color: 'F0B90B' },
  { slug: 'bmw',        name: 'BMW',         iconSlug: 'bmw',        color: '0066B1' },
  { slug: 'bmw-m',      name: 'BMW M',       iconSlug: 'bmw',        color: '1C69D4' },
  { slug: 'bugatti',    name: 'Bugatti',     iconSlug: 'bugatti',    color: '1E2A78' },
  { slug: 'cal',        name: 'Cal.com',     iconSlug: 'caldotcom',  color: '111827' },
  { slug: 'claude',     name: 'Claude',      iconSlug: 'claude',     color: 'DA7756' },
  { slug: 'clay',       name: 'Clay',        iconSlug: null,         color: 'F4A261' },
  { slug: 'clickhouse', name: 'ClickHouse',  iconSlug: 'clickhouse', color: 'FCB200' },
  { slug: 'cohere',     name: 'Cohere',      iconSlug: 'cohere',     color: 'D27A9F' },
  { slug: 'coinbase',   name: 'Coinbase',    iconSlug: 'coinbase',   color: '0052FF' },
  { slug: 'composio',   name: 'Composio',    iconSlug: null,         color: '7C3AED' },
  { slug: 'cursor',     name: 'Cursor',      iconSlug: 'cursor',     color: '000000' },
  { slug: 'elevenlabs', name: 'ElevenLabs',  iconSlug: 'elevenlabs', color: 'B2E94B' },
  { slug: 'expo',       name: 'Expo',        iconSlug: 'expo',       color: '000020' },
  { slug: 'ferrari',    name: 'Ferrari',     iconSlug: 'ferrari',    color: 'DC0000' },
  { slug: 'figma',      name: 'Figma',       iconSlug: 'figma',      color: 'F24E1E' },
  { slug: 'framer',     name: 'Framer',      iconSlug: 'framer',     color: '0055FF' },
  { slug: 'hashicorp',  name: 'HashiCorp',   iconSlug: 'hashicorp',  color: '000000' },
  { slug: 'ibm',        name: 'IBM',         iconSlug: 'ibm',        color: '006699' },
  { slug: 'intercom',   name: 'Intercom',    iconSlug: 'intercom',   color: '1F8FFF' },
  { slug: 'kraken',     name: 'Kraken',      iconSlug: 'kraken',     color: '5741D9' },
  { slug: 'lamborghini', name: 'Lamborghini', iconSlug: 'lamborghini', color: '98C73E' },
  { slug: 'linear.app', name: 'Linear',      iconSlug: 'linear',     color: '5E6AD2' },
  { slug: 'lovable',    name: 'Lovable',     iconSlug: null,         color: 'FF8FB1' },
  { slug: 'mastercard', name: 'Mastercard',  iconSlug: 'mastercard', color: 'FF5F00' },
  { slug: 'meta',       name: 'Meta',        iconSlug: 'meta',       color: '0866FF' },
  { slug: 'minimax',    name: 'MiniMax',     iconSlug: null,         color: '1B9CFC' },
  { slug: 'mintlify',   name: 'Mintlify',    iconSlug: 'mintlify',   color: '15803D' },
  { slug: 'miro',       name: 'Miro',        iconSlug: 'miro',       color: 'F8C800' },
  { slug: 'mistral.ai', name: 'Mistral AI',  iconSlug: 'mistralai',  color: 'FA5300' },
  { slug: 'mongodb',    name: 'MongoDB',     iconSlug: 'mongodb',    color: '00ED64' },
  { slug: 'nike',       name: 'Nike',        iconSlug: 'nike',       color: '111111' },
  { slug: 'notion',     name: 'Notion',      iconSlug: 'notion',     color: '000000' },
  { slug: 'nvidia',     name: 'NVIDIA',      iconSlug: 'nvidia',     color: '76B900' },
  { slug: 'ollama',     name: 'Ollama',      iconSlug: 'ollama',     color: '000000' },
  { slug: 'opencode.ai', name: 'OpenCode',   iconSlug: null,         color: 'F97316' },
  { slug: 'pinterest',  name: 'Pinterest',   iconSlug: 'pinterest',  color: 'BD081C' },
  { slug: 'playstation', name: 'PlayStation', iconSlug: 'playstation', color: '003791' },
  { slug: 'posthog',    name: 'PostHog',     iconSlug: 'posthog',    color: 'F54E00' },
  { slug: 'raycast',    name: 'Raycast',     iconSlug: 'raycast',    color: 'FF6363' },
  { slug: 'renault',    name: 'Renault',     iconSlug: 'renault',    color: 'FFCD00' },
  { slug: 'replicate',  name: 'Replicate',   iconSlug: 'replicate',  color: '000000' },
  { slug: 'resend',     name: 'Resend',      iconSlug: 'resend',     color: '000000' },
  { slug: 'revolut',    name: 'Revolut',     iconSlug: 'revolut',    color: '0666EB' },
  { slug: 'runwayml',   name: 'Runway',      iconSlug: 'runway',     color: '000000' },
  { slug: 'sanity',     name: 'Sanity',      iconSlug: 'sanity',     color: 'F03E2F' },
  { slug: 'sentry',     name: 'Sentry',      iconSlug: 'sentry',     color: '362D59' },
  { slug: 'shopify',    name: 'Shopify',     iconSlug: 'shopify',    color: '95BF47' },
  { slug: 'slack',      name: 'Slack',       iconSlug: 'slack',      color: '4A154B' },
  { slug: 'spacex',     name: 'SpaceX',      iconSlug: 'spacex',     color: '000000' },
  { slug: 'spotify',    name: 'Spotify',     iconSlug: 'spotify',    color: '1DB954' },
  { slug: 'starbucks',  name: 'Starbucks',   iconSlug: 'starbucks',  color: '006241' },
  { slug: 'stripe',     name: 'Stripe',      iconSlug: 'stripe',     color: '635BFF' },
  { slug: 'supabase',   name: 'Supabase',    iconSlug: 'supabase',   color: '3ECF8E' },
  { slug: 'superhuman', name: 'Superhuman',  iconSlug: null,         color: '6366F1' },
  { slug: 'tesla',      name: 'Tesla',       iconSlug: 'tesla',      color: 'CC0000' },
  { slug: 'theverge',   name: 'The Verge',   iconSlug: null,         color: 'E5127D' },
  { slug: 'together.ai', name: 'Together AI', iconSlug: null,        color: '0F6FFF' },
  { slug: 'uber',       name: 'Uber',        iconSlug: 'uber',       color: '000000' },
  { slug: 'vercel',     name: 'Vercel',      iconSlug: 'vercel',     color: '000000' },
  { slug: 'vodafone',   name: 'Vodafone',    iconSlug: 'vodafone',   color: 'E60000' },
  { slug: 'voltagent',  name: 'VoltAgent',   iconSlug: null,         color: 'FACC15' },
  { slug: 'warp',       name: 'Warp',        iconSlug: 'warp',       color: 'FE5E5E' },
  { slug: 'webflow',    name: 'Webflow',     iconSlug: 'webflow',    color: '4353FF' },
  { slug: 'wired',      name: 'Wired',       iconSlug: 'wired',      color: '000000' },
  { slug: 'wise',       name: 'Wise',        iconSlug: 'wise',       color: '9FE870' },
  { slug: 'x.ai',       name: 'xAI',         iconSlug: null,         color: '000000' },
  { slug: 'zapier',     name: 'Zapier',      iconSlug: 'zapier',     color: 'FF4A00' },
];

/**
 * Compose the chat-input text when a brand card is clicked.
 * Empty composer → prefix + URL.
 * Existing content → existing + blank line + prefix + URL.
 */
export function composeDesignReference(
  existing: string,
  prefix: string,
  brand: DesignStyleBrand,
): string {
  const reference = `${prefix} ${getDesignMdUrl(brand.slug)}`;
  if (existing.trim() === '') return reference;
  return `${existing.trimEnd()}\n\n${reference}`;
}
