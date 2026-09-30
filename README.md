# Alan Gravell Photography

Portfolio website for Alan Gravell, fine-art photographer. A quiet "white gallery wall": the photographs are the only visual event.

Built from the design system in `Photography Website Design System/`: tokens and rules in its `readme.md`, the site in `Website v2.dc.html`. Where they differ, v2 wins; it adds the Home slideshow and scroll reveals that the readme's "fades only" rule predates.

## Stack

Next.js (App Router) with a static export, Tailwind v4 and TypeScript. `npm run build` writes the whole site to `out/`, which can be hosted on any static host.

## Development

```sh
nvm use
npm install
npm run dev
```

`npm run lint`, `npm run typecheck` and `npm run build` should all pass before a PR.

## Pages

| Route | |
|---|---|
| `/` | Slideshow, quote, alternating series bands, prints note |
| `/work` | Index of series with hover preview |
| `/work/[series]` | Series header, then plates hung as singles, tinted pairs, full-bleed plates and the series note |
| `/work/[series]/[plate]` | Lightbox over the series. Esc closes, ← → step |
| `/about` | Portrait, bio, selected exhibitions |
| `/contact` | Editions note and enquiry form |

## Content

All copy in the design system is placeholder until the client supplies the real text and photographs.

- **Series**: one JSON file per series in `content/series/`, named by its URL slug. `order` sets the sequence (Roman numerals follow it), `tint` is one of `sky`, `sage`, `sand`, `mist`, `cover` is the plate number to use as the cover, and `note` (optional) is a line in the photographer's voice shown as a quote between the plates. Each plate needs `title`, `year`, `width` and `height`; `image`, `medium`, `size` and `edition` are optional. Adding a file adds a series; no code changes needed. A mistake in a file (unknown tint, missing size, bad cover number, an `image` not in `public/`, two series with the same `order`) fails the build with an error naming the file and field.
- **Site copy**: name, email, Home slideshow, bio, exhibitions and contact text live in `content/site.ts`. The slideshow fills a wide frame edge to edge, so pick landscape photographs; it's the one place a photograph is cropped. A slide pointing at a plate that doesn't exist fails the build.

### Photographs

Put images in `public/photos/` and reference them from the plate's `image` field, e.g. `"/photos/low-water/01.jpg"`. Set `width` and `height` to the file's real pixel size; the aspect ratio is never cropped. Until a plate has an `image`, a labelled placeholder is shown.

Images are served as-is for now. Before launch, generate responsive sizes (800/1600/2400w, AVIF/WebP) at build time and serve them with `srcset`.

## Contact form

The site is static, so enquiries post to a hosted form service. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_CONTACT_ENDPOINT` to a Formspree form URL (or any endpoint that accepts a form POST and returns 2xx). Without it, the form shows an error asking the visitor to email instead.
