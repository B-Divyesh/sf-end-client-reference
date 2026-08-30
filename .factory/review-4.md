# Adversarial first-read review 4 — Performed For

Reviewed 2026-08-30 against repository commit `444ac4147f5012fdbd53e8cb6af5c3c2547175f9` and <https://end-client-reference.sociobot.in> in fresh Chromium contexts at 390 × 844 and 1440 × 900.

## Verdict

**FAIL.** Five findings remain: one high, three medium, and one minor. There are no blocking findings. The cold first screen, one-click demo, demo isolation, Reset, offline behavior, routing, accessibility checks, local build, full test suite, and all 27 registered claim commands pass. The result is still FAIL because four public README promises are absent from `.factory/claims.json`, and route metadata uses an unexplained, inconsistent phrase.

## Cold first read, before scrolling

### Phone, 390 × 844

- What it does: adds an end-client cover to an existing invoice PDF.
- For whom: subcontractors and white-label agencies.
- What to click first: **Try it with sample data**.

The exact text was **“Add the end client to every invoice.”**, **“For subcontractors and white-label agencies, add a clear cover to an existing invoice PDF before sending it.”**, and **“Try it with sample data.”** The action ends at y=528.1. Its result and all four short facts are visible; the lowest fact ends at y=782.9. The blocking cold-read gate passes.

### Desktop, 1440 × 900

The same three answers are clear from the same text. The primary action ends at y=613.2, and the lowest fact ends at y=812.0. The blocking cold-read gate passes.

## Findings

### High

#### F-4-1 — Formula-safe CSV is a public but unlisted security claim

- Exact quote/location: README, **Test and build** — **“CSV cells cannot run spreadsheet formulas;”**
- Evidence: `.factory/claims.json` declares only **“Exports the relationship log as CSV.”** Its tagged `@claim:csv-export` test checks sample content, not malicious formula prefixes. A separate untagged browser test and a unit test currently pass, but the claims verifier cannot discover either from the public promise.
- Why this misleads: a visitor exporting client data could rely on this spreadsheet-safety guarantee. The required clean claim run may remain green even if the untagged protection regresses.
- Concrete fix: add a `csv-formula-safety` entry to `.factory/claims.json` and tag exactly one test `@claim:csv-formula-safety`. Use cells beginning with `=`, `+`, `-`, and `@`, download the CSV, and assert that none remains executable. Otherwise remove the README sentence.

### Medium

#### F-4-2 — The README’s mobile-size promise is vague and unlisted

- Exact quote/location: README, **Test and build** — **“mobile text and controls meet their size limits;”**
- Evidence: no claim entry names a text size, target size, viewport, or reflow result. Two untagged tests currently check 16 px text, 44 × 44 px targets, 390 px and 320 px layouts, and 200%-equivalent reflow.
- Why this misleads: **“their size limits”** gives a reader no usable limit and is absent from the claim registry, so the public statement cannot be run independently.
- Concrete fix: rewrite it as **“Text stays at least 16 px, and visible controls stay at least 44 × 44 px on phones.”** Add one claim entry with a tagged clean-context test at 390 px and 320 px, including 200% reflow.

#### F-4-3 — “Routes” and “accessibility” are broad, unlisted README claims

- Exact quote/location: README, **Test and build** — **“routes, accessibility, and offline reload work.”**
- Evidence: `offline-reload` covers only the last clause. Route and Axe checks exist in untagged tests, but no claim entry states their observable scope. **“Routes”** is implementation jargon, while **“accessibility”** overstates what an automated scan alone establishes.
- Why this misleads: a reader cannot tell which pages or accessibility outcomes were verified, and the claim runner cannot discover those promises.
- Concrete fix: replace the sentence with **“Privacy, Terms, and the not-found page open directly.”** and **“Automated checks find no serious or critical accessibility issues on those pages.”** Register each testable promise and tag exactly one test for each. Keep the existing `offline-reload` sentence separate.

#### F-4-4 — “One-click sample demo” is not in the claim registry

- Exact quote/location: README opening — **“Start with the one-click sample demo.”**
- Evidence: `demo-isolated` starts at `/demo`; it does not assert the number of actions from `/`. An untagged first-screen test does click **Try it with sample data** once and confirms the prepared sample screen.
- Why this misleads: the one-click path is a quantitative product promise and the required entry point for first-time visitors, but the claims runner cannot select it.
- Concrete fix: add `demo-one-click` with the claim **“One click opens a prepared sample invoice.”** Tag the existing landing-to-demo assertion and verify the banner, sample filename, populated client, and sample record after that click.

