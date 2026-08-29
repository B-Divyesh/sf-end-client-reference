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
  await page.goto('/demo');
  await page.evaluate(() => { localStorage.clear(); indexedDB.deleteDatabase('performed-for'); indexedDB.deleteDatabase('demo:performed-for'); });
  await page.reload();
});

test('generates a merged PDF and logs the exact relationship', async ({ page }) => {
  await page.goto('/');
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
  await page.goto('/');
  await page.getByRole('button', { name: 'Generate package' }).click();
  await expect(page.locator('#invoice-file')).toBeFocused();
  expect(await page.locator('h1').count()).toBe(1);
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('works at 390px and reloads offline from the service worker @claim:offline-reload', async ({ page, context }) => {
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
  await expect(page.getByRole('heading', { name: 'Add the end client to every invoice.' })).toBeVisible();
  await expect(page.getByText('Offline.', { exact: false })).toBeVisible();
});

test('legal routes are direct-loadable and semantic', async ({ page }) => {
  for (const [route, title] of [['/privacy', 'Privacy — Performed For'], ['/terms', 'Terms — Performed For']] as const) {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.locator('h1').count()).toBe(1);
    expect(await page.locator('html').getAttribute('lang')).toBe('en');
    await expect(page).toHaveTitle(title);
  }
});

test('shows a styled not-found page for unknown routes', async ({ page }) => {
  await page.goto('/not-a-product-route');
  await expect(page.getByRole('heading', { name: 'This route is not on the map.' })).toBeVisible();
  await expect(page).toHaveTitle('Page not found — Performed For');
});

test('captures and verifies a returned one-time license @claim:one-time-unlock', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/end-client-reference/verify**', (route) => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null })
  }));
  await page.goto('/?license=test-license-token');
  await expect(page).not.toHaveURL(/license=/);
  await expect(page.locator('#license-badge')).toContainText('unlimited');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:end-client-reference'))).toBe('test-license-token');
  await expect(page.getByRole('link', { name: 'Buy the one-time unlock' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/end-client-reference/checkout');
});

test('rejects whitespace-only relationship values before package generation', async ({ page }) => {
  await page.goto('/');
  await page.locator('#invoice-file').setInputFiles({ name: 'original-invoice.pdf', mimeType: 'application/pdf', buffer: await invoiceBuffer() });
  await page.getByLabel('Billing client The company responsible for payment').fill('   ');
  await page.getByLabel('Services performed for The ultimate customer; not the payer').fill('  ');
  await page.getByLabel('Project / PO reference Preserved exactly as entered').fill(' ');
  await page.getByRole('button', { name: 'Generate package' }).click();
  await expect(page.locator('#form-error')).toContainText('spaces alone are not a client name');
  await expect(page.getByLabel('Billing client The company responsible for payment')).toBeFocused();
  await expect(page.locator('#record-list')).toContainText('No routes logged yet');
});

test('draws every allowed relationship character on the cover @claim:exact-relationship-text', async ({ page }) => {
  await page.goto('/demo');
  const billing = `Billing ${'W'.repeat(172)}`;
  const endClient = `End ${'客户Ω'.repeat(58)}`;
  const reference = `PO ${'REF-'.repeat(54)}`;
  await page.evaluate(() => {
    const calls: string[] = [];
    const original = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function patchedFillText(...args: Parameters<CanvasRenderingContext2D['fillText']>) {
      calls.push(String(args[0]));
      return original.apply(this, args);
    };
    (window as Window & { __coverText?: string[] }).__coverText = calls;
  });
  await page.getByLabel('Billing client The company responsible for payment').fill(billing);
  await page.getByLabel('Services performed for The ultimate customer; not the payer').fill(endClient);
  await page.getByLabel('Project / PO reference Preserved exactly as entered').fill(reference);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Generate package' }).click();
  await downloadPromise;
  const drawnText = await page.evaluate(() => (window as Window & { __coverText?: string[] }).__coverText?.join('') ?? '');
  expect(drawnText).toContain(billing);
  expect(drawnText).toContain(endClient);
  expect(drawnText).toContain(reference);
});

test('opens a completed isolated sample route @claim:demo-isolated', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('northline-studio-invoice.pdf · sample invoice ready')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Harbour Arts Council' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('cell', { name: 'Harbour Arts Council' })).toBeVisible();
});

test('keeps the original invoice page after the sample cover @claim:original-invoice-intact', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Generate package' }).click();
  const download = await downloadPromise;
  const merged = await PDFDocument.load(await readFile((await download.path())!));
  expect(merged.getPageCount()).toBe(2);
  expect(merged.getPage(1).getWidth()).toBeCloseTo(595.28, 1);
});

test('exports the sample relationship as CSV @claim:csv-export', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadPromise;
  const csv = await readFile((await download.path())!, 'utf8');
  expect(csv).toContain('"Harbour Arts Council"');
  expect(csv).toContain('"HAC-2026-014 · Autumn campaign"');
});

test('processes the sample without third-party requests @claim:runs-on-device', async ({ page }) => {
  const requested: string[] = [];
  page.on('request', (request) => requested.push(request.url()));
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Generate package' }).click();
  await downloadPromise;
  const origin = new URL(page.url()).origin;
  expect(requested).not.toEqual([]);
  expect(requested.every((url) => new URL(url).origin === origin)).toBe(true);
});

test('does not send sample document data to analytics or cloud storage @claim:no-analytics @claim:no-cloud-document-storage', async ({ page }) => {
  const requests: Array<{ url: string; method: string }> = [];
  page.on('request', (request) => requests.push({ url: request.url(), method: request.method() }));
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Generate package' }).click();
  await downloadPromise;
  const origin = new URL(page.url()).origin;
  expect(requests.every((request) => new URL(request.url).origin === origin && request.method === 'GET')).toBe(true);
});
