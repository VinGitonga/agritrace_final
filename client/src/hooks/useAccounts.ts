import { contractQuery, decodeOutput, useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
import { AccountRole, IAccount } from "@/types/Account";
import { IContractType } from "@/types/Contracts";

const useAccounts = () => {
	const { api, activeAccount } = useInkathon();
	const { contract } = useRegisteredContract(IContractType.StakeholderRegistry);

	const getAccounts = async (role?: AccountRole) => {
		if (contract! && api! && activeAccount!) {
			const result = await contractQuery(api, activeAccount?.address, contract, "getAllAccounts");

			const { output, isError, decodedOutput } = decodeOutput(result, contract, "getAllAccounts");

			if (!isError && output) {
				if (role) {
					return output.filter((account: IAccount) => account.role === role);
				}

				return output as IAccount[];
			} else {
				console.error(decodedOutput);
			}
		}

		return [] as IAccount[];
	};

	return {
		getAccounts,
	};
};

export default useAccounts;
