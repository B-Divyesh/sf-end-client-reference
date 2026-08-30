# Adversarial first-read review 3 — Performed For

Reviewed 2026-08-30 against repository commit `bc54f16805ff47070860ba5294eaca25d20a97d4` and <https://end-client-reference.sociobot.in> in fresh Chromium contexts at 390 × 844 and 1440 × 900.

## Verdict

**FAIL.** Six findings remain: one blocking, two high, one medium, and two minor. All 25 registered claim commands pass independently from a clean clone. The result is still FAIL because the public **Relationship log** deep link is broken, two material public claims are not fully represented by claim tests, the documented live-test mode is not clean-checkout safe, and two copy/structure details remain.

## Cold first read, before scrolling

### Phone, 390 × 844

- What it does: adds an end-client cover to an existing invoice PDF.
- For whom: subcontractors and white-label agencies.
- What to click first: **Try it with sample data**.

The exact text was **“Add the end client to every invoice.”**, **“For subcontractors and white-label agencies, add a clear cover to an existing invoice PDF before sending it.”**, and **“Try it with sample data.”** The action ends at y=528.1. Its result and all four facts are visible; the lowest fact ends at y=782.9. This gate passes.

### Desktop, 1440 × 900

The same three answers are clear from the same text. The action, result, and facts fit without scrolling; the lowest fact ends at y=812.0. This gate passes.

## Findings

### Blocking

#### F-3-1 — The Relationship log route changes the URL but does not open the log

- Exact location: header link **“Relationship log”** on `/demo`, `/privacy`, and `/terms`, plus a cold visit to `/#records`.
- Live evidence at 390 × 844: activating it from `/privacy` or `/demo` produced `/#records`, but `scrollY` remained `0`, the log began at y=`3730.53`, and focus moved to the hero h1. A fresh `/#records` visit also stayed at `scrollY=0` with focus on `<body>`.
- Code evidence: `navigate()` handles the hash only when pathname and search already match. Cross-route navigation calls `renderRoute({ focusHeading: true })`, which scrolls to the top. Initial `startApp()` also ignores `location.hash`.
- Why this fails: the URL says the log is open while the visitor still sees the landing hero. The review contract classifies broken routing as blocking.
- Concrete fix: after route rendering, resolve a valid hash, scroll its target into view, focus `#records-title`, and announce it. Apply this on initial deep loads. Test direct `/#records`, Privacy → Relationship log, Demo → Relationship log, and Back on phone and desktop.

### High

#### F-3-2 — The app says an invoice is discarded, but keeps it selected after generation

- Exact quotes: landing **“Invoice PDFs are read to make a download, then discarded.”**; file help **“read locally, never retained”**; `/privacy` **“Your attached invoice PDF is read in memory to make the download and is not retained.”**
- Live evidence: after generating from `sensitive-client-invoice.pdf`, `#invoice-file.files.length` remained `1`; its filename and the visible selected filename also remained.
- Code evidence: `selectedFile` is assigned at `src/app.ts:237` and is never cleared after generation. The file input is not reset.
- Claim evidence: `no-cloud-document-storage` passes because it checks request origins and IndexedDB fields. It does not assert **“then discarded”** or **“never retained.”** Those stronger words are unlisted and currently inaccurate.
- Why this fails: a visitor handling a sensitive invoice can reasonably read “then discarded” as removal after generation.
- Concrete fix: either clear the file input and `selectedFile` after generation and add a tagged claim, or write: **“The selected PDF stays in this tab until you replace it or leave. It is never uploaded or added to the relationship log.”**

#### F-3-3 — Payment-provider responsibilities are public but unlisted

