import { IContractType } from "@/types/Contracts";
import { contractQuery, decodeOutput, useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
import useAuth from "./store/useAuth";
import { useEffect } from "react";

const useAuthStateListener = () => {
	const { api, activeAccount } = useInkathon();
	const { contract } = useRegisteredContract(IContractType.StakeholderRegistry);

	const { setAccount, setHasAccount } = useAuth();

	useEffect(() => {
		async function fetchAccountDetails() {
			if (contract && api && activeAccount) {
				const result = await contractQuery(api, activeAccount?.address, contract, "getAccount", {}, [activeAccount?.address]);

				const { output, isError, decodedOutput } = decodeOutput(result, contract, "getAccount");
				if (!isError && output) {
					setAccount(output);
					setHasAccount(true);
				} else {
					throw new Error(decodedOutput);
				}
			}
		}

		if (activeAccount) {
			fetchAccountDetails();
		}
	}, [activeAccount]);
};

export default useAuthStateListener;
