# Independent product verification 4 — FAIL

Verified on 2026-08-29 against candidate commit `f099ba0077e55598b1ed7c55f7d987f259384dab` and <https://end-client-reference.sociobot.in>.

## Decision

**FAIL — do not release this candidate.**

The live site is available, matches the candidate product build byte for byte, passes every registered claim test, and completes the core invoice-cover workflow. This is not a deployment-only failure. Independent invalid-input testing found a persistent malformed-import failure that can make the workspace unusable until the user deletes all site data. Public JSON backup/import, record deletion, and paid relationship-recall promises are also absent from `.factory/claims.json`, which is independently release-blocking under the claims contract. A malformed PDF can additionally expose an internal JavaScript error to the user.

No product code was modified during this verification.

## First-read gate

**PASS.** A fresh Playwright context opened the live root URL with no prior storage or service worker state.

- What it does: **“Add the end client to every invoice.”** The supporting sentence says it adds a cover to an existing invoice PDF.
- Who it is for: **“subcontractors and white-label agencies.”**
- What to click first: **“Try it with sample data.”** The next line says the sample opens a completed route in an isolated demo.
- The action opens `/demo` in one click. The seeded invoice, relationship fields, relationship-log row, persistent demo banner, Reset demo, and Start for real controls are immediately present.
- At 390 × 844, the headline, audience sentence, and sample CTA are all in the first viewport. The CTA occupies y=752–801; horizontal overflow is 0 px.

Evidence: `.factory/verification-artifacts/live-cold-playwright.json` and `.factory/verification-artifacts/independent-live-flow.json`.

## Registered claim tests

`.factory/claims.json` exists and contains 11 well-formed entries. Before dependency installation, the literal commands returned exit 127 because `vitest` was not installed. After the required clean `npm ci`, every exact command was run separately against the product's production-preview demo entry point and passed. The bootstrap state is not treated as a product-test result.

| Claim | Exact command result |
| --- | --- |
| `demo-isolated` | PASS — isolated namespace, real-data protection, and demo disposal |
| `original-invoice-intact` | PASS — original page content streams preserved |
| `csv-export` | PASS — sample CSV contents inspected |
| `offline-reload` | PASS — controlled 390 px production PWA reloaded and generated a two-page package offline |
| `runs-on-device` | PASS — sample generation used only same-origin requests |
| `no-analytics` | PASS — all observed requests were same-origin GETs |
| `no-cloud-document-storage` | PASS — request log and IndexedDB record shape checked |
| `one-time-unlock` | PASS for the registered wording — fixture-verified license generated past the free limit and used the production checkout URL |
| `pdf-size-limit` | PASS — exactly 25 MiB accepted; 25 MiB + 1 byte rejected |
| `three-free-packages` | PASS — three downloads succeeded; the fourth was blocked |
| `exact-relationship-text` | PASS — maximum permitted billing-client, end-client, and reference text reached the cover canvas unchanged |

Evidence: `.factory/verification-artifacts/claim-results.json`. The full clean suite also passed the same claim-tagged tests.

## Clean checkout gates

| Gate | Result |
| --- | --- |
| Candidate identity | PASS — checkout began at exact commit `f099ba0077e55598b1ed7c55f7d987f259384dab` |
| `npm ci` | PASS — 143 packages installed; 0 vulnerabilities reported |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS — 0 warnings/errors |
| `npm run build` | PASS — typecheck, Vite production build, route copy, and `dist/` output |
| `npm test` | PASS — 5 Vitest tests and 19 Chromium tests |
| Live `PLAYWRIGHT_BASE_URL=… npx playwright test` | PASS — 19 Chromium tests |

Build output: initial app JS 30.68 KB raw / 11.08 KB gzip; CSS 13.13 KB raw / 3.66 KB gzip; lazy PDF engine 420.56 KB raw / 175.81 KB gzip. There is no font payload. The 42.14 KB mobile hero is below budget.

Evidence: `.factory/verification-artifacts/{npm-audit,typecheck,lint,production-build,full-test,live-playwright}.log`.

## End-to-end behavior

Passing cases:

- The live sample generates `NL-1048-performed-for.pdf` with a cover plus the original page (two pages total), adds the relationship to the demo log, and exports the expected CSV.
- A two-page representative invoice becomes a three-page package. SHA-256 comparisons of every original page content stream pass, including different page dimensions.
- Representative Unicode (`客户 Ω`), punctuation, PO references, optional invoice metadata, and maximum allowed relationship lengths pass.
- The cover distinguishes the billing client from the end client and states that the billing client remains responsible for payment.
- Whitespace-only required values are rejected, focus moves to the first bad field, and no relationship is added.
- Exactly 25 MiB succeeds; 25 MiB + 1 byte receives a specific size error.
- Three free generations succeed and the fourth is blocked with purchase/restore guidance.
- A malformed JSON syntax import receives **“That file is not a valid Performed For backup.”** A later valid import succeeds.
- After a malformed PDF failure, replacing the file with a valid PDF succeeds without a reload.

Failing cases are listed under Findings.

## Accessibility, keyboard, and responsive checks

