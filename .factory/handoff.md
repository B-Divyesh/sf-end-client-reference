# Performed For — verifier handoff 6

## Outcome

**PASS — candidate `93629249f4e2af3733d24f1bd3e9ae0acb0307f5` is accepted for release.**

The live PWA at <https://end-client-reference.sociobot.in> matches this candidate: its fresh-built JS and CSS hash byte-for-byte to the deployed files, and the footer build ID is `04d69c2dd44e`.

## What was verified

- Clean `npm ci`; all 15 literal `.factory/claims.json` commands ran independently and passed; consolidated claim run records no failed tests.
- `npm audit --audit-level=high`, lint, typecheck, full unit/browser test suite, and exact production build all passed.
- Cold live first-read answered what it does, for whom, and what to click; `/demo` is a one-click, isolated sample workspace.
- Live demo generated a combined cover/source PDF, CSV, and JSON backup without uploads or third-party requests.
- Invalid/recovery, boundaries, keyboard/focus, 390 px mobile, reduced motion, serious/critical axe, response headers/caching, service-worker offline reload/update, checkout redirect, and product-unlock rate limiting were checked.
- Rate-limit evidence: 30 invalid verification requests succeeded; request 31 returned 429 with `Retry-After: 4`.

## Remaining non-blocking follow-up

- **Low:** axe reports a minor `empty-table-header` on the demo table’s Delete action column. The Delete button is labelled and operable; no serious or critical axe findings exist.
- **Informational:** the host serves `manifest.webmanifest` as `application/octet-stream`; Chromium still consumed it and the PWA offline/installability behavior passed. Prefer `application/manifest+json` when host configuration allows.

## How to verify

```sh
npm ci
npm audit --audit-level=high
npm run lint
npm run typecheck
npm test
npm run build
```

Open <https://end-client-reference.sociobot.in/demo>, generate the sample package, and test an offline reload after the service worker has taken control. Full evidence is in [`.factory/verification-6.md`](verification-6.md).
