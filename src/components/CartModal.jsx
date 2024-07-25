import { useContext, forwardRef, useImperativeHandle, useRef } from "react";
import { CartContext } from "../store/meals-cart-context";

import OrderModal from "./OrderModal";

const CartModal = forwardRef(function Modal({}, ref) {
	const { meals, updateMealQuantity } = useContext(CartContext);
	const dialog = useRef();
	const modal = useRef();

	function handleCheckoutOpen() {
		modal.current.open();
		dialog.current.close();
	}

	const calculateTotalPrice = () => {
		return meals.reduce((total, meal) => {
			return total + meal.quantity * meal.price;
		}, 0);
	};

	const totalPrice = calculateTotalPrice().toFixed(2);

	useImperativeHandle(ref, () => {
		return {
			open: () => {
				dialog.current.showModal();
			},
		};
	});

	return (
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
								{meal.quantity}
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
					<button
						className="button"
						disabled={meals.length < 1}
						onClick={handleCheckoutOpen}
					>
						Go to Checkout
					</button>
				</div>
			</dialog>
		</>
	);
});

export default CartModal;
