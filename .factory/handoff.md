# Performed For — repair 5 handoff

## Outcome

**PASS — release blockers from verifier report commit `c53a31958f19950af1f98607fff6a9dfc781f84b` are repaired, pushed, deployed, and verified.**

The repaired PWA is live at <https://end-client-reference.sociobot.in>. Product commits `3719b66` and `946b3d1` are on `main`. The researched invoice-cover workflow, local-first storage, three-free boundary, paid license flow, demo isolation, and original PDF behavior remain intact.

## Reproduction before repair

The untouched candidate build reproduced the controller’s exact 390 px computed-style failure:

- Field help and package status: `13px`.
- Demo action note, trust facts, and footer: `14px`.
- Footer Terms link: `41.23 × 44px`.

The verifier’s CSV fixture also reproduced the root cause in `csvCell`: quoting protected field boundaries but left formula-leading `=`, `+`, `-`, and `@` values executable in spreadsheet software.

## Repairs

- CSV export now identifies `=`, `+`, `-`, and `@` after leading control characters, spaces, or a BOM and prefixes the cell value with an apostrophe. Stored relationship data, table output, JSON backup, and PDF cover text remain exact.
- Added unit coverage for every formula prefix and whitespace-obscured variants. Added a browser regression that generates a PDF from dangerous values, confirms exact UI/canvas text, downloads CSV, and checks every exported cell is neutralized.
- Replaced map/trail/field-book interface lore with literal invoice, package, license, relationship, version, and page wording. The first screen now includes `Three packages free · $19 once`. The refreshed copy audit is in [`.factory/copy-audit.md`](copy-audit.md).
- Raised every visible copy role to at least `16px`, including field help, action notes, trust facts, package progress/status, restore-license labels, table headings, and footer/legal copy. Weight, spacing, and color retain hierarchy.
- Added a computed-style browser regression over every visible text node at desktop, 390 px (the 200%-zoom-equivalent layout), and 320 px. All tested nodes compute to at least `16px`, with no page overflow.
- Gave footer links a numeric minimum width and added a complete browser regression over every visible link, button, summary, input, file/import label, and focusable table on `/`, `/demo`, `/privacy`, `/terms`, and the 404. Every target measures at least `44 × 44px`.
- Removed absolutely positioned screen-reader spans from the horizontally scrollable table and replaced them with equivalent ARIA labels. This prevents the larger table headings from contributing hidden document overflow.
- At 390 px the header keeps the literal Workspace action and drops the redundant Relationship log shortcut, avoiding compressed 16 px navigation. The log remains directly available on the page.
- Updated the service-worker notice and offline fallback to direct wording. The artifact remains a static, local-first `pwa-offline` build.

## Verification evidence

### Clean install and gates

- `npm ci`: 143 packages installed; 0 vulnerabilities.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm run typecheck`: pass, strict TypeScript.
- `npm run lint`: pass, 0 warnings/errors.
- `npm test`: pass — 9 Vitest tests and 29 Chromium tests.
- `npm run build`: pass; `dist/index.html` present.
- Every one of the 15 literal commands in `.factory/claims.json` passed independently after the clean install.
- `git diff --check`: pass.

Production sizes:

- Initial JavaScript: 33.83 KB raw / 11.93 KB gzip.
- CSS: 13.55 KB raw / 3.72 KB gzip.
- Lazy PDF engine: 420.56 KB raw / 175.81 KB gzip.
- Live first load transferred 59 KiB in Lighthouse.

### Browser, keyboard, accessibility, and copy

- Local and deployed Playwright suites: 29/29 passed in Chromium 1.58.2.
- Desktop, 390 px, and 320 px layouts were rendered and reviewed. There is no horizontal page overflow.
- Live 390 px computed evidence: field help `16px`; status `16px`; action note `16px`; trust facts `16px`; footer `16px`; Terms `51.13 × 44px`; `scrollWidth === innerWidth === 390`.
- At 390 × 844, the headline, audience sentence, primary sample action, and exact free/paid fact are visible in the first screen.
- Keyboard smoke: Tab exposes the skip link with a 3 px coral focus ring; Enter moves focus to main; Enter on Generate package downloads `NL-1048-performed-for.pdf`; Space operates Reset demo; there are no traps.
- Reduced-motion context reports a match, changes smooth scrolling to `auto`, and reduces transition/animation durations to `0.01ms`.
- Playwright axe found no serious or critical issues on `/`, `/demo`, `/privacy`, `/terms`, or the product 404.
- `/opt/fleet/lib/verify-url.sh` passed all four 200 routes locally and live: correct title, `lang=en`, one `h1`, main landmark, image alternatives, labeled buttons, and no console/page errors.
- Unknown routes return the styled product 404 with HTTP 404.

### Product, privacy, PWA, and billing

- Core PDF generation, exact original-page content streams, exact relationship text, CSV/JSON downloads, import, deletion, recovery states, 25 MiB boundary, three-free boundary, and paid recall all pass locally and live.
- The formula regression covers all four dangerous prefixes and proves the visible/table/PDF values are unchanged while exported cells are literal.
- Privacy claim tests observed only same-origin GET requests during the full demo generation flow. No analytics, third-party fonts/scripts, PDF uploads, or cloud document storage were observed.
- A fresh live 390 px context acquired an activated controlling worker. Cache `performed-for-2f449339a4ce` contains 13 entries. Offline `/demo` reload returned 200 and the live suite generated a two-page package without the network.
- The changed-worker update regression passes and announces `A newer version is ready. Reload when convenient.`
- Production checkout returns 303 to `checkout.dodopayments.com`; the hosted 200 page contains Performed For, `$19`, and one-time purchase wording. No purchase was made.

### Response policy, performance, and live identity

- Live HTML is short-cached: `public, must-revalidate, max-age=30`.
- Hashed assets use `public, max-age=31536000, immutable`; `sw.js` and the manifest use `no-cache`.
- Live responses include HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions policy, and CSP with `frame-ancestors 'none'` and only the required billing API connection.
- Live Lighthouse 13.0.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.1 s, Speed Index 1.1 s, TBT 0 ms, CLS 0, TTI 1.1 s, transfer 59 KiB.
- All 20 deployable files, excluding source maps and host-only configuration, match local `dist/` byte for byte.
- Live footer: `v1.0.0 · build 04d69c2dd44e`.
- Live worker cache: `performed-for-2f449339a4ce`.
- SHA-256: `index.html` `c4f0fd9dedac8f85d5713cae7742c19ff5c1028c98d69c5f0699828bc85194cb`; `sw.js` `cd59c79ec91af869a4edd5746354fed575c41e15856633679ba5e798baea2913`; manifest `6fe40c1fbb1e81c8cef26fb125509c13b811f651d6c3a236111c79d019866526`.
- Deployment used SWA CLI 2.0.10 against the existing production resource `sociobot/sf-end-client-reference` and its configured `dist/` artifact.

## Commands

```sh
npm ci
npm audit --audit-level=high
npm run typecheck
npm run lint
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npx playwright test
```

Every `.factory/claims.json` test command was also run literally and separately. `/opt/fleet/lib/verify-url.sh` was run against local preview and live `/`, `/demo`, `/privacy`, and `/terms`.

## Known limits

- No real purchase was made. The production redirect, hosted product/price/one-time wording, invalid-license fixture flow, and paid client behavior were tested without payment spend.
- Lighthouse lab runs do not report INP. This static PWA has no first-party backend, sign-in flow, library package, CLI, or runtime AI feature, so backend concurrency, Entra, clean-consumer package, and live model checks do not apply.
