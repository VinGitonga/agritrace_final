import DistributorLayout from "@/layouts/DistributorLayout";
import { NextPageWithLayout } from "@/types/Layout";
import Router from "next/router";
import { useEffect } from "react";

const DistributorDashboard: NextPageWithLayout = () => {
	useEffect(() => {
		Router.push("/distributor/incoming");
	});
	return <div />;
};

DistributorDashboard.getLayout = (page) => <DistributorLayout>{page}</DistributorLayout>;

export default DistributorDashboard;
