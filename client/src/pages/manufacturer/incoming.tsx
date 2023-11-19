import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { ColumnDef } from "@tanstack/react-table";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useCallback } from "react";
import CustomTable from "@/components/tabler/CustomTable";

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

interface TIncomingShipment {
	id: number;
	entityCode: string;
	quantity: number;
	unit: string;
	date: string;
	batchNo: string;
	status: string;
	seller: string;
}

const incomingShipments: TIncomingShipment[] = [
	{
		id: 1,
		entityCode: "12345678",
		quantity: 100,
		unit: "packets",
		date: "12/12/2021",
		batchNo: "12345678",
		status: "pending",
		seller: "0x12345678",
	},
	{
		id: 2,
		entityCode: "23456789",
		quantity: 200,
		unit: "packets",
		date: "20/12/2021",
		batchNo: "23456789",
		status: "pending",
		seller: "0x23456789",
	},
	{
		id: 3,
		entityCode: "34567890",
		quantity: 300,
		unit: "packets",
		date: "25/12/2021",
		batchNo: "34567890",
		status: "pending",
		seller: "0x34567890",
	},
	{
		id: 4,
		entityCode: "45678901",
		quantity: 400,
		unit: "packets",
		date: "30/12/2021",
		batchNo: "45678901",
		status: "pending",
		seller: "0x45678901",
	},
	{
		id: 5,
		entityCode: "56789012",
		quantity: 500,
		unit: "packets",
		date: "30/12/2021",
		batchNo: "56789012",
		status: "pending",
		seller: "0x56789012",
	},
];

const columns: ColumnDef<TIncomingShipment>[] = [
	{
		id: "entityCode",
		header: ({ table }) => <Checkbox checked={table.getIsAllRowsSelected()} onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)} aria-label="Select all rows" />,
		cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select this row" />,
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "entityCode",
		header: "Entity Code",
		cell: ({ row }) => <div>{row.getValue("entityCode")}</div>,
	},
	{
		accessorKey: "quantity",
		header: "Quantity",
		cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
	},
	{
		accessorKey: "unit",
		header: "Unit",
		cell: ({ row }) => <div>{row.getValue("unit")}</div>,
	},
	{
		accessorKey: "date",
		header: "Date",
		cell: ({ row }) => <div>{timeAgo.format(new Date())}</div>,
		// timeAgo.format(new Date(row.getValue("date") ? row.getValue("date") : 0).valueOf())
	},
	{
		accessorKey: "batchNo",
		header: "Batch No.",
		cell: ({ row }) => <div>{row.getValue("batchNo")}</div>,
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => <Badge>{row.getValue("status")}</Badge>,
	},
	{
		accessorKey: "seller",
		header: "Seller",
		cell: ({ row }) => <div>{row.getValue("seller")}</div>,
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
					<DropdownMenuItem onClick={useCallback(() => navigator.clipboard.writeText(row.original.entityCode), [])}>Copy payment ID</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>View customer</DropdownMenuItem>
					<DropdownMenuItem>View payment details</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];

const IncomingShipments: NextPageWithLayout = () => {
	return <CustomTable<TIncomingShipment> data={incomingShipments} columns={columns} searchField="entityCode" />;
};

IncomingShipments.getLayout = (page) => <ManufacturerLayout>{page}</ManufacturerLayout>;

export default IncomingShipments;
