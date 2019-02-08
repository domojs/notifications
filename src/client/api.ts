import * as akala from '@akala/core';
import * as webpush from 'web-push';
import { SerializableObject } from '@akala/json-rpc-ws';

export var api = new akala.Api()
    .clientToServerOneWay<{ name: string, user: string }>()({ register: true })
    .serverToClientOneWay<{ user: string, notification: SerializableObject }>()({ notify: true })
    .clientToServerOneWay<{ name: string, user: string, notification: SerializableObject }>()({ notify: true })

export var webpushApi = new akala.Api()
    .clientToServerOneWay<{ user?: string, subscription: webpush.PushSubscription | PushSubscriptionJSON, config?: { vapid: { publicKey: PromiseLike<string> } }, updateConfig?: Function }>()({
        register: {
            rest: {
                url: '/',
                method: 'post',
                param: {
                    user: 'user',
                    subscription: 'body',
                    config: '$config',
                    updateConfig: '$updateConfig'
                }
            }
        }
    })
    .clientToServer<{ config: { vapid: { [key: string]: PromiseLike<any> } } }, string>()({
        getPublicKey: {
            rest: {
                url: '/publicKey',
                method: 'get',
                type: 'text',
                param: {
                    config: '$config'
                }
            }
        }
    })
    ;