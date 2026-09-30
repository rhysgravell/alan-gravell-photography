import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A static site: every page, series and plate is generated at build time
  // from content/, and the out/ folder can be hosted anywhere.
  output: "export",
  // /work/low-water/ is served as /work/low-water/index.html, which is what
  // most static hosts expect.
  trailingSlash: true,
};

export default nextConfig;
