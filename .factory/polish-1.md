# Polish 1 — adversarial review repair

Repair source: `f52ce7a0be883adae70c5236103b2d15d4805b70`. Deployed as Static Web Apps deployment `f75c0db0-c615-4a49-a518-75ceb4521b6c` and cold-checked at <https://end-client-reference.sociobot.in> on 2026-08-30.

Live screenshots: [root mobile](polish-artifacts/live-root/screenshot-mobile.png), [demo mobile](polish-artifacts/live-demo/screenshot-mobile.png), and [demo desktop](polish-artifacts/live-demo/screenshot-desktop.png). Live route checks are in `polish-artifacts/live-*/verify.json`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | `/demo` and `?demo=1` now begin with a sticky isolated-demo banner, prepared filename, compact sample record, and prefilled workspace. The repeated landing hero is absent. | `uses literal product copy and puts the exact free and paid fact on the first screen`; live `/demo`; demo mobile screenshot. |
| F-1-2 | Added History API routing, per-route scroll/control state, `popstate` restoration, h1 announcement, and focus restoration. | `restores scroll position and the triggering control after Back navigation`; live `/privacy` then Back in full live suite. |
| F-1-3 | Reduced mobile hero artwork and copy footprint; action result and all four facts now fit in 390×844. | first-screen regression; live `/`; root mobile screenshot. |
| F-1-4 | Added `license-restore-anywhere` claim and a fresh-context token restore that generates beyond the free limit. | `@claim:license-restore-anywhere`; live full suite. |
| F-1-5 | Added `demo-reset` claim and reset regression for original filename, values, row, and counter. | `@claim:demo-reset`; live `/demo`. |
| F-1-6 | Registered malformed-record recovery and tagged its selective-removal regression. | `@claim:invalid-record-recovery`; live full suite. |
| F-1-7 | Registered Sociobot-only billing behavior and checked checkout URL, verify request origin, and built JavaScript. | `@claim:billing-api-only`; live root. |
| F-1-8 | Registered the payment-label promise and asserts workspace wording plus canvas cover text. | `@claim:end-client-not-payer`; live `/demo`. |
| F-1-9 | Registered no third-party runtime scripts or CDN fonts and records all asset origins. | `@claim:no-third-party-runtime-assets`; live `/demo`. |
| F-1-10 | Standardized visible and README terminology to billing client, end client, and project / PO reference. | copy audit terminology table; live root/demo screenshots. |
| F-1-11 | Replaced “relationship recall” with “saved client suggestions.” | `@claim:relationship-recall`; live root. |
| F-1-12 | Rewrote the README audience sentence to 18 words. | `.factory/copy-audit.md`; README review. |
| F-1-13 | Replaced the README test run-on sentence with plain-language bullets. | `.factory/copy-audit.md`; README review. |
| F-1-14 | Split the README build explanation into two direct sentences. | `.factory/copy-audit.md`; README review. |
| F-1-15 | Added “What stays on this device” before the license panel, including PDF, metadata, and payment limits. | live `/`; root desktop/mobile screenshots. |
| F-1-16 | Replaced the empty table header with visible “Actions.” | live demo axe regression in `keeps every page axe-clean`; live `/demo`. |
| F-1-17 | Added Static Web Apps `.webmanifest` MIME mapping and host assertion. | `static-host release policy`; `polish-artifacts/live-manifest-headers.txt` reports `application/manifest+json`. |
| F-1-18 | Generated and linked the original 180×180 `apple-touch-icon.png`. | `identify` output `180 x 180`; live root metadata check. |

## Verification

- Fresh clone at the repair source: `npm ci`, all 21 literal claim commands from `.factory/claims.json`, `npm audit --audit-level=high`, `npm run lint`, `npm run typecheck`, `npm test` (9 unit + 35 Chromium), and `npm run build` all passed.
- Local `verify-url.sh` passed root and demo. Playwright’s Axe integration passed all five routes without serious or critical findings. The standalone Axe CLI could not locate a Chrome binary in this container, so its result was not used.
- After deployment, `verify-url.sh` passed live `/`, `/demo`, `/privacy`, and `/terms`; the full live Playwright suite passed 35/35 on a rerun. The manifest response header is recorded in `polish-artifacts/live-manifest-headers.txt`.
