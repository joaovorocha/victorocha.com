// Generate public/og-default.png — a 1200x630 social-share image.
// Brand: monospace headings, warm cream bg, burnt-amber accent, dark text.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const W = 1200;
const H = 630;
const BG = '#f7f3ec';
const INK = '#1a1a1a';
const INK_SOFT = '#4a4a4a';
const INK_FAINT = '#6b6b6b';
const ACCENT = '#c2410c';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <circle cx="80" cy="86" r="14" fill="${ACCENT}"/>
  <text x="116" y="96" font-family="ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace" font-size="28" font-weight="600" fill="${INK_SOFT}">victorocha.com</text>

  <text x="80" y="240" font-family="ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace" font-size="22" font-weight="500" fill="${INK_FAINT}" letter-spacing="2">JOAO V. ROCHA &#183; SAN FRANCISCO</text>

  <text x="80" y="335" font-family="ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace" font-size="56" font-weight="700" fill="${INK}">AV engineer and</text>
  <text x="80" y="405" font-family="ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace" font-size="56" font-weight="700" fill="${INK}">full-stack developer.</text>
  <text x="80" y="475" font-family="ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace" font-size="56" font-weight="700" fill="${ACCENT}">Latin Grammy nominee.</text>

  <line x1="80" y1="540" x2="1120" y2="540" stroke="#e6dccb" stroke-width="2"/>
  <text x="80" y="585" font-family="Iowan Old Style, Palatino, Georgia, serif" font-size="22" font-style="italic" fill="${INK_SOFT}">Currently mixing for Apple and Dolby. Open to work.</text>
</svg>`;

const outPath = join(import.meta.dirname, '..', 'public', 'og-default.png');
await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9, quality: 90 })
  .toFile(outPath);

console.log(`Wrote ${outPath}`);
