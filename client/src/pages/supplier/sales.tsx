import { Checkbox } from "@/components/ui/checkbox";
import SupplierLayout from "@/layouts/SupplierLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/tabler/CustomTable";

interface TSale {
	id: number;
	code: string;
	quantity: number;
	status: string;
	createdAt: string;
	updatedAt: string;
	buyer: string;
}

const sales: TSale[] = [
	{
		id: 1,
		code: "12345678",
		quantity: 100,
		status: "pending",
		createdAt: "12/12/2021",
		updatedAt: "12/12/2021",
		buyer: "0x12345678",
	},
	{
		id: 2,
		code: "23456789",
		quantity: 200,
		status: "pending",
		createdAt: "20/12/2021",
		updatedAt: "20/12/2021",
		buyer: "0x23456789",
	},
	{
		id: 3,
		code: "34567890",
		quantity: 300,
		status: "pending",
		createdAt: "25/12/2021",
		updatedAt: "25/12/2021",
		buyer: "0x34567890",
	},
	{
		id: 4,
		code: "45678901",
		quantity: 400,
		status: "pending",
		createdAt: "30/12/2021",
		updatedAt: "30/12/2021",
		buyer: "0x45678901",
	},
	{
		id: 5,
		code: "56789012",
		quantity: 500,
		status: "pending",
		createdAt: "30/12/2021",
		updatedAt: "30/12/2021",
		buyer: "0x56789012",
	},
];

const columns: ColumnDef<TSale>[] = [
	{
		id: "code",
		header: ({ table }) => <Checkbox checked={table.getIsAllRowsSelected()} onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)} aria-label="Select all rows" />,
		cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select this row" />,
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "code",
		header: "Code",
		cell: ({ row }) => <div>{row.original.code}</div>,
	},
	{
		accessorKey: "quantity",
		header: "Quantity",
		cell: ({ row }) => <div>{row.original.quantity}</div>,
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => <div>{row.original.status}</div>,
	},
	{
		accessorKey: "createdAt",
		header: "Created At",
		cell: ({ row }) => <div>{row.original.createdAt}</div>,
	},
	{
		accessorKey: "updatedAt",
		header: "Updated At",
		cell: ({ row }) => <div>{row.original.updatedAt}</div>,
	},
	{
		accessorKey: "buyer",
		header: "Buyer",
		cell: ({ row }) => <div>{row.original.buyer}</div>,
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

const Sales: NextPageWithLayout = () => {
	return <CustomTable<TSale> columns={columns} data={sales} searchField="code" />;
};

Sales.getLayout = (page) => <SupplierLayout>{page}</SupplierLayout>;

export default Sales;
