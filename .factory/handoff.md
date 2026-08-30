# Performed For — polish 2 handoff

## Outcome

**PASS.** All 18 review-1 findings and all 10 review-2 findings are resolved. The repair keeps the warm topographic-cartography identity and the `pwa-offline` static deployment class.

The live product is <https://end-client-reference.sociobot.in>. The exact one-click sample entry is <https://end-client-reference.sociobot.in/?demo=1>; `/demo` remains directly routable.

## What changed

- The 390 px header now exposes Workspace, Try sample, Relationship log, and Privacy. Back restores both scroll and visible focus.
- The landing sequence says “How it works” and uses verb-led Choose, Name, and Download steps. The footer includes the product one-liner.
- The primary sample action uses `?demo=1`. Its isolated records survive reload, while Reset reseeds the sample and Start for real deletes demo-only storage.
- Four missing product claims now have one tagged browser test each: cover placement, license revocation, relationship logging, and browser-data clearing.
- Terms no longer promise future behavior. README purchase and MIT headings are distinct.
- `.factory/claims.json`, `demo.md`, `design.md`, `copy-audit.md`, `catalog-description.txt`, and `polish-2.md` match the shipped behavior.

## Exact verification

- Clean clone: `npm ci`; every one of the 25 literal claim commands passed independently.
- Clean clone: `npm audit --audit-level=high` found 0 vulnerabilities.
- Clean clone: `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` passed; `dist/index.html` exists.
- Tests: 10 unit tests and 43 Chromium browser tests passed. The browser suite covers Axe, keyboard/focus, 320/390 px reflow, 44 px targets, 200% text, reduced motion, privacy request logs, malformed input, real PDF page integrity, routing, 404, and offline reload/generation.
- Live: `PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npx playwright test --workers=2` passed 43/43.
- Live: `verify-url.sh` passed `/`, `/demo`, `/privacy`, and `/terms` with route-specific titles, one h1, `lang=en`, main landmarks, alt text, labelled buttons, and no console errors.
- Live: unknown routes return HTTP 404; `/?demo=1` returns 200; the manifest returns `application/manifest+json` with CSP, no-referrer, and nosniff headers.
- Bundles: initial JavaScript 12.43 KB gzip; CSS 4.10 KB gzip. The 175.81 KB PDF engine is lazy-loaded on generation.
- Lighthouse: performance 97, accessibility 100, best practices 100, SEO 100; LCP 1.50 s, CLS 0, TBT 190 ms.

Evidence lives in `.factory/polish-artifacts/round-2/`. The finding-by-finding map is `.factory/polish-2.md`.

## Deploy and reproduce

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
```

Deploy `dist/` using `/opt/fleet/lib/deploy-static.sh end-client-reference /work/repo/dist`.

## Known gaps

None. No paid card was charged during verification; hosted-checkout routing and license states were verified with the public checkout URL and recorded fixture responses.
