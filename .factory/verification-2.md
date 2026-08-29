# Independent verification 2 — FAIL

Verified on 2026-08-29 against candidate commit `4fda8b548775d673dcf7c9db2b23ff67307f1076` and <https://end-client-reference.sociobot.in>.

## Verdict

**FAIL — do not release.** The local-first cover-sheet workflow, demo, claims, PWA, and quality gates pass. The product nevertheless advertises a $19 unlimited unlock whose live production checkout endpoint returns **HTTP 404**, so a customer cannot buy the advertised product.

## Required first checks

`.factory/claims.json` exists and was read before the broader QA run. After a clean `npm ci` (60 packages; 0 audit vulnerabilities), every listed command was executed independently through the shipped Playwright demo entry point:

| Claim | Command | Result |
| --- | --- | --- |
| Isolated sample data | `npm test -- --grep @claim:demo-isolated` | PASS |
| Original invoice intact | `npm test -- --grep @claim:original-invoice-intact` | PASS |
| CSV export | `npm test -- --grep @claim:csv-export` | PASS |
| Offline reload | `npm test -- --grep @claim:offline-reload` | PASS |
| Runs on device | `npm test -- --grep @claim:runs-on-device` | PASS |
| No analytics | `npm test -- --grep @claim:no-analytics` | PASS |
| No cloud document storage | `npm test -- --grep @claim:no-cloud-document-storage` | PASS |
| $19 one-time unlock behavior | `npm test -- --grep @claim:one-time-unlock` | PASS (fixture verification and production URL assertion) |
| Exact relationship text | `npm test -- --grep @claim:exact-relationship-text` | PASS |

The final Playwright result was `passed` with no failed tests.

Cold live first read: **Performed For adds a cover page identifying the end client on an existing invoice PDF for subcontractors and white-label agencies. Click “Try it with sample data” first.** The first screen says this in plain words and the click opens `/demo`, a completed Northline Studio route. It has the required persistent `Demo — sample data, nothing is saved` banner, Reset demo, and Start for real controls. This gate passes.

## Environment, identity, and automated gates

- Clean checkout was exactly `4fda8b548775d673dcf7c9db2b23ff67307f1076`; no product files were changed during verification.
- `npm test`: PASS — 3 Vitest tests and 13 Chromium Playwright tests.
- `npm run build`: PASS — `tsc --noEmit`, Vite production build, and route copy; it writes `dist/`. There is no separate lint script.
- `npm audit --audit-level=high`: PASS — 0 vulnerabilities.
- `dist/index.html`, both entry assets, the lazy PDF chunk, `sw.js`, and `manifest.webmanifest` were byte-for-byte equal to fresh live downloads. The live deployment is this candidate, not a deployment-only variant.
- Production output is 10.65 KB gzip initial JS and 3.62 KB gzip CSS. The 175.81 KB gzip PDF engine is lazy-loaded only when needed. These are within the static/PWA first-load budgets.

## End-to-end checks

On a production preview, I entered `Prime & Co.`, `Harbour Arts Council`, and `PO/42 · Phase A` with a generated valid one-page PDF. The app downloaded `PO-42-Phase-A-performed-for.pdf`, whose PDF parse had two pages, and added the end client to the relationship log.

Boundary and recovery checks passed:

- A file with a PDF MIME type but invalid signature showed: “This does not appear to be a PDF. Choose the original invoice PDF.”
- A 26 MiB `%PDF-` file showed: “This PDF is over 25 MB. Choose a smaller copy.”
- Whitespace-only required relationship input is rejected with an announced, focused explanation (covered by the full suite).
- Maximum permitted 180/180/220-character relationship values, including Unicode, are captured in canvas draws without truncation (claim test).
- The demo generated a merged PDF with a cover followed by the original invoice page and exported the expected CSV row.

Desktop and 390 × 844 mobile both render and operate. At mobile width the relationship table is intentionally horizontally scrollable within its own `table-scroll` control; the document body remains 390 px wide. Keyboard Tab reaches the skip link, navigation, fields, actions, and export controls; Enter submits the package form. The CSS supplies the product coral focus treatment and the skip link is exposed first. Reduced-motion mode reduces transition duration to `0.01ms`.

## Privacy, accessibility, PWA, headers, and caching

- Fresh live desktop Playwright request log for landing → demo contained only same-origin GETs for document, artwork, CSS/JS, and icon. It recorded no analytics, trackers, cloud document requests, or third-party scripts. The demo does not call billing.
- Live page had no console errors or page errors. Axe on landing and demo reported no violations; specifically zero serious or critical findings.
- Live response headers include CSP with `frame-ancestors 'none'`, `connect-src 'self' https://api.sociobot.in`, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a restrictive Permissions-Policy. Hashed assets and artwork are `public, max-age=31536000, immutable`; `sw.js` is `no-cache`.
- `/`, `/demo`, `/privacy`, `/terms`, manifest, robots, sitemap, service worker, and social image return 200. An unknown route returns 404 with the styled “This route is not on the map.” page.
- The manifest has proper standalone display, scope/start URL, theme/background colors, and 192/512/maskable icons.
- Offline: after service-worker control, setting the fresh browser context offline and reloading preserved the workspace and displayed the Offline notice.
- Update: a controlled static-server simulation served the shipped worker then a new build ID. `registration.update()` made two worker requests, installed `performed-for-update-test` alongside the old cache, and displayed “A fresh map is ready. Reload when convenient.” No console errors occurred.

## Billing and API allowance

The visible live purchase link is correctly formed as `https://api.sociobot.in/api/v1/products/end-client-reference/checkout`, but a fresh GET on 2026-08-29 returned **404 JSON**. This is also the product registration dependency recorded in the previous handoff; it is fresh evidence, not a deployment-only failure.

The product has no sign-in flow, so Entra tenant validation is not applicable. For the product-unlock verification endpoint, a single client sent invalid-license requests to the live production endpoint: requests 1–30 returned 200 (`valid: false`, `reason: invalid`), while request 31 returned **429** with **`Retry-After: 3`**. Observed allowance: 30 verification requests per window; the window duration is not documented. The request allowance requirement passes.

## Defects

### Critical — release blocker

1. **Production checkout is unavailable.** `GET https://api.sociobot.in/api/v1/products/end-client-reference/checkout` returns 404 while the UI advertises “Buy the one-time unlock” for $19. This prevents the advertised unlimited product from being purchased. Register/configure the production Sociobot product and hosted checkout (with return URL `https://end-client-reference.sociobot.in/`), then re-verify the live checkout redirect and returned-license flow.

## Passed areas

The actual brief workflow is useful and local: it creates a clearly labelled companion cover, keeps the payer distinct from the end client, preserves input, appends the original invoice, and exports the relationship log. The one-click isolated demo, all listed claim tests, normal and invalid paths, desktop/mobile interaction, keyboard semantics, accessibility scan, privacy request log, service-worker offline/update behavior, headers, caching, bundle budget, type/build/test gates, and product-unlock rate limit passed.
