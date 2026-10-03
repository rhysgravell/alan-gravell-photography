import type { MetadataRoute } from "next";
import { plateHref } from "@/lib/format";
import { siteUrl } from "@/lib/metadata";
import { getAllSeries } from "@/lib/series";

// Written to out/sitemap.xml at build. A sitemap needs full addresses, so it
// stays empty until NEXT_PUBLIC_SITE_URL is set.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  const series = getAllSeries();
  const paths = [
    "/",
    "/work/",
    ...series.map((s) => `/work/${s.slug}/`),
    ...series.flatMap((s) => s.plates.map((p) => `${plateHref(s.slug, p)}/`)),
    "/about/",
    "/contact/",
  ];
  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
