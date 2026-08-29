# Independent product verification 5 — FAIL

Verified on 2026-08-29 against candidate commit `e784fe4ea8d7cb1cbc68ea9ca805b753f4e8b2ee` and <https://end-client-reference.sociobot.in>.

## Decision

**FAIL — do not release this candidate.**

The deployment is healthy and matches the candidate byte for byte. The researched invoice-cover job works end to end, all 15 registered claims pass after a clean install, and the PWA works offline. Fresh independent QA nevertheless found a spreadsheet-formula injection flaw in the core CSV export plus explicit plain-language and mobile-accessibility contract violations. These are product findings, not a deployment-only failure.

No product code was modified during verification.

## Mandatory first checks

### First-read and one-click demo

**PASS.** A fresh desktop browser context opened the live root with no prior storage.

- What it does: **“Add the end client to every invoice.”** The supporting sentence says it adds a cover to an existing invoice PDF.
- Who it is for: **“subcontractors and white-label agencies.”**
- What to click first: **“Try it with sample data.”**
- One click opened `/demo` with a prepared PDF, completed relationship fields, a seeded log row, the persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start for real**.
- At 390 × 844, the headline, audience sentence, and sample action were all visible in the first viewport. The action ended at y=801.05 and the document had no horizontal overflow.

The broader first-screen contract does not fully pass because price/free-tier information is absent; see Findings.

### Registered claim tests

`.factory/claims.json` exists and contains 15 entries. As required, the literal commands were attempted before any other repository test. Before dependencies existed they could not start (`vitest: not found`, exit 127). After the required clean `npm ci`, every exact command was run independently and passed. The bootstrap exit is an uninstalled-runner condition, not a behavioral claim failure.

| Claim | Result and observed proof |
| --- | --- |
| `demo-isolated` | PASS — real data protected; demo database/counter discarded; reopened demo reseeded only its sample |
| `original-invoice-intact` | PASS — source PDF content streams preserved after the new cover |
| `csv-export` | PASS — sample CSV downloaded and contained the expected relationship |
| `json-backup` | PASS — version, export time, and all sample fields parsed |
| `json-import` | PASS — valid version 1 backup persisted across reload |
| `record-deletion` | PASS — one selected row removed while the other survived reload |
| `offline-reload` | PASS — fresh controlled 390 px production PWA reloaded with 200 and generated a two-page PDF offline |
| `runs-on-device` | PASS — sample generation made same-origin requests only |
| `no-analytics` | PASS — all observed demo-flow requests were same-origin GETs |
| `no-cloud-document-storage` | PASS — no document upload; IndexedDB held metadata fields only |
| `one-time-unlock` | PASS — fixture-verified license generated past the free boundary and used the production checkout URL |
| `relationship-recall` | PASS — verified license retained both client datalists and reused them after reload |
| `pdf-size-limit` | PASS — exactly 25 MiB accepted; 25 MiB plus one byte rejected |
| `three-free-packages` | PASS — three downloads succeeded and the fourth was blocked |
| `exact-relationship-text` | PASS — maximum permitted relationship strings all reached the cover canvas unchanged |

## Clean checkout and build gates

| Gate | Result |
| --- | --- |
| Checkout identity | PASS — `HEAD` and `origin/main` began at exact candidate `e784fe4ea8d7cb1cbc68ea9ca805b753f4e8b2ee` |
| `npm ci` | PASS — 143 packages installed; 0 vulnerabilities |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `npm run typecheck` | PASS — strict TypeScript, 0 errors |
| `npm run lint` | PASS — ESLint, 0 warnings/errors |
| `npm test` | PASS — 8 Vitest tests and 26 Chromium tests |
| `npm run build` | PASS — exact production build generated `dist/` |
| Live Playwright suite | PASS — `PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npx playwright test`, 26/26 |
| `git diff --check` before documentation | PASS |

