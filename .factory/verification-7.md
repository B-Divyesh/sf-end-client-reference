# Independent product verification 7 — FAIL

Verified 2026-08-30 against candidate commit `a9a401c032f132cd94ab7b0d830be81510cfb253` at <https://end-client-reference.sociobot.in>.

## Decision

**FAIL — do not release this candidate.**

The deployed product matches the candidate and the real invoice-cover workflow works. All 21 claim commands pass individually after the locked install, and the complete local suite passes. However, the claim-tagged `three-free-packages` test fails reproducibly in the repository's supported two-worker live suite. The supplied acceptance contract says any failing claim test is release-blocking. Two independent full live runs each ended with 34 passed and that same 1 failure.

No product code was changed during verification.

## Mandatory first checks

### Cold first read and demo

**PASS.** A fresh desktop context with no stored data answers all three first-screen questions in plain words:

- What it does: adds a clear end-client cover to an existing invoice PDF.
- Who it is for: subcontractors and white-label agencies.
- What to do first: click **Try it with sample data**.

One click opened `/demo` with a prepared Northline Studio invoice, completed relationship fields, and a sample log row. The persistent **Demo — sample data, nothing is saved** banner includes **Reset demo** and **Start for real**. At 390 px, the headline, audience, action, and price/privacy/offline facts all appear in the first viewport.

### Registered claims

`.factory/claims.json` exists with 21 unique entries. The initial literal launch before dependency installation could not start because `vitest` was absent from the clean clone. After the required `npm ci`, every listed command was rerun individually and passed:

| Claim | Individual clean-install result |
| --- | --- |
| `demo-isolated` | PASS |
| `original-invoice-intact` | PASS |
| `csv-export` | PASS |
| `json-backup` | PASS |
| `json-import` | PASS |
| `record-deletion` | PASS |
| `offline-reload` | PASS |
| `runs-on-device` | PASS |
| `no-analytics` | PASS |
| `no-cloud-document-storage` | PASS |
| `one-time-unlock` | PASS |
| `relationship-recall` | PASS |
| `license-restore-anywhere` | PASS |
| `demo-reset` | PASS |
| `invalid-record-recovery` | PASS |
| `billing-api-only` | PASS |
| `end-client-not-payer` | PASS |
| `no-third-party-runtime-assets` | PASS |
| `pdf-size-limit` | PASS |
| `three-free-packages` | PASS individually; FAIL in both full live-suite runs |
| `exact-relationship-text` | PASS |

The live failure is stable under the full suite:

```text
PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npx playwright test
Expected: "3"
Received: "2"
tests/e2e/workspace.spec.ts:424
34 passed, 1 failed
```

The exact same result occurred on two independent full live runs. Three isolated live reruns of `@claim:three-free-packages` passed, and a manually synchronized live flow counted `1`, `2`, `3`, then blocked the fourth download. The cause is observable ordering: the browser download event fires before the app finishes its awaited IndexedDB write and increments `pf_generation_count`. Under the full suite's parallel load, the assertion reads the count during that gap. The user-facing Generate button remains disabled until the write completes, so the normal boundary works, but the registered claim test is not reliable in the supported live run.

## Candidate identity and local gates

| Check | Result |
| --- | --- |
| Candidate | PASS — `HEAD` and `origin/main` were exactly `a9a401c032f132cd94ab7b0d830be81510cfb253` before report changes. |
| `npm ci` | PASS — 143 packages installed; 0 audit vulnerabilities. |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities. |
| `npm run lint` | PASS — 0 warnings/errors. |
| `npm run typecheck` | PASS. |
| `npm test` | PASS — 9 Vitest tests and 35 Chromium tests. |
| `npm run build` | PASS — exact production build created `dist/`. |
| `git diff --check` | PASS before report edits. |

## End-to-end and recovery evidence

A fresh live ordinary workspace processed a generated source invoice with:

- Billing client: `Prime & Co.`
- End client: `Client Café 株式会社`
- Project / PO: `PO/42 · Phase A`
- Invoice number: `INV-007`

It downloaded `INV-007-performed-for.pdf` (107,800 bytes). Parsing found two pages: one cover plus the original page. The log, CSV, and version 1 JSON backup preserved the exact Unicode relationship fields.

Independent boundary and recovery checks passed:

- Spaces-only billing client: focused that input and announced `Enter the billing client; spaces alone are not a client name.`
- Malformed `%PDF-` input: announced `That file could not be read as a PDF. Choose the original invoice PDF and try again.`
- Exact 25 MiB versus 25 MiB plus one byte: accepted then rejected by the registered claim.
- Three free packages: synchronized live attempts counted 1, 2, and 3; a fourth produced no download and announced the paid-limit recovery action.
- Unavailable IndexedDB: showed a persistent warning and still downloaded the PDF.
- Full tests also cover malformed/wrong-version JSON, atomic import failure, poisoned stored records, deletion isolation, CSV formula neutralization, maximum Unicode relationship values, and source-PDF content streams.

The end-client helper and generated cover both state that the billing client remains the payer and the end client is not liable.

## Privacy, billing, headers, and routes

