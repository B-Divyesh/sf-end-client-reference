# Performed For — polish 4

Repaired from review commit `af777a1698f72ebd00d41934014615f5fe6f6382` and candidate `828ae0ad4149f35d97d43753ee4ed1ff6ffd46b3`. Product changes are in `d0d2313000fbb491cb646947647d212e504d5b12`. The build was deployed to the existing `sf-end-client-reference` static app as deployment `be509336-1534-4d77-a4ec-bd4adefb8e18`.

Live product: <https://end-client-reference.sociobot.in>  
One-click isolated demo: <https://end-client-reference.sociobot.in/?demo=1>

## Review 4 mapping

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Registered `csv-formula-safety` and tagged the browser flow that generates fields beginning with `=`, `+`, `-`, and `@`, exports them, and rejects executable prefixes in every CSV cell. | `neutralizes every CSV formula prefix without changing the UI or PDF cover text @claim:csv-formula-safety`; clean-clone claim 5/32; live repaired-claim suite 5/5. |
| F-4-2 | Replaced the vague README phrase with exact 16 px text and 44 × 44 px control limits. Registered `mobile-dimensions`; its test measures every visible text node and control on all routes at 390 px and the 320 px reflow width. | `keeps text at least 16px and visible phone controls at least 44 by 44px @claim:mobile-dimensions`; [live cold measurements](polish-artifacts/round-4/live-cold-review.json) record 16 px text, 44 px control height, and 320 px document width. |
| F-4-3 | Split the broad README wording into exact direct-route and automated-accessibility statements. Registered `direct-routes` and `automated-accessibility`; direct loads assert route titles, h1/main structure, and the styled 404, while Axe checks only promise no serious or critical findings. | `legal and not-found routes are direct-loadable and semantic @claim:direct-routes`; `keeps every page axe-clean and announces an available update @claim:automated-accessibility`; live `/privacy` and `/terms` return 200, the unknown route returns 404, and all three report zero serious/critical findings in [live cold measurements](polish-artifacts/round-4/live-cold-review.json). |
| F-4-4 | Registered `demo-one-click` and tagged the real landing-to-`/?demo=1` flow. The test performs one click and then checks the banner, prepared filename, populated billing client, and sample record. README and demo documentation now use the query demo URL as the primary entry. | `uses literal product copy and puts the exact free and paid fact on the first screen @claim:demo-one-click`; [live demo first screen](polish-artifacts/round-4/live-demo-first-screen-mobile.png); [live cold measurements](polish-artifacts/round-4/live-cold-review.json) record one click, the query URL, sample data, and successful Reset. |
| F-4-5 | Replaced `performed-for relationship` and `invoice relationship cover` with `end-client cover` in root, Demo, Privacy, Terms, 404, manifest, package metadata, and the generated PDF heading. Root title is now `Performed For — add end-client covers to invoices`. | `uses end-client cover wording in every route metadata source`; exact live metadata in [live cold measurements](polish-artifacts/round-4/live-cold-review.json); [live root first screen](polish-artifacts/round-4/live-root-first-screen-mobile.png). |

## Earlier finding reconciliation

Every earlier finding was rechecked against the current suite and deployment.

### Review 1

| Finding | Current change/state | Evidence |
| --- | --- | --- |
| F-1-1 | Query and path demos open directly on the sticky banner and prepared sample workspace. | `@claim:demo-one-click`, `@claim:demo-isolated`, `@claim:demo-reset`; live demo screenshot. |
| F-1-2 | History state restores scroll and the visible triggering control after Back. | `restores scroll position and the triggering control after Back navigation`; live full suite. |
| F-1-3 | The action result and all four facts fit within 390 × 844. | `uses literal product copy…`; live report records the lowest fact at y=782.92; live root screenshot. |
| F-1-4 | Active licenses restore in a fresh browser context. | `@claim:license-restore-anywhere`. |
| F-1-5 | Reset restores the filename, fields, seed row, and demo counter. | `@claim:demo-reset`; live report records Harbour Arts Council, one row, and the Reset confirmation. |
| F-1-6 | Selective unreadable-record removal preserves valid records and the license. | `@claim:invalid-record-recovery`. |
| F-1-7 | Checkout and verification remain confined to the Sociobot billing API. | `@claim:billing-api-only`; `@claim:hosted-checkout`. |
| F-1-8 | Workspace and generated cover state that the billing client remains responsible for payment. | `@claim:end-client-not-payer`. |
| F-1-9 | Scripts, styles, fonts, and images remain same-origin. | `@claim:no-third-party-runtime-assets`. |
| F-1-10 | Billing client, end client, and project / PO reference remain the product terms. | `.factory/copy-audit.md`; live route copy. |
| F-1-11 | The concrete phrase `saved client suggestions` remains in price copy. | `@claim:relationship-recall`. |
| F-1-12 | The README audience sentence remains 19 words. | `.factory/copy-audit.md`. |
| F-1-13 | README test coverage remains a short list and now gives exact testable limits. | README `Test and build`; review-4 claim tests. |
| F-1-14 | README build behavior remains two short sentences. | README `Test and build`. |
| F-1-15 | `What stays on this device` remains before pricing and states exact storage limits. | Root page; `@claim:no-cloud-document-storage`; live root screenshot. |
| F-1-16 | The relationship table retains the visible `Actions` header. | Full Axe suite; zero serious/critical findings. |
| F-1-17 | The manifest is served as `application/manifest+json`. | [live manifest headers](polish-artifacts/round-4/live-manifest-headers.txt). |
| F-1-18 | The linked Apple touch icon remains 180 × 180. | `ships the required 180px touch icon and distinct README license headings`. |

