# Performed For — polish 1 handoff

## Released repair

Product repair commit: `f52ce7a0be883adae70c5236103b2d15d4805b70`.

It fixes every finding F-1-1 through F-1-18 from `.factory/review-1.md`: demo-first isolated workspace, sticky reset/start banner, history scroll/focus restoration, first-screen mobile facts, claim registry coverage, plain wording, privacy scope, accessible table header, manifest MIME, and 180 px Apple icon.

Static deployment: `f75c0db0-c615-4a49-a518-75ceb4521b6c` to <https://end-client-reference.sociobot.in>. The deployed route check was cold-run after upload.

## How to run

```sh
npm ci
npm run dev
```

For production PWA behavior:

```sh
npm test
npm run build
npm run preview
```

Open `/demo` or `/?demo=1` for the isolated Northline Studio sample. **Reset demo** restores it; **Start for real** deletes only the demo namespace.

## Exact verification evidence

- Fresh clone at `f52ce7a`: `npm ci` passed; every one of the 21 literal commands in `.factory/claims.json` passed independently; `npm audit --audit-level=high` found 0 vulnerabilities.
- Fresh clone: `npm run lint`, `npm run typecheck`, `npm test` (9 Vitest + 35 Playwright), `npm run build`, and `git diff --check` passed.
- Local production preview: `/opt/fleet/lib/verify-url.sh` passed `/` and `/demo`; Playwright Axe integration passed all app routes with no serious or critical violations.
- Live after deploy: `verify-url.sh` passed `/`, `/demo`, `/privacy`, and `/terms`; a complete `PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in npx playwright test` rerun passed 35/35.
- Live `GET /manifest.webmanifest` returns `Content-Type: application/manifest+json`; recorded in `.factory/polish-artifacts/live-manifest-headers.txt`.
- Live screenshots and JSON verification reports are in `.factory/polish-artifacts/live-*`. Finding-by-finding mapping is in `.factory/polish-1.md`.

## Known gaps

None. The standalone `@axe-core/cli` could not start Chrome in this container; the required Axe coverage was completed through the repository’s Playwright Axe integration instead.
