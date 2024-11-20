// service-worker.js
const cacheName = 'braille-converter-v1';
const filesToCache = [
  '/',
  'index.html',
  'app.css',
  'app.js',
  'manifest.json',
  'path/to/icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
