// YOUBARD KDO — réseau d'abord (pour que les nouveaux cadeaux apparaissent tout de suite),
// copie en cache seulement pour dépanner hors connexion.
const CACHE = "kdo-v1";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (new URL(req.url).pathname.includes("/coffre/")) return;
  e.respondWith(
    fetch(req, {cache: "no-store"}).then(rep => {
      if (rep.ok) { const copie = rep.clone(); caches.open(CACHE).then(c => c.put(req, copie)); }
      return rep;
    }).catch(() => caches.match(req).then(r => r || caches.match("./")))
  );
});
