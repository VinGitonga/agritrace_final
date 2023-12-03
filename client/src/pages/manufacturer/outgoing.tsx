import QrCodeModal from "@/components/modals/QrCode";
import CustomStack from "@/components/stacks/CustomStack";
import CustomTable from "@/components/tabler/CustomTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useAccounts from "@/hooks/useAccounts";
import useDisclosure from "@/hooks/useDisclosure";
import useEntity from "@/hooks/useEntity";
import useInterval from "@/hooks/useInterval";
import useTransactions from "@/hooks/useTransactions";
import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { IAccount } from "@/types/Account";
import { IProductEntity } from "@/types/Entity";
import { NextPageWithLayout } from "@/types/Layout";
import { IProductTransaction, TransactionStatus } from "@/types/Transaction";
import { mapAddressToAccount, mapCodeToProductEntity, truncateHash } from "@/utils";
import { useInkathon } from "@scio-labs/use-inkathon";
import { ColumnDef } from "@tanstack/react-table";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { useEffect, useState } from "react";

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

const preprocessTimeStamp = (timestamp: string) => {
	const newIntTimestamp = parseInt(timestamp.replace(/,/g, ""));
	const newDate = new Date(newIntTimestamp);

	return timeAgo.format(newDate);
};

const mapStatusToBadge = (status: TransactionStatus) => {
	switch (status) {
		case TransactionStatus.Initiated:
			return <Badge variant="default">Initiated</Badge>;
		case TransactionStatus.Completed:
			return <Badge variant="success">Confirmed</Badge>;
		case TransactionStatus.Reverted:
			return <Badge variant="destructive">Cancelled</Badge>;
		case TransactionStatus.Reject:
			return <Badge variant="destructive">Rejected</Badge>;
		case TransactionStatus.InProgress:
			return <Badge variant="secondary">In Progress</Badge>;
		default:
			return <Badge variant="default">N/A</Badge>;
	}
};

const OutgoingShipments: NextPageWithLayout = () => {
	const [shipments, setShipments] = useState<IProductTransaction[]>([]);
	const [productEntities, setProductEntities] = useState<IProductEntity[]>([]);
	const [accounts, setAccounts] = useState<IAccount[]>([]);
	const {activeAccount} = useInkathon()

	const { getProductPurchaseTransactionsBySeller } = useTransactions();
	const { getAllProductEntities } = useEntity();
	const { getAccounts } = useAccounts();

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedSerialNo, setSelectedSerialNo] = useState<string>("");

	const openModal = (serialNo: string) => {
		setSelectedSerialNo(serialNo);
		onOpen();
	};

	const fetchOutgoingShipments = async () => {
		try {
			const transactions = await getProductPurchaseTransactionsBySeller();
			setShipments(transactions);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchProductEntities = async () => {
		const items = await getAllProductEntities();
		if (items) {
			setProductEntities(items);
		}
	};

	const fetchAccounts = async () => {
		const items = await getAccounts();
		if (items) {
			setAccounts(items);
		}
	};

	const columns: ColumnDef<IProductTransaction>[] = [
		{
			accessorKey: "productCode",
			header: "Code",
			cell: ({ row }) => (
				<CustomStack>
					<div className="text-sm font-semibold">{mapCodeToProductEntity(productEntities, row?.original?.productCode)?.name}</div>
					<div className="text-xs">{row.getValue("productCode")}</div>
				</CustomStack>
			),
		},
		{
			accessorKey: "quantity",
			header: "Quantity",
			cell: ({ row }) => (
				<div className="text-[12px]">
					{row.getValue("quantity")} {row?.original?.quantityUnit}
				</div>
			),
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => <div>{mapStatusToBadge(row.getValue("status"))}</div>,
		},
		{
			accessorKey: "serialNo",
			header: "Serial No.",
			cell: ({ row }) => <div>{row.getValue("serialNo")}</div>,
		},
		{
			accessorKey: "updatedAt",
			header: "Updated At",
			cell: ({ row }) => <div>{row.original.updatedAt ? preprocessTimeStamp(row.original.updatedAt) : "N/A"}</div>,
		},
		{
			accessorKey: "buyer",
			header: "Buyer",
			cell: ({ row }) => (
				<CustomStack>
					<p className="font-semibold capitalize text-sm">{mapAddressToAccount(accounts ?? [], row?.original?.buyer)?.name ?? "N/A Buyer"}</p>
					<p className="text-gray-500 text-xs">{truncateHash(row.getValue("buyer"))}</p>
				</CustomStack>
			),
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => <Button onClick={() => openModal(row.original?.serialNo)}>Show QR Code</Button>,
		},
	];

	useInterval(fetchOutgoingShipments, 5000);

	useEffect(() => {
		fetchOutgoingShipments();
		fetchProductEntities();
		fetchAccounts();
	}, [activeAccount]);


	return (
		<>
			<QrCodeModal open={isOpen} onClose={onClose} serialNo={selectedSerialNo} />
			<CustomTable<IProductTransaction> data={shipments ?? []} columns={columns} searchField="productCode" searchPlaceholder="Search by Code ..." />
		</>
	);
};

OutgoingShipments.getLayout = (page) => <ManufacturerLayout>{page}</ManufacturerLayout>;

export default OutgoingShipments;
