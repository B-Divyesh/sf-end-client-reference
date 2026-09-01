# Adversarial first-read review 5 — Performed For

Reviewed 2026-09-01 against repository commit `59d646eb113934dc553c1d6d6dfd9c35c184d8f5` and <https://end-client-reference.sociobot.in> in fresh Chromium contexts at 390 × 844 and 1440 × 900.

## Verdict

**PASS.** Zero findings remain. The cold first screen, one-click demo, Reset, demo isolation, every registered claim, copy audit, history audit, routing, metadata, accessibility, link crawl, privacy request log, offline behavior, and build gates pass. No public product claim is unlisted or untested.

## Cold first read, before scrolling

### Phone, 390 × 844

- What it does: adds an end-client cover to an existing invoice PDF.
- For whom: subcontractors and white-label agencies.
- What to click first: **Try it with sample data**.

The exact text was **“Add the end client to every invoice.”**, **“For subcontractors and white-label agencies, add a clear cover to an existing invoice PDF before sending it.”**, and **“Try it with sample data.”** The action result and all four facts also fit. The lowest fact ended at y=782.9 in the 844 px viewport.

### Desktop, 1440 × 900

The same three answers are clear from the same text. The lowest first-screen fact ended at y=812.0. No horizontal overflow occurred at either width.

## Findings

None.

## Copy audit

Counts treat hyphenated terms, paths, URLs, prices, filenames, and the version/build string as one word. Separator glyphs are not words. Headings, labels, actions, image alt text, and concise state copy are included. No sentence exceeds 22 words. No banned marketing word, unexplained jargon, inconsistent product term, mood heading, or non-result action was found.

### Landing page

