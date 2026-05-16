'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { ArrowLeft, ArrowRight, Mail, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Logo } from '../../../components/logo';
import { ThemeToggle } from '../../../components/theme-toggle';
import { LanguageSwitcher } from '../../../components/i18n/language-switcher';
import { LocalizedLink } from '../../../components/i18n/localized-link';
import { GoogleMark } from '../../../components/icons/google';
import { format } from '../../../components/i18n/dictionary-provider';
import type { Dictionary } from '../dictionaries';
import { cn } from '../../../lib/utils';

type AuthCopy = Dictionary['auth'];

interface Props {
  auth: AuthCopy;
  languageLabel: string;
  backToHome: string;
  callbackUrl: string;
  googleEnabled: boolean;
}

type Step = 'email' | 'code';

export function SignInClient({ auth, callbackUrl, googleEnabled }: Props) {
  const [step, setStep] = React.useState<Step>('email');
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [devCode, setDevCode] = React.useState<string | null>(null);
  const [resendIn, setResendIn] = React.useState(0);

  // Resend cooldown ticker
  React.useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  async function requestCode(target: string) {
    setError(null);
    setPending(true);
    try {
      const res = await fetch('/api/auth/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: target }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        retryAfter?: number;
        devCode?: string;
      };
      if (!res.ok || !data.ok) {
        if (data.error === 'throttled') {
          setResendIn(data.retryAfter ?? 60);
          setError(auth.errors.throttled);
        } else if (data.error === 'invalid_email') {
          setError(auth.errors.invalidEmail);
        } else {
          setError(auth.errors.generic);
        }
        return false;
      }
      if (data.devCode) setDevCode(data.devCode);
      setResendIn(60);
      return true;
    } catch {
      setError(auth.errors.generic);
      return false;
    } finally {
      setPending(false);
    }
  }

  async function onSubmitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    const ok = await requestCode(email.trim());
    if (ok) setStep('code');
  }

  async function onSubmitCode(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError(auth.errors.invalidCode);
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        if (data.error === 'invalid_code') setError(auth.errors.invalidCode);
        else if (data.error === 'expired_code') setError(auth.errors.expiredCode);
        else setError(auth.errors.generic);
        return;
      }
      // Hard navigation so the server picks up the new cookie before render.
      window.location.href = callbackUrl;
    } catch {
      setError(auth.errors.generic);
    } finally {
      setPending(false);
    }
  }

  async function onGoogle() {
    setPending(true);
    setError(null);
    await signIn('google', { callbackUrl });
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-[440px]">
          {step === 'email' ? (
            <EmailStep
              auth={auth}
              email={email}
              setEmail={setEmail}
              pending={pending}
              error={error}
              onSubmit={onSubmitEmail}
              onGoogle={googleEnabled ? onGoogle : undefined}
            />
          ) : (
            <CodeStep
              auth={auth}
              email={email}
              code={code}
              setCode={setCode}
              pending={pending}
              error={error}
              devCode={devCode}
              resendIn={resendIn}
              onSubmit={onSubmitCode}
              onResend={() => void requestCode(email.trim())}
              onBack={() => {
                setStep('email');
                setCode('');
                setDevCode(null);
                setError(null);
              }}
            />
          )}
        </div>
      </main>
      <Footer terms={auth.terms} />
    </div>
  );
}

function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-4 sm:px-6">
      <LocalizedLink
        href="/"
        className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Logo />
      </LocalizedLink>
      <div className="flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}

function Footer({ terms }: { terms: string }) {
  return (
    <footer className="border-t border-border px-4 py-5 sm:px-6">
      <p className="mx-auto max-w-md text-center font-mono text-[10px] leading-relaxed tracking-[0.12em] text-subtle">
        {terms}
      </p>
    </footer>
  );
}

