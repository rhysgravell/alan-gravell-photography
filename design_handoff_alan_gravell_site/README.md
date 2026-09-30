# Handoff: Alan Gravell — Fine Art Photography Website

## Overview
Portfolio website for Alan Gravell, fine-art photographer (landscapes, buildings, nature). Minimal "white gallery wall" concept: photographs are the only visual event; everything else steps back. Pages: Home, Work (series index), Series detail + Lightbox, About, Contact (print enquiries).

## About the Design Files
The files here are **design references created in HTML** — prototypes showing intended look and behaviour, not production code. Recreate them in the target codebase's environment. If none exists, a static-first framework is recommended (e.g. **Astro** or **Next.js** with static export), with series/plates as content collections (Markdown/JSON) so new work can be added without code changes.

`Website.dc.html` opens directly in a browser (it loads `support.js`, `styles.css`, `image-slot.js` from the same folder). `image-slot.js` is a prototype-only drag-and-drop image placeholder — replace with real `<img>`/responsive images.

## Fidelity
**High-fidelity.** Colours, type, spacing and interactions are final. Copy (bio, series titles, statements, exhibitions, email) is **placeholder** — the client will supply real content.

## Design Tokens
All tokens live in `tokens/*.css` (CSS custom properties on `:root`) — reuse these files directly. Summary:

### Colour (oklch; approx hex)
| Token | Value | ≈Hex | Use |
|---|---|---|---|
| --paper-0 | oklch(0.985 0.003 85) | #FBFAF8 | fields, raised |
| --paper-1 | oklch(0.968 0.005 85) | #F6F4F0 | **page ground** |
| --paper-2 | oklch(0.935 0.006 85) | #ECE9E4 | image loading ground |
| --stone-3 | oklch(0.86 0.006 80) | #D6D3CE | hairlines |
| --stone-5 | oklch(0.62 0.008 75) | #908B85 | quiet |
| --stone-6 | oklch(0.50 0.008 70) | #6E6A64 | secondary text |
| --ink-9 | oklch(0.19 0.005 70) | #1B1A18 | primary text |
| --gallery-0 | oklch(0.16 0.004 70) | #141312 | lightbox / dark theme |
| --oxide | oklch(0.52 0.085 42) | #9A5A43 | single accent: active nav dot, focus |
| --tint-sky | oklch(0.945 0.022 235) | #E4EEF5 | home quote band, series I |
| --tint-sage | oklch(0.945 0.022 150) | #E6F0E6 | contact editions panel, series II |
| --tint-sand | oklch(0.945 0.022 85) | #F2ECDF | series III |
| --tint-mist | oklch(0.945 0.018 200) | #E3EFEF | series IV |

Tints are pale full-width bands/panels only — never text colour, never behind photographs. White (paper-1) stays dominant. Dark "gallery" theme overrides are in `[data-theme="gallery"]` in `tokens/colors.css`.

### Typography (Google Fonts)
- Display: **Cormorant Garamond** 300 (400 for small titles). XL `clamp(56px,8vw,128px)/0.95`, L `clamp(40px,5vw,72px)/1.0`, M `40px/1.1`, S `400 28px/1.2`, Quote `italic 300 32px/1.3`. Tracking −0.01em.
- Body: **Hanken Grotesk**. L `300 19px/1.65`, Base `400 16px/1.6`, S `400 14px/1.55`. Measure max 34em.
- Label: **IBM Plex Mono** 400, `11px/1.5` (L: 12px), UPPERCASE, tracking 0.14em. Used for nav, captions, metadata, buttons.

### Spacing
4, 8, 12, 16, 24, 32, 48, 64, 96, 144, 216 px (`--space-1…11`). Page gutter `clamp(20px,5vw,72px)`, max width 1440px.

### Other
Radius 0 everywhere. No shadows, blur or gradients. Borders: 1px hairline `--line`. Motion: fades only, 400–600ms `cubic-bezier(0.22,0.61,0.36,1)`.

## Screens / Views

### Global header (not sticky)
Flex, space-between, baseline, wraps; padding-top 40px. Left: name in Cormorant 400 26px (click → Home). Right: nav Work / About / Contact, mono label-L, gap 32px, secondary colour; active item primary colour with a 5px oxide dot before it. Series page counts as "Work" active.

### Global footer
1px top hairline, padding 28px 0 40px, mono label, secondary. Left "© 2026 Alan Gravell"; right "Instagram", "Print enquiries" (→ Contact).

### Home
Padding 144px top, 96px bottom.
1. **Featured photograph**: flex-wrap, align end, gap 32/48px. Image (3:2) flex `1 1 520px`, max-width 980px, pushed right (`margin-left:auto`); click → Series I lightbox plate 1. Wall label beside it (flex `0 1 220px`): 1px top hairline, 12px pad, "No. 01" / title (Display S) / "2016 · Archival pigment print".
   - Alt layout (setting "diptych"): two 4:5 images in a 2-col grid, right one raised by 144px bottom padding, captions under each.
