import MainNav from "@/components/navbar/MainNav";
import NavItem from "@/components/navbar/NavItem";
import UserNav from "@/components/navbar/UserNav";
import ConnectBtn from "@/components/web3/ConnectBtn";
import { FC, ReactNode } from "react";

interface IProps {
	children: ReactNode | ReactNode[];
}

const navItems = [<NavItem text="Add Raw Material" href="supplier/add-raw-material" key={"add-raw"} />, <NavItem text="My Raw Materials" href="supplier/my-raw-materials" key={"my-raw"} />, <NavItem text="Sales" href="supplier/sales" key={"sales"} />];

const SupplierLayout: FC<IProps> = ({ children }) => {
	return (
		<div className="flex flex-col min-h-screen">
			<div className="border-b">
				<div className="flex h-16 items-center px-4">
					<MainNav navItems={navItems} className="mx-6" />
					<div className="ml-auto flex items-center space-x-4">
						<ConnectBtn />
						<UserNav />
					</div>
				</div>
			</div>
			<div className="px-4 py-2">{children}</div>
		</div>
	);
};

export default SupplierLayout;
