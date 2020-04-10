import Period from './Period.js';
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

// const TimerApp = {};
// function setUpButtons(){
// 	TimerApp.periods.forEach(p => {
// 		// add button to UI
// 	});
// }

// setUpButtons();

// TimerApp.addEventListener('period-edit', function(){
// 	// clear buttons
// 	setUpButtons();
// });

const msInMinute = 60000;
const Periods = [
	new Period('Work', 52 * msInMinute),
	new Period('Break', 17 * msInMinute),
];

let Timeout = null;
let TimeEnd = null;

window.addEventListener('beforeunload', function (e) {
	if (Timeout !== null) {
		e.preventDefault();
		e.returnValue = '';
	}
});

Periods.forEach(p => {
	const NewButton = document.createElement('button');
	NewButton.textContent = 'Start ' + p.Name;
	NewButton.addEventListener('click', function () {
		clearExistingPeriod()

		const Now = new Date();
		const End = new Date(Now.getTime() + p.LengthMilliseconds);
		addOutput(`${p.Name} period started at ${getDisplayTime(Now)}. Will end at ${getDisplayTime(End)}.`);

		Timeout = setTimeout(function () {
			Timeout = null;
			addOutput(`${p.Name} period ended.`);
			new Notification(`${p.Name} period has ended.`);
		}, p.LengthMilliseconds);

		TimeEnd = End.getTime();

		doTimer();

	});
	StartButtons.appendChild(NewButton);
});

function doTimer() {
	if (TimeEnd === null) {
		Counter.textContent = '';
		return;
	}

	const TimeTil = TimeEnd - new Date().getTime();
	if (TimeTil <= 0){
		Counter.textContent = '';
		return;
	}

	const TotalSecondsTil = Math.floor(TimeTil / 1000);

	const HoursTil = Math.floor(TotalSecondsTil / (60 * 60));
	const MinutesTil = Math.floor((TotalSecondsTil / 60) - (HoursTil * 60));
	const SecondsTil = Math.floor(TotalSecondsTil - ((HoursTil * 60 * 60) + (MinutesTil * 60)));

	Counter.textContent = `${String(HoursTil).padStart(2, '0')}:${String(MinutesTil).padStart(2, '0')}:${String(SecondsTil).padStart(2, '0')}`;

	setTimeout(doTimer, 1000);

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
	if (Timeout !== null) {
		addOutput(`Cleared existing period.`);
		clearTimeout(Timeout);
		Timeout = null;
		TimeEnd = null;
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