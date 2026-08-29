# Performed For — visual thesis

## Direction: topographic cartography

Performed For resolves a relationship that accounting software flattens: the payer is one place, the beneficiary another, and the engagement is the route between them. The visual system borrows from field maps rather than finance dashboards. Fine contour lines represent distinct commercial identities without implying a corporate hierarchy; a coral route marker connects the points that belong on one invoice package. The working surface feels like a durable survey sheet—quiet, exact, and meant to be annotated.

This is deliberately a single-mode, warm-paper interface. The explicit canvas avoids an ornamental “dark dashboard” treatment and gives generated PDFs and the app the same recognizable character.

## Palette

| Token | Value | Role |
| --- | --- | --- |
| Paper | `#F4F0E6` | app background and map stock |
| Sheet | `#FFFCF4` | raised work surfaces |
| Ink | `#18332F` | primary copy, borders, PDF text |
| Muted ink | `#52645F` | supporting copy; 5.5:1+ on paper |
| Forest | `#24594F` | primary controls, active route |
| Signal coral | `#B5412F` | route pins, focus and decisive accents; darkened for AA text contrast |
| Moss | `#A6B89B` | contour lines, low-emphasis dividers |
| Success | `#2F6B4F` | completed package |
| Warning | `#8A5A12` | offline/license notices |
| Danger | `#A33A2C` | validation and destructive actions |

All body text and interactive control combinations meet WCAG AA. Color is always paired with wording or an icon.

## Typography

- Display and labels: `Arial Narrow`, `Avenir Next Condensed`, `Roboto Condensed`, system sans-serif. The compact, uppercase-influenced rhythm recalls survey legends without loading a font.
- Body and data: `Avenir Next`, `Segoe UI`, system sans-serif. Tabular figures are enabled for dates and records.
- Scale: 16 / 20 / 28 / 44 px. Every visible copy role starts at 16 px; weight, spacing, and color preserve hierarchy. Reading measure is capped near 68 characters.

System fonts are intentional: there are no remote requests, no font payload, and offline rendering stays predictable.

## Spacing and shape

- Base unit: 4 px, with primary intervals at 8, 12, 16, 24, 32, 48, and 72 px.
- Corners are clipped or lightly rounded (2–12 px), echoing folded map sheets rather than generic pill cards.
- One-pixel map-grid rules group related information; whitespace establishes the larger hierarchy.
- Controls are at least 44 px high. On phones, the two-column survey desk becomes a single route and secondary context is shortened rather than merely squeezed.

## Interaction grammar

- A three-step workflow—Invoice PDF, Relationship, Download—shows the task sequence in words and symbols.
- Uploaded invoices keep their source filename. Generated packages add metadata to the relationship log.
- Primary buttons use forest fill; coral marks keyboard focus and the document registration point.
- Destructive record deletion names the record in a native confirmation. Generated files remain user-controlled downloads.
- The cartographic idea stays in the visual system; interface labels remain literal invoice, package, license, and relationship wording.

## Motion policy

State changes use 180–240 ms opacity and small translate transitions with a physical origin (the active form or toast edge). There is no ambient or looping motion. Under `prefers-reduced-motion: reduce`, transitions and smooth scrolling are disabled and state changes are immediate.

## Original asset plan and provenance

The hero is an abstract aerial map of layered invoice sheets: paper contours, two distinct mapped zones, and one coral route marker. It explains the payer-to-beneficiary bridge without depicting fake product output or real entities. UI icons and the logo are hand-authored SVG/CSS geometry.

Prompt sheet:

> Use case: stylized-concept. Asset type: compact PWA header illustration. A top-down editorial still life that looks like a hand-cut topographic survey map made from layered warm ivory paper, two distinct landforms separated by a narrow channel, a single precise coral route line and small registration dots joining them, subtle forest-green contour lines, quiet archival cartography mood, tactile paper fibers, soft directional daylight, generous clear edges, no people, no buildings, no screens. Palette: warm paper, deep evergreen ink, sage contour lines, restrained signal coral. No text, no numerals, no logos, no watermark, no gradients, no blue, no currency symbols, no corporate stock-art style.

- Generation tool: factory Azure image generator via `/opt/fleet/lib/gen-image.sh` (explicitly required by the work order).
- Model/deployment: `factory-image` (Azure AI Foundry deployment).
- Generation date: 2026-08-28.
- License/provenance: original AI-generated artwork commissioned for this product; no real people, brands, or copyrighted characters.
- Source PNG and prompt sidecar live in `assets/src/`; optimized responsive WebP derivatives ship from `public/art/` (the host converter’s AVIF output was rejected during review as invalid).
- `public/art/performed-for-social.webp` is a hand-reviewed 1200 × 630 center crop of that same generated source for Open Graph and Twitter previews; it has no added text, people, brands, or marks.
