# Performed For

Performed For adds the missing “services performed for” relationship to an invoice without replacing anyone’s invoicing system. A subcontractor, fractional specialist, or white-label agency attaches an existing invoice PDF, enters the billing client, end client, and project/PO reference, then downloads one PDF containing a clear cover followed by the unchanged invoice pages.

The app is a local-first offline PWA. Invoice files are processed in browser memory and never uploaded or retained. Relationship metadata is kept in IndexedDB and can be exported to CSV or backed up/imported as JSON.

Live: <https://end-client-reference.sociobot.in>

## Product boundaries

- Generates a companion cover and combines it with an existing PDF.
- Maintains a reusable local relationship log and CSV report.
- Clearly says that the end client is not liable for payment.
- Does not create invoices, collect payment, manage contacts, or model entity trees.

Three packages are free. A $19 one-time license unlocks unlimited generation and relationship recall. Checkout and license verification use the Sociobot billing API; no payment provider is embedded in this app.

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

- `VITE_BILLING_BASE` — billing API root. Defaults to the staging-safe `https://pilot-api.sociobot.in/api/v1`.
- `VITE_LICENSE_PRICE` — displayed one-time price. Defaults to `$19`.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs unit tests plus Chromium end-to-end tests for real PDF merging, accessibility, mobile layout, direct legal routes, and offline reload. The pinned Playwright version is 1.58.2. `npm run build` type-checks and writes the static deployment to `dist/`, including `dist/index.html`, direct `/privacy` and `/terms` documents, and a service worker with the hashed assets injected into its precache.

Deploy the contents of `dist/` to a static host. The repository does not manage DNS, billing registration, or infrastructure.

## Data and security notes

- The original PDF is held only long enough to create the local download.
- Generated cover text is rasterized before being embedded so names in the user’s writing system render as entered; the CSV/JSON remain machine-readable text.
- Individual records can be deleted. Clearing the site’s browser data removes records and the device’s saved license.
- No analytics, third-party scripts, CDN fonts, or cloud document storage are used.

See [the researched brief](.factory/brief.json), [visual system](.factory/design.md), [privacy notice](https://end-client-reference.sociobot.in/privacy), and [terms](https://end-client-reference.sociobot.in/terms).

## License

MIT — see [LICENSE](LICENSE).
