// YOUBARD KDO — toujours la version en ligne d'abord ; la copie en cache ne sert qu'hors connexion.
const CACHE = "kdo-v2";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);   // jette les anciennes copies
  await self.clients.claim();
  for (const c of await self.clients.matchAll({type: "window"})) {                // recharge les pages déjà ouvertes
    try { await c.navigate(c.url); } catch (err) {}
  }
})()));
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || url.pathname.includes("/coffre/")) return;
  e.respondWith(
    fetch(req.url, {cache: "no-store", credentials: "same-origin"}).then(rep => {
      if (rep.ok && !url.search) { const copie = rep.clone(); caches.open(CACHE).then(c => c.put(req.url, copie)); }
      return rep;
    }).catch(() => caches.match(req.url).then(r => r || caches.match(new URL("./", self.registration.scope).href)))
  );
});
