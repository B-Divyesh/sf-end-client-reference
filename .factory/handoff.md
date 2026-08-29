# Performed For — repair handoff

## Outcome

Release-blocking findings from independent verifier report commit `b76105fcd12de910a3160d9854446a27222f91bd`, against candidate `f099ba0077e55598b1ed7c55f7d987f259384dab`, are repaired.

- Repair commit: `7508adc0d119e1478b03c12dce7821e7b696b958`
- Deployment: <https://end-client-reference.sociobot.in>
- Azure Static Web Apps deployment: `66a81bb1-6573-431e-87fa-c27bb99cc0f8` in `centralus`
- Deployed build identity: `v1.0.0 · build 92118097247e`
- Active service-worker cache: `performed-for-1883c0985441`
- Artifact remains a static `pwa-offline`; the researched brief, local PDF workflow, free/paid boundary, privacy model, demo isolation, and topographic visual system are unchanged.

No release-blocking gap remains.

## Verifier findings repaired

### Typed backup poisoning and persistent crash

- Added one schema boundary in `src/records.ts`. Every record field must have the expected type, required text cannot be blank, field lengths match the UI, timestamps are strict UTC values, and every persisted property is copied into a known safe shape.
- Import now requires backup version `1`, a valid export timestamp, and a fully valid record array before IndexedDB is opened for writing. Unsupported versions and a single bad record reject the whole import.
- `src/db.ts` defensively validates direct writes and complete import batches. The IndexedDB import uses one read-write transaction.
- Existing malformed records are filtered before sorting or rendering, so they cannot crash the workspace. The relationship log reports the skipped count and offers **Remove only unreadable records**.
- Recovery deletes only rejected entries. Valid records, the generation count, and the saved license remain unchanged.
- Regression coverage proves a mixed valid/wrong-typed import writes nothing, version `2` writes nothing, reload stays usable with no console error, an already-poisoned database keeps a valid row visible, selective cleanup removes only the poison row, and the saved license survives.

### Missing public claim coverage

`.factory/claims.json` now contains 15 claims. Added one exact tagged browser test for each omitted promise:

- `@claim:json-backup` downloads and parses the complete sample version `1` backup.
- `@claim:json-import` imports a complete backup and proves the row remains after reload.
- `@claim:record-deletion` deletes one of two rows and proves the other remains after reload.
- `@claim:relationship-recall` uses a fixture-verified license, generates a relationship, reloads, proves both paid client datalists retained it, and uses those recalled values for another package.

The copy audit and README map these promises to their claim IDs. Every one of the 15 literal commands in `.factory/claims.json` passed separately.

### Internal malformed-PDF error

- PDF loading, page-tree inspection, copying, and saving now share one error-normalization boundary.
- A `%PDF-`-prefixed file with no valid page tree displays: **“That file could not be read as a PDF. Choose the original invoice PDF and try again.”**
- The regression replaces that file with a valid PDF, downloads the package without reloading, and proves the error clears.
- The existing password-protected PDF instruction remains distinct.

## Clean local verification — 2026-08-29

```text
npm ci                              PASS — 143 packages installed; 0 vulnerabilities
npm audit --audit-level=high        PASS — 0 vulnerabilities
npm run typecheck                   PASS — TypeScript; 0 errors
npm run lint                        PASS — ESLint; 0 warnings/errors
npm test                            PASS — 8 Vitest tests + 26 Chromium tests
all 15 claims.json commands         PASS — each selected its exact tagged test
npm run build                       PASS — dist/index.html generated
git diff --check                    PASS
```

Production output:

- Initial app JavaScript: 33.64 KB raw / 11.90 KB gzip.
- CSS: 13.42 KB raw / 3.70 KB gzip.
- Lazy PDF engine: 420.56 KB raw / 175.81 KB gzip.
- Mobile hero: 42.14 KB. No font payload.
- Lighthouse 13.0.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.2 s, TBT 0 ms, CLS 0, total transfer 69 KiB.

Browser and accessibility evidence:

- Desktop and 390 × 844 screenshots were reviewed. The first CTA remains in the first mobile viewport, controls stack intentionally, and there is no horizontal overflow. The 320 px regression also passes.
- Keyboard tests cover skip-link activation, visible focus on Import JSON, route focus/announcement, validation focus, and actionable controls. Touch targets remain at least 44 px.
- Reduced-motion behavior, semantic routes, one `h1`, heading/landmark structure, labels, image alternatives, and accessible names pass.
- `verify-url.sh` passed `/`, `/demo`, `/privacy`, and `/terms` locally with zero console/page errors.
- Axe CLI 4.10.3 reported 0 violations on all four routes. Playwright axe reported no serious or critical issues, including the 404 route.

Privacy and PWA evidence:

- The full demo generation request log contains only same-origin GET requests. No analytics, document uploads, third-party scripts, or remote fonts occur.
- A fresh 390 px context acquired the production worker, went offline, reloaded `/demo` with status 200, and generated/parsed the two-page sample package.
- The changed-worker test replaces the old cache and announces the available update.
- Demo and ordinary IndexedDB/localStorage namespaces remain isolated; leaving demo deletes only demo data.

## Deployment and live verification

Deployment used the work-order static configuration:

```sh
npm run build
/opt/fleet/lib/deploy-static.sh end-client-reference /work/repo/dist
```

Live results:

- `PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npx playwright test`: 26/26 passed. The update-replacement case uses its intended isolated local worker server; the remaining cases exercise the deployed origin.
- `verify-url.sh` passed `/`, `/demo`, `/privacy`, and `/terms` in 837–1095 ms. Each had the correct title, `lang=en`, one `h1`, a `main`, complete image alternatives, named buttons, and no console/page error.
- Axe CLI found 0 violations on those four live routes.
- `/`, `/demo`, `/privacy`, `/terms`, `robots.txt`, `sitemap.xml`, the manifest, and `sw.js` return 200. An unknown route returns the product 404 with HTTP 404.
- All 20 deployable files, excluding source maps and host-only configuration, match local `dist/` byte for byte.
- Response policy includes CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and a restrictive permissions policy. HTML is short-cached, hashed assets are one-year immutable, and `sw.js` is `no-cache`.
- The manifest parses with standalone display, a versioned start URL, 192 px, 512 px, and maskable icons.
- The production buy endpoint returns 303 to Dodo. The hosted checkout returns 200 and identifies **Performed For** at **$19.00**.
- SHA-256: `dist/index.html` is `9bba2752871e09bb5c2bcc8bdc9aae62298b456d7668866ecc6275323fee82c0`; `dist/sw.js` is `94acd1c17145ecc3c8036dbcfeaf25536b2e9798c4e3233454942b5c122ac799`; the manifest is `6fe40c1fbb1e81c8cef26fb125509c13b811f651d6c3a236111c79d019866526`.

## Run and verify

```sh
npm ci
npm audit --audit-level=high
npm run typecheck
npm run lint
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npx playwright test
```

Run any public claim exactly as declared, for example:

```sh
npm test -- --grep @claim:json-import
npm test -- --grep @claim:relationship-recall
```

## Known limitations

No real purchase was made. Production checkout identity/reachability and the complete returned-license client path are verified without payment spend. This static PWA has no backend, sign-in flow, CLI, library package, or consumer compatibility surface, so backend concurrency, Entra identity, and package-consumer checks do not apply.
