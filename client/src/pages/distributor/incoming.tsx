import Web3TransBtn from "@/components/btn/Web3TransBtn";
import CustomTable from "@/components/tabler/CustomTable";
import { Badge } from "@/components/ui/badge";
import { contractTxWithToast } from "@/components/web3/contractTxWithToast";
import useInterval from "@/hooks/useInterval";
import useTransactions from "@/hooks/useTransactions";
import DistributorLayout from "@/layouts/DistributorLayout";
import { IContractType } from "@/types/Contracts";
import { NextPageWithLayout } from "@/types/Layout";
import { IProductTransaction, TransactionStatus } from "@/types/Transaction";
import { truncateHash } from "@/utils";
import { useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
import { ColumnDef } from "@tanstack/react-table";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { useState } from "react";
import toast from "react-hot-toast";

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

const preprocessTimeStamp = (timestamp: string) => {
	const newIntTimestamp = parseInt(timestamp.replace(/,/g, ""));
	const newDate = new Date(newIntTimestamp);

	return timeAgo.format(newDate);
};

const Incoming: NextPageWithLayout = () => {
	const [shipments, setShipments] = useState<IProductTransaction[]>([]);

	const { activeAccount, activeSigner, api } = useInkathon();
	const { contract } = useRegisteredContract(IContractType.TRANSACTIONS);
	const { getProductPurchaseTransactionsByBuyer } = useTransactions();

	const fetchIncomingShipments = async () => {
		const items = await getProductPurchaseTransactionsByBuyer();
		if (items) {
			setShipments(items);
		}
	};

	const actionOnProductEntity = async (productCode: string, actionVariant: "purchase" | "reject") => {
		if (!activeAccount || !activeSigner || !api || !contract) {
			toast.error("Please connect your wallet");
			return;
		}

		try {
			api.setSigner(activeSigner);
			await contractTxWithToast(api, activeAccount?.address, contract, actionVariant === "purchase" ? "purchaseProduct" : "rejectProductPurchase", {}, [productCode]);
		} catch (err) {
			console.log(err);
			toast.error("Something went wrong");
		}
	};

	const columns: ColumnDef<IProductTransaction>[] = [
		{
			accessorKey: "productCode",
			header: "Entity Code",
			cell: ({ row }) => <div>{row.getValue("productCode")}</div>,
		},
		{
			accessorKey: "quantity",
			header: "Quantity",
			cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
		},
		{
			accessorKey: "quantityUnit",
			header: "Unit",
			cell: ({ row }) => <div>{row.getValue("quantityUnit")}</div>,
		},
		{
			accessorKey: "batchNo",
			header: "Batch No.",
			cell: ({ row }) => <div>{String(row.getValue("batchNo")).replace(/,/g, "")}</div>,
		},
		{
			accessorKey: "createdAt",
			header: "Created At",
			cell: ({ row }) => <div>{preprocessTimeStamp(row.original.createdAt)}</div>,
		},
		{
			accessorKey: "updatedAt",
			header: "Updated At",
			cell: ({ row }) => <div>{row.original.updatedAt ? preprocessTimeStamp(row.original.updatedAt) : "N/A"}</div>,
		},
		{
			accessorKey: "seller",
			header: "Seller",
			cell: ({ row }) => <div>{truncateHash(row.getValue("seller"))}</div>,
		},
		{
			header: "Actions",
			enableHiding: false,
			cell: ({ row }) => (
				<div className="space-x-2">
					{row.original?.status === TransactionStatus.Completed && <Badge color="green">Completed</Badge>}
					{row.original?.status === TransactionStatus.Initiated && <Web3TransBtn text="Accept" onClick={() => actionOnProductEntity(row.original?.productCode, "purchase")} />}
					{row.original?.status === TransactionStatus.InProgress && <Badge>In Progress</Badge>}
					{row.original?.status === TransactionStatus.Initiated && <Web3TransBtn text="Reject" onClick={() => actionOnProductEntity(row.original?.productCode, "reject")} variant="destructive" />}
				</div>
			),
		},
	];

	useInterval(fetchIncomingShipments, 5000);
	return <CustomTable<IProductTransaction> data={shipments} columns={columns} searchField="productCode" />;
};

Incoming.getLayout = (c) => <DistributorLayout>{c}</DistributorLayout>;

export default Incoming;