- `/`, `/demo`, `/privacy`, `/terms`, and the 404 route have no axe serious or critical findings.
- `verify-url.sh` passes all four 200 routes: correct route title, `lang=en`, one `h1`, a `main`, image alternatives, named buttons, and no console/page errors.
- Keyboard traversal reaches the skip link, header links, sample CTA, file control, form fields, and actions. Enter activates the skip link and sample CTA. Route navigation focuses and announces the destination `h1`.
- Focus is a visible 3 px solid coral ring. Controls tested at 390 px meet the 44 px target requirement.
- Desktop, 390 px, and 320 px checks have no horizontal overflow. At 390 px the first action remains visible in the initial viewport.
- With `prefers-reduced-motion: reduce`, the media query matches and transitions/animations compute to 0.01 ms.
- Lighthouse 13.0.1 mobile: Performance 96, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.2 s, TBT 220 ms, CLS 0, total transfer 60 KiB. The first Lighthouse browser process crashed; one retry with safer headless flags completed.

Evidence: `.factory/verification-artifacts/verify-*/verify.json`, `independent-live-flow.json`, and `lighthouse-summary.json`.

## Privacy, headers, routes, and billing

- An independent live demo generation recorded 11 requests: all were same-origin GETs. There were no analytics, cloud-document uploads, third-party scripts/fonts, failed requests, console errors, or page errors.
- Demo records use `demo:performed-for`; ordinary records use `performed-for`. Start for real removes the demo database/counter while preserving a seeded real record. The claim test passes locally and live.
- The live document sends CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and a restrictive permissions policy.
- HTML uses `public, must-revalidate, max-age=30`; hashed assets use one-year immutable caching; `sw.js` and the manifest use `no-cache`.
- Chrome parses the web app manifest without errors. It has standalone display, versioned start URL, matching theme/background colors, 192 px, 512 px, and maskable 512 px icons.
- The live service worker activates and controls a fresh context, maintains one versioned cache, reloads `/demo` with status 200 offline, and generates/parses the sample PDF offline. The isolated changed-worker test replaces the old cache and displays the update notice.
- All internal links return 200. An unknown route returns the product 404 with HTTP 404. The production buy URL returns 303 to Dodo checkout, which loads the correct **Performed For** one-time product at **$19.00**.
- Fresh invalid-license requests from one client: requests 1–30 returned 200 invalid verdicts; request 31 returned **429** with **`Retry-After: 4`**. Observed allowance: 30 verification requests per rate window.
- There is no sign-in flow, first-party backend, library, or CLI. Entra identity, backend concurrency, and consumer-package checks are not applicable.

Evidence: `.factory/verification-artifacts/independent-live-flow.json`, `link-crawl.json`, and `rate-limit.json`.

## Deployment identity

**PASS.** The live deployment matches the candidate product files.

- `origin/main` resolves to the tested candidate `f099ba0077e55598b1ed7c55f7d987f259384dab`.
- Compared with the deployed product revision `80958f1c08603a5686c701ed0d30500849bf2318`, the candidate changes only `.factory/handoff.md`; no product/build input changed.
- A fresh candidate build reports `v1.0.0 · build e0c299227741`; the live footer reports the same identity.
- The worker cache is `performed-for-5ddeb918c847` locally and live.
- All 20 public files in `dist/`, excluding source maps and host-only configuration, match the live bytes and SHA-256 values exactly.

## Findings

### High — malformed typed backup can persistently disable the workspace

The Import JSON validation checks only that required properties are truthy. It does not require strings or validate the complete record shape. A fresh ordinary workspace imported this syntactically valid file with `billingClient: 7`:

```json
{"version":1,"records":[{"id":"poison","billingClient":7,"endClient":"End","reference":"REF","createdAt":"2026-08-29T00:00:00Z","invoiceNumber":"","servicePeriod":"","sourceFileName":"x.pdf"}]}
```

The UI reported that the backup was invalid, but the record had already been written to `performed-for`. On reload, rendering threw `TypeError: e.replace is not a function`; the normal header, workspace, export, import, and deletion controls were replaced by **“The workspace could not open.”** The bad record remained in IndexedDB. The only offered recovery is clearing all browser data, which also removes legitimate records and the saved license. This violates the required invalid-input and recovery behavior and produces a console error on load.

Evidence: `.factory/verification-artifacts/poison-import.json`.

### High — public claims are missing from the required claim registry

The live UI and README publicly promise JSON backup/import, individual record deletion, and paid reusable **“relationship recall on this device.”** `.factory/claims.json` has no entries for JSON backup, JSON import, or deletion. Its `one-time-unlock` wording and tagged test cover unlimited generation and the checkout URL, but do not prove recall after reload or reuse through the datalist. The copy audit labels the broader paid sentence as covered even though the registered claim is narrower.

The claims contract says an unlisted claim fails review until the copy is removed or a matching sandbox test is added. Passing all currently listed claims does not close this gap.

### Medium — malformed PDF exposes an internal error

A file beginning with `%PDF-` but lacking a valid page tree passes the signature check. Generation displays **“Cannot read properties of undefined (reading 'Pages')”** in the form. The same form recovers when a valid PDF is selected, but the error neither explains what happened nor tells the user what to do, contrary to the error-copy acceptance requirement.

Evidence: `.factory/verification-artifacts/error-recovery.json`.

## Required release work

1. Validate imported backup records completely before writing any record. Make the import atomic, reject wrong field types and unsupported versions, and provide a non-destructive recovery path for already-invalid stored records.
2. Add claim entries and one exact tagged observable test each for JSON backup, JSON import, deletion, and paid relationship recall—or remove those public promises/features from the copy. The recall test should verify persistence/reuse after reload, not only that a new row appeared.
3. Normalize all PDF parse/copy failures to a plain error such as **“That file could not be read as a PDF. Choose the original invoice PDF and try again.”** Add an end-to-end regression using a `%PDF-`-prefixed malformed file.
4. Rerun every claim command, the complete local and live suites, and the invalid-import recovery case before release.
