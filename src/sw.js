const files = [
  './src/index.html',
  './src/*.png',
  './src/*.css',
  './src/*.js'
  ];
  
  self.addEventListener('install', async e => {
    const cache = await caches.open('files');
    cache.addAll(files);
  });
  
  // https://any-api.com/oxforddictionaries_com/oxforddictionaries_com/docs/_entries_source_lang_word_id_/GET
  const apiUrl = 'https://od-api-demo.oxforddictionaries.com:443/api/v1/entries/en/swim';
  
  function isApiCall(req) {
    return req.url.startsWith(apiUrl);
  }
  
  async function getFromCache(req) {
    const res = await caches.match(req);
  
    if (!res) {
      return fetch(req);
    }
  
    return res;
  }
  
  async function getFallback(req) {
    const path = req.url.substr(apiUrl.length);
  
    if (path.startsWith('/latest')) {
      return caches.match('./fallback/posts.json');
    } else {
      return null
    }
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
    const res = isApiCall(req) ? getFromNetwork(req) : getFromCache(req);
    await e.respondWith(res);
  });
