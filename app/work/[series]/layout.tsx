import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Photo from "@/components/Photo";
import { plateHref, plateNo, ratioLabel, tintBg, upTo } from "@/lib/format";
import Reveal from "@/components/Reveal";
import { pageMetadata } from "@/lib/metadata";
import {
  getAllSeries,
  getNextSeries,
  getSeries,
  type Plate,
  type Series,
} from "@/lib/series";

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
  return series
    ? pageMetadata({
        title: series.title,
        description: series.statement,
        path: `/work/${series.slug}/`,
        image: series.cover.image,
        imageAlt: `${series.cover.title}, from the series ${series.title}`,
      })
    : {};
}

// The hang. Plates are laid out in a repeating rhythm of blocks: a single
// print hung off-centre, a pair on the series' tint, the series note as a
// quote, and one plate full-bleed. Singles cycle through these widths and
// alignments. The note is used once; a pair with one plate left is a single.
const PATTERN = [
  "single", "pair", "quote", "full", "single", "pair", "single", "single",
] as const;

const SINGLE = [
  { width: 980, align: "self-start" },
  { width: 620, align: "self-end" },
  { width: 820, align: "self-center" },
];

type Block =
  | { kind: "single"; plate: Plate; width: number; align: string }
  | { kind: "pair"; plates: [Plate, Plate] }
  | { kind: "full"; plate: Plate }
  | { kind: "quote"; text: string };

function hang(series: Series): Block[] {
  const { plates, note } = series;
  const blocks: Block[] = [];
  let i = 0;
  let singles = 0;
  let quoted = false;
  for (let k = 0; i < plates.length; k++) {
    let kind = PATTERN[k % PATTERN.length];
    if (kind === "pair" && i + 1 >= plates.length) kind = "single";
    if (kind === "quote") {
      if (note && !quoted) blocks.push({ kind, text: note });
      quoted = true;
    } else if (kind === "single") {
      blocks.push({ kind, plate: plates[i++], ...SINGLE[singles++ % SINGLE.length] });
    } else if (kind === "pair") {
      blocks.push({ kind, plates: [plates[i], plates[i + 1]] });
      i += 2;
    } else {
      blocks.push({ kind, plate: plates[i++] });
    }
  }
  return blocks;
}

export default async function SeriesLayout({
  params,
  children,
}: LayoutProps<"/work/[series]">) {
  const series = getSeries((await params).series);
  if (!series) notFound();
  const next = getNextSeries(series.slug);

  return (
    <div className="pb-24">
      <section
        className={`bleed grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-end gap-12 pt-36 pb-24 ${tintBg[series.tint]}`}
      >
        <div className="flex flex-col gap-5">
          <p className="type-label text-secondary">
            Series {series.roman} · {series.years} · {series.plates.length}{" "}
            photographs
          </p>
          <h1 className="type-display-xl">{series.title}</h1>
        </div>
        <p className="max-w-(--measure) type-body-l text-pretty">
          {series.statement}
        </p>
      </section>

      <div className="flex flex-col gap-36 pt-36">
        {hang(series).map((block, i) => (
          <Reveal key={i}>
            {block.kind === "single" && (
              <div className="flex flex-col">
                <div
                  className={block.align}
                  style={{ width: `min(100%, ${block.width}px)` }}
                >
                  <HungPlate
                    series={series}
                    plate={block.plate}
                    sizes={upTo(block.width)}
                    priority={i === 0}
                  />
                </div>
              </div>
            )}
            {block.kind === "pair" && (
              <div
                className={`bleed grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-end gap-12 py-24 ${tintBg[series.tint]}`}
              >
                {block.plates.map((plate) => (
                  <HungPlate
                    key={plate.no}
                    series={series}
                    plate={plate}
                    sizes="(min-width: 1440px) 650px, (min-width: 720px) 50vw, 100vw"
                  />
                ))}
              </div>
            )}
            {block.kind === "full" && (
              <div className="-mx-(--page-gutter)">
                <HungPlate
                  series={series}
                  plate={block.plate}
                  sizes={upTo(1440)}
                  full
                />
              </div>
            )}
            {block.kind === "quote" && (
              <div>
                <blockquote
                  className="mx-auto max-w-[24em] text-center type-quote text-balance"
                  style={{ fontSize: "clamp(26px, 2.8vw, 38px)" }}
                >
                  {block.text}
                </blockquote>
              </div>
            )}
          </Reveal>
        ))}
      </div>

      <Link
        href={`/work/${next.slug}`}
        className="group mt-36 flex flex-wrap items-baseline justify-between gap-5 border-t border-line pt-8"
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

/** A plate on the wall: the photograph, linking to its lightbox, over a wall
 * label. Full-bleed plates are capped at the viewport's height. */
function HungPlate({
  series,
  plate,
  sizes,
  full = false,
  priority = false,
}: {
  series: Series;
  plate: Plate;
  sizes: string;
  full?: boolean;
  priority?: boolean;
}) {
  return (
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
          sizes={sizes}
          priority={priority}
          className={full ? "max-h-[92vh]" : ""}
        />
      </Link>
      <figcaption
        className={`flex flex-wrap gap-x-5 gap-y-1.5 type-label text-secondary ${full ? "px-(--page-gutter)" : ""}`}
      >
        <span className="text-primary">No. {plateNo(plate.no)}</span>
        <span>{plate.title}</span>
        <span>{plate.year}</span>
      </figcaption>
    </figure>
  );
}
