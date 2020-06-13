import Period from '../Classes/Period';
import PeriodTimer from '../Classes/PeriodTimer';

let ActivePeriodTimer: PeriodTimer | null = null;

const msInMinute = 60000;
const Periods = [
	new Period('Work', 52 * msInMinute, 5 * msInMinute),
	new Period('Break', 17 * msInMinute, 3 * msInMinute),
	new Period('Test', 2000, 5000),
];

const MessageHandlers = {
	async getPeriods(_event: MessageEvent) {
		const Results = Periods.map(v => v.Name);
		// @ts-ignore
		postMessage({ type: 'getPeriods', periods: Results });
	},
	async startPeriod(event: MessageEvent) {
		if (ActivePeriodTimer !== null) {
			MessageHandlers.endCurrentPeriod(event);
		}

		ActivePeriodTimer = new PeriodTimer(Periods[event.data.index], updateCallback, expireCallback, reminderCallback);
		// @ts-ignore
		postMessage({ type: 'periodStarted', timer: ActivePeriodTimer });
	},
	async endCurrentPeriod(_event: MessageEvent) {
		ActivePeriodTimer!.clearTimer();
		// @ts-ignore
		postMessage({ type: 'periodEnded', timer: ActivePeriodTimer });
		ActivePeriodTimer = null;
	}
};

function reminderCallback(timeExpired: number, timerDisplay: string, period: Period) {
	new Notification(`${period.Name} expired ${timerDisplay} ago.`);
	// @ts-ignore
	postMessage({ type: 'periodReminder', timeExpired, timerDisplay, period });
}

function expireCallback(period: Period) {
	new Notification(`${period.Name} period has expired.`);
	// @ts-ignore
	postMessage({ type: 'periodExpired', period });
}

function updateCallback(timeToExpire: number, timerDisplay: string, period: Period) {
	// @ts-ignore
	postMessage({ type: 'timerUpdate', timeToExpire, timerDisplay, period });
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