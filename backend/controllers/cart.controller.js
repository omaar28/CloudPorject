import {
	fetchCartProducts,
	addItemToCart,
	clearCart,
	changeItemQuantity,
} from "../services/cart.service.js";

export const getCartProducts = async (req, res) => {
	try {
		const cartItems = await fetchCartProducts(req.user.cartItems);
		res.json(cartItems);
	} catch (error) {
		console.error("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const cartItems = await addItemToCart(req.user, productId);
		res.json(cartItems);
	} catch (error) {
		console.error("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const cartItems = await clearCart(req.user, productId);
		res.json(cartItems);
	} catch (error) {
		console.error("Error in removeAllFromCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const cartItems = await changeItemQuantity(req.user, productId, quantity);
		res.json(cartItems);
	} catch (error) {
		console.error("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
