import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice.js";
import categoriesReducer from "./features/categories/categoriesSlice.js";
import productsReducer from "./features/products/productSlice.js";
import cartReducer from './features/cart/cartSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    products: productsReducer,
    cart: cartReducer,
  },
});
