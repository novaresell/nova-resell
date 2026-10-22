// Nova Resell – notifications + ouverture hors ligne (réseau d'abord : l'appli reste toujours à jour, la copie ne sert que sans réseau)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
const SHELL = 'nova-shell-v1';
self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || /\.(zip|exe|mp4|json)$/i.test(url.pathname)) return;
  e.respondWith(fetch(req).then((res) => { if (res.ok) { const c = res.clone(); caches.open(SHELL).then((k) => k.put(req, c)).catch(() => {}); } return res; })
    .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./', { ignoreSearch: true }))));
});
self.addEventListener('push', (e) => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch { d = { title: 'Nova Resell', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Nova Resell', { body: d.body || '', tag: d.tag || undefined, icon: 'icon-192.png', badge: 'icon-192.png', data: { url: d.url || './' } }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (all.length) return all[0].focus();
    return self.clients.openWindow(e.notification.data?.url || './');
  })());
});
