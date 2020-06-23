import PeriodTimer from '../Classes/PeriodTimer';
import DbPeriods from '../db/DbPeriods';
import Reminder from '../helpers/Reminder';
import IPeriod from '../Classes/IPeriod';
import IMessageHandlers from '../objects/IMessageHandlers';

let ActivePeriodTimer: PeriodTimer | null = null;

const Db = new DbPeriods();

const MessageHandlers: IMessageHandlers = {
	async getPeriods(_event: MessageEvent) {
		const Periods = await Db.getAllPeriods();
		postMessage({ type: 'getPeriods', periods: Periods });
	},
	async startPeriod(event: MessageEvent) {
		if (ActivePeriodTimer !== null) {
			MessageHandlers.endCurrentPeriod(event);
		}

		const Period = await Db.getPeriodById(event.data.index);

		Reminder.Bug('Make sure Period is set');
		ActivePeriodTimer = new PeriodTimer(Period!, updateCallback, expireCallback, reminderCallback);
		postMessage({ type: 'periodStarted', timer: ActivePeriodTimer });
	},
	async endCurrentPeriod(_event: MessageEvent) {
		ActivePeriodTimer!.clearTimer();
		postMessage({ type: 'periodEnded', timer: ActivePeriodTimer });
		ActivePeriodTimer = null;
	}
};

function reminderCallback(timeExpired: number, timerDisplay: string, period: IPeriod) {
	new Notification(`${period.Name} expired ${timerDisplay} ago.`);
	postMessage({ type: 'periodReminder', timeExpired, timerDisplay, period });
}

function expireCallback(period: IPeriod) {
	new Notification(`${period.Name} period has expired.`);
	postMessage({ type: 'periodExpired', period });
}

function updateCallback(timeToExpire: number, timerDisplay: string, period: IPeriod) {
	postMessage({ type: 'timerUpdate', timeToExpire, timerDisplay, period });
}

self.addEventListener('message', event => {
	if (event.data !== null && typeof event.data === 'object' && typeof event.data.type === 'string') {
		if (typeof MessageHandlers[event.data.type] === 'function') {
			MessageHandlers[event.data.type](event);
		}
	}
});