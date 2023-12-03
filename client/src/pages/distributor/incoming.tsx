import Web3TransBtn from "@/components/btn/Web3TransBtn";
import CustomStack from "@/components/stacks/CustomStack";
import CustomTable from "@/components/tabler/CustomTable";
import { Badge } from "@/components/ui/badge";
import { contractTxWithToast } from "@/components/web3/contractTxWithToast";
import useAccounts from "@/hooks/useAccounts";
import useEntity from "@/hooks/useEntity";
import useInterval from "@/hooks/useInterval";
import useTransactions from "@/hooks/useTransactions";
import DistributorLayout from "@/layouts/DistributorLayout";
import { IAccount } from "@/types/Account";
import { IContractType } from "@/types/Contracts";
import { IProductEntity } from "@/types/Entity";
import { NextPageWithLayout } from "@/types/Layout";
import { IProductTransaction, TransactionStatus } from "@/types/Transaction";
import { convertFixU64ToNum, mapAddressToAccount, mapCodeToProductEntity, truncateHash } from "@/utils";
import { useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
import { ColumnDef } from "@tanstack/react-table";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { useEffect, useState } from "react";
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
	const [products, setProducts] = useState<IProductEntity[]>([]);
	const [accounts, setAccounts] = useState<IAccount[]>([]);

	const { activeAccount, activeSigner, api } = useInkathon();
	const { contract } = useRegisteredContract(IContractType.TRANSACTIONS);
	const { getProductPurchaseTransactionsByBuyer } = useTransactions();
	const { getAllProductEntities } = useEntity();
	const { getAccounts } = useAccounts();

	const fetchIncomingShipments = async () => {
		const items = await getProductPurchaseTransactionsByBuyer();
		if (items) {
			setShipments(items);
		}
	};

	const fetchAccounts = async () => {
		const items = await getAccounts();
		if (items) {
			setAccounts(items);
		}
	};

	const fetchProducts = async () => {
		const items = await getAllProductEntities();
		if (items) {
			setProducts(items);
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
			header: "Product Code",
			cell: ({ row }) => (
				<CustomStack>
					<p className="text-sm font-semibold">{mapCodeToProductEntity(products, row?.original?.productCode)?.name}</p>
					<p className="text-xs text-gray-500">{row.original.productCode}</p>
				</CustomStack>
			),
		},
		{
			accessorKey: "quantity",
			header: "Quantity",
			cell: ({ row }) => (
				<p className="text-sm">
					<span className="font-semibold">{convertFixU64ToNum(row?.original?.quantity as unknown as string)}</span> {row?.original?.quantityUnit}{" "}
				</p>
			),
		},

		{
			accessorKey: "batchNo",
			header: "Batch No.",
			cell: ({ row }) => <div>{convertFixU64ToNum(row.original?.batchNo as unknown as string)}</div>,
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
			header: "From",
			cell: ({ row }) => (
				<CustomStack>
					<p className="text-sm font-semibold">{mapAddressToAccount(accounts, row.original?.seller)?.name}</p>
					<p className="text-xs text-gray-500">{truncateHash(row.original?.seller)}</p>
				</CustomStack>
			),
		},
		{
			header: "Actions / Status",
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

	const fetchAllData = async () => {
		fetchIncomingShipments();
		fetchAccounts();
		fetchProducts();
	};

	useInterval(fetchAllData, 5000);

	useEffect(() => {
		fetchAllData();
	}, [activeAccount]);

	return <CustomTable<IProductTransaction> data={shipments} columns={columns} searchField="productCode" searchPlaceholder="Search by Product Code" />;
};

Incoming.getLayout = (c) => <DistributorLayout>{c}</DistributorLayout>;

export default Incoming;
