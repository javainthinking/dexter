// Stand-in for the pickskill.ai LLM gateway (OpenAI-compatible chat completions).
// Turn 1: asks for get_stock_price(NVDA). Turn 2 (after a tool result): answers.
// Records every request so the spike can assert on system prompt + exposed tools.
import http from 'node:http';

export function startMockGateway({ token }) {
  const requests = [];
  const server = http.createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    if (req.headers.authorization !== `Bearer ${token}`) {
      res.writeHead(401).end(JSON.stringify({ error: 'unauthenticated' }));
      return;
    }
    if (!req.url.endsWith('/chat/completions')) {
      res.writeHead(404).end();
      return;
    }
    const json = JSON.parse(body);
    requests.push(json);
    const toolMsg = json.messages.findLast((m) => m.role === 'tool');
    res.writeHead(200, { 'content-type': 'text/event-stream' });
    const send = (delta, finish = null) =>
      res.write(
        `data: ${JSON.stringify({
          id: 'mock',
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: json.model,
          choices: [{ index: 0, delta, finish_reason: finish }],
        })}\n\n`,
      );
    if (!toolMsg) {
      send({
        role: 'assistant',
        tool_calls: [
          {
            index: 0,
            id: 'call_1',
            type: 'function',
            function: { name: 'get_stock_price', arguments: JSON.stringify({ ticker: 'NVDA' }) },
          },
        ],
      });
      send({}, 'tool_calls');
    } else {
      const content = typeof toolMsg.content === 'string' ? toolMsg.content : JSON.stringify(toolMsg.content);
      send({ role: 'assistant', content: `NVDA snapshot from tool: ${content}` });
      send({}, 'stop');
    }
    res.write(
      `data: ${JSON.stringify({ id: 'mock', object: 'chat.completion.chunk', choices: [], usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 } })}\n\n`,
    );
    res.end('data: [DONE]\n\n');
  });
  return new Promise((resolve) =>
    server.listen(0, '127.0.0.1', () => resolve({ server, requests, port: server.address().port })),
  );
}
