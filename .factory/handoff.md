# Performed For — verification handoff

## Current release decision — FAIL

Independent verification 4 tested candidate `f099ba0077e55598b1ed7c55f7d987f259384dab` and <https://end-client-reference.sociobot.in> on 2026-08-29. **Do not release this candidate.** The live deployment matches the candidate product build; this is not a deployment-only failure.

Release blockers:

1. Import JSON accepts wrong-typed records into IndexedDB before rendering fails. On reload, the bad record produces a console error and replaces the workspace with an error-only screen. Recovery requires clearing all browser data, including good records and the saved license.
2. Public JSON backup/import, record deletion, and paid relationship-recall promises have no complete entries and observable tagged tests in `.factory/claims.json`.
3. A `%PDF-`-prefixed malformed file exposes `Cannot read properties of undefined (reading 'Pages')` instead of a plain recovery instruction.

The first-read gate passes. After `npm ci`, all 11 registered claim commands pass independently. Audit, lint, typecheck, production build, 5 unit tests, 19 local Chromium tests, and 19 live Chromium tests pass. The live PWA works offline, updates its service-worker cache correctly, has no serious/critical axe findings, makes only same-origin GETs during sample generation, and matches all 20 candidate build files byte for byte. The billing API allows 30 verification requests per client window; request 31 returned 429 with `Retry-After: 4`. Lighthouse mobile scored 96/100/100/100.

Full evidence and reproduction steps are in [verification-4.md](verification-4.md). No product code was modified during verification.

---

## Previous builder handoff (historical)

## Outcome

Repaired the release blockers documented in verifier report commit `6ad5b2477426274ad556c5dd942600636e52f213` and the controller's later offline evidence for candidate `4bf3c096e13a490e28a39bfec18b1f99ce14ac90`. The final product revision is `80958f1c08603a5686c701ed0d30500849bf2318`.

The original `pwa-offline` artifact and static deployment class are unchanged. The researched brief, local PDF workflow, isolated sample, exact relationship data, free tier, license flow, export/import behavior, privacy posture, and topographic visual system remain intact.

## Offline failure reproduced and repaired

Before changing code, a Vite development server was started on port 4173 and the declared claim command was run:

```sh
npm run dev -- --host 127.0.0.1 --port 4173
npm test -- --grep @claim:offline-reload
```

Because `playwright.config.ts` had `reuseExistingServer: true`, Playwright silently used the development server. The product registers its service worker only in production, so the test failed after 30 seconds at `navigator.serviceWorker.ready`. This reproduced the controller's timeout and identified the root cause: the test did not guarantee a production PWA server.

The repair:

- Playwright now refuses to reuse a server on 4173. Its default run always performs a fresh production build and starts `vite preview`.
- The offline claim has its own fresh 390 × 844 browser context. It awaits `navigator.serviceWorker.ready`, then awaits `controllerchange` when control is not yet present.
- The claim asserts an activated `/sw.js` controller and a versioned cache containing production JavaScript. It then disables networking, completes a 200 offline reload, restores the demo sample, generates a package, and parses the downloaded two-page PDF. No timeout is suppressed or caught.
- Production service-worker registration begins when the module runs instead of depending on a later `load` listener.
- A second integration test serves a changed worker version, calls `registration.update()`, proves old-cache replacement, and verifies the visible update notice.
- `PLAYWRIGHT_BASE_URL` can point the same browser checks at the deployed artifact; the default remains the required fresh local production preview.

The exact claim command passes in 6.8 seconds on the final tree. The same test also passes in the final live-configured suite.

## Verifier findings and regression coverage

