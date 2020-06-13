import { DBSchema, openDB, deleteDB as _deleteDB, wrap as _wrap, unwrap as _unwrap, IDBPDatabase } from 'idb';
import Reminder from '../helpers/Reminder';

interface IStatics {
	DbName: 'TimersDb';
	DbVersion: number;
	DbStoreName: 'logs';
	DbKeyPath: 'id';
};

const Statics: IStatics = {
	DbName: 'TimersDb',
	DbVersion: 2,
	DbStoreName: 'logs',
	DbKeyPath: 'id',
};

interface LogRecord extends DBSchema {
	'logs': {
		key: number;
		value: {
			date: Date,
			text: string,
		};
		indexes: { 'date': Date };
	};
};

Reminder.Bug('Make sure Db is set before trying to use it.');

let Db: IDBPDatabase<LogRecord>;

async function OpenDb() {
	Db = await openDB<LogRecord>(Statics.DbName, Statics.DbVersion, {
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
		const id = await Db.add(Statics.DbStoreName, { text: line, date: new Date() });
		localStorage.setItem(`wrote-db-${Statics.DbName}-${Statics.DbStoreName}`, String(id));
	}
	async getLog(id: number) {
		return await Db.get(Statics.DbStoreName, id);
	}
};