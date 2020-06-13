import { openDB, IDBPDatabase } from "idb";
import PeriodRecord from "./PeriodRecord";
import Statics from './DbPeriodStatics';
import Period from "../Classes/Period";

type PromiseMaker = () => Promise<any>;

let Db: IDBPDatabase<PeriodRecord>;
let OtherPromises: PromiseMaker[] | null = [];

export default function setUpDbPeriod() {
	return new Promise<IDBPDatabase<PeriodRecord>>(async (resolve) => {
		Db = await getDbPromise();
		await resolveOtherPromises();
		resolve(Db);
	});
};

function getDbPromise() {
	return openDB<PeriodRecord>(Statics.DbName, Statics.DbVersion, {
		upgrade(db, _oldVersion, _newVersion, _transaction) {
			if (_oldVersion < 1) Version1Upgrade(db);
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

async function resolveOtherPromises() {
	if (OtherPromises!.length > 0) {
		for (let i = 0; i < OtherPromises!.length; i++) {
			await OtherPromises![i]();
		}
	}
	OtherPromises = null;
}

async function Version1Upgrade(db: IDBPDatabase<PeriodRecord>) {
	const Store = db.createObjectStore(Statics.DbStoreName, {
		keyPath: Statics.DbKeyPath,
		autoIncrement: true,
	});
	Store.createIndex(Statics.DbIndexName, Statics.DbIndexName);

	OtherPromises!.push(Version1PostUpgrade);
}

async function Version1PostUpgrade() {
	return new Promise(async (resolve) => {
		const msInMinute = 60000;
		await Db.add(Statics.DbStoreName, new Period('Work', 52 * msInMinute, 5 * msInMinute));
		await Db.add(Statics.DbStoreName, new Period('Break', 17 * msInMinute, 3 * msInMinute));
		await Db.add(Statics.DbStoreName, new Period('Test', 2000, 5000));
		resolve();
	});
}