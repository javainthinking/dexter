import { describe, expect, it } from 'bun:test';
import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';
import { serializeMessages, deserializeMessages } from './serialization.js';

describe('agent message serialization', () => {
  it('round-trips System/Human/AI/Tool with tool_calls and reasoning content', () => {
    // A realistic agent.run() messages snapshot at the moment a chunk
    // hits the time-budget gate. Includes the four kinds the agent
    // ever produces, and an Anthropic-style reasoning content block on
    // the AIMessage so we know the `signature` field survives.
    const messages = [
      new SystemMessage('You are Dexter. ... [omitted for brevity]'),
      new HumanMessage('make me a TSMC deck'),
      new AIMessage({
        content: [
          {
            type: 'thinking',
            thinking: 'Let me plan the deck...',
            signature: 'EubBCkYIBxgCKkAR0pVTOnMlxQ==',
          },
          { type: 'text', text: "I'll start with office_edit create." },
        ],
        tool_calls: [
          {
            id: 'toolu_01ABC',
            name: 'office_edit',
            args: { subcommand: 'create', file: '/tmp/tsmc.pptx', args: [] },
          },
        ],
      }),
      new ToolMessage({
        content: JSON.stringify({ _required: { status: 'BLANK FILE CREATED' }, data: { ok: true } }),
        tool_call_id: 'toolu_01ABC',
        name: 'office_edit',
      }),
    ];

    const stored = serializeMessages(messages);
    const json = JSON.parse(JSON.stringify(stored));
    const revived = deserializeMessages(json);

    expect(revived).toHaveLength(messages.length);
    expect(revived[0]).toBeInstanceOf(SystemMessage);
    expect(revived[1]).toBeInstanceOf(HumanMessage);
    expect(revived[2]).toBeInstanceOf(AIMessage);
    expect(revived[3]).toBeInstanceOf(ToolMessage);

    const aiContent = (revived[2] as AIMessage).content as unknown[];
    expect(Array.isArray(aiContent)).toBe(true);
    const thinkingBlock = (aiContent as Array<Record<string, unknown>>).find(
      (b) => b?.type === 'thinking',
    );
    expect(thinkingBlock).toBeDefined();
    expect(thinkingBlock!.signature).toBe('EubBCkYIBxgCKkAR0pVTOnMlxQ==');
    expect(thinkingBlock!.thinking).toBe('Let me plan the deck...');

    const tm = revived[3] as ToolMessage;
    expect(tm.tool_call_id).toBe('toolu_01ABC');
    expect(tm.name).toBe('office_edit');

    const ai = revived[2] as AIMessage;
    expect(ai.tool_calls).toBeDefined();
    expect(ai.tool_calls!.length).toBe(1);
    expect(ai.tool_calls![0].id).toBe('toolu_01ABC');
    expect(ai.tool_calls![0].name).toBe('office_edit');
  });

  it('throws on non-array input', () => {
    expect(() => deserializeMessages({ not: 'an array' })).toThrow();
    expect(() => deserializeMessages(null)).toThrow();
  });

  it('handles an empty array', () => {
    expect(deserializeMessages(serializeMessages([]))).toEqual([]);
  });
});
