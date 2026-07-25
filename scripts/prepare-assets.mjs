/**
 * Turns raw game captures into web assets.
 *
 * Source captures come from `unity-client/Screenshots/` — the editor auto-capture
 * (ultrawide 1920x840, every 5s during a match). They are copied in as `raw-*.png`
 * and committed; this script crops them to 16:9 and writes the versions the site
 * imports. Astro handles format/size variants from there.
 *
 * Run:  pnpm assets
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const screens = join(root, 'src', 'assets', 'screens');
const brand = join(root, 'src', 'assets', 'brand');

/** 16:9 crop window, expressed as a fraction of the source width, from the left. */
const SHOTS = [
  { src: 'raw-base.png', out: 'base.png', anchor: 0.34 },
  { src: 'raw-tier3.png', out: 'tier3.png', anchor: 0.4 },
  { src: 'raw-scouting.png', out: 'scouting.png', anchor: 0.52 },
];

const OUT_WIDTH = 1600;

async function cropShots() {
  for (const shot of SHOTS) {
    const input = join(screens, shot.src);
    const image = sharp(input);
    const { width, height } = await image.metadata();
    if (!width || !height) throw new Error(`no dimensions for ${shot.src}`);

    const cropWidth = Math.min(width, Math.round((height * 16) / 9));
    const maxLeft = width - cropWidth;
    const left = Math.max(0, Math.min(maxLeft, Math.round(width * shot.anchor - cropWidth / 2)));

    await image
      .extract({ left, top: 0, width: cropWidth, height })
      .resize({ width: OUT_WIDTH, withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(join(screens, shot.out));

    console.log(`screens/${shot.out}  ${cropWidth}x${height} @${left} -> ${OUT_WIDTH}w`);
  }
}

/** Trim the transparent padding off the Unity wordmark so it can sit flush in the hero. */
async function trimLogo() {
  const out = join(brand, 'logo.png');
  const info = await sharp(join(brand, 'logo-wordmark.png'))
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`brand/logo.png  ${info.width}x${info.height}`);
}

/** Social card: the wordmark centred on a dark panel. */
async function ogImage() {
  const W = 1200;
  const H = 630;
  const logo = await sharp(join(brand, 'logo.png'))
    .resize({ width: Math.round(W * 0.72), withoutEnlargement: true })
    .toBuffer();

  await sharp({
    create: { width: W, height: H, channels: 4, background: { r: 5, g: 7, b: 13, alpha: 1 } },
  })
    .composite([{ input: logo, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toFile(join(root, 'public', 'og-image.png'));
  console.log('public/og-image.png  1200x630');
}

await mkdir(screens, { recursive: true });
await cropShots();
await trimLogo();
await ogImage();
console.log('done');
