"use client";

import Link from "next/link";
import { useState } from "react";
import Photo from "@/components/Photo";
import type { Series, Tint } from "@/lib/series";

// While the list is hovered or has keyboard focus, the current row takes its
// series' tint and the others fade to 35%. At rest every row is at full
// strength, so the list stays readable on touch screens, which never hover.
// The sticky preview shows the current row's cover; it starts on the first.
const currentTint: Record<Tint, string> = {
  sky: "group-hover/list:bg-tint-sky group-focus-within/list:bg-tint-sky",
  sage: "group-hover/list:bg-tint-sage group-focus-within/list:bg-tint-sage",
  sand: "group-hover/list:bg-tint-sand group-focus-within/list:bg-tint-sand",
  mist: "group-hover/list:bg-tint-mist group-focus-within/list:bg-tint-mist",
};
const dimmed = "group-hover/list:opacity-35 group-focus-within/list:opacity-35";
export default function WorkIndex({ series }: { series: Series[] }) {
  const [current, setCurrent] = useState(0);
  const preview = series[current];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-16 pt-16 pb-24">
      <section aria-labelledby="index-heading">
        <h1
          id="index-heading"
          className="border-b border-line pb-3.5 type-label text-secondary"
        >
          Index of series
        </h1>
        <ul className="group/list">
          {series.map((s, i) => (
            <li key={s.slug}>
              <Link
                href={`/work/${s.slug}`}
                onMouseEnter={() => setCurrent(i)}
                onFocus={() => setCurrent(i)}
                className={`-mx-4 grid grid-cols-[48px_minmax(0,1fr)_auto] items-baseline gap-5 border-b border-line px-4 py-7 transition-[opacity,background-color] duration-400 ease-(--ease-gallery) ${
                  i === current ? currentTint[s.tint] : dimmed
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
          sizes="(min-width: 1440px) 620px, (min-width: 1000px) 45vw, 100vw"
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
