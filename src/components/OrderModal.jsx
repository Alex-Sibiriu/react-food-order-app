import {
	useContext,
	forwardRef,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { CartContext } from "../store/meals-cart-context";
import { createPortal } from "react-dom";

import Input from "./Input";
import OrderOk from "./OrderOk";

function isEmptyObject(obj) {
	return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

const OrderModal = forwardRef(function Modal({ totalPrice }, ref) {
	const [orderMessage, setOrderMessage] = useState("");
	const [validOrder, setValidOrder] = useState({});
	const [isFetching, setIsFetching] = useState(false);
	const { meals, clearCart } = useContext(CartContext);
	const dialog = useRef();

	useImperativeHandle(ref, () => {
		return {
			open: () => {
				dialog.current.showModal();
			},
		};
	});

	function handleClose() {
		dialog.current.close();
		setValidOrder({});
		setOrderMessage("");
	}

	function handleSubmit(event) {
		event.preventDefault();

		const fd = new FormData(event.target);
		const data = {};
		data.customer = Object.fromEntries(fd.entries());
		data.items = meals;
		data.totalPrice = totalPrice;

		console.log(data);

		sendOrder(data);
	}

	const sendOrder = async (data) => {
		setIsFetching(true);
		setOrderMessage("");
		try {
			const response = await fetch("http://localhost:3000/orders", {
				method: "POST",
				body: JSON.stringify({ order: data }),
				headers: { "Content-Type": "application/json" },
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const resData = await response.json();

			setValidOrder({ ...data });
			setOrderMessage(resData.message);
			clearCart();
		} catch (error) {
			console.error("There was a problem with the fetch operation:", error);
			setOrderMessage(error.message);
		}
		setIsFetching(false);
	};

	return createPortal(
		<dialog ref={dialog} className="modal">
			{isEmptyObject(validOrder) && <h2>Checkout</h2>}
			{isFetching && <p>Please wait...</p>}
			{!isEmptyObject(validOrder) && (
				<OrderOk
					orderMessage={orderMessage}
					validOrder={validOrder}
					close={handleClose}
				/>
			)}

			{isEmptyObject(validOrder) && !isFetching && (
				<form onSubmit={handleSubmit}>
					<p>{orderMessage}</p>
					<Input label="name" type="text" id="name" minLength="3" />
					<Input label="E-Mail Address" type="email" id="email" />
					<Input label="Street" type="text" id="street" />
					<div className="control-row">
						<Input label="Postal Code" type="text" id="postal-code" />
						<Input label="City" type="text" id="city" />
					</div>

					<div className="modal-actions">
						<button
							className="text-button"
							type="button"
							onClick={handleClose}
							disabled={isFetching}
						>
							Close
						</button>
						<button className="button" disabled={isFetching}>
							Submit Order
						</button>
					</div>
				</form>
			)}
		</dialog>,
		document.getElementById("modal")
	);
});

export default OrderModal;
