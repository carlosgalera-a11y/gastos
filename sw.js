/**
 * Service worker de Gastos · Piso Horta — cascarón mínimo para que la PWA
 * abra al instante y funcione la instalación. Los DATOS nunca se cachean
 * (van a Supabase con sesión); solo la página y las fuentes.
 * Sube CACHE_VERSION en cada cambio de index.html.
 */
const CACHE_VERSION = 'gastos-v4';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_VERSION).then(c => c.addAll(['./', './index.html'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Página: red primero (para coger versiones nuevas), caché si no hay red.
  if (e.request.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    e.respondWith(
      fetch(e.request).then(r => {
        // Solo se cachea una respuesta buena: un error o una redirección
        // guardados aquí dejarían la PWA rota para siempre.
        if (r.ok && !r.redirected) {
          const copia = r.clone();
          caches.open(CACHE_VERSION).then(c => c.put('./index.html', copia));
        }
        return r;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }
  // Fuentes e iconos: caché primero (no cambian).
  if (/fonts\.(googleapis|gstatic)\.com/.test(url.host) || /\.(png|webmanifest)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
        // Un 404/503 cacheado en caché-primero se serviría para siempre.
        if (r.ok) {
          const copia = r.clone();
          caches.open(CACHE_VERSION).then(c => c.put(e.request, copia));
        }
        return r;
      }))
    );
  }
  // El resto (Supabase, esm.sh) va SIEMPRE a la red.
});
