import { IAccount } from "./Account";

export enum TransactionStatus {
	Initiated = "Initiated",
	InProgress = "InProgress",
	Completed = "Completed",
	Reverted = "Reverted",
	Reject = "Reject",
}

export interface IEntityTransaction {
	entityCode: string;
	quantity: number | string;
	quantityUnit: string;
	batchNo: string;
	buyer: string;
	seller: string;
	status: TransactionStatus;
	createdAt: string;
	updatedAt: string;
}

export interface IProductTransaction {
	productCode: string;
	quantity: number | string;
	quantityUnit: string;
	batchNo: string;
	buyer: string;
	seller: string;
	status: TransactionStatus;
	createdAt: string;
	updatedAt: string;
	serialNo: string;
}

export interface IBackTrace {
	productTransaction: IProductTransaction;
	rawEntityTransactions: IEntityTransaction[];
}

export interface IStakeholder {
	supplier: IAccount;
	manufacturer: IAccount;
	distributor: IAccount;
}