import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The CMS must never be indexed or advertised in search results.
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: "https://www.steamasala.com/sitemap.xml",
    host: "https://www.steamasala.com",
  };
}