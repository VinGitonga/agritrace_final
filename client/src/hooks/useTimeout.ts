import { useCallback, useEffect, useRef } from "react";

/**
 * Use a timeout hook.
 * @see https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 * @param callback A function to be executed after the timer expires.
 * @param delay The time, in milliseconds (thousandths of a second), the timer should wait before the specified function or code is executed. If this parameter is omitted, a value of 0 is used, meaning execute "immediately", or more accurately, as soon as possible.
 * @returns A function that, when invoked, will cancel the timeout. This is safe to invoke even if the timeout has already executed, or has been cancelled.
 * 
 * @example
 * const [count, setCount] = useState(0);
 * const cancel = useTimeout(() => setCount(count + 1), 1000);
 * 
 * <div>
 *  <p>{count}</p>
 * <button onClick={() => cancel()}>Cancel</button>
 * </div>
 */
const useTimeout = (callback: () => void, delay: number) => {
	const timeoutRef = useRef(null);
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		const tick = () => callbackRef.current();
		if (typeof delay === "number") {
			timeoutRef.current = window.setTimeout(tick, delay);
			return () => window.clearTimeout(timeoutRef.current);
		}
	}, [delay]);

	const cancel = useCallback(function () {
		window.clearTimeout(timeoutRef.current);
	}, []);

	return cancel;
};

export default useTimeout;
