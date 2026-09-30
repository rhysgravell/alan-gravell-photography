"use client";

import Link from "next/link";
import { useState } from "react";
import Photo from "@/components/Photo";
import { tintBg } from "@/lib/format";
import type { Series } from "@/lib/series";

// The index of series. One row is always the current one: it takes its
// series' tint, the others fade to 35%, and the sticky preview beside the
// list shows its cover. Hover or keyboard focus moves it; it starts on the
// first series.
export default function WorkIndex({ series }: { series: Series[] }) {
  const [current, setCurrent] = useState(0);
  const preview = series[current];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-16 py-24">
      <section aria-labelledby="index-heading">
        <h1
          id="index-heading"
          className="border-b border-line pb-3.5 type-label text-secondary"
        >
          Index of series
        </h1>
        <ul>
          {series.map((s, i) => (
            <li key={s.slug}>
              <Link
                href={`/work/${s.slug}`}
                onMouseEnter={() => setCurrent(i)}
                onFocus={() => setCurrent(i)}
                className={`-mx-4 grid grid-cols-[48px_minmax(0,1fr)_auto] items-baseline gap-5 border-b border-line px-4 py-7 transition-[opacity,background-color] duration-400 ease-(--ease-gallery) ${
                  i === current ? tintBg[s.tint] : "opacity-35"
                }`}
              >
                <span className="type-label text-secondary">{s.roman}</span>
                <span className="type-display-l">{s.title}</span>
                <span className="flex flex-col items-end gap-1 type-label text-secondary">
                  <span>{s.years}</span>
                  <span>{s.plates.length} plates</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <figure className="sticky top-10 flex flex-col gap-3.5">
        <Photo
          key={preview.slug}
          image={preview.cover.image}
          width={preview.cover.width}
          height={preview.cover.height}
          frame="4 / 5"
          alt={`${preview.cover.title}, cover of the series ${preview.title}`}
          placeholder="Series cover · 4:5"
          className="fade-in"
        />
        <figcaption className="type-label text-secondary">
          {preview.roman} · {preview.title}
        </figcaption>
      </figure>
    </div>
  );
}
