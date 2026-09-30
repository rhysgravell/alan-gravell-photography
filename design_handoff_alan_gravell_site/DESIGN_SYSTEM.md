# Fine Art Photography — Design System

Design system and website for **Alan Gravell**, fine-art photographer — landscapes, buildings and nature. Built from scratch — no codebase, Figma or brand files were supplied. The photographer's name, bio, series titles and all imagery are **placeholders** to be replaced.

## Index
- `styles.css` — entry point (imports only)
- `tokens/` — fonts, colors, typography, spacing, motion
- `guidelines/` — specimen cards (Colors, Type, Spacing, Brand, Components)
- `Website.dc.html` — the site: Home, Work index, Series, Lightbox, About, Contact
- `image-slot.js` — drop-in photo placeholders (drag your own photos in)
- `SKILL.md` — Agent Skill wrapper

## Concept — "the white wall"
The site behaves like a quiet gallery. Photographs are the only visual event; everything else steps back. Each image is hung with space around it and captioned like a museum wall label.

## CONTENT FUNDAMENTALS
- Voice: first person from the photographer in statements and bio ("I returned to the estuary each winter…"); third person nowhere else. Calm, specific, unhurried. No marketing language, no exclamation marks, no emoji.
- Casing: series titles in Title Case ("The Quiet Rooms"). Labels and nav are UPPERCASE mono, set in CSS — write them in sentence case in source.
- Metadata format: `No. 04 · 2019 · Archival pigment print · 40 × 50 cm · Edition of 7 + 2 AP`. Use the true multiplication sign ×, middle dot · as separator, en dash for ranges (2011–2016).
- Numbers: plates numbered two-digit (No. 01). Series numbered in Roman numerals (I, II, III).
- CTAs are plain verbs: "Enquire", "View series", "Next plate". Never "Shop now".

## VISUAL FOUNDATIONS
- **Color**: warm paper (#f6f4f0-ish) and near-black ink; a dark "gallery" variant for the lightbox and optional dark theme. One accent (oxide red) — used for at most one element per view (active dot, focus, availability). Four pale landscape tints (sky, sage, mist, sand — oklch 0.945 / 0.022) appear only as full-width bands or panels: the home quote band, each series' header band (one tint per series), hovered index rows, and the editions panel on Contact. White remains the dominant ground; tints never carry text colour or sit behind photographs. No gradients.
- **Type**: Cormorant Garamond Light for titles; Hanken Grotesk for reading; IBM Plex Mono uppercase tracked 0.14em for labels/nav/metadata.
- **Layout**: asymmetric, generous. Images are hung off-centre on a 12-col grid, alternating left/right in series. Body text capped at 34em. Page gutter clamp(20px, 5vw, 72px).
- **Imagery**: the photographer's own work, uncropped, original aspect ratio preserved. Never rounded, never shadowed, never overlaid with text. Placeholders are a quiet diagonal stripe with a mono label.
- **Backgrounds**: flat paper. No textures, no full-bleed photos behind text.
- **Borders**: 1px hairlines (--line) to separate list rows and field underlines. No boxes/cards.
- **Corner radii**: 0 everywhere.
- **Shadows / blur / transparency**: none. The lightbox uses a solid dark ground, not a blur.
- **Animation**: slow fades only (600ms, ease-gallery). Images fade in; pages cross-fade. No slides, bounces or parallax.
- **Hover**: text links gain/lose an underline; list rows dim siblings to 35% opacity; images do not zoom.
- **Press**: no transform; buttons invert (ink → paper).
- **Fixed elements**: header is static, not sticky — nothing floats over photographs.

## ICONOGRAPHY
Essentially icon-free. Arrows are unicode (→ ← ×) set in the label font. No icon font, no SVG icons, no emoji. There is **no logo**; the photographer's name set in Cormorant is the mark.

## Fonts
All from Google Fonts (no brand fonts supplied): Cormorant Garamond, Hanken Grotesk, IBM Plex Mono.
