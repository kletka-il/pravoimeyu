const CACHE_NAME = "pravoimeyu-v3";

self.addEventListener("install", (event) => {
  // Кешируем только статичную offline-страницу.
  // Динамические страницы (/knowledge, /situations и др.) не кешируем при установке —
  // они грузятся 1-2с каждая, и addAll падает если хоть одна не ответит,
  // что на Android Chrome ломает весь SW и сайт перестаёт открываться.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add("/offline")).then(() => self.skipWaiting())
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
