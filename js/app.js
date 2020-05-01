if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) =>
      console.log('service worker registered', registration)
    )
    .cath((error) => console.log('service worker not registered', error));
}
