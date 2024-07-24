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

	return (
		<>
			<CartModal ref={modal} />
			<header id="main-header">
				<div id="title">
					<img src={imgLogo} alt="ReactFood Logo" />
					<h1>REACTFOOD</h1>
				</div>
				<button onClick={handleOpenCart}>
					Cart &#10098;{meals.length}&#10099;
				</button>
			</header>
		</>
	);
}
