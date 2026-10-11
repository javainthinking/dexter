import { useEffect, useRef, useState } from 'react';
import type { AccountState, AgentEvent } from '../../shared/ipc';

type View = 'portfolios' | 'analyst';

export function App() {
  const [account, setAccount] = useState<AccountState | null>(null);
  const [view, setView] = useState<View>('portfolios');

  useEffect(() => {
    void window.pickskill.account.get().then(setAccount);
    return window.pickskill.account.onChange(setAccount);
  }, []);

  if (!account) return null;
  if (account.status !== 'signed-in') return <SignIn account={account} />;

  return (
    <div className="shell">
      <nav className="nav">
        <div className="drag" />
        <a className={view === 'portfolios' ? 'active' : ''} onClick={() => setView('portfolios')}>Portfolios</a>
        <a className={view === 'analyst' ? 'active' : ''} onClick={() => setView('analyst')}>Analyst</a>
        <div className="foot">
          <div>{account.user?.email}</div>
          <div>Plan: {account.plan}</div>
          <button style={{ marginTop: 8 }} onClick={() => void window.pickskill.account.signOut()}>Sign out</button>
        </div>
      </nav>
      <main className="main">
        <div className="drag" />
        <div className="content">{view === 'portfolios' ? <Portfolios /> : <Analyst />}</div>
      </main>
    </div>
  );
}

function SignIn({ account }: { account: AccountState }) {
  return (
    <div className="center">
      <div className="drag" style={{ position: 'fixed', top: 0, left: 0, right: 0 }} />
      <h1 style={{ margin: 0 }}>PickSkill</h1>
      <p className="muted" style={{ margin: 0 }}>Sign in with your PickSkill account in the browser.</p>
      <button className="primary" disabled={account.status === 'pending'} onClick={() => void window.pickskill.account.signIn()}>
        {account.status === 'pending' ? 'Waiting for browser…' : 'Sign in'}
      </button>
      {account.status === 'pending' && (
        <button onClick={() => void window.pickskill.account.signIn()}>Open browser again</button>
      )}
      {account.error && <p className="error">{account.error}</p>}
    </div>
  );
}

interface PortfolioListItem {
  id: string;
  name: string;
  holdingsCount: number;
}
interface Portfolio extends PortfolioListItem {
  holdings: { id: string; ticker: string; displayName: string | null; weight: number | null }[];
}
interface Quote {
  ticker: string;
  close?: number | null;
  change?: number | null;
  changePct?: number | null;
  error?: string;
}

