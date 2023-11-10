import { DEFAULT_CHAIN, PRODUCTION_MODE } from "@/env";
import { getUrl } from "./get-url";
import { getSupportedChains } from "./get-supported-chain";

export const contractsEnv = {
	url: getUrl(),
	isProduction: PRODUCTION_MODE,
	supportedChains: getSupportedChains(),
	defaultChain: DEFAULT_CHAIN,
};
