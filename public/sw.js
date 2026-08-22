/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const CACHE_NAME = "gbc-cache-v7-live";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/assest/gbc-logo.png"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Fallback if some assets are missing during build dev
      });
    })
  );
  self.skipWaiting();
});

// Activate Event - purge any previous stale caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  // STRICT RULE: Never intercept or cache API endpoints or dynamic backend routes
  const url = new URL(event.request.url);
  if (
    event.request.method !== "GET" ||
    !event.request.url.startsWith(self.location.origin) ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/backend/") ||
    url.searchParams.has("_t") ||
    url.searchParams.has("nocache")
  ) {
    return; // Pass through directly to network
  }

  // For static assets, use Network-First or Cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
