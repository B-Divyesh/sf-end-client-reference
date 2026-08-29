import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import { PDFArray, PDFDocument, PDFStream, StandardFonts } from 'pdf-lib';
import { readFile } from 'node:fs/promises';

async function invoiceBuffer(): Promise<Buffer> {
  const document = await PDFDocument.create();
  document.addPage([400, 500]);
  return Buffer.from(await document.save());
}

async function detailedInvoiceBuffer(): Promise<Buffer> {
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.Helvetica);
  const first = document.addPage([400, 500]);
  first.drawText('Invoice content page one — line item 42', { x: 40, y: 420, font, size: 14 });
  const second = document.addPage([612, 792]);
  second.drawText('Invoice content page two — payment terms', { x: 50, y: 700, font, size: 16 });
  return Buffer.from(await document.save({ useObjectStreams: false }));
}

async function contentHashes(bytes: Uint8Array): Promise<string[][]> {
  const document = await PDFDocument.load(bytes);
  return document.getPages().map((page) => {
    const contents = page.node.Contents();
    if (!contents) return [];
    const object = document.context.lookup(contents);
    const streams = object instanceof PDFArray
      ? object.asArray().map((item) => document.context.lookup(item, PDFStream))
      : object instanceof PDFStream ? [object] : [];
    return streams.map((stream) => createHash('sha256').update(stream.getContents()).digest('hex'));
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/demo');
  await page.evaluate(async () => {
    localStorage.clear();
    sessionStorage.clear();
    await Promise.all([
      new Promise<void>((resolve) => {
        const request = indexedDB.deleteDatabase('performed-for');
        request.onsuccess = () => resolve(); request.onerror = () => resolve(); request.onblocked = () => resolve();
      }),
      new Promise<void>((resolve) => {
        const request = indexedDB.deleteDatabase('demo:performed-for');
        request.onsuccess = () => resolve(); request.onerror = () => resolve(); request.onblocked = () => resolve();
      }),
    ]);
  });
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
  await expect(page.locator('#toast')).toContainText('Package ready');
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

test('keeps every route axe-clean and announces an available update', async ({ page }) => {
  for (const route of ['/', '/demo', '/privacy', '/terms', '/not-a-product-route']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? '')), route).toEqual([]);
  }
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.dispatchEvent(new MessageEvent('message', { data: { type: 'UPDATE_AVAILABLE' } })));
  await expect(page.locator('#toast')).toHaveText('A fresh map is ready. Reload when convenient.');
  await expect(page.locator('#toast')).toBeVisible();
});

test('legal routes are direct-loadable and semantic', async ({ page }) => {
  for (const [route, title] of [['/privacy', 'Privacy — Performed For'], ['/terms', 'Terms — Performed For']] as const) {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.locator('h1').count()).toBe(1);
    expect(await page.locator('html').getAttribute('lang')).toBe('en');
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://end-client-reference.sociobot.in${route}`);
  }
});

test('uses the standard shell and deployment document for unknown routes', async ({ page }) => {
  await page.goto('/not-a-product-route');
  await expect(page.getByRole('heading', { name: 'This route is not on the map.' })).toBeVisible();
  await expect(page).toHaveTitle('Page not found — Performed For');
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('nav')).toBeVisible();
  await expect(page.locator('footer')).toContainText(/v1\.0\.0 · build [a-f0-9]{12}/);
  expect(await readFile('dist/404.html', 'utf8')).toBe(await readFile('dist/index.html', 'utf8'));
});

test('captures and verifies a returned one-time license @claim:one-time-unlock', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/end-client-reference/verify**', (route) => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null })
  }));
  await page.evaluate(() => localStorage.setItem('pf_generation_count', '3'));
  await page.goto('/?license=test-license-token');
  await expect(page).not.toHaveURL(/license=/);
  await expect(page.locator('#license-badge')).toContainText('unlimited');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:end-client-reference'))).toBe('test-license-token');
  await expect(page.getByRole('link', { name: 'Buy the one-time unlock' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/end-client-reference/checkout');
  await page.locator('#invoice-file').setInputFiles({ name: 'licensed-invoice.pdf', mimeType: 'application/pdf', buffer: await invoiceBuffer() });
  await page.getByLabel('Billing client The company responsible for payment').fill('Licensed Prime');
  await page.getByLabel('Services performed for The ultimate customer; not the payer').fill('Licensed End Client');
  await page.getByLabel('Project / PO reference Preserved exactly as entered').fill('PAST-FREE-LIMIT');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Generate package' }).click();
  await downloadPromise;
  await expect(page.getByRole('cell', { name: 'PAST-FREE-LIMIT', exact: true })).toBeVisible();
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

test('keeps demo data isolated and discards it on exit @claim:demo-isolated', async ({ page }) => {
  await page.evaluate(async () => {
    const request = indexedDB.open('performed-for', 1);
    await new Promise<void>((resolve, reject) => {
      request.onupgradeneeded = () => request.result.createObjectStore('relationships', { keyPath: 'id' });
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const database = request.result;
        const transaction = database.transaction('relationships', 'readwrite');
        transaction.objectStore('relationships').put({
          id: 'real-record', billingClient: 'Real Prime', endClient: 'Real End Client', reference: 'REAL-ONLY',
          invoiceNumber: '', servicePeriod: '', sourceFileName: 'real.pdf', createdAt: '2026-08-29T12:00:00.000Z',
        });
        transaction.oncomplete = () => { database.close(); resolve(); };
        transaction.onerror = () => reject(transaction.error);
      };
    });
  });
  await page.goto('/?demo=1');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://end-client-reference.sociobot.in/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('northline-studio-invoice.pdf · sample invoice ready')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Harbour Arts Council' })).toBeVisible();
  await expect(page.getByText('REAL-ONLY', { exact: true })).toHaveCount(0);
  await page.getByLabel('Project / PO reference Preserved exactly as entered').fill('DISCARD-ME');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Generate package' }).click();
  await downloadPromise;
  await expect(page.getByRole('cell', { name: 'DISCARD-ME', exact: true })).toBeVisible();
  await page.evaluate(() => localStorage.setItem('demo:pf_generation_count', '7'));
  await page.getByRole('link', { name: 'Start for real' }).first().click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('cell', { name: 'REAL-ONLY', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('demo:pf_generation_count'))).toBeNull();
  expect(await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name))).not.toContain('demo:performed-for');
  await page.goto('/demo');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.getByRole('cell', { name: 'Harbour Arts Council' })).toBeVisible();
  await expect(page.getByText('DISCARD-ME', { exact: true })).toHaveCount(0);
  await expect(page.getByText('REAL-ONLY', { exact: true })).toHaveCount(0);
});

