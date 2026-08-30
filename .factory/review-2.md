# Adversarial first-read review 2 — Performed For

Reviewed 2026-08-30 against repository commit `49cdbb8c723e64e1e50d5c7d60c3049240ce95f5` and <https://end-client-reference.sociobot.in> in fresh Chromium contexts at 390 × 844 and 1440 × 900.

## Verdict

**FAIL.** There are 10 findings: 1 blocking, 2 high, 5 medium, and 2 minor. All 21 registered claim commands pass from a clean clone, the demo works and is isolated, and the live suite passes 38/38. The result is still FAIL because mobile Back navigation regresses an earlier blocking focus defect, five public promises are absent from the claims registry, and the site-structure and copy checks are not clean.

## Cold first read, before scrolling

### Phone, 390 × 844

- What it does, in my words: adds an end-client cover to an existing invoice PDF.
- For whom: subcontractors and white-label agencies.
- What I should click first: **Try it with sample data**.

The exact first-screen copy that supplied those answers was **“Add the end client to every invoice.”**, **“For subcontractors and white-label agencies, add a clear cover to an existing invoice PDF before sending it.”**, and **“Try it with sample data”**. The action result and all four facts also fit: their lowest edge was y=756.14 in the 844 px viewport. This blocking gate passes.

### Desktop, 1440 × 900

- What it does: adds an end-client cover to an invoice PDF.
- For whom: subcontractors and white-label agencies.
- What I should click first: **Try it with sample data**.

The same exact copy supplied all three answers. The action result and all four facts fit, ending at y=811.95 in the 900 px viewport. This blocking gate passes.

## Findings

### Blocking

#### F-2-1 — Mobile Back navigation restores scroll but loses focus (regression of F-1-2)

- Exact location: at 390 × 844, scroll `/` to **Relationship log**, activate **Privacy**, then use Back.
- Live evidence: the Privacy route focuses its `<h1>`, and Back restores `scrollY` from 3654 to 3654. After three seconds, however, `document.activeElement` is still `<body>`.
- Code evidence: `src/app.ts` saves `focusId: "nav-privacy"` and tries to focus it after `popstate`. At 390 px, `src/styles.css` hides `nav a:nth-child(4)`, so the saved control cannot receive focus. The desktop-only regression passes because that link is visible there.
- Why this fails: the exact earlier blocking defect is only half-fixed. A keyboard or screen-reader visitor on the requested phone viewport returns to the right scroll position without a usable focus position.
- Concrete fix: keep a focusable Privacy control in the phone header, or restore focus to a visible equivalent such as an open-menu button that exposes Privacy. Add a 390 × 844 Back regression that asserts both restored scroll and a visible focused element.

### High

#### F-2-2 — The core cover-generation promise is an unlisted claim

- Exact quotes: landing **“Add the end client to every invoice.”**, **“For subcontractors and white-label agencies, add a clear cover to an existing invoice PDF before sending it.”**, and **“One cover page followed by every page of the original invoice.”**; README **“Add an end-client cover to an existing invoice PDF.”** and **“The download adds one cover before the original invoice pages.”**
- Registry result: no `.factory/claims.json` entry states that the downloaded PDF contains a new end-client cover before the source pages. `original-invoice-intact` covers unchanged source content, not creation or placement of the promised cover. An untagged end-to-end test happens to generate a merged PDF, but the claims verifier cannot discover this promise.
- Why this fails: this is the product’s main result. It can regress while every registered claim still reports PASS.
- Concrete fix: add a `cover-before-invoice` claim whose test generates from `/demo`, parses the download, verifies the cover is page 1 with the sample relationship, and verifies the source page begins at page 2. Alternatively expand `original-invoice-intact` to state and assert the complete public promise.

#### F-2-3 — License deactivation after a refund or revocation is an unlisted claim

