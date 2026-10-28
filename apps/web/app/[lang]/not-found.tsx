import type { Metadata } from 'next';
import { NotFoundView } from '../../components/not-found/not-found-view';

/**
 * Localized 404, rendered inside the [lang] layout for every notFound()
 * call and — via the [...rest] catch-all — for every unknown URL, since
 * the proxy rewrites all page paths under a locale segment. Next adds
 * noindex automatically for 404 responses.
 */
export const metadata: Metadata = {
  title: 'Page not found — PickSkill',
};

export default function NotFound() {
  return <NotFoundView />;
}
