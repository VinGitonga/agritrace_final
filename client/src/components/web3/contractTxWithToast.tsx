import { ContractTxResult, SubstrateExplorer, contractTx, useInkathon } from "@scio-labs/use-inkathon";
import Link from "next/link";
import { FC } from "react";
import toast from "react-hot-toast";

type ContractTxWithToastParams = Parameters<typeof contractTx>;
/**
 * 
 * @param contractTxParams All parameters for the contractTx function
 * @returns Returns a promise that resolves to the result of the contractTx function
 */
export const contractTxWithToast = async (...contractTxParams: ContractTxWithToastParams) => {
	return toast.promise(contractTx(...contractTxParams), {
		loading: "Sending transaction...",
		success: (result) => <ContractTxSuccessToast {...result} />,
		error: (err) => {
			console.log(err);
			return <ContractTxErrorToast {...err} />;
		},
	});
};

/**
 * 
 * @param All parameters for the contractTx function will be passed to this function
 * @returns A toast component that shows the result of the transaction with a link to view the transaction on the explorer
 */
export const ContractTxSuccessToast: FC<ContractTxResult> = ({ extrinsicHash, blockHash }) => {
	const { activeChain } = useInkathon();
	const subscanUrl = activeChain?.explorerUrls?.[SubstrateExplorer.Subscan];
	const subscanDetailUrl = subscanUrl && extrinsicHash ? `${subscanUrl}/extrinsic/${extrinsicHash}` : null;
	const polkadotjsUrl = activeChain?.explorerUrls?.[SubstrateExplorer.PolkadotJs];
	const polkadotjsDetailUrl = polkadotjsUrl && blockHash ? `${polkadotjsUrl}/query/${blockHash}` : null;

	return (
		<div className="flex flex-col gap-0.5">
			<div>Transaction sent successfully!</div>
			{(subscanDetailUrl || polkadotjsDetailUrl) && (
				<div className="text-sm text-gray-400">
					View on{" "}
					{subscanDetailUrl && (
						<Link href={subscanDetailUrl} target="_blank" className="transition-all hover:text-white">
							Subscan ↗
						</Link>
					)}
					{subscanDetailUrl && polkadotjsDetailUrl && " · "}
					{polkadotjsDetailUrl && (
						<Link href={polkadotjsDetailUrl} target="_blank" className="transition-all hover:text-white">
							Polkadot JS Apps ↗
						</Link>
					)}
				</div>
			)}
		</div>
	);
};

/**
 * 
 * @param All parameters for the contractTx function will be passed to this function if the transaction fails
 * @returns Returns a toast component that shows the error message, if its a TokenBelowMinimum error, it will show a link to the faucet
 */
export const ContractTxErrorToast: FC<ContractTxResult> = ({ errorMessage }) => {
	const { activeChain } = useInkathon();
	const faucetUrl = activeChain?.faucetUrls?.[0];

	let msg: string;

	switch (errorMessage) {
		case "UserCancelled":
			msg = "Transaction cancelled";
			break;
		case "TokenBelowMinimum":
			msg = "Not enough tokens to send transaction";
			break;
		case "ExtrinsicFailed":
			msg = "Transaction failed";
			break;
		case "Error":
			msg = "Transaction failed";
			break;
		default:
			msg = errorMessage ? `Transaction Failed ${errorMessage}` : "Transaction Failed";
	}

	return (
		<div className="flex flex-col gap-0.5">
			<div>{msg}</div>
			{errorMessage === "TokenBelowMinimum" && faucetUrl && (
				<div className="text-xs text-gray-400">
					<Link href={faucetUrl} target="_blank" className="transition-all hover:text-white">
						Get tokens ↗
					</Link>
				</div>
			)}
		</div>
	);
};