- Exact quote/location: `/terms`, **“A refunded or revoked purchase deactivates its license.”**
- Registry result: `one-time-unlock` tests a valid license and `license-restore-anywhere` restores a valid fixture. No claim or tagged test returns a revoked verdict after a previously valid license and verifies that unlimited generation is disabled.
- Why this fails: a purchaser could rely on this material licensing rule, but the claim suite does not verify it.
- Concrete fix: add `license-revocation` with a fixture that changes from valid to revoked, force verification, and assert the free-limit state and **“License no longer active.”** notice. Otherwise remove the sentence.

### Medium

#### F-2-4 — Automatic relationship logging is an unlisted claim

- Exact quote/location: landing empty state, **“Your first generated package will add its relationship here.”**
- Registry result: CSV, backup, import, and deletion have entries; creating and persisting the record during generation does not. The generic browser test **“generates a merged PDF and logs the exact relationship”** has no claim tag.
- Why this fails: the relationship log is part of the brief’s job-to-be-done, and the public promise is not independently runnable by the claim verifier.
- Concrete fix: add `relationship-log` and tag a clean-context test that generates once, reloads, and verifies the exact billing client, end client, reference, filename, and date remain in one stored record.

#### F-2-5 — The privacy page’s “clear site data” promise is unlisted

- Exact quote/location: `/privacy`, **“Clearing this site’s browser data removes all locally stored records and the license token from this device.”**
- Registry result: no claim or test clears site data and checks both IndexedDB and the license keys.
- Why this fails: this is the stated deletion control for invoice relationship data and a paid-license token.
- Concrete fix: add `clear-site-data` with a clean-context test that seeds a record and token, clears origin storage, reloads, and verifies both are absent. If browser-controlled clearing cannot be supported in the claim sandbox, rewrite this as browser instructions without promising an app behavior.

#### F-2-6 — The terms make an untestable future-workflow promise

- Exact quote/location: `/terms`, **“We may update the app for security or compatibility while preserving the core local-first workflow.”**
- Registry result: no claim entry exists, and a current build cannot prove what every future update will preserve.
- Why this fails: the sentence asks a visitor to rely on future behavior that the sandbox cannot verify.
- Concrete fix: remove **“while preserving the core local-first workflow.”** Keep the factual current availability language only.

#### F-2-7 — The phone header hides three required destinations

- Exact location: every route at 390 px. Only **Workspace** remains visible; **Try sample**, **Relationship log**, and **Privacy** are hidden by the 700 px and 430 px media rules.
- Why this fails: the required consistent header calls for Demo, a main product section, and Privacy. Hiding all three also creates the focus regression in F-2-1.
- Concrete fix: provide a keyboard-operable mobile navigation control containing those destinations, or retain compact visible links. Keep targets at least 44 × 44 px and test all routes at 390 px.

#### F-2-8 — The required “How it works” sequence is missing and its three labels are not verbs

- Exact location: landing workspace step row, **“Invoice PDF”**, **“Relationship”**, **“Download”**.
- Why this fails: the site-structure contract requires a **How it works** section in three verb-led steps. These nouns identify objects but do not say what to do.
- Concrete fix: label the sequence **How it works** and use **“Choose an invoice PDF”**, **“Name the billing and end clients”**, and **“Download the combined PDF.”** The real workspace can remain the visual demonstration.

### Minor

#### F-2-9 — README uses “License” for two different concepts

- Exact locations: README headings at the paid product entitlement and at the MIT source license are both **“License.”**
- Why this fails: a heading list cannot distinguish purchase terms from the repository’s software license.
- Concrete fix: rename the first heading **“Price and unlock”** and the last **“Software license.”**

#### F-2-10 — The footer lacks the required product one-liner

- Exact quote/location: footer opening, **“Invoice files stay on your device. No analytics. No cloud document storage.”**
- Why this fails: this gives privacy facts but never states what Performed For does. The site-structure footer requires a product one-liner alongside Privacy, Terms, factory credit, version, and build ID.
- Concrete fix: begin with **“Performed For adds an end-client cover to an existing invoice PDF.”** Keep the current privacy facts after it.

