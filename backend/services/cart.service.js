import Product from "../models/product.model.js";

export const fetchCartProducts = async (cartItems) => {
  const products = await Product.find({ _id: { $in: cartItems.map((item) => item.id) } });
  return products.map((product) => {
    const item = cartItems.find((cartItem) => cartItem.id === product.id);
    return { ...product.toJSON(), quantity: item.quantity };
  });
};

export const addItemToCart = async (user, productId) => {
  const existingItem = user.cartItems.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    user.cartItems.push({ id: productId, quantity: 1 });
  }
  await user.save();
  return user.cartItems;
};

export const clearCart = async (user, productId) => {
  if (!productId) {
    user.cartItems = [];
  } else {
    user.cartItems = user.cartItems.filter((item) => item.id !== productId);
  }
  await user.save();
  return user.cartItems;
};

export const changeItemQuantity = async (user, productId, quantity) => {
  const existingItem = user.cartItems.find((item) => item.id === productId);

  if (existingItem) {
    if (quantity === 0) {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    } else {
      existingItem.quantity = quantity;
    }
    await user.save();
    return user.cartItems;
  }

  throw new Error("Product not found in cart");
};
