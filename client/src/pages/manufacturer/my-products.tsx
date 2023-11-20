import SaleProductModal from "@/components/modals/SaleProductModal";
import CustomTable from "@/components/tabler/CustomTable";
import { Button } from "@/components/ui/button";
import useEntity from "@/hooks/useEntity";
import useInterval from "@/hooks/useInterval";
import useTransactions from "@/hooks/useTransactions";
import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { IProductEntity } from "@/types/Entity";
import { NextPageWithLayout } from "@/types/Layout";
import { IProductTransaction } from "@/types/Transaction";
import { validateProductStatus } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

const MyProducts: NextPageWithLayout = () => {
	const { getMyProductEntities } = useEntity();
	const { getProductPurchaseTransactions } = useTransactions();

	const [myProducts, setMyProducts] = useState<IProductEntity[]>([]);
	const [productPurchases, setProductPurchases] = useState<IProductTransaction[]>([]);
	const [productToSell, setProductToSell] = useState<IProductEntity | null>(null);
	const [openModal, setOpenModal] = useState<boolean>(false);

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

	const fetchAll = async () => {
		fetchMyProducts();
		fetchProductPurchases();
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
						return <div>{rawMaterial}</div>;
					})}
				</div>
			),
		},
		{
			accessorKey: "batchNo",
			header: "Batch No.",
			cell: ({ row }) => <div>{row.getValue("batchNo")}</div>,
		},
		{
			id: "actions",
			enableHiding: false,
			header: "Actions",
			cell: ({ row }) => (
				<>
					<SaleProductModal
						onClickTrigger={() => toggleOpenModal(row?.original)}
						disabled={validateProductStatus(productPurchases, row.original?.code)}
						text={validateProductStatus(productPurchases, row.original?.code) ? "Sold" : "Sell"}
						open={openModal}
						setOpen={setOpenModal}
						product={productToSell}
					/>
				</>
			),
		},
	];

	useInterval(fetchAll, 5000);

	return (
		<>
			<CustomTable<IProductEntity> data={myProducts} columns={columns} searchField="code" />
		</>
	);
};

MyProducts.getLayout = function getLayout(page) {
	return <ManufacturerLayout>{page}</ManufacturerLayout>;
};

export default MyProducts;
