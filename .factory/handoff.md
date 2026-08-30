# Performed For — adversarial review 3 handoff

## Outcome

**FAIL.** Review 3 is recorded in `.factory/review-3.md` with six findings: one blocking, two high, one medium, and two minor. Product code was not changed.

The blocking defect is broken hash routing: **Relationship log** changes the URL to `/#records` from another route but leaves the visitor at the hero. A cold `/#records` deep link also stays at the top.

## What was done

- Repeated cold first reads at 390 × 844 and 1440 × 900.
- Exercised the one-click demo, Reset, Start for real, separate IndexedDB namespaces, real-data preservation, offline reload, and request logs.
- Audited every landing and README sentence with word counts.
- Ran all 25 claim commands independently from a clean clone.
- Rechecked every review-1 and review-2 finding against live behavior and current code.
- Crawled routes and links; checked metadata, 404 behavior, focus, Axe, headers, icons, and visual identity.
- Checked missed AI/import/export/sync leverage.

## Verification

Clean clone: `/tmp/performed-for-review3.B8mKRM/clone` at `bc54f16805ff47070860ba5294eaca25d20a97d4`.

- `npm ci`: PASS; audit found 0 vulnerabilities.
- All 25 literal `.factory/claims.json` commands: PASS.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm test`: PASS, 10 unit tests and 43 Chromium tests.
- `npm run build`: PASS; `dist/` produced.
- Live Playwright suite after build: PASS, 43/43.
- Live Axe: zero violations on `/`, `/demo`, `/privacy`, `/terms`, and the designed 404.
- `verify-url.sh`: PASS on `/`, `/demo`, `/privacy`, and `/terms`.
- Live offline reload: 200 after service-worker control and `context.setOffline(true)`.
- Demo/privacy request log: same-origin GET requests only.

## Findings left for repair

1. `F-3-1` blocking — make direct and cross-route `#records` navigation scroll to, focus, and announce the log.
2. `F-3-2` high — stop claiming selected invoice files are discarded after generation, or clear them and test it.
3. `F-3-3` high — register and test merchant/checkout responsibilities, or narrow the legal wording.
4. `F-3-4` medium — make the documented deployed-site test mode clean-checkout safe.
5. `F-3-5` minor — replace “metadata” with the fields that are saved.
6. `F-3-6` minor — disclose that purchase opens hosted checkout.

No real payment was made. Checkout was followed only to its hosted 200 response.
