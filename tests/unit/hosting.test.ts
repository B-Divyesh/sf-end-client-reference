import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('static-host release policy', () => {
  it('ships CSP, immutable asset caching, and a real 404 response override', async () => {
    const config = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8')) as {
      globalHeaders: Record<string, string>;
      routes: Array<{ route: string; headers?: Record<string, string> }>;
      responseOverrides: Record<string, { rewrite: string; statusCode: number }>;
    };
    expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(config.globalHeaders['Content-Security-Policy']).toContain('https://api.sociobot.in');
    expect(config.globalHeaders['Referrer-Policy']).toBe('no-referrer');
    expect(config.routes.find((route) => route.route === '/assets/*')?.headers?.['Cache-Control']).toContain('immutable');
    expect((config as { mimeTypes?: Record<string, string> }).mimeTypes?.['.webmanifest']).toBe('application/manifest+json');
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
    const routeBuilder = await readFile('scripts/copy-routes.mjs', 'utf8');
    expect(routeBuilder).toContain("new URL('../dist/index.html'");
    expect(routeBuilder).toContain("new URL('../dist/404.html'");
    const entryDocument = await readFile('index.html', 'utf8');
    expect(entryDocument).toContain('<meta name="referrer" content="no-referrer" />');
  });

  it('always tests the PWA through a fresh production preview', async () => {
    const playwrightConfig = await readFile('playwright.config.ts', 'utf8');
    expect(playwrightConfig).toContain("command: 'npm run build && npm run preview -- --port 4173'");
    expect(playwrightConfig).toContain('reuseExistingServer: false');
  });
});
