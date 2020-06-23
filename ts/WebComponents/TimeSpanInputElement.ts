import Timespan from "../Classes/Timespan";
import Reminder from "../helpers/Reminder";

Reminder.Bug(`Clicking when not focused doesn't select the correct section.`)

const ValueRegex = /^[0-9]{2}:[0-9]{2}:[0-9]{2}$/;
const PartialValueRegex = /^[0-9]{2}:[0-9]{2}:[0-9]{2}$/;
const NumberRegex = /^[0-9]+$/;

type TimePart = 'h' | 'm' | 's';
type SelectedPart = TimePart | undefined;

enum FocusDirection {
	Left,
	Right,
	TabLeft,
	TabRight,
}

const PartMaxValue = 59;

class TimeSpanInputElement extends HTMLInputElement {
	static clickListener(this: TimeSpanInputElement, _event: MouseEvent) {
		this.#IgnoreFocus = true;
		const SelectionIndex = this.selectionDirection === 'backward' ? this.selectionEnd! : this.selectionStart!;
		let selected: SelectedPart;
		if (SelectionIndex < 3) {
			selected = 'h';
		} else if (SelectionIndex < 6) {
			selected = 'm';
		} else {
			selected = 's';
		}
		setTimeout(() => {
			this.setFocus(selected);
			this.#IgnoreFocus = false;
		}, 0);
	}

	static focusListener(this: TimeSpanInputElement, ev: FocusEvent): undefined | void {
		if (this.#IgnoreFocus) return undefined;
		const NextFocus =
			ev.relatedTarget !== null && ev.relatedTarget instanceof Node && (this.compareDocumentPosition(ev.relatedTarget) & 4) === 4
				? 's'
				: 'h';
		this.setFocus(NextFocus);
	}

	static keydownListener(this: TimeSpanInputElement, ev: KeyboardEvent): boolean | void {
		const selected = this.handleKey(ev);
		if (selected) {
			ev.preventDefault();
			return false;
		}
	}

	#IgnoreFocus = false;

	#Selected: SelectedPart;
	#LastValue: string;
	#LastDigit: number | undefined;
	constructor() {
		super();

		this.#LastValue = this.value;

		if (NumberRegex.test(this.#LastValue)) {
			this.value = (new Timespan(this.valueAsNumber)).toString();
			this.#LastValue = this.value;
		} else if (!PartialValueRegex.test(this.#LastValue)) {
			this.value = 'hh:mm:ss';
			this.#LastValue = this.value;
		}

		// @ts-expect-error
		this.addEventListener('keydown', TimeSpanInputElement.keydownListener);

		// @ts-expect-error
		this.addEventListener('focus', TimeSpanInputElement.focusListener);

		// @ts-expect-error
		this.addEventListener('click', TimeSpanInputElement.clickListener);

	}

	private handleKey(ev: KeyboardEvent) {
		const LastDigit = this.#LastDigit;
		this.#LastDigit = undefined;

		switch (ev.key) {
			case 'ArrowLeft': return this.moveFocus(FocusDirection.Left);
			case 'ArrowRight': return this.moveFocus(FocusDirection.Right);
			case 'Tab': return this.moveFocus(ev.shiftKey ? FocusDirection.TabLeft : FocusDirection.TabRight);
			case 'ArrowUp': return this.incrementPart(this.#Selected!), this.setFocus(this.#Selected), this.#Selected;
			case 'ArrowDown': return this.decrementPart(this.#Selected!), this.setFocus(this.#Selected), this.#Selected;

			case 'Delete': case 'Backspace':
				return this.setPartValue(this.#Selected!, NaN), this.setFocus(this.#Selected), this.#Selected;

			case '1': case '2': case '3': case '4': case '5':
			case '6': case '7': case '8': case '9': case '0':
				return this.handleDigitPress(Number(ev.key), LastDigit);

			default: return undefined;
		}
	}

	private handleDigitPress(digit: number, lastDigit?: number) {
		this.#LastDigit = digit;
		const Selected = this.#Selected!;

		if (lastDigit !== undefined) {
			const NewValue = Math.min(PartMaxValue, lastDigit * 10 + digit);
			this.setPartValue(Selected, NewValue);

			return Selected === 's' ? this.setFocus(Selected) : this.moveFocus(FocusDirection.Right);
		}

		if (digit >= 6 && Selected !== 's') {
			this.setPartValue(Selected, digit);
			return this.moveFocus(FocusDirection.Right);
		}

		this.setPartValue(Selected, digit);
		return this.setFocus(Selected);
	}

	incrementPart(part: TimePart) {
		const oldPartValue = this.getPartValue(part);
		if (oldPartValue === undefined) return;
		const NewPartValue =
			Number.isNaN(oldPartValue) || oldPartValue === PartMaxValue
				? 0
				: oldPartValue + 1;
		this.setPartValue(part, NewPartValue);
		return undefined;
	}

	decrementPart(part: TimePart) {
		const oldPartValue = this.getPartValue(part);
		const NewPartValue =
			Number.isNaN(oldPartValue) || oldPartValue === 0
				? PartMaxValue
				: oldPartValue - 1;
		this.setPartValue(part, NewPartValue);
		return undefined;
	}

	private getPartValue(part: TimePart) {
		switch (part) {
			case 'h': return Number(this.value.substring(0, 2));
			case 'm': return Number(this.value.substring(3, 5));
			case 's': return Number(this.value.substring(6, 8));
		}
	}

	private setPartValue(part: TimePart, newValue: number) {
		const NewValue =
			!Number.isNaN(newValue)
				? String(newValue).padStart(2, '0')
				: part + part;

		switch (part) {
			case 'h': return this.value = NewValue + this.value.substring(2);
			case 'm': return this.value = this.value.substring(0, 3) + NewValue + this.value.substring(5);
			case 's': return this.value = this.value.substring(0, 6) + NewValue;
		}
	}

	moveFocus(direction: FocusDirection) {
		this.#LastDigit = undefined;
		const NewFocus = this.getNewFocus(direction);
		if (NewFocus) {
			setTimeout(() => { this.setFocus(NewFocus) }, 0);
		}
		return NewFocus;
	}

	private getNewFocus(direction: FocusDirection): SelectedPart {
		switch (direction) {
			case FocusDirection.Left: return this.#Selected === 's' ? 'm' : 'h';
			case FocusDirection.Right: return this.#Selected === 'h' ? 'm' : 's';
			case FocusDirection.TabLeft: return this.#Selected === 'h' ? undefined : this.getNewFocus(FocusDirection.Left);
			case FocusDirection.TabRight: return this.#Selected === 's' ? undefined : this.getNewFocus(FocusDirection.Right);
		}
	}

	setFocus(selected: SelectedPart) {
		this.#Selected = selected;
		switch (selected) {
			case 'h': return this.setSelectionRange(0, 2, 'forward'), selected;
			case 'm': return this.setSelectionRange(3, 5, 'forward'), selected;
			case 's': return this.setSelectionRange(6, 8, 'forward'), selected;
			default: return this.blur(), selected;
		}
	}

	get valueInMilliseconds() {
		const Value = this.value;
		if (!ValueRegex.test(Value)) return undefined;
		const Values = Value.split(':');
		const Milliseconds =
			Number(Values[0]) * 1000 * 60 * 60 +
			Number(Values[1]) * 1000 * 60 +
			Number(Values[2]) * 1000;
		return Milliseconds;
	}
}

customElements.define('input-timespan', TimeSpanInputElement, { extends: 'input' });

export default TimeSpanInputElement;