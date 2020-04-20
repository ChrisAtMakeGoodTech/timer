import { OutputSection } from '../objects/Elements.js';
import getDisplayTime from '../functions/getDisplayTime.js';
import DbLogger from './DbLogger.js';


export default class Logger {
	constructor() {
		this.DbLogger = new DbLogger();
		window.addEventListener('storage', async (event) => {
			if (event.key === `wrote-db-${DbLogger.DbName}-${DbLogger.DbStoreName}`) {
				const id = event.newValue;
				const val = await this.DbLogger.getLog(id - 1);
				console.log(id, val);
			}
		});
	}
	async addOutput(...lines) {
		lines.forEach(async (l) => {
			this._displayOutput(l);
			await this.DbLogger.addLog(l);
		});
	}
	_displayOutput(line) {
		const NewElement = document.createElement('div');
		NewElement.innerHTML = `<span style="color:#777777;">${getDisplayTime(new Date())}:</span> ` + line;
		OutputSection.prepend(NewElement);
	}
}