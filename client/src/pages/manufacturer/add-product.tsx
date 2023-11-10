import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { FormProvider, useForm } from "react-hook-form";
import { object, string } from "yup";
import * as y from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomFormControl from "@/components/forms/CustomFormControl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FiEdit3 } from "react-icons/fi";
import { generateNumbers } from "@/utils";

const FormSchema = object({
	name: string().required("Name is required"),
	quantity: string().required("Quantity is required"),
	unit: string().required("Unit is required"),
	code: string().required("Code is required"),
});

const AddProduct: NextPageWithLayout = () => {
	const formMethods = useForm<y.InferType<typeof FormSchema>>({
		resolver: yupResolver(FormSchema),
		defaultValues: {
			name: "",
			quantity: "",
			unit: "",
			code: "",
		},
	});
	const [loading, setLoading] = useState<boolean>(false);
	const {
		handleSubmit,
		formState: { errors },
		setValue,
		register,
		control,
	} = useForm();

	const onCodeGenerate = () => {
		let val = generateNumbers(8);
		setValue("code", String(val));
	};
	const onSubmit = async (data: y.InferType<typeof FormSchema>) => {};
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
						<Button onClick={onCodeGenerate}>Generate Code</Button>
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

AddProduct.getLayout = (page) => <ManufacturerLayout>{page}</ManufacturerLayout>;

export default AddProduct;
