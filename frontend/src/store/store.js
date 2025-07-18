import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice.js";
import categoriesReducer from "./features/categories/categoriesSlice.js";
import productsReducer from "./features/products/productSlice.js";
import cartReducer from './features/cart/cartSlice.js'
import wishlistReducer from './features/wishlist/wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    products: productsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});
