# Performed For

Performed For adds a clear end-client cover to an existing invoice PDF. It is for subcontractors, fractional specialists, and white-label agencies who bill a prime client but need to identify the ultimate customer and project.

Start with the one-click [sample demo](https://end-client-reference.sociobot.in/demo), or choose an invoice and enter its billing client, end client, and project/PO reference. The download contains the cover followed by the original invoice page.

Live: <https://end-client-reference.sociobot.in>

## What it does

- Generates a companion cover and combines it with an existing PDF.
- Maintains a relationship log and CSV report in the browser.
- Clearly says that the end client is not liable for payment.
- Does not create invoices, collect payment, manage contacts, or model entity trees.

Three packages are free. A $19 one-time license unlocks unlimited generation and relationship recall. Checkout and license verification use the Sociobot billing API; no payment provider is embedded in this app.

## Demo and data

`/demo` and `/?demo=1` open a completed Northline Studio example. The persistent demo banner can reset the sample or start a real workspace. Demo records use the separate `demo:performed-for` IndexedDB namespace; ordinary records use `performed-for`. Starting for real deletes the demo database and counter. See [the demo sandbox notes](.factory/demo.md) and [tested product claims](.factory/claims.json).

## Run locally

Requirements: Node.js 22+ and npm.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. To exercise install/offline behavior, use a production preview:

```sh
npm run build
npm run preview
```

Optional build-time variables:

- `VITE_BILLING_BASE` — billing API root. Defaults to `https://api.sociobot.in/api/v1` for the public release.
- `VITE_LICENSE_PRICE` — displayed one-time price. Defaults to `$19`.

## Test and build

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

`npm test` runs unit tests plus Chromium end-to-end tests for real PDF merging, exact source-page content streams, free and size boundaries, demo disposal, exported CSV, accessibility, mobile layout, direct legal routes, and offline reload. The pinned Playwright version is 1.58.2. `npm run lint` and `npm run typecheck` run static checks. `npm run build` type-checks and writes the static deployment to `dist/`, including `dist/index.html`, direct `/demo`, `/privacy`, and `/terms` documents, a standard-shell 404, host headers, and a service worker with the hashed assets injected into its precache.

Deploy the contents of `dist/` to a static host. The repository does not manage DNS, billing registration, or infrastructure.

## Data and security notes

- The original PDF is held only long enough to create the local download.
- Generated cover text is rasterized before being embedded so names in the user’s writing system render as entered; CSV/JSON remain machine-readable text.
- Individual records can be deleted. Clearing the site’s browser data removes records and the device’s saved license.
- No analytics, third-party scripts, CDN fonts, or cloud document storage are used.

See [the researched brief](.factory/brief.json), [visual system](.factory/design.md), [privacy notice](https://end-client-reference.sociobot.in/privacy), and [terms](https://end-client-reference.sociobot.in/terms).

## License

MIT — see [LICENSE](LICENSE).
