import ConnectBtn from "@/components/web3/ConnectBtn";
import useAuth from "@/hooks/store/useAuth";
import useDidHydrate from "@/hooks/useDidHydrate";
import { useMemo } from "react";
import { IoIosFlash } from "react-icons/io";

const Home = () => {
	const { didHydrate } = useDidHydrate();

	const accountData = useAuth((state) => state.account);

	const account = useMemo(() => {
		if (didHydrate) {
			return accountData;
		}
		return null;
	}, [didHydrate, accountData]);

	return (
		<section className="flex flex-col items-center justify-center w-full min-h-screen">
			<div className="flex flex-col items-center px-4 py-12 mx-auto text-center">
				<h2 className="text-2xl font-bold tracking-tight text-gray-800 xl:text-3xl dark:text-white">AgriTrace</h2>

				<p className="block max-w-4xl mt-4 text-gray-500 dark:text-gray-300">
					AgriTrace is a blockchain-based traceability system for agricultural products. It allows users to track the journey of their food from farm to fork.
				</p>

				<div className="mt-6 flex items-center justify-center">
					<ConnectBtn />
					<a
						className="inline-flex items-center justify-center w-full px-4 py-2.5 overflow-hidden text-sm text-white transition-colors duration-300 bg-gray-900 rounded-lg shadow sm:w-auto sm:mx-2 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 focus:ring focus:ring-gray-300 focus:ring-opacity-80"
						href={account ? "/dashboard" : "/auth/register"}>
						<IoIosFlash className="w-5 h-5 mx-2" />
						<span className="mx-2">{account ? "Dashboard" : "Get Started"}</span>
					</a>
				</div>
			</div>
		</section>
	);
};

export default Home;
