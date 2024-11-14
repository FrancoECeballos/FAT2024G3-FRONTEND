const CACHE_NAME = 'django-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/static/pwa/manifest.json',
  '/static/pwa/img/icons/prontalogo_192.png',
  '/static/pwa/img/icons/prontalogo_512.png'
];

// Instalación del Service Worker
self.addEventListener('install', function(event) {
    // Precachear los recursos
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          console.log('Archivos cacheados exitosamente');
          return cache.addAll(urlsToCache);
        })
    );
  });
  
  // Activación del Service Worker
  self.addEventListener('activate', function(event) {
    // Limpieza de cachés antiguos
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName !== CACHE_NAME) {
              console.log('Eliminando caché antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  
  // Intercepción de solicitudes de red
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Si encontramos el recurso en caché, lo devolvemos
          if (response) {
            return response;
          }
          // Si no está en caché, lo pedimos de la red
          return fetch(event.request);
        })
    );
  });