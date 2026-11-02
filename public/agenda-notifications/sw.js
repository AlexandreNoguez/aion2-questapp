self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const url = new URL("/agenda", self.location.origin).href;
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const agenda = windows.find((client) => client.url === url);
    if (agenda) await agenda.focus();
    else await self.clients.openWindow(url);
  })());
});
