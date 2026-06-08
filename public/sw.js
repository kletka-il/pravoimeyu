const CACHE_NAME = "pravoimeyu-v4";
const STATIC_PATTERN = /\/_next\/static\//;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.add("/offline"))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  // Статика Next.js (_next/static) — cache-first, долгоживущая
  if (STATIC_PATTERN.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const fresh = await fetch(request);
        if (fresh.ok) cache.put(request, fresh.clone());
        return fresh;
      })
    );
    return;
  }

  // Всё остальное (HTML, API) — только сеть, без кеша.
  // Кешировать HTML Next.js App Router нельзя: ломает RSC-навигацию на мобильных.
  event.respondWith(
    fetch(request).catch(async () => {
      if (request.mode === "navigate") {
        const offline = await caches.match("/offline");
        return offline ?? new Response("Нет подключения", { status: 503 });
      }
      return new Response("", { status: 503 });
    })
  );
});
