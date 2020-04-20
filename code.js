/**
 * Todo
 * notification sounds
 * add/edit periods
 * persist logs
 * custom sounds
 * notification actions
 */

import setUpNotifications from './setup/notifications.js';
import setUpServiceWorker from './setup/serviceworker.js';
import setUpChannel from './setup/Channel.js';
import State from './objects/State.js';
import messageHandler from './functions/messageHandler.js';
// import { openDB, deleteDB, wrap, unwrap } from 'https://unpkg.com/idb?module';

setUpServiceWorker();
setUpNotifications();
setUpChannel(messageHandler);

window.addEventListener('beforeunload', function (e) {
	if (State.IsActivePeriod) {
		e.preventDefault();
		e.returnValue = '';
	}
});