import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BASE_CLIENT_URL } from "@/env";
import html2canvas from "html2canvas";
import { useCallback, useEffect, useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";

interface IProps {
	open: boolean;
	onClose: () => void;
	serialNo: string;
}

function QrCodeModal({ open, onClose, serialNo }: IProps) {
	const [url, setUrl] = useState<string>("");
	const qrRef = useRef(null);

	const downloadQrCode = useCallback(() => {
		html2canvas(document.querySelector("#react-qrcode-logo") as any, {
			useCORS: false,
		}).then((canvas) => {
			const link = document.createElement("a");
			link.download = `QRCode-${serialNo}.png`;
			link.href = canvas.toDataURL();
			link.click();
		});
	}, [serialNo]);

	useEffect(() => {
		if (serialNo) {
			setUrl(`${BASE_CLIENT_URL}/trace/${serialNo}`);
		}
	}, [serialNo]);

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Product</DialogTitle>
					<DialogDescription>QR Code</DialogDescription>
				</DialogHeader>
				<div className="flex  items-center justify-center" ref={qrRef}>
					<QRCode value={url} size={300} qrStyle="dots" />
				</div>
				<DialogFooter>
					<div className="flex justify-end space-x-2">
						<Button onClick={onClose}>Close</Button>
						<Button onClick={downloadQrCode}>Download</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default QrCodeModal;
