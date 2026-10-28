import type { Locale } from '../../lib/i18n/locales';
import { getDictionary } from '../../app/[lang]/dictionaries';
import { SiteHeaderView } from './site-header-view';

/**
 * Shared site header for public marketing surfaces (homepage, blog,
 * features, pricing). Distinct from <TopBar> which carries AppNav and
 * lives on signed-in app surfaces (chat / portfolios / indicators / …).
 *
 * Async server component: loads the locale dictionary on the server and
 * renders <SiteHeaderView>. The only client behaviour comes from the three
 * control widgets (LanguageSwitcher / ThemeToggle / UserMenu), which
 * already manage their own client boundaries.
 *
 * Layout: Logo (links home) + centered primary nav (Features / Blog /
 * Pricing), control cluster on the right. The nav is visible from the
 * `sm` breakpoint up; below `sm` it collapses into a hamburger
 * (<MobileMenu>) in the control cluster. Sticky so the brand + nav stay
 * accessible while reading a long blog post.
 */
export async function SiteHeader({ lang }: { lang: Locale }) {
  return <SiteHeaderView lang={lang} dict={await getDictionary(lang)} />;
}
