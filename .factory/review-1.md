# Adversarial first-read review 1 — Performed For

Reviewed 2026-08-29–30 against repository commit `95777345f758f833d7fbb1387146e2e5effe3eec` and <https://end-client-reference.sociobot.in> in fresh Chromium contexts at 390 × 844 and 1440 × 900.

## Verdict

**FAIL.** There are 18 findings: 2 blocking, 7 high, 6 medium, and 3 minor. All 15 registered claim commands pass, but the demo does not show the product in use in its first screen, back navigation does not restore scroll or focus, and several public claims have no matching claim entry.

## Cold first read, before scrolling

### Phone, 390 × 844

- What it does, in my words: adds an end-client cover to an existing invoice PDF.
- For whom: subcontractors and white-label agencies.
- What I should click first: **Try it with sample data**.

The exact copy that supplied those answers was **“Add the end client to every invoice.”**, **“For subcontractors and white-label agencies, add a clear cover to an existing invoice PDF before sending it.”**, and **“Try it with sample data”**. The three-question blocking gate passes.

The supporting sentence and facts do not fit: the primary action ends at y=790, **Use your invoice** runs past the 844 px viewport, and **“The sample opens…”** plus every privacy/offline/price fact is below the fold. That separate first-screen contract failure is F-1-3.

### Desktop, 1440 × 900

- What it does: adds an end-client cover to an invoice.
- For whom: subcontractors and white-label agencies.
- First click: **Try it with sample data**.

The action result and four short facts are visible. The desktop cold-read gate passes.

## Findings

### Blocking

#### F-1-1 — The demo opens on another marketing hero, not the product in use

- Exact location: `/demo`, first viewport after **“Try it with sample data”**.
- Evidence: at 390 × 844 the demo banner begins at y=1105.67 and the sample workspace at y=1327.66. At 1440 × 900 the banner begins at y=904.95 and the workspace at y=1012.55. The first screen is the same hero and even repeats the link to `/demo`.
- The README calls this a **“persistent demo banner,”** but `.demo-banner` is not sticky or fixed. Once the visitor reaches the workspace, the banner scrolls away.
- Why this fails: the required first screen after the demo click does not show realistic sample data or even disclose that demo mode is active. This is a weak demo and therefore blocking.
- Fix: make `/demo` render the demo banner and prefilled workspace at the top, with the Northline file, fields, and first relationship row visible immediately. Keep a compact, sticky **“Demo — sample data, nothing is saved”** banner in view while scrolling. Remove or greatly shorten the repeated hero on this route. Add 390 × 844 and desktop assertions that the banner, sample filename, one populated field, and one sample record are inside the initial viewport.

#### F-1-2 — Back navigation loses the visitor’s position and focus

- Exact location: scroll `/` to **Relationship log**, follow **Privacy**, then use Back.
- Evidence: Privacy correctly focused its `<h1>`, but Back returned to `/` with `scrollY = 0` and `document.activeElement = BODY`. `src/app.ts` contains no `pushState` or `popstate` handling; it uses full-document navigation and a one-way session flag.
- Why this fails: the route contract requires history state, restored scroll, and restored focus. A visitor reviewing the privacy notice mid-task is returned to the top and must find the log again.
- Fix: implement same-origin route navigation with `history.pushState`, store route scroll and triggering-control focus, restore both on `popstate`, keep the h1 announcement for forward navigation, and add a regression for the exact sequence above.

### High

#### F-1-3 — The mobile first screen omits the action result and all plain facts

- Exact location: `/` at 390 × 844.
- Quote below the fold: **“The sample opens a completed invoice example in an isolated demo.”** The facts **“Runs on your device,” “Keeps the original invoice intact,” “Works offline after first visit,”** and **“Three packages free · $19 once”** are also below the first viewport.
- Why this fails: the visitor can choose the right action, but cannot see what the click does, the privacy model, offline support, or price before scrolling. The attached first-screen shape requires these beside the primary action.
- Fix: reduce the mobile artwork/hero height and headline footprint, place the action-result sentence directly under the primary action, and show three compact facts in the first 844 px. Test their bounding boxes, not only the CTA’s.

