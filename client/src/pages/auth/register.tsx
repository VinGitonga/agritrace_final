"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { mixed, object, string } from "yup";
import { RegisterFormValues } from "@/types/Form";
import CustomFormControl from "@/components/forms/CustomFormControl";
import * as y from "yup";
import { emailRegex } from "@/helpers";
import toast from "react-hot-toast";
import ConnectBtn from "@/components/web3/ConnectBtn";
import { useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
import { IContractType } from "@/types/Contracts";
import { useState } from "react";
import { contractTxWithToast } from "@/components/web3/contractTxWithToast";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";

const FormSchema = object({
	name: string().required("Name is required"),
	email: string().email("Invalid email").required("Email is required"),
	phoneNo: string().required("Phone No is required"),
	location: string().required("Location is required"),
	role: mixed().oneOf(["Supplier", "Manufacturer", "Distributor", "Retailer", "Other"]).required("Role is required"),
});

const Register = () => {
	const formMethods = useForm<y.InferType<typeof FormSchema>>({
		resolver: yupResolver(FormSchema),
		defaultValues: {
			name: "",
			email: "",
			phoneNo: "",
			location: "",
			role: "Other",
		},
	});
	const { activeAccount, activeSigner, api } = useInkathon();
	const { contract } = useRegisteredContract(IContractType.StakeholderRegistry);
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	const {
		handleSubmit,
		formState: { errors },
		register,
		control,
		reset,
	} = formMethods;

	const onSubmit = async (data: RegisterFormValues) => {
		// check if the email is valid
		if (!emailRegex.test(data.email)) {
			toast.error("Invalid email");
			return;
		}

		// check if a role is selected
		if (!["Supplier", "Manufacturer", "Distributor", "Retailer"].includes(data.role)) {
			toast.error("Invalid role");
			return;
		}

		if (!activeAccount || !contract || !api || !activeSigner) {
			toast.error("Please connect your wallet");
			return;
		}

		try {
			setLoading(true);
			api.setSigner(activeSigner);
			await contractTxWithToast(api, activeAccount.address, contract, "addAccount", {}, [data.name, data.phoneNo, data.location, [], data.role]);
			reset();
			setLoading(false);
			router.push("/dashboard");
		} catch (err) {
			console.log(err);
			setLoading(false);
		} finally {
			setLoading(false);
			router.push("/");
		}
	};

	return (
		<FormProvider {...formMethods}>
			<div className="w-full flex">
				<OnboardingIllustration />
				<div className="flex-1 flex items-center justify-center  overflow-y-scroll">
					<div className="w-full max-w-md space-y-8 px-4 bg-white text-gray-600 py-6 rounded-lg">
						<div className="">
							{/* <img src="https://floatui.com/logo.svg" width={150} className="lg:hidden" /> */}
							<div className="mt-5 space-y-2">
								<h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Get started with AgriTrace</h3>
								<ConnectBtn />
								<p className="">
									<a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
										Back to Home
									</a>
								</p>
							</div>
						</div>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
							<CustomFormControl label="Name" name="name" register={register} isRequired error={errors.name} errorMessage="Name is required" control={control} placeholder="e.g. Joe Goldbern Ent" />
							<CustomFormControl label="Email" name="email" register={register} isRequired error={errors.email} errorMessage="Email is required" control={control} placeholder="e.g. joe.goldberg@you.com" />
							<CustomFormControl label="Phone No" name="phoneNo" register={register} isRequired error={errors.phoneNo} errorMessage="Phone Number is requred" control={control} placeholder="e.g. 0700123456" />
							<CustomFormControl label="Location" name="location" register={register} isRequired error={errors.location} errorMessage="Location is required" control={control} placeholder="e.g. Nairobi" />

							<FormField
								control={control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Get Started as</FormLabel>
										<FormControl>
											<RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="Supplier" />
													</FormControl>
													<FormLabel className="font-normal">Supplier</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="Manufacturer" />
													</FormControl>
													<FormLabel className="font-normal">Manufacturer</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="Distributor" />
													</FormControl>
													<FormLabel className="font-normal">Distributor</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="Retailer" />
													</FormControl>
													<FormLabel className="font-normal">Retailer</FormLabel>
												</FormItem>
											</RadioGroup>
										</FormControl>
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={loading}>
								{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{loading ? "Saving..." : "Register"}
							</Button>
						</form>
					</div>
				</div>
			</div>
		</FormProvider>
	);
};

const OnboardingIllustration = () => {
	return (
		<div className="relative flex-1 hidden items-center justify-center h-screen bg-gray-900 lg:flex">
			<div className="relative z-10 w-full max-w-md">
				{/* <img src="https://floatui.com/logo-dark.svg" width={150} /> */}
				<div className=" mt-16 space-y-3">
					<h3 className="text-white text-3xl font-bold">Start growing your business quickly</h3>
					<p className="text-gray-300">Create an account and get access to all features for 30-days, No credit card required.</p>
					<div className="flex items-center -space-x-2 overflow-hidden">
						<img src="https://randomuser.me/api/portraits/women/79.jpg" className="w-10 h-10 rounded-full border-2 border-white" />
						<img src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg" className="w-10 h-10 rounded-full border-2 border-white" />
						<img
							src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a72ca28288878f8404a795f39642a46f"
							className="w-10 h-10 rounded-full border-2 border-white"
						/>
						<img src="https://randomuser.me/api/portraits/men/86.jpg" className="w-10 h-10 rounded-full border-2 border-white" />
						<img
							src="https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e"
							className="w-10 h-10 rounded-full border-2 border-white"
						/>
						<p className="text-sm text-gray-400 font-medium translate-x-5">Join 5.000+ users</p>
					</div>
				</div>
			</div>
			<div
				className="absolute inset-0 my-auto h-[500px]"
				style={{
					background: "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)",
					filter: "blur(118px)",
				}}></div>
		</div>
	);
};

export default Register;
