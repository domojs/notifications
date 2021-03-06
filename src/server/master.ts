import * as akala from '@akala/server'
import { Connection } from '@akala/json-rpc-ws'
import { api } from '../client/api'

var notifiers: { [key: string]: { [key: string]: Connection } } = {};

akala.api.buildServer(api, { jsonrpcws: '/api/notifications' }, {
    register(param, connection: Connection)
    {
        if (!notifiers[param.name])
            notifiers[param.name] = {};
        if (param.user)
            notifiers[param.name][param.user] = connection;
        else
            notifiers[param.name][''] = connection;
    },
    notify(p)
    {
        if (typeof notifiers[p.name][p.user] !== 'undefined')
            return this.$proxy(notifiers[p.name][p.user]).notify(p);
        return this.$proxy(notifiers[p.name]['']).notify(p);
    }
});