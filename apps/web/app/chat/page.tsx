'use client';

import { useState, useRef, useEffect } from 'react';

interface Turn {
  id: string;
  question: string;
  answer: string;
  status: 'streaming' | 'done' | 'error';
  events: string[];
}

export default function ChatPage() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns]);

  async function send() {
    const question = input.trim();
    if (!question || pending) return;
    setInput('');
    setPending(true);

    const turnId = crypto.randomUUID();
    setTurns((prev) => [
      ...prev,
      { id: turnId, question, answer: '', status: 'streaming', events: [] },
    ]);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Agent request failed: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const records = buf.split('\n\n');
        buf = records.pop() ?? '';
        for (const record of records) {
          if (!record.trim()) continue;
          handleSseRecord(turnId, record);
        }
      }
      setTurns((prev) =>
        prev.map((t) => (t.id === turnId ? { ...t, status: 'done' } : t)),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setTurns((prev) =>
        prev.map((t) =>
          t.id === turnId ? { ...t, status: 'error', answer: msg } : t,
        ),
      );
    } finally {
      setPending(false);
    }
  }

  function handleSseRecord(turnId: string, record: string) {
    const lines = record.split('\n');
    let eventType = 'message';
    let data = '';
    for (const line of lines) {
      if (line.startsWith('event:')) eventType = line.slice(6).trim();
      else if (line.startsWith('data:')) data += line.slice(5).trim();
    }
    if (!data) return;
    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(data);
    } catch {
      payload = { raw: data };
    }
    setTurns((prev) =>
      prev.map((t) => {
        if (t.id !== turnId) return t;
        if (eventType === 'done' && typeof payload.answer === 'string') {
          return { ...t, answer: payload.answer, status: 'done' };
        }
        return { ...t, events: [...t.events, `${eventType}: ${data.slice(0, 80)}`] };
      }),
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid #27272a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <strong>Dexter</strong>
        <span style={{ color: '#a1a1aa', fontSize: 13 }}>chat preview</span>
      </header>

      <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {turns.length === 0 && (
            <p style={{ color: '#71717a' }}>
              Ask Dexter a financial question. Streaming agent runs land here.
            </p>
          )}
          {turns.map((t) => (
            <article
              key={t.id}
              style={{
                marginBottom: 32,
                padding: 16,
                background: '#18181b',
                borderRadius: 12,
                border: '1px solid #27272a',
              }}
            >
              <p style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 4 }}>You</p>
              <p style={{ margin: 0 }}>{t.question}</p>
              <hr style={{ border: 'none', borderTop: '1px solid #27272a', margin: '12px 0' }} />
              <p style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 4 }}>
                Dexter {t.status === 'streaming' && '…thinking'}
              </p>
              {t.answer && <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{t.answer}</p>}
              {t.events.length > 0 && (
                <details style={{ marginTop: 12 }}>
                  <summary style={{ color: '#71717a', fontSize: 12 }}>
                    {t.events.length} agent events
                  </summary>
                  <pre style={{ fontSize: 11, color: '#a1a1aa', overflow: 'auto' }}>
                    {t.events.join('\n')}
                  </pre>
                </details>
              )}
            </article>
          ))}
        </div>
      </div>

      <footer style={{ padding: 16, borderTop: '1px solid #27272a' }}>
        <form
          style={{ maxWidth: 720, margin: '0 auto', display: 'flex', gap: 8 }}
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Dexter…"
            disabled={pending}
            style={{
              flex: 1,
              background: '#18181b',
              color: '#fafafa',
              border: '1px solid #27272a',
              padding: '12px 16px',
              borderRadius: 8,
              fontSize: 15,
            }}
          />
          <button
            type="submit"
            disabled={pending || !input.trim()}
            style={{
              background: pending ? '#3f3f46' : '#fafafa',
              color: pending ? '#a1a1aa' : '#09090b',
              padding: '12px 20px',
              borderRadius: 8,
              border: 'none',
              fontWeight: 600,
              cursor: pending ? 'not-allowed' : 'pointer',
            }}
          >
            {pending ? 'Working…' : 'Send'}
          </button>
        </form>
      </footer>
    </div>
  );
}
