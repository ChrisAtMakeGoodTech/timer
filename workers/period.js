import Period from '../Classes/Period.js';
import PeriodTimer from '../Classes/PeriodTimer.js';

let ActivePeriodTimer = null;

const msInMinute = 60000;
const Periods = [
	new Period('Work', 52 * msInMinute, 5 * msInMinute),
	new Period('Break', 17 * msInMinute, 3 * msInMinute),
	new Period('Test', 2000, 5000),
];

const MessageHandlers = {
	async getPeriods(event) {
		console.log(event);
		const Results = Periods.map(v => v.Name);
		postMessage({ type: 'getPeriods', periods: Results });
	},
	async startPeriod(event) {
		if (ActivePeriodTimer !== null) {
			MessageHandlers.endCurrentPeriod(event);
		}

		ActivePeriodTimer = new PeriodTimer(Periods[event.data.index], updateCallback, expireCallback, reminderCallback);
		postMessage({ type: 'periodStarted', timer: ActivePeriodTimer });
	},
	async endCurrentPeriod(event) {
		ActivePeriodTimer.clearTimer();
		postMessage({ type: 'periodEnded', timer: ActivePeriodTimer });
		ActivePeriodTimer = null;
	}
};

function reminderCallback(timeExpired, timerDisplay, period) {
	new Notification(`${period.Name} expired ${timerDisplay} ago.`);
	postMessage({ type: 'periodReminder', timeExpired, timerDisplay, period });
}

function expireCallback(period) {
	new Notification(`${period.Name} period has expired.`);
	postMessage({ type: 'periodExpired', period });
}

function updateCallback(timeToExpire, timerDisplay, period) {
	postMessage({ type: 'timerUpdate', timeToExpire, timerDisplay, period });
}

self.addEventListener('message', event => {
	if (typeof event.data === 'object' && event.data !== null && typeof event.data.type === 'string') {
		if (typeof MessageHandlers[event.data.type] === 'function') {
			MessageHandlers[event.data.type](event);
		}
	}
});