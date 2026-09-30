import fs from "node:fs";
import path from "node:path";

// Series live as one JSON file each in content/series/, named by slug, so new
// work is added by dropping in a file. They are read at build time only: the
// site is a static export, so pages call these from Server Components and
// hand plain data down to anything interactive.

export type Tint = "sky" | "sage" | "sand" | "mist";

export type Plate = {
  /** 1-based position in the series; shown as "No. 01". */
  no: number;
  title: string;
  year: string;
  /** Path under /public, e.g. "/photos/low-water/01.jpg". Absent until the
   * client supplies the photograph; a placeholder is shown instead. */
  image?: string;
  /** Pixel size of the photograph. Sets the aspect ratio, which is never
   * cropped, so it is required even before the image arrives. */
  width: number;
  height: number;
  medium: string;
  /** Print size, e.g. "40 × 50 cm". Optional. */
  size?: string;
  edition: string;
};

export type Series = {
  slug: string;
  /** Roman numeral from the series' order: I, II, III. */
  roman: string;
  order: number;
  title: string;
  /** En-dash range, e.g. "2016–2021". */
  years: string;
  tint: Tint;
  statement: string;
  /** The plate used as the series cover on Home and the Work index. */
  cover: Plate;
  plates: Plate[];
};

type SeriesFile = {
  order: number;
  title: string;
  years: string;
  tint: Tint;
  statement: string;
  /** Plate number to use as the cover. Defaults to the first plate. */
  cover?: number;
  plates: (Omit<Plate, "no" | "medium" | "edition"> &
    Partial<Pick<Plate, "medium" | "edition">>)[];
};

const SERIES_DIR = path.join(process.cwd(), "content/series");

const DEFAULT_MEDIUM = "Archival pigment print";
const DEFAULT_EDITION = "7 + 2 AP";

function toRoman(n: number): string {
  const numerals: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
    [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [value, numeral] of numerals) {
    while (n >= value) {
      out += numeral;
      n -= value;
    }
  }
  return out;
}

let cache: Series[] | undefined;

export function getAllSeries(): Series[] {
  if (cache) return cache;

  const files = fs.readdirSync(SERIES_DIR).filter((f) => f.endsWith(".json"));
  const raw = files.map((file) => {
    const data = JSON.parse(
      fs.readFileSync(path.join(SERIES_DIR, file), "utf8"),
    ) as SeriesFile;
    return { slug: path.basename(file, ".json"), data };
  });

  // Numerals follow the sorted position, not the raw order value, so a gap
  // left by removing a series never produces a skipped numeral.
  cache = raw
    .sort((a, b) => a.data.order - b.data.order)
    .map(({ slug, data }, index) => {
      const plates: Plate[] = data.plates.map((plate, i) => ({
        ...plate,
        no: i + 1,
        medium: plate.medium ?? DEFAULT_MEDIUM,
        edition: plate.edition ?? DEFAULT_EDITION,
      }));
      return {
        slug,
        roman: toRoman(index + 1),
        order: data.order,
        title: data.title,
        years: data.years,
        tint: data.tint,
        statement: data.statement,
        cover: plates[(data.cover ?? 1) - 1] ?? plates[0],
        plates,
      };
    });

  return cache;
}

export function getSeries(slug: string): Series | undefined {
  return getAllSeries().find((s) => s.slug === slug);
}

/** The series after this one, wrapping from the last back to the first. */
export function getNextSeries(slug: string): Series {
  const all = getAllSeries();
  const i = all.findIndex((s) => s.slug === slug);
  return all[(i + 1) % all.length];
}
