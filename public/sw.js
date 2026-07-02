const CACHE_NAME = "pravoimeyu-v6";
const STATIC_PATTERN = /\/_next\/static\//;

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
      // Перезагружаем все вкладки, чтобы они отвязались от старой версии SW,
      // которая могла перехватывать HTML и вешать загрузку на мобильных.
      const wins = await self.clients.matchAll({ type: "window" });
      await Promise.all(
        wins.map((c) => {
          try {
            return c.navigate(c.url);
          } catch (e) {
            return Promise.resolve();
          }
        })
      );
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  // Навигационные запросы (HTML-страницы) — не перехватываем.
  // Next.js App Router стримит RSC; SW-обёртка над navigate-запросом
  // вызывает зависание на ряде мобильных браузеров (Samsung Internet, Sber).
  if (request.mode === "navigate") return;

  // Только /_next/static/ — кешируем, всё остальное не трогаем.
  if (!STATIC_PATTERN.test(url.pathname)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;
      const fresh = await fetch(request);
      if (fresh.ok) cache.put(request, fresh.clone());
      return fresh;
    })
  );
});
