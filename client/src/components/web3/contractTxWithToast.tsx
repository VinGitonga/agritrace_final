import { ContractTxResult, SubstrateExplorer, contractTx, useInkathon } from "@scio-labs/use-inkathon";
import Link from "next/link";
import { FC } from "react";
import toast from "react-hot-toast";

type ContractTxWithToastParams = Parameters<typeof contractTx>;

export const contractTxWithToast = async (...contractTxParams: ContractTxWithToastParams) => {
	return toast.promise(contractTx(...contractTxParams), {
		loading: "Sending transaction...",
		success: (result) => <ContractTxSuccessToast {...result} />,
		error: (err) => <ContractTxErrorToast {...err} />,
	});
};

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
