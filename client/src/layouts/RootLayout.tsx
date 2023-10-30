import { Nunito } from "next/font/google";
import Head from "next/head";
import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IProps {
	children: ReactNode;
}

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["200", "300", "400", "600", "700", "800", "900"],
	variable: "--font-nunito",
});

const RootLayout: FC<IProps> = ({ children }) => {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
				<title>AgriTrace</title>
			</Head>
			<body className={cn("min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100 font-nunito antialiased", "transition-colors duration-200 ease-in-out", nunito.variable)}>{children}</body>
		</>
	);
};

export default RootLayout;
