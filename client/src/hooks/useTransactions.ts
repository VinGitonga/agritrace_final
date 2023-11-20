import { contractTxWithToast } from "@/components/web3/contractTxWithToast";
import { IContractType } from "@/types/Contracts";
import { IRawEntity } from "@/types/Entity";
import { IEntityTransaction, IProductTransaction } from "@/types/Transaction";
import { contractQuery, decodeOutput, useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
import toast from "react-hot-toast";

const useTransactions = () => {
	const { api, activeAccount, activeSigner } = useInkathon();
	const { contract } = useRegisteredContract(IContractType.TRANSACTIONS);

	const getRawEntityTransactions = async () => {
		if (contract && api && activeAccount) {
			const result = await contractQuery(api, activeAccount?.address, contract, "getEntityPurchaseTransactions");

			const { output, isError, decodedOutput } = decodeOutput(result, contract, "getEntityPurchaseTransactions");

			if (!isError && output) {
				return output as IEntityTransaction[];
			} else {
				console.error(decodedOutput);
				return [] as IEntityTransaction[];
			}
		}
	};

	const initiateSellRawEntity = async (row: IRawEntity) => {
		if (!activeAccount || !activeSigner || !api || !contract) {
			toast.error("Please connect your wallet");
			return;
		}

		try {
			api.setSigner(activeSigner);
			await contractTxWithToast(api, activeAccount?.address, contract, "initiateSellEntity", {}, [row?.code, Number(row?.quantity), row?.unit, row?.batchNo, row?.buyer]);
		} catch (err) {
			toast.error("Something went wrong");
		}
	};

	const getSupplierRawEntityTransactions = async (address?: string) => {
		if (contract && api && activeAccount) {
			const result = await contractQuery(api, activeAccount?.address, contract, "getEntityPurchaseTransactionsBySeller", {}, [address ? address : activeAccount?.address]);

			const { output, isError, decodedOutput } = decodeOutput(result, contract, "getEntityPurchaseTransactionsBySeller");

			if (!isError && output) {
				return output as IEntityTransaction[];
			} else {
				console.error(decodedOutput);
				return [] as IEntityTransaction[];
			}
		}
	};

	const getRawEntitiesPurchaseTransactionsByBuyer = async () => {
		if (contract && api && activeAccount) {
			const result = await contractQuery(api, activeAccount?.address, contract, "getEntityPurchaseTransactionsByBuyer", {}, [activeAccount?.address]);

			const { output, isError, decodedOutput } = decodeOutput(result, contract, "getEntityPurchaseTransactionsByBuyer");

			if (!isError && output) {
				return output as IEntityTransaction[];
			} else {
				console.error(decodedOutput);
				return [] as IEntityTransaction[];
			}
		}
	};

	const getProductPurchaseTransactions = async () => {
		if (contract && api && activeAccount) {
			const result = await contractQuery(api, activeAccount?.address, contract, "getProductPurchaseTransactions");

			const { output, isError, decodedOutput } = decodeOutput(result, contract, "getProductPurchaseTransactions");

			if (!isError && output) {
				return output as IProductTransaction[];
			} else {
				console.error(decodedOutput);
				return [] as IProductTransaction[];
			}
		}
	};

	const getProductPurchaseTransactionsBySeller = async (address?: string) => {
		if (contract && api && activeAccount) {
			const result = await contractQuery(api, activeAccount?.address, contract, "getProductPurchaseTransactionsBySeller", {}, [address ? address : activeAccount?.address]);

			const { output, isError, decodedOutput } = decodeOutput(result, contract, "getProductPurchaseTransactionsBySeller");

			if (!isError && output) {
				return output as IProductTransaction[];
			} else {
				console.error(decodedOutput);
				return [] as IProductTransaction[];
			}
		}
	};

	const getProductPurchaseTransactionsByBuyer = async () => {
		if (contract && api && activeAccount) {
			const result = await contractQuery(api, activeAccount?.address, contract, "getProductPurchaseTransactionsByBuyer", {}, [activeAccount?.address]);

			const { output, isError, decodedOutput } = decodeOutput(result, contract, "getProductPurchaseTransactionsByBuyer");

			if (!isError && output) {
				return output as IProductTransaction[];
			} else {
				console.error(decodedOutput);
				return [] as IProductTransaction[];
			}
		}
	};

	return {
		getRawEntityTransactions,
		initiateSellRawEntity,
		getSupplierRawEntityTransactions,
		getRawEntitiesPurchaseTransactionsByBuyer,
		getProductPurchaseTransactions,
		getProductPurchaseTransactionsBySeller,
		getProductPurchaseTransactionsByBuyer,
	};
};

export default useTransactions;
