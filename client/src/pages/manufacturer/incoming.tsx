import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { ColumnDef } from "@tanstack/react-table";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useEffect, useState } from "react";
import CustomTable from "@/components/tabler/CustomTable";
import useInterval from "@/hooks/useInterval";
import { mapAddressToAccount, mapEntityCodetoRawEntity, truncateHash } from "@/utils";
import { IEntityTransaction, TransactionStatus } from "@/types/Transaction";
import useTransactions from "@/hooks/useTransactions";
import { Badge } from "@/components/ui/badge";
import Web3TransBtn from "@/components/btn/Web3TransBtn";
import { useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
import { IContractType } from "@/types/Contracts";
import toast from "react-hot-toast";
import { contractTxWithToast } from "@/components/web3/contractTxWithToast";
import { IRawEntity } from "@/types/Entity";
import useEntity from "@/hooks/useEntity";
import CustomStack from "@/components/stacks/CustomStack";
import { IAccount } from "@/types/Account";
import useAccounts from "@/hooks/useAccounts";

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

const preprocessTimeStamp = (timestamp: string) => {
	const newIntTimestamp = parseInt(timestamp.replace(/,/g, ""));
	const newDate = new Date(newIntTimestamp);

	return timeAgo.format(newDate);
};

const IncomingShipments: NextPageWithLayout = () => {
	const [shipments, setShipments] = useState<IEntityTransaction[]>([]);
	const [rawEntities, setRawEntities] = useState<IRawEntity[]>([]);
	const [accounts, setAccounts] = useState<IAccount[]>([]);

	const { getRawEntitiesPurchaseTransactionsByBuyer } = useTransactions();
	const { activeAccount, activeSigner, api } = useInkathon();
	const { contract } = useRegisteredContract(IContractType.TRANSACTIONS);
	const { getRawEntitiesByBuyer } = useEntity();
	const { getAccounts } = useAccounts();

	const fetchIncomingShipments = async () => {
		const items = await getRawEntitiesPurchaseTransactionsByBuyer();
		if (items) {
			setShipments(items);
		}
	};

	const fetchRawEntitiesByBuyer = async () => {
		const items = await getRawEntitiesByBuyer(activeAccount?.address);
		if (items) {
			setRawEntities(items);
		}
	};

	const fetchAccounts = async () => {
		const items = await getAccounts();
		if (items) {
			setAccounts(items);
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
			cell: ({ row }) => (
				<div>
					<CustomStack>
						<p className="font-semibold uppercase text-sm">{mapEntityCodetoRawEntity(rawEntities, row?.original?.entityCode)?.name}</p>
						<p className="text-gray-500 text-xs">{row.getValue("entityCode")}</p>
					</CustomStack>
				</div>
			),
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
			cell: ({ row }) => (
				<div>
					<CustomStack>
						<p className="font-semibold uppercase text-sm">{mapAddressToAccount(accounts, row?.original?.seller)?.name}</p>
						<p className="text-gray-500 text-xs">{truncateHash(row.getValue("seller"))}</p>
					</CustomStack>
				</div>
			),
		},
		{
			header: "Actions / Status",
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

	useEffect(() => {
		fetchIncomingShipments();
		fetchRawEntitiesByBuyer();
		fetchAccounts();
	}, [activeAccount]);

	useInterval(fetchIncomingShipments, 5000);

	const sortedShipments = shipments.sort((a, b) => {
		// convert the createdAt to int by first removing the commas and then converting to int
		const aInt = parseInt(a.createdAt.replace(/,/g, ""));

		// now do the same for b
		const bInt = parseInt(b.createdAt.replace(/,/g, ""));

		// now sort in desc

		return bInt - aInt;
	});

	return <CustomTable<IEntityTransaction> data={sortedShipments} columns={columns} searchField="entityCode" searchPlaceholder="Search by code ..." />;
};

IncomingShipments.getLayout = (page) => <ManufacturerLayout>{page}</ManufacturerLayout>;

export default IncomingShipments;
