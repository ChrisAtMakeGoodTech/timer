import PeriodWorker from '../objects/PeriodWorker';
import StorageEventMessenger from '../objects/StorageEventMessenger';

function fetchPeriods() {
	PeriodWorker.postMessage({ type: 'getPeriods' });
}

export default function setUpStorageListener() {
	StorageEventMessenger.addEventListener('Period_Add', fetchPeriods);
	StorageEventMessenger.addEventListener('Period_Remove', fetchPeriods);
	StorageEventMessenger.addEventListener('Period_Edit', fetchPeriods);
};