export default function getDisplayTimespan(milliseconds: number, showAll = false) {
	const IsNegative = milliseconds < 0;
	const Sign = IsNegative ? '-' : '';

	const TotalSeconds = Math.floor(Math.abs(milliseconds) / 1000);

	const Hours = Math.floor(TotalSeconds / (60 * 60));
	const Minutes = Math.floor((TotalSeconds / 60) - (Hours * 60));
	const Seconds = Math.floor(TotalSeconds - ((Hours * 60 * 60) + (Minutes * 60)));

	const HoursDisplay =
		showAll || Hours > 0
			? String(Hours).padStart(2, '0') + ':'
			: '';
	const MinutesDisplay = String(Minutes).padStart(2, '0') + ':';
	const SecondsDisplay = String(Seconds).padStart(2, '0');

	return `${Sign}${HoursDisplay}${MinutesDisplay}${SecondsDisplay}`;
}
