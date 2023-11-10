import { customAlphabet } from "nanoid";

export const truncateHash = (hash: string | undefined, paddingLength: number = 6): string => {
	if (!hash?.length) return "";
	if (hash?.length <= paddingLength * 2 + 1) return hash;

	return hash.replace(hash.substring(paddingLength, hash?.length - paddingLength), "...");
};

export const generateNumbers = (size: number = 14): number => {
	const nanoid = customAlphabet("1234567890", size);
	return parseInt(nanoid());
};
