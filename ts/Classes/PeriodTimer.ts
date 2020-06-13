import IPeriod from './IPeriod.js';

type updateCallback = (timeToExpire: number, timerDisplay: string, period: IPeriod) => void;
type expireCallback = (period: IPeriod) => void;
type reminderCallback = (timeExpired: number, timerDisplay: string, period: IPeriod) => void;

export default class PeriodTimer {
	Period: IPeriod
	PeriodStart: Date;
	PeriodEnd: Date;
	TimeExpires: number;
	UpdateTimeout: number | null;
	ExpireTimeout: number | null;
	ReminderTimeout: number | null;

	constructor(period: IPeriod, updateCallback?: updateCallback, expireCallback?: expireCallback, reminderCallback?: reminderCallback) {
		this.Period = period;

		this.PeriodStart = new Date();
		this.PeriodEnd = new Date(this.PeriodStart.getTime() + period.LengthMilliseconds);

		this.TimeExpires = this.PeriodEnd.getTime();

		this.UpdateTimeout = null;
		this.ExpireTimeout = null;
		this.ReminderTimeout = null;

		if (typeof updateCallback === 'function') {
			const doUpdateTimeout = () => {
				const TimeToExpire = this.TimeToExpire;
				updateCallback(TimeToExpire, this._timerDisplay(TimeToExpire), period);
				this.UpdateTimeout = self.setTimeout(doUpdateTimeout, 1000);
			};

			doUpdateTimeout();
		}

		if (typeof expireCallback === 'function' || (period.ReminderFrequencyMilliseconds > 0 && typeof reminderCallback === 'function')) {
			this.ExpireTimeout = self.setTimeout(() => {
				if (typeof expireCallback === 'function') {
					expireCallback(period);
				}

				if (period.ReminderFrequencyMilliseconds > 0 && typeof reminderCallback === 'function') {
					const TimeToReminder = period.ReminderFrequencyMilliseconds;
					const doReminderTimeout = () => {
						const TimeExpired = this.TimeToExpire * -1;
						reminderCallback(TimeExpired, this._timerDisplay(TimeExpired), period);
						this.ReminderTimeout = self.setTimeout(doReminderTimeout, TimeToReminder);
					};
					this.ReminderTimeout = self.setTimeout(doReminderTimeout, TimeToReminder);
				}
			}, this.TimeToExpire);
		}

	}

	clearTimer() {
		if (this.UpdateTimeout !== null) {
			clearTimeout(this.UpdateTimeout);
			this.UpdateTimeout = null;
		}
		if (this.ExpireTimeout !== null) {
			clearTimeout(this.ExpireTimeout);
			this.ExpireTimeout = null;
		}
		if (this.ReminderTimeout !== null) {
			clearTimeout(this.ReminderTimeout);
			this.ReminderTimeout = null;
		}
	}

	get TimeToExpire() {
		return this.TimeExpires - new Date().getTime();
	}

	get TimerDisplay() {
		return this._timerDisplay(this.TimeToExpire);
	}

	_timerDisplay(timeTil: number) {
		const IsNegative = timeTil < 0;
		const Sign = IsNegative ? '-' : '';

		const TotalSecondsTil = Math.floor(Math.abs(timeTil) / 1000);

		const HoursTil = Math.floor(TotalSecondsTil / (60 * 60));
		const MinutesTil = Math.floor((TotalSecondsTil / 60) - (HoursTil * 60));
		const SecondsTil = Math.floor(TotalSecondsTil - ((HoursTil * 60 * 60) + (MinutesTil * 60)));

		return `${Sign}${String(HoursTil).padStart(2, '0')}:${String(MinutesTil).padStart(2, '0')}:${String(SecondsTil).padStart(2, '0')}`;
	}
}