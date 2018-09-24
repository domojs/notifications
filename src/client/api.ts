import * as akala from '@akala/server';
import { SerializableObject } from '@akala/json-rpc-ws';

export var api = new akala.Api()
    .clientToServerOneWay<{ name: string, user: string }>()({ register: true })
    .serverToClientOneWay<{ user: string, notification: SerializableObject }>()({ notify: true })
    .clientToServerOneWay<{ name: string, user: string, notification: SerializableObject }>()({ notify: true })
    ;