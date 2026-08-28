# Performed For — build handoff

Work order: `end-client-reference-build-1`  
Completed: 2026-08-28

## What shipped

- A responsive, installable local-first PWA at the repository root.
- End-to-end package generation: validate an attached invoice PDF, render a relationship cover, prepend it to every original invoice page, and download one combined PDF.
- Exact-entry fields for billing client, end client, project/PO reference, invoice number, and service period. The cover explicitly states that the billing client remains responsible for payment and the end client is not made liable.
- IndexedDB relationship log with reusable browser suggestions, individual deletion, CSV export, JSON backup, and JSON import. Invoice binaries are never persisted.
- Three free generated packages per browser and a $19 one-time “trail pass” for unlimited generation. The checkout link, returned-license capture, daily-cached verification, optimistic offline verdict, revocation state, and paste-to-restore flow follow the Sociobot paid-unlock contract.
- Direct `/privacy` and `/terms` pages, with build-time copies under `dist/privacy/` and `dist/terms/` for static hosts.
- Versioned service-worker precache, runtime asset cache, network-first navigation, offline fallback, update notification, PWA manifest, 192/512/maskable icons, and explicit offline status.
- Product-specific topographic cartography design, responsive generated WebP artwork, hand-authored iconography, reduced-motion behavior, keyboard focus, mobile layout, and accessible empty/error states.

## Verification

Commands run successfully:

```sh
npm audit --audit-level=high
npm test
npm run build
```

`npm test` covers:

- CSV escaping and exact Unicode data preservation.
- Real PDF generation and parsing (one cover + one original page).
- Relationship logging and download naming.
- Required-field keyboard focus and axe serious/critical violations.
- A 390 × 844 viewport and a service-worker-controlled offline reload.
- Direct privacy/terms loads.
- Returned license capture, URL stripping, API verification, and unlock state.

Production build output:

- `dist/index.html` at the required deploy root.
- Initial JS: 23.86 KB / 9.06 KB gzip.
- CSS: 11.94 KB / 3.47 KB gzip.
- Lazy PDF engine: 420.53 KB / 175.80 KB gzip, fetched only on generation and precached after service-worker install.
- Hero: 42 KB at 768 px and 98 KB at 1200 px WebP.
- No runtime CDN, third-party font, analytics, or tracking requests.
- `npm audit`: 0 vulnerabilities.

Lighthouse 12.8.2, production preview, mobile profile:

| Category / metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| FCP | 0.9 s |
| LCP | 1.5 s |
| CLS | 0 |
| Total blocking time | 60 ms |
| Interactive | 1.5 s |

Desktop Lighthouse also scored 100 in performance, accessibility, and best practices, with 0.4 s LCP and 0 CLS. Visual review was completed at 1440 × 1000 and 390 × 844.

## Deployment notes

- Exact build command: `npm ci && npm run build`.
- Static deploy directory: `./dist`.
- The default billing API is staging-safe: `https://pilot-api.sociobot.in/api/v1`. At release, set `VITE_BILLING_BASE=https://api.sociobot.in/api/v1` after the factory registers `end-client-reference`.
- The displayed price defaults to `$19`; set `VITE_LICENSE_PRICE` if the registered offer differs.
- The service worker build ID is derived from hashed assets, so new deployments activate a new cache and remove prior app caches.

## Known boundaries / next steps

- Password-protected invoices are rejected with guidance to save an unlocked copy.
- Source PDFs are limited to 25 MB to protect mobile memory. The output can be larger because the high-resolution cover is embedded as PNG.
- Cover text is rasterized to preserve names in the user’s writing system without shipping a large font. CSV/JSON remain selectable machine-readable text; the cover itself is visual text.
- There is intentionally no cloud sync, team account, invoicing, payment collection, or multi-level client hierarchy.
- A release operator must register the paid product and confirm the production price/return URL; no product ID or secret is stored here.
