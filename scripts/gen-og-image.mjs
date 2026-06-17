// Generate public/og-default.png — a 1200x630 social-share image.
// Brand: monospace headings, warm cream bg, burnt-amber accent, dark text.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const W = 1200;
const H = 630;
const BG = '#ffffff';
const INK = '#1d1d1f';
const INK_SOFT = '#515154';
const INK_FAINT = '#86868b';
const ACCENT = '#0071e3';

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>

  <text x="80" y="100" font-family='${FONT}' font-size="22" font-weight="600" fill="${INK_FAINT}" letter-spacing="1">VICTOROCHA.COM</text>

  <text x="80" y="260" font-family='${FONT}' font-size="76" font-weight="700" fill="${INK}" letter-spacing="-2">AV engineer.</text>
  <text x="80" y="350" font-family='${FONT}' font-size="76" font-weight="700" fill="${INK}" letter-spacing="-2">Full-stack developer.</text>
  <text x="80" y="440" font-family='${FONT}' font-size="76" font-weight="700" fill="${ACCENT}" letter-spacing="-2">Latin Grammy nominee.</text>

  <text x="80" y="555" font-family='${FONT}' font-size="22" font-weight="400" fill="${INK_SOFT}">Currently mixing for Apple and Dolby with Sound Image.</text>
  <text x="80" y="588" font-family='${FONT}' font-size="22" font-weight="400" fill="${INK_SOFT}">Open to work.</text>
</svg>`;

const outPath = join(import.meta.dirname, '..', 'public', 'og-default.png');
await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9, quality: 90 })
  .toFile(outPath);

console.log(`Wrote ${outPath}`);
