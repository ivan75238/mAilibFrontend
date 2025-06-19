declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache: string[] = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/css/main.chunk.css',
];

self.addEventListener('install', (event: InstallEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});