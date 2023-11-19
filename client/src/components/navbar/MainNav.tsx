import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface IProps extends HTMLAttributes<HTMLElement> {
	navItems?: ReactNode | ReactNode[];
}

export default function MainNav({ className, navItems, ...props }: IProps) {
	return (
		<nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
			{navItems}
		</nav>
	);
}
