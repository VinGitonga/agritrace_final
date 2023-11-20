import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { FormProvider, useForm } from "react-hook-form";
import { array, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomFormControl, { IOption } from "@/components/forms/CustomFormControl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FiEdit3 } from "react-icons/fi";
import { concatRawMaterials, generateNumbers } from "@/utils";
import { ProductFormValues } from "@/types/Form";
import { useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
import { IContractType } from "@/types/Contracts";
import toast from "react-hot-toast";
import useEntity from "@/hooks/useEntity";
import { IRawEntity } from "@/types/Entity";
import { contractTxWithToast } from "@/components/web3/contractTxWithToast";

const FormSchema = object({
	name: string().required("Name is required"),
	quantity: string().required("Quantity is required"),
	unit: string().required("Unit is required"),
	code: string().required("Code is required"),
	rawMaterials: array().required("Raw Materials is required"),
});

const AddProduct: NextPageWithLayout = () => {
	const { activeAccount, activeSigner, api } = useInkathon();
	const { contract } = useRegisteredContract(IContractType.EntityRegistry);
	const { getRawEntitiesByBuyer } = useEntity();
	const formMethods = useForm<Partial<ProductFormValues>>({
		resolver: yupResolver(FormSchema),
		defaultValues: {
			name: "",
			quantity: "",
			unit: "",
			code: "",
			rawMaterials: [],
		},
	});
	const [loading, setLoading] = useState<boolean>(false);
	const {
		handleSubmit,
		formState: { errors },
		setValue,
		register,
		control,
	} = formMethods;

	const [rawMaterials, setRawMaterials] = useState<IRawEntity[]>([]);

	const onCodeGenerate = () => {
		let val = generateNumbers(8);
		setValue("code", String(val));
	};

	const getRawMaterials = async () => {
		const rawMaterials = await getRawEntitiesByBuyer(activeAccount?.address);
		if (!rawMaterials) return;
		setRawMaterials(rawMaterials);
	};

	const onSubmit = async (data: ProductFormValues) => {
		if (!activeAccount || !activeSigner || !api || !contract) {
			toast.error("Connect your wallet");
			return;
		}

		const raws = (data?.rawMaterials as IOption[])?.map((item) => item?.value);

		// confirm if a raw material is selected
		if (!raws || raws?.length === 0) {
			toast.error("Select a raw material");
			return;
		}

		try {
			setLoading(true);
			api.setSigner(activeSigner);
			const batchNo = generateNumbers(8);
			const quantity = parseInt(String(data?.quantity) ?? "0");
			const newRaws = raws.map((item) => {
				const rawAsString = String(item).replace(/,/g, "");
				return parseInt(rawAsString);
			});
			console.log("Qty", quantity)
			console.log("Raws", newRaws)
			await contractTxWithToast(api, activeAccount?.address, contract, "addProductEntity", {}, [data?.name, data?.code, quantity ?? 0, data?.unit, batchNo, newRaws]);
			toast.success("Product added");
			setLoading(false);
		} catch (error) {
			toast.error(error?.message ?? "Something went wrong");
			setLoading(false);
		}
	};

	useEffect(() => {
		getRawMaterials();
	}, [activeAccount]);

	return (
		<FormProvider {...formMethods}>
			<div className="flex flex-col items-center justify-center h-screen">
				<h1 className="text-6xl">Add Product</h1>
				<form className="flex flex-col space-y-8  w-[600px] mt-7 bg-white shadow-md rounded-lg px-10 py-7" onSubmit={handleSubmit(onSubmit)}>
					<CustomFormControl label="Name" name="name" control={control} register={register} isRequired error={errors.name} errorMessage="Name is required" placeholder="e.g. Packed 200g Milk" />
					<CustomFormControl label="Quantity" name="quantity" control={control} register={register} isRequired error={errors.quantity} errorMessage="Quantity is required" placeholder="e.g. 200" />
					<CustomFormControl label="Unit" name="unit" control={control} register={register} isRequired error={errors.unit} errorMessage="Unit is required" placeholder="e.g. packets" />
					<div className="space-y-2">
						<CustomFormControl label="Code" name="code" control={control} register={register} isRequired error={errors.code} errorMessage="Code is required" placeholder="e.g. 24366278" />
						<Button onClick={onCodeGenerate} type="button">
							Generate Code
						</Button>
					</div>
					<CustomFormControl
						label="Raw Materials"
						name="rawMaterials"
						control={control}
						register={register}
						isRequired
						error={errors.rawMaterials as any}
						errorMessage="Raw Materials is required"
						placeholder="e.g. 24366278"
						options={rawMaterials ? concatRawMaterials(rawMaterials) : []}
						variant="multi-select"
					/>
					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FiEdit3 className="mr-2 h-4 w-4" />}
						{loading ? "Saving..." : "Save"}
					</Button>
				</form>
			</div>
		</FormProvider>
	);
};

AddProduct.getLayout = (page) => <ManufacturerLayout>{page}</ManufacturerLayout>;

export default AddProduct;
