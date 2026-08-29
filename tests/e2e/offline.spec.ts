import { expect, test } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { readFile } from 'node:fs/promises';

async function waitForWorkerControl(page: import('@playwright/test').Page) {
  return page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) => {
        navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true });
      });
    }
    return {
      active: registration.active?.state,
      controlled: navigator.serviceWorker.controller !== null,
      scriptURL: registration.active?.scriptURL,
    };
  });
}

test('reloads and generates a package offline from a fresh production visit @claim:offline-reload', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    serviceWorkers: 'allow',
  });
  const page = await context.newPage();

  try {
    await page.goto('/demo', { waitUntil: 'load' });
    await expect(page.getByRole('heading', { name: 'Add the end client to every invoice.' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate package' })).toBeVisible();

    const workerState = await waitForWorkerControl(page);
    expect(workerState).toEqual({
      active: 'activated',
      controlled: true,
      scriptURL: new URL('/sw.js', page.url()).href,
    });

    const precache = await page.evaluate(async () => {
      const names = (await caches.keys()).filter((name) => name.startsWith('performed-for-'));
      const requests = (await Promise.all(names.map(async (name) => (await (await caches.open(name)).keys()).map((request) => request.url)))).flat();
      return { names, requests };
    });
    expect(precache.names).toHaveLength(1);
    expect(precache.requests.some((url) => /\/assets\/[^/]+\.js$/.test(url))).toBe(true);

    await context.setOffline(true);
    const reloadResponse = await page.reload({ waitUntil: 'load' });
    expect(reloadResponse?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'Add the end client to every invoice.' })).toBeVisible();
    await expect(page.getByText('Offline.', { exact: false })).toBeVisible();
    await expect(page.getByText('northline-studio-invoice.pdf · sample invoice ready')).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Generate package' }).click();
    const download = await downloadPromise;
    const path = await download.path();
    expect(path).toBeTruthy();
    const output = await PDFDocument.load(await readFile(path!));
    expect(output.getPageCount()).toBe(2);
    await expect(page.locator('#toast')).toContainText('Package ready');
  } finally {
    await context.setOffline(false);
    await context.close();
  }
});

test('installs a changed service worker and announces the update', async ({ browser }) => {
  const originalWorker = await readFile('dist/sw.js', 'utf8');
  const updatedWorker = originalWorker.replace(/const VERSION = '([^']+)'/, "const VERSION = '$1-update'");
  let serveUpdate = false;
  const contentTypes: Record<string, string> = {
    '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
    '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.webp': 'image/webp',
  };
  const server = createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
      const relativePath = pathname === '/sw.js' ? 'sw.js'
        : pathname === '/' || !pathname.split('/').at(-1)?.includes('.') ? 'index.html'
          : pathname.slice(1);
      const body = relativePath === 'sw.js'
        ? Buffer.from(serveUpdate ? updatedWorker : originalWorker)
        : await readFile(`dist/${relativePath}`);
      const extension = `.${relativePath.split('.').at(-1)}`;
      response.writeHead(200, {
        'Content-Type': contentTypes[extension] ?? 'application/octet-stream',
        'Cache-Control': relativePath === 'sw.js' ? 'no-store' : 'public, max-age=60',
      });
      response.end(body);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address() as AddressInfo;
  const origin = `http://127.0.0.1:${address.port}`;
  const context = await browser.newContext({ serviceWorkers: 'allow' });
  const page = await context.newPage();

  try {
    await page.goto(`${origin}/demo`, { waitUntil: 'load' });
    await waitForWorkerControl(page);
    serveUpdate = true;
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) throw new Error('No service-worker registration to update');
      await registration.update();
    });
    await expect(page.locator('#toast')).toHaveText('A newer version is ready. Reload when convenient.');
    await expect(page.locator('#toast')).toBeVisible();
    await expect.poll(() => page.evaluate(async () => (await caches.keys()).filter((name) => name.startsWith('performed-for-'))))
      .toEqual([expect.stringMatching(/-update$/)]);
  } finally {
    await context.close();
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
