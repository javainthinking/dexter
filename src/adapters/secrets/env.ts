/**
 * EnvSecretsVault — reads secrets from process.env.
 *
 * Used by CLI and the WhatsApp Worker (which dotenv-loads .env at startup).
 * Web SaaS swaps this for a Postgres-backed adapter that decrypts per-org
 * credentials at request time.
 */

import type { SecretsVault, SecretName } from '../../ports/secrets.js';

export class EnvSecretsVault implements SecretsVault {
  async get(name: SecretName): Promise<string | undefined> {
    const value = process.env[name];
    return value && value.length > 0 ? value : undefined;
  }

  async require(name: SecretName): Promise<string> {
    const value = await this.get(name);
    if (!value) {
      throw new Error(`Missing required secret: ${name}`);
    }
    return value;
  }

  async getMany(names: SecretName[]): Promise<Record<string, string | undefined>> {
    const out: Record<string, string | undefined> = {};
    for (const name of names) {
      out[name] = await this.get(name);
    }
    return out;
  }
}
