import { PeriodsSection } from '../objects/Elements';
import DbPeriods from '../db/DbPeriods';
import Period from '../Classes/Period';
import getDisplayTimespan from '../functions/getDisplayTimespan';
import StorageEventMessenger from '../objects/StorageEventMessenger';
import Reminder from '../helpers/Reminder';
import IPeriod from '../Classes/IPeriod';
import TimeSpanInputElement from '../WebComponents/TimeSpanInputElement';
import '../WebComponents/TimeSpanInputElement'; // grumble

const Db = new DbPeriods();

function buildHead() {
	const THead = document.createElement('thead');
	THead.innerHTML = '<tr><th>Name</th><th>Length</th><th>Reminder</th><th>Action</th></tr>';
	return THead;
}

function buildBody(periods: IPeriod[]) {
	return periods.map(p => {
		const Row = document.createElement('tr');

		const NameCell = document.createElement('td');
		NameCell.textContent = p.Name;
		const LengthCell = document.createElement('td');
		LengthCell.textContent = getDisplayTimespan(p.LengthMilliseconds);
		const ReminderCell = document.createElement('td');
		ReminderCell.textContent = getDisplayTimespan(p.ReminderFrequencyMilliseconds);
		const DeleteCell = document.createElement('td');
		const DeleteButton = document.createElement('button');
		DeleteButton.textContent = 'Delete';
		DeleteButton.addEventListener('click', () => {
			Db.deletePeriod(p.id!);
		});
		DeleteCell.append(DeleteButton);

		Row.append(NameCell);
		Row.append(LengthCell);
		Row.append(ReminderCell);
		Row.append(DeleteCell);

		return Row;
	});
}

const TableBody = document.createElement('tbody');

async function renderView() {
	const PeriodsTablePromise = renderPeriods();

	const PeriodsTable = document.createElement('table');

	PeriodsTable.append(buildHead());
	PeriodsTable.append(TableBody);
	PeriodsTable.append(renderAddPeriodSection());

	await PeriodsTablePromise;

	PeriodsSection.innerHTML = '';
	PeriodsSection.append(PeriodsTable);
}

function renderAddPeriodSection() {
	const TableFoot = document.createElement('tfoot');

	const AddRow = document.createElement('tr');

	const NameCell = document.createElement('th');
	const NameInput = document.createElement('input');
	NameCell.append(NameInput);

	const LengthCell = document.createElement('th');
	const LengthInput = <TimeSpanInputElement>document.createElement('input', { is: 'input-timespan' });
	LengthCell.append(LengthInput);

	const ReminderCell = document.createElement('th');
	const ReminderInput = <TimeSpanInputElement>document.createElement('input', { is: 'input-timespan' });
	ReminderCell.append(ReminderInput);

	const ButtonCell = document.createElement('th');
	const AddButton = document.createElement('button');
	AddButton.type = 'button';
	AddButton.textContent = 'Add New Period';
	ButtonCell.append(AddButton);

	Reminder.Todo("Probably shouldn't need to set a reminder.");
	AddButton.addEventListener('click', () => {
		if (NameInput.value.length > 0 && LengthInput.valueInMilliseconds && ReminderInput.valueInMilliseconds) {
			Db.addPeriod(new Period(NameInput.value, LengthInput.valueInMilliseconds, ReminderInput.valueInMilliseconds));
		}
	});

	AddRow.append(NameCell);
	AddRow.append(LengthCell);
	AddRow.append(ReminderCell);
	AddRow.append(ButtonCell);

	TableFoot.append(AddRow);
	return TableFoot;
}

async function renderPeriods() {
	const Periods = await Db.getAllPeriods();
	const Rows = buildBody(Periods);

	TableBody.innerHTML = '';
	TableBody.append(...Rows);
}

export default function setUpPeriodView() {
	renderView();
	StorageEventMessenger.addEventListener('Period_Add', renderPeriods);
	StorageEventMessenger.addEventListener('Period_Edit', renderPeriods);
	StorageEventMessenger.addEventListener('Period_Remove', renderPeriods);
	Reminder.Bug('These will re-render in the middle of an edit.');
}