### Minor

#### F-4-5 — Search and sharing metadata uses an unexplained product term

- Exact locations: root title/OG title **“Performed For — invoice relationship covers”**; root description **“Add a clear performed-for relationship to any invoice PDF, privately on your device.”**; demo description **“Try a private invoice relationship cover with isolated sample data.”**; Terms description **“Terms for Performed For invoice relationship covers.”**
- Evidence: visible copy consistently calls the output an **“end-client cover”** and the saved rows a **“relationship log.”** **“Invoice relationship cover”** and **“performed-for relationship”** appear only in metadata and do not name the job in the visitor’s words.
- Why this loses a first-time visitor: search and social previews may be the actual first screen. These phrases require the visitor to infer what kind of relationship or cover is meant.
- Concrete fix: use **“Performed For — add end-client covers to invoices”** for the root title/OG title. Use **“Add an end-client cover to an existing invoice PDF. Runs on your device.”** for the root description, **“Try adding an end-client cover to a sample invoice PDF. Sample data stays separate.”** for Demo, and **“Terms for adding end-client covers to invoice PDFs with Performed For.”** for Terms.

## Copy audit

Counts treat hyphenated terms, paths, URLs, prices, and the version/build string as one word. Separator glyphs are not words. No sentence exceeds 22 words. No banned marketing adjective appears. Buttons and action links use verbs. F-4-2, F-4-3, and F-4-5 identify the jargon or vague wording found; F-4-1 and F-4-4 identify otherwise clear claims that are not registered.

### Landing page — first screen

| ID | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| L01 | 4 | Skip to main content | Pass |
| L02 | 2 | Performed For | Product name |
| L03 | 3 | Invoice cover sheets | Pass |
| L04 | 1 | Workspace | Pass |
| L05 | 2 | Try sample | Pass |
| L06 | 2 | Relationship log | Pass |
| L07 | 1 | Privacy | Pass |
| L08 | 5 | Billing client → end client → project | Pass |
| L09 | 7 | Add the end client to every invoice. | `cover-before-invoice` |
| L10 | 17 | For subcontractors and white-label agencies, add a clear cover to an existing invoice PDF before sending it. | `cover-before-invoice` |
| L11 | 5 | Try it with sample data | Pass; README’s one-click claim is F-4-4 |
| L12 | 3 | Use your invoice | Pass |
| L13 | 11 | The sample opens a completed invoice example in an isolated demo. | `demo-isolated` |
| L14 | 4 | Runs on your device | `runs-on-device` |
| L15 | 5 | Keeps the original invoice intact | `original-invoice-intact` |
| L16 | 5 | Works offline after first visit | `offline-reload` |
| L17 | 5 | Three packages free · $19 once | `three-free-packages`, `one-time-unlock` |
| L18 | 11 | Layered paper illustration linking a billing client to an end client | Useful image alt |

### Landing page — workspace and relationship log

| ID | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| L19 | 2 | Invoice package | Pass |
| L20 | 3 | How it works | Pass |
| L21 | 4 | 3 free packages left | `three-free-packages` |
| L22 | 4 | Choose an invoice PDF | Pass |
| L23 | 3 | Name both clients | Pass |
| L24 | 4 | Download the combined PDF | `cover-before-invoice` |
| L25 | 2 | Source invoice | Pass |
| L26 | 5 | Choose the existing invoice PDF | Pass |
| L27 | 11 | PDF only · up to 25 MB · cleared after a successful download | `pdf-size-limit`, `invoice-cleared-after-download` |
| L28 | 3 | No file selected | Pass with the adjacent choose-file instruction |
| L29 | 1 | Relationship | Pass |
| L30 | 2 | Billing client | Pass |
| L31 | 5 | The company responsible for payment | Pass |
| L32 | 2 | End client | Pass |
| L33 | 8 | The customer receiving the work; not the payer | `end-client-not-payer` |
| L34 | 3 | Project / PO reference | Pass |
| L35 | 4 | Preserved exactly as entered | `exact-relationship-text` |
| L36 | 2 | Invoice number | Pass |
| L37 | 1 | Optional | Pass |
| L38 | 2 | Service period | Pass |
| L39 | 5 | Optional, in your preferred format | Pass |
| L40 | 2 | Your output | Pass |
| L41 | 11 | One cover page followed by every page of the original invoice. | `cover-before-invoice` |
| L42 | 2 | Generate package | Pass |
| L43 | 4 | Saved on this device | Pass |
| L44 | 2 | Relationship log | Pass |
| L45 | 2 | Export CSV | `csv-export`; formula safety is F-4-1 |
| L46 | 2 | Backup JSON | `json-backup` |
| L47 | 2 | Import JSON | `json-import` |
| L48 | 4 | No relationships logged yet | Pass |
| L49 | 9 | Your first generated package will add its relationship here. | `relationship-log` |
| L50 | 12 | Only client names, references, dates, and filenames are saved—not the invoice PDF. | `no-cloud-document-storage` |

