import useAuth from "@/hooks/store/useAuth";
import { AccountRole } from "@/types/Account";
import { useEffect } from "react";
import Router from "next/router";

const dashboard = () => {
	const { account, hasAccount } = useAuth();

	useEffect(() => {
		async function redirect() {
			if (!hasAccount) {
				Router.push("/");
				return;
			}

			switch (account.role) {
				case "Manufacturer":
					Router.push("/manufacturer");
					return;

				case AccountRole.Supplier:
					Router.push("/supplier");
					return;

				case AccountRole.Distributor:
					Router.push("/distributor");
					return;

				case AccountRole.Retailer:
					Router.push("/retailer");
					return;

				default:
					Router.push("/profile");
					return;
			}
		}

		redirect();
	}, [account, hasAccount]);

	return <div />;
};

export default dashboard;
