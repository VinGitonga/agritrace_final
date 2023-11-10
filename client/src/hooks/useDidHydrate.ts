import { useEffect, useState } from "react";

let hydrated = false;

/**
 * A Custom hook that handle server rendered items error effect on UI
 * @returns { didHydrate }
 */

const useDidHydrate = (): { didHydrate: boolean } => {
	const [didHydrate, setDidHydrate] = useState(hydrated);

	useEffect(() => {
		setDidHydrate(true);
		hydrated = true;
	}, []);

	return { didHydrate };
};

export default useDidHydrate;
