import { useCallback, useState } from "react";

/**
 * A hook to manage the state of a disclosure.
 *
 * Can be used to managed the state of dialogs, modals, menus, etc.
 *
 * @param initialState The initial state of the disclosure.
 * @param callbacks  Callbacks to be invoked when the disclosure is opened or closed.
 * @returns  An object containing the state of the disclosure and functions to manipulate it.
 * 
 * @example
 * const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
 * 
 * <button onClick={onToggle}>Toggle</button>
 * <button onClick={onOpen}>Open</button>
 * <button onClick={onClose}>Close</button>
 * 
 * {isOpen && <div>Content</div>}
 */
function useDisclosure(initialState: boolean = false, callbacks?: { onOpen?(): void; onClose?(): void }) {
	const { onClose, onOpen } = callbacks || {};
	const [opened, setOpened] = useState<boolean>(initialState);

	const open = useCallback(() => {
		setOpened((isOpened) => {
			if (!isOpened) {
				onOpen == null ? void 0 : onOpen();
				return true;
			}
			return isOpened;
		});
	}, [onOpen]);

	const close = useCallback(() => {
		setOpened((isOpened) => {
			if (isOpened) {
				onClose == null ? void 0 : onClose();
				return false;
			}
			return isOpened;
		});
	}, [onClose]);

	const toggle = useCallback(() => {
		opened ? close() : open();
	}, [close, open, opened]);

	return {
		isOpen: opened,
		onOpen: open,
		onClose: close,
		onToggle: toggle,
	};
}

export default useDisclosure;
