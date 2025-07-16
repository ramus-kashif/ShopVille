import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCart, addToCartAPI, removeFromCartAPI, clearCartAPI } from "./cartService";

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
    console.error("Error while loading cart items", error);
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
  } catch (error) {
    console.error("Error while saving cart items to local storage", error);
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
        return oldCart;
      }
    }
    return null;
  } catch (error) {
    console.error("Error migrating cart data:", error);
    return null;
  }
};

// Initialize cart based on current user in localStorage
const getInitialCartState = () => {
  try {
    const userData = window.localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      // Use flat user object
      const userId = user._id;
      if (userId) {
        return loadStateFromLocalStorage(userId);
      }
    }
    return { items: [] };
  } catch (error) {
    console.error("Error getting initial cart state:", error);
    return { items: [] };
  }
};

const initialState = getInitialCartState();

// Thunks for backend cart actions
export const fetchUserCart = createAsyncThunk("cart/fetchUserCart", async (_, { rejectWithValue }) => {
  try {
    return await fetchCart();
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const addToCartBackend = createAsyncThunk("cart/addToCartBackend", async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    return await addToCartAPI(productId, quantity);
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const removeFromCartBackend = createAsyncThunk("cart/removeFromCartBackend", async (productId, { rejectWithValue }) => {
  try {
    return await removeFromCartAPI(productId);
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const clearCartBackend = createAsyncThunk("cart/clearCartBackend", async (_, { rejectWithValue }) => {
  try {
    return await clearCartAPI();
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// New thunks that handle both local and backend sync
export const addToCartWithBackendSync = createAsyncThunk(
  "cart/addToCartWithBackendSync", 
  async ({ item, userId }, { dispatch }) => {
    // First update local state
    dispatch(addToCart({ item, userId }));
    
    // Then sync with backend if user is logged in
    if (userId) {
      try {
        const result = await addToCartAPI(item.productId, item.quantity);
        return result;
      } catch (error) {
        console.error("Backend sync failed for addToCart:", error);
        // Don't throw error - keep local state intact
        return null;
      }
    }
    return null;
  }
);

export const removeFromCartWithBackendSync = createAsyncThunk(
  "cart/removeFromCartWithBackendSync", 
  async ({ itemId, userId }, { dispatch }) => {
    // First update local state
    dispatch(removeFromCart({ itemId, userId }));
    
    // Then sync with backend if user is logged in
    if (userId) {
      try {
        const result = await removeFromCartAPI(itemId);
        return result;
      } catch (error) {
        console.error("Backend sync failed for removeFromCart:", error);
        // Don't throw error - keep local state intact
        return null;
      }
    }
    return null;
  }
);

export const updateQuantityWithBackendSync = createAsyncThunk(
  "cart/updateQuantityWithBackendSync", 
  async ({ productId, quantity, userId }, { dispatch }) => {
    // First update local state
    dispatch(updateQuantity({ productId, quantity, userId }));
    
    // Then sync with backend if user is logged in
    if (userId) {
      try {
        // Remove current item and add with new quantity
        await removeFromCartAPI(productId);
        if (quantity > 0) {
          const result = await addToCartAPI(productId, quantity);
          return result;
        }
      } catch (error) {
        console.error("Backend sync failed for updateQuantity:", error);
        // Don't throw error - keep local state intact
        return null;
      }
    }
    return null;
  }
);

export const clearCartWithBackendSync = createAsyncThunk(
  "cart/clearCartWithBackendSync", 
  async ({ userId }, { dispatch }) => {
    // First update local state
    dispatch(clearCart({ userId }));
    
    // Then sync with backend if user is logged in
    if (userId) {
      try {
        const result = await clearCartAPI();
        return result;
      } catch (error) {
        console.error("Backend sync failed for clearCart:", error);
        // Don't throw error - keep local state intact
        return null;
      }
    }
    return null;
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { item, userId } = action.payload;
      
      const existingItem = state.items.find((i) => {
        return i.productId === item.productId;
      });
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
      
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
      
      if (!userId) {
        state.items = [];
        return;
      }
      
      // Try to migrate old cart data first
      const migratedCart = migrateOldCartData(userId);
      if (migratedCart) {
        state.items = migratedCart.items;
      } else {
        const userCart = loadStateFromLocalStorage(userId);
        state.items = userCart.items;
      }
    },
    initializeCart: (state, action) => {
      const { userId } = action.payload;
      
      if (!userId) {
        return;
      }
      
      // Only load if cart is empty
      if (state.items.length === 0) {
        const userCart = loadStateFromLocalStorage(userId);
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
    updateCartPrices: (state, action) => {
      const { products } = action.payload;
      if (!products || !Array.isArray(products)) return;
      
      // Create a map of product prices for quick lookup
      const priceMap = {};
      products.forEach(product => {
        priceMap[product._id] = product.price;
      });
      
      // Update cart item prices with current product prices
      state.items.forEach(item => {
        if (priceMap[item.productId]) {
          item.price = priceMap[item.productId];
        }
      });
      
      // Save updated cart to localStorage
      const userData = window.localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          // Use flat user object
          const userId = user._id;
          if (userId) {
            saveStateIntoLocalStorage(state, userId);
          }
        } catch (error) {
          console.error("Error updating cart prices:", error);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        const backendCart = action.payload;
        // If backendCart is an object with items, map them to include product info
        if (backendCart && backendCart.items && Array.isArray(backendCart.items)) {
          state.items = backendCart.items.map(item => {
            // If productId is populated, extract info
            const product = item.productId;
            return {
              productId: product._id || item.productId,
              title: product.title || '',
              price: product.price || 0,
              pictureUrl: (product.picture && product.picture.secure_url) || '',
              quantity: item.quantity,
            };
          });
          // Persist mapped cart to localStorage for current user
          const userData = window.localStorage.getItem("user");
          if (userData) {
            try {
              // Always use flat user object
              const user = userData.user ? userData.user : JSON.parse(userData);
              const userId = user._id;
              if (userId) {
                saveStateIntoLocalStorage(state, userId);
              }
            } catch (error) {
              console.error("Error saving backend cart to localStorage:", error);
            }
          }
        } else {
          state.items = [];
        }
      })
      .addCase(addToCartBackend.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];
      })
      .addCase(removeFromCartBackend.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];
      })
      .addCase(clearCartBackend.fulfilled, (state) => {
        state.items = [];
      });
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
  debugCart,
  updateCartPrices
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.items.length; // Number of unique items
export const selectCartTotalQuantity = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0); // Total quantity
export const selectCartTotal = (state) => state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

export default cartSlice.reducer;
