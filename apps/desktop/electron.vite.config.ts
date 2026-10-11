import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

const web = resolve(__dirname, '../web');
const webRequire = createRequire(resolve(web, 'package.json'));
const shims = resolve(__dirname, 'src/renderer/src/shims');

export default defineConfig({
  main: {
    // The agent worker (src/agent/worker.ts) is bundled separately by
    // scripts/bundle-worker.mjs so the packaged app needs no node_modules.
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: { rollupOptions: { output: { format: 'cjs', entryFileNames: '[name].cjs' } } },
  },
  // The renderer renders apps/web's client components directly. Their npm
  // deps resolve from apps/web/node_modules; the handful of Next.js modules
  // they touch are replaced by shims, and React is pinned to web's copy so
  // there is exactly one React in the bundle.
  renderer: {
    root: resolve(__dirname, 'src/renderer'),
    publicDir: resolve(web, 'public'),
    plugins: [react()],
    resolve: {
      alias: [
        { find: /^react$/, replacement: webRequire.resolve('react') },
        { find: /^react\/(.*)$/, replacement: `${resolve(web, 'node_modules/react')}/$1` },
        { find: /^react-dom$/, replacement: webRequire.resolve('react-dom') },
        { find: /^react-dom\/(.*)$/, replacement: `${resolve(web, 'node_modules/react-dom')}/$1` },
        { find: /^next\/navigation$/, replacement: `${shims}/next-navigation.ts` },
        { find: /^next\/link$/, replacement: `${shims}/next-link.tsx` },
        { find: /^next\/dynamic$/, replacement: `${shims}/next-dynamic.tsx` },
        { find: /^next-auth\/react$/, replacement: `${shims}/next-auth-react.tsx` },
        { find: /^@web\/(.*)$/, replacement: `${web}/$1` },
      ],
    },
    css: { postcss: { plugins: [webRequire('@tailwindcss/postcss')()] } },
    server: {
      fs: { allow: [resolve(__dirname), web] },
      // The page is loaded via app://pickskill (main forwards to Vite), so
      // point the HMR socket at Vite itself.
      hmr: { protocol: 'ws', host: 'localhost' },
    },
    build: { rollupOptions: { input: resolve(__dirname, 'src/renderer/index.html') } },
  },
});
