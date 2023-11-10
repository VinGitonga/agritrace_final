import { ENTITY_CONTRACT_ADDRESS, STAKEHOLDER_CONTRACT_ADDRESS } from "@/env";
import { IContractType } from "@/types/Contracts";
import { SubstrateDeployment, alephzeroTestnet } from "@scio-labs/use-inkathon";

export const getDeployments = async (): Promise<SubstrateDeployment[]> => {
	return [
		{
			contractId: IContractType.EntityRegistry,
			networkId: alephzeroTestnet.network,
			abi: await import("./metadatas/entity.json"),
			address: ENTITY_CONTRACT_ADDRESS,
		},
		{
			contractId: IContractType.StakeholderRegistry,
			networkId: alephzeroTestnet.network,
			abi: await import("./metadatas/stakeholder_registry.json"),
			address: STAKEHOLDER_CONTRACT_ADDRESS,
		},
	];
};
