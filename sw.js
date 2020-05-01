// install the service worker
self.addEventListener('install', (evt) => {
  console.log('service worker has been installed', evt);
});

// activate service worker
self.addEventListener('activate', (evt) => {
  console.log('service worker is activated', evt);
});

// fetch event
self.addEventListener('fetch', (evt) => {
  console.log('fetch event', evt);
});
