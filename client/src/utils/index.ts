import { IOption } from "@/components/forms/CustomFormControl";
import { IAccount } from "@/types/Account";
import { IProductEntity, IRawEntity } from "@/types/Entity";
import { IBackTrace, IEntityTransaction, IProductTransaction } from "@/types/Transaction";
import { customAlphabet } from "nanoid";

export const truncateHash = (hash: string | undefined, paddingLength: number = 6): string => {
	if (!hash?.length) return "";
	if (hash?.length <= paddingLength * 2 + 1) return hash;

	return hash.replace(hash.substring(paddingLength, hash?.length - paddingLength), "...");
};

export const generateNumbers = (size: number = 14): number => {
	const nanoid = customAlphabet("1234567890", size);
	return parseInt(nanoid());
};

// Checks whether a given raw material is in tranactions

export function checkRawMaterialInTransactions(entities: IEntityTransaction[], batchNo: string) {
	let isPresent = false;
	entities.forEach((entity) => {
		if (entity.batchNo === batchNo) {
			isPresent = true;
		}
	});
	return isPresent;
}

export const concatRawMaterials = (rawMaterials: IRawEntity[]): IOption[] => {
	return rawMaterials.map((rawMaterial) => ({
		value: rawMaterial.batchNo,
		label: `${rawMaterial.name} - ${rawMaterial.batchNo}`,
	}));
};

export function checkProductInTransactions(productSale: IProductTransaction[], productCode: string) {
	let isPresent = false;
	productSale.forEach((product) => {
		if (product.productCode === productCode) {
			isPresent = true;
		}
	});
	return isPresent;
}

// Validate the if the product status is Initiated or InProgress for a given productCode
export const validateProductStatus = (productSale: IProductTransaction[], productCode: string): boolean => {
	let isValid = false;
	productSale.forEach((product) => {
		if (product.productCode === productCode && (product.status === "Initiated" || product.status === "InProgress" || product.status === "Completed")) {
			isValid = true;
		}
	});
	return isValid;
};

export const convertFixU64ToNum = (str: string) => {
	const newStr = String(str).replace(/,/g, "");
	return parseInt(newStr);
};

export const consolidateBackTrace = (products_transactions: IProductTransaction[], entity_transactions: IEntityTransaction[], product_serial_no: string) => {
	// fetch product sale item using its serial no
	const productSaleItem = products_transactions.find((product) => product.serialNo === product_serial_no);

	// get all the batch nos from the product sale
	const productProductionBatchNos = (productSaleItem.batchNo as string[]).map((batchNo) => String(convertFixU64ToNum(batchNo)));

	const entities_batch_nos = entity_transactions.map((entity) => String(convertFixU64ToNum(entity.batchNo)));

	// get all the entities that have the same batch no as the product sale
	const valid_entities = entities_batch_nos && entities_batch_nos.filter((batchNo) => productProductionBatchNos.includes(batchNo));

	// using valid entities, get the entity transactions
	const valid_entity_transactions = entity_transactions.filter((entity) => valid_entities.includes(String(convertFixU64ToNum(entity.batchNo))));

	const backtrace: IBackTrace = {
		productTransaction: productSaleItem,
		rawEntityTransactions: valid_entity_transactions,
	};

	return backtrace;
};

export const mapEntityCodetoRawEntity = (rawEntities: IRawEntity[], code: string) => {
	return rawEntities.find((rawEntity) => rawEntity.code === code);
};

export const mapAddressToAccount = (accounts: IAccount[], address: string) => {
	return accounts.find((account) => account.address === address);
};

export const mapBatchNoToRawEntity = (rawEntities: IRawEntity[], batchNo: string) => {
	return rawEntities.find((rawEntity) => String(convertFixU64ToNum(rawEntity.batchNo)) === batchNo);
};

export const mapCodeToProductEntity = (productEntities: IProductEntity[], code: string) => {
	return productEntities.find((productEntity) => productEntity.code === code);
};
