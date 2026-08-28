import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const svg = await readFile(new URL('../public/icons/icon.svg', import.meta.url), 'utf8');
const browser = await chromium.launch({ headless: true });
for (const [name, size, inset] of [['icon-192.png', 192, 0], ['icon-512.png', 512, 0], ['icon-maskable-512.png', 512, 51]]) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await page.setContent(`<style>*{box-sizing:border-box}body{margin:0;width:${size}px;height:${size}px;background:#f4f0e6;display:grid;place-items:center}img{width:${size - inset * 2}px;height:${size - inset * 2}px}</style><img alt="" src="data:image/svg+xml,${encodeURIComponent(svg)}">`);
  await page.screenshot({ path: new URL(`../public/icons/${name}`, import.meta.url).pathname });
  await page.close();
}
await browser.close();
