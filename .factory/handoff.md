# Performed For — adversarial review 4 handoff

## Outcome

**FAIL.** Review 4 found five issues: one high, three medium, and one minor. There are no blocking defects. Product code was not modified.

The live cold first screen, one-click prepared demo, Reset, real/demo storage isolation, offline behavior, routing, Back/focus handling, accessibility checks, link crawl, 404, build, complete suites, and all 27 registered claim commands pass. The remaining defects are four unlisted README promises and unclear metadata terminology. Full findings and proposed rewrites are in [review-4.md](review-4.md).

## Work performed

- Opened the live deployment cold in fresh 390 × 844 and 1440 × 900 Chromium contexts before scrolling.
- Audited every shipped landing-page phrase and every README sentence with word counts.
- Entered the sample in one click, generated the two-page sample package, reset it, and confirmed that **Start for real** deletes demo state without touching a pre-seeded real record or counter.
- Recorded the complete demo request flow; every request was a same-origin GET and there were no console or page errors.
- Ran every literal `.factory/claims.json` command independently from a no-hard-link clean clone. All 27 passed.
- Rechecked every finding from reviews 1–3 against the live site and current code.
- Crawled links and metadata; checked the designed 404, canonical/OG data, route focus, Back behavior, phone navigation, and original visual identity.
- Ran the worker URL verifier on root, Demo, Privacy, and Terms. All passed.
- Ran local lint, typecheck, production build, and the full local suite. All passed.
- Ran the full suite against the deployment from the clean clone. It passed 10 unit and 45 browser tests; one intentionally local service-worker mutation test skipped.

## Verification commands

```sh
npm ci
npm run lint
npm run typecheck
npm run build
npm test
PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npm test
```

Clean claim commands were read directly from `.factory/claims.json` and executed one by one as `npm test -- --grep @claim:<id>`.

## Remaining work

- Add registered, exactly tagged claims for one-click demo entry, CSV formula neutralization, mobile text/control dimensions, direct routes, and the narrowly stated automated accessibility result.
- Replace metadata-only **“performed-for relationship”** and **“invoice relationship cover”** phrases with the established **“end-client cover”** term.
- Rerun the complete adversarial review; do not mark PASS until there are zero findings.

No real payment was made. Hosted checkout verification stopped before purchase. No infrastructure, DNS, shared service, database, or unrelated resource was accessed or changed.
