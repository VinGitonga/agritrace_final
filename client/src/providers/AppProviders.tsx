import RootLayout from "@/layouts/RootLayout";
import { FC, ReactNode } from "react";

interface IProps {
	children: ReactNode;
}

const AppProviders: FC<IProps> = ({ children }) => {
	return <RootLayout>{children}</RootLayout>;
};

export default AppProviders;
