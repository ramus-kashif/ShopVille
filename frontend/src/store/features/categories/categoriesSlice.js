import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoriesService from "./categoriesService.js";
// use this function in Categories
export const AddCategory = createAsyncThunk(
  "categories/AddCategory",
  async (inputValues, thunkAPI) => {
    try {
      const response = await categoriesService.createCat(inputValues);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// use this function in Categories
export const getAllCategories = createAsyncThunk(
  "categories/getAllCategories",
  async ( thunkAPI) => {
    try {
      const response = await categoriesService.getAllCat();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// use this function in updateCategory
export const GetSingleCategory = createAsyncThunk(
  "categories/GetSingleCategory",
  async ( slug,thunkAPI) => {
    try {
      const response = await categoriesService.getSingleCat(slug);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
//use this function in updateCategory
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({name,slug }, thunkAPI) => {
    try {
      const response = await categoriesService.updateCat({name, slug});
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// Delete category
export const DeleteCategory = createAsyncThunk(
  "categories/DeleteCategory",
  async (slug, thunkAPI) => {
    try {
      const response = await categoriesService.deleteCat(slug);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
const initialState = {
  categories: [],
  status: "idle",
  error: null,
};
// use this in store file, authReducer
export const categorieSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AddCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(AddCategory.fulfilled, (state, action) => {
        state.status = "success";
        state.categories = action.payload;
      })
      .addCase(AddCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.status = "success";
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(GetSingleCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(GetSingleCategory.fulfilled, (state, action) => {
        state.status = "success";
        state.categories = action.payload;
      })
      .addCase(GetSingleCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "success";
        state.categories = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(DeleteCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(DeleteCategory.fulfilled, (state, action) => {
        state.status = "success";
        state.categories = action.payload;
      })
      .addCase(DeleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
// export const { incrementByAmount } = categorieSlice.actions;

export default categorieSlice.reducer;