- Exact quotes: `/privacy` — **“Checkout is hosted by Sociobot/Dodo, the merchant of record.”** `/terms` — **“Sociobot/Dodo is the merchant of record. Checkout, receipts, taxes, and refunds are handled there.”**
- Evidence: `billing-api-only` checks the Sociobot API URL, a fixture verification request, and built JavaScript. `one-time-unlock` checks the public checkout URL. Neither tagged test follows checkout or verifies the merchant, receipts, taxes, or refund handling.
- Manual evidence: the live checkout URL redirects to a 200 page on `checkout.dodopayments.com`; this confirms only the current host.
- Why this fails: these are material statements a purchaser can rely on, but they are outside the registry.
- Concrete fix: add a `hosted-checkout` claim with a no-purchase redirect and merchant-wording test. Remove the receipts, taxes, and refunds sentence unless a contract fixture can prove it.

### Medium

#### F-3-4 — The documented deployed-site test mode fails from a fresh checkout

- Exact README text: **“Set `PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in` to test an already deployed artifact.”**
- Evidence: after `npm ci` without `dist/`, `PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npx playwright test --workers=2` finished 40/43. Three tests failed on local `ENOENT` reads for `dist/sw.js`, `dist/404.html`, and `dist/assets`. After `npm run build`, the same suite passed 43/43.
- Why this fails: the stated live mode still has an undocumented local-build dependency and can falsely reject a healthy deployment.
- Concrete fix: document **`npm run build && PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npx playwright test`**, or inspect deployed resources in external-base mode. Add a clean-checkout CI job.

### Minor

#### F-3-5 — “Metadata” is unexplained jargon and duplicates a clearer term

- Exact quotes: landing **“Only metadata is saved—never the invoice PDF.”** README **“The relationship log stores only metadata.”**
- Why this fails: “metadata” does not say which client information remains. The page already uses **“client relationship details.”**
- Concrete rewrite: **“Only client names, references, dates, and filenames are saved—not the invoice PDF.”** In README: **“The relationship log stores client names, references, invoice details, dates, and filenames.”**

#### F-3-6 — The purchase link does not disclose that it leaves the product

- Exact location: **“Buy the one-time unlock”**, linking to `api.sociobot.in` and redirecting to `checkout.dodopayments.com`.
- Why this fails: the site-structure contract requires external links to say so. The action has no visible or accessible notice about hosted checkout.
- Concrete fix: add **“Opens the hosted Sociobot checkout.”** Include this in the accessible name and add a link-contract assertion.

## Copy audit

Counts treat hyphenated terms, paths, URLs, versions, and prices as one word; separator glyphs are not words. Commands are excluded. Visible landing copy, hidden paid-control labels, and the meaningful hero alt are included. No item exceeds 22 words and no banned marketing adjective appears.

### Landing page

