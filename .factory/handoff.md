# Performed For — verification handoff

## Independent verification 3 — FAIL (2026-08-29)

Candidate `4fda8b548775d673dcf7c9db2b23ff67307f1076` was independently verified against <https://end-client-reference.sociobot.in>. **FAIL — do not release this candidate.** Full evidence is in `.factory/verification-3.md`.

The previous external billing blocker is resolved. The production checkout now returns 303 to a live Dodo checkout that shows Performed For as a $19 one-time product and carries the correct return destination. A live invalid returned token is captured, removed from the URL, verified, and safely re-locks; a fixture-backed valid return unlocks generation past the free limit and caches its verdict. The verify API allowed 30 requests from one client; request 31 returned 429 with `Retry-After: 4`. No real purchase was made.

Release blockers and significant defects remain:

- **Critical:** the banner says **“Demo — sample data, nothing is saved,”** but a record generated in `/demo` remains in `demo:performed-for` after **Start for real** and reappears on the next demo visit. This claim is not registered in `.factory/claims.json` and violates the required discard-on-exit behavior.
- **High:** claim coverage is incomplete. The 25 MB and three-free-package claims are unlisted, and the demo/intact-invoice/unlimited-unlock tests do not assert their full outcomes.
- **High:** keyboard focus on Import JSON is applied to a clipped 1 px input; the visible label has no focus indication.
- **Medium:** skip/route navigation leaves focus on `BODY`; the license summary and footer links miss the 44 px touch baseline; the live 404 lacks the shared header/footer; route `og:url` remains the root URL; the footer has no version/build ID.

## Verification summary

```text
npm ci                                      PASS — 60 packages, 0 vulnerabilities
all 9 claims.json commands                  PASS after clean install
npm test                                    PASS — 3 Vitest + 13 Playwright
npm run build                               PASS — TypeScript + Vite + route copy
npm audit --audit-level=high                PASS — 0 vulnerabilities
live/local artifact comparison              PASS — 17/17 byte matches
live checkout registration                  PASS — 303 to hosted $19 checkout
live verify allowance                       PASS — 30 allowed; #31 429 + Retry-After: 4
Lighthouse live mobile                      100/100/100/100; LCP 1.3 s; CLS 0
axe serious/critical                        0 on workspace, demo, legal, and 404
overall release verdict                     FAIL
```

The core workflow itself passes: cold first-read and one-click sample, desktop/390 px/320 px layout, exact Unicode relationship data, unchanged source-page content streams, three-free boundary, CSV/JSON round trips, ordinary persistence, invalid-input recovery, same-origin-only generation requests, security/cache headers, offline reload, and service-worker update notice.

## How to reproduce

```sh
git switch --detach 4fda8b548775d673dcf7c9db2b23ff67307f1076
npm ci
npm test
npm run build
npm run preview
```

Demo persistence: open `/demo`, generate once, choose **Start for real**, then reopen `/demo`; the extra demo relationship is still present. Import focus: Tab from **Backup JSON**; focus moves to the clipped file input without a visible outline on **Import JSON**.

Only verification documentation was changed in this handoff. Product code was not modified.
