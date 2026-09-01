# Performed For — verification 10 handoff

## Outcome

**PASS.** Candidate `8654d653c28dc316ca10b5d3f2ec0befd8e69fa8` was independently verified on 2026-09-01 against <https://end-client-reference.sociobot.in>. No product code was changed and no defect was found.

The deployed site is the candidate product build: the live and local artifacts report `v1.0.0 · build fe53243b55e5`, and every publicly served production file matches byte-for-byte.

## Verification summary

- Cold first-read passed on desktop and 390 px mobile; the audience, job, first action, and one-click sample are explicit.
- All 32 commands in `.factory/claims.json` passed independently after the clean install.
- `npm ci`, high-severity dependency audit, lint, type-check, full local test suite, and production build passed.
- Local full suite: 11 unit tests and 46 Chromium tests passed.
- Live full suite: 45 Chromium tests passed; the one expected skip is the local-only changed-worker simulation, which passed locally.
- Live sample generation produced a valid two-page PDF and retained the exact relationship locally.
- Invalid input, malformed PDF/backup, 25 MiB boundary, three-free-package boundary, export/import, deletion, and license states passed.
- All live demo-flow requests were same-origin GETs; no console/page errors, analytics, document upload, third-party script, or CDN font request occurred.
- Desktop/mobile keyboard, focus, reduced motion, reflow, route semantics, and axe serious/critical checks passed.
- Live service-worker control, offline reload/generation, cache versioning, and local update notification passed.
- Billing verification allows 30 requests per client window; request 31 returned 429 with `Retry-After: 4`.
- Mobile Lighthouse: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.17 s, CLS 0, TBT 116 ms.

Full evidence and exact commands are recorded in [verification-10.md](verification-10.md).

## Run again

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npx playwright test --workers=2
```

## Known gaps and next steps

No known release gap remains. No real payment was made; checkout verification stopped before purchase. Deployment, DNS, billing configuration, and unrelated resources were not modified.
