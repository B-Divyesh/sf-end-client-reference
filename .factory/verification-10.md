# Independent verification 10 — Performed For

## Result

**PASS.** Candidate `8654d653c28dc316ca10b5d3f2ec0befd8e69fa8` satisfies the researched brief and the supplied acceptance contract at <https://end-client-reference.sociobot.in>.

Verified on 2026-09-01 from the exact candidate checkout. No product code was modified. No release-blocking, high, medium, or minor product defect was found.

## Required first checks

### Claims

`.factory/claims.json` exists and contains 32 entries. Before dependencies were installed, the first literal command could not start because `vitest` was absent. After the required clean `npm ci`, every exact command listed in the file was run separately and passed: **32/32 claims passed**.

The passing claims cover demo entry/isolation/reset, invoice preservation and order, CSV/JSON export and import, formula-safe CSV, record deletion and malformed-record recovery, offline reload, phone dimensions, direct routes, accessibility, same-origin processing, privacy, invoice clearing, paid-license behavior, relationship recall, billing boundaries, hosted checkout, payer wording, the 25 MiB boundary, three free packages, exact relationship text, and local-log persistence.

A cross-check of the live copy, README, Privacy, Terms, and demo documentation found no public product claim missing from the registry.

### Cold first read

The first screen passes on desktop and at 390 × 844 px:

- What it does: **“Add the end client to every invoice.”** The supporting sentence says it adds a cover to an existing invoice PDF.
- Who it serves: subcontractors and white-label agencies.
- What to do first: **“Try it with sample data.”** The adjacent note explains that it opens a completed invoice example in an isolated demo.
- One click opens `/?demo=1` with a prepared Northline Studio invoice, populated relationship fields, a sample log row, and the persistent demo banner.

## Clean checkout gates

| Gate | Result |
| --- | --- |
| Candidate identity | PASS — `git rev-parse HEAD` returned `8654d653c28dc316ca10b5d3f2ec0befd8e69fa8` |
| Install | PASS — `npm ci`; 143 packages installed, 0 vulnerabilities |
| Dependency audit | PASS — `npm audit --audit-level=high`; 0 vulnerabilities |
| Lint | PASS — `npm run lint` |
| Type check | PASS — `npm run typecheck` |
| Full local suite | PASS — 11 unit tests and 46 Chromium tests |
| Production build | PASS — `npm run build`; `dist/` produced |
| Full live suite | PASS — 45 Chromium tests passed; one local-only worker-replacement test skipped as designed |

The local worker-replacement test passed in the full local suite and displayed **“A newer version is ready. Reload when convenient.”**

## Candidate and deployment identity

The candidate build and live footer both report `v1.0.0 · build fe53243b55e5`. Every publicly served file from the production build matched the live response byte-for-byte: root and direct-route HTML, 404 page, JS/CSS and source maps, manifest, service worker, offline page, icons, art, robots, and sitemap. `staticwebapp.config.json` is host configuration and is not a public asset.

## Product workflow and recovery

- The live demo generated `NL-1048-performed-for.pdf`; parsing confirmed one cover followed by the original invoice page, for two pages total.
- Representative Unicode client text, references, invoice details, and filenames remain exact in the cover/log/export paths.
- The relationship log persists locally; CSV export, complete JSON backup/import, and individual deletion work.
- Whitespace-only required values focus the relevant field and explain the correction.
- Malformed PDFs and malformed or unsupported JSON backups produce plain recovery instructions without corrupting valid saved data.
- An exact 25 MiB PDF is accepted; 25 MiB plus one byte is rejected.
- Three ordinary packages are free; the fourth is blocked until an active license is present.
- The cover and workspace state that the billing client is the payer and the end client is not liable.

## Privacy, headers, and billing boundary

The complete live demo load and generation requested only same-origin resources, all with `GET`. No analytics, document upload, third-party script, or CDN font request occurred. No console or page error occurred.

Live responses include the declared CSP with `frame-ancestors 'none'`, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, and a restrictive Permissions Policy. Hashed assets use `public, max-age=31536000, immutable`; `sw.js` and the manifest use `no-cache`; HTML uses a 30-second revalidation policy. An unknown route returns the designed document with HTTP 404.

The product has no sign-in flow, so Microsoft Entra tenant validation does not apply. Checkout and verification use only `https://api.sociobot.in/api/v1/products/end-client-reference/...`; no purchase was completed. Fresh invalid-license requests from one client returned 200 for requests 1–30. Request 31 returned **429** with **`Retry-After: 4`**. Observed allowance: **30 verification requests per rate window**.

## Accessibility, responsive behavior, and motion

- Root, demo, Privacy, Terms, and not-found routes have one h1, `lang=en`, a main landmark, route-specific titles, and zero serious/critical axe findings.
- Desktop and 390 px phone layouts complete the workflow without horizontal overflow. Automated coverage also passes at 320 px, including 200%-zoom-equivalent reflow.
- Visible phone controls are at least 44 × 44 px and visible text is at least 16 px.
- Keyboard navigation reaches and operates the workflow. The first Tab reveals **Skip to main content** with a `3px` coral outline; Enter moves focus to `main`. Route changes and validation move focus to the relevant target.
- With reduced motion requested, the media query matches and all observed animation/transition durations are capped at 0.01 ms.

## PWA and performance

The live service worker activates, controls `/demo`, and maintains one versioned `performed-for-*` cache. In a fresh isolated context, live `/demo` reloads with HTTP 200 while offline and still generates a valid two-page PDF. The local changed-worker simulation installs the new cache and announces the available update.

Production sizes are 12.74 KB gzip initial JavaScript and 4.11 KB gzip CSS. The 175.81 KB gzip PDF engine is lazy-loaded only when needed. The mobile hero is 42.14 KB.

Fresh mobile Lighthouse results:

| Metric | Result |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First contentful paint | 0.90 s |
| Largest contentful paint | 1.17 s |
| Cumulative layout shift | 0 |
| Total blocking time | 116 ms |
| Initial transferred bytes | 61,790 |

## Findings by severity

- Release-blocking: none.
- High: none.
- Medium: none.
- Minor: none.

## Remaining limitation

No real payment was made. Verification stopped after confirming the disclosed hosted checkout boundary, fixture-based license states, and the production API allowance.
