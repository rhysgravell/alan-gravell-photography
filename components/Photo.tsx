"use client";

import { useEffect, useRef, useState } from "react";
import { type ImageSet, srcSet } from "@/lib/format";

type PhotoProps = {
  /** The photograph's sizes. Without one, a labelled placeholder is hung. */
  image?: ImageSet;
  /** How wide the photograph shows, as an <img> `sizes` value, so the
   * browser fetches the smallest size that is still sharp. */
  sizes?: string;
  width: number;
  height: number;
  alt: string;
  /** Placeholder label, e.g. "Low Water · No. 01 · 3:2". */
  placeholder?: string;
  /**
   * The frame's aspect ratio when it differs from the photograph's, as for
   * series covers in a 4:5 frame. The photograph is contained, never cropped,
   * and sits on the frame's bottom edge like a print on a wall.
   */
  frame?: string;
  /**
   * Fill a positioned parent edge to edge instead, cropping to cover it. Only
   * for the Home slideshow; everywhere else the photograph is never cropped.
   */
  fill?: boolean;
  /** Load eagerly: the first photograph a page shows. */
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

// Photographs are never cropped, rounded, shadowed or overlaid. They fade in
// over --dur-fade once loaded, on a paper-2 ground that clears when they do.
export default function Photo({
  image,
  sizes = "100vw",
  width,
  height,
  alt,
  placeholder,
  frame,
  fill = false,
  priority = false,
  className = "",
  style,
}: PhotoProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // A cached image can finish loading before hydration attaches onLoad, in
  // which case the event never reaches React. Catch that here.
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, [image?.src]);

  return (
    <div
      className={`${fill ? "absolute inset-0" : "relative"} ${loaded ? "" : "bg-plate"} ${className}`}
      style={{
        aspectRatio: fill ? undefined : (frame ?? `${width} / ${height}`),
        ...style,
      }}
    >
      {image ? (
        <picture>
          <PhotoSources image={image} sizes={sizes} />
          <img
            ref={ref}
            src={fallback(image)}
            width={width}
            height={height}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 size-full ${fill ? "object-cover" : "object-contain object-bottom"} transition-opacity duration-(--dur-fade) ease-(--ease-gallery) ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </picture>
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex items-center justify-center p-4 text-center type-label text-secondary"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0 11px, var(--line) 11px 12px)",
          }}
        >
          <span aria-hidden className="bg-plate px-2 py-1">
            {placeholder}
          </span>
        </div>
      )}
    </div>
  );
}

/** AVIF first, then WebP; the browser takes the first it can show. */
function PhotoSources({ image, sizes }: { image: ImageSet; sizes: string }) {
  return (
    <>
      <source type="image/avif" srcSet={srcSet(image, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(image, "webp")} sizes={sizes} />
    </>
  );
}

/** For browsers without srcset: the middle size, as WebP. */
function fallback(image: ImageSet): string {
  const w = image.widths[Math.min(1, image.widths.length - 1)];
  return `${image.src}-${w}.webp`;
}

/**
 * Fetches a photograph ahead of time, at the size and format the browser
 * would pick for it with these sizes, without showing it. For the
 * lightbox's neighbouring plates.
 */
export function PreloadPhoto({ image, sizes }: { image: ImageSet; sizes: string }) {
  return (
    <picture hidden>
      <PhotoSources image={image} sizes={sizes} />
      <img src={fallback(image)} alt="" loading="eager" decoding="async" />
    </picture>
  );
}
