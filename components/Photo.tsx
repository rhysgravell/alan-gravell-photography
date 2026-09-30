"use client";

import { useEffect, useRef, useState } from "react";

type PhotoProps = {
  /** Path under /public. Without one, a labelled placeholder is hung. */
  image?: string;
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
  /** Load eagerly: the first photograph a page shows. */
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

// Photographs are never cropped, rounded, shadowed or overlaid. They fade in
// over --dur-fade once loaded, on a paper-2 ground that clears when they do.
export default function Photo({
  image,
  width,
  height,
  alt,
  placeholder,
  frame,
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
  }, [image]);

  return (
    <div
      className={`relative ${loaded ? "" : "bg-plate"} ${className}`}
      style={{ aspectRatio: frame ?? `${width} / ${height}`, ...style }}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- static export; see README on image sizes
        <img
          ref={ref}
          src={image}
          width={width}
          height={height}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 size-full object-contain object-bottom transition-opacity duration-(--dur-fade) ease-(--ease-gallery) ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
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
