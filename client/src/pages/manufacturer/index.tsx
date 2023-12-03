import ManufacturerLayout from "@/layouts/ManufacturerLayout";
import { NextPageWithLayout } from "@/types/Layout";
import Router from "next/router";
import { useEffect } from "react";

const ManufacturerDashboard: NextPageWithLayout = () => {
	useEffect(() => {
		Router.push("/manufacturer/my-products");
	});
	return <div />;
};

ManufacturerDashboard.getLayout = (page) => <ManufacturerLayout>{page}</ManufacturerLayout>;

export default ManufacturerDashboard;
