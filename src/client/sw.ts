
///<reference path="../../serviceworker.d.ts" />

module notifications
{
    declare var self: ServiceWorkerGlobalScope;

    self.addEventListener('push', function (event)
    {
        console.log('[Service Worker] Push Received.');
        console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

        const title = 'Push Codelab';
        const options = {
            body: 'Yay it works.',
            icon: 'images/icon.png',
            badge: 'images/badge.png'
        };

        event.waitUntil(self.registration.showNotification(title, options));
    });
}