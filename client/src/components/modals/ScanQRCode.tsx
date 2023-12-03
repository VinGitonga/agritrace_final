import { QrReader } from "react-qr-reader";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useCallback, useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

interface IProps {
	open: boolean;
	onClose: () => void;
	setUrl: (url: string) => void;
}

const ScanQRCode = ({ open, onClose, setUrl }: IProps) => {
	const modalRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);

	const onScan = (result: QrScanner.ScanResult) => {
		if (result) {
			setUrl(result.data);
			onClose();
		}
	};

	async function close() {
		qrScanner?.stop();
		qrScanner?.destroy();
		setQrScanner(undefined);
	}

	const onDismiss = async () => {
		await close();
		onClose();
	};

	useEffect(() => {
		if (videoRef.current) {
			const qrScanner = new QrScanner(videoRef.current, (result) => onScan(result), {
				highlightScanRegion: true,
			});
			qrScanner.start();
			setQrScanner(qrScanner);
		}
	}, [videoRef.current]);

	const redirect = useCallback((url: string) => {
		window.location.href = url;
	}, []);

	return (
		<Dialog open={open} onOpenChange={onDismiss}>
			<DialogContent className="sm:max-w-[425px]" ref={modalRef}>
				<DialogHeader>
					<DialogTitle>Scan QR Code</DialogTitle>
					<DialogDescription>Scan the QR code to trace the product journey</DialogDescription>
				</DialogHeader>
				<div className="flex  items-center justify-center">
					{/* <video ref={videoRef}></video> */}
					<QrReader
						constraints={{ facingMode: "environment" }}
						containerStyle={{
							width: "100%",
						}}
						onResult={(result) => {
							if (result) {
								setUrl(result.getText());
								redirect(result.getText());
								onClose();
							}
						}}
						scanDelay={open ? 500 : 0}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ScanQRCode;
