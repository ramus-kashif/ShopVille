import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, thunkAPI) => {
  try {
    const res = await axios.get('http://localhost:8080/api/v1/users/wishlist', { withCredentials: true });
    return res.data.wishlist;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (productId, thunkAPI) => {
  try {
    const res = await axios.post('http://localhost:8080/api/v1/users/wishlist/add', { productId }, { withCredentials: true });
    return res.data.wishlist;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (productId, thunkAPI) => {
  try {
    const res = await axios.post('http://localhost:8080/api/v1/users/wishlist/remove', { productId }, { withCredentials: true });
    return res.data.wishlist;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlist: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      });
  },
});

export default wishlistSlice.reducer; 