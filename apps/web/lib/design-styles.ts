/**
 * Catalog of brand design systems referenced from the
 * VoltAgent/awesome-design-md repo. Each entry is one DESIGN.md file
 * we can load into the chat composer.
 *
 * Logo source tiers (in priority order):
 *   1. `githubOrg`  — GitHub avatar at github.com/{org}.png (matches
 *                      the source getdesign.md itself uses).
 *   2. `iconSlug`   — Simple Icons CDN fallback for brands without a
 *                      GitHub org (auto, retail, media).
 *   3. Letter mark  — Brand initial on the colour swatch (last resort).
 *
 * `color` is the primary brand colour (hex without #) used for the
 * card's paint-chip gradient + hex-code badge.
 *
 * Source: https://github.com/VoltAgent/awesome-design-md/tree/main/design-md
 * + the GitHub-org mapping observed on https://getdesign.md/
 * (last synced 2026-05-23, 71 brands).
 */

export interface DesignStyleBrand {
  slug: string;
  name: string;
  /** GitHub org login (case-insensitive). Renders via github.com/{org}.png?size=240. */
  githubOrg: string | null;
  /** Simple Icons slug — used only when githubOrg is null. */
  iconSlug: string | null;
  /** Brand colour, hex without leading #. */
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
  { slug: 'airbnb',      name: 'Airbnb',       githubOrg: 'airbnb',           iconSlug: 'airbnb',       color: 'FF5A5F' },
  { slug: 'airtable',    name: 'Airtable',     githubOrg: 'Airtable',         iconSlug: 'airtable',     color: 'FCB400' },
  { slug: 'apple',       name: 'Apple',        githubOrg: 'apple',            iconSlug: 'apple',        color: '000000' },
  { slug: 'binance',     name: 'Binance',      githubOrg: null,               iconSlug: 'binance',      color: 'F0B90B' },
  { slug: 'bmw',         name: 'BMW',          githubOrg: null,               iconSlug: 'bmw',          color: '0066B1' },
  { slug: 'bmw-m',       name: 'BMW M',        githubOrg: null,               iconSlug: 'bmw',          color: '1C69D4' },
  { slug: 'bugatti',     name: 'Bugatti',      githubOrg: null,               iconSlug: 'bugatti',      color: '1E2A78' },
  { slug: 'cal',         name: 'Cal.com',      githubOrg: 'calcom',           iconSlug: 'caldotcom',    color: '111827' },
  { slug: 'claude',      name: 'Claude',       githubOrg: null,               iconSlug: 'claude',       color: 'DA7756' },
  { slug: 'clay',        name: 'Clay',         githubOrg: 'clay-run',         iconSlug: null,           color: 'F4A261' },
  { slug: 'clickhouse',  name: 'ClickHouse',   githubOrg: 'ClickHouse',       iconSlug: 'clickhouse',   color: 'FCB200' },
  { slug: 'cohere',      name: 'Cohere',       githubOrg: 'cohere-ai',        iconSlug: 'cohere',       color: 'D27A9F' },
  { slug: 'coinbase',    name: 'Coinbase',     githubOrg: 'coinbase',         iconSlug: 'coinbase',     color: '0052FF' },
  { slug: 'composio',    name: 'Composio',     githubOrg: 'ComposioHQ',       iconSlug: null,           color: '7C3AED' },
  { slug: 'cursor',      name: 'Cursor',       githubOrg: null,               iconSlug: 'cursor',       color: '000000' },
  { slug: 'elevenlabs',  name: 'ElevenLabs',   githubOrg: 'elevenlabs',       iconSlug: 'elevenlabs',   color: 'B2E94B' },
  { slug: 'expo',        name: 'Expo',         githubOrg: 'expo',             iconSlug: 'expo',         color: '000020' },
  { slug: 'ferrari',     name: 'Ferrari',      githubOrg: null,               iconSlug: 'ferrari',      color: 'DC0000' },
  { slug: 'figma',       name: 'Figma',        githubOrg: 'figma',            iconSlug: 'figma',        color: 'F24E1E' },
  { slug: 'framer',      name: 'Framer',       githubOrg: 'framer',           iconSlug: 'framer',       color: '0055FF' },
  { slug: 'hashicorp',   name: 'HashiCorp',    githubOrg: 'hashicorp',        iconSlug: 'hashicorp',    color: '000000' },
  { slug: 'ibm',         name: 'IBM',          githubOrg: 'ibm',              iconSlug: 'ibm',          color: '006699' },
  { slug: 'intercom',    name: 'Intercom',     githubOrg: 'intercom',         iconSlug: 'intercom',     color: '1F8FFF' },
  { slug: 'kraken',      name: 'Kraken',       githubOrg: 'krakenfx',         iconSlug: null,           color: '5741D9' },
  { slug: 'lamborghini', name: 'Lamborghini',  githubOrg: null,               iconSlug: 'lamborghini',  color: '98C73E' },
  { slug: 'linear.app',  name: 'Linear',       githubOrg: 'linear',           iconSlug: 'linear',       color: '5E6AD2' },
  { slug: 'lovable',     name: 'Lovable',      githubOrg: 'lovablelabs',      iconSlug: null,           color: 'FF8FB1' },
  { slug: 'mastercard',  name: 'Mastercard',   githubOrg: 'mastercard',       iconSlug: 'mastercard',   color: 'FF5F00' },
  { slug: 'meta',        name: 'Meta',         githubOrg: null,               iconSlug: 'meta',         color: '0866FF' },
  { slug: 'minimax',     name: 'MiniMax',      githubOrg: 'MiniMax-AI',       iconSlug: null,           color: '1B9CFC' },
  { slug: 'mintlify',    name: 'Mintlify',     githubOrg: 'mintlify',         iconSlug: 'mintlify',     color: '15803D' },
  { slug: 'miro',        name: 'Miro',         githubOrg: 'miroapp',          iconSlug: 'miro',         color: 'F8C800' },
  { slug: 'mistral.ai',  name: 'Mistral AI',   githubOrg: 'mistralai',        iconSlug: 'mistralai',    color: 'FA5300' },
  { slug: 'mongodb',     name: 'MongoDB',      githubOrg: 'mongodb',          iconSlug: 'mongodb',      color: '00ED64' },
  { slug: 'nike',        name: 'Nike',         githubOrg: null,               iconSlug: 'nike',         color: '111111' },
  { slug: 'notion',      name: 'Notion',       githubOrg: 'makenotion',       iconSlug: 'notion',       color: '000000' },
  { slug: 'nvidia',      name: 'NVIDIA',       githubOrg: 'NVIDIA',           iconSlug: 'nvidia',       color: '76B900' },
  { slug: 'ollama',      name: 'Ollama',       githubOrg: 'ollama',           iconSlug: 'ollama',       color: '000000' },
  { slug: 'opencode.ai', name: 'OpenCode',     githubOrg: 'opencode-ai',      iconSlug: null,           color: 'F97316' },
  { slug: 'pinterest',   name: 'Pinterest',    githubOrg: 'pinterest',        iconSlug: 'pinterest',    color: 'BD081C' },
  { slug: 'playstation', name: 'PlayStation',  githubOrg: null,               iconSlug: 'playstation',  color: '003791' },
  { slug: 'posthog',     name: 'PostHog',      githubOrg: 'PostHog',          iconSlug: 'posthog',      color: 'F54E00' },
  { slug: 'raycast',     name: 'Raycast',      githubOrg: 'raycast',          iconSlug: 'raycast',      color: 'FF6363' },
  { slug: 'renault',     name: 'Renault',      githubOrg: 'renault',          iconSlug: 'renault',      color: 'FFCD00' },
  { slug: 'replicate',   name: 'Replicate',    githubOrg: 'replicate',        iconSlug: 'replicate',    color: '000000' },
  { slug: 'resend',      name: 'Resend',       githubOrg: 'resend',           iconSlug: 'resend',       color: '000000' },
  { slug: 'revolut',     name: 'Revolut',      githubOrg: null,               iconSlug: 'revolut',      color: '0666EB' },
  { slug: 'runwayml',    name: 'Runway',       githubOrg: 'runwayml',         iconSlug: 'runway',       color: '000000' },
  { slug: 'sanity',      name: 'Sanity',       githubOrg: 'sanity-io',        iconSlug: 'sanity',       color: 'F03E2F' },
  { slug: 'sentry',      name: 'Sentry',       githubOrg: 'getsentry',        iconSlug: 'sentry',       color: '362D59' },
  { slug: 'shopify',     name: 'Shopify',      githubOrg: 'Shopify',          iconSlug: 'shopify',      color: '95BF47' },
  { slug: 'slack',       name: 'Slack',        githubOrg: 'slackhq',          iconSlug: null,           color: '4A154B' },
  { slug: 'spacex',      name: 'SpaceX',       githubOrg: null,               iconSlug: 'spacex',       color: '000000' },
  { slug: 'spotify',     name: 'Spotify',      githubOrg: 'spotify',          iconSlug: 'spotify',      color: '1DB954' },
  { slug: 'starbucks',   name: 'Starbucks',    githubOrg: 'starbucks',        iconSlug: 'starbucks',    color: '006241' },
  { slug: 'stripe',      name: 'Stripe',       githubOrg: 'stripe',           iconSlug: 'stripe',       color: '635BFF' },
  { slug: 'supabase',    name: 'Supabase',     githubOrg: 'supabase',         iconSlug: 'supabase',     color: '3ECF8E' },
  { slug: 'superhuman',  name: 'Superhuman',   githubOrg: 'superhuman',       iconSlug: null,           color: '6366F1' },
  { slug: 'tesla',       name: 'Tesla',        githubOrg: null,               iconSlug: 'tesla',        color: 'CC0000' },
  { slug: 'theverge',    name: 'The Verge',    githubOrg: null,               iconSlug: null,           color: 'E5127D' },
  { slug: 'together.ai', name: 'Together AI',  githubOrg: 'togethercomputer', iconSlug: null,           color: '0F6FFF' },
  { slug: 'uber',        name: 'Uber',         githubOrg: 'uber',             iconSlug: 'uber',         color: '000000' },
  { slug: 'vercel',      name: 'Vercel',       githubOrg: 'vercel',           iconSlug: 'vercel',       color: '000000' },
  { slug: 'vodafone',    name: 'Vodafone',     githubOrg: 'vodafone',         iconSlug: 'vodafone',     color: 'E60000' },
  { slug: 'voltagent',   name: 'VoltAgent',    githubOrg: 'VoltAgent',        iconSlug: null,           color: 'FACC15' },
  { slug: 'warp',        name: 'Warp',         githubOrg: 'warpdotdev',       iconSlug: 'warp',         color: 'FE5E5E' },
  { slug: 'webflow',     name: 'Webflow',      githubOrg: 'webflow',          iconSlug: 'webflow',      color: '4353FF' },
  { slug: 'wired',       name: 'Wired',        githubOrg: null,               iconSlug: null,           color: '000000' },
  { slug: 'wise',        name: 'Wise',         githubOrg: null,               iconSlug: 'wise',         color: '9FE870' },
  { slug: 'x.ai',        name: 'xAI',          githubOrg: 'xai-org',          iconSlug: null,           color: '000000' },
  { slug: 'zapier',      name: 'Zapier',       githubOrg: 'zapier',           iconSlug: 'zapier',       color: 'FF4A00' },
];

/**
 * Logo URL resolver — preferred ladder:
 *   1. GitHub avatar (256px) — used by getdesign.md itself.
 *   2. Simple Icons CDN with the brand colour as the SVG fill.
 *   3. Returns null — caller draws a letter monogram on the swatch.
 *
 * The `?size=256` GitHub query asks the avatar service for a
 * larger render so the logo stays crisp at the card's display
 * size (~96 CSS px on retina).
 */
export function getBrandLogoUrl(brand: DesignStyleBrand): string | null {
  if (brand.githubOrg) {
    return `https://github.com/${brand.githubOrg}.png?size=256`;
  }
  if (brand.iconSlug) {
    return `https://cdn.simpleicons.org/${brand.iconSlug}/ffffff`;
  }
  return null;
}

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
