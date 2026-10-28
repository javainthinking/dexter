import { describe, expect, it } from 'bun:test';
import { Agent } from './agent.js';

const CLI_ONLY = ['bash', 'ask_user_question'];

async function boundToolNames(config: Parameters<typeof Agent.create>[0]): Promise<string[]> {
  const agent = await Agent.create({ disableMemory: true, ...config });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return [...(agent as any).toolMap.keys()];
}

async function systemPrompt(config: Parameters<typeof Agent.create>[0]): Promise<string> {
  const agent = await Agent.create({ disableMemory: true, ...config });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (agent as any).systemPrompt;
}

describe('CLI-only tool gating', () => {
  it('never binds the shell or interactive tools without an explicit CLI channel', async () => {
    // The web API and desktop create agents with no channel at all.
    for (const config of [{}, { channel: 'whatsapp' }, { channel: 'eval' }]) {
      const names = await boundToolNames(config);
      for (const tool of CLI_ONLY) {
        expect(names).not.toContain(tool);
      }
      const prompt = await systemPrompt(config);
      for (const tool of CLI_ONLY) {
        expect(prompt).not.toContain(`**${tool}**`);
      }
    }
  });

  it('binds the interactive tools on the CLI channel', async () => {
    const names = await boundToolNames({ channel: 'cli' });
    expect(names).toContain('ask_user_question');
    if (process.platform !== 'win32') {
      expect(names).toContain('bash');
    }
  });
});