#### F-1-4 — “Restore your license anywhere” is an unlisted, untested claim

- Exact quote: landing license panel and README — **“Pay $19 once for unlimited packages and relationship recall on this device—or restore your license anywhere.”**
- Why this fails: neither `one-time-unlock` nor `relationship-recall` tests restoration in a separate clean browser context/device. A purchaser could rely on this promise.
- Fix: add a `license-restore-anywhere` claim and a tagged test that pastes the same valid fixture token into a fresh context, verifies it, and generates beyond the free limit. Otherwise remove **“or restore your license anywhere.”**

#### F-1-5 — The advertised Reset demo behavior has no claim entry

- Exact quote: README — **“The persistent demo banner can reset the sample or start a real workspace.”**
- Why this fails: `demo-isolated` tests leaving and reseeding on a later visit, but never clicks **Reset demo**. Manual live testing passed, yet the public reset promise is absent from `.factory/claims.json` and can regress unnoticed.
- Fix: add `demo-reset` and a tagged test that changes fields, adds a row and counter, clicks Reset, then checks the original file, field values, single seed row, and counter.

#### F-1-6 — Unreadable-record recovery is an unlisted claim

- Exact quote: README — **“If old unreadable data is found, the app can remove only those entries while keeping valid records and the saved license.”**
- Why this fails: an untagged browser test currently checks this, but `.factory/claims.json` does not declare it. The verifier contract cannot discover or run the promise directly.
- Fix: add `invalid-record-recovery` with the existing regression tagged `@claim:invalid-record-recovery`, or remove the public claim.

#### F-1-7 — The billing/provider statement is an unlisted security claim

- Exact quote: README — **“Checkout and license verification use the Sociobot billing API; no payment provider is embedded in this app.”**
- Why this fails: the registered purchase claim proves the price boundary and checkout URL, not the complete “no provider embedded” statement.
- Fix: register `billing-api-only` and test the checkout/restore flow request log plus the built sources for provider endpoints, or shorten the sentence to the behavior already covered by `one-time-unlock`.

#### F-1-8 — The liability-label behavior is an unlisted claim

- Exact quote: README — **“Clearly says that the end client is not liable for payment.”**
- Why this fails: this distinction is central to the brief, but it has no claim entry. Static wording can disappear from either the workspace or generated cover without a claim-specific failure.
- Fix: add `end-client-not-payer` and assert the plain statement in the workspace and parsed/generated cover output.

#### F-1-9 — The no-third-party-code statement is not declared as a claim

- Exact quote: README — **“No analytics, third-party scripts, CDN fonts, or cloud document storage are used.”**
- Why this fails: `no-analytics` and `no-cloud-document-storage` cover two parts. No claim entry names third-party scripts or CDN fonts, even though the current live request log is same-origin.
- Fix: add `no-third-party-runtime-assets` with a fresh-context request-log test covering scripts, styles, and fonts, or revise the sentence to only the registered claims.

### Medium

#### F-1-10 — One concept uses several inconsistent terms

- Exact locations: landing eyebrow **“Payer → beneficiary → engagement”**; field label **“Services performed for”**; table header **“Performed for”**; README **“prime client”** and **“ultimate customer.”** Elsewhere the product uses **billing client**, **end client**, and **project / PO reference**.
- Why this fails: “beneficiary” can imply a legal or payment role, while “performed for” can describe a person, company, or project. The brief specifically requires the payer and ultimate customer to remain unambiguous.
- Fix: use **“Billing client → end client → project”**, label the field and table column **“End client,”** and use **billing client / end client** in the README.

#### F-1-11 — “Relationship recall” is unexplained product jargon

- Exact locations: landing license panel, terms, claims registry, and README — **“relationship recall.”**
- Why this fails: a first-time visitor cannot tell whether this means suggestions, saved records, automatic matching, or sync.
- Fix: replace it with the concrete result, for example **“saved client suggestions on this device.”** Update the claim wording to match.

#### F-1-12 — The README audience sentence exceeds the 22-word cap

- Exact quote (23 words): **“It is for subcontractors, fractional specialists, and white-label agencies who bill a prime client but need to identify the ultimate customer and project.”**
- Why this fails: it carries audience, billing relationship, and task in one long sentence and also introduces inconsistent terms.
- Rewrite: **“It is for subcontractors and agencies that invoice a billing client but must name the end client and project.”**

