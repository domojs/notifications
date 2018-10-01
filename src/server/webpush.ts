import * as akala from '@akala/server';
import { api, webpushApi } from '../client/api'
import * as webpush from 'web-push'

akala.injectWithName(['$config', '$updateConfig', '$agent.api/@domojs/notifications'], async function (config, updateConfig, notifications)
{
    akala.api.jsonrpcws(api).createClient(await notifications, {
        async notify(param)
        {
            var endPoints: webpush.PushSubscription[] = await config[param.user];
            endPoints.forEach(async endpoint =>
            {
                var result = await webpush.sendNotification(endpoint, JSON.stringify(param.notification));
                if (result.statusCode != 200)
                    akala.logger.error(result);
            });
        }
    });

    var keys: webpush.VapidKeys = await config.vapid;
    if (!keys)
    {
        keys = webpush.generateVAPIDKeys();
        await updateConfig(keys, 'vapid');
    }
    else
        webpush.setVapidDetails('mailto:domojs@dragon-angel.fr', keys.publicKey, keys.privateKey);

})();

akala.api.rest(webpushApi).createServer('/api/webpush', {
    async register(param)
    {
        if (!param.user)
            throw new Error('user is required');

        var cfg = await param.config[param.user];
        if (!cfg)
            cfg = [param.subscription];
        else
            cfg.push(param.subscription);
        await param.updateConfig(cfg, param.user);
    },
    getPublicKey(p)
    {
        return p.config.vapid.publicKey;
    },
})