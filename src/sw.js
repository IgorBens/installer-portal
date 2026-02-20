// ===== SERVICE WORKER =====
// Strategy: Network-first with versioned cache fallback.
//   - Online  → fetch from network, cache the response
//   - Offline → serve from cache
//
// CACHE_VERSION is replaced by docker-entrypoint.sh on every deploy,
// so a new container = new cache = old versions cleaned up.

const CACHE_VERSION = "__BUILD_VER__";
const CACHE_NAME = `thermoduct-v${CACHE_VERSION}`;

// Paths that must NEVER be cached (generated at runtime)
const NEVER_CACHE = ["/js/core/config.js"];

// ── Install: activate immediately (don't wait for old SW to stop) ──

self.addEventListener("install", () => self.skipWaiting());

// ── Activate: delete old caches, claim all tabs ──

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: network-first with cache fallback ──

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Only handle same-origin GET requests (skip API calls, POSTs, etc.)
  if (e.request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // Never cache config.js — it's generated from env vars per container
  if (NEVER_CACHE.some(p => url.pathname.endsWith(p))) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
