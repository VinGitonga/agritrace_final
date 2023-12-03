import CustomFormControl, { IOption } from "@/components/forms/CustomFormControl";
import { Button } from "@/components/ui/button";
import { contractTxWithToast } from "@/components/web3/contractTxWithToast";
import useAccounts from "@/hooks/useAccounts";
import SupplierLayout from "@/layouts/SupplierLayout";
import { AccountRole, IAccount } from "@/types/Account";
import { IContractType } from "@/types/Contracts";
import { RawMaterialFormValues } from "@/types/Form";
import { NextPageWithLayout } from "@/types/Layout";
import { generateNumbers, truncateHash } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit3 } from "react-icons/fi";
import { object, string } from "yup";

const concatManufacturers = (manufacturers: IAccount[]): IOption[] => {
	return manufacturers.map((manufacturer) => ({
		value: manufacturer.address,
		label: `${manufacturer.name} - ${truncateHash(manufacturer.address)}`,
	}));
};

const FormSchema = object({
	name: string().required("Name of the raw material is required"),
	quantity: string().required("Quantity is required"),
	unit: string().required("Unit is required"),
	code: string().required("Add Code or Generate Code"),
	buyer: string().required("Select a buyer"),
});

const AddRawMaterial: NextPageWithLayout = () => {
	const { getAccounts } = useAccounts();
	const { activeAccount, activeSigner, api } = useInkathon();
	const { contract } = useRegisteredContract(IContractType.EntityRegistry);
	const router = useRouter();
	const formMethods = useForm<Partial<RawMaterialFormValues>>({
		resolver: yupResolver(FormSchema),
		defaultValues: {
			name: "",
			quantity: "",
			unit: "",
			code: "",
			buyer: "",
		},
	});
	const [loading, setLoading] = useState<boolean>(false);
	const [manufacturers, setManufacturers] = useState<IAccount[]>([]);

	const {
		handleSubmit,
		formState: { errors },
		setValue,
		register,
		control,
		reset,
	} = formMethods;

	const onCodeGenerate = () => {
		let val = generateNumbers(8);
		setValue("code", String(val));
	};

	const onSubmit = async (data: RawMaterialFormValues) => {
		if (!activeAccount || !activeSigner || !api || !contract) {
			toast.error("Connect your wallet");
			return;
		}

		try {
			setLoading(true);
			api.setSigner(activeSigner);
			const batchNo = generateNumbers(8);
			await contractTxWithToast(api, activeAccount?.address, contract, "addRawEntity", {}, [data?.name, Number(data?.quantity) ?? 0, data?.unit, data?.code, batchNo, data?.buyer]);
			reset();
			setLoading(false);
			router.push("/supplier/my-raw-materials");
		} catch (err) {
			console.log(err);
			setLoading(false);
			toast.error("Something went wrong");
		}
	};

	useEffect(() => {
		async function fetchManufacturers() {
			const accounts = await getAccounts(AccountRole.Manufacturer);
			if (accounts) {
				setManufacturers(accounts);
			}
		}
		if (activeAccount) {
			fetchManufacturers();
		}
	}, [activeAccount]);

	return (
		<FormProvider {...formMethods}>
			<div className="flex flex-col items-center justify-center h-screen">
				<h1 className="text-4xl">Add Raw Material</h1>
				<form className="flex flex-col space-y-8  w-[600px] mt-7 bg-white shadow-md rounded-lg px-10 py-7" onSubmit={handleSubmit(onSubmit)}>
					<CustomFormControl label="Name" name="name" control={control} register={register} isRequired error={errors.name} errorMessage="Name is required" placeholder="e.g. Raw Milk" />
					<CustomFormControl label="Quantity" name="quantity" control={control} register={register} isRequired error={errors.quantity} errorMessage="Quantity is required" placeholder="e.g. 200" />
					<CustomFormControl label="Unit" name="unit" control={control} register={register} isRequired error={errors.unit} errorMessage="Unit is required" placeholder="e.g. litres" />
					<CustomFormControl
						label="Buyer"
						name="buyer"
						control={control}
						register={register}
						isRequired
						error={errors.buyer}
						errorMessage="Buyer is required"
						placeholder="e.g. 0x1234..."
						variant="select"
						options={manufacturers ? concatManufacturers(manufacturers) : []}
					/>
					<div className="space-y-2">
						<CustomFormControl label="Code" name="code" control={control} register={register} isRequired error={errors.code} errorMessage="Code is required" placeholder="e.g. 24366278" />
						<Button type="button" onClick={onCodeGenerate}>Generate Code</Button>
					</div>
					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FiEdit3 className="mr-2 h-4 w-4" />}
						{loading ? "Saving..." : "Save"}
					</Button>
				</form>
			</div>
		</FormProvider>
	);
};

AddRawMaterial.getLayout = (page) => <SupplierLayout>{page}</SupplierLayout>;

export default AddRawMaterial;
