import SupplierLayout from "@/layouts/SupplierLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { ColumnDef } from "@tanstack/react-table";
import CustomTable from "@/components/tabler/CustomTable";
import { useState } from "react";
import { IEntityTransaction, TransactionStatus } from "@/types/Transaction";
import useTransactions from "@/hooks/useTransactions";
import useInterval from "@/hooks/useInterval";
import { truncateHash } from "@/utils";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
import { IContractType } from "@/types/Contracts";
import toast from "react-hot-toast";
import { contractTxWithToast } from "@/components/web3/contractTxWithToast";
import Web3TransBtn from "@/components/btn/Web3TransBtn";
import { Badge } from "@/components/ui/badge";

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

const preprocessTimeStamp = (timestamp: string) => {
	const newIntTimestamp = parseInt(timestamp.replace(/,/g, ""));
	const newDate = new Date(newIntTimestamp);

	return timeAgo.format(newDate);
};

const Sales: NextPageWithLayout = () => {
	const [entityTransactions, setEntityTransactions] = useState<IEntityTransaction[]>([]);

	const { getSupplierRawEntityTransactions } = useTransactions();
	const { activeAccount, activeSigner, api } = useInkathon();
	const { contract } = useRegisteredContract(IContractType.TRANSACTIONS);

	const fetchMyRawEntityTransactions = async () => {
		const items = await getSupplierRawEntityTransactions();
		if (items) {
			setEntityTransactions(items);
		}
	};

	const completeEntityTransaction = async (entityCode: string) => {
		if (!activeAccount || !activeSigner || !api || !contract) {
			toast.error("Please connect your wallet");
			return;
		}

		try {
			api.setSigner(activeSigner);
			await contractTxWithToast(api, activeAccount?.address, contract, "completeEntityPurchase", {}, [entityCode]);
		} catch (err) {
			console.log(err);
			toast.error("Something went wrong");
		}
	};

	useInterval(fetchMyRawEntityTransactions, 5000);

	const columns: ColumnDef<IEntityTransaction>[] = [
		{
			accessorKey: "entityCode",
			header: "Code",
			cell: ({ row }) => <div>{row.original.entityCode}</div>,
		},
		{
			accessorKey: "quantity",
			header: "Quantity",
			cell: ({ row }) => <div>{row.original.quantity}</div>,
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => <Badge>{row.original.status}</Badge>,
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
			accessorKey: "buyer",
			header: "Buyer",
			cell: ({ row }) => <div>{truncateHash(row.original.buyer)}</div>,
		},
		{
			header: "Actions",
			enableHiding: false,
			cell: ({ row }) => (
				<>
					{row.original?.status === TransactionStatus.Completed && <Badge color="green">Accepted & Completed</Badge>}
					{row.original?.status === TransactionStatus.Initiated && <Badge variant="destructive">Revert</Badge>}
					{row.original?.status === TransactionStatus.InProgress && <Web3TransBtn text="Complete" onClick={() => completeEntityTransaction(row.original.entityCode)} />}
				</>
			),
		},
	];

	return <CustomTable<IEntityTransaction> columns={columns} data={entityTransactions} searchField="entityCode" />;
};

Sales.getLayout = (page) => <SupplierLayout>{page}</SupplierLayout>;

export default Sales;
