import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Lightbox from "@/components/Lightbox";
import { site } from "@/content/site";
import { plateHref, plateMeta } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { getAllSeries, getSeries } from "@/lib/series";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSeries().flatMap((s) =>
    s.plates.map((p) => ({ series: s.slug, plate: String(p.no) })),
  );
}

async function resolve(params: PageProps<"/work/[series]/[plate]">["params"]) {
  const { series: slug, plate: no } = await params;
  const series = getSeries(slug);
  const plate = series?.plates.find((p) => String(p.no) === no);
  return series && plate ? { series, plate } : undefined;
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[series]/[plate]">): Promise<Metadata> {
  const found = await resolve(params);
  // Absolute, because the series layout's own title stops the root
  // template reaching this far down.
  if (!found) return {};
  const { series, plate } = found;
  return pageMetadata({
    absoluteTitle: `${plate.title} · ${series.title} — ${site.name}`,
    description: `${plateMeta(plate)}. From the series ${series.title}.`,
    path: `${plateHref(series.slug, plate)}/`,
    image: plate.image,
    imageAlt: `${plate.title}, ${plate.year}`,
  });
}

export default async function PlatePage({
  params,
}: PageProps<"/work/[series]/[plate]">) {
  const found = await resolve(params);
  if (!found) notFound();
  return <Lightbox series={found.series} plate={found.plate} />;
}
