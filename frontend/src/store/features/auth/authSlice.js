import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService.js";
import { loadUserCart, fetchUserCart } from "../cart/cartSlice.js";
// use this function in registerPage
export const register = createAsyncThunk(
  "auth/register",
  async (inputValues, thunkAPI) => {
    try {
      const response = await authService.register(inputValues);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// use this function in loginpage
export const login = createAsyncThunk(
  "auth/login",
  async (inputValues, thunkAPI) => {
    try {
      const response = await authService.login(inputValues);
      console.log("Login response:", response);
      window.localStorage.setItem("user", JSON.stringify(response));
      
      // Load user's cart after successful login
      if (response.user?._id) {
        console.log("Login: Loading cart for user:", response.user._id);
        thunkAPI.dispatch(loadUserCart({ userId: response.user._id }));
        
        // Also fetch backend cart to sync with Redux state
        try {
          console.log("Login: Fetching backend cart for user:", response.user._id);
          thunkAPI.dispatch(fetchUserCart());
        } catch (error) {
          console.error("Login: Failed to fetch backend cart:", error);
        }
      }
      
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// use this function in logout - DashboardLayout
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await authService.logout();
    console.log("Logout: Clearing user data but preserving cart");
    window.localStorage.removeItem("user"); // Remove user from localStorage on logout
    window.localStorage.removeItem("token"); // Remove token from localStorage on logout
    
    // Don't clear user's cart from localStorage - it will be restored on next login
    // Just clear the Redux state by setting user to null
    
    return response;
  } catch (error) {
    // Even if the API call fails, clear local storage
    console.log("Logout error, still clearing user data");
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("token");
    return thunkAPI.rejectWithValue(error);
  }
});
const getUserDataFromLocalStorage = window.localStorage.getItem("user")
  ? JSON.parse(window.localStorage.getItem("user"))
  : null;
const initialState = {
  user: getUserDataFromLocalStorage,
  status: "idle",
  error: null,
};
// use this in store file, authReducer
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    setUserFromPhoneRegistration: (state, action) => {
      state.user = action.payload;
      state.status = "success";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "success";
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const { incrementByAmount, setUserFromPhoneRegistration } = authSlice.actions;

export default authSlice.reducer;
