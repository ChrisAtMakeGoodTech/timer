import { DBSchema } from 'idb';
import IPeriod from '../Classes/IPeriod';
export default interface PeriodRecord extends DBSchema {
	'periods': {
		key: number;
		value: IPeriod;
		indexes: { 'Name': string; };
	};
}
