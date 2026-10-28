import Link from 'next/link';

/**
 * Last-resort 404 for requests that never reach the [lang] layout (for
 * example a path whose first segment is neither a locale nor a page).
 * The root layout is a pass-through, so this page brings its own shell.
 */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
        <main className="max-w-md text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-down">Error 404 · Page not found</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight">This page fell off the chart.</h1>
          <p className="mt-4 text-muted-foreground">The link may be broken, or the page may have moved.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/" className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background">
              PickSkill home
            </Link>
            <Link href="/stocks" className="rounded-md border border-border px-4 py-2 text-sm">
              Stock signals
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
