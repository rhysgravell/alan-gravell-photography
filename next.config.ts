import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages keep the trailing-slash addresses they had as a static site
  // (/work/low-water/), so existing links and the sitemap stay the same.
  trailingSlash: true,
};

export default nextConfig;
