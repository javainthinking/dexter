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
 * Router-hosted models are served through the MemoryLake (memorylake.cn) Model
 * Router. That covers DeepSeek (the default: deepseek-v4-pro, fast model
 * deepseek-v4.1-flash) and any unprefixed id such as qwen3.8-max or glm-5.3.
 * The router account has no GPT models. It is reached — an OpenAI-compatible endpoint
 * keyed by MEMORYLAKE_LLM_API_KEY. This key is separate from MEMORYLAKE_API_KEY,
 * which stays the memory-backend key (MEMORYLAKE_BASE_URL). Used by the agent
 * (src/model/llm.ts), the desktop app's LLM gateway (apps/web/app/api/desktop/llm)
 * and the stock-page narratives (apps/web/lib/stocks/narrative.ts).
 * Docs: https://docs.memorylake.cn/features/memory-router/quickstart
 */
export const MEMORYLAKE_LLM_BASE_URL = 'https://app.memorylake.cn/openapi/memorylake/router/openai/v1';
export const MEMORYLAKE_LLM_API_KEY_ENV = 'MEMORYLAKE_LLM_API_KEY';

export const PROVIDERS: ProviderDef[] = [
  {
    // Kept as id 'openai' so saved settings keep resolving; it is the unprefixed
    // catch-all for MemoryLake router models (qwen*, glm*, …).
    id: 'openai',
    displayName: 'MemoryLake Router',
    modelPrefix: '',
    apiKeyEnvVar: 'MEMORYLAKE_LLM_API_KEY',
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
    // Served through the MemoryLake router (see MEMORYLAKE_LLM_BASE_URL).
    id: 'deepseek',
    displayName: 'DeepSeek (MemoryLake)',
    modelPrefix: 'deepseek-',
    apiKeyEnvVar: 'MEMORYLAKE_LLM_API_KEY',
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
 * Falls back to the MemoryLake router catch-all when no prefix matches.
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
