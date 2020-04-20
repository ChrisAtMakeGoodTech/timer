export default function setUpButtons(periods) {
	periods.forEach((p, i) => {
		const NewButton = document.createElement('button');
		NewButton.textContent = 'Start ' + p;
		NewButton.addEventListener('click', function () {
			navigator.serviceWorker.controller.postMessage({ type: 'startPeriod', index: i });
		});
		StartButtons.appendChild(NewButton);
	});
	{
		const NewButton = document.createElement('button');
		NewButton.textContent = 'Clear Period';
		NewButton.addEventListener('click', function () {
			navigator.serviceWorker.controller.postMessage({ type: 'endCurrentPeriod' });
		});
		StartButtons.appendChild(NewButton);
	}
}