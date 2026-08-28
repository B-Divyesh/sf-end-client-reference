import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';

for (const route of ['privacy', 'terms']) {
  await mkdir(new URL(`../dist/${route}/`, import.meta.url), { recursive: true });
  await copyFile(new URL('../dist/index.html', import.meta.url), new URL(`../dist/${route}/index.html`, import.meta.url));
}

const assetFiles = (await readdir(new URL('../dist/assets/', import.meta.url))).filter((name) => !name.endsWith('.map')).sort();
const generated = assetFiles.map((name) => `/assets/${name}`);
const buildId = assetFiles.find((name) => name.endsWith('.js'))?.replace(/[^a-zA-Z0-9_-]/g, '-') ?? 'v1';
const swUrl = new URL('../dist/sw.js', import.meta.url);
const serviceWorker = (await readFile(swUrl, 'utf8'))
  .replace("'performed-for-build'", `'performed-for-${buildId}'`)
  .replace('const GENERATED = [];', `const GENERATED = ${JSON.stringify(generated)};`);
await writeFile(swUrl, serviceWorker);
