import { useContext } from "react";
import { CartContext } from "../store/meals-cart-context";

export default function MealItem({ meals, meal }) {
	const { addMealToCart } = useContext(CartContext);

	return (
		<div className="meal-item">
			<article>
				<img src={`http://localhost:3000/${meal.image}`} alt={meal.name} />
				<div>
					<h3>{meal.name}</h3>
					<p className="meal-item-price">${meal.price}</p>
					<p className="meal-item-description">{meal.description}</p>
				</div>
				<div className="meal-item-actions">
					<button
						className="button"
						onClick={() => addMealToCart(meals, meal.id)}
					>
						Add to Cart
					</button>
				</div>
			</article>
		</div>
	);
}
