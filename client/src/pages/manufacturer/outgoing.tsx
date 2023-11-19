import CustomTable from "@/components/tabler/CustomTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useCallback } from "react";

interface TOutgoingShipment {
	id: number;
	code: string;
	quantity: number;
	status: string;
	serialNo: string;
	updatedAt: string;
	buyer: string;
}

const outgoingShipments: TOutgoingShipment[] = [
	{
		id: 1,
		code: "12345678",
		quantity: 100,
		status: "pending",
		serialNo: "12345678",
		updatedAt: "12/12/2021",
		buyer: "0x12345678",
	},
	{
		id: 2,
		code: "23456789",
		quantity: 200,
		status: "in-transit",
		serialNo: "23456789",
		updatedAt: "20/12/2021",
		buyer: "0x23456789",
	},
	{
		id: 3,
		code: "34567890",
		quantity: 300,
		status: "delivered",
		serialNo: "34567890",
		updatedAt: "25/12/2021",
		buyer: "0x34567890",
	},
	{
		id: 4,
		code: "45678901",
		quantity: 400,
		status: "delivered",
		serialNo: "45678901",
		updatedAt: "30/12/2021",
		buyer: "0x45678901",
	},
	{
		id: 5,
		code: "56789012",
		quantity: 500,
		status: "delivered",
		serialNo: "56789012",
		updatedAt: "30/12/2021",
		buyer: "0x56789012",
	},
];

const columns: ColumnDef<TOutgoingShipment>[] = [
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
		cell: ({ row }) => <div>{row.getValue("code")}</div>,
	},
	{
		accessorKey: "quantity",
		header: "Quantity",
		cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => <div>{row.getValue("status")}</div>,
	},
	{
		accessorKey: "serialNo",
		header: "Serial No.",
		cell: ({ row }) => <div>{row.getValue("serialNo")}</div>,
	},
	{
		accessorKey: "updatedAt",
		header: "Updated At",
		cell: ({ row }) => <div>{row.getValue("updatedAt")}</div>,
	},
	{
		accessorKey: "buyer",
		header: "Buyer",
		cell: ({ row }) => <div>{row.getValue("buyer")}</div>,
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={useCallback(() => navigator.clipboard.writeText(row.original.code), [])}>Copy payment ID</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>View customer</DropdownMenuItem>
					<DropdownMenuItem>View payment details</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];

const OutgoingShipments: NextPageWithLayout = () => {
	return <CustomTable<TOutgoingShipment> data={outgoingShipments} columns={columns} searchField="code" />;
};

OutgoingShipments.getLayout = (page) => <ManufacturerLayout>{page}</ManufacturerLayout>;

export default OutgoingShipments;
