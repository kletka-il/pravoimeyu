/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // standalone-сборка — чтобы приложение запускалось на любом Node-хостинге (Beget и т.п.), не только на Vercel
  output: "standalone",
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
  images: {
    // без оптимизатора Vercel: аватары хранятся base64 в БД, остальные картинки локальные
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
      {
        source: "/manifest.json",
        headers: [{ key: "Content-Type", value: "application/manifest+json" }],
      },
    ];
  },
};

export default nextConfig;