Production sizes: initial JavaScript 33.65 KB raw / 11.78 KB gzip; CSS 13.42 KB raw / 3.71 KB gzip; lazy PDF engine 420.57 KB raw / 175.60 KB gzip; mobile hero 42.14 KB; no font payload.

## End-to-end product behavior

- A fresh live demo generated `NL-1048-performed-for.pdf` with one cover plus the sample invoice page and added the exact relationship to the local log.
- The sample CSV contained `Harbour Arts Council` and `HAC-2026-014`; JSON backup/import and per-row deletion persisted correctly in the full local and live suites.
- Independent invalid-input checks and regressions cover empty fields, whitespace-only values, malformed JSON, wrong-typed and unsupported backups, poisoned existing IndexedDB data, non-PDF signatures, malformed `%PDF-` files, exact/over-limit file sizes, and recovery without reload.
- The cover identifies the billing client as payer and explicitly says the end client is not liable for payment.
- Three ordinary packages are free and the fourth is blocked. A fixture-backed valid license permits generation past the boundary and restores client recall.
- The CSV formula-prefix case fails; see Findings.

## Accessibility, keyboard, copy, and responsive review

- `/`, `/demo`, `/privacy`, `/terms`, and the product 404 had no axe serious or critical findings.
- `/opt/fleet/lib/verify-url.sh` passed all four 200 routes in 639–887 ms: correct route title, `lang=en`, one `h1`, a main landmark, complete image alternatives, named buttons, and no console/page errors.
- Keyboard-only checks passed skip-link focus/activation, route focus, validation focus, import focus, Enter activation, and visible 3 px coral focus indication.
- Reduced-motion media matching was true; smooth scrolling became `auto` and animation/transition durations were reduced.
- Desktop and 390 px captures were visually reviewed. The layout is coherent, the topographic identity is product-specific, and 390/320 px tests have no horizontal overflow.
- Manual measurement found a 41.23 × 44 px **Terms** link and important copy at 13–14 px; see Findings.
- The first headline/audience/action gate passes, but the mandatory price fact and no-metaphor rules do not; see Findings.

## Privacy, headers, caching, and routes

- An independent live sample generation and CSV export made six requests, all same-origin GETs. There were no analytics, third-party scripts/fonts, document uploads, failed requests, console errors, or page errors.
- `demo:performed-for` stored only `billingClient`, `createdAt`, `endClient`, `id`, `invoiceNumber`, `reference`, `servicePeriod`, and `sourceFileName`; no PDF bytes were present.
- HTML is short-cached (`public, must-revalidate, max-age=30`); hashed JS/CSS/art use one-year immutable caching; `sw.js` and the manifest use `no-cache`.
- Live headers include CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and a restrictive permissions policy.
- Internal links return 200; mail links are explicit; the unknown route returns the styled product 404 with HTTP 404.
- The manifest has standalone display, a versioned start URL, 192/512/maskable icons, and matching colors. Chrome reported no manifest or installability errors.

## PWA and performance

- A fresh live 390 px context acquired the activated worker at `/sw.js`, was controlled, and had one cache: `performed-for-1883c0985441` with 13 entries including both JavaScript chunks.
- Offline `/demo` reload returned 200, displayed the offline notice, and generated and parsed a two-page package with no errors.
- The changed-worker regression passed: the new cache replaced the old cache and the update toast was announced.
- Lighthouse 13.0.1 mobile: Performance 90, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.2 s, Speed Index 1.0 s, TBT 420 ms, CLS 0, TTI 1.6 s, total transfer 60 KiB. Lab INP was not available.

## Billing, allowance, and identity

- The production buy endpoint returned 303 to Dodo. The hosted checkout returned 200 and displayed **Performed For**, **$19.00**, and a one-time license description. No purchase was made.
- From a fresh rate window, invalid-license verification requests 1–30 returned `200 {valid:false}`. Request 31 returned **429** with **`Retry-After: 4`**. Observed allowance: 30 requests per rate window.
- There is no sign-in flow, first-party backend, library package, or CLI. Entra, backend concurrency, and clean-consumer package checks are not applicable.
- AI is not needed for the brief's deterministic local document workflow; no missed-leverage finding was identified.

