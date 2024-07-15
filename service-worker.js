const CACHE_NAME = 'my-doc-cache-v3';
const urlsToCache = [
  '.',
  'index.html',
  'rich_text.css',
  'rich_text.js',
  'app.js',
  'editor_logo.png',
  'offline.html',
  'https://fonts.googleapis.com/css2?family=Amatic+SC&display=swap',
  'https://fonts.googleapis.com/css2?family=Caveat&display=swap',
  'https://fonts.googleapis.com/css2?family=Comfortaa&display=swap',
  'https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap',
  'https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap',
  'https://fonts.googleapis.com/css2?family=Georgia&display=swap',
  'https://fonts.googleapis.com/css2?family=Impact&display=swap',
  'https://fonts.googleapis.com/css2?family=Legend+One&display=swap',
  'https://fonts.googleapis.com/css2?family=Lobster&display=swap',
  'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
  'https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap',
  'https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.0/html2pdf.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://darpanadhikari.com.np'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching all assets');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[Service Worker] Failed to cache: ', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.error('[Service Worker] Failed to cache response: ', error);
              });

            return response;
          }
        );
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('offline.html');
        }
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList => 
      Promise.all(keyList.map(key => {
        if (!cacheWhitelist.includes(key)) {
          return caches.delete(key);
        }
      }))
    ).then(() => {
      return self.clients.claim();
    }).then(() => {
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'CACHE_UPDATED',
            message: 'New content is available, please refresh.'
          });
        });
      });
    })
  );
});

self.addEventListener('message', event => {
  if (event.data.action === 'refreshCache') {
    refreshCache().then(() => {
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'CACHE_REFRESHED',
            message: 'Cache has been refreshed. Reloading...'
          });
        });
      });
    });
  }
});

function refreshCache() {
  return caches.delete(CACHE_NAME)
    .then(() => {
      return caches.open(CACHE_NAME);
    })
    .then(cache => {
      return Promise.all(
        urlsToCache.map(url =>
          fetch(url).then(response => {
            if (response.ok) {
              return cache.put(url, response);
            }
            return Promise.reject(new Error(`Failed to fetch ${url}`));
          })
        )
      );
    })
    .then(() => {
      console.log('[Service Worker] Cache refreshed');
    })
    .catch(error => {
      console.error('[Service Worker] Error refreshing cache: ', error);
    });
}
