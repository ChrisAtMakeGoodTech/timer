// import { openDB, deleteDB, wrap, unwrap } from 'https://unpkg.com/idb?module';

const Statics = {
	DbName: 'TimersDb',
	DbVersion: 2,
	DbStoreName: 'logs',
	DbKeyPath: 'id',
};

let Db;

async function OpenDb() {
	// Db = await openDB(Statics.DbName, Statics.DbVersion, {
	// 	upgrade(db, oldVersion, newVersion, transaction) {
	// 		const Store = db.createObjectStore(Statics.DbStoreName, {
	// 			keyPath: Statics.DbKeyPath,
	// 			autoIncrement: true,
	// 		});
	// 		Store.createIndex('date', 'date');
	// 	},
	// 	blocked() {
	// 		// …
	// 	},
	// 	blocking() {
	// 		// …
	// 	},
	// 	terminated() {
	// 		// …
	// 	},
	// });
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

	async addLog(line) {
		// const id = await Db.add(Statics.DbStoreName, { text: line, date: new Date() });
		// localStorage.setItem(`wrote-db-${Statics.DbName}-${Statics.DbStoreName}`, id);
	}
	async getLog(id) {
		// const val = await Db.get(Statics.DbStoreName, id);
		// console.log(id, val);
		// return val;
	}
}