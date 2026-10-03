import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

// Written to out/robots.txt at build: everything may be indexed, and the
// sitemap is named once there is a domain for it.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: siteUrl ? `${siteUrl}/sitemap.xml` : undefined,
  };
}
