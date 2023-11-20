import { AccountRole, IAccount } from "@/types/Account";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useEffect, useState } from "react";
import useAccounts from "@/hooks/useAccounts";
import { useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
import CustomFormControl from "../forms/CustomFormControl";
import { Button } from "../ui/button";
import { IContractType } from "@/types/Contracts";
import toast from "react-hot-toast";
import { object, string } from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";
import { contractTxWithToast } from "../web3/contractTxWithToast";
import { IProductEntity } from "@/types/Entity";
import { generateNumbers } from "@/utils";

interface IProps {
	text: string;
	open: boolean;
	setOpen: (open: boolean) => void;
	disabled?: boolean;
	product: IProductEntity;
	onClickTrigger?: () => void;
}

const FormSchema = object({
	distributor: string().required("Distributor is required"),
});

const SaleProductModal = ({ text, open, setOpen, disabled = false, product, onClickTrigger }: IProps) => {
	const [accounts, setAccounts] = useState<IAccount[]>([]);

	const formMethods = useForm<{ distributor?: string }>({
		resolver: yupResolver(FormSchema),
		defaultValues: {
			distributor: "",
		},
	});
	const [loading, setLoading] = useState<boolean>(false);

	const {
		handleSubmit,
		formState: { errors },
		control,
	} = formMethods;

	const { getAccounts } = useAccounts();
	const { activeAccount, activeSigner, api } = useInkathon();
	const { contract } = useRegisteredContract(IContractType.TRANSACTIONS);

	const fetchDistributorAccounts = async () => {
		const accs = await getAccounts();

		if (accounts) {
			setAccounts(accs);
		}
	};

	const initiateSell = async ({ distributor }: { distributor: string }) => {
		if (!activeAccount || !activeSigner || !api || !contract) {
			toast.error("Connect your wallet");
			return;
		}

		try {
			setLoading(true);
			api.setSigner(activeSigner);
			const serialNo = generateNumbers();
			await contractTxWithToast(api, activeAccount?.address, contract, "sellProduct", {}, [product?.code, product?.quantity, product?.unit, product?.batchNo, distributor, serialNo]);
			toast.success("Product sold successfully");
			setLoading(false);
		} catch (err) {
			toast.error("Something went wrong");
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDistributorAccounts();
	}, [activeAccount]);

	const distributorAccounts = accounts.filter((acc) => acc.role === AccountRole.Distributor);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild disabled={disabled} onClick={onClickTrigger}>
				<div className="flex items-center justify-center px-1 py-2 text-sm font-medium text-white bg-green-600 rounded-md cursor-pointer">{text}</div>
			</DialogTrigger>
			<FormProvider {...formMethods}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Sell Product - {product?.name}</DialogTitle>
						<DialogDescription>Are you sure you want to sell this product?</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit(initiateSell)}>
						<div className="flex flex-col space-y-4">
							<CustomFormControl
								label="Select Distributor"
								name="distributor"
								variant="select"
								options={distributorAccounts.map((acc) => ({ label: acc.name, value: acc.address }))}
								control={control}
								error={errors?.distributor}
							/>
						</div>
						<DialogFooter>
							<div className="flex space-x-2 mt-10">
								<Button type="button" onClick={() => setOpen(false)}>
									Cancel
								</Button>
								<Button type="submit" className="w-full" disabled={loading}>
									{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									{loading ? "Selling..." : "Sell"}
								</Button>
							</div>
						</DialogFooter>
					</form>
				</DialogContent>
			</FormProvider>
		</Dialog>
	);
};

export default SaleProductModal;
