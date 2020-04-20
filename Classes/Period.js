export default class Period {
	/**
	 * 
	 * @param {string} name
	 * @param {number} lengthMilliseconds
	 * @param {number} [reminderFrequencyMilliseconds=0]
	 */
	constructor(name, lengthMilliseconds, reminderFrequencyMilliseconds = 0) {
		if (lengthMilliseconds <= 0) throw new Error('lengthMilliseconds must be greater than 0.');
		if (reminderFrequencyMilliseconds < 0) throw new Error('reminderFrequencyMilliseconds must be 0 or greater.');

		this.Name = name;
		this.LengthMilliseconds = lengthMilliseconds;
		this.ReminderFrequencyMilliseconds = Math.max(0, reminderFrequencyMilliseconds ?? 0);
	}
}