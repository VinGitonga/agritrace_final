import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SubstrateChain, SubstrateWalletPlatform, allSubstrateWallets, getSubstrateChain, isWalletInstalled, useBalance, useInkathon } from "@scio-labs/use-inkathon";
import { useCallback, useMemo, useState } from "react";
import { contractsEnv } from "@/config/enviroment";
import useIsSSR from "@/hooks/useIsSSR";
import { IoIosFlash } from "react-icons/io";
import { FiChevronDown, FiExternalLink } from "react-icons/fi";
import { InjectedAccount } from "@polkadot/extension-inject/types";
import { SupportedChainId } from "@azns/resolver-core";
import { useResolveAddressToDomain } from "@azns/resolver-react";
import Image from "next/image";
import { truncateHash } from "@/utils";
import { encodeAddress } from "@polkadot/util-crypto";
import toast from "react-hot-toast";
import { AiOutlineCheckCircle } from "react-icons/ai";

interface AccountNameProps {
	account: InjectedAccount;
}

export default function ConnectBtn() {
	const { activeChain, switchActiveChain, connect, disconnect, isConnecting, activeAccount, accounts, setActiveAccount } = useInkathon();
	const { balanceFormatted } = useBalance(activeAccount?.address, true, {
		forceUnit: false,
		fixedDecimals: 2,
		removeTrailingZeros: true,
	});
	const [supportedChains] = useState(contractsEnv.supportedChains.map((networkId) => getSubstrateChain(networkId) as SubstrateChain));

	const [browserWallets] = useState(allSubstrateWallets.filter((w) => w.platforms.includes(SubstrateWalletPlatform.Browser)));

	const isSSR = useIsSSR();

	const openExternalLink = useCallback((url: string) => {
		window.open(url, "_blank");
	}, []);

	if (!activeAccount) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild disabled={isConnecting}>
					<Button variant="outline" disabled={isConnecting}>
						{isConnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <IoIosFlash className="w-4 h-4 mr-2" />}
						Connect Wallet
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuLabel>Wallet Connection</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{/* Installed wallets */}
					<DropdownMenuGroup>
						{!isSSR &&
							!activeAccount &&
							browserWallets.map((walletItem) =>
								isWalletInstalled(walletItem) ? (
									<DropdownMenuItem key={walletItem.id} onClick={() => connect?.(undefined, walletItem)}>
										<div className="flex flex-col items-start space-y-1 cursor-pointer">
											<span>{walletItem.name}</span>
										</div>
									</DropdownMenuItem>
								) : (
									<DropdownMenuItem key={walletItem.id} onClick={() => openExternalLink(walletItem.urls.website)}>
										<div className="flex flex-col items-start space-y-1 cursor-pointer">
											<div className="flex items-center space-x-2">
												<span>{walletItem.name}</span>
												<FiExternalLink className="w-4 h-4" />
											</div>
											<p className="text-xs text-gray-500">Not installed</p>
										</div>
									</DropdownMenuItem>
								)
							)}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	// Account Menu & Disconnect Button
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="py-6 pl-5 rounded-2xl">
					<div className="flex flex-col items-start space-y-1">
						<AccountName account={activeAccount} />
						<p className="text-xs text-gray-700 dark:text-gray-300 font-normal opacity-75">{truncateHash(encodeAddress(activeAccount?.address, activeChain?.ss58Prefix || 42), 8)}</p>
					</div>
					<FiChevronDown className="w-4 h-4 mr-2" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{/* Supported Chains */}
					{supportedChains.map((chain) => (
						<DropdownMenuItem
							key={chain.network}
							disabled={chain.network === activeChain?.network}
							onClick={async () => {
								switchActiveChain?.(chain);
								toast.success(`Switched to ${chain.name} network`);
							}}>
							<div className="flex flex-col items-start space-y-1 cursor-pointer">
								<div className="flex items-center space-x-2">
									<p>{chain.name}</p>
									{chain?.network === activeChain?.network && <AiOutlineCheckCircle className="w-4 h-4 text-green-500" />}
								</div>
							</div>
						</DropdownMenuItem>
					))}
					<DropdownMenuSeparator />
					{/* Account Balance */}
					<DropdownMenuItem>
						<p className="text-sm font-semibold uppercase flex tracking-wide items-baseline gap-1">{balanceFormatted}</p>
					</DropdownMenuItem>
					{(accounts || []).map((acc) => {
						const encodedAddress = encodeAddress(acc.address, activeChain?.ss58Prefix || 42);
						const truncatedEncodedAddress = truncateHash(encodedAddress, 10);
						return (
							<DropdownMenuItem
								key={encodedAddress}
								disabled={encodedAddress === activeAccount?.address}
								onClick={async () => {
									setActiveAccount?.(acc);
									toast.success(`Switched to ${acc.name} account`);
								}}>
								<div className="flex flex-col items-start space-y-1 cursor-pointer">
									<div className="flex items-center space-x-2">
										<p>{acc.name}</p>
										{encodedAddress === activeAccount?.address && <AiOutlineCheckCircle className="w-4 h-4 text-green-500" />}
									</div>
									<p className="text-xs text-gray-500 dark:text-gray-300 font-normal opacity-75">{truncatedEncodedAddress}</p>
								</div>
							</DropdownMenuItem>
						);
					})}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => disconnect?.()}>
					<div className="flex flex-row items-start cursor-pointer">
						<LogOut className="mr-2 h-4 w-4 hover:text-red-500" />
						<span className="hover:text-red-500">Disconnect</span>
					</div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

const AccountName = ({ account, ...rest }: AccountNameProps) => {
	const { activeChain } = useInkathon();
	const doResolveAddress = useMemo(() => Object.values(SupportedChainId).includes(activeChain?.network as SupportedChainId), [activeChain?.network]);

	const { primaryDomain } = useResolveAddressToDomain(doResolveAddress ? account?.address : undefined, { chainId: activeChain?.network });

	return (
		<p className="text-sm font-semibold uppercase flex tracking-wide items-baseline gap-1" {...rest}>
			{primaryDomain || account?.name}
			{!!primaryDomain && <Image src={"/icons/azns-icon.svg"} alt="AZERO.ID Logo" width={11} height={11} />}
		</p>
	);
};
