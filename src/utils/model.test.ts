import { describe, expect, test } from 'bun:test';
import { getProviderById } from '../providers.js';
import {
  getDefaultModelForProvider,
  getModelDisplayName,
  getModelIdsForProvider,
} from './model.js';

describe('LLM router catalog', () => {
  test('offers router-hosted models under the catch-all provider', () => {
    expect(getModelIdsForProvider('openai')).toEqual(['qwen3.8-max', 'glm-5.3']);
  });

  test('defaults DeepSeek to V4 Pro with V4.1 Flash for lightweight calls', () => {
    expect(getModelIdsForProvider('deepseek')).toEqual(['deepseek-v4-pro', 'deepseek-v4.1-flash']);
    expect(getDefaultModelForProvider('deepseek')).toBe('deepseek-v4-pro');
    expect(getProviderById('deepseek')?.fastModel).toBe('deepseek-v4.1-flash');
    expect(getProviderById('openai')?.fastModel).toBe('deepseek-v4.1-flash');
  });

  test('shows the DeepSeek model names in the UI', () => {
    expect(getModelDisplayName('deepseek-v4-pro')).toBe('DeepSeek V4 Pro');
    expect(getModelDisplayName('deepseek-v4.1-flash')).toBe('DeepSeek V4.1 Flash');
  });
});

describe('Anthropic model catalog', () => {
  test('offers the current Claude family with Sonnet as the default', () => {
    expect(getModelIdsForProvider('anthropic')).toEqual([
      'claude-sonnet-5',
      'claude-opus-5-5',
      'claude-fable-5-1',
    ]);
    expect(getDefaultModelForProvider('anthropic')).toBe('claude-sonnet-5');
  });

  test('shows the Claude model names in the UI', () => {
    expect(getModelDisplayName('claude-sonnet-5')).toBe('Sonnet 5');
    expect(getModelDisplayName('claude-opus-5-5')).toBe('Opus 5.5');
    expect(getModelDisplayName('claude-fable-5-1')).toBe('Fable 5.1');
  });
});

describe('upstream router is never named to users', () => {
  test('scrubs the router host and brand derived from LLM_ROUTER_BASE_URL', async () => {
    const prev = process.env.LLM_ROUTER_BASE_URL;
    process.env.LLM_ROUTER_BASE_URL = 'https://app.acmerouter.cn/openapi/acmerouter/router/openai/v1';
    try {
      const { scrubUpstreamText } = await import('../providers.js');
      const { formatUserFacingError } = await import('./errors.js');
      const raw =
        '404 model not found at https://app.acmerouter.cn/openapi/acmerouter/router/openai/v1 (Acme Router balance low)';
      for (const out of [scrubUpstreamText(raw), formatUserFacingError(raw, 'DeepSeek')]) {
        expect(out.toLowerCase()).not.toContain('acmerouter');
        expect(out.toLowerCase()).not.toContain('acme router');
      }
    } finally {
      if (prev === undefined) delete process.env.LLM_ROUTER_BASE_URL;
      else process.env.LLM_ROUTER_BASE_URL = prev;
    }
  });

  test('provider display names do not mention a vendor router', () => {
    expect(getProviderById('openai')?.displayName).toBe('Qwen / GLM');
    expect(getProviderById('deepseek')?.displayName).toBe('DeepSeek');
  });
});