test('keeps every original invoice content stream intact @claim:original-invoice-intact', async ({ page }) => {
  await page.goto('/');
  const source = await detailedInvoiceBuffer();
  await page.locator('#invoice-file').setInputFiles({ name: 'two-page-invoice.pdf', mimeType: 'application/pdf', buffer: source });
  await page.getByLabel('Billing client The company responsible for payment').fill('Prime Office');
  await page.getByLabel('Services performed for The ultimate customer; not the payer').fill('End Client Office');
  await page.getByLabel('Project / PO reference Preserved exactly as entered').fill('INTACT-42');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Generate package' }).click();
  const download = await downloadPromise;
  const output = await readFile((await download.path())!);
  const merged = await PDFDocument.load(output);
  expect(merged.getPageCount()).toBe(3);
  expect(merged.getPage(1).getWidth()).toBe(400);
  expect(merged.getPage(2).getWidth()).toBe(612);
  expect((await contentHashes(output)).slice(1)).toEqual(await contentHashes(source));
});

test('accepts 25 MiB PDFs and rejects larger files @claim:pdf-size-limit', async ({ page }) => {
  await page.goto('/');
  const source = await invoiceBuffer();
  const exactLimit = Buffer.alloc(25 * 1024 * 1024, 0x20);
  source.copy(exactLimit);
  await page.locator('#invoice-file').setInputFiles({ name: 'exactly-25-mib.pdf', mimeType: 'application/pdf', buffer: exactLimit });
  await page.getByLabel('Billing client The company responsible for payment').fill('Boundary Prime');
  await page.getByLabel('Services performed for The ultimate customer; not the payer').fill('Boundary End Client');
  await page.getByLabel('Project / PO reference Preserved exactly as entered').fill('LIMIT-25');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Generate package' }).click();
  await downloadPromise;
  const tooLarge = Buffer.alloc(25 * 1024 * 1024 + 1, 0x20);
  source.copy(tooLarge);
  await page.locator('#invoice-file').setInputFiles({ name: 'over-25-mib.pdf', mimeType: 'application/pdf', buffer: tooLarge });
  await page.getByRole('button', { name: 'Generate package' }).click();
  await expect(page.locator('#file-error')).toHaveText('This PDF is over 25 MB. Choose a smaller copy.');
});

test('allows three free packages and blocks the fourth @claim:three-free-packages', async ({ page }) => {
  await page.goto('/');
  await page.locator('#invoice-file').setInputFiles({ name: 'free-invoice.pdf', mimeType: 'application/pdf', buffer: await invoiceBuffer() });
  await page.getByLabel('Billing client The company responsible for payment').fill('Free Prime');
  await page.getByLabel('Services performed for The ultimate customer; not the payer').fill('Free End Client');
  await page.getByLabel('Project / PO reference Preserved exactly as entered').fill('FREE-BOUNDARY');
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Generate package' }).click();
    await downloadPromise;
  }
  expect(await page.evaluate(() => localStorage.getItem('pf_generation_count'))).toBe('3');
  await page.getByRole('button', { name: 'Generate package' }).click();
  await expect(page.locator('#form-error')).toHaveText('You’ve used the 3 free packages. Restore or buy the one-time unlock to keep generating.');
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
  const stored = await page.evaluate(async () => {
    const request = indexedDB.open('demo:performed-for');
    return new Promise<unknown[]>((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const database = request.result;
        const getAll = database.transaction('relationships').objectStore('relationships').getAll();
        getAll.onsuccess = () => { database.close(); resolve(getAll.result); };
        getAll.onerror = () => reject(getAll.error);
      };
    });
  });
  expect(JSON.stringify(stored)).not.toContain('%PDF-');
  expect(Object.keys(stored[0] as Record<string, unknown>).sort()).toEqual([
    'billingClient', 'createdAt', 'endClient', 'id', 'invoiceNumber', 'reference', 'servicePeriod', 'sourceFileName',
  ]);
});

test('shows focus on Import JSON and moves focus after skip and route navigation', async ({ page }) => {
  await page.goto('/');
  await page.locator('#import-json').focus();
  await expect(page.getByText('Import JSON', { exact: true })).toHaveCSS('outline-style', 'solid');
  await page.locator('.skip-link').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.getByRole('link', { name: 'Privacy' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('keeps interactive touch targets at least 44px at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const summary = await page.getByText('Have a license?', { exact: true }).boundingBox();
  const privacy = await page.getByRole('link', { name: 'Privacy' }).last().boundingBox();
  const terms = await page.getByRole('link', { name: 'Terms' }).boundingBox();
  expect(summary?.height).toBeGreaterThanOrEqual(44);
  expect(privacy?.height).toBeGreaterThanOrEqual(44);
  expect(terms?.height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