| ID | Words | Exact copy | Check |
| --- | ---: | --- | --- |
| L01 | 4 | Skip to main content | Clear keyboard action |
| L02 | 2 | Performed For | Product name |
| L03 | 3 | Invoice cover sheets | Product category |
| L04 | 1 | Workspace | Clear destination |
| L05 | 2 | Try sample | Clear destination |
| L06 | 2 | Relationship log | Clear destination |
| L07 | 1 | Privacy | Clear destination |
| L08 | 5 | Billing client → end client → project | Literal relationship |
| L09 | 7 | Add the end client to every invoice. | `cover-before-invoice` |
| L10 | 17 | For subcontractors and white-label agencies, add a clear cover to an existing invoice PDF before sending it. | `cover-before-invoice` |
| L11 | 5 | Try it with sample data | `demo-one-click` |
| L12 | 3 | Use your invoice | Result-naming action |
| L13 | 11 | The sample opens a completed invoice example in an isolated demo. | `demo-one-click`, `demo-isolated` |
| L14 | 4 | Runs on your device | `runs-on-device` |
| L15 | 5 | Keeps the original invoice intact | `original-invoice-intact` |
| L16 | 5 | Works offline after first visit | `offline-reload` |
| L17 | 5 | Three packages free · $19 once | `three-free-packages`, `one-time-unlock` |
| L18 | 11 | Layered paper illustration linking a billing client to an end client | Useful image alt |
| L19 | 2 | Invoice package | Literal section label |
| L20 | 3 | How it works | Literal section heading |
| L21 | 4 | 3 free packages left | `three-free-packages` |
| L22 | 4 | Choose an invoice PDF | Verb-led step |
| L23 | 3 | Name both clients | Verb-led step |
| L24 | 4 | Download the combined PDF | `cover-before-invoice` |
| L25 | 2 | Source invoice | Literal form legend |
| L26 | 5 | Choose the existing invoice PDF | File action |
| L27 | 10 | PDF only · up to 25 MB · cleared after a successful download | `pdf-size-limit`, `invoice-cleared-after-download` |
| L28 | 3 | No file selected | Clear state beside the file action |
| L29 | 1 | Relationship | Literal form legend |
| L30 | 2 | Billing client | Consistent term |
| L31 | 5 | The company responsible for payment | Clear field help |
| L32 | 2 | End client | Consistent term |
| L33 | 8 | The customer receiving the work; not the payer | `end-client-not-payer` |
| L34 | 3 | Project / PO reference | Consistent term |
| L35 | 4 | Preserved exactly as entered | `exact-relationship-text` |
| L36 | 2 | Invoice number | Clear field label |
| L37 | 1 | Optional | Clear field help |
| L38 | 2 | Service period | Clear field label |
| L39 | 5 | Optional, in your preferred format | Clear field help |
| L40 | 2 | Your output | Clear result label |
| L41 | 11 | One cover page followed by every page of the original invoice. | `cover-before-invoice` |
| L42 | 2 | Generate package | Result-naming action |
| L43 | 4 | Saved on this device | Literal section label |
| L44 | 2 | Relationship log | Literal section heading |
| L45 | 2 | Export CSV | `csv-export` |
| L46 | 2 | Backup JSON | `json-backup` |
| L47 | 2 | Import JSON | `json-import` |
| L48 | 4 | No relationships logged yet | Clear empty state |
| L49 | 9 | Your first generated package will add its relationship here. | `relationship-log` |
| L50 | 12 | Only client names, references, dates, and filenames are saved—not the invoice PDF. | `no-cloud-document-storage` |
| L51 | 3 | Privacy and limits | Literal section label |
| L52 | 5 | What stays on this device | Literal section heading |
| L53 | 15 | The selected PDF stays in this tab until a successful download, then it is cleared. | `invoice-cleared-after-download` |
| L54 | 10 | It is never uploaded or added to the relationship log. | `no-cloud-document-storage` |
| L55 | 12 | Only client names, references, dates, and filenames are saved in your browser. | `no-cloud-document-storage` |
| L56 | 11 | Performed For does not issue invoices or change who owes payment. | Clear scope limit |
| L57 | 6 | The billing client remains the payer. | `end-client-not-payer` |
| L58 | 2 | One-time license | Literal price label |
| L59 | 3 | Generate unlimited packages. | `one-time-unlock` |
| L60 | 4 | Three packages are free. | `three-free-packages` |
| L61 | 10 | Pay $19 once for unlimited packages and saved client suggestions. | `one-time-unlock`, `relationship-recall` |
| L62 | 7 | Restore an active license on another device. | `license-restore-anywhere` |
| L63 | 4 | Buy the one-time unlock | Result-naming action |
| L64 | 5 | Opens the hosted Sociobot checkout. | `hosted-checkout` |
| L65 | 3 | Have a license? | Clear disclosure summary |
| L66 | 3 | Paste license token | Clear field label |
| L67 | 2 | Verify license | Result-naming action |
| L68 | 1 | Offline. | Clear state |
| L69 | 13 | The workspace and your records still work; license checks will resume when connected. | `offline-reload` |
| L70 | 11 | Performed For adds an end-client cover to an existing invoice PDF. | `cover-before-invoice` |
| L71 | 6 | Invoice files stay on your device. | `runs-on-device`, `no-cloud-document-storage` |
| L72 | 2 | No analytics. | `no-analytics` |
| L73 | 4 | No cloud document storage. | `no-cloud-document-storage` |
| L74 | 1 | Privacy | Clear destination |
| L75 | 1 | Terms | Clear destination |
| L76 | 12 | Built by Param Factory · v1.0.0 · build fe53243b55e5 · Illustration generated for this product. | Clear attribution and provenance |

### README