#### F-1-13 — The README test sentence is 46 words and uses implementation jargon

- Exact quote: **“`npm test` runs unit tests plus Chromium end-to-end tests for real PDF merging, exact source-page content streams, formula-safe CSV output, backup/import, deletion, malformed-data recovery, paid recall, free and size boundaries, demo disposal, computed text sizes, complete mobile target dimensions, accessibility, direct legal routes, and offline reload.”**
- Why this fails: the list cannot be understood on one read; **“source-page content streams,” “formula-safe,” “paid recall,”** and **“computed text sizes”** are not explained.
- Rewrite: introduce **“`npm test` checks:”** and use short bullets such as **“original invoice pages stay unchanged,” “CSV cells cannot run spreadsheet formulas,” “demo data is discarded,”** and **“mobile text and controls meet their size limits.”**

#### F-1-14 — The README build sentence is 36 words

- Exact quote: **“`npm run build` type-checks and writes the static deployment to `dist/`, including `dist/index.html`, direct `/demo`, `/privacy`, and `/terms` documents, a standard-shell 404, host headers, and a service worker with the hashed assets injected into its precache.”**
- Why this fails: it combines the command, output, routes, error page, headers, worker, hashing, and caching in one sentence.
- Rewrite: **“`npm run build` type-checks the app and writes it to `dist/`. The output includes direct route files, the 404 page, host settings, and an offline service worker.”**

#### F-1-15 — The landing page omits the required privacy/limitations section

- Exact location: `/`, between the working product and paid tier.
- Evidence: the app jumps from the package workspace directly to the one-time license. Privacy is reduced to three footer fragments; the README’s useful scope statement is absent from the page.
- Why this fails: the standard skeleton requires a plain **what it does not do / privacy** section before pricing. For invoice data, this is material decision information.
- Fix: add a literal section titled **“What stays on this device”** or **“What Performed For does not do”** before the license panel. State that invoice PDFs are not retained, only relationship metadata is saved, and the tool does not issue invoices or change who owes payment.

### Minor

#### F-1-16 — The demo table has an empty header cell

- Exact location: `/demo` relationship table — `<th aria-label="Actions"></th>`.
- Evidence: axe reports `empty-table-header` (minor): the element has no text visible to screen readers. This is the unresolved accessibility item in the prior handoff.
- Fix: put visually hidden **“Actions”** text inside the `<th>` or use a correctly scoped non-header cell. Keep the Delete button’s record-specific accessible name.

#### F-1-17 — The live web manifest has the wrong MIME type

- Exact location: `GET /manifest.webmanifest`.
- Evidence: live response is `200 Content-Type: application/octet-stream`, not `application/manifest+json`. This is the unresolved hosting item in the prior handoff.
- Fix: configure the host MIME mapping for `.webmanifest`, then assert the response header in a live or host-integration test.

#### F-1-18 — The apple-touch icon is not the required 180 px asset

- Exact location: `index.html` links `/icons/icon-192.png`; the file is 192 × 192 and no 180 × 180 apple-touch asset exists.
- Why this fails: the attached metadata contract calls for an SVG favicon plus a 180 px apple-touch icon.
- Fix: generate an original 180 × 180 PNG from the existing icon, link it as the apple-touch icon, and retain the 192/512 PWA icons in the manifest.

## Copy audit

Word counts treat hyphenated terms, paths, variables, and prices as one word. Headings, labels, and actions are included even when they are fragments. Code blocks are commands rather than sentences and are excluded. No banned marketing word appears; **unlock** is used literally for the paid license.

### Landing page