| ID | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| L01 | 4 | Skip to main content | Pass |
| L02 | 2 | Performed For | Pass |
| L03 | 3 | Invoice cover sheets | Pass |
| L04 | 1 | Workspace | Pass |
| L05 | 2 | Try sample | Pass |
| L06 | 2 | Relationship log | F-3-1 across routes/deep links |
| L07 | 1 | Privacy | Pass |
| L08 | 5 | Billing client → end client → project | Pass |
| L09 | 7 | Add the end client to every invoice. | `cover-before-invoice` |
| L10 | 17 | For subcontractors and white-label agencies, add a clear cover to an existing invoice PDF before sending it. | `cover-before-invoice` |
| L11 | 5 | Try it with sample data | Pass |
| L12 | 3 | Use your invoice | Pass |
| L13 | 11 | The sample opens a completed invoice example in an isolated demo. | `demo-isolated` |
| L14 | 4 | Runs on your device | `runs-on-device` |
| L15 | 5 | Keeps the original invoice intact | `original-invoice-intact` |
| L16 | 5 | Works offline after first visit | `offline-reload` |
| L17 | 5 | Three packages free · $19 once | `three-free-packages`, `one-time-unlock` |
| L18 | 2 | Invoice package | Pass |
| L19 | 3 | How it works | Pass |
| L20 | 4 | 3 free packages left | `three-free-packages` |
| L21 | 4 | Choose an invoice PDF | Pass |
| L22 | 3 | Name both clients | Pass |
| L23 | 4 | Download the combined PDF | `cover-before-invoice` |
| L24 | 2 | Source invoice | Pass |
| L25 | 5 | Choose the existing invoice PDF | Pass |
| L26 | 10 | PDF only · up to 25 MB · read locally, never retained | `pdf-size-limit`; F-3-2 |
| L27 | 3 | No file selected | Pass |
| L28 | 1 | Relationship | Pass |
| L29 | 2 | Billing client | Pass |
| L30 | 5 | The company responsible for payment | Pass |
| L31 | 2 | End client | Pass |
| L32 | 8 | The customer receiving the work; not the payer | `end-client-not-payer` |
| L33 | 3 | Project / PO reference | Pass |
| L34 | 4 | Preserved exactly as entered | `exact-relationship-text` |
| L35 | 2 | Invoice number | Pass |
| L36 | 1 | Optional | Pass |
| L37 | 2 | Service period | Pass |
| L38 | 5 | Optional, in your preferred format | Pass |
| L39 | 2 | Your output | Pass |
| L40 | 11 | One cover page followed by every page of the original invoice. | `cover-before-invoice` |
| L41 | 2 | Generate package | Pass |
| L42 | 3 | Privacy and limits | Pass |
| L43 | 5 | What stays on this device | Pass |
| L44 | 10 | Invoice PDFs are read to make a download, then discarded. | F-3-2 |
| L45 | 9 | Only client relationship details are saved in your browser. | `no-cloud-document-storage` |
| L46 | 11 | Performed For does not issue invoices or change who owes payment. | Product limit |
| L47 | 6 | The billing client remains the payer. | `end-client-not-payer` |
| L48 | 2 | One-time license | Pass |
| L49 | 3 | Generate unlimited packages. | `one-time-unlock` |
| L50 | 4 | Three packages are free. | `three-free-packages` |
| L51 | 10 | Pay $19 once for unlimited packages and saved client suggestions. | `one-time-unlock`, `relationship-recall` |
| L52 | 7 | Restore an active license on another device. | `license-restore-anywhere` |
| L53 | 4 | Buy the one-time unlock | F-3-6 |
| L54 | 3 | Have a license? | Pass |
| L55 | 3 | Paste license token | Pass |
| L56 | 2 | Verify license | Pass |
| L57 | 4 | Saved on this device | Pass |
| L58 | 2 | Relationship log | Pass as heading |
| L59 | 2 | Export CSV | `csv-export` |
| L60 | 2 | Backup JSON | `json-backup` |
| L61 | 2 | Import JSON | `json-import` |
| L62 | 4 | No relationships logged yet | Pass |
| L63 | 9 | Your first generated package will add its relationship here. | `relationship-log` |
| L64 | 7 | Only metadata is saved—never the invoice PDF. | F-3-5 |
| L65 | 11 | Performed For adds an end-client cover to an existing invoice PDF. | `cover-before-invoice` |
| L66 | 6 | Invoice files stay on your device. | `runs-on-device`, `no-cloud-document-storage` |
| L67 | 2 | No analytics. | `no-analytics` |
| L68 | 4 | No cloud document storage. | `no-cloud-document-storage` |
| L69 | 1 | Privacy | Pass |
| L70 | 1 | Terms | Pass |
| L71 | 12 | Built by Param Factory · v1.0.0 · build 76579c7daa41 · Illustration generated for this product. | Pass |
| L72 | 10 | Layered paper illustration linking a billing client to an end client | Pass; alt text |

### README

