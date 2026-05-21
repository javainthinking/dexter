/**
 * Rasterize a brand-aligned SVG hero into PNG for OG cards.
 *
 * Why: Twitter / LinkedIn / Slack / Discord OG card renderers don't
 * handle SVG reliably. Posts shared on those platforms preview without
 * a card image if we only ship SVG. This script converts the SVG hero
 * to a 1200×630 PNG that sits alongside it.
 *
 * Usage:  bun run scripts/rasterize-svg.ts <path-to-input.svg> <path-to-output.png>
 * Default: rasterizes apps/web/public/blog/what-is-dcf/hero.svg → hero.png
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const input = args[0] ?? 'apps/web/public/blog/what-is-dcf/hero.svg';
const output = args[1] ?? input.replace(/\.svg$/, '.png');

const absIn = resolve(process.cwd(), input);
const absOut = resolve(process.cwd(), output);

const svgBuffer = readFileSync(absIn);

const png = await sharp(svgBuffer, { density: 192 })
  .resize(1200, 630, { fit: 'cover' })
  .png({ compressionLevel: 9, quality: 90 })
  .toBuffer();

writeFileSync(absOut, png);
console.log(`✓ ${absIn}\n  → ${absOut} (${(png.byteLength / 1024).toFixed(1)} KB)`);
