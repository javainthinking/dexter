/**
 * Round-trip serialization for the agent's BaseMessage[] across chunk
 * boundaries.
 *
 * The agent's working conversation includes:
 *   - SystemMessage (full system prompt)
 *   - HumanMessage (user turns + nudges)
 *   - AIMessage with reasoning blocks (Anthropic) — the `signature` field
 *     on each reasoning block is HMAC-signed by Anthropic and MUST
 *     round-trip byte-exact or the next API call rejects with a
 *     reasoning signature mismatch error.
 *   - ToolMessage with tool_call_id + name + content
 *
 * LangChain's `mapChatMessagesToStoredMessages` / `mapStoredMessagesToChatMessages`
 * pair is specifically built for this: every BaseMessage subclass implements
 * `toDict()` returning a typed StoredMessage envelope, and the reviving
 * helper reconstructs the right subclass with all properties (including
 * additional_kwargs and tool_call_id) intact. We layer a tiny wrapper on
 * top so the rest of the codebase doesn't have to import LangChain
 * internals.
 */

import type { BaseMessage } from '@langchain/core/messages';
import {
  mapChatMessagesToStoredMessages,
  mapStoredMessagesToChatMessages,
} from '@langchain/core/messages';

/** Serialize an array of messages to a JSON-safe value for jsonb storage. */
export function serializeMessages(messages: BaseMessage[]): unknown {
  return mapChatMessagesToStoredMessages(messages);
}

/**
 * Deserialize a previously-stored jsonb back into BaseMessage instances.
 * Throws if the input isn't an array, since the agent loop can't proceed
 * with a malformed message list.
 */
export function deserializeMessages(stored: unknown): BaseMessage[] {
  if (!Array.isArray(stored)) {
    throw new Error(
      `deserializeMessages: expected an array of stored messages, got ${typeof stored}`,
    );
  }
  return mapStoredMessagesToChatMessages(
    stored as Parameters<typeof mapStoredMessagesToChatMessages>[0],
  );
}