| ID | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| R01 | 2 | Performed For | Pass |
| R02 | 9 | Add an end-client cover to an existing invoice PDF. | `cover-before-invoice` |
| R03 | 19 | It is for subcontractors and agencies that invoice a billing client but must name the end client and project. | Pass |
| R04 | 6 | Start with the one-click sample demo. | Pass |
| R05 | 14 | Or choose an invoice and enter its billing client, end client, and project reference. | Pass |
| R06 | 10 | The download adds one cover before the original invoice pages. | `cover-before-invoice` |
| R07 | 11 | The cover says the end client is not liable for payment. | `end-client-not-payer` |
| R08 | 2 | Live: https://end-client-reference.sociobot.in | Pass |
| R09 | 3 | Demo and data | Pass |
| R10 | 9 | `/demo` and `/?demo=1` open a completed Northline Studio example. | `demo-isolated` |
| R11 | 8 | The demo banner can reset the original sample. | `demo-reset` |
| R12 | 7 | Start for real discards the demo data. | `demo-isolated` |
| R13 | 4 | Demo records use `demo:performed-for`. | `demo-isolated` |
| R14 | 4 | Ordinary records use `performed-for`. | `demo-isolated` |
| R15 | 6 | Invoice PDFs stay in your browser. | `runs-on-device`, `no-cloud-document-storage` |
| R16 | 6 | The relationship log stores only metadata. | F-3-5 |
| R17 | 12 | No analytics, third-party scripts, CDN fonts, or cloud document storage are used. | Three registered privacy claims |
| R18 | 3 | Price and unlock | Pass |
| R19 | 4 | Three packages are free. | `three-free-packages` |
| R20 | 14 | A $19 one-time license enables unlimited packages and saved client suggestions on this device. | Two registered purchase claims |
| R21 | 9 | You can restore an active license on another device. | `license-restore-anywhere` |
| R22 | 9 | Checkout and license verification use the Sociobot billing API. | `billing-api-only` |
| R23 | 2 | Run locally | Pass |
| R24 | 5 | Requirements: Node.js 22+ and npm. | Pass |
| R25 | 6 | Open the URL printed by Vite. | Pass |
| R26 | 8 | For the offline path, use a production preview. | Pass |
| R27 | 3 | Optional build-time variables | Pass |
| R28 | 4 | `VITE_BILLING_BASE` — billing API root. | Pass |
| R29 | 3 | Defaults to `https://api.sociobot.in/api/v1`. | Pass |
| R30 | 4 | `VITE_LICENSE_PRICE` — displayed one-time price. | Pass |
| R31 | 3 | Defaults to `$19`. | Pass |
| R32 | 3 | Test and build | Pass |
| R33 | 3 | `npm test` checks: | Pass |
| R34 | 5 | original invoice pages stay unchanged; | Pass |
| R35 | 6 | CSV cells cannot run spreadsheet formulas; | Pass |
| R36 | 4 | demo data is discarded; | Pass |
| R37 | 8 | saved records can be exported, imported, and deleted; | Pass |
| R38 | 8 | mobile text and controls meet their size limits; | Pass |
| R39 | 6 | routes, accessibility, and offline reload work. | Pass |
| R40 | 9 | Playwright starts a fresh production preview for PWA checks. | Pass locally |
| R41 | 6 | The pinned Playwright version is 1.58.2. | Pass |
| R42 | 11 | `npm run build` type-checks the app and writes it to `dist/`. | Pass |
| R43 | 16 | The output includes direct route files, the 404 page, host settings, and an offline service worker. | Pass |
| R44 | 8 | Set `PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in` to test an already deployed artifact. | F-3-4 |
| R45 | 7 | Deploy `dist/` to the configured static host. | Pass |
| R46 | 9 | This repository does not manage DNS or billing registration. | Pass |
| R47 | 2 | Software license | Pass |
| R48 | 4 | MIT — see LICENSE. | Pass |

### Copy conclusions and terminology

- Over 22 words: none.
- Banned marketing words: none.
- Mood, metaphor, or slogan headings: none.
- Non-result action labels: none; F-3-6 concerns destination disclosure.
- Jargon: **metadata** is F-3-5. Developer setup terms are contextual.

