import { useContext } from "react";
import { CartContext } from "../store/meals-cart-context";

export default function MealItem({
	meals,
	id,
	image,
	name,
	price,
	description,
}) {
	const { addMealToCart } = useContext(CartContext);
	return (
		<div className="meal-item">
			<article>
				<img src={`http://localhost:3000/${image}`} alt={name} />
				<h3>{name}</h3>
				<p>
					<span className="meal-item-price">${price}</span>
				</p>
				<p className="meal-item-description">{description}</p>
				<div className="meal-item-actions">
					<button className="button" onClick={() => addMealToCart(meals, id)}>
						Add to Cart
					</button>
				</div>
			</article>
		</div>
	);
}
