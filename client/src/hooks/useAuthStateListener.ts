import { IContractType } from "@/types/Contracts";
import { contractQuery, decodeOutput, useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
import useAuth from "./store/useAuth";
import { useEffect } from "react";

/**
 * A hook to listen to the auth state, and update the auth store accordingly
 * It fetches the account details from the StakeholderRegistry contract in order to check if the user has an account
 * Runs on every account change and on mount
 *
 * Makes use of the useInkathon and useRegisteredContract hooks from `@scio-labs/use-inkathon`
 *
 * Ensure that the StakeholderRegistry contract is registered in the useInkathon hook and you call this hook in a component wrapped in the useInkathonProvider and higher in the component tree than the component that uses this hook
 *
 * @returns nothing
 *
 */
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
