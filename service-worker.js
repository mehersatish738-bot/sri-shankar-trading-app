const CACHE_NAME = "sri-shankar-trading-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event) {
  const request = event.request;
  const url = new URL(request.url);

  // Do not cache Google Apps Script traffic.
  if (url.hostname.indexOf("script.google.com") !== -1) {
    return;
  }

  // Cache only our own PWA shell.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(function(cached) {
        return cached || fetch(request);
      })
    );
  }
});
