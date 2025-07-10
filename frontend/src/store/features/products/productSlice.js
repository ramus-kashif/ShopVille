import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "./productService.js";

export const addProduct = createAsyncThunk(
  "products/AddProduct",
  async (inputValues, thunkAPI) => {
    try {
      const response = await productService.createProduct(inputValues);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async (thunkAPI) => {
    try {
      const response = await productService.getAllProducts();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, thunkAPI) => {
    try {
      const response = await productService.deleteProduct(productId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getSingleProduct = createAsyncThunk(
  "products/getSingleProduct",
  async (productId, thunkAPI) => {
    try {
      const response = await productService.getProductById(productId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateSingleProduct = createAsyncThunk(
  "products/updateSingleProduct",
  async ({ inputValues, productId }, thunkAPI) => {
    try {
      const response = await productService.updateProduct(productId, inputValues);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async ({ search = "", page = 1, limit = 8, category = "", imageSearchResults = null }, thunkAPI) => {
    try {
      // If imageSearchResults is provided, return it directly
      if (imageSearchResults) {
        return {
          products: imageSearchResults,
          total: imageSearchResults.length,
          page: 1,
          limit: imageSearchResults.length,
          isImageSearch: true
        };
      }
      
      const response = await productService.searchProducts({ search, page, limit, category });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  products: [],
  status: "idle",
  error: null,
};

// use this in store file, authReducer
export const productsSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.status = "success";
        state.products = action.payload;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.status = "success";
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "success";
        state.products = action.payload;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getSingleProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.status = "success";
        state.products = action.payload;
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateSingleProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateSingleProduct.fulfilled, (state, action) => {
        state.status = "success";
        state.products = action.payload;
      })
      .addCase(updateSingleProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(searchProducts.pending, (state) => {
        state.status = "loading";
        // Do not reset products here!
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Only update products, keep other state
        state.products = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export default productsSlice.reducer;
