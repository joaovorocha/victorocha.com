// Generate OG images for victorocha.com.
//
//   node scripts/gen-og-image.mjs            → just the default 1200x630 card
//                                              at public/og-default.png
//   node scripts/gen-og-image.mjs --batch    → default card + per-page cards
//                                              for every project and writing
//                                              entry in src/content/.
//                                              Output goes to:
//                                                public/og/projects/<slug>.png
//                                                public/og/writing/<slug>.png
//
// The default card and the per-page cards share the same console/meter-bridge
// brand. The per-page version swaps the hero copy for the entry's title +
// summary and re-stamps the channel-strip eyebrow.
//
// Brand: monospace headings, dark console bg, burnt-amber accent.
import sharp from 'sharp';
import { writeFile, mkdir, readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const W = 1200;
const H = 630;
const BG = '#0B0D0E';
const PANEL = '#1A1D1F';
const INK = '#E8E6E1';
const INK_DIM = '#6B7075';
const CYAN = '#00B4D8';
const GREEN = '#4ADE80';
const MAGENTA = '#E879F9';
const WHITE = '#E8E6E1';
const YELLOW = '#F4C20D';

const FONT_DISPLAY = '"Söhne", "Inter Tight", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
const FONT_MONO = '"Berkeley Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

const ROOT = join(import.meta.dirname, '..');
const PUBLIC_DIR = join(ROOT, 'public');
const OG_DIR = join(PUBLIC_DIR, 'og');
const PROJECTS_DIR = join(ROOT, 'src', 'content', 'projects');
const WRITING_DIR = join(ROOT, 'src', 'content', 'writing');

// Same channel-meta table as src/pages/projects/[slug].astro — kept in sync by
// hand for now. If a slug isn't listed, fall back to CH 06 / cyan.
const PROJECT_CHANNELS = {
  'live-audio':         { ch: '02', label: 'LIVE AUDIO',   color: 'cyan' },
  'shaddow':            { ch: '03', label: 'SHADDOW',      color: 'green' },
  'daily-ops-platform': { ch: '04', label: 'OPS PLATFORM', color: 'green' },
  'van-conversion':     { ch: '05', label: 'VAN BUILD',    color: 'magenta' },
};

const COLOR_HEX = {
  cyan: CYAN,
  green: GREEN,
  magenta: MAGENTA,
  yellow: YELLOW,
  white: WHITE,
  red: '#E63946',
};

// --- helpers -----------------------------------------------------------------

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Minimal frontmatter reader — we only need `title` and `summary`, both of
// which sit at the top of every content file as simple `key: "value"` lines.
// Avoids pulling in gray-matter / yaml just for two strings.
function readFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    // strip surrounding quotes if present
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[kv[1]] = v;
  }
  return out;
}

// Word-wrap a string into N lines of <=maxChars chars (approx — we render with
// a proportional font, so this is best-effort, not exact). Lines beyond `max`
// are dropped and the previous line gets an ellipsis.
function wrap(text, maxChars, maxLines) {
  const words = String(text ?? '').split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!cur) { cur = w; continue; }
    if ((cur + ' ' + w).length <= maxChars) { cur += ' ' + w; }
    else { lines.push(cur); cur = w; }
    if (lines.length >= maxLines) break;
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    lines[maxLines - 1] = lines[maxLines - 1].replace(/[\s.,;:!?-]*$/, '') + '…';
  }
  return lines;
}

// --- SVG templates -----------------------------------------------------------

function defaultCardSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
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
}

