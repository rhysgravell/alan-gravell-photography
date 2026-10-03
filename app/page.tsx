import type { Metadata } from "next";
import Link from "next/link";
import HeroSlideshow, { type Slide } from "@/components/HeroSlideshow";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { site } from "@/content/site";
import { plateHref, tintBg } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { getAllSeries, getSeries } from "@/lib/series";

// The first slide stands for the site in link previews.
export function generateMetadata(): Metadata {
  const first = site.home.slides[0];
  const plate = getSeries(first.series)?.plates[first.plate - 1];
  return pageMetadata({
    path: "/",
    image: plate?.image,
    imageAlt: plate && `${plate.title}, ${plate.year}`,
  });
}

export default function Home() {
  const series = getAllSeries();
  const { home } = site;

  // A typo here would otherwise leave a gap in the slideshow without a word.
  const slides: Slide[] = home.slides.map(({ series: slug, plate: no }) => {
    const s = getSeries(slug);
    const plate = s?.plates[no - 1];
    if (!s || !plate)
      throw new Error(
        `content/site.ts: slide plate ${no} of "${slug}" does not exist`,
      );
    return {
      href: plateHref(s.slug, plate),
      image: plate.image,
      width: plate.width,
      height: plate.height,
      title: plate.title,
      series: s.title,
      year: plate.year,
    };
  });

  return (
    <div>
      {/* The page's heading for screen readers; sighted visitors have the
          name in the header and the photographs speak for themselves. */}
      <h1 className="sr-only">{site.name}</h1>

      <HeroSlideshow slides={slides} />

      <Reveal className="mt-36 grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-12">
        <h2 className="type-label text-secondary">{home.label}</h2>
        {/* Inline, as type-quote sets the font shorthand. */}
        <p
          className="max-w-[20em] type-quote text-pretty"
          style={{ fontSize: "clamp(28px, 3.2vw, 44px)" }}
        >
          {home.quote}
        </p>
      </Reveal>

      <section className="mt-36" aria-labelledby="series-heading">
        <div className="flex items-baseline justify-between border-b border-line pb-3.5 type-label text-secondary">
          <h2 id="series-heading">Selected series</h2>
          <Link href="/work" className="link pb-0.5 text-primary">
            Index →
          </Link>
        </div>
        {/* Alternate series hang the other way round on their own tint. */}
        <ul>
          {series.map((s, i) => (
            <li key={s.slug}>
              <Reveal>
                <Link
                  href={`/work/${s.slug}`}
                  className={`group bleed flex flex-wrap items-center gap-x-16 gap-y-12 py-24 ${
                    i % 2 ? `flex-row-reverse ${tintBg[s.tint]}` : ""
                  }`}
                >
                  <Photo
                    image={s.cover.image}
                    width={s.cover.width}
                    height={s.cover.height}
                    frame="3 / 2"
                    sizes="(min-width: 1440px) 860px, (min-width: 960px) 60vw, 100vw"
                    alt={`${s.cover.title}, from the series ${s.title}`}
                    placeholder="Series cover · landscape 3:2"
                    className="flex-[1_1_560px]"
                  />
                  <div className="flex max-w-[420px] flex-[1_1_280px] flex-col gap-4.5">
                    <span className="type-label text-secondary">
                      Series {s.roman} · {s.years}
                    </span>
                    <h3 className="type-display-l transition-colors duration-(--dur-quick) group-hover:text-accent">
                      {s.title}
                    </h3>
                    <p className="type-body text-pretty text-secondary">
                      {s.statement}
                    </p>
                    <span className="self-start border-b border-current pb-0.75 type-label-l">
                      View {s.plates.length} photographs →
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <Reveal className="my-24 flex flex-wrap items-end justify-between gap-8 border-t border-line pt-8">
        <div className="flex flex-col gap-3">
          <h2 className="type-label text-secondary">{home.prints.label}</h2>
          <p className="max-w-[18em] type-display-m">{home.prints.text}</p>
        </div>
        <Link
          href="/contact"
          className="border border-line-strong bg-primary px-7 py-4 type-label-l text-page transition-colors duration-(--dur-quick) hover:bg-transparent hover:text-primary"
        >
          Enquire
        </Link>
      </Reveal>
    </div>
  );
}
