import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/verify", "/offline"],
      },
    ],
    sitemap: "https://pravaimeu.ru/sitemap.xml",
    host: "https://pravaimeu.ru",
  };
}