| ID | Words | Exact copy | Check |
| --- | ---: | --- | --- |
| R01 | 2 | Performed For | Product name |
| R02 | 9 | Add an end-client cover to an existing invoice PDF. | `cover-before-invoice` |
| R03 | 19 | It is for subcontractors and agencies that invoice a billing client but must name the end client and project. | Clear audience |
| R04 | 6 | Start with the one-click sample demo. | `demo-one-click` |
| R05 | 14 | Or choose an invoice and enter its billing client, end client, and project reference. | Clear real-data path |
| R06 | 10 | The download adds one cover before the original invoice pages. | `cover-before-invoice` |
| R07 | 11 | The cover says the end client is not liable for payment. | `end-client-not-payer` |
| R08 | 2 | Live: https://end-client-reference.sociobot.in | Clear destination |
| R09 | 3 | Demo and data | Literal heading |
| R10 | 9 | `/demo` and `/?demo=1` open a completed Northline Studio example. | `demo-one-click`, `demo-isolated` |
| R11 | 8 | The demo banner can reset the original sample. | `demo-reset` |
| R12 | 7 | Start for real discards the demo data. | `demo-isolated` |
| R13 | 4 | Demo records use `demo:performed-for`. | `demo-isolated` |
| R14 | 4 | Ordinary records use `performed-for`. | `demo-isolated` |
| R15 | 14 | The selected invoice stays in your browser and is cleared after a successful download. | `runs-on-device`, `invoice-cleared-after-download` |
| R16 | 12 | The relationship log stores client names, references, invoice details, dates, and filenames. | `no-cloud-document-storage` |
| R17 | 12 | No analytics, third-party scripts, CDN fonts, or cloud document storage are used. | `no-analytics`, `no-third-party-runtime-assets`, `no-cloud-document-storage` |
| R18 | 3 | Price and unlock | Literal heading |
| R19 | 4 | Three packages are free. | `three-free-packages` |
| R20 | 14 | A $19 one-time license enables unlimited packages and saved client suggestions on this device. | `one-time-unlock`, `relationship-recall` |
| R21 | 9 | You can restore an active license on another device. | `license-restore-anywhere` |
| R22 | 6 | Buying opens Sociobot’s hosted Dodo checkout. | `hosted-checkout` |
| R23 | 12 | Dodo is the merchant of record and handles order inquiries and returns. | `hosted-checkout` |
| R24 | 7 | License verification uses the Sociobot billing API. | `billing-api-only` |
| R25 | 2 | Run locally | Literal heading |
| R26 | 5 | Requirements: Node.js 22+ and npm. | Clear setup requirement |
| R27 | 6 | Open the URL printed by Vite. | Clear instruction |
| R28 | 8 | For the offline path, use a production preview. | Clear instruction |
| R29 | 3 | Optional build-time variables | Literal heading |
| R30 | 4 | `VITE_BILLING_BASE` — billing API root. | Clear configuration label |
| R31 | 3 | Defaults to `https://api.sociobot.in/api/v1`. | Confirmed configuration |
| R32 | 4 | `VITE_LICENSE_PRICE` — displayed one-time price. | Clear configuration label |
| R33 | 3 | Defaults to `$19`. | Confirmed configuration |
| R34 | 3 | Test and build | Literal heading |
| R35 | 3 | `npm test` checks: | Clear introduction |
| R36 | 5 | original invoice pages stay unchanged; | `original-invoice-intact` |
| R37 | 12 | CSV cells beginning with `=`, `+`, `-`, or `@` cannot run spreadsheet formulas; | `csv-formula-safety` |
| R38 | 4 | demo data is discarded; | `demo-isolated` |
| R39 | 8 | saved records can be exported, imported, and deleted; | `csv-export`, `json-backup`, `json-import`, `record-deletion` |
| R40 | 17 | text stays at least 16 px, and visible controls stay at least 44 × 44 px on phones; | `mobile-dimensions` |
| R41 | 9 | Privacy, Terms, and the not-found page open directly; | `direct-routes` |
| R42 | 12 | automated checks find no serious or critical accessibility issues on those pages; | `automated-accessibility` |
| R43 | 3 | offline reload works. | `offline-reload` |
| R44 | 9 | Playwright starts a fresh production preview for PWA checks. | Confirmed configuration |
| R45 | 6 | The pinned Playwright version is 1.58.2. | Confirmed in `package.json` |
| R46 | 11 | `npm run build` type-checks the app and writes it to `dist/`. | Confirmed build behavior |
| R47 | 16 | The output includes direct route files, the 404 page, host settings, and an offline service worker. | Confirmed build output |
| R48 | 12 | From a clean checkout, test the deployed artifact without a local build: | Clear instruction; confirmed |
| R49 | 7 | Deploy `dist/` to the configured static host. | Clear instruction |
| R50 | 9 | This repository does not manage DNS or billing registration. | Clear repository scope |
| R51 | 2 | Software license | Literal heading |
| R52 | 3 | MIT — see LICENSE. | Clear license statement |

### Terminology

| Concept | Term confirmed throughout |
| --- | --- |
| Company responsible for payment | Billing client |
| Customer receiving the work | End client |
| Work identifier | Project / PO reference |
| New first page | End-client cover |
| Combined cover and source PDF | Invoice package |
| Saved client-detail rows | Relationship log |
| Sample-only workspace | Demo |

## Demo and sandbox

