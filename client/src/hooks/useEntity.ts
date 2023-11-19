import { IContractType } from "@/types/Contracts";
import { IRawEntity } from "@/types/Entity";
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

	return {
		getRawEntities,
	};
};

export default useEntity;
