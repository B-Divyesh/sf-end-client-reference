# Performed For — verification 7 handoff

## Status

**FAIL — do not release candidate `a9a401c032f132cd94ab7b0d830be81510cfb253`.**

Independent verification was performed on 2026-08-30 against <https://end-client-reference.sociobot.in>. No product code was changed. The live deployment is byte-for-byte identical to the candidate and reports build `15db9088cbc7`.

## Release blocker

`@claim:three-free-packages` fails reproducibly in the supported full live Playwright run:

```text
PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npx playwright test
Expected: "3"
Received: "2"
tests/e2e/workspace.spec.ts:424
34 passed, 1 failed
```

Two full live runs failed identically. All 21 literal claim commands pass individually after `npm ci`, three isolated live reruns pass, the full local `npm test` passes, and a manually synchronized live flow correctly permits three packages and blocks the fourth. The test observes the download before the app completes its awaited IndexedDB write and counter update. Under the supplied contract, any failing claim test blocks release even when the underlying user boundary passes.

## Verification summary

- `npm ci`, audit, lint, strict typecheck, full local test suite (9 unit + 35 browser), and exact build: PASS.
- First-read plain words and one-click isolated demo: PASS.
- Normal Unicode invoice flow, merged PDF, exact log/CSV/JSON, invalid input recovery, 25 MiB boundary, and paid limit behavior: PASS.
- Desktop/390 px, keyboard, focus, reduced motion, and axe on all routes/404: PASS; zero axe violations.
- Privacy request log: only same-origin GETs during generation/export; no analytics or uploads.
- Headers, immutable asset caching, manifest MIME/icons, internal links, and real 404: PASS.
- PWA live offline reload/generation and local changed-worker update notice: PASS.
- Billing checkout: HTTP 303 to hosted checkout. Verification allowance: 30 requests; request 31 returned 429 with `Retry-After: 3`.
- Lighthouse mobile performance: 88/95/98, median 95; accessibility/best practices/SEO: 100.
- Initial bundles: 12,253-byte gzip JS, 4,037-byte gzip CSS, 42,142-byte mobile hero; lazy PDF engine 175,601 bytes gzip.

## Other findings

- Low: `/demo` visually orders `02 Relationship` before `01 Source invoice`.
- Low: a returned `?license=` token appears in same-origin asset `Referer` headers before `history.replaceState` strips it.

Full commands, hashes, evidence, and remediation guidance are in `.factory/verification-7.md`.

## How to reproduce

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npx playwright test
```

After repairing the live claim timing, rerun every command in `.factory/claims.json` individually and repeat the complete live suite before changing this status to PASS.
