// Service worker : met l'application en cache pour qu'elle marche hors ligne.
// Changer VERSION à chaque modification d'un fichier ci-dessous pour que le téléphone la reprenne.
const VERSION = 'lecteur-mobile-20261114171944';
const FICHIERS = ['./', './index.html', './manifest.json', './pdfjs/pdf.min.js', './pdfjs/pdf.worker.min.js',
                  './icones/icone-192.png', './icones/icone-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {            // cache d'abord (hors ligne), réseau ensuite
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)));
});
