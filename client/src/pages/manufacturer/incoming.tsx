import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

	const table = useReactTable({
		data: incomingShipments,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<div className="w-full px-4">
			<div className="flex item-center py-4">
				<Input
					placeholder="Filter shipments..."
					value={(table.getColumn("entityCode")?.getFilterValue() as string) ?? ""}
					onChange={(event) => table.getColumn("entityCode")?.setFilterValue(event.target.value)}
					className="max-w-sm"
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columns <ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="space-x-2">
					<Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
						Previous
					</Button>
					<Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
};

IncomingShipments.getLayout = (page) => <ManufacturerLayout>{page}</ManufacturerLayout>;

export default IncomingShipments;
