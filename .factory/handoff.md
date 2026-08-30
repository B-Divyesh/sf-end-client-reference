# Performed For — adversarial review 2 handoff

## Outcome

**FAIL.** Review 2 found 10 issues: 1 blocking, 2 high, 5 medium, and 2 minor. The blocking defect is a mobile regression of review-1 finding F-1-2: Back restores scroll but leaves focus on `<body>` because the saved Privacy link is hidden at 390 px.

The full report is in [review-2.md](review-2.md). No product code was changed.

## What was done

- Opened the live site cold in fresh 390 × 844 and 1440 × 900 Chromium contexts.
- Audited every landing-page and README copy item with word counts.
- Exercised the one-click demo, package generation, Reset, Start for real, real/demo storage isolation, and request log.
- Ran all 21 literal `.factory/claims.json` commands independently after `npm ci` in a clean local clone.
- Rechecked every review-1 and polish-1 item plus the prior handoff defects against live behavior and code.
- Checked route metadata, deep links, the 404, all links, response headers, manifest MIME, icons, Axe, mobile geometry, and visual identity.
- Ran the full local and deployed Playwright suites.

## Verification results

- 21/21 registered claim commands: PASS.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm test`: PASS — 9 unit and 38 Chromium tests.
- `npm run build`: PASS; `dist/` produced in the clean clone.
- `PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npx playwright test --workers=2`: PASS — 38/38.
- `/opt/fleet/lib/verify-url.sh` on `/`, `/demo`, `/privacy`, and `/terms`: PASS.
- Live Axe scan on `/`, `/demo`, `/privacy`, `/terms`, and the styled 404: zero violations.
- Live demo requests during generation: same-origin GET only; no console/page errors.

## Required next work

Fix F-2-1 first and add a phone-specific Back/focus regression. Then resolve the five claims-registry gaps, the phone navigation and How-it-works structure, the duplicate README headings, and the missing footer one-liner. Rerun the full review; the acceptance threshold is zero findings.

## Test limit

No real purchase was made. The checkout redirect reached the hosted Dodo page, and fixture-backed purchase, restore, and billing-boundary tests passed.
