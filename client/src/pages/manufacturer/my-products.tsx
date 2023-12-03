import SaleProductModal from "@/components/modals/SaleProductModal";
import CustomStack from "@/components/stacks/CustomStack";
import CustomTable from "@/components/tabler/CustomTable";
import useAccounts from "@/hooks/useAccounts";
import useEntity from "@/hooks/useEntity";
import useInterval from "@/hooks/useInterval";
import useTransactions from "@/hooks/useTransactions";
import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { IAccount } from "@/types/Account";
import { IProductEntity, IRawEntity } from "@/types/Entity";
import { NextPageWithLayout } from "@/types/Layout";
import { IProductTransaction } from "@/types/Transaction";
import { convertFixU64ToNum, mapBatchNoToRawEntity, validateProductStatus } from "@/utils";
import { useInkathon } from "@scio-labs/use-inkathon";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

const MyProducts: NextPageWithLayout = () => {
	const { getMyProductEntities, getAllRawEntities } = useEntity();
	const { getProductPurchaseTransactions } = useTransactions();
	const { getAccounts } = useAccounts();
	const { activeAccount } = useInkathon();

	const [myProducts, setMyProducts] = useState<IProductEntity[]>([]);
	const [productPurchases, setProductPurchases] = useState<IProductTransaction[]>([]);
	const [productToSell, setProductToSell] = useState<IProductEntity | null>(null);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [accounts, setAccounts] = useState<IAccount[]>([]);
	const [rawEntities, setRawEntities] = useState<IRawEntity[]>([]);

	const fetchMyProducts = async () => {
		const items = await getMyProductEntities();
		if (items) {
			setMyProducts(items);
		}
	};

	const fetchProductPurchases = async () => {
		const items = await getProductPurchaseTransactions();
		if (items) {
			setProductPurchases(items);
		}
	};

	const fetchDistributorAccounts = async () => {
		const accs = await getAccounts();

		if (accs) {
			setAccounts(accs);
		}
	};

	const fetchRawEntities = async () => {
		const items = await getAllRawEntities();
		if (items) {
			setRawEntities(items);
		}
	};

	const fetchAll = async () => {
		fetchMyProducts();
		fetchProductPurchases();
		fetchDistributorAccounts();
		fetchRawEntities();
	};

	const toggleOpenModal = (product: IProductEntity) => {
		setProductToSell(product);
		setOpenModal(true);
	};

	const columns: ColumnDef<IProductEntity>[] = [
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => <div>{row.getValue("name")}</div>,
		},
		{
			accessorKey: "code",
			header: "Code",
			cell: ({ row }) => <div>{row.getValue("code")}</div>,
		},
		{
			accessorKey: "quantity",
			header: "Quantity",
			cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
		},
		{
			accessorKey: "rawEntities",
			header: "Raw Materials",
			cell: ({ row }) => (
				<div>
					{(row.getValue("rawEntities") as string[])?.map((rawMaterial: string) => {
						return (
							<CustomStack>
								<p className="font-semibold uppercase text-sm">{mapBatchNoToRawEntity(rawEntities, String(convertFixU64ToNum(rawMaterial)))?.name}</p>
								<p className="text-gray-500 text-xs">{convertFixU64ToNum(rawMaterial)}</p>
							</CustomStack>
						);
					})}
				</div>
			),
		},
		{
			accessorKey: "batchNo",
			header: "Batch No.",
			cell: ({ row }) => <div>{convertFixU64ToNum(row.getValue("batchNo"))}</div>,
		},
		{
			id: "actions",
			enableHiding: false,
			header: "Actions / Status",
			cell: ({ row }) => (
				<>
					<SaleProductModal
						onClickTrigger={() => toggleOpenModal(row?.original)}
						disabled={validateProductStatus(productPurchases, row.original?.code)}
						text={validateProductStatus(productPurchases, row.original?.code) ? "Sold" : "Sell"}
						open={openModal}
						setOpen={setOpenModal}
						product={productToSell}
						accounts={accounts}
					/>
				</>
			),
		},
	];

	// we need to pause the interval when the modal is open
	useInterval(fetchAll, openModal ? null : 5000);

	useEffect(() => {
		fetchAll();
	}, [activeAccount]);

	return <CustomTable<IProductEntity> data={myProducts} columns={columns} searchField="code" searchPlaceholder="Search by Code ..." />;
};

MyProducts.getLayout = function getLayout(page) {
	return <ManufacturerLayout>{page}</ManufacturerLayout>;
};

export default MyProducts;
