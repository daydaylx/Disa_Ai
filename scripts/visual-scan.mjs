import { chromium } from 'playwright';

const url = process.env.SCAN_URL || process.argv[2] || 'http://localhost:5173';
const outDir = process.env.OUT_DIR || 'screenshots';
const viewports = [
  { w: 360,  h: 740,  name: '360'  },
  { w: 768,  h: 1024, name: '768'  },
  { w: 1280, h: 800,  name: '1280' }
];

const navWaits = ['networkidle', 'domcontentloaded'];

const browser = await chromium.launch({ headless: true, args: ['--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.setDefaultNavigationTimeout(20000);
page.setDefaultTimeout(10000);

let ok = false; let lastErr;
for (const state of navWaits) {
  try { await page.goto(url, { waitUntil: state }); ok = true; break; }
  catch (e) { lastErr = e; }
}
if (!ok) { console.error('[scan] navigation failed:', lastErr?.message || lastErr); process.exit(2); }

try { await page.evaluate(() => (document.fonts && document.fonts.ready) || null); } catch {}
try {
  await page.addStyleTag({ content: `
    * { animation: none !important; transition: none !important; }
    html, body { scroll-behavior: auto !important; }
  `});
} catch {}

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.w, height: vp.h });
  await page.waitForTimeout(300);

  const pathFull = `${outDir}/home_${vp.name}.png`;
  try {
    await page.screenshot({ path: pathFull, fullPage: true });
    console.log('[scan]', vp.w, 'x', vp.h, '->', pathFull);
  } catch (e) {
    const pathView = `${outDir}/home_${vp.name}_viewport.png`;
    console.warn('[scan] fullPage failed, fallback to viewport:', e?.message || e);
    await page.screenshot({ path: pathView, fullPage: false });
    console.log('[scan]', vp.w, 'x', vp.h, '->', pathView);
  }
}

await browser.close();
console.log('[scan] done');
