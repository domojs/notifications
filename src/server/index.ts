import * as akala from '@akala/server';
import { AssetRegistration } from '@akala-modules/core';
import { EventEmitter } from 'events';

akala.injectWithName(['$isModule', '$master', '$worker'], function (isModule: akala.worker.IsModule, master: akala.worker.MasterRegistration, worker: EventEmitter)
{
    if (isModule('@domojs/notifications'))
    {
        worker.on('ready', function ()
        {
            // Called when all modules have been initialized
            require('./webpush');
        });
        master(__filename, './master');

        akala.injectWithNameAsync([AssetRegistration.name], function (va: AssetRegistration)
        {
            va.register('/js/routes.js', require.resolve('../routes'));
            va.register('/js/sw.js', require.resolve('../sw'));

        });

    }
})()