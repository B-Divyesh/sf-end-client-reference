# Independent verification 3 — FAIL

Verified on 2026-08-29 against candidate commit `4fda8b548775d673dcf7c9db2b23ff67307f1076` and <https://end-client-reference.sociobot.in>.

## Verdict

**FAIL — do not release this candidate.** The previously missing production billing registration is now live: checkout redirects to the correct hosted $19 one-time product, the return configuration points back to Performed For, and invalid-license/rate-limit behavior is correct. The candidate still violates the mandatory demo, claims, and keyboard acceptance contract. In particular, data created under the banner **“Demo — sample data, nothing is saved”** remains in IndexedDB after **Start for real** and reappears on the next demo visit.

## Mandatory first checks

`.factory/claims.json` exists. After the required clean `npm ci`, every listed command was run independently against the shipped demo entry point at the exact candidate:

| Claim | Command | Result |
| --- | --- | --- |
| Demo isolation | `npm test -- --grep @claim:demo-isolated` | PASS |
| Original invoice intact | `npm test -- --grep @claim:original-invoice-intact` | PASS |
| CSV export | `npm test -- --grep @claim:csv-export` | PASS |
| Offline reload | `npm test -- --grep @claim:offline-reload` | PASS |
| Runs on device | `npm test -- --grep @claim:runs-on-device` | PASS |
| No analytics | `npm test -- --grep @claim:no-analytics` | PASS |
| No cloud document storage | `npm test -- --grep @claim:no-cloud-document-storage` | PASS |
| One-time unlock | `npm test -- --grep @claim:one-time-unlock` | PASS |
| Exact relationship text | `npm test -- --grep @claim:exact-relationship-text` | PASS |

Cold first read: **Performed For adds an end-client and engagement cover to an existing invoice PDF for subcontractors and white-label agencies. Click “Try it with sample data” first.** The first screen states the job, audience, and first action in plain words. The action opens a completed sample in one click. This gate passes.

The manifest cross-check does not pass. The live banner's “nothing is saved” statement is unlisted and contradicted by the observed persistence. Other visitor-facing quantitative claims—including the 25 MB limit and three free packages—also lack their own claim entries. Several tagged tests under-assert their named outcome: `demo-isolated` does not check separation from a seeded real workspace or discard-on-exit, `original-invoice-intact` checks only page count and width, and `one-time-unlock` does not generate past the free limit. Independent QA confirmed the latter two product behaviors, but the required continuous claim proofs remain incomplete.

## Environment, identity, and release gates

- Candidate checkout: exact detached commit `4fda8b548775d673dcf7c9db2b23ff67307f1076`. The later branch commit changes only verification documentation.
- `npm ci`: PASS — 60 packages; 0 audit vulnerabilities.
- `npm test`: PASS — 3 Vitest tests and 13 Chromium Playwright tests.
- `npm run build`: PASS — TypeScript check, Vite production build, route copy, and `dist/` output.
- `npm audit --audit-level=high`: PASS — 0 vulnerabilities.
- No lint script is available.
- Seventeen local/live artifacts matched byte for byte, including entry JS/CSS, lazy PDF chunk, service worker, manifest, route documents, icons, and artwork. Live is the tested candidate artifact.
- Bundle sizes: 10.65 KB gzip initial JS, 3.62 KB gzip CSS, 175.33 KB gzip lazy PDF engine, no font payload, and 42.14 KB mobile hero image. Budgets pass.

## End-to-end product QA

Representative live input used `Prime, "North" & Co.`, `客户 Ω <East>`, `=SUM(1,1) PO/42 · Phase A`, invoice `INV/007`, and a two-page PDF. Three packages downloaded with the expected safe filename. Each output had one cover followed by both source pages; SHA-256 hashes of both original page content streams exactly matched the corresponding output pages. Exact text appeared in the relationship log and CSV.

Persistence and recovery checks:

- Ordinary records survived reload. CSV included a UTF-8 BOM and exact quoted values. JSON backup, delete, and re-import restored all three records. Invalid JSON produced a clear error.
- IndexedDB stored relationship metadata and the source filename only; it did not contain PDF bytes.
- Empty required input focused the file control. Invalid signature, malformed PDF, whitespace-only fields, and over-25-MB files produced actionable errors. A valid PDF of exactly 25 MiB succeeded.
- The first three free generations succeeded; the fourth was blocked with the advertised message.
- A fixture-backed valid returned license stripped the query token, stored and verified it, allowed a fourth generation, and reused the daily cached verdict on reload without another request.
- A live invalid returned token was stripped from the address bar, stored locally, verified with a CORS-enabled `200 {valid:false, reason:"invalid"}`, left the free workflow available, and showed “License no longer active.” No console error occurred.

Demo isolation from real data works, but demo disposal does not. In a fresh live context the demo began with one row, generated a second row in `demo:performed-for`, showed zero rows after **Start for real**, then showed both demo rows when `/demo` was opened again. This directly contradicts the banner and the demo-sandbox discard requirement.

