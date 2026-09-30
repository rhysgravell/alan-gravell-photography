import Link from "next/link";
import Photo from "@/components/Photo";
import { site } from "@/content/site";
import { plateHref, plateNo, ratioLabel } from "@/lib/format";
import { getAllSeries, getSeries } from "@/lib/series";

export default function Home() {
  const series = getAllSeries();
  const featuredSeries = getSeries(site.featured.series) ?? series[0];
  const featured =
    featuredSeries.plates[site.featured.plate - 1] ?? featuredSeries.plates[0];

  return (
    <div className="pt-36 pb-24">
      {/* Featured photograph, hung right of centre with its wall label. */}
      <section className="flex flex-wrap items-end gap-x-12 gap-y-8">
        <Link
          href={plateHref(featuredSeries.slug, featured)}
          className="ml-auto max-w-[980px] flex-[1_1_520px] cursor-zoom-in"
        >
          <Photo
            image={featured.image}
            width={featured.width}
            height={featured.height}
            alt={`${featured.title}, from the series ${featuredSeries.title}`}
            placeholder={`Featured photograph · ${ratioLabel(featured.width, featured.height)}`}
            priority
          />
        </Link>
        <div className="flex flex-[0_1_220px] flex-col gap-1.5 border-t border-line pt-3">
          <span className="type-label">No. {plateNo(featured.no)}</span>
          <span className="type-display-s">{featured.title}</span>
          <span className="type-label text-secondary">
            {featured.year} · {featured.medium}
          </span>
        </div>
      </section>

      {/* Quote band: full bleed, sky tint. */}
      <section className="bleed mt-36 grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-12 bg-tint-sky py-24">
        <h2 className="type-label text-secondary">{site.home.label}</h2>
        <p className="max-w-[22em] type-quote text-pretty">{site.home.quote}</p>
      </section>

      <section className="mt-36" aria-labelledby="series-heading">
        <div className="flex items-baseline justify-between border-b border-line pb-3.5 type-label text-secondary">
          <h2 id="series-heading">Series</h2>
          <Link href="/work" className="link pb-0.5 text-primary">
            All work →
          </Link>
        </div>
        <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-x-8 gap-y-12">
          {series.map((s) => (
            <li key={s.slug}>
              <Link href={`/work/${s.slug}`} className="group flex flex-col gap-3.5">
                <Photo
                  image={s.cover.image}
                  width={s.cover.width}
                  height={s.cover.height}
                  frame="4 / 5"
                  alt={`${s.cover.title}, cover of the series ${s.title}`}
                  placeholder="Series cover · 4:5"
                />
                <span className="flex items-baseline justify-between gap-3">
                  <span className="type-display-s transition-colors duration-(--dur-quick) group-hover:text-accent">
                    {s.title}
                  </span>
                  <span className="type-label text-secondary">{s.roman}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
