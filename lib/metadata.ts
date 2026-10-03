import type { Metadata } from "next";
import { site } from "@/content/site";
import type { ImageSet } from "@/lib/format";

// Page metadata for search engines and link previews. Next merges metadata
// between a layout and its pages shallowly, so a page's openGraph replaces
// the root's whole; every page builds its own here instead.

/** The live site's address, e.g. https://alangravell.com, from
 * NEXT_PUBLIC_SITE_URL. Until it is set there is no domain to point at, so
 * canonical links, preview images and the sitemap are left out. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || undefined;

type PageMetadata = {
  /** Shown before " — Alan Gravell". Leave out for Home. */
  title?: string;
  /** Used as is, for titles that need the whole line. */
  absoluteTitle?: string;
  description?: string;
  /** The page's path with its trailing slash, e.g. "/work/low-water/". */
  path: string;
  /** The photograph to show in link previews. */
  image?: ImageSet;
  imageAlt?: string;
};

export function pageMetadata({
  title,
  absoluteTitle,
  description = site.description,
  path,
  image,
  imageAlt,
}: PageMetadata): Metadata {
  const fullTitle = absoluteTitle ?? (title ? `${title} — ${site.name}` : site.name);
  const preview = siteUrl && image?.preview;

  return {
    // Home sets no title, keeping the root's default. Even an undefined
    // title would replace it in the merge, so the key is left out.
    ...(absoluteTitle
      ? { title: { absolute: absoluteTitle } }
      : title
        ? { title }
        : {}),
    description,
    alternates: siteUrl ? { canonical: path } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      siteName: site.name,
      locale: "en_GB",
      type: "website",
      url: siteUrl ? path : undefined,
      images: preview
        ? [{ url: preview.src, width: preview.width, height: preview.height, alt: imageAlt }]
        : undefined,
    },
    twitter: { card: preview ? "summary_large_image" : "summary" },
  };
}
