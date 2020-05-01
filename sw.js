const staticCacheName = 'site-static'; // any name we want

const assets = [
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
  '/pages/about.html',
  '/pages/contact.html',
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
});

// fetch event
self.addEventListener('fetch', (evt) => {
  // console.log('fetch event', evt);

  evt.respondWith(
    caches.match(evt.request).then((cacheRes) => {
      return cacheRes || fetch(evt.request); // return the cacheRes but if empty return initial request
    })
  );
});