### Review 2

| Finding | Current change/state | Evidence |
| --- | --- | --- |
| F-2-1 | Phone Back restores both scroll and visible focus. | `restores scroll position and the triggering control after Back navigation`; live full suite. |
| F-2-2 | The generated end-client cover precedes every unchanged source page. | `@claim:cover-before-invoice`; `@claim:original-invoice-intact`. |
| F-2-3 | A revoked fixture removes unlimited access and blocks generation at the free limit. | `@claim:license-revocation`. |
| F-2-4 | Generated relationships persist in the isolated demo log after reload. | `@claim:relationship-log`. |
| F-2-5 | Browser site-data clearing removes records, count, token, and cached verdict. | `@claim:clear-site-data`. |
| F-2-6 | The untestable future-workflow promise remains absent. | Direct Terms test; live `/terms`. |
| F-2-7 | Workspace, Try sample, Relationship log, and Privacy remain visible 44 px phone targets. | `@claim:mobile-dimensions`; phone screenshot. |
| F-2-8 | `How it works` retains verb-led Choose, Name, and Download steps. | `shows verb-led how-it-works steps and every phone navigation destination`. |
| F-2-9 | README headings remain `Price and unlock` and `Software license`. | Unit test `ships the required 180px touch icon and distinct README license headings`. |
| F-2-10 | Every route footer begins with the product one-liner. | `uses the standard shell and deployment document for unknown routes`; live URL verifier. |

### Review 3

| Finding | Current change/state | Evidence |
| --- | --- | --- |
| F-3-1 | Direct and cross-route `/#records` visits scroll, focus, and announce the log; Back restores the source control. | `opens and announces the relationship log from deep links and every route`; live full suite. |
| F-3-2 | Successful generation clears the in-memory file, native input, selected filename, and demo snapshot. | `@claim:invoice-cleared-after-download`. |
| F-3-3 | Purchase wording stays within the tested hosted Dodo merchant, inquiry, and returns boundary. | `@claim:hosted-checkout`. |
| F-3-4 | The deployed suite runs from a clean clone without `dist/`; only the local service-worker mutation simulation skips. | Clean-clone live run: 11 unit passed, 45 browser passed, 1 skipped. |
| F-3-5 | Stored fields are named explicitly; unexplained `metadata` wording remains absent from product copy. | `.factory/copy-audit.md`; live root and README review. |
| F-3-6 | Purchase copy visibly says hosted checkout and the link has an external accessible name and relation. | `@claim:hosted-checkout`; live full suite. |

## Verification

- Clean clone `/tmp/performed-for-polish4.U1fCnw` at `d0d2313`: all 32 literal claim commands passed independently. Summary: [clean claim results](polish-artifacts/round-4/clean-claim-results.json).
- Clean clone full gates: lint and type-check passed; 11 unit tests and 46 local browser tests passed; production build passed.
- Live gates: the five repaired claims passed 5/5; the full deployed suite passed 11 unit and 45 browser tests with one local-only service-worker mutation test skipped.
- Worker URL verifier: root, query Demo, Privacy, and Terms returned 200 with one h1, `lang=en`, a main landmark, complete image alt coverage, labeled buttons, and no console errors.
- Cold live check: root CTA and all facts fit at 390 × 844; one click opened prepared `/?demo=1`; Reset restored one sample row; Privacy and Terms returned 200; the designed unknown route returned 404.
- Live mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.11 s, CLS 0, TBT 25 ms. Report: [Lighthouse JSON](polish-artifacts/round-4/lighthouse-live.json).
- Bundle: initial JavaScript 12.74 KB gzip and CSS 4.11 KB gzip. The 175.81 KB PDF engine remains lazy-loaded.

No review finding remains open. No real payment was made; hosted-checkout verification stopped before purchase.
