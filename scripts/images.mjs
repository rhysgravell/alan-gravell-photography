// Builds the responsive images. Every original in photos/ is resized to
// 800, 1600 and 2400 pixels wide (never wider than the original) in AVIF and
// WebP, plus one 1200px JPEG for link previews, written to public/img/, and listed with its true pixel size in
// .images.json, which lib/images.ts reads at build time.
//
// Runs before `dev` and `build`. Unchanged originals are skipped, and outputs
// whose original has gone are removed. Run `npm run images` after adding
// photographs while the dev server is running.

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "photos");
const OUTPUT = path.join(ROOT, "public/img");
const MANIFEST = path.join(ROOT, ".images.json");

const WIDTHS = [800, 1600, 2400];
const FORMATS = {
  avif: (img) => img.avif({ quality: 62, effort: 4 }),
  webp: (img) => img.webp({ quality: 84 }),
};
// Link previews: social sites want a JPEG around 1200px wide.
const PREVIEW_WIDTH = 1200;
const ORIGINAL = /\.(jpe?g|png|tiff?|webp)$/i;

/** Every file under dir, recursively; none if it doesn't exist. */
async function files(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const found = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await files(full)));
    else found.push(full);
  }
  return found;
}

async function mtime(file) {
  return (await fs.stat(file).catch(() => null))?.mtimeMs ?? 0;
}

const manifest = {};
const written = new Set();
let made = 0;

for (const src of (await files(SOURCE)).filter((f) => ORIGINAL.test(f))) {
  const rel = path.relative(SOURCE, src).split(path.sep).join("/");
  const stem = rel.replace(/\.[^.]+$/, "");

  // Width and height as displayed, after any EXIF rotation.
  const meta = await sharp(src).metadata();
  const turned = (meta.orientation ?? 1) >= 5;
  const width = turned ? meta.height : meta.width;
  const height = turned ? meta.width : meta.height;

  const widths = WIDTHS.filter((w) => w < width);
  if (widths.length < WIDTHS.length) widths.push(width);

  const changed = await mtime(src);
  const previewWidth = Math.min(PREVIEW_WIDTH, width);
  const preview = path.join(OUTPUT, `${stem}-og.jpg`);
  written.add(preview);
  if ((await mtime(preview)) < changed) {
    await fs.mkdir(path.dirname(preview), { recursive: true });
    await sharp(src)
      .autoOrient()
      .resize({ width: previewWidth })
      .withIccProfile("srgb")
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(preview);
    made++;
  }

  for (const w of widths) {
    for (const [format, encode] of Object.entries(FORMATS)) {
      const out = path.join(OUTPUT, `${stem}-${w}.${format}`);
      written.add(out);
      if ((await mtime(out)) >= changed) continue;
      await fs.mkdir(path.dirname(out), { recursive: true });
      // Rotated upright, converted to sRGB and tagged as such, so colour
      // holds in every browser whatever profile the original carried.
      await encode(
        sharp(src).autoOrient().resize({ width: w }).withIccProfile("srgb"),
      ).toFile(out);
      made++;
    }
  }

  manifest[rel] = {
    src: `/img/${stem}`,
    width,
    height,
    widths,
    preview: {
      src: `/img/${stem}-og.jpg`,
      width: previewWidth,
      height: Math.round((height * previewWidth) / width),
    },
  };
}

// Clear out sizes whose original was removed or renamed.
let removed = 0;
for (const file of await files(OUTPUT)) {
  if (!written.has(file)) {
    await fs.rm(file);
    removed++;
  }
}

await fs.writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `images: ${Object.keys(manifest).length} photographs, ${made} sizes made, ${removed} removed`,
);
