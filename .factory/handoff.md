# Performed For — adversarial review 1 handoff

## Outcome

**FAIL.** Review 1 is in [`.factory/review-1.md`](review-1.md). No product code was changed.

The review records 18 findings: 2 blocking, 7 high, 6 medium, and 3 minor. The main blockers are that `/demo` shows the repeated marketing hero instead of sample product use in its first viewport, and Back navigation loses the previous scroll position and focus.

## Verification performed

- Opened the live site cold in fresh Chromium contexts at 390 × 844 and 1440 × 900.
- Exercised live demo generation, Reset, Start for real, real/demo storage isolation, and re-entry.
- Recorded live requests through the full demo flow; all were same-origin GETs.
- Crawled internal links and followed the billing checkout redirect to its hosted 200 page.
- Checked route titles, metadata, h1/main/lang, 404, focus, Back behavior, touch targets, reduced motion, and axe results.
- Ran all 15 literal `.factory/claims.json` commands independently after `npm ci` in a detached clean worktree; all passed.
- Ran `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`; all passed. The suite reported 9 unit and 29 Chromium tests, and `dist/` was produced.

## Known gaps / next steps

Implement findings F-1-1 through F-1-18 in order, add claim coverage for every unlisted public promise, and rerun the entire cold-read review. The previous handoff’s empty table header and manifest MIME issue remain open as F-1-16 and F-1-17.