### Landing page — privacy, price, footer, and persistent status copy

| ID | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| L51 | 3 | Privacy and limits | Pass |
| L52 | 5 | What stays on this device | Pass |
| L53 | 15 | The selected PDF stays in this tab until a successful download, then it is cleared. | `invoice-cleared-after-download` |
| L54 | 10 | It is never uploaded or added to the relationship log. | `no-cloud-document-storage` |
| L55 | 12 | Only client names, references, dates, and filenames are saved in your browser. | `no-cloud-document-storage` |
| L56 | 11 | Performed For does not issue invoices or change who owes payment. | Clear scope limit |
| L57 | 6 | The billing client remains the payer. | `end-client-not-payer` |
| L58 | 2 | One-time license | Pass |
| L59 | 3 | Generate unlimited packages. | `one-time-unlock` |
| L60 | 4 | Three packages are free. | `three-free-packages` |
| L61 | 10 | Pay $19 once for unlimited packages and saved client suggestions. | `one-time-unlock`, `relationship-recall` |
| L62 | 7 | Restore an active license on another device. | `license-restore-anywhere` |
| L63 | 4 | Buy the one-time unlock | Pass; literal paid unlock |
| L64 | 5 | Opens the hosted Sociobot checkout. | `hosted-checkout` |
| L65 | 3 | Have a license? | Clear disclosure summary |
| L66 | 3 | Paste license token | Pass |
| L67 | 2 | Verify license | Pass |
| L68 | 1 | Offline. | Clear state |
| L69 | 13 | The workspace and your records still work; license checks will resume when connected. | Clear recovery state |
| L70 | 11 | Performed For adds an end-client cover to an existing invoice PDF. | `cover-before-invoice` |
| L71 | 6 | Invoice files stay on your device. | `runs-on-device`, `no-cloud-document-storage` |
| L72 | 2 | No analytics. | `no-analytics` |
| L73 | 4 | No cloud document storage. | `no-cloud-document-storage` |
| L74 | 1 | Privacy | Pass |
| L75 | 1 | Terms | Pass |
| L76 | 12 | Built by Param Factory · v1.0.0 · build [id] · Illustration generated for this product. | Clear attribution and provenance |

### README

