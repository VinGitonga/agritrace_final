import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from "@/env";

export const getSupportedChains = (): string[] => {
	const defaultChain = DEFAULT_CHAIN;
	const parsedChains = !!SUPPORTED_CHAINS && JSON.parse(SUPPORTED_CHAINS) as string[];

	return parsedChains || [defaultChain];
};
