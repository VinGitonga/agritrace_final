import AppProviders from "@/providers/AppProviders";
import "@/styles/globals.css";
import { AppPropsWithLayout } from "@/types/Layout";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout || ((page) => page);
	return (
		<main>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
				<title>AgriTrace</title>
			</Head>
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
		</main>
	);
}
