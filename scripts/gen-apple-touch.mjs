// Generate public/apple-touch-icon.png (180x180) — same monogram as favicon, bigger.
import sharp from 'sharp';
import { join } from 'node:path';

const ACCENT = '#0B0D0E';
const FG = '#00B4D8';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="34" fill="${ACCENT}"/>
  <text x="90" y="125" text-anchor="middle"
        font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
        font-size="92" font-weight="700" fill="${FG}">vr</text>
</svg>`;

const outPath = join(import.meta.dirname, '..', 'public', 'apple-touch-icon.png');
await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`Wrote ${outPath}`);
