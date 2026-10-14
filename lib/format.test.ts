import { describe, expect, it } from "vitest";
import { plateHref, plateMeta, plateNo, ratioLabel, srcSet, upTo, type ImageSet } from "./format";
import type { Plate } from "./series";

const image: ImageSet = {
  src: "/img/a",
  width: 3000,
  height: 2000,
  widths: [800, 1600],
  preview: { src: "/img/a-preview.jpg", width: 1200, height: 800 },
};

const plate: Plate = {
  no: 4,
  title: "Untitled",
  year: "2019",
  width: 4000,
  height: 5000,
  medium: "Archival pigment print",
  size: "40 × 50 cm",
  edition: "7 + 2 AP",
};

describe("srcSet", () => {
  it("lists each width in the given format", () => {
    expect(srcSet(image, "avif")).toBe("/img/a-800.avif 800w, /img/a-1600.avif 1600w");
    expect(srcSet(image, "webp")).toBe("/img/a-800.webp 800w, /img/a-1600.webp 1600w");
  });
});

describe("upTo", () => {
  it("caps the size at maxWidth and fills the viewport below it", () => {
    expect(upTo(1200)).toBe("(min-width: 1200px) 1200px, 100vw");
  });
});

describe("plateNo", () => {
  it("pads to two digits", () => {
    expect([plateNo(3), plateNo(12), plateNo(104)]).toEqual(["03", "12", "104"]);
  });
});

describe("plateMeta", () => {
  it("writes the wall label in the content guidelines' order", () => {
    expect(plateMeta(plate)).toBe(
      "No. 04 · 2019 · Archival pigment print · 40 × 50 cm · Edition of 7 + 2 AP",
    );
  });

  it("leaves out the print size when there is none", () => {
    expect(plateMeta({ ...plate, size: undefined })).toBe(
      "No. 04 · 2019 · Archival pigment print · Edition of 7 + 2 AP",
    );
  });
});

describe("plateHref", () => {
  it("links to the plate by its number", () => {
    expect(plateHref("coastal", plate)).toBe("/work/coastal/4");
  });
});

describe("ratioLabel", () => {
  it("reduces to the simplest ratio", () => {
    expect([ratioLabel(3000, 2000), ratioLabel(4000, 5000), ratioLabel(1000, 1000)]).toEqual([
      "3:2",
      "4:5",
      "1:1",
    ]);
  });
});
