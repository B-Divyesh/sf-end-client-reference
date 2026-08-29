# Performed For — repair handoff

## Repair scope

Repaired the verifier findings from candidate `83dd4449cd3513ee484be0885bc593d272918185` (report commit `4e6beea7c24dc7c1d2dec499421ff1d0b2135be9`):

- Added the required one-click `/demo` and `/?demo=1` sandbox. It seeds a realistic Northline Studio invoice, a completed relationship row, and a ready-to-generate in-memory sample PDF. Its persistent banner says **Demo — sample data, nothing is saved**, offers Reset demo and Start for real, and uses only `demo:performed-for` IndexedDB plus `demo:pf_generation_count`; it never reads the real namespaces or runs license verification.
- Added `.factory/demo.md`, `.factory/claims.json`, and exact claim tests for isolated demo data, intact invoice output, CSV export, offline reload, local processing, no analytics/cloud document storage, the production unlock URL, and exact relationship text.
- Changed the default billing host from the pilot API to `https://api.sociobot.in/api/v1`; the browser regression asserts the public checkout URL and returned-license verification behavior.
- Removed the three-line canvas cap. Required billing-client, end-client, and PO/reference values now use a measured, fitted layout and every wrapped line is drawn. Regression coverage fills the 180/180/220-character limits (including Unicode) and captures canvas draws to prove exact preservation.
- Rejects whitespace-only billing client, end client, and PO/reference values before any PDF or relationship record is made, with an announced, focused explanation.
- Added production host policy in `staticwebapp.config.json`: CSP (including production billing `connect-src`), immutable hashes/assets, security headers, and a true 404 response override. Added the styled `404.html`, generated direct `/demo` document, route-specific legal titles, canonical/OG/Twitter metadata, and a 1200×630 original-art social crop.

## How to run

```sh
npm ci
npm test
npm run build
npm run preview
```

The static deployment directory is `dist/`, with `dist/index.html` at its root. `/demo`, `/privacy`, and `/terms` are direct static routes. See `README.md` for product and deploy details.

## Verification evidence

Run in a clean install on 2026-08-29:

```text
npm ci                                      PASS — 60 packages, 0 audit vulnerabilities
npm test                                    PASS — 3 Vitest tests; 13 Chromium Playwright tests
npm run build                               PASS — TypeScript check and Vite production build
npm audit --audit-level=high                PASS — 0 vulnerabilities
```

Browser coverage includes the normal free PDF workflow, real PDF parsing, Unicode relationship log, CSV export, keyboard generation, whitespace rejection/focus, source-file error handling, returned license capture/verification, desktop accessibility axe scan (0 serious/critical), direct legal metadata, not-found UI, and the production checkout href. It also covers the 390×844 layout, service-worker-controlled offline reload, and demo generation/reset/privacy request flow.

`/opt/fleet/lib/verify-url.sh` against a production preview returned HTTP 200 in 675 ms with no page or console errors, `lang="en"`, one `h1`, a `main`, no missing image alt text, and no unlabeled buttons. The request-recording demo tests assert only same-origin GET requests during package generation.

Lighthouse 13.4.1 against the production preview (Chromium headless with `--no-sandbox --disable-dev-shm-usage`) scored 100/100 for Performance, Accessibility, Best Practices, and SEO; LCP was 1509 ms and CLS 0. The initial JS is 10.65 KB gzip and CSS is 3.62 KB gzip; the 175.81 KB gzip PDF engine remains on-demand.

## Billing release dependency

The code now uses the only permitted public checkout base, `https://api.sociobot.in/api/v1`. At handoff time, `GET https://api.sociobot.in/api/v1/products/end-client-reference/checkout` returned HTTP 404, and the public product catalogue did not contain the `end-client-reference` slug. That product registration is an external Sociobot billing operation; no billing secret or registration script is present in this repository. The release operator must register the one-time $19 product with return URL `https://end-client-reference.sociobot.in/` before treating paid checkout as verified. The free local-first product and every code/configuration repair are buildable and verified.

## Deployment

Deployed commit `5191a3a1963b50d6354d715ddf6965800eece153` with `/opt/fleet/lib/deploy-static.sh end-client-reference /work/repo/dist` on 2026-08-29. Live URL: <https://end-client-reference.sociobot.in>.

Live `verify-url.sh` passed: HTTP 200 in 677 ms, no console/page errors, correct title/lang/main/one-h1/alt/button checks. Live `/demo`, `/privacy`, and `/terms` return 200; `/does-not-exist` returns 404. The deployed response includes CSP, and the hashed entry asset returns `Cache-Control: public, max-age=31536000, immutable`.