function pageCardSvg({ eyebrow, channelLabel, channelNum, colorHex, title, summary, footer }) {
  // Title: up to 3 lines, max ~22 chars/line at 64px display.
  // Summary: up to 3 lines, max ~62 chars/line at 22px mono.
  const titleLines = wrap(title, 22, 3);
  const summaryLines = wrap(summary, 62, 3);

  // Vertically lay out title block starting at y=210, 80px line-height.
  const TITLE_X = 130;
  const TITLE_Y0 = 210;
  const TITLE_LH = 80;
  const titleSvg = titleLines.map((line, i) =>
    `<text x="${TITLE_X}" y="${TITLE_Y0 + i * TITLE_LH}" font-family='${FONT_DISPLAY}' font-size="64" font-weight="700" fill="${INK}" letter-spacing="-2">${esc(line)}</text>`
  ).join('\n  ');

  // Summary block sits after the title.
  const SUM_Y0 = TITLE_Y0 + titleLines.length * TITLE_LH + 30;
  const summarySvg = summaryLines.map((line, i) =>
    `<text x="${TITLE_X}" y="${SUM_Y0 + i * 32}" font-family='${FONT_MONO}' font-size="22" font-weight="400" fill="${INK_DIM}" letter-spacing="0">${esc(line)}</text>`
  ).join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>

  <!-- meter bridge -->
  <rect x="0" y="0" width="${W}" height="36" fill="${PANEL}"/>
  <text x="24" y="24" font-family='${FONT_MONO}' font-size="13" font-weight="500" fill="${INK}" letter-spacing="2.5">VICTOR ROCHA / SF</text>
  <text x="240" y="24" font-family='${FONT_MONO}' font-size="13" font-weight="400" fill="${colorHex}" letter-spacing="2.5">${esc(channelNum)} · ${esc(channelLabel)}</text>
  <text x="${W - 300}" y="24" font-family='${FONT_MONO}' font-size="13" font-weight="400" fill="${colorHex}" letter-spacing="2.5">● REC · 48 kHz · 24-BIT</text>

  <!-- channel rail -->
  <rect x="0" y="36" width="80" height="${H - 36}" fill="${PANEL}"/>
  <text x="40" y="100" text-anchor="middle" font-family='${FONT_MONO}' font-size="13" font-weight="600" fill="${colorHex}" letter-spacing="2">CH ${esc(channelNum)}</text>
  <rect x="36" y="${H - 80}" width="8" height="40" fill="${colorHex}" rx="2"/>

  <!-- eyebrow -->
  <text x="${TITLE_X}" y="130" font-family='${FONT_MONO}' font-size="13" font-weight="500" fill="${colorHex}" letter-spacing="2.5">${esc(eyebrow)}</text>

  <!-- hero title -->
  ${titleSvg}

  <!-- summary -->
  ${summarySvg}

  <!-- caption strip -->
  <line x1="${TITLE_X}" y1="540" x2="${W - 80}" y2="540" stroke="${PANEL}" stroke-width="1"/>
  <text x="${TITLE_X}" y="580" font-family='${FONT_MONO}' font-size="13" font-weight="400" fill="${INK_DIM}" letter-spacing="2">${esc(footer)}</text>
</svg>`;
}

// --- IO ----------------------------------------------------------------------

async function renderToPng(svg, outPath) {
  await mkdir(dirname(outPath), { recursive: true });
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, quality: 90 })
    .toFile(outPath);
}

async function listMarkdown(dir) {
  if (!existsSync(dir)) return [];
  const all = await readdir(dir);
  return all.filter((f) => f.endsWith('.md'));
}

async function generateDefault() {
  const out = join(PUBLIC_DIR, 'og-default.png');
  await renderToPng(defaultCardSvg(), out);
  console.log(`Wrote ${out}`);
  return out;
}

async function generateProjectCards() {
  const files = await listMarkdown(PROJECTS_DIR);
  let n = 0;
  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = await readFile(join(PROJECTS_DIR, file), 'utf8');
    const fm = readFrontmatter(raw);
    if (!fm.title) continue;
    const meta = PROJECT_CHANNELS[slug] ?? { ch: '06', label: slug.toUpperCase(), color: 'cyan' };
    const colorHex = COLOR_HEX[meta.color] ?? CYAN;
    const svg = pageCardSvg({
      eyebrow: `CH ${meta.ch} · ${meta.label}`,
      channelLabel: meta.label,
      channelNum: meta.ch,
      colorHex,
      title: fm.title,
      summary: fm.summary ?? '',
      footer: `FIG. ${meta.ch} · VICTOROCHA.COM / PROJECTS / ${slug.toUpperCase()}`,
    });
    const out = join(OG_DIR, 'projects', `${slug}.png`);
    await renderToPng(svg, out);
    console.log(`Wrote ${out}`);
    n++;
  }
  return n;
}

async function generateWritingCards() {
  const files = await listMarkdown(WRITING_DIR);
  let n = 0;
  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = await readFile(join(WRITING_DIR, file), 'utf8');
    const fm = readFrontmatter(raw);
    if (!fm.title) continue;
    if (fm.draft === 'true') continue;
    const svg = pageCardSvg({
      eyebrow: 'CH 02 · WRITING',
      channelLabel: 'WRITING',
      channelNum: '02',
      colorHex: WHITE,
      title: fm.title,
      summary: fm.summary ?? '',
      footer: `FIG. 02 · VICTOROCHA.COM / WRITING / ${slug.toUpperCase()}`,
    });
    const out = join(OG_DIR, 'writing', `${slug}.png`);
    await renderToPng(svg, out);
    console.log(`Wrote ${out}`);
    n++;
  }
  return n;
}

// --- main --------------------------------------------------------------------

const batch = process.argv.includes('--batch');

await generateDefault();
let total = 0;
if (batch) {
  total += await generateProjectCards();
  total += await generateWritingCards();
  console.log(`\n--batch: generated ${total} per-page OG cards.`);
}
