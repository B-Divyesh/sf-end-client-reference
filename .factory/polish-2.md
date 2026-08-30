# Performed For — polish 2

Repaired from review commit `991514a` against release candidate `88d50ec`. Product code is in `850d8fe` and `af13f9e`; supporting contract updates are in `98568a0`. Every review-1 and review-2 finding is closed.

Live evidence: <https://end-client-reference.sociobot.in>, <https://end-client-reference.sociobot.in/?demo=1>, [desktop first screen](polish-artifacts/round-2/live-root-desktop.png), [phone query demo](polish-artifacts/round-2/live-demo-query-mobile.png), and [manifest headers](polish-artifacts/round-2/live-manifest-headers.txt).

## Review 1 mapping

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | `/demo` and `?demo=1` start with a sticky demo banner, prepared invoice, sample record, and populated fields. Reset and Start for real remain visible actions. | `uses literal product copy and puts the exact free and paid fact on the first screen`; `@claim:demo-isolated`; phone query-demo screenshot; live `/?demo=1` 200. |
| F-1-2 | History state restores scroll and focus to a visible phone Privacy link. | `restores scroll position and the triggering control after Back navigation`; live 43/43. |
| F-1-3 | Compact phone art/header keeps the action result and all four facts within 390 × 844. | `uses literal product copy and puts the exact free and paid fact on the first screen`; desktop screenshot. |
| F-1-4 | Registered and tested cross-context license restoration. | `@claim:license-restore-anywhere`. |
| F-1-5 | Registered Reset demo and verifies complete reseeding. | `@claim:demo-reset`. |
| F-1-6 | Registered selective unreadable-record recovery. | `@claim:invalid-record-recovery`. |
| F-1-7 | Registered the Sociobot-only checkout and verification boundary. | `@claim:billing-api-only`. |
| F-1-8 | Registered payer wording in the form and generated cover. | `@claim:end-client-not-payer`. |
| F-1-9 | Registered same-origin scripts, styles, fonts, and images. | `@claim:no-third-party-runtime-assets`. |
| F-1-10 | Standardized billing client, end client, and project / PO reference everywhere. | `uses literal product copy…`; `.factory/copy-audit.md`; live root and demo. |
| F-1-11 | Replaced “relationship recall” with “saved client suggestions.” | `@claim:relationship-recall`; live root. |
| F-1-12 | Rewrote the README audience sentence to 18 words. | `.factory/copy-audit.md`; README inspection. |
| F-1-13 | Replaced the README test run-on with short bullets. | `.factory/copy-audit.md`; README inspection. |
| F-1-14 | Split the README build explanation into two sentences. | `.factory/copy-audit.md`; README inspection. |
| F-1-15 | Added the literal “What stays on this device” privacy/limits section before pricing. | `uses literal product copy…`; live root. |
| F-1-16 | The table header contains visible “Actions” text. | `keeps every page axe-clean…`; live Axe integration: zero serious/critical issues. |
| F-1-17 | Static Web Apps maps `.webmanifest` to `application/manifest+json`. | `static-host release policy`; live manifest header artifact. |
| F-1-18 | The linked Apple touch icon is an original 180 × 180 PNG. | `ships the required 180px touch icon and distinct README license headings`. |

## Review 2 mapping

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Made Privacy and the other destinations visible on phones, so Back restores focus as well as scroll. | 390 × 844 `restores scroll position…`; live 43/43. |
| F-2-2 | Added `cover-before-invoice` and checks page-one cover text, page order, and unchanged source streams. | `@claim:cover-before-invoice`; 25/25 clean-clone claim commands. |
| F-2-3 | Added `license-revocation`; a revoked fixture removes unlimited access and blocks generation at the free limit. | `@claim:license-revocation`. |
| F-2-4 | Added `relationship-log`; demo changes now persist in the isolated namespace across reload until Reset or Start for real. | `@claim:relationship-log`. |
| F-2-5 | Added `clear-site-data`; Chromium origin-data clearing removes IndexedDB records, count, token, and verdict. | `@claim:clear-site-data`. |
| F-2-6 | Removed the untestable future promise from Terms. | `legal routes are direct-loadable and semantic`; live `/terms`. |
| F-2-7 | Phone header exposes Workspace, Try sample, Relationship log, and Privacy with 44 px targets. | `shows verb-led how-it-works steps and every phone navigation destination`; `keeps every visible mobile target…`; phone screenshot. |
| F-2-8 | Added a literal “How it works” heading and verb-led Choose, Name, Download steps. | `shows verb-led how-it-works steps and every phone navigation destination`; live root. |
| F-2-9 | README purchase and source headings are now “Price and unlock” and “Software license.” | `ships the required 180px touch icon and distinct README license headings`. |
| F-2-10 | Footer begins with the product one-liner on every route. | `uses the standard shell and deployment document for unknown routes`; live `/`, `/demo`, `/privacy`, `/terms`. |

## Verification

- Fresh clone: all 25 literal `.factory/claims.json` commands passed independently; `npm ci`, audit, lint, type-check, 10 unit tests, 43 Chromium tests, and build passed.
- Live deployment: 43/43 Playwright tests passed. Root, Demo, Privacy, and Terms passed `verify-url.sh`; unknown paths returned the styled HTTP 404.
- Accessibility/privacy/offline: route Axe integration found no serious or critical violations; keyboard, 44 px targets, 200% text/reflow, reduced motion, request-origin, and offline reload tests passed.
- Performance: 12.43 KB gzip initial JavaScript, 4.10 KB gzip CSS. Lighthouse: 97 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.50 s, CLS 0, TBT 190 ms.

No review finding remains open.
