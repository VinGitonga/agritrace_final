import { useEffect, useRef } from "react";

/**
 * A hook to call a function at a given interval
 * @param callback - function to be called
 * @param delay - delay in milliseconds, null to stop
 */
function useInterval(callback: () => void, delay: number | null) {
	const savedCallback = useRef<() => void>();

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		function tick() {
			if (savedCallback.current) {
				savedCallback.current();
			}
		}
		if (delay !== null && delay > 0) {
			const id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}

export default useInterval;
