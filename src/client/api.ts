import * as akala from '@akala/core';
import { SerializableObject } from '@akala/json-rpc-ws';

export var api = new akala.Api()
    .clientToServerOneWay<{ name: string, user: string }>()({ register: true })
    .serverToClientOneWay<{ user: string, notification: SerializableObject }>()({ notify: true })
    .clientToServerOneWay<{ name: string, user: string, notification: SerializableObject }>()({ notify: true })
    .clientToServer<void, string>()({
        getPublicKey: {
            jsonrpcws: true, rest: {
                url: '/publicKey',
                method: 'get'
            }
        }
    })
    ;