- One click from `/` opened `/?demo=1` and changed the title to **Demo — Performed For**.
- The phone first screen showed the persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, **Start for real**, `northline-studio-invoice.pdf`, Northline Studio Ltd., Harbour Arts Council, and the sample relationship.
- At 390 × 844, the banner ended at y=248.7, the sample summary at y=493.6, billing client at y=669.3, and end client at y=819.7. Desktop also showed the project reference by y=842.7.
- `@claim:demo-reset` confirmed that changed fields, added rows, and the demo counter return to the original sample.
- `@claim:demo-isolated` confirmed that ordinary records and usage remain untouched, the demo database and counter are deleted on exit, and a new demo contains only its seed.
- Live `@claim:runs-on-device`, `@claim:no-analytics`, `@claim:no-cloud-document-storage`, and `@claim:no-third-party-runtime-assets` checks observed only same-origin GET requests during the sample flow.
- Live `@claim:offline-reload` acquired service-worker control, reloaded offline, and generated the sample package without the network.

The demo and sandbox checks pass.

## Registered claims

Every literal `test` command in `.factory/claims.json` ran separately after `npm ci` in a no-hard-link clean clone at the reviewed commit.

| Claim ID | Result | Claim ID | Result |
| --- | --- | --- | --- |
| `demo-isolated` | PASS | `demo-one-click` | PASS |
| `original-invoice-intact` | PASS | `csv-export` | PASS |
| `csv-formula-safety` | PASS | `json-backup` | PASS |
| `json-import` | PASS | `record-deletion` | PASS |
| `offline-reload` | PASS | `mobile-dimensions` | PASS |
| `direct-routes` | PASS | `automated-accessibility` | PASS |
| `runs-on-device` | PASS | `no-analytics` | PASS |
| `no-cloud-document-storage` | PASS | `invoice-cleared-after-download` | PASS |
| `one-time-unlock` | PASS | `relationship-recall` | PASS |
| `license-restore-anywhere` | PASS | `demo-reset` | PASS |
| `invalid-record-recovery` | PASS | `billing-api-only` | PASS |
| `hosted-checkout` | PASS | `end-client-not-payer` | PASS |
| `no-third-party-runtime-assets` | PASS | `pdf-size-limit` | PASS |
| `three-free-packages` | PASS | `exact-relationship-text` | PASS |
| `cover-before-invoice` | PASS | `license-revocation` | PASS |
| `relationship-log` | PASS | `clear-site-data` | PASS |

No registered test failed, and the landing/README cross-check found no unlisted product claim.

## Earlier finding verification

Every earlier finding was rechecked on the live site and in the current code through direct inspection, the complete live suite, and the claim tests.

### Review 1

| Finding | Current live/code result |
| --- | --- |
| F-1-1 | Fixed: the one-click and direct demos begin with the banner, prepared sample, client values, and sample row. |
| F-1-2 | Fixed: Back restores scroll and a visible triggering control; the live regression passes. |
| F-1-3 | Fixed: action result and all facts fit within 390 × 844. |
| F-1-4 | Fixed: an active license restores in a separate clean context. |
| F-1-5 | Fixed: Reset restores the sample fields, file, row, and counter. |
| F-1-6 | Fixed: unreadable-row removal retains valid rows and the license. |
| F-1-7 | Fixed: checkout and verification remain within the registered Sociobot billing boundary. |
| F-1-8 | Fixed: workspace and cover both state that the end client is not liable. |
| F-1-9 | Fixed: scripts, styles, fonts, and images are same-origin. |
| F-1-10 | Fixed: billing client, end client, and project / PO reference are consistent. |
| F-1-11 | Fixed: copy uses **saved client suggestions**, not the earlier jargon. |
| F-1-12 | Fixed: the README audience sentence is 19 words. |
| F-1-13 | Fixed: README test coverage uses short, literal bullets. |
| F-1-14 | Fixed: README build behavior is split into two short sentences. |
| F-1-15 | Fixed: **What stays on this device** precedes pricing. |
| F-1-16 | Fixed: the relationship table has visible **Actions** header text. |
| F-1-17 | Fixed: the live manifest uses `application/manifest+json`. |
| F-1-18 | Fixed: the linked Apple touch icon is 180 × 180. |

### Review 2

| Finding | Current live/code result |
| --- | --- |
| F-2-1 | Fixed: phone Back restores both scroll and visible focus. |
| F-2-2 | Fixed: the cover precedes every unchanged source page. |
| F-2-3 | Fixed: a revoked license removes unlimited access and blocks generation at the free limit. |
| F-2-4 | Fixed: generated relationships persist in the isolated local log. |
| F-2-5 | Fixed: clearing site data removes records, counts, token, and cached verdict. |
| F-2-6 | Fixed: the untestable future-workflow promise remains absent. |
| F-2-7 | Fixed: all four phone navigation destinations are visible 44 px targets. |
| F-2-8 | Fixed: **How it works** uses Choose, Name, and Download steps. |
| F-2-9 | Fixed: README headings distinguish **Price and unlock** from **Software license**. |
| F-2-10 | Fixed: every route footer starts with the product one-liner. |

