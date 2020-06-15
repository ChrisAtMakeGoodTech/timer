import { PeriodsSection } from '../objects/Elements';
import DbPeriods from '../db/DbPeriods';
import Period from '../Classes/Period';
import getDisplayTimespan from '../functions/getDisplayTimespan';

const Db = new DbPeriods();

function buildHead() {
	const THead = document.createElement('thead');
	THead.innerHTML = '<tr><th>Name</th><th>Length</th><th>Reminder</th></tr>';
	return THead;
}

function buildBody(periods: Period[]) {
	const TBody = document.createElement('tbody');

	periods.forEach(p => {
		const Row = document.createElement('tr');

		const NameCell = document.createElement('td');
		NameCell.textContent = p.Name;
		const LengthCell = document.createElement('td');
		LengthCell.textContent = getDisplayTimespan(p.LengthMilliseconds);
		const ReminderCell = document.createElement('td');
		ReminderCell.textContent = getDisplayTimespan(p.ReminderFrequencyMilliseconds);

		Row.append(NameCell);
		Row.append(LengthCell);
		Row.append(ReminderCell);
		TBody.append(Row);
	});

	return TBody;
}

export default async function setUpPeriodView() {
	const PeriodsPromise = Db.getAllPeriods();
	const Table = document.createElement('table');
	const THead = buildHead();
	Table.append(THead);
	const Periods = await PeriodsPromise;
	const TBody = buildBody(Periods);
	Table.append(TBody);

	PeriodsSection.innerHTML = '';
	PeriodsSection.append(Table);
}