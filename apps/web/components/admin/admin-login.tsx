'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

/**
 * In-page admin login form. Posts credentials to /api/admin/login, which
 * sets the httpOnly session cookie on success. On success we refresh the
 * route so the server component re-runs and renders the dashboard.
 */
export function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      if (res.status === 401) setError('用户名或密码错误');
      else if (res.status === 503) setError('管理后台未配置（缺少 ADMIN_NAME / ADMIN_PASSWORD）');
      else setError('登录失败，请重试');
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-2 text-subtle">
          <Lock className="size-4" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
            PickSkill · Admin
          </span>
        </div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">管理后台登录</h1>
        <p className="mt-1 text-sm text-muted-foreground">请输入管理员账号以继续。</p>

        <label className="mt-6 block">
          <span className="text-xs font-medium text-muted-foreground">用户名</span>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)]"
            autoFocus
          />
        </label>

        <label className="mt-4 block">
          <span className="text-xs font-medium text-muted-foreground">密码</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)]"
          />
        </label>

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !username || !password}
          className="mt-6 w-full rounded-lg bg-[color:var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? '登录中…' : '登录'}
        </button>
      </form>
    </div>
  );
}
