export default function OrderOk({ orderMessage, validOrder, close }) {
	return (
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
				<button className="text-button" onClick={close}>
					Close
				</button>
			</div>
		</>
	);
}
