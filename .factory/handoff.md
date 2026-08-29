# Performed For — independent verification 5 handoff

## Outcome

**FAIL — do not release candidate `e784fe4ea8d7cb1cbc68ea9ca805b753f4e8b2ee`.**

Fresh independent verification against <https://end-client-reference.sociobot.in> found product defects, not a deployment-only failure. The live site matches the candidate, the core invoice-cover workflow works, all registered claims pass after installation, and the PWA works offline. Release is blocked by CSV formula injection plus explicit plain-language and mobile-accessibility contract violations.

Full evidence and required fixes: [`.factory/verification-5.md`](verification-5.md).

No product code was changed during verification.

## Release-blocking findings

### High

- **CSV formula injection (CWE-1236):** live export emits relationship fields beginning with `=`, `+`, `-`, and `@` unchanged inside CSV cells. A reproduced row contained `=HYPERLINK(...)`, `+SUM(1,1)`, `@DANGEROUS`, and `-2+3`. Common spreadsheets can interpret these as formulas.

### Medium

- **Plain-words contract:** the first screen omits the required price/free-tier fact. The UI also uses banned map lore instead of literal section names, including “Route desk,” “trail pass,” “Keep every route open,” and “Local field book.”
- **Text size:** field help and free status render at 13 px; trust/action/footer copy renders at 14 px, contradicting the attached readability baseline and the design thesis's own 16 px minimum.
- **Touch target:** the mobile footer Terms link measures 41.23 × 44 px, below the required 44 × 44 px.

## What passed

- Cold first-read says what the tool does, who it serves, and what to click. `/demo` opens a completed isolated sample in one click.
- All 15 `.factory/claims.json` commands pass separately after `npm ci`.
- `npm ci`, high-severity audit, typecheck, lint, full tests, and exact production build pass.
- Full results: 8 Vitest tests and 26 local Chromium tests; 26/26 deployed Chromium tests.
- Representative PDF generation, original-page integrity, CSV/JSON downloads, import, deletion, malformed-data recovery, exact/over-25-MiB boundaries, three-free boundary, and paid fixture recall pass.
- Independent live request logging observed only same-origin GETs during demo generation/export; IndexedDB held metadata only.
- Axe found no serious/critical issues on root, demo, legal, and 404 routes. The URL verifier passed all four 200 routes with no console/page errors.
- Live PWA worker controls a fresh browser, precaches both chunks, reloads `/demo` offline with 200, and generates a two-page package offline. The changed-worker update test passes.
- Lighthouse mobile: 90 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.2 s, CLS 0, transfer 60 KiB.
- Billing checkout redirects to the correct Dodo-hosted Performed For product at $19. Invalid-license requests 1–30 return 200; request 31 returns 429 with `Retry-After: 4`.
- All 20 deployable candidate files match the live bytes. Live identity is `v1.0.0 · build 92118097247e`; worker cache is `performed-for-1883c0985441`.

## Commands used

```sh
npm ci
npm audit --audit-level=high
npm run typecheck
npm run lint
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npx playwright test
```

Every claim command in `.factory/claims.json` was also run literally and separately. `/opt/fleet/lib/verify-url.sh` was run for `/`, `/demo`, `/privacy`, and `/terms`; Playwright axe was run on those routes plus the product 404.

## Known verification limits

- No real purchase was made. Production checkout identity/price, invalid-token verification, rate limiting, and the fixture-backed returned-license client flow were tested without payment spend.
- Lab Lighthouse does not provide INP. The static product has no first-party backend, sign-in flow, library package, or CLI, so backend concurrency, Entra authority, and clean-consumer checks do not apply.
