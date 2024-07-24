import { useContext, forwardRef, useImperativeHandle, useRef } from "react";
import { CartContext } from "../store/meals-cart-context";

const CartModal = forwardRef(function Modal({}, ref) {
	const { meals, updateMealQuantity } = useContext(CartContext);
	const dialog = useRef();

	const calculateTotalPrice = () => {
		return meals.reduce((total, meal) => {
			return total + meal.quantity * meal.price;
		}, 0);
	};

	const totalPrice = calculateTotalPrice();

	useImperativeHandle(ref, () => {
		return {
			open: () => {
				dialog.current.showModal();
			},
		};
	});

	return (
		<dialog className="cart modal" ref={dialog}>
			<h2>Your Cart</h2>
			<ul>
				{meals.map((meal) => (
					<li key={`cart-${meal.id}`} className="cart-item">
						<p>
							{meal.name} - {meal.quantity} x ${meal.price}
						</p>
						<div className="cart-item-actions">
							<button onClick={() => updateMealQuantity(meal.id, -1)}>-</button>
							{meal.quantity}
							<button onClick={() => updateMealQuantity(meal.id, +1)}>+</button>
						</div>
					</li>
				))}
			</ul>
			<div className="cart-total">${totalPrice}</div>
			<div className="modal-actions">
				<button className="text-button" onClick={() => dialog.current.close()}>
					Close
				</button>
				<button className="button">Go to Checkout</button>
			</div>
		</dialog>
	);
});

export default CartModal;
