import AppProviders from "@/providers/AppProviders";
import "@/styles/globals.css";
import { AppPropsWithLayout } from "@/types/Layout";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout || ((page) => page);
	return (
		<>
			<AppProviders>{getLayout(<Component {...pageProps} />)}</AppProviders>
			<Toaster
				toastOptions={{
					duration: 5000,
					style: {
						background: "#363636",
						color: "#fff",
					},
					className: "text-xs md:text-sm ",
					success: {
						duration: 3000,
						// great success toast
						icon: "🎉",
					},
					error: {
						duration: 3000,
						// great error toast
						icon: "👎",
					},
				}}
			/>
		</>
	);
}
