/**
 * Service Worker - Absensi Piket KSPM
 * Offline Caching & PWA App Shell
 * Galeri Investasi FEB Universitas Jenderal Soedirman
 */

const CACHE_NAME = 'kspm-absen-v2';

const STATIC_ASSETS = [
  './',
  './index.html',
  './absen.html',
  './monitoring.html',
  './bantuan.html',
  './dashboard.html',
  './manifest.json',
  './css/custom.css',
  './js/attendance-db.js?v=21',
  './js/calendar.js?v=6',
  './assets/logo.png',
  './assets/logo_white.png',
  './assets/logo.svg'
];

// Install: Simpan cache aset lokal penting
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-caching static assets KSPM...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Bersihkan cache versi lama jika ada pembaruan
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Menghapus cache lama:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Tangani offline fallback & caching
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Abaikan request API cloud (Supabase REST & Google Apps Script)
  if (url.hostname.includes('supabase.co') || url.hostname.includes('script.google.com')) {
    return;
  }

  // 1. Untuk navigasi halaman (HTML): Network first, fallback to Cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then(cached => {
            return cached || caches.match('./index.html');
          });
        })
    );
    return;
  }

  // 2. Untuk aset statis (CSS, JS, Gambar, Font): Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// 3. Tangani Klik Notifikasi (Buka Halaman Presensi)
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : './absen.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('absen.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// 4. Tangani Remote Push Event (Sinyal Web Push)
self.addEventListener('push', event => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Presensi KSPM', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'Pengingat Piket KSPM';
  const options = {
    body: data.body || 'Waktunya presensi piket di Galeri Investasi.',
    icon: 'assets/logo.png',
    badge: 'assets/logo_white.png',
    vibrate: [200, 100, 200, 100, 200],
    data: { url: data.url || './absen.html' },
    requireInteraction: true
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
