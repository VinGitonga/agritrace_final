import { BASE_CLIENT_URL } from "@/env";

export const getUrl = () => {
	let url = BASE_CLIENT_URL;

	// Include `https://` when not localhost
	url = url.includes("http") ? url : `https://${url}`;

	// append trailing '/' if not present
	url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;

	return url;
};
