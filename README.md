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

- **Series**: one JSON file per series in `content/series/`, named by its URL slug. `order` sets the sequence (Roman numerals follow it), `tint` is one of `sky`, `sage`, `sand`, `mist`, `cover` is the plate number to use as the cover, and `note` (optional) is a line in the photographer's voice shown as a quote between the plates. Each plate needs `title`, `year`, and either an `image` or a `width` and `height` for its placeholder; `medium`, `size` and `edition` are optional. Adding a file adds a series; no code changes needed. A mistake in a file (unknown tint, missing size, bad cover number, an `image` not in `photos/`, two series with the same `order`) fails the build with an error naming the file and field.
- **Site copy**: name, email, Home slideshow, bio, exhibitions and contact text live in `content/site.ts`. The slideshow fills a wide frame edge to edge, so pick landscape photographs; it's the one place a photograph is cropped. A slide pointing at a plate that doesn't exist fails the build.

### Photographs

Put the original photographs in `photos/`, one folder per series, and reference them from the plate's `image` field by their path inside it, e.g. `"image": "low-water/01.jpg"`. JPEG, PNG, TIFF and WebP all work. Export them at about 3000px on the long edge: that is sharp at every size the site serves, and keeps the repository small enough to hold them without Git LFS.

`npm run images` (run automatically before `dev` and `build`) resizes every original to 800, 1600 and 2400px wide, never wider than the original, in AVIF and WebP, and writes them to `public/img/`. Each page then names how wide each photograph shows, so browsers fetch the smallest size that stays sharp. The resized files are generated, not committed; unchanged photographs are skipped on later runs. If you add photographs while the dev server is running, run `npm run images` and reload.

A plate's `width` and `height` come from its photograph, so they can be left out once it has one. Until then they set the shape of its labelled placeholder. Colour is converted to sRGB, and EXIF rotation is applied.

The About portrait works the same way, through `about.portrait.image` in `content/site.ts`.

## Search and link previews

Every page has a title and description, and an Open Graph preview card (title, description and photograph) for links shared on social sites and in messages. Home uses the first slideshow photograph, a series its cover, a plate itself, and About the portrait. `npm run images` makes a 1200px JPEG of each photograph for these cards.

Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) to the live address once the domain is decided. Until then there are no full addresses to give, so canonical links, preview images and the entries in `sitemap.xml` are left out, and `robots.txt` doesn't name the sitemap.

## Contact form

The site is static, so enquiries post to a hosted form service. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_CONTACT_ENDPOINT` to a Formspree form URL (or any endpoint that accepts a form POST and returns 2xx). Without it, the form shows an error asking the visitor to email instead.
