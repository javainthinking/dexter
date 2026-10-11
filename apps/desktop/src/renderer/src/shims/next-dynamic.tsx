// next/dynamic → React.lazy. Everything renders client-side here, so `ssr`
// is ignored.
import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';

type Loaded<P> = ComponentType<P> | { default: ComponentType<P> };

export default function dynamic<P extends object>(
  loader: () => Promise<Loaded<P>>,
  opts: { ssr?: boolean; loading?: () => ReactNode } = {},
): ComponentType<P> {
  const Lazy = lazy(async () => {
    const mod = await loader();
    return { default: 'default' in mod ? mod.default : mod };
  });
  return function Dynamic(props: P) {
    return (
      <Suspense fallback={opts.loading?.() ?? null}>
        <Lazy {...props} />
      </Suspense>
    );
  };
}
