import DistributorLayout from "@/layouts/DistributorLayout";
import { NextPageWithLayout } from "@/types/Layout";

const DistributorDashboard: NextPageWithLayout = () => {
	return <div>DistributorDashboard</div>;
};

DistributorDashboard.getLayout = (page) => <DistributorLayout>{page}</DistributorLayout>;

export default DistributorDashboard;
