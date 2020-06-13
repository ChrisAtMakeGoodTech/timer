export default interface IPeriod {
	readonly id?: number;
	readonly Name: string;
	readonly LengthMilliseconds: number;
	readonly ReminderFrequencyMilliseconds: number;
}