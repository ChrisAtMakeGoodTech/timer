import Reminder from "../helpers/Reminder";
import ITimespan from "./ITimespan";

const MsPerSecond = 1000;
const MsPerMinute = MsPerSecond * 60;
const MsPerHour = MsPerMinute * 60;
const MsPerDay = MsPerHour * 24;

Reminder.Todo('Negative timespans?');
Reminder.Todo('toString format options');

export default class Timespan implements ITimespan {
	readonly TotalMilliseconds: number;

	readonly Milliseconds: number;
	readonly Seconds: number;
	readonly Minutes: number;
	readonly Hours: number;
	readonly Days: number;

	constructor(spanInMilliseconds: number) {
		let MsRemaining = spanInMilliseconds | 0;
		this.TotalMilliseconds = MsRemaining;

		this.Days = (MsRemaining / MsPerDay) | 0;
		MsRemaining -= this.Days * MsPerDay;

		this.Hours = (MsRemaining / MsPerHour) | 0;
		MsRemaining -= this.Hours * MsPerHour;

		this.Minutes = (MsRemaining / MsPerMinute) | 0;
		MsRemaining -= this.Minutes * MsPerMinute;

		this.Seconds = (MsRemaining / MsPerSecond) | 0;
		MsRemaining -= this.Seconds * MsPerSecond;

		this.Milliseconds = MsRemaining;
	}

	toString() {
		let result = '';
		if (this.Hours > 0) result += this.Hours + ':';
		result += String(this.Minutes).padStart(2, '0');
		result += String(this.Seconds).padStart(2, '0');
		return result;
	}

	static CreateTimespan(from: ITimespan) {
		const Milliseconds =
			MsPerDay * (from.Days ?? 0) +
			MsPerHour * (from.Hours ?? 0) +
			MsPerMinute * (from.Minutes ?? 0) +
			MsPerSecond * (from.Seconds ?? 0) +
			(from.Milliseconds ?? 0)
		return new Timespan(Milliseconds);
	}
}