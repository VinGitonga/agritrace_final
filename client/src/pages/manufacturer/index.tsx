import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { NextPageWithLayout } from "@/types/Layout";

const ManufacturerDashboard: NextPageWithLayout = () => {
	return <div>ManufacturerDashboard</div>;
};

ManufacturerDashboard.getLayout = (page) => <ManufacturerLayout>{page}</ManufacturerLayout>;

export default ManufacturerDashboard;
