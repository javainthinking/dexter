import { describe, expect, test } from 'bun:test';
import { getChatModel } from './llm.js';

describe('OpenAI API routing', () => {
  test('uses the Responses API for the GPT-6 and GPT-5.6 families', () => {
    const previousApiKey = process.env.MEMORYLAKE_API_KEY;
    process.env.MEMORYLAKE_API_KEY = 'test-key';

    try {
      for (const model of ['gpt-6-astra', 'gpt-6-sol', 'gpt-6-luna', 'gpt-5.6-sol']) {
        const llm = getChatModel(model) as { useResponsesApi?: boolean };
        expect(llm.useResponsesApi).toBe(true);
      }
      // The default model keeps Chat Completions.
      const fallback = getChatModel('gpt-5.5') as { useResponsesApi?: boolean };
      expect(fallback.useResponsesApi).toBe(false);
    } finally {
      if (previousApiKey === undefined) {
        delete process.env.MEMORYLAKE_API_KEY;
      } else {
        process.env.MEMORYLAKE_API_KEY = previousApiKey;
      }
    }
  });
});
