import setUpNotifications from './notifications';
import setUpServiceWorker from './serviceworker';
import setUpChannel from './Channel';
import messageHandler from '../functions/messageHandler';
import setUpTabs from './tabs';
import setUpPeriodView from './periodView';
import setUpStorageListener from './storageListener';

export default function mainSetup() {
	setUpServiceWorker();
	setUpNotifications();
	setUpChannel(messageHandler);
	setUpTabs();
	setUpPeriodView();
	setUpStorageListener();
}
