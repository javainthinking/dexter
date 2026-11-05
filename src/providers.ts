/**
 * Canonical provider registry — single source of truth for all provider metadata.
 * When adding a new provider, add a single entry here; all other modules derive from this.
 */

export interface ProviderDef {
  /** Slug used in config/settings (e.g., 'anthropic') */
  id: string;
  /** Human-readable name (e.g., 'Anthropic') */
  displayName: string;
  /** Model name prefix used for routing (e.g., 'claude-'). Empty string for default (OpenAI). */
  modelPrefix: string;
  /** Environment variable name for API key. Omit for local providers (e.g., Ollama). */
  apiKeyEnvVar?: string;
  /** Fast model variant for lightweight tasks like summarization. */
  fastModel?: string;
  /** Default context window size in tokens. Used for model-aware compaction thresholds. */
  contextWindow?: number;
}

/**
 * Router-hosted models (DeepSeek by default: deepseek-v4-pro, fast model
 * deepseek-v4.1-flash, plus unprefixed ids such as qwen3.8-max or glm-5.3) are
 * served through an OpenAI-compatible LLM router. Its endpoint and key come
 * from the environment so the vendor is never hard-coded:
 *   LLM_ROUTER_BASE_URL  e.g. https://<router-host>/.../openai/v1
 *   LLM_ROUTER_API_KEY
 * Used by the agent (src/model/llm.ts), the desktop app's LLM gateway
 * (apps/web/app/api/desktop/llm) and the stock-page narratives
 * (apps/web/lib/stocks/narrative.ts).
 */
export const LLM_ROUTER_BASE_URL_ENV = 'LLM_ROUTER_BASE_URL';
export const LLM_ROUTER_API_KEY_ENV = 'LLM_ROUTER_API_KEY';

export function getLlmRouterBaseUrl(): string {
  const url = process.env[LLM_ROUTER_BASE_URL_ENV]?.trim();
  if (!url) throw new Error(`[LLM] ${LLM_ROUTER_BASE_URL_ENV} not found in environment variables`);
  return url.replace(/\/+$/, '');
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Strip the LLM router's identity (its host and brand name, both derived from
 * LLM_ROUTER_BASE_URL) from text that may reach end users, such as upstream
 * error messages. The router is an internal vendor and must not be named in
 * the product.
 */
export function scrubUpstreamText(text: string): string {
  const raw = process.env[LLM_ROUTER_BASE_URL_ENV]?.trim();
  if (!raw) return text;
  let host: string;
  try {
    host = new URL(raw).hostname.toLowerCase();
  } catch {
    return text;
  }
  const labels = host.split('.');
  // Brand = the label before the public suffix (app.<brand>.cn → <brand>).
  const brand = labels.length >= 2 ? labels[labels.length - 2] : labels[0];
  let out = text.replace(
    new RegExp(`https?://[^\\s"'<>)]*${escapeRegExp(host)}[^\\s"'<>)]*`, 'gi'),
    'the model provider',
  );
  if (brand && brand.length >= 4) {
    // Also match spaced/hyphenated spellings ("Brand Name", "brand-name").
    const loose = brand.split('').map(escapeRegExp).join('[\\s_-]*');
    out = out.replace(new RegExp(loose, 'gi'), 'model provider');
  }
  return out;
}

export const PROVIDERS: ProviderDef[] = [
  {
    // Kept as id 'openai' so saved settings keep resolving; it is the unprefixed
    // catch-all for LLM router models (qwen*, glm*, …).
    id: 'openai',
    displayName: 'Qwen / GLM',
    modelPrefix: '',
    apiKeyEnvVar: 'LLM_ROUTER_API_KEY',
    fastModel: 'deepseek-v4.1-flash',
    contextWindow: 256_000,
  },
  {
    id: 'anthropic',
    displayName: 'Anthropic',
    modelPrefix: 'claude-',
    apiKeyEnvVar: 'ANTHROPIC_API_KEY',
    fastModel: 'claude-haiku-4-5',
    contextWindow: 1_000_000,
  },
  {
    id: 'google',
    displayName: 'Google',
    modelPrefix: 'gemini-',
    apiKeyEnvVar: 'GOOGLE_API_KEY',
    fastModel: 'gemini-3.8-flash',
    contextWindow: 1_000_000,
  },
  {
    id: 'xai',
    displayName: 'xAI',
    modelPrefix: 'grok-',
    apiKeyEnvVar: 'XAI_API_KEY',
    fastModel: 'grok-4.7',
    contextWindow: 500_000,
  },
  {
    id: 'moonshot',
    displayName: 'Moonshot',
    modelPrefix: 'kimi-',
    apiKeyEnvVar: 'MOONSHOT_API_KEY',
    fastModel: 'kimi-k3',
    contextWindow: 1_000_000,
  },
  {
    // Served through the LLM router (see LLM_ROUTER_BASE_URL).
    id: 'deepseek',
    displayName: 'DeepSeek',
    modelPrefix: 'deepseek-',
    apiKeyEnvVar: 'LLM_ROUTER_API_KEY',
    fastModel: 'deepseek-v4.1-flash',
    contextWindow: 1_000_000,
  },
  {
    id: 'openrouter',
    displayName: 'OpenRouter',
    modelPrefix: 'openrouter:',
    apiKeyEnvVar: 'OPENROUTER_API_KEY',
    fastModel: 'openrouter:openai/gpt-4o-mini',
    contextWindow: 128_000,
  },
  {
    id: 'ollama',
    displayName: 'Ollama',
    modelPrefix: 'ollama:',
    contextWindow: 128_000,
  },
  {
    id: 'ollama-cloud',
    displayName: 'Ollama Cloud',
    modelPrefix: 'ollama-cloud:',
    apiKeyEnvVar: 'OLLAMA_CLOUD_API_KEY',
    contextWindow: 128_000,
  },
];

const defaultProvider = PROVIDERS.find((p) => p.id === 'openai')!;

/**
 * Resolve the provider for a given model name based on its prefix.
 * Falls back to the LLM router catch-all when no prefix matches.
 */
export function resolveProvider(modelName: string): ProviderDef {
  return (
    PROVIDERS.find((p) => p.modelPrefix && modelName.startsWith(p.modelPrefix)) ??
    defaultProvider
  );
}

/**
 * Look up a provider by its slug (e.g., 'anthropic', 'google').
 */
export function getProviderById(id: string): ProviderDef | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