- A complete ordinary live generation plus CSV and JSON export made six requests, all same-origin GETs. No invoice upload, analytics, remote font, CDN, or third-party runtime asset request occurred. There were no console errors, page errors, or non-2xx responses.
- Live headers include CSP with `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and restrictive Permissions-Policy.
- HTML uses `public, must-revalidate, max-age=30`; hashed JS/CSS/art use `public, max-age=31536000, immutable`; `sw.js` and the manifest use `no-cache`.
- `/manifest.webmanifest` now returns `application/manifest+json`. It declares standalone display, a versioned start URL, matching colors, and 192/512/maskable icons.
- `/`, `/demo`, `/privacy`, and `/terms` return 200 with route-specific titles, descriptions, canonicals, and one h1. All internal links return 200. An unknown direct URL returns the styled page with HTTP 404.
- The public checkout endpoint returns HTTP 303 to the hosted Dodo checkout. An actual invalid-token restore used only `https://api.sociobot.in`, stayed locked, and displayed `License no longer active.`
- Rate-limit verification from one client: requests 1–30 returned 200 invalid verdicts; request 31 returned **429** with **`Retry-After: 3`**. Observed allowance: 30 requests per rate window.
- There is no sign-in, first-party backend, runtime AI, library, or CLI. Entra, backend concurrency/persistence, and clean-consumer package checks do not apply.

## Accessibility, mobile, PWA, and performance

- `/opt/fleet/lib/verify-url.sh` passed live `/`, `/demo`, `/privacy`, and `/terms`: correct titles, `lang=en`, one h1, main landmark, image alternatives, named controls, and no console/page errors.
- Independent axe 4.10 scans on desktop and 390 px mobile found **zero violations of any severity** on `/`, `/demo`, `/privacy`, `/terms`, and the styled 404.
- Keyboard-only mobile use reaches the skip link first, navigates to the demo, traverses its controls, and generates the package with Enter. Focus is a visible coral 3 px outline. No keyboard trap was found.
- At 390 px there is no document overflow on any route. Visible controls meet 44 px targets; copy remains at least 16 px in the repository's 320 px and 200%-zoom-equivalent tests.
- `prefers-reduced-motion: reduce` matched and left no animation or transition over 0.02 seconds.
- A fresh live 390 px context was controlled by `/sw.js`, created cache `performed-for-fa358e598ca7`, reloaded `/demo` offline with HTTP 200, showed the offline notice, and generated a valid two-page PDF. The changed-worker/update-toast test passes locally.
- Initial app JavaScript is 12,253 bytes gzip; CSS is 4,037 bytes gzip; the mobile hero is 42,142 bytes. The 175,601-byte gzip PDF engine is lazy-loaded only when needed. These meet the bundle budgets.
- Three Lighthouse 12.8.2 mobile runs scored performance **88, 95, 98** (median 95), accessibility **100** each, best practices **100**, and SEO **100**. LCP was 1.3–1.4 s, CLS 0, and TBT 170–470 ms. The median meets the ≥90 performance target; the first-run variance is recorded rather than hidden.

## Deployment identity

**PASS.** Fresh live downloads are byte-for-byte equal to the candidate's fresh `dist/` output:

| File | SHA-256 |
| --- | --- |
| `index.html` | `e4c8333eab532666662219a52b418301f8ea5a4c51fb639ad85e48a8599e39d6` |
| `assets/index-CEtRabuO.js` | `e6b01de6ea09a9ef45abe3e0beb0e4bf5d1c5c03ccf386bee7017becbf451481` |
| `assets/index-B7Ni2qMV.css` | `85bad48ae81c8cfca2232fd1922229e797aaf2231af17538dcc319f3a89c51f5` |
| `assets/es-Uy9YQt0W.js` | `e9d850e94ba91312c7041049c2a597f9427e9247b704d8f041789a9480b0d46a` |
| `sw.js` | `b437325e6431fcc404f2ec3ddea6f1fbadb9c13a3010eddff0411e5e5e59fa95` |
| `manifest.webmanifest` | `6fe40c1fbb1e81c8cef26fb125509c13b811f651d6c3a236111c79d019866526` |

Both artifacts report build ID `15db9088cbc7`. The previously reported deployment-only failure is not present.

## Defects by severity

### High — release-blocking claim test is timing-dependent

The `@claim:three-free-packages` test fails at `tests/e2e/workspace.spec.ts:424` in every full live run performed here (2/2), reading `2` after the third download event. It passes locally and in isolation because timing differs. The app starts the download before awaiting the relationship-log write and counter update. Make the completion state unambiguous and have the claim test wait for it. Until the registered test passes reliably in the supported live suite, the acceptance contract requires FAIL.

### Low — demo displays workflow steps out of numerical order

The demo deliberately moves the relationship fieldset ahead of the already prepared source invoice, but retains labels `02 Relationship` followed by `01 Source invoice` on desktop and mobile. This conflicts with the declared Invoice → Relationship → Download sequence. Renumber the demo presentation or keep the numbered sections in order.

### Low — returned license token appears in same-origin asset referrers

On a fresh visit to `/?license=secret-verification-token`, the app stores the token and strips the URL, but the initial image, JavaScript, and CSS requests carry the full token-bearing URL in their `Referer` header before the module runs. No third party receives it, but same-origin hosting/access logs can record a bearer license more than once. Use a stricter response `Referrer-Policy` such as `no-referrer` or `origin` for this static product and review query-string logging/retention.

## Required next step

Make the free-limit claim test deterministic against the live two-worker suite, then rerun all 21 literal claim commands, `npm test`, the complete live suite, and the independent boundary check. The two low-severity findings should be addressed in the same repair if practical.