| ID | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| R01 | 2 | Performed For | Product name |
| R02 | 9 | Add an end-client cover to an existing invoice PDF. | `cover-before-invoice` |
| R03 | 19 | It is for subcontractors and agencies that invoice a billing client but must name the end client and project. | Pass |
| R04 | 6 | Start with the one-click sample demo. | F-4-4 |
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
| R15 | 14 | The selected invoice stays in your browser and is cleared after a successful download. | `runs-on-device`, `invoice-cleared-after-download` |
| R16 | 12 | The relationship log stores client names, references, invoice details, dates, and filenames. | `no-cloud-document-storage` test checks the exact fields |
| R17 | 12 | No analytics, third-party scripts, CDN fonts, or cloud document storage are used. | Three registered privacy claims |
| R18 | 3 | Price and unlock | Pass |
| R19 | 4 | Three packages are free. | `three-free-packages` |
| R20 | 14 | A $19 one-time license enables unlimited packages and saved client suggestions on this device. | `one-time-unlock`, `relationship-recall` |
| R21 | 9 | You can restore an active license on another device. | `license-restore-anywhere` |
| R22 | 6 | Buying opens Sociobot’s hosted Dodo checkout. | `hosted-checkout` |
| R23 | 12 | Dodo is the merchant of record and handles order inquiries and returns. | `hosted-checkout` |
| R24 | 7 | License verification uses the Sociobot billing API. | `billing-api-only` |
| R25 | 2 | Run locally | Pass |
| R26 | 5 | Requirements: Node.js 22+ and npm. | Pass |
| R27 | 6 | Open the URL printed by Vite. | Pass |
| R28 | 8 | For the offline path, use a production preview. | Pass |
| R29 | 3 | Optional build-time variables | Pass |
| R30 | 4 | `VITE_BILLING_BASE` — billing API root. | Pass |
| R31 | 3 | Defaults to `https://api.sociobot.in/api/v1`. | Pass |
| R32 | 4 | `VITE_LICENSE_PRICE` — displayed one-time price. | Pass |
| R33 | 3 | Defaults to `$19`. | Pass |
| R34 | 3 | Test and build | Pass |
| R35 | 3 | `npm test` checks: | Pass |
| R36 | 5 | original invoice pages stay unchanged; | `original-invoice-intact` |
| R37 | 6 | CSV cells cannot run spreadsheet formulas; | F-4-1 |
| R38 | 4 | demo data is discarded; | `demo-isolated` |
| R39 | 8 | saved records can be exported, imported, and deleted; | `csv-export`, `json-backup`, `json-import`, `record-deletion` |
| R40 | 8 | mobile text and controls meet their size limits; | F-4-2 |
| R41 | 6 | routes, accessibility, and offline reload work. | F-4-3; offline portion is registered |
| R42 | 9 | Playwright starts a fresh production preview for PWA checks. | Verified configuration statement |
| R43 | 6 | The pinned Playwright version is 1.58.2. | Verified in `package.json` |
| R44 | 11 | `npm run build` type-checks the app and writes it to `dist/`. | Verified build statement |
| R45 | 16 | The output includes direct route files, the 404 page, host settings, and an offline service worker. | Verified build statement |
| R46 | 12 | From a clean checkout, test the deployed artifact without a local build: | Verified instruction |
| R47 | 7 | Deploy `dist/` to the configured static host. | Pass |
| R48 | 9 | This repository does not manage DNS or billing registration. | Clear repository scope |
| R49 | 2 | Software license | Pass |
| R50 | 3 | MIT — see LICENSE. | Pass |

### Terminology

| Concept | Consistent visible term |
| --- | --- |
| Company responsible for payment | Billing client |
| Customer receiving the work | End client |
| Work identifier | Project / PO reference |
| New first page | End-client cover |
| Combined cover and source PDF | Invoice package |
| Saved client-detail rows | Relationship log |
| Sample-only workspace | Demo |

F-4-5 is the exception: metadata introduces **performed-for relationship** and **invoice relationship cover** instead of these visible terms.

## Demo and sandbox verification

- One click from `/` opened `/?demo=1` with title **Demo — Performed For** and no scroll.
- At 390 × 844, the banner ended at y=248.7, the prepared filename at y=412.0, the sample record at y=492.6, the billing-client input at y=593.3, and the end-client input at y=738.7.
- The first screen showed `northline-studio-invoice.pdf`, Northline Studio Ltd., Harbour Arts Council, and `HAC-2026-014 · Autumn campaign`.
- The sticky banner said **“Demo — sample data, nothing is saved”** and exposed **Reset demo** and **Start for real**.
- Generating produced `NL-1048-performed-for.pdf` with two pages, added a second sample row, and cleared the selected file from the tab.
- Reset completed in 74 ms and restored the prepared invoice, both clients, project reference, one seed row, and a null demo counter.
- A pre-seeded ordinary `REAL-REVIEW-4` record and real use count `2` survived **Start for real**. The demo database and counter were deleted. Re-entering Demo showed only the original seed.
- The complete flow made only same-origin GET requests. No console or page errors occurred.
- The registered offline test acquired service-worker control, reloaded the sample at 390 px while offline, and generated the PDF without the network.

The demo and sandbox gates pass.

## Registered claim results

A no-hard-link clone at `/tmp/performed-for-review4.UkkRFn/clone` used commit `444ac4147f5012fdbd53e8cb6af5c3c2547175f9`. After `npm ci`, every literal command in `.factory/claims.json` ran independently.

