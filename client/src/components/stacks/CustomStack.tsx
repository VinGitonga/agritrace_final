import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface ICustomStackProps extends HTMLAttributes<HTMLDivElement> {
	direction?: "row" | "column";
	spacing?: number;
	className?: string;
	children?: ReactNode | ReactNode[];
}
const CustomStack = ({ className, direction = "column", spacing = 1, children, ...rest }: ICustomStackProps) => {
	return (
		<div className={cn(`flex ${direction === "row" ? `flex-row` : "flex-col"} ${direction === "row" ? `space-x-${spacing}` : `space-y-${spacing}`}`, className)} {...rest}>
			{children}
		</div>
	);
};

export default CustomStack;
