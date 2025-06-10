import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService.js";
// use this function in registerPage
export const register = createAsyncThunk(
  "auth/register",
  async (inputValues, thunkAPI) => {
    try {
      const response = await authService.registerUser(inputValues);
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
      const response = await authService.loginUser(inputValues);
      window.localStorage.setItem("user", JSON.stringify(response));
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// use this function in logout - DashboardLayout
export const logout = createAsyncThunk("auth/logout", async (thunkAPI) => {
  try {
    const response = await authService.logoutUser();
    window.localStorage.setItem("user", JSON.stringify(response));
    return response;
  } catch (error) {
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
export const { incrementByAmount } = authSlice.actions;

export default authSlice.reducer;