| Concept | Consistent term |
| --- | --- |
| Company responsible for payment | Billing client |
| Customer receiving the work | End client |
| Work identifier | Project / PO reference |
| New first page | End-client cover |
| Combined cover and source PDF | Invoice package |
| Stored client-detail rows | Relationship log |
| Sample-only workspace | Demo |

## Demo and sandbox verification

- One click opened `/?demo=1` with title **Demo — Performed For**.
- At 390 × 844, the banner ended at y=248.7, filename at y=412.0, sample record at y=492.6, billing client at y=669.3, and end client at y=819.7. Desktop also showed these initially.
- The screen contained `northline-studio-invoice.pdf`, Northline Studio Ltd., Harbour Arts Council, and `HAC-2026-014 · Autumn campaign`.
- The sticky banner contained **“Demo — sample data, nothing is saved”**, **Reset demo**, and **Start for real**.
- Reset restored the original fields, one seed row, and a null demo counter.
- A pre-seeded ordinary `REAL-REVIEW-3` row and count `2` survived Start for real. Demo database and counter did not.
- The real → demo → Reset → real flow made 11 same-origin GET requests and no console/page errors.
- After service-worker control, an offline `/demo` reload returned 200 and retained the sample. All six observed requests were same-origin and had no failures.

The demo and sandbox gate passes. F-3-2 concerns the ordinary workspace’s selected-file lifetime.

## Registered claim results

A no-hard-link clone at `/tmp/performed-for-review3.B8mKRM/clone` used commit `bc54f16805ff47070860ba5294eaca25d20a97d4` and `npm ci`. Every literal `.factory/claims.json` command ran separately.

| Claim ID | Result | Claim ID | Result |
| --- | --- | --- | --- |
| `demo-isolated` | PASS | `original-invoice-intact` | PASS |
| `csv-export` | PASS | `json-backup` | PASS |
| `json-import` | PASS | `record-deletion` | PASS |
| `offline-reload` | PASS | `runs-on-device` | PASS |
| `no-analytics` | PASS | `no-cloud-document-storage` | PASS |
| `one-time-unlock` | PASS | `relationship-recall` | PASS |
| `license-restore-anywhere` | PASS | `demo-reset` | PASS |
| `invalid-record-recovery` | PASS | `billing-api-only` | PASS |
| `end-client-not-payer` | PASS | `no-third-party-runtime-assets` | PASS |
| `pdf-size-limit` | PASS | `three-free-packages` | PASS |
| `exact-relationship-text` | PASS | `cover-before-invoice` | PASS |
| `license-revocation` | PASS | `relationship-log` | PASS |
| `clear-site-data` | PASS |  |  |

No registered claim failed. F-3-2 and F-3-3 identify public wording outside those tested claim boundaries.

## History verification

Every review-1 and review-2 finding, both polish reports, and the current handoff were checked live and in current code.

