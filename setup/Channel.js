import PeriodWorker from '../objects/PeriodWorker.js'

export default function setUpChannel(messageHandler) {
	PeriodWorker.addEventListener('message', messageHandler);
	PeriodWorker.postMessage({ type: 'getPeriods' });
}