import useAuthStateListener from "@/hooks/useAuthStateListener";
import { FC, ReactNode } from "react";

interface IProps {
	children?: ReactNode | ReactNode[];
}

const AppServices: FC<IProps> = ({ children }) => {
	useAuthStateListener();
	return <>{children}</>;
};

export default AppServices;
