// Usage: node scripts/process-photo.mjs <input> <out-slug> [--portrait|--landscape]
// Produces optimized WebP + JPEG at sensible sizes for the site.
import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { mkdir } from 'node:fs/promises';

const [, , inputPath, outSlug, modeArg] = process.argv;
if (!inputPath || !outSlug) {
  console.error('Usage: node scripts/process-photo.mjs <input> <category/slug> [--portrait|--landscape|--square]');
  process.exit(1);
}

const mode = modeArg?.replace('--', '') ?? 'landscape';
const outDir = join(import.meta.dirname, '..', 'public', 'images', dirname(outSlug));
await mkdir(outDir, { recursive: true });

const base = sharp(inputPath).rotate(); // auto-orient by EXIF

const sizes = mode === 'portrait'
  ? [{ name: '600', w: 600, h: 750 }, { name: '1200', w: 1200, h: 1500 }]
  : mode === 'square'
  ? [{ name: '600', w: 600, h: 600 }, { name: '1200', w: 1200, h: 1200 }]
  : [{ name: '1200', w: 1200, h: 800 }, { name: '1600', w: 1600, h: 1067 }];

const meta = await base.metadata();
console.log(`Input: ${meta.width}x${meta.height}, ${meta.format}`);

for (const s of sizes) {
  const pipeline = sharp(inputPath)
    .rotate()
    .resize({ width: s.w, height: s.h, fit: 'cover', position: 'attention', withoutEnlargement: true });

  const jpegOut = join(import.meta.dirname, '..', 'public', 'images', `${outSlug}-${s.name}.jpg`);
  const webpOut = join(import.meta.dirname, '..', 'public', 'images', `${outSlug}-${s.name}.webp`);

  await pipeline.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(jpegOut);
  await pipeline.clone().webp({ quality: 80 }).toFile(webpOut);
  console.log(`  → ${outSlug}-${s.name}.{jpg,webp}`);
}
