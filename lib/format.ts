import type { Plate, Tint } from "@/lib/series";

// Display helpers shared by server and client components. Kept apart from
// lib/series.ts, which reads the filesystem and so cannot reach the client.

/** Two-digit plate number: 3 → "03". */
export function plateNo(no: number): string {
  return String(no).padStart(2, "0");
}

/** The full wall-label line, in the order the content guidelines set:
 * "No. 04 · 2019 · Archival pigment print · 40 × 50 cm · Edition of 7 + 2 AP". */
export function plateMeta(plate: Plate): string {
  return [
    `No. ${plateNo(plate.no)}`,
    plate.year,
    plate.medium,
    plate.size,
    `Edition of ${plate.edition}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

/** Band and row backgrounds per series tint. Written out in full so Tailwind
 * can see the class names. */
export const tintBg: Record<Tint, string> = {
  sky: "bg-tint-sky",
  sage: "bg-tint-sage",
  sand: "bg-tint-sand",
  mist: "bg-tint-mist",
};

export function plateHref(seriesSlug: string, plate: Pick<Plate, "no">): string {
  return `/work/${seriesSlug}/${plate.no}`;
}

/** Simplest ratio for placeholder labels: 3000 × 2000 → "3:2". */
export function ratioLabel(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const d = gcd(width, height);
  return `${width / d}:${height / d}`;
}
