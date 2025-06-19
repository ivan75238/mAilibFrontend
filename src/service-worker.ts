import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

const MANIFEST = self.__WB_MANIFEST || [
  { url: "/index.html", revision: "123" },
  { url: "/static/js/main.chunk.js", revision: "123" },
  { url: "/static/css/main.chunk.css", revision: "123" },
];

precacheAndRoute(MANIFEST);

registerRoute(
  ({ request }) =>
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image",
  new StaleWhileRevalidate()
);

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
