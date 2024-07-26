import { useState, useEffect } from "react";

import MealItem from "./MealItem";

export default function Meals() {
	const [availableMeals, setAvailableMeals] = useState([]);
	const [error, setError] = useState("");

	useEffect(() => {
		async function fetchMeals() {
			try {
				const response = await fetch("http://localhost:3000/meals");
				const resData = await response.json();

				if (!response.ok) {
					throw new Error(
						resData.message || "Something went wrong, try again later..."
					);
				}

				setAvailableMeals(resData);
			} catch (error) {
				setError(error.message);
			}
		}

		fetchMeals();
	}, []);

	if (error) {
		return (
			<div className="error">
				<h2>Ooops...</h2>
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div id="meals">
			{availableMeals.map((meal) => (
				<MealItem key={meal.id} meals={availableMeals} meal={meal} />
			))}
		</div>
	);
}
