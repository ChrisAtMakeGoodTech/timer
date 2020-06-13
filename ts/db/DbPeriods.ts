import { DBSchema, openDB, deleteDB as _deleteDB, wrap as _wrap, unwrap as _unwrap, IDBPDatabase } from 'idb';
import Reminder from '../helpers/Reminder';
import Period from '../Classes/Period';

interface IStatics {
	DbName: 'PeriodsDb';
	DbVersion: number;
	DbStoreName: 'periods';
	DbKeyPath: 'id';
	DbIndexName: 'name';
};

const Statics: IStatics = {
	DbName: 'PeriodsDb',
	DbVersion: 0,
	DbStoreName: 'periods',
	DbKeyPath: 'id',
	DbIndexName: 'name',
};

interface PeriodRecord extends DBSchema {
	'periods': {
		key: number;
		value: Period;
		indexes: { 'name': string };
	};
};

Reminder.Bug('Make sure Db is set before trying to use it.');

let Db: IDBPDatabase<PeriodRecord>;

async function OpenDb() {
	Db = await openDB<PeriodRecord>(Statics.DbName, Statics.DbVersion, {
		upgrade(db, _oldVersion, _newVersion, _transaction) {
			const Store = db.createObjectStore(Statics.DbStoreName, {
				keyPath: Statics.DbKeyPath,
				autoIncrement: true,
			});
			Store.createIndex(Statics.DbIndexName, Statics.DbIndexName);
		},
		blocked() {
			// …
		},
		blocking() {
			// …
		},
		terminated() {
			// …
		},
	});
}

OpenDb();

export default class DbPeriods {
	static get DbName() {
		return Statics.DbName;
	}
	static get DbStoreName() {
		return Statics.DbStoreName;
	}
	static get DbKeyPath() {
		return Statics.DbKeyPath;
	}

	async addPeriod(period: Period) {
		return await Db.add(Statics.DbStoreName, period);
	}
	async getPeriodById(id: number) {
		return await Db.get(Statics.DbStoreName, id);
	}
	async getPeriodByName(name: string) {
		return await Db.getFromIndex(Statics.DbStoreName, Statics.DbIndexName, name);
	}
};