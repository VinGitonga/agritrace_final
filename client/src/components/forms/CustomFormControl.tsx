import { Controller, FieldError, FieldErrorsImpl, Merge, UseFormRegister } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { useCallback } from "react";
import { Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

export interface IOption {
	label: string;
	value?: string | number;
}

interface IProps {
	label: string;
	name: string;
	description?: string;
	register?: UseFormRegister<any>;
	variant?: "input" | "textarea" | "radio" | "select" | "multi-select";
	isRequired?: boolean;
	placeholder?: string;
	error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | Merge<FieldError, FieldError[]>;
	control?: any;
	errorMessage?: string;
	pattern?: RegExp;
	options?: (string | IOption)[];
}

const CustomFormControl = ({ label, name, description, register, error, control, variant = "input", isRequired = false, errorMessage = "This field is required", pattern, placeholder, options }: IProps) => {
	const getOptionItem = useCallback((item: (typeof options)[0]) => {
		const isValue = typeof item === "string";

		const v = isValue ? item : item?.value;
		const l = isValue ? item : item?.label ?? item?.value;

		return { value: v, label: l };
	}, []);

	console.log(error);

	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					{variant === "input" && (
						<FormControl>
							<Input {...field} placeholder={placeholder} />
						</FormControl>
					)}
					{variant === "select" && (
						<FormControl>
							<ShadSelect onValueChange={field.onChange} value={field.value}>
								<SelectTrigger>
									<SelectValue placeholder={placeholder ? placeholder : "Select an option"} />
								</SelectTrigger>
								<SelectContent>
									{options?.map((item, index) => (
										<SelectItem key={index} value={getOptionItem(item).value as string}>
											{getOptionItem(item).label}ƒ
										</SelectItem>
									))}
								</SelectContent>
							</ShadSelect>
						</FormControl>
					)}
					{variant === "multi-select" && (
						<FormControl>
							<Controller
								{...field}
								name={name}
								render={(renderProps) => {
									return (
										<Select
											isMulti
											options={options}
											className="basic-multi-select"
											classNamePrefix="select"
											components={animatedComponents}
											onChange={(val) => {
												// @ts-expect-error
												let newVal = Array.from(val as any).map((item) => item?.value);
												renderProps.field.onChange(newVal);
											}}
											placeholder={placeholder ? placeholder : "Select an option"}
											{...register(name)}
											{...renderProps.field}
										/>
									);
								}}
							/>
						</FormControl>
					)}
					{description && <p className="text-sm text-gray-400">{description}</p>}
					{error && <p className="text-sm text-red-500">{error.message as string}</p>}
				</FormItem>
			)}
		/>
	);
};

export default CustomFormControl;
