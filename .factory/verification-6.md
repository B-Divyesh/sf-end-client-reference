# Independent product verification 6 — PASS

Verified 2026-08-29 against candidate commit `93629249f4e2af3733d24f1bd3e9ae0acb0307f5` at <https://end-client-reference.sociobot.in>.

## Decision

**PASS — release this candidate.**

This was a fresh independent verification from the checked-out candidate. No product code was modified. The prior deployment-only concern is not present: the public JavaScript and CSS are byte-identical to this candidate’s fresh production build, and the live footer reports the same build ID, `04d69c2dd44e`.

## Mandatory first checks

### Cold first read and demo

**PASS.** A fresh desktop context with no stored data rendered, in plain words:

- What it does: “Add the end client to every invoice.”
- Who it is for: “subcontractors and white-label agencies.”
- First action: “Try it with sample data”; adjacent copy explains that it opens a completed invoice example in an isolated demo.

The one click opens `/demo` with the prepared Northline Studio PDF, completed fields, relationship row, persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start for real**. At 390 × 844 the headline, audience sentence, sample action, and `Three packages free · $19 once` are within the first viewport.

### Registered claims

`.factory/claims.json` exists with 15 well-formed claims. After the clean `npm ci`, I ran each literal command from its `test` field independently before other repository test work. Every command passed. A final `npx playwright test --grep '@claim:'` also passed; it runs 14 browser tests because `no-analytics` and `no-cloud-document-storage` intentionally share one tagged observable test. `test-results/.last-run.json` records `status: passed` with no failed tests.

| Claim | Result |
| --- | --- |
| `demo-isolated` | PASS — real data stays isolated; demo data/counter are discarded on exit and a later demo is reseeded. |
| `original-invoice-intact` | PASS — original content streams and pages remain intact after the cover. |
| `csv-export`, `json-backup`, `json-import`, `record-deletion` | PASS — exports parse, a v1 backup persists after import, and deleting one record preserves the other. |
| `offline-reload` | PASS — a fresh 390 px production PWA context reloaded `/demo` offline with HTTP 200 and generated a valid two-page package. |
| `runs-on-device`, `no-analytics`, `no-cloud-document-storage` | PASS — demo package generation made only same-origin GET requests; no PDF upload occurred. |
| `one-time-unlock`, `relationship-recall`, `three-free-packages` | PASS — fixture license crosses the free boundary and recalls relationships; three downloads work and the fourth is blocked. |
| `pdf-size-limit`, `exact-relationship-text` | PASS — exact 25 MiB is accepted, 25 MiB plus one byte is rejected, and maximum permitted strings reach the cover unchanged. |

## Local gates

| Check | Result |
| --- | --- |
| Candidate identity | PASS — `HEAD` was `93629249f4e2af3733d24f1bd3e9ae0acb0307f5` before verification. |
| `npm ci` | PASS — 143 packages installed. |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities. |
| `npm run lint` / `npm run typecheck` | PASS — no warnings or TypeScript errors. |
| `npm test` | PASS — 9 Vitest tests and 29 Chromium end-to-end tests. |
| `npm run build` | PASS — produced `dist/` and direct route documents. |

## Product and recovery exercise

- A fresh live demo downloaded `NL-1048-performed-for.pdf` (114,417 bytes), added its relationship row, exported CSV, and produced a parseable v1 JSON backup.
- The generated package is a cover followed by the source invoice. The UI distinguishes the billing client/payer from the ultimate customer and says the end client is not the payer.
- Local browser coverage exercised missing required input, whitespace-only fields, malformed PDF, malformed/wrong-version/wrong-typed backup, recoverable poisoned local records, exact/over-limit PDFs, free-limit boundary, CSV formula prefixes, and recovery without reload.
- There is no sign-in, first-party server endpoint, library package, CLI, or runtime AI feature; Entra, backend concurrency, and clean-consumer checks do not apply.

## Privacy, headers, routes, and billing

- Fresh live demo generation, CSV, and JSON backup requested only the page document and same-origin assets, all as GETs. There were no third-party scripts, fonts, analytics, errors, or document uploads.
- Live root headers include CSP with `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and restrictive Permissions-Policy. CSP permits only the documented Sociobot billing API connection.
- HTML is `public, must-revalidate, max-age=30`; hashed JS/CSS are `public, max-age=31536000, immutable`; `sw.js` is `no-cache`.
- `/`, `/demo`, `/privacy`, and `/terms` return 200; the styled unknown route returns HTTP 404. The manifest has standalone display, versioned start URL, and 192/512/maskable icons.
- The public checkout endpoint returns HTTP 303 to the hosted Dodo checkout. No purchase was made.
- Fresh invalid-license requests from one client returned 200 for requests 1–30. Request 31 returned **429** with **`Retry-After: 4`**. Observed verification allowance: 30 requests per rate window.

## Accessibility, responsive behavior, PWA, and performance

- `/opt/fleet/lib/verify-url.sh` passed live `/`, `/demo`, `/privacy`, and `/terms`: title, `lang=en`, exactly one h1, main landmark, image alternatives, named controls, and no console/page errors.
- Playwright axe found no serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, or the styled 404. Keyboard Tab reaches the skip link, nav, controls, and log; the designed coral focus ring is `3px`. Reduced-motion contexts reduce transitions and animations to `0.01ms`.
- Desktop and 390 px mobile were reviewed. The mobile view stacks the art and copy, keeps the sample action visible, and has no observed horizontal document overflow.
- A fresh live mobile context was controlled by `/sw.js`, cached `performed-for-2f449339a4ce`, and reloaded `/demo` offline with HTTP 200 and the offline notice. The checked changed-worker test passes locally and announces “A newer version is ready. Reload when convenient.”
- Initial live transfer sizes are 12,036 bytes compressed JavaScript, 3,809 bytes compressed CSS, and a 42,142-byte mobile hero; these are within the static-product budgets. A direct Lighthouse run crashed in this container; the fallback run had FCP 0.9 s, LCP 1.1 s, CLS 0, and no valid overall performance score because Chrome captured no screenshots, so no Lighthouse score is claimed.

## Deployment identity

**PASS.** Fresh `npm run build` generated the same `index-D2Nxrzgc.js`, `index-B8HbH33O.css`, and build ID as production. SHA-256 comparison was exact:

| File | SHA-256 |
| --- | --- |
| `assets/index-D2Nxrzgc.js` | `0d83c8f4e811ab5714fb617479104e9c525d9a20af8b3222dbf4fef69f07700a` |
| `assets/index-B8HbH33O.css` | `292dbfe8b9fcd42f00cff86307847edc89b60565dff05ecaf688861b122d950e` |

## Defects by severity

### Low — demo table has an empty action-column header

axe 4.10 reports `empty-table-header` as **minor** on `/demo`. The actual Delete control is labelled and keyboard-operable; there are no serious/critical findings. Add an accessible action-column header in a future polish pass.

### Informational — manifest response MIME type

The host returns `/manifest.webmanifest` as `application/octet-stream` rather than `application/manifest+json`. Chromium accepted and used the manifest, including its icons and standalone metadata. Configure the host MIME mapping when available; this did not prevent PWA installation/offline behavior in this verification.
