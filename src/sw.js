const files = [
  './index.html',
  './default.html',
  './main.1f19ae8e.js',
  './style.78032849.css',
  './style.78032849.js',
  './manifest.webmanifest',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
  ];
  
  self.addEventListener('install', async e => {
    const cache = await caches.open('files');
    cache.addAll(files);
  });
    
  async function getFromCache(req) {
    const res = await caches.match(req);
  
    if (!res) {
      return fetch(req);
    }
  
    return res;
  }
  
  async function getFallback(req) {
      return caches.match('./default.html');
  }
  
  async function getFromNetwork(req) {
    const cache = await caches.open('data');
  
    try {
      const res = await fetch(req);
      cache.put(req, res.clone());
      return res;
    } catch (e) {
      const res = await cache.match(req);
      return res || getFallback(req);
    }
  }
  
  self.addEventListener('fetch', async e => {
    const req = e.request;
    const res = navigator.onLine ? getFromNetwork(req) : getFromCache(req);
    await e.respondWith(res);
  });