### Review 3

| Finding | Current live/code result |
| --- | --- |
| F-3-1 | Fixed: direct and cross-route `/#records` visits scroll, focus, and announce the relationship log; Back restores state. |
| F-3-2 | Fixed: successful generation clears the file reference, input, filename, and demo snapshot. |
| F-3-3 | Fixed: hosted-checkout wording is scoped to the tested merchant, inquiry, and returns boundary. |
| F-3-4 | Fixed: the deployed suite runs from the clean clone without a local `dist/`. |
| F-3-5 | Fixed: saved fields are named instead of called metadata. |
| F-3-6 | Fixed: the purchase action visibly and accessibly discloses hosted checkout. |

### Review 4

| Finding | Current live/code result |
| --- | --- |
| F-4-1 | Fixed: CSV formula-prefix protection is registered and passes. |
| F-4-2 | Fixed: the README gives exact 16 px and 44 × 44 px limits; the registered measurements pass. |
| F-4-3 | Fixed: direct-route and scoped automated-accessibility claims are separate, registered, and pass. |
| F-4-4 | Fixed: the one-click sample statement is registered and passes from `/`. |
| F-4-5 | Fixed: route metadata consistently uses **end-client cover**. |

No earlier finding is unfixed, half-fixed, or regressed.

## Structure, accessibility, and quality checks

| Check | Result |
| --- | --- |
| Titles | PASS: root, Demo, Privacy, Terms, and 404 have route-specific plain titles under 60 characters. |
| Page structure | PASS: each checked route has `lang=en`, one h1, a main landmark, ordered headings, and the consistent shell. |
| Metadata | PASS: description, canonical, OG/Twitter fields, 1200 × 630 product art, SVG favicon, and 180 px touch icon are present. |
| 404 | PASS: an unknown URL returns HTTP 404 with the designed product shell and **Open workspace**. |
| Deep links and history | PASS: direct routes, `/#records`, route focus/announcement, Back focus, and scroll restoration pass live. |
| Link crawl | PASS: all same-origin destinations return 200; the intentional unknown route returns 404; mail links are explicit; checkout is disclosed and tested without purchase. |
| Header/footer | PASS: navigation, Privacy, Terms, product one-liner, factory credit, version, and build ID are consistent. |
| Landing order | PASS: header, first screen, working product, three verb-led steps, privacy/limits, exact price, and footer. |
| Visual identity | PASS: warm survey paper, topographic cut-paper art, forest/coral registration marks, clipped sheets, and map-grid rules match `.factory/design.md`; the result is not a generic SaaS template. |
| Accessibility | PASS: no serious or critical Axe findings; keyboard, focus, 44 px targets, 16 px text, 200%-equivalent reflow, reduced motion, labels, and horizontal fit pass. |
| Privacy/offline | PASS: demo namespaces remain separate, request logs are same-origin GETs, and offline reload/generation works. |
| Console | PASS: the URL verifier found no console or page errors on root, Demo, Privacy, or Terms. |
| Headers | PASS: CSP is delivered as a response header; `nosniff`, no-referrer, and manifest MIME are correct. |
| Build | PASS: lint, type-check, 11 unit tests, 46 local Chromium tests, and `npm run build` pass. Initial JS is 12.74 KB gzip; the PDF engine is lazy-loaded. |
| Deployment match | PASS: live and clean-build HTML, JS, CSS, PDF chunk, and service worker SHA-256 values match byte-for-byte. |

The live suite passed 45 browser tests. The sole skip is the local-only changed-service-worker simulation, which passed in the 46-test local suite. The worker URL verifier also passed root, query Demo, Privacy, and Terms.

## Missed leverage

No missing AI feature is implied. The core job requires deterministic PDF assembly and exact client names and references; model output would add risk without improving the task. CSV export, complete JSON backup/import, deletion, local client suggestions, and offline operation cover the expected import/export and reuse needs. No decorative AI, provider key, Azure endpoint, or model call is present.

Cloud sync is not an obvious omission because the brief requires local-first handling of sensitive client details.

## What would make this perfect

No corrective work was identified. The review target of zero findings and no untested claim is met.