2. **Quote band**: full-bleed (negative gutter margins), bg --tint-sky, padding 96px gutter. 2-col auto-fit grid (min 320px): label "Landscapes, buildings & nature" + italic quote (max 22em).
3. **Series grid**: header row (label "Series" / link "All work →", 1px bottom hairline). Auto-fit grid min 260px, gap 48/32px. Card: 4:5 cover, then title (Display S) and Roman numeral (mono). Click → Series.

### Work (index)
2-col auto-fit grid (min 420px), gap 64px. Left: label "Index of series" + rows. Row: grid `48px | 1fr | auto`, padding 28px 16px, 1px bottom hairline: Roman numeral · title (Display L) · years & "N plates" (mono, right-aligned stack). Hover: other rows fade to opacity 0.35, hovered row gets its series tint background (400ms). Right column: sticky (top 40px) 4:5 preview of hovered series cover + caption "II · Winter Orchard".

### Series
1. **Header band**: full-bleed, bg = that series' tint, padding 96px gutter. 2-col grid (min 380px), align end: label "Series II · 2009–2014" + H1 Display XL; statement Body L.
2. **Plates**: vertical stack, gap 144px. Each plate's width and alignment cycles to create an off-centre hang:
   widths `980, 620, 820, 560, 1100px` (capped at 100%), alignment `start, end, center, start, end`. Image keeps its real aspect ratio. Caption row below (gap 14px): "No. 01" (primary) · title · year, mono secondary. Click → lightbox.
3. **Next series**: top hairline, "Next series" label left, title + "→" (Display L) right.

### Lightbox
Fixed full-screen, bg --surface-lightbox (#141312), text on-dark. Grid rows: top bar / image / bottom bar; padding 24px gutter.
- Top: "Series title · 3 / 5" left, "Close ×" right.
- Image: centred, fills available height with a mat of `clamp(16px,3vw,40px)`, `object-fit: contain`, original ratio.
- Bottom: grid `1fr auto 1fr`: "← Prev" | title (Display S) + "No. 03 · 2018 · Archival pigment print · Edition of 7" | "Next →".
- Keys: Esc closes, ←/→ navigate (wraps).

### About
2-col auto-fit (min 380px), gap 64px. Left: 4:5 portrait (max 520px) + caption. Right: H1 name (Display L), bio (Body L, max 34em — **client to supply**), "Selected exhibitions" list: rows `72px | 1fr`, hairline separated, year mono + text Body S.

### Contact
2-col auto-fit. Left: H1 "Enquiries" (Display XL); sage-tint panel (padding 32px, max 34em) with label "Editions" + paragraph about prints; email link + "Studio visits by appointment".
Right: form, gap 32px:
- "Regarding" toggle chips: Print (default) / Commission / Exhibition / Other — mono label, padding 10×16, 1px ink border; selected = inverted (ink bg, paper text).
- Name, Email (required, type=email), Message (textarea, 5 rows): label above in mono; field has no box, only 1px bottom border in ink; focus → oxide bottom border.
- Submit "Send enquiry": ink bg, paper text, padding 16×28; hover inverts to transparent/ink.
- Success state replaces form: "Thank you." (Display M) + reply note.
Wire to a real form service (e.g. Formspree, Netlify Forms, or an API route sending email).

## Interactions & Behaviour
- Navigation is client-side in the prototype; implement as real routes: `/`, `/work`, `/work/[series-slug]`, `/work/[series-slug]/[plate]` (lightbox should be deep-linkable), `/about`, `/contact`. Scroll to top on route change.
- Images: fade in on load (600ms). No zoom on hover, no parallax.
- Links: underline via 1px bottom border; hover → accent colour.
- Responsive: all grids are `auto-fit, minmax(min(100%, Xpx), 1fr)` and collapse to one column on narrow screens; display type scales with clamp().
- Theme: optional dark "gallery" theme via `data-theme="gallery"` on root (not required for launch).

## State
Current series, hovered series (Work), lightbox plate index (null = closed), contact topic, form submitted flag.

## Content model (suggested)
```
Series { slug, roman, title, years, statement, tint: 'sky'|'sage'|'sand'|'mist', cover, plates[] }
Plate  { no, title, year, image, width, height, medium='Archival pigment print', size?, edition='7 + 2 AP' }
```
Current placeholder series: I Low Water (2016–21), II Winter Orchard (2009–14), III Standing Buildings (2001–08), IV Salt Roads (1986–99) — see `SERIES` in `Website.dc.html`.

## Assets
No logo (name in Cormorant is the mark). No icons — arrows/× are unicode. All photographs to be supplied by the client; preserve original aspect ratio, never crop, round or overlay text. Serve responsive sizes (e.g. 800/1600/2400w, AVIF/WebP).

## Files
- `Website.dc.html` — full interactive prototype (template markup + `class Component` logic with data)
- `styles.css` + `tokens/` — token CSS, reusable as-is
- `guidelines/*.html` — token specimen cards
- `DESIGN_SYSTEM.md` — brand guide (voice, visual foundations)
- `support.js`, `image-slot.js` — prototype runtime only; do not ship