## Copy audit

Counts treat hyphenated terms, paths, URLs, versions, and prices as one word and exclude separator glyphs such as `·`, `/`, and `→`. Commands in code blocks are excluded. No item exceeds 22 words, and no banned marketing adjective appears. Buttons use result-naming verbs. The only plain-language copy defect is the duplicate README heading in F-2-9; claim-registration flags are cross-referenced separately.

### Landing page

| ID | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| L01 | 4 | Skip to main content | Pass |
| L02 | 2 | Performed For | Pass |
| L03 | 3 | Invoice cover sheets | Pass |
| L04 | 1 | Workspace | Pass |
| L05 | 2 | Try sample | Pass |
| L06 | 2 | Relationship log | Pass |
| L07 | 1 | Privacy | Pass |
| L08 | 5 | Billing client → end client → project | Pass |
| L09 | 7 | Add the end client to every invoice. | Unlisted claim: F-2-2 |
| L10 | 17 | For subcontractors and white-label agencies, add a clear cover to an existing invoice PDF before sending it. | Unlisted claim: F-2-2 |
| L11 | 5 | Try it with sample data | Pass |
| L12 | 3 | Use your invoice | Pass |
| L13 | 11 | The sample opens a completed invoice example in an isolated demo. | `demo-isolated` |
| L14 | 4 | Runs on your device | `runs-on-device` |
| L15 | 5 | Keeps the original invoice intact | `original-invoice-intact` |
| L16 | 5 | Works offline after first visit | `offline-reload` |
| L17 | 5 | Three packages free · $19 once | `three-free-packages`, `one-time-unlock` |
| L18 | 2 | Invoice package | Pass |
| L19 | 3 | Prepare a package | Pass |
| L20 | 4 | 3 free packages left | `three-free-packages` |
| L21 | 2 | Invoice PDF | Pass |
| L22 | 1 | Relationship | Pass |
| L23 | 1 | Download | Pass |
| L24 | 2 | Source invoice | Pass |
| L25 | 5 | Choose the existing invoice PDF | Pass |
| L26 | 10 | PDF only · up to 25 MB · read locally, never retained | `pdf-size-limit`, `no-cloud-document-storage` |
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
| L40 | 11 | One cover page followed by every page of the original invoice. | Unlisted claim: F-2-2 |
| L41 | 2 | Generate package | Pass |
| L42 | 3 | Privacy and limits | Pass |
| L43 | 5 | What stays on this device | Pass |
| L44 | 10 | Invoice PDFs are read to make a download, then discarded. | `no-cloud-document-storage` test checks stored fields |
| L45 | 9 | Only client relationship details are saved in your browser. | `no-cloud-document-storage` test checks stored fields |
| L46 | 11 | Performed For does not issue invoices or change who owes payment. | Scope statement; payer part covered by `end-client-not-payer` |
| L47 | 6 | The billing client remains the payer. | `end-client-not-payer` |
| L48 | 2 | One-time license | Pass |
| L49 | 3 | Generate unlimited packages. | `one-time-unlock` |
| L50 | 4 | Three packages are free. | `three-free-packages` |
| L51 | 10 | Pay $19 once for unlimited packages and saved client suggestions. | `one-time-unlock`, `relationship-recall` |
| L52 | 7 | Restore an active license on another device. | `license-restore-anywhere` |
| L53 | 4 | Buy the one-time unlock | Pass |
| L54 | 3 | Have a license? | Pass |
| L55 | 3 | Paste license token | Pass |
| L56 | 2 | Verify license | Pass |
| L57 | 4 | Saved on this device | Pass |
| L58 | 2 | Relationship log | Pass |
| L59 | 2 | Export CSV | `csv-export` |
| L60 | 2 | Backup JSON | `json-backup` |
| L61 | 2 | Import JSON | `json-import` |
| L62 | 4 | No relationships logged yet | Pass |
| L63 | 9 | Your first generated package will add its relationship here. | Unlisted claim: F-2-4 |
| L64 | 7 | Only metadata is saved—never the invoice PDF. | `no-cloud-document-storage` test checks stored fields |
| L65 | 6 | Invoice files stay on your device. | `runs-on-device`, `no-cloud-document-storage` |
| L66 | 2 | No analytics. | `no-analytics` |
| L67 | 4 | No cloud document storage. | `no-cloud-document-storage` |
| L68 | 1 | Privacy | Pass |
| L69 | 1 | Terms | Pass |
| L70 | 12 | Built by Param Factory · v1.0.0 · build dc5013182708 · Illustration generated for this product. | Pass |

