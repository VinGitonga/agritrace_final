import SupplierLayout from "@/layouts/SupplierLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { ColumnDef } from "@tanstack/react-table";
import CustomTable from "@/components/tabler/CustomTable";
import useEntity from "@/hooks/useEntity";
import { useState } from "react";
import { IRawEntity } from "@/types/Entity";
import useInterval from "@/hooks/useInterval";
import { checkRawMaterialInTransactions, truncateHash } from "@/utils";
import useTransactions from "@/hooks/useTransactions";
import Web3TransBtn from "@/components/btn/Web3TransBtn";
import { useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
import { IContractType } from "@/types/Contracts";
import toast from "react-hot-toast";
import { contractTxWithToast } from "@/components/web3/contractTxWithToast";
import { IEntityTransaction } from "@/types/Transaction";

const MyRawMaterials: NextPageWithLayout = () => {
	const { activeAccount, activeSigner, api } = useInkathon();
	const { contract } = useRegisteredContract(IContractType.TRANSACTIONS);
	const { getRawEntityTransactions } = useTransactions();
	const [rawEntityTransactions, setRawEntityTransactions] = useState<IEntityTransaction[]>([]);

	const fetchMyRawEntityTransactions = async () => {
		const items = await getRawEntityTransactions();
		if (items) {
			setRawEntityTransactions(items);
		}
	};

	const initiateSellRawEntity = async (row: IRawEntity) => {
		if (!activeAccount || !activeSigner || !api || !contract) {
			toast.error("Please connect your wallet");
			return;
		}

		let batchNo = row?.batchNo;
		let batchNoAsNumber = parseInt(batchNo.replace(/,/g, ""));
		let quantity = parseInt(String(row?.quantity).replace(/,/g, ""));

		try {
			api.setSigner(activeSigner);
			await contractTxWithToast(api, activeAccount?.address, contract, "initiateSellEntity", {}, [row?.code, quantity, row?.unit, batchNoAsNumber, row?.buyer]);
		} catch (err) {
			console.log(err);
			toast.error("Something went wrong");
		}
	};

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
			header: "Actions",
			cell: ({ row }) => (
				<Web3TransBtn
					text={checkRawMaterialInTransactions(rawEntityTransactions, row?.original?.batchNo) ? "Sold" : "Sell"}
					item={row.original}
					isDisabled={checkRawMaterialInTransactions(rawEntityTransactions, row?.original?.batchNo)}
					onClick={() => initiateSellRawEntity(row.original)}
				/>
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

	const fetchAll = async () => {
		fetchMyRawMaterials();
		fetchMyRawEntityTransactions();
	};

	useInterval(fetchAll, 5000);


	return <CustomTable<IRawEntity> data={rawEntities} columns={columns} searchField="code" />;
};

MyRawMaterials.getLayout = (page) => <SupplierLayout>{page}</SupplierLayout>;

export default MyRawMaterials;
