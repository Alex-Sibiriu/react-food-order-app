import { useContext, forwardRef, useImperativeHandle, useRef } from "react";
import { CartContext } from "../store/meals-cart-context";
import { createPortal } from "react-dom";

import OrderModal from "./OrderModal";

const CartModal = forwardRef(function Modal({}, ref) {
	const { meals, updateMealQuantity } = useContext(CartContext);
	const dialog = useRef();
	const modal = useRef();

	function handleCheckoutOpen() {
		modal.current.open();
		dialog.current.close();
	}

	const totalPrice = meals
		.reduce((total, meal) => {
			return total + meal.quantity * meal.price;
		}, 0)
		.toFixed(2);

	useImperativeHandle(ref, () => {
		return {
			open: () => {
				dialog.current.showModal();
			},
		};
	});

	return createPortal(
		<>
			<OrderModal ref={modal} totalPrice={totalPrice} />
			<dialog className="cart modal" ref={dialog}>
				<h2>Your Cart</h2>
				<ul>
					{meals.length < 1 && <p>Nothing in the cart yet.</p>}
					{meals.map((meal) => (
						<li key={`cart-${meal.id}`} className="cart-item">
							<p>
								{meal.name} - {meal.quantity} x ${meal.price}
							</p>
							<div className="cart-item-actions">
								<button onClick={() => updateMealQuantity(meal.id, -1)}>
									-
								</button>
								<span>{meal.quantity}</span>
								<button onClick={() => updateMealQuantity(meal.id, +1)}>
									+
								</button>
							</div>
						</li>
					))}
				</ul>
				{meals.length >= 1 && <div className="cart-total">${totalPrice}</div>}
				<div className="modal-actions">
					<button
						className="text-button"
						onClick={() => dialog.current.close()}
					>
						Close
					</button>
					{meals.length > 0 && (
						<button className="button" onClick={handleCheckoutOpen}>
							Go to Checkout
						</button>
					)}
				</div>
			</dialog>
		</>,
		document.getElementById("modal")
	);
});

export default CartModal;
