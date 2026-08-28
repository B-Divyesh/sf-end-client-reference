import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PDFDocument } from 'pdf-lib';
import { readFile } from 'node:fs/promises';

async function invoiceBuffer(): Promise<Buffer> {
  const document = await PDFDocument.create();
  document.addPage([400, 500]);
  return Buffer.from(await document.save());
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { localStorage.clear(); indexedDB.deleteDatabase('performed-for'); });
  await page.reload();
});

test('generates a merged PDF and logs the exact relationship', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.locator('#invoice-file').setInputFiles({ name: 'original-invoice.pdf', mimeType: 'application/pdf', buffer: await invoiceBuffer() });
  await page.getByLabel('Billing client The company responsible for payment').fill('Prime & Co.');
  await page.getByLabel('Services performed for The ultimate customer; not the payer').fill('客户 Ω');
  await page.getByLabel('Project / PO reference Preserved exactly as entered').fill('PO/42 · Phase A');
  await page.getByLabel('Invoice number Optional').fill('INV-007');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Generate package' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('INV-007-performed-for.pdf');
  const path = await download.path();
  expect(path).toBeTruthy();
  const merged = await PDFDocument.load(await readFile(path!));
  expect(merged.getPageCount()).toBe(2);
  await expect(page.getByRole('cell', { name: '客户 Ω' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Package ready');
  expect(consoleErrors).toEqual([]);
});

test('announces validation and has no serious accessibility violations', async ({ page }) => {
  await page.getByRole('button', { name: 'Generate package' }).click();
  await expect(page.locator('#invoice-file')).toBeFocused();
  expect(await page.locator('h1').count()).toBe(1);
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('works at 390px and reloads offline from the service worker', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Generate package' })).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  const cachedScripts = await page.evaluate(async () => {
    const keys = await caches.keys();
    const entries = await Promise.all(keys.map(async (key) => {
      const cache = await caches.open(key);
      return Promise.all((await cache.keys()).filter((request) => request.url.endsWith('.js')).map(async (request) => ({ url: request.url, size: (await (await cache.match(request))?.blob())?.size ?? 0 })));
    }));
    return entries.flat();
  });
  expect(cachedScripts.some((entry) => entry.size > 1_000)).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Make the end client unmistakable.' })).toBeVisible();
  await expect(page.getByText('Offline.', { exact: false })).toBeVisible();
});

test('legal routes are direct-loadable and semantic', async ({ page }) => {
  for (const route of ['/privacy', '/terms']) {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.locator('h1').count()).toBe(1);
    expect(await page.locator('html').getAttribute('lang')).toBe('en');
  }
});
