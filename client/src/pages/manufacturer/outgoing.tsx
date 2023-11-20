import QrCodeModal from "@/components/modals/QrCode";
import CustomTable from "@/components/tabler/CustomTable";
import { Button } from "@/components/ui/button";
import useDisclosure from "@/hooks/useDisclosure";
import useInterval from "@/hooks/useInterval";
import useTransactions from "@/hooks/useTransactions";
import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { IProductTransaction } from "@/types/Transaction";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

const OutgoingShipments: NextPageWithLayout = () => {
	const [shipments, setShipments] = useState<IProductTransaction[]>([]);

	const { getProductPurchaseTransactionsBySeller } = useTransactions();

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

	const columns: ColumnDef<IProductTransaction>[] = [
		{
			accessorKey: "productCode",
			header: "Code",
			cell: ({ row }) => <div>{row.getValue("productCode")}</div>,
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
			cell: ({ row }) => <Button onClick={() => openModal(row.original?.serialNo)}>Show QR Code</Button>,
		},
	];

	useInterval(fetchOutgoingShipments, 5000);

	return (
		<>
			<QrCodeModal open={isOpen} onClose={onClose} serialNo={selectedSerialNo} />
			<CustomTable<IProductTransaction> data={shipments} columns={columns} searchField="productCode" />
		</>
	);
};

OutgoingShipments.getLayout = (page) => <ManufacturerLayout>{page}</ManufacturerLayout>;

export default OutgoingShipments;