## Deployment identity

**PASS.** A fresh candidate build and the live deployment match.

- Live footer: `v1.0.0 · build 92118097247e`.
- Live worker cache: `performed-for-1883c0985441`.
- All 20 deployable files, excluding source maps and host-only configuration, matched local `dist/` byte for byte.
- Key SHA-256 values: `index.html` `9bba2752871e09bb5c2bcc8bdc9aae62298b456d7668866ecc6275323fee82c0`; `sw.js` `94acd1c17145ecc3c8036dbcfeaf25536b2e9798c4e3233454942b5c122ac799`; manifest `6fe40c1fbb1e81c8cef26fb125509c13b811f651d6c3a236111c79d019866526`.

## Findings

### High — CSV export permits spreadsheet-formula injection

The product accepts relationship data beginning with spreadsheet formula prefixes and exports those fields without neutralization. A fresh live workspace imported a valid version 1 backup and exported this row:

```csv
"2026-08-29T22:00:00.000Z","=HYPERLINK(""https://example.invalid"",""open"")","+SUM(1,1)","@DANGEROUS","-2+3","August 2026","invoice.pdf"
```

CSV quoting preserves field boundaries but common spreadsheet programs still interpret leading `=`, `+`, `-`, and `@` as formulas. This is CSV injection (CWE-1236) in a core report that users are expected to open in spreadsheets. The CSV serializer must neutralize formula-leading cells while keeping the on-screen/PDF relationship text exact, and a regression must exercise every dangerous prefix.

### Medium — first-screen and section copy violate the mandatory plain-words contract

The first screen provides privacy/offline facts but omits the required price/free-tier fact. The price appears much later in the purchase section.

The interface also uses map lore where the attached skill requires literal section names and bans metaphor/brand-lore copy: **“Invoice route sheets,” “Route desk,” “Trail pass active,” “One-time trail pass,” “Keep every route open,” “Local field book,” “This route is not on the map,”** and **“A fresh map is ready.”** **“Private by design”** is a generic slogan rather than an observable fact. Replace these with direct invoice/package/license/log/update wording and include **“Three packages free · $19 once”** (or equivalent exact pricing) in the first-screen facts.

### Medium — mobile text is below the declared readability baseline

At 390 px, important supporting and status copy renders below both the attached baseline and `.factory/design.md`'s statement that body text never drops below 16 px:

- Field explanations such as **“The company responsible for payment”**: 13 px.
- Free-package status: 13 px.
- Demo-action note, trust facts, and footer privacy/legal copy: 14 px.

These are operational instructions and privacy/price facts, not incidental decoration. Raise them to at least the declared minimum and recheck wrapping at 320/390 px and 200% text size.

### Medium — one mobile touch target is narrower than 44 px

At 390 px, the footer **Terms** link measures 41.23 × 44 px. It misses the explicit 44 × 44 CSS-pixel minimum. The neighboring link is separated, but the acceptance contract is numeric; give the link enough horizontal padding/minimum width and add a complete target-size regression rather than sampling only heights.

## Required before re-verification

1. Neutralize spreadsheet-formula prefixes in every exported CSV cell and add observable tests for `=`, `+`, `-`, and `@` without altering the relationship shown in the UI/PDF.
2. Replace the map-lore and slogan copy with literal invoice/package/license/log wording; put the exact free/paid fact on the first screen; refresh the copy audit.
3. Raise operational/supporting text to the declared minimum and make every visible mobile target at least 44 × 44 px.
4. Rerun all 15 claim commands, the complete local/live suites, axe/manual keyboard/mobile checks, and the live offline/update flow.
