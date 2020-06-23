type LogSubscriptionsTypes = 'Log_Write';
type PeriodSubscriptionsTypes = 'Period_Add' | 'Period_Remove' | 'Period_Edit';
type StorageSubscriptionTypes = LogSubscriptionsTypes | PeriodSubscriptionsTypes;

type StorageCallback = (newValue: string) => void;

const Subscriptions = new Map<StorageSubscriptionTypes, StorageCallback[]>();

const StorageEventKeyPrefix = 'StorageEvent--';
const PrefixLength = StorageEventKeyPrefix.length;

addEventListener('storage', async (event: StorageEvent) => {
	if (!event.key || event.newValue === null) return;

	if (event.key.startsWith(StorageEventKeyPrefix)) {
		const Key = <StorageSubscriptionTypes>(event.key.substring(PrefixLength));
		runCallbacks(Key, event.newValue);
	}
});

function getOrAddSubscriptions(event: StorageSubscriptionTypes) {
	const ExistingSubs = Subscriptions.get(event);
	if (ExistingSubs) return ExistingSubs;

	const NewSubs: StorageCallback[] = [];
	Subscriptions.set(event, NewSubs);
	return NewSubs;
}

function runCallbacks(event: StorageSubscriptionTypes, newValue: string) {
	const EventSubscriptions = event && Subscriptions.get(event);
	if (EventSubscriptions) {
		EventSubscriptions.forEach(cb => {
			cb(newValue);
		});
	}
}

const StorageEventMessenger = {
	addEventListener(event: StorageSubscriptionTypes, listener: StorageCallback) {
		const EventSubs = getOrAddSubscriptions(event);
		if (!EventSubs.includes(listener)) {
			EventSubs.push(listener);
		}
	},
	removeEventListener(event: StorageSubscriptionTypes, listener: StorageCallback) {
		const EventSubs = getOrAddSubscriptions(event);
		const Index = EventSubs.indexOf(listener);
		if (Index !== -1) EventSubs.splice(Index, 1);
	},
	dispatchEvent(event: StorageSubscriptionTypes, newValue: string) {
		runCallbacks(event, newValue);
		localStorage.setItem(StorageEventKeyPrefix + event, newValue);
	},
};

Object.freeze(StorageEventMessenger);

export default StorageEventMessenger;