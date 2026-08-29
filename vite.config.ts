import { defineConfig } from 'vite';
import { execFileSync } from 'node:child_process';
import packageJson from './package.json' with { type: 'json' };

const buildId = process.env.GITHUB_SHA?.slice(0, 12)
  ?? execFileSync('git', ['rev-parse', '--short=12', 'HEAD'], { encoding: 'utf8' }).trim();

export default defineConfig({
  build: { target: 'es2022', sourcemap: true },
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __BUILD_ID__: JSON.stringify(buildId),
  },
});
