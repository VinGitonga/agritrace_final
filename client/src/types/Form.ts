import { IOption } from "@/components/forms/CustomFormControl";

export interface RegisterFormValues {
	name: string;
	phoneNo: string;
	email: string;
	location: string;
	role: string;
}

export interface RawMaterialFormValues {
	name: string;
	quantity: string;
	unit: string;
	code: string;
	buyer: string;
}

export interface ProductFormValues {
	name: string;
	quantity: string;
	unit: string;
	code: string;
	rawMaterials: (string | IOption)[];
}
