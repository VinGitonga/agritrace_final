import { contractsEnv } from "@/config/enviroment";
import { getDeployments } from "@/deployments";
import RootLayout from "@/layouts/RootLayout";
import { UseInkathonProvider, alephzeroTestnet } from "@scio-labs/use-inkathon";
import { FC, ReactNode } from "react";
import AppServices from "./AppServices";

interface IProps {
	children: ReactNode;
}

const AppProviders: FC<IProps> = ({ children }) => {
	return (
		<UseInkathonProvider appName="AgriTrace" connectOnInit={true} defaultChain={contractsEnv.defaultChain || alephzeroTestnet} deployments={getDeployments()}>
			<RootLayout>{children}</RootLayout>
			<AppServices />
		</UseInkathonProvider>
	);
};

export default AppProviders;
