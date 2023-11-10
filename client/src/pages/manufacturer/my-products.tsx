import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { NextPageWithLayout } from "@/types/Layout";

const MyProducts: NextPageWithLayout = () => {
	return <div>MyProducts</div>;
};

MyProducts.getLayout = function getLayout(page) {
	return <ManufacturerLayout>{page}</ManufacturerLayout>;
};

export default MyProducts;
