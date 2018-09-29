import { api } from './api'
import * as akala from '@akala/client'

declare var swRegistration: PromiseLike<ServiceWorkerRegistration>;

if (Notification.permission !== 'denied')
{
    // const publicKey = 'BDU5tQ-WzGDUJOsE3743I9LeyfolOYQH66vux5boQxFHj-d_rJkaLmFje6h-Iuv9AwnrgfpF4jkLbY3LTYpWjZQ';
    function urlB64ToUint8Array(base64String)
    {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i)
        {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    var notificationClient = akala.api.rest(api).createServerProxy('/api/@domojs/notifications')

    Promise.all([swRegistration, notificationClient.getPublicKey(null)]).then(([reg, publicKey]) =>
    {
        debugger;
        const applicationServerKey = urlB64ToUint8Array(publicKey);

        reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
            .then(function (subscription)
            {
                console.log('User is subscribed.');

            })
            .catch(function (err)
            {
                console.log('Failed to subscribe the user: ', err);
            });
    });
}