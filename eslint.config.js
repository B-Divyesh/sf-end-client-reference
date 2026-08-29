import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'test-results/**', 'playwright-report/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: { globals: { process: 'readonly', URL: 'readonly' } },
  },
  {
    files: ['public/sw.js'],
    languageOptions: {
      globals: {
        URL: 'readonly', Request: 'readonly', caches: 'readonly', fetch: 'readonly', self: 'readonly',
      },
    },
  },
);
