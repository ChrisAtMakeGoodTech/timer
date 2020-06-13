import { openDB, deleteDB as _deleteDB, wrap as _wrap, unwrap as _unwrap, IDBPDatabase } from 'idb';
import Reminder from '../helpers/Reminder';

const Statics = {
	DbName: 'TimersDb',
	DbVersion: 2,
	DbStoreName: 'logs',
	DbKeyPath: 'id',
};

Reminder.Bug('Make sure Db is set before trying to use it.');

let Db: IDBPDatabase;

async function OpenDb() {
	Db = await openDB(Statics.DbName, Statics.DbVersion, {
		upgrade(db, _oldVersion, _newVersion, _transaction) {
			const Store = db.createObjectStore(Statics.DbStoreName, {
				keyPath: Statics.DbKeyPath,
				autoIncrement: true,
			});
			Store.createIndex('date', 'date');
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

export default class DbLogger {
	static get DbName() {
		return Statics.DbName;
	}
	static get DbStoreName() {
		return Statics.DbStoreName;
	}
	static get DbKeyPath() {
		return Statics.DbKeyPath;
	}

	async addLog(line: string) {
		const id = <string>await Db!.add(Statics.DbStoreName, { text: line, date: new Date() });
		localStorage.setItem(`wrote-db-${Statics.DbName}-${Statics.DbStoreName}`, id);
	}
	async getLog(id: number) {
		const val = await Db!.get(Statics.DbStoreName, id);
		console.log(id, val);
		return val;
	}
}