function Portfolios() {
  const [portfolios, setPortfolios] = useState<PortfolioListItem[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [active, setActive] = useState<Portfolio | null>(null);
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.pickskill.api
      .get<{ portfolios: PortfolioListItem[] }>('/api/portfolios')
      .then((r) => {
        setPortfolios(r.portfolios);
        setActiveId(r.portfolios[0]?.id ?? null);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!activeId) return;
    setQuotes({});
    setActive(null);
    window.pickskill.api
      .get<{ portfolio: Portfolio }>(`/api/portfolios/${activeId}`)
      .then((r) => setActive(r.portfolio))
      .catch((e: Error) => setError(e.message));
    window.pickskill.api
      .get<{ quotes: Quote[] }>(`/api/portfolios/${activeId}/quotes`)
      .then((r) => setQuotes(Object.fromEntries(r.quotes.map((q) => [q.ticker, q]))))
      .catch((e: Error) => setError(e.message));
  }, [activeId]);

  if (error) return <p className="error">{error}</p>;
  if (!portfolios) return <p className="muted">Loading portfolios…</p>;
  if (portfolios.length === 0) return <p className="muted">No portfolios yet — create one on pickskill.ai.</p>;

  return (
    <>
      <h2>Portfolios</h2>
      <div className="cards">
        {portfolios.map((p) => (
          <button key={p.id} className={p.id === activeId ? 'active' : ''} onClick={() => setActiveId(p.id)}>
            {p.name}
          </button>
        ))}
      </div>
      {active && (
        <table>
          <thead>
            <tr><th>Ticker</th><th>Weight</th><th>Last</th><th>Change</th><th>%</th></tr>
          </thead>
          <tbody>
            {active.holdings.map((h) => {
              const q = quotes[h.ticker];
              const dir = q?.change == null ? '' : q.change >= 0 ? 'up' : 'down';
              return (
                <tr key={h.id}>
                  <td>{h.ticker} <span className="muted">{h.displayName ?? ''}</span></td>
                  <td>{h.weight == null ? '—' : `${h.weight}%`}</td>
                  <td>{q?.close?.toFixed(2) ?? (q?.error ? '—' : '…')}</td>
                  <td className={dir}>{q?.change == null ? '' : q.change.toFixed(2)}</td>
                  <td className={dir}>{q?.changePct == null ? '' : `${q.changePct.toFixed(2)}%`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}

type Entry = { kind: 'user' | 'assistant'; text: string } | { kind: 'tool'; text: string };

function Analyst() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState<string[] | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const sessionRef = useRef<string | undefined>(undefined);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void window.pickskill.agent.status().then((s) => {
      if (s.state === 'ready') setReady(s.tools);
      if (s.state === 'error') setStartError(s.message);
    });
  }, []);

  useEffect(
    () =>
      window.pickskill.agent.onEvent((ev: AgentEvent) => {
        if (ev.type === 'ready') return setReady(ev.tools);
        if (ev.type === 'error') {
          setBusy(false);
          return setEntries((xs) => [...xs, { kind: 'tool', text: `⚠ ${ev.message}` }]);
        }
        if (ev.sessionID !== sessionRef.current) return;
        if (ev.type === 'text') {
          setEntries((xs) => {
            const last = xs[xs.length - 1];
            if (last?.kind === 'assistant') return [...xs.slice(0, -1), { ...last, text: last.text + ev.delta }];
            return [...xs, { kind: 'assistant', text: ev.delta }];
          });
        } else if (ev.type === 'tool') {
          if (ev.status !== 'success') {
            setEntries((xs) => [...xs, { kind: 'tool', text: `${ev.status === 'error' ? '✗' : '→'} ${ev.name} ${ev.detail ?? ''}` }]);
          }
        } else if (ev.type === 'done') {
          setBusy(false);
          if (!ev.ok) setEntries((xs) => [...xs, { kind: 'tool', text: `⚠ ${ev.error ?? 'failed'}` }]);
        }
      }),
    [],
  );

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [entries]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    setBusy(true);
    setEntries((xs) => [...xs, { kind: 'user', text }]);
    try {
      const { sessionID } = await window.pickskill.agent.prompt(text, sessionRef.current);
      sessionRef.current = sessionID;
    } catch (e) {
      setBusy(false);
      setEntries((xs) => [...xs, { kind: 'tool', text: `⚠ ${(e as Error).message}` }]);
    }
  }

  return (
    <div className="chat">
      <h2>Analyst</h2>
      <div className="log" ref={logRef}>
        {entries.length === 0 && (
          <p className={startError && !ready ? 'error' : 'muted'}>
            {ready ? `Ready · ${ready.length} finance tools` : (startError ?? 'Starting local agent…')}
          </p>
        )}
        {entries.map((e, i) => (
          <div key={i} className={e.kind === 'tool' ? 'tool' : `msg ${e.kind}`}>{e.text}</div>
        ))}
      </div>
      <div className="composer">
        <textarea
          rows={2}
          value={input}
          placeholder="Ask about a ticker, e.g. “Run a DCF on NVDA”"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
        />
        {busy && sessionRef.current ? (
          <button onClick={() => void window.pickskill.agent.abort(sessionRef.current!)}>Stop</button>
        ) : (
          <button className="primary" disabled={!ready || busy} onClick={() => void send()}>Send</button>
        )}
      </div>
    </div>
  );
}
