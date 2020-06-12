import PeriodWorker from '../objects/PeriodWorker.js'

type MessageHandler = (event:MessageEvent) => void;

export default function setUpChannel(messageHandler: MessageHandler) {
	PeriodWorker.addEventListener('message', messageHandler);
	PeriodWorker.postMessage({ type: 'getPeriods' });
}