/**
 * Visual check: screenshots every page at phone and desktop widths, LTR and RTL.
 *
 *   pnpm build && pnpm preview --port 4331     (in one shell)
 *   pnpm shots [outDir] [baseUrl]              (in another)
 *
 * Not a test — it produces images for a human (or an agent) to look at.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const outDir = process.argv[2] ?? './shots';
const base = (process.argv[3] ?? 'http://localhost:4331').replace(/\/$/, '');

const PAGES = [
  ['home', '/'],
  ['home-ar', '/ar/'],
  ['privacy', '/privacy'],
  ['terms', '/terms'],
  ['account-deletion', '/account-deletion'],
  ['support', '/support'],
  ['404', '/this-page-does-not-exist'],
];

const VIEWPORTS = [
  ['phone', { width: 390, height: 844 }],
  ['desktop', { width: 1280, height: 900 }],
];

/** fullPage captures don't scroll, so lazy images below the fold never load. */
async function loadLazyImages(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() =>
    [...document.images].every((img) => img.complete && img.naturalWidth > 0)
  );
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

for (const [vpName, viewport] of VIEWPORTS) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  for (const [name, path] of PAGES) {
    const res = await page.goto(base + path, { waitUntil: 'networkidle' });
    await loadLazyImages(page);
    await page.waitForTimeout(400);
    const file = `${outDir}/${name}-${vpName}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(`${String(res?.status() ?? '---')}  ${path}  ->  ${file}`);
  }
  await page.close();
}

await browser.close();