| Claim ID | Result | Claim ID | Result |
| --- | --- | --- | --- |
| `demo-isolated` | PASS | `original-invoice-intact` | PASS |
| `csv-export` | PASS | `json-backup` | PASS |
| `json-import` | PASS | `record-deletion` | PASS |
| `offline-reload` | PASS | `runs-on-device` | PASS |
| `no-analytics` | PASS | `no-cloud-document-storage` | PASS |
| `invoice-cleared-after-download` | PASS | `one-time-unlock` | PASS |
| `relationship-recall` | PASS | `license-restore-anywhere` | PASS |
| `demo-reset` | PASS | `invalid-record-recovery` | PASS |
| `billing-api-only` | PASS | `hosted-checkout` | PASS |
| `end-client-not-payer` | PASS | `no-third-party-runtime-assets` | PASS |
| `pdf-size-limit` | PASS | `three-free-packages` | PASS |
| `exact-relationship-text` | PASS | `cover-before-invoice` | PASS |
| `license-revocation` | PASS | `relationship-log` | PASS |
| `clear-site-data` | PASS |  |  |

No registered claim test failed. F-4-1 through F-4-4 are public product promises found outside the registry.

## History verification

Every finding in reviews 1–3 and every claimed repair in polish reports 1–3 was checked against the live site and current code, not merely against the repair notes.

| Earlier finding | Fresh live/code result |
| --- | --- |
| F-1-1 demo below another hero | Fixed: one-click and direct Demo start with the sticky banner, filename, sample record, and populated fields in both initial viewports. |
| F-1-2 Back loses scroll/focus | Fixed: the 390 px Privacy → Back test restores the prior scroll and visible Privacy-link focus. |
| F-1-3 mobile omits facts | Fixed: action result and all four facts end by y=782.9. |
| F-1-4 restore claim absent | Fixed: `license-restore-anywhere` is registered and passes in a separate context. |
| F-1-5 Reset claim absent | Fixed: `demo-reset` is registered; manual Reset and the clean claim pass. |
| F-1-6 invalid-record recovery absent | Fixed: the registered selective-removal claim passes. |
| F-1-7 billing boundary absent | Fixed: `billing-api-only` and `hosted-checkout` pass. |
| F-1-8 payer wording absent | Fixed: workspace and generated-cover assertions pass. |
| F-1-9 third-party runtime claim absent | Fixed: registered runtime-asset and live request-origin checks pass. |
| F-1-10 inconsistent relationship terms | Fixed in visible copy and README; F-4-5 is limited to metadata. |
| F-1-11 “relationship recall” jargon | Fixed: visible copy says **saved client suggestions**. |
| F-1-12 long README audience sentence | Fixed: the current sentence is 19 words. |
| F-1-13 long README test sentence | Fixed: it is a short bullet list. New registry/copy defects in three bullets are F-4-1 through F-4-3. |
| F-1-14 long README build sentence | Fixed: current build sentences are 11 and 16 words. |
| F-1-15 missing privacy/limits section | Fixed: **What stays on this device** appears before price. |
| F-1-16 empty Actions header | Fixed: the header is visible; live Axe integration passes. |
| F-1-17 manifest MIME | Fixed: live response is `application/manifest+json`. |
| F-1-18 touch icon size | Fixed: the linked asset declares and ships at 180 × 180. |
| F-2-1 phone Back focus | Fixed: the live 390 px regression restores visible focus and scroll. |
| F-2-2 cover result unlisted | Fixed: `cover-before-invoice` is registered and passes. |
| F-2-3 revocation unlisted | Fixed: `license-revocation` is registered and passes. |
| F-2-4 relationship logging unlisted | Fixed: `relationship-log` is registered and passes after reload. |
| F-2-5 clear-site-data unlisted | Fixed: the registered Chromium storage-clearing test passes. |
| F-2-6 future-workflow promise | Fixed: the untestable promise remains absent. |
| F-2-7 hidden phone navigation | Fixed: all four destinations are visible with tested 44 px targets. |
| F-2-8 missing verb-led How it works | Fixed: Choose, Name, and Download steps remain in order. |
| F-2-9 duplicate README License headings | Fixed: **Price and unlock** and **Software license** remain distinct. |
| F-2-10 footer lacks one-liner | Fixed on root, Demo, Privacy, Terms, and 404. |
| F-3-1 broken Relationship log deep link | Fixed: direct and cross-route `/#records` scroll, focus `records-title`, announce the section, and preserve Back state. |
| F-3-2 selected invoice not discarded | Fixed: the registered claim and manual demo generation clear the input, visible filename, and in-memory selection. |
| F-3-3 provider responsibilities unlisted | Fixed: wording is narrowed; `hosted-checkout` verifies the 303 target and hosted merchant/returns text without purchase. |
| F-3-4 clean-checkout live suite failed | Fixed: the fresh clone ran the deployed suite without `dist/`; 10 unit and 45 browser tests passed, with only the local mutation simulation skipped. |
| F-3-5 “metadata” jargon | Fixed: visible copy names client names, references, dates, and filenames. |
| F-3-6 external purchase undisclosed | Fixed: visible copy says hosted checkout, the accessible name states it, and `rel="external"` is present. |

