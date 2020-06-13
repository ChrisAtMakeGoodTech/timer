import { DBSchema, openDB, deleteDB as _deleteDB, wrap as _wrap, unwrap as _unwrap, IDBPDatabase } from 'idb';
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

let DbPromise: Promise<IDBPDatabase<PeriodRecord>> | null = openDB<PeriodRecord>(Statics.DbName, Statics.DbVersion, {
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

let Db: IDBPDatabase<PeriodRecord>;

async function OpenDb() {
	Db = await DbPromise!;
	DbPromise = null;
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
		if (DbPromise) await DbPromise;
		return await Db.add(Statics.DbStoreName, period);
	}
	async getPeriodById(id: number) {
		if (DbPromise) await DbPromise;
		return await Db.get(Statics.DbStoreName, id);
	}
	async getPeriodByName(name: string) {
		if (DbPromise) await DbPromise;
		return await Db.getFromIndex(Statics.DbStoreName, Statics.DbIndexName, name);
	}
};