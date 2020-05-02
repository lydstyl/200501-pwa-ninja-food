const staticCacheName = 'site-static-v2'; // any name we want
const dynamicCacheName = 'site-dynamic-v2';

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
  'manifest.json',
  '/img/icons/icon-144x144.png',
];

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
  // console.log('fetch event', evt);

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
              }

              return fetchRes; // to view the page in the browser
            });
          })
        );
      })
      .catch(
        (err) => caches.match('/pages/fallback.html')
        // we don't have the page in our cache and the fetch fail because we are offline for exemple
      )
  );
});
