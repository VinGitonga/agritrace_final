import { IContractType } from "@/types/Contracts";
import { IProductEntity, IRawEntity } from "@/types/Entity";
import { contractQuery, decodeOutput, useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
import { useCallback } from "react";

const useEntity = () => {
	const { api, activeAccount } = useInkathon();
	const { contract } = useRegisteredContract(IContractType.EntityRegistry);
	const getRawEntities = useCallback(async () => {
		if (contract && api && activeAccount) {
			const result = await contractQuery(api, activeAccount?.address, contract, "getRawEntitiesByOwner", {}, [activeAccount?.address]);

			const { output, isError, decodedOutput } = decodeOutput(result, contract, "getRawEntitiesByOwner");

			if (!isError && output) {
				return output as IRawEntity[];
			} else {
				console.error(decodedOutput);
				return [] as IRawEntity[];
			}
		}
	}, [api, contract, activeAccount]);

	const getRawEntitiesByBuyer = useCallback(
		async (buyer: string) => {
			if (contract && api && activeAccount) {
				const result = await contractQuery(api, activeAccount?.address, contract, "getRawEntitiesByBuyer", {}, [buyer]);

				const { output, isError, decodedOutput } = decodeOutput(result, contract, "getRawEntitiesByBuyer");

				if (!isError && output) {
					return output as IRawEntity[];
				} else {
					console.error(decodedOutput);
					return [] as IRawEntity[];
				}
			}
		},
		[activeAccount, api, contract]
	);

	const getMyProductEntities = useCallback(async () => {
		if (contract && api && activeAccount) {
			const result = await contractQuery(api, activeAccount?.address, contract, "getProductEntitiesByOwner", {}, [activeAccount?.address]);

			const { output, isError, decodedOutput } = decodeOutput(result, contract, "getProductEntitiesByOwner");

			if (!isError && output) {
				return output as IProductEntity[];
			} else {
				console.error(decodedOutput);
				return [] as IProductEntity[];
			}
		}
	}, [contract, api, activeAccount]);

	const getProductEntity = useCallback(
		async (productCode: string) => {
			if (contract && api && activeAccount) {
				const result = await contractQuery(api, activeAccount?.address, contract, "getProductEntityByCode", {}, [productCode]);

				const { output, isError, decodedOutput } = decodeOutput(result, contract, "getProductEntityByCode");

				if (!isError && output) {
					return output as IProductEntity;
				} else {
					console.error(decodedOutput);
					return {} as IProductEntity;
				}
			}
		},
		[contract, api, activeAccount]
	);

	const getRawEntitiesByBatchNos = useCallback(
		async (batchNos: number[]) => {
			if (contract && api && activeAccount) {
				const result = await contractQuery(api, activeAccount?.address, contract, "getRawEntitiesByBatchNos", {}, [batchNos]);

				const { output, isError, decodedOutput } = decodeOutput(result, contract, "getRawEntitiesByBatchNos");

				if (!isError && output) {
					return output as IRawEntity[];
				} else {
					console.error(decodedOutput);
					return [] as IRawEntity[];
				}
			}
		},
		[contract, api, activeAccount]
	);

	const getAllRawEntities = useCallback(async () => {
		if (contract && api && activeAccount) {
			const result = await contractQuery(api, activeAccount?.address, contract, "getAllRawEntities", {}, []);

			const { output, isError, decodedOutput } = decodeOutput(result, contract, "getAllRawEntities");

			if (!isError && output) {
				return output as IRawEntity[];
			} else {
				console.error(decodedOutput);
				return [] as IRawEntity[];
			}
		}
	}, [contract, api, activeAccount]);

	const getAllProductEntities = useCallback(async () => {
		if (contract && api && activeAccount) {
			const result = await contractQuery(api, activeAccount?.address, contract, "getAllProductEntities", {}, []);

			const { output, isError, decodedOutput } = decodeOutput(result, contract, "getAllProductEntities");

			if (!isError && output) {
				return output as IProductEntity[];
			} else {
				console.error(decodedOutput);
				return [] as IProductEntity[];
			}
		}
	}, [])

	return {
		getRawEntities,
		getRawEntitiesByBuyer,
		getMyProductEntities,
		getProductEntity,
		getRawEntitiesByBatchNos,
		getAllRawEntities,
		getAllProductEntities,
	};
};

export default useEntity;
