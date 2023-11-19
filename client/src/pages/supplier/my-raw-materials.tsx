import { Checkbox } from "@/components/ui/checkbox";
import SupplierLayout from "@/layouts/SupplierLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import CustomTable from "@/components/tabler/CustomTable";
import useEntity from "@/hooks/useEntity";
import { useState } from "react";
import { IRawEntity } from "@/types/Entity";
import useInterval from "@/hooks/useInterval";
import { truncateHash } from "@/utils";

const MyRawMaterials: NextPageWithLayout = () => {
	const columns: ColumnDef<IRawEntity>[] = [
		{
			accessorKey: "code",
			header: "Code",
			cell: ({ row }) => <div>{row.original?.code}</div>,
		},
		{
			accessorKey: "quantity",
			header: "Quantity",
			cell: ({ row }) => <div>{String(row.original?.quantity)?.replace(/,/g, "")}</div>,
		},
		{
			accessorKey: "batchNo",
			header: "Batch No",
			cell: ({ row }) => <div>{row.original?.batchNo}</div>,
		},
		{
			accessorKey: "buyer",
			header: "Buyer",
			cell: ({ row }) => <div>{truncateHash(row.original?.buyer)}</div>,
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
	const { getRawEntities } = useEntity();
	const [rawEntities, setRawEntities] = useState<IRawEntity[]>([]);
	const fetchMyRawMaterials = async () => {
		const items = await getRawEntities();
		if (items) {
			setRawEntities(items);
		}
	};

	useInterval(fetchMyRawMaterials, 5000);

	return <CustomTable<IRawEntity> data={rawEntities} columns={columns} searchField="code" />;
};

MyRawMaterials.getLayout = (page) => <SupplierLayout>{page}</SupplierLayout>;

export default MyRawMaterials;