### README

| ID | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| R01 | 2 | Performed For | Pass |
| R02 | 9 | Add an end-client cover to an existing invoice PDF. | Unlisted claim: F-2-2 |
| R03 | 19 | It is for subcontractors and agencies that invoice a billing client but must name the end client and project. | Pass |
| R04 | 6 | Start with the one-click sample demo. | Pass |
| R05 | 14 | Or choose an invoice and enter its billing client, end client, and project reference. | Pass |
| R06 | 10 | The download adds one cover before the original invoice pages. | Unlisted claim: F-2-2 |
| R07 | 11 | The cover says the end client is not liable for payment. | `end-client-not-payer` |
| R08 | 2 | Live: https://end-client-reference.sociobot.in | Pass |
| R09 | 3 | Demo and data | Pass |
| R10 | 9 | `/demo` and `/?demo=1` open a completed Northline Studio example. | `demo-isolated` |
| R11 | 8 | The demo banner can reset the original sample. | `demo-reset` |
| R12 | 7 | Start for real discards the demo data. | `demo-isolated` |
| R13 | 4 | Demo records use `demo:performed-for`. | `demo-isolated` |
| R14 | 4 | Ordinary records use `performed-for`. | `demo-isolated` |
| R15 | 6 | Invoice PDFs stay in your browser. | `runs-on-device`, `no-cloud-document-storage` |
| R16 | 6 | The relationship log stores only metadata. | `no-cloud-document-storage` test checks stored fields |
| R17 | 12 | No analytics, third-party scripts, CDN fonts, or cloud document storage are used. | `no-analytics`, `no-third-party-runtime-assets`, `no-cloud-document-storage` |
| R18 | 1 | License | Ambiguous heading: F-2-9 |
| R19 | 4 | Three packages are free. | `three-free-packages` |
| R20 | 14 | A $19 one-time license enables unlimited packages and saved client suggestions on this device. | `one-time-unlock`, `relationship-recall` |
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
| R40 | 9 | Playwright starts a fresh production preview for PWA checks. | Pass |
| R41 | 6 | The pinned Playwright version is 1.58.2. | Pass |
| R42 | 11 | `npm run build` type-checks the app and writes it to `dist/`. | Pass |
| R43 | 16 | The output includes direct route files, the 404 page, host settings, and an offline service worker. | Pass |
| R44 | 8 | Set `PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in` to test an already deployed artifact. | Pass |
| R45 | 7 | Deploy `dist/` to the configured static host. | Pass |
| R46 | 9 | This repository does not manage DNS or billing registration. | Pass |
| R47 | 1 | License | Ambiguous heading: F-2-9 |
| R48 | 4 | MIT — see LICENSE. | Pass |

Terminology is otherwise consistent: **billing client**, **end client**, **project / PO reference** (shortened to **project reference** in README prose), **invoice package**, **relationship log**, and **demo**.

## Demo and sandbox evidence

