import { createContext, useReducer } from "react";

export const CartContext = createContext({
	meals: [],
	addMealToCart: () => {},
	updateMealQuantity: () => {},
});

function mealsCartReducer(state, action) {
	if (action.type === "ADD_MEAL") {
		const updatedMeals = [...state.meals];

		const existingMealIndex = updatedMeals.findIndex(
			(cartMeal) => cartMeal.id === action.payload
		);

		const existingMeal = updatedMeals[existingMealIndex];

		if (existingMeal) {
			const updatedMeal = {
				...existingMeal,
				quantity: existingMeal.quantity + 1,
			};
		} else {
			const meal = action.payload.array.find(
				(meal) => meal.id === action.payload.id
			);
			updatedMeals.push({
				id: action.payload.id,
				name: meal.name,
				price: meal.price,
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

	const ctxValue = {
		meals: mealsCartState.meals,
		addMealToCart: handleAddMealToCart,
		updateMealQuantity: handleUpdateCartMealQuantity,
	};

	return (
		<CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
	);
}
