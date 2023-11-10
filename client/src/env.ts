export const BASE_CLIENT_URL = process.env.PUBLIC_NEXT_URL || "http://localhost:3000";
export const DEFAULT_CHAIN = process.env.NEXT_PUBLIC_DEFAULT_CHAIN || "";
export const SUPPORTED_CHAINS = process.env.NEXT_PUBLIC_SUPPORTED_CHAINS || "";
export const PRODUCTION_MODE = process.env.NEXT_PUBLIC_PRODUCTION_MODE === "true" || false;
export const ENTITY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ENTITY_CONTRACT_ADDRESS || "";
export const STAKEHOLDER_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STAKEHOLDER_CONTRACT_ADDRESS || "";
