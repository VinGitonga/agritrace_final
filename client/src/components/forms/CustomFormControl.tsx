import { FieldError, FieldErrorsImpl, Merge, UseFormRegister } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useCallback } from "react";
import { Select, SelectItem, SelectTrigger } from "../ui/select";
import { SelectContent, SelectValue } from "@radix-ui/react-select";

export interface IOption {
	label: string;
	value?: string | number;
}

interface IProps {
	label: string;
	name: string;
	description?: string;
	register?: UseFormRegister<any>;
	variant?: "input" | "textarea" | "radio" | "select";
	isRequired?: boolean;
	placeholder?: string;
	error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
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
							<Select onValueChange={field.onChange} value={field.value}>
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
							</Select>
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
