// Generate public/og-default.png — a 1200x630 social-share image.
// Brand: monospace headings, warm cream bg, burnt-amber accent, dark text.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const W = 1200;
const H = 630;
const BG = '#0B0D0E';
const PANEL = '#1A1D1F';
const INK = '#E8E6E1';
const INK_DIM = '#6B7075';
const CYAN = '#00B4D8';
const YELLOW = '#F4C20D';
const RED = '#E63946';

const FONT_DISPLAY = '"Söhne", "Inter Tight", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
const FONT_MONO = '"Berkeley Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>

  <!-- meter bridge -->
  <rect x="0" y="0" width="${W}" height="36" fill="${PANEL}"/>
  <text x="24" y="24" font-family='${FONT_MONO}' font-size="13" font-weight="500" fill="${INK}" letter-spacing="2.5">VICTOR ROCHA / SF</text>
  <text x="240" y="24" font-family='${FONT_MONO}' font-size="13" font-weight="400" fill="${CYAN}" letter-spacing="2.5">01 · PROJECTS</text>
  <text x="${W - 300}" y="24" font-family='${FONT_MONO}' font-size="13" font-weight="400" fill="${CYAN}" letter-spacing="2.5">● REC · 48 kHz · 24-BIT</text>

  <!-- channel rail -->
  <rect x="0" y="36" width="80" height="${H - 36}" fill="${PANEL}"/>
  <text x="40" y="100" text-anchor="middle" font-family='${FONT_MONO}' font-size="13" font-weight="600" fill="${CYAN}" letter-spacing="2">CH 01</text>
  <rect x="36" y="${H - 80}" width="8" height="40" fill="${CYAN}" rx="2"/>

  <!-- eyebrow -->
  <text x="130" y="130" font-family='${FONT_MONO}' font-size="13" font-weight="500" fill="${CYAN}" letter-spacing="2.5">CH 01 · INPUT</text>

  <!-- hero headline -->
  <text x="130" y="245" font-family='${FONT_DISPLAY}' font-size="72" font-weight="700" fill="${INK}" letter-spacing="-2">Audio engineer.</text>
  <text x="130" y="330" font-family='${FONT_DISPLAY}' font-size="72" font-weight="700" fill="${YELLOW}" letter-spacing="-2">Latin Grammy nominee.</text>
  <text x="130" y="415" font-family='${FONT_DISPLAY}' font-size="72" font-weight="700" fill="${INK}" letter-spacing="-2">Full-stack ops<tspan fill="${CYAN}">_</tspan></text>

  <!-- caption strip -->
  <line x1="130" y1="500" x2="${W - 80}" y2="500" stroke="${PANEL}" stroke-width="1"/>
  <text x="130" y="540" font-family='${FONT_MONO}' font-size="14" font-weight="400" fill="${INK_DIM}" letter-spacing="2">A2 · ROCK IN RIO   /   AV FOR APPLE &amp; DOLBY   /   NODE + POSTGRES</text>
  <text x="130" y="580" font-family='${FONT_MONO}' font-size="13" font-weight="400" fill="${INK_DIM}" letter-spacing="2">FIG. 01 · VICTOROCHA.COM · OPEN TO WORK · SF</text>
</svg>`;

const outPath = join(import.meta.dirname, '..', 'public', 'og-default.png');
await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9, quality: 90 })
  .toFile(outPath);

console.log(`Wrote ${outPath}`);
