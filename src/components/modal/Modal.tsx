import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import classes from './Modal.module.css';

interface IModal {
	isShow: boolean,
	doClose: () => void,
	children: React.ReactNode;
}

export default function Modal({ isShow, doClose, children }: IModal) {
	const refDialog = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (isShow) {
			refDialog.current?.showModal();
		} else {
			refDialog.current?.close();
		}

		const afterClose = () => {
			if (isShow) {
				console.log('close');
				doClose();
			}
		}

		refDialog.current?.addEventListener('cancel', afterClose)

		return () => {
			refDialog.current?.removeEventListener('cancel', afterClose);
			console.log('remove');

		}

	}, [isShow]);

	console.log('modal render');


	return (
		createPortal(

			<dialog ref={refDialog}>
				<div className={classes.dialog}>
					{children}
				</div>

			</dialog>,
			document.getElementById('for_modal') as HTMLElement
		)
	)
}