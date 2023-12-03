import SupplierLayout from "@/layouts/SupplierLayout";
import { NextPageWithLayout } from "@/types/Layout";
import Router from "next/router";
import { useEffect } from "react";

const SupplierDashboard: NextPageWithLayout = () => {
	useEffect(() => {
		Router.push("/supplier/my-raw-materials");
	});
	return <div>SupplierDashboard</div>;
};

SupplierDashboard.getLayout = (page) => <SupplierLayout>{page}</SupplierLayout>;

export default SupplierDashboard;
