export enum AccountRole {
	Admin = "Admin",
	Supplier = "Supplier",
	Manufacturer = "Manufacturer",
	Distributor = "Distributor",
	Retailer = "Retailer",
	Other = "Other",
}
export interface IAccount {
	name: string;
	phoneNo: string;
	location: string;
	products?: string[];
	address: string;
	timestamp: number;
	role: AccountRole;
}
