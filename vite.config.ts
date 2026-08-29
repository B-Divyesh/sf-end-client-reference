import { defineConfig } from 'vite';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import packageJson from './package.json' with { type: 'json' };

const productFiles = [
  'index.html',
  'public/sw.js',
  'scripts/copy-routes.mjs',
  ...readdirSync('src', { recursive: true }).map((name) => `src/${name}`),
].sort();
const buildId = process.env.VITE_BUILD_ID ?? productFiles.reduce(
  (hash, file) => hash.update(file).update(readFileSync(file)),
  createHash('sha256'),
).digest('hex').slice(0, 12);

export default defineConfig({
  build: { target: 'es2022', sourcemap: true },
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __BUILD_ID__: JSON.stringify(buildId),
  },
});