| ID | Words | Exact copy | Flag |
|---|---:|---|---|
| L01 | 3 | Invoice cover sheets | — |
| L02 | 1 | Workspace | — |
| L03 | 2 | Try sample | — |
| L04 | 2 | Relationship log | — |
| L05 | 3 | Payer → beneficiary → engagement | F-1-10 |
| L06 | 7 | Add the end client to every invoice. | — |
| L07 | 17 | For subcontractors and white-label agencies, add a clear cover to an existing invoice PDF before sending it. | — |
| L08 | 5 | Try it with sample data | — |
| L09 | 3 | Use your invoice | — |
| L10 | 11 | The sample opens a completed invoice example in an isolated demo. | F-1-3 on mobile placement |
| L11 | 4 | Runs on your device | F-1-3 on mobile placement |
| L12 | 5 | Keeps the original invoice intact | F-1-3 on mobile placement |
| L13 | 5 | Works offline after first visit | F-1-3 on mobile placement |
| L14 | 5 | Three packages free · $19 once | F-1-3 on mobile placement |
| L15 | 2 | Invoice package | — |
| L16 | 3 | Prepare a package | — |
| L17 | 4 | 3 free packages left | — |
| L18 | 2 | Invoice PDF | — |
| L19 | 1 | Relationship | — |
| L20 | 1 | Download | — |
| L21 | 2 | Source invoice | — |
| L22 | 5 | Choose the existing invoice PDF | — |
| L23 | 10 | PDF only · up to 25 MB · read locally, never retained | — |
| L24 | 3 | No file selected | — |
| L25 | 1 | Relationship | — |
| L26 | 2 | Billing client | — |
| L27 | 5 | The company responsible for payment | — |
| L28 | 3 | Services performed for | F-1-10 |
| L29 | 6 | The ultimate customer; not the payer | — |
| L30 | 3 | Project / PO reference | — |
| L31 | 4 | Preserved exactly as entered | — |
| L32 | 2 | Invoice number | — |
| L33 | 1 | Optional | — |
| L34 | 2 | Service period | — |
| L35 | 5 | Optional, in your preferred format | — |
| L36 | 2 | Your output | — |
| L37 | 11 | One cover page followed by every page of the original invoice. | — |
| L38 | 2 | Generate package | — |
| L39 | 2 | One-time license | — |
| L40 | 3 | Generate unlimited packages. | — |
| L41 | 4 | Three packages are free. | — |
| L42 | 17 | Pay $19 once for unlimited packages and relationship recall on this device—or restore your license anywhere. | F-1-4, F-1-11 |
| L43 | 4 | Buy the one-time unlock | — |
| L44 | 3 | Have a license? | — |
| L45 | 3 | Paste license token | — |
| L46 | 2 | Verify license | — |
| L47 | 4 | Saved on this device | — |
| L48 | 2 | Relationship log | — |
| L49 | 2 | Export CSV | — |
| L50 | 2 | Backup JSON | — |
| L51 | 2 | Import JSON | — |
| L52 | 4 | No relationships logged yet | — |
| L53 | 9 | Your first generated package will add its relationship here. | — |
| L54 | 8 | Only metadata is saved—never the invoice PDF. | — |
| L55 | 6 | Invoice files stay on your device. | — |
| L56 | 2 | No analytics. | — |
| L57 | 4 | No cloud document storage. | — |
| L58 | 1 | Privacy | — |
| L59 | 1 | Terms | — |
| L60 | 12 | Built by Param Factory · v1.0.0 · build 04d69c2dd44e · Illustration generated for this product. | — |

All landing actions are verbs or conventional destination links. No landing sentence exceeds 22 words.

### README

