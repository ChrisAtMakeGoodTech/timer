import Period from '../Classes/Period.js';
import PeriodTimer from '../Classes/PeriodTimer.js';

let ActivePeriodTimer: PeriodTimer | null = null;

const msInMinute = 60000;
const Periods = [
	new Period('Work', 52 * msInMinute, 5 * msInMinute),
	new Period('Break', 17 * msInMinute, 3 * msInMinute),
	new Period('Test', 2000, 5000),
];

const MessageHandlers = {
	async getPeriods(event: MessageEvent) {
		console.log(event);
		const Results = Periods.map(v => v.Name);
		postMessage({ type: 'getPeriods', periods: Results }, self.location.origin);
	},
	async startPeriod(event: MessageEvent) {
		if (ActivePeriodTimer !== null) {
			MessageHandlers.endCurrentPeriod(event);
		}

		ActivePeriodTimer = new PeriodTimer(Periods[event.data.index], updateCallback, expireCallback, reminderCallback);
		postMessage({ type: 'periodStarted', timer: ActivePeriodTimer }, self.location.origin);
	},
	async endCurrentPeriod(_event: MessageEvent) {
		ActivePeriodTimer!.clearTimer();
		postMessage({ type: 'periodEnded', timer: ActivePeriodTimer }, self.location.origin);
		ActivePeriodTimer = null;
	}
};

function reminderCallback(timeExpired: number, timerDisplay: string, period: Period) {
	new Notification(`${period.Name} expired ${timerDisplay} ago.`);
	postMessage({ type: 'periodReminder', timeExpired, timerDisplay, period }, self.location.origin);
}

function expireCallback(period: Period) {
	new Notification(`${period.Name} period has expired.`);
	postMessage({ type: 'periodExpired', period }, self.location.origin);
}

function updateCallback(timeToExpire: number, timerDisplay: string, period: Period) {
	postMessage({ type: 'timerUpdate', timeToExpire, timerDisplay, period }, self.location.origin);
}

self.addEventListener('message', event => {
	if (typeof event.data === 'object' && event.data !== null && typeof event.data.type === 'string') {
		// @ts-ignore
		if (typeof MessageHandlers[event.data.type] === 'function') {
			// @ts-ignore
			MessageHandlers[event.data.type](event);
		}
	}
});