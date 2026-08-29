# Performed For — repair handoff

## Repair scope

Repaired every required finding from independent verifier report commit `6ad5b2477426274ad556c5dd942600636e52f213` against candidate `4fda8b548775d673dcf7c9db2b23ff67307f1076`.

- Demo lifecycle: each `/demo` load clears and reseeds only `demo:performed-for`; **Start for real** deletes that database and `demo:pf_generation_count` before navigation. A regression seeds real data, creates distinct demo data, exits, and proves the real record survives while the demo database, counter, and added record do not.
- Claims: registered the public 25 MB and three-free-package statements. The claim manifest now has 11 unique IDs, and a unit guard requires exactly one browser-test tag for each. The PDF claim compares SHA-256 hashes of every original page content stream, the free-limit test performs three downloads and blocks the fourth, and the license test generates beyond the free cap.
- Keyboard and accessibility: the visible Import JSON label now receives a designed focus outline. Skip navigation focuses `main`; cross-route navigation focuses and announces the new `h1`. License restore and footer links meet the 44 px touch baseline at 390 px.
- Site contract: route-specific `og:url` values now follow canonical URLs. The production 404 is built from the standard app shell with header, navigation, footer, and route metadata. The footer shows app version and a 12-character build ID.
- Quality tooling: added pinned ESLint 10 with TypeScript rules plus explicit `lint` and `typecheck` scripts. Existing billing, local PDF generation, export/import, privacy, offline, update, and visual behavior remain intact.

## How to run

```sh
npm ci
npm audit --audit-level=high
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

The static artifact remains `dist/`, with `dist/index.html` at its root. Deployment uses `/opt/fleet/lib/deploy-static.sh end-client-reference /work/repo/dist`.

## Local verification evidence — 2026-08-29

```text
npm ci                              PASS — 143 packages; 0 vulnerabilities
npm audit --audit-level=high        PASS — 0 vulnerabilities
npm run lint                        PASS — ESLint; 0 warnings/errors
npm run typecheck                   PASS — TypeScript; 0 errors
npm test                            PASS — 4 Vitest + 18 Chromium Playwright
all 11 claims.json commands         PASS — each selected exactly 1 tagged test
npm run build                       PASS — TypeScript + Vite + route generation
```

Production bundles: initial JS 11.09 KB gzip, CSS 3.64 KB gzip, and the on-demand PDF engine 175.81 KB gzip. `dist/404.html` is byte-identical to the app entry document, and direct documents exist for `/demo`, `/privacy`, and `/terms`.

Browser verification covers desktop and 390 × 844 mobile, real PDF downloads, exact Unicode text, content-stream integrity, exact file/free boundaries, demo disposal, JSON/CSV ownership flows, keyboard focus, 44 px touch targets, reduced motion, offline reload, and the update notice. The full demo flow makes only same-origin GET requests; IndexedDB contains metadata but no PDF data. Axe reports zero serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, and the 404.

`verify-url.sh` against the production preview passed both `/` and `/demo`: HTTP 200, no console/page errors, correct title and language, one `h1`, a `main`, complete image alt attributes, and named buttons. Measured loads were 641 ms and 686 ms.

Lighthouse 13.4.1 mobile against the production preview scored Performance 99, Accessibility 100, Best Practices 100, and SEO 100. FCP was 1.0 s, LCP 1.5 s, TBT 130 ms, CLS 0, and total transfer 69 KiB.

## Deployment and live verification

Pending the committed repair deployment. This section will be updated with the pushed commit, static deploy output, live artifact identity, route/status/header checks, and live billing endpoint result.

## Known gaps

No product release blockers remain in local verification. No real purchase was made; billing behavior uses the verifier-proven hosted checkout plus the recorded valid-license fixture, without test spend.
