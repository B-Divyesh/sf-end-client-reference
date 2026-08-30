# Independent verification 9 — Performed For

**PASS — candidate accepted.**

Verified on 2026-08-30 from clean checkout commit `828ae0ad4149f35d97d43753ee4ed1ff6ffd46b3` against <https://end-client-reference.sociobot.in>.

## First read and demo

A cold, uncached live visit answers the required questions in plain words. The heading says **“Add the end client to every invoice.”** The following sentence names **subcontractors and white-label agencies** and says it adds a clear cover to an existing invoice PDF. The immediately visible **“Try it with sample data”** action says it opens a completed invoice example in an isolated demo. This passes the first-read requirement.

At 390 × 844 px, `/demo` showed the persistent **“Demo — sample data, nothing is saved”** banner with **Reset demo** and **Start for real**. Generating the supplied Northline Studio sample downloaded `NL-1048-performed-for.pdf`; parsing it confirmed two pages. The generated log gained a second row, the toast confirmed that the selected invoice was cleared, and document width remained exactly 390 px. The first keyboard Tab focuses the skip link with a visible `rgb(181, 65, 47) solid 3px` ring. An invalid ordinary-workspace attempt focuses the required invoice input.

## Mandatory claim registry

`.factory/claims.json` exists with 27 unique claims. After `npm ci` (143 packages; 0 vulnerabilities), every literal command in its `test` field was run independently from the shipped demo entry point. All 27 passed, with logs retained at `/tmp/end-client-reference-verify-9-claims.aqWNme/` in this verifier container.

| Claim groups | Result |
| --- | --- |
| Demo isolation/reset, local execution, offline reload | PASS |
| Original-invoice preservation, cover ordering, exact text, 25 MiB boundary, cleared file | PASS |
| CSV and JSON export/import, individual deletion, relationship persistence and recovery | PASS |
| No analytics, no cloud document storage, same-origin assets | PASS |
| Free limit, one-time license fixture, restore, revocation, billing-only and hosted checkout | PASS |
| End-client-not-payer wording and site-data clearing | PASS |

## Clean local gates

- `npm run typecheck`: PASS.
- `npm run lint`: PASS with zero warnings.
- `npm run build`: PASS; `dist/` produced the static routes, PWA manifest, icons, service worker, and assets.
- `npm test`: PASS — 10 Vitest tests and 46 Chromium tests against the production Vite preview.
- Initial JavaScript is 12,601 bytes gzip; CSS is 4,115 bytes gzip. The 175,330-byte-gzip PDF engine is dynamically imported only when a package or sample invoice is generated. This passes the 200 KB initial-JS and 50 KB CSS budgets.

## Live deployment, privacy, accessibility, and PWA

- `PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npm test`: PASS — 10 unit tests and 45 deployed browser tests passed. The one local-only changed-service-worker replacement simulation is intentionally skipped against a fixed deployment. This fresh full live run does not reproduce the earlier deployment-only failure.
- Every publicly served build output matched the local candidate SHA-256: HTML and direct-route documents, JS/CSS and source maps, responsive art, manifest, icons, robots/sitemap, offline page, and `sw.js`. `staticwebapp.config.json` is deployment configuration and correctly is not publicly served.
- Fresh live demo traffic was exclusively same-origin GET requests. There were no console/page errors, analytics, upload requests, remote fonts, scripts, stylesheets, images, or cloud-document-storage requests.
- The deployed browser suite uses `@axe-core/playwright` on `/`, `/demo`, `/privacy`, `/terms`, and the 404 route with zero serious or critical violations. It also covers labels, live validation, heading/landmark structure, focus movement, keyboard navigation, 320/390 px reflow, 44 px touch targets, and visible focus.
- A live 390 px service-worker-controlled demo reloaded offline and generated a valid two-page PDF in the deployed suite. The local changed-worker test also passed, verifying update detection and the in-app update notice. `sw.js` is `no-cache`; hashed JS is immutable for one year.
- Under `prefers-reduced-motion: reduce`, the live document reports `scroll-behavior: auto` and the sampled button transition and toast animation both report `0.00001s`.
- Root, demo, privacy, and terms respond 200; an unknown route responds HTTP 404. HTML sends HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, restrictive Permissions Policy, and a response-header CSP including `frame-ancestors 'none'`. The manifest is `application/manifest+json` and the app is standalone with 192, 512, and maskable icons.
- No repository or available-path `verify-url.sh` exists in this checkout. Its intended checks were covered by the live Playwright, Axe, header, and console checks above.

## Performance and billing allowance

- Mobile Lighthouse on `/demo`: repeat run scored **91 performance, 100 accessibility, 100 best practices, 100 SEO**; FCP 1.36 s, LCP 2.11 s, CLS 0, TBT 355 ms. An earlier run produced a complete 88-performance report (LCP 2.23 s, TBT 406 ms) but then its Chrome tab crashed during post-audit screenshot collection; it is recorded as an environment-unstable measurement, not used as the acceptance measurement. The successful repeat meets the stated score threshold.
- The browser client calls the documented Sociobot billing API directly; there is no product-owned server endpoint. The documented verification allowance was nonetheless tested: 30 invalid verify requests returned 200; requests 31–35 returned 429. The first 429 included `Retry-After: 3`.
- No purchase was made. Checkout, license restoration, revocation, and verification behavior were exercised with the repository’s fixture and the public hosted-checkout redirect boundary.

## Defects

| Severity | Finding |
| --- | --- |
| Blocking | None |
| High | None |
| Medium | None |
| Low | None |
