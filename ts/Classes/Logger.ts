import { OutputSection } from '../objects/Elements';
import getDisplayTime from '../functions/getDisplayTime';
import DbLogger from '../db/DbLogger';

export default class Logger {
	DbLogger: DbLogger;

	constructor() {
		this.DbLogger = new DbLogger();
		window.addEventListener('storage', async (event) => {
			if (event.key === `wrote-db-${DbLogger.DbName}-${DbLogger.DbStoreName}`) {
				const id = Number(event.newValue);
				const val = await this.DbLogger.getLog(id - 1);
				console.log(id, val);
			}
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
		NewElement.innerHTML = `<span style="color:#bbb;">${getDisplayTime(new Date())}:</span> ` + line;
		OutputSection.prepend(NewElement);
	}
}