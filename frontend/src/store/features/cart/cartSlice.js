import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCart, addToCartAPI, removeFromCartAPI, clearCartAPI } from "./cartService";

const loadStateFromLocalStorage = (userId) => {
  try {
    const cartKey = userId ? `cart_${userId}` : "cart_guest";
    const cartData = window.localStorage.getItem(cartKey) || JSON.stringify({ items: [] });
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
    const cartData = JSON.stringify({ items: state.items });
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
    let userId = null;
    if (userData) {
      const user = JSON.parse(userData);
      userId = user._id;
    }
    // Always try to load from localStorage first
    const cartState = loadStateFromLocalStorage(userId) || { items: [] };
    // If localStorage is empty, fallback to empty cart
    return { ...cartState, loading: false };
  } catch (error) {
    console.error("Error getting initial cart state:", error);
    return { items: [], loading: false };
  }
};

const initialState = {
  ...getInitialCartState(),
  hydrationComplete: false,
  pendingMutation: false,
  lastConfirmedCart: getInitialCartState().items,
};

// Thunks for backend cart actions
export const fetchUserCart = createAsyncThunk("cart/fetchUserCart", async (_, { rejectWithValue }) => {
  try {
    // Fetch backend cart
    const backendCart = await fetchCart();
    // Also update localStorage for logged-in user
    const userData = window.localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const userId = user._id;
      if (userId && backendCart && backendCart.items) {
        saveStateIntoLocalStorage({ items: backendCart.items }, userId);
      }
    }
    // Also update Redux state immediately
    return { ...backendCart };
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
  async ({ item, userId }, { dispatch, getState }) => {
    // Block if mutation is pending
    if (getState().cart.pendingMutation) return;
    dispatch(setPendingMutation(true));
    dispatch(addToCart({ item, userId }));
    try {
      const serverCart = await addToCartAPI(item.productId, item.quantity);
      dispatch(replaceCartWithServer({ serverCart, userId }));
      dispatch(setPendingMutation(false));
      return serverCart;
    } catch (error) {
      dispatch(rollbackCart());
      dispatch(setPendingMutation(false));
      return null;
    }
  }
);

export const removeFromCartWithBackendSync = createAsyncThunk(
  "cart/removeFromCartWithBackendSync", 
  async ({ itemId, userId }, { dispatch, getState }) => {
    if (getState().cart.pendingMutation) return;
    dispatch(setPendingMutation(true));
    dispatch(removeFromCart({ itemId, userId }));
    try {
      const serverCart = await removeFromCartAPI(itemId);
      dispatch(replaceCartWithServer({ serverCart, userId }));
      dispatch(setPendingMutation(false));
      return serverCart;
    } catch (error) {
      dispatch(rollbackCart());
      dispatch(setPendingMutation(false));
      return null;
    }
  }
);

export const updateQuantityWithBackendSync = createAsyncThunk(
  "cart/updateQuantityWithBackendSync", 
  async ({ productId, quantity, userId }, { dispatch, getState }) => {
    if (getState().cart.pendingMutation) return;
    dispatch(setPendingMutation(true));
    dispatch(updateQuantity({ productId, quantity, userId }));
    try {
      const serverCart = await addToCartAPI(productId, quantity);
      dispatch(replaceCartWithServer({ serverCart, userId }));
      dispatch(setPendingMutation(false));
      return serverCart;
    } catch (error) {
      dispatch(rollbackCart());
      dispatch(setPendingMutation(false));
      return null;
    }
  }
);

export const clearCartWithBackendSync = createAsyncThunk(
  "cart/clearCartWithBackendSync", 
  async ({ userId }, { dispatch, getState }) => {
    if (getState().cart.pendingMutation) return;
    dispatch(setPendingMutation(true));
    dispatch(clearCart({ userId }));
    try {
      const serverCart = await clearCartAPI();
      dispatch(replaceCartWithServer({ serverCart, userId }));
      dispatch(setPendingMutation(false));
      return serverCart;
    } catch (error) {
      dispatch(rollbackCart());
      dispatch(setPendingMutation(false));
      return null;
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setPendingMutation: (state, action) => {
      state.pendingMutation = action.payload;
    },
    replaceCartWithServer: (state, action) => {
      const { serverCart, userId } = action.payload;
      const items = serverCart.items || [];
      saveStateIntoLocalStorage({ items }, userId);
      state.items = items;
      state.lastConfirmedCart = items;
    },
    rollbackCart: (state) => {
      state.items = state.lastConfirmedCart || [];
    },
    addToCart: (state, action) => {
      const { item, userId } = action.payload;
      const existingItem = state.items.find((i) => i.productId === item.productId);
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
      const existingItem = state.items.find((item) => item.productId === productId);
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
      // Always load from localStorage for display
      const localCart = loadStateFromLocalStorage(userId);
      state.items = localCart.items || [];
      state.lastConfirmedCart = localCart.items || [];
    },
    initializeCart: (state, action) => {
      const { userId } = action.payload;
      if (!userId) {
        // Guest: load from localStorage
        const guestCart = loadStateFromLocalStorage();
        state.items = guestCart.items || [];
        state.lastConfirmedCart = guestCart.items || [];
        return;
      }
      // On login, migrate guest cart to backend if present
      const guestCart = loadStateFromLocalStorage();
      if (guestCart && guestCart.items && guestCart.items.length > 0) {
        guestCart.items.forEach(async (item) => {
          try {
            await addToCartAPI(item.productId, item.quantity);
          } catch (e) {}
        });
        window.localStorage.removeItem('cart_guest');
      }
      // After migration, fetch backend cart, then update localStorage and Redux
      // This should be handled by fetchUserCart thunk
    },
    debugCart: (state, action) => {
      const { userId } = action.payload;
      
      if (userId) {
        const cartKey = `cart_${userId}`;
        const localStorageData = window.localStorage.getItem(cartKey);
        
        if (localStorageData) {
          try {
            JSON.parse(localStorageData);
          } catch (_) {}
        }
      }
      
      // Check all cart-related keys in localStorage
      const allKeys = Object.keys(window.localStorage);
      const cartKeys = allKeys.filter(key => key.startsWith('cart_'));
      
      // cartKeys.forEach(key => {});
      
      // Check user data in localStorage
      const userData = window.localStorage.getItem("user");
      if (userData) {
        try {
          JSON.parse(userData);
        } catch (_) {}
      }
      
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
        // When backend cart is fetched, update localStorage and Redux
        const userData = window.localStorage.getItem("user");
        let userId = null;
        if (userData) {
          const user = JSON.parse(userData);
          userId = user._id;
        }
        if (action.payload && Array.isArray(action.payload.items)) {
          // Map backend items to frontend format
          const mappedItems = action.payload.items.map(item => {
            const product = item.productId;
            return {
              productId: product._id || item.productId,
              title: product.title || '',
              price: product.price || 0,
              pictureUrl: (product.picture && product.picture.secure_url) || '',
              quantity: item.quantity,
            };
          });
          // Update localStorage
          saveStateIntoLocalStorage({ items: mappedItems }, userId);
          // Update Redux state
          state.items = mappedItems;
          state.lastConfirmedCart = mappedItems;
          state.hydrationComplete = true;
        } else {
          state.items = [];
          state.lastConfirmedCart = [];
          saveStateIntoLocalStorage({ items: [] }, userId);
          state.hydrationComplete = true;
        }
      })
      .addCase(addToCartBackend.fulfilled, (state, action) => {
        // Sync backend response to localStorage and Redux
        const userData = window.localStorage.getItem("user");
        let userId = null;
        if (userData) {
          const user = JSON.parse(userData);
          userId = user._id;
        }
        const items = action.payload?.items || [];
        saveStateIntoLocalStorage({ items }, userId);
        state.items = items;
      })
      .addCase(removeFromCartBackend.fulfilled, (state, action) => {
        const userData = window.localStorage.getItem("user");
        let userId = null;
        if (userData) {
          const user = JSON.parse(userData);
          userId = user._id;
        }
        const items = action.payload?.items || [];
        saveStateIntoLocalStorage({ items }, userId);
        state.items = items;
      })
      .addCase(clearCartBackend.fulfilled, (state) => {
        const userData = window.localStorage.getItem("user");
        let userId = null;
        if (userData) {
          const user = JSON.parse(userData);
          userId = user._id;
        }
        saveStateIntoLocalStorage({ items: [] }, userId);
        state.items = [];
      });
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  loadUserCart, 
  clearUserCart,
  initializeCart,
  debugCart,
  updateCartPrices,
  setPendingMutation,
  replaceCartWithServer,
  rollbackCart
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.items.length; // Number of unique items
export const selectCartTotalQuantity = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0); // Total quantity
// Defensive: ensure price and quantity are numbers
export const selectCartTotal = (state) => state.cart.items.reduce((total, item) => {
  const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
  const quantity = typeof item.quantity === 'number' ? item.quantity : Number(item.quantity) || 0;
  return total + (price * quantity);
}, 0);

export default cartSlice.reducer;
