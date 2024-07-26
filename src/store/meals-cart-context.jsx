import { createContext, useReducer } from "react";

export const CartContext = createContext({
	meals: [],
	addMealToCart: () => {},
	updateMealQuantity: () => {},
	clearCart: () => {},
});

function mealsCartReducer(state, action) {
	if (action.type === "ADD_MEAL") {
		const updatedMeals = [...state.meals];

		const existingMealIndex = updatedMeals.findIndex(
			(cartMeal) => cartMeal.id === action.payload.id
		);

		const existingMeal = updatedMeals[existingMealIndex];

		if (existingMeal) {
			const updatedMeal = {
				...existingMeal,
				quantity: existingMeal.quantity + 1,
			};

			updatedMeals[existingMealIndex] = updatedMeal;
		} else {
			const meal = action.payload.array.find(
				(meal) => meal.id === action.payload.id
			);
			updatedMeals.push({
				...meal,
				quantity: 1,
			});
		}

		return {
			meals: updatedMeals,
		};
	}

	if (action.type === "UPDATE_MEAL") {
		const updatedMeals = [...state.meals];
		const existingMealIndex = updatedMeals.findIndex(
			(cartMeal) => cartMeal.id === action.payload.mealId
		);

		const updatedMeal = { ...updatedMeals[existingMealIndex] };
		updatedMeal.quantity += action.payload.amount;

		if (updatedMeal.quantity <= 0) {
			updatedMeals.splice(existingMealIndex, 1);
		} else {
			updatedMeals[existingMealIndex] = updatedMeal;
		}

		return {
			meals: updatedMeals,
		};
	}

	if (action.type === "CLEAR_CART") {
		return {
			meals: [],
		};
	}

	return state;
}

export default function CartContexProvider({ children }) {
	const [mealsCartState, mealsCartDispatch] = useReducer(mealsCartReducer, {
		meals: [],
	});

	function handleAddMealToCart(array, id) {
		mealsCartDispatch({
			type: "ADD_MEAL",
			payload: {
				array,
				id,
			},
		});
	}

	function handleUpdateCartMealQuantity(mealId, amount) {
		mealsCartDispatch({
			type: "UPDATE_MEAL",
			payload: {
				mealId,
				amount,
			},
		});
	}

	function handleClearCart() {
		mealsCartDispatch({ type: "CLEAR_CART" });
	}

	const ctxValue = {
		meals: mealsCartState.meals,
		addMealToCart: handleAddMealToCart,
		updateMealQuantity: handleUpdateCartMealQuantity,
		clearCart: handleClearCart,
	};

	return (
		<CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
	);
}
