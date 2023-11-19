import { useEffect, useState } from "react";
/**
 * A hook to check if the code is running on the server or the client, useful for SSR in Next.js
 * @returns true if the code is running on the server, false otherwise
 */
const useIsSSR = () => {
	const [isSSR, setIsSSR] = useState(true);

	useEffect(() => {
		setIsSSR(false);
	}, []);

	return isSSR;
};

export default useIsSSR;
