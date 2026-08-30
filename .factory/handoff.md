# Performed For — repair 6 handoff

## Outcome

**PASS — every finding in verifier report commit `3de6165e1f507ec9f68170dc27829dc37bbaddda` is repaired, pushed, deployed, and verified.**

The repaired PWA is live at <https://end-client-reference.sociobot.in>. Product commit `c0b7309a6a17b75a6a52df6ab7641ac90c734eb9` is on `main`. Azure Static Web Apps deployment `557c8f53-5cc1-4714-b6cb-b7a632fe772c` completed successfully against the existing `sociobot/sf-end-client-reference` resource.

The researched invoice-cover workflow, isolated one-click demo, local-first data model, exact relationship text, original PDF pages, three-free boundary, paid license behavior, responsive first screen, and offline/update behavior remain intact.

## Findings reproduced before repair

- **Release-blocking package-completion race:** a held IndexedDB write made the browser emit the download while `pf_generation_count` was still absent and the Generate button was still disabled. Releasing the transaction later changed the count to `1` and re-enabled the button. This reproduces the verifier's observation that download was exposed before completion state.
- **Demo numbering:** live `/demo` placed `02 Relationship` at y=530 and `01 Source invoice` at y=1045.
- **License referrer exposure:** a fresh live visit to `/?license=secret-verification-token` sent the full token-bearing URL in the `Referer` header of the initial hero image, CSS, and JavaScript requests.

## Repairs and regression coverage

- Package generation now finishes the relationship write, refreshes the visible log, commits the free-use counter, and updates the license badge before initiating the download. Storage failure still permits the generated download and now leaves the specific storage warning visible.
- `@claim:three-free-packages` now waits for the unambiguous enabled-button and free-count state after each download.
- A dedicated browser regression holds the IndexedDB write lock and proves no download is exposed early. After release, it asserts the count, saved record, enabled button, completion notice, and filename at the download boundary.
- The prepared demo keeps its useful relationship-first layout within the 390 px first viewport, but its visible steps are now numbered `01 Relationship` then `02 Source invoice`. The ordinary workspace remains `01 Source invoice` then `02 Relationship`. A geometry-based browser regression checks both visual orders.
- Static responses now send `Referrer-Policy: no-referrer`. The entry document also declares the policy before preload and module tags, protecting local preview and defense-in-depth behavior.
- Unit coverage pins the deployed header and document policy. A fresh-context browser regression proves the returned token is stored and stripped while no initial image, stylesheet, or script request carries it in a referrer.

## Verification evidence

### Clean install and complete gates

- `npm ci`: 143 packages installed; 0 vulnerabilities.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm run lint`: pass with 0 warnings/errors.
- `npm run typecheck`: pass.
- `npm test`: pass — 9 Vitest tests and 38 Chromium tests using the pinned Playwright 1.58.2.
- `npm run build`: pass; exact production output created at `dist/` with `index.html` at its root.
- Every one of the 21 literal `.factory/claims.json` commands passed independently.
- `git diff --check`: pass.

Production payloads:

- Initial JavaScript: 35,704 bytes raw / 12,276 bytes gzip.
- CSS: 15,269 bytes raw / 4,037 bytes gzip.
- Mobile hero: 42,142 bytes.
- Lazy PDF engine: 420,565 bytes raw / 175,601 bytes gzip.

### Browser, accessibility, privacy, and PWA

- Local and deployed complete Playwright suites: 38/38 passed with two workers. The deployed run includes the release-blocking free-limit claim and forced-delay completion regression.
- `/opt/fleet/lib/verify-url.sh` passed local and live `/`, `/demo`, `/privacy`, and `/terms`: correct route titles, `lang=en`, one `h1`, main landmark, image alternatives, named buttons, and no console or page errors.
- Axe 4.10.2 found zero violations of any severity on `/`, `/demo`, `/privacy`, `/terms`, and the styled 404 at desktop and 390 px mobile sizes.
- Desktop and 390 × 844 full-page screenshots were reviewed. The final mobile demo retains the end-client field in its first viewport and has no document overflow. Automated checks also pass at 320 px and the 200%-zoom-equivalent layout.
- Mobile keyboard smoke: Tab first reached the skip link with a visible solid focus outline; Enter moved focus to `main`; Tab reached Reset demo and Space operated it; 11 further tab stops reached Generate package; Enter downloaded `NL-1048-performed-for.pdf`. No trap was found.
- Reduced motion matched, set document scrolling to `auto`, and limited the greatest animation/transition duration to `0.00001 s`.
- Privacy tests observed only same-origin GETs during generation and export. The deployed fresh-context referrer regression passed. No invoice upload, analytics, remote font, CDN, or third-party runtime asset request occurred.
- A fresh 390 px context acquired the service worker, reloaded `/demo` offline with HTTP 200, displayed the offline notice, and generated a valid two-page PDF. The changed-worker update test installed a new worker and announced the available update.

### Response policy, performance, billing, and live identity

- Live HTML sends `Referrer-Policy: no-referrer`, HSTS, `nosniff`, restrictive Permissions Policy, and CSP with response-header-only `frame-ancestors 'none'` and only the required Sociobot billing connection.
- Live HTML uses `public, must-revalidate, max-age=30`; hashed assets use `public, max-age=31536000, immutable`; `sw.js` and `manifest.webmanifest` use `no-cache`; the manifest MIME is `application/manifest+json`.
- `/`, `/demo`, `/privacy`, and `/terms` return HTTP 200. An unknown route returns the styled product page with HTTP 404.
- Checkout returns HTTP 303 to the hosted Dodo checkout. A fresh invalid license verification returned HTTP 200 with `{valid:false, reason:"invalid"}`. No purchase was made.
- Three Lighthouse 12.8.2 mobile runs against the live URL scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100 each. LCP was 1.097–1.102 s, FCP 0.901–0.913 s, TBT 13–26 ms, and CLS 0.
- All 21 deployable files, excluding source maps and host-only configuration, match the live deployment byte-for-byte.
- Live footer: `v1.0.0 · build dc5013182708`.
- Live worker cache: `performed-for-ac024dc32ce8`.
- SHA-256: `index.html` `71249f04e44bf94c6617413ebd438a4d88fe5a7ee2e130cc325e386d25f0ae60`; entry JS `2b12aa91dcf1fafa9af41626c05abae064565842634c5f59d74c32863dc8fe06`; CSS `85bad48ae81c8cfca2232fd1922229e797aaf2231af17538dcc319f3a89c51f5`; lazy PDF chunk `e9d850e94ba91312c7041049c2a597f9427e9247b704d8f041789a9480b0d46a`; `sw.js` `a30837c3a421d7a455f1fd14c1034385e3baf89281de3ff1c2a0a51d14ccc13f`; manifest `6fe40c1fbb1e81c8cef26fb125509c13b811f651d6c3a236111c79d019866526`.

## Commands

```sh
npm ci
npm audit --audit-level=high
npm run lint
npm run typecheck
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npx playwright test --workers=2
```

Each `.factory/claims.json` test command was also run literally and separately. `/opt/fleet/lib/verify-url.sh` was run on all four 200 routes locally and live.

## Known limits

- No real payment was made. The production redirect, hosted checkout boundary, invalid-license live response, and fixture-backed paid behavior were tested without spending money.
- Lighthouse lab runs do not report INP. This static PWA has no first-party backend, authentication, package/consumer surface, CLI, or runtime AI feature, so backend concurrency, identity-provider, package-consumer, and live-model checks do not apply.
