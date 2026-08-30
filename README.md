# Performed For

Add an end-client cover to an existing invoice PDF.

It is for subcontractors and agencies that invoice a billing client but must name the end client and project.

Start with the one-click [sample demo](https://end-client-reference.sociobot.in/demo). Or choose an invoice and enter its billing client, end client, and project reference.

The download adds one cover before the original invoice pages. The cover says the end client is not liable for payment.

Live: <https://end-client-reference.sociobot.in>

## Demo and data

`/demo` and `/?demo=1` open a completed Northline Studio example.

The demo banner can reset the original sample. Start for real discards the demo data.

Demo records use `demo:performed-for`. Ordinary records use `performed-for`.

Invoice PDFs stay in your browser. The relationship log stores only metadata.

No analytics, third-party scripts, CDN fonts, or cloud document storage are used.

## License

Three packages are free. A $19 one-time license enables unlimited packages and saved client suggestions on this device.

You can restore an active license on another device. Checkout and license verification use the Sociobot billing API.

## Run locally

Requirements: Node.js 22+ and npm.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. For the offline path, use a production preview:

```sh
npm run build
npm run preview
```

Optional build-time variables:

- `VITE_BILLING_BASE` — billing API root. Defaults to `https://api.sociobot.in/api/v1`.
- `VITE_LICENSE_PRICE` — displayed one-time price. Defaults to `$19`.

## Test and build

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

`npm test` checks:

- original invoice pages stay unchanged;
- CSV cells cannot run spreadsheet formulas;
- demo data is discarded;
- saved records can be exported, imported, and deleted;
- mobile text and controls meet their size limits;
- routes, accessibility, and offline reload work.

Playwright starts a fresh production preview for PWA checks. The pinned Playwright version is 1.58.2.

`npm run build` type-checks the app and writes it to `dist/`. The output includes direct route files, the 404 page, host settings, and an offline service worker.

Set `PLAYWRIGHT_BASE_URL=https://end-client-reference.sociobot.in` to test an already deployed artifact.

Deploy `dist/` to the configured static host. This repository does not manage DNS or billing registration.

## License

MIT — see [LICENSE](LICENSE).