| Earlier finding | Current result |
| --- | --- |
| F-1-1 demo below another hero | Fixed: banner, sample row, filename, and fields are in both first viewports. |
| F-1-2 Back loses scroll/focus | Fixed for the exact prior flow after scroll animation; the visible trigger regains focus. F-3-1 is a different hash defect. |
| F-1-3 mobile omits facts | Fixed: all facts end by y=782.9. |
| F-1-4 restore claim | Fixed: registered command passes. |
| F-1-5 Reset claim | Fixed: manual Reset and registered command pass. |
| F-1-6 recovery claim | Fixed: registered command passes. |
| F-1-7 billing/provider claim | Fixed for the registered API boundary; F-3-3 covers added legal wording. |
| F-1-8 liability claim | Fixed: workspace and cover test passes. |
| F-1-9 runtime-assets claim | Fixed: request-log claim passes. |
| F-1-10 inconsistent terms | Fixed: billing client, end client, and project / PO reference are consistent. |
| F-1-11 relationship recall jargon | Fixed: copy says saved client suggestions. |
| F-1-12 long audience sentence | Fixed: 19 words. |
| F-1-13 long test sentence | Fixed: short bullets. |
| F-1-14 long build sentence | Fixed: two sentences. |
| F-1-15 missing privacy section | Fixed: section precedes price. |
| F-1-16 empty Actions header | Fixed: visible Actions; Axe clean. |
| F-1-17 manifest MIME | Fixed: live `application/manifest+json`. |
| F-1-18 touch icon | Fixed: linked 180 × 180 icon. |
| F-2-1 mobile Back focus | Fixed: exact test restores visible focus and scroll. |
| F-2-2 cover claim | Fixed: registered command passes. |
| F-2-3 revocation claim | Fixed: registered command passes. |
| F-2-4 relationship logging claim | Fixed: registered command passes. |
| F-2-5 clear-site-data claim | Fixed: registered command passes. |
| F-2-6 future promise | Fixed: phrase is absent. |
| F-2-7 hidden phone header | Fixed: four links visible with tested targets. |
| F-2-8 missing How it works | Fixed: Choose, Name, Download steps. |
| F-2-9 duplicate License headings | Fixed: distinct headings. |
| F-2-10 footer one-liner | Fixed on all routes. |
| Handoff: completion race | Fixed: state-before-download test passes. |
| Handoff: demo order | Fixed: Relationship 01 precedes Source invoice 02 visually. |
| Handoff: token in referrers | Fixed: no-referrer header and test pass. |
| Handoff: no real payment | Still a verification limit, not a defect; no purchase was made. |

## Structure, accessibility, and quality checks

| Check | Result |
| --- | --- |
| Titles, h1, language, landmarks | PASS on root, Demo, Privacy, Terms, and 404. |
| Description, canonical, OG/Twitter | PASS; social image is 1200 × 630. |
| Favicons | PASS: SVG plus 180 × 180 Apple icon. |
| Designed 404 | PASS: unknown routes return HTTP 404 with the product shell. |
| Deep links | **FAIL:** F-3-1. |
| Back/focus | PASS for ordinary routes; F-3-1 covers hash entry. |
| Link crawl | PASS for status; checkout reaches hosted 200. Disclosure fails F-3-6. |
| Header/footer and landing order | PASS. |
| Visual identity | PASS: survey paper, contour art, coral marks, clipped sheets, and map rules match `.factory/design.md`; not generic SaaS. |
| Axe | PASS: zero violations on five live routes at 390 px. |
| Keyboard, targets, reflow, motion | PASS in the full suite. |
| Console | PASS except the expected main-resource error on the intentional 404. |
| Headers/manifest | PASS: CSP, no-referrer, nosniff, permissions, HSTS, and manifest MIME are live. |
| Offline/privacy log | PASS: offline 200; demo requests were same-origin GETs. |
| Local gates | PASS: lint, typecheck, 10 unit tests, 43 Chromium tests, build. |
| Bundles | PASS: initial JS 12.43 KB gzip; CSS 4.10 KB gzip; PDF engine 175.81 KB gzip and lazy. |
| Live suite | PASS 43/43 after build; clean-checkout live mode fails F-3-4 first. |

## Missed leverage

No additional AI feature is justified. This job requires deterministic PDF assembly and exact names/references. CSV export, JSON backup/import, local suggestions, and offline use cover the obvious leverage. No decorative AI, provider key, Azure endpoint, or model call is present.

## What would make this perfect

Resolve all six findings and rerun the whole review. Hash destinations must open and focus their section; invoice-memory copy must match actual lifetime; payment responsibilities need a registered test or narrower wording; live tests need a documented clean-checkout command; “metadata” must name the fields; and hosted checkout must be disclosed. Acceptance requires zero findings and no untested claim.
