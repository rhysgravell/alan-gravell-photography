import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Photo from "@/components/Photo";
import { plateHref, plateNo, ratioLabel, tintBg } from "@/lib/format";
import { getAllSeries, getNextSeries, getSeries } from "@/lib/series";

// The series page lives in this layout rather than in page.tsx so it stays
// mounted while the lightbox (the [plate] child route) opens, steps and
// closes over it. That keeps the reader's scroll position and makes every
// plate deep-linkable at /work/[series]/[plate].

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSeries().map((s) => ({ series: s.slug }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/work/[series]">): Promise<Metadata> {
  const series = getSeries((await params).series);
  return series ? { title: series.title, description: series.statement } : {};
}

// The off-centre hang. Plates cycle through these widths and alignments,
// each width capped at the column.
const HANG = [
  { width: 980, align: "self-start" },
  { width: 620, align: "self-end" },
  { width: 820, align: "self-center" },
  { width: 560, align: "self-start" },
  { width: 1100, align: "self-end" },
];

export default async function SeriesLayout({
  params,
  children,
}: LayoutProps<"/work/[series]">) {
  const series = getSeries((await params).series);
  if (!series) notFound();
  const next = getNextSeries(series.slug);

  return (
    <div className="mt-10 pb-24">
      <section
        className={`bleed mb-24 grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-end gap-12 py-24 ${tintBg[series.tint]}`}
      >
        <div className="flex flex-col gap-5">
          <p className="type-label text-secondary">
            Series {series.roman} · {series.years}
          </p>
          <h1 className="type-display-xl">{series.title}</h1>
        </div>
        <p className="max-w-(--measure) type-body-l text-pretty">
          {series.statement}
        </p>
      </section>

      <ol className="flex flex-col gap-36">
        {series.plates.map((plate, i) => {
          const hang = HANG[i % HANG.length];
          return (
            <li
              key={plate.no}
              className={hang.align}
              style={{ width: `min(100%, ${hang.width}px)` }}
            >
              <figure className="flex flex-col gap-3.5">
                <Link
                  href={plateHref(series.slug, plate)}
                  scroll={false}
                  className="cursor-zoom-in"
                  aria-label={`View ${plate.title} larger`}
                  data-plate={plate.no}
                >
                  <Photo
                    image={plate.image}
                    width={plate.width}
                    height={plate.height}
                    alt={`${plate.title}, ${plate.year}`}
                    placeholder={`${series.title} · No. ${plateNo(plate.no)} · ${ratioLabel(plate.width, plate.height)}`}
                    priority={i === 0}
                  />
                </Link>
                <figcaption className="flex flex-wrap gap-x-5 gap-y-1.5 type-label text-secondary">
                  <span className="text-primary">No. {plateNo(plate.no)}</span>
                  <span>{plate.title}</span>
                  <span>{plate.year}</span>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ol>

      <Link
        href={`/work/${next.slug}`}
        className="group mt-36 flex items-baseline justify-between gap-5 border-t border-line pt-8"
      >
        <span className="type-label text-secondary">Next series</span>
        <span className="type-display-l text-right transition-colors duration-(--dur-quick) group-hover:text-accent">
          {next.title} →
        </span>
      </Link>

      {children}
    </div>
  );
}
