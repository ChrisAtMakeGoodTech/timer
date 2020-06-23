import State from './objects/State';
import mainSetup from './setup/mainSetup';

mainSetup();

window.addEventListener('beforeunload', function (e) {
	if (State.IsActivePeriod) {
		e.preventDefault();
		e.returnValue = '';
	}
});