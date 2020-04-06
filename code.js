import Period from './Period.js';
import setupNotifications from './setupNotifications.js';

setupNotifications();

const OutputSection = document.getElementById('output');
const StartButtons = document.getElementById('start-buttons');

const msInMinute = 60000;
const Periods = [
	new Period('Work', 52 * msInMinute),
	new Period('Break', 17 * msInMinute),
];

let Timeout = null;

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
	});
	StartButtons.appendChild(NewButton);
});

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