- One click from `/` reaches `/demo`; direct `/demo` also works.
- At 390 × 844, the demo banner ends at y=270.84, the prepared filename at y=434.11, the sample record at y=514.70, and the populated End client field at y=841.78. All are in the initial viewport. Desktop also passes.
- The banner is sticky and says **“Demo — sample data, nothing is saved”** with **Reset demo** and **Start for real**.
- The first screen contains `northline-studio-invoice.pdf`, Northline Studio Ltd., Harbour Arts Council, and the sample record **Northline Studio → Harbour Arts Council**.
- Generating produced `NL-1048-performed-for.pdf`. Reset restored the original clients/reference and one row, removed the demo counter, and announced **“Demo reset to its sample invoice.”**
- A real `REAL-REVIEW-2` record and real use count were created before demo entry. After **Start for real**, that record and count remained, while `demo:pf_generation_count` and the `demo:performed-for` database were absent.
- The complete real → demo → generate → reset → real flow made only same-origin GET requests. No console or page error occurred.
- The live 38-test suite independently passed offline reload and generation after service-worker control.

The demo and sandbox gate passes.

## Registered claim results

The repository was cloned locally into a new temporary directory at commit `49cdbb8c723e64e1e50d5c7d60c3049240ce95f5`, followed by `npm ci`. Every literal `test` command in `.factory/claims.json` was then run separately.

| Claim ID | Result |
| --- | --- |
| `demo-isolated` | PASS |
| `original-invoice-intact` | PASS |
| `csv-export` | PASS |
| `json-backup` | PASS |
| `json-import` | PASS |
| `record-deletion` | PASS |
| `offline-reload` | PASS |
| `runs-on-device` | PASS |
| `no-analytics` | PASS |
| `no-cloud-document-storage` | PASS |
| `one-time-unlock` | PASS |
| `relationship-recall` | PASS |
| `license-restore-anywhere` | PASS |
| `demo-reset` | PASS |
| `invalid-record-recovery` | PASS |
| `billing-api-only` | PASS |
| `end-client-not-payer` | PASS |
| `no-third-party-runtime-assets` | PASS |
| `pdf-size-limit` | PASS |
| `three-free-packages` | PASS |
| `exact-relationship-text` | PASS |

No registered test failed. F-2-2 through F-2-6 are the unlisted-claim findings found by rereading the live routes and README after the registered run.

## History reconciliation

Every finding in `.factory/review-1.md`, every row in `.factory/polish-1.md`, and the defect/limit items preserved in the prior handoff were checked against the live site and current code.

| Earlier item | Current live/code result |
| --- | --- |
| F-1-1 demo opens below another hero | Fixed: `/demo` starts with the sticky banner and realistic sample UI in both initial viewports. |
| F-1-2 Back loses scroll and focus | **Regressed/half-fixed:** scroll restores, desktop focus restores, but phone focus remains on `<body>` because the stored nav link is hidden. Reopened as blocking F-2-1. |
| F-1-3 mobile first screen omits facts | Fixed: action result and all four facts end by y=756.14. |
| F-1-4 restore-anywhere claim absent | Fixed: registry entry exists; clean command passes. |
| F-1-5 Reset demo claim absent | Fixed: registry entry exists; clean command and manual live Reset pass. |
| F-1-6 unreadable-record claim absent | Fixed: registry entry exists; clean command passes. |
| F-1-7 billing/provider claim absent | Fixed: registry entry exists; clean command passes; checkout resolves to hosted 200. |
| F-1-8 liability claim absent | Fixed: registry entry exists; clean command passes. |
| F-1-9 runtime-assets claim absent | Fixed: registry entry exists; clean command and live request log pass. |
| F-1-10 inconsistent relationship terms | Fixed in live product and README. |
| F-1-11 “relationship recall” jargon | Fixed: visible copy says **saved client suggestions**. |
| F-1-12 long README audience sentence | Fixed: current sentence is 19 words. |
| F-1-13 long README test sentence | Fixed: replaced by six short bullets. |
| F-1-14 long README build sentence | Fixed: split into 11- and 16-word sentences. |
| F-1-15 privacy/limits section absent | Fixed: **What stays on this device** appears before the paid tier. |
| F-1-16 empty Actions table header | Fixed: visible **Actions** header; Axe reports zero violations. |
| F-1-17 manifest MIME | Fixed: live response is `application/manifest+json`. |
| F-1-18 wrong apple-touch size | Fixed: linked asset is 180 × 180. |
| Prior handoff: package completion race | Fixed in code ordering; the dedicated delayed-storage regression and full suites pass. |
| Prior handoff: demo step numbering | Fixed: demo shows Relationship 01 before Source invoice 02; regression passes. |
| Prior handoff: license token in referrers | Fixed: live sends `Referrer-Policy: no-referrer`; regression and request checks pass. |
| Prior handoff limit: no real payment made | Still a stated test limit, not a new defect. Checkout redirects to a hosted 200 page; no purchase was made during this review. |

