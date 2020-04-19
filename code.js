import Period from './Classes/Period.js';
import PeriodTimer from './Classes/PeriodTimer.js';
import setupNotifications from './setupNotifications.js';
import { openDB, deleteDB, wrap, unwrap } from 'https://unpkg.com/idb?module';

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

setupNotifications();

const OutputSection = document.getElementById('output');
const StartButtons = document.getElementById('start-buttons');
const Counter = document.getElementById('counter');

const msInMinute = 60000;
const Periods = [
	new Period('Work', 52 * msInMinute, 5 * msInMinute),
	new Period('Break', 17 * msInMinute, 3 * msInMinute),
];

let ActivePeriodTimer = null;
let TimerIsNegative = false;

window.addEventListener('beforeunload', function (e) {
	if (ActivePeriodTimer !== null) {
		e.preventDefault();
		e.returnValue = '';
	}
});

Periods.forEach(p => {
	const NewButton = document.createElement('button');
	NewButton.textContent = 'Start ' + p.Name;
	NewButton.addEventListener('click', function () {
		clearExistingPeriod();
		ActivePeriodTimer = new PeriodTimer(p, updateCallback, expireCallback, reminderCallback);
		addOutput(`${p.Name} period started at ${getDisplayTime(ActivePeriodTimer.PeriodStart)}. Will expire at ${getDisplayTime(ActivePeriodTimer.PeriodEnd)}.`);
	});
	StartButtons.appendChild(NewButton);
});

function reminderCallback(timeExpired, timerDisplay, period) {
	new Notification(`${period.Name} expired ${timerDisplay} ago.`);
}

function expireCallback(period) {
	addOutput(`${period.Name} period has expired.`);
	new Notification(`${period.Name} period has expired.`);
}

function updateCallback(timeToExpire, timerDisplay, period) {
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
}

{
	const NewButton = document.createElement('button');
	NewButton.textContent = 'Clear Period';
	NewButton.addEventListener('click', function () {
		clearExistingPeriod()
	});
	StartButtons.appendChild(NewButton);
}

function clearExistingPeriod() {
	if (ActivePeriodTimer !== null) {
		ActivePeriodTimer.clearTimer();
		addOutput(`${ActivePeriodTimer.Period.Name} period has ended.`);
		ActivePeriodTimer = null;
		Counter.textContent = '';
	}
}

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