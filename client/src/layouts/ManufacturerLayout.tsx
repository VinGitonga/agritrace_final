import MainNav from "@/components/navbar/MainNav";
import NavItem from "@/components/navbar/NavItem";
import Search from "@/components/navbar/Search";
import TeamSwitcher from "@/components/navbar/TeamSwitcher";
import UserNav from "@/components/navbar/UserNav";
import ConnectBtn from "@/components/web3/ConnectBtn";
import { ReactNode } from "react";

interface IProps {
	children: ReactNode | ReactNode[];
}

const navItems = [
	<NavItem href="manufacturer/incoming" text="Incoming Shipments" key={"incoming"} />,
	<NavItem href="manufacturer/add-product" text="Add Product" key={"add-product"} />,
	<NavItem href="manufacturer/my-products" text="My Products" key={"my-products"} />,
	<NavItem href="manufacturer/outgoing" text="Outgoing Shipments" key={"outgoing"} />,
];

const ManufacturerLayout = ({ children }: IProps) => {
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

export default ManufacturerLayout;
