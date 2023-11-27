import { AccountRole, IAccount } from "@/types/Account";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
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
import { convertFixU64ToNum, generateNumbers } from "@/utils";

interface IProps {
	text: string;
	open: boolean;
	setOpen: (open: boolean) => void;
	disabled?: boolean;
	product: IProductEntity;
	onClickTrigger?: () => void;
	accounts: IAccount[];
}

const FormSchema = object({
	distributor: string().required("Distributor is required"),
});

const SaleProductModal = ({ text, open, setOpen, disabled = false, product, onClickTrigger, accounts }: IProps) => {
	console.log(product);
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

	const { activeAccount, activeSigner, api } = useInkathon();
	const { contract } = useRegisteredContract(IContractType.TRANSACTIONS);

	const initiateSell = async ({ distributor }: { distributor: string }) => {
		if (!activeAccount || !activeSigner || !api || !contract) {
			toast.error("Connect your wallet");
			return;
		}

		try {
			setLoading(true);
			api.setSigner(activeSigner);
			const serialNo = generateNumbers();
			const rawEntities = product?.rawEntities?.map((raw) => convertFixU64ToNum(raw as string));
			await contractTxWithToast(api, activeAccount?.address, contract, "sellProduct", {}, [product?.code, product?.quantity, product?.unit, rawEntities, distributor, serialNo]);
			toast.success("Product sold successfully");
			setLoading(false);
		} catch (err) {
			toast.error("Something went wrong");
			setLoading(false);
		}
	};

	const distributorAccounts = accounts.filter((acc) => acc.role === AccountRole.Distributor);

	return (
		<>
			<button
				className={`flex items-center justify-center px-2 py-2 text-sm font-medium text-white bg-green-600 rounded-md ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
				onClick={onClickTrigger}
				disabled={disabled}>
				{text}
			</button>
			<Dialog open={open} onOpenChange={setOpen}>
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
		</>
	);
};

export default SaleProductModal;
