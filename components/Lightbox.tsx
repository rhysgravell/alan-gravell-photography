"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Photo, { PreloadPhoto } from "@/components/Photo";
import { plateHref, plateMeta, plateNo } from "@/lib/format";
import type { Plate, Series } from "@/lib/series";

type LightboxProps = { series: Series; plate: Plate };

// A solid dark ground, no blur. The photograph fills the available height
// inside a mat, at its own ratio. Esc closes; the arrow keys step through the
// series and wrap. Stepping replaces history so Back leaves the lightbox
// rather than walking back through every plate viewed.
export default function Lightbox({ series, plate }: LightboxProps) {
  const router = useRouter();
  const dialog = useRef<HTMLDivElement>(null);

  const count = series.plates.length;
  const index = plate.no - 1;
  const prev = series.plates[(index - 1 + count) % count];
  const next = series.plates[(index + 1) % count];
  const seriesHref = `/work/${series.slug}`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Leave browser shortcuts alone: Alt+← is Back, Cmd+← is Back on Mac.
      if (e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.key === "Escape") router.push(seriesHref, { scroll: false });
      if (e.key === "ArrowLeft")
        router.replace(plateHref(series.slug, prev), { scroll: false });
      if (e.key === "ArrowRight")
        router.replace(plateHref(series.slug, next), { scroll: false });
      if (e.key === "Tab") trapFocus(e, dialog.current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, series.slug, seriesHref, prev, next]);

  // The plate on screen, for handing focus back when the lightbox closes.
  const shown = useRef(plate.no);
  useEffect(() => {
    shown.current = plate.no;
  }, [plate.no]);

  // Hold the page still behind the lightbox and move focus into it. On close,
  // return focus to the plate's link in the series, so keyboard users land
  // where they left off rather than at the top of the document.
  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      document
        .querySelector<HTMLElement>(`[data-plate="${shown.current}"]`)
        ?.focus({ preventScroll: true });
    };
  }, []);

  const ratio = plate.width / plate.height;

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={`${plate.title}, ${series.title}`}
      tabIndex={-1}
      className="fixed inset-0 z-50 grid grid-rows-[auto_minmax(0,1fr)_auto] bg-lightbox px-(--page-gutter) py-6 text-on-dark outline-none"
    >
      <div className="flex items-center justify-between type-label text-on-dark-secondary">
        <span>
          {series.title} · {plate.no} / {count}
        </span>
        <Link
          href={seriesHref}
          scroll={false}
          className="p-2 text-on-dark transition-colors duration-(--dur-quick) hover:text-accent"
        >
          Close ×
        </Link>
      </div>

      {/* A size container, so the photograph can take whichever of the
          height or the width runs out first while keeping its ratio. The
          gallery theme darkens its loading ground and placeholder to suit. */}
      <div
        data-theme="gallery"
        className="flex min-h-0 items-center justify-center py-(--mat)"
      >
        <div
          className="flex size-full items-center justify-center"
          style={{ containerType: "size" }}
        >
          <Photo
            key={plate.no}
            image={plate.image}
            width={plate.width}
            height={plate.height}
            alt={`${plate.title}, ${plate.year}`}
            placeholder={`${series.title} · No. ${plateNo(plate.no)}`}
            sizes={lightboxSizes(plate)}
            priority
            style={{ width: `min(100cqw, ${ratio} * 100cqh)` }}
          />
          {/* Fetch the neighbours ahead of time, so stepping shows the next
              photograph at once rather than an empty mat. */}
          {[...new Set([prev, next])].map(
            (p) =>
              p !== plate &&
              p.image && (
                <PreloadPhoto key={p.no} image={p.image} sizes={lightboxSizes(p)} />
              ),
          )}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-5 type-label">
        <Link
          href={plateHref(series.slug, prev)}
          replace
          scroll={false}
          className="justify-self-start py-2 transition-colors duration-(--dur-quick) hover:text-accent"
        >
          ← Prev
        </Link>
        {/* Live, so screen readers hear each plate as the arrows step on. */}
        <div
          aria-live="polite"
          className="flex flex-col items-center gap-1.5 text-center"
        >
          <span className="type-display-s normal-case">{plate.title}</span>
          <span className="text-on-dark-secondary">{plateMeta(plate)}</span>
        </div>
        <Link
          href={plateHref(series.slug, next)}
          replace
          scroll={false}
          className="justify-self-end py-2 transition-colors duration-(--dur-quick) hover:text-accent"
        >
          Next →
        </Link>
      </div>
    </div>
  );
}

/** The photograph fills the height when the window is wider than it, in
 * proportion, and the width otherwise. */
function lightboxSizes({ width, height }: Plate): string {
  return `(min-aspect-ratio: ${width}/${height}) ${Math.round((width / height) * 100)}vh, 100vw`;
}

/** Keep Tab and Shift+Tab cycling through the lightbox's own controls. */
function trapFocus(e: KeyboardEvent, root: HTMLElement | null) {
  if (!root) return;
  const focusable = root.querySelectorAll<HTMLElement>("a[href], button");
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (e.shiftKey && (active === first || active === root)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
}
