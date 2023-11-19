import CustomTable from "@/components/tabler/CustomTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

interface TMyProduct {
	id: number;
	name: string;
	code: string;
	quantity: number;
	rawMaterials: string[];
	batchNo: string;
}

const myProducts: TMyProduct[] = [
	{
		id: 1,
		name: "Product 1",
		code: "12345678",
		quantity: 100,
		rawMaterials: ["12345678", "23456789", "34567890"],
		batchNo: "12345678",
	},
	{
		id: 2,
		name: "Product 2",
		code: "23456789",
		quantity: 200,
		rawMaterials: ["23456789", "34567890", "45678901"],
		batchNo: "23456789",
	},
	{
		id: 3,
		name: "Product 3",
		code: "34567890",
		quantity: 300,
		rawMaterials: ["34567890", "45678901", "56789012"],
		batchNo: "34567890",
	},
	{
		id: 4,
		name: "Product 4",
		code: "45678901",
		quantity: 400,
		rawMaterials: ["45678901", "56789012", "67890123"],
		batchNo: "45678901",
	},
	{
		id: 5,
		name: "Product 5",
		code: "56789012",
		quantity: 500,
		rawMaterials: ["56789012", "67890123", "78901234"],
		batchNo: "56789012",
	},
];

const columns: ColumnDef<TMyProduct>[] = [
	{
		id: "id",
		header: ({ table }) => <Checkbox checked={table.getIsAllRowsSelected()} onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)} aria-label="Select all rows" />,
		cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select this row" />,
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => <div>{row.getValue("name")}</div>,
	},
	{
		accessorKey: "code",
		header: "Code",
		cell: ({ row }) => <div>{row.getValue("code")}</div>,
	},
	{
		accessorKey: "quantity",
		header: "Quantity",
		cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
	},
	{
		accessorKey: "rawMaterials",
		header: "Raw Materials",
		cell: ({ row }) => (
			<div>
				{(row.getValue("rawMaterials") as string[])?.map((rawMaterial: string) => {
					return <div>{rawMaterial}</div>;
				})}
			</div>
		),
	},
	{
		accessorKey: "batchNo",
		header: "Batch No.",
		cell: ({ row }) => <div>{row.getValue("batchNo")}</div>,
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row: _ }) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open options</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem>View</DropdownMenuItem>
					<DropdownMenuItem>Edit</DropdownMenuItem>
					<DropdownMenuItem>Delete</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];

const MyProducts: NextPageWithLayout = () => {
	return <CustomTable<TMyProduct> data={myProducts} columns={columns} searchField="code" />;
};

MyProducts.getLayout = function getLayout(page) {
	return <ManufacturerLayout>{page}</ManufacturerLayout>;
};

export default MyProducts;