| ID | Words | Exact sentence or standalone line | Flag |
|---|---:|---|---|
| R01 | 12 | Performed For adds a clear end-client cover to an existing invoice PDF. | — |
| R02 | 23 | It is for subcontractors, fractional specialists, and white-label agencies who bill a prime client but need to identify the ultimate customer and project. | F-1-10, F-1-12 |
| R03 | 20 | Start with the one-click sample demo, or choose an invoice and enter its billing client, end client, and project/PO reference. | — |
| R04 | 11 | The download contains the cover followed by the original invoice page. | — |
| R05 | 2 | Live: https://end-client-reference.sociobot.in | — |
| R06 | 11 | Generates a companion cover and combines it with an existing PDF. | — |
| R07 | 10 | Maintains a relationship log and CSV report in the browser. | — |
| R08 | 12 | Downloads the relationship log as JSON and imports valid version 1 backups. | — |
| R09 | 11 | Clearly says that the end client is not liable for payment. | F-1-8 |
| R10 | 12 | Does not create invoices, collect payment, manage contacts, or model entity trees. | — |
| R11 | 4 | Three packages are free. | — |
| R12 | 10 | A $19 one-time license unlocks unlimited generation and relationship recall. | F-1-11 |
| R13 | 17 | Checkout and license verification use the Sociobot billing API; no payment provider is embedded in this app. | F-1-7 |
| R14 | 9 | `/demo` and `/?demo=1` open a completed Northline Studio example. | — |
| R15 | 13 | The persistent demo banner can reset the sample or start a real workspace. | F-1-1, F-1-5 |
| R16 | 12 | Demo records use the separate `demo:performed-for` IndexedDB namespace; ordinary records use `performed-for`. | — |
| R17 | 9 | Starting for real deletes the demo database and counter. | — |
| R18 | 9 | See the demo sandbox notes and tested product claims. | — |
| R19 | 5 | Requirements: Node.js 22+ and npm. | — |
| R20 | 6 | Open the URL printed by Vite. | — |
| R21 | 8 | To exercise install/offline behavior, use a production preview. | — |
| R22 | 3 | Optional build-time variables. | — |
| R23 | 4 | `VITE_BILLING_BASE` — billing API root. | — |
| R24 | 7 | Defaults to `https://api.sociobot.in/api/v1` for the public release. | — |
| R25 | 4 | `VITE_LICENSE_PRICE` — displayed one-time price. | — |
| R26 | 3 | Defaults to `$19`. | — |
| R27 | 46 | `npm test` runs unit tests plus Chromium end-to-end tests for real PDF merging, exact source-page content streams, formula-safe CSV output, backup/import, deletion, malformed-data recovery, paid recall, free and size boundaries, demo disposal, computed text sizes, complete mobile target dimensions, accessibility, direct legal routes, and offline reload. | F-1-13 |
| R28 | 20 | Playwright always creates a fresh production build and Vite preview; it will not reuse a development server for PWA checks. | — |
| R29 | 22 | The offline claim uses an isolated browser context, waits for service-worker control, reloads offline, and generates a sample PDF without the network. | — |
| R30 | 6 | The pinned Playwright version is 1.58.2. | — |
| R31 | 10 | `npm run lint` and `npm run typecheck` run static checks. | — |
| R32 | 36 | `npm run build` type-checks and writes the static deployment to `dist/`, including `dist/index.html`, direct `/demo`, `/privacy`, and `/terms` documents, a standard-shell 404, host headers, and a service worker with the hashed assets injected into its precache. | F-1-14 |
| R33 | 12 | Set `PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in` to run browser checks against an already deployed artifact. | — |
| R34 | 11 | Without that variable, Playwright always starts the fresh local production preview. | — |
| R35 | 9 | Deploy the contents of `dist/` to a static host. | — |
| R36 | 10 | The repository does not manage DNS, billing registration, or infrastructure. | — |
| R37 | 13 | The original PDF is held only long enough to create the local download. | — |
| R38 | 22 | Generated cover text is rasterized before being embedded so names in the user’s writing system render as entered; CSV/JSON remain machine-readable text. | — |
| R39 | 17 | Backup JSON downloads valid records; Import JSON accepts only complete version 1 backups and saves them atomically. | — |
| R40 | 5 | Individual records can be deleted. | — |
| R41 | 21 | If old unreadable data is found, the app can remove only those entries while keeping valid records and the saved license. | F-1-6 |
| R42 | 12 | No analytics, third-party scripts, CDN fonts, or cloud document storage are used. | F-1-9 |
| R43 | 10 | See the researched brief, visual system, privacy notice, and terms. | — |
| R44 | 3 | MIT — see LICENSE. | — |

## Demo and sandbox evidence

