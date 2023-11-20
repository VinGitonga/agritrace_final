import { IRawEntity } from "@/types/Entity";
import { Button } from "../ui/button";
import { useState } from "react";
import useTransactions from "@/hooks/useTransactions";
import { Loader2 } from "lucide-react";

interface IProps {
	item?: IRawEntity;
	text: string;
	isDisabled?: boolean;
	onClick?: () => Promise<void>;
	variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
}

const Web3TransBtn = ({ item, text, isDisabled = false, onClick, variant = "default" }: IProps) => {
	const [loading, setLoading] = useState<boolean>(false);

	return (
		<Button disabled={isDisabled} onClick={onClick} size="sm" variant={variant}>
			{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
			{text}
		</Button>
	);
};

export default Web3TransBtn;
