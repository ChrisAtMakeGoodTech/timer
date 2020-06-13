import setUpNotifications from './setup/notifications';
import setUpServiceWorker from './setup/serviceworker';
import setUpChannel from './setup/Channel';
import State from './objects/State';
import messageHandler from './functions/messageHandler';
import setUpTabs from './setup/tabs';

setUpServiceWorker();
setUpNotifications();
setUpChannel(messageHandler);
setUpTabs();

window.addEventListener('beforeunload', function (e) {
	if (State.IsActivePeriod) {
		e.preventDefault();
		e.returnValue = '';
	}
});