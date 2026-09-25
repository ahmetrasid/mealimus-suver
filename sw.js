/* Türkçe: Meâlimü's-Süver çevrimdışı önbelleği.
   İlk açılışta sayfa, manifest ve ikon önbelleğe alınır; sonra internetsiz de açılır.
   Sürüm adını (CACHE) değiştirmek, güncellemenin telefonlara inmesini sağlar. */
const CACHE = 'mealim-v1';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-512.png'];

/* Türkçe: Kurulumda dosyaları önbelleğe alır; hata olursa kurulumu reddeder. */
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

/* Türkçe: Eski sürüm önbelleklerini temizler. */
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

/* Türkçe: Önce ağ (güncel içerik), ağ yoksa önbellek; ikisi de yoksa ana sayfaya düşer. */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const kopya = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, kopya)).catch(() => {});
      return r;
    }).catch(() => caches.match(e.request).then(m => m || caches.match('./index.html')))
  );
});
