import PeriodTimer from '../Classes/PeriodTimer';
import DbPeriods from '../db/DbPeriods';
import Reminder from '../helpers/Reminder';
import IPeriod from '../Classes/IPeriod';

let ActivePeriodTimer: PeriodTimer | null = null;

const Db = new DbPeriods();

const MessageHandlers = {
	async getPeriods(_event: MessageEvent) {
		const Periods = await Db.getAllPeriods();
		// @ts-ignore
		postMessage({ type: 'getPeriods', periods: Periods });
	},
	async startPeriod(event: MessageEvent) {
		if (ActivePeriodTimer !== null) {
			MessageHandlers.endCurrentPeriod(event);
		}

		const Period = await Db.getPeriodById(event.data.index);

		Reminder.Bug('Make sure Period is set');
		ActivePeriodTimer = new PeriodTimer(Period!, updateCallback, expireCallback, reminderCallback);
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

function reminderCallback(timeExpired: number, timerDisplay: string, period: IPeriod) {
	new Notification(`${period.Name} expired ${timerDisplay} ago.`);
	// @ts-ignore
	postMessage({ type: 'periodReminder', timeExpired, timerDisplay, period });
}

function expireCallback(period: IPeriod) {
	new Notification(`${period.Name} period has expired.`);
	// @ts-ignore
	postMessage({ type: 'periodExpired', period });
}

function updateCallback(timeToExpire: number, timerDisplay: string, period: IPeriod) {
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