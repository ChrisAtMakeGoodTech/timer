import { DBSchema, openDB, deleteDB as _deleteDB, wrap as _wrap, unwrap as _unwrap, IDBPDatabase } from 'idb';

interface IStatics {
	DbName: 'TimersDb';
	DbVersion: number;
	DbStoreName: 'logs';
	DbKeyPath: 'id';
	DbIndexName: 'date';
};

const Statics: IStatics = {
	DbName: 'TimersDb',
	DbVersion: 2,
	DbStoreName: 'logs',
	DbKeyPath: 'id',
	DbIndexName: 'date',
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

let DbPromise: Promise<IDBPDatabase<LogRecord>> | null = openDB<LogRecord>(Statics.DbName, Statics.DbVersion, {
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

let Db: IDBPDatabase<LogRecord>;

async function OpenDb() {
	Db = await DbPromise!;
	DbPromise = null;
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
		if (DbPromise) await DbPromise;
		const id = await Db.add(Statics.DbStoreName, { text: line, date: new Date() });
		localStorage.setItem(`wrote-db-${Statics.DbName}-${Statics.DbStoreName}`, String(id));
	}
	async getLog(id: number) {
		if (DbPromise) await DbPromise;
		return await Db.get(Statics.DbStoreName, id);
	}
};