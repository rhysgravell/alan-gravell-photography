// Site-wide copy and settings. Everything here except the name is placeholder
// from the design system; the client will supply the real text.

export const site = {
  name: "Alan Gravell",
  description:
    "Fine-art photographs of landscapes, buildings and nature by Alan Gravell.",
  email: "studio@example.com",
  /** Leave empty to show "Instagram" in the footer without a link. */
  instagram: "",

  home: {
    /** The slideshow at the top of Home, in order. It fills a wide frame
     * edge to edge, so choose landscape photographs: others are cropped. */
    slides: [
      { series: "low-water", plate: 1 },
      { series: "winter-orchard", plate: 2 },
      { series: "standing-buildings", plate: 4 },
      { series: "low-water", plate: 5 },
      { series: "salt-roads", plate: 4 },
    ],
    label: "Landscapes, buildings & nature · 1986–2026",
    quote:
      "I photograph the places I keep returning to, and wait for the light to finish its sentence.",
    prints: {
      label: "Prints",
      text: "Every photograph is available as a signed print, in an edition of seven.",
    },
  },

  about: {
    portrait: {
      /** Path under photos/, e.g. "about/portrait.jpg". The width and
       * height shape the placeholder until there is one. */
      image: undefined as string | undefined,
      width: 2400,
      height: 3000,
      caption: "In the studio, 2024",
    },
    bio: [
      "I have been photographing for forty years, almost always on film and almost always close to home. The work is slow: the same shoreline, the same orchard, the same buildings, visited again and again until they begin to show me something new.",
      "Every print is made by hand, in small editions, on archival cotton paper.",
    ],
    exhibitions: [
      { year: "2025", text: "Low Water — solo exhibition, Harbour Gallery" },
      { year: "2022", text: "Group show: Tidelines, Regional Arts Centre" },
      { year: "2015", text: "Winter Orchard — solo exhibition, The Print Room" },
      { year: "2009", text: "Standing Buildings — book and exhibition" },
    ],
  },

  contact: {
    editions:
      "All photographs are available as archival pigment prints, printed and signed by hand in editions of seven. I also welcome enquiries about commissions and exhibitions.",
    visits: "Studio visits by appointment",
    topics: ["Print", "Commission", "Exhibition", "Other"],
  },
};
