import { readFile, readdir } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

interface Claim {
  id: string;
  claim: string;
  where: string;
  test: string;
  sandbox: string;
}

describe('public claim registry', () => {
  it('gives every declared claim one exact browser-test tag', async () => {
    const claims = JSON.parse(await readFile('.factory/claims.json', 'utf8')) as Claim[];
    const browserTests = (await Promise.all(
      (await readdir('tests/e2e'))
        .filter((name) => name.endsWith('.spec.ts'))
        .map((name) => readFile(`tests/e2e/${name}`, 'utf8')),
    )).join('\n');
    expect(new Set(claims.map(({ id }) => id)).size).toBe(claims.length);
    for (const claim of claims) {
      expect(claim.claim).not.toBe('');
      expect(claim.where).not.toBe('');
      expect(claim.sandbox).not.toBe('');
      expect(claim.test).toBe(`npm test -- --grep @claim:${claim.id}`);
      expect(browserTests.split(`@claim:${claim.id}`).length - 1, claim.id).toBe(1);
    }
  });
});
