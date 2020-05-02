const version = 'v7';
const staticCacheName = 'site-static-' + version; // any name we want
const dynamicCacheName = 'site-dynamic-' + version;

const assets = [
  '/pages/fallback.html',
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v50/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
  // 'manifest.json',
  '/img/icons/icon-144x144.png',
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install the service worker
self.addEventListener('install', (evt) => {
  // console.log('service worker has been installed', evt);

  evt.waitUntil(
    // open the cache if exist or create it
    caches.open(staticCacheName).then((cache) => {
      // cache.add or addAll
      console.log('caching shell assets');

      cache.addAll(assets);
    })
  );
});

// activate service worker
self.addEventListener('activate', (evt) => {
  // console.log('service worker is activated', evt);

  evt.waitUntil(
    caches.keys().then((keys) => {
      console.log(keys);

      // delete if not staticCacheName
      return Promise.all(
        // take an array of promises
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', (evt) => {
  if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
    evt.respondWith(
      caches
        .match(evt.request)
        .then((cacheRes) => {
          // return the cacheRes but if empty return initial request
          return (
            cacheRes ||
            fetch(evt.request).then((fetchRes) => {
              return caches.open(dynamicCacheName).then((cache) => {
                if (!evt.request.url.startsWith('chrome-extension:')) {
                  // fix
                  cache.put(evt.request.url, fetchRes.clone()); // key and value of the cache
                  limitCacheSize(dynamicCacheName, 15);
                }
                return fetchRes; // to view the page in the browser
              });
            })
          );
        })
        .catch(
          (err) => {
            if (evt.request.url.indexOf('.html') > -1) {
              return caches.match('/pages/fallback.html');
            }
          }
          // we don't have the page in our cache and the fetch fail because we are offline for exemple
        )
    );
  }
});
