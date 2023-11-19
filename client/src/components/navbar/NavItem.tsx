import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

interface NavItemProps {
	href: string;
	text: string;
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

export default NavItem;
