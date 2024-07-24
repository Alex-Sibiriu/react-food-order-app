import Header from "./components/Header";
import Meals from "./components/Meals";
import CartContexProvider from "./store/meals-cart-context";

function App() {
	return (
		<CartContexProvider>
			<Header />
			<Meals />
		</CartContexProvider>
	);
}

export default App;