function EmailStep({
  auth,
  email,
  setEmail,
  pending,
  error,
  onSubmit,
  onGoogle,
}: {
  auth: AuthCopy;
  email: string;
  setEmail: (v: string) => void;
  pending: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onGoogle?: () => void;
}) {
  return (
    <div className="space-y-7">
      <div className="space-y-3 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
          {auth.backToHome.toUpperCase()}
        </p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-[2.25rem]">
          {auth.signInTitle}
        </h1>
        <p className="text-sm text-muted-foreground">{auth.signInSubtitle}</p>
      </div>

      {onGoogle && (
        <>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            disabled={pending}
            onClick={onGoogle}
          >
            <GoogleMark className="size-4" />
            {auth.continueWithGoogle}
          </Button>
          <Divider label={auth.or} />
        </>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label={auth.emailLabel}
          icon={<Mail className="size-4 text-subtle" />}
          input={
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={auth.emailPlaceholder}
              disabled={pending}
              className="block w-full bg-transparent pl-9 pr-3 py-2.5 text-sm placeholder:text-subtle focus:outline-none"
            />
          }
        />
        {error && <ErrorRow message={error} />}
        <Button
          type="submit"
          variant="accent"
          size="lg"
          className="w-full"
          disabled={pending || !email.trim()}
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          {pending ? auth.loading : auth.continueWithEmail}
          {!pending && <ArrowRight className="size-4" />}
        </Button>
      </form>
    </div>
  );
}

function CodeStep({
  auth,
  email,
  code,
  setCode,
  pending,
  error,
  devCode,
  resendIn,
  onSubmit,
  onResend,
  onBack,
}: {
  auth: AuthCopy;
  email: string;
  code: string;
  setCode: (v: string) => void;
  pending: boolean;
  error: string | null;
  devCode: string | null;
  resendIn: number;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-7">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
      >
        <ArrowLeft className="size-3.5" />
        {auth.useDifferentEmail}
      </button>

      <div className="space-y-3 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
          {auth.codeTitle.toUpperCase()}
        </p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-[2.25rem]">
          {auth.codeTitle}
        </h1>
        <p className="text-sm text-muted-foreground">
          {format(auth.codeSubtitle, { email })}
        </p>
      </div>

      {devCode && (
        <div className="rounded-md border border-[color:var(--warning)]/40 bg-[color:var(--warning)]/10 p-3 text-center text-xs">
          <p className="font-mono uppercase tracking-[0.14em] text-[color:var(--warning)]">
            {auth.devCodeBanner}
          </p>
          <p className="mt-1 font-mono text-base tabular-nums tracking-[0.32em] text-foreground">
            {devCode}
          </p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label={auth.codeLabel}
          input={
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="••••••"
              disabled={pending}
              className="block w-full bg-transparent px-3 py-3 text-center font-mono text-2xl tabular-nums tracking-[0.32em] placeholder:text-subtle focus:outline-none"
              autoFocus
            />
          }
        />
        {error && <ErrorRow message={error} />}
        <Button
          type="submit"
          variant="accent"
          size="lg"
          className="w-full"
          disabled={pending || code.length !== 6}
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          {pending ? auth.verifying : auth.verify}
        </Button>
        <div className="text-center text-xs">
          <button
            type="button"
            onClick={onResend}
            disabled={resendIn > 0 || pending}
            className={cn(
              'font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1',
              resendIn > 0 || pending
                ? 'text-subtle cursor-not-allowed'
                : 'text-accent hover:opacity-80',
            )}
          >
            {resendIn > 0 ? format(auth.resendIn, { seconds: resendIn }) : auth.resend}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  icon,
  input,
}: {
  label: string;
  icon?: React.ReactNode;
  input: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
        {label}
      </span>
      <div className="relative overflow-hidden rounded-lg border border-border bg-card transition-colors focus-within:border-border-strong">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}
        {input}
      </div>
    </label>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="relative flex items-center">
      <div className="flex-1 border-t border-border" />
      <span className="px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
        {label}
      </span>
      <div className="flex-1 border-t border-border" />
    </div>
  );
}

function ErrorRow({ message }: { message: string }) {
  return (
    <p className="rounded-md border border-[color:var(--negative)]/40 bg-[color:var(--negative)]/8 px-3 py-2 text-sm text-[color:var(--negative)]">
      {message}
    </p>
  );
}
