import * as akala from '@akala/server';
import { api } from '../client/api'
import * as webpush from 'web-push'

akala.injectWithName(['$config', '$updateCofnig'], async function (config, updateConfig)
{
    akala.buildClient(api, { jsonrpcws: true }, {
        async notify(param)
        {
            var endPoints: webpush.PushSubscription[] = await config[param.user];
            endPoints.forEach(async endpoint =>
            {
                var result = await webpush.sendNotification(endpoint, param.notification);
                if (result.statusCode != 200)
                    akala.logger.error(result);
            });
        }
    });

    var keys: webpush.VapidKeys = await config.vapid;
    if (!keys)
    {
        keys = webpush.generateVAPIDKeys();
        await updateConfig('vapid', keys);
    }
    else
        webpush.setVapidDetails('mailto:domojs@dragon-angel.fr', keys.publicKey, keys.privateKey);

})();

akala.api.rest(new akala.Api().clientToServerOneWay<{ user: string, subscription: webpush.PushSubscription, config: { [key: string]: PromiseLike<any> }, updateConfig: Function }>()({
    register: {
        rest: {
            url: '/api/webpush',
            method: 'post',
            param: {
                user: 'user',
                subscription: 'body',
                config: '$config',
                updateConfig: '$updateConfig'
            }
        }
    }
})).createServer('/', {
    async register(param)
    {
        if (param.user)
            throw new Error('user is required');

        var cfg = await param.config[param.user];
        if (!cfg)
            cfg = [param.subscription];
        else
            cfg.push(param.subscription);
        await param.updateConfig(param.user, cfg);
    }
})