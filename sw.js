importScripts('/sw/Period.js', '/sw/PeriodTimer.js');

self.addEventListener('install', () => {
	self.skipWaiting();
});

self.addEventListener('fetch', async (event) => { });

let ActivePeriodTimer = null;

const msInMinute = 60000;
const Periods = [
	new Period('Work', 52 * msInMinute, 5 * msInMinute),
	new Period('Break', 17 * msInMinute, 3 * msInMinute),
	new Period('Test', 2000, 5000),
];

const Channels = new Map();

const MessageHandlers = {
	async registerChannel(event) {
		console.log(event);
		Channels.set(event.source.id, event.ports[0]);
		const Port = Channels.get(event.source.id);
		Port.postMessage({ type: 'channelRegistered' });
	},
	async getPeriods(event) {
		console.log(event);
		const Results = Periods.map(v => v.Name);
		const Port = Channels.get(event.source.id);
		Port.postMessage({ type: 'getPeriods', periods: Results });
	},
	async startPeriod(event) {
		if (ActivePeriodTimer !== null) {
			MessageHandlers.endCurrentPeriod(event);
		}
		ActivePeriodTimer = new PeriodTimer(Periods[event.data.index], updateCallback, expireCallback, reminderCallback);
		for (const Port of Channels.values()) {
			Port.postMessage({ type: 'periodStarted', timer: ActivePeriodTimer });
		}
	},
	async endCurrentPeriod(event) {
		ActivePeriodTimer.clearTimer();
		for (const Port of Channels.values()) {
			Port.postMessage({ type: 'periodEnded', timer: ActivePeriodTimer });
		}
		ActivePeriodTimer = null;
	}
};

function reminderCallback(timeExpired, timerDisplay, period) {
	self.registration.showNotification(`${period.Name} expired ${timerDisplay} ago.`);
	for (const Port of Channels.values()) {
		Port.postMessage({ type: 'periodReminder', timeExpired, timerDisplay, period });
	}
}

function expireCallback(period) {
	self.registration.showNotification(`${period.Name} period has expired.`);
	for (const Port of Channels.values()) {
		Port.postMessage({ type: 'periodExpired', period });
	}
}

function updateCallback(timeToExpire, timerDisplay, period) {
	for (const Port of Channels.values()) {
		Port.postMessage({ type: 'timerUpdate', timeToExpire, timerDisplay, period });
	}
}

self.addEventListener('message', event => {
	if (typeof event.data === 'object' && event.data !== null && typeof event.data.type === 'string') {
		if (typeof MessageHandlers[event.data.type] === 'function') {
			MessageHandlers[event.data.type](event);
		}
	}
});
