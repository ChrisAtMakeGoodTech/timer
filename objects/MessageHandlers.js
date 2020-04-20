import State from './State.js';
import Logger from '../Classes/Logger.js';
import { StartButtons, Counter } from './Elements.js';
import setUpButtons from '../setup/buttons.js';
import getDisplayTime from '../functions/getDisplayTime.js';

const OutputLogger = new Logger();

export default {
	channelRegistered(event) {
		navigator.serviceWorker.controller.postMessage({ type: 'getPeriods' });
	},
	getPeriods(event) {
		setUpButtons(StartButtons, event.data.periods);
	},
	periodStarted(event) {
		const ActivePeriodTimer = event.data.timer;
		State.IsActivePeriod = true;
		OutputLogger.addOutput(`${ActivePeriodTimer.Period.Name} period started at ${getDisplayTime(ActivePeriodTimer.PeriodStart)}. Will expire at ${getDisplayTime(ActivePeriodTimer.PeriodEnd)}.`);
	},
	periodEnded(event) {
		const ActivePeriodTimer = event.data.timer;
		State.IsActivePeriod = false;
		OutputLogger.addOutput(`${ActivePeriodTimer.Period.Name} period has ended.`);
		Counter.textContent = '';
	},
	timerUpdate(event) {
		const { timeToExpire, timerDisplay, period } = event.data;
		const IsNegative = timeToExpire < 0;
		if (IsNegative !== State.TimerIsNegative) {
			State.TimerIsNegative = IsNegative;
			if (State.TimerIsNegative) {
				Counter.classList.add('red-text');
			} else {
				Counter.classList.remove('red-text');
			}
		}

		Counter.textContent = timerDisplay;
	},
	periodExpired(event) {
		OutputLogger.addOutput(`${event.data.period.Name} period has expired.`);
	},
	periodReminder(event) {

	},
};