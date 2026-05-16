const CACHE_NAME = "pravoimeyu-v2";

// Главная "/" намеренно убрана: она всегда динамическая (force-dynamic),
// кешировать её в SW нельзя — иначе браузер отдаёт «мёртвый» HTML без
// Next.js hydration и клики по <Link> вызывают "can't find server".
const STATIC_ASSETS = [
  "/knowledge",
  "/situations",
  "/search",
  "/wins",
  "/offline",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Не кешируем: POST/PUT/DELETE, API, авторизацию, дашборд
  if (
    request.method !== "GET" ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/register") ||
    url.pathname.startsWith("/verify")
  ) {
    return;
  }

  // Главная "/" — только сеть, без кеша (dynamic page, Next.js RSC навигация)
  if (url.pathname === "/") {
    event.respondWith(
      fetch(request).catch(async () => {
        const offlinePage = await caches.match("/offline");
        return offlinePage ?? new Response("Нет подключения к интернету", { status: 503 });
      })
    );
    return;
  }

  // Статьи базы знаний: cache-first (читаются повторно, редко меняются)
  if (url.pathname.startsWith("/knowledge/")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const fresh = await fetch(request);
          if (fresh.ok) cache.put(request, fresh.clone());
          return fresh;
        } catch {
          return caches.match("/offline") ?? new Response("Нет подключения к интернету", { status: 503 });
        }
      })
    );
    return;
  }

  // Всё остальное: network-first, кеш как запасной вариант
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        const offlinePage = await caches.match("/offline");
        return offlinePage ?? new Response("Нет подключения к интернету", { status: 503 });
      })
  );
});
