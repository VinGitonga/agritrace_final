import { IProductEntity, IRawEntity } from "@/types/Entity";
import { IBackTrace, IStakeholder } from "@/types/Transaction";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import { HiTruck } from "react-icons/hi";
import { FaSellsy } from "react-icons/fa";
import { Boxes, SendToBack } from "lucide-react";
import { TbMilk } from "react-icons/tb";
import { GiCardDraw, GiTruck } from "react-icons/gi";
import { convertFixU64ToNum } from "@/utils";

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

interface IProps {
	stakeholderInfo: IStakeholder;
	backtrace: IBackTrace;
	product: IProductEntity;
	rawEntities: IRawEntity[];
}

const Results = ({ stakeholderInfo, backtrace, product, rawEntities }: IProps) => {
	return (
		<>
			<VerticalTimeline>
				<VerticalTimelineElement
					className="vertical-timeline-element--work"
					contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
					contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
					date={timeAgo.format(new Date(convertFixU64ToNum(backtrace.productTransaction.updatedAt)), "twitter-now")}
					iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
					icon={<HiTruck />}>
					<h1 className="text-2xl font-bold">Product Distribution</h1>
					<p className="text-lg font-semibold">{stakeholderInfo?.distributor?.name}</p>
					<p className="text-lg font-semibold">{stakeholderInfo?.distributor?.address}</p>
					<p className="text-lg font-semibold">
						{stakeholderInfo?.distributor?.location}
						{" : "} {timeAgo.format(new Date(convertFixU64ToNum(backtrace?.productTransaction?.updatedAt)), "twitter-now")}
					</p>
				</VerticalTimelineElement>
				<VerticalTimelineElement
					className="vertical-timeline-element--work"
					date={timeAgo.format(new Date(convertFixU64ToNum(backtrace?.productTransaction?.updatedAt)), "twitter-now")}
					iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
					icon={<FaSellsy />}>
					<h2 className="text-2xl font-bold">{backtrace?.productTransaction?.status === "Initiated" ? "Product Sell Initiated" : "Product Sell Accepted By Distributor"}</h2>
				</VerticalTimelineElement>
				<VerticalTimelineElement
					className="vertical-timeline-element--work"
					date={timeAgo.format(new Date(convertFixU64ToNum(backtrace?.productTransaction?.createdAt)), "twitter-now")}
					iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
					icon={<Boxes />}>
					<h2 className="text-2xl font-bold">Packaging</h2>
					<p className="text-lg font-semibold">Manufacturer : {stakeholderInfo?.manufacturer?.name}</p>
					<p className="text-lg font-semibold">Manufacturer Address : {stakeholderInfo?.manufacturer?.address}</p>
					<p className="text-lg font-semibold">
						Manufacturer Location : {stakeholderInfo?.manufacturer?.location}
						{" : "} {timeAgo.format(new Date(convertFixU64ToNum(backtrace?.productTransaction?.createdAt ?? "")), "twitter-now")}
					</p>
					<p className="text-lg font-semibold">Packaging Date : {new Date(convertFixU64ToNum(backtrace?.productTransaction?.createdAt ?? ""))?.toLocaleDateString()}</p>
				</VerticalTimelineElement>
				<VerticalTimelineElement
					className="vertical-timeline-element--work"
					date={timeAgo.format(new Date(convertFixU64ToNum(product?.timestamp as unknown as string) ?? 0), "twitter-now")}
					iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
					icon={<TbMilk />}>
					<h2 className="text-2xl font-bold">Product Details</h2>
					<p className="text-lg font-semibold">Product Name : {product?.name}</p>
					<p className="text-lg font-semibold">Added On : {timeAgo.format(new Date(convertFixU64ToNum(product?.timestamp as unknown as string) ?? 0), "twitter-now")}</p>
					<p className="text-lg font-semibold">
						Description : {product?.quantity} {product?.unit}
					</p>
				</VerticalTimelineElement>
				<VerticalTimelineElement
					className="vertical-timeline-element--education"
					date={timeAgo.format(new Date(convertFixU64ToNum(backtrace?.rawEntityTransactions[0]?.createdAt) ?? 0), "twitter-now")}
					iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
					icon={<GiCardDraw />}>
					<h2 className="text-2xl font-bold">Raw Materials Supply Info</h2>
					<p className="text-lg font-semibold">Supplier : {stakeholderInfo?.supplier?.name}</p>
					<p className="text-lg font-semibold">Supplier Address : {stakeholderInfo?.supplier?.address}</p>
					<p className="text-lg font-semibold">
						Supplier Location : {stakeholderInfo?.supplier?.location}
						{" : "} {timeAgo.format(backtrace?.rawEntityTransactions[0]?.createdAt ? new Date(convertFixU64ToNum(backtrace.rawEntityTransactions[0]?.createdAt)) : new Date(), "twitter-now")}
					</p>
				</VerticalTimelineElement>
				<VerticalTimelineElement
					className="vertical-timeline-element--education"
					date={timeAgo.format(new Date(convertFixU64ToNum(rawEntities?.[0]?.timestamp as unknown as string) ?? 0), "twitter-now")}
					iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
					icon={<GiTruck />}>
					<h2 className="text-2xl font-bold">Raw Materials Details</h2>
					{rawEntities.map((rawMaterial) => (
						<p className="text-lg font-semibold">
							{rawMaterial?.name} : {rawMaterial?.quantity} {rawMaterial?.unit}
						</p>
					))}
				</VerticalTimelineElement>
				<VerticalTimelineElement iconStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }} icon={<SendToBack />} />
			</VerticalTimeline>
		</>
	);
};

export default Results;
