import { useState, useEffect } from "react";

import MealItem from "./MealItem";

export default function Meals() {
	const [availableMeals, setAvailableMeals] = useState([]);

	useEffect(() => {
		async function fetchMeals() {
			const response = await fetch("http://localhost:3000/meals");
			const resData = await response.json();
			setAvailableMeals(resData);
		}

		fetchMeals();
	}, []);

	return (
		<div id="meals">
			{availableMeals.map((meal) => (
				<MealItem
					key={meal.id}
					meals={availableMeals}
					id={meal.id}
					image={meal.image}
					name={meal.name}
					price={meal.price}
					description={meal.description}
				/>
			))}
		</div>
	);
}
