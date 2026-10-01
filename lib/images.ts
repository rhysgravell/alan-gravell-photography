import fs from "node:fs";
import path from "node:path";
import type { ImageSet } from "@/lib/format";

// Looks up the responsive sizes that scripts/images.mjs made from photos/.
// Server-only: it reads the manifest from disk at build time.

const MANIFEST = path.join(process.cwd(), ".images.json");

let cache: Record<string, ImageSet> | undefined;

function manifest(): Record<string, ImageSet> {
  // Re-read in development, where `npm run images` can run alongside the
  // dev server and add photographs to it.
  if (cache && process.env.NODE_ENV === "production") return cache;
  try {
    cache = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  } catch {
    cache = {};
  }
  return cache!;
}

/** The sizes made from photos/<file>. Fails the build, naming usedIn, if the
 * file is missing or the image script has not run over it. */
export function getImage(file: string, usedIn: string): ImageSet {
  const image = manifest()[file];
  if (!image) {
    const exists = fs.existsSync(path.join(process.cwd(), "photos", file));
    throw new Error(
      exists
        ? `${usedIn}: photos/${file} has not been resized yet; run npm run images`
        : `${usedIn}: "image" photos/${file} does not exist`,
    );
  }
  return image;
}
