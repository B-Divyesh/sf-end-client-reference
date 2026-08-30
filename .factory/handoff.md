# Performed For — verification 9 handoff

## Current independent-verification outcome

**PASS.** Candidate commit `828ae0ad4149f35d97d43753ee4ed1ff6ffd46b3` is accepted at <https://end-client-reference.sociobot.in>.

Verification 9 ran all 27 registry claim commands independently after `npm ci`, then typecheck, lint, the exact production build, and the full local suite (10 unit + 46 browser tests). All passed. The full suite also passed against the deployment (10 unit + 45 live browser tests; only the intentionally local service-worker replacement simulation skipped).

Cold desktop and 390 px QA passed: first-read wording and one-click sample, normal package generation, input recovery, keyboard and focus, reduced motion, zero serious/critical Axe findings, privacy request logging, response headers/caching, PWA offline reload, local service-worker update simulation, bundle budgets, deployment artifact SHA-256 equality, and billing verification rate limiting. A successful repeat mobile Lighthouse run scored 91 performance, 100 accessibility, 100 best practices, and 100 SEO.

Detailed fresh evidence and the defect table are in [verification-9.md](verification-9.md). No product defects were found. No real payment was made; payment verification stops at the public hosted-checkout redirect and fixture-based license tests.

## Run and verify

```sh
npm ci
npm run typecheck
npm run lint
npm run build
npm test
PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npm test
```

---

# Performed For — polish round 3 handoff

## Outcome

**PASS.** All six review-3 findings and every earlier review finding are resolved. The repaired PWA is live at <https://end-client-reference.sociobot.in>; the isolated one-click sample is <https://end-client-reference.sociobot.in/?demo=1>.

Product repair commits: `9f60c04` and `d536874`.

## What changed

- Made `/#records` a real hash destination on direct load and from every route. It scrolls to the log, focuses its heading, announces the destination, and preserves Back state.
- Clear the selected invoice from memory, the file input, and visible state after every successful download.
- Added the `invoice-cleared-after-download` and `hosted-checkout` claims with browser tests.
- Added visible and accessible hosted-checkout disclosure. Legal copy now matches the hosted page’s tested merchant, inquiry, and returns boundary.
- Replaced “metadata” with the actual saved fields.
- Made external-base Playwright runs independent of `dist/`; only the intentionally local service-worker replacement simulation skips against a deployment.
- Updated the catalog description, README, demo notes, claims registry, and complete copy audit.
- Preserved the topographic-cartography design, local IndexedDB namespaces, static PWA deployment class, and existing feature behavior.

## Verification

### Clean clone and claims

A no-hard-link clone of `d536874` at `/tmp/performed-for-polish3-final.JTP8wE/clone` ran `npm ci` with zero vulnerabilities. All 27 literal commands in `.factory/claims.json` passed independently.

Evidence: [clean-claim-results.json](polish-artifacts/round-3/clean-claim-results.json).

### Local gates

- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm test`: PASS — 10 unit tests and 46 Chromium tests.
- `npm run build`: PASS — `dist/index.html`, direct route files, 404, host config, and versioned service worker produced.
- Bundle: 12.75 KB initial JavaScript gzip and 4.11 KB CSS gzip. The 175.81 KB PDF engine is lazy-loaded.
- Axe integration: zero serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, and 404.
- Local `verify-url.sh`: PASS on root, demo, privacy, and terms with no console errors.
- Mobile Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.36 s, CLS 0, TBT 59 ms.

### Deployment and cold live checks

The built `dist/` was uploaded only to the existing Azure Static Web App `sf-end-client-reference`. No DNS, shared service, database, or unrelated resource was read or changed.

- Fresh remote clone at `d536874`, with no `dist/`: `PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npm test` passed 10 unit and 45 live browser tests. One local-only service-worker replacement simulation skipped; the deployed offline-reload test passed.
- `verify-url.sh`: PASS on root, demo, privacy, and terms; all had one h1, `lang=en`, a main landmark, complete alt text, and no console errors.
- Cold 390×844 flow: all first-screen facts fit; `?demo=1` showed the banner, prepared invoice, sample row, and fields; generation made a two-page PDF and cleared the selected file; Reset restored one seed row and the sample file.
- Direct and cross-route `/#records`: URL correct, focus `records-title`, announcement “Relationship log,” and log in view.
- Unknown path: HTTP 404 with “This page does not exist.”
- Manifest: HTTP 200 with `application/manifest+json`.
- Link crawl: all internal and legal links returned 200; purchase returned 303 to hosted Dodo checkout; mail links were explicit.
- Runtime requests during the cold demo flow were same-origin; no console or page errors occurred.
- Live mobile Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.11 s, CLS 0, TBT 34 ms.

Evidence: [polish-3.md](polish-3.md), [live cold flow](polish-artifacts/round-3/live-cold.json), [live suite](polish-artifacts/round-3/live-clean-suite.json), [Lighthouse](polish-artifacts/round-3/lighthouse-summary.json), and route screenshots under `.factory/polish-artifacts/round-3/`.

## Run and verify

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

Test the deployment from a clean checkout:

```sh
PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npm test
```

## Known gaps

None. No payment was made during verification; the checkout claim intentionally stops at the hosted 303 redirect.
