/// <reference lib="WebWorker" />

import {
  CacheFirst,
  NetworkFirst,
  RemixNavigationHandler,
} from "@remix-pwa/sw";

export type {};
declare let self: ServiceWorkerGlobalScope;

const CACHE_NAME = "all-cache";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const remixNavigationHandler = new RemixNavigationHandler({
  dataCacheName: CACHE_NAME,
  documentCacheName: CACHE_NAME,
});

self.addEventListener("message", (event) => {
  switch (event.data.type) {
    default: {
      return event.waitUntil(remixNavigationHandler.handle(event));
    }
  }
});

const cacheFirst = new CacheFirst({ cacheName: "all-cache" });
const networkFirst = new NetworkFirst({ cacheName: "all-cache" });

const fetchHandler = (request: Request): Promise<Response> => {
  if (request.method !== "GET") {
    return fetch(request);
  } else if (new URL(request.url).pathname.startsWith("/api")) {
    return networkFirst.handle(request);
  } else {
    return cacheFirst.handle(request);
  }
};

self.addEventListener("fetch", (event) => {
  event.respondWith(fetchHandler(event.request.clone()));
});