Earlier handoff concerns about completion ordering, demo step order, referrer leakage, and deployment-only testing also pass their current regressions. No real payment was made; checkout verification stops before purchase at the public hosted page.

## Structure, accessibility, and quality checks

| Check | Result |
| --- | --- |
| Route titles | PASS for length and per-route updates; plain-word terminology fails F-4-5. |
| One h1, language, landmarks | PASS on `/`, `/demo`, `/privacy`, `/terms`, and the designed 404. |
| Description, canonical, OG/Twitter | Canonical URLs, cards, and the 1200 × 630 original image pass; description wording fails F-4-5. |
| Favicons | PASS: SVG favicon and 180 × 180 Apple touch icon. |
| Designed 404 | PASS: an unknown URL returns HTTP 404 with the product shell and **Open workspace**. The browser’s expected failed-main-resource message is limited to that intentional 404 response. |
| Deep links and Back | PASS: direct routes, `/#records`, route focus/announcement, Back focus, and scroll restoration pass. |
| Link crawl | PASS: every same-origin destination and asset returns 200; the intentional unknown route returns 404; mail links are explicit; checkout returns the tested 303 hosted redirect. |
| Header/footer and standard order | PASS on phone and desktop. The landing order is header, first screen, real product, How it works, privacy/limits, exact price, and footer. |
| Visual identity | PASS: warm survey paper, topographic cut-paper art, forest/coral registration marks, clipped sheets, and map-grid rules match `.factory/design.md` and are not a generic SaaS template. |
| Accessibility | PASS in current evidence: zero serious/critical Axe findings on five routes, keyboard flow, visible focus, 44 px targets, 16 px text, 200%-equivalent reflow, reduced motion, and no horizontal overflow. The public README wording/registration still fails F-4-2 and F-4-3. |
| Privacy/offline | PASS: demo requests are same-origin GETs, storage namespaces remain separate, and offline reload plus generation passes. |
| Console | PASS on root, Demo, Privacy, Terms, and the complete demo flow. |
| Local gates | PASS: lint, typecheck, build, 10 unit tests, and 46 Chromium tests. |
| Deployed suite | PASS: 10 unit and 45 live browser tests; one local-only worker-mutation test skipped. |
| Bundle | PASS: initial JavaScript is 12.75 KB gzip and CSS is 4.11 KB gzip. The 175.81 KB PDF engine is lazy-loaded. |

The worker verifier also passed `/`, `/demo`, `/privacy`, and `/terms`: each returned 200 with one h1, `lang=en`, a main landmark, complete image alt coverage, labeled buttons, and no console errors.

## Missed leverage

No missing AI feature is justified. The job requires deterministic PDF assembly and exact client names and references; model output would add risk without solving the brief. CSV export, complete JSON backup/import, individual deletion, local paid suggestions, and offline use cover the obvious import/export and reuse needs. No decorative AI, provider key, Azure runtime endpoint, or model call is present.

Cloud sync would conflict with the brief’s local-first privacy constraint unless it became a separate, explicit encrypted feature. It is not an obvious omission from this product.

## What would make this perfect

Resolve all five findings, then rerun the complete review. Register and tag the one-click demo, CSV formula safety, mobile-size, route, and scoped automated-accessibility promises. Replace metadata-only **“performed-for relationship”** and **“invoice relationship cover”** wording with **“end-client cover.”** Acceptance requires zero findings and no public claim outside `.factory/claims.json`.
