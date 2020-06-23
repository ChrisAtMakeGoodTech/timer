import { LogSection } from '../objects/Elements';
import getDisplayTime from '../functions/getDisplayTime';
import DbLogger from '../db/DbLogger';
import StorageEventMessenger from '../objects/StorageEventMessenger';

export default class Logger {
	DbLogger: DbLogger;

	constructor() {
		this.DbLogger = new DbLogger();
		StorageEventMessenger.addEventListener('Log_Write', async (newValue: string) => {
			const id = Number(newValue);
			await this.DbLogger.getLog(id - 1);
		});
	}
	async addOutput(...lines: string[]) {
		lines.forEach(async (l) => {
			this._displayOutput(l);
			await this.DbLogger.addLog(l);
		});
	}
	_displayOutput(line: string) {
		const NewElement = document.createElement('div');
		NewElement.innerHTML = `<span class="log-timestamp">${getDisplayTime(new Date())}:</span> ` + line;
		LogSection.prepend(NewElement);
	}
}