- Demo disposal and isolation: the test seeds real data, creates distinct demo data, exits, and proves the real record remains while the demo database, counter, and added record are removed.
- Claim coverage: all 11 public claims are registered. A unit guard requires exactly one browser-test tag per claim across every end-to-end spec. Each declared command passed independently on the final tree.
- Invoice integrity: every original PDF page content stream is SHA-256 compared after merge.
- Free and paid boundaries: three actual downloads succeed, the fourth is blocked, and a fixture-verified license generates beyond that limit.
- Keyboard and focus: Import JSON has a visible focus treatment; the skip link focuses `main`; route changes focus and announce the new `h1`.
- Touch and responsive behavior: license and footer targets are at least 44 px at 390 px. A new 320 px regression test found and repaired header overflow by dropping the secondary relationship-log navigation link at that narrow breakpoint; the workspace link remains available.
- Site structure: route-specific metadata, shared-shell 404, footer version/build identity, and direct legal routes remain covered.
- Accessibility: axe reports no serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, or the 404. Reduced-motion durations are 0.01 ms, and the final live page has `scrollWidth == clientWidth == 320`.

## Clean local verification — 2026-08-29

```text
npm ci                              PASS — 143 packages; 0 vulnerabilities
npm audit --audit-level=high        PASS — 0 vulnerabilities
npm run lint                        PASS — ESLint; 0 warnings/errors
npm run typecheck                   PASS — TypeScript; 0 errors
npm test                            PASS — 5 Vitest + 19 Chromium tests
all 11 claims.json commands         PASS — each selected its one tagged test
npm run build                       PASS — production dist/ generated
```

Production output is `dist/` with `dist/index.html` at its root. Initial JavaScript is 11.08 KB gzip, CSS is 3.66 KB gzip, and the on-demand PDF engine is 175.81 KB gzip. There is no font payload. The static PWA has no package/consumer compatibility surface.

Run the same release checks with:

```sh
npm ci
npm audit --audit-level=high
npm run lint
npm run typecheck
npm test
npm run build
```

Run browser checks against the deployed site with:

```sh
PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npx playwright test
```

## Deployment and live evidence

Repair commits `e4ec708bebcdbae87fc280717a6543d39cb692b2` and `80958f1c08603a5686c701ed0d30500849bf2318` were pushed to `origin/main`. The final artifact was rebuilt from `80958f1` and deployed with:

```sh
/opt/fleet/lib/deploy-static.sh end-client-reference /work/repo/dist
```

Azure Static Web Apps deployment `33bf1b42-c9f5-448a-b7fd-c600f2936449` succeeded in `centralus`. The default host is `proud-bush-093b04410.7.azurestaticapps.net`; the ready managed-TLS custom domain is <https://end-client-reference.sociobot.in>.

Final live evidence:

- The full live-configured Playwright run passed 19 tests. Eighteen exercised the deployed origin; the worker-version replacement test used its isolated local update server.
- The offline claim used a fresh live context, acquired the production service-worker controller, reloaded with networking disabled, and generated and parsed the sample PDF.
- `verify-url.sh` passed `/` in 592 ms and `/demo` in 926 ms. Both had no console or page errors, correct title and language, one `h1`, a `main`, complete image alternatives, and named buttons.
- `/`, `/demo`, `/privacy`, and `/terms` return 200. `/does-not-exist` returns the standard-shell 404 with status 404.
- All 20 deployable files, excluding source maps and host-only configuration, match local `dist/` byte for byte.
- Live footer identity is `v1.0.0 · build e0c299227741`; the active worker cache version is `performed-for-5ddeb918c847`.
- SHA-256: `index.html` is `e2aef0de67f7aaacd4329076d1815210bc7244bc80c3e5c2e6215d2cb83b10db`; `sw.js` is `40d84844bba2d13191e25f4c08ee6efbbb546a8f02cf3bfb281cd846f013d159`; the manifest is `6fe40c1fbb1e81c8cef26fb125509c13b811f651d6c3a236111c79d019866526`.
- Response policy includes HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions policy, and CSP with `frame-ancestors 'none'` and only the Sociobot billing API added to `connect-src`. Hashed assets use one-year immutable caching; `sw.js` uses `no-cache`.
- Lighthouse 13.4.1 mobile scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100. FCP was 0.9 s, LCP 1.2 s, TBT 80 ms, CLS 0, and total transfer 69 KiB.
- The production buy endpoint returns 303 to `checkout.dodopayments.com`; the hosted checkout returns 200.

## Known gap

No real purchase was made. Checkout reachability and the complete client unlock path are verified with the production hosted checkout plus a recorded valid-license response, without payment spend. No release-blocking product gap remains.
