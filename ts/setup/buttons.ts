import PeriodWorker from '../objects/PeriodWorker'
import IPeriod from '../Classes/IPeriod';

export default function setUpButtons(buttonContainer: HTMLElement, periods: IPeriod[]) {
	buttonContainer.innerHTML = '';
	periods.forEach((p) => {
		const NewButton = document.createElement('button');
		NewButton.textContent = 'Start ' + p.Name;
		NewButton.addEventListener('click', function () {
			PeriodWorker.postMessage({ type: 'startPeriod', index: p.id });
		});
		buttonContainer.appendChild(NewButton);
	});
	{
		const NewButton = document.createElement('button');
		NewButton.textContent = 'Clear Period';
		NewButton.addEventListener('click', async function () {
			PeriodWorker.postMessage({ type: 'endCurrentPeriod' });
		});
		buttonContainer.appendChild(NewButton);
	}
}