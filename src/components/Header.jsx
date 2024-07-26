import imgLogo from "../assets/logo.jpg";
import { useRef, useContext } from "react";

import { CartContext } from "../store/meals-cart-context";
import CartModal from "./CartModal";

export default function Header() {
	const { meals } = useContext(CartContext);
	const modal = useRef();

	function handleOpenCart() {
		modal.current.open();
	}

	const totalCartItems = meals.reduce((totalItems, item) => {
		return totalItems + item.quantity;
	}, 0);

	return (
		<>
			<CartModal ref={modal} />
			<header id="main-header">
				<div id="title">
					<img src={imgLogo} alt="ReactFood Logo" />
					<h1>REACTFOOD</h1>
				</div>
				<button className="text-button" onClick={handleOpenCart}>
					Cart &#10098;{totalCartItems}&#10099;
				</button>
			</header>
		</>
	);
}
