import State from './State';
import Logger from '../Classes/Logger';
import { StartButtons, Counter } from './Elements';
import setUpButtons from '../setup/buttons';
import getDisplayTime from '../functions/getDisplayTime';
import PeriodWorker from './PeriodWorker'
import IMessageHandlers from './IMessageHandlers';

const OutputLogger = new Logger();

const MessageHandlers: IMessageHandlers = {
	channelRegistered(_event: MessageEvent) {
		PeriodWorker.postMessage({ type: 'getPeriods' });
	},
	getPeriods(event: MessageEvent) {
		setUpButtons(StartButtons, event.data.periods);
	},
	periodStarted(event: MessageEvent) {
		const ActivePeriodTimer = event.data.timer;
		State.IsActivePeriod = true;
		OutputLogger.addOutput(`${ActivePeriodTimer.Period.Name} period started at ${getDisplayTime(ActivePeriodTimer.PeriodStart)}. Will expire at ${getDisplayTime(ActivePeriodTimer.PeriodEnd)}.`);
	},
	periodEnded(event: MessageEvent) {
		const ActivePeriodTimer = event.data.timer;
		State.IsActivePeriod = false;
		OutputLogger.addOutput(`${ActivePeriodTimer.Period.Name} period has ended.`);
		Counter.textContent = '';
	},
	timerUpdate(event: MessageEvent) {
		// @ts-expect-error
		const { timeToExpire, timerDisplay, period: _period } = event.data;
		const IsNegative = timeToExpire < 0;
		if (IsNegative !== State.TimerIsNegative) {
			State.TimerIsNegative = IsNegative;
			if (State.TimerIsNegative) {
				Counter.classList.add('red-text');
			} else {
				Counter.classList.remove('red-text');
			}
		}

		Counter.textContent = timerDisplay;
	},
	periodExpired(event: MessageEvent) {
		OutputLogger.addOutput(`${event.data.period.Name} period has expired.`);
	},
	periodReminder(_event: MessageEvent) {

	},
};

export default MessageHandlers;