## Live checkout and API allowance

- `GET https://api.sociobot.in/api/v1/products/end-client-reference/checkout` returned `303` to `checkout.dodopayments.com`; the hosted response returned 200.
- The page displayed **Performed For**, **$19.00**, and “One-time unlock for Performed For (end-client-reference).” Its session configuration contained the Sociobot return handler and final `https://end-client-reference.sociobot.in/` destination.
- No purchase was made. A successful paid-token callback was therefore not tested against a real charged license; the client behavior was exercised with the repository's valid-verdict fixture as described above.
- The hosted checkout emitted two Dodo permission-policy console messages about the accelerometer. The Performed For origin itself emitted no console or page errors.
- Fresh production verify requests from one client: requests 1–30 returned 200 invalid verdicts; request 31 returned `429` with `Retry-After: 4`. Observed allowance: 30 requests per window.
- The product has no sign-in, so Microsoft Entra tenant validation is not applicable.

## Privacy, PWA, accessibility, and performance

- A complete live ordinary generation/export flow made 19 requests, all same-origin GETs. No analytics, tracker, document upload, third-party script, or non-GET request occurred. License verification contacted only the documented Sociobot API.
- Live headers include HSTS, CSP with `frame-ancestors 'none'` and the billing `connect-src`, `nosniff`, strict-origin referrer policy, and restrictive permissions policy. Hashed assets use one-year immutable caching; `sw.js` and the manifest use `no-cache`.
- `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route returns a styled 404. All crawled internal non-mail links returned 200. Route titles, canonical links, robots, sitemap, 1200×630 social art, and required icons exist.
- The manifest parsed without errors and exposed standalone display plus 192, 512, and maskable icons. Live cache `performed-for-47e8b942a297` controlled the page. Offline `/demo` reload retained the workspace, sample, and Offline notice. A changed-worker simulation displayed “A fresh map is ready. Reload when convenient.”
- `/opt/fleet/lib/verify-url.sh`: PASS in 609 ms; no console/page errors, correct title/lang, one h1, main landmark, image alts, and button names.
- Playwright axe: zero serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, and the 404. At 390 px and 320 px the document had no horizontal overflow. Reduced motion reduced animations/transitions to 0.01 ms.
- Lighthouse 13.4.1 live mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.3 s, TBT 80 ms, CLS 0, total transfer 59 KiB. Lab INP was not measured.

Manual accessibility checks found defects that axe does not detect. Activating the skip link changes the hash but leaves focus on `BODY`. Navigating to Privacy likewise leaves focus on `BODY`, rather than moving it to the new h1. The clipped `#import-json` input receives keyboard focus, but its visible **Import JSON** label gets no focus indication. At 390 px the **Have a license?** summary is 24.8 px high and footer links are 16 px high, below the 44 px touch baseline.

## Defects by severity

### Critical — release blocker

1. **The demo's “nothing is saved” statement is false and unregistered.** A generated demo record persists in `demo:performed-for` after **Start for real** and returns on the next demo visit. The contract requires leaving demo mode to discard demo data, and the claims contract makes an unlisted claim a failed review.

### High

1. **Claim coverage is incomplete or non-observable.** The 25 MB and three-free-package statements are unlisted. The demo, intact-invoice, and unlimited-unlock tests do not assert their full named outcomes. The independent results do not replace required per-build claim tests.
2. **Keyboard focus is invisible for Import JSON.** Tab focuses a 1 px clipped input (`clip: rect(0,0,0,0)`), while the visible label has no outline or focus-within treatment. This violates the required visible-focus baseline for a core data-ownership action.

### Medium

1. **Focus is not moved to content.** The skip link and full-page route changes leave focus on `BODY`, contrary to the screen-reader focus requirement.
2. **Some touch targets are below 44 px.** The license restore summary is 24.8 px high and Privacy/Terms footer links are 16 px high at 390 px.
3. **The deployed 404 does not use the standard site skeleton.** It has a main and return link, but no header, navigation, or footer.
4. **Route metadata/handoff identity is incomplete.** `/demo`, `/privacy`, and `/terms` keep the root `og:url`, and the shared footer omits the required version/build ID.

### Low / external observation

1. The Dodo-hosted checkout logs two accelerometer permission-policy messages. Checkout content and payment form still load; no equivalent error occurs on the product origin.

## Required before re-verification

1. Delete the demo database and demo generation counter when **Start for real** is chosen, or change the banner/contract and add a tested lifecycle that is equally explicit.
2. Register every public claim and strengthen each tagged test to assert the complete observable outcome, especially isolation/disposal, source-page integrity, free-limit boundary, and generation after unlock.
3. Make the visible Import JSON control show focus, move focus to `main`/h1 after skip and navigation, and enlarge remaining touch targets.
4. Bring the live 404, route `og:url`, and footer build identity into the standard site contract.
