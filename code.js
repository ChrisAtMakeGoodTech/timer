import setUpNotifications from './setup/notifications.js';
import setUpServiceWorker from './setup/serviceworker.js';
import setUpButtons from './setup/buttons.js';
// import { openDB, deleteDB, wrap, unwrap } from 'https://unpkg.com/idb?module';

/**
UI
	buttons
	log display
	notifications
		notification audio
	work period setup
	audio setup
*/

/*
work period
	add
		name
		length
		sound
		remind time
	edit
	start
	end
	delete

audio
	add
	remove
	linked periods

log
	store
	read
	display

notifications
	timeout
	cancel
	show
	repeat
	actions

idb
	periods
	audio
	log
*/

setUpServiceWorker();
setUpNotifications();

const OutputSection = document.getElementById('output');
const StartButtons = document.getElementById('start-buttons');
const Counter = document.getElementById('counter');

let IsActivePeriod = false;
let TimerIsNegative = false;

const Channel = new MessageChannel();
Channel.port1.start();
Channel.port2.start();

const MessageHandlers = {
	channelRegistered(event) {
		navigator.serviceWorker.controller.postMessage({ type: 'getPeriods' });
	},
	getPeriods(event) {
		setUpButtons(StartButtons, event.data.periods);
	},
	periodStarted(event) {
		const ActivePeriodTimer = event.data.timer;
		IsActivePeriod = true;
		addOutput(`${ActivePeriodTimer.Period.Name} period started at ${getDisplayTime(ActivePeriodTimer.PeriodStart)}. Will expire at ${getDisplayTime(ActivePeriodTimer.PeriodEnd)}.`);
	},
	periodEnded(event) {
		const ActivePeriodTimer = event.data.timer;
		IsActivePeriod = false;
		addOutput(`${ActivePeriodTimer.Period.Name} period has ended.`);
		Counter.textContent = '';
	},
	timerUpdate(event) {
		const { timeToExpire, timerDisplay, period } = event.data;
		const IsNegative = timeToExpire < 0;
		if (IsNegative !== TimerIsNegative) {
			TimerIsNegative = IsNegative;
			if (TimerIsNegative) {
				Counter.classList.add('red-text');
			} else {
				Counter.classList.remove('red-text');
			}
		}

		Counter.textContent = timerDisplay;
	},
	periodExpired(event) {
		addOutput(`${event.data.period.Name} period has expired.`);
	},
	periodReminder(event) {

	},
};

Channel.port1.addEventListener('message', function (event) {
	if (typeof event.data === 'object' && event.data !== null && typeof event.data.type === 'string') {
		if (typeof MessageHandlers[event.data.type] === 'function') {
			MessageHandlers[event.data.type](event);
		} else {
			console.error('Unknown message type from service worker: ' + event.data.type);
		}
	}
});

navigator.serviceWorker.controller.postMessage({ type: 'registerChannel' }, [Channel.port2]);

window.addEventListener('beforeunload', function (e) {
	if (IsActivePeriod) {
		e.preventDefault();
		e.returnValue = '';
	}
});

function getDisplayTime(date) {
	return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

function addOutput(...lines) {
	lines.forEach(l => {
		const NewElement = document.createElement('div');
		NewElement.innerHTML = `<span style="color:#777777;">${getDisplayTime(new Date())}:</span> ` + l;
		OutputSection.prepend(NewElement);
	});
}