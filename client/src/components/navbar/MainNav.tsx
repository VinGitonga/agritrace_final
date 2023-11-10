import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { HTMLAttributes, useMemo } from "react";

interface NavItemProps {
	href: string;
	text: string;
}

interface IProps extends HTMLAttributes<HTMLElement> {}

export default function MainNav({ className, ...props }: IProps) {
	return (
		<nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
			<NavItem href="manufacturer/incoming" text="Incoming Shipments" />
			<NavItem href="manufacturer/add-product" text="Add Product" />
			<NavItem href="manufacturer/my-products" text="My Products" />
			<NavItem href="dashboard" text="Outgoing Shipments" />
		</nav>
	);
}

const NavItem = ({ href, text }: NavItemProps) => {
	const router = useRouter();
	const selected = useMemo(() => {
		if (href && router.pathname !== "/") {
			return router.pathname === `/${href}` ? true : false;
		}

		return false;
	}, [href, router.pathname]);
	return (
		<Link href={href ? `/${href}` : "/"} className={cn("text-sm font-medium transition-colors hover:text-primary", selected ? "text-primary font-semibold" : "text-muted-foreground")}>
			{text}
		</Link>
	);
};
