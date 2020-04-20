import {OutputSection} from '../objects/Elements.js';
import getDisplayTime from '../functions/getDisplayTime.js';

export default class Logger {
	addOutput(...lines) {
		lines.forEach(l => {
			const NewElement = document.createElement('div');
			NewElement.innerHTML = `<span style="color:#777777;">${getDisplayTime(new Date())}:</span> ` + l;
			OutputSection.prepend(NewElement);
		});
	}
}