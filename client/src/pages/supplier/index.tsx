import SupplierLayout from "@/layouts/SupplierLayout";
import { NextPageWithLayout } from "@/types/Layout";

const SupplierDashboard: NextPageWithLayout = () => {
	return <div>SupplierDashboard</div>;
};

SupplierDashboard.getLayout = (page) => <SupplierLayout>{page}</SupplierLayout>;

export default SupplierDashboard;
