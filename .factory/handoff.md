# Performed For — polish 4 handoff

## Outcome

**PASS.** All findings from adversarial reviews 1–4 are fixed. Review 4's five remaining issues now have direct code changes, exact claim registrations, clean-clone tests, and live evidence.

Product repair commit: `d0d2313000fbb491cb646947647d212e504d5b12`. Deployment: `be509336-1534-4d77-a4ec-bd4adefb8e18` on the existing `sf-end-client-reference` static app.

## Work performed

- Added five claim entries and exactly one tagged browser test for each: `demo-one-click`, `csv-formula-safety`, `mobile-dimensions`, `direct-routes`, and `automated-accessibility`.
- Made the one-click README and landing path use `/?demo=1`. It opens the banner, prepared invoice, populated client fields, and sample record; Reset restores the seed.
- Kept formula-like values unchanged in the UI and cover while confirming every CSV field beginning with `=`, `+`, `-`, or `@` is exported as literal text.
- Replaced vague mobile wording with measured 16 px text and 44 × 44 px control guarantees at 390 px and the 320 px reflow width.
- Narrowed the accessibility statement to the serious/critical Axe result on Privacy, Terms, and the not-found page.
- Replaced `performed-for relationship` and `invoice relationship cover` with `end-client cover` in route metadata, manifest/package descriptions, 404 copy, and the generated PDF heading.
- Updated `.factory/catalog-description.txt`, `.factory/copy-audit.md`, `.factory/demo.md`, and `.factory/polish-4.md`.
- Preserved the warm-paper topographic visual system and the offline PWA deployment class.

## Verification commands

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npm test
```

Every claim command was read from `.factory/claims.json` and executed independently in clean clone `/tmp/performed-for-polish4.U1fCnw` at `d0d2313`.

## Exact evidence

- Clean claim matrix: 32/32 passed. See [clean-claim-results.json](polish-artifacts/round-4/clean-claim-results.json).
- Clean full suite: lint and type-check passed; 11 unit tests and 46 browser tests passed; build produced `dist/index.html`.
- Local bundle: 12.74 KB gzip initial JS and 4.11 KB gzip CSS; the 175.81 KB PDF engine is lazy-loaded.
- Live repaired-claim slice: 5/5 passed.
- Live full suite: 11 unit tests and 45 browser tests passed; one local-only service-worker mutation test skipped.
- Live URL verifier: root, `/?demo=1`, `/privacy`, and `/terms` each returned 200 with one h1, `lang=en`, a main landmark, complete alt coverage, labeled buttons, and no console errors.
- Live route check: `/privacy` and `/terms` returned 200; `/does-not-exist-round-4` returned the designed 404. Each had zero serious/critical Axe findings.
- Cold demo check: one click reached `/?demo=1`; the banner, filename, populated billing client, and sample row appeared. Reset restored Harbour Arts Council and one seed row.
- Mobile check at 320 px: minimum text 16 px, minimum control height 44 px, and document width 320 px.
- Live Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.11 s, CLS 0, TBT 25 ms.
- Evidence: [cold live report](polish-artifacts/round-4/live-cold-review.json), [root screenshot](polish-artifacts/round-4/live-root-first-screen-mobile.png), [demo screenshot](polish-artifacts/round-4/live-demo-first-screen-mobile.png), [Lighthouse report](polish-artifacts/round-4/lighthouse-live.json), and [manifest headers](polish-artifacts/round-4/live-manifest-headers.txt).

## Known gaps and next steps

No product or review gap remains. No real payment was made; the hosted-checkout test stopped before purchase. Only `dist/` was uploaded to the existing `sf-end-client-reference` app. DNS and unrelated resources were not accessed or changed.
