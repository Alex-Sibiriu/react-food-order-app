import {
	useContext,
	forwardRef,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { CartContext } from "../store/meals-cart-context";

import Input from "./Input";

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
			setOrderMessage(
				"There was an error processing your order. Please try again."
			);
		}
		setIsFetching(false);
	};

	return (
		<dialog ref={dialog} className="modal">
			{isEmptyObject(validOrder) && <h2>Checkout</h2>}
			{isFetching && <p>Please wait...</p>}
			{!isEmptyObject(validOrder) && (
				<>
					<h2>{orderMessage}</h2>
					<ul>
						{validOrder.items.map((meal) => (
							<li key={`cart-${meal.id}`} className="cart-item">
								<p>
									{meal.name} - {meal.quantity} x ${meal.price}
								</p>
							</li>
						))}
					</ul>

					<p className="cart-total">Total Price: ${validOrder.totalPrice}</p>

					<div className="modal-actions">
						<button
							className="text-button"
							onClick={handleClose}
							disabled={isFetching}
						>
							Close
						</button>
					</div>
				</>
			)}

			{isEmptyObject(validOrder) && !isFetching && (
				<form onSubmit={handleSubmit}>
					<p>{orderMessage}</p>
					<Input label="name" type="text" name="name" required minLength="3" />
					<Input label="E-Mail Address" type="email" name="email" required />
					<Input label="Street" type="text" name="street" required />
					<div className="control-row">
						<Input
							label="Postal Code"
							type="text"
							name="postal-code"
							required
						/>
						<Input label="City" type="text" name="city" required />
					</div>

					<div className="modal-actions">
						<button
							className="text-button"
							onClick={handleClose}
							disabled={isFetching}
						>
							Close
						</button>
						<button className="button" disabled={isFetching}>
							Checkout
						</button>
					</div>
				</form>
			)}
		</dialog>
	);
});

export default OrderModal;
