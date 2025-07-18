const CACHE_NAME = 'image-cache-v1';

self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((response) =>
          response ||
          fetch(event.request)
            .then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            })
            .catch(() => caches.match('/placeholder.png'))
        )
      )
    );
  }
}); 