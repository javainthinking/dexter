import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '96px 24px 64px' }}>
      <p style={{ fontSize: 13, color: '#a1a1aa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Dexter
      </p>
      <h1 style={{ fontSize: 48, lineHeight: 1.1, margin: '12px 0 16px', fontWeight: 700 }}>
        An autonomous AI agent for deep financial research.
      </h1>
      <p style={{ fontSize: 18, color: '#d4d4d8', lineHeight: 1.6, marginBottom: 36 }}>
        Dexter decomposes complex questions, fetches live market data, validates its own work,
        and produces data-backed answers. The same agent core powers the terminal CLI, WhatsApp,
        and now the web.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link
          href="/chat"
          style={{
            background: '#fafafa',
            color: '#09090b',
            padding: '12px 20px',
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Open chat →
        </Link>
        <a
          href="https://github.com/virattt/dexter"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            border: '1px solid #27272a',
            color: '#fafafa',
            padding: '12px 20px',
            borderRadius: 8,
            textDecoration: 'none',
          }}
        >
          GitHub
        </a>
      </div>
    </main>
  );
}
