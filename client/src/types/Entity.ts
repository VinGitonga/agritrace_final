export interface IRawEntity {
	name: string;
	quantity: number;
	unit: string;
	code: string;
	timestamp: number;
	batchNo: string;
	owner: string;
	buyer: string;
}

export interface IProductEntity {
	name: string;
	code: string;
	quantity: number;
	unit: string;
	batchNo: string;
	timestamp: number;
	owner: string;
	rawEntities: (number | string)[];
}
