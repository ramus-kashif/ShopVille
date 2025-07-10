import { createSlice } from "@reduxjs/toolkit";

const loadStateFromLocalStorage = (userId) => {
  try {
    const cartKey = userId ? `cart_${userId}` : "cart_guest";
    const cartData = window.localStorage.getItem(cartKey);
    if (cartData === null) {
      return {
        items: [],
      };
    }
    return JSON.parse(cartData); //This line load cart items from localStorage if items are present there
  } catch (error) {
    console.log("Error while loading cart items", error);
    return {
      items: [],
    };
  }
};

const saveStateIntoLocalStorage = (state, userId) => {
  try {
    const cartKey = userId ? `cart_${userId}` : "cart_guest";
    const cartData = JSON.stringify(state);
    window.localStorage.setItem(cartKey, cartData);
    console.log(`Saved cart to localStorage with key: ${cartKey}`, cartData);
    
    // Verify the data was saved correctly
    const savedData = window.localStorage.getItem(cartKey);
    console.log(`Verified saved data for key ${cartKey}:`, savedData);
  } catch (error) {
    console.log("Error while saving cart items to local storage", error);
  }
};

// Migration function to handle existing cart data
const migrateOldCartData = (userId) => {
  try {
    const oldCartData = window.localStorage.getItem("cart");
    if (oldCartData && userId) {
      const oldCart = JSON.parse(oldCartData);
      if (oldCart.items && oldCart.items.length > 0) {
        // Save old cart data to user-specific storage
        const cartKey = `cart_${userId}`;
        window.localStorage.setItem(cartKey, oldCartData);
        // Remove old cart data
        window.localStorage.removeItem("cart");
        console.log("Migrated old cart data to user-specific storage");
        return oldCart;
      }
    }
    return null;
  } catch (error) {
    console.log("Error migrating cart data:", error);
    return null;
  }
};

// Initialize cart based on current user in localStorage
const getInitialCartState = () => {
  try {
    const userData = window.localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      console.log("User data from localStorage:", user);
      
      // The login response structure is { success: true, message: "Login successful", user, token }
      // So user data is directly in the user field
      const userId = user.user?._id;
      if (userId) {
        console.log("Initializing cart for existing user:", userId);
        return loadStateFromLocalStorage(userId);
      }
    }
    console.log("No user found, initializing empty cart");
    return { items: [] };
  } catch (error) {
    console.log("Error getting initial cart state:", error);
    return { items: [] };
  }
};

const initialState = getInitialCartState();

// use this in store file, authReducer
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { item, userId } = action.payload;
      console.log("Adding item to cart:", item, "for user:", userId);
      
      const existingItem = state.items.find((i) => {
        return i.productId === item.productId;
      });
      if (existingItem) {
        existingItem.quantity += item.quantity;
        console.log("Updated existing item quantity:", existingItem.quantity);
      } else {
        state.items.push(item);
        console.log("Added new item to cart");
      }
      
      console.log("Current cart state:", state.items);
      saveStateIntoLocalStorage(state, userId);
    },
    removeFromCart: (state, action) => {
      const { itemId, userId } = action.payload;
      state.items = state.items.filter((item) => item.productId !== itemId);
      saveStateIntoLocalStorage(state, userId);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity, userId } = action.payload;
      const existingItem = state.items.find((item) => {
        return item.productId === productId;
      });
      if (existingItem) {
        existingItem.quantity = quantity;
      }
      saveStateIntoLocalStorage(state, userId);
    },
    clearCart(state, action) {
      const { userId } = action.payload;
      state.items = [];
      saveStateIntoLocalStorage(state, userId);
    },
    loadUserCart: (state, action) => {
      const { userId } = action.payload;
      console.log("Loading cart for user:", userId);
      
      if (!userId) {
        console.log("No userId provided, clearing cart");
        state.items = [];
        return;
      }
      
      // Try to migrate old cart data first
      const migratedCart = migrateOldCartData(userId);
      if (migratedCart) {
        console.log("Migrated cart data:", migratedCart);
        state.items = migratedCart.items;
      } else {
        const userCart = loadStateFromLocalStorage(userId);
        console.log("Loaded cart from localStorage:", userCart);
        state.items = userCart.items;
      }
      
      console.log("Final cart state:", state.items);
    },
    initializeCart: (state, action) => {
      const { userId } = action.payload;
      console.log("Initializing cart for user:", userId);
      
      if (!userId) {
        console.log("No userId provided for initialization, keeping current state");
        return;
      }
      
      // Only load if cart is empty
      if (state.items.length === 0) {
        const userCart = loadStateFromLocalStorage(userId);
        console.log("Initialized cart from localStorage:", userCart);
        state.items = userCart.items;
      }
    },
    debugCart: (state, action) => {
      const { userId } = action.payload;
      console.log("=== CART DEBUG ===");
      console.log("Current Redux state:", state.items);
      console.log("User ID:", userId);
      
      if (userId) {
        const cartKey = `cart_${userId}`;
        const localStorageData = window.localStorage.getItem(cartKey);
        console.log(`localStorage data for key ${cartKey}:`, localStorageData);
        
        if (localStorageData) {
          try {
            const parsedData = JSON.parse(localStorageData);
            console.log("Parsed localStorage data:", parsedData);
          } catch (error) {
            console.log("Error parsing localStorage data:", error);
          }
        }
      }
      
      // Check all cart-related keys in localStorage
      const allKeys = Object.keys(window.localStorage);
      const cartKeys = allKeys.filter(key => key.startsWith('cart_'));
      console.log("All cart keys in localStorage:", cartKeys);
      
      cartKeys.forEach(key => {
        console.log(`Key ${key}:`, window.localStorage.getItem(key));
      });
      
      // Check user data in localStorage
      const userData = window.localStorage.getItem("user");
      console.log("User data in localStorage:", userData);
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log("Parsed user data:", parsedUser);
        } catch (error) {
          console.log("Error parsing user data:", error);
        }
      }
      
      console.log("=== END CART DEBUG ===");
    },
    clearUserCart: (state, action) => {
      const { userId } = action.payload;
      state.items = [];
      // Also clear from localStorage
      const cartKey = userId ? `cart_${userId}` : "cart_guest";
      window.localStorage.removeItem(cartKey);
    },
  },
});

// Action creators are generated for each case reducer function
export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  loadUserCart, 
  clearUserCart,
  initializeCart,
  debugCart
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.items.length; // Number of unique items
export const selectCartTotalQuantity = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0); // Total quantity
export const selectCartTotal = (state) => state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

export default cartSlice.reducer;
