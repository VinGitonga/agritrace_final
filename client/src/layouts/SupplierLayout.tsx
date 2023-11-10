import MainNav from "@/components/navbar/MainNav";
import Search from "@/components/navbar/Search";
import TeamSwitcher from "@/components/navbar/TeamSwitcher";
import UserNav from "@/components/navbar/UserNav";
import { FC, ReactNode } from "react";

interface IProps {
	children: ReactNode | ReactNode[];
}

const SupplierLayout: FC<IProps> = ({ children }) => {
	return (
		<div className="flex flex-col min-h-screen">
			<div className="border-b">
				<div className="flex h-16 items-center px-4">
					<TeamSwitcher />
					<MainNav className="mx-6" />
					<div className="ml-auto flex items-center space-x-4">
						<Search />
						<UserNav />
					</div>
				</div>
			</div>
			{children}
		</div>
	);
};

export default SupplierLayout;
