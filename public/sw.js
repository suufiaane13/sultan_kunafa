/**
 * Service Worker — Sultan Kunafa
 * Cache les assets pour accélérer les visites et permettre un usage hors-ligne basique.
 * Stratégie : document (HTML) = network-first ; images/CSS/JS = cache-first après 1ère visite.
 */

const CACHE_NAME = "sultan-kunafa-v3";

/** Extensions / types à mettre en cache long terme (cache-first après première visite). */
const STATIC_TYPES = /\.(png|jpe?g|webp|gif|svg|ico|woff2?|ttf|css|js|webmanifest)(\?.*)?$/i;

/** Réponses à toujours aller chercher en réseau en priorité (puis mettre en cache). */
const NETWORK_FIRST_PATHS = ["/", "/index.html"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const pathname = url.pathname;
  const isDocument = NETWORK_FIRST_PATHS.some((p) => pathname === p || pathname === p + "/");
  const isStatic = STATIC_TYPES.test(pathname);

  if (isDocument) {
    // Page principale : réseau d'abord, cache en secours (offline)
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
    );
    return;
  }

  if (isStatic) {
    // Images, JS, CSS, fonts : cache d'abord, puis réseau (et mise en cache)
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Autres (ex. autres pages SPA) : réseau puis cache en secours
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});
