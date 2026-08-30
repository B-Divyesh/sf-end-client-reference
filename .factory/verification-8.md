# Independent verification 8 — Performed For

**PASS — release candidate accepted.**

Verified on 2026-08-30 from clean checkout commit `88d50ec32585e22594009146bbfdcf3df5905341` against <https://end-client-reference.sociobot.in>. No product defects were found. The live footer and local build both identify `v1.0.0 · build dc5013182708`.

## First read and demo

A cold live visit answers the required questions in plain words: **“Add the end client to every invoice.”** It says this is for subcontractors and white-label agencies, and the visible first action is **“Try it with sample data.”** The adjacent sentence explains that it opens a completed invoice example in an isolated demo. This passes at desktop and 390 × 844 px mobile; the four privacy/offline/price facts also fit in the mobile first viewport.

`/demo` immediately showed the realistic Northline Studio sample, the persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start for real**. Generating it downloaded `NL-1048-performed-for.pdf` (113,855 bytes), containing two pages: a new cover and the original invoice page. Reset restored the sample. The full suite also independently verifies demo disposal when leaving for the real workspace.

## Mandatory claims

`.factory/claims.json` is present with 21 unique claims. After `npm ci` (143 packages, 0 vulnerabilities), every declared `npm test -- --grep @claim:<id>` command was run individually from the shipped Playwright demo entry point. Every command completed with its one tagged browser test passing; logs are retained in `/tmp/end-client-reference-claims/` in this verification container.

| Claims | Result |
| --- | --- |
| `demo-isolated`, `demo-reset`, `offline-reload`, `runs-on-device` | PASS |
| `original-invoice-intact`, `pdf-size-limit`, `exact-relationship-text`, `end-client-not-payer` | PASS |
| `csv-export`, `json-backup`, `json-import`, `record-deletion`, `invalid-record-recovery` | PASS |
| `no-analytics`, `no-cloud-document-storage`, `no-third-party-runtime-assets` | PASS |
| `three-free-packages`, `one-time-unlock`, `relationship-recall`, `license-restore-anywhere`, `billing-api-only` | PASS |

## Clean build and live regression gates

- `npm run lint`: PASS, zero warnings/errors.
- `npm test`: PASS — 9 Vitest tests and 38 Chromium tests; Playwright status recorded `passed`, no failed tests.
- `npm run build`: PASS — typecheck, Vite build, copied route files, and `dist/` all completed.
- `PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npm test`: PASS — the same 9 unit and 38 browser tests completed against the deployment with no failed tests.
- Exact local/live SHA-256 values match for `index.html`, entry JS/CSS, lazy PDF chunk, and `sw.js`. For example, entry JS is `2b12aa91dcf1fafa9af41626c05abae064565842634c5f59d74c32863dc8fe06`; `sw.js` is `a30837c3a421d7a455f1fd14c1034385e3baf89281de3ff1c2a0a51d14ccc13f`.

The deployed regression suite covers representative ordinary use plus whitespace-only required fields, malformed and oversize PDFs, malformed/wrong-version JSON imports, corrupted stored records and selective recovery, CSV formula prefixes, three-free boundary and paid fixture behavior. It also covers preserving source-PDF content streams and all allowed relationship characters.

## Browser, accessibility, privacy, and PWA

- The factory `verify-url.sh` passed on the live root: HTTP 200; title present; `lang=en`; exactly one `h1`; `main`; zero images missing `alt`; zero unnamed buttons; zero console/page errors. Evidence: `/tmp/end-client-reference-verify-url.N9W7dj/verify.json`.
- Fresh Playwright/Axe 4.10.2 testing found **zero serious or critical violations** on the demo. The completed deployed suite checks the root, demo, privacy, terms, and 404 routes.
- At 390 px there is no document horizontal overflow (`390/390`). Keyboard Tab reaches the skip link first, Reset demo is reachable and Space resets it, and focus navigation has no trap. Reduced motion is active with `scroll-behavior: auto`. The live footer Terms target measures 51.125 × 44 px.
- The live demo flow made only same-origin **GET** requests; no analytics, document upload, cloud storage, third-party script, font, stylesheet, or image request was observed. No console or page errors were observed.
- A fresh service-worker-controlled 390 px `/demo` reloaded offline with HTTP 200 and generated a valid two-page package without errors. The passing local PWA update test installs a changed worker and announces the update.

## Headers, performance, billing, and routing

- Live HTML sends HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, restrictive Permissions Policy, and a response-header CSP with `frame-ancestors 'none'`; `connect-src` permits only self and the required Sociobot API.
- Routes `/`, `/demo`, `/privacy`, `/terms`, manifest, robots, and sitemap return 200; an unknown route returns the styled 404 with HTTP 404. HTML uses 30-second revalidation; hashed assets are immutable for one year; `sw.js` and the manifest are no-cache. The manifest is `application/manifest+json`, standalone, versioned, and has 192/512/maskable icons.
- Mobile first-load transfer sizes: entry JS 12,504 bytes encoded (35,704 raw; 12,353 gzip locally), CSS 4,141 bytes encoded, and hero image 42,142 bytes. The PDF engine is lazy-loaded (175,263 bytes gzip), so the initial JS is comfortably below the 200 KB budget.
- The public checkout returns HTTP 303 to `checkout.dodopayments.com`. No purchase was made. There is no sign-in flow, so Entra tenant validation is not applicable.
- A single client sent 35 invalid license-verification requests: 1–30 returned 200; 31–35 returned **429** with **`Retry-After: 4`**. Observed allowance: 30 verification requests per rate window.

Standalone Lighthouse could not be collected anew because its Chrome launcher crashes under this root container (`--no-sandbox --headless=new`: browser tab crashed). This is an environment limitation, not a page error; direct Chromium, Axe, factory URL-verifier, transferred-byte, and the complete live regression checks above all passed. The matching deployed artifact was previously Lighthouse-measured in the handoff.

## Defects

| Severity | Finding |
| --- | --- |
| Blocking | None |
| High | None |
| Medium | None |
| Low | None |

