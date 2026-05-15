/**
 * SecretsVault — resolves API keys / credentials at runtime.
 *
 * Adapters:
 *   - adapters/secrets/env-file       (CLI / Worker — reads process.env via dotenv)
 *   - adapters/secrets/db-encrypted   (Web SaaS — pulls per-org encrypted secrets from Postgres)
 *
 * Core never reads `process.env` directly. Everything goes through this port.
 */

export type SecretName =
  | 'OPENAI_API_KEY'
  | 'ANTHROPIC_API_KEY'
  | 'GOOGLE_API_KEY'
  | 'OLLAMA_BASE_URL'
  | 'FINANCIAL_DATASETS_API_KEY'
  | 'EXA_API_KEY'
  | 'TAVILY_API_KEY'
  | 'LANGSMITH_API_KEY'
  | 'LANGSMITH_TRACING'
  | 'LANGSMITH_PROJECT'
  | (string & {}); // allow ad-hoc names without losing autocomplete

export interface SecretsVault {
  get(name: SecretName): Promise<string | undefined>;
  /** Convenience: throw if missing. */
  require(name: SecretName): Promise<string>;
  /** Bulk fetch for the agent runner / providers init path. */
  getMany(names: SecretName[]): Promise<Record<string, string | undefined>>;
}
