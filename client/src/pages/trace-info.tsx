import ScanQRCode from "@/components/modals/ScanQRCode";
import Results from "@/components/trace/Results";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAccounts from "@/hooks/useAccounts";
import useEntity from "@/hooks/useEntity";
import useTransactions from "@/hooks/useTransactions";
import { AccountRole } from "@/types/Account";
import { IContractType } from "@/types/Contracts";
import { IProductEntity, IRawEntity } from "@/types/Entity";
import { IBackTrace, IStakeholder } from "@/types/Transaction";
import { consolidateBackTrace } from "@/utils";
import { useInkathon, useRegisteredContract } from "@scio-labs/use-inkathon";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

const TraceInfo = () => {
	const [backtrace, setBacktrace] = useState<IBackTrace>();
	const [rawEntities, setRawEntities] = useState<IRawEntity[]>();
	const [product, setProduct] = useState<IProductEntity>();
	const [stakeholderInfo, setStakeholderInfo] = useState<IStakeholder>();
	const [openQRCodeReader, setOpenQRCodeReader] = useState<boolean>(false);
	const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

	const { api, activeAccount } = useInkathon();
	const { contract } = useRegisteredContract(IContractType.TRANSACTIONS);

	const { getProductPurchaseTransactions, getRawEntityTransactions } = useTransactions();
	const { getProductEntity, getRawEntitiesByBatchNos } = useEntity();
	const { getAccounts } = useAccounts();

	// const [mainAddress] = useState("5EBzvf1j5CwKEVmLxKSxGppoTLKHWqfNfXhXjJmHvCvorm1j");
	const [loading, setLoading] = useState<boolean>(false);
	const [serialNo, setSerialNo] = useState<string>("");

	const fetchTraceBack = async () => {
		if (!api || !contract || !activeAccount) return;

		setLoading(true);
		const id = toast.loading("Fetching Traceback");
		try {
			toast.loading("Validating Serial Number 👨🏽‍✈️ 🕵🏽 ...", { id });

			const product_results_transactions = await getProductPurchaseTransactions();

			// check if serial number is valid
			const serialNoExists = product_results_transactions.some((product) => product.serialNo === serialNo);

			if (!serialNoExists) {
				toast.error("Invalid Serial Number 🤷🏽‍♂️", { id });
				return;
			}

			toast.loading("Loading Raw Entities Transactions 📦 ...", { id });

			// get all raw entities transactions
			const raw_entities_transactions = await getRawEntityTransactions();

			const backTraceResults = consolidateBackTrace(product_results_transactions, raw_entities_transactions, serialNo);

			setBacktrace(backTraceResults);

			toast.loading("Loading Product 📦 ...", { id });

			// get product entity
			const productEntity = await getProductEntity(backTraceResults.productTransaction.productCode);

			setProduct(productEntity);

			toast.loading("Loading Raw Entities 📦 ...", { id });

			// get raw entities by their batch nos but first we've to remove commas from the batch no and return numbers
			const batchNos = productEntity.rawEntities.map((rawEntity) => parseInt(String(rawEntity).replace(/,/g, "")));

			// get raw entities
			const rawEntities = await getRawEntitiesByBatchNos(batchNos);

			setRawEntities(rawEntities);

			toast.loading("Loading Stakeholder Info 📦 ...", { id });

			// get stakeholder info
			const allAccounts = await getAccounts();
			const distributor = allAccounts.find((acc) => acc.role === AccountRole.Distributor);
			const manufacturer = allAccounts.find((acc) => acc.role === AccountRole.Manufacturer);
			const supplier = allAccounts.find((acc) => acc.role === AccountRole.Supplier);

			setStakeholderInfo({
				distributor,
				manufacturer,
				supplier,
			});

			toast.success("Traceback Fetched 🎉", { id });

			setLoading(false);
		} catch (err) {
			toast.error("Something went wrong 😢", { id });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-screen-xl mx-auto px-4 py-28 gap-12 text-gray-600 md:px-8">
			<div className="space-y-5 max-w-4xl mx-auto text-center">
				<Link href="/">
					<h1 className="text-2xl text-indigo-600 font-medium">AgriTrace</h1>
				</Link>
				<h2 className="text-4xl text-gray-800 font-extrabold mx-auto md:text-5xl">
					Trace your product with
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]"> AgriTrace</span>
				</h2>
				<p className="max-w-2xl mx-auto">Trace your product from the manufacturer to the distributor and the supplier. Get all the information about your product.</p>
			</div>
			<div className="flex flex-col items-center justify-center my-4 space-y-2">
				<Label htmlFor="email">Serial No</Label>
				<Input id="serialNo" type="text" placeholder="Serial No e.g. 48264725676503" value={serialNo} onChange={(e) => setSerialNo(e.target.value)} />
				<Button onClick={fetchTraceBack}>Trace</Button>
			</div>
			<Button
				onClick={() => {
					setOpenQRCodeReader(true);
				}}>
				Scan QR Code
			</Button>
			<ScanQRCode open={openQRCodeReader} onClose={() => setOpenQRCodeReader(false)} setUrl={setQrCodeUrl} />
			{loading ? (
				<div className="flex items-center justify-center">
					<Loader2 className="w-16 h-16 text-indigo-600" />
				</div>
			) : (
				stakeholderInfo && (
					<div className="space-y-2">
						<h2 className="text-3xl font-bold">Traceback for: {serialNo}</h2>
						<Results backtrace={backtrace} rawEntities={rawEntities} product={product} stakeholderInfo={stakeholderInfo} />
					</div>
				)
			)}
		</div>
	);
};

export default TraceInfo;
