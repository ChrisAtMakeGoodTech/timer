import { IDBPDatabase } from 'idb';
import PeriodRecord from './PeriodRecord';
import Statics from './DbPeriodStatics';
import setUpDbPeriod from './setupDbPeriod';
import IPeriod from '../Classes/IPeriod';

let DbPromise: Promise<IDBPDatabase<PeriodRecord>> | null = setUpDbPeriod();

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

	async addPeriod(period: IPeriod) {
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
	async getAllPeriods() {
		if (DbPromise) await DbPromise;
		return await Db.getAll(Statics.DbStoreName);
	}
};