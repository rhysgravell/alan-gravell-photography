"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Photo from "@/components/Photo";
import { type ImageSet, upTo } from "@/lib/format";

export type Slide = {
  href: string;
  image?: ImageSet;
  width: number;
  height: number;
  title: string;
  series: string;
  year: string;
};

const INTERVAL = 6000;

// The photographs at the top of Home, edge to edge, cross-fading slowly every
// six seconds. It holds still while the pointer or keyboard focus is on it,
// when the visitor pauses it, and for anyone who prefers reduced motion.
// Clicking a photograph or its caption opens it in the lightbox.
export default function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setStill(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const playing = !paused && !held && !still && slides.length > 1;

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(
      () => setCurrent((i) => (i + 1) % slides.length),
      INTERVAL,
    );
    return () => clearTimeout(timer);
  }, [playing, current, slides.length]);

  const count = slides.length;
  const slide = slides[current];
  const step = (by: number) => setCurrent((i) => (i + by + count) % count);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Selected photographs"
      className="-mx-(--page-gutter)"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false);
      }}
    >
      <div className="relative h-[min(80vh,860px)] min-h-[420px] bg-plate">
        {slides.map((s, i) => (
          <Link
            key={s.href}
            href={s.href}
            aria-roledescription="slide"
            aria-label={`${s.title}, ${s.series}, ${s.year}. ${i + 1} of ${count}`}
            aria-hidden={i !== current}
            inert={i !== current}
            className={`absolute inset-0 cursor-zoom-in transition-opacity duration-1600 ease-(--ease-gallery) ${
              i === current ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Photo
              fill
              image={s.image}
              width={s.width}
              height={s.height}
              alt=""
              sizes={upTo(1440)}
              placeholder={`Home slideshow ${i + 1} · wide landscape photograph`}
              priority={i === 0}
            />
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 px-(--page-gutter) pt-4.5 type-label">
        {/* Announced on each change only while paused; a rotating slideshow
            that spoke every six seconds would drown out everything else. */}
        <Link
          href={slide.href}
          aria-live={playing ? "off" : "polite"}
          className="flex flex-wrap gap-x-4 gap-y-1 transition-colors duration-(--dur-quick) hover:text-accent"
        >
          <span>{slide.title}</span>
          <span className="text-secondary">
            {slide.series} · {slide.year}
          </span>
        </Link>

        {count > 1 && (
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photograph"
              className="cursor-pointer p-1.5 transition-colors duration-(--dur-quick) hover:text-accent"
            >
              ←
            </button>
            <div className="flex gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.href}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Show photograph ${i + 1}`}
                  aria-current={i === current}
                  className="cursor-pointer py-3"
                >
                  <span
                    className={`block h-0.5 w-5.5 transition-colors duration-(--dur-fade) ease-(--ease-gallery) ${
                      i === current ? "bg-primary" : "bg-line"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-secondary">
              {pad(current + 1)} / {pad(count)}
            </span>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photograph"
              className="cursor-pointer p-1.5 transition-colors duration-(--dur-quick) hover:text-accent"
            >
              →
            </button>
            {!still && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="cursor-pointer p-1.5 text-secondary transition-colors duration-(--dur-quick) hover:text-primary"
              >
                {paused ? "Play" : "Pause"}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
