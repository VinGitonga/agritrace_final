import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { ColumnDef } from "@tanstack/react-table";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useState } from "react";
import CustomTable from "@/components/tabler/CustomTable";
import useInterval from "@/hooks/useInterval";
import { truncateHash } from "@/utils";
import { IEntityTransaction, TransactionStatus } from "@/types/Transaction";
import useTransactions from "@/hooks/useTransactions";
import { Badge } from "@/components/ui/badge";
import Web3TransBtn from "@/components/btn/Web3TransBtn";
import { useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
import { IContractType } from "@/types/Contracts";
import toast from "react-hot-toast";
import { contractTxWithToast } from "@/components/web3/contractTxWithToast";

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

const preprocessTimeStamp = (timestamp: string) => {
	const newIntTimestamp = parseInt(timestamp.replace(/,/g, ""));
	const newDate = new Date(newIntTimestamp);

	return timeAgo.format(newDate);
};

const IncomingShipments: NextPageWithLayout = () => {
	const [shipments, setShipments] = useState<IEntityTransaction[]>([]);

	const { getRawEntitiesPurchaseTransactionsByBuyer } = useTransactions();
	const { activeAccount, activeSigner, api } = useInkathon();
	const { contract } = useRegisteredContract(IContractType.TRANSACTIONS);

	const fetchIncomingShipments = async () => {
		const items = await getRawEntitiesPurchaseTransactionsByBuyer();
		if (items) {
			setShipments(items);
		}
	};

	const actionOnEntity = async (entityCode: string, actionVariant: "purchase" | "reject") => {
		if (!activeAccount || !activeSigner || !api || !contract) {
			toast.error("Please connect your wallet");
			return;
		}

		try {
			api.setSigner(activeSigner);
			await contractTxWithToast(api, activeAccount?.address, contract, actionVariant === "purchase" ? "purchaseEntity" : "rejectEntityPurchase", {}, [entityCode]);
		} catch (err) {
			console.log(err);
			toast.error("Something went wrong");
		}
	};

	const columns: ColumnDef<IEntityTransaction>[] = [
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
					{row.original?.status === TransactionStatus.Initiated && <Web3TransBtn text="Accept" onClick={() => actionOnEntity(row.original?.entityCode, "purchase")} />}
					{row.original?.status === TransactionStatus.InProgress && <Badge>In Progress</Badge>}
					{row.original?.status === TransactionStatus.Initiated && <Web3TransBtn text="Reject" onClick={() => actionOnEntity(row.original?.entityCode, "reject")} variant="destructive" />}
				</div>
			),
		},
	];

	useInterval(fetchIncomingShipments, 5000);

	return <CustomTable<IEntityTransaction> data={shipments} columns={columns} searchField="entityCode" />;
};

IncomingShipments.getLayout = (page) => <ManufacturerLayout>{page}</ManufacturerLayout>;

export default IncomingShipments;