- One click from `/` reaches `/demo`.
- Seeded sample: `northline-studio-invoice.pdf`, Northline Studio Ltd., Harbour Arts Council, `HAC-2026-014 · Autumn campaign`, invoice `NL-1048`, and a realistic one-row relationship log.
- Generate downloaded `NL-1048-performed-for.pdf` and added a second row.
- Reset returned the log to one seed row and announced **“Demo reset to its sample invoice.”**
- Before demo entry, the ordinary workspace was seeded with `REAL-REVIEW` and usage count 2. After **Start for real**, that record and count remained; `demo:performed-for` and all `demo:` localStorage keys were gone. Re-entering demo produced only the original seed.
- The complete landing → demo → generate → reset flow requested only `https://end-client-reference.sociobot.in`, using GET requests. No document upload, analytics, font CDN, or third-party runtime request was observed.
- Sandbox behavior passes; discoverability/first-screen/persistence fails under F-1-1.

## Registered claim results

Each literal `test` command from `.factory/claims.json` was run independently after `npm ci` in a detached clean worktree at the reviewed commit.

| Claim | Result |
|---|---|
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
| `pdf-size-limit` | PASS |
| `three-free-packages` | PASS |
| `exact-relationship-text` | PASS |

No registered claim test failed. F-1-4 through F-1-9 are public claims that are not registered, so the claim audit still fails.

## History reconciliation

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. The existing handoff listed two follow-ups:

| Earlier item | Live/code result |
|---|---|
| Demo table `empty-table-header` | Still present; reopened as F-1-16. |
| Manifest served as `application/octet-stream` | Still present; reopened as F-1-17. |

Earlier verification reports also recorded checkout failure, demo leakage, incomplete claim coverage, whitespace input, exact-text truncation, CSV injection, undersized copy, and a small Terms target. Fresh checks or the complete suite confirm those defects are fixed: checkout reaches a hosted 200 page, demo data is discarded, all 15 listed claims pass, and all 29 browser tests pass.

## Structure, accessibility, and quality checks

| Check | Result |
|---|---|
| Titles | PASS: root, Demo, Privacy, Terms, and 404 use route-specific plain titles under 60 characters. |
| One h1, `lang`, main landmarks | PASS on all five checked routes. |
| Description, canonical, OG/Twitter image | PASS; the original social image is 1200 × 630. |
| Favicon/apple-touch | SVG favicon passes; apple-touch size fails F-1-18. |
| 404 | PASS: unknown paths return HTTP 404 with the product shell and a workspace link. |
| Deep links | PASS for `/demo`, `/privacy`, and `/terms`. |
| Route focus | Forward route focus passes; Back restoration fails F-1-2. |
| Link crawl | PASS: every internal/document link returns 200; mail links are explicit; checkout redirects once to a hosted 200 page. |
| Header/footer | PASS: consistent shell, home wordmark, privacy/terms, factory credit, version, and build ID. |
| Standard skeleton | FAIL: privacy/limitations section is absent (F-1-15). |
| Visual identity | PASS: warm survey paper, contour artwork, coral registration marks, clipped sheets, and grid rules are recognizably product-specific rather than a generic SaaS layout. |
| Axe | Landing, Privacy, Terms, and 404 have zero violations; Demo has the minor F-1-16 violation. No serious/critical findings. |
| Keyboard/focus/targets | PASS apart from Back restoration. Skip link, fields, actions, 44 px targets, validation focus, and visible focus treatment work. |
| Reduced motion | PASS: computed animation and transition durations reduce to 0.01 ms and smooth scrolling is disabled. |
| Console | Normal routes and demo flow have no errors. Chromium logs the expected failed-main-resource message when deliberately loading the HTTP 404 route. |
| Build gates | PASS: lint, typecheck, 9 unit tests, 29 browser tests, and production build. Initial JS is 11.93 KB gzip; the 175.81 KB PDF engine is lazy. |

## Missed leverage

No additional AI feature is justified. The brief is deterministic document assembly, and adding model output would weaken exact-name/PO handling and offline privacy. The obvious import/export and returning-client conveniences already exist as CSV, JSON backup/import, and paid local suggestions. No decorative AI or embedded provider key is present.

## What would make this perfect

Resolve every finding above, then rerun this review from a fresh context. In particular: make `/demo` open directly on visible sample work, keep its banner in view, restore history scroll/focus, fit the complete first-screen message on a phone, register every public claim, normalize terminology, shorten the three flagged README sentences, add the privacy/limits section, and clear the three metadata/accessibility leftovers. The acceptance target is zero findings, including minor ones.
