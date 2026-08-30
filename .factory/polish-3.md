# Performed For — polish 3

Repaired from adversarial review commit `f887e78bfdcc89fcfb3c5a06422b70670c127c3e`. Product changes are in `9f60c04` and `d536874`. Every finding from reviews 1–3 is closed.

Live product: <https://end-client-reference.sociobot.in>  
One-click isolated demo: <https://end-client-reference.sociobot.in/?demo=1>

## Review 3 mapping

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Added hash-aware History API navigation. Direct and cross-route `/#records` visits now scroll to the log, focus its heading, and announce “Relationship log”; Back restores the source route and trigger focus. | `opens and announces the relationship log from deep links and every route` at 390×844 and 1440×900; [live route state](polish-artifacts/round-3/live-cold.json); [live phone screenshot](polish-artifacts/round-3/live-records-mobile.png); live `/#records`. |
| F-3-2 | A successful PDF download now clears the in-memory file reference, native file input, visible filename, and demo snapshot state. Copy says exactly when clearing occurs. | `@claim:invoice-cleared-after-download`; [live cold flow](polish-artifacts/round-3/live-cold.json) reports zero selected files and “No file selected.” |
| F-3-3 | Replaced the broad receipts/taxes/refunds sentence with the hosted page’s exact merchant, inquiry, and returns boundary. Registered it as a claim. | `@claim:hosted-checkout` verifies the no-purchase HTTP 303 and the hosted page’s “Merchant of Record” and returns text; [live link crawl](polish-artifacts/round-3/live-link-crawl.json). |
| F-3-4 | Removed deployed-suite dependencies on local built assets. The immutable service-worker replacement simulation skips only in external mode; deployed offline reload still runs. README now gives the exact clean-checkout command. | Fresh remote clone at `9f60c04`, no `dist/`: 10 unit tests and 45 browser tests passed, 1 local-only simulation skipped; [result](polish-artifacts/round-3/live-clean-suite.json). |
| F-3-5 | Replaced “metadata” with the exact saved fields: client names, references, invoice details, dates, and filenames. | `.factory/copy-audit.md`; live root and README inspection. |
| F-3-6 | Added visible hosted-checkout disclosure, an external-link relation, and an accessible name that states the destination. | `@claim:hosted-checkout`; live root; [live link crawl](polish-artifacts/round-3/live-link-crawl.json). |

## Review 1 mapping

| Finding | Current repair state | Evidence |
| --- | --- | --- |
| F-1-1 | Query and path demos start with the sticky banner, prepared invoice, populated fields, and sample row. | `@claim:demo-isolated`, `@claim:demo-reset`; [live query-demo screenshot](polish-artifacts/round-3/live-demo-query-mobile.png). |
| F-1-2 | History navigation restores scroll and a visible trigger; hash routes now also focus and announce their target. | `restores scroll position and the triggering control after Back navigation`; F-3-1 regression. |
| F-1-3 | The phone first screen contains the CTA result and all facts within 844 px. | `uses literal product copy and puts the exact free and paid fact on the first screen`; [live bounds](polish-artifacts/round-3/live-cold.json). |
| F-1-4 | Active licenses restore in a separate clean browser context. | `@claim:license-restore-anywhere`. |
| F-1-5 | Reset removes demo changes and restores the source sample, fields, row, and counter. | `@claim:demo-reset`; [live reset result](polish-artifacts/round-3/live-cold.json). |
| F-1-6 | Unreadable rows can be removed without clearing valid records or the license. | `@claim:invalid-record-recovery`. |
| F-1-7 | Checkout and verification use only the Sociobot billing API boundary. | `@claim:billing-api-only`; `@claim:hosted-checkout`. |
| F-1-8 | The form and generated cover both say the end client is not liable. | `@claim:end-client-not-payer`. |
| F-1-9 | Runtime scripts, styles, fonts, and images are same-origin. | `@claim:no-third-party-runtime-assets`. |
| F-1-10 | Billing client, end client, and project / PO reference remain the only relationship terms. | `.factory/copy-audit.md`; live route inspection. |
| F-1-11 | “Relationship recall” remains replaced by “saved client suggestions.” | `@claim:relationship-recall`. |
| F-1-12 | README audience copy remains below 22 words. | `.factory/copy-audit.md`. |
| F-1-13 | README test coverage remains a short plain-language list. | README “Test and build.” |
| F-1-14 | README build instructions remain split into short sentences. | README “Test and build.” |
| F-1-15 | “What stays on this device” remains before pricing and now names the exact file lifetime and stored fields. | live root; `@claim:invoice-cleared-after-download`; `@claim:no-cloud-document-storage`. |
| F-1-16 | The relationship table retains a visible Actions header. | `keeps every page axe-clean and announces an available update`. |
| F-1-17 | The deployed manifest retains `application/manifest+json`. | [live response headers](polish-artifacts/round-3/live-manifest-headers.txt). |
| F-1-18 | The original 180×180 Apple touch icon remains linked. | `ships the required 180px touch icon and distinct README license headings`. |

## Review 2 mapping

| Finding | Current repair state | Evidence |
| --- | --- | --- |
| F-2-1 | Phone Back navigation restores both scroll and visible focus. | `restores scroll position and the triggering control after Back navigation`; live clean suite. |
| F-2-2 | The generated cover precedes every unchanged source page. | `@claim:cover-before-invoice`; `@claim:original-invoice-intact`. |
| F-2-3 | Revoked licenses remove unlimited access and block generation at the limit. | `@claim:license-revocation`. |
| F-2-4 | Generated relationships persist in the isolated local demo log. | `@claim:relationship-log`. |
| F-2-5 | Clearing site data removes records, counters, token, and cached verdict. | `@claim:clear-site-data`. |
| F-2-6 | The untestable future-work promise remains absent from Terms. | `legal routes are direct-loadable and semantic`; live `/terms`. |
| F-2-7 | All four primary destinations remain visible with 44 px targets on phones. | `shows verb-led how-it-works steps and every phone navigation destination`; mobile target regression. |
| F-2-8 | “How it works” retains Choose, Name, and Download steps. | `shows verb-led how-it-works steps and every phone navigation destination`. |
| F-2-9 | README headings remain “Price and unlock” and “Software license.” | `ships the required 180px touch icon and distinct README license headings`. |
| F-2-10 | Every route footer starts with the product one-liner. | `uses the standard shell and deployment document for unknown routes`; live route verifier artifacts. |

## Verification

- Clean-clone claims: all 27 literal commands passed independently at `d536874`; [machine-readable results](polish-artifacts/round-3/clean-claim-results.json).
- Local full suite: 10 unit tests and 46 Chromium tests passed.
- Live clean-checkout suite: 10 unit tests and 45 browser tests passed; the one local-only service-worker mutation test was skipped.
- Accessibility: Axe found no serious or critical issue on root, demo, privacy, terms, or 404. Keyboard focus, 44 px targets, 200% reflow, and reduced motion passed.
- Privacy/offline: same-origin request assertions and offline generation passed. The cold live flow made only same-origin product requests.
- Routing/metadata: route titles, canonical/OG metadata, direct legal loads, Back behavior, `/#records`, and the HTTP 404 passed.
- Build: initial JavaScript 12.75 KB gzip; CSS 4.11 KB gzip; the 175.81 KB PDF engine remains lazy-loaded.
- Mobile Lighthouse, live: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.10 s, CLS 0, TBT 22 ms.
- Deployment: uploaded `dist/` only to the existing `sf-end-client-reference` Static Web App. No DNS, shared service, database, or unrelated resource was read or changed.

No finding remains open. No payment was made; checkout verification stopped at the hosted redirect.