## Structure, accessibility, and quality checks

| Check | Result |
| --- | --- |
| Route titles | PASS: root, Demo, Privacy, Terms, and 404 have route-specific titles under 60 characters. |
| One h1, `lang`, landmarks | PASS on `/`, `/demo`, `/privacy`, `/terms`, and 404. |
| Description, canonical, OG/Twitter | PASS; route metadata updates and the social image is 1200 × 630. |
| Favicons | PASS: SVG favicon and 180 × 180 apple-touch icon. |
| Designed 404 | PASS: unknown path returns HTTP 404 with the product shell and workspace action. |
| Deep links | PASS: Demo, Privacy, and Terms return 200 directly. |
| Back/focus | **FAIL:** F-2-1. |
| Link crawl | PASS: all internal, manifest, icon, social-art, and legal URLs return 200; checkout reaches hosted 200; mail links are explicit. |
| Header | **FAIL on phone:** F-2-7. |
| Footer | **FAIL:** F-2-10. Privacy, Terms, factory credit, version, and build are present. |
| Standard landing order | **FAIL:** paid/privacy order is correct, but the required verb-led How it works sequence fails F-2-8. |
| Visual identity | PASS: warm survey paper, contour artwork, coral registration marks, clipped sheets, and map-grid rules are distinct from a generic SaaS template and match `.factory/design.md`. |
| Axe | PASS: zero violations on all five checked live routes at 390 px. |
| Keyboard, targets, zoom | PASS in the full suite except the mobile Back focus defect. Visible mobile targets are at least 44 × 44 px; 320 px and 200%-equivalent checks pass. |
| Reduced motion | PASS in the suite; animations/transitions reduce to 0.01 ms and smooth scrolling is disabled. |
| Console | PASS on normal routes and complete demo flow. The browser reports the expected failed main resource only when intentionally requesting the HTTP 404. |
| Response policy | PASS: response-header CSP includes `frame-ancestors`; HSTS, `nosniff`, no-referrer, restrictive permissions, and correct manifest MIME are live. |
| Performance budget | PASS: initial JS is 12.41 KB gzip. The 175.81 KB PDF engine is lazy-loaded for generation. |
| Local gates | PASS: lint, typecheck, 9 unit tests, 38 browser tests, and production build. |
| Live suite | PASS: 38/38 against the deployed URL. |

## Missed leverage

No additional AI feature is justified. This job requires deterministic PDF assembly and exact preservation of client names and project references; model output would add risk without solving an implied task. The expected leverage features—CSV export, JSON backup/import, local saved-client suggestions, and offline use—already exist. No decorative AI, provider key, or Azure endpoint is present.

## What would make this perfect

Resolve all ten findings and rerun the review from a fresh phone and desktop context. Specifically: restore visible mobile focus after Back, register and test the five uncovered public promises (or remove the untestable future promise), expose the required phone navigation, add a verb-led **How it works** label and steps, disambiguate the two README license headings, and add the product one-liner to the footer. Acceptance requires zero findings, including minor copy